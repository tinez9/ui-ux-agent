# Evidence and confidence

How to know what you know about an interface, and how to say it.

## Quick rules

1. Every finding has three layers: **evidence → interpretation → recommendation**. Never merge them.
2. Every evidence item names its **source**; every finding names its **basis** and **confidence**.
3. Confidence is capped by the weakest link needed for the claim (see caps below).
4. Write in the modality the evidence supports: *observed* ("renders", "overflows") only with
   BROWSER/INTERACTION/SCREENSHOT/TOOL evidence; otherwise *inferred* ("the code suggests",
   "likely", "potential").
5. A tool "pass" is evidence only for the rule and state actually exercised — never "accessible",
   "responsive" or "consistent" in general.
6. Uninspected = `not assessed`, not "fine".
7. Detection is not adjudication: a measured difference (drift, diff, deviation) is not
   automatically a defect; classify it (see `design-systems.md` § Drift triage).

## The three layers

| Layer | Contains | Example |
|---|---|---|
| Evidence | observable, reproducible facts with location, viewport, state | "At 390×844, default state, `nav.primary` scrollWidth 612 > 390; items Reports/Settings off-screen." |
| Interpretation | what the facts mean for users and tasks | "The navigation model doesn't adapt to narrow screens; two core destinations become undiscoverable." |
| Recommendation | direction of change + how to verify it | "Use a compact mobile navigation preserving the 3 primary destinations. Verify: all destinations reachable at 320/390/768 without horizontal scroll." |

Opinions are allowed — label them. "I find the palette cold" is a taste statement (basis
HEURISTIC/INFERENCE, low confidence) and must not be written as a defect.

## Evidence sources

| Source | What it is | Strong for | Weak / cannot establish |
|---|---|---|---|
| `BROWSER` | rendered UI inspected: DOM, computed styles, measured geometry, accessibility tree | layout, overflow, computed contrast, what actually shipped, which states render | intent; whether a value is deliberate; real AT experience |
| `INTERACTION` | behaviour exercised: clicks, keyboard, focus movement, navigation, state transitions | focus order/recovery, feedback, flows, dynamic states, errors | user comprehension; preference |
| `SCREENSHOT` | an image actually viewed (captured or provided) | hierarchy, composition, density, visual coherence, impression | hidden semantics, states not shown, exact values |
| `CODE` | source read | structure, semantics, tokens vs literals, state logic, ARIA, breakpoints | final appearance, cascade results, runtime data, real overflow |
| `TOOL` | deterministic tool output (axe, style-census, Lighthouse, render-check) | exactly the rules/measures run | anything outside those rules; "incomplete" results |
| `USER` | provided by user/project: analytics, research, support tickets, brand rules | behaviour/outcomes, intent | depends on its own provenance |

## Basis of the judgement

| Basis | Meaning | Example |
|---|---|---|
| `STANDARD` | normative requirement or platform rule | WCAG 2.2 SC 1.4.10 Reflow; HTML/ARIA semantics |
| `RESEARCH` | empirical studies, established UX research | proximity grouping; recognition over recall |
| `DESIGN_PRINCIPLE` | mature, broadly accepted design practice/design-system guidance | semantic tokens; consistent identification |
| `HEURISTIC` | practitioner heuristic or agent synthesis | identity-ablation test; icon deletion pass |
| `INFERENCE` | reasoning specific to this case without direct support | "users probably expect…" |

Keep the evidence ladder for claims about patterns and trends:
**showcase signal → commercial/creative signal → product adoption → measured behaviour/outcome.**
Showcase prevalence never proves usability; adoption never proves superiority; only outcome
evidence supports "performs better".

## Confidence

| Level | Requires |
|---|---|
| `high` | direct evidence (BROWSER / INTERACTION / TOOL, or SCREENSHOT for purely visual claims) of the phenomenon itself **and** a STANDARD / RESEARCH / DESIGN_PRINCIPLE basis **and** clear impact |
| `medium` | direct evidence of part of the claim with inference for the rest; or very specific CODE evidence of a mechanism (e.g. `outline: none` with no replacement focus style; `<div onClick>` without role/tabindex) |
| `low` | inference about appearance/behaviour not observed; purely heuristic/aesthetic judgement; indirect signals |

### Caps (non-negotiable)

- Visual, layout, responsive or contrast claims based only on `CODE` → **max medium**, phrased as
  potential ("may overflow", "likely low contrast because `#999` on `#fff` is used for body text").
- Claims about user comprehension, preference or behaviour without `USER` evidence → **max medium**,
  framed as a risk/hypothesis.
- Accessibility claims requiring assistive-technology experience (announcement quality,
  meaningful order, understandable custom interaction) → **max medium** unless tested with AT;
  route to human/AT review.
- Taste-only claims (no task/clarity/identity consequence) → **low**, category `opportunity`
  at most.

## What each evidence layer can and cannot prove

Different checks answer different questions. Do not let one stand in for another.

| Layer | Proves | Does not prove |
|---|---|---|
| Static/code & token analysis | which values/roles/APIs are used, deprecated usage, impossible token pairs, missing semantics | appearance, cascade outcome, real contrast on real backgrounds |
| Rendered DOM rules (axe-like) | machine-decidable violations in the rendered state that was checked | anything about states not rendered (menus closed, async not finished), meaning, usability |
| Behavioural browser tests | deterministic mechanics: key mappings, focus destination, state transitions, overflow at a width | whether the result is understandable or the right design |
| Accessibility-tree snapshot | roles/names/states structure after a step | that the keyboard reached it; visible focus; AT experience |
| Rendered visual inspection | perceptible hierarchy, focus visibility, clipping, density, coherence | hidden semantics; behaviour of states not exercised |
| Visual regression (baseline diff) | something changed | whether the change is wrong (intended evolution vs regression) |
| Human / AT review | meaning, predictability, real assistive experience | — (but costly; use selectively) |

Tool results have **three** outcomes, keep them: `violation` · `pass (for this rule, this state)`
· `needs review / incomplete`. A clean automated a11y run covers only a fraction of WCAG.

Rendered verification has distinct jobs — name which one you did: regression (did an approved
baseline change?), reference parity (does it match a spec?), rendered QA (does the real state show
defects?), design critique (is the direction right?). Pixel similarity is not UX quality.

## Evidence about an existing design system or intent

When inferring "the rules" of an existing product, label each claim:

- `NORMATIVE` — explicitly defined by current tokens/theme/docs/brand rules.
- `REPEATED` — consistent across representative surfaces.
- `OBSERVED` — exact shipped value, intent unknown.
- `APPROXIMATED` — inferred visually or from incomplete evidence.
- `CONFLICT` — credible sources disagree.
- `EXCEPTION` — local deviation, not a global rule.

Runtime truth is not design intent: a computed `13px` gap may be a token, an inherited default,
a legacy patch or an accident. Never promote a single observed value into a rule.

## Phrasing guide

| Evidence you have | Write | Never write |
|---|---|---|
| Rendered + measured | "At 390px the table overflows by 220px." | — |
| Code only | "The fixed `width: 960px` on `.table-wrap` suggests horizontal overflow below 960px (not rendered)." | "The mobile layout is broken." |
| Screenshot provided by user | "In the provided screenshot, the primary CTA has less visual weight than the secondary link." | "The CTA is never noticed by users." |
| Heuristic only | "Risk: users may not find X because the label 'Hub' gives little scent." | "Users can't find X." |
| Tool pass | "axe found no violations in the default state of /settings." | "/settings is accessible." |

## Coverage statement

Every audit/review states:
- environment (browser tool used or static mode; app version/commit; data used);
- viewports inspected; states inspected (see `states.md` matrix); flows exercised;
- lenses applied; what was **not assessed** and why;
- how the coverage limits confidence in the dimension ratings.

## Bias controls

- **Self-evaluation bias.** Agents tend to praise their own output. When reviewing your own
  implementation, re-inspect as if it were someone else's; for large redesigns recommend a review
  in a fresh context (separate session/subagent) with a skeptical brief.
- **Anchoring on the first hypothesis.** Before finalizing a high-severity finding, look for
  counter-evidence (is there a mobile nav elsewhere? is the state handled in a parent?).
- **Happy-path bias.** Default data and fast networks hide most problems; see `states.md`.
- **Screenshot ≠ product.** A reconstruction, mockup or design-tool preview is not the shipped UI.
