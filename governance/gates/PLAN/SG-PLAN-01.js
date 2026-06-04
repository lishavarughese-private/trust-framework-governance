/**
 * SG-PLAN-01
 * Phase: PLAN
 * Type: SOFT
 *
 * Checks all components and APIs can be traced to requirements.
 *
 * Pass when:
 *   All components and API definitions are traceable to requirements.
 *
 * Fail if:
 *   A component has no traceability entry or an API definition cannot be traced to a requirement.
 *
 * Example output:
 *   [PASS] SG-PLAN-01 -- <pass message>
 *   [FAIL] SG-PLAN-01 -- <failure details>
 */

"use strict";

const gate_id = "SG-PLAN-01";
const name = "Scope Creep";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === SG-PLAN-01 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const spec = ctx.spec || {};
  const plan = ctx.plan || {};
  const components = (plan.architecture && plan.architecture.components) || [];
  const apiDefs = plan.api_definitions || [];
  const traceability = plan.traceability || [];

  if (components.length === 0 && apiDefs.length === 0) {
    return pass("Gate not triggered  --  no components or APIs to evaluate");
  }

  var tracedComps = {};
  // Check each traceability entry
  for (var i = 0; i < traceability.length; i++) {
    if (traceability[i].component_id) tracedComps[traceability[i].component_id] = true;
  }

  var warnings = [];
  for (var j = 0; j < components.length; j++) {
    var c = components[j];
    if (!tracedComps[c.id]) {
      warnings.push(c.id + " \"" + c.name + "\" has no entry in traceability[]  --  may be scope creep");
    }
  }

  for (var k = 0; k < apiDefs.length; k++) {
    var api = apiDefs[k];
    if (!api.maps_to_requirement || !traceability.some(function(t) { return t.component_id && api.maps_to_requirement === t.requirement_id; })) {
      warnings.push(api.id + " (" + api.method + " " + api.path + ") cannot be traced to any requirement via traceability[]");
    }
  }

  if (warnings.length === 0) {
    return pass("All components and APIs traceable to requirements");
  }
  return fail("Potential scope creep: " + warnings.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };