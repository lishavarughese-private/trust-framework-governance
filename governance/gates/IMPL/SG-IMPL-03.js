/**
 * SG-IMPL-03
 * Phase: IMPL
 * Type: SOFT
 *
 * Checks complex-logic tasks have inline comments confirmed.
 *
 * Pass when:
 *   All complex-logic tasks have comments confirmed.
 *
 * Fail if:
 *   A complex-logic task has no mention of comments in notes.
 *
 * Example output:
 *   [PASS] SG-IMPL-03 -- <pass message>
 *   [FAIL] SG-IMPL-03 -- <failure details>
 */

"use strict";

const gate_id = "SG-IMPL-03";
const name = "Missing Inline Comments for Complex Logic";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === SG-IMPL-03 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  var tasks = ctx.tasks || [];
  var impl = ctx.impl || {};
  var taskNotes = impl.task_notes || {};

  var complexTasks = tasks.filter(function(t) {
    var desc = ((t.description || "") + " " + (t.title || "")).toLowerCase();
    return /algorithm|crypt|encrypt|decrypt|hash|kms|auth|token|oauth|jwt|sign|verify|permission|acl|regex|parse|transform|validat/i.test(desc);
  });

  var warnings = [];
  for (var i = 0; i < complexTasks.length; i++) {
    var t = complexTasks[i];
    var notes = (taskNotes[t.id] || "").toLowerCase();
    if (notes.indexOf("comment") === -1 && notes.indexOf("doc") === -1 && notes.indexOf("annotat") === -1) {
      warnings.push(t.id + " (" + t.title + ") involves complex logic but no comments confirmed");
    }
  }

  if (warnings.length === 0) {
    return pass("Complex logic tasks have comments confirmed");
  }
  return fail(warnings.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };