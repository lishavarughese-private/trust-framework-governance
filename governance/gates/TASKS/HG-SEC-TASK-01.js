/**
 * HG-SEC-TASK-01
 * Phase: TASKS, IMPL
 * Type: HARD
 *
 * Checks that any task touching security-sensitive areas (auth, PII, payments,
 * admin, tokens, passwords, data deletion) has at least one acceptance criterion
 * that references a specific security control.
 *
 * Pass when:
 *   No security-sensitive tasks exist (gate not triggered), OR every
 *   security-sensitive task has at least one acceptance criterion mentioning
 *   security terms (hashed, encrypted, rate-limited, audit, permission,
 *   access control, signed, validated, sanitised, role, scope, expiry, TTL).
 *
 * Fail if:
 *   A security-sensitive task exists with acceptance criteria that contain
 *   no security-specific terms.
 *
 * Example output:
 *   [PASS] HG-SEC-TASK-01 -- <pass message>
 *   [FAIL] HG-SEC-TASK-01 -- TASK-005 has security-sensitive title "Implement login endpoint"
 *          but none of its acceptance criteria mention security controls
 */

"use strict";

const gate_id = "HG-SEC-TASK-01";
const name = "Security Acceptance Criteria Required";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-05";

// Keywords in task title/description/requirement that flag it as security-sensitive
const SENSITIVE_KEYWORDS = [
  /login/i, /password/i, /auth/i, /token/i, /session/i,
  /admin/i, /payment/i, /card/i, /pii/i, /personal/i,
  /delete.*data/i, /gdpr/i, /privacy/i, /encrypt/i,
  /api.?key/i, /credential/i, /permission/i, /role/i,
  /oauth/i, /jwt/i, /secret/i, /signup/i, /register/i,
  /reset/i, /recover/i
];

// Terms in acceptance criteria that indicate a security control
const SECURITY_TERMS = [
  /hashed/i, /encrypted/i, /rate.?limit/i, /audit/i,
  /access.?control/i, /signed/i, /validated/i, /sanitised/i,
  /sanitized/i, /role.?check/i, /scope/i, /expir/i,
  /ttl/i, /timeout/i, /locked/i, /captcha/i,
  /2fa/i, /mfa/i, /otp/i, /permission.?check/i,
  /authorization/i, /authentication/i, /brute.?force/i,
  /throttle/i, /cors/i, /csrf/i, /xss/i, /injection/i,
  /secure/i, /verify/i, /revoke/i
];

function evaluate(ctx) {
  const tasks = ctx.tasks || [];
  const requirements = ctx.requirements || [];

  if (tasks.length === 0) {
    return pass("Gate not triggered -- no tasks to evaluate");
  }

  const failures = [];

  for (const task of tasks) {
    // Build combined text to check: title + description + mapped requirement
    const taskText = (task.title || "") + " " + (task.description || "");
    const reqText = requirements
      .filter(r => r.id === task.maps_to_requirement)
      .map(r => (r.title || "") + " " + (r.description || ""))
      .join(" ");

    const combined = taskText + " " + reqText;

    // Check if this task is security-sensitive
    const isSensitive = SENSITIVE_KEYWORDS.some(kw => kw.test(combined));

    if (!isSensitive) continue; // not security-sensitive, skip

    // Check acceptance criteria for security terms
    const criteria = task.acceptance_criteria || [];
    if (criteria.length === 0) {
      failures.push(task.id + " has security-sensitive context but NO acceptance criteria");
      continue;
    }

    const hasSecurityCriterion = criteria.some(c => {
      return SECURITY_TERMS.some(term => term.test(c));
    });

    if (!hasSecurityCriterion) {
      failures.push(
        task.id + ' "' + (task.title || "") +
        '" has security-sensitive context but none of its ' + criteria.length +
        ' acceptance criteria mention a specific security control. ' +
        'Add a criterion such as: "Passwords are hashed with bcrypt", ' +
        '"Tokens expire after 15 minutes", "Access is role-checked", etc.'
      );
    }
  }

  if (failures.length === 0) {
    return pass("All security-sensitive tasks have acceptance criteria with security controls");
  }
  return fail(failures.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };
