# Agentic Operations Gateway — Reference Implementation

A small, executable public reference for building **AI/agent interfaces that can act on real operational systems without giving the model unrestricted backend access**.

This repository module is deliberately independent from the private production systems that inspired the patterns. It uses synthetic names, synthetic data and Node.js built-ins only.

## What it demonstrates

- API-key principal resolution without persisting raw credentials;
- delegated authorization that can reduce, never expand, scopes;
- explicit action allowlists and server-side policy decisions;
- `allow`, `soft_flag` and `hard_stop` outcomes;
- deterministic idempotency for material mutations;
- claim / lease / heartbeat worker ownership;
- finite retry budgets and terminal exceptions;
- optimistic concurrency;
- typed human-review routing;
- immutable audit events;
- canonical-service boundary instead of direct datastore access.

## Run it

Requires Node.js 22+.

```bash
npm run check
npm test
npm run demo
```

There are no runtime dependencies.

## Why this architecture

Giving an LLM direct SQL/Firestore/backend access creates an authority problem: the model becomes both interpreter and enforcement layer. This reference separates those responsibilities.

The model or agent proposes an explicit action. The gateway authenticates the principal, evaluates policy, enforces idempotency and work ownership, then calls a canonical application service. Unsafe actions stop; exceptional actions can become human work items.

See [ARCHITECTURE.md](./ARCHITECTURE.md) and [SECURITY.md](./SECURITY.md).

## Example

```js
const result = await gateway.execute({
  principal,
  action: 'update_case',
  input: { id: 'CASE-42', status: 'ready' },
  mutationId: 'client-mutation-123',
  correlationId: 'request-abc',
});
```

Reusing the same mutation ID with the same payload returns the previous result; reusing it with a different payload is rejected.

## Public/private boundary

No private source code is mirrored here. The reference intentionally omits production business rules, customer data, financial logic, real service names, database schemas, credentials, infrastructure identifiers and private endpoints.
