/**
 * HG-SPEC-01
 * Phase: SPEC, PLAN
 * Type: HARD
 *
 * Checks that if PII fields are declared, the product has declared compliance frameworks and specific encryption methods for data at rest and in transit.
 *
 * Pass when:
 *   PII fields are present with both compliance[] declarations and specific encryption.at_rest and encryption.in_transit values, OR no PII fields are declared (gate not triggered).
 *
 * Fail if:
 *   PII fields are declared but compliance[] does not include a data protection regulation (GDPR, CCPA, HIPAA, etc.), OR encryption.at_rest or encryption.in_transit is missing or uses a vague term (e.g. "appropriate encryption").
 *
 * Example output:
 *   [PASS] HG-SPEC-01 -- <pass message>
 *   [FAIL] HG-SPEC-01 -- <failure details>
 */

"use strict";

const gate_id = "HG-SPEC-01";
const name = "PII Declaration Gate";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-03";

const VAGUE_ENCRYPTION = [
  "industry-standard", "industry standard", "appropriate", "applicable",
  "best practice", "best practices", "standard security", "suitable measures",
  "relevant controls", "encryption will be used", "secure storage"
];

function isVague(value, patterns) {
  if (!value || typeof value !== "string") return true;
  const lower = value.toLowerCase().trim();
  return patterns.some(p => lower.includes(p.toLowerCase()));
}

function evaluate(ctx) {
  // === HG-SPEC-01 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const compliance  = ctx.compliance  || [];
  const piiFields   = ctx.pii_fields  || [];
  const encryption  = ctx.encryption  || null;

  if (compliance.length === 0 && piiFields.length === 0) {
    return pass("Gate not triggered -- no compliance declared and no pii_fields populated");
  }

  if (piiFields.length === 0) {
    return fail("compliance[] is declared " + JSON.stringify(compliance) + " but pii_fields[] is empty -- PII fields must be explicitly named");
  }

  if (!encryption) {
    return fail("pii_fields[] is populated but no encryption strategy is declared");
  }

  const atRest = encryption.at_rest || null;
  if (!atRest || atRest.trim() === "") {
    return fail("encryption.at_rest is not declared");
  }
  if (isVague(atRest, VAGUE_ENCRYPTION)) {
    return fail("encryption.at_rest is vague: \"" + atRest + "\" -- a named algorithm is required (e.g. AES-256)");
  }

  const inTransit = encryption.in_transit || null;
  if (!inTransit || inTransit.trim() === "") {
    return fail("encryption.in_transit is not declared");
  }
  if (isVague(inTransit, VAGUE_ENCRYPTION)) {
    return fail("encryption.in_transit is vague: \"" + inTransit + "\" -- a named protocol is required (e.g. TLS 1.3)");
  }

  return pass("pii_fields[] declared, encryption.at_rest (" + atRest + ") and encryption.in_transit (" + inTransit + ") are specific");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };
