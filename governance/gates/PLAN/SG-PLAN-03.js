/**
 * SG-PLAN-03
 * Phase: PLAN
 * Type: SOFT
 *
 * Checks that at least one architecture diagram is referenced.
 *
 * Pass when:
 *   At least one diagram reference exists.
 *
 * Fail if:
 *   architecture.diagrams[] is empty.
 *
 * Example output:
 *   [PASS] SG-PLAN-03 -- <pass message>
 *   [FAIL] SG-PLAN-03 -- <failure details>
 */

"use strict";

const gate_id = "SG-PLAN-03";
const name = "Missing Diagrams";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === SG-PLAN-03 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const plan = ctx.plan || {};
  const diagrams = (plan.architecture && plan.architecture.diagrams) || [];

  if (!diagrams || diagrams.length === 0) {
    return fail("architecture.diagrams[] is empty  --  consider adding at minimum a component diagram");
  }

  return pass(diagrams.length + " diagram(s) referenced");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };