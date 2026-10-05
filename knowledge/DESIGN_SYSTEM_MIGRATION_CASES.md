# Design-system migration cases: when contract and pixels move together

Last reviewed: 2026-10-05

## Research question

Does the repository's multi-axis drift model still work when design-system divergence is intentional—temporarily during migration or permanently across brands—rather than evidence that every surface should converge to one appearance?

## Case 1: Atlassian's 2024–2025 UI foundations refresh

Atlassian is useful because migration deliberately changed visible design language and implementation contracts at the same time. The refresh introduced typography, iconography, colors and component changes while old and new states coexisted during rollout.

Primary sources reviewed:
- https://atlassian.design/whats-new/atlassian-ui-refresh-updates/
- https://atlassian.design/whats-new/typography-and-iconography-updates
- https://atlassian.design/whats-new/new-typography-in-general-availability
- https://atlassian.design/whats-new/building-atlassians-new-icon-system
- https://atlassian.design/foundations/tokens/migrate-to-tokens/
- https://developer.atlassian.com/platform/forge/design-tokens-and-theming/

### What this case falsifies

A migration cannot safely be modeled as either "expected visual diff" or "contract violation." Validity can depend on rollout cohort, package version, feature flag, component family or migration phase. A proposal may differ visually from production because it targets the new contract; it may also look new while remaining structurally wrong because it uses legacy APIs or hard-coded values.

### Migration-aware state

Evaluate affected surfaces against:

`surface + target contract version + rollout phase + accepted exception → expected semantic/API state + expected visual state`

Useful states are `legacy-valid`, `migration-ready`, `dual-run/preview`, `migrated`, `exception/blocked`, and `legacy-invalid`. Do not classify drift until the intended state is known.

### Mechanics that matter to agents

- **Automate discovery and low-ambiguity replacements, not judgment.** Atlassian used lint/auto-fix with a curated icon mapping; roughly 75% of icon migration could be automated for testing/QA, while ambiguous cases remained review work. Token codemods likewise require manual review.
- **Decouple rollout from source migration.** Feature flags, backwards-compatible props and facades let visual QA target a new system before every callsite is migrated.
- **Inventory custom assets.** Atlassian scanned for custom SVGs, rendered them and produced a review document; symbol replacement alone would miss this edge.
- **Track foundations independently.** Typography, iconography, color and component changes can legitimately be at different rollout stages.
- **Treat deprecation as governance.** Replacement and lifecycle windows turn "legacy" into a time/version-scoped state rather than a vague smell.

## Case 2: permanent multi-brand variance — Maersk Design System

Maersk falsifies a different hidden assumption: valid divergence does **not** always converge. Its current design system explicitly supports multiple brands—Maersk, APM Terminals, Aliança, Captain Peter and Stillstrom—and light/dark appearances per brand through theme-based variables in design and CSS variables in implementation.

Primary source:
- https://designsystem.maersk.com/foundations/themes/

Adobe Spectrum independently defines a theme as an intentional, systematic customization and permits visual attributes such as color, rounding, shadow and typography to vary while component options and general dimensions remain stable. This is useful corroboration that a shared system can deliberately hold both invariant and variant layers rather than equating consistency with identical pixels.

Primary sources:
- https://spectrum.adobe.com/page/theming/
- https://spectrum.adobe.com/foundations/design-data/design-tokens

SAP Fiori's theming guidance supplies a third first-party perspective: themes are explicitly useful for products serving other companies, organizations with several brands, cross-platform products and accessibility/high-contrast needs.

Primary source:
- https://www.sap.com/design-system/fiori-design-web/sap-design-system-academy/foundations/theming

### What multi-brand systems falsify

The migration model's `traceable convergence` is only correct when convergence is actually the product goal. In a multi-brand/white-label system, brand A and brand B may remain visually different forever while both conform perfectly.

Therefore design-system conformance must be evaluated against a **variant identity**, not against one canonical rendered appearance:

`surface + system version + brand + mode + platform/context + migration phase → expected contract + expected render`

Migration phase and variant identity are orthogonal. A Maersk-light surface can be migrated while an APM-dark surface is legacy-valid; neither should be "fixed" toward the other's appearance.

## Invariants versus legitimate variance

A useful contract should distinguish three classes rather than flattening every token into one source of truth:

1. **System invariants** — behavior, component semantics, accessibility requirements, state model, interaction contracts, API constraints and any dimensions intentionally shared across themes.
2. **Variant contract** — brand/theme/mode mappings such as semantic color, typography, radius, shadow, imagery or other attributes the system explicitly permits to differ.
3. **Local exception** — deliberate divergence outside the normal variant contract, carrying scope, reason, owner and ideally expiry/review conditions.

This matters for autonomous agents. A raw value that differs across brands is not drift if each value is reached through the correct semantic role. Conversely, two brands producing identical pixels can still contain semantic drift if one implementation bypasses the intended token/theme layer.

## Variant-aware drift adjudication

Before changing code or accepting a baseline:

1. resolve system/version, brand, mode, platform/context and migration phase;
2. load the corresponding semantic token/theme contract rather than comparing raw primitive values globally;
3. validate system invariants independently from brand-specific visual values;
4. render the correct variant with deterministic data, fonts and environment;
5. compare against the matching variant reference, never a baseline from another brand/mode;
6. test cross-variant invariants separately (interaction, semantics, accessibility, required dimensions/behavior);
7. classify differences as contract violation, legitimate variant, intentional evolution, approved exception, legacy debt, stale/ambiguous contract or capture noise;
8. update the narrowest correct layer—consumer code, variant mapping, shared contract, migration registry or baseline.

A practical QA matrix should be risk-shaped rather than the full Cartesian product on every change. Shared invariant changes deserve representative coverage across materially different variants; a brand-token-only change can focus on that brand plus checks that shared semantics were not bypassed.

## Durable conclusion

Three different phenomena must not be collapsed:

- **drift**: implementation diverges from its intended contract;
- **migration**: intended contract changes over time and old/new states may temporarily coexist;
- **variation**: multiple contracts/renderings are intentionally valid at the same time and may remain so indefinitely.

Carbon v10→v11 shows that contract drift can be visually silent. Atlassian shows that visual and contract change can be intentional and staged. Maersk/Spectrum/SAP show that visual divergence can be a permanent system capability rather than a transition state.

For AI coding/design agents, "make everything consistent" is therefore unsafe. The stronger objective is **variant-aware conformance**: preserve shared invariants, apply the correct semantic variant, respect migration state, and only repair divergence that violates the intended contract for that exact context.

## Evidence boundary

The migration material is case-study synthesis from first-party Atlassian documentation. The multi-brand conclusion is supported by first-party Maersk, Adobe Spectrum and SAP design-system documentation. These sources establish real system architecture and supported theming behavior; they do not provide controlled evidence that one token architecture is universally superior or that multi-brand theming improves user outcomes. The proposed adjudication formula and QA strategy are agent-oriented synthesis and should be tested against implementation failures and large multi-brand repositories.

## Next research direction

Investigate **cross-theme accessibility invariants** in multi-brand systems: semantic token mapping can preserve architectural cleanliness while a particular brand palette, typography or density still fails contrast, focus visibility, forced-colors/high-contrast behavior or readability. Determine which accessibility properties must be validated per variant rather than inherited as assumed guarantees from the shared component layer.
