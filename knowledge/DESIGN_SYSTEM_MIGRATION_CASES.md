# Design-system migration cases: when contract and pixels move together

Last reviewed: 2026-10-05

## Research question

Does the repository's multi-axis drift model still work when a design-system migration intentionally changes both the semantic/technical contract and the visible product, rather than preserving appearance as Carbon v10→v11 largely did?

## Case: Atlassian's 2024–2025 UI foundations refresh

Atlassian is a useful contrasting case because the migration deliberately changed **visible design language and implementation contracts at the same time**. The refresh rolled through Atlassian products from an Early Access phase beginning in October 2024 toward broad GA in 2025. It introduced refreshed typography, iconography, colors and component styling rather than treating migration as an implementation-only cleanup.

The strongest evidence comes from Atlassian's own design-system and engineering material:

- **Typography:** Atlassian introduced Atlassian Sans and Mono, new typography tokens/components and a revised scale. The new typography system reached GA on 2025-09-09; earlier "modernized" and legacy systems were deprecated with a support window rather than deleted immediately.
- **Iconography:** icons changed visually (weight, style, sizing/spacing) and structurally (taxonomy, names and some component props). Atlassian reports more than 16,000 icon callsites in its codebase and a manually curated mapping from roughly 350 old icons to replacements.
- **Color/components:** the refresh also trialed new colors and component changes, with design-system examples capable of previewing individual refreshed foundations rather than forcing one atomic switch.
- **Tokens:** Atlassian's broader token migration replaces literal/legacy values with semantic roles and explicitly requires manual review after codemod suggestions. Its token lifecycle distinguishes active, deprecated, soft-deleted and deleted states.

Primary sources reviewed:

- https://atlassian.design/whats-new/atlassian-ui-refresh-updates/
- https://atlassian.design/whats-new/typography-and-iconography-updates
- https://atlassian.design/whats-new/new-typography-in-general-availability
- https://atlassian.design/whats-new/building-atlassians-new-icon-system
- https://atlassian.design/foundations/tokens/migrate-to-tokens/
- https://developer.atlassian.com/platform/forge/design-tokens-and-theming/

## What this case falsifies

A migration cannot safely be modeled as either "expected visual diff" or "contract violation." During a coordinated refresh, the old and new states may both be valid at the same time, and validity can depend on rollout cohort, package version, feature flag, component family or migration phase.

This exposes a missing dimension in simple drift classification: **migration phase**.

A proposed implementation can be visually different from the current production baseline and still be correct because it targets the new contract. Conversely, it can match the new visual style while remaining structurally wrong because it uses legacy APIs, hard-coded values or old icon semantics. Pixel similarity and contract conformance remain independent even when both are intentionally changing.

## Migration-aware drift model

For large intentional redesigns, evaluate each affected surface against an explicit target state rather than a single global source of truth:

`surface + target contract version + rollout phase + accepted exception → expected semantic/API state + expected visual state`

Useful migration states are:

1. **Legacy-valid** — old contract and appearance are still intentionally supported for this surface/cohort.
2. **Migration-ready** — dependencies/tokens/APIs can support the new system, but the new appearance is not yet enabled.
3. **Dual-run / preview** — old and new systems coexist behind feature flags, facades, themes or preview tooling for comparison and QA.
4. **Migrated** — the surface is expected to conform semantically, structurally and visually to the new contract.
5. **Exception / blocked** — migration is intentionally deferred with owner/reason/replacement path.
6. **Legacy-invalid** — the support window has ended; old contract use is now debt or failure rather than a legitimate variant.

Do not classify drift until the target migration state is known. Otherwise an agent can "fix" a legitimate old cohort toward a half-migrated state or revert an intentional preview because it differs from production.

## Why Atlassian's migration mechanics matter to agents

### 1. Automate discovery and low-ambiguity replacements, not judgment

Atlassian used an ESLint rule/auto-fixer backed by a manually curated icon mapping and reports that roughly 75% of icons could be migrated safely for testing and QA. The remaining cases required harder judgment. Its token codemods likewise produce suggestions that require manual review.

Agent rule: use codemods/static analysis to reduce search and mechanical work, but preserve an explicit review boundary where semantics, custom assets or context make replacement ambiguous.

### 2. Decouple rollout from source migration

Atlassian used feature flags, backwards-compatible props and an icon facade that could swap old icons to new designs at runtime before every callsite had migrated. This allowed teams to validate the new visual system while implementation migration was incomplete.

Agent rule: for wide visual redesigns, prefer a reversible compatibility layer or theme/flag boundary when feasible. It gives visual QA a stable target without requiring a risky all-at-once rewrite.

### 3. Custom assets need inventory, not regex

Atlassian built a custom-icon extractor that scanned repositories for SVGs, rendered screenshots and produced a review document so custom icons could be found and redesigned. Static symbol replacement alone would miss these assets.

Agent rule: migration discovery should include code references **and rendered/custom asset inventories**. Design-system adoption can fail at the edges even when library usage is fully migrated.

### 4. Partial foundation rollout is a first-class state

Atlassian's component examples allowed typography, iconography, color and component changes to be previewed independently. This matters because a product may temporarily have new typography with old colors, or new icons with legacy components, by design.

Agent rule: record migration state per foundation/component family. Do not infer that because one foundation has moved, every other visual/semantic axis should match the final system already.

### 5. Deprecation windows encode governance

Atlassian's typography and token guidance uses explicit deprecation/support windows. That turns "legacy" from a vague smell into a time/version-scoped state.

Agent rule: a design contract should store replacement and lifecycle information where available. `deprecated` means "migrate deliberately within the supported window," not "break consumers immediately" and not "safe forever."

## Updated adjudication sequence

When both contract and appearance are changing, use this order:

1. identify the surface's intended migration phase and target contract version;
2. run static semantic/API/token checks against **that target**, not simply latest available APIs;
3. render the intended old/new variant under deterministic flags/theme/data;
4. compare it to the correct phase-specific reference, not a global production baseline;
5. inspect accessibility/interaction behavior independently of visual parity;
6. classify remaining differences as expected redesign, migration defect, approved exception, legacy debt, stale contract or capture noise;
7. only then update code, contract, migration registry or visual baseline.

This preserves the earlier four drift axes — visual, semantic, API/structural and documentation/governance — while adding migration phase as context that determines what "correct" means.

## Durable conclusion

Carbon v10→v11 shows that **contract drift can be visually silent**. Atlassian's refresh shows the opposite hard case: **visual and contract drift can both be intentional, staged and temporarily inconsistent across surfaces**.

Together they imply that autonomous agents should not optimize for one globally synchronized design-system state during a migration. They should optimize for **traceable convergence**: every surface has a known target, phase, compatibility window and validation path, while low-risk mechanical work is automated and ambiguous visual/semantic decisions remain reviewable.

## Evidence boundary

This is a case-study synthesis from Atlassian's first-party design-system, developer and engineering documentation. It is strong evidence for the mechanics Atlassian actually used at scale (feature flags, compatibility layers, lint/auto-fix, custom-asset inventory, staged foundation rollout and deprecation windows). It is not controlled evidence that the proposed six-state migration model is universally optimal, nor that Atlassian's refresh improved user outcomes. Product/design-system rationale should not be converted into independent usability evidence.

## Next research direction

Test the migration-aware model against a **multi-brand or white-label design system** where multiple themes/contracts are permanently valid rather than temporarily coexisting during migration. That would challenge the current assumption that divergent states should eventually converge to one target and help distinguish migration state from legitimate long-term product variance.
