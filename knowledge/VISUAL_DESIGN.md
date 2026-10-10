# Visual Design

Operational knowledge about typography, composition, color, imagery, iconography, depth, texture, and responsive art direction.

## Research lens
For each visual pattern distinguish aesthetic signal, product-category fit, brand fit, readability/usability effect, implementation cost, accessibility risk, and trend maturity.

## Initial principles
- Typography is structural: size, weight, measure, line height, spacing, contrast, and rhythm matter together.
- Composition should reveal priority rather than flatten hierarchy into decorative grids.
- Color needs semantic roles separate from brand expression.
- Distinctiveness is strongest when it emerges from a coherent system rather than one fashionable effect.

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

### Progressive disclosure and QA for agents
- Default to a useful static view. Add filters, zoom, animation, brushing, or tooltips only when they enable a real task; ONS warns that interactive complexity can obscure the main finding. Motion must not be the sole way to perceive changes.
- For dashboards, separate the **headline insight** from detailed exploration. Provide a readable table or drilldown for exact values, not tiny labels squeezed into the plot.
- Test with realistic outliers, zero/negative values, missing periods, long category names, narrow screens, zoom, keyboard-only and touch use, screen readers, forced colors, and updates after filters. Confirm that summaries, axes, legends, data tables and exports remain synchronized with the same filtered data.

**Evidence boundary:** W3C supplies normative color/contrast requirements; ONS and USWDS provide mature but sometimes differing public-sector design guidance; Highcharts documents one library's capabilities, not a universal outcome benchmark. No controlled evidence here establishes that a specific charting library or level of interactivity improves task success. Next test: matched static vs interactive views with comprehension, exact-value retrieval, errors, and assistive-technology coverage.

**Primary sources:** [ONS axes and gridlines](https://service-manual.ons.gov.uk/data-visualisation/guidance/axes-and-gridlines), [ONS interactive charts](https://service-manual.ons.gov.uk/data-visualisation/guidance/interactive-charts-and-animations), [USWDS data visualizations](https://designsystem.digital.gov/components/data-visualizations/), [W3C use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color), [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast), [Highcharts accessibility](https://www.highcharts.com/docs/accessibility/accessibility-module), [Highcharts tables](https://www.highcharts.com/docs/accessibility/tables), [MDN forced colors](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors).

## Research queue
Editorial composition; expressive typography; variable fonts; image-led interfaces; 3D/shader aesthetics; texture/materiality; dark-interface readability; multilingual typography and script-specific behavior; measured density outcomes and adaptive density.
