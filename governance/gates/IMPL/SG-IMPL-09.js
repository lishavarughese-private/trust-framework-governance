/**
 * SG-IMPL-09
 * Phase: IMPL
 * Type: SOFT
 *
 * Checks that each implementation task has a paired test task.
 *
 * Pass when:
 *   For every implementation task, there is at least one corresponding test task
 *   (task with type "test" or title starting with "Test " or containing "test for").
 *
 * Fail if:
 *   An implementation task exists without a corresponding test task.
 */

"use strict";

const gate_id = "SG-IMPL-09";
const name = "Missing Test Task Pairing";
const severity = "SOFT";
const constitution_principle = "PRINCIPLE-06";

function evaluate(ctx) {
  const tasks = ctx.tasks || [];

  if (tasks.length === 0) {
    return pass("No tasks to evaluate.");
  }

  var testTaskIds = [];
  var implTaskIds = [];
  var testTaskMap = {};

  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    var title = (task.title || "").toLowerCase();
    var type = (task.type || "").toLowerCase();

    if (type === "test" || title.indexOf("test ") === 0 || title.indexOf("test for") !== -1) {
      testTaskIds.push(task.id);
      var mapsTo = task.maps_to_task || null;
      if (mapsTo) {
        testTaskMap[mapsTo] = (testTaskMap[mapsTo] || []);
        testTaskMap[mapsTo].push(task.id);
      }
      var titleMatch = title.match(/test for (task-\d+)/);
      if (titleMatch) {
        var target = titleMatch[1].toUpperCase();
        testTaskMap[target] = (testTaskMap[target] || []);
        testTaskMap[target].push(task.id);
      }
      continue;
    }

    implTaskIds.push(task.id);
  }

  if (testTaskIds.length === 0) {
    return fail("No test tasks found. Each implementation task should have a corresponding test task.");
  }

  var unpairedTasks = [];
  for (var j = 0; j < implTaskIds.length; j++) {
    var implId = implTaskIds[j];
    if (!testTaskMap[implId]) {
      unpairedTasks.push(implId);
    }
  }

  if (unpairedTasks.length === 0) {
    return pass("All " + implTaskIds.length + " implementation tasks have paired test tasks.");
  }

  return fail(unpairedTasks.length + " implementation task(s) missing paired test task: " + unpairedTasks.join(", "));
}

function pass(reason) { return { gate: gate_id, result: "PASS", reason: reason }; }
function fail(reason) { return { gate: gate_id, result: "FAIL", reason: reason }; }

module.exports = { gate_id, name, severity, constitution_principle, evaluate };
