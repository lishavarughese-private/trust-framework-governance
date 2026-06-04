/**
 * HG-IMPL-01
 * Phase: IMPL
 * Type: HARD
 *
 * Checks that test results exist and all pass.
 *
 * Pass when:
 *   At least one test result exists and all results are Pass.
 *
 * Fail if:
 *   No test results OR any result shows Fail.
 *
 * Example output:
 *   [PASS] HG-IMPL-01 -- <pass message>
 *   [FAIL] HG-IMPL-01 -- <failure details>
 */

"use strict";

const gate_id = "HG-IMPL-01";
const name = "Failing Tests";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-IMPL-01 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  var impl = ctx.impl || {};

  // Try to get test results from ctx (populated by CLI from IMPL.md or ctx.impl)
  var testResults = impl.test_results || [];

  if (testResults.length === 0) {
    return fail("No test results found. Test results table must have at least one row.");
  }

  var failing = [];
  for (var i = 0; i < testResults.length; i++) {
    var tr = testResults[i];
    if ((tr.result || "").toLowerCase() === "fail") {
      failing.push(tr.test || tr.name || ("Test #" + (i + 1)));
    }
  }

  if (failing.length > 0) {
    return fail(failing.length + " test(s) are failing: " + failing.join(", "));
  }

  return pass("All " + testResults.length + " tests passing");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };