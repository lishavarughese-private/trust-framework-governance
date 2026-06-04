/**
 * HG-SPEC-06
 * Phase: SPEC, PLAN
 * Type: HARD
 *
 * Checks that the problem_statement field is present and is not a placeholder value.
 *
 * Pass when:
 *   problem_statement is a non-empty string that is not a recognised placeholder (TBD, TODO, N/A, etc.).
 *
 * Fail if:
 *   problem_statement is null, missing, empty, or contains only a placeholder value.
 *
 * Example output:
 *   [PASS] HG-SPEC-06 -- <pass message>
 *   [FAIL] HG-SPEC-06 -- <failure details>
 */

"use strict";

const gate_id = "HG-SPEC-06";
const name = "Problem Statement Gate";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

const PLACEHOLDER_PROBLEM = [
  "tbd", "todo", "n/a", "to be defined", "to be confirmed",
  "pending", "not yet defined", "placeholder"
];

function evaluate(ctx) {
  // === HG-SPEC-06 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const ps = ctx.problem_statement;

  if (ps === null || ps === undefined) {
    return fail("problem_statement field is missing or null");
  }

  if (typeof ps === "string" && ps.trim() === "") {
    return fail("problem_statement is an empty string");
  }

  if (PLACEHOLDER_PROBLEM.includes((ps || "").trim().toLowerCase())) {
    return fail("problem_statement is a placeholder value: \"" + ps + "\"");
  }

  return pass("problem_statement is present and non-placeholder: \"" +
    ps.substring(0, 60) + (ps.length > 60 ? "..." : "") + "\"");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };