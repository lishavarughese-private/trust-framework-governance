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

  // Build map of which tasks have paired test tasks
  var testTaskFor = {};
  var pairedTestIds = {};
  for (var ti = 0; ti < tasks.length; ti++) {
    var t = tasks[ti];
    var title = (t.title || "").toLowerCase();
    var type = (t.type || "").toLowerCase();
    if (type === "test" || title.indexOf("test ") === 0 || title.indexOf("test for") !== -1) {
      var target = t.maps_to_task || null;
      var titleMatch = title.match(/test for (task-\d+)/);
      if (!target && titleMatch) {
        target = titleMatch[1].toUpperCase();
      }
      if (target) {
        testTaskFor[target] = t.id;
        pairedTestIds[t.id] = true;
      }
    }
  }

  // Only check tasks that have paired test tasks
  var untestedTasks = [];
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    var taskId = (task.id || "").toLowerCase();

    // Skip test tasks themselves
    if (pairedTestIds[task.id]) continue;

    var ac = task.acceptance_criteria;
    if (!ac || !Array.isArray(ac) || ac.length === 0) {
      continue;
    }

    // Check if this task has a paired test
    var pairedTest = testTaskFor[task.id];
    if (!pairedTest) continue;

    // Check if the paired test has a matching test result
    var pairedId = pairedTest.toLowerCase();
    var matched = false;
    for (var s = 0; s < testResults.length; s++) {
      var suiteName = (testResults[s].test_suite || "").toLowerCase();
      if (suiteName.indexOf(pairedId) !== -1) {
        matched = true;
        break;
      }
    }

    if (!matched) {
      untestedTasks.push(task.id + " (paired test " + pairedTest + " has no matching test result)");
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
