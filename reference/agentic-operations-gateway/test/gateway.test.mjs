import test from 'node:test';
import assert from 'node:assert/strict';
import { credentialHash, authenticateApiKey, delegatePrincipal } from '../src/auth.mjs';
import { AgenticOperationsGateway } from '../src/gateway.mjs';
import { MutationConflictError } from '../src/idempotency.mjs';
import { createWorkItem, claimWorkItem, heartbeat, failWorkItem, updateWithVersion } from '../src/work-items.mjs';

function principal(scopes = ['cases:read', 'cases:write', 'changes:publish', 'ledger:delete']) {
  return Object.freeze({
    principalId: 'agent-1', organizationId: 'org-1', credentialId: 'cred-1', scopes, authMethod: 'api_key',
  });
}

test('API key authentication stores and resolves only by credential hash', () => {
  const store = new Map();
  const raw = 'never-store-this-raw-key';
  store.set(credentialHash(raw), {
    principalId: 'agent-1', organizationId: 'org-1', credentialId: 'cred-1', scopes: ['cases:read'],
  });
  const authenticated = authenticateApiKey(raw, store, 100);
  assert.equal(authenticated.principalId, 'agent-1');
  assert.equal([...store.keys()][0].includes(raw), false);
});

test('delegated principal cannot escalate beyond base scopes', () => {
  assert.throws(() => delegatePrincipal(principal(['cases:read']), {
    grantId: 'g1', baseCredentialId: 'cred-1', organizationId: 'org-1', scopes: ['cases:write'], expiresAt: 1000,
  }, 100), /scope_escalation_denied/);
});

test('hard-stop action remains blocked even when principal has the matching scope', async () => {
  let called = false;
  const gateway = new AgenticOperationsGateway({ handlers: { delete_ledger_record: async () => { called = true; } } });
  const result = await gateway.execute({
    principal: principal(), action: 'delete_ledger_record', input: { id: 'x' }, correlationId: 'c1',
  });
  assert.equal(result.outcome, 'blocked');
  assert.equal(called, false);
});

test('soft-flag action is routed to a human queue without executing a handler', async () => {
  let called = false;
  const gateway = new AgenticOperationsGateway({ handlers: { publish_material_change: async () => { called = true; } } });
  const result = await gateway.execute({
    principal: principal(), action: 'publish_material_change', input: { reason: 'material' }, correlationId: 'c2',
  });
  assert.equal(result.outcome, 'queued_for_human_review');
  assert.equal(gateway.humanQueue.length, 1);
  assert.equal(called, false);
});

test('same mutation id and payload replays; different payload conflicts', async () => {
  let calls = 0;
  const gateway = new AgenticOperationsGateway({ handlers: { update_case: async (input) => ({ ...input, call: ++calls }) } });
  const first = await gateway.execute({
    principal: principal(), action: 'update_case', input: { id: 'A', status: 'ready' }, mutationId: 'm1', correlationId: 'c3',
  });
  const replay = await gateway.execute({
    principal: principal(), action: 'update_case', input: { id: 'A', status: 'ready' }, mutationId: 'm1', correlationId: 'c4',
  });
  assert.equal(first.result.call, 1);
  assert.equal(replay.result.call, 1);
  assert.equal(replay.outcome, 'replay');
  assert.equal(calls, 1);

  await assert.rejects(() => gateway.execute({
    principal: principal(), action: 'update_case', input: { id: 'A', status: 'different' }, mutationId: 'm1', correlationId: 'c5',
  }), MutationConflictError);
});

test('claim/lease heartbeat prevents concurrent takeover until expiration', () => {
  const item = createWorkItem({ id: 'w1' });
  const claimed = claimWorkItem(item, { owner: 'worker-a', leaseMs: 100, now: 1000 });
  assert.throws(() => claimWorkItem(claimed, { owner: 'worker-b', leaseMs: 100, now: 1050 }), /lease_held/);
  const extended = heartbeat(claimed, { owner: 'worker-a', token: claimed.claim.token, leaseMs: 200, now: 1050 });
  assert.equal(extended.claim.expiresAt, 1250);
  const takeover = claimWorkItem(extended, { owner: 'worker-b', leaseMs: 100, now: 1251 });
  assert.equal(takeover.claim.owner, 'worker-b');
});

test('retry budget is finite and optimistic concurrency rejects stale versions', () => {
  let item = createWorkItem({ id: 'w2', retryBudget: 1 });
  item = claimWorkItem(item, { owner: 'worker', now: 1000 });
  item = failWorkItem(item, { owner: 'worker', token: item.claim.token, error: 'first', now: 1001 });
  assert.equal(item.status, 'queued');
  item = claimWorkItem(item, { owner: 'worker', now: 2000 });
  item = failWorkItem(item, { owner: 'worker', token: item.claim.token, error: 'second', now: 2001 });
  assert.equal(item.status, 'terminal_exception');
  assert.throws(() => updateWithVersion(item, 0, { note: 'stale' }), /optimistic_concurrency_conflict/);
});
