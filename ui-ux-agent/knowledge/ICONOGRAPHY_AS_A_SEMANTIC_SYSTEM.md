# Iconography as a Semantic System

## Core rule
Treat icons as **semantic compression**, not decoration. An icon earns an unlabeled control only when its meaning is sufficiently familiar or made obvious by context; otherwise pair it with text. Space saved by removing labels is not a UX win if users must guess.

## Decide icon, text, or both by ambiguity

| Situation | Strong default | Why |
|---|---|---|
| Primary or consequential action | Text, often with optional icon | The action should be explicit before commitment |
| Unfamiliar, product-specific, or abstract concept | Text + optional icon | A custom metaphor cannot be assumed learned |
| Familiar utility in a constrained context | Icon-only can be valid | Context plus convention may make the action predictable |
| Dense expert toolbar | Familiar icon-only + tooltip + accessible name | Compression can support scanning once commands are learned |
| Navigation whose categories are not universally symbolic | Persistent text, optionally with icon | Navigation is orientation infrastructure, not an icon-recognition test |
| State/status | Text or icon + text when ambiguity matters | Color or shape alone may not communicate meaning robustly |

This is a decision model, not a claim that every primary action requires text or every toolbar may omit it.

## Icon-only controls require three kinds of clarity
An icon-only control is acceptable only when all three are strong:

1. **Semantic clarity:** the metaphor is recognizable in this product/culture.
2. **Contextual clarity:** placement and surrounding content narrow the plausible meaning.
3. **Programmatic clarity:** the interactive element has a useful accessible name.

W3C's design-system guidance explicitly notes that icons accompanied by text are less ambiguous. When an icon has no visible label, provide an accessible text name. Fluent likewise permits icon labels in dense toolbars as a space-saving measure only when icons are familiar, and calls for tooltips for visual users plus accessible names for screen-reader users.

Do not use `aria-label` to rescue a visually cryptic control and then call the design understandable. Programmatic naming solves assistive-technology exposure; it does not make an unfamiliar symbol self-explanatory to sighted users.

## Build one semantic registry
Treat icon use as a mapping, not a per-screen illustration choice:

`canonical action/concept -> icon metaphor -> visible label -> accessible name -> state variants -> RTL/localization behavior`

For repeated functionality, keep the metaphor and naming stable. W3C consistency guidance explains why: learned functionality becomes easier to find again when components and text alternatives are identified consistently.

Prefer literal, stable metaphors over clever reinterpretations. Fluent's system icons are named for the represented shape/object rather than an inferred function (`shield`, not `security`), which is a useful governance distinction: the asset describes its visual metaphor while product copy defines what that metaphor means in context.

## Icon family consistency is functional
A coherent family reduces accidental salience and makes state changes interpretable. Specify:

- base grid / supported rendered sizes;
- stroke or fill strategy;
- corner and terminal behavior;
- optical weight relative to adjacent type;
- bounding-box and baseline alignment;
- selected/active treatment;
- disabled and high-contrast behavior;
- whether color is semantic or merely decorative;
- permitted modifiers/badges;
- RTL mirroring policy.

Do not scale one vector mechanically across every size and assume it remains equally legible. Fluent ships regular/filled themes for different emphasis and recommends size-specific assets/usage rather than arbitrary scaling. Treat this as production-system evidence, not a universal pixel recipe.

## State must not depend on a tiny glyph mutation
Selected, active, expanded, muted, synced, warning, and destructive states need perceivable differences. A subtle fill/stroke swap may work as reinforcement but can be too weak as the only state signal.

For toggle buttons, expose the state programmatically (`aria-pressed` where appropriate) and keep the accessible name stable around the action/concept rather than renaming it unpredictably on every state change. State and label are different pieces of information.

## Tooltips are explanation, not the primary interaction contract
Tooltips can make compact expert surfaces recoverable, but they have costs:
- they are delayed rather than persistently scannable;
- hover does not exist on touch;
- users must inspect controls one by one;
- they do not make a weak metaphor strong.

Use them as a secondary label for icon-only controls, not as justification for hiding text everywhere. For frequent novice-facing or consequential actions, persistent text is usually the safer default.

## Accessibility implementation
For a button or link with visible text plus a decorative SVG, hide the SVG from assistive technology (`aria-hidden="true"`, and where needed `focusable="false"`) so the text names the control once.

For icon-only controls, put the accessible name on the **interactive element**, not on a decorative child path. W3C ACT rules require buttons included in the accessibility tree to have a non-empty accessible name.

When visible text exists, keep the accessible name consistent with that visible label. Do not make a visible `Save` button announce an unrelated synonym merely because an icon or implementation abstraction uses another term.

If an SVG itself conveys standalone content rather than acting as a control decoration, treat it as meaningful imagery and give the graphic appropriate semantics; that is a different case from an icon inside a labeled button.

## RTL and cultural semantics
Do not mirror every icon. Mirror icons whose meaning depends on physical direction in the interface (for example, directional navigation where platform conventions require it). Do not automatically mirror symbols whose identity is intrinsically directional, branded, textual, or culturally fixed.

Validate metaphors that rely on culturally specific objects or gestures. Fluent explicitly warns that symbols can carry different cultural connotations. Localization review is therefore part of icon governance, not merely translation of adjacent labels.

## Anti-generic guidance for AI agents
AI-generated interfaces often accumulate icons because they make rows and cards look "designed." Apply an **icon deletion pass**:

1. Remove icons that repeat adjacent text without improving scanning, grouping, state recognition, or identity.
2. Remove decorative icons from headings/cards when they create a repetitive badge-card grammar.
3. Reintroduce only icons with a clear semantic or navigational job.
4. Prefer one coherent family over mixing libraries to find superficially perfect metaphors.
5. Do not invent custom metaphors merely to appear distinctive; differentiation should not tax recognition.

Distinctive iconography can live in visual execution while preserving conventional meaning. Change style more freely than semantics.

## Review test
For every icon in a representative flow, ask:
1. What concept/action does it encode?
2. Would a first-time user know that without inspecting a tooltip?
3. If the label disappeared, is ambiguity acceptable in this context?
4. If the icon disappeared, does adjacent text already do all useful work?
5. Is the same concept represented consistently elsewhere?
6. Does state remain clear without color alone or a tiny stroke change?
7. Does the interactive element have the correct accessible name/state?
8. Does the metaphor survive localization and RTL?
9. Is this icon from the intended family at an intended size?

## Failure modes
- **Icon confetti:** every heading, card, metric, and row gets a glyph with no semantic gain.
- **Mystery toolbar:** many compact controls save pixels but force serial tooltip exploration.
- **Metaphor drift:** the same icon means different things, or the same action uses different icons across screens.
- **Library collage:** mixed stroke widths, optical weights, corner styles, and bounding boxes create visual noise.
- **ARIA camouflage:** a cryptic icon has an accessible name, so the visible ambiguity is incorrectly considered solved.
- **Color-only semantics:** success/warning/selection is carried only by icon color.
- **Tiny-state mutation:** active state is only a subtle regular-to-filled change that is hard to perceive.
- **Blind mirroring:** all directional-looking symbols flip in RTL regardless of semantic meaning.
- **Novelty tax:** a custom metaphor replaces a familiar one only to make the interface look original.

## Evidence boundaries
- W3C establishes accessible naming requirements for buttons and recommends visible text with icons as a less ambiguous pattern; its current WCAG 3 support material also favors persistent visible names, but that material is explicitly draft and must not be treated as a finalized conformance requirement.
- Apple documents that labels help people understand context and what they can do next, while also allowing symbol-only square buttons when proximity to a specific view makes purpose clear. This is useful evidence against both extremes: neither "always label icons" nor "icons are self-explanatory" is universally correct.
- Microsoft Fluent provides mature production-system guidance for literal metaphors, regular/filled variants, dense toolbar icon labels, cultural validation, and controlled modifiers. It is implementation/design-system evidence, not controlled proof that one icon style improves task success.
- The three-clarity test, semantic registry, icon-deletion pass, and anti-generic rules are agent synthesis from these constraints. Validate them against actual product tasks and user populations.

## Sources
- W3C Design System, SVG icons: https://design-system.w3.org/styles/svg-icons.html
- W3C WAI ACT, Button has non-empty accessible name: https://www.w3.org/WAI/standards-guidelines/act/rules/97a4e1/
- W3C WAI, ARIA Authoring Practices — Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- W3C WCAG 3 support material (draft), Consistent navigation labels: https://www.w3.org/WAI/WCAG3/informative/consistency-across-views/consistency/consistent-navigation-labels/
- Apple Human Interface Guidelines, Labels: https://developer.apple.com/design/human-interface-guidelines/labels
- Apple Human Interface Guidelines, Buttons: https://developer.apple.com/design/human-interface-guidelines/buttons
- Microsoft Fluent 2, Iconography: https://fluent2.microsoft.design/iconography/
- Microsoft Fluent 2, Toolbar: https://fluent2.microsoft.design/components/web/react/core/toolbar/usage/
