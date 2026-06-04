/**
 * SG-IMPL-04
 * Phase: IMPL
 * Type: SOFT
 *
 * Checks bypasses/deferred work are documented in exceptions_logged.
 *
 * Pass when:
 *   No bypasses mentioned OR exceptions are documented.
 *
 * Fail if:
 *   Task notes mention bypasses but exceptions_logged is empty.
 *
 * Example output:
 *   [PASS] SG-IMPL-04 -- <pass message>
 *   [FAIL] SG-IMPL-04 -- <failure details>
 */

"use strict";

const gate_id = "SG-IMPL-04";
const name = "Incomplete Exception Log";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === SG-IMPL-04 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  var impl = ctx.impl || {};
  var exceptions = impl.exceptions_logged || [];

  // Check if there are bypassed rules or deferred tasks that should be logged
  var hintOfExceptions = false;
  var tasks = ctx.tasks || [];
  // Iterate over each task to check compliance
  for (var i = 0; i < tasks.length; i++) {
    var notes = ((tasks[i].notes || "") + " " + (tasks[i].description || "")).toLowerCase();
    if (notes.indexOf("bypass") !== -1 || notes.indexOf("defer") !== -1 || notes.indexOf("skipped") !== -1 || notes.indexOf("exception") !== -1 || notes.indexOf("workaround") !== -1) {
      hintOfExceptions = true;
      break;
    }
  }

  if (hintOfExceptions && (!exceptions || exceptions.length === 0)) {
    return fail("Task notes mention bypasses/deferred work but exceptions_logged table is empty");
  }

  return pass("Exception log reviewed");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };