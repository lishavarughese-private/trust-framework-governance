/**
 * HG-SPEC-05
 * Phase: SPEC, PLAN
 * Type: HARD
 *
 * Checks for contradictory requirement pairs in the specification.
 *
 * Pass when:
 *   No contradictory pairs are found in ctx.contradictions[].
 *
 * Fail if:
 *   One or more contradictory requirement pairs are present in ctx.contradictions[]. Each must be manually resolved by a human.
 *
 * Example output:
 *   [PASS] HG-SPEC-05 -- <pass message>
 *   [FAIL] HG-SPEC-05 -- <failure details>
 */

"use strict";

const gate_id = "HG-SPEC-05";
const name = "Requirement Contradiction Gate";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-07";

function evaluate(ctx) {
  // === HG-SPEC-05 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const contradictions = ctx.contradictions || [];

  if (contradictions.length === 0) {
    return pass("No contradictory requirement pairs found");
  }

  const descriptions = contradictions.map(c =>
    c.req_a + " vs " + c.req_b + " (" + (c.property || "unspecified property") + "): " + (c.description || "")
  );

  return fail(contradictions.length + " contradictory requirement pair(s) found  --  all must be resolved by the human:\n" +
    descriptions.map((d, i) => "  " + (i + 1) + ". " + d).join("\n"));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };