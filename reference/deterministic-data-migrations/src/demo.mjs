import { buildPlan, summarizePlan } from './planner.mjs';
import { authorizePlan } from './authorization.mjs';
import { createCheckpoint, applyChunk } from './worker.mjs';

const live = [
  { id: 'A', name: 'unchanged' },
  { id: 'B', name: 'live-version' },
  { id: 'LIVE-ONLY', name: 'preserve me' },
];
const incoming = [
  { id: 'A', name: 'unchanged' },
  { id: 'B', name: 'source-version' },
  { id: 'C', name: 'new' },
];

const plan = buildPlan({ sourceRecords: incoming, liveRecords: live });
console.log('plan', summarizePlan(plan));
const authorization = authorizePlan(plan, new Map([['B', 'APPLY_SOURCE']]));
let state = { records: live, checkpoint: createCheckpoint(authorization) };
while (!state.checkpoint.done) {
  state = applyChunk({ authorization, liveRecords: state.records, checkpoint: state.checkpoint, chunkSize: 1 });
  console.log('checkpoint', state.checkpoint);
}
console.log('final', state.records);
