/**
 * SG-PLAN-02
 * Phase: PLAN
 * Type: SOFT
 *
 * Checks for signs of unnecessary complexity or legacy dependencies.
 *
 * Pass when:
 *   Architecture complexity is proportionate to project scope.
 *
 * Fail if:
 *   More than 3 distinct component types with 5+ components OR unnecessary legacy dependencies.
 *
 * Example output:
 *   [PASS] SG-PLAN-02 -- <pass message>
 *   [FAIL] SG-PLAN-02 -- <failure details>
 */

"use strict";

const gate_id = "SG-PLAN-02";
const name = "Over-Engineering";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === SG-PLAN-02 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const plan = ctx.plan || {};
  const components = (plan.architecture && plan.architecture.components) || [];
  const dependencies = plan.dependencies || [];

  var warnings = [];

  // Check for excessive abstraction layers
  var layers = [];
  components.forEach(function(c) {
    if (c.type) layers.push(c.type);
  });
  var uniqueTypes = layers.filter(function(t, i, a) { return a.indexOf(t) === i; });
  if (uniqueTypes.length > 3 && components.length > 5) {
    warnings.push("Architecture has " + uniqueTypes.length + " distinct component types for " + components.length + " components  --  may be over-engineered for scope");
  }

  // Check for unnecessary external dependencies
  dependencies.forEach(function(d) {
    var name = (d.name || "").toLowerCase();
    if (["lodash", "moment", "underscore", "jquery", "bootstrap"].indexOf(name) !== -1) {
      warnings.push("dependency \"" + d.name + "\" is largely unnecessary in modern JS  --  consider native alternatives");
    }
  });

  if (warnings.length === 0) {
    return pass("No over-engineering concerns detected");
  }
  return fail(warnings.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };