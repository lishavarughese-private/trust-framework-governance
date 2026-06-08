/**
 * SG-SPEC-02
 * Phase: SPEC
 * Type: SOFT
 *
 * Checks that the specification defines scope boundaries (in-scope and out-of-scope).
 *
 * Pass when:
 *   spec.scope exists with in_scope (2+ items) and out_of_scope (1+ items).
 *
 * Fail if:
 *   Scope is missing, incomplete, or has too few items.
 */

"use strict";

const gate_id = "SG-SPEC-02";
const name = "Scope Boundary";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-01";

function evaluate(ctx) {
  const spec = ctx.spec || {};
  const scope = spec.scope;

  if (!scope) {
    return fail("No scope boundaries defined in spec. Add a scope object with in_scope and out_of_scope arrays.");
  }

  const inScope = scope.in_scope || [];
  const outOfScope = scope.out_of_scope || [];

  if (inScope.length < 2) {
    return fail("In-scope items missing or too few (minimum 2 required). Define what the project includes.");
  }

  if (outOfScope.length < 1) {
    return fail("Out-of-scope items missing. Define at least 1 item explicitly excluded from this project.");
  }

  return pass("Scope defined: " + inScope.length + " in-scope, " + outOfScope.length + " out-of-scope.");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };
