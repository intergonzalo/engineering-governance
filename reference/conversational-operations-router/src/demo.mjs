import { routeTurn } from './router.mjs';
import { ActionExecutor } from './executor.mjs';

let session = { actorId: 'user-demo', workspaceId: 'shop-demo', currentOrderId: 'ORDER-42', pending: null };
const data = {
  items: [
    { id: 'A', label: 'air filter', detail: '$20' },
    { id: 'B', label: 'air filter premium', detail: '$35' },
  ],
};
const executor = new ActionExecutor({
  delete_item: async (args) => ({ deleted: args.itemId }),
});

for (const [text, id] of [['delete air filter', 'c1'], ['2', 'c2'], ['yes', 'c3']]) {
  const turn = routeTurn({ session, text, data, now: 1000, correlationId: id });
  console.log(text, turn.status, turn.message ?? turn.envelope);
  session = turn.session;
  if (turn.status === 'execute') console.log(await executor.execute(turn.envelope));
}
