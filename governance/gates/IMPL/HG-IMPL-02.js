/**
 * HG-IMPL-02
 * Phase: IMPL
 * Type: HARD
 *
 * Checks that zero console errors are confirmed at runtime.
 *
 * Pass when:
 *   console_errors is explicitly false or no.
 *
 * Fail if:
 *   console_errors is missing/undefined or true/yes.
 *
 * Example output:
 *   [PASS] HG-IMPL-02 -- <pass message>
 *   [FAIL] HG-IMPL-02 -- <failure details>
 */

"use strict";

const gate_id = "HG-IMPL-02";
const name = "Console Errors";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-IMPL-02 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  var impl = ctx.impl || {};
  var consoleErrors = impl.console_errors;

  if (consoleErrors === undefined || consoleErrors === null) {
    return fail("IMPL phase must explicitly confirm zero console errors at runtime");
  }

  if (consoleErrors === true || (typeof consoleErrors === "string" && consoleErrors.toLowerCase() === "yes")) {
    return fail("Unresolved console errors reported");
  }

  return pass("Zero console errors confirmed");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };