# Visual Design

Operational knowledge about typography, composition, color, imagery, iconography, depth, texture, and responsive art direction.

## Research lens
For each visual pattern distinguish aesthetic signal, product-category fit, brand fit, readability/usability effect, implementation cost, accessibility risk, and trend maturity.

## Initial principles
- Typography is structural: size, weight, measure, line height, spacing, contrast, and rhythm matter together.
- Composition should reveal priority rather than flatten hierarchy into decorative grids.
- Color needs semantic roles separate from brand expression.
- Distinctiveness is strongest when it emerges from a coherent system rather than one fashionable effect.


## Responsive imagery and art direction: a crop is a content decision — 2026-10-24

**Decision:** specify the image's **job, subject, focal region, permitted crop and text-safe space** before selecting an image API. Image quality is not just resolution: a fast, sharp crop that removes the evidence, subject, product detail or spatial context needed for the task is a failed design. Do not use a generic full-bleed stock hero as a substitute for product-specific visual intent.

| Actual requirement | Lowest-complexity mechanism | Failure boundary |
|---|---|---|
| Same composition, different display sizes/DPR | One semantic `<img>` with accurate `srcset` and `sizes` | `srcset` chooses a resource; it does not recompose the scene. Incorrect `sizes` can waste bandwidth. |
| Same photo, decorative framing may clip edges | `object-fit: cover` + reviewed `object-position` | Cropping is **not** art direction if the important content is outside the frame. Use `contain` or change layout when the whole object matters. |
| Different framing is required for narrow/wide views | `<picture><source media=...>...<img ...></picture>` with editorially approved variants | `media` queries are **viewport/media conditions**, not container queries. A narrow sidebar on a wide desktop can receive the wide asset. |
| The image is purely decorative | CSS background or `<img alt="">` | A CSS background has no useful image alternative; never hide informative content or text inside it. |
| Product detail, map, diagram or evidence must remain intact | Preserve full image or supply zoom/detail and accessible text/data | Cropping for visual consistency must not erase required information. |

### Image contract for design and implementation agents

1. **Art-direct the content, not only the rectangle.** Specify the essential subject(s), relationships, optional context, intended emotional/brand tone, negative space for adjacent copy, and a safe crop per aspect ratio. If an image communicates something necessary, verify every delivered variant communicates it. Avoid baking headings, prices or controls into raster art: translations, zoom and assistive technology need real text. Check licensing/provenance and whether a subject can be used in the proposed context.
2. **Separate resource choice from composition.** Use `srcset`/`sizes` for resolution and slot width; use `<picture>` when the **composition** must change. `<source>` order matters (first matching media/type), and `<img>` remains the fallback and the location for `alt`. For different aspect ratios, specify `width`/`height` on each relevant `<source>` and on the fallback `<img>` (or an equivalent reserved CSS aspect ratio) to reduce layout shifts. Do not combine `w` and `x` descriptors in the same candidate list.
3. **Keep the accessible meaning consistent.** W3C classifies `alt` by *purpose in context*: informative image = useful replacement meaning; decorative image = empty `alt`; image-only link/button = destination/action; complex visual = equivalent information elsewhere. A single `<picture>` uses one fallback `<img alt>`; if two crops tell materially different stories, fix the variants or surrounding content rather than inventing an `alt` that describes an invisible object. A hero with adjacent equivalent copy can be decorative; not every photograph needs a verbose literal description.
4. **Treat automatic focal detection as a proposal.** Cloudinary's own example shows `g_auto` prioritizing people when the desired subject is a storefront; `person_avoid` changes the result. Object-specific gravity can select only the most prominent of several same-class objects; missing-object fallbacks vary by mode. For editorial, identity, product and evidence-critical assets, review generated variants and retain a human-set focal point or curated crops. Saliency/face detection is not proof of the image's communicative purpose.
5. **Make the priority match the actual LCP.** The visible, above-the-fold LCP image should be discoverable in server HTML, not client-JS-only or lazy-loaded; use a measured `fetchpriority="high"` or an appropriate responsive preload **selectively**. Do not high-prioritize every carousel slide or preload desktop and mobile alternatives indiscriminately. Defer genuinely offscreen images. Reserve layout space and measure LCP, CLS, transferred bytes and `currentSrc` at actual device widths/DPR; a blur placeholder does not fix a late network request.
6. **Check framework/version behavior.** Next.js 16 deprecated `priority` in favor of `preload`, but current docs generally favor `loading="eager"` or `fetchPriority="high"` over `preload`; `preload` is discouraged when multiple candidates might be LCP. `fill` without accurate `sizes` assumes `100vw` and may download an oversized file. Its documented `getImageProps()` + `<picture>` path supports art direction, but its blur placeholder is not removed when used through `getImageProps()`. Verify the **installed** framework release and optimizer policy, not a copied legacy `priority` recipe.

```html
<!-- Different approved compositions, same essential subject and meaning. -->
<picture>
  <source media="(max-width: 44rem)" srcset="/scene-portrait.webp"
          width="720" height="900">
  <img src="/scene-wide.webp" width="1440" height="720"
       alt="The accessible meaning of the scene" fetchpriority="high">
</picture>
```

For this example, style the image's displayed width and height responsively; do not use the illustrative `alt` placeholder in production. If the layout is a small card rather than a full-width hero, model its **actual slot width** in `sizes` when using width-descriptor candidates. A viewport breakpoint is not a substitute for testing the same component in different container widths.

**Adversarial QA gate:** test wide hero, narrow card on wide viewport, narrow phone, landscape phone, 200–400% zoom, long translated heading, light/dark overlay contrast, slow/blocked images, high DPR, no JavaScript, and screen reader. Include two-person scenes, off-center products, small text in source imagery, multiple same-class objects and empty negative space. Record selected `currentSrc`, intrinsic/visible aspect ratio, clipped critical subjects, actual bytes, LCP/CLS, text contrast and meaning conveyed by `alt`/surrounding text. A correct HTML validator or passing Lighthouse score cannot certify the editorial crop.

**Evidence boundary:** WHATWG/MDN establish `picture`, source selection, intrinsic sizing and CSS cropping mechanics; W3C establishes image-alternative purpose; web.dev documents LCP/CLS delivery tradeoffs; Next.js and Cloudinary document product-specific capabilities and concrete exceptions. The visual brief and QA gate are agent synthesis, **not** a controlled finding that curated crops outperform automatic crops on all tasks. No browser matrix or user-outcome experiment was executed.

**Primary references (reviewed 2026-10-24):** [WHATWG art direction](https://html.spec.whatwg.org/dev/images.html), [MDN picture](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture), [MDN source dimensions](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/source), [MDN object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit), [W3C image alternatives](https://www.w3.org/WAI/tutorials/images/), [web.dev images/CLS](https://web.dev/learn/html/images), [web.dev LCP](https://web.dev/articles/optimize-lcp), [Next.js 16 Image](https://nextjs.org/docs/app/api-reference/components/image), [Cloudinary object-aware cropping](https://cloudinary.com/documentation/cloudinary_ai_content_analysis_object_aware_cropping).

## Color contrast: conformance gate versus perceptual review — 2026-10-23

**Do not let a design skill replace the standard.** For a WCAG 2.2 AA target, check actual text/background pairs against **4.5:1 for normal text** and **3:1 for large text** (at least 18pt/24px regular or 14pt/~18.67px bold), and necessary UI-component/graphic cues against **3:1**. The ratios are exact thresholds: do not round 4.499 to 4.5. A logo/inactive-control exception is narrow, not a license to hide important status or functionality. Check states and adjacent colors, not just a palette's swatches. See [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

**APCA is supplemental, not WCAG 3 compliance.** APCA models polarity and type size/weight in a way that may surface readability concerns missed by a simple ratio; it has a signed Lc (**positive = dark text on light; negative = light on dark**). But the [September 2026 WCAG 3 Working Draft](https://www.w3.org/TR/2026/WD-wcag-3.0-20260910/#text-contrast-sufficient-minimum) has **not chosen a contrast algorithm**. Do not report an APCA pass as WCAG 3 conformance, use generic fixed Lc cutoffs for every font, or overturn a WCAG 2 failure because APCA looks favorable. If APCA and WCAG 2 disagree, retain the WCAG 2 conformance verdict and record the APCA reading as an additional design question.

**Token/render test:** enumerate semantic foreground/background pairs in light, dark, high-contrast and interaction states; resolve opacity/compositing and backgrounds with images/gradients; check actual text size/weight and the browser-rendered colors (including OKLCH gamut mapping). Use automated WCAG checks for broad coverage, then manually inspect thin type, tiny icons, images, forced colors, focus indicators and user overrides. Automated checks are neither complete nor infallible: [axe-core's documented JSDOM limitation](https://github.com/dequelabs/axe-core) and a [reported OKLCH false positive](https://github.com/dequelabs/axe-core/issues/5036) justify independent reproduction, not abandoning automation. Avoid treating a change in OKLCH lightness as proof that contrast is fixed without recalculation after gamut mapping.

**Evidence boundary:** W3C establishes current conformance rules and the undecided status of WCAG 3; APCA is an evolving alternative model, not demonstrated superiority for all readers, scripts or display conditions. No user-outcome experiment was conducted in this cycle.

## Responsive typography as a system

Typography is not a collection of independent `font-size` choices. Treat it as a coordinated system of **semantic role + scale + measure + line height + spacing + responsive behavior**. A visually distinctive typeface or oversized heading does not compensate for fragile reading geometry.

### Start from roles, not arbitrary sizes
Define a small set of semantic text roles such as display, page title, section heading, body, supporting text, label, and data. Map roles onto a constrained type scale and reuse them. Add a new scale point only when an existing role cannot express a real hierarchy requirement.

GOV.UK is useful production evidence: its current scale couples font size and line height, emits relative units, and changes selected scale points by viewport while keeping common body sizes stable. This supports a bounded responsive scale rather than shrinking every text style proportionally on small screens.

### Responsive does not mean continuously fluid
Do not reach for `clamp()` merely because it is available. Continuous interpolation is useful when the visual relationship genuinely benefits from gradual scaling, especially display typography, but body text and controls often benefit more from stable, tested sizes. Whether stepped or fluid, test the intermediate states rather than only the endpoints.

Typography and layout are coupled. Larger text changes wrapping, component height, truncation, navigation density, and absolute positioning. A typography-scale change therefore requires component and narrow-layout regression testing, not just visual approval of isolated specimens.

### Measure is part of the type style
Control reading width independently from page width. GOV.UK constrains common content layouts so body lines usually remain at no more than roughly 75 characters; treat that as strong public-service guidance, not a universal magic number. The durable rule is to prevent long-form copy from expanding to whatever width the viewport happens to provide.

Short UI labels, dense tables, code, editorial prose, and multilingual text have different measure needs. Do not force one prose measure onto every text-bearing component.

### Soft-wrap policy: `balance`, `pretty`, and `stable` serve different goals (2026-10-26)

Choose the line-breaking **objective**, not a fashionable CSS property. `text-wrap: balance` equalizes short lines but can leave unused width under an image or beside a CTA. `text-wrap: pretty` favors improved rag/short last lines without promising uniform results; browsers implement different algorithms. `text-wrap: stable` targets editing, preserving preceding lines while typing. Ordinary `wrap` is a robust default for controls and changing content. Avoid applying `balance` globally: `text-wrap-style` inherits, and Chromium/Firefox cap how many lines are balanced (WebKit documents a different strategy).

**Measured layout counterexample:** Two matching Chromium 144.0.7559.96/Playwright runs (Linux, Arial 28px, line-height 1.25, 430px text width) measured a three-line English heading's rounded line-ink widths via per-character DOM Range rectangles: `wrap` **403/380/59px**, `balance` **252/269/321px**, `pretty` **319/381/142px**. All remained three lines. `balance` changed the overall footprint; `pretty` improved the isolated last line in this fixture without equalizing all lines. A longer sample showed identical `balance`/`wrap` at **eight lines/430px** but different wrapping at **six lines/580px**. These are layout observations, **not** readability, user preference, performance or cross-browser outcomes.

**Agent gate:** Scope each style to a semantic text role. Compare `wrap`, `balance`, `pretty` against the surrounding composition and real copy at narrow/intermediate widths, zoom, user spacing overrides, fallback fonts and longer translations. Preserve natural height and normal-wrap fallback. Do not hardcode `<br>` or add a JS balancer just to reproduce a single screenshot. CSS Text Level 4 allows user-agent variation; MDN documents short-block and performance boundaries, and WebKit explains its broader Safari 26 `pretty` algorithm. Test the actual browser rather than assuming pixel-identical wrapping.

### Spacing must be resilient, not merely attractive
WCAG 2.2 SC 1.4.12 does **not** prescribe the site's default typography. It requires content and functionality to survive user-applied spacing of at least 1.5× line height, 2× paragraph spacing, 0.12em letter spacing, and 0.16em word spacing where those properties apply to the language/script.

Design consequence: avoid fixed-height text containers, clipping, tightly positioned decorations, or layout assumptions that break when text occupies more space. Do not misuse the WCAG test values as a universal aesthetic recipe.

### Zoom and reflow are layout requirements
At WCAG AA, content that can reflow must remain usable at the equivalent of 320 CSS px width without two-dimensional scrolling, except where a two-dimensional layout is essential. This is closely related to 400% text/zoom use cases. Typography therefore cannot be validated independently from reflow.

Prefer relative sizing where practical and test browser zoom, text enlargement, narrow widths, and user spacing overrides. Avoid treating desktop/mobile screenshots as sufficient responsive evidence.

### Alignment and hierarchy
For long body copy in left-to-right languages, left alignment is a robust default. Full justification can create irregular word spacing; centered copy becomes harder to track as line count grows. These are reading rules, not prohibitions on short expressive display text.

Create hierarchy with a combination of size, weight, spacing, placement, and contrast. Do not make every hierarchy step depend on size alone, and do not add more type levels than users can meaningfully distinguish.

### Agent implementation contract
Before shipping a typography system, verify:
1. every text style has a semantic role rather than a one-off visual name;
2. size and line height were designed together;
3. long-form measure is intentionally bounded;
4. responsive changes preserve hierarchy instead of mechanically shrinking everything;
5. 200–400% zoom/text enlargement and narrow reflow do not hide content or require horizontal reading scroll where reflow should work;
6. WCAG text-spacing overrides do not clip or overlap content;
7. long translations, dynamic data, and fallback fonts do not break critical controls;
8. truncation is reserved for contexts where the full value remains available or genuinely unnecessary.

### Evidence boundary
W3C establishes accessibility constraints for text spacing and reflow. GOV.UK provides a mature, tested production example of a responsive type scale, relative sizing, constrained reading measure, and alignment guidance. Neither source proves one universal font size, line height, character count, modular ratio, or fluid-scaling formula for all products.

## Webfont loading: fallback is a designed interface state — 2026-10-23

**Decision:** design the page for its first readable font **and** its final font. A beautiful loaded typeface is insufficient if a late swap moves controls, shifts paragraphs under a reader, or clips localized text. Select loading policy per text role and product need, not one global `font-display` value.

- **`swap`** paints fallback promptly and may replace it at any later time. It fits short brand-critical text or well-delivered fonts when late reflow is measured and acceptable; an infinite swap window can disrupt reading. **`fallback`** allows only a short swap opportunity, then retains fallback for that page lifetime; the September 2026 CSS Fonts 4 **Working Draft** recommends it for long body copy. **`optional`** favors uninterrupted reading: once fallback has painted, the font cannot swap in on that page; accept that the brand font may not appear on a slow first visit. **`block`** can hide text while waiting and should not be the default for meaningful body content. `auto` leaves timing to the browser.
- **A framework default is not a design mandate.** As checked 2026-10-23, `next/font` defaults to `display: 'swap'`, `preload: true`, and for Google fonts `adjustFontFallback: true`. Its self-hosting and generated fallback reduce setup cost, but do **not** prove zero layout shift for every font, language or device. Choose a display policy deliberately; inspect generated font requests and the rendered result rather than assuming defaults optimize the task.
- **Match fallback metrics, but do not copy magic percentages.** `@font-face size-adjust` is widely supported and can bring glyph advances/scale closer; `ascent-override`, `descent-override`, and `line-gap-override` can address vertical metrics where supported, but MDN still marks the override family as limited availability. Calibrate against the actual font, weights, fallback and scripts; identical metrics do not guarantee identical glyph shaping or line breaks. `font-size-adjust` is a distinct property; MDN notes its calculation can neutralize `size-adjust` when combined. Test the combination instead of stacking adjustments blindly.
- **Budget font requests.** Preload only faces/subsets needed for initial visible content: preloads compete with other critical assets and bypass `unicode-range` selection. Manual font preloads need `as="font"`, the matching MIME type and `crossorigin` even for same-origin files; do not duplicate a framework's generated preload. Prefer fewer necessary families/styles; variable fonts can reduce multiple weight files but are not always smaller than a single static face. Check the license before self-hosting/subsetting and verify actual glyph coverage in every shipped locale.
- **Fallback is not a hidden test-only state.** Check navigation widths, button labels, inline icons, numerals, table columns, body measure, accents, CJK/RTL scripts where supported, long translations and text zoom with the font blocked. Do not replace missing glyphs with blank boxes or hide content until branding loads.

**Agent validation:** compare `swap` with calibrated fallback, `fallback`, `optional`, and system-font-only under cold throttled network, warm cache and blocked-font conditions. Inspect first readable paint, font-induced CLS, LCP, line-wrap changes, focus/scroll continuity, clipped controls, localization and 200–400% zoom on real mobile browsers. A lower CLS number is not proof of better task comprehension; measure interruptions and successful task completion where the tradeoff matters.

**Evidence boundary:** [CSS Fonts Level 4 Working Draft (2026-09-06)](https://www.w3.org/TR/2026/WD-css-fonts-4-20260906/) provides proposed display-role guidance, **not a finalized W3C Recommendation**. [web.dev font practices](https://web.dev/articles/font-best-practices) documents delivery/performance tradeoffs; [MDN size-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/size-adjust), [ascent-override](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/ascent-override), [font-size-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-size-adjust) and [preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload) document platform mechanics/compatibility; [Next.js font module](https://nextjs.org/docs/app/api-reference/components/font) documents framework defaults. None establishes a universally superior policy from comparative user trials.

## High-density product interfaces

Density is not the same as making everything smaller. Treat it as **useful information and action capacity per unit of attention and space**. A dense interface succeeds when experienced users can scan, compare, navigate, and act faster without losing targetability, hierarchy, state clarity, or error resistance.

### Earn density from the task
Use higher density when users repeatedly compare many peer records, monitor state, triage queues, inspect structured data, or execute frequent operations where viewport capacity has real workflow value. Do not compress a low-information page merely to make it look professional or advanced.

Prefer removing low-value chrome before shrinking meaningful content. Reduce repeated labels, decorative containers, redundant descriptions, oversized empty space, and duplicated controls first. Compression should increase signal-to-noise, not simply decrease pixels.

### Density is multidimensional
Control density through separate variables rather than one global scale factor:
- row/component height;
- horizontal padding and column spacing;
- typography role and line height;
- amount of metadata shown by default;
- number and prominence of persistent actions;
- grouping and separators;
- disclosure depth;
- viewport width allocated to the work surface.

This matters because visual compactness and interaction target size are not equivalent. An icon can remain visually small while its interactive hit area is larger.

### Preserve hierarchy while compressing
Dense surfaces need **stronger information architecture, not more decoration**. Use alignment, stable columns, semantic typography, restrained separators, grouping, whitespace at section boundaries, and consistent status encoding so the eye can form chunks quickly.

Avoid giving every value a badge, card, border, icon, or accent color. Those devices consume visual bandwidth and flatten priority when repeated across hundreds of cells. Reserve high-salience treatments for states that materially change interpretation or action.

### Tables are a special density tool
Structured comparison is a legitimate reason to preserve a two-dimensional table rather than transforming every row into a card. USWDS explicitly treats scrollable tables as suitable for dense data and recommends minimizing columns where possible; on narrow screens, choose deliberately between preserving the table with horizontal scrolling and transforming records into a stacked representation according to the comparison task.

Carbon provides a useful production model rather than a universal sizing law: its current data table exposes row heights from 24px extra-small through 64px extra-large and explicitly assigns the smallest size to highly dense layouts. It keeps table header, toolbar, batch-action bar, and pagination sizing coordinated. The transferable principle is **density coherence**: related controls and data rhythm should change as a system rather than through isolated CSS overrides.

### Compact does not waive targetability
WCAG 2.2 SC 2.5.8 requires pointer targets at AA to be at least 24×24 CSS px or satisfy defined spacing/equivalent/inline/essential exceptions. The enhanced AAA criterion uses 44×44 CSS px. These are accessibility constraints, not a prescription that every visible row must be 44px tall.

A dense 24–32px row can therefore coexist with usable controls when hit areas, spacing, keyboard operation, and equivalent actions are designed deliberately. Conversely, a compact-looking toolbar full of adjacent tiny targets can fail even when the data itself remains readable. For frequent, destructive, edge-positioned, or sequential actions, larger targets may be warranted beyond minimum conformance.

### Offer density modes only when they solve a real split
Comfortable/compact modes are useful when the same product genuinely serves different interaction conditions or expertise levels. Atlassian's token documentation explicitly recognizes compact/cozy/comfortable views as possible non-color themes, supporting density as a systematic theme rather than scattered component exceptions.

Do not add a density preference merely because enterprise software often has one. A mode creates a testing matrix: every component, overflow state, focus treatment, dynamic label, localization case, and responsive transition must remain valid in each supported density.

If density is user-selectable, persist the preference at an appropriate scope and avoid silently changing semantic information between modes. If compact mode hides secondary metadata rather than merely changing spacing, describe and test that as information disclosure, not styling.

### Responsive density is task-preserving, not desktop miniaturization
On smaller viewports, ask which relationships must remain simultaneously comparable. Preserve those; progressively remove secondary columns/actions, move low-frequency operations into disclosure, or switch representations when row-by-row reading is more important than cross-column comparison.

Horizontal scrolling can be preferable to destroying table semantics for genuinely two-dimensional data. Stacking can be preferable for directory-like records where each row is independently consumed. Do not mechanically convert every desktop table into cards.

### Agent density contract
Before increasing density, verify:
1. the task benefits from seeing or manipulating more items simultaneously;
2. low-value chrome was removed before meaningful information was shrunk;
3. hierarchy remains obvious at scan speed;
4. interactive target size/spacing still meets the accessibility requirement independently of visual size;
5. compact controls remain keyboard-operable and focus-visible;
6. important statuses do not rely on color or tiny iconography alone;
7. truncation does not hide values needed for comparison or decisions;
8. narrow layouts preserve the task's critical comparison relationships;
9. any density modes are implemented as coherent system variants and regression-tested;
10. high-risk or frequent actions receive enough target area and separation for their consequence and use frequency.

### Evidence boundary
Carbon and Atlassian demonstrate mature production approaches to density variants and coordinated component sizing; USWDS supplies deployed guidance for dense/tabular information and small-screen representation; W3C establishes minimum pointer-target constraints. These sources support the architecture and accessibility boundaries above, but they do **not** prove one universally optimal row height, spacing scale, density mode, or information-per-screen target. Density should ultimately be validated against the product's real tasks, error rate, scan time, and user population.

## Data visualization: encode the question, not the chart-library default — 2026-10-10

A chart is useful when it makes a **comparison, trend, distribution, relationship, or spatial pattern** easier to see. It is not automatically superior to a number, short explanation, or table. Choose the visual encoding from the decision the reader needs to make, then design an equivalent path to the same information.

### Encoding and axis integrity
- **Bars/columns and filled areas encode magnitude by length/area**: start their quantitative baseline at zero. If small differences are the point, prefer a dot plot, slope chart, difference-from-reference view, or text rather than truncating bars.
- **Lines/scatterplots encode position and change**: a non-zero axis may reveal important variation, but can also exaggerate its apparent size. Label the full range and units clearly; include zero when meaningful and feasible; explicitly check the interpretation against a zero-based version. Keep scales consistent across comparable small multiples.
- Do not invent continuity across missing observations or irregular intervals. Annotate missingness and distinguish counts, rates, percentages, indexed values, and uncertainty.
- **Documented guideline conflict:** USWDS says line-chart origins should start at zero unless clearly noted; ONS permits cropped line/scatter axes when needed for clarity, while requiring zero for bars/areas. Resolve by encoding and user task, not a blanket rule. This is a design-judgment boundary, not evidence that all non-zero line axes are harmless.

### The three-layer accessibility contract
1. **Meaning:** a visible title/summary states the key comparison or finding, with measure, units, population, period, source, and caveats when material. The narrative must not claim a stronger conclusion than the data.
2. **Visual reading:** do not identify series or status by color alone. Use direct labels, markers, dash patterns, or text where legible. Check required chart marks against adjacent colors under WCAG 1.4.11 (normally 3:1 for graphics required to understand content); chart text is governed separately by text-contrast requirements. Test light/dark themes, zoom, color-vision differences, and `forced-colors`: SVG fill/stroke colors may be remapped and shadows removed. Avoid opting an entire chart out of forced colors merely to preserve brand colors.
3. **Nonvisual and interaction access:** provide a meaningful textual interpretation **and** underlying data in an accessible table/download where detail matters. A table alone does not convey the chart's narrative; a narrative alone does not permit exact-value inspection. For interactive charts, keyboard/touch/screen-reader users need the same meaningful filters, drilldowns, and comparisons without hover-only disclosure. Keep focus stable and announce material updates without flooding live regions.

**Implementation nuance:** USWDS examples intentionally use a screen-reader-accessible table and may hide the visual SVG from AT. Highcharts instead offers point-level keyboard/AT navigation **plus** a data-table option and warns that a table alone is insufficient. These are alternative architectures, not proof that every chart must expose every point as a focus stop. Choose based on complexity, task, and actual AT testing; never add hundreds of focus targets by default.

**Chart-library accessibility traps (rechecked 2026-10-22):** An accessible *name* is not an explorable *dataset*. [Chart.js](https://www.chartjs.org/docs/latest/general/accessibility.html) renders marks in canvas, which are not exposed to screen readers: `role="img"`/`aria-label` names the graphic but does not expose individual values. [Highcharts](https://www.highcharts.com/docs/accessibility/accessibility-module) adds point navigation/descriptions **when its Accessibility module is loaded**; its [data-table view](https://www.highcharts.com/docs/accessibility/tables) additionally needs exporting/export-data modules. A table does not replace the chart's interpretation. [Datawrapper](https://www.datawrapper.de/academy/how-we-make-sure-our-charts-maps-and-tables-are-accessible) says custom alternative text **replaces** automatic chart-body information: the body, including annotations, becomes `aria-hidden`. It separately documents a keyboard chart explorer; test the actual embed rather than assuming custom alt either preserves or removes that explorer. [W3C's complex-image guidance](https://www.w3.org/WAI/tutorials/images/complex/) warns that `aria-describedby` flattens referenced headings/tables into a single description, losing structural navigation. Put exact values and relationships in a **separately navigable** semantic table/long description, not just a giant ARIA description.

**Agent acceptance test:** With the deployed embed and target screen reader, check discoverable takeaway, keyboard access to series/points **or an equivalent data path**, annotations and units, missing values, filter/drilldown parity, updated-data announcements, and focus/reading order when switching to the table. Test custom-alt on/off and accessibility-module loaded/unloaded; automated name/contrast audits alone cannot certify parity. These are source-documented mechanics and falsifiable checks, not measured comparative user outcomes.

### Progressive disclosure and QA for agents
- Default to a useful static view. Add filters, zoom, animation, brushing, or tooltips only when they enable a real task; ONS warns that interactive complexity can obscure the main finding. Motion must not be the sole way to perceive changes.
- For dashboards, separate the **headline insight** from detailed exploration. Provide a readable table or drilldown for exact values, not tiny labels squeezed into the plot.
- Test with realistic outliers, zero/negative values, missing periods, long category names, narrow screens, zoom, keyboard-only and touch use, screen readers, forced colors, and updates after filters. Confirm that summaries, axes, legends, data tables and exports remain synchronized with the same filtered data.

**Evidence boundary:** W3C supplies normative color/contrast requirements; ONS and USWDS provide mature but sometimes differing public-sector design guidance; Highcharts documents one library's capabilities, not a universal outcome benchmark. No controlled evidence here establishes that a specific charting library or level of interactivity improves task success. Next test: matched static vs interactive views with comprehension, exact-value retrieval, errors, and assistive-technology coverage.

**Primary sources:** [ONS axes and gridlines](https://service-manual.ons.gov.uk/data-visualisation/guidance/axes-and-gridlines), [ONS interactive charts](https://service-manual.ons.gov.uk/data-visualisation/guidance/interactive-charts-and-animations), [USWDS data visualizations](https://designsystem.digital.gov/components/data-visualizations/), [W3C use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color), [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast), [Highcharts accessibility](https://www.highcharts.com/docs/accessibility/accessibility-module), [Highcharts tables](https://www.highcharts.com/docs/accessibility/tables), [MDN forced colors](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors).

## Dark themes: semantic polarity, contrast, and forced colors — 2026-10-15

**Decision:** dark mode is a separate **semantic color mapping and tested reading condition**, not an RGB inversion or proof of superior accessibility. Respect system preference by default; a product-level light/dark/system override can be useful for cross-device workflows, but adds preference persistence and QA cost. Apple generally discourages app-specific appearance controls, while Carbon encourages them: choose from product context, not a universal mandate.

### Build roles and pairs, not an inverted palette

- Define roles for **canvas/surface, raised or container surface, primary/secondary text, link, focus, border, control, status, and data series**. Assign light/dark values to the same roles; do not invert photos, brand assets, data colors, or shadows mechanically. Material 3's `surface`/`surface-container`/`on-surface` pairings and Carbon's themed tokens are concrete examples, not mandatory palette recipes.
- Test **foreground/background pairs in the rendered context**, including hover, selected, disabled, focus, error, text over imagery, and nested overlays. A token that passes on one surface may fail on another, especially with transparency, dynamic color, or compositing. Preserve hierarchy without relying on barely different charcoal layers; outlines, spacing and labels can carry structure.
- WCAG 2.2 AA still requires **4.5:1 for ordinary text, 3:1 for large text**, and **3:1 for essential non-text UI/graphic information**, subject to each criterion's exceptions. Passing a ratio does not establish comfortable reading, and disabled controls are exempt from those specific contrast checks, not from being understandable in context. Do not promote APCA's polarity-sensitive `Lc` recommendations as WCAG conformance: the **10 September 2026 WCAG 3 working draft has not chosen its contrast algorithm**.
- Do not assert “dark is easier to read” or “light is always better.” Some controlled proofreading studies favor dark text on light backgrounds; another found that advantage disappeared after equalizing overall display luminance. Task, ambient conditions, vision, font rendering and user preference matter. For long-form reading, measure comprehension, speed and fatigue rather than choosing from aesthetics alone.

### Web implementation contract

`prefers-color-scheme` expresses a user/browser preference; `color-scheme` declares which schemes an element supports so browser-painted controls, scrollbars and form widgets can adapt. They are **not interchangeable**. `light-dark()` can select paired tokens when the used `color-scheme` is set. Example (use actual reviewed accessible token pairs, not the illustrative names as validated colors):

```css
:root { color-scheme: light dark; }
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"] { color-scheme: dark; }
:root {
  --surface: light-dark(var(--surface-light), var(--surface-dark));
  --text: light-dark(var(--text-light), var(--text-dark));
}
body { background: var(--surface); color: var(--text); }
```

Provide a usable default for older target browsers if `light-dark()` is unsupported. If offering a manual override, model **system/light/dark** distinctly; initialize it before first paint where practical to avoid a wrong-theme flash, avoid hydration mismatch, and update `color-scheme` as well as custom tokens. Do not let a stored preference silently override forced-colors accessibility settings.

### High-contrast is not merely a third dark palette

In `forced-colors: active`, the browser substitutes system colors for many foreground/background/border properties, removes `box-shadow` and many gradients, and may add text backplates. A button outlined **only** by shadow can disappear. Keep native control semantics, use a real border/outline or appropriate system colors where needed, and avoid broad `forced-color-adjust: none` (it disables essential overrides). ARIA `role="button"` on a `div` does **not** grant native button system-color behavior. `prefers-contrast: more` and forced colors are distinct signals; test them separately.

### Agent QA gate

Test light, dark, OS-auto switching **while the app is open**, optional manual override, high contrast/forced colors, increased contrast, zoom/text spacing, transparent overlays, disabled/focus/selection states, SVGs, images with white backdrops, charts, and embedded widgets. Include at least one long reading task and one dense-data task. Run contrast checks on actual rendered combinations and inspect focus and system-color behavior; screenshots and automated ratios alone cannot establish legibility or preference.

**Evidence boundary:** W3C/MDN define conformance and browser behavior; Apple, Material 3 and Carbon offer competing but valid platform/system conventions; display-polarity studies are task- and luminance-dependent. No controlled evidence here establishes a universal preferred theme or a single dark-surface luminance. Sources: [Apple Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode), [Material 3 color roles](https://m3.material.io/styles/color/the-color-system), [Carbon color guidelines](https://www.carbondesignsystem.com/building-blocks/foundations/color/guidelines), [MDN color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme), [MDN light-dark](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark), [MDN forced colors](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors), [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum), [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast), [WCAG 3 September 2026 draft](https://www.w3.org/TR/2026/WD-wcag-3.0-20260910/), [Buchner & Baumgartner 2007](https://pubmed.ncbi.nlm.nih.gov/17510822/), [Buchner et al. 2009](https://pubmed.ncbi.nlm.nih.gov/19562598/).

## Research queue
Editorial composition; expressive typography; variable fonts; image-led interfaces; 3D/shader aesthetics; texture/materiality; dark-interface readability; multilingual typography and script-specific behavior; measured density outcomes and adaptive density.
