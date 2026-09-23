# Memory — Project Context & Decision Log

Purpose: a running record of what this project is, what's been decided, what's been built and verified, and what's still open — so a future session (or another contributor) can pick this up without re-deriving context from scratch.

## 1. What this project is

NYĀYA — a 5-page academic web app mapping the IKS concept of Nyāya reasoning onto a deterministic rule-based forward-chaining inference engine, for a Computational Systems course. Full requirements: `prd.md`. Full algorithm/grammar: `rules.md`. Full visual system: `design.md`. Full technical structure: `architecture.md`.

## 2. Key constraints that shaped decisions

- **Explicitly not an AI/LLM chatbot.** The inference engine must be deterministic and rule-based — this was a hard requirement from the original brief, repeated multiple times. No external AI API is called anywhere in the app.
- **No network access in the build environment.** This ruled out `npm install`, which ruled out actually building/testing a real Vite project here. See decision in §4.
- **Exactly 5 pages, no more.** The brief was explicit about not adding auth, a database, admin dashboard, or other unrequested scope. Resist scope creep here.
- **Test cases must execute against the real engine.** Not "PASS" strings — the brief called this out as an explicit requirement, and it's the thing most likely to be checked closely in a viva.

## 3. Assets provided by the user

- `bg.png` (1536×1024) — hero/background image, used on the Home page only. Compressed to a ~96KB JPEG and inlined as base64 to keep the single-file deliverable self-contained (no external image hosting, works offline).
- A reference mockup image showing the desired Home page look (navbar, hero copy, node diagram, feature cards) — used as the visual target for `design.md` and the Home page implementation. Not itself an asset embedded in the app; no separate "logo" file was provided, so the logo mark was recreated as a small inline SVG (crescent + center spark) based on the mockup's icon.

## 4. Decision: single-file HTML instead of a Vite project

**Context:** brief asked for React + Vite + Tailwind with a conventional `src/` tree.
**Constraint:** no network access → can't `npm install` → can't run/verify a real Vite build here.
**Decision:** build as one self-contained `.html` file using React 18 (UMD via CDN), `htm` (tagged-template JSX substitute, no compiler needed), and Tailwind's Play CDN — everything testable and runnable with zero build step.
**Trade-off accepted:** doesn't match the exact requested folder structure out of the box. Mitigated by writing the code in clearly separated, drop-in-ready sections (engine functions, components) and documenting the equivalent multi-file layout in `architecture.md` §3, so porting to a real Vite project later is mechanical, not a rewrite.
**Status:** shipped and verified (see §5). If the user needs the literal multi-file project for submission, that's the next thing to build — flagged to the user as unverifiable-by-me (no build tool access) rather than silently shipped as if tested.

## 5. Verification performed (what's actually been checked, not just written)

1. Wrote the engine (`Parser`, `Validator`, `RuleMatcher`, `InferenceEngine`) as a standalone Node module first, **before** any UI code.
2. Wrote all 10 required test cases (TC01–TC10) as Node assertions against that module. Result: **12/12 assertions passed** (TC08 and TC10 each cover two assertions — direct-circular rejection + indirect-circular termination; malformed fact + malformed rule rejection, respectively).
3. Built the full single-file app, embedding the same engine logic (not a reimplementation) plus the React/htm UI on top.
4. Ran `node --check` against the extracted `<script>` contents to confirm no JS syntax errors in the shipped file.
5. Re-extracted just the engine + `runTestSuite()` from the shipped file and ran it standalone again in Node — confirmed **10/10** test cases pass against the exact code that ships, closing the loop between "what was tested" and "what was delivered."

This two-stage check (author-time module tests → extracted-from-shipped-file re-test) is why the Test & Analysis page's live pass count can be trusted.

## 6. Open items / not yet done

- No multi-file Vite/React project has been generated yet — only the architecture for one (`architecture.md` §3). Build on request.
- No automated visual regression / screenshot review was performed against the reference mockup; the Home page was built to match it by eye plus the written `design.md` spec.
- Backward chaining, multi-argument predicates, and session persistence are explicitly out of scope for v1 (`prd.md` §9) — don't add these without confirming the assignment actually wants scope expanded.

## 7. Where things live

- `nyaya.html` — the shipped, working, tested single-file app (published as a live Claude artifact link in the conversation).
- `docs/prd.md`, `docs/architecture.md`, `docs/rules.md`, `docs/design.md`, `docs/memory.md` — this documentation set.

## 8. If resuming this project later

Read in this order: `prd.md` (what/why) → `rules.md` (the algorithm/grammar contract — treat this as the spec any engine change must keep satisfying) → `architecture.md` (how it's built and why single-file) → `design.md` (visual constraints) → this file (what's actually verified vs. assumed). Then re-run the Node verification in §5 after any engine change, before touching UI code.
