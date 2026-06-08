/**
 * SG-SPEC-04
 * Phase: SPEC, TASKS
 * Type: SOFT
 *
 * Checks that all tasks have acceptance criteria defined.
 *
 * Pass when:
 *   Every task in ctx.tasks[] has a non-empty acceptance_criteria array.
 *
 * Fail if:
 *   Any task has missing, null, or empty acceptance_criteria.
 */

"use strict";

const gate_id = "SG-SPEC-04";
const name = "Missing Acceptance Criteria";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  const tasks = ctx.tasks || [];

  if (tasks.length === 0) {
    return pass("No tasks to evaluate.");
  }

  const missingCriteria = [];
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    var ac = task.acceptance_criteria;
    if (!ac || !Array.isArray(ac) || ac.length === 0) {
      var taskId = task.id || "task-" + i;
      missingCriteria.push(taskId);
    }
  }

  if (missingCriteria.length === 0) {
    return pass("All " + tasks.length + " tasks have acceptance criteria.");
  }

  return fail(missingCriteria.length + " task(s) missing acceptance criteria: " + missingCriteria.join(", "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };
