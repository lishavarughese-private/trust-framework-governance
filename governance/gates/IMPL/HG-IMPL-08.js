/**
 * HG-IMPL-08
 * Phase: IMPL
 * Type: HARD
 *
 * Checks that each task's acceptance criteria has at least one corresponding test result.
 *
 * Pass when:
 *   Every task with acceptance criteria has at least one matching test entry.
 *
 * Fail if:
 *   A task has acceptance criteria but no test result covers it.
 */

"use strict";

const gate_id = "HG-IMPL-08";
const name = "Acceptance Criteria Test Coverage";
const severity = "HARD";
const constitution_principle = "PRINCIPLE-06";

function evaluate(ctx) {
  const tasks = ctx.tasks || [];
  const impl = ctx.impl || {};
  const testResults = impl.test_results || [];

  if (tasks.length === 0) {
    return pass("No tasks to evaluate.");
  }

  var testSuites = [];
  for (var t = 0; t < testResults.length; t++) {
    testSuites.push((testResults[t].test_suite || "").toLowerCase());
  }

  var untestedTasks = [];
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    var ac = task.acceptance_criteria;
    if (!ac || !Array.isArray(ac) || ac.length === 0) {
      continue;
    }

    var taskId = (task.id || "").toLowerCase();
    var matched = false;
    for (var s = 0; s < testSuites.length; s++) {
      if (testSuites[s].indexOf(taskId) !== -1) {
        matched = true;
        break;
      }
    }

    if (!matched && testResults.length > 0) {
      for (var a = 0; a < ac.length; a++) {
        var criterion = (ac[a] || "").toLowerCase().substring(0, 30);
        for (var s2 = 0; s2 < testResults.length; s2++) {
          var notes = (testResults[s2].notes || "").toLowerCase();
          if (notes.indexOf(criterion) !== -1) {
            matched = true;
            break;
          }
        }
        if (matched) break;
      }
    }

    if (!matched) {
      untestedTasks.push(task.id || "task-" + i);
    }
  }

  if (untestedTasks.length === 0) {
    return pass("All " + tasks.length + " task acceptance criteria have corresponding test coverage.");
  }

  return fail(untestedTasks.length + " task(s) have acceptance criteria but no matching test result: " + untestedTasks.join(", "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };
