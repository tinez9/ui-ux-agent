# Color and theming

Color needs **semantic roles** separate from brand expression. Themes (dark, high contrast, brands)
are semantic transformations, not inversions.

## Quick rules

1. Use role tokens (canvas, surface, elevated, text primary/secondary, border subtle, action
   primary, focus, status danger/warning/success/info, selection, disabled) — not literals in components.
2. Contrast is a **floor** (4.5:1 text, 3:1 large text and meaningful non-text), not the hierarchy system.
3. Never encode meaning by color alone.
4. Brand color is spent judiciously — often more in content/identity moments than saturating controls.
5. Status colors are semantic; don't use them for decoration, and don't let brand colors
   redefine them.
6. Dark mode preserves role meaning and relative priority, not RGB relationships.
7. Test themes as a **component-state matrix**, not a page background change.

## Audit checklist

- Literal color count and near-duplicates (`style-census.mjs`); tokens bypassed?
- Text roles: computed contrast on their real backgrounds, all themes; secondary/placeholder/
  disabled text legibility (disabled is exempt from WCAG contrast but users still need to read it).
- Non-text contrast: input borders, focus rings, selected states, toggles, chart series, meaningful icons.
- Meaning not color-only: errors, required, status pills, chart legends, diff additions/deletions.
- Semantic misuse: red used for decoration; brand color used for errors; success green as primary button.
- Dark mode, per component: default, hover, focus-visible, active, selected, disabled,
  error/warning/success, loading/skeleton, overlays/scrims.
- Dark mode surfaces: shadows invisible → relationships lost? "gray card soup" of equally elevated surfaces?
- Native controls/scrollbars match theme (`color-scheme` declared)?
- Images/logos/charts/screenshots in dark: baked white rectangles, disappearing transparent edges,
  glaring photos, indistinguishable series, text over gradients.
- Theme switching at runtime works; "system / light / dark" selector honours `prefers-color-scheme`
  and explicit override persists.
- Increased contrast / forced colors: boundaries and focus survive without shadows or background images.

## Dark appearance

- **Why inversion fails:** brand colors become too luminous, muted text unreadable, status colors
  change apparent emphasis, images glare, native controls stay light.
- Resolve each role separately for light and dark.
- Pure white on pure black for long reading can feel harsh for some users; lowering contrast for
  comfort is legitimate **above** the floor and must be tested with increased-contrast settings
  (low-vision users may need more contrast, not less). No universal rule like "never use black".
- Elevation: use the smallest combination that communicates the relationship — luminance
  difference, borders, spatial position, platform materials; shadows only if perceptible.
- Don't globally dim imagery: photographs, user content and evidence-bearing media may need
  faithful reproduction; adapt surroundings first.
- `light-dark()` (Baseline 2024) is syntax, not a substitute for semantic tokens.
- Opt out of dark only on the smallest surface that genuinely can't render correctly.

## Forced colors

`forced-colors: active` replaces author colors, removes `box-shadow`, text shadows and non-URL
background images. Components whose boundary or state exists only as a shadow/background vanish.
Don't compare forced-colors renders to brand screenshots; check perceivability. Prefer native
semantics and system colors; use `@media (forced-colors: active)` for narrow repairs;
`forced-color-adjust: none` is an exception requiring its own proof.

## Multi-brand / themes

Accessibility proof is per resolved variant: semantic names don't prove contrast. Test each theme
mapping that changes values used by text, boundaries, focus or states, and content placed on brand
images/backgrounds. See `design-systems.md` § Migrations and variants.

## Failure modes

- Pure inversion; theme-by-component `.dark` patches until roles drift (fix the token layer).
- Secondary means faint.
- Dark CSS with light native controls (no `color-scheme`).
- Theme tested only at rest.
- Universal image dimming.
- Brand = accent color (identity depends on one hue).

## Evidence boundary

WCAG sets contrast floors; Apple supports adaptive appearance and testing with Increase Contrast;
MDN documents `prefers-color-scheme`, `color-scheme`, `light-dark()`, `forced-colors`. No specific
dark palette, elevation formula or luminance ladder is proven universally better.
