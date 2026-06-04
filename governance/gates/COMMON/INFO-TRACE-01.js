/**
 * INFO-TRACE-01
 * Phase: ALL (COMMON)
 * Type: INFO
 *
 * Generates a traceability report showing the chain from each requirement to the tasks that implement it.
 *
 * Pass when:
 *   The report is generated successfully and lists coverage status for all requirements.
 *
 * Fail if:
 *   N/A -- this is an informational gate. It always passes and produces a report object.
 *
 * Example output:
 *   [PASS] INFO-TRACE-01 -- <pass message>
 *   [FAIL] INFO-TRACE-01 -- <failure details>
 */

"use strict";

const gate_id = "INFO-TRACE-01";
const name = "Traceability Report";
const severity = "INFO";
const constitution_principle = "PRINCIPLE-02";

function evaluate(ctx) {
  // === INFO-TRACE-01 evaluator ===
  // Reads context fields and returns PASS or FAIL with a reason string.
  const spec = ctx.spec || { requirements: [] };
  const tasksData = ctx.tasks || [];
  const plan = ctx.plan || { architecture: { components: [] } };

  const requirements = spec.requirements || [];
  const taskList = tasksData;
  const components = plan.architecture ? plan.architecture.components || [] : [];

  const chains = [];
  for (const req of requirements) {
    const mappedTasks = taskList.filter(t => t.maps_to_requirement === req.id);
    chains.push({
      requirement: req.id,
      tasks: mappedTasks.map(t => ({
        task_id: t.id,
        status: t.status,
      })),
    });
  }

  const gaps = [];
  for (const req of requirements) {
    const mappedTasks = taskList.filter(t => t.maps_to_requirement === req.id);
    if (mappedTasks.length === 0) {
      gaps.push({ type: "untraced_requirement", detail: req.id + " has no mapped tasks" });
    }
  }

  const report = {
    generated_at: new Date().toISOString(),
    total_requirements: requirements.length,
    total_tasks: taskList.length,
    total_components: components.length,
    traceability_chains: chains,
    gaps: gaps,
    summary: {
      covered_requirements: chains.filter(c => c.tasks.length > 0).length,
      uncovered_requirements: gaps.filter(g => g.type === "untraced_requirement").length,
      total_gaps: gaps.length,
    },
  };

  const result = pass("Traceability report generated with " + chains.length + " chains and " + gaps.length + " gaps");
  result.report = report;
  return result;
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };