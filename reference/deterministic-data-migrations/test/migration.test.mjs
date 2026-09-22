import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPlan, summarizePlan } from '../src/planner.mjs';
import { authorizePlan } from '../src/authorization.mjs';
import { createCheckpoint, applyChunk } from '../src/worker.mjs';

function fixture() {
  return {
    live: [
      { id: 'A', value: 1 },
      { id: 'B', value: 'live' },
      { id: 'LIVE-ONLY', value: 99 },
    ],
    source: [
      { id: 'A', value: 1 },
      { id: 'B', value: 'source' },
      { id: 'C', value: 3 },
    ],
  };
}

test('planner classifies CREATE / NOOP / CONFLICT / PRESERVE deterministically', () => {
  const { live, source } = fixture();
  const first = buildPlan({ sourceRecords: source, liveRecords: live });
  const second = buildPlan({ sourceRecords: [...source].reverse(), liveRecords: [...live].reverse() });
  assert.deepEqual(summarizePlan(first), { CREATE: 1, NOOP: 1, CONFLICT: 1, PRESERVE: 1 });
  assert.equal(first.planId, second.planId);
});

test('authorization fails closed until every conflict has an explicit decision', () => {
  const { live, source } = fixture();
  const plan = buildPlan({ sourceRecords: source, liveRecords: live });
  assert.throws(() => authorizePlan(plan, new Map()), /unresolved_conflict:B/);
});

test('KEEP_LIVE preserves conflicting live data and live-only records', () => {
  const { live, source } = fixture();
  const plan = buildPlan({ sourceRecords: source, liveRecords: live });
  const auth = authorizePlan(plan, new Map([['B', 'KEEP_LIVE']]));
  let state = { records: live, checkpoint: createCheckpoint(auth) };
  state = applyChunk({ authorization: auth, liveRecords: state.records, checkpoint: state.checkpoint, chunkSize: 10 });
  const byId = new Map(state.records.map((r) => [r.id, r]));
  assert.equal(byId.get('B').value, 'live');
  assert.equal(byId.get('LIVE-ONLY').value, 99);
  assert.equal(byId.get('C').value, 3);
});

test('authorization digest changes when conflict decision changes', () => {
  const { live, source } = fixture();
  const plan = buildPlan({ sourceRecords: source, liveRecords: live });
  const keep = authorizePlan(plan, new Map([['B', 'KEEP_LIVE']]));
  const apply = authorizePlan(plan, new Map([['B', 'APPLY_SOURCE']]));
  assert.notEqual(keep.authorizationDigest, apply.authorizationDigest);
});

test('worker rejects stale live state before applying authorized actions', () => {
  const { live, source } = fixture();
  const plan = buildPlan({ sourceRecords: source, liveRecords: live });
  const auth = authorizePlan(plan, new Map([['B', 'APPLY_SOURCE']]));
  const checkpoint = createCheckpoint(auth);
  const mutatedLive = live.map((r) => r.id === 'A' ? { ...r, value: 777 } : r);
  assert.throws(() => applyChunk({ authorization: auth, liveRecords: mutatedLive, checkpoint, chunkSize: 1 }), /stale_live_state/);
});

test('chunked apply is resumable and produces the same final state as one-shot apply', () => {
  const { live, source } = fixture();
  const plan = buildPlan({ sourceRecords: source, liveRecords: live });
  const auth = authorizePlan(plan, new Map([['B', 'APPLY_SOURCE']]));

  let resumed = { records: live, checkpoint: createCheckpoint(auth) };
  resumed = applyChunk({ authorization: auth, liveRecords: resumed.records, checkpoint: resumed.checkpoint, chunkSize: 1 });
  assert.equal(resumed.checkpoint.done, false);
  resumed = applyChunk({ authorization: auth, liveRecords: resumed.records, checkpoint: resumed.checkpoint, chunkSize: 1 });
  assert.equal(resumed.checkpoint.done, true);

  const oneShot = applyChunk({ authorization: auth, liveRecords: live, checkpoint: createCheckpoint(auth), chunkSize: 100 });
  assert.deepEqual(resumed.records, oneShot.records);
  assert.equal(resumed.checkpoint.rollingDigest, oneShot.checkpoint.rollingDigest);
});

test('reusing an old checkpoint after state moved forward is rejected, not double-applied', () => {
  const { live, source } = fixture();
  const plan = buildPlan({ sourceRecords: source, liveRecords: live });
  const auth = authorizePlan(plan, new Map([['B', 'APPLY_SOURCE']]));
  const checkpoint = createCheckpoint(auth);
  const first = applyChunk({ authorization: auth, liveRecords: live, checkpoint, chunkSize: 1 });
  assert.throws(() => applyChunk({ authorization: auth, liveRecords: first.records, checkpoint, chunkSize: 1 }), /stale_live_state/);
});
