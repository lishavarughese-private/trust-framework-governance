# Spec-Kit To-Do

Items to pick up in future sessions, ordered roughly by priority.

---

1. **`speckit init` command** -- auto-creates .governance/REFERENCE.txt and pulls governance rules. CLI should prompt for repo URL and version.

2. **Sycophancy resistance for new gates** -- add HG-TASK-01..05, SG-TASK-01..04, HG-SEC-01, INFO-TRACE-01 to resistance.test.js

3. **Unit tests for new gate functions** -- verify run-unit-tests.js actually runs the new .unit.json fixtures

4. **Artifact schema definitions** -- define canonical JSON schemas for SPEC.json, PLAN.json, TASKS.json, IMPL.json in the governance repo. Gates depend on specific field names and structures. Schemas serve as the contract between governance and product repos.

5. **PLAN SOFT gate SG-PLAN-01** -- "Secrets Manager" component not in traceability. Add traceability entry or acknowledge as expected.

7. **Update old tests** -- integrity.test.js and coverage.test.js still look for .json gate files. Update to check .js files or remove.

8. **npm package publish** -- make speckit installable so speckit gate TASKS works globally.

9. **Dynamic governance path** -- replace hardcoded path in speckit.js with resolution from REFERENCE.txt.