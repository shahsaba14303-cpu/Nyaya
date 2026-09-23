/**
 * @file ruleMatcher.js
 * @description Variable substitution and antecedent matching module for NYĀYA.
 */

const RuleMatcher = {
  /**
   * Matches a rule's antecedent against a list of known facts and computes variable bindings.
   * @param {Object} rule - Parsed rule object
   * @param {Array<Object>} facts - List of current facts
   * @returns {Array<{entity: string, variable: string, sourceFact: string, conclusionRaw: string, substitution: string}>}
   */
  matchRule(rule, facts) {
    const matches = [];
    const ifPred = rule.antecedent.predicate;
    const ifVar = rule.antecedent.variable;
    const thenPred = rule.consequent.predicate;

    for (const fact of facts) {
      if (fact.predicate === ifPred) {
        const entity = fact.entity;
        const conclusionRaw = `${thenPred}(${entity})`;
        const substitution = `${ifVar} = ${entity}`;

        matches.push({
          entity,
          variable: ifVar,
          sourceFact: fact.raw,
          conclusionRaw,
          substitution,
        });
      }
    }

    return matches;
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = RuleMatcher;
}
