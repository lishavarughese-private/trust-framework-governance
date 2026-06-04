/**
 * SG-TASK-03
 * Phase: TASKS, IMPL
 * Type: SOFT
 *
 * Checks that every task has an estimated effort specified.
 *
 * Pass when:
 *   All tasks have a non-empty estimated_effort field.
 *
 * Fail if:
 *   Any task is missing estimated_effort or has an empty string.
 *
 * Example output:
 *   [PASS] SG-TASK-03 -- <pass message>
 *   [FAIL] SG-TASK-03 -- <failure details>
 */

"use strict";

const gate_id = "SG-TASK-03";
const name = "Missing Effort Estimates";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === SG-TASK-03 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const tasks = ctx.tasks || [];
  const warnings = [];

  // Iterate over each task to check compliance
  for (const task of tasks) {
    if (!task.estimated_effort || (typeof task.estimated_effort === "string" && task.estimated_effort.trim() === "")) {
      warnings.push(task.id + " has no estimated_effort. Add a time estimate (e.g. '1d', '0.5d').");
    }
  }

  if (warnings.length === 0) {
    return pass("All tasks have effort estimates");
  }
  return fail(warnings.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };