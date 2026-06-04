/**
 * SG-PLAN-07
 * Phase: PLAN
 * Type: SOFT
 *
 * Checks migration estimated_downtime for non-zero values.
 *
 * Pass when:
 *   Estimated downtime is 0, none, zero, or empty.
 *
 * Fail if:
 *   Estimated downtime has a non-zero value suggesting service interruption.
 *
 * Example output:
 *   [PASS] SG-PLAN-07 -- <pass message>
 *   [FAIL] SG-PLAN-07 -- <failure details>
 */

"use strict";

const gate_id = "SG-PLAN-07";
const name = "Potential Downtime During Migration";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === SG-PLAN-07 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const plan = ctx.plan || {};
  const migration = plan.migration || {};
  var downtime = (migration.estimated_downtime || "").toLowerCase().trim();

  if (!downtime || downtime === "0" || downtime === "none" || downtime === "zero") {
    return pass("No estimated downtime during migration");
  }

  return fail("Estimated migration downtime: \"" + migration.estimated_downtime + "\". Consider blue/green deployment or feature flags to reduce impact.");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };