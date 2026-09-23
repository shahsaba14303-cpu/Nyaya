# Design — Visual System

## 1. Direction

Modern reasoning/research product with an Indian-inspired but non-literal visual language: no temples, sages, or historical illustration — instead, connected-node motifs, arch/threshold imagery, and a jewel-toned dark palette that reads as premium and contemporary rather than "ancient museum piece."

## 2. Color tokens

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#061917` | Page background, near-black deep teal |
| `--bg-2` | `#08211e` | Secondary background tint |
| `--surface` | `#0c2b27` | Card/input fill (primary deep teal/green) |
| `--surface-2` | `#0f342f` | Chip fill, slightly lighter |
| `--glass` | `rgba(230,224,205,0.045)` | Glassmorphic panel fill |
| `--glass-brd` | `rgba(214,178,115,0.18)` | Glass panel border (muted gold) |
| `--gold` | `#c9a15c` | Accent — links, icons, dividers |
| `--gold-bright` | `#e7c98a` | Accent — headings, active states, CTA hover |
| `--gold-dim` | `rgba(201,161,92,0.35)` | Low-emphasis gold (arrows, selection highlight) |
| `--cream` | `#f2ecdd` | Primary text |
| `--muted` | `#9fb3ad` | Secondary text |
| `--muted-2` | `#6f8781` | Tertiary text, eyebrows, captions |
| `--good` | `#7fb88f` | Success / derived-fact indicator |
| `--bad` | `#d98a6a` | Error / fail indicator |

Rationale: warm gold against deep teal gives enough contrast for legibility (cream text ≈ 12:1 against `--bg`) without resorting to the generic near-black-plus-neon-accent pattern common in AI-generated dark UIs — the palette is deliberately warm rather than acid-toned.

## 3. Typography

- **Display / headings** — `Fraunces` (variable optical-size serif). Used for page titles, the NYĀYA wordmark, and section headers. Chosen for its warmth and slightly humanist, non-corporate serif character — distinct from the Playfair-Display-plus-Inter combination that's become a generic default.
- **Body / UI** — `Manrope`. Clean, slightly geometric sans-serif for body copy, labels, buttons, and code-like fact/rule strings.
- Scale: hero H1 uses a large fluid clamp (`15vw` down to `~text-8xl` at desktop), page H1s sit at `text-4xl`–`text-5xl`, section headers at `text-lg`–`text-2xl`, body copy at `text-sm`–`text-base` with relaxed line-height for readability at ≤ 80-character line lengths.

## 4. Layout

- Max content width `max-w-7xl` (home) / `max-w-4xl`–`max-w-6xl` (inner pages) — centered, generous side padding (`px-5` mobile, `px-8` desktop).
- Sticky translucent nav (blurred, bottom-hairline border) so the 5-page structure is always one tap away.
- Home hero: two-column on desktop (copy left, Facts/Rules/Inference/Conclusion node diagram right, hero image bleeding in from the right edge under a mask gradient); stacks to one column on mobile.
- Inner pages: single centered column of glass cards, one concern per card (e.g. "What is Nyāya?", "Simple reasoning example", "IKS → CS mapping" as separate cards) rather than one long undifferentiated block of text.
- Inference Lab: two-column Facts/Rules input side by side on desktop, stacking on mobile; results (initial facts → derived facts → reasoning trace) flow beneath as three distinct cards in reading order.

```
Home            [ Eyebrow / H1 / Subhead / CTAs ]  [ Node diagram + hero image ]
                [        4 feature cards, one row on desktop         ]

Inner page      [        centered H1 + intro        ]
                [ card ] [ card ] [ card ] ...  (stacked, one topic each)

Inference Lab   [ Facts card ]   [ Rules card ]
                [        Run / Load Example / Clear         ]
                [ Initial facts card ]
                [ Derived facts card ]
                [ Reasoning trace card ]
```

## 5. Components

- **Glass card** (`.glass`): translucent fill + blur + hairline gold-tinted border. The one recurring container shape across the whole app — used for feature cards, content sections, the fact/rule input panels, and trace cards.
- **Chip**: pill-shaped fact/rule token with a remove (✕) affordance; pops in with a small scale/translate animation on add.
- **Buttons**: two variants only — `btn-gold` (filled gradient, primary actions: Run Inference, Try the Engine, Get Started) and `btn-ghost` (outlined, secondary actions: Explore Nyāya, Clear). No third button style.
- **Node diagram** (Home hero): four glass nodes (Facts / Rules / Inference / Conclusion) arranged around a center logo mark, connected by a faint circular thread — a direct, literal visualization of the FACTS → RULES → INFERENCE → CONCLUSION idea the brief asked for, without a generic flowchart look.
- **Reasoning trace row**: `fromFact → RuleId: rule → toFact`, each row rendered as three small code-style chips joined by arrows, so a viewer can read the derivation left-to-right at a glance.

## 6. Motion

Deliberately restrained — matching the brief's "use animation only where useful" instruction:

- **Fact/rule chip addition** — a single pop-in (scale + fade), not a generic fade-slide on every element.
- **Reasoning trace reveal** — each trace row and each derived-fact chip is staggered in with a short `animation-delay`, so the trace visibly "unrolls" step by step when inference runs, mirroring the actual sequential nature of forward chaining.
- **Run Inference** — a short spinner state on the button while the engine runs, giving the action visible weight rather than an instant, unremarkable state flip.
- **Page load** — a single fade-up on the page header, not a cascade of animated sections.
- `prefers-reduced-motion: reduce` collapses all of the above to near-zero duration.

## 7. Imagery

The provided arch/water/mountain hero image is used once, on the Home page only, bled in from the right edge under a left-to-right mask so it reads as an atmospheric backdrop rather than a competing focal element. It is not repeated on inner pages, keeping their focus on content and the interactive engine itself.

## 8. Writing/tone

- Active voice, plain language: "Add facts and rules, then run the forward-chaining engine" rather than "Leverage rule-based inference technology."
- Error messages state exactly what's wrong and what's expected (e.g. "Invalid rule format. Expected: Predicate(x) → Predicate(x)"), never vague.
- The Learn Nyāya page explicitly hedges the philosophical claim ("does not claim to be a literal computational implementation…inspired by") rather than overclaiming equivalence between Nyāya and the engine — an accuracy requirement carried through from the brief.
