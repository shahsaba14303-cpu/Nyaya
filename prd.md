# PRD — NYĀYA: Rule-Based Inference & Reasoning System

## 1. Summary

NYĀYA is a web application built for a Computational Systems (IKS) course assignment. It demonstrates how a reasoning-oriented concept from the Indian philosophical tradition of Nyāya — inferring unseen facts from observed ones (e.g. inferring fire from smoke) — maps onto a modern Computer Science concept: a **deterministic, rule-based forward-chaining inference engine**.

This is explicitly **not** an AI/LLM chatbot. There is no external model call anywhere in the app. All reasoning is local, deterministic, and inspectable.

## 2. Goals

- Let a user enter facts and rules, run inference, and see newly derived facts.
- Make the reasoning process transparent via a step-by-step trace (which rule fired on which fact, in what order).
- Ground the CS concept in the IKS concept it is inspired by, without overclaiming equivalence.
- Provide a test suite (10+ cases) that executes against the real engine, not hardcoded output, to satisfy the academic correctness requirement.
- Present correctness, complexity, and limitations analysis for the viva.

## 3. Non-Goals

- No authentication, accounts, or database.
- No admin dashboard or payment system.
- No chatbot / natural-language interface / external AI API calls.
- No unbounded predicate arity — only single-argument predicates (`Predicate(Entity)`), matching the smoke → fire style examples used throughout.
- No claim that this system is a literal, complete implementation of Nyāya philosophy.

## 4. Target User

A course instructor/evaluator and the student presenting it in a live demo/viva. Secondary audience: any visitor curious about IKS → CS mappings.

## 5. Scope — Exactly 5 Pages

| # | Page | Purpose |
|---|------|---------|
| 1 | Home | Landing page; visually communicates Facts → Rules → Inference → Conclusion; routes to the other 4 pages. |
| 2 | Learn Nyāya | Explains the IKS concept, gives the smoke/fire example, an IKS→CS mapping table, and the "why this project" rationale. |
| 3 | How It Works | Explains forward chaining, shows the process flow and pseudocode, walks a 3-step example. |
| 4 | Inference Lab | The functional centerpiece — add facts/rules, run inference, see derived facts + reasoning trace. |
| 5 | Test & Analysis | 10 live-executed test cases, pass/fail summary, correctness/complexity/limitations write-up. |

## 6. Functional Requirements

### 6.1 Fact input (Inference Lab)
- Accepts strings of the form `Predicate(Entity)`, e.g. `Smoke(Mountain)`.
- Rejects empty input, malformed syntax, and duplicates, with a specific error message per case.
- Facts render as removable chips.

### 6.2 Rule input (Inference Lab)
- Accepts strings of the form `Predicate(x) → Predicate(x)` (ASCII `->` also accepted).
- Both sides must share the same variable.
- Rejects empty input, malformed syntax, duplicates, and **direct** self-referential rules (`Fire(x) → Fire(x)`), which are circular by construction.
- Rules render as removable chips.

### 6.3 Inference execution
- "Run Inference" requires ≥1 fact and ≥1 rule.
- Uses forward chaining: repeatedly match rule antecedents against known facts, substitute the matched entity into the consequent, add the result if new, repeat until a full pass yields nothing new.
- Must terminate even on **indirect** circular rule chains (e.g. `Fire(x)→Smoke(x)`, `Smoke(x)→Fire(x)`) — guaranteed both by the "new facts only" fixed-point condition and a hard iteration cap as a backstop.
- Output: full list of derived facts, plus a trace of `{fromFact, ruleApplied, toFact}` per derivation step, in the order derived.

### 6.4 Test & Analysis
- At least 10 predefined test cases (TC01–TC10, listed in `rules.md`), each with an ID, input, expected result, and category (basic, no-match, multi-step, multi-fact, multi-rule, duplicate-conclusion, circular, empty, invalid).
- Each test **executes against the live engine** at render/build time — no hardcoded "PASS" strings.
- Displays an `X / 10 Tests Passed` summary.

### 6.5 Error handling
- All invalid states (empty input, bad syntax, duplicates, circular rules, no-match rules) produce a specific, user-readable message rather than a silent failure or crash.

## 7. Non-Functional Requirements

- **No external AI API calls.** All inference logic runs client-side in the browser.
- **Deterministic.** Same facts + rules always produce the same derived facts and the same trace order.
- **Reusable/testable engine.** Inference logic is isolated from UI code so it can be exercised by an automated test suite independent of any component render.
- Responsive down to mobile widths; visible focus states; reduced-motion respected.
- Should run standalone with zero build step for demo purposes (see `architecture.md` for why).

## 8. Success Criteria

- 10/10 predefined test cases pass when run against the actual engine.
- A user can, from a blank Inference Lab, load the smoke → fire → hot → dangerous example (or type their own) and see a correct, correctly-ordered reasoning trace.
- All 5 pages are reachable from the nav and from each other via in-page CTAs, forming the intended user journey: Home → Learn Nyāya → How It Works → Inference Lab → Run → Trace → Test & Analysis.
- No console errors during normal use, including on invalid input.

## 9. Out of Scope for v1 (possible future work)

- Multi-argument predicates (`Related(x, y)`).
- Backward chaining / goal-directed queries.
- Saving/sharing fact-rule sets between sessions.
- A downloadable PDF export of a reasoning trace for the viva report.
