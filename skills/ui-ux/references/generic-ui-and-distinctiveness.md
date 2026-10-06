# Generic UI ("AI slop") and distinctiveness

Detect interfaces that feel interchangeable, and judge whether that matters — without turning
taste into prohibitions.

## Quick rules

1. **A legitimate style becomes an AI tell when it appears independent of subject matter.** The
   pattern is rarely the problem; its arbitrariness is.
2. Analyse every suspect as **pattern + context + purpose + execution** before calling it a problem.
3. Default severity: `opportunity` or `low`. Escalate only when the pattern also harms hierarchy,
   legibility, trust or the task — and then file it under *that* category.
4. Distinctiveness is judged with tests (counterfactual, identity ablation, signature), not vibes.
5. Familiar interaction grammar is not generic. Distinctiveness lives mainly in expression
   (type, composition, imagery, color distribution, motion character, voice), not in reinventing
   controls.
6. Convention can be the right choice (utilities, internal tools, regulated flows). Say so.

## The four-step analysis

| Step | Question |
|---|---|
| Pattern | What recurring generic trait is present? (catalog below) |
| Context | What product, audience, surface type (task-critical, orientation, identity/story)? |
| Purpose | Does it do a job here — hierarchy, grouping, explanation, identity, feedback? Or is it filler? |
| Execution | Even if purposeful, is it executed with product-specific decisions or library/template defaults? |

Verdict: **justified** (purposeful and well executed) · **weak execution** (purposeful, generic
execution) · **arbitrary** (no job; remove or replace) · **harmful** (also damages a UX dimension).

## Catalog

| Pattern | Signals (visual / code) | Why it reads generic | When legitimate | Better alternatives |
|---|---|---|---|---|
| **Gradient hero formula** | big centered headline + subhead + 2 CTAs over purple/blue gradient or mesh; `bg-gradient-to-*`, radial blobs | the most common default composition; says nothing about the product | brand gradient that is part of an established identity | lead with the product's real content (data, object, workflow, photography); headline grounded in the user's job |
| **Cardification / excessive containerization** | every section and group in a rounded bordered/shadowed box; nested cards | containment stops meaning anything; flattens hierarchy | cards for independent, comparable, actionable objects (products, files) | group with spacing and alignment; reserve containers for meaningful regions/state |
| **One radius, one shadow everywhere** | identical `rounded-xl shadow-md` on all surfaces | component-library default presented as art direction | systems where a uniform shape *is* the signature, applied deliberately | a shape hierarchy (controls vs surfaces vs identity moments) |
| **Feature grid (icon + title + paragraph) × 3/6** | repeated three-column icon tiles | template filler; icons repeat the text | short scannable capability summaries with distinct, concrete content | show the feature (screenshot, demo, real example, number), vary the rhythm, fewer stronger items |
| **Giant headings with weak density** | display type everywhere, little information per screen | imitates landing pages in product surfaces | real marketing/story surfaces | type hierarchy tied to roles; denser task surfaces |
| **Decorative blobs / glows / noise** | absolutely positioned blurred shapes, grain overlays | decoration substituting for identity | an art system where texture has meaning (craft brand, editorial) | a coherent imagery/texture policy, or nothing |
| **Arbitrary glassmorphism** | `backdrop-blur` panels over busy backgrounds | trend signal; contrast risk | platform material conventions; layered spatial UI with legibility verified | solid surfaces with clear elevation relationships |
| **Dark + neon/acid accent by default** | near-black canvas, one saturated accent, glow | AI default "tech" palette independent of subject | developer/creative tools where it fits the audience and is executed with roles | palette derived from brand/subject; semantic roles; test both themes |
| **Warm cream editorial applied to everything** | beige background, serif display, thin rules — on any product | the opposite default, equally subject-independent | real editorial/craft products | derive from content and brand |
| **Meaningless pills / badges** | chips on every row ("New", "AI", "Pro"), status colors as decoration | salience inflation; badges stop signalling | real states that change interpretation or action | encode state only where it matters; text over color |
| **Eyebrows and numbered sections** | small all-caps label above every heading; "01 / 02 / 03" | mechanical editorial tic | genuinely sequential content | headings that carry meaning themselves |
| **Icon confetti** | an icon on every heading, metric, list item; mixed icon libraries | decoration that repeats text and adds noise | icons that aid scanning/recognition in dense, repeated UI | **icon deletion pass**: remove icons repeating adjacent text; keep those with a semantic/navigational job; one family |
| **Animation on everything** | fade-and-slide entrance on every block; hover lift on every card | motion without a job; slows perception | motion explaining state, causality, continuity | motion only where it communicates; reduced-motion variant |
| **Generic AI copy** | "Unlock the power of…", "Seamlessly…", "Elevate your workflow", "All-in-one platform" | could describe any product; no information | — | concrete outcomes, real numbers, the user's vocabulary |
| **Stock / generated filler imagery** | smiling-people stock, abstract 3D shapes, AI art unrelated to the product | signals a category, proves nothing | expressive identity surfaces with a coherent art policy | screenshots of the real product, real data, purposeful illustration system |
| **Gray card soup (dark mode)** | many nested near-gray surfaces, all equally elevated | flattened hierarchy in dark | — | fewer surfaces; hierarchy via type, spacing, grouping |
| **Default component-library styling** | unmodified shadcn/MUI/Bootstrap look, default focus rings, default spacing | instantly recognizable; no art direction | internal tools where speed and convention win (say so) | keep the components, set tokens/typography/composition deliberately |
| **SaaS template layout** | hero → logos → features → testimonials → pricing → FAQ → CTA, in that order | interchangeable page anatomy | when each section is earned by real content | structure from the user's decision journey; drop sections with no evidence |
| **Dashboard template** | 4 KPI cards + line chart + table + donut, regardless of the user's questions | layout chosen before the questions | when those *are* the questions | start from the top 3 decisions the user makes; design for those |
| **Inconsistent spacing / alignment** | arbitrary margins, near-miss alignments | reads as unconsidered | — | spacing scale and alignment grid |

These "tells" come partly from Anthropic's frontend-design guidance (model-specific calibration
signals, not universal prohibitions) and repository synthesis.

## Detection hints

- **Code:** grep for `gradient`, `backdrop-blur`, `blur-3xl`, repeated `rounded-* shadow-*`
  combos, `uppercase tracking-wide` eyebrows, `animate-`/`motion` on many elements, icon imports
  per component, near-identical section components.
- **Rendered:** squint test (does hierarchy survive?); count containers per screen; compare
  sections — are they the same composition with different text?
- **Copy:** could each sentence describe a competitor unchanged?

## Distinctiveness assessment

### Counterfactual (transplant) test
Could this visual direction be applied to a completely different product (e.g. a bank, a recipe
app, a dev tool) with only text and logo changes? List the decisions that are **domain-specific**
(derived from content, users, brand) and those that are **interchangeable**. Mostly
interchangeable → differentiation opportunity.

### Identity ablation
Progressively remove: logo/name → brand accent color (neutralize) → hero imagery. Then look at a
task-dense screen. Does character survive through composition, typography, asset language or
interaction rhythm? If identity disappears with one accent color, the direction is
under-specified. If task screens get *clearer* without the expression, branding is interfering.

### Signature test
A signature is a recurring relationship (type pairing, crop rule, composition rhythm, shape motif
reserved for identity surfaces, motion principle). It should be **recognizable** (character
without the logo), **systematic** (another screen can apply it without improvising), and
**non-obstructive** (removing it would reduce identity, not improve task clarity).

### Result
`interchangeable` · `partly own` · `own` — with 2–4 concrete differentiation opportunities
(each tied to product content or behaviour) and a note on whether distinctiveness matters for
this product's goals.

## Differentiation that isn't decoration

Before promoting a "distinctive" idea, ask: does it solve a real problem, reduce friction, improve
capability, discovery, control or comprehension, and would it still be useful without visual
novelty? If mostly no, it's inspiration, not product. Spend boldness deliberately: **one
memorable idea surrounded by disciplined supporting design** beats novelty everywhere.
Functional differentiators that often fit: richer previews, contextual actions, comparison,
smart filtering, saved views, direct manipulation, command surfaces, AI embedded in real work
objects (see `data-dense-and-power-ui.md`, `ai-ux.md`).

## Trends

Treat trends as vocabulary, not answers. 2026 creative signals (tactile/human-crafted expression,
scan-first structure) are commercial/creative evidence, not UX outcome evidence. Tactile or
"imperfect" styling sprinkled as anti-AI decoration is just another default — encode it as a
coherent art system or skip it.
