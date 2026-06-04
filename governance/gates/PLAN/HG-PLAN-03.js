/**
 * HG-PLAN-03
 * Phase: PLAN
 * Type: HARD
 *
 * Checks that architecture.components[] has at least one component with a non-empty name and responsibility.
 *
 * Pass when:
 *   At least one component exists with both a non-empty name and a non-empty responsibility.
 *
 * Fail if:
 *   architecture.components[] is empty, OR all entries have blank name or responsibility.
 *
 * Example output:
 *   [PASS] HG-PLAN-03 -- <pass message>
 *   [FAIL] HG-PLAN-03 -- <failure details>
 */

"use strict";

const gate_id = "HG-PLAN-03";
const name = "Missing Architecture Components";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-PLAN-03 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const plan = ctx.plan || {};
  const components = (plan.architecture && plan.architecture.components) || [];

  if (components.length === 0) {
    return fail("architecture.components[] is empty  --  at least one component must be defined");
  }

  var valid = false;
  // Iterate over each component to check dependencies
  for (var i = 0; i < components.length; i++) {
    var c = components[i];
    if (c.name && c.name.trim() !== "" && c.responsibility && c.responsibility.trim() !== "") {
      valid = true;
      break;
    }
  }

  if (!valid) {
    return fail("No component has both a non-empty name and non-empty responsibility");
  }

  return pass(components.length + " architecture component(s) defined with name and responsibility");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };