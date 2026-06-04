"use strict";

/**
 * evaluate-phase.js
 * -----------------
 * Runs all applicable gates for a given project phase.
 *
 * Gates are organized into phase-named folders under gates/:
 *   SPEC/   - gates that run for SPEC and PLAN phases
 *   PLAN/   - gates that run for the PLAN phase
 *   TASKS/  - gates that run for TASKS and IMPL phases
 *   IMPL/   - gates that run for the IMPL phase
 *   COMMON/ - gates that run for ALL phases (HG-SEC-01, INFO-TRACE-01)
 *
 * The phase sequence is:
 *   BRIEF -> SPEC -> PLAN -> TASKS -> IMPL -> REVIEW
 *
 * BRIEF phase has no gates - it is a free-form problem definition step.
 */

const path = require("path");
const { listGatesByPhase, evaluateGate, getGateMeta } = require(path.resolve(__dirname, "gate-evaluator"));

// Phase folder mapping: which folders' gates to run for each phase
const PHASE_FOLDERS = {
  BRIEF: [],  // no gates for BRIEF phase
  SPEC:  ["SPEC", "COMMON"],
  PLAN:  ["PLAN", "SPEC", "COMMON"],   // PLAN has its own gates + SPEC compliance checks + COMMON
  TASKS: ["TASKS", "COMMON"],
  IMPL:  ["IMPL", "TASKS", "COMMON"],  // IMPL has its own gates + TASKS checks + COMMON
};

const PHASE_TRANSITIONS = {
  BRIEF: { from: "BRIEF", to: "SPEC" },
  SPEC:  { from: "SPEC",  to: "PLAN" },
  PLAN:  { from: "PLAN",  to: "TASKS" },
  TASKS: { from: "TASKS", to: "IMPL" },
  IMPL:  { from: "IMPL",  to: "REVIEW" },
};

function evaluatePhase(phase, context) {
  const folders = PHASE_FOLDERS[phase];
  if (!folders) throw new Error("Unknown phase: " + phase);

  // Collect all gate IDs from the phase folders
  const gateIds = [];
  for (const folder of folders) {
    const folderGates = listGatesByPhase(folder);
    for (const gid of folderGates) {
      if (gateIds.indexOf(gid) === -1) gateIds.push(gid); // deduplicate
    }
  }

  // Evaluate each gate
  const results = [];
  for (const gateId of gateIds) {
    try {
      const result = evaluateGate(gateId, context);
      // Attach severity and name from gate module metadata for consistent output
      const meta = getGateMeta(gateId);
      if (meta) {
        result.severity = meta.severity;
        result.gate_name = meta.name;
      }
      results.push(result);
    } catch (err) {
      results.push({ gate: gateId, result: "ERROR", reason: err.message });
    }
  }

  // Use the severity from gate metadata for classification
  const hardFailures = results.filter(r => r.result !== "PASS" && r.severity === "HARD");
  const softWarnings = results.filter(r => r.result !== "PASS" && r.severity === "SOFT");
  const infoReports = results.filter(r => r.result !== "PASS" && r.severity === "INFO");
  const transition = PHASE_TRANSITIONS[phase];
  const transitionAllowed = hardFailures.length === 0;

  return {
    phase: phase,
    evaluated_at: new Date().toISOString(),
    transition_allowed: transitionAllowed,
    transition: transition,
    summary: {
      total_gates: results.length,
      passed: results.filter(r => r.result === "PASS").length,
      hard_failures: hardFailures.length,
      soft_warnings: softWarnings.length,
      info_reports: infoReports.length,
    },
    gates: results,
    blocking_failures: hardFailures.map(f => ({
      gate: f.gate,
      severity: f.severity,
      reason: f.reason,
      next_phase_locked: transition ? transition.to : "N/A",
    })),
  };
}

function loadResults(data) {
  return typeof data === "string" ? JSON.parse(data) : data;
}

function transitionBlocked(manifest) {
  return !manifest.transition_allowed;
}

module.exports = { evaluatePhase, loadResults, transitionBlocked, PHASE_FOLDERS, PHASE_TRANSITIONS };