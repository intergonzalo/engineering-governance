# Security model

This project is intentionally synthetic. It contains no production credentials, endpoints, datastore names, IAM identities, customer data or proprietary business rules.

## Threats addressed

- credential disclosure: reference authentication resolves credentials by SHA-256 hash;
- delegated scope escalation: delegated grants must be a subset of the base principal scopes;
- unrestricted agent capabilities: actions are explicit and server-side policy controlled;
- dangerous operations: hard-stop decisions block execution even when a nominal scope exists;
- replay/duplicate writes: material mutations use deterministic fingerprints and stable mutation IDs;
- concurrent workers: claim/lease semantics prevent simultaneous ownership;
- infinite retry loops: retry budgets terminate as explicit exceptions;
- stale writes: optimistic version checks reject old state;
- silent policy exceptions: soft flags are routed to a typed human-review queue.

## Deliberate omissions

This is not an authentication product, OAuth authorization server, database, financial ledger or MCP conformance test suite. Production-grade deployments should use established identity providers, encrypted persistence, managed key material, durable queues and formal protocol libraries.
