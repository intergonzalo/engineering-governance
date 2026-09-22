# Public Reference Implementations

Executable, synthetic implementations of engineering patterns used in private production work. These are independent public projects, not source-code mirrors.

| Reference | Focus | Validation |
| --- | --- | --- |
| [Agentic Operations Gateway](./agentic-operations-gateway/) | constrained agent actions, authorization, policy decisions, idempotency, leases, human review, optimistic concurrency | Node.js syntax checks + 7 tests |
| [Deterministic Data Migrations](./deterministic-data-migrations/) | plan/review/authorize/apply, deterministic conflicts, authorization digests, resumable chunks, stale-state protection | Node.js syntax checks + 7 tests |

Both references use Node.js built-ins only and deliberately omit production names, credentials, datastore schemas, customer data and proprietary business rules.
