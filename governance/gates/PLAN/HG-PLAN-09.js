/**
 * HG-PLAN-09
 * Phase: PLAN
 * Type: HARD
 *
 * Checks backward_compatibility statement exists when schema changes are present.
 *
 * Pass when:
 *   No schema changes (gate not triggered) OR backward_compatibility is non-empty.
 *
 * Fail if:
 *   has_schema_changes is true but backward_compatibility is empty or missing.
 *
 * Example output:
 *   [PASS] HG-PLAN-09 -- <pass message>
 *   [FAIL] HG-PLAN-09 -- <failure details>
 */

"use strict";

const gate_id = "HG-PLAN-09";
const name = "Missing Backward Compatibility Statement";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-PLAN-09 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const plan = ctx.plan || {};
  const migration = plan.migration || {};

  if (!migration.has_schema_changes) {
    return pass("Gate not triggered  --  no schema changes");
  }

  var bc = migration.backward_compatibility || "";
  if (!bc || bc.trim() === "") {
    return fail("has_schema_changes is true but backward_compatibility is empty");
  }

  return pass("Backward compatibility statement is present");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };