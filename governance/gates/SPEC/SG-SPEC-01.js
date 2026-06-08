/**
 * SG-SPEC-01
 * Phase: SPEC
 * Type: SOFT
 *
 * Checks that the specification defines a clear target persona.
 *
 * Pass when:
 *   ctx.spec.persona exists with name, role, and goal fields.
 *
 * Fail if:
 *   Persona is missing, undefined, or too generic (no role/goal).
 */

"use strict";

const gate_id = "SG-SPEC-01";
const name = "Undefined Persona";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-01";

function evaluate(ctx) {
  const spec = ctx.spec || {};
  const persona = spec.persona;

  if (!persona) {
    return fail("No target persona defined in spec. Add a persona object with name, role, and goal.");
  }

  if (!persona.name || persona.name.trim() === "") {
    return fail("Persona name is missing or empty.");
  }

  if (!persona.role || persona.role.trim() === "") {
    return fail("Persona role is missing or empty. Describe the user's role.");
  }

  if (!persona.goal || persona.goal.trim() === "") {
    return fail("Persona goal is missing or empty. Describe what the persona aims to achieve.");
  }

  return pass("Persona defined: " + persona.name + " (" + (persona.role || "no role") + ")");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };
