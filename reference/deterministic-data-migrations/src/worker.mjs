import { digestRecords, indexById } from './canonical.mjs';

export function createCheckpoint(authorization) {
  return Object.freeze({
    authorizationDigest: authorization.authorizationDigest,
    nextAction: 0,
    rollingDigest: authorization.baseDigest,
    appliedActionIds: Object.freeze([]),
    done: authorization.actions.length === 0,
  });
}

export function applyChunk({ authorization, liveRecords, checkpoint, chunkSize = 100 }) {
  if (checkpoint.authorizationDigest !== authorization.authorizationDigest) {
    throw new Error('checkpoint_authorization_mismatch');
  }
  if (!Number.isInteger(chunkSize) || chunkSize < 1) throw new Error('invalid_chunk_size');

  const currentDigest = digestRecords(liveRecords);
  if (currentDigest !== checkpoint.rollingDigest) throw new Error('stale_live_state');

  const live = indexById(liveRecords);
  const end = Math.min(checkpoint.nextAction + chunkSize, authorization.actions.length);
  const applied = [...checkpoint.appliedActionIds];

  for (let i = checkpoint.nextAction; i < end; i += 1) {
    const action = authorization.actions[i];
    if (action.type !== 'UPSERT') throw new Error('unsupported_action');
    live.set(action.id, structuredClone(action.record));
    applied.push(`${i}:${action.id}`);
  }

  const nextRecords = [...live.values()].sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const nextDigest = digestRecords(nextRecords);
  const nextCheckpoint = Object.freeze({
    authorizationDigest: authorization.authorizationDigest,
    nextAction: end,
    rollingDigest: nextDigest,
    appliedActionIds: Object.freeze(applied),
    done: end >= authorization.actions.length,
  });

  return Object.freeze({ records: Object.freeze(nextRecords.map(Object.freeze)), checkpoint: nextCheckpoint });
}
