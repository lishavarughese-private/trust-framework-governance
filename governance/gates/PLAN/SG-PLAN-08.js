/**
 * SG-PLAN-08
 * Phase: PLAN
 * Type: SOFT
 *
 * Checks state hydration plan for complex rehydration language.
 *
 * Pass when:
 *   No complex rehydration indicators found.
 *
 * Fail if:
 *   State hydration plan contains complex rehydration keywords.
 *
 * Example output:
 *   [PASS] SG-PLAN-08 -- <pass message>
 *   [FAIL] SG-PLAN-08 -- <failure details>
 */

"use strict";

const gate_id = "SG-PLAN-08";
const name = "Complex State Rehydration / UI Flicker Risk";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === SG-PLAN-08 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const plan = ctx.plan || {};
  var sh = (plan.migration && plan.migration.state_hydration) || "";

  if (!sh || sh.trim() === "") {
    return pass("Gate not triggered  --  no state hydration plan defined");
  }

  var riskWords = ["complex", "multi-step", "sequential", "order-dependent", "async chain", "nested"];
  var lower = sh.toLowerCase();
  var hasRisk = false;
  for (var i = 0; i < riskWords.length; i++) {
    if (lower.indexOf(riskWords[i]) !== -1) {
      hasRisk = true;
      break;
    }
  }

  if (hasRisk) {
    return fail("State hydration plan describes complex rehydration. Risk of UI flicker or loading state inconsistencies. Consider loading skeletons or optimistic UI.");
  }

  return pass("State hydration plan does not indicate complex rehydration risk");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };