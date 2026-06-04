/**
 * SG-IMPL-01
 * Phase: IMPL
 * Type: SOFT
 *
 * Scans task notes for performance concerns.
 *
 * Pass when:
 *   No performance terms found in task notes.
 *
 * Fail if:
 *   Task notes mention N+1, unindexed, synchronous, bundle size, or memory leaks.
 *
 * Example output:
 *   [PASS] SG-IMPL-01 -- <pass message>
 *   [FAIL] SG-IMPL-01 -- <failure details>
 */

"use strict";

const gate_id = "SG-IMPL-01";
const name = "Minor Performance Issues";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === SG-IMPL-01 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  var impl = ctx.impl || {};
  var taskNotes = impl.task_notes || {};

  var concerns = ["n+1", "n plus 1", "unindexed", "no index", "synchronous", "blocking", "hot path", "bundle size", "large payload", "memory leak"];

  var warnings = [];
  for (var taskId in taskNotes) {
    var notes = (taskNotes[taskId] || "").toLowerCase();
    for (var i = 0; i < concerns.length; i++) {
      if (notes.indexOf(concerns[i]) !== -1) {
        warnings.push(taskId + "  --  mentions \"" + concerns[i] + "\" (" + taskNotes[taskId].substring(0, 80) + ")");
        break;
      }
    }
  }

  if (warnings.length === 0) {
    return pass("No performance concerns noted in implementation");
  }
  return fail(warnings.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };