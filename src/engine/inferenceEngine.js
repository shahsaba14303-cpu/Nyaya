/**
 * @file inferenceEngine.js
 * @description Deterministic forward-chaining inference engine for NYĀYA.
 */

if (typeof require !== 'undefined' && typeof RuleMatcher === 'undefined') {
  RuleMatcher = require('./ruleMatcher');
}

const InferenceEngine = {
  /**
   * Executes deterministic forward chaining over a set of initial facts and rules.
   * Continues until a fixed point is reached (no new facts derived) or iteration limit.
   *
   * @param {Array<{predicate: string, entity: string, raw: string}>} initialFacts
   * @param {Array<{id: string, antecedent: Object, consequent: Object, raw: string}>} rules
   * @param {Object} [opts]
   * @param {number} [opts.maxIterations=50]
   * @returns {{
   *   derivedFacts: Array<Object>,
   *   allFacts: Array<Object>,
   *   trace: Array<{step: number, ruleId: string, ruleApplied: string, fromFact: string, substitution: string, toFact: string}>,
   *   iterations: number,
   *   stopReason: "no_new_facts"|"max_iterations_reached"|"empty"
   * }}
   */
  run(initialFacts = [], rules = [], opts = {}) {
    if (initialFacts.length === 0 && rules.length === 0) {
      return {
        derivedFacts: [],
        allFacts: [],
        trace: [],
        iterations: 0,
        stopReason: "empty",
      };
    }

    const maxIterations = opts.maxIterations ?? 50;
    const known = new Map();

    // Populate initial facts
    initialFacts.forEach((f) => {
      known.set(f.raw, { ...f, source: "initial" });
    });

    const derived = [];
    const trace = [];
    let iterations = 0;
    let stopReason = "no_new_facts";

    while (iterations < maxIterations) {
      iterations++;
      let newInThisPass = 0;

      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        const ruleId = rule.id || `R${i + 1}`;
        const currentFacts = Array.from(known.values());
        const matches = RuleMatcher.matchRule(rule, currentFacts);

        for (const match of matches) {
          if (!known.has(match.conclusionRaw)) {
            // Parse conclusion predicate and entity from canonical raw format
            const mm = match.conclusionRaw.match(/^([A-Za-z_][A-Za-z0-9_]*)\(([A-Za-z_][A-Za-z0-9_]*)\)$/);
            const predicate = mm ? mm[1] : rule.consequent.predicate;
            const entity = mm ? mm[2] : match.entity;

            const newFact = {
              predicate,
              entity,
              raw: match.conclusionRaw,
              source: "derived",
            };

            known.set(match.conclusionRaw, newFact);
            derived.push(newFact);
            newInThisPass++;

            trace.push({
              step: derived.length,
              ruleId,
              ruleApplied: rule.raw,
              fromFact: match.sourceFact,
              substitution: match.substitution,
              toFact: match.conclusionRaw,
            });
          }
        }
      }

      // Stopping condition: fixed point reached (data-driven equilibrium)
      if (newInThisPass === 0) {
        stopReason = "no_new_facts";
        break;
      }

      if (iterations >= maxIterations) {
        stopReason = "max_iterations_reached";
      }
    }

    return {
      derivedFacts: derived,
      allFacts: Array.from(known.values()),
      trace,
      iterations,
      stopReason,
    };
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = InferenceEngine;
}
