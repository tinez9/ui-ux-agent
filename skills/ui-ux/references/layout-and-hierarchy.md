# Layout, hierarchy and density

Hierarchy is an **attention budget**, not decoration. Make relative importance legible without
making lower-emphasis information functionally invisible.

## Quick rules

1. Classify elements into tiers **before** styling them (table below). One dominant task anchor per view.
2. Fix structure before styling: remove → regroup → align → clarify sections/order → adjust
   spacing rhythm → *only then* size, weight, color, surface or motion.
3. Spend whitespace on **semantic grouping**; keep labels, controls, status and consequences next
   to the object they describe.
4. Containers (borders, cards, backgrounds) only where a boundary means something.
5. Low contrast is not a hierarchy tool for content that must be read.
6. Remove redundant emphasis before adding new emphasis.
7. Density = useful information and action capacity per unit of attention — not smaller things.

## Hierarchy tiers

| Tier | Role | Treatment |
|---|---|---|
| **T0 — safety/state** | blocking errors, dangerous state, irreversible consequence, critical status | unmistakable when relevant; never subtle-only styling |
| **T1 — task anchor** | page purpose, current object, primary decision/action | strongest normal hierarchy |
| **T2 — task support** | alternatives, inputs, comparison attributes, status needed to decide | clearly scannable; subordinate but never camouflaged |
| **T3 — contextual utility** | secondary actions, metadata, local tools | quieter; discoverable near what they affect |
| **T4 — ambient** | decorative/supporting info without decision value | lowest salience; may be disclosed progressively |

Tiers are contextual: "Delete" is T3 in a row menu and T0 inside its confirmation. Tiers feed
severity (`severity-and-prioritization.md`).

## Audit checklist

- **5-second test** on a screenshot: page purpose, current state and likely next action obvious?
- **One anchor:** is there a single T1 focal point, or several competing ones?
- **Alternatives:** are cancel/decline/privacy/pricing/scope/recovery options perceptible, not
  faded or hidden (manipulative hierarchy)?
- **Grouping:** does spacing alone imply the right groups (blur the text mentally)? Are related
  items far apart (help text, totals, filters, actions)?
- **Alignment:** repeated attributes in stable columns/positions? near-miss alignments?
- **Containers:** count boxed regions; do borders/cards mean something? nested containers?
- **Salience inflation:** many bold headings, filled buttons, badges, accent colors, shadows
  competing? permanent urgency (red/animation) when nothing needs action?
- **Marketing over task:** promotions dominating the user's task?
- **Responsive hierarchy:** does stacking change priority or separate related items? do
  sticky/fixed elements dominate small viewports?
- **Adaptation:** hierarchy survives 200% zoom, large text, RTL, dark mode, high contrast,
  accent color removed (structural hierarchy remains)?
- **Semantics:** heading levels follow meaning, not font size.

## Mechanisms (and their limits)

- **Position and reading order:** importance by placement is strong, but reading order flips in
  RTL and changes with reflow — validate.
- **Proximity:** can overpower similarity of color/shape; responsive stacking can accidentally
  destroy it.
- **Scale, weight, contrast, color:** each consumes salience; if many elements get strong
  treatment, hierarchy collapses into competition. Make important distinctions redundant
  (survive without color, size or position alone).
- **Consistency:** stable positions let users learn where attributes live and skip the rest;
  irregular alternation costs fixations.

## Density

Earn density from the task: repeated comparison of peer records, monitoring, triage queues,
structured data, frequent operations. Don't compress low-information pages to look "pro".

Compress **chrome before content**: repeated labels, decorative containers, redundant
descriptions, oversized empty space, duplicated controls. Density is multidimensional — row
height, padding, type role, default metadata, number of persistent actions, separators,
disclosure depth, width given to the work surface — and visual compactness ≠ target size (an icon
can be small with a larger hit area).

Dense surfaces need **stronger information architecture, not more decoration**: alignment,
stable columns, semantic type, restrained separators, consistent status encoding. Don't give every
value a badge, border, icon or accent.

Density modes (compact/comfortable) only when users genuinely split by condition or expertise;
each mode multiplies testing (overflow, focus, localization, responsive). If compact hides
metadata, treat it as disclosure, not styling. See `data-dense-and-power-ui.md` for tables.

Density contract before increasing density: the task benefits from seeing more at once; chrome
removed first; hierarchy obvious at scan speed; targets still meet size/spacing; keyboard and
focus visible; statuses not color-only or tiny icons; truncation doesn't hide comparison values;
narrow layouts keep critical comparisons; frequent/destructive actions get enough target and
separation.

## Composition

- Composition reveals priority; it should not flatten hierarchy into decorative grids.
- Accidental symmetry (everything in equal columns/cards) usually means hierarchy wasn't decided.
- Use a spacing scale and grid so rhythm is intentional; vary rhythm at section boundaries to
  signal structure.
- Long-form text: left-aligned (LTR), bounded measure (see `typography.md`); centered copy only
  for short display text.
- Representative real content, not lorem ipsum: real lengths change composition.

## Failure modes

- **Everything emphasized** → remove emphasis from lower tiers first.
- **Low contrast as hierarchy** → use scale, weight, spacing, grouping, position instead.
- **Cardification** → spacing/alignment for weak grouping; containers when the boundary matters.
- **Distance breaks relationship** → restore proximity or add explicit relational cues.
- **Marketing salience over task salience.**
- **Responsive hierarchy inversion.**
- **Permanent urgency** → de-escalate when resolved.

## Evidence boundary

Apple HIG (layout), NN/g (proximity, task-dependent scanning), WCAG (contrast floors) support the
mechanics. No universal font-size count, whitespace scale, contrast ladder or row height is
established; saliency models predict attention imperfectly and are not proof of task success.
Carbon/Atlassian/USWDS show coherent density systems (e.g. coordinated row heights 24–64px), not a
universal optimum.
