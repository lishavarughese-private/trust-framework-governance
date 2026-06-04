/**
 * HG-PLAN-02
 * Phase: PLAN
 * Type: HARD
 *
 * Checks that all items in dependencies[] and tech_stack[] have a non-empty version specified.
 *
 * Pass when:
 *   Every entry in both dependencies[] and tech_stack[] has a non-empty version field.
 *
 * Fail if:
 *   Any dependency or tech_stack entry has an empty or missing version.
 *
 * Example output:
 *   [PASS] HG-PLAN-02 -- <pass message>
 *   [FAIL] HG-PLAN-02 -- <failure details>
 */

"use strict";

const gate_id = "HG-PLAN-02";
const name = "Version Drift";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-PLAN-02 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const plan = ctx.plan || {};
  const dependencies = plan.dependencies || [];
  const techStack = plan.tech_stack || [];

  // Collect all failures for combined error message

  var failures = [];

  // Check each dependency entry
  for (var i = 0; i < dependencies.length; i++) {
    var d = dependencies[i];
    if (!d.version || (typeof d.version === "string" && d.version.trim() === "")) {
      failures.push("dependency \"" + (d.name || "unnamed") + "\" has no version specified");
    }
  }

  for (var j = 0; j < techStack.length; j++) {
    var t = techStack[j];
    if (!t.version || (typeof t.version === "string" && t.version.trim() === "")) {
      failures.push("tech_stack entry \"" + (t.name || "unnamed") + "\" has no version specified");
    }
  }

  if (failures.length === 0) {
    return pass("All dependencies and tech_stack entries have versions specified");
  }
  return fail(failures.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };