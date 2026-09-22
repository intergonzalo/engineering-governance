# Public Evidence Map

This map connects public, executable evidence to the engineering capabilities described in the private-source case studies.

| Capability | Public executable proof | Tested invariants | Private-source application |
| --- | --- | --- | --- |
| Constrained agentic operations | [Agentic Operations Gateway](./reference/agentic-operations-gateway/) | scope reduction, hard stops, human-review routing, mutation idempotency, claims/leases, finite retries, optimistic concurrency | [TMJ Securitizadora](./portfolio/tmj-securitizadora/) |
| Deterministic migration/reconciliation | [Deterministic Data Migrations](./reference/deterministic-data-migrations/) | deterministic planning, explicit conflicts, authorization binding, stale-state detection, resumable chunks, replay protection | [TMJ Securitizadora](./portfolio/tmj-securitizadora/) |
| Selective / fail-closed delivery | [Selective Deployment Guard](./reference/selective-deployment-guard/) | docs skip, validation-only changes, mapped targets, shared dependency expansion, unknown runtime => blocked full impact | TMJ, Tallerito and the public governance model |
| Conversational operational AI | [Conversational Operations Router](./reference/conversational-operations-router/) | current context, ambiguity candidates, indexed follow-ups, natural confirmation, pending-state TTL, action allowlist | [Tallerito](./portfolio/tallerito/) |

## Validation surface

All four reference projects:

- run on Node.js 22;
- use Node.js built-ins only;
- have no runtime dependencies;
- expose a runnable demo;
- run syntax checks and seven automated tests each;
- are exercised by [Public reference CI](https://github.com/intergonzalo/engineering-governance/actions/workflows/reference-ci.yml).

That is **28 automated tests across four independently executable references**.

## Publication boundary

Public proof is intentionally separated from private production source. The references demonstrate engineering invariants without publishing customer/investor/workshop data, credentials, private endpoints, production datastore schemas, proprietary financial logic or security internals.
