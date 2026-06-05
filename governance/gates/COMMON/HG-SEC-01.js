/**
 * HG-SEC-01
 * Phase: ALL (COMMON)
 * Type: HARD
 *
 * Scans source files for hardcoded secrets, credentials, and PII.
 *
 * Pass when:
 *   All scanned files are free of hardcoded API keys, passwords, tokens,
 *   connection strings with credentials, and PII (emails, SSNs, card numbers).
 *
 * Fail if:
 *   Any of the following patterns are found in source files.
 *
 *   NOTE: Comments are NOT skipped. Commented-out secrets still represent
 *   a governance gap and are flagged as findings.
 */

"use strict";

const gate_id = "HG-SEC-01";
const name = "Hardcoded Secrets & PII Gate";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-03";

const SECRET_PATTERNS = [
  { name: "Stripe API key",                regex: /sk_live_|sk_test_|rk_live_|rk_test_|whsec_/ },
  { name: "AWS Access Key ID",             regex: /(?:AKIA|ASIA)[0-9A-Z]{16}/ },
  { name: "GitHub token",                  regex: /ghp_|gho_|ghu_|ghs_|ghr_[A-Za-z0-9]{36}/ },
  { name: "Slack token",                   regex: /xox[bpras]-[A-Za-z0-9\-]+/ },
  { name: "Google API key",                regex: /AIza[0-9A-Za-z\-_]{35}/ },
  { name: "Twilio API key",                regex: /SK[0-9a-fA-F]{32}/ },
  { name: "JWT token",                     regex: /eyJ[A-Za-z0-9\-_]+\.eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+/ },
  { name: "SSH private key",              regex: /-----BEGIN (?:RSA|DSA|EC|OPENSSH) PRIVATE KEY-----/ },
  { name: "Generic key/token assignment",  regex: /(?:api_?key|api_?secret|access_?key|access_?token|auth_?token|bearer|token|credential)s?\s*[:=]\s*["\'][^"\']{8,}["\']/i },
  { name: "Generic password assignment",   regex: /(?:password|pwd|passwd)\s*[:=]\s*["\'][^"\']{3,}["\']/i },
  { name: "Generic secret assignment",     regex: /(?:secret|SECRET)\s*[:=]\s*["\'][^"\']{3,}["\']/ },
  { name: "Connection string with credentials", regex: /:\/\/[^:]+:[^@]+@/ },
  { name: "Email address",                 regex: /[a-zA-Z0-9._%+-]+@(?!(?:example\.(?:com|org|net)))[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i },
  { name: "Social Security Number",        regex: /\b\d{3}-\d{2}-\d{4}\b/ },
  { name: "Credit card (Visa/MC/Discover 16-digit)", regex: /(?:^|[^0-9a-fA-F-])(?:4[0-9]{3}|5[1-5][0-9]{2}|6011)(?:[\s-]?[0-9]{4}){3}(?:$|[^0-9a-fA-F-])/ },
  { name: "Credit card (Amex 15-digit)",        regex: /(?:^|[^0-9a-fA-F-])3[47][0-9]{2}[\s-]?[0-9]{6}[\s-]?[0-9]{5}(?:$|[^0-9a-fA-F-])/ },
  { name: "Suspicious key-like literal",   regex: /["\'][A-Za-z0-9_\-]{20,}["\']\s*[;)]?\s*$/ },
];

function isIgnoredLine(line) {
  if (line.includes("process.env")) return true;
  return false;
}

function evaluate(ctx) {
  const files = ctx.files || [];
  if (files.length === 0) {
    return pass("Gate not triggered - no files to scan");
  }
  const findings = [];
  for (const file of files) {
    const content = file.content || "";
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (isIgnoredLine(line)) continue;
      for (const pattern of SECRET_PATTERNS) {
        if (pattern.regex.test(line)) {
          findings.push(
            pattern.name + " found in " + file.path + " line " + (i + 1) + ': "' +
            line.trim().substring(0, 80) + '"'
          );
          break;
        }
      }
    }
  }
  if (findings.length === 0) {
    return pass("No hardcoded secrets or PII found in scanned files");
  }
  return fail(findings.join("\n"));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };
