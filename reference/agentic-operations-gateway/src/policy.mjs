const DEFAULT_ACTIONS = Object.freeze({
  read_case: { requiredScope: 'cases:read', decision: 'allow' },
  update_case: { requiredScope: 'cases:write', decision: 'allow' },
  publish_material_change: { requiredScope: 'changes:publish', decision: 'soft_flag' },
  delete_ledger_record: { requiredScope: 'ledger:delete', decision: 'hard_stop' },
});

export function evaluatePolicy({ action, principal, input = {}, actions = DEFAULT_ACTIONS }) {
  const rule = actions[action];
  if (!rule) return Object.freeze({ decision: 'hard_stop', reason: 'unknown_action' });

  if (!principal.scopes.includes(rule.requiredScope)) {
    return Object.freeze({ decision: 'hard_stop', reason: 'missing_scope' });
  }

  if (rule.decision === 'hard_stop') {
    return Object.freeze({ decision: 'hard_stop', reason: 'policy_prohibited' });
  }

  if (rule.decision === 'soft_flag') {
    return Object.freeze({
      decision: 'soft_flag',
      reason: input.reason ? 'material_change_requires_human_review' : 'missing_change_reason',
      queue: 'human_review',
    });
  }

  return Object.freeze({ decision: 'allow', reason: 'policy_allows' });
}

export { DEFAULT_ACTIONS };
