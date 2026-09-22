import { fingerprint } from './canonical.mjs';

export class MutationConflictError extends Error {
  constructor() {
    super('mutation_id_reused_with_different_payload');
    this.name = 'MutationConflictError';
  }
}

export class MemoryMutationStore {
  #records = new Map();

  reserve({ mutationId, principalId, action, input }) {
    if (!mutationId) throw new Error('mutation_id_required');
    const payloadHash = fingerprint({ principalId, action, input });
    const existing = this.#records.get(mutationId);

    if (existing) {
      if (existing.payloadHash !== payloadHash) throw new MutationConflictError();
      return existing.status === 'committed'
        ? { state: 'replay', result: existing.result }
        : { state: 'reserved' };
    }

    this.#records.set(mutationId, { payloadHash, status: 'reserved' });
    return { state: 'new' };
  }

  commit(mutationId, result) {
    const record = this.#records.get(mutationId);
    if (!record) throw new Error('mutation_not_reserved');
    record.status = 'committed';
    record.result = structuredClone(result);
  }
}
