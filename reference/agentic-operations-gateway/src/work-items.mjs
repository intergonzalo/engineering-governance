import { fingerprint } from './canonical.mjs';

export function createWorkItem({ id, version = 1, retryBudget = 2, payload = {} }) {
  return {
    id,
    version,
    retryBudget,
    attempts: 0,
    status: 'queued',
    payload: structuredClone(payload),
    claim: null,
  };
}

export function claimWorkItem(item, { owner, leaseMs = 30_000, now = Date.now() }) {
  const current = structuredClone(item);
  if (current.status === 'done' || current.status === 'terminal_exception') throw new Error('terminal_item');
  if (current.claim && current.claim.expiresAt > now && current.claim.owner !== owner) {
    throw new Error('lease_held');
  }
  current.status = 'claimed';
  current.claim = {
    owner,
    expiresAt: now + leaseMs,
    token: fingerprint({ id: current.id, owner, version: current.version, now }),
  };
  return current;
}

export function heartbeat(item, { owner, token, leaseMs = 30_000, now = Date.now() }) {
  const current = structuredClone(item);
  assertLease(current, owner, token, now);
  current.claim.expiresAt = now + leaseMs;
  return current;
}

export function updateWithVersion(item, expectedVersion, patch) {
  if (item.version !== expectedVersion) throw new Error('optimistic_concurrency_conflict');
  return { ...structuredClone(item), ...structuredClone(patch), version: item.version + 1 };
}

export function completeWorkItem(item, { owner, token, result, now = Date.now() }) {
  const current = structuredClone(item);
  assertLease(current, owner, token, now);
  current.status = 'done';
  current.result = structuredClone(result);
  current.claim = null;
  return current;
}

export function failWorkItem(item, { owner, token, error, now = Date.now() }) {
  const current = structuredClone(item);
  assertLease(current, owner, token, now);
  current.attempts += 1;
  current.lastError = String(error);
  current.claim = null;
  current.status = current.attempts > current.retryBudget ? 'terminal_exception' : 'queued';
  return current;
}

function assertLease(item, owner, token, now) {
  if (!item.claim || item.claim.owner !== owner || item.claim.token !== token) throw new Error('invalid_lease');
  if (item.claim.expiresAt <= now) throw new Error('lease_expired');
}
