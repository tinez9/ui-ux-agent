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

## Research queue
Editorial composition; high-density product interfaces; expressive typography; variable fonts; image-led interfaces; 3D/shader aesthetics; texture/materiality; dark-interface readability; multilingual typography and script-specific behavior.
