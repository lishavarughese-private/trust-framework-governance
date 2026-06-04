/**
 * SG-IMPL-02
 * Phase: IMPL
 * Type: SOFT
 *
 * Scans task notes for UI consistency concerns.
 *
 * Pass when:
 *   No UI consistency concerns found.
 *
 * Fail if:
 *   Task notes mention inconsistent spacing, missing aria, visual bugs, etc.
 *
 * Example output:
 *   [PASS] SG-IMPL-02 -- <pass message>
 *   [FAIL] SG-IMPL-02 -- <failure details>
 */

"use strict";

const gate_id = "SG-IMPL-02";
const name = "Minor UI Inconsistencies";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === SG-IMPL-02 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  var impl = ctx.impl || {};
  var taskNotes = impl.task_notes || {};

  var concerns = ["inconsistent spacing", "inconsistent typography", "non-standard component", "accessibility gap", "missing aria", "poor contrast", "ui inconsistency", "visual bug"];

  var warnings = [];
  for (var taskId in taskNotes) {
    var notes = (taskNotes[taskId] || "").toLowerCase();
    for (var i = 0; i < concerns.length; i++) {
      if (notes.indexOf(concerns[i]) !== -1) {
        warnings.push(taskId + "  --  " + concerns[i] + " noted in implementation");
        break;
      }
    }
  }

  if (warnings.length === 0) {
    return pass("No UI consistency concerns noted");
  }
  return fail(warnings.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };