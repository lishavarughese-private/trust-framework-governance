/**
 * HG-TASK-03
 * Phase: TASKS, IMPL
 * Type: HARD
 *
 * Checks that all task dependency references point to existing task IDs.
 *
 * Pass when:
 *   Every task's dependencies[] only contains IDs that exist in the tasks list.
 *
 * Fail if:
 *   Any task depends on a task ID that does not exist in tasks[].
 *
 * Example output:
 *   [PASS] HG-TASK-03 -- <pass message>
 *   [FAIL] HG-TASK-03 -- <failure details>
 */

"use strict";

const gate_id = "HG-TASK-03";
const name = "Invalid Task Dependencies";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-TASK-03 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const tasks = ctx.tasks || [];
  const validIds = new Set(tasks.map(t => t.id));

  if (tasks.length === 0) {
    return pass("Gate not triggered  --  no tasks to evaluate");
  }

  // Collect all failures for combined error message

  const failures = [];
  // Iterate over each task to check compliance
  for (const task of tasks) {
    const deps = task.dependencies || [];
    for (const dep of deps) {
      if (!validIds.has(dep)) {
        failures.push(task.id + " depends on \"" + dep + "\" which does not exist in tasks[]");
      }
    }
  }

  if (failures.length === 0) {
    return pass("All task dependencies reference valid existing tasks");
  }
  return fail(failures.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };