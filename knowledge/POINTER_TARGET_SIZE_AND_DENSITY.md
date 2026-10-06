# Pointer target size, spacing, and interface density

## Decision rule

Do not encode one universal `44px` or `48px` component height as "the accessibility requirement". Separate three questions:

1. **Conformance floor** — does the authored pointer target satisfy the applicable accessibility criterion?
2. **Platform/product comfort target** — is it large enough for the expected input, device, environment, and user population?
3. **Visual density** — how large does the control *look*? Visual bounds and activation bounds do not always need to be identical.

This distinction lets an agent preserve compact visual hierarchy without silently creating precision-dependent interaction.

## Web conformance is not a 44 px rule

WCAG 2.2 SC 2.5.8 (AA) requires pointer targets to be at least **24 × 24 CSS px**, but explicitly permits smaller targets when their spacing prevents a 24 CSS px diameter circle centered on each target from intersecting another target, plus exceptions for equivalent controls, inline content, user-agent-controlled targets, and essential presentations.

WCAG 2.5.5 (AAA) uses **44 × 44 CSS px** with its own exceptions. Therefore:

- `24px` is not a universal recommended button size; it is an AA conformance floor with exceptions.
- `44px` is not the WCAG 2.2 AA minimum.
- passing 2.5.8 does not establish that a dense interface is comfortable for touch, tremor, motion, one-handed use, or imprecise environments.
- spacing is part of target accessibility, not merely visual polish.

For agents, test the **interactive hit region and neighbouring targets**, not just icon glyph dimensions.

## Platform guidance is deliberately more generous

Platform systems often optimize for practical operability rather than the minimum web conformance threshold. Fluent 2 explicitly notes minimum touch-target considerations of **44 × 44 for iOS/web** and **48 × 48 for Android**. Apple guidance also demonstrates that an interactive visual can be smaller than its effective selection area; in spatial interfaces Apple requires at least 60 points of target area while showing a standard 44-point button as a visually smaller example.

These values are platform guidance, not interchangeable units or proof that every web control must be that size. CSS px, iOS points, Android dp, and spatial points belong to different rendering/input environments.

## Visual size and hit size can diverge — carefully

A small icon does not require a small hit target. Prefer padding or a larger semantic control around the icon when layout permits. This is especially valuable for icon buttons, disclosure controls, row actions, steppers, dismiss controls, and compact toolbars.

However, invisible hit-area expansion is not free:

- expanded regions must not overlap adjacent controls;
- the perceived clickable area should not become surprising;
- dense repeated actions still need enough separation to avoid accidental activation;
- a visually tiny control may remain hard to discover even when its hit region is large;
- hover/focus/pressed feedback should communicate the actual interactive affordance where practical.

Do not use transparent overlays or pseudo-elements that steal pointer events from neighbouring content merely to satisfy a numeric target.

## Density is contextual, not a desktop/mobile binary

Do not infer input precision from viewport width. A large screen can be touch-operated; a small viewport can have a mouse or stylus. Responsive layout and input modality are related but different dimensions.

A useful hierarchy is:

- **frequent primary action, destructive action, sequential task, edge-of-screen action, or touch-first environment:** bias toward larger, clearly separated targets;
- **dense expert tooling with precise pointing input:** compact visuals may be justified, but preserve keyboard operation and the applicable pointer-target floor;
- **inline links in prose:** treat them according to the WCAG inline exception rather than inflating line boxes indiscriminately; still preserve readable link distinction and adequate line layout;
- **icon-only actions:** keep the icon visually appropriate while sizing the semantic button/hit area for operability.

Density should be a deliberate product mode or component contract, not an accidental result of shrinking padding.

## Agent implementation contract

For every interactive component, reason about these independently:

```text
visual_bounds
pointer_hit_bounds
spacing_to_other_targets
keyboard_focusability
focus_indicator_bounds
input_context
conformance_target (e.g. WCAG 2.2 AA)
product/platform comfort target
```

Do not derive one field blindly from another.

### Good default workflow

1. Identify the actual target element and its computed hit bounds.
2. Check the required conformance level and exceptions before declaring failure.
3. Check neighbouring target geometry, not target size alone.
4. Apply the product/platform comfort target, which may intentionally exceed WCAG AA.
5. Preserve compact visuals with padding/hit-area design when safe rather than shrinking interaction geometry.
6. Test zoom/reflow and narrow layouts: target expansion must not create overlap or clipping.
7. Test keyboard focus separately; pointer target size does not prove visible or correctly ordered focus.
8. Test representative touch/pointer environments when interaction density is important.

## Failure modes for AI-generated UI

### "Everything must be 44 px tall"

This confuses an enhanced WCAG threshold/platform heuristic with a universal component dimension. It can unnecessarily destroy information density and still fail to make irregular icon/link targets usable.

### "The icon is 20 px, so the target fails"

Glyph size is not target size. Inspect the interactive element's activation box.

### "24 px means accessible"

24 × 24 is an AA minimum criterion, not a usability optimum. Risk rises with dense neighbours, imprecise input, motion, destructive consequences, and repeated tapping.

### "Mobile gets large targets; desktop gets small targets"

Viewport is not input modality. Avoid architecture that assumes `@media (max-width)` reliably means touch.

### "Increase hit area with an invisible absolute overlay"

This can create overlapping or stolen interaction regions. Prefer semantic control padding and explicit layout spacing.

## Evidence boundary

W3C establishes conformance requirements and exceptions. Apple and Fluent establish platform/design-system guidance and demonstrate that visual and interactive bounds need not be identical. These sources support a layered decision model; they do **not** establish one empirically optimal target size for every user, device, task, or product category.

## Sources

- W3C WAI, **WCAG 2.2 — 2.5.8 Target Size (Minimum)** and supporting guidance: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- W3C WAI, **Understanding 2.5.5 Target Size (Enhanced)**: https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced
- Microsoft, **Fluent 2 — Layout**: https://fluent2.microsoft.design/layout
- Apple, **Design for spatial user interfaces (WWDC23)**: https://developer.apple.com/videos/play/wwdc2023/10076/

## Research frontier

Useful follow-up evidence would compare target-size and spacing policies under real dense productivity workloads, including coarse-pointer/touch hybrids, stylus use, motor impairments, destructive row actions, and adaptive density. Do not promote device-detection heuristics without outcome evidence.