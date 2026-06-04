"use strict";

/**
 * gate-evaluator.js
 * -----------------
 * Auto-discovers all gate .js files from the gates/ directory (recursive).
 * Gates are organized into phase-named subdirectories (SPEC/, TASKS/, COMMON/).
 * Each gate file exports { gate_id, name, severity, constitution_principle, evaluate }.
 *
 * This is the single entry point for evaluating any gate by ID.
 */

const fs = require("fs"); // to read directory contents and load gate modules
const path = require("path"); // to handle file paths across platforms

const GATES_DIR = path.resolve(__dirname, "../gates");

let _gatesCache = null; //variable to store loaded gates for caching.

function loadGates() {
  if (_gatesCache) return _gatesCache;

  const gates = {};

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true }); // read directory entries with their types (file or directory)
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name); //get full path of the entry
      if (entry.isDirectory()) { // if it's a directory, recursively scan it
        scanDir(fullPath);
      } else if (entry.name.endsWith(".js")) { // if it's a .js file, attempt to load it as a gate module
        const gate = require(fullPath); // load the gate module
        if (!gate.gate_id || typeof gate.evaluate !== "function") {
          console.error("[gate-evaluator] Skipping " + entry.name + " — missing gate_id or evaluate function");
          continue;
        }
        gates[gate.gate_id] = gate;
      }
    }
  }

  scanDir(GATES_DIR);
  _gatesCache = gates;
  return gates;
}

function evaluateGate(gateId, context) {
  const gates = loadGates();
  const gate = gates[gateId];
  if (!gate) throw new Error("Unknown gate ID: " + gateId);
  return gate.evaluate(context);
}

function listGates() {
  const gates = loadGates();
  return Object.keys(gates).sort();
}

function listGatesByPhase(phase) {
  const gates = loadGates();
  const phaseDir = path.resolve(GATES_DIR, phase);
  if (!fs.existsSync(phaseDir)) return [];

  const results = [];
  const entries = fs.readdirSync(phaseDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.endsWith(".js")) {
      const gate = require(path.join(phaseDir, entry.name));
      if (gate.gate_id) results.push(gate.gate_id);
    }
  }
  return results.sort();
}

function getGateMeta(gateId) {
  const gates = loadGates();
  const gate = gates[gateId];
  if (!gate) return null;
  return {
    gate_id: gate.gate_id,
    name: gate.name,
    severity: gate.severity,
    constitution_principle: gate.constitution_principle
  };
}

module.exports = { evaluateGate, listGates, listGatesByPhase, getGateMeta, loadGates };