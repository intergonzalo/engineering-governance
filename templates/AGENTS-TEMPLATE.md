# Agent entrypoint — <PROJECT_NAME>

> READ THIS BEFORE DIAGNOSIS, EDITING, TESTING, PR, MERGE OR DEPLOY.

## Required sources
1. Read the current repository state.
2. Read `docs/engineering/GLOBAL-ENGINEERING-RULES.md` completely.
3. Read `docs/engineering/PROJECT-OPERATING-RULES.md` completely.
4. If the local global snapshot identifies a newer canonical global source and you can access it, compare versions before acting. Never continue silently with a stale baseline.

## Mandatory startup protocol
1. Create/update the MASTER OPERATIONAL WORKFLOW issue.
2. Create one linked issue per executable package.
3. Record objective, scope, logic, affected areas, invariants, tests, deploy impact and completion criteria.
4. Create a dedicated branch from the current canonical branch.
5. Preserve existing work and use selective deploy.

## Merge rule
Green relevant checks normally authorize merge and publication.

**PARALLEL WORK EXCEPTION:** if Gonza reports parallel work, STOP before merge until explicit authorization. Re-check the canonical branch and parallel changes immediately before merge.

## Fail-closed deploy rule
Never use full deploy as a fallback. For Functions/serverless, full/unmapped scope must fail unless the documented exceptional manual authorization with literal `ALLOW_FULL_FUNCTIONS_DEPLOY=true` has been explicitly approved by Gonza.

Project-specific rules may be stricter than the global baseline but may not silently weaken it.
