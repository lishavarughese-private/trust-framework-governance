/**
 * HG-SPEC-03
 * Phase: SPEC, PLAN
 * Type: HARD
 *
 * Checks that if admin or privileged capabilities are present, a specific authentication method is declared (not vague).
 *
 * Pass when:
 *   No admin/privileged capability is present (gate not triggered), OR admin capability IS present with a specific authentication method declared.
 *
 * Fail if:
 *   Admin capability is present but authentication is missing, empty, or uses a vague phrase.
 *
 * Example output:
 *   [PASS] HG-SPEC-03 -- <pass message>
 *   [FAIL] HG-SPEC-03 -- <failure details>
 */

"use strict";

const gate_id = "HG-SPEC-03";
const name = "Admin Authentication Gate";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-05";

const VAGUE_AUTH = [
  "appropriate access controls", "suitable controls",
  "access controls will be in place", "security measures",
  "authorised personnel only", "appropriate security", "relevant measures"
];

function isVague(value, patterns) {
  if (!value || typeof value !== "string") return true;
  const lower = value.toLowerCase().trim();
  return patterns.some(p => lower.includes(p.toLowerCase()));
}

function evaluate(ctx) {
  // === HG-SPEC-03 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const adminPresent = ctx.admin_capability_present === true;
  const auth         = ctx.authentication || null;

  if (!adminPresent) {
    return pass("Gate not triggered  --  no admin or privileged capability present");
  }

  if (!auth || auth.trim() === "") {
    return fail("Admin capability is present but no authentication requirement is declared");
  }

  if (isVague(auth, VAGUE_AUTH)) {
    return fail("Authentication declaration is vague: \"" + auth + "\"  --  a specific method is required (e.g. MFA via TOTP, OAuth 2.0 + RBAC)");
  }

  return pass("Admin capability present, specific authentication declared: \"" + auth + "\"");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };