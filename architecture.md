# Architecture — NYĀYA Inference Engine

## 1. Delivery format (and why)

The brief's preferred stack was **React + Vite + Tailwind** with a conventional multi-file `src/` tree. The build environment this project was authored in has **no network access**, which makes `npm install` (and therefore a real Vite build) impossible to run or verify here.

To avoid shipping unverified/untested code, the app was instead built and fully tested as a **single self-contained `.html` file**:

- **React 18** (UMD build) + **ReactDOM 18** — loaded from a CDN `<script>` tag, no bundler.
- **[htm](https://github.com/developit/htm)** — tagged-template syntax bound to `React.createElement`, giving JSX-like ergonomics (`html\`<div>...\`) without a Babel/JSX compile step.
- **Tailwind CSS** — Play CDN build, configured inline via `<style>` for the custom design tokens Tailwind's defaults don't cover (glass panels, gold gradient text, keyframes).
- **Google Fonts** (Fraunces + Manrope) loaded via `<link>`.
- One background image, compressed and inlined as a base64 `data:` URI (no external image hosting).

This keeps the entire deliverable runnable by double-clicking the file or opening it in any static host — no `npm install`, no build step, nothing that can go stale or fail to install during a live demo.

If a real Vite/React multi-file project is required for submission, the same component and engine code can be split into the structure in §3 below; the logic does not change, only the module boundaries and the build tooling around it.

## 2. Logical architecture

```
┌─────────────────────────────────────────────┐
│                    UI Layer                  │
│  NavBar · Footer · 5 Page components         │
│  (Home, Learn, HowItWorks, Lab, TestAnalysis)│
└───────────────────┬───────────────────────────┘
                     │ calls (pure functions, no side effects)
┌───────────────────▼───────────────────────────┐
│                 Engine Layer                   │
│  Parser → Validator → RuleMatcher →            │
│  InferenceEngine                               │
└─────────────────────────────────────────────────┘
```

The engine layer has **zero DOM/React dependency**. Every engine function takes plain data in and returns plain data out, which is what makes it independently testable (see `rules.md` §Test Cases, and `memory.md` for how it was verified with Node before being wired into the UI).

## 3. Suggested multi-file structure (for a Vite port)

```
src/
  engine/
    parser.js          # string -> {predicate, entity} | {antecedent, consequent}
    validator.js        # input-level checks (empty, duplicate, circular, syntax)
    ruleMatcher.js       # matches one rule's antecedent against a fact list
    inferenceEngine.js   # forward-chaining loop, fixed-point + iteration cap
    engine.test.js       # the 10 TC01–TC10 cases, run with a test runner
  data/
    testCases.js         # TC01–TC10 fact/rule/expected definitions
  components/
    NavBar.jsx
    Footer.jsx
    Logo.jsx
    Chip.jsx
    FeatureCard.jsx
    PageHeader.jsx
    NodeDiagram.jsx       # Home hero Facts/Rules/Inference/Conclusion diagram
    FlowStep.jsx           # How It Works vertical flow node
  pages/
    Home.jsx
    Learn.jsx
    HowItWorks.jsx
    Lab.jsx                # Inference Lab — the functional centerpiece
    TestAnalysis.jsx
  utils/
    router.js               # tiny hash-based route hook (or swap for react-router)
  assets/
    hero-bg.jpg
  App.jsx
  main.jsx
tailwind.config.js
vite.config.js
package.json
```

Mapping from the current single file to this structure is mechanical: each `function X() { ... }` in the shipped `nyaya.html` becomes `X.jsx` (or `X.js` for the engine), htm's `` html`...` `` calls become JSX, and CDN `<script>` tags are replaced by `import` statements resolved through Vite/npm.

## 4. State management

No global store. `App` holds the current `route` (from `window.location.hash`, so pages are shareable/bookmarkable and survive a refresh). `Lab` holds its own local state:

- `facts: Fact[]`, `rules: Rule[]`
- `factInput`, `ruleInput` (controlled text fields)
- `factError`, `ruleError` (validation messages)
- `result: InferenceResult | null` (cleared whenever facts/rules change, so a stale trace is never shown against an edited knowledge base)

`TestAnalysis` computes its results with `useMemo(() => runTestSuite(), [])` — the suite runs once per page visit, directly against `InferenceEngine.run`, not against any stored/precomputed values.

## 5. Data flow for one "Run Inference" click

```
user clicks Run
   → Lab.runInference()
   → InferenceEngine.run(facts, rules)
        → loop passes:
            for each rule:
              RuleMatcher.matchRule(rule, knownFacts)
              for each match not already known:
                 add to `known` map (dedup key = canonical fact string)
                 push to `derived[]`
                 push a trace entry {fromFact, ruleApplied, toFact}
        → stop when a pass adds 0 new facts, or maxIterations reached
   → setResult({ derivedFacts, allFacts, trace, iterations, stopReason })
   → UI renders derived-fact chips + trace, staggered via CSS animation-delay
```

## 6. Why forward chaining (and not backward chaining)

The assignment's worked examples (`Smoke(Mountain)` → `Fire(Mountain)` → `Hot(Mountain)`) are **data-driven**: reasoning starts from what's observed and pushes forward to conclusions, which is exactly forward chaining's shape. Backward chaining (start from a goal, ask what would prove it) fits a query like "is `Dangerous(Mountain)` provable?" better, which is out of scope for v1 (see `prd.md` §9).

## 7. Termination guarantee

Two independent safeguards, both implemented (see `rules.md` §Circular Rule Handling):

1. **Direct** self-loops (`Fire(x) → Fire(x)`) are rejected at input-validation time — they can never enter the rule set.
2. **Indirect** loops (`A(x)→B(x)`, `B(x)→A(x)`) are safe at runtime because a fact is only ever added once (`known.has(raw)` dedup check); once both `A(e)` and `B(e)` exist for an entity, no further pass can add anything new, so the fixed-point condition naturally halts the loop. A `maxIterations` cap (default 50) is kept as a defensive backstop for any rule shape not anticipated above.

## 8. Testing strategy

- The engine module was extracted and run standalone under Node (no browser/React involved) against the 10 required test cases before being wired into any UI code.
- The exact same engine code (not a reimplementation) is embedded in the shipped HTML and re-exercised live by the Test & Analysis page on every load.
- This two-stage verification (author-time Node run + runtime in-browser run) is why the `X / 10 Tests Passed` counter can be trusted rather than hardcoded.
