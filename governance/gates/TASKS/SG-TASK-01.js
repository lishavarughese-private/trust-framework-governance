/**
 * SG-TASK-01
 * Phase: TASKS, IMPL
 * Type: SOFT
 *
 * Checks that no task has an estimated effort exceeding 2 days.
 *
 * Pass when:
 *   All tasks have an estimated_effort of 2 days or less, or use a non-day-based format (e.g. hours).
 *
 * Fail if:
 *   Any task has estimated_effort exceeding 2 days (e.g. '3d', '5 days').
 *
 * Example output:
 *   [PASS] SG-TASK-01 -- <pass message>
 *   [FAIL] SG-TASK-01 -- <failure details>
 */

"use strict";

const gate_id = "SG-TASK-01";
const name = "Tasks Too Large";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === SG-TASK-01 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const tasks = ctx.tasks || [];
  const warnings = [];

  // Iterate over each task to check compliance
  for (const task of tasks) {
    const effort = (task.estimated_effort || "").toLowerCase();
    const dayMatch = effort.match(/^(\d+)\s*d(?:ay)?s?$/);
    if (dayMatch && parseInt(dayMatch[1]) > 2) {
      warnings.push(task.id + " is estimated at " + task.estimated_effort + " (" + dayMatch[1] + " days). Consider splitting into sub-tasks of 2 days or less.");
    }
  }

  if (warnings.length === 0) {
    return pass("All tasks within size threshold");
  }
  return fail(warnings.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };