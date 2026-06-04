/**
 * HG-PLAN-10
 * Phase: PLAN
 * Type: HARD
 *
 * Checks state_hydration plan exists when client components are affected by schema/state changes.
 *
 * Pass when:
 *   No client components affected (gate not triggered) OR state_hydration is non-empty.
 *
 * Fail if:
 *   Client components exist with schema/state changes but state_hydration is empty.
 *
 * Example output:
 *   [PASS] HG-PLAN-10 -- <pass message>
 *   [FAIL] HG-PLAN-10 -- <failure details>
 */

"use strict";

const gate_id = "HG-PLAN-10";
const name = "Missing State Hydration Plan";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-PLAN-10 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const plan = ctx.plan || {};
  const components = (plan.architecture && plan.architecture.components) || [];
  const migration = plan.migration || {};

  var hasClientComponent = components.some(function(c) {
    return ["state-manager", "frontend", "client"].indexOf(c.type || "") !== -1;
  });

  var hasSchemaOrStateChange = migration.has_schema_changes || 
    components.some(function(c) { return ["stateful", "state-manager"].indexOf(c.type || "") !== -1; });

  if (!hasClientComponent || !hasSchemaOrStateChange) {
    return pass("Gate not triggered  --  no client-side state affected by changes");
  }

  var sh = migration.state_hydration || "";
  if (!sh || sh.trim() === "") {
    return fail("Client components exist with schema/state changes but state_hydration is empty");
  }

  return pass("State hydration plan is defined");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };