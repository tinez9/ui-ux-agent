---
type: design-contract
product: <name>
version: 1
date: YYYY-MM-DD
authority: <what is normative: this file, DESIGN.md, tokens at path X — avoid two sources of truth>
---

# Design contract — <product>

A compact, inspectable statement of design intent. Implementation and review are checked
against it. Label claims about an existing product with provenance when useful:
NORMATIVE · REPEATED · OBSERVED · APPROXIMATED · CONFLICT · EXCEPTION.

## 1. Product truth
- **Users / job / context:** <link project-context.md; one-line summary>
- **Content character:** <what the real content is like: dense data, photos, prose…>
- **Conceptual model:** <objects → relationships → states → actions (key ones)>

## 2. Visual direction
- **Visual thesis:** <one concrete sentence>
- **Color:** <semantic roles (canvas, surface, text primary/secondary, border, action, focus, status) and where brand color is spent>
- **Typography:** <families and roles: display, title, body, label, data, code; measure rule; responsive behaviour>
- **Composition:** <grid/alignment concept, density per surface type, use of containers>
- **Signature decision(s):** <1–2 recurring, product-specific choices — recognizable, systematic, non-obstructive>
- **Restraint rule:** <what stays deliberately quiet (e.g. task screens, controls)>
- **Imagery & iconography:** <roles, medium, icon family, label policy>
- **Motion:** <what motion is for; durations/easing family if defined; reduced-motion behaviour>
- **Voice:** <tone for UI copy; task copy prioritizes clarity>

## 3. System invariants (never casually reinterpreted)
- **Accessibility floor:** <WCAG target; contrast, focus visible, targets ≥ 24px, reflow at 320px, 200% text, reduced motion, no color-only meaning>
- **States required:** <loading, empty (first-use / no-results), error, validation, focus, disabled with reason, offline…>
- **Responsive invariants:** <task, relationship, comparison, state invariants per key surface>
- **Design-system invariants:** <tokens/roles to use, components to reuse, interaction contracts>

## 4. Bounded freedoms
<Where implementations may vary: composition per page, density within range, expressive moments on identity surfaces, imagery choices within policy.>

## 5. Anti-goals (project-specific)
<Generic shortcuts this product avoids, with the reason — e.g. "no card-per-section on dashboards: grouping by alignment and spacing", "no gradient hero: the product's identity lives in its data visualizations".>

## 6. Acceptance and evaluation
- **Representative slice:** <screen/flow implemented first>
- **Acceptance criteria:** <observable, per viewport/state>
- **Evaluation:** coherence · originality · craft · functionality; counterfactual test; identity ablation.

## Decisions log
| Date | Decision | Reason | Supersedes |
|---|---|---|---|
