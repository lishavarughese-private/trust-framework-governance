/**
 * HG-IMPL-07
 * Phase: IMPL
 * Type: HARD
 *
 * Checks all deployment checklist items are checked.
 *
 * Pass when:
 *   All checklist items are checked or complete.
 *
 * Fail if:
 *   Checklist is empty or any item is unchecked.
 *
 * Example output:
 *   [PASS] HG-IMPL-07 -- <pass message>
 *   [FAIL] HG-IMPL-07 -- <failure details>
 */

"use strict";

const gate_id = "HG-IMPL-07";
const name = "Deployment Checklist Incomplete";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-IMPL-07 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  var impl = ctx.impl || {};
  var checklist = impl.deployment_checklist || [];

  if (checklist.length === 0) {
    return fail("Deployment checklist is empty  --  all items must be checked before deploy");
  }

  var unchecked = [];
  for (var i = 0; i < checklist.length; i++) {
    var item = checklist[i];
    if (item.checked !== true && (item.status || "").toLowerCase() !== "complete" && (item.status || "").toLowerCase() !== "done") {
      unchecked.push(item.name || item.item || ("Item #" + (i + 1)));
    }
  }

  if (unchecked.length > 0) {
    return fail("Deployment checklist has " + unchecked.length + " unchecked item(s): " + unchecked.join(", "));
  }

  return pass("All " + checklist.length + " deployment checklist items checked");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };