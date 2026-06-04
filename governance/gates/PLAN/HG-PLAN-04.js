/**
 * HG-PLAN-04
 * Phase: PLAN
 * Type: HARD
 *
 * If any requirement implies client-server interaction, checks that API definitions exist.
 *
 * Pass when:
 *   No requirement implies API interaction (gate not triggered), OR api_definitions[] is non-empty.
 *
 * Fail if:
 *   Requirements imply API/client-server interactions but api_definitions[] is empty.
 *
 * Example output:
 *   [PASS] HG-PLAN-04 -- <pass message>
 *   [FAIL] HG-PLAN-04 -- <failure details>
 */

"use strict";

const gate_id = "HG-PLAN-04";
const name = "Missing API Definitions";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === HG-PLAN-04 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const spec = ctx.spec || {};
  const plan = ctx.plan || {};
  const apiDefs = plan.api_definitions || [];
  const requirements = spec.requirements || [];

  // Check if any requirement implies client-server interaction
  var impliesAPI = false;
  var keywords = ["api", "endpoint", "service", "rest", "graphql", "client", "server", "integration", "webhook"];
  // Iterate over each requirement to check coverage
  for (var i = 0; i < requirements.length; i++) {
    var desc = ((requirements[i].description || "") + " " + (requirements[i].title || "")).toLowerCase();
    for (var k = 0; k < keywords.length; k++) {
      if (desc.indexOf(keywords[k]) !== -1) {
        impliesAPI = true;
        break;
      }
    }
    if (impliesAPI) break;
  }

  if (!impliesAPI) {
    return pass("Gate not triggered  --  no requirement implies API interaction");
  }

  if (apiDefs.length === 0) {
    return fail("Requirements imply API/client-server interactions but api_definitions[] is empty");
  }

  return pass(apiDefs.length + " API definition(s) present");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };