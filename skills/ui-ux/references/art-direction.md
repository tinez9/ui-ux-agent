# Art direction for product interfaces

Art direction is a **system of coordinated expressive decisions**, not a pile of effects. It turns
product purpose and brand into a recognizable interface without sacrificing familiarity,
semantics, accessibility or maintainability.

## Quick rules

1. Two obligations at once: **interaction grammar stays legible** (familiar controls, states,
   navigation, focus) and **expression becomes product-specific** (type, composition, imagery,
   color distribution, shape, iconography, copy, motion).
2. Start from an **expression thesis**, then translate it across several channels. Never encode
   identity in one cue (a hue, huge type, glass, a radius).
3. Separate the **semantic layer** (status colors, affordances, focus, readable text, familiar
   icon metaphors) from the **expressive layer** (display type, imagery, illustrations, selected
   backgrounds, empty/onboarding/celebration moments, composition, motion character).
4. Spend an **expression budget** by surface type; task-critical surfaces stay restrained.
5. Build **signatures** (repeatable relationships), not decoration.
6. Extract *why* references work; never copy their surface.
7. Vague adjectives ("modern", "clean", "premium") must be translated into concrete rules.

## Expression thesis

> This product helps **[audience]** do **[core job]** in a context that feels **[2–3 qualities]**.
> Expression is strongest in **[surfaces]**; **[task-critical surfaces]** stay restrained.

Concrete thesis vocabulary (examples, not presets): *editorial, restrained, high-contrast,
image-led* · *technical, dense, calm, data-forward* · *cinematic, dark, spacious, content-first* ·
*playful, tactile, bright, motion-led*. The adjectives are constraints, not deliverables:
"confident" does not imply a gradient; "playful" does not imply rounded cards.

## Translate the thesis across channels

| Channel | Decide |
|---|---|
| Typography | what voice display type carries; where reading efficiency dominates personality; split expressive display face from a legible UI/body face when useful |
| Composition | calm / editorial / tool-like / spatial / dense / rhythmic / asymmetric; which relationships stay conventional |
| Color | which colors identify the product, which carry semantics, which only support hierarchy; brand color applied judiciously — often more in content than in controls |
| Imagery / illustration | subject, framing, crop, texture, abstraction, treatment (see `iconography-and-imagery.md`) |
| Shape | a motif that can recur as a signature without turning every container into it |
| Iconography | one coherent family; conventional metaphors for common actions; style may vary more freely than meaning |
| Motion | temporal character; where it would interfere with work |
| Voice | copy expresses the same character without reducing clarity; utility copy optimizes comprehension |

A coherent direction repeats a **small number of relationships** across channels rather than
maximizing novelty in every channel.

## Expression budget

| Surface type | Examples | Expressive latitude |
|---|---|---|
| Task-critical | dense work, forms, editing, settings, destructive flows | low — expression must not interfere |
| Orientation | home, section landing, onboarding | moderate — helps recognition and hierarchy |
| Story / identity | marketing-like moments, feature education, empty/celebratory states | high — if content stays primary |

If everything has gradients, huge type, unusual geometry, illustration and motion, nothing
establishes hierarchy and the system becomes expensive to maintain.

## Signatures

A signature is a repeatable relationship, e.g.: a distinctive editorial type pairing with
restrained utility type; a recurring image crop/framing rule; a canvas/content/whitespace
relationship; a controlled illustration family; one shape motif reserved for branded surfaces; a
motion principle tied to spatial continuity. Tests: **recognizable** (character survives without
the logo), **systematic** (another screen can apply it without improvising), **non-obstructive**
(removing it reduces identity, not task clarity).

## Reference analysis

Never "make it look like X". Extract: hierarchy mechanism, density and rhythm, dominant/subordinate
relationships, image behaviour, typography contrast, geometry, color distribution, motion role,
what is conventional vs distinctive. Recombine those principles around this product's content and
tasks.

## Anti-generic agent workflow

1. **Product truth** — audience, job, context, content type, platform.
2. **Expression thesis** — 2–3 qualities + what stays restrained.
3. **Reference analysis** — relationships, not surfaces.
4. **Signature rules** — 2–4 recurring choices.
5. **Forbidden shortcuts** — project-specific only ("don't turn every section into a rounded card").
6. **Semantic invariants** — accessibility, states, familiar controls, navigation, content priority.
7. **Rendered review** — several representative surfaces (dense, sparse, error, mobile, dark/light):
   do they look like one product? does expression survive without logos?

Critique the plan against the brief before building: replace any choice that could be copied
unchanged into an unrelated product.

## Evaluation

- **Identity ablation** (see `generic-ui-and-distinctiveness.md`).
- **Four criteria** for built output: coherence/design quality, originality, craft, functionality.
- **Refine vs pivot:** refine when the thesis works and execution is weak; pivot when the
  thesis itself is generic or mismatched.

## Failure modes

- **Brand = accent color** — a reskin, not a direction.
- **Every surface expressive** — permanent visual urgency; no hierarchy.
- **Custom controls for uniqueness** — trades familiarity and accessibility for novelty.
- **Moodboard collage** — attractive motifs with no governing thesis.
- **One-shot styling** — a single screen looks fine; the system is inconsistent across states.
- **Marketing language in utility UI** — verbose or ambiguous buttons, labels, errors.
- **Decorative asset entropy** — stock photos + unrelated illustrations + emoji + mixed icon sets
  + generated art: locally distinctive, globally incoherent.
- **Platform conformity mistaken for blandness** — standard grammar doesn't require generic
  composition.

## Evidence boundary

Apple HIG Branding (2026) and Adobe Spectrum support semantic consistency, judicious brand color,
coherent asset/icon systems, familiar controls and strategic expression. They don't prove any
aesthetic improves conversion, preference or usability; the identity-ablation and signature tests
are heuristics.
