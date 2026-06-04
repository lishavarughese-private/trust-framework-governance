/**
 * HG-SPEC-04
 * Phase: SPEC, PLAN
 * Type: HARD
 *
 * Checks that if user data is stored, a specific retention policy or deletion period is declared (not vague).
 *
 * Pass when:
 *   No user data is stored (gate not triggered), OR user data IS stored with a specific retention policy declared.
 *
 * Fail if:
 *   User data is stored but retention_policy is missing, empty, or uses a vague phrase.
 *
 * Example output:
 *   [PASS] HG-SPEC-04 -- <pass message>
 *   [FAIL] HG-SPEC-04 -- <failure details>
 */

"use strict";

const gate_id = "HG-SPEC-04";
const name = "Data Retention Declaration Gate";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-06";

const VAGUE_RETENTION = [
  "as long as necessary", "for an appropriate period", "in line with regulations",
  "per policy", "as required", "reasonable period", "until no longer needed",
  "as needed", "appropriate timeframe"
];

function isVague(value, patterns) {
  if (!value || typeof value !== "string") return true;
  const lower = value.toLowerCase().trim();
  return patterns.some(p => lower.includes(p.toLowerCase()));
}

function evaluate(ctx) {
  // === HG-SPEC-04 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const userDataStored  = ctx.user_data_stored === true;
  const retentionPolicy = ctx.retention_policy || null;

  if (!userDataStored) {
    return pass("Gate not triggered  --  no user data storage requirement present");
  }

  if (!retentionPolicy || retentionPolicy.trim() === "") {
    return fail("User data is stored but no retention policy or deletion period is declared");
  }

  if (isVague(retentionPolicy, VAGUE_RETENTION)) {
    return fail("Retention policy is vague: \"" + retentionPolicy + "\"  --  a specific period or event trigger is required (e.g. '90 days from last activity')");
  }

  return pass("User data stored, specific retention policy declared: \"" + retentionPolicy + "\"");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };