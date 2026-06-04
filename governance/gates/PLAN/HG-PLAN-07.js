/**
 * HG-PLAN-07
 * Phase: PLAN
 * Type: HARD
 *
 * Checks that destructive/mutative schema changes have migration scripts with up and down.
 *
 * Pass when:
 *   No destructive or mutative changes (gate not triggered) OR all have scripts with up and down.
 *
 * Fail if:
 *   A destructive/mutative change lacks a migration script or a script is missing up/down.
 *
 * Example output:
 *   [PASS] HG-PLAN-07 -- <pass message>
 *   [FAIL] HG-PLAN-07 -- <failure details>
 */

"use strict";

const gate_id = "HG-PLAN-07";
const name = "Destructive Schema Changes Without Migration Scripts";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-PLAN-07 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const plan = ctx.plan || {};
  const migration = plan.migration || {};
  const schemaChanges = migration.schema_changes || [];
  const migrationScripts = migration.migration_scripts || [];

  if (!migration.has_schema_changes) {
    return pass("Gate not triggered  --  no schema changes");
  }

  var destructiveTypes = ["destructive", "mutative"];
  var destructiveChanges = schemaChanges.filter(function(sc) {
    return destructiveTypes.indexOf(sc.type || "") !== -1;
  });

  if (destructiveChanges.length === 0) {
    return pass("No destructive or mutative schema changes found");
  }

  // Collect all failures for combined error message

  var failures = [];
  for (var i = 0; i < destructiveChanges.length; i++) {
    var dc = destructiveChanges[i];
    var hasScript = migrationScripts.some(function(ms) {
      return ms.maps_to_schema_change === dc.id;
    });
    if (!hasScript) {
      failures.push(dc.id + " (" + dc.type + " change) has no matching migration script in migration_scripts[]");
    }
  }

  // Check every destructive/mutative script has up AND down
  for (var j = 0; j < destructiveChanges.length; j++) {
    var dc2 = destructiveChanges[j];
    var scripts = migrationScripts.filter(function(ms) {
      return ms.maps_to_schema_change === dc2.id;
    });
    for (var k = 0; k < scripts.length; k++) {
      var s = scripts[k];
      if (!s.up || s.up.trim() === "" || !s.down || s.down.trim() === "") {
        failures.push("migration script " + s.id + " for " + dc2.id + " is missing up or down");
      }
    }
  }

  if (failures.length === 0) {
    return pass("All destructive/mutative changes have migration scripts with up and down");
  }
  return fail(failures.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };