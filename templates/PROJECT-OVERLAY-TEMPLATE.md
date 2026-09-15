# Project Engineering Overlay Template

**Project:** <PROJECT_NAME>  
**Repository:** <owner/repo>  
**Overlay version:** 1.0  
**Global baseline:** Global Engineering Governance v1.0  
**Canonical branch:** <main/master/...>

This file contains only project-specific rules. It supplements the global baseline and must not silently weaken it.

## 1. Stack and architecture
- Runtime/languages:
- Frameworks:
- Database:
- Hosting/cloud:
- Authentication:
- External integrations:
- Existing architectural foundations that must be reused:

## 2. Environments
- Development:
- Staging/QA:
- Production:
- Environment isolation requirements:
- Production data restrictions:

## 3. Deploy map
- Component/path → deploy target:
- Selective deploy mechanism:
- Paths that are validation/documentation only:
- Full deploy safeguards:
- Manual exceptional deploy process:

## 4. CI and test commands
- Required static checks:
- Unit tests:
- Integration/emulator tests:
- E2E:
- Smoke tests:
- Known costly jobs to avoid rerunning unnecessarily:

## 5. Critical invariants
- Business invariants:
- Security invariants:
- Financial/data invariants:
- Idempotency/consistency requirements:
- Backward compatibility requirements:

## 6. Protected production data
List records/resources that tests must never mutate.

## 7. Critical user flows
List flows requiring smoke testing after publication.

## 8. Repository-specific forbidden operations
Add project-specific destructive/risky operations beyond the global rules.

## 9. Human approval gates
List actions that always require Gonza’s explicit approval.

## 10. Project documents agents must read
- <path>
- <path>

## 11. Version control
- v1.0 — <date>: initial project overlay.
