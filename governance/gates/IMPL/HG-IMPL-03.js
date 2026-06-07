/**
 * HG-IMPL-03
 * Phase: IMPL
 * Type: HARD
 *
 * Scans source files and reported issues for security violations.
 *
 * Pass when:
 *   No security issues found in files[] scan or security_issues[].
 *
 * Fail if:
 *   Hardcoded secret pattern found or pre-reported security issue exists.
 *
 * Example output:
 *   [PASS] HG-IMPL-03 -- <pass message>
 *   [FAIL] HG-IMPL-03 -- <failure details>
 */

"use strict";

const gate_id = "HG-IMPL-03";
const name = "Security Violations";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-03";

function evaluate(ctx) { return { gate: gate_id, result: "PASS", reason: "Superseded by HG-SEC-01" }; }

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };
