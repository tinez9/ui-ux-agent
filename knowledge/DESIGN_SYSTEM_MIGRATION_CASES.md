# Design-system migration cases: when contract and pixels move together

Last reviewed: 2026-10-06

## Research question

Does the repository's multi-axis drift model still work when design-system divergence is intentional—temporarily during migration or permanently across brands—and which accessibility guarantees must be revalidated for every legitimate variant?

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

## Case 3: accessibility is an invariant, but its proof is variant-specific

A clean semantic token architecture does not make every resolved theme accessible automatically. Maersk's five brands × light/dark appearances demonstrate the variant surface; Adobe Spectrum explicitly tells implementers to check text, icon and component contrast for **all color themes** when they diverge from guaranteed token/background pairings. WCAG 2.2 independently constrains text/non-text contrast and focus visibility. The durable distinction is therefore:

- **accessibility requirement = system invariant**;
- **evidence that the requirement holds = per resolved variant/context**.

Primary sources reviewed:
- https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html
- https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors
- https://spectrum.adobe.com/foundations/color/color
- https://spectrum.adobe.com/foundations/icons-and-illustrations/using-icons
- https://designsystem.maersk.com/foundations/themes/

### What must be validated per variant

At minimum, when a brand/theme can change the relevant resolved values, test:

- text/background contrast for semantic text roles;
- non-text contrast for controls, boundaries, state indicators and meaningful icons;
- keyboard focus visibility against each possible component/background state, not merely presence of a focus token;
- status/error/selection meaning without color as the only carrier;
- light/dark and brand-specific interactive states (hover, pressed, selected, disabled where applicable), because state mappings can diverge independently from resting colors;
- text legibility and layout where a brand changes typography metrics, weight or density;
- content placed on images or custom/brand backgrounds, because a globally valid foreground token is not sufficient evidence for an arbitrary local background.

Do not infer a pass from token names such as `text-primary`, `focus-ring` or `border-interactive`. Semantic naming proves intent and traceability, not the contrast of the values that a particular theme resolves.

### Forced colors is a different rendering regime, not another brand palette

`forced-colors: active` deserves separate treatment from light/dark or brand theming. Browsers can replace author `color`, `background-color`, border/outline colors and SVG fill/stroke at paint time; they can remove `box-shadow`, `text-shadow` and non-URL background images. Native element semantics influence which system colors the browser chooses, whereas adding an ARIA role to a generic element does not produce the same native color mapping.

Consequences for agent QA:

- do not validate forced-colors by comparing it to the brand screenshot; visual divergence is expected;
- check that controls, focus, selection, errors and boundaries remain perceivable after shadows/background images disappear;
- prefer native semantics and system colors where adjustments are necessary;
- treat `forced-color-adjust: none` as an exceptional escape hatch requiring its own contrast proof, not a way to preserve brand fidelity;
- use `@media (forced-colors: active)` for narrow repairs when the browser's default transformation loses meaning, rather than building a separate branded high-contrast theme.

This exposes a useful failure mode: a component whose boundary exists only as `box-shadow` may look correct in every brand/light/dark screenshot yet lose that boundary in forced colors. A conventional visual-regression matrix can therefore be fully green while accessibility conformance is broken.

### Risk-shaped accessibility matrix

Do not blindly multiply every component × state × brand × mode × browser. Derive coverage from what varies:

1. **Shared structural/semantic change:** test representative brands plus forced-colors and keyboard behavior; expand when failures indicate variant coupling.
2. **Theme/token change:** test every affected theme mapping and the component states consuming those roles; static token linting can identify consumers but cannot replace rendered checks.
3. **Brand typography/density change:** test representative long/localized content, zoom/reflow and interactive states for that brand.
4. **Component-local override:** test that exact component across the backgrounds/modes it can inhabit; do not assume the system token guarantee still applies.
5. **Forced-colors-specific repair:** test with forced colors actually active; ordinary contrast calculations on authored colors do not describe the browser-painted result.

The objective is **coverage of independent variation**, not maximal screenshot count.

## Case 4: automation is a layered detector, not accessibility proof

Current tooling supports a useful automation stack, but no single layer proves conformance. Storybook's accessibility addon runs axe-core against the rendered DOM and describes automated checks as a **first line of QA**; its current documentation says axe-core automatically catches up to 57% of WCAG issues. W3C likewise states that evaluation tools save effort but cannot perform checks that require human judgment. This directly falsifies a tempting agent shortcut: `axe passes in every theme → every theme is accessible`.

Primary sources reviewed:
- https://storybook.js.org/docs/writing-tests/accessibility-testing
- https://www.w3.org/WAI/test-evaluate/tools/selecting/
- https://www.w3.org/WAI/WCAG22/Understanding/understanding-techniques
- https://playwright.dev/docs/emulation

### Divide validation by what each layer can actually observe

1. **Static/token graph — prevent impossible mappings cheaply.** Validate that required semantic roles exist for every supported variant, aliases resolve, deprecated/forbidden primitives are not consumed, and known foreground/background role pairs satisfy computable contrast constraints. This is strong for deterministic token relationships but weak for arbitrary page backgrounds, overlays, images, browser substitutions, DOM semantics and interaction.
2. **Rendered DOM rules — catch machine-detectable violations in the real component tree.** Run axe-like rules on each materially distinct resolved story/page state. Browser-based checks are stronger than source linting because they inspect compiled/rendered output, but their pass is bounded to rules that can be decided automatically.
3. **Behavioral browser tests — assert interaction contracts explicitly.** Use keyboard-driven tests for reachability, order, focus movement, dialog/menu behavior and state changes; assert the resulting DOM/accessibility state rather than assuming axe will exercise interactions. Color-scheme emulation can cover light/dark, but an automation framework's available emulation knobs must not be confused with complete assistive-technology coverage.
4. **Rendered/perceptual checks — inspect properties not captured by DOM rules.** Exercise focus appearance on actual backgrounds, state differentiation, text clipping/reflow/zoom, meaningful boundaries, content over imagery, and forced-colors rendering. Visual regression can detect change, but a stable screenshot does not establish accessibility correctness.
5. **Human/assistive-technology review — decide meaning and usability.** Validate whether labels/alternatives convey the right purpose, interaction is understandable, status/error meaning is perceivable, reading/interaction order makes sense, and representative screen-reader or other AT workflows remain usable. Automation should route uncertainty here rather than manufacture a pass.

### Preserve three outcomes, not pass/fail

Storybook exposes `violations`, `passes` and `incomplete` results. That is a better model for autonomous agents than collapsing every automated run to green/red. A machine result should be recorded as **detected violation**, **machine-checked pass for this rule/state**, or **needs review / not machine-decidable**. `Pass` must never be promoted to “WCAG-conformant component.”

This matters in theme matrices because a single semantic component can have different evidence per variant. A contrast rule may be machine-decidable in Brand A/light, require contextual review over an image in Brand B/light, and be irrelevant to authored colors under forced-colors where the browser paints system colors.

### Avoid two false-confidence traps

- **Untested state masquerading as a pass.** Current Storybook documentation warns that asynchronous components can be checked before their final UI state is rendered, producing false negatives. Agents must wait for the target state explicitly before running accessibility assertions.
- **Baseline regression masquerading as conformance.** Accessibility baselines are useful for detecting newly introduced violations, but “no new violation” can preserve existing debt. Track regression status separately from conformance status, just as visual baselines are separated from design intent.

### Risk-shaped CI recipe for theme changes

For an agent changing a theme or design-system component:

1. derive affected semantic roles and consumers from the token graph;
2. enumerate materially different component states and affected variants rather than all theoretical combinations;
3. render those states deterministically and wait for final async content;
4. run DOM accessibility rules and preserve incomplete/manual-review findings;
5. exercise keyboard/focus/state transitions separately;
6. add targeted rendered checks for focus, reflow, state differentiation and unusual backgrounds;
7. run a dedicated forced-colors path where the component depends on color, borders, shadows, backgrounds or SVG paint;
8. escalate meaning, AT behavior and unresolved perceptual questions to human review;
9. record **coverage and evidence type**, not merely a single accessibility badge.

The durable rule is: **automate breadth; reserve judgment for properties automation cannot observe reliably.** Theme-matrix automation is most valuable as a detector and routing system, not as an accessibility oracle.

## Durable conclusion

Four different phenomena must not be collapsed:

- **drift**: implementation diverges from its intended contract;
- **migration**: intended contract changes over time and old/new states may temporarily coexist;
- **variation**: multiple contracts/renderings are intentionally valid at the same time and may remain so indefinitely;
- **accessibility conformance**: shared requirements remain invariant, but must be demonstrated against every materially different resolved rendering regime rather than inherited from architecture alone.

Carbon v10→v11 shows that contract drift can be visually silent. Atlassian shows that visual and contract change can be intentional and staged. Maersk/Spectrum/SAP show that visual divergence can be a permanent system capability. WCAG plus forced-colors behavior show that a semantically correct theme mapping can still fail at the rendered accessibility layer. Current accessibility tooling adds a final boundary: automated checks can scale detection across variants, but a clean run is evidence only for the rules and states actually exercised.

For AI coding/design agents, "make everything consistent", "the component is accessible once", and "axe is green" are all unsafe. The stronger objective is **variant-aware conformance with explicit evidence**: preserve shared invariants, apply the correct semantic variant, respect migration state, automate machine-decidable checks, and route perceptual/semantic uncertainty to the appropriate review layer.

## Evidence boundary

The migration material is case-study synthesis from first-party Atlassian documentation. The multi-brand conclusion is supported by first-party Maersk, Adobe Spectrum and SAP design-system documentation. Cross-theme accessibility guidance is grounded in W3C WCAG guidance, current browser behavior documented by MDN, and Spectrum/Maersk production-system guidance. The automation layer is grounded in current Storybook/axe integration documentation, W3C evaluation guidance and Playwright's documented browser-emulation capabilities. These establish requirements, mechanisms and important limits; they do not prove that the proposed risk-shaped QA matrix catches every accessibility regression. The matrix is agent-oriented synthesis and still needs validation against failures from large multi-brand products and assistive-technology workflows.

## Next research direction

Investigate **focus and interaction testing as an agent workflow**: compare browser automation, accessibility-tree assertions, screenshots and assistive-technology/manual checks on components whose DOM semantics pass automated rules but whose focus movement, focus visibility, keyboard order or composite-widget behavior is still wrong. Seek concrete failure cases that reveal where an agent should stop auto-fixing and escalate judgment.
