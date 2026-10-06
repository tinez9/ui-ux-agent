# Severity, prioritization and ratings

Turn observations into an ordered, defensible list of actions.

## Quick rules

1. Severity is assigned from **anchors** (below), not from how annoying something feels.
2. Rank with **hard gates first**, then a score inside each band, then tie-breakers.
3. Group symptoms under **root causes**; fix causes, not 40 symptoms.
4. Every Top-5 item states *why it ranks above the next one*.
5. Low-confidence findings never sit in the Top 5 unless critical — then as "verify first".
6. Dimension ratings come from a rubric and carry confidence + coverage; no single overall score.

## Severity anchors

| Severity | Use when (any is sufficient) |
|---|---|
| `critical` | A core task cannot be completed by some users; data loss or irreversible harm is plausible; users are misled about a consequential state (money, deletion, sharing, privacy, AI action taken); a WCAG A-level failure blocks a core flow (keyboard trap, no name on the only submit, content unreachable); security/privacy exposure in the UI. |
| `high` | Significant friction, error-proneness or confusion on a **core** flow; WCAG AA failure on a core flow (contrast of body text, reflow at 320px, focus invisible, target < 24px without exception); responsive breakage on a primary viewport; misleading or missing feedback for consequential actions; hierarchy that hides the primary action or consequential alternatives. |
| `medium` | Friction or confusion on secondary flows; inconsistencies that make users relearn (same action, different name/behaviour); visual issues that slow comprehension; missing states with workarounds; design-system drift that will compound. |
| `low` | Polish; minor inconsistency with no task impact; small spacing/alignment issues; copy refinements. |
| `opportunity` | Not a defect: differentiation, delight, efficiency for experts, distinctiveness, future-proofing. |

Use the hierarchy tier of the affected element (`layout-and-hierarchy.md`) as a sanity check:
problems on **T0** (safety/state) or **T1** (task anchor) elements are rarely below `high`;
problems only on **T4** (ambient) are rarely above `low`.

Generic-looking UI ("AI slop") is `opportunity`/`low` by default. Raise it only when it also
damages hierarchy, legibility, trust or the task — and then classify it under that category.

## Reach

| Reach | Meaning |
|---|---|
| `core` | on a primary flow or a surface most users hit |
| `secondary` | real but less frequent flow / subset of users |
| `edge` | rare state, rare role, unusual environment |

Use `USER` evidence (analytics, research, support) when available; otherwise infer from the
product context and say so.

## Priority method

**Step 1 — hard gates (non-compensatory).** These are not traded off against anything:
1. All `critical` findings rank above all others.
2. Accessibility failures that block a core flow have a floor of `high`.
3. Findings with `confidence: low` cannot enter the Top 5 unless `critical`; critical
   low-confidence items appear as **"verify first"**.

**Step 2 — score within each severity band:**

`priority = severity_weight × reach_weight × confidence_weight`

| severity | weight | reach | weight | confidence | weight |
|---|---:|---|---:|---|---:|
| critical | 4 | core | 3 | high | 1.0 |
| high | 3 | secondary | 2 | medium | 0.7 |
| medium | 2 | edge | 1 | low | 0.4 |
| low | 1 | | | | |
| opportunity | 0.5 | | | | |

Why not *impact × severity × confidence × frequency*: impact and severity largely measure the
same thing (double counting), and a multiplicative formula lets low confidence hide a critical
issue. Gates handle the dangerous cases; the score only orders the rest.

**Step 3 — tie-breakers:** (a) root cause that resolves more findings; (b) dependency — fixes that
unblock others (e.g. tokens before restyling components); (c) effort — `s` before `m` before `l`.

**Step 4 — explain.** For each Top-5 item: one line "ranked above X because …".

## Root-cause clustering

Before ranking, group findings that share a cause and give the group an ID (`RC-01`…).

| Symptoms | Typical root cause |
|---|---|
| 40+ hex colors, 9 radii, 3 button implementations | no semantic token layer / components bypassed |
| overflow at 390px in nav, table, toolbar | layout built on fixed widths; no container-level responsiveness |
| missing loading/empty/error in many views | data fetching without a state model |
| inconsistent names for one concept | no shared domain vocabulary / mental model |
| every section boxed, flat hierarchy | containers used instead of spacing/alignment hierarchy |
| invisible focus on many components | global `outline: none` reset |

Report the cause once with its symptoms; recommend the systemic fix first, then local fixes
where the systemic one is too expensive.

## Effort

`s` — local change, hours. `m` — several components/screens or a pattern change, days.
`l` — architecture, design-system or IA change, weeks. Effort orders work; it does not change
severity.

## Dimension ratings (0–10)

Rate each dimension that was assessed. Ratings summarize findings — they are judgments, not
measurements — and must be consistent with them.

| Dimension | Covers |
|---|---|
| UX & flow | task fit, IA, navigation, mental model, onboarding, content clarity |
| Interaction & states | feedback, states, forms, errors, recovery, overlays, motion purpose |
| Visual & hierarchy | hierarchy, composition, typography, color, density, imagery, coherence |
| Responsive | composition across widths, containers, zoom/reflow, touch |
| Accessibility | WCAG-oriented floor + keyboard/focus/semantics |
| Design system | token/component consistency, drift, state consistency, governance |
| Identity & distinctiveness | product-specific character vs interchangeable template |
| AI UX (if applicable) | control, uncertainty, provenance, recovery, activity |

Anchors:

| Rating | Meaning |
|---|---|
| 9–10 | exemplary; no high findings; only low/opportunity |
| 7–8 | solid; no critical; few high on secondary flows |
| 5–6 | workable with notable friction; some high findings on core flows |
| 3–4 | weak; several high or one critical that is contained |
| 0–2 | failing; critical findings block core use |

Constraints: a dimension with any open `critical` is ≤ 4; with a `high` on a core flow ≤ 6.
Each rating shows **confidence** (from evidence quality) and **coverage** (what fraction of the
planned surfaces × states was actually inspected). If coverage is too thin, write
`not assessed` instead of a number.

Do **not** compute an overall score: averages hide a critical problem behind good numbers.
Instead give a one-line **verdict** (e.g. "Usable on desktop; mobile checkout is blocked by two
critical responsive issues; visually generic but coherent").

## Opportunities

List separately from defects, ordered by expected value for the product (differentiation,
efficiency for frequent tasks, trust), each with a rough effort. Opportunities never displace
critical/high fixes in the Top 5 unless the user asked specifically for them.
