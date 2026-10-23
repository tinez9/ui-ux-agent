# Frontend Implementation

Translate design intelligence into implementable frontend behavior.

## Principle
Keep durable design guidance separate from fast-changing framework details.

Prefer the lowest-complexity platform primitive that preserves the required semantics, accessibility, resilience, and interaction quality. A newer API is not a UX improvement by itself.

## Bidirectional UI and RTL: direction is not translation — 2026-10-23

**Decision:** treat localization as three independent contracts: **human language** (`lang`), **base text direction** (`dir`), and **interface geometry/interaction** (logical CSS, direction-aware controls). Translating strings or setting a locale in a test runner does not, by itself, make a correct RTL interface. This is a durable internationalization gap in agent-generated frontends.

### Implementation contract

1. **Set document semantics at the source.** For an Arabic-language RTL document use `<html lang="ar" dir="rtl">`; for English use `lang="en" dir="ltr"`. `lang` does not imply `dir`, and CSS `direction: rtl` is not a semantic substitute for HTML `dir`. On SSR/hydration, derive both from the same resolved application locale on server and client; do not depend on browser-language detection for only one side. Mark substantial opposite-language passages with `lang` (WCAG 3.1.1/3.1.2); language metadata and bidi isolation solve different problems.
2. **Isolate inserted text.** Names, titles, comments, search terms, and remote/user-generated values may have unknown direction even in a fixed-language shell. Render an inline value as `<bdi>{value}</bdi>` (or use `dir="auto"` on an existing semantically appropriate wrapper); use `dir="auto"` on free-form input/textarea where the user's writing direction is unknown. For a *known* opposite-direction phrase, tightly wrap it with explicit `dir="ltr"` or `dir="rtl"`. `auto` uses a first-strong-character heuristic, not language detection: leading numbers, emoji, abbreviations and mixed-script strings need examples reviewed. Preserve HTML escaping; bidi isolation is **not** an HTML-injection defense.
3. **Keep technical tokens readable.** URLs, paths, code, identifiers and telephone-number fields often need a scoped `dir="ltr"` even inside RTL pages; do not force every user name or arbitrary user-entered phrase LTR. A fixed-direction token can be aligned to the surrounding interface separately. For form submissions where direction matters, HTML `dirname` can submit the entered direction alongside a text field. Never reverse the stored character sequence to “fix” its visual order.
4. **Make layout flow-relative by default.** Prefer `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `border-inline-start`, and `text-align: start` over left/right assumptions when placement should follow reading direction. Physical left/right remains correct for genuinely fixed physical positions. Review Grid/Flex ordering and any `row-reverse`, `order`, or absolute positioning: a visual flip must not create a contradictory DOM, keyboard or screen-reader order.
5. **Mirror *meaning*, not pixels.** Back/forward arrows, previous/next navigation and spatially directional affordances often reverse in RTL. Do **not** blindly `scaleX(-1)` an entire component, logo, number, code sample, media control or illustration. Firefox's shipped RTL guidance explicitly exempts product logos, playback controls, code, checkmarks and dimension order. For icons with mixed text/graphics, use a purpose-built RTL asset rather than flipping embedded text.
6. **Treat interactive behavior separately.** Direction-sensitive composite widgets, carousels, tabs and menus may require adjusted Left/Right arrow-key meaning; browser/ARIA library behavior and the component's visual order must agree. Do not change Tab order simply to force an apparent mirror. Use a maintained internationalized component library's locale/direction contract when it actually covers the widget; React Aria exposes `useLocale()` and direction-aware keyboard interactions, but that does not certify every custom wrapper.
7. **Test the application locale, not only browser emulation.** Playwright's `locale` option emulates browser locale; it does **not** guarantee that application translations, `html[lang]`, `html[dir]`, fonts, or persisted language settings changed. Set the app locale explicitly in fixtures/routes, then assert rendered `lang` and `dir`. Run LTR + Arabic/Hebrew RTL, mixed-script user data, numeric-first labels, punctuation, long translations, empty/search inputs, table column order, back/forward semantics, keyboard navigation, screen-reader pronunciation and 200–400% zoom. Include a real RTL locale; pseudo-RTL is a useful defect detector, not a replacement. Capture both the visual state and DOM/focus order.

### Minimal example

```html
<html lang="ar" dir="rtl">
  <body>
    <p>المستخدم <bdi>Alex (QA-42)</bdi></p>
    <a href="/docs"><span dir="ltr">API v2</span></a>
    <label for="search">بحث</label>
    <input id="search" name="query" dir="auto" dirname="query.dir" />
  </body>
</html>
```

```css
.search-field { padding-inline-start: 1rem; margin-inline-end: .5rem; }
```

**Evidence boundary:** W3C i18n and WCAG define markup/accessibility expectations; MDN documents bidi primitives; Mozilla provides production engineering guidance; React Aria and Playwright document their own capabilities. These sources do **not** demonstrate measured superiority of a particular RTL layout or guarantee identical browser/AT behavior. No comparative usability or cross-device test was run in this research cycle.

**Primary sources (reviewed 2026-10-23):** [W3C structural RTL](https://www.w3.org/International/questions/qa-html-dir), [W3C inline bidi isolation](https://www.w3.org/International/articles/inline-bidi-markup/index.en), [MDN `<bdi>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/bdi), [MDN `dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir), [MDN CSS logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values/Margins_borders_padding), [Firefox RTL engineering guidance](https://firefox-source-docs.mozilla.org/code-quality/coding-style/rtl_guidelines.html), [WCAG language of page](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html), [WCAG language of parts](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts), [React Aria internationalization](https://react-aria.adobe.com/quality), [Playwright locale emulation](https://playwright.dev/docs/test-use-options).

## PWA update lifecycle: protect work across client versions — 2026-10-23

**Decision:** a new service worker is not the same as a new UI version. Treat an update as a **multi-client state transition**: detected → installed/waiting → activated/controlling → *new app shell loaded*. An update check or worker activation alone must not trigger an “Updated” claim.

- **Choose activation by session risk, not deployment convenience.** For short-lived, stateless sites, normal worker waiting/navigation may be sufficient; a prompt is not automatically useful. For long-lived installed PWAs with forms, offline queues, timers or edits, prefer a persistent, nonblocking **Update available — Reload when ready** action, with postponement and recovery. Immediate activation/reload is defensible only when in-flight work is disposable or durably recoverable and mixed-version behavior is verified. An urgent security release may justify stronger interruption, but not silent data loss.
- **Distinguish events:** `registration.update()` checks for a new worker; `updatefound` indicates installation began; `registration.waiting` means an installed replacement awaits activation. Detect an already-waiting worker on startup as well as future installations. A `controllerchange`/Workbox `controlling` event indicates a controller change, **not** that the current document's old JavaScript was replaced.
- **Make acceptance an actual transaction:** before requesting `skipWaiting()`, persist or explicitly account for unsaved drafts and queued mutations. If using Workbox, signal the waiting worker through its supported message path, then reload once when the new controller takes over; guard against reload loops and verify the refreshed app's build/version. Avoid showing “Saved” or “Updated” until persistence or reload is confirmed.
- **One tab's consent is not all tabs' consent.** `skipWaiting()` can place a new worker in charge of still-open pages executing old JavaScript. `clients.claim()` can additionally take control of uncontrolled in-scope clients. Test simultaneous tabs/windows, installed PWA windows, IndexedDB/schema migration, offline reconnect, stale API responses, lazy-loaded old chunks, and cache cleanup. Keep backend/storage contracts backward compatible through the transition; prompting only the active tab does not solve cross-client compatibility.
- **Audit the exact plugin configuration.** As documented by vite-plugin-pwa (reviewed 2026-10-23), `registerType: 'autoUpdate'` forces Workbox `skipWaiting` and `clientsClaim`; automatic *page reload* also requires registration through a virtual module. Its documentation warns of form-data loss and recommends the default `prompt` behavior for form-heavy applications. Do not infer safety from the name of a configuration option.
- **UX and QA gate:** announce update availability without stealing focus; keep the update control keyboard-accessible and recoverable after dismissal. Test deployment A→B with two tabs and an installed iOS/Android PWA, dirty forms, queued offline edits, rejected install, slow network, incompatible old/new APIs and repeat update events. Assert no surprise reload, no false “updated” state, no lost draft, one reload after explicit acceptance, and safe recovery when activation or reload fails. Test real devices; desktop emulation cannot certify installed-PWA lifecycle behavior.

**Evidence boundary:** platform and plugin documentation establish lifecycle mechanics and known data-loss risks, **not** measured superiority of any notification/activation policy. Compare actual task continuity and recovery before promoting a universal strategy. Primary sources: [Workbox update handling](https://developer.chrome.com/docs/workbox/handling-service-worker-updates/), [web.dev service-worker lifecycle](https://web.dev/articles/service-worker-lifecycle), [MDN controllerchange](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/controllerchange_event), [vite-plugin-pwa auto-update](https://vite-pwa-org.netlify.app/guide/auto-update), [vite-plugin-pwa prompt](https://vite-pwa-org.netlify.app/guide/prompt-for-update), [W3C status messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html).

## Mobile keyboard-safe layouts: visible area is not the CSS viewport — 2026-10-19

**Decision:** do not equate `100dvh`, the layout viewport, the visible screen, and the on-screen keyboard's unobscured area. For a form, chat composer, bottom action bar or installed PWA, choose the **scroll/focus behavior** first and add viewport compensation only when a tested device actually needs it.

- **Three separate geometries:** `svh` tracks the small viewport with browser chrome expanded; `lvh` (and legacy `vh`) tracks the large viewport; `dvh` follows retractable browser chrome. **None is a universal keyboard-height measurement.** By default, the keyboard can shrink the *visual* viewport without shrinking the *layout* viewport, so a `position: fixed; bottom: 0` composer may sit behind it despite `100dvh`. `dvh` can also trigger layout movement as browser chrome expands/collapses; do not blanket-replace `vh` in long documents.
- **Prefer normal flow and native scrolling:** keep inputs and validation messages reachable; allow the focused control to scroll into view; keep a stable scroll owner. Use a flex/grid app shell with a scrollable middle region only when the product truly needs a full-height shell. Do not lock `body` scrolling merely to make a mobile layout resemble a native app. Reserve enough scroll space beneath bottom bars so the last field/action can be reached.
- **Differentiate the device safe area from keyboard occlusion.** `env(safe-area-inset-bottom, 0px)` protects content near a display edge/home indicator when relevant (especially `viewport-fit=cover`); it is **not** a reliable keyboard inset. A fixed bar may need both safe-area padding and a separately verified keyboard strategy, without double-counting them.
- **Opt-in resize behavior is conditional:** `<meta name="viewport" content="width=device-width, initial-scale=1, interactive-widget=resizes-content">` requests that the layout viewport resize for an interactive keyboard. Chrome documented this control for Android; do not assume that Safari/iOS, embedded WebViews or every browser honors it. Test it rather than treating the meta tag as a portable fix. Avoid `navigator.virtualKeyboard.overlaysContent = true` as a generic solution: the VirtualKeyboard API is limited-availability, opts into *more* manual layout responsibility, and can cause occlusion unless its geometry is handled.
- **When geometry must follow the actually visible region**, `window.visualViewport` exposes `height`, `offsetTop`, `scale`, and `resize`/`scroll` events. Read these together and account for the element's coordinate space; a naive `innerHeight - visualViewport.height` calculation is **not** a dependable keyboard-height detector because pinch zoom and viewport changes can also shrink the visual viewport. Throttle high-frequency updates, clean up listeners, and preserve native focus/scroll behavior. Prefer the simpler CSS/native approach whenever it works.
- **Acceptance gate:** on real iOS Safari (browser and installed PWA), Android Chrome and relevant WebViews, test keyboard open/close, toolbar collapse, orientation, pinch zoom, 200–400% zoom, hardware keyboard, long validation text, bottom-sheet forms, and navigating between fields. Assert that focused inputs, errors, submit controls and the last content item are reachable, and that dismissing the keyboard does not leave a phantom gap or jump the scroll position. WCAG 2.4.11 applies to focus obscured by *author-created* content (such as sticky bars); do not misstate it as a blanket prohibition on OS keyboards.

**Evidence boundary:** browser documentation establishes viewport and API mechanics; W3C establishes focus visibility requirements. Cross-device app-shell behavior and specific compensation formulas still need real-device testing, not screenshot-only or desktop emulation. Sources: [MDN viewport units](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length), [MDN viewport meta](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport), [Chrome Android keyboard viewport change (2022)](https://developer.chrome.com/blog/viewport-resize-behavior/), [MDN VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport), [MDN VirtualKeyboard API](https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API), [MDN safe-area environment variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env), [WCAG 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum).

## Visual regression is a state-coverage test, not a screenshot pass — 2026-10-13

**Decision:** visual diffs answer “did the rendered pixels change relative to an approved baseline?” They do not answer “is this the correct state, good design, accessible, or functionally complete?” A stable screenshot can be a stable **wrong** state.

For AI coding/design agents, use this capture contract:

1. **Name the target:** route/component, user state, theme, viewport, browser, locale, data fixture, and expected visual outcome. Assert that the *intended* state is rendered (dialog open, error shown, async result settled) **before** capture. Do not let a screenshot replace the state assertion.
2. **Control determinism:** fix clocks/data/locale and external resources where possible; pin browser/OS/fonts/viewport/DPR. Playwright warns that screenshots differ across rendering environments. Its `toHaveScreenshot()` waits for two consecutive matching captures, which establishes stability, **not correctness**.
3. **Stabilize narrowly:** Playwright disables CSS/Web Animations and hides carets by default; its `stylePath` and masks can suppress volatile regions. Chromatic pauses CSS animation/video/GIF but cannot automatically stop JS-driven animation. Prefer deterministic fixtures to broad masking or arbitrary sleeps: masking a region can also hide a regression in that region.
4. **Capture intermediate states deliberately:** Chromatic waits for Storybook `play()` to finish and captures **only its final state**. Create separate stories or explicit E2E snapshots for intermediate loading, validation, menu-open, focus and recovery states. A passing default story does not cover them.
5. **Treat sensitivity as a trade-off:** permissive pixel/color thresholds suppress noise *and* small real regressions. Review diffs before approving baseline changes; do not automatically bless all snapshots after a code edit. Keep clean controls and known-defect cases in CI to detect false-green configurations.
6. **Respect the data boundary:** Chromatic can upload published Storybook output or re-renderable E2E archives containing HTML, assets and test data. Its vendor statement that it does not store source code does **not** mean a captured authenticated UI contains no secrets. Use synthetic fixtures, review network/data exposure and access policy, or stay with local Playwright when confidentiality requires it.

**Tool choice:** local `@playwright/test` screenshot assertions suit route/journey checks and constrained environments; Chromatic adds managed cross-browser/story review and baselines where a component-story workflow and cloud data handling are acceptable. Both need explicit state coverage, functional/accessibility tests, and human/agent rendered critique. Neither tool is a standalone design-judgment skill. The open-source Chromatic CLI is MIT, but that license does not make its hosted capture service local or open-source.

**Evidence boundary:** these are documented tool mechanics and an agent testing contract, not a controlled result showing improved visual quality. Primary sources: [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots), [screenshot options](https://playwright.dev/docs/api/class-pageassertions), [Chromatic capture behavior](https://www.chromatic.com/docs/snapshots/), [interaction snapshot timing](https://www.chromatic.com/docs/interactions/), [threshold trade-offs](https://www.chromatic.com/docs/threshold/), [E2E archive contents](https://www.chromatic.com/docs/faq/what-is-archive/), [Chromatic CLI source](https://github.com/chromaui/chromatic-cli).

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

### Dialog close requests and unsaved work — spec correction 2026-10-20

**Decision:** a dialog close-request veto is a *best-effort interaction guard*, **not a data-preservation guarantee**. Model the workflow as keep editing, save, discard, or recover a draft. In particular, do not assume that every `cancel` event is cancelable.

- **Different routes have different semantics.** `dialog.requestClose()` and declarative `command="request-close"` route through `cancel` before `close`; `dialog.close()`, `command="close"`, and `<form method="dialog">` close without that veto. A `method="dialog"` form does **not** persist to a server. Route the app's visible X/Cancel through the guarded request path; reserve unconditional closing for an explicitly completed save/discard. Audit form buttons, framework unmounts, route changes, and indirect dismissals as separate exits.
- **Important WHATWG exception to simplified API descriptions:** for a *programmatic* `requestClose()`, the HTML Standard invokes the close watcher with `requireHistoryActionActivation = false`, so its `cancel` event can be prevented. But browser/platform close requests (e.g. Escape or Android Back) process close watchers with that flag **true**. The close watcher anti-abuse rule may then dispatch `cancel` with `event.cancelable === false`, particularly after a previous veto consumed history-action activation and no new user activation intervened. `preventDefault()` cannot stop that request; the dialog can close. MDN's generic statement that `cancel` is cancelable omits this conditional spec behavior. Do **not** promise that repeated Escape/Back cannot dismiss a dirty form.
- **Intercept synchronously, decide asynchronously:** if dirty **and** `event.cancelable`, call `event.preventDefault()` *before* any `await`; then show a clear keep-editing/save/discard choice. After explicit confirmation use `close()` rather than recursively calling `requestClose()` inside `cancel` (a WHATWG issue documents re-entrancy trouble). If `event.cancelable` is false, do not present a confirmation as though it blocks dismissal; rely on independently preserved draft state and clear recovery. A `close` event is too late to veto, though useful for cleanup and restoring focus.
- **Dismissal policy is not persistence policy.** `closedby="any"` enables light dismiss; `closerequest` allows platform requests; `none` restricts native dismissals. Support for `closedby` must be checked against target browsers. Disabling Escape/Back to avoid data loss is generally a poor substitute for saving or recovering work. Do not assume a modal bottom sheet should light-dismiss a dirty editor.
- **Preserve work before the exit:** for high-value editing, save an appropriate draft on change/debounce or provide explicit save-and-resume. Choose local versus server persistence from privacy, account, offline, and retention requirements; avoid persisting secrets or sensitive content casually. Treat the UI's “Saved” status as confirmed persistence, not merely local input state. For low-stakes unsaved input, explicit confirmation may suffice, but test the unpreventable close path.
- **Regression matrix:** clean/dirty × visible X, Escape once/twice without new activation, Android Back, backdrop tap, `method="dialog"`, `command="close"`/`request-close`, save failure, nested dialogs, route change, removed invoker, and keyboard/screen-reader focus. Log `event.cancelable` and assert whether the dialog actually closes; after an unavoidable close verify draft recovery and absence of false “Saved” feedback. Test on real target browsers: this is a spec-derived risk model, **not** a measured claim that every engine behaves identically.

**Evidence boundary:** [WHATWG dialog request-close algorithm](https://html.spec.whatwg.org/multipage/interactive-elements.html#dialog-request-close) explicitly passes `false` for programmatic requests; [WHATWG close-watcher algorithm](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-request-close) uses history-action activation for platform requests and may make `cancel` noncancelable; [MDN requestClose](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/requestClose) and [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) document the common path and `closedby`; [WHATWG issue #12347](https://github.com/whatwg/html/issues/12347) records the nested-request edge case. This establishes a correctness boundary, not comparative evidence that autosave always beats confirmation.

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
