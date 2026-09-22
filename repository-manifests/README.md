# Dedicated Public Repository Plan

The current public repository remains the canonical governance/portfolio hub. The reference projects are deliberately self-contained so they can be split into dedicated public repositories without changing their technical content.

## Target repositories

| Target | Source path today | Purpose |
| --- | --- | --- |
| `intergonzalo/intergonzalo` | `profile/README.md` | GitHub profile landing |
| `intergonzalo/agentic-operations-gateway` | `reference/agentic-operations-gateway/` | secure agentic operations reference |
| `intergonzalo/deterministic-data-migrations` | `reference/deterministic-data-migrations/` | deterministic/resumable migration reference |
| `intergonzalo/selective-deployment-guard` | `reference/selective-deployment-guard/` | selective/fail-closed CI/CD reference |
| `intergonzalo/conversational-operations-router` | `reference/conversational-operations-router/` | conversational operational-AI reference |

Each target has a machine-readable manifest in this directory.

## Recommended profile pin order

1. `engineering-governance`
2. `agentic-operations-gateway`
3. `conversational-operations-router`
4. `deterministic-data-migrations`
5. `selective-deployment-guard`

The special `intergonzalo/intergonzalo` repository renders as the profile README and does not need to consume a pinned-repository slot.

## Split invariants

- preserve public source history in the hub;
- do not copy any private production repository history;
- preserve tests and README/architecture files;
- add a dedicated CI workflow in each new repository before considering the split complete;
- keep synthetic/public-safe names and data unchanged;
- update hub links only after the target repository is live and CI-green;
- never delete the hub copy merely to make the dedicated repository canonical unless that is an explicit later decision.

## Current blocker

The connected GitHub integration supports content, branches, issues, pull requests and merges but does not expose repository creation. These manifests therefore describe the exact creation targets without claiming that the containers already exist.
