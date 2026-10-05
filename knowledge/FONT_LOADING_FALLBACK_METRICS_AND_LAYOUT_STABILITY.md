# Font Loading, Fallback Metrics, and Layout Stability

## Decision rule

Treat a webfont as a **rendering dependency with UX cost**, not as a purely visual asset. A font-loading strategy must jointly protect:

`content visibility × layout stability × typographic identity × payload × language coverage`

Do not optimize one in isolation. A fast fallback that reflows dramatically on swap is not stable; a perfectly matched fallback hidden behind FOIT is not available; a large brand font that adds little product value may not justify its cost.

## Separate three decisions

### 1. Whether the webfont is worth shipping

Prefer a system/local stack when brand differentiation or reading quality does not justify transfer, loading, and fallback complexity. If a webfont is justified, ship only the faces, axes, and glyph coverage actually needed.

Variable fonts can reduce requests/files when many variants are genuinely used, but they are not automatically smaller than a minimal static-font configuration.

### 2. When text becomes visible

`font-display` controls the browser's block/swap periods. It is a policy choice, not a universal `swap` recipe.

- `swap`: prioritizes immediate readable fallback and permits a later swap; useful when eventual brand/type fidelity matters, but a poor metric match can visibly reflow.
- `fallback`: gives the primary font a short opportunity, then limits the later swap window; useful when avoiding a very late visual change matters.
- `optional`: prioritizes stable/fast rendering and may keep the fallback for that visit under unfavorable loading conditions; useful when the custom face is non-essential.
- `block`: risks invisible text during its block period and needs a specific reason; do not choose it merely to prevent seeing the fallback.

Exact period lengths are user-agent behavior; do not build product correctness around assumed millisecond values.

### 3. How compatible the fallback geometry is

Font swapping can change glyph widths, x-height, ascent/descent, line boxes, wrapping, control widths, card heights, and downstream element positions. Choose fallbacks for **metric compatibility as well as visual similarity**.

Current CSS provides several distinct tools:

- `font-size-adjust` normalizes a selected metric such as x-height/cap-height across fonts, helping preserve apparent size and legibility during fallback.
- `size-adjust` in `@font-face` scales glyph outlines and associated metrics for a particular face and is broadly available in current browsers.
- `ascent-override`, `descent-override`, and `line-gap-override` can tune line metrics for a fallback face, but support for individual metric-override descriptors must be checked rather than assumed universal.

Do not stack metric tools mechanically. CSS Fonts Level 5 explicitly notes that when an overridden metric from `size-adjust` is used by `font-size-adjust`, combining them can make `size-adjust` appear to have no effect. Understand which layer owns the normalization.

## Stable fallback pattern

When the custom font matters and swapping is acceptable:

1. select a locally available fallback with similar proportions;
2. compare representative strings at real product sizes/weights/languages;
3. match apparent size/metrics only as far as current browser support permits;
4. verify wrapping and component geometry before and after swap;
5. test slow/failed font loading, not only warm-cache rendering;
6. measure layout shift in the rendered product.

Illustrative structure:

```css
@font-face {
  font-family: "Product Sans";
  src: url("/fonts/product.woff2") format("woff2");
  font-display: swap;
  font-weight: 400 700;
}

@font-face {
  font-family: "Product Fallback";
  src: local("Arial");
  size-adjust: 98%; /* measured example only; never copy blindly */
}

:root {
  font-family: "Product Sans", "Product Fallback", sans-serif;
}
```

Metric values must come from the actual primary/fallback pair. Do not cargo-cult percentages from another font.

## Layout stability is broader than CLS

CLS is useful telemetry, but the design problem is broader. A font swap can be disruptive even when aggregate movement is modest:

- a heading changes from two lines to three;
- a primary action wraps or moves;
- table columns resize;
- a composer/input changes height while typing;
- navigation items no longer fit;
- truncation changes which information is visible;
- a localized string crosses a breakpoint-like threshold.

Evaluate **semantic geometry**: does the same information remain grouped, readable, actionable, and spatially predictable before and after the font resolves?

## Subsetting and language coverage

Subsetting reduces payload only when coverage remains correct for the product. Treat `unicode-range` and generated subsets as a language/content architecture decision, not merely compression.

Check:
- supported locales and scripts;
- user-generated content;
- names and mixed-script strings;
- symbols/currency/technical characters;
- fallback transitions inside a single line.

An aggressively subsetted brand font can create mixed-font text whose metrics and hierarchy are worse than using a coherent fallback.

## Preload sparingly

Preload only fonts that are highly likely to be required in the initial render. Preloading speculative weights, styles, scripts, or below-the-fold faces competes with more important resources and defeats the optimization.

The decision should follow actual critical rendering needs, not “preload every font.”

## Agent implementation contract

Before adding a custom font, an AI coding/design agent should record:

- why the font materially improves the product;
- which roles/weights/styles/scripts are required;
- the chosen display policy and why;
- the fallback stack;
- whether metric matching is needed and supported;
- the slow-load/failure behavior;
- the expected payload and subset strategy;
- how layout stability will be tested.

If those answers are weak, default toward a simpler font configuration.

## Failure modes

- `font-display: swap` is applied universally without checking reflow.
- FOIT is accepted solely to preserve branding.
- fallback selection is based on appearance while widths/line metrics differ heavily.
- copied `size-adjust`/metric-override values make another font pair worse.
- metric overrides are treated as universally supported without compatibility checks.
- both `font-size-adjust` and `size-adjust` are layered without understanding their interaction.
- every weight/style/script is preloaded.
- subsetting omits real user/localized content.
- font performance is tested only on a developer's warm cache.
- a variable font is assumed to be smaller without comparing the actual files needed.
- CLS is low, so disruptive line-wrap or control-geometry changes are ignored.

## Evaluation checklist

Test at minimum:

- cold cache with throttled/failed font requests;
- fallback-only rendering;
- before/after swap screenshots or geometry diff;
- headings, controls, navigation, tables and dense cards;
- longest supported localized strings and representative user content;
- relevant weights/styles and variable axes;
- zoom/text enlargement alongside fallback behavior;
- real layout-shift telemetry where available.

A successful font strategy should keep the interface useful at every point in the loading timeline, not merely look correct after the font has arrived.

## Evidence boundary

**Standards/platform evidence:** CSS Fonts Level 5 documents `font-size-adjust`, metric overrides, their interaction, and the use of fallback metric overrides to reduce layout shift. MDN documents current `font-display`, `size-adjust`, `font-size-adjust`, and metric-override behavior and compatibility. As of 2026-10-05, MDN marks `size-adjust` broadly available and `font-size-adjust` Baseline 2024, while `ascent-override` remains limited availability; agents should re-check compatibility because this is fast-changing implementation knowledge.

**Agent synthesis:** the three-decision model, semantic-geometry test, implementation contract, and selection guidance are operational synthesis. They are intended to prevent cargo-cult font optimization and should be validated against the product's actual font files, content, languages, network profile, and browser support.

## Sources

- W3C CSS Working Group, CSS Fonts Module Level 5, current Working Draft, accessed 2026-10-05.
- W3C CSS Working Group, CSS Fonts Module Level 4 Working Draft, 2026-09-06, accessed 2026-10-05.
- MDN, `@font-face/font-display`, accessed 2026-10-05.
- MDN, `@font-face/size-adjust`, last modified 2026-04-20, accessed 2026-10-05.
- MDN, `font-size-adjust`, accessed 2026-10-05.
- MDN, `@font-face/ascent-override`, last modified 2026-04-20, accessed 2026-10-05.
