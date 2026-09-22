# Tallerito — Public Technical Case Study

> Production source is private by design. This page is a curated engineering overview, not a source-code mirror.

## Product scope

Tallerito is a web SaaS for automotive workshops, designed to centralize day-to-day operations such as work orders, vehicle history, customers, stock and administration in a browser-based product.

The engineering challenge is to evolve a live PHP/MySQL product quickly while preserving operational continuity, DEV/Production separation, secure integrations and a coherent user experience across old and new modules.

## Architecture at a glance

```mermaid
flowchart LR
    U[Workshop users] --> W[Authenticated web app]
    V[Voice / text AI] --> A[Allowlisted action layer]
    A --> P[Canonical PHP application services]
    W --> P
    P --> D[(MySQL)]
    P --> I[External integrations]
    C[GitHub Actions] --> X[Validation]
    X --> S[Selective deployment]
    S --> E1[DEV]
    S --> E2[Production]
```

### Core technology

- PHP
- MySQL
- HTML / CSS / JavaScript
- Hostinger runtime
- GitHub Actions
- isolated DEV and Production environments

## Selected engineering themes

### 1. Canonical business services behind multiple interfaces

Core actions are progressively extracted from page-specific handlers into reusable application services. The traditional UI and AI interface call the same domain services instead of maintaining parallel business rules.

### 2. Operational continuity during modernization

The product evolves without a wholesale rewrite. Existing architecture is reused and hardened incrementally, including a canonical page shell, selective deployments and compatibility with the current PHP/CSS runtime.

### 3. Secure AI action boundary

The AI layer is built around an explicit allowlist of supported actions rather than free SQL or unrestricted backend access. Server-side authorization, tenant isolation, auditability and lifecycle rules remain authoritative regardless of whether a request originates from a traditional screen or natural language.

### 4. Production voice and text operations

Voice/text AI is deployed as an operational interface rather than a separate demo. Workshop users can issue natural commands that resolve against the current authenticated context and reuse canonical actions. The interaction layer supports conversational follow-ups, explicit disambiguation when multiple records match, and safe refresh of the visible workflow after mutations.

The implementation also handles practical ambiguity: users can refer to the current work order, choose among same-named items by contextual attributes, and answer follow-up questions naturally instead of restating machine-shaped commands.

### 5. Mobile-first interaction patterns

The same AI capability is exposed through mobile and desktop interaction patterns. On mobile, voice reduces keyboard dependence in a workshop environment; the business boundary remains server-side and shared with the normal UI.

### 6. Data and integration isolation

Runtime credentials, payment configuration, e-mail configuration and other sensitive provider details are kept out of version control. DEV and Production are treated as separate environments, and validation is intentionally separated from publication.

## Selected product/engineering outcomes

- web-based workshop workflow with centralized work-order history;
- reusable page-shell conventions across authenticated screens;
- selective DEV/Production CI/CD instead of indiscriminate uploads;
- automated vehicle-data enrichment with graceful fallback when external data is unavailable;
- sales/admin tooling integrated into the same product governance;
- production voice/text AI using the same domain services as the UI;
- safe handling of conversational context, ambiguity and natural follow-ups;
- regression checks around critical operational flows.

## Sanitized example

[`examples/ai-action-boundary.php`](./examples/ai-action-boundary.php) is **synthetic** and illustrates the allowlisted-action pattern. It is not copied from the production repository.

For a larger executable public example of constrained agent/action architecture, see [Agentic Operations Gateway](../../reference/agentic-operations-gateway/).

## What is deliberately not public

This case study does **not** publish workshop/customer records, database schemas, payment credentials, private provider endpoints, runtime configuration, authentication internals, deployment credentials or production source files.

The private repository remains the canonical source of truth.
