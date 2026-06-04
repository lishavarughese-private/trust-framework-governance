/**
 * SG-TASK-04
 * Phase: TASKS, IMPL
 * Type: SOFT
 *
 * Checks that every task is mapped to an architecture component.
 *
 * Pass when:
 *   All tasks have a non-empty maps_to_component field.
 *
 * Fail if:
 *   Any task has an empty or missing maps_to_component.
 *
 * Example output:
 *   [PASS] SG-TASK-04 -- <pass message>
 *   [FAIL] SG-TASK-04 -- <failure details>
 */

"use strict";

const gate_id = "SG-TASK-04";
const name = "Missing Component Mapping";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === SG-TASK-04 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const tasks = ctx.tasks || [];
  const warnings = [];

  // Iterate over each task to check compliance
  for (const task of tasks) {
    const mapping = task.maps_to_component;
    if (!mapping || (typeof mapping === "string" && mapping.trim() === "")) {
      warnings.push(task.id + " has no maps_to_component. Map it to an architecture component.");
    }
  }

  if (warnings.length === 0) {
    return pass("All tasks mapped to architecture components");
  }
  return fail(warnings.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };