# Phase — Implementation Plan

A phased build order, matching how this project was actually executed (and the order a fresh implementation, e.g. a real Vite port, should follow too — engine before UI, always).

## Phase 0 — Setup & inputs
- Confirm the 5-page scope and non-goals against `prd.md`.
- Collect assets: hero background image, any logo reference.
- Confirm design direction against `design.md` (palette, type, layout concept) before writing any component code.

**Exit criteria:** scope, assets, and visual direction agreed; no code written yet.

## Phase 1 — Core inference engine (standalone, no UI)
- Implement `Parser` (fact/rule grammar), `Validator` (input-level checks), `RuleMatcher` (single-rule matching), `InferenceEngine` (forward-chaining loop) as plain, framework-free functions.
- Write the 10 required test cases (TC01–TC10) as automated assertions against this module directly — not against any UI.
- Run the suite in an isolated environment (e.g. Node) and fix the engine until every case passes.

**Exit criteria:** 10/10 (12/12 counting the two-assertion cases) test cases pass against the standalone engine, verified outside the browser. **Do not proceed to Phase 2 until this holds.**

## Phase 2 — App shell & routing
- Set up the page shell: NavBar, Footer, and a router (hash-based for a zero-build single file; `react-router` if ported to Vite) covering the 5 routes.
- Stub each page with just a heading, to confirm navigation and layout scaffolding work end-to-end before content is written.

**Exit criteria:** all 5 pages reachable from the nav, back/forward and direct links work, no console errors.

## Phase 3 — Content pages (Home, Learn Nyāya, How It Works)
- Build Home: hero, Facts/Rules/Inference/Conclusion node diagram, 4 feature cards, hero image integration.
- Build Learn Nyāya: what-is-Nyāya (with the "inspired by, not equivalent to" hedge), smoke/fire example, IKS→CS mapping table, "why this project."
- Build How It Works: process flow, forward-chaining explanation, pseudocode block, worked 3-step example.

**Exit criteria:** all copy from `prd.md`/`rules.md` represented accurately; pages visually match `design.md`; every CTA routes correctly.

## Phase 4 — Inference Lab (the functional centerpiece)
- Wire the Phase 1 engine into the UI: fact input + chips, rule input + chips, validation error display, Run/Clear/Load-Example actions.
- Build the derived-facts display and the step-by-step reasoning trace, including the staggered reveal animation.
- Manually exercise: empty run, single-step, multi-step, duplicate conclusion, and an indirect circular pair — confirm the UI matches what Phase 1's engine actually returns for each.

**Exit criteria:** a user can go from a blank lab to a correct, correctly-ordered trace using only the UI, for every scenario in `rules.md` §6.

## Phase 5 — Test & Analysis
- Port the exact TC01–TC10 definitions from Phase 1 into the UI layer (same engine call, not a reimplementation).
- Build the results table (ID, input, expected, actual, status) and the `X / 10 Tests Passed` summary, computed live on render.
- Write the correctness, complexity, and limitations sections per `rules.md` §7–8.

**Exit criteria:** the on-page pass count matches the Phase 1 standalone result; re-running the suite after any later engine change is a required step, not optional (see `memory.md` §8).

## Phase 6 — Verification pass
- Syntax/lint check the full app.
- Re-extract and re-run the engine + test suite from the *shipped* build artifact (not just the source files) to close the loop between "what was tested" and "what ships."
- Manual pass over every validation error message against `rules.md` §3.
- Responsive check (mobile → desktop), reduced-motion check, keyboard focus check.

**Exit criteria:** matches `memory.md` §5 — this is the record of that this phase actually happened, not just that it was planned.

## Phase 7 — Documentation & handoff
- Produce/refresh `prd.md`, `architecture.md`, `rules.md`, `design.md`, `memory.md`, this `phase.md`.
- Note any open items (see `memory.md` §6) explicitly rather than silently leaving them undone.

**Exit criteria:** a new contributor (or a future session) can read `memory.md` §8's reading order and resume work without re-deriving decisions already made here.

## Status as of last build

Phases 0–6 complete for the single-file HTML delivery (see `memory.md` §5 for verification evidence). Phase 7 in progress — this document set is part of it. A literal multi-file Vite/React project (per `architecture.md` §3) has not yet been generated and would restart at Phase 2 of this plan using the already-verified Phase 1 engine code unchanged.
