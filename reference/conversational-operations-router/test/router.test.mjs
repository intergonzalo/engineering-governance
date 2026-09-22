import test from 'node:test';
import assert from 'node:assert/strict';
import { routeTurn } from '../src/router.mjs';
import { ActionExecutor } from '../src/executor.mjs';

const baseSession = { actorId: 'u1', workspaceId: 'w1', currentOrderId: 'O1', pending: null };
const data = {
  items: [
    { id: 'A', label: 'air filter', detail: '$20' },
    { id: 'B', label: 'air filter premium', detail: '$35' },
    { id: 'C', label: 'oil', detail: '$10' },
  ],
};

test('current conversational context resolves this order deterministically', () => {
  const result = routeTurn({ session: baseSession, text: 'show this order', data, now: 1000, correlationId: 'c1' });
  assert.equal(result.status, 'execute');
  assert.deepEqual(result.envelope.args, { orderId: 'O1' });
});

test('ambiguous destructive request returns indexed candidates instead of guessing', () => {
  const result = routeTurn({ session: baseSession, text: 'delete air filter', data, now: 1000, correlationId: 'c2' });
  assert.equal(result.status, 'clarify');
  assert.equal(result.candidates.length, 2);
  assert.equal(result.session.pending.kind, 'choose_candidate');
});

test('candidate index inherits the pending destructive intent and asks for confirmation', () => {
  const first = routeTurn({ session: baseSession, text: 'delete air filter', data, now: 1000, correlationId: 'c3' });
  const second = routeTurn({ session: first.session, text: '2', data, now: 1100, correlationId: 'c4' });
  assert.equal(second.status, 'confirm');
  assert.equal(second.session.pending.action, 'delete_item');
  assert.equal(second.session.pending.args.itemId, 'B');
});

test('natural yes confirms the exact pending action without restating machine syntax', () => {
  const first = routeTurn({ session: baseSession, text: 'delete oil', data, now: 1000, correlationId: 'c5' });
  const second = routeTurn({ session: first.session, text: 'yes', data, now: 1100, correlationId: 'c6' });
  assert.equal(second.status, 'execute');
  assert.equal(second.envelope.action, 'delete_item');
  assert.equal(second.envelope.args.itemId, 'C');
});

test('yes without a live pending action does not invent an operation', () => {
  const result = routeTurn({ session: baseSession, text: 'yes', data, now: 1000, correlationId: 'c7' });
  assert.equal(result.status, 'no_action');
  assert.equal(result.envelope, undefined);
});

test('expired pending state cannot be confirmed', () => {
  const session = {
    ...baseSession,
    pending: {
      kind: 'confirm_action',
      action: 'delete_item',
      args: { orderId: 'O1', itemId: 'C' },
      expiresAt: 999,
    },
  };
  const result = routeTurn({ session, text: 'yes', data, now: 1000, correlationId: 'c8' });
  assert.equal(result.status, 'no_action');
});

test('executor accepts only configured domain actions and preserves actor/workspace audit context', async () => {
  const executor = new ActionExecutor({
    read_order: async (args, ctx) => ({ args, ctx }),
  });
  const turn = routeTurn({ session: baseSession, text: 'show this order', data, now: 1000, correlationId: 'c9' });
  const executed = await executor.execute(turn.envelope);
  assert.equal(executed.audit.actorId, 'u1');
  assert.equal(executed.audit.workspaceId, 'w1');
  await assert.rejects(() => executor.execute({ ...turn.envelope, action: 'raw_sql' }), /action_not_allowlisted/);
});
