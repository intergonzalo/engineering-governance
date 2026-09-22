import { evaluatePolicy } from './policy.mjs';
import { MemoryMutationStore } from './idempotency.mjs';

export class AgenticOperationsGateway {
  constructor({ handlers = {}, mutationStore = new MemoryMutationStore(), clock = () => Date.now() } = {}) {
    this.handlers = handlers;
    this.mutationStore = mutationStore;
    this.clock = clock;
    this.humanQueue = [];
    this.audit = [];
  }

  async execute({ principal, action, input = {}, mutationId = null, correlationId }) {
    if (!principal) throw new Error('principal_required');
    if (!correlationId) throw new Error('correlation_id_required');

    const policy = evaluatePolicy({ action, principal, input });
    if (policy.decision === 'hard_stop') {
      return this.#record({ correlationId, principal, action, policy, outcome: 'blocked' });
    }

    if (policy.decision === 'soft_flag') {
      const queued = Object.freeze({
        queueId: `review:${correlationId}`,
        action,
        organizationId: principal.organizationId,
        principalId: principal.principalId,
        correlationId,
        input: structuredClone(input),
      });
      this.humanQueue.push(queued);
      return this.#record({ correlationId, principal, action, policy, outcome: 'queued_for_human_review', result: queued });
    }

    const handler = this.handlers[action];
    if (!handler) throw new Error('handler_not_configured');

    if (mutationId) {
      const reservation = this.mutationStore.reserve({
        mutationId,
        principalId: principal.principalId,
        action,
        input,
      });
      if (reservation.state === 'replay') {
        return this.#record({ correlationId, principal, action, policy, outcome: 'replay', result: reservation.result });
      }
    }

    const result = await handler(structuredClone(input), Object.freeze({
      principal,
      correlationId,
    }));

    if (mutationId) this.mutationStore.commit(mutationId, result);
    return this.#record({ correlationId, principal, action, policy, outcome: 'executed', result });
  }

  #record({ correlationId, principal, action, policy, outcome, result = null }) {
    const event = Object.freeze({
      at: this.clock(),
      correlationId,
      principalId: principal.principalId,
      organizationId: principal.organizationId,
      action,
      policyDecision: policy.decision,
      outcome,
    });
    this.audit.push(event);
    return Object.freeze({ policy, outcome, result, audit: event });
  }
}
