# Outstanding Work

Items to pick up in future sessions, ordered roughly by priority.

---

## 1. Governance Repo Hosts Canonical Artifact Templates

The governance repo should define canonical JSON schemas/templates for each phase artifact. Product repos reference these as the contract — gates depend on specific field names and structures.

**Contents (in governance repo):**
`
governance/
  templates/
    SPEC.json           # Canonical template with all expected fields
    PLAN.json           # Architecture, components, APIs, data models
    TASKS.json          # Tasks with acceptance criteria, dependencies
    IMPL.json           # Test results, console errors, deployment checklist
`

**How it works:**
- Product repos copy templates into spec-kit/ at init time (via speckit init)
- Or the agent hook (/speckit.specify, /speckit.plan, etc.) generates artifacts matching these schemas
- Gates validate field presence and structure — template mismatch means gate failure

**Open questions:**
- Validate via JSON Schema ($schema in each artifact) or via gate logic?
- Should speckit init copy templates or should agent hooks always regenerate them?

---

## 2. Production Governance Resolution

The current speckit.js has a hardcoded local path:

`js
var GOVERNANCE_REPO_PATH = ""C:\Users\ashwi\trust-framework-governance"";
`

This is a development shortcut. For production:

**Option A: npm package (@speckit/governance) [RECOMMENDED]**
- Publish the governance evaluator as an npm package (e.g. @speckit/governance)
- Product repo installs as dev dependency: 
pm install @speckit/governance
- speckit.js resolves via 
equire("@speckit/governance") — no filesystem coupling
- Versioning via semver in package.json
- CI/CD: just 
pm install, no cloning needed
- Updates: bump version in package.json, reinstall

**Option B: Git clone at build time**
- CI/CD clones the governance repo at a pinned tag before running speckit.js
- Works without npm publishing but adds clone step
- Heavy for local dev (every speckit gate would need a fetch)

---

## 3. CI Pipeline Integration

Existing speckit-ci.yml runs its own hardcoded CI checks, not the governance evaluator.
The CI should:
- Fetch/clone governance repo (or resolve from npm package)
- Run speckit gate <phase> at phase transitions
- Store results in ci-reports/
- Block merge if HARD gates fail

---

## 4. npm Package Publish for speckit CLI

Currently invoked as 
ode scripts/speckit.js gate TASKS.
Should be speckit gate TASKS via npm packaging with a bin entry in package.json.

---

## 5. Dynamic Governance Path

Replace hardcoded path in speckit.js with resolution from .governance/REFERENCE.txt or from 
ode_modules/@speckit/governance.

---
