/**
 * SG-PLAN-04
 * Phase: PLAN
 * Type: SOFT
 *
 * Checks that all dependencies have versions specified.
 *
 * Pass when:
 *   All dependencies have a version.
 *
 * Fail if:
 *   Any dependency has an empty or missing version.
 *
 * Example output:
 *   [PASS] SG-PLAN-04 -- <pass message>
 *   [FAIL] SG-PLAN-04 -- <failure details>
 */

"use strict";

const gate_id = "SG-PLAN-04";
const name = "Missing Dependency Versions";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === SG-PLAN-04 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const plan = ctx.plan || {};
  const dependencies = plan.dependencies || [];

  var warnings = [];
  // Check each dependency entry
  for (var i = 0; i < dependencies.length; i++) {
    var d = dependencies[i];
    if (!d.version || d.version.trim() === "") {
      warnings.push("dependency \"" + (d.name || "unnamed") + "\" has no version");
    }
  }

  if (warnings.length === 0) {
    return pass("All dependencies have versions");
  }
  return fail(warnings.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };