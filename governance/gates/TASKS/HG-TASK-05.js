/**
 * HG-TASK-05
 * Phase: TASKS, IMPL
 * Type: HARD
 *
 * Checks that every task has a valid status value.
 *
 * Pass when:
 *   All tasks have a status of 'todo', 'in_progress', 'done', or 'blocked'.
 *
 * Fail if:
 *   Any task has a status value outside the allowed set.
 *
 * Example output:
 *   [PASS] HG-TASK-05 -- <pass message>
 *   [FAIL] HG-TASK-05 -- <failure details>
 */

"use strict";

const gate_id = "HG-TASK-05";
const name = "Invalid Task Status";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

const VALID_STATUSES = ["todo", "in_progress", "done", "blocked"];

function evaluate(ctx) {
  // === HG-TASK-05 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const tasks = ctx.tasks || [];

  if (tasks.length === 0) {
    return pass("Gate not triggered  --  no tasks to evaluate");
  }

  // Collect all failures for combined error message

  const failures = [];
  // Iterate over each task to check compliance
  for (const task of tasks) {
    if (!VALID_STATUSES.includes(task.status)) {
      failures.push(task.id + " has invalid status \"" + task.status + "\". Valid values: " + VALID_STATUSES.join(", "));
    }
  }

  if (failures.length === 0) {
    return pass("All " + tasks.length + " tasks have valid status values");
  }
  return fail(failures.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };