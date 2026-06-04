"use strict";

/**
 * coverage.test.js
 * ----------------
 * Verifies that:
 *   1. Every gate .js file references a valid constitutional principle.
 *   2. Every principle declared in CONSTITUTION.md has at least one gate
 *      referencing it.
 *   3. No orphaned principles (principles with zero gates) and no orphaned
 *      gates (gates referencing non-existent principles).
 *
 * Usage:
 *   node governance/tests/constitution/coverage.test.js
 */

const fs     = require("fs");
const path   = require("path");
const assert = require("assert");

const ROOT       = path.resolve(__dirname, "../..");
const CONST_PATH = path.join(ROOT, "CONSTITUTION.md");
const GATES_DIR  = path.join(ROOT, "gates");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try   { fn(); console.log("  \u2713", name); passed++; }
  catch (e) { console.error("  \u2717", name); console.error("    ", e.message); failed++; }
}

console.log("\n=== constitution/coverage.test.js ===\n");

// -- 1. Load CONSTITUTION.md ------------------------------------------------
test("CONSTITUTION.md exists", () => {
  assert.ok(fs.existsSync(CONST_PATH), "CONSTITUTION.md not found at " + CONST_PATH);
});

const constitutionText = fs.existsSync(CONST_PATH)
  ? fs.readFileSync(CONST_PATH, "utf8")
  : "";

// Extract principle IDs from "### PRINCIPLE-NN" headings
const principleMatches = constitutionText.match(/###\s+(PRINCIPLE-\d+)/g) || [];
const declaredPrinciples = principleMatches.map(m => m.replace(/###\s+/, "").trim());

test("CONSTITUTION.md declares at least one principle", () => {
  assert.ok(declaredPrinciples.length > 0, "No PRINCIPLE-NN headings found");
});

// -- 2. Discover all gate .js files recursively -----------------------------
function findGateFiles(dir) {
  var results = [];
  if (!fs.existsSync(dir)) return results;
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findGateFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".js") && !entry.name.startsWith("_")) {
      results.push(fullPath);
    }
  }
  return results;
}

var gateFiles = findGateFiles(GATES_DIR);

test("at least one gate definition file exists", () => {
  assert.ok(gateFiles.length > 0, "No .js files found in gates/");
});

// Parse constitution_principle from each gate .js file
var gatePrincipleMap = {};
for (var i = 0; i < gateFiles.length; i++) {
  var gf = gateFiles[i];
  var content = fs.readFileSync(gf, "utf8");
  var match = content.match(/constitution_principle\s*=\s*"([^"]+)"/);
  if (match) {
    var gateIdMatch = content.match(/gate_id\s*=\s*"([^"]+)"/);
    var gateId = gateIdMatch ? gateIdMatch[1] : path.basename(gf, ".js");
    gatePrincipleMap[gateId] = match[1];
  }
}

// -- 3. Every gate references a declared principle --------------------------
Object.entries(gatePrincipleMap).forEach(function(entry) {
  var gateId = entry[0];
  var pid = entry[1];
  test(gateId + ": constitution_principle is " + pid, function() {
    assert.ok(pid, gateId + " has no constitution_principle field");
  });

  test(gateId + ": " + pid + " is declared in CONSTITUTION.md", function() {
    assert.ok(
      declaredPrinciples.indexOf(pid) !== -1,
      gateId + " references " + pid + " but that principle is not declared in CONSTITUTION.md"
    );
  });
});

// -- 4. Every principle has at least one gate -------------------------------
var principleGateCount = {};
Object.values(gatePrincipleMap).forEach(function(pid) {
  principleGateCount[pid] = (principleGateCount[pid] || 0) + 1;
});

declaredPrinciples.forEach(function(pid) {
  test(pid + " has at least one gate", function() {
    var count = principleGateCount[pid] || 0;
    assert.ok(count > 0,
      pid + " has no gates referencing it. Add constitution_principle to a gate file.");
  });
});

// -- Summary ----------------------------------------------------------------
console.log("\nResults:", passed, "passed,", failed, "failed\n");
console.log("Gates found:", gateFiles.length);
console.log("Principles declared:", declaredPrinciples.length);
console.log("Principles with gates:", Object.keys(principleGateCount).length);
console.log("");
if (failed > 0) process.exit(1);