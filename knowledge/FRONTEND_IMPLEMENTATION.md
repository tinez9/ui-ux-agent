# Frontend Implementation

Translate design intelligence into implementable frontend behavior.

## Principle
Keep durable design guidance separate from fast-changing framework details.

Prefer the lowest-complexity platform primitive that preserves the required semantics, accessibility, resilience, and interaction quality. A newer API is not a UX improvement by itself.

## Responsive components: container queries

Use **viewport/media queries for page- or device-level conditions** and **container queries for components whose useful layout depends on the space actually allocated to them**.

A reusable card, toolbar, search module, inspector, dashboard panel, or embedded widget should not need to know whether it lives in a sidebar, grid, modal, split pane, or full-width region. When its composition depends on local available space, query that space directly.

### Operational rules
- Start from a robust narrow/default composition, then enhance when the container has room.
- Prefer `container-type: inline-size` when only inline width matters; full `size` containment is a stronger constraint and can affect sizing because the container is sized independently of its contents.
- Name containers when nested reusable components could otherwise bind to the wrong eligible ancestor.
- Use container-relative units (`cqw`, `cqh`, `cqi`, etc.) for genuinely fluid local scaling; use discrete `@container` breakpoints when the **composition** changes.
- Choose breakpoints from where the component's content/controls stop fitting or become awkward, not from device labels.
- Do not duplicate every viewport breakpoint as a container breakpoint. Local responsiveness should reduce coupling, not create a second arbitrary breakpoint system.
- Keep semantics and source order stable across layout variants. CSS adaptation must not turn a component into a different inaccessible interaction model.

### Why this matters for design systems and agents
Container queries make responsive behavior part of the **component contract** rather than hidden page knowledge. An agent can place the same component in different compositions while preserving its own adaptation rules. This increases composability and reduces one-off viewport assumptions.

Example contract:

```text
ResultCard
- default: compact vertical composition
- >= 28rem container: media + content side-by-side
- >= 44rem container: reveal secondary metadata/actions
- invariants: heading/action semantics, reading order, minimum target size
```

The exact thresholds belong to the component and its content, not to generic phone/tablet/desktop categories.

## Container-query capability boundary — 2026-09-30

Core **size container queries** and `container-type` are broadly available across modern browsers; MDN records `container-type` as cross-browser available since February 2023. This is mature enough for normal component-responsive layout when the supported browser matrix agrees.

Do not treat every feature under “container queries” as equally mature:
- size queries are the safe baseline;
- style queries currently have narrower practical capability — MDN notes that custom properties are the supported style feature while arbitrary declaration queries remain future-facing;
- scroll-state and anchored container queries are newer capabilities and should be checked independently before production use.

This distinction matters for agents: **feature-family familiarity is not browser-support evidence**. Check the exact primitive used.

## Native overlay decision model: semantics before floating geometry

Do not choose an overlay primitive because it visually “floats.” First decide the interaction contract.

- Use a **modal `<dialog>` opened with `showModal()`** when the user must finish, cancel, or otherwise resolve a bounded task before interacting with the surrounding document. The browser places it in the top layer and makes the rest of that document inert.
- Use a **non-modal `<dialog>`** when the surface is a dialog/subwindow but surrounding content must remain usable.
- Use the **Popover API** for non-modal transient or persistent floating surfaces such as action menus, pickers, teaching UI, or suggestions when its lifecycle fits. Popovers are non-modal; adding `popover` does not turn arbitrary content into a dialog, menu, listbox, or tooltip.
- Do not make a surface modal merely to simplify focus management. Modality is a user-workflow constraint, not a styling or implementation shortcut.

### Modal dialog contract

Native `<dialog>` removes substantial custom plumbing, but it does not choose good product behavior for you.

- Give the dialog an accessible name, normally from a visible title.
- Put initial focus where it best supports the task. The first control is not universally correct: long/structured content can justify focusing a static heading/intro with `tabindex="-1"`; destructive final steps can justify initially focusing the least destructive action.
- Keep an explicit visible close/cancel mechanism even though modal dialogs support `Escape`.
- Preserve `Escape` unless there is a compelling workflow reason not to; custom code should not accidentally suppress expected cancellation.
- On close, return focus to the invoker unless the invoker disappeared or the completed workflow makes a different next focus target more logical.
- Do not add `aria-modal="true"` to a surface that still allows outside interaction. WAI-ARIA warns that false modality can make outside content unavailable to some assistive-technology users.
- Prefer `showModal()` over recreating background inertness manually. Use the `inert` attribute deliberately when a different UI state genuinely needs a subtree to become non-interactive.

### Popover contract

A popover solves **display lifecycle/top-layer behavior**, not the complete semantics of the widget inside it.

When a control uses `popovertarget`, current browser behavior can provide useful invoker relationships, keyboard navigation ordering, `aria-expanded`/relationship semantics, Escape handling, and focus return. Still implement the content according to what it actually is: menu, listbox, dialog-like surface, explanatory content, etc.

Do not import a floating-UI library merely because a surface needs to escape clipping or sit above page content. Start with:

1. correct semantic element/widget pattern;
2. native dialog or popover lifecycle if it satisfies the contract;
3. CSS/native positioning where the support matrix permits;
4. a library or custom JavaScript only for remaining requirements such as sophisticated collision policies, composite-widget behavior, virtualization, legacy support, or cross-surface coordination.

This ordering keeps semantics independent from geometry and reduces JavaScript state that merely mirrors browser state.

### Evidence boundary — 2026-09-30

Native `<dialog>`, `showModal()`, and `inert` are broadly available in current browsers. The Popover API is also a current platform primitive, but support for adjacent newer features should be checked separately. Platform availability is evidence that custom infrastructure can often be removed; it is **not** evidence that more overlays improve usability.

WAI-ARIA APG remains useful for dialog interaction requirements, but its examples explicitly require real assistive-technology testing before production reuse. Prefer semantic HTML behavior where it already supplies the contract rather than reproducing an ARIA example mechanically.

## CSS anchor positioning for overlays — 2026-10-08

**Decision:** choose the widget's semantics and dismissal/focus contract first (dialog, menu, tooltip, listbox, or plain disclosure), then use CSS anchor positioning for **geometry**. The Popover API handles display/top-layer lifecycle, but neither popover nor anchor positioning implements a menu's arrow-key navigation or a tooltip's accessibility contract.

**Support boundary:** MDN marks core anchor-positioning features and `position-try-fallbacks` as Baseline 2026 (January). This is **newly** interoperable, not a promise about older Safari/Firefox/embedded browsers. Test the exact features and provide a usable non-anchored placement. Popover support is older, but `popover="hint"` and adjacent capabilities have separate compatibility considerations.

### Practical contract for coding agents

- A button with `popovertarget` gives its popover an **implicit CSS anchor**. Prefer this over generated global `anchor-name` identifiers for simple invoker-bound overlays. Reset UA popover `inset` and `margin` before applying `position-area`; otherwise default centering can defeat intended placement.
- For repeated cards/rows using explicit `anchor-name: --name`, **unscoped duplicate names bind to the last matching anchor in source order**. Use component-local `anchor-scope` (where supported), distinct names, or an implicit popover invoker association. `anchor-scope` does **not** govern implicit associations.
- `position-try-fallbacks` is an ordered list, not a guarantee of visibility. `flip-block, flip-inline` alone can fail at a corner; include the combined `flip-block flip-inline` option and test all edges, small viewports, zoom, dynamic content, RTL and nested scroll containers. If no candidate fits, the original placement may still overflow.
- `position-visibility` can hide a floating surface when its anchor is offscreen or the surface overflows. That may be correct for a non-interactive hint but can silently conceal **focused controls or an unfinished task**. For interactive surfaces prefer repositioning or a usable alternate layout; test focus and dismissal when the invoker scrolls away.
- Choose `popover="auto"` for click-triggered light-dismissable surfaces, `manual` when lifecycle must be explicit, and consider `hint` for hover/focus help **only after** checking its support and hover/focus/Escape behavior. `hint` is not an accessibility role. W3C APG's tooltip pattern is still a work in progress; tooltip content should not contain focusable controls. An action menu needs menu semantics and keyboard behavior independent of its positioning.

A small progressive-enhancement pattern (the default fixed placement remains usable if anchoring is unsupported):

```html
<button type="button" popovertarget="help">Help</button>
<div id="help" class="help-popover" popover="auto">Short guidance</div>
```

```css
.help-popover:popover-open {
  position: fixed;
  inset: auto 1rem 1rem auto;
  margin: 0;
  max-inline-size: min(22rem, calc(100vw - 2rem));
}
@supports (position-area: bottom) {
  .help-popover:popover-open {
    inset: auto;
    position-area: bottom;
    position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;
  }
}
```

**Verification:** check keyboard activation, Escape/outside dismissal, focus return, viewport corners, 200–400% zoom, touch/hover, RTL, nested scrollers, and older target browsers. The code above demonstrates **placement**, not a complete menu, tooltip, or dialog implementation.

**Evidence boundary:** browser/standards documentation establishes API mechanics, newly broad support, and failure cases; no measured evidence here that CSS anchoring itself improves task outcomes. Sources: [MDN anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using), [fallback failure modes](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Try_options_hiding), [anchor-scope](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/anchor-scope), [popover](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using), [WAI-ARIA menu button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/), [tooltip pattern caveat](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/).

## Customizable native select: style without rebuilding the widget — 2026-10-12

**Decision:** when the task is a single choice from a bounded set, first ask whether a select is appropriate; only then decide how much to style it. A richly styled native `<select>` can preserve built-in form submission, keyboard operation and accessibility semantics without a JavaScript combobox. But styling cannot fix an inappropriate control: GOV.UK reports that some users struggle with selects and recommends reducing choices or using radios where practical.

**Support/fallback:** `appearance: base-select` shipped in Chromium 135 (April 2025) and Safari 27 (September 2026), but remains unavailable in stable Firefox as of this review. Treat it as progressive enhancement, not a cross-browser baseline. The new picker is browser-rendered in the top layer, not the operating-system's usual mobile picker: test mobile ergonomics rather than assuming native OS behavior. A simple opt-in is:

```css
@supports (appearance: base-select) {
  .choice, .choice::picker(select) { appearance: base-select; }
  /* Keep ordinary select styles and meaningful option text outside this block. */
}
```

**Non-negotiable contract:**
- Keep a visible `<label>`, meaningful text in every `<option>`, and a usable plain-select fallback. Icons, swatches, flags or avatars **supplement** names; they cannot replace them. Non-supporting browsers strip rich option markup, and icon-only options can become blank (WebKit).
- `<button><selectedcontent></selectedcontent></button>` inside the select is optional; `<selectedcontent>` is a browser-managed **clone** of the chosen option. Changing the option's descendants later does **not** automatically refresh the clone. Dynamic React/Vue/etc. data must be checked for stale displayed labels. Do not treat the clone as a second source of application state.
- The select's internal button is inert; nested links/buttons do not become usable actions. Do not use this widget as a split button, menu of commands, autocomplete/search input, or a substitute for a multi-step picker.
- The CSS opt-in does not guarantee SSR compatibility: MDN warns that some frameworks reject rich select markup or hydrate it incorrectly. Test the exact framework/runtime with SSR and client-side updates before shipping.
- Verify tab/arrow/type-ahead/Escape behavior, screen-reader option/value announcements, required/invalid state, long labels, 200–400% zoom, touch, RTL, disabled options, CSS-off, Firefox fallback, and programmatic option updates. The browser provides semantics, **not** proof of usable labels, focus appearance or successful tasks.

**Evidence boundary:** platform documentation establishes capabilities and failure modes, not measured superiority over plain selects, radios or a correctly built combobox. Sources: [MDN customizable select](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select), [MDN selectedcontent](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/selectedcontent), [WebKit option text rule (2026-06-15)](https://webkit.org/blog/18117/the-golden-rule-of-customizable-select/), [Safari 27 release (2026-09-17)](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/), [Web Features support](https://web-platform-dx.github.io/web-features-explorer/features/customizable-select/), [GOV.UK select research](https://design-system.service.gov.uk/components/select/).

## Scroll-state queries: promising, not a default dependency

Current CSS can query conditions such as whether content remains scrollable, a sticky element is stuck, or a snap target is snapped. This can remove JavaScript observers used only to decorate those states.

Potential uses include:
- reveal a “more content” affordance only while overflow remains;
- change a sticky header's treatment only once it is actually stuck;
- style the active snapped item without mirroring scroll state into application state.

Treat these as progressive enhancement until the project's support matrix confirms the exact descriptor. Do not use scroll state to hide essential navigation or information: the underlying interaction must remain usable when the query is unsupported.

## Scroll-driven animations: use scroll as a timeline, not as application state

CSS scroll-driven animations can bind keyframe progress to either **scroll progress** (`scroll()`) or **view progress** (`view()`) instead of time. This is useful when the visual effect is genuinely a continuous function of scrolling: reading-progress indicators, a local reveal tied to an element entering/leaving its scrollport, or spatial illustration whose progress should reverse naturally when the user scrolls back.

Prefer the native timeline when all of these are true:
- the effect is presentational rather than domain/application state;
- progress should track scroll continuously and reversibly;
- the non-animated page remains complete and understandable;
- the exact primitives meet the project's support matrix;
- reduced-motion users receive a safer equivalent.

Do **not** turn ordinary scroll position into React/application state merely to drive a visual interpolation. MDN notes that CSS scroll-driven timelines avoid the main-thread tracking required by JavaScript `scroll` listeners or observers for these effects. That is a platform/performance advantage, not evidence that adding animation improves UX.

### Choose the timeline from the meaning

- Use a **scroll progress timeline** when the effect represents progress through a scroller: for example a document progress bar.
- Use a **view progress timeline** when the effect belongs to a particular subject entering, crossing, or leaving its scrollport.
- Use **scroll-state container queries** when the requirement is discrete rather than continuous — e.g. “is this sticky header actually stuck?” or “does more content remain scrollable?” Do not animate a continuous timeline when a boolean state is the real requirement.
- Keep JavaScript when scrolling changes application/domain state, coordinates complex non-presentational behavior, or native primitives cannot satisfy the support contract.

### Accessibility and resilience

Scroll-linked movement is still motion. Respect `prefers-reduced-motion`; remove, reduce, or replace non-essential motion while preserving any information it communicated. A useful implementation escape hatch is to detach optional animations from their timeline for reduced-motion users.

Never make scroll-driven animation the only carrier of:
- reading progress needed to navigate;
- selected/current state;
- instructions or essential labels;
- access to controls or content.

Avoid large-scale pan, zoom, parallax, or continuous scaling simply because the platform makes them easy. The motion-purpose and vestibular-safety rules in `INTERACTION_MOTION.md` still apply.

### Implementation traps

- Declare `animation-timeline` **after** the `animation` shorthand; the shorthand resets the timeline to `auto`.
- A scroll timeline requires an actual scroll range. If the selected axis does not overflow, there is no useful progression.
- View timelines track a subject within its nearest ancestor scroller; use insets/ranges deliberately rather than relying on accidental viewport geometry.
- Test forward and reverse scrolling, keyboard/page scrolling, zoom, dynamic content changes, reduced motion, and the no-enhancement path.
- Treat scroll-driven animations and scroll-state queries as separate capabilities and verify the exact primitive rather than assuming support from the family name.

## Decision rule: CSS capability vs JavaScript

Before adding JavaScript for responsive or environmental styling, ask:

1. Is the behavior purely presentational and derivable from layout/container state?
2. Can CSS express it without duplicating application state?
3. Does the exact primitive meet the project's browser-support requirements?
4. Does the no-enhancement path remain semantically and functionally correct?

If yes, prefer CSS. Keep JavaScript when behavior changes domain/application state, requires richer measurement/coordination, or the native primitive cannot meet the support/interaction contract.

## Evidence boundary

Container queries are strong **platform capability evidence**, not proof that more responsive variants improve user outcomes. Their durable value is architectural: components can respond to their actual embedding context with less page-level coupling. Do not infer that every component needs multiple variants or fluid scaling.

## Research scope
Semantic HTML/accessibility; modern CSS layout; responsive composition; container queries; view transitions; SVG; canvas; WebGL/WebGPU when justified; performance; image/video delivery; component architecture; interaction-heavy state; animation libraries; headless systems; browser APIs; testing; visual regression.

Date or scope tool-specific recommendations when version matters. Avoid complex technology when CSS or native browser behavior solves the problem better.
