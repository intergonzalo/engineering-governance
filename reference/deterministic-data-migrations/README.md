# Deterministic Data Migrations — Reference Implementation

An executable reference for **safe, resumable migration of live operational data** where import, reconciliation and overwrite decisions must be explicit and reproducible.

The project is synthetic and independent from the private production systems that inspired the patterns.

## What it demonstrates

- deterministic `PLAN -> REVIEW -> AUTHORIZE -> APPLY` flow;
- `CREATE / NOOP / CONFLICT / PRESERVE` classification;
- canonical hashing independent of input ordering;
- explicit conflict decisions;
- authorization cryptographically bound to plan + decisions + actions;
- stale-live detection before mutation;
- chunked, resumable application;
- rolling digest checkpoints;
- replay/stale-checkpoint rejection;
- preservation of live-only records by default;
- no automatic destructive deletion.

## Run it

Requires Node.js 22+ and has no runtime dependencies.

```bash
npm run check
npm test
npm run demo
```

## Why this architecture

A migration is safer when **planning and mutation are different operations**. The planner can be reviewed repeatedly without touching live state. Conflicts become explicit decisions. Authorization binds those decisions to the exact source/base snapshots. The worker then applies only the authorized actions and validates continuity before every chunk.

That makes interrupted jobs resumable without treating retries, restarts or concurrency as exceptional cases.

See [ARCHITECTURE.md](./ARCHITECTURE.md).

## Public/private boundary

No production workbook format, datastore schema, customer data, payment data, financial logic, operational identifiers or private migration source code is published here.
