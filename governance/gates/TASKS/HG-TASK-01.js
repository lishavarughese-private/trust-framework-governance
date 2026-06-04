/**
 * HG-TASK-01
 * Phase: TASKS, IMPL
 * Type: HARD
 *
 * Checks that every task has a non-empty maps_to_requirement field referencing a valid requirement ID from SPEC.json.
 *
 * Pass when:
 *   All tasks have a non-empty maps_to_requirement and every referenced requirement ID exists in the requirements list.
 *
 * Fail if:
 *   Any task has an empty/null maps_to_requirement, OR any task references a requirement ID that does not exist in SPEC.json requirements[].
 *
 * Example output:
 *   [PASS] HG-TASK-01 -- <pass message>
 *   [FAIL] HG-TASK-01 -- <failure details>
 */

"use strict";

const gate_id = "HG-TASK-01";
const name = "Tasks Not Mapped to Requirements";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-TASK-01 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const tasks        = ctx.tasks        || [];
  const requirements = ctx.requirements || [];

  if (tasks.length === 0) {
    return pass("Gate not triggered  --  no tasks to evaluate");
  }

  // Collect all failures for combined error message

  const failures = [];
  // Iterate over each task to check compliance
  for (const task of tasks) {
    const mapping = task.maps_to_requirement;
    if (!mapping || (typeof mapping === "string" && mapping.trim() === "")) {
      failures.push(task.id + " has empty or null maps_to_requirement");
      continue;
    }
    const exists = requirements.some(r => r.id === mapping);
    if (!exists) {
      failures.push(task.id + " maps_to_requirement references \"" + mapping + "\" which does not exist in SPEC.json requirements[]");
    }
  }

  if (failures.length === 0) {
    return pass("All " + tasks.length + " tasks mapped to valid requirements");
  }
  return fail(failures.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; } //{ gate: "HG-TASK-01", result: "PASS", reason: "message" }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate }; //This makes the gate's data and evaluate function available to the evaluator engine (evaluate-phase.js), so it can call evaluate(ctx) and get back the result.