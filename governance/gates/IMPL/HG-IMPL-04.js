/**
 * HG-IMPL-04
 * Phase: IMPL
 * Type: HARD
 *
 * Checks all requirements are covered in implementation.
 *
 * Pass when:
 *   All requirements have a coverage entry with status covered.
 *
 * Fail if:
 *   Any requirement is missing from coverage or has non-covered status.
 *
 * Example output:
 *   [PASS] HG-IMPL-04 -- <pass message>
 *   [FAIL] HG-IMPL-04 -- <failure details>
 */

"use strict";

const gate_id = "HG-IMPL-04";
const name = "Missing Requirement Coverage";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-IMPL-04 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  var spec = ctx.spec || {};
  var requirements = spec.requirements || [];
  var impl = ctx.impl || {};
  var coverage = impl.requirement_coverage || [];

  if (requirements.length === 0) {
    return pass("Gate not triggered  --  no requirements defined");
  }

  var coveredReqs = {};
  for (var i = 0; i < coverage.length; i++) {
    var c = coverage[i];
    if ((c.status || "").toLowerCase() === "covered") {
      coveredReqs[c.requirement_id || c.id] = true;
    }
  }

  // Collect all failures for combined error message

  var failures = [];
  for (var j = 0; j < requirements.length; j++) {
    if (!coveredReqs[requirements[j].id]) {
      failures.push(requirements[j].id + " is not covered in implementation");
    }
  }

  if (failures.length === 0) {
    return pass("All " + requirements.length + " requirements covered in implementation");
  }
  return fail(failures.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };