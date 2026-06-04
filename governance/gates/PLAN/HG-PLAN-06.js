/**
 * HG-PLAN-06
 * Phase: PLAN
 * Type: HARD
 *
 * Checks that every requirement appears at least once in traceability[].
 *
 * Pass when:
 *   All requirements have at least one corresponding entry in the traceability matrix.
 *
 * Fail if:
 *   Any requirement has no matching entry in traceability[].
 *
 * Example output:
 *   [PASS] HG-PLAN-06 -- <pass message>
 *   [FAIL] HG-PLAN-06 -- <failure details>
 */

"use strict";

const gate_id = "HG-PLAN-06";
const name = "Untraced Requirements";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-PLAN-06 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const spec = ctx.spec || {};
  const plan = ctx.plan || {};
  const traceability = plan.traceability || [];
  const requirements = spec.requirements || [];

  if (requirements.length === 0) {
    return pass("Gate not triggered  --  no requirements to check");
  }

  var tracedReqs = {};
  // Check each traceability entry
  for (var i = 0; i < traceability.length; i++) {
    if (traceability[i].requirement_id) {
      tracedReqs[traceability[i].requirement_id] = true;
    }
  }

  // Collect all failures for combined error message

  var failures = [];
  for (var j = 0; j < requirements.length; j++) {
    if (!tracedReqs[requirements[j].id]) {
      failures.push(requirements[j].id + " has no entry in traceability[]");
    }
  }

  if (failures.length === 0) {
    return pass("All " + requirements.length + " requirements are traced to components in traceability[]");
  }
  return fail(failures.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };