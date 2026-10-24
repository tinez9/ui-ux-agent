# Dark UI and Color Adaptation

## Decision rule

Treat dark appearance as a **semantic theme transformation**, not a color inversion. Preserve the meaning and relative priority of roles—background, surface, text, border, accent, status, focus, disabled, selection—while allowing their literal values and rendering techniques to change.

A robust dark theme answers three separate questions:
1. **What role does this color serve?** Use semantic roles rather than scattering light/dark literals through components.
2. **What must remain perceptible?** Text, controls, focus, state and boundaries still need adequate contrast; “secondary” must not mean illegible.
3. **What visual relationships must survive?** Hierarchy, grouping, elevation, imagery and interactive state need to remain understandable even when shadows or light-background conventions stop working.

## Why inversion fails

Mechanical inversion preserves numeric relationships poorly and semantic relationships not at all. Brand colors may become too luminous, muted text can become unreadable, destructive/success colors can change apparent emphasis, images can glare, and browser-native controls may remain in the wrong scheme.

Prefer theme-aware semantic tokens such as:

```text
color.background.canvas
color.background.surface
color.background.elevated
color.text.primary
color.text.secondary
color.border.subtle
color.action.primary
color.focus
color.status.danger
```

Resolve these roles independently for light and dark contexts. Do not assume every dark value is the mathematical inverse of its light counterpart.

## Contrast is a floor, not the hierarchy system

Accessibility contrast requirements still apply in dark themes. Do not create hierarchy mainly by pushing secondary text toward the contrast threshold. Hierarchy can also come from typography, spacing, grouping, placement, weight, surface relationships and controlled chroma.

Dark interfaces can also become **over-contrasted** in perceptual terms: pure white text on pure black across large reading surfaces can feel harsh for some users. Lowering luminance contrast for ordinary text may improve comfort for some standard-vision users, but it must not undermine required readability, especially for low vision or increased-contrast preferences. Apple explicitly recommends testing dark appearance together with Increase Contrast rather than assuming a gray-on-black treatment is universally comfortable.

Operationally:
- meet applicable contrast requirements first;
- then tune comfort and hierarchy above that floor;
- test increased-contrast/high-contrast contexts separately;
- never encode critical meaning by color alone.

## Surfaces and elevation

Do not blindly translate light-theme shadows into dark theme. Dark backgrounds often make conventional shadows weak or invisible.

Use the smallest combination that communicates the relationship:
- surface luminance differences;
- borders/dividers;
- occlusion and spatial position;
- blur/material effects where the platform supports them;
- shadows only when they remain perceptible and semantically useful.

Elevation is a relationship, not a requirement that every raised object become a lighter card. Excessive nested gray surfaces create “gray card soup” and flatten information architecture into decoration.

## Images, media and brand assets

Dark adaptation includes non-CSS content. Audit:
- logos with baked-in dark text or white rectangles;
- screenshots captured only in light mode;
- transparent illustrations whose edges disappear;
- bright hero photography that overwhelms surrounding dark UI;
- charts whose series become indistinguishable;
- gradients and overlays whose contrast changes behind text.

Prefer explicitly theme-aware assets when semantic integrity matters. Do not globally dim all imagery: photographs, user content and evidence-bearing media may need faithful reproduction. Adapt the surrounding treatment before altering content whose colors carry meaning.

## System preference and user control

On the web, `prefers-color-scheme` is broadly available and reflects an OS/browser preference. Supporting both schemes should also opt browser-provided UI into the appropriate scheme with CSS `color-scheme` (or the document-level metadata where appropriate), so form controls, scrollbars and other user-agent surfaces do not remain visually inconsistent.

`light-dark()` can express paired theme values compactly on current browsers (Baseline 2024), but it is syntax, not a replacement for semantic tokens.

If the product offers an explicit theme selector, a useful model is:

```text
system | light | dark
```

“System” follows `prefers-color-scheme`; an explicit user choice overrides it. Persist the choice without treating a dark preference as evidence about unrelated accessibility needs.

Do not force dark appearance merely because the OS is dark if the product genuinely cannot render a task correctly in that appearance. Conversely, opting out should be scoped to the smallest necessary surface rather than used to avoid theme work.


## Forced colors: user palette, not a third brand theme (reviewed 2026-10-24)

**Decision:** treat `@media (forced-colors: active)` as an independent accessibility rendering contract. It is not interchangeable with `prefers-color-scheme: dark` or `prefers-contrast: more`. The browser substitutes system colors using **native element semantics** (an ARIA `role="button"` on a `div` does not acquire a native button's color treatment). In forced colors, author `box-shadow` and `text-shadow` disappear, and non-URL CSS background images such as gradients are suppressed. Author color declarations are generally replaced at *used/paint* time, so a stylesheet or token inspection alone can mislead.

**Prefer native controls and the user's palette.** Start with semantic HTML, accessible labels, visible state text/shape, and ordinary `forced-color-adjust: auto`. Add narrow, tested repairs where automatic conversion loses an essential boundary or state. Do not remap the entire brand palette, invert colors, or infer that a light/dark screenshot tests Windows contrast themes.

- **Lost boundaries:** controls/cards separated only by shadow, gradient or subtle fill may merge. Add a real border/outline using paired system colors; transparent borders may also be forced into visibility, but verify the actual rendered result.
- **State and focus:** preserve selected/pressed/invalid/focus information through more than color alone (text, checkmark, border/shape). A `box-shadow`-only focus ring vanishes. Check keyboard focus on every state, not merely `document.activeElement`.
- **Icons/charts:** prefer inline SVG `currentColor` for monochrome semantic icons, then inspect actual `fill`/`stroke` under forced colors. External SVG/PNG and multi-series charts may retain pixels or lose distinctions; add labels, patterns or alternative data representations rather than assuming CSS recoloring fixes them.
- **Disabled and overlays:** opacity can make already muted `GrayText` illegible; review actual disabled semantics, scrims, popovers and adjacent surface pairs. Do not treat disabled contrast exemptions as a reason to hide the control's existence.

A small *illustrative repair*, not a universal palette recipe:

```css
@media (forced-colors: active) {
  .shadow-only-panel { border: 1px solid CanvasText; }
  .icon-monochrome { fill: currentColor; stroke: currentColor; }
  .action:focus-visible { outline: 2px solid Highlight; outline-offset: 2px; }
  .action[aria-pressed="true"] { border: 2px solid Highlight; }
}
```

Check these pairings against the *actual adjacent surface and selected Windows theme*; `Highlight` is not guaranteed to contrast with every arbitrary system-color neighbor. Native focus treatment may be better than replacing it.

### The `forced-color-adjust: none` trap

The CSS Color Adjustment specification permits opting out for narrowly justified cases (e.g. intrinsically color-dependent media). Microsoft Fluent's published accent-button recipe deliberately uses `none` to avoid browser text backplates when applying `Highlight`/`HighlightText`. But Microsoft's own accessibility practitioner Sarah Higley documents a serious **maintainability counterexample**: `none` is inherited and exposes later, higher-specificity ordinary author colors that the browser would otherwise override. A downstream `.custom-button` can silently turn a previously accessible control red/purple in high contrast. Thus **do not copy a component-library opt-out into a generic design token or root/container rule**. If an opt-out is unavoidable, constrain it to a minimal leaf, use explicit compatible system-color foreground/background pairs, test text backplates, and regression-test downstream overrides and descendants.

**Local falsification, not a user study (2026-10-24):** Python Playwright driving headless Chromium 144 on Linux with `page.emulate_media(forced_colors="active")` reproduced three mechanisms on a four-element fixture: a shadow-only card lost its shadow; a normal button's author blue/white colors were replaced by system colors; an opted-out, higher-specificity custom button retained author red background/purple text and its shadow. This proves a concrete CSS/UA failure mode **in this emulation only**. It does not validate Windows contrast themes, Firefox, Safari, screen readers, focus visibility or user comprehension.

**Agent acceptance gate:** test light/dark *and* forced-colors separately. Use Playwright `forcedColors: 'active'` or Chromium/Edge DevTools for a quick regression screenshot, inspect computed style **and pixels**, then verify on real Windows contrast themes (including user-customized palettes) and a second engine where supported. Include keyboard focus, selected/disabled/error states, SVGs, charts, native controls and overlays. No automated color-contrast score or emulated screenshot is a substitute for user-palette/AT inspection. Legacy `-ms-high-contrast` and `-ms-high-contrast-adjust` were removed from Edge 138 (June 2025); new rules should use standards-based `forced-colors`.

**Evidence:** CSS Color Adjustment Level 1 Candidate Recommendation (2025-12-16), MDN forced-colors/forced-color-adjust, Microsoft Fluent high-contrast implementation, Sarah Higley (2025-09-17), Edge removal announcement (2025-06-30), Playwright emulation docs, and a reproducible local Chromium 144 fixture. These establish rendering behavior and an adversarial maintenance failure, **not** measured task outcomes or cross-engine parity.

## Component-state audit

For every interactive component, verify both themes across:
- default;
- hover where applicable;
- focus-visible;
- active/pressed;
- selected/current;
- disabled;
- error/warning/success;
- loading/skeleton;
- overlays, dialogs and scrims.

A frequent failure is validating only static foreground/background pairs while focus rings, disabled states, borders, placeholders or selected rows disappear in dark mode.

## Agent implementation contract

When an AI coding/design agent adds dark appearance:

1. inventory existing semantic roles before choosing colors;
2. introduce or repair semantic tokens rather than adding component-local dark overrides everywhere;
3. preserve role meaning across themes, not literal RGB relationships;
4. opt native browser/platform surfaces into the supported scheme;
5. audit text, controls, focus, status and non-text boundaries;
6. audit images, logos, charts and embedded content;
7. test theme switching at runtime, not only separate screenshots;
8. test system preference plus explicit user override if both exist;
9. test increased contrast/high-contrast behavior where relevant;
10. treat theme adaptation as a component-state matrix, not a page-background change.

## Failure modes

### Pure inversion
Produces technically dark pixels without preserving semantic emphasis or brand behavior.

### Near-black + many near-gray cards
Creates a monotonous stack of containers where every section looks equally elevated and equally important.

### Secondary means faint
Uses low contrast as the primary hierarchy mechanism and sacrifices readability.

### Dark CSS, light native controls
Fails to declare `color-scheme`, leaving form controls or browser chrome visually inconsistent.

### Theme-by-component patches
Adds ad-hoc `.dark` overrides until identical roles drift across components. Fix the token layer instead.

### Theme tested only at rest
Misses focus, hover, validation, selected, loading and overlay states.

### Universal image dimming
Reduces fidelity or destroys meaning in charts, photography and user-generated content.

## Evidence boundary

- Apple platform guidance supports adaptive materials/visual effects and recommends adopting both appearances where practical; its accessibility evaluation notes that gray-on-black may reduce strain for some standard-vision users while becoming harder for low-vision or light-sensitive users, so Increase Contrast must be tested.
- MDN documents broad availability of `prefers-color-scheme` and `color-scheme`; the latter also affects browser-provided controls and UI. MDN marks `light-dark()` Baseline 2024.
- Accessibility contrast requirements establish minimum perceptibility, but they do **not** prove that a specific dark palette, elevation formula, or luminance ladder is universally preferable.

Therefore, avoid universal recipes such as “never use black,” “always lighten elevated surfaces,” or fixed dark-theme gray ramps. Validate semantic hierarchy, contrast and task performance in the actual product context.

## Sources

- Apple Developer — Supporting Dark Mode in your interface: https://developer.apple.com/documentation/uikit/supporting-dark-mode-in-your-interface
- Apple Developer — Dark Interface evaluation criteria: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/dark-interface-evaluation-criteria
- Apple Developer — Sufficient Contrast evaluation criteria: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/sufficient-contrast-evaluation-criteria/
- MDN — `prefers-color-scheme`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme
- MDN — `color-scheme`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme
- MDN — `light-dark()`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark
