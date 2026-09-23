/**
 * @file parser.js
 * @description Deterministic parser for first-order logic atomic facts and definite Horn rules.
 */

const Parser = {
  // Fact regex: e.g., Smoke(Mountain), Fire(Forest), Rain(Mumbai)
  FACT_RE: /^([A-Za-z_][A-Za-z0-9_]*)\(([A-Za-z_][A-Za-z0-9_]*)\)$/,

  // Rule regex: e.g., Smoke(x) -> Fire(x) or Smoke(x) → Fire(x)
  RULE_RE: /^([A-Za-z_][A-Za-z0-9_]*)\(([a-zA-Z])\)\s*(?:->|→)\s*([A-Za-z_][A-Za-z0-9_]*)\(([a-zA-Z])\)$/,

  normalize(str) {
    if (typeof str !== "string") return "";
    return str.trim().replace(/\s+/g, "");
  },

  /**
   * Parses a single fact string into structured Fact object.
   * @param {string} raw - Input string, e.g. "Smoke(Mountain)"
   * @returns {{ok: boolean, value?: Object, error?: string}}
   */
  parseFact(raw) {
    if (!raw || typeof raw !== "string" || !raw.trim()) {
      return { ok: false, error: "Fact cannot be empty. Expected format: Predicate(Entity) — e.g. Smoke(Mountain)" };
    }

    const trimmed = raw.trim();
    const str = this.normalize(trimmed);

    // Specific friendly diagnostic checks for common syntax mistakes
    if (!str.includes("(") || !str.includes(")")) {
      return { ok: false, error: `Invalid fact format "${trimmed}". Missing parentheses. Expected: Predicate(Entity) — e.g. Smoke(Mountain)` };
    }
    if (str.startsWith("(") || !/^[A-Za-z_]/.test(str)) {
      return { ok: false, error: `Invalid fact format "${trimmed}". Predicate name must start with a letter.` };
    }
    if (str.includes("()") || /\(\s*\)/.test(trimmed)) {
      return { ok: false, error: `Invalid fact format "${trimmed}". Entity inside parentheses cannot be empty.` };
    }
    if ((str.match(/\(/g) || []).length !== (str.match(/\)/g) || []).length) {
      return { ok: false, error: `Invalid fact format "${trimmed}". Unmatched parentheses.` };
    }

    const m = str.match(this.FACT_RE);
    if (!m) {
      return {
        ok: false,
        error: `Invalid fact format "${trimmed}". Expected: Predicate(Entity) with alphanumeric identifiers — e.g. Smoke(Mountain)`
      };
    }

    const [, predicate, entity] = m;
    return {
      ok: true,
      value: {
        predicate,
        entity,
        raw: `${predicate}(${entity})`,
        source: "initial",
      },
    };
  },

  /**
   * Parses a single rule string into structured Rule object.
   * @param {string} raw - Input string, e.g. "Smoke(x) -> Fire(x)"
   * @returns {{ok: boolean, value?: Object, error?: string}}
   */
  parseRule(raw) {
    if (!raw || typeof raw !== "string" || !raw.trim()) {
      return { ok: false, error: "Rule cannot be empty. Expected format: Predicate(x) → Predicate(x)" };
    }

    const trimmed = raw.trim();
    const normalizedArrow = trimmed.replace(/→/g, "->");
    const str = this.normalize(normalizedArrow);

    if (!str.includes("->")) {
      return { ok: false, error: `Invalid rule format "${trimmed}". Missing implication arrow (-> or →). Expected: Predicate(x) → Predicate(x)` };
    }

    const parts = str.split("->");
    if (parts.length !== 2) {
      return { ok: false, error: `Invalid rule format "${trimmed}". A rule must have exactly one implication arrow.` };
    }

    const m = str.match(this.RULE_RE);
    if (!m) {
      return {
        ok: false,
        error: `Invalid rule format "${trimmed}". Expected single-variable implication — e.g. Smoke(x) → Fire(x)`
      };
    }

    const [, ifPred, ifVar, thenPred, thenVar] = m;
    if (ifVar !== thenVar) {
      return {
        ok: false,
        error: `Variable mismatch in rule: "${trimmed}". Both condition and conclusion must use the same variable (${ifVar} vs ${thenVar}).`
      };
    }

    return {
      ok: true,
      value: {
        antecedent: { predicate: ifPred, variable: ifVar },
        consequent: { predicate: thenPred, variable: thenVar },
        raw: `${ifPred}(${ifVar}) → ${thenPred}(${thenVar})`,
      },
    };
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = Parser;
}
