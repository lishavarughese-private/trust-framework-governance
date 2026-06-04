/**
 * HG-PLAN-05
 * Phase: PLAN
 * Type: HARD
 *
 * Checks that all traceability[] references match valid requirement and component IDs.
 *
 * Pass when:
 *   Every traceability entry references a valid requirement ID and component ID.
 *
 * Fail if:
 *   Any traceability entry references a non-existent requirement or component ID.
 *
 * Example output:
 *   [PASS] HG-PLAN-05 -- <pass message>
 *   [FAIL] HG-PLAN-05 -- <failure details>
 */

"use strict";

const gate_id = "HG-PLAN-05";
const name = "Broken Traceability";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-PLAN-05 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const spec = ctx.spec || {};
  const plan = ctx.plan || {};
  const traceability = plan.traceability || [];
  const requirements = spec.requirements || [];
  const components = (plan.architecture && plan.architecture.components) || [];

  if (traceability.length === 0) {
    return pass("Gate not triggered  --  no traceability entries");
  }

  var reqIds = {};
  for (var i = 0; i < requirements.length; i++) reqIds[requirements[i].id] = true;
  var compIds = {};
  for (var j = 0; j < components.length; j++) compIds[components[j].id] = true;

  // Collect all failures for combined error message

  var failures = [];
  for (var k = 0; k < traceability.length; k++) {
    var t = traceability[k];
    if (t.requirement_id && !reqIds[t.requirement_id]) {
      failures.push("traceability entry references non-existent requirement \"" + t.requirement_id + "\"");
    }
    if (t.component_id && !compIds[t.component_id]) {
      failures.push("traceability entry references non-existent component \"" + t.component_id + "\"");
    }
  }

  if (failures.length === 0) {
    return pass("All traceability entries reference valid requirements and components");
  }
  return fail(failures.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };