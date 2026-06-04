/**
 * SG-PLAN-06
 * Phase: PLAN
 * Type: SOFT
 *
 * Checks for data volume exceeding 100,000 rows in migration scripts.
 *
 * Pass when:
 *   No migration script estimates >100,000 affected rows.
 *
 * Fail if:
 *   A migration script estimates >100,000 rows or uses large-volume language.
 *
 * Example output:
 *   [PASS] SG-PLAN-06 -- <pass message>
 *   [FAIL] SG-PLAN-06 -- <failure details>
 */

"use strict";

const gate_id = "SG-PLAN-06";
const name = "Large Data Volume Performance Risk";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === SG-PLAN-06 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const plan = ctx.plan || {};
  const migrationScripts = (plan.migration && plan.migration.migration_scripts) || [];

  var warnings = [];
  var riskIndicators = ["100k", "million", "all rows", "full table", "every row"];

  for (var i = 0; i < migrationScripts.length; i++) {
    var ms = migrationScripts[i];
    var rows = (ms.estimated_rows_affected || "").toLowerCase();
    var numMatch = rows.match(/(\d+)/);
    if (numMatch && parseInt(numMatch[1]) > 100000) {
      warnings.push(ms.id + " estimates " + ms.estimated_rows_affected + " rows affected  --  performance risk. Suggest batching or off-peak execution.");
    }
    for (var k = 0; k < riskIndicators.length; k++) {
      if (rows.indexOf(riskIndicators[k]) !== -1) {
        warnings.push(ms.id + " indicates large data volume (\"" + ms.estimated_rows_affected + "\")  --  performance risk.");
        break;
      }
    }
  }

  if (warnings.length === 0) {
    return pass("No data volume performance risks detected");
  }
  return fail(warnings.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };