/**
 * @file validator.js
 * @description Input validation and duplicate/tautology checking for NYĀYA.
 */

if (typeof require !== 'undefined' && typeof Parser === 'undefined') {
  Parser = require('./parser');
}

const Validator = {
  /**
   * Validates raw fact input and checks for duplicates.
   * @param {string} raw - Input fact string
   * @param {Array<{raw: string}>} existingFacts - Current list of facts
   * @returns {{ok: boolean, value?: Object, error?: string}}
   */
  validateFactInput(raw, existingFacts = []) {
    if (!raw || !raw.trim()) {
      return { ok: false, error: "Fact input cannot be empty." };
    }

    const parsed = Parser.parseFact(raw);
    if (!parsed.ok) {
      return parsed;
    }

    const isDuplicate = existingFacts.some((f) => f.raw === parsed.value.raw);
    if (isDuplicate) {
      return {
        ok: false,
        error: `Duplicate fact: "${parsed.value.raw}" already exists in the knowledge base.`
      };
    }

    return parsed;
  },

  /**
   * Validates raw rule input and checks for duplicates and trivial tautologies.
   * @param {string} raw - Input rule string
   * @param {Array<{raw: string}>} existingRules - Current list of rules
   * @returns {{ok: boolean, value?: Object, error?: string}}
   */
  validateRuleInput(raw, existingRules = []) {
    if (!raw || !raw.trim()) {
      return { ok: false, error: "Rule input cannot be empty." };
    }

    const parsed = Parser.parseRule(raw);
    if (!parsed.ok) {
      return parsed;
    }

    const isDuplicate = existingRules.some((r) => r.raw === parsed.value.raw);
    if (isDuplicate) {
      return {
        ok: false,
        error: `Duplicate rule: "${parsed.value.raw}" already exists in the rule set.`
      };
    }

    // Reject trivial tautology (A(x) -> A(x))
    if (parsed.value.antecedent.predicate === parsed.value.consequent.predicate) {
      return {
        ok: false,
        error: `Tautological rule rejected: condition and conclusion use the same predicate ("${parsed.value.antecedent.predicate}").`
      };
    }

    return parsed;
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Validator;
}
