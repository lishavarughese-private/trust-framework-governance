/**
 * SG-TASK-02
 * Phase: TASKS, IMPL
 * Type: SOFT
 *
 * Checks that task descriptions are sufficiently detailed and not just restating the title.
 *
 * Pass when:
 *   All task descriptions are at least 20 characters long and contain more than just the task title.
 *
 * Fail if:
 *   Any task has a description shorter than 20 characters, or the description only restates the title verbatim.
 *
 * Example output:
 *   [PASS] SG-TASK-02 -- <pass message>
 *   [FAIL] SG-TASK-02 -- <failure details>
 */

"use strict";

const gate_id = "SG-TASK-02";
const name = "Unclear Task Descriptions";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === SG-TASK-02 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const tasks = ctx.tasks || [];
  const warnings = [];

  // Iterate over each task to check compliance
  for (const task of tasks) {
    const desc = task.description || "";
    const title = task.title || "";

    if (desc.trim().length < 20) {
      warnings.push(task.id + " description is too short (" + desc.length + " chars). Minimum 20 characters recommended.");
    } else if (desc.trim().toLowerCase() === title.trim().toLowerCase()) {
      warnings.push(task.id + " description only restates the title. Add implementation context.");
    }
  }

  if (warnings.length === 0) {
    return pass("All task descriptions are clear and detailed");
  }
  return fail(warnings.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };