# Typography

Typography is structural: semantic role × scale × measure × line height × spacing × responsive
behaviour × font metrics × language. A distinctive face or oversized heading doesn't compensate
for fragile reading geometry.

## Quick rules

1. Define a **small set of semantic roles** (display, page title, section heading, body,
   supporting, label, data, code) mapped to a constrained scale. Add a size only when a real
   hierarchy need appears.
2. Design size and line height together, per role and font.
3. Bound **measure** independently of page width (long-form roughly 45–75 characters as a
   starting heuristic; validate with the real font, language and content).
4. Responsive ≠ fluid: fluid `clamp()` mainly for display roles; body, labels, controls and data
   usually work better with stable tested sizes plus layout adaptation.
5. Text must survive 200% enlargement, WCAG text-spacing overrides and long/localized strings
   without clipping or overlap. Never disable zoom.
6. Hierarchy uses size + weight + spacing + placement + contrast — not size alone; not more levels
   than users can distinguish.
7. A webfont is a rendering dependency with cost; justify it, limit faces/axes, choose fallbacks
   for metric compatibility.

## Audit checklist

- Count distinct font sizes/weights/line heights in use (`style-census.mjs`) vs the number of real
  roles. Many near-duplicates → no type system (root cause).
- Every text style maps to a role (not one-off "16px semibold gray").
- Body text readable size on mobile; no breakpoint that shrinks text so much zoom no longer helps.
- Long-form measure bounded on wide screens; line height adequate for body.
- Headings tested at 2+ lines; buttons/labels with long text; translations; user content without spaces.
- 200% zoom and text-spacing override (1.5 line height, 2× paragraph, 0.12em letter, 0.16em word):
  no clipping (fixed heights, `overflow: hidden`, absolute positioning).
- Truncation only where the full value stays available or is genuinely unnecessary.
- Left-aligned long copy (LTR); centered/justified only for short display text.
- Heading levels semantic (outline), independent from visual size.
- Font loading: cold-cache/throttled render — invisible text? disruptive reflow (headings
  rewrapping, buttons moving, tables resizing)?
- Expressive face limited to roles where identity gains are real; UI/body face legible at small sizes.

## Scale and roles

- Production systems (e.g. GOV.UK) couple size and line height, use relative units, and change
  only selected scale points across widths while keeping body sizes stable — bounded responsive
  scale rather than shrinking everything.
- Modular ratios can produce dramatic display sizes and poor product hierarchy; use them as a
  starting point, not a law.
- Split voice from reading infrastructure: custom/brand face for selected display roles; highly
  legible face for body and controls; one defined hierarchy linking both.

## Surfaces have different needs

| Surface | Optimize |
|---|---|
| reading | sustained reading, stable measure, comfortable line height |
| scanning | hierarchy, labels, comparison, alignment of numbers (tabular figures) |
| controls | legibility, predictable wrapping, target/layout resilience |
| display | expression; fluid scaling acceptable when hierarchy benefits |

## Fluid type

`clamp(min, preferred, max)` is a primitive, not a strategy. When justified: define the role
first; tested bounds; relative bounds that still allow user enlargement (hard px caps can defeat
zoom); test the whole interval and narrow containers (viewport width ≠ component width).

```css
.display { font-size: clamp(2rem, calc(1.4rem + 2.5vw), 4rem); line-height: 1.05; }
.prose   { max-inline-size: 65ch; } /* heuristic — validate with the actual font/content */
```

## Vertical rhythm and wrapping

Don't encode rhythm around an assumed number of lines. Localize spacing to components; use
flow/grid/flex that tolerate wrapping. Never reduce line height to force enlarged text back into a
fixed box.

## Font loading and fallback

Three separate decisions:
1. **Is the webfont worth it?** System stacks are often the better performance choice. Ship only
   needed faces, axes and glyph coverage; variable fonts aren't automatically smaller.
2. **When text becomes visible** (`font-display`): `swap` (readable fallback, later swap — check
   reflow), `fallback` (short chance, limited late swap), `optional` (stable, may keep fallback),
   `block` (invisible text risk — needs a specific reason).
3. **Fallback geometry:** choose fallbacks for metric compatibility; `size-adjust` (broadly
   available) and `font-size-adjust` (Baseline 2024) can normalize; `ascent/descent/line-gap-override`
   support varies — check. Don't stack metric tools mechanically; derive values from the actual
   font pair, never copy percentages.

Layout stability is broader than CLS: a heading going from 2 to 3 lines, a primary action
wrapping, columns resizing or navigation no longer fitting are disruptive even with a low CLS.
Subsetting is a language decision (locales, user content, names, symbols); aggressive subsets
create mixed-font lines. Preload only fonts certain to be needed for the first render.

## Failure modes

- Every role uses `vw`; controls and body drift with screen size.
- Hard max sizes that prevent meaningful enlargement.
- Wide screens lengthening prose lines instead of bounding measure.
- Fixed-height cards/buttons clipping translated or enlarged labels.
- A display scale that dwarfs the product's real hierarchy.
- Responsive testing on device widths only — not zoom, text enlargement, localization, narrow containers.
- `font-display: swap` everywhere without checking reflow; FOIT to protect branding; unused axes shipped.

## Evidence boundary

WCAG 1.4.4, 1.4.10, 1.4.12 and failure F69 set the accessibility constraints; MDN documents
`clamp()`, `font-display`, `size-adjust`, `font-size-adjust`; GOV.UK provides a tested production
scale. No universal font size, line height, character count, ratio or fluid formula is
established. Browser support notes reviewed 2026-10 — re-check.
