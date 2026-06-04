/**
 * HG-PLAN-01
 * Phase: PLAN
 * Type: HARD
 *
 * Checks that every external integration mentioned in component descriptions/responsibilities has a corresponding entry in dependencies[].
 *
 * Pass when:
 *   All external systems and services referenced in component descriptions have a matching dependency declared.
 *
 * Fail if:
 *   A component description mentions an external system or service that is not declared in dependencies[].
 *
 * Example output:
 *   [PASS] HG-PLAN-01 -- <pass message>
 *   [FAIL] HG-PLAN-01 -- <failure details>
 */

"use strict";

const gate_id = "HG-PLAN-01";
const name = "Missing Required Dependencies";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-PLAN-01 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const plan = ctx.plan || {};
  const components = (plan.architecture && plan.architecture.components) || [];
  const dependencies = plan.dependencies || [];

  if (components.length === 0) {
    return pass("Gate not triggered  --  no components to evaluate");
  }

  const depNames = dependencies.map(function(d) { return (d.name || "").toLowerCase(); });

  // Collect all failures for combined error message

  const failures = [];
  // Iterate over each component to check dependencies
  for (var i = 0; i < components.length; i++) {
    var c = components[i];
    var desc = (c.responsibility || "") + " " + (c.name || "");
    var extRefs = desc.match(/\b(redis|postgres|mysql|mongodb|stripe|aws|s3|sqs|sns|kafka|rabbitmq|elasticsearch|docker|kubernetes|nginx|auth0|okta|sendgrid|twilio)\b/gi);
    if (extRefs) {
      for (var j = 0; j < extRefs.length; j++) {
        var ref = extRefs[j].toLowerCase();
        var found = depNames.some(function(d) { return d.indexOf(ref) !== -1 || ref.indexOf(d) !== -1; });
        if (!found) {
          failures.push("\"" + ref + "\" referenced in " + c.id + " (" + c.name + ") but missing from dependencies[]");
        }
      }
    }
  }

  if (failures.length === 0) {
    return pass("All dependencies referenced in component descriptions are declared in dependencies[]");
  }
  return fail(failures.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };