# Public Reference Implementations

[![Public reference CI](https://github.com/intergonzalo/engineering-governance/actions/workflows/reference-ci.yml/badge.svg)](https://github.com/intergonzalo/engineering-governance/actions/workflows/reference-ci.yml)

Independent, executable implementations of engineering patterns used in private production work. The canonical public presentation now lives in dedicated repositories; the copies under this hub remain preserved for governance history and aggregate validation.

**4 projects · 28 automated tests · Node.js 22 · zero runtime dependencies**

| Reference | Focus | Validation |
| --- | --- | --- |
| [Agentic Operations Gateway](https://github.com/intergonzalo/agentic-operations-gateway) | constrained agent actions, authorization, policy decisions, idempotency, leases, human review, optimistic concurrency | syntax checks + 7 tests |
| [Deterministic Data Migrations](https://github.com/intergonzalo/deterministic-data-migrations) | plan/review/authorize/apply, deterministic conflicts, authorization digests, resumable chunks, stale-state protection | syntax checks + 7 tests |
| [Selective Deployment Guard](https://github.com/intergonzalo/selective-deployment-guard) | runtime impact mapping, selective targets, validation/deploy separation, fail-closed full impact | syntax checks + 7 tests |
| [Conversational Operations Router](https://github.com/intergonzalo/conversational-operations-router) | context, ambiguity, natural confirmations, pending-state TTL, allowlisted action execution | syntax checks + 7 tests |

## Design principle

Each reference isolates one difficult production concern and makes its invariants visible through tests. The examples use synthetic names and data and deliberately omit production credentials, endpoints, datastore schemas, customer data and proprietary business rules.

For the cross-project mapping from capability to public proof and private case study, see [Public Evidence Map](../PUBLIC-EVIDENCE.md).
