/**
 * HG-IMPL-06
 * Phase: IMPL
 * Type: HARD
 *
 * Checks all tasks are marked complete in implementation.
 *
 * Pass when:
 *   All tasks have a task_coverage entry marked complete.
 *
 * Fail if:
 *   Any task is missing from coverage or has non-complete status.
 *
 * Example output:
 *   [PASS] HG-IMPL-06 -- <pass message>
 *   [FAIL] HG-IMPL-06 -- <failure details>
 */

"use strict";

const gate_id = "HG-IMPL-06";
const name = "Incomplete Task Coverage";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-IMPL-06 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  var tasks = ctx.tasks || [];
  var impl = ctx.impl || {};
  var taskCoverage = impl.task_coverage || {};

  if (tasks.length === 0) {
    return pass("Gate not triggered  --  no tasks defined");
  }

  // Collect all failures for combined error message

  var failures = [];
  // Iterate over each task to check compliance
  for (var i = 0; i < tasks.length; i++) {
    var t = tasks[i];
    var status = taskCoverage[t.id];
    if (!status || status.toLowerCase() !== "complete") {
      failures.push(t.id + " (" + t.title + ") is not marked complete in implementation");
    }
  }

  if (failures.length === 0) {
    return pass("All " + tasks.length + " tasks complete");
  }
  return fail(failures.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };