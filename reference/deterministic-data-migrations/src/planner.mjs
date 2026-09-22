import { digestRecords, hash, indexById } from './canonical.mjs';

export function buildPlan({ sourceRecords, liveRecords }) {
  const source = indexById(sourceRecords);
  const live = indexById(liveRecords);
  const ids = [...new Set([...source.keys(), ...live.keys()])].sort();

  const items = ids.map((id) => {
    const incoming = source.get(id) ?? null;
    const current = live.get(id) ?? null;

    if (incoming && !current) return { id, classification: 'CREATE', incoming, current: null };
    if (!incoming && current) return { id, classification: 'PRESERVE', incoming: null, current };
    if (hash(incoming) === hash(current)) return { id, classification: 'NOOP', incoming, current };
    return { id, classification: 'CONFLICT', incoming, current };
  });

  const baseDigest = digestRecords(liveRecords);
  const sourceDigest = digestRecords(sourceRecords);
  const planId = hash({ baseDigest, sourceDigest, items });

  return Object.freeze({
    planId,
    baseDigest,
    sourceDigest,
    items: Object.freeze(items.map(Object.freeze)),
  });
}

export function summarizePlan(plan) {
  return plan.items.reduce((summary, item) => {
    summary[item.classification] += 1;
    return summary;
  }, { CREATE: 0, NOOP: 0, CONFLICT: 0, PRESERVE: 0 });
}
