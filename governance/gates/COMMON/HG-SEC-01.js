/**
 * HG-SEC-01
 * Phase: ALL (COMMON)
 * Type: HARD
 *
 * Scans source files for hardcoded secrets and credentials.
 *
 * Pass when:
 *   All scanned files are free of hardcoded API keys, passwords, connection strings with credentials, or tokens.
 *
 * Fail if:
 *   Any of the following patterns are found in source files: Stripe API keys (sk_live_/sk_test_), AWS Access Key IDs (AKIA...), GitHub personal access tokens (ghp_), password/secret variable assignments with literal values, or connection strings containing credentials.
 *
 * Example output:
 *   [PASS] HG-SEC-01 -- <pass message>
 *   [FAIL] HG-SEC-01 -- <failure details>
 */

"use strict";

const gate_id = "HG-SEC-01";
const name = "Hardcoded Secrets Gate";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-03";

/**
 * Patterns to detect hardcoded credentials in source files.
 * These match known API key formats and literal password/secret assignments.
 * NOTE: This is a static scan -- it checks for suspicious patterns, not runtime secrets.
 */
const SECRET_PATTERNS = [
  { name: "Stripe API key",                regex: /sk_live_|sk_test_/ },
  { name: "AWS Access Key ID",             regex: /AKIA[0-9A-Z]{16}/ },
  { name: "GitHub personal access token",  regex: /ghp_[A-Za-z0-9]{36}/ },
  { name: "Generic password assignment",   regex: /(?:password|pwd)\s*[:=]\s*["'"'"'][^"'"'"]{3,}["'"'"']/i },
  { name: "Generic secret assignment",     regex: /(?:secret|SECRET)\s*[:=]\s*["'"'"'][^"'"'"]{3,}["'"'"']/ },
  { name: "Connection string with credentials", regex: /:\/\/[^:]+:[^@]+@/ },
];

/**
 * Line must be skipped if it is:
 * - A comment line (//, #, /*)
 * - An environment variable reference (process.env)
 *
 * NOTE: We only skip the full line, not inline comments like `// password = "x" // TODO: move to env`
 * Those still fire because the first portion of the line matches before the inline comment.
 */
function isIgnoredLine(line) {
  var trimmed = line.trim();
  // Skip single-line comments and hashbang-style comments
  if (trimmed.startsWith("//") || trimmed.startsWith("#")) return true;
  // Skip the opening of block comments (conservative -- only if it starts at line beginning)
  if (trimmed.startsWith("/*")) return true;
  // Skip lines that only reference environment variables (not assignments)
  // e.g. process.env.PASSWORD is fine, but password = "value" is not
  if (line.includes("process.env")) return true;
  return false;
}

function evaluate(ctx) {
  // === HG-SEC-01 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const files = ctx.files || [];

  // If no files were scanned (e.g. server/ dir doesn't exist), gate is not triggered
  if (files.length === 0) {
    return pass("Gate not triggered -- no files to scan");
  }

  const findings = [];

  // Scan each file line by line
  for (const file of files) {
    const content = file.content || "";
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip comments and env references (false positive reduction)
      if (isIgnoredLine(line)) continue;

      // Check all secret patterns against this line
      for (const pattern of SECRET_PATTERNS) {
        if (pattern.regex.test(line)) {
          findings.push(
            pattern.name + " found in " + file.path + " line " + (i + 1) + ": \"" +
            line.trim().substring(0, 80) + "\""
          );
        }
      }
    }
  }

  if (findings.length === 0) {
    return pass("No hardcoded secrets found in scanned files");
  }
  return fail(findings.join("\n"));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };