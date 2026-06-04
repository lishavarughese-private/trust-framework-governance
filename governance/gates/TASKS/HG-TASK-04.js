/**
 * HG-TASK-04
 * Phase: TASKS, IMPL
 * Type: HARD
 *
 * Checks that every requirement has at least one task mapped to it.
 *
 * Pass when:
 *   All requirements have at least one task with a matching maps_to_requirement value.
 *
 * Fail if:
 *   Any requirement has zero tasks mapped to it.
 *
 * Example output:
 *   [PASS] HG-TASK-04 -- <pass message>
 *   [FAIL] HG-TASK-04 -- <failure details>
 */

"use strict";

const gate_id = "HG-TASK-04";
const name = "Full Requirement Coverage";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-TASK-04 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const tasks        = ctx.tasks        || [];
  const requirements = ctx.requirements || [];

  if (tasks.length === 0 || requirements.length === 0) {
    return pass("Gate not triggered  --  no tasks or no requirements to evaluate");
  }

  const coveredReqs = new Set(tasks.map(t => t.maps_to_requirement).filter(Boolean));

  // Collect all failures for combined error message

  const failures = [];
  for (const req of requirements) {
    if (!coveredReqs.has(req.id)) {
      failures.push(req.id + " has zero tasks mapped to it");
    }
  }

  if (failures.length === 0) {
    return pass("All " + requirements.length + " requirements have at least one mapped task");
  }
  return fail(failures.join("; "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };