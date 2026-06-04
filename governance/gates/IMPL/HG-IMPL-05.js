/**
 * HG-IMPL-05
 * Phase: IMPL
 * Type: HARD
 *
 * Checks integration tasks have confirmed error handling.
 *
 * Pass when:
 *   All integration tasks have error handling confirmed.
 *
 * Fail if:
 *   An integration task has no mention of error handling.
 *
 * Example output:
 *   [PASS] HG-IMPL-05 -- <pass message>
 *   [FAIL] HG-IMPL-05 -- <failure details>
 */

"use strict";

const gate_id = "HG-IMPL-05";
const name = "Missing Error Handling";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-IMPL-05 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  var tasks = ctx.tasks || [];

  var integrationTasks = tasks.filter(function(t) {
    var desc = ((t.description || "") + " " + (t.title || "")).toLowerCase();
    return /api|endpoint|database|external|integration|service|kms|client/i.test(desc);
  });

  if (integrationTasks.length === 0) {
    return pass("Gate not triggered  --  no integration tasks to evaluate");
  }

  var impl = ctx.impl || {};
  var taskNotes = impl.task_notes || {};

  // Collect all failures for combined error message

  var failures = [];
  for (var i = 0; i < integrationTasks.length; i++) {
    var t = integrationTasks[i];
    var notes = (taskNotes[t.id] || "").toLowerCase();
    var desc = ((t.description || "") + " " + (t.title || "")).toLowerCase();
    if (notes.indexOf("error handl") === -1 && notes.indexOf("try/catch") === -1 && notes.indexOf("try catch") === -1) {
      // Check if error handling was part of the task description itself
      if (desc.indexOf("error handl") === -1 && desc.indexOf("try") === -1 && desc.indexOf("fallback") === -1 && desc.indexOf("catch") === -1) {
        failures.push(t.id + " (" + t.title + ")  --  integration task but no error handling confirmed");
      }
    }
  }

  if (failures.length === 0) {
    return pass("Error handling confirmed for all integration tasks");
  }
  return fail(failures.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };