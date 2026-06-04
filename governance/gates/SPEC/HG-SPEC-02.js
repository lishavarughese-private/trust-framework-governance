/**
 * HG-SPEC-02
 * Phase: SPEC, PLAN
 * Type: HARD
 *
 * Checks that if payment card data is referenced, the product has declared PCI-DSS compliance and a handling strategy.
 *
 * Pass when:
 *   Payment card data is NOT referenced (gate not triggered), OR payment card data IS referenced with PCI-DSS in compliance[] AND a specific payment handling strategy is provided.
 *
 * Fail if:
 *   Payment card data is referenced but PCI-DSS is not in compliance[], OR PCI-DSS is declared but no payment handling strategy is specified.
 *
 * Example output:
 *   [PASS] HG-SPEC-02 -- <pass message>
 *   [FAIL] HG-SPEC-02 -- <failure details>
 */

"use strict";

const gate_id = "HG-SPEC-02";
const name = "Payment Card Compliance Gate";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-04";

function evaluate(ctx) {
  // === HG-SPEC-02 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const paymentCardPresent   = ctx.payment_card_data_present === true;
  const compliance           = ctx.compliance || [];
  const handlingStrategy     = ctx.payment_handling_strategy || null;

  if (!paymentCardPresent) {
    return pass("Gate not triggered -- no payment card data referenced");
  }

  const hasPCI = compliance.some(c => c.toUpperCase().replace(/[^A-Z0-9]/g, "") === "PCIDSS" ||
                                       c.toUpperCase() === "PCI-DSS" ||
                                       c.toUpperCase() === "PCI DSS");
  if (!hasPCI) {
    return fail("Payment card data is referenced but PCI-DSS is not declared in compliance[] -- current compliance[]: " + JSON.stringify(compliance));
  }

  if (!handlingStrategy || handlingStrategy.trim() === "") {
    return fail("PCI-DSS is declared but no payment handling strategy is specified (e.g. tokenisation, full delegation to payment provider)");
  }

  return pass("PCI-DSS declared in compliance[], payment handling strategy specified: \"" + handlingStrategy + "\"");
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };