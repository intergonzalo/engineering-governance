import { hash } from './canonical.mjs';

const VALID_DECISIONS = new Set(['APPLY_SOURCE', 'KEEP_LIVE']);

export function authorizePlan(plan, conflictDecisions = new Map()) {
  const decisions = {};
  for (const item of plan.items) {
    if (item.classification !== 'CONFLICT') continue;
    const decision = conflictDecisions.get(item.id);
    if (!VALID_DECISIONS.has(decision)) throw new Error(`unresolved_conflict:${item.id}`);
    decisions[item.id] = decision;
  }

  const actions = [];
  for (const item of plan.items) {
    if (item.classification === 'CREATE') {
      actions.push({ type: 'UPSERT', id: item.id, record: item.incoming, reason: 'create' });
    } else if (item.classification === 'CONFLICT' && decisions[item.id] === 'APPLY_SOURCE') {
      actions.push({ type: 'UPSERT', id: item.id, record: item.incoming, reason: 'conflict_apply_source' });
    }
  }

  const authorizationDigest = hash({
    planId: plan.planId,
    baseDigest: plan.baseDigest,
    decisions,
    actions,
  });

  return Object.freeze({
    planId: plan.planId,
    baseDigest: plan.baseDigest,
    decisions: Object.freeze(decisions),
    actions: Object.freeze(actions.map(Object.freeze)),
    authorizationDigest,
  });
}
