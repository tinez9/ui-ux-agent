# Native overlay primitives: popover, dialog, inertness, and positioning

**Last researched:** 2026-10-06

## Decision rule

Choose the primitive from the interaction contract, not from floating appearance.

- Use **Popover API** for non-modal top-layer UI that leaves surrounding content interactive: action menus, pickers, teaching UI, contextual controls.
- Use **`<dialog>.showModal()`** when the rest of the document must become unavailable until the dialog is resolved or dismissed.
- A **`<dialog popover>`** can provide dialog semantics without modality. `dialog` semantics, top-layer rendering, and modality are separate decisions.
- Tooltips are not automatically interactive popovers; hover/focus disclosures have different persistence and input requirements.

A useful decomposition is:

`overlay contract = modality + semantics + dismissal + invoker/focus relationship + stacking/nesting + positioning`

## Native ownership: do not rebuild what the platform already owns

As of 2026, Popover API is interoperable across current major engines; web.dev dates Baseline availability to **2025-01-27**, after a Safari/iOS light-dismiss bug delayed the earlier claim.

With declarative `button[popovertarget]`, the platform establishes an invoker relationship. Current MDN documentation describes useful consequences: the open popover participates in sequential focus navigation relative to its invoker and assistive technology receives implicit expanded/details relationships. Prefer this relationship when it matches the workflow rather than replacing it with unrelated click handlers plus `showPopover()`.

`popover="auto"` provides light dismiss and peer-closing behavior, with defined nesting. `manual` deliberately removes light dismiss and allows independent peers. `hint` has a separate lightweight stack. These modes are interaction behavior, not styling variants.

For modal dialogs, the platform now owns more than a focus trap. W3C's HTML technique H102 documents that a modal `<dialog>` opened with `showModal()` makes outside page content inert, limits keyboard focus to the dialog/browser chrome, supports Escape dismissal, and restores focus to the invoker when it remains available. Start from that native contract before adding framework focus management.

## `inert` is an interaction boundary, not an ARIA visibility hack

The HTML `inert` attribute is widely available across browsers (MDN: Baseline since April 2023). An inert subtree and its flat-tree descendants cannot receive focus or click interaction and are excluded from the accessibility tree; browser find-in-page and text selection can also be affected.

This makes `inert` appropriate when a whole region must genuinely become unavailable, but it is broader than `aria-hidden` and broader than disabling individual form controls.

### Do not substitute `aria-hidden` for inertness

`aria-hidden="true"` removes content from the accessibility tree but does not itself prevent keyboard focus. W3C's ACT rule explicitly treats focusable descendants inside `aria-hidden="true"` as a failure condition because keyboard users can reach content that assistive technology is told does not exist.

Therefore:

- use native modal `<dialog>` when the requirement is modal-dialog behavior;
- use `inert` when a non-dialog application state intentionally makes an entire region unavailable;
- use `disabled` for individual controls where disabled semantics are the actual state;
- use `aria-hidden` only for accessibility-tree visibility, not as a focus-management primitive.

Do not layer `aria-hidden`, manual `tabindex=-1` sweeps, pointer-event blocking, and a custom focus trap merely to imitate a modal that `showModal()` already provides.

### Inertness needs a perceptible state

`inert` has no required visual appearance. MDN warns that authors must make active versus inert regions understandable; this matters especially under zoom or when only part of the viewport is visible. A visually normal region that silently stops responding is a UX failure even if its DOM state is technically correct.

Also avoid applying `inert` to broad application roots casually: because it suppresses focus, AT exposure, find-in-page, selection, and editing, it can disable more capability than the feature intended. A modal `<dialog>` shown with `showModal()` escapes ancestor inertness by platform design; ordinary descendants do not.

## Focus guidance

Do not add a custom focus trap to a non-modal popover. That creates accidental quasi-modality while leaving the surrounding page technically active.

For declaratively invoked popovers, test browser-provided navigation before adding manual focus movement. Use `autofocus` only when immediate focus transfer is the intended workflow; HTML supports it when a dialog or popover is shown.

For modal dialogs, rely on native modal behavior first. Add product-specific initial-focus/restoration policy only when the workflow requires it. Avoid two independent owners—native restoration plus a framework effect—competing after close.

When testing overlays, also check WCAG 2.2 Focus Not Obscured: an overlay can be non-modal and still create a failure if author-created content completely hides the currently focused component without an applicable exception.

## CSS Anchor Positioning vs JavaScript positioning

As of October 2026, core CSS Anchor Positioning is broadly usable, but subfeatures have different interoperability dates. MDN marks `position-try-fallbacks` Baseline since January 2026, `position-try-order` since February 2026, and the current `position-anchor` feature set since September 2026.

For ordinary element-anchored overlays, prefer native CSS when the contract is:

`real DOM anchor + preferred placement + finite fallback placements + optional size relation + visibility rule`

The platform provides `anchor-name`/`position-anchor`, `position-area`, `anchor()`/`anchor-size()`, fallback placements, space-based try ordering, conditional visibility, and anchored container queries.

Two important limits remain:

1. **Fallback placement is not arbitrary collision solving.** If no declared try option fits, CSS can return to an overflowing original placement. Deliberately enumerate acceptable placements and test corners, zoom, large content, and nested scrolling.
2. **Repeated anchors need scoping.** Reusing an `anchor-name` without `anchor-scope` can bind a positioned element to another component instance.

### When a positioning library still earns its cost

A library such as Floating UI remains justified for requirements such as:

- virtual references (pointer coordinates, selections/ranges, custom client rects);
- custom clipping/root boundaries;
- shift/sliding behavior beyond finite placement alternatives;
- middleware-driven geometry and custom collision policy;
- coordinated updates for scroll, resize, layout shift, and element resize;
- framework utilities already relied on by the product.

`autoUpdate()` should exist only while the floating element is mounted/open; Floating UI warns that leaving observers/listeners active unnecessarily can cause severe performance degradation.

Treat **overlay behavior** and **overlay geometry** as separate dependency decisions. Native popover/dialog may own top-layer, dismissal and focus semantics while CSS owns geometry. Retain JavaScript only for requirements the platform does not express adequately for the supported browser matrix.

## Testing matrix

Rendered tests should verify behavior rather than only attributes:

- pointer and keyboard opening;
- Tab/Shift+Tab continuity;
- Escape/platform close and outside-click behavior;
- focus after dismissal;
- nested and sibling overlays;
- modal outside-content inertness;
- no focusable descendants hidden only with `aria-hidden`;
- visual indication when application regions are deliberately inert;
- accessible widget role/name/state inside the overlay;
- focus is not unexpectedly obscured;
- zoom/reflow and viewport-edge placement;
- every declared anchor fallback;
- repeated components bind to their own anchors;
- scroll/clipping in real nested containers;
- actual supported-browser fallback policy.

Popover itself is not sufficient semantics for a menu, listbox, tooltip, dialog, or combobox. Overlay mechanism and widget semantics remain separate layers.

## Failure modes

- **Popover + custom focus trap:** accidental quasi-modality.
- **`aria-hidden` as modal background management:** can leave hidden-from-AT content keyboard-focusable.
- **Manual `tabindex` sweeps instead of native modal behavior:** brittle under dynamic descendants and framework updates.
- **`inert` with no visual/product cue:** technically unavailable content still looks actionable.
- **Over-broad `inert`:** suppresses focus, AT exposure, search, selection, and editing beyond the intended interaction boundary.
- **Custom fixed overlay for every case:** unnecessarily rebuilds top-layer, dismiss, stacking, focus, and AT relationships.
- **`<dialog>` because it merely looks dialog-like:** can add semantics/modality the workflow does not need.
- **`popover="manual"` by default:** silently removes light dismiss and peer closing.
- **Programmatic opening with no invoker relationship:** can lose platform navigation/relationship benefits.
- **One happy-path anchor placement:** collision behavior does not appear automatically.
- **Global repeated anchor names:** overlays can attach to the wrong instance.
- **Removing Floating UI despite virtual/custom-boundary needs:** replaces a tested geometry engine with bespoke code.
- **Keeping `autoUpdate()` alive while closed:** retains unnecessary observers/listeners.

## Evidence boundary

Platform and W3C documentation establish behavior, accessibility requirements, and interoperability—not that native overlays always outperform mature component libraries. Floating UI documentation establishes capability and lifecycle costs—not that every product needs them. No comparative outcome study justifies a universal “native always wins” rule. The durable rule is narrower: **start from native interaction, inertness, and geometry contracts; add custom machinery only for product requirements the platform does not satisfy.**

## Sources

- MDN, *Using the Popover API*: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using
- MDN, *Popover API*: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
- MDN, *`<dialog>`*: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
- W3C WAI, *H102: Creating modal dialogs with the HTML dialog element*: https://www.w3.org/WAI/WCAG22/Techniques/html/H102
- MDN, *`inert` HTML global attribute*: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert
- W3C WAI ACT, *Element with aria-hidden has no content in sequential focus navigation*: https://www.w3.org/WAI/standards-guidelines/act/rules/6cfa84/
- W3C WAI, *Understanding SC 2.4.11 Focus Not Obscured (Minimum)*: https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum
- WHATWG HTML, *Interaction / autofocus*: https://html.spec.whatwg.org/dev/interaction.html
- web.dev, *The Popover API is now Baseline Newly available* (2025-02-07): https://web.dev/blog/popover-baseline
- web.dev, *`<dialog>` and popover: Baseline layered UI patterns*: https://web.dev/articles/baseline-in-action-dialog-popover
- Open UI, *Invoker Commands explainer*: https://open-ui.org/components/invokers.explainer/
- MDN, *Using CSS anchor positioning*: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using
- MDN, *Fallback options and conditional hiding for overflow*: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Try_options_hiding
- MDN, *`position-try-fallbacks`*: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-try-fallbacks
- MDN, *`position-try-order`*: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-try-order
- MDN, *`position-anchor`*: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-anchor
- Floating UI, *computePosition*: https://floating-ui.com/docs/computeposition
- Floating UI, *detectOverflow*: https://floating-ui.com/docs/detectoverflow
- Floating UI, *Virtual Elements*: https://floating-ui.com/docs/virtual-elements
- Floating UI, *autoUpdate*: https://floating-ui.com/docs/autoupdate
