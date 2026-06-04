/**
 * HG-PLAN-08
 * Phase: PLAN
 * Type: HARD
 *
 * Checks rollback strategy covers triggers, steps, and data recovery when schema changes or stateful components exist.
 *
 * Pass when:
 *   No schema changes and no stateful components (gate not triggered) OR rollback_strategy has all three aspects.
 *
 * Fail if:
 *   Schema changes or stateful components exist but rollback_strategy is empty or incomplete.
 *
 * Example output:
 *   [PASS] HG-PLAN-08 -- <pass message>
 *   [FAIL] HG-PLAN-08 -- <failure details>
 */

"use strict";

const gate_id = "HG-PLAN-08";
const name = "Missing Rollback Strategy";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-PLAN-08 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const plan = ctx.plan || {};
  const components = (plan.architecture && plan.architecture.components) || [];
  const migration = plan.migration || {};

  var hasStatefulComponent = components.some(function(c) {
    return ["database", "stateful", "state-manager"].indexOf(c.type || "") !== -1;
  });

  if (!migration.has_schema_changes && !hasStatefulComponent) {
    return pass("Gate not triggered  --  no schema changes and no stateful components");
  }

  var rs = migration.rollback_strategy || "";
  if (!rs || rs.trim() === "") {
    return fail("Schema changes or stateful components exist but rollback_strategy is empty");
  }

  // Check it describes trigger conditions, rollback steps, and data recovery
  var hasTriggers = /trigger|if|when|condition/i.test(rs);
  var hasSteps = /step|run|execute|rollback|down|reverse/i.test(rs);
  var hasRecovery = /recover|restore|data|backup|preserv/i.test(rs);

  if (!hasTriggers || !hasSteps || !hasRecovery) {
    return fail("rollback_strategy is present but incomplete  --  must describe trigger conditions, rollback steps, and data recovery approach");
  }

  return pass("Rollback strategy is defined with trigger conditions, steps, and data recovery");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };