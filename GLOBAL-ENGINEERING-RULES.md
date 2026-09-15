# Global Engineering Governance

**Version:** 1.0  
**Date:** 2026-09-15  
**Status:** canonical global operating standard for software projects

These rules govern any programming project unless Gonza gives an explicit, task-specific exception. Each repository may add a **project overlay** with stack, environments, deploy rules, critical data, and project-specific constraints. A project overlay may specialize these rules but must not silently weaken them.

1. **Verify the real state before acting.** Every task starts by checking the current repository state: canonical branch, related open PRs, relevant branches, recent commits, and applicable workflows. Never rely only on memory, handoff, or a previous session.

2. **Create a master operational workflow and package issues.** At the start of every task, before technical diagnosis, create or update a GitHub issue acting as the **MASTER OPERATIONAL WORKFLOW** and create one linked issue for each executable package. The master records objective, global scope, package sequence, dependencies, invariants, status, and completion criteria. Each package issue records scope, branch/PR, tests, deploy impact, and result. Keep them updated so work can resume safely across sessions. Use Issues/comments for planning; do not create artificial commits merely to record status.

3. **Record the technical map before diagnosis.** In the master workflow and package issue, record the agreed objective, scope, functional logic, likely affected areas/files, invariants, planned tests, expected deploy impact, and completion criteria. If diagnosis changes assumptions or package decomposition, update the records.

4. **Use a dedicated branch per task/package.** Create each task/package branch from the current canonical branch. Do not reuse old branches for new work and do not mix unrelated scopes without a justified technical dependency.

5. **Prefer deliverables over prolonged diagnosis.** Optimize for concrete output: code changed, committed, pushed, tested, and—when applicable—published. Diagnosis should be deep enough to identify the real cause but no longer than necessary.

6. **Operate autonomously by default.** After understanding the task, proceed through implementation, tests, PR, merge, and publication without repeatedly asking for approval for normal substeps. Ask Gonza only for a real human blocker or a sensitive decision: login, 2FA, CAPTCHA, OAuth, relevant IAM/permission expansion, paid service, material legal/economic decision, dangerous migration, production conflict, or equivalent.

7. **Green checks authorize forward progress.** Unless an exception applies, relevant green tests/checks authorize merge and the corresponding publication without another approval round.

8. **Parallel-work exception is mandatory.** If Gonza reports parallel work in another session/branch/front, work only on your branch and **STOP before merge**. Merge only after explicit authorization. Immediately before merging, re-check the canonical branch and compare parallel changes to prevent loss or overwrite.

9. **Preserve all valid existing work.** Do not use destructive operations such as `reset --hard`, destructive force-push, broad rollback, unjustified whole-file replacement, or reversal of another valid agent/session’s work.

10. **Reuse and evolve existing architecture.** Before building a new mechanism, check whether the repository already has a module, foundation, adapter, flow, calculation, service, or abstraction that should be generalized. Avoid unnecessary parallel systems.

11. **Deploy selectively by default.** Publish only the files, services, apps, functions, rules, resources, or environments actually affected when the impact can be determined safely. A small change must not trigger a full deployment merely for convenience.

12. **Full deploy is never an automatic fallback.** If deploy impact cannot be mapped safely, fail explicitly and classify the impact rather than publishing everything.

13. **Full Functions/serverless deploy is fail-closed.** Normal push/merge may only result in `skip` or `selective` for Functions/serverless. If scope resolves to `full` or cannot be mapped, the workflow must fail before the deploy unless the exact literal authorization `ALLOW_FULL_FUNCTIONS_DEPLOY=true` is provided by the approved exceptional mechanism. Missing value, `false`, `1`, `TRUE`, or any other value does not authorize. An agent must never enable this flag merely to obtain green CI. First diagnose and correct the scope/resolver. If full deploy is genuinely indispensable, record the technical justification in the master workflow/package issue, obtain Gonza’s explicit authorization, and use the manual exceptional run. Authorization is valid only for that run, must not be persisted, and must not authorize unrelated components.

14. **Validation and deployment are different concerns.** Global lint, syntax checks, dependency installation, tests, or contract validation may be necessary, but they must not publish unaffected components.

15. **Continuously reduce CI/CD waste.** Remove redundant workflows, jobs, installs, builds, reruns, and deploys whenever this can be done without reducing safety or quality.

16. **Red CI requires action.** First determine whether the failure is a deliberate safeguard—especially full-deploy protection or an unmapped-scope guard. Never bypass a safeguard just to get green. For genuine code/configuration failures, run up to three grounded cycles of diagnosis → correction → test, attacking the first proven causal error.

17. **After three failed cycles, replace the defective approach.** Do not keep stacking patches. Reimplement the failing block from a known-green base while preserving the canonical branch and parallel work.

18. **Never get green by weakening evidence.** Do not disable tests, lower coverage, change expected results to hide regressions, ignore errors, add generic suppressions, or remove validations merely to pass CI.

19. **Fix the first proven cause before speculating elsewhere.** Avoid broad speculative changes across multiple systems at once.

20. **Split large work into small, testable blocks.** As a reference, aim for roughly **650 changed lines per block**, not as a rigid limit. Push and validate blocks progressively before final consolidation.

21. **Do not anticipate future scope.** Avoid unrelated refactors or future features inside the current package simply because nearby code is already open.

22. **Tests must not mutate real production data.** Use fixtures, mocks, pure modules, emulators, sandboxes, isolated development databases, test accounts, or equivalent mechanisms. Never create, alter, delete, settle, charge, cancel, migrate, or otherwise mutate real production records merely to test.

23. **Use least privilege.** Do not broaden IAM, tokens, SSH, database permissions, service accounts, OAuth scopes, secrets access, or infrastructure privileges merely to simplify deployment.

24. **Merge does not finish the task.** Follow post-merge workflows to terminal state. Confirm required jobs succeeded and unrelated components were correctly skipped.

25. **Run controlled smoke tests after publication when applicable.** Prioritize authentication, payments, financial/economic flows, migrations, APIs, documents, portals, admin tools, integrations, and other critical paths.

26. **Do not rerun workflows unnecessarily.** If push/merge already triggered the correct workflow, do not start another one. When appropriate and no code change is required, rerun only the failed job(s).

27. **Communicate executed facts.** Report branch, SHA, changed files, tests, PR, workflow, deploy, and concrete errors. Do not say work is happening in the background when no action is running.

28. **Produce a complete handoff when interrupted.** Include canonical-branch state, master workflow/package issues, branch, PR, SHAs, agreed logic, changed files, tests, CI, deploy, errors, decisions, pending work, and the exact next step.

29. **A handoff never replaces revalidation.** The next session must re-check the real repository state and read the master workflow/package issues before acting.

30. **Fix regressions structurally.** Prefer correcting the underlying structure over masks, timing hacks, late reordering, corrective CSS, duplicate logic, or other treatments that merely hide the problem.

31. **A task is complete only when the agreed logic is delivered end-to-end.** The master/package records are updated, code is versioned and tested, merge occurred under these rules, selective publication completed, and smoke testing passed when applicable.

## Precedence

1. An explicit instruction from Gonza for the current task temporarily overrides a conflicting global rule.
2. A project overlay may add or specialize constraints but must not silently weaken this global baseline.
3. The parallel-work merge lock always requires explicit release by Gonza.
4. Safety/deploy safeguards are fail-closed unless the documented exceptional authorization process is followed.

## Version control

- **v1.0 — 2026-09-15:** initial global consolidation extracted from the validated TMJ and Tallerito operating standards.
