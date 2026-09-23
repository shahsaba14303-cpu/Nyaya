/**
 * @file testSuite.js
 * @description Academic verification test cases executing directly against the NYĀYA inference engine.
 */

if (typeof require !== 'undefined') {
  Parser = require('./parser');
  Validator = require('./validator');
  InferenceEngine = require('./inferenceEngine');
}

const TEST_CASES = [
  {
    id: "TC01",
    name: "Basic one-step inference",
    facts: ["Smoke(Mountain)"],
    rules: ["Smoke(x) → Fire(x)"],
    expected: ["Fire(Mountain)"],
    description: "Single antecedent match deriving direct conclusion via variable substitution.",
  },
  {
    id: "TC02",
    name: "No matching rule",
    facts: ["Rain(Mumbai)"],
    rules: ["Smoke(x) → Fire(x)"],
    expected: [],
    description: "Unmatched predicate condition produces zero derived facts without errors.",
  },
  {
    id: "TC03",
    name: "Two-step inference",
    facts: ["Smoke(Mountain)"],
    rules: ["Smoke(x) → Fire(x)", "Fire(x) → Hot(x)"],
    expected: ["Fire(Mountain)", "Hot(Mountain)"],
    description: "Chained reasoning where output of R1 feeds into input of R2.",
  },
  {
    id: "TC04",
    name: "Three-step inference",
    facts: ["Smoke(Mountain)"],
    rules: ["Smoke(x) → Fire(x)", "Fire(x) → Hot(x)", "Hot(x) → Dangerous(x)"],
    expected: ["Fire(Mountain)", "Hot(Mountain)", "Dangerous(Mountain)"],
    description: "Multi-pass forward chaining until no further inferences can be drawn.",
  },
  {
    id: "TC05",
    name: "Multiple facts",
    facts: ["Smoke(Mountain)", "Smoke(Forest)"],
    rules: ["Smoke(x) → Fire(x)"],
    expected: ["Fire(Mountain)", "Fire(Forest)"],
    description: "Single rule binding to multiple distinct grounded entities in parallel.",
  },
  {
    id: "TC06",
    name: "Multiple independent rules",
    facts: ["Smoke(Mountain)", "Rain(Mumbai)"],
    rules: ["Smoke(x) → Fire(x)", "Rain(x) → Wet(x)"],
    expected: ["Fire(Mountain)", "Wet(Mumbai)"],
    description: "Multiple independent rules firing on separate domain facts.",
  },
  {
    id: "TC07",
    name: "Duplicate conclusion prevention",
    facts: ["Smoke(Mountain)", "Ash(Mountain)"],
    rules: ["Smoke(x) → Fire(x)", "Ash(x) → Fire(x)"],
    expected: ["Fire(Mountain)"],
    description: "Two distinct premises converging on identical conclusion; added exactly once.",
  },
  {
    id: "TC08",
    name: "Circular rule safety",
    facts: ["Fire(Mountain)"],
    rules: ["Fire(x) → Smoke(x)", "Smoke(x) → Fire(x)"],
    expected: ["Smoke(Mountain)"],
    description: "Mutual circular implication safely reaches fixed point without infinite loops.",
  },
  {
    id: "TC09",
    name: "Empty input handling",
    facts: [],
    rules: [],
    expected: [],
    description: "Empty initial knowledge base handled gracefully with zero false positives.",
  },
  {
    id: "TC10",
    name: "Invalid syntax rejection",
    facts: ["smoke mountain"],
    rules: ["Smoke(x) => Fire(x,y)"],
    expected: "ERROR",
    description: "Malformed inputs rejected cleanly by validation layer before engine execution.",
  },
];

function buildKB(factStrs, ruleStrs) {
  const facts = factStrs.map((f) => Parser.parseFact(f).value);
  const rules = ruleStrs.map((r, i) => ({ ...Parser.parseRule(r).value, id: `R${i + 1}` }));
  return { facts, rules };
}

function runTestSuite() {
  return TEST_CASES.map((tc) => {
    if (tc.expected === "ERROR") {
      const fr = Validator.validateFactInput(tc.facts[0] || "", []);
      const rr = Validator.validateRuleInput(tc.rules[0] || "", []);
      const rejectedBoth = fr.ok === false && rr.ok === false;
      return {
        ...tc,
        actual: "Both malformed inputs rejected with descriptive validation errors",
        status: rejectedBoth ? "PASS" : "FAIL",
      };
    }

    const { facts, rules } = buildKB(tc.facts, tc.rules);
    const result = InferenceEngine.run(facts, rules);
    const actualList = result.derivedFacts.map((f) => f.raw);
    const pass = JSON.stringify(actualList) === JSON.stringify(tc.expected);

    return {
      ...tc,
      actual: actualList.length ? actualList.join(", ") : "(no new facts derived)",
      status: pass ? "PASS" : "FAIL",
      result,
    };
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TEST_CASES, buildKB, runTestSuite };
}
