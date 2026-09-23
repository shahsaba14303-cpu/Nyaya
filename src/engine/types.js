/**
 * @file types.js
 * @description Type definitions and data contract specifications for NYĀYA Inference Engine.
 */

/**
 * @typedef {Object} Fact
 * @property {string} predicate - The predicate name (e.g., "Smoke")
 * @property {string} entity - The entity/constant name (e.g., "Mountain")
 * @property {string} raw - Canonical string representation "Predicate(Entity)"
 * @property {"initial"|"derived"} [source] - Whether the fact was an initial premise or derived
 */

/**
 * @typedef {Object} RuleTerm
 * @property {string} predicate - Predicate name (e.g., "Smoke")
 * @property {string} variable - Variable symbol (e.g., "x")
 */

/**
 * @typedef {Object} Rule
 * @property {string} id - Unique identifier (e.g., "R1", "R2")
 * @property {RuleTerm} antecedent - The IF condition (e.g., Smoke(x))
 * @property {RuleTerm} consequent - The THEN conclusion (e.g., Fire(x))
 * @property {string} raw - Canonical string representation "Smoke(x) → Fire(x)"
 */

/**
 * @typedef {Object} RuleMatch
 * @property {string} entity - The bound entity value (e.g., "Mountain")
 * @property {string} variable - The variable symbol (e.g., "x")
 * @property {string} sourceFact - The fact that matched the antecedent (e.g., "Smoke(Mountain)")
 * @property {string} conclusionRaw - The resulting substituted conclusion (e.g., "Fire(Mountain)")
 */

/**
 * @typedef {Object} ReasoningStep
 * @property {number} step - Step counter index (1-based)
 * @property {string} ruleId - Identifier of the rule applied (e.g., "R1")
 * @property {string} ruleApplied - Canonical rule string (e.g., "Smoke(x) → Fire(x)")
 * @property {string} fromFact - Antecedent fact matched (e.g., "Smoke(Mountain)")
 * @property {string} substitution - Variable substitution string (e.g., "x = Mountain")
 * @property {string} toFact - Derived conclusion fact (e.g., "Fire(Mountain)")
 */

/**
 * @typedef {Object} InferenceResult
 * @property {Fact[]} derivedFacts - Array of all newly derived facts
 * @property {Fact[]} allFacts - Array of all known facts (initial + derived)
 * @property {ReasoningStep[]} trace - Step-by-step reasoning execution trace
 * @property {number} iterations - Number of passes completed over the rule set
 * @property {"no_new_facts"|"max_iterations_reached"|"empty"} stopReason - Why inference halted
 */

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {};
}
