/**
 * HG-PLAN-11
 * Phase: PLAN
 * Type: HARD
 *
 * Checks rollback strategy exists before generating tasks for DB/stateful components.
 *
 * Pass when:
 *   No DB or stateful components (gate not triggered) OR rollback_strategy is non-empty.
 *
 * Fail if:
 *   DB or stateful components exist but rollback_strategy is empty. TASKS phase locked.
 *
 * Example output:
 *   [PASS] HG-PLAN-11 -- <pass message>
 *   [FAIL] HG-PLAN-11 -- <failure details>
 */

"use strict";

const gate_id = "HG-PLAN-11";
const name = "DB / Stateful Tasks Blocked Without Rollback Strategy";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-PLAN-11 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const plan = ctx.plan || {};
  const components = (plan.architecture && plan.architecture.components) || [];
  const migration = plan.migration || {};

  var hasDBOrStateful = components.some(function(c) {
    return ["database", "stateful", "state-manager"].indexOf(c.type || "") !== -1;
  });

  if (!hasDBOrStateful) {
    return pass("Gate not triggered  --  no DB or stateful components");
  }

  var rs = migration.rollback_strategy || "";
  if (!rs || rs.trim() === "") {
    return fail("DB or stateful components exist but rollback_strategy is empty. TASKS phase must remain locked until rollback strategy is defined.");
  }

  return pass("Rollback strategy defined before DB/stateful task generation");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };