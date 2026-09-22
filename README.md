# Engineering Governance & Public Engineering Portfolio

[![Public reference CI](https://github.com/intergonzalo/engineering-governance/actions/workflows/reference-ci.yml/badge.svg)](https://github.com/intergonzalo/engineering-governance/actions/workflows/reference-ci.yml)

**Gonzalo Burgos — Business · Product · Engineering**

I build operating systems for real businesses: translating commercial, legal and operational requirements into software, workflows, controls and repeatable delivery.

## Public code proof

**4 dedicated public reference repositories · 28 automated tests · Node.js 22 · zero runtime dependencies · dedicated + aggregate public CI**

| Reference | What it proves |
| --- | --- |
| [Agentic Operations Gateway](https://github.com/intergonzalo/agentic-operations-gateway) | constrained agent authority, scopes, policy decisions, idempotency, claims/leases, human review and optimistic concurrency |
| [Deterministic Data Migrations](https://github.com/intergonzalo/deterministic-data-migrations) | PLAN → REVIEW → AUTHORIZE → APPLY, explicit conflicts, deterministic authorization, resumability and stale-state protection |
| [Selective Deployment Guard](https://github.com/intergonzalo/selective-deployment-guard) | change-impact mapping, validation/deploy separation, selective targets and fail-closed unknown runtime impact |
| [Conversational Operations Router](https://github.com/intergonzalo/conversational-operations-router) | conversational context, ambiguity handling, natural follow-ups, TTL-bound confirmation and allowlisted domain execution |

See the complete [Public Evidence Map](./PUBLIC-EVIDENCE.md).

## Production case studies

- [TMJ Securitizadora](./portfolio/tmj-securitizadora/) — private-source financial operations platform: operational workflows, guarded delivery, agentic boundaries, deterministic migration/reconciliation and scale-safe reporting.
- [Tallerito](./portfolio/tallerito/) — private-source automotive-workshop SaaS: PHP/MySQL modernization, selective DEV/Production delivery and production voice/text AI operations.

Production repositories remain private by design. Public references are independent synthetic implementations: useful enough to inspect and run, without mirroring customer data models, financial logic, credentials, private endpoints or security internals.

## Engineering governance

This repository is also the canonical engineering baseline used across the represented projects. It includes:

- issue-driven execution and explicit technical maps;
- dedicated branches and pull requests;
- automated validation before integration;
- selective deployment and fail-closed safeguards;
- least privilege and test isolation;
- controlled post-merge validation;
- project overlay and AGENTS templates.

See [GLOBAL-ENGINEERING-RULES.md](./GLOBAL-ENGINEERING-RULES.md) and [GLOBAL-GOVERNANCE-ARCHITECTURE.md](./GLOBAL-GOVERNANCE-ARCHITECTURE.md).

## Professional profile

- [Portfolio landing](./portfolio/)
- [CV / profile summary](./portfolio/CV-SUMMARY.md)
- [GitHub profile README source](./profile/README.md)
- [Public reference index](./reference/)
