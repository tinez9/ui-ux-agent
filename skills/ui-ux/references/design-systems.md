# Design systems

How visual and interaction rules become reusable systems — and how to audit, extend and evolve
them without making every screen identical.

## Quick rules

1. **Constrain decisions, not pages.** Separate **invariants** from **degrees of freedom**.
2. Encode meaning, not appearance: `primitive → semantic role → component role → rendered value`.
   Agents choose roles (`text.secondary`, `border.focus`), not raw hex/px.
3. Tokens are infrastructure, not the whole system: agents also need component contracts,
   composition rules, representative references and explicit freedoms.
4. Decision order when building: existing pattern → existing component variant → composition of
   existing parts → bounded extension → new component (with a reason).
5. Detection is not adjudication: classify drift before "fixing" it.
6. Don't recommend componentizing everything. Unify semantics, states and accessibility; leave
   composition, density and expressive moments free within bounds.
7. Variants (brands, themes, modes) are legitimate divergence — compare against the right variant.

## Invariants vs degrees of freedom

| Invariants (don't casually reinterpret) | Degrees of freedom (vary by context) |
|---|---|
| semantic roles for color, type, spacing, state, focus, elevation, motion | page composition and hierarchy |
| accessibility contracts | density within allowed ranges |
| component anatomy, supported states, interaction behaviour | which approved components to combine |
| token relationships and theme mappings | editorial rhythm, whitespace |
| brand-critical assets/rules | imagery/art direction within brand |
| platform constraints | optional expressive motion; responsive recomposition that keeps behaviour |

Overconstraint → every page is a rearrangement of the same shell/cards. Underconstraint → local
invention drifts spacing, color, interaction and accessibility. Name the freedoms explicitly;
without them agents either improvise inconsistently or overfit to the catalog.

## Token layers

1. **Primitives** — raw palette, type scale, spacing scale, radii, durations (system construction only).
2. **Semantic tokens** — text-primary, surface-raised, border-subtle, focus, danger… (the normal interface).
3. **Component tokens** — only where a component genuinely needs a scoped role.
4. **Themes/contexts** — map roles to values for light/dark, brand, high contrast, density, platform.

The DTCG format (stable 2025.10) standardizes token exchange (types, aliases, groups, `$deprecated`,
contextual resolution) — not methodology, anatomy or layout intent. Density modes
(compact/comfortable) are a legitimate non-color theme dimension, but each mode multiplies the
test matrix.

## What a good component contract contains

purpose & when to use · anatomy · variants · states (default, hover, focus, active, disabled,
loading, error, selected) · content constraints (min/max text, truncation) · responsive/container
behaviour · keyboard and accessibility behaviour · composition constraints · canonical
implementation/import path.

Plus **composition rules** components can't express: page/grid constraints, nesting rules, when
containers/cards are unnecessary, product shells, mobile recomposition, preferred patterns for
repeated tasks.

## Audit procedure (design-system lens)

1. **Sources of truth.** Find tokens/theme files, component library, Storybook, DESIGN.md, brand
   docs. Rank authority; note conflicts (`CONFLICT`). If none exists, everything you infer is
   `OBSERVED`/`REPEATED`, not `NORMATIVE`.
2. **Value census.** Run `node <skill>/scripts/style-census.mjs <src-dir>` (no dependencies). It
   reports distinct literal colors, font sizes, font weights, line heights, radii, shadows,
   spacing values, z-indexes, breakpoints, and token vs literal usage. Look for: near-duplicate
   values (e.g. `#1f2937` and `#1e293b`), long tails of one-off values, literals bypassing
   existing tokens, too many type sizes for the real number of roles.
3. **Component inventory.** Search for parallel implementations of the same thing (several
   `Button`/`Card`/`Modal` components, inline-styled buttons, raw `<button className=…>` copies).
   Compare visually equivalent elements rendered side by side; note which differ in states,
   focus, sizes, radii, labels.
4. **State consistency.** For each component family, compare hover/focus/disabled/error/selected/
   loading across members and themes. Inconsistent focus and disabled styles are the usual gaps.
5. **Semantic use.** Are status colors used for decoration? Is brand color used for errors? Do
   tokens with the same name resolve to different meanings?
6. **Composition.** Are product shells, spacing rhythm and containers applied consistently, or
   does every page invent its layout? Is the system producing template sameness (overconstraint)?
7. **Accessibility per variant.** Contrast and focus per theme/brand/mode (see
   `accessibility.md` § Themes and variants).
8. **Drift triage** (below) for each material deviation.
9. **Findings.** Group under root causes (`RC-…`): e.g. "no semantic color layer" with symptoms
   (47 hex values, inconsistent error colors, dark-mode breakage). Recommend systemic fixes in
   dependency order: roles/tokens → core components → migration of call sites → composition guidance.

Rule of thumb against rigidity: recommend extracting a shared component when ≥ 3 usages share the
same semantics and behaviour, or when divergence causes errors/perceived inconsistency. Visual
similarity alone is not enough; identical pixels with different meanings should stay separate.

## Drift: detection vs adjudication

A diff (token, code or visual) shows **something changed**, not that it's wrong. Classify:

| Class | Action |
|---|---|
| **Contract violation** — contradicts a still-valid normative rule | fix the implementation; don't edit the contract to make CI green |
| **Intentional evolution** — a deliberate decision supersedes the contract | update contract + implementation together, with rationale; new baseline |
| **Approved exception** — local deviation with a real reason | record scope and reason; don't promote to a global rule |
| **Legacy debt** — divergence with no credible intent | keep the contract normative; plan remediation; don't document the drift as a rule |
| **Stale/ambiguous contract** — docs no longer represent reality, intent unclear | mark CONFLICT; ask; don't auto-fix either side |
| **Capture noise** — fonts, animation, DPR, thresholds | stabilize the test before deciding anything |

Drift has independent axes — **visual**, **semantic** (roles no longer express intent), **API/
structural** (deprecated props/packages), **documentation/governance**. Carbon v10→v11 renamed
tokens and APIs with no intended visual change: zero pixel drift can hide serious contract drift.
A green visual-regression suite cannot certify conformance. Prefer three-way comparison:
`declared contract ↔ previously accepted baseline ↔ current implementation`. Accepting a new
visual baseline is a governance act, not cleanup. Treat deprecation as a first-class state
(replacement mapping, consumer discovery, staged migration), not "delete now".

## Migrations and variants

- **Migration** (contract changes over time; old and new coexist): evaluate a surface against
  `target contract version + rollout phase + accepted exceptions`. States: legacy-valid,
  migration-ready, dual-run, migrated, exception, legacy-invalid. Automate discovery and
  low-ambiguity replacements (codemods, lint); keep judgment for ambiguous cases; inventory custom
  assets; let foundations (type, icons, color, components) move at different speeds.
- **Variants** (multi-brand, white-label, light/dark — possibly forever): conformance is relative
  to a variant identity `system version + brand + mode + platform + phase`. Raw values may differ
  across brands without drift if reached through the right semantic roles; identical pixels can
  still hide drift if one implementation bypasses the token layer. Never "fix" one brand toward
  another's appearance.
- Separate **system invariants**, **variant contract** and **local exceptions** (with scope,
  reason, owner, review date).

## Extracting a system from an existing product

When there is no maintained source of truth, extraction can bootstrap one — as hypotheses.
Evidence strength: normative sources > repeated rendered/code evidence > computed runtime values >
screenshots > single instances. Runtime truth is not intent. Cover representative routes,
component archetypes, breakpoints, themes and states (homepage-only extraction is weak). Label
every rule (`NORMATIVE / REPEATED / OBSERVED / APPROXIMATED / CONFLICT / EXCEPTION`). A rendered
preview of the extracted system validates the document, not the product.

## Agent-readable systems: failure modes

| Failure | Better |
|---|---|
| token dump (hundreds of values, no semantics) | role-based tokens + usage rules |
| component catalog without composition guidance | hierarchy, density, layout relationships, representative compositions |
| screenshot-only grounding | pair visuals with rules and contracts |
| overconstraint | lock invariants, name freedoms |
| underconstraint | make semantic roles and canonical components easy to discover |
| primitive leakage | semantic tokens as the normal implementation interface |
| second source of truth (DESIGN.md drifting from code) | define authority; generate/validate one from the other |

## Evidence boundary

DTCG, Apple, Carbon, Atlassian, Spectrum, Maersk and SAP documentation support semantic roles,
theming, variants, migrations and deprecation as mature mechanics. Which artifact mix best improves
agent output, and how much freedom maximizes quality, remain open empirical questions. The six-way
drift taxonomy and risk-shaped test matrices are synthesis.
