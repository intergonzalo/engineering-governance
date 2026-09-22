export class ActionExecutor {
  constructor(handlers = {}) {
    this.handlers = handlers;
    this.audit = [];
  }

  async execute(actionEnvelope) {
    const { action, actorId, workspaceId, correlationId } = actionEnvelope ?? {};
    if (!action || !actorId || !workspaceId || !correlationId) throw new Error('invalid_action_envelope');
    const handler = this.handlers[action];
    if (!handler) throw new Error('action_not_allowlisted');

    const result = await handler(
      structuredClone(actionEnvelope.args),
      Object.freeze({ actorId, workspaceId, correlationId }),
    );
    const event = Object.freeze({ action, actorId, workspaceId, correlationId, outcome: 'executed' });
    this.audit.push(event);
    return Object.freeze({ result, audit: event });
  }
}
