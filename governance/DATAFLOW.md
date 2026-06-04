# Complete Governance ↔ Product Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          PRODUCT REPO (trust-framework)                             │
│                                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐ │
│  │   .governance/   │  │    spec-kit/     │  │    server/      │  │   ci-reports/  │ │
│  │  REFERENCE.txt   │  │                  │  │                 │  │                │ │
│  │                  │  │  BRIEF.md        │  │  app.js         │  │  TASKS-gate-   │ │
│  │  governance_repo │  │  SPEC.json       │  │  routes/*.js    │  │  report-*.json │ │
│  │  : URL           │  │  PLAN.json       │  │  models/*.js    │  │                │ │
│  │  governance_     │  │  TASKS.json      │  │  migrations/*.js│  │  (timestamped  │ │
│  │  version: v1.0   │  │  IMPL.json       │  │  .env           │  │   audit trail) │ │
│  │                  │  │  IMPL.md         │  │                 │  │                │ │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬────────┘  └────────┬───────┘ │
│           │                    │                       │                   │         │
│           │                    │                       │                   │         │
└───────────┼────────────────────┼───────────────────────┼───────────────────┼─────────┘
            │                    │                       │                   │
            │   READ             │   READ                │   READ            │   WRITE
            ▼                    ▼                       ▼                   
    ┌───────────────────────────────────────────────────────────────────────────────┐
    │                          speckit.js (THE BRIDGE)                               │
    │                                                                                │
    │  STEP 1: PARSE REFERENCE                                                        │
    │  parseReference(.governance/REFERENCE.txt)                                      │
    │    -> extracts: { repo: "github.com/...", version: "v1.0" }                    │
    │    -> this is metadata for the report (not used to locate files)                │
    │                                                                                 │
    │  STEP 2: BUILD CONTEXT                                                          │
    │  buildContext(phase) reads from product repo:                                   │
    │                                                                                 │
    │    spec-kit/SPEC.json  ->  ctx.requirements[], ctx.compliance[],               │
    │                           ctx.pii_fields[], ctx.encryption,                     │
    │                           ctx.authentication, ctx.contradictions[],             │
    │                           ctx.problem_statement, ctx.spec                       │
    │                                                                                 │
    │    spec-kit/TASKS.json ->  ctx.tasks[] (id, title, status,                     │
    │                           dependencies[], acceptance_criteria[],                │
    │                           maps_to_requirement, estimated_effort,                │
    │                           maps_to_component)                                    │
    │                                                                                 │
    │    spec-kit/PLAN.json  ->  ctx.components[], ctx.plan                           │
    │                                                                                 │
    │    spec-kit/IMPL.json  ->  ctx.impl (test_results[],                            │
    │                           security_violations[],                                │
    │                           requirement_coverage[],                               │
    │                           task_notes{}, deployment_checklist[])                 │
    │                                                                                 │
    │    server/*.js,*.ts,    ->  ctx.files[] = [{ path, content }, ...]              │
    │    .json,.env              (recursive scan skipping node_modules/.git)          │
    │                                                                                 │
    │    spec-kit/BRIEF.md   ->  ctx.problem_statement (BRIEF phase only)             │
    │                                                                                 │
    │                                     |                                           │
    │                                     |  ctx object passed to governance          │
    │                                     v                                           │
    └───────────────────────────────────────────────────────────────────────────────┘
                                    |
                                    |  require() LOADS GOVERNANCE CODE
                                    v

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        GOVERNANCE REPO (trust-framework-governance)                  │
│                                                                                     │
│  STEP 3: EVALUATE PHASE                                                              │
│  evaluate-phase.js  (loaded via require() from speckit.js)                            │
│                                                                                     │
│  PHASE_FOLDERS maps phase -> gate folders:                                            │
│    BRIEF: []           (no gates)                                                    │
│    SPEC:  ["SPEC", "COMMON"]                                                         │
│    PLAN:  ["PLAN", "SPEC", "COMMON"]                                                 │
│    TASKS: ["TASKS", "COMMON"]                                                        │
│    IMPL:  ["IMPL", "TASKS", "COMMON"]                                                │
│                                                                                     │
│  For each folder, calls listGatesByPhase(folder)                                     │
│  -> returns array of gate IDs (sorted, deduplicated)                                │
│                                    |                                                │
│                                    v                                                │
│  STEP 4: LOAD GATE MODULES                                                           │
│  gate-evaluator.js  (loaded via require() from evaluate-phase.js)                    │
│                                                                                     │
│  loadGates() scans governance/gates/ recursively:                                    │
│                                                                                     │
│    gates/SPEC/       gates/TASKS/      gates/PLAN/      gates/IMPL/                  │
│    |- HG-SPEC-01.js  |- HG-TASK-01.js  |- HG-PLAN-01.js |- HG-IMPL-01.js            │
│    |- HG-SPEC-02.js  |- HG-TASK-02.js  |- HG-PLAN-02.js |- HG-IMPL-02.js            │
│    |- HG-SPEC-03.js  |- HG-TASK-03.js  |- HG-PLAN-03.js |- HG-IMPL-03.js            │
│    |- HG-SPEC-04.js  |- HG-TASK-04.js  |- HG-PLAN-04.js |- HG-IMPL-04.js            │
│    |- HG-SPEC-05.js  |- HG-TASK-05.js  |- HG-PLAN-05.js |- HG-IMPL-05.js            │
│    |- HG-SPEC-06.js  |- SG-TASK-01.js  |- HG-PLAN-06.js |- HG-IMPL-06.js            │
│                       |- SG-TASK-02.js  |- HG-PLAN-07.js |- HG-IMPL-07.js            │
│                       |- SG-TASK-03.js  |- HG-PLAN-08.js |- SG-IMPL-01.js            │
│                       |- SG-TASK-04.js  |- HG-PLAN-09.js |- SG-IMPL-02.js            │
│                                          |- HG-PLAN-10.js |- SG-IMPL-03.js            │
│    gates/COMMON/                         |- HG-PLAN-11.js |- SG-IMPL-04.js            │
│    |- HG-SEC-01.js                       |- SG-PLAN-01.js                            │
│    |- INFO-TRACE-01.js                   |- SG-PLAN-02.js                            │
│                                          |- SG-PLAN-03.js                            │
│    TOTAL: 47 gate modules                |- SG-PLAN-04.js                            │
│                                          |- SG-PLAN-05.js                            │
│  Each .js file exports:                  |- SG-PLAN-06.js                            │
│    { gate_id, name, severity,            |- SG-PLAN-07.js                            │
│      constitution_principle,             |- SG-PLAN-08.js                            │
│      evaluate(ctx) }                                                                │
│                                                                                     │
│  EVALUATORS map (internal cache):                                                    │
│    "HG-TASK-01" -> { name, severity, evaluate, ... }                                 │
│    "HG-TASK-02" -> { ... }                                                           │
│    ...                                                                               │
│                                    |                                                │
│                                    v                                                │
│  STEP 5: RUN EACH GATE                                                               │
│  For each gateId in collection:                                                      │
│                                                                                     │
│    result = evaluateGate(gateId, ctx)                                                │
│           -> gate.evaluate(ctx)                                                      │
│                                                                                     │
│  Each gate module receives ctx (from product repo) and runs PURE logic:              │
│                                                                                     │
│  Example: HG-TASK-01.evaluate(ctx)                                                   │
│    |- ctx.tasks[]       -> check every task.maps_to_requirement is valid              │
│    |- ctx.requirements[]-> cross-reference that requirement IDs exist                 │
│    '- returns { gate: "HG-TASK-01", result: "PASS", reason: "..." }                 │
│                                                                                     │
│  Example: HG-SEC-01.evaluate(ctx)                                                    │
│    |- ctx.files[]       -> scan each file's content for 6 secret patterns            │
│    |- Skips comments and process.env references                                      │
│    '- returns { gate: "HG-SEC-01", result: "PASS"|"FAIL", reason }                  │
│                                                                                     │
│  Example: INFO-TRACE-01.evaluate(ctx)                                                │
│    |- ctx.requirements[]-> build requirement -> task chains                         │
│    |- ctx.tasks[]       -> find gaps (uncovered requirements)                        │
│    '- returns { gate: "INFO-TRACE-01", result: "PASS", report: {...} }              │
│                                                                                     │
│  Gate NOT triggered (soft skip) -- no files to scan, no tasks, etc.                  │
│  Gate ERROR -- malformed data, missing fields, etc. -> caught as "ERROR"             │
│                                    |                                                │
│                                    v                                                │
│  STEP 6: AGGREGATE RESULTS                                                           │
│  evaluate-phase.js builds the manifest:                                              │
│                                                                                     │
│  results[] = [                                                                     │
│    { gate: "HG-TASK-01", result: "PASS", severity: "HARD", ... },                  │
│    { gate: "SG-TASK-01", result: "PASS", severity: "SOFT", ... },                  │
│    { gate: "HG-SEC-01",  result: "PASS", severity: "HARD", ... },                  │
│    { gate: "INFO-TRACE-01", result: "PASS", severity: "INFO", ... },               │
│    ...                                                                               │
│  ]                                                                                   │
│                                                                                     │
│  hardFailures = results where result !== "PASS" && severity === "HARD"              │
│  transitionAllowed = hardFailures.length === 0                                      │
│                                                                                     │
│  Returns manifest: {                                                                │
│    phase, evaluated_at, transition_allowed,                                          │
│    transition: { from: "TASKS", to: "IMPL" },                                       │
│    summary: { total_gates, passed, hard_failures, soft_warnings },                   │
│    gates: results[],                                                                 │
│    blocking_failures: hardFailures[]                                                 │
│  }                                                                                   │
│                                    |                                                │
│                                    |  manifest returned to speckit.js                │
│                                    v                                                │
│                                                                                     │
└────────────────────────────────────────────────────────────────────────────────────┘
                                    |
                                    |  manifest received by speckit.js
                                    v

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          speckit.js (CONTINUED)                                     │
│                                                                                    │
│  STEP 7: SAVE REPORT                                                                │
│  saveReport(phase, manifest)                                                        │
│                                                                                    │
│  Writes to product repo:                                                            │
│    ci-reports/TASKS-gate-report-2026-06-03T21-13-36-854Z.json                      │
│                                                                                    │
│  Report contains:                                                                   │
│    |- evaluated_at: ISO timestamp                                                   │
│    |- product: "trust-framework"                                                   │
│    |- phase: "TASKS"                                                               │
│    |- governance_repo: URL (from REFERENCE.txt)                                     │
│    |- governance_version: "v1.0" (from REFERENCE.txt)                              │
│    |- transition_allowed: true/false                                               │
│    |- transition: { from: "TASKS", to: "IMPL" }                                   │
│    |- summary: { total_gates, passed, failures, warnings }                         │
│    |- gates[ ]: each { gate_id, result, severity, reason }                        │
│    '- blocking_failures[ ]: failing HARD gates with reasons                       │
│                                                                                    │
│  If --out <file> was specified, also copies to that path.                          │
│                                                                                    │
│  STEP 8: DECISION                                                                   │
│                                                                                    │
│  if (manifest.transition_allowed) {                                                │
│    print "ALL GATES PASSED"                                                        │
│    print "TASKS -> IMPL transition UNLOCKED"                                       │
│    process.exit(0)    <- CI/CD can proceed to next phase                          │
│  } else {                                                                           │
│    print blocking_failures with reasons                                            │
│    print "TASKS -> IMPL transition BLOCKED"                                        │
│    process.exit(1)    <- CI/CD must STOP                                           │
│  }                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary: All 14 Transactions Between the Two Repos

| # | Direction | What | File/Function | Triggers When |
|---|-----------|------|---------------|---------------|
| **1** | Product -> Product (reads) | Read `spec-kit/SPEC.json` | `readArtifact("SPEC.json")` -> `buildContext()` | Every phase except BRIEF |
| **2** | Product -> Product (reads) | Read `spec-kit/SPEC.json` | `readArtifact("SPEC.json")` -> `buildContext()` | Every phase except BRIEF |
| **3** | Product -> Product (reads) | Read `spec-kit/TASKS.json` | `readArtifact("TASKS.json")` -> `buildContext()` | PLAN, TASKS, IMPL phases |
| **4** | Product -> Product (reads) | Read `spec-kit/PLAN.json` | `readArtifact("PLAN.json")` -> `buildContext()` | PLAN, TASKS, IMPL phases |
| **5** | Product -> Product (reads) | Read `spec-kit/IMPL.json` | `readArtifact("IMPL.json")` -> `buildContext()` | IMPL phase only |
| **6** | Product -> Product (reads) | Scan `server/*.js/.ts/.json/.env` | `collectFiles(serverDir)` -> `buildContext()` | All phases |
| **7** | **Product -> Governance** | `require(evaluate-phase.js)` loads governance code | `var ep = require(GOVERNANCE_EVALUATOR)` | Every `gate` or `watch` call |
| **8** | **Product -> Governance** | Pass `ctx` object and call `ep.evaluatePhase(phase, ctx)` | `manifest = ep.evaluatePhase(phase, ctx)` | Every gate evaluation |
| **9** | **Governance -> Product** | Return `manifest` back to speckit.js | `return manifest` from `evaluatePhase()` | After all gate evaluations complete |
| **10** | **Governance -> Governance** | `gate-evaluator.js` loads gate `.js` files from `gates/` folders | `loadGates()` scans `gates/` recursively | Called by `evaluatePhase()` |
| **11** | **Governance -> Governance** | Each gate's `evaluate(ctx)` runs against ctx | `gate.evaluate(ctx)` per gate | Called by `evaluateGate()` in a loop |
| **12** | Product -> Product (writes) | Write report to `ci-reports/` | `saveReport(phase, manifest)` | After every gate evaluation |
| **13** | Product -> Console (output) | Print results to stdout | `printGateResult()`, `console.log()` | Each gate and summary line |
| **14** | Product -> Exit Code | `process.exit(0)` or `process.exit(1)` | Decision block in `cmdGate()` | End of gate command |

---

**Key architectural insight**: The governance repo NEVER reads from the product repo's filesystem. All data flows through `ctx` which is assembled by `speckit.js` before it ever calls the governance evaluator. The governance code is purely functional -- it receives data, runs deterministic checks, returns results. This makes gates testable in isolation and prevents the governance repo from having filesystem coupling to any specific product.

**Sycophancy resistance**: Because every gate file's `evaluate(ctx)` is a pure function (same input -> same output), and the `gate-evaluator.js` cache is loaded once and never modified at runtime, no amount of human or agent persuasion during execution can change a gate's result. The only way to change a gate's behavior is to modify the gate's `.js` file in the governance repo and tag a new version.