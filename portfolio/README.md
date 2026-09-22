# Gonzalo Burgos — Business, Product & Engineering

[![Public reference CI](https://github.com/intergonzalo/engineering-governance/actions/workflows/reference-ci.yml/badge.svg)](https://github.com/intergonzalo/engineering-governance/actions/workflows/reference-ci.yml)

I build operating systems for real businesses: translating commercial, legal and operational requirements into software, workflows, controls and repeatable delivery.

My work sits at the intersection of **business design, product ownership and engineering execution**. I use AI-assisted development intensively, but the operating model is human-led: requirements, architecture, risk boundaries, acceptance criteria and release decisions stay explicit and traceable.

## Public code proof

**4 executable reference implementations · 28 automated tests · public CI**

| Capability | Public implementation | Production context |
| --- | --- | --- |
| Secure agentic operations | [Agentic Operations Gateway](../reference/agentic-operations-gateway/) | [TMJ Securitizadora](./tmj-securitizadora/) |
| Deterministic migration/reconciliation | [Deterministic Data Migrations](../reference/deterministic-data-migrations/) | [TMJ Securitizadora](./tmj-securitizadora/) |
| Selective / fail-closed CI/CD | [Selective Deployment Guard](../reference/selective-deployment-guard/) | TMJ, Tallerito and this governance model |
| Conversational operational AI | [Conversational Operations Router](../reference/conversational-operations-router/) | [Tallerito](./tallerito/) |

The full evidence map is available in [PUBLIC-EVIDENCE.md](../PUBLIC-EVIDENCE.md).

## Selected work

| Project | What it demonstrates | Source model |
| --- | --- | --- |
| [Engineering Governance](../) | engineering operating standards, issue-driven execution, branch/PR discipline, selective deploy and fail-closed safeguards | Public |
| [TMJ Securitizadora](./tmj-securitizadora/) | financial operations platform, role-specific applications, document workflows, operational queues, agentic boundaries, migrations and guarded Firebase delivery | Private source / public case study |
| [Tallerito](./tallerito/) | automotive-workshop SaaS, PHP/MySQL modernization, DEV/Production isolation and production voice/text AI operations | Private source / public case study |

## What I do

### Product and operating-model design

I start from the actual business process rather than from a screen list. The work includes defining states, ownership, hand-offs, invariants, exception paths, human checkpoints and the data that must remain canonical across the workflow.

### Engineering direction

I convert that operating model into an explicit technical map: existing architecture to reuse, affected surfaces, security boundaries, tests, deployment impact and completion criteria. The objective is to avoid duplicate systems and make changes understandable before implementation begins.

### AI-assisted implementation

I use AI coding systems as execution partners for repository inspection, implementation, regression tests, documentation and release operations. The model is not "prompt and hope": work is constrained by repository rules, package scope, branches, pull requests, CI evidence and post-merge verification.

### Release and operational safety

I favor selective deployment, least privilege and fail-closed behavior. Validation and publication are treated as different concerns. Sensitive systems are tested with fixtures, mocks, emulators, isolated development data or controlled smoke tests rather than by mutating real production records.

## Delivery model

```mermaid
flowchart LR
    B[Business problem] --> O[Operating model]
    O --> T[Technical map]
    T --> I[Scoped implementation]
    I --> Q[Tests and CI evidence]
    Q --> R[Selective release]
    R --> S[Controlled smoke test]
    S --> L[Operational learning]
    L --> B
```

The process is designed to keep speed and control compatible: ship small, preserve existing architecture, document decisions, and make deployment scope explicit.

## Why the production repositories are private

The private repositories contain implementation detail that should not be exposed simply to prove that the work exists: production architecture, operational data models, provider integrations, security boundaries and proprietary business logic.

This portfolio therefore uses **curated case studies and independent synthetic implementations**. The reference projects are executable and tested, but do not reproduce production source or turn public documentation into an attack map.

## CV-ready summary

A concise professional summary suitable for a CV, proposal or profile is available in [`CV-SUMMARY.md`](./CV-SUMMARY.md).
