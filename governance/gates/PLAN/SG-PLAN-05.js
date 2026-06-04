/**
 * SG-PLAN-05
 * Phase: PLAN
 * Type: SOFT
 *
 * Checks that all tech_stack entries have versions specified.
 *
 * Pass when:
 *   All tech_stack entries have a version.
 *
 * Fail if:
 *   Any tech_stack entry has an empty or missing version.
 *
 * Example output:
 *   [PASS] SG-PLAN-05 -- <pass message>
 *   [FAIL] SG-PLAN-05 -- <failure details>
 */

"use strict";

const gate_id = "SG-PLAN-05";
const name = "Missing Tech Stack Versions";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === SG-PLAN-05 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const plan = ctx.plan || {};
  const techStack = plan.tech_stack || [];

  var warnings = [];
  // Check each tech_stack entry
  for (var i = 0; i < techStack.length; i++) {
    var t = techStack[i];
    if (!t.version || t.version.trim() === "") {
      warnings.push("tech_stack entry \"" + (t.name || "unnamed") + "\" has no version");
    }
  }

  if (warnings.length === 0) {
    return pass("All tech_stack entries have versions");
  }
  return fail(warnings.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };