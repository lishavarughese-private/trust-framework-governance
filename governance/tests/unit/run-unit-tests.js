#!/usr/bin/env node
"use strict";

/**
 * run-unit-tests.js
 * -----------------
 * Loads every *.unit.json file in this directory, runs each test case through
 * the gate-evaluator reference implementation, and reports PASS / FAIL.
 *
 * Usage (from project root):
 *   node governance/tests/unit/run-unit-tests.js
 *
 * Exit codes:
 *   0 â€” all test cases passed
 *   1 â€” one or more test cases failed
 */

const fs   = require("fs");
const path = require("path");
const { evaluateGate } = require("../../evaluator/gate-evaluator");

const UNIT_DIR = __dirname;

let totalPassed = 0;
let totalFailed = 0;
let totalRun    = 0;

console.log("\nâ•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—");
console.log("â•‘         Spec-Kit Global Gate Unit Test Runner        â•‘");
console.log("â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n");

// Discover all unit test JSON files
const unitFiles = fs.readdirSync(UNIT_DIR)
  .filter(f => f.endsWith(".unit.json"))
  .sort();

if (unitFiles.length === 0) {
  console.error("ERROR: No *.unit.json files found in", UNIT_DIR);
  process.exit(1);
}

unitFiles.forEach(filename => {
  const filePath = path.join(UNIT_DIR, filename);
  let suite;

  try {
    suite = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    console.error("ERROR: Could not parse", filename, "â€”", e.message);
    totalFailed++;
    return;
  }

  const gateId     = suite.gate_id;
  const testCases  = suite.test_cases || [];

  console.log("â”€â”€ " + gateId + " (" + testCases.length + " cases) â”€â”€");

  testCases.forEach(tc => {
    totalRun++;
    let actual;

    try {
      actual = evaluateGate(gateId, tc.inputs || {});
    } catch (e) {
      console.error("  [ERROR]  " + tc.id + " â€” evaluator threw: " + e.message);
      totalFailed++;
      return;
    }

    const expected = tc.expected;   // "PASS" or "FAIL"
    const got      = actual.result; // "PASS" or "FAIL"
    const ok       = (got === expected);

    if (ok) {
      console.log("  [PASS]   " + tc.id.padEnd(20) + "  " + tc.description);
      totalPassed++;
    } else {
      console.error("  [FAIL]   " + tc.id.padEnd(20) + "  " + tc.description);
      console.error("           expected: " + expected + "  got: " + got);
      console.error("           reason:   " + actual.reason);
      totalFailed++;
    }
  });

  console.log();
});

// â”€â”€ Summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
console.log("â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•");
console.log("  Total run    : " + totalRun);
console.log("  Passed       : " + totalPassed);
console.log("  Failed       : " + totalFailed);
console.log("â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n");

if (totalFailed > 0) {
  console.error("FAIL â€” " + totalFailed + " unit test(s) failed.\n");
  process.exit(1);
} else {
  console.log("PASS â€” All " + totalPassed + " gate unit tests passed.\n");
}
