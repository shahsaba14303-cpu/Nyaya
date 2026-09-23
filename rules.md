# Rules — Grammar, Inference Algorithm & Test Cases

## 1. Fact grammar

```
Fact  := Predicate "(" Entity ")"
Predicate, Entity := [A-Za-z_][A-Za-z0-9_]*
```

- Whitespace is stripped before matching, so `Smoke( Mountain )` is accepted as `Smoke(Mountain)`.
- Valid: `Smoke(Mountain)`, `Rain(Mumbai)`, `Fire(Forest)`
- Invalid: `smoke mountain` (no parentheses), `Smoke()` (empty argument), `Smoke(Mountain, Forest)` (more than one argument — not supported)

## 2. Rule grammar

```
Rule := Predicate "(" Var ")" ("->" | "→") Predicate "(" Var ")"
Var  := single lowercase letter, must match on both sides
```

- Valid: `Smoke(x) → Fire(x)`, `Fire(x) -> Hot(x)`
- Invalid: `Smoke(x) => Fire(x,y)` (wrong arrow, second predicate has 2 args)
- Invalid: `Smoke(x) → Fire(y)` (variable mismatch between antecedent and consequent)
- Invalid (rejected as circular): `Fire(x) → Fire(x)` (antecedent and consequent share a predicate — this rule can never add a new fact and is a degenerate self-loop, so it is refused at input time with a dedicated error)

## 3. Validation rules (applied before a fact/rule is accepted into the knowledge base)

| Input | Check | Error shown |
|---|---|---|
| Fact | non-empty | "Fact cannot be empty." |
| Fact | matches grammar | "Invalid fact format. Expected: Predicate(Entity) — e.g. Smoke(Mountain)" |
| Fact | not already present | "Duplicate fact: X already exists." |
| Rule | non-empty | "Rule cannot be empty." |
| Rule | matches grammar | "Invalid rule format. Expected: Predicate(x) → Predicate(x)" |
| Rule | variables match | "Variable mismatch. Both sides must use the same variable, e.g. Smoke(x) → Fire(x)" |
| Rule | not already present | "Duplicate rule: X already exists." |
| Rule | not a direct self-loop | "Circular rule rejected: both sides use the same predicate (X)." |

## 4. Inference algorithm (forward chaining)

```
INPUT:  facts[]  — initial known facts
        rules[]  — ordered list of rules
OUTPUT: derivedFacts[], allFacts[], trace[], iterations, stopReason

known ← map(fact.raw → fact) seeded from facts[]
derived ← []
trace ← []
iterations ← 0

repeat (until iterations == maxIterations):
    iterations += 1
    newInThisPass ← 0
    for each rule in rules:
        matches ← every known fact whose predicate == rule.antecedent.predicate
        for each match:
            conclusion ← rule.consequent.predicate + "(" + match.entity + ")"
            if conclusion not in known:
                add conclusion to known
                append conclusion to derived
                append {fromFact, ruleApplied: rule, toFact: conclusion} to trace
                newInThisPass += 1
    if newInThisPass == 0:
        stopReason ← "no_new_facts"
        break
```

- **Substitution**: a rule's variable `x` is bound to whatever entity satisfied the antecedent, and that same entity is substituted into the consequent. E.g. `Smoke(Mountain)` matching `Smoke(x)→Fire(x)` binds `x = Mountain`, producing `Fire(Mountain)`.
- **Deduplication**: a fact is keyed by its canonical string (`Predicate(Entity)`), so the same conclusion reached via two different rules is only added — and only traced — once (see TC07).
- **Termination**: guaranteed by the "no new facts this pass" fixed-point check, backed by a `maxIterations` cap (default 50) as a defensive limit.
- **Rule order**: rules are checked in the order they were added, once per pass; this only affects the *order* facts are discovered within a pass, never *which* facts are eventually derived (forward chaining to a fixed point is order-independent in the final result).

## 5. Circular rule handling

Two layers, matching `architecture.md` §7:

1. **Direct** self-loop (`Fire(x) → Fire(x)`) → rejected at validation, never enters the engine.
2. **Indirect** loop (`Fire(x)→Smoke(x)`, `Smoke(x)→Fire(x)`) → allowed at validation (each rule is individually well-formed), but safe at runtime: once `Fire(Mountain)` and `Smoke(Mountain)` both exist, every further match is already `known`, so `newInThisPass` hits 0 and the loop halts. See TC08.

## 6. Test cases (TC01–TC10)

All ten execute live against `InferenceEngine.run` on the Test & Analysis page — none are hardcoded strings.

| ID | Name | Facts | Rules | Expected derived facts |
|---|---|---|---|---|
| TC01 | Basic inference | `Smoke(Mountain)` | `Smoke(x)→Fire(x)` | `Fire(Mountain)` |
| TC02 | No matching rule | `Rain(Mumbai)` | `Smoke(x)→Fire(x)` | *(none)* |
| TC03 | Two-step inference | `Smoke(Mountain)` | `Smoke(x)→Fire(x)`, `Fire(x)→Hot(x)` | `Fire(Mountain)`, `Hot(Mountain)` |
| TC04 | Three-step inference | `Smoke(Mountain)` | `Smoke(x)→Fire(x)`, `Fire(x)→Hot(x)`, `Hot(x)→Dangerous(x)` | `Fire(Mountain)`, `Hot(Mountain)`, `Dangerous(Mountain)` |
| TC05 | Multiple facts | `Smoke(Mountain)`, `Smoke(Forest)` | `Smoke(x)→Fire(x)` | `Fire(Mountain)`, `Fire(Forest)` |
| TC06 | Multiple rules | `Smoke(Mountain)`, `Rain(Mumbai)` | `Smoke(x)→Fire(x)`, `Rain(x)→Wet(x)` | `Fire(Mountain)`, `Wet(Mumbai)` |
| TC07 | Duplicate conclusion | `Smoke(Mountain)`, `Ash(Mountain)` | `Smoke(x)→Fire(x)`, `Ash(x)→Fire(x)` | `Fire(Mountain)` *(only once)* |
| TC08 | Circular rules | `Fire(Mountain)` | `Fire(x)→Smoke(x)`, `Smoke(x)→Fire(x)` | `Smoke(Mountain)` *(terminates, no infinite loop)* |
| TC09 | Empty input | *(none)* | *(none)* | *(none)* |
| TC10 | Invalid rule/input | `smoke mountain` (malformed) | `Smoke(x) => Fire(x,y)` (malformed) | Both rejected with validation errors |

## 7. Complexity (as implemented)

- Let **R** = number of rules, **F** = number of currently known facts, **N** = maximum distinct facts the knowledge base can ever hold.
- One pass: for each rule, scan all known facts → **O(R·F)** per pass.
- Worst case: the loop runs until no new facts appear, and the knowledge base can grow by at most `N − |initial facts|` facts, so total time is **O(N·R·F)**.
- Space: **O(F)** for the known-facts map, plus **O(D)** for the derived list and trace, where `D ≤ N`.

## 8. Limitations (carried into `prd.md` and the Test & Analysis page verbatim)

- Rules must be explicitly provided — the system does not learn new rules automatically.
- Predicates are single-argument only (no `Related(x, y)` style relations).
- It does not understand unrestricted natural language input.
- It is a simplified computational reasoning model, not a full implementation of Nyāya philosophy.
- Results depend entirely on the completeness and correctness of the facts and rules the user supplies.
