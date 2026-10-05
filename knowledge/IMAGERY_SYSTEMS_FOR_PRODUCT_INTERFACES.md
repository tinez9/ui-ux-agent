# Imagery Systems for Product Interfaces

## Core rule
Choose imagery by the job it performs, not by aesthetic preference. An image earns space when it improves **recognition, explanation, evidence, comparison, orientation, or product identity**. If removing it leaves comprehension, trust, navigation, and identity materially unchanged, treat it as decoration and question its cost.

## Start with purpose, then medium

| User need | Strong default | Why | Common failure |
|---|---|---|---|
| Recognize a real person/place/object | Photography | Preserves real-world appearance and evidence | Generic stock photography that signals a category but proves nothing |
| Understand a concept or process | Diagram / explanatory illustration | Can select only the relationships that matter | Decorative illustration that implies explanation without carrying information |
| Learn a product workflow | Current UI screenshot, annotated screenshot, or live demo | Shows the actual interface and state | Marketing mockups that no longer match the shipped UI |
| Compare quantitative structure | Chart / data visualization plus accessible data/description | Encodes relationships compactly | Raster chart with no textual/data equivalent |
| Establish a distinctive expressive world | Illustration, art direction, selective photography, or renders | Can carry repeatable brand signatures | Mixing unrelated visual styles or using imagery as filler |
| Show a physical/digital object unavailable to photograph | Render | Controlled viewpoint and material emphasis | Render presented as documentary evidence when it is synthetic |

Do not assume one medium is inherently more premium. Fidelity to purpose is more important than medium.

## Meaning classification is contextual
W3C's image guidance is useful as a design taxonomy, not merely an `alt`-text checklist. Classify each placed image in its actual context:

- **Informative:** contributes information not otherwise available. Preserve the essential meaning in a text alternative or nearby equivalent.
- **Functional:** is part of a control/link. Describe the function or destination, not its pixels.
- **Complex:** carries relationships/data that cannot fit in a short phrase. Provide a short identification plus an accessible detailed equivalent; structured data may be more useful than a long prose dump.
- **Decorative/redundant:** contributes no additional information or function. Keep it out of the accessibility tree (`alt=""` for an HTML image) rather than narrating visual noise.

The same asset can move between categories when its purpose changes. A product photograph can be evidence on a product detail page and atmosphere on a campaign page. Therefore agents must infer **communication intent**, not generate alt text from pixels alone.

## An imagery system is a policy, not an asset folder
Define enough constraints that independently produced assets still belong to one product:

1. **Roles:** hero, evidence, instructional, thumbnail, avatar, editorial, empty-state, background, etc.
2. **Subject policy:** what deserves imagery; what should stay text/UI.
3. **Medium policy:** when photography, illustration, screenshots, diagrams, renders, or generated art are appropriate.
4. **Framing:** crop logic, subject scale, camera/viewpoint, negative space, focal point.
5. **Treatment:** color/tonal behavior, background handling, corner treatment only where structurally justified, overlays, captions.
6. **Aspect-ratio families:** derive from content roles and layouts rather than creating arbitrary ratios per screen.
7. **Responsive focal behavior:** define what may crop, what must remain visible, and when to switch composition/asset instead of shrinking it.
8. **Fallback:** specify what happens when an asset is absent, slow, low quality, or unsuitable. Do not let a missing hero collapse hierarchy.
9. **Provenance:** for evidence-sensitive or generated imagery, retain source/rights/origin metadata where product trust requires it.
10. **Accessibility contract:** classification, text alternative/long equivalent, contrast where graphics convey meaning, and avoidance of essential text baked into imagery.

## Crop by semantic loss, not container convenience
Before using `object-fit: cover`, identify the image's **must-survive region**. Cropping is safe only when discarded regions are nonessential. Faces, products, annotations, chart axes, UI controls, labels, and evidence details may make aggressive cover-cropping invalid.

For responsive layouts:
- use focal positioning for flexible editorial photography;
- use art-directed alternate crops when composition needs genuinely change;
- preserve complete screenshots/diagrams when cropping would falsify or remove meaning;
- prefer a different representation over making dense explanatory imagery unreadably small.

## Screenshots are evidence with a decay rate
Screenshots are strong when the exact interface is the subject, but they become stale as the product changes. Store the product/version/date or capture context when accuracy matters. Prefer annotations outside the pixels when possible so labels remain editable, localizable, accessible, and resilient to crop changes.

Do not use screenshots as decorative texture when they imply capabilities the current product does not have.

## Generated imagery: separate expression from evidence
Generated imagery is most defensible in expressive roles where synthetic authorship does not misrepresent reality. Apply stricter provenance and review when imagery could be interpreted as:
- documentary evidence;
- a real person, place, event, result, product state, or customer;
- a factual diagram or instructional step;
- a representation whose inaccuracies could change a decision.

A visually convincing generated asset is not automatically an accurate asset. For factual graphics, verify the underlying information independently and make the information available outside the image.

## Accessibility is part of the content model
W3C explicitly bases text alternatives on **purpose and context**. This has a workflow consequence: a coding agent cannot reliably derive accessibility semantics from an asset alone. The design/content specification should carry the image role and intended message.

For complex diagrams/charts, a giant `alt` string is usually the wrong architecture. Use a short identifier and expose the essential detail in nearby structured content or a discoverable long description. W3C notes that `aria-describedby` flattens referenced structured content for assistive technologies, so headings/tables needed for understanding are better exposed as normal structured content.

## Decision test for agents
Before adding or replacing imagery, answer:
1. What user job does this image perform?
2. What information or identity signal disappears if it is removed?
3. Is this the lowest-complexity medium that performs that job?
4. What must survive cropping and responsive change?
5. Is the image evidence, explanation, identity, or decoration?
6. What is its accessible equivalent?
7. Can it become stale or misleading?
8. What happens when it fails to load or is unavailable?
9. Does it belong to the product's existing imagery grammar?

If these questions have no meaningful answers, do not add imagery merely to fill space.

## Failure modes
- **Stock-photo substitution:** category-relevant but product-irrelevant imagery consumes attention without increasing understanding or trust.
- **Illustration as camouflage:** decorative art is used to make an undifferentiated product feel distinctive while interaction/composition remain generic.
- **Screenshot wallpaper:** real UI is shrunk/cropped until it is unreadable, retaining visual complexity but losing instructional value.
- **Card-thumbnail reflex:** every item receives imagery despite image quality/meaning varying wildly, creating noise and layout dependency.
- **One crop everywhere:** a single source composition is forced through incompatible aspect ratios.
- **Alt-by-vision-model:** literal pixel descriptions replace the contextual meaning/function users need.
- **Rasterized explanation:** labels, data, or instructions exist only inside pixels, harming zoom, localization, search, maintenance, and accessibility.
- **Synthetic evidence ambiguity:** generated imagery looks documentary without adequate contextual honesty.
- **Style collage:** photography, 3D, line illustration, gradients, and AI art coexist without role boundaries.

## Evidence boundaries
- W3C provides normative/accessibility-oriented guidance for informative, functional, decorative, and complex images and strongly supports purpose/context-based classification.
- Apple explicitly prefers illustration over photography for **app icons** because photos lose useful detail across appearances, small sizes, and layered presentation. This is a scoped platform rule, not evidence that illustration is generally superior to photography in product interfaces.
- The medium-selection matrix, imagery-system fields, semantic-crop test, and generated-imagery evidence distinction above are agent synthesis from these constraints and product-design reasoning. They should be validated against real product tasks rather than treated as measured universal UX outcomes.

## Sources
- W3C WAI, Images Tutorial: https://www.w3.org/WAI/tutorials/images/
- W3C WAI, Informative Images: https://www.w3.org/WAI/tutorials/images/informative/
- W3C WAI, Decorative Images: https://www.w3.org/WAI/tutorials/images/decorative/
- W3C WAI, Complex Images: https://www.w3.org/WAI/tutorials/images/complex/
- W3C WAI, Alt Decision Tree: https://www.w3.org/WAI/tutorials/images/decision-tree/
- Apple Human Interface Guidelines, App icons: https://developer.apple.com/design/human-interface-guidelines/app-icons/
