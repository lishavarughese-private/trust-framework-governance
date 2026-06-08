/**
 * SG-SPEC-03
 * Phase: SPEC
 * Type: SOFT
 *
 * Checks that the specification defines measurable success criteria.
 *
 * Pass when:
 *   spec.success_criteria is a non-empty array of measurable outcomes.
 *
 * Fail if:
 *   Success criteria missing, empty, or too vague (all criteria too short).
 */

"use strict";

const gate_id = "SG-SPEC-03";
const name = "No Success Criteria";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-01";

function evaluate(ctx) {
  const spec = ctx.spec || {};
  const criteria = spec.success_criteria;

  if (!criteria || !Array.isArray(criteria) || criteria.length === 0) {
    return fail("No success criteria defined. Add at least 1 measurable success criterion.");
  }

  const vagueCriteria = criteria.filter(function(c) { return (c || "").trim().length < 15; });
  if (vagueCriteria.length > 0) {
    return fail(vagueCriteria.length + " success criterion/criteria too vague (under 15 characters). Provide specific, measurable outcomes.");
  }

  return pass(criteria.length + " success criteria defined.");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };
