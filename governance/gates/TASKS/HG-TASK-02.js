/**
 * HG-TASK-02
 * Phase: TASKS, IMPL
 * Type: HARD
 *
 * Checks that every task has a non-empty acceptance_criteria array.
 *
 * Pass when:
 *   All tasks have an acceptance_criteria array with at least one entry.
 *
 * Fail if:
 *   Any task has an empty, missing, or null acceptance_criteria field.
 *
 * Example output:
 *   [PASS] HG-TASK-02 -- <pass message>
 *   [FAIL] HG-TASK-02 -- <failure details>
 */

"use strict";

const gate_id = "HG-TASK-02";
const name = "Missing Acceptance Criteria";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-TASK-02 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const tasks = ctx.tasks || [];

  if (tasks.length === 0) {
    return pass("Gate not triggered  --  no tasks to evaluate");
  }

  // Collect all failures for combined error message

  const failures = [];
  // Iterate over each task to check compliance
  for (const task of tasks) {
    const ac = task.acceptance_criteria;
    if (!ac || !Array.isArray(ac) || ac.length === 0) {
      failures.push(task.id + " has empty or missing acceptance_criteria");
    }
  }

  if (failures.length === 0) {
    return pass("All " + tasks.length + " tasks have acceptance criteria");
  }
  return fail(failures.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };