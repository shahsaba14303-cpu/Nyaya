/**
 * @file inference.test.js
 * @description Automated CLI runner for NYĀYA verification test cases.
 */

const { runTestSuite } = require('../src/engine/testSuite');

console.log("=================================================");
console.log("  NYĀYA INFERENCE ENGINE — AUTOMATED TEST SUITE  ");
console.log("=================================================\n");

const results = runTestSuite();
let passed = 0;
let failed = 0;

results.forEach((r) => {
  const isPass = r.status === "PASS";
  if (isPass) passed++;
  else failed++;

  const icon = isPass ? "✓ PASS" : "✗ FAIL";
  console.log(`[${icon}] ${r.id}: ${r.name}`);
  console.log(`       Input Facts:    ${r.facts.length ? r.facts.join(", ") : "(none)"}`);
  console.log(`       Input Rules:    ${r.rules.length ? r.rules.join(", ") : "(none)"}`);
  console.log(`       Expected:       ${Array.isArray(r.expected) ? (r.expected.length ? r.expected.join(", ") : "(none)") : r.expected}`);
  console.log(`       Actual Result:  ${r.actual}`);
  if (r.result && r.result.trace && r.result.trace.length > 0) {
    console.log(`       Reasoning Trace (${r.result.trace.length} step${r.result.trace.length === 1 ? '' : 's'}):`);
    r.result.trace.forEach((t) => {
      console.log(`         • Step ${t.step}: ${t.fromFact} --[${t.ruleId}: ${t.ruleApplied} | ${t.substitution}]--> ${t.toFact}`);
    });
  }
  console.log("");
});

console.log("-------------------------------------------------");
console.log(`Test Summary: ${passed} Passed, ${failed} Failed out of ${results.length} Total Tests`);
console.log("=================================================");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("All test cases passed successfully!");
}
