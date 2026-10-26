# Frontend Implementation

## Programmatic focus can be real but visually unindicated (2026-10-26)

**Decision:** `:focus` means an element owns focus; `:focus-visible` is a **browser heuristic about when to show a focus cue**, not an invariant of `.focus()`. When a pointer-activated action moves focus by script to another **button**, the new button may receive keyboard events without matching `:focus-visible`. The same move following keyboard activation can match. Editable text inputs often match regardless of pointer modality. Do not confuse “`document.activeElement` is correct” with “the user can see where interaction moved.”

**When to intervene:** Normally retain the browser's `:focus-visible` behavior and provide a high-contrast outline; **never reset `:focus` outlines globally without a verified alternative**. When an action *deliberately relocates focus* and users need to find its destination (e.g. focus transferred to a newly added action, recovery button or dynamically opened region), add an explicit, temporary cue to that target such as `.needs-focus-cue:focus { outline: 3px solid currentColor; outline-offset: 2px; }` alongside the ordinary `:focus-visible` rule; clear the marker on blur/unmount. Do not force a ring after every mouse click, or mistake focus styling for a substitute for correct focus placement and announcement. Ensure the focused component is not hidden under sticky headers/footers; `focus({preventScroll:true})` is **not** a visibility guarantee.

**API compatibility trap:** The HTML Standard defines `element.focus({focusVisible:true})`, but support is **version-specific**. The MDN browser-compat-data source inspected on 2026-10-26 lists Chrome **145+**, Firefox **104+**, Safari **18.4+**; Chromium **144.0.7559.96** ignored the option. Do not assume the documented option works in a deployed browser or use `focusVisible:false` to suppress a keyboard user's indicator. An explicit CSS cue with lifecycle cleanup is a practical fallback when orientation must be guaranteed.

**Controlled evidence (3 fresh Chromium 144/Playwright Python runs per path):**

| Trigger → script target | `:focus-visible` on target | CSS outline in test fixture |
|---|---:|---:|
| Real pointer click → `button.focus()` | false | 0px |
| Real pointer click → `button.focus({focusVisible:true})` | false | 0px |
| Real pointer click → add `.needs-focus-cue`, then `button.focus()` | false | **4px** |
| Keyboard Space on focused trigger → `button.focus()` | true | **4px** |
| Pointer click → `input.focus()` | true | **4px** |
| Playwright `locator.focus()` on fresh target | true | **4px** |

The fixture intentionally removed the default button outline on `:focus` and supplied a 4px outline only for `:focus-visible`/the explicit-cue class. A getter probe showed Chromium 144 read `preventScroll` but **did not read** `focusVisible` from the focus-options object, corroborating that the latter was ignored. A bare Playwright `.focus()` test therefore **cannot substitute for real pointer-triggered and keyboard-triggered journeys**.

**Standards and acceptance:** WCAG **2.4.7 Focus Visible (AA)** requires a mode with visible keyboard focus; **2.4.11 Focus Not Obscured (Minimum, AA)** prevents complete occlusion by author content; **2.4.13 Focus Appearance (AAA)** adds indicator size/change-contrast criteria. The pointer-origin missing ring above is **not automatically a WCAG 2.4.7 failure**: test keyboard paths separately. Test pointer, keyboard, scripted focus after async work, zoom/sticky overlays, forced colors, focus restoration, actual screenshots and real assistive technologies. CSS computed outline and `:focus-visible` matching alone do not certify visibility, contrast or user orientation.

**Evidence boundary:** CSS Selectors 4 and WHATWG HTML algorithms, W3C WCAG 2.2, MDN and its versioned compatibility data, plus isolated Linux Chromium 144 fixtures. No Firefox/Safari runtime, screen-reader or user-outcome comparison. Sources in `research/SOURCES.md`.

## Pointer targets: rendered hit area, exceptions, and audit coverage (2026-10-25)

**Decision contract — WCAG 2.2 SC 2.5.8 (AA):** A pointer target needs an axis-aligned 24×24 **CSS-pixel square inside its effective clickable area**, **or** one of five exceptions: sufficient spacing, an equivalent conforming control on the same page, inline text, an unmodified user-agent-sized control, or essential/legal spatial presentation. For spacing, center a **24px-diameter circle on each undersized target's bounding box**: it must intersect neither another target nor the circle around another undersized target. W3C's 20×20px buttons with 4px gap pass the spacing example; with 0px gap they fail. A small target's circle must also clear a *large neighboring target itself*. A 24px icon does not prove a 24px hit area; a 16px icon inside a genuinely 44px button may be preferable. 44×44px is the stricter **AAA** size / useful touch aspiration, not the AA minimum. Browser zoom does not fix a CSS-pixel shortfall.

**Geometry counterexamples (Chromium 144.0.7559.96, Playwright Python, 2026-10-25):** Three 24×24px CSS buttons: normal button had a 24×24 bounding rect and near-edge pointer hit; `transform:scale(.5)` retained computed 24×24 CSS dimensions but rendered a **12×12** rect; `clip-path:inset(4px)` retained a **24×24** bounding rect, yet `document.elementFromPoint(rect.left+2,rect.top+2)` **did not** hit the button while the center did. Computed dimensions can overstate transformed targets, and bounding rectangles can overstate clipped hit regions. This is a single-engine sampled-point demonstration, **not** a full hit-map, conformance verdict or real touch study. Also check overlays, rounded/irregular shapes, overlapping targets and stacking.

**Automation coverage trap — source-level resolution (2026-10-25):** In **axe-core 4.14.0**, `target-size` has `enabled:false` **and** `wcag22aa`/`wcag258` tags. The pinned `ruleShouldRun` implementation distinguishes **default execution** from **explicit selection**. Executing that exact function in an isolated JS harness (not the full axe engine) produced:

| Configuration | `target-size` selected? |
|---|---|
| `axe.run()` | **No** — disabled default |
| `runOnly: {type:'tag', values:['wcag22aa']}` | **Yes** — matching tag selects even disabled-by-default rule |
| `runOnly: {type:'rule', values:['target-size']}` | **Yes** — explicit rule ID has first precedence |
| `rules: {'target-size': {enabled:true}}` | **Yes** — explicit opt-in |
| WCAG 2.2 tag filter **plus** `rules: {'target-size': {enabled:false}}` | **No** — rule override wins over tag |

**Consequences for agents:** a green **bare default** scan misses this criterion; conversely, claiming every `wcag22aa` tag-filtered scan misses it is **incorrect for this pinned version**. The `wcag22aa` tag alone does **not** include all earlier WCAG A/AA criteria: use a cumulative, version-appropriate tag set and inspect the actual executed-rule inventory. A selected rule is not necessarily a reliable verdict: assert the rule's presence across `violations`, `passes`, `incomplete` or `inapplicable`, then test known 20×20px/0-gap failure and 20×20px/4-gap spacing controls in a **real browser**. Manually adjudicate five WCAG exceptions, hit geometry, hidden states and false negatives. Playwright's official sample tags stop at **2.1**. Deque's default-enable epic (#5225) remains open; performance subissue #5389 closed 2026-10-20.

**State/viewport acceptance:** Test dense toolbars, bottom navigation, small delete/close actions, menus after opening, responsive variants, transforms, clipping, and neighboring targets. Manually adjudicate all five exceptions. A still-open axe issue (#5183) reports an off-viewport false negative in **4.11.3** specifically for descendants of `position:fixed` ancestors; a maintainer confirmed that narrow scope, **not** a universal “all below-fold targets are ignored” claim. Reproduce fixed-root and normal-flow controls with the *current installed version* before treating the regression as present. Automated checks complement actual pointer-device and user evaluation.

**Evidence boundary:** W3C SC/Understanding, Playwright/Deque primary docs, pinned axe v4.14.0 metadata, exact upstream rule-selection function executed in an isolated JS harness, maintainer issues, and a separate Chromium geometry fixture. **No full axe runtime, cross-browser, real device, AT or usability comparison.** See sources and falsification plan in `research/`.

## Text-spacing overrides and line-clamped previews: DOM presence is not visual availability — 2026-10-25

**Decision contract:** WCAG 2.2 SC 1.4.12 (AA) does **not** require shipping 1.5 line height or extra letter/word spacing by default. It requires **no loss of content or functionality when users override all applicable spacing properties together**: line-height >= 1.5× font size; paragraph following-space >= 2×; letter spacing >= 0.12em; word spacing >= 0.16em. Some scripts do not use every property. Test this independently of text resize (1.4.4) and 320-CSS-px reflow (1.4.10); one passing test does not establish the others.

| Component | Preferred behavior | Failure / exception |
|---|---|---|
| Text-bearing cards, buttons, banners, settings labels | Let text wrap and the relevant container grow in the block direction; allow sibling layout to reflow | Fixed block-size plus `overflow:hidden`, absolute positioning, or tightly sized borders can clip or overlap text (W3C F104). `min-height` is not a cure if a parent remains height-constrained. |
| Compact one-line navigation/chips | Allow wrapping or a genuine expandable layout; reserve space only when the content domain is bounded | W3C C35 suggests a 20%-width allowance as a **heuristic** for short nonwrapping strings, not a universal localization/zoom guarantee. |
| Two-line previews and ellipsized summaries | Use clamping only for **optional previews**, with a clearly named, keyboard-operable way to reveal the **complete content** in the same task context | A clamp that looks fine before spacing can hide additional words after override. A full `textContent`, tooltip-on-hover, or inert “Read more” button does not establish visual or keyboard access. |
| Essential instructions, prices, validation errors, labels, consent text | Keep the full content directly available; avoid information-bearing truncation | If any clipping remains, verify an equivalent accessible presentation and that it still works after spacing, zoom, translation and focus changes. |

**Browser mechanics and evidence boundary (2026-10-25):** In a paired Linux headless Chromium **144.0.7559.96** + Playwright Python fixture (260px card; 16px Arial; 24px line height), the same sentence initially fit **48px / two lines** in all three implementations. After a stylesheet override of `line-height:1.5`, `letter-spacing:.12em`, `word-spacing:.16em`, and `p { margin-bottom:2em }`: (a) fixed `height:48px;overflow:hidden` retained **48px client geometry** but had **72px scrollHeight**; (b) auto-growing paragraph expanded **48→72px**; (c) prefixed two-line `-webkit-line-clamp` retained **48px** while its scrollHeight became **72px**. Clicking a *wired* `aria-expanded` disclosure that removed the clamp restored **72px** of visible paragraph. All variants retained the **same DOM text**; a DOM/text assertion alone would miss the visual loss. The fixture demonstrates a failure mode, **not** cross-browser conformance, screen-reader behavior, or a blanket prohibition on previews. A different paragraph may already be truncated before the override; test **whether full information remains obtainable**, not merely whether any ellipsis exists.

**Agent implementation and QA gate:** Apply the four spacing overrides **simultaneously** at 100% zoom in every responsive layout; inspect visible text, controls and overlap, then separately test 200% text resize and ~320 CSS px reflow/400% desktop zoom. Include longer translated labels, unbroken tokens, validation messages, cards in grids, sticky overlays and keyboard-only expand/collapse. For clamped text, assert the disclosure is reachable, activates, reveals all content and does not shift focus into an unusable position; use geometry (`scrollHeight`, `clientHeight`, bounding boxes) as *diagnostic evidence*, not as a universal automated WCAG verdict. The unprefixed `line-clamp` syntax remains limited availability in MDN's 2026 documentation; the specified legacy `-webkit-line-clamp` trio remains common but still needs rendered testing. Do not claim a passing axe scan or presence of text in the accessibility tree proves the complete text is visually readable.

**Primary evidence:** [WCAG 2.2 SC 1.4.12](https://www.w3.org/TR/WCAG22/#text-spacing); [W3C Understanding 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing); [W3C F104 failure](https://www.w3.org/WAI/WCAG22/Techniques/failures/F104); [W3C C36 expandable text](https://www.w3.org/WAI/WCAG22/Techniques/css/C36); [W3C C35 nonwrapping](https://www.w3.org/WAI/WCAG22/Techniques/css/C35); [MDN line-clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/line-clamp).


Translate design intelligence into implementable frontend behavior.

## Principle
Keep durable design guidance separate from fast-changing framework details.

Prefer the lowest-complexity platform primitive that preserves the required semantics, accessibility, resilience, and interaction quality. A newer API is not a UX improvement by itself.

## Chat/feed scroll anchoring: preserve the reader, follow only when invited — 2026-10-25

**Decision contract:** “Keep the current message in view” and “follow the newest message” are different requirements. A user reading history must not be dragged to the bottom by new messages; a user already following a stream may expect the tail to remain visible. Prepending history, appending messages, growing streamed content, resizing images and restoring a virtualized view must be tested independently.

| Situation | Intended behavior | Implementation boundary |
|---|---|---|
| Older items prepended while reading | Preserve the same visible message and its relative viewport position | Native CSS scroll anchoring often does this for a normal DOM list. For manual/virtualized layouts, capture a **stable item ID + visual offset** across the update, not just an index. |
| New items appended while reading older content | Do not scroll away from the user's position | Show an accessible “Jump to latest” control and, where useful, a new-message count. |
| New item appended / last item grows while already at the end | Follow only if **pinned before** the mutation | Use a small, tested end-distance threshold and stop following on intentional wheel/touch/keyboard scrolling. Avoid repeated smooth scroll during token streaming. |
| Item heights change or old rows are recycled | Preserve intended anchor without competing corrections | Measure dynamic rows; account for image/font loads, viewport/keyboard changes, virtualization and history restoration. |

**Native CSS is not a chat-follow API.** Scroll anchoring is enabled by default in supporting engines and adjusts the scroll offset to keep an eligible visible anchor stable when content above it changes. `overflow-anchor:none` excludes a subtree; a descendant cannot opt back in once its ancestor has opted out. The CSSWG draft also specifies suppression triggers (including ancestor size/position/transform changes and zero scroll offset). Do **not** globally disable anchoring as a “fix” for jumping, then manually add a prepend-height delta: if native compensation is still active, the two corrections can double-count. If explicit compensation is genuinely required, own the scroll container's policy and verify it against actual visible-item geometry. `overflow-anchor` is Baseline Newly Available **September 2026**; older browser support still matters.

**Isolated browser falsification (Linux Chromium 144, 2026-10-25):** In a 300px-high normal scroller containing twenty 60px rows, starting at `scrollTop=600`, prepending three rows left the same original row at viewport y=0 and changed `scrollTop` to **780** with default anchoring. With `overflow-anchor:none` on the scroller, it stayed **600** and the row jumped down **180px**. Putting `auto` on a descendant did not undo that exclusion. Adding another manual `scrollTop += 180` after native compensation instead produced **960** (double adjustment). At the original bottom (`scrollTop=901`), appending three rows did **not** automatically follow: the offset stayed 901 while the new maximum became 1081. A separate 1px end sentinel, with the message subtree excluded but **not** the scroller, did follow from 901 to **1081** when visible. That sentinel is a conditional technique, not a general replacement for history-prepend anchoring: in the same fixture it did **not** preserve a mid-list anchor on prepend. Geometry is not a screen-reader or user-outcome test.

**Virtualized feeds (TanStack Virtual current docs, reviewed 2026-10-25):** The official Chat guide recommends normal DOM order, persistent `getItemKey` IDs, `anchorTo:'end'`, `followOnAppend:true`, `scrollEndThreshold`, dynamic `measureElement`, `isAtEnd()` and `scrollToEnd()`. These are **library-specific capabilities**, not CSS defaults. A live `paddingEnd`/end-distance inconsistency is reported in issue #1258 (opened 2026-08-24): a padded chat can stop following as its final row grows. Treat the report as a version-specific regression candidate, not a universal confirmed defect; test the installed version with nonzero `paddingEnd`, a threshold smaller/equal/larger than that padding, and growing final messages. A separate append+trim count-neutral bug (#1271) was closed by #1272 on **2026-09-11**; do not perpetuate it as universally open. `scrollToEnd()` and manual scroll restoration can also race with measurement or user gestures; cancel in-flight programmatic scrolling on intentional user scroll.

**Accessibility and release gate:** A named `role="log"` is a W3C technique for sequential appended updates (`aria-live=polite`, `aria-atomic=false` implicitly), **not** a guarantee that a virtualized or token-by-token stream will be announced intelligibly. Preserve keyboard access to history, provide a labelled Jump-to-latest control, avoid focus theft, test bounded announcement frequency and screen-reader access to offscreen/removed rows. Assert visible-message ID and bounding rectangle before/after prepend, bottom distance before/after append and streaming resize, user-scroll interruption, async media resizing, mobile keyboard, zoom, browser Back and reduced motion. Distinguish browser DOM anchoring, library correction and application follow policy in bug reports.

**Evidence:** CSSWG Scroll Anchoring draft; MDN scroll-anchoring overview and `scrollTop`/`scrollHeight`; TanStack Virtual Chat/API; TanStack issue #1258 and closed #1271; W3C ARIA23. Local Chromium 144 DOM fixture only; no Firefox/WebKit, real mobile, AT, React/TanStack runtime or comparative task outcome testing.

## Preserved routes and Playwright locators: hidden DOM is not gone — 2026-10-25

**Decision:** define a *return-state policy* before assuming navigation remounts a page. Preserve a user's draft, selected filters and intentional reading position when returning; reset transient menus, completed one-shot forms, stale success/error banners and account-scoped data when their context expires. Restoring an interface is not the same as revalidating its data or authorization.

### Three different retention mechanisms

| Mechanism | What it preserves | Boundary for agents |
|---|---|---|
| Browser back/forward cache (bfcache) | A paused **whole document and JS heap** on eligible cross-document history traversal | `pageshow.persisted` identifies a bfcache restoration. Revalidate stale/sensitive views and reconnect resources on resume; do not rely on `unload` or assume every traversal is cached. |
| React `<Activity mode="hidden">` | Hidden DOM and component state; React cleans up Effects and recreates them on reveal | Unmount cleanup is **not** proof that DOM/input values were destroyed. Media/iframe and global-style side effects may survive unless handled explicitly. |
| Next.js App Router **with `cacheComponents: true`** | Recently visited page routes via Activity (current docs: **up to three**, then eviction) | This is conditional on the feature configuration and version; it is **not** universal Next.js or browser bfcache behavior. Fresh navigation and browser Back may have different reset requirements. |

Next's current guidance (reviewed 2026-10-25) recommends retaining drafts/filter panels, closing transient dropdowns on Activity hide, clearing completed creation forms after confirmed success, and scoping draft state to authenticated identity. It documents `useRouter().bfcacheId` as a **migration** key to reset on push/replace while retaining Back/Forward state; prefer targeted per-pattern reset rules for new code. Avoid an unconditional `form.reset()` on hide when an unsent draft should survive. A full reload can clear in-memory state but is not a substitute for server-side session invalidation or authorization checks. Browser bfcache can restore stale sensitive DOM even after an HTTP cache directive; treat `pageshow.persisted` as a trigger to revalidate or obscure sensitive content appropriately.

### Agent/browser-test trap: not all semantic locators exclude hidden routes

The current **Next.js preserving-state guide incorrectly groups Playwright `getByLabel` and `getByPlaceholder` with `getByRole` as automatically visibility-filtering**. In a controlled fixture with two identical labeled inputs (one inside `display:none`, one visible), Playwright Python **1.57.0** + Chromium **144.0.7559.96** returned:

| Locator | Matches | `fill()` with two duplicate inputs |
|---|---:|---|
| `get_by_role("textbox", name="Email")` | 1 (visible/ARIA-exposed) | Succeeded |
| `get_by_label("Email")` | 2 (including hidden) | **Strict-mode violation** |
| `get_by_placeholder("Search...")` | 2 (including hidden) | **Strict-mode violation** |
| `get_by_label("Email").filter(visible=True)` | 1 | Succeeded in a separate control |

A second fixture showed `get_by_role("button")` **included an `opacity:0` button** (which Playwright could click) but excluded an `aria-hidden="true"` button that was visually displayed. **ARIA-tree inclusion, Playwright actionability and human-visible pixels are different tests.** `getByRole` is useful for semantic targeting, not proof of perceptual visibility, correct focus or contrast.

**Implementation rule:** prefer an accessible role/name *within the active route or region*, and assert uniqueness/visibility before action. If label/placeholder targeting is necessary, scope to an active route container or apply an explicit visibility filter (JS: `.filter({ visible: true })`; Python: `.filter(visible=True)` on supported versions). Playwright **v1.63+** also documents `.visible()`; do not copy it into older pinned suites without checking the installed API. Do not “fix” duplicates with `.first()` or by disabling strictness: that can silently target the retained wrong route. Add negative controls for hidden duplicates, opacity-only invisibility, account switch, retained modal, draft return, completed-form return, route eviction and real browser Back/Forward. Verify keyboard focus and screen-reader announcements separately.

**Evidence boundary:** React and Next.js first-party documentation establish retention semantics; Playwright's official locator docs establish role-hidden filtering and explicit visible filtering; the counts/errors above are **isolated DOM fixtures**, not a running Next.js/React Activity application. The mismatch with Next's locator claim was reproduced only in Playwright Python 1.57/Chromium 144; repeat on current Playwright JS/Python and real Cache Components routes before asserting cross-version behavior. No cross-browser/AT or measured user-outcome test.

**Sources (checked 2026-10-25):** https://nextjs.org/docs/app/guides/preserving-ui-state ; https://react.dev/reference/react/Activity ; https://playwright.dev/docs/locators ; https://playwright.dev/docs/api/class-page ; https://playwright.dev/docs/api/class-locator ; https://web.dev/articles/bfcache ; https://github.com/vercel/next.js/discussions/88044 .

## Offscreen rendering: `content-visibility` is not virtualization — 2026-10-24

**Decision:** use `content-visibility: auto` as a *measured rendering optimization* for substantial, independent, often-offscreen sections; do not mistake it for lazy data fetching, DOM windowing, a hidden-state primitive, or an accessibility guarantee. The browser may skip layout/paint for an offscreen subtree, but the DOM and application state remain. The 2024 Chrome demo's ~7× initial rendering improvement is a **single synthetic example**, not an expected product gain.

| Task | Prefer | Why / boundary |
|---|---|---|
| Ordinary short page | Normal rendering | Containment and placeholder sizing add complexity without demonstrated benefit. |
| Long article, feed or dashboard with costly independent sections | `content-visibility: auto` on *section-sized chunks*, after profiling | The containing element must actually become offscreen; applying it to one always-visible parent prevents skipping. |
| Thousands of mounted, interactive rows with DOM/memory pressure | Measured list/grid virtualization or pagination | `content-visibility` does not unmount nodes, shrink state, or reduce network payload. Virtualization needs separate keyboard, focus and list-position semantics. |
| Collapsed panel, inactive tab or permission-hidden content | Correct state/visibility semantics, not `auto` | `auto` deliberately keeps content findable/focusable. `content-visibility: hidden` excludes descendants from find/focus; it is not a universal replacement for semantic `hidden`/`inert`. `hidden="until-found"` is a different HTML feature with limited browser support. |

### Size and layout contract

```css
/* Apply to independent long-form sections after profiling; estimate from real content. */
.long-report > section {
  content-visibility: auto;
  contain-intrinsic-block-size: auto 28rem;
}
```

- Use a **plausible block-axis estimate** (`contain-intrinsic-block-size`) rather than copying `contain-intrinsic-size: auto 500px` indiscriminately: the shorthand's single value applies to *both* dimensions. `auto <length>` remembers a section's previously rendered size, but the initial fallback can still be wrong. MDN demonstrates large estimates causing **scrollbar/scroll-position jumps**; `auto none` can be worse for initial positioning. Images, fonts, expanded content, localization and responsive widths change actual heights.
- The CSS containment draft says `scrollIntoView()` may calculate a skipped target's location using placeholder geometry; after it renders, alignment can differ. Focusing a skipped descendant first makes it relevant and may give different geometry. Test fragment links, search, deep links, focus and scroll restoration separately; do not infer correctness from one screenshot.
- Containment persists in part even while the section is onscreen; test layout dependencies, sticky/floating descendants, intrinsic sizing and any code that measures descendants. The draft specifies that skipped descendants do not contribute to `innerText`, and an `IntersectionObserver` target *inside* skipped contents is not intersecting. Do not use visual-render state as a data-completeness test.

### Accessibility and state boundary — important standards/documentation tension

- MDN says `auto` content remains in the DOM/accessibility tree and supports find-in-page, selection and keyboard focus. **Qualification:** the current CSS Containment Level 2 editor's draft permits a user agent to **omit skipped descendants from the accessibility tree** if exposing them would require extra layout work that leaks assistive-technology use through timing. Thus, neither a blanket 'AT always sees all offscreen content' nor 'offscreen content is inaccessible' is a safe cross-browser assertion. Verify target browser/AT combinations and navigation to newly relevant content.
- MDN also warns that `display: none`/`visibility: hidden` *inside a skipped subtree* can fail to hide intended elements from the accessibility tree because those descendant styles have not been rendered. Keep semantic hidden-state and focusability correct for the actual conditional child; use explicit `aria-hidden` only on genuinely noninteractive hidden content, **never on a focusable subtree**. Test hidden controls and duplicate landmarks in the accessibility tree, not just visual pixels.
- `contentvisibilityautostatechange` can suspend expensive canvas painting when `event.skipped` is true; it is **not** permission to stop semantic DOM/data updates. An offscreen subtree can still be used by assistive technology, find-in-page and focus. Animations in skipped content may pause; do not make task state depend on their ticks.

### Agent acceptance / falsification

Run the same seeded long-page fixture with and without the rule in current Chrome, Firefox and Safari, including a clean small-page control. Record initial render work, scroll-frame responsiveness, INP where eligible, CLS/scroll displacement, DOM count/memory, and time-to-usable offscreen interaction; do not claim a gain without an actual trace. Seed wildly wrong height estimates, dynamically expanded content, font/image loads, programmatic scroll, deep links, find-in-page, keyboard Tab, screen-reader headings/landmarks, intentionally CSS-hidden nested controls, canvas updates, and a large virtualized alternative. Check both false-positive a11y exposure and missing content. **No browser/AT benchmark was performed in this research cycle.**

**Evidence boundary:** CSSWG editor's draft defines relevant/focus/top-layer behavior and a privacy-driven accessibility-tree exception; MDN documents practical implementation and size-jump examples; Chrome's published demo shows *possible* speedup, not a transferable outcome estimate. Feature availability is broad on modern engines (MDN Baseline 2024), but exact behavior and old-browser support still need target testing.

**Primary sources (reviewed 2026-10-24):** https://drafts.csswg.org/css-contain/ ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/contain-intrinsic-size ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/contain-intrinsic-block-size ; https://developer.mozilla.org/en-US/docs/Web/API/Element/contentvisibilityautostatechange_event ; https://web.dev/blog/css-content-visibility-baseline ; https://web.dev/articles/virtualize-long-lists-react-window ; https://html.spec.whatwg.org/dev/interaction.html .
## Interaction responsiveness: optimize the next paint, not just the event handler — 2026-10-23

**Decision:** treat interaction responsiveness as a measurable product contract. A button can have correct semantics, attractive animation, and a successful API response while still *feeling broken* if the first visual response is blocked. Conversely, a fast INP does **not** prove the requested operation completed quickly or correctly.

### Diagnose the phase before prescribing a fix

- **Interaction to Next Paint (INP)** measures eligible clicks/taps/keyboard interactions from input through the next presented frame; it does not measure the eventual network result, and scrolling/zooming are not INP interactions. Google's Core Web Vitals guidance defines **≤200 ms good, >500 ms poor**, assessed at the **75th percentile of page visits**, separately for mobile and desktop. It is a field distribution target, **not** a promise that every interaction will finish within 200 ms. An interaction-free visit has no INP.
- Split a slow interaction into **input delay** (the main thread was busy before handlers could start), **processing duration** (handlers), and **presentation delay** (rendering/paint). Do not “optimize the click handler” when the real cause is earlier analytics work, a large DOM/layout change, or a third-party script. A fast Lighthouse load score or LCP is not evidence of responsive *later* interactions.
- **Field first, lab second:** use a consent-appropriate RUM sample or CrUX for real-user distributions, and the maintained `web-vitals/attribution` build for interaction target/phase diagnostics where supported. Register `onINP` once per page lifecycle, deduplicate reports, and do not assume a callback fires without an interaction. Attribution's `reportAllChanges` reports changes to the *worst metric*, **not every click**. Avoid collecting raw input values, sensitive URLs, user-identifying selectors, or entire DOM snapshots. In Chrome DevTools reproduce the affected journey on constrained CPU/device and inspect the INP breakdown, long tasks, forced reflows, and expensive style/layout work.
- The **Event Timing API** is newly broadly supported on modern browsers (MDN Baseline 2025), but **Long Animation Frames (LoAF)** script attribution and the **Scheduler API** remain limited-availability. Feature-detect them; absent LoAF attribution does not mean there was no long frame. `web-vitals`/CrUX coverage is not a substitute for direct Safari, Firefox, keyboard, touch and assistive-technology checks.

### Choose the remedy by the bottleneck

| Observed bottleneck | Appropriate intervention | Misleading shortcut |
|---|---|---|
| Input delay from competing long tasks | Remove unnecessary startup/third-party work; move suitable pure computation to a worker; chunk background tasks with real task-boundary yields. | Adding a spinner inside the delayed handler (it cannot paint before the handler starts). |
| Handler processing blocks paint | Keep urgent state feedback small; defer unrelated heavy work; partition computation into bounded chunks. | `await Promise.resolve()`: microtasks do **not** yield a rendering opportunity. |
| Presentation delay from rendering | Profile style/layout/paint, reduce synchronous DOM churn, avoid layout read/write thrashing, scope large updates. | Moving heavy work into `requestAnimationFrame`: callbacks run **before** paint and can delay INP. |
| Expensive React update competes with typing | Update controlled input synchronously; use `useDeferredValue` or a Transition for **non-urgent dependent rendering** when appropriate. | Putting controlled-input state in `startTransition`, or assuming Transitions defer arbitrary synchronous CPU work. |
| Network/server operation is slow | Paint an honest pending state, keep usable context, support cancellation/retry and distinguish accepted from saved/completed. | Treating a good INP or immediate optimistic animation as proof of persistence. |

**Scheduling boundary (2026-10-23):** `scheduler.yield()` can yield to a prioritized continuation **where supported**, but is not Baseline; use feature detection and a tested task-boundary fallback (e.g. a timer) when chunking is necessary. Do not replace it with `navigator.scheduling.isInputPending()`: MDN marks that older API **deprecated** because it can return false and miss reasons to yield. Yielding does not turn CPU-heavy synchronous loops into worker threads, and overly frequent yields can increase total completion time. Prefer less work over clever scheduling.

### Agent regression gate

1. Reproduce a realistic **slow interaction** and a **clean control** at startup, after load, and after a long session; include slow device, large dataset, background work and a third-party-script variant.
2. Capture the triggering control, route/state, interaction type, phase attribution, long-task/LoAF evidence where available, and the actual **first visible feedback**. Re-test keyboard activation, screen-reader announcement, focus, and the eventual success/error path.
3. Compare before/after **field INP distribution** when possible, plus reproducible lab traces and user-visible task completion. Reject “improvements” that merely hide the wait, drop events, lose input, freeze a progress indicator, or trade away accessibility/correctness. Do not certify a change from one fast local trace.
4. Keep telemetry privacy- and consent-aware; log aggregated timings and safe component identifiers, not typed text or unreviewed selectors.

**Evidence boundary:** Chrome/web.dev defines INP and practical diagnostics; MDN documents browser/API limits; React documents Transition constraints; Shopify independently describes real storefront main-thread competition. These are implementation/measurement sources, **not** a controlled trial showing that any one optimization improves every app. No local browser benchmark was run in this cycle.

**Primary references:** [web.dev INP](https://web.dev/articles/optimize-inp), [web.dev long tasks](https://web.dev/articles/optimize-long-tasks), [Chrome INP breakdown](https://developer.chrome.com/docs/performance/insights), [web-vitals attribution and reporting](https://github.com/GoogleChrome/web-vitals), [MDN Event Timing](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming), [MDN LoAF](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongAnimationFrameTiming), [MDN scheduler.yield](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield), [MDN isInputPending deprecation](https://developer.mozilla.org/en-US/docs/Web/API/Scheduling/isInputPending), [React transitions](https://react.dev/reference/react/useTransition), [Shopify INP](https://shopify.dev/docs/storefronts/themes/best-practices/performance/understanding-inp).

## CSS cascade boundaries for agent-authored interfaces — 2026-10-23

**Decision:** use **cascade layers to declare precedence between style sources** and **`@scope` to constrain which descendants a selector can match**. They solve different problems; neither is a security boundary, Shadow DOM substitute, design-system contract, or guarantee against regressions. Before an agent adds another selector or `!important`, inspect the computed declaration's **origin → importance → layer → specificity → scoping proximity → source order**.

### Layer contract: make ownership and override intent explicit

- Define named layer order once, before any stylesheet creates those names. For normal author declarations, **later layers win over earlier layers regardless of selector specificity**. **Unlayered normal declarations beat every layered normal declaration**, even if they appear first. For `!important`, layer precedence reverses: earlier important layers beat later important layers, and layered important declarations beat unlayered important ones. Do not assume “later stylesheet wins” or that a more specific component selector beats a utility in a later layer.
- A small project can use `@layer reset, vendor, base, components, utilities, overrides;` if that matches its *actual* CSS pipeline. Put third-party styles in a deliberately lower-priority layer when feasible; do not scatter unlayered “quick fixes,” which silently outrank normal layered styles. An explicit `overrides` layer should be exceptional, not the default destination for agent patches. Inspect built CSS: first creation establishes layer order, and later `@layer` statements do **not** reorder existing layers.
- `@import "vendor.css" layer(vendor);` can place a stylesheet into a layer, but CSS `@import` must precede ordinary rules and may add a request dependency; prefer a bundler-supported integration when appropriate. Avoid creating layers conditionally under `@media`/`@supports`, because first-creation order can then vary with the environment.
- **Framework version matters:** Tailwind v4 uses *native CSS cascade layers*; its official Preflight example declares `theme, base, components, utilities`, and custom utilities use `@utility`. Tailwind v3's `@layer` was a **build-time directive** with different relocation/purging behavior. Do not paste v3 layer recipes into v4 or declare a competing global order without inspecting generated output and the framework version. CSS Modules and scoped component styles can coexist with layers; their name isolation does not establish cross-source cascade priority.

```css
/* Example for a project that owns this stylesheet and is not importing
   a framework with its own layer order. */
@layer reset, vendor, base, components, utilities, overrides;

@layer components {
  @scope (.result-card) to (.embedded-content) {
    .title { font-weight: 650; }
    :scope { border: 1px solid var(--border-subtle); }
  }
}
```

### Scope contract: selector reach is not style isolation

- `@scope (.result-card) to (.embedded-content)` matches descendants within the card **except** the lower-bound subtree. It is useful for nested/reused components and rich user content that must not receive internal selectors. **Inherited properties** (e.g. `color`, `font-family`, custom properties) still cross that boundary; a donut scope does not reset them.
- A scoped selector like `.title` does **not** automatically match the scope root itself. Use `:scope` to style the root; `:scope` adds pseudo-class specificity, whereas the scope prelude itself does not increase specificity. Be cautious with nested `&`: MDN documents engine/version differences in its specificity inside scoped blocks.
- **Proximity is a tie-breaker, not a superpower.** A nearer scope wins only after origin, importance, layer and specificity are tied. If a more specific rule or higher-precedence layer wins, proximity cannot rescue the nested component.
- `@scope` is Baseline *newly available* as of March 2026, not a safe assumption for all deployed devices. Unsupported browsers ignore its block: keep essential layout/control usability in broadly supported fallback selectors, then use `@scope` for enhancement where appropriate. A documented Safari **26.0–26.3** regression affected scoped styling of inputs/textareas with UA shadow roots; the compatibility report says it was fixed in **26.4**. Test the actual support matrix rather than relying only on feature-family badges.

### Verification and limits

For a new agent patch, inspect **computed styles and matched-rule origins/layers** for: nested cards, third-party widgets, light/dark themes, user-generated content, form controls, hover/focus-visible/disabled states, and a high-contrast/forced-colors configuration. Test a deliberate specificity conflict, an unlayered declaration, an important declaration, and a scope-boundary inheritance case; capture before/after visuals at narrow and wide sizes. Do not “fix” a failure by removing focus outlines, overriding user-important styles, or broad `all: unset` resets. `revert-layer` rolls back the current cascade layer, **not** necessarily to browser defaults; verify its result in DevTools. A passing build or screenshot cannot establish correct cascade behavior across states.

**Evidence boundary:** MDN and browser-vendor docs establish the cascade, scoping and support mechanics; Tailwind's versioned docs establish its integration. The Safari regression is an issue/compatibility report with a reproducer, not a cross-browser benchmark. The proposed layer order and agent QA gate are synthesis, not experimentally proven improvements to AI output. No runtime browser matrix or comparative agent experiment was executed in this cycle.

**Primary sources (reviewed 2026-10-23):** [MDN cascade layers](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers), [MDN `@layer`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40layer), [MDN `@scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40scope), [Chrome scope selector-isolation warning](https://developer.chrome.com/docs/css-ui/at-scope), [MDN `revert-layer`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/revert-layer), [Tailwind v4 Preflight](https://tailwindcss.com/docs/preflight), [Tailwind v4 upgrade semantics](https://tailwindcss.com/docs/upgrade-guide), [Tailwind v3 layer behavior](https://v3.tailwindcss.com/docs/adding-custom-styles), [Safari scope regression report](https://github.com/mdn/browser-compat-data/issues/29259).

## Localized dynamic messages: grammar is data, not string concatenation — 2026-10-25

**Decision:** For counts, ordinals, dates, prices, notifications and mixed-direction user values, translate a **complete message with typed placeholders and locale-specific variants**. Do not assemble English fragments (`count + " items"`), translate nouns independently, or assume every language has only singular/plural. Keep locale, plural selection, number display, text direction and message-rendering runtime explicit.

### Three different contracts

1. **Grammar/selection:** CLDR cardinal and ordinal categories are locale-specific (`zero/one/two/few/many/other`); `other` is mandatory, not necessarily English “plural.” In Spanish, CLDR 49 includes `many` for exact whole millions, so even a seemingly two-form locale is not safe to hard-code. Distinguish a product-specific **exact zero** (“No results”) from a locale's grammatical `zero` category. FormatJS ICU `=0` and i18next `_zero` are exact-zero overrides, not equivalent to CLDR's `zero` category.
2. **Numeric presentation:** A plural category can depend on **displayed precision** and rounding, not just the mathematical value. `Intl.PluralRules` accepts digit options. In an isolated Node 22.16.0 / ICU 77.1 / CLDR 47 probe, Spanish `select(1000000)` returned `many`, but `minimumFractionDigits: 1, maximumFractionDigits: 1` returned `other`; Russian `select(1)` returned `one`, but with one forced fractional digit returned `other`. `maximumFractionDigits: 0` even changed the category for `1.2` after rounding. **Use consistent formatting and selection options**; test real UI text, not only isolated category keys. JS `Number(1.0)` cannot preserve the source's trailing-zero intent; CLDR's `v` operand explicitly distinguishes `1` from `1.0`. Preserve precision metadata where it changes copy.
3. **Runtime/transport:** Unicode **MessageFormat 2 is a stable CLDR specification** (including CLDR 49's now-stable `:currency` and `:percent` functions), but that does **not** make `Intl.MessageFormat` a shipping browser primitive: the official TC39 proposal is still **Stage 1** as checked 2026-10-25. FormatJS/React Intl currently documents ICU MessageFormat syntax (MF1); i18next uses `Intl.PluralRules` with `count` and suffixed keys; MF2 libraries are separate opt-in implementations. Do not mix their syntax, compatibility claims or error/fallback behavior. Pin parser, catalog schema, locale data and library version for SSR/client consistency.

### Agent implementation gate

- Choose the actual message engine **before** generating translations. Store complete, context-rich message units with stable IDs, translator notes and explicit placeholders. Use plural/select/ordinal forms supplied by the engine; avoid splitting a sentence around a component or using `+ "s"`. For rich text, bind translator-controlled tags to an **allowlisted component map**, not arbitrary HTML or unreviewed URLs.
- Localize *semantic meaning* as well as strings: `0` may warrant a task-specific empty-state sentence; currencies/percentages must preserve units, rounding and amount semantics; grammatical agreement may affect the **whole sentence**. Never silently change a financial value to make the displayed grammar work.
- In mixed RTL/LTR output, isolate user-supplied names, IDs, links and formatted numbers. CLDR MF2 specifies default bidi isolation for formatted strings, but do **not** assume MF1, a custom formatter or DOM rich-text renderer applies it. Use `<bdi>`/`dir="auto"` or a verified formatter strategy where appropriate; preserve the correct base `lang` and `dir`.
- Test locale switching, missing keys/arguments, escaping, long/pseudolocalized strings, RTL punctuation, accessibility announcements, and server/client hydration. Seed counts `0, 1, 2, 5, 11, 21, 1.2, 1_000_000` plus `1` displayed with 0 vs 1 fraction digit; include ordinal and range cases. Compare **rendered text and meaning**, not only key existence. Confirm translators can reorder placeholders without changing behavior.
- Treat CLDR releases as versioned behavior changes. **CLDR 49 was released 2026-10-22** and updated plural/ordinal rules for `af, bg, es, fr, gl, nn, tg, vi`. Different server/browser ICU data can select different branches. A potential hydration or copy mismatch is an **integration risk**, not a reproduced bug here; pin or test both runtimes before asserting parity.

**Evidence boundary:** CLDR 49 normative spec and release notes; TC39 proposal and official FormatJS/i18next docs; isolated Node probe (not a browser/React hydration test). No translator usability study, cross-engine reproduction or measured task improvement. The fact that MF2 is standardized does not prove current libraries implement all CLDR 49 behavior.

Primary sources: https://cldr.unicode.org/downloads/cldr-49 ; https://www.unicode.org/reports/tr35/tr35-messageFormat.html ; https://unicode.org/reports/tr35/tr35-numbers.html ; https://unicode.org/cldr/charts/49/supplemental/language_plural_rules.html ; https://github.com/tc39/proposal-intl-messageformat ; https://formatjs.github.io/docs/core-concepts/icu-syntax/ ; https://www.i18next.com/translation-function/plurals ; https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/PluralRules .

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

## Keyboard focus behind sticky UI: scroll offset is not scrollable space — 2026-10-25

**Decision:** for fixed/sticky headers, bottom navigation, cookie bars and persistent non-modal overlays, keep every keyboard-focused control *visibly usable* at the actual viewport and scroll-owner boundary. `scroll-padding` is a **scroll alignment inset**, not extra document height and not an occlusion detector. Treat the author overlay's geometry, remaining scroll range, and focus mechanism as separate obligations.

1. **Choose the actual scroller.** Set `scroll-padding-block-start/end` on `html` for document scrolling or on the `overflow:auto` app-shell pane for internal scrolling. The property is not inherited; setting it on `body` or on the root when an inner pane owns scrolling is not a substitute. Use `scroll-margin-block-*` for exceptional individual targets; it also cannot create missing scroll range.
2. **Reserve reachable end space.** A fixed footer can cover the last input even with correct `scroll-padding-bottom` if the document has reached maximum scroll. When the footer overlays document content, add corresponding **physical** end padding to the scrollable content and scroll-padding to its scroll container (W3C technique C43 does both). Do not add a redundant spacer for a footer already in flow. Recompute the clearance when bars change size or disappear; account for safe areas without assuming the OS keyboard is author content.
3. **Do not assume all focus paths scroll.** `focus({preventScroll:true})` intentionally bypasses native scrolling; explicit `scrollIntoView({block:'nearest'})` can align differently from Tab or `focus()`. Test real Tab **and Shift+Tab**, programmatic focus after errors/dialog closure, fragments, nested scrollers, overlays that appear after focus, and zoom/reflow. A CSS inset cannot prevent a floating chat widget from covering an already focused control in an arbitrary position; reflow, reposition or dismiss the overlay instead.
4. **Avoid an unusable sliver.** At narrow/short viewports or 200–400% zoom, unfix/collapse bulky bars when there is insufficient remaining space (W3C C34). A visually exposed few pixels can technically meet WCAG **2.4.11 AA** (not *entirely* obscured) yet still be poor UX; **2.4.12 AAA** disallows *any* authored overlap. Evaluate the component separately from the visible focus indicator (2.4.7 / 1.4.11 / 2.4.13). User-opened, dismissible content has a narrow WCAG exception; it is not permission for permanent surprise overlays.

Example **only when a fixed 11.25rem footer overlays the document** (adapt the real scroller and dynamic height):

```css
html { scroll-padding-block-end: var(--footer-clearance, 11.25rem); }
body { padding-block-end: var(--footer-clearance, 11.25rem); }
```

**Chromium 144 falsification (Linux headless, Playwright Python; 600×600 viewport):** a 180px fixed footer starts at y=420. A last-page button at document y=1154–1190 remained **fully covered** after `focus()` with `html{scroll-padding-bottom:180px}` alone (maximum scroll=600; button y=554–590). Adding 180px physical root padding *as well* expanded max scroll to 780 and placed the focused button at y=374–410, clear of the footer. For a mid-page button at y=530–566, scroll-padding alone corrected Tab/`focus()` (to y=192–228), whereas no inset left it covered. In an `overflow:auto` pane, root padding did not help; padding on the inner scroller did. `focus({preventScroll:true})` left the covered button in place. These are **isolated Chromium mechanics**, not a Firefox/Safari or screen-reader conformance test.

**QA gate:** test the *first and last* focusable items, both directions, nested panes, a footer appearing/disappearing, dynamic text/zoom, modal and non-modal overlays, focus restoration and no-JS/old-browser fallbacks. Inspect rendered overlap and focus ring, not just `document.activeElement`, scroll coordinates or an axe pass. Verify the product remains operable without unnecessary modality or excess blank space.

**Primary sources:** [W3C WCAG 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum), [C43 paired physical padding + scroll-padding](https://www.w3.org/WAI/WCAG22/Techniques/css/C43), [C34 unfixing at small viewports](https://www.w3.org/WAI/WCAG22/Techniques/css/C34), [WCAG 2.4.12](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced), [MDN scroll-padding](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-padding), [MDN scrollIntoView](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView), [CSSWG #5066](https://github.com/w3c/csswg-drafts/issues/5066) (historical closed focus-scroll discussion, not an active defect).

## Visual regression is a state-coverage test, not a screenshot pass — 2026-10-13

**Decision:** visual diffs answer “did the rendered pixels change relative to an approved baseline?” They do not answer “is this the correct state, good design, accessible, or functionally complete?” A stable screenshot can be a stable **wrong** state.

For AI coding/design agents, use this capture contract:

1. **Name the target:** route/component, user state, theme, viewport, browser, locale, data fixture, and expected visual outcome. Assert that the *intended* state is rendered (dialog open, error shown, async result settled) **before** capture. Do not let a screenshot replace the state assertion.
2. **Control determinism:** fix clocks/data/locale and external resources where possible; pin browser/OS/fonts/viewport/DPR. Playwright warns that screenshots differ across rendering environments. Its `toHaveScreenshot()` waits for two consecutive matching captures, which establishes stability, **not correctness**.
3. **Stabilize narrowly, without changing the state being tested:** Playwright screenshot *assertions* default to `animations: 'disabled'` (direct `page.screenshot()` defaults to `allow`); finite transitions are fast-forwarded and fire `transitionend`, so capture can invoke application callbacks and mutate the DOM. Its `stylePath` and masks can suppress volatile regions. Chromatic pauses CSS animation/video/GIF but cannot automatically stop JS-driven animation. Prefer deterministic fixtures to broad masking or arbitrary sleeps: masking a region can hide a regression.
4. **Capture intermediate states deliberately:** Chromatic waits for Storybook `play()` to finish and captures **only its final state**. Create separate stories or explicit E2E snapshots for intermediate loading, validation, menu-open, focus and recovery states. A passing default story does not cover them.
5. **Treat sensitivity as a trade-off:** permissive pixel/color thresholds suppress noise *and* small real regressions. Review diffs before approving baseline changes; do not automatically bless all snapshots after a code edit. Keep clean controls and known-defect cases in CI to detect false-green configurations.
6. **Respect the data boundary:** Chromatic can upload published Storybook output or re-renderable E2E archives containing HTML, assets and test data. Its vendor statement that it does not store source code does **not** mean a captured authenticated UI contains no secrets. Use synthetic fixtures, review network/data exposure and access policy, or stay with local Playwright when confidentiality requires it.

**Capture-time side-effect falsification (2026-10-25):** In a minimal Linux headless **Chromium 144.0.7559.96 / Playwright Python 1.57.0** fixture, a toast had a **20-second opacity transition** and a `transitionend` handler that removed it and changed a status label. In **three repeated paired runs**, after ~120 ms the toast was still mounted in both controls. `page.screenshot(animations='allow')` returned in ~0.06–0.08 s and left it mounted; `animations='disabled'` returned in ~0.02 s, fired `transitionend` with `elapsedTime=20`, removed the toast and changed the label. This is **documented Playwright behavior**, not evidence of a Playwright bug or a general cross-browser outcome. It demonstrates that a visual capture can erase the very transient state an agent meant to inspect and change later functional assertions. Assert the target state **before and after** capture; for an intentionally in-progress state use `animations: 'allow'` with controlled timing, or a purpose-built deterministic test mode that does not fire completion callbacks. Keep a separate real-time journey test; do not couple essential state correctness solely to animation completion events. [Playwright assertion API](https://playwright.dev/docs/api/class-pageassertions), [direct screenshot API](https://playwright.dev/docs/api/class-page), [MDN transitionend](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event).

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

### Modal popover portal trap: top-layer paint is not modality ownership (Chromium 144, 2026-10-26)

**Decision:** An overlay invoked *from* a modal must remain in that modal's **flat-tree subtree** if it needs to be interactive. A `popover` appended to `document.body` by a generic React/portal overlay root may be visibly open in the top layer yet **effectively inert** because `showModal()` blocks everything outside the dialog. An invoker inside the modal with `popovertarget` does **not** grant the external popover an inertness exemption. This is a DOM ownership issue, not a `z-index`, anchor-positioning or popover dismissal issue.

**Controlled falsification (Chromium 144.0.7559.96/Linux, Playwright, three fresh pages per cell):** An identical button-driven popover was mounted either under the modal's DOM subtree or under a sibling `<div>` in `body`; the dialog was opened with `showModal()` or non-modally with `show()`. Both `popover="auto"` and `popover="manual"` were tested.

| Dialog / popover DOM location | `auto` action clickable? | `manual` action clickable? |
|---|---|---|
| Modal `showModal()`, inside dialog | **Yes (3/3)** | **Yes (3/3)** |
| Modal `showModal()`, body portal outside dialog | **No (0/3)** | **No (0/3)** |
| Non-modal `show()`, inside dialog | **Yes (3/3)** | **Yes (3/3)** |
| Non-modal `show()`, body portal | **Yes (3/3)** | **Yes (3/3)** |

All eight variants matched `:popover-open`. In the blocked modal/body-portal variants, `elementFromPoint()` at the popover button's center hit the **dialog**, Playwright's real pointer click timed out, and programmatic `.focus()` left focus on the invoker. Yet the action's own `.inert` property was `false` and computed `pointer-events` was `auto`: neither is a reliable effective-interactivity test. Switching to `popover="manual"` **did not fix** the blocked interaction; it only changes dismissal behavior. This contradicts simplistic “use manual popover inside modals” advice when the actual problem is a body-level portal.

**Implementation contract for coding agents:**
1. Render interactive dropdowns, calendars, combobox lists, contextual menus and other popovers into a **modal-scoped portal container inside the dialog**, or directly as descendants. In React, choose a portal container under the active `<dialog>` rather than the application's default `document.body` overlay root. CSS top-layer promotion still allows the nested popover to escape clipping; no external body portal is needed merely for stacking.
2. Do not “fix” this by downgrading `showModal()` to `show()` unless non-modality is genuinely the intended workflow. `aria-owns`, `popovertarget`, `z-index`, and `manual` are not substitutes for correct DOM/modal ownership.
3. Exercise the **real** action: open the modal, open the popover, click its item, Tab/Shift+Tab through it, Escape/light-dismiss as appropriate, close/reopen the modal, and verify focus return and overlay cleanup. A screenshot, `:popover-open`, computed CSS, or DOM `.inert` alone can falsely pass. Test external toast/notification portals separately; an interactive global toast above a modal may be inert even if visible. Keep critical status/choices inside the active modal or defer them.
4. Do not overgeneralize: the experiment is **Chromium-only** and does not measure screen-reader speech, React portal-library behavior, or user outcomes. WHATWG issues [#10811](https://github.com/whatwg/html/issues/10811) and [#9936](https://github.com/whatwg/html/issues/9936) remain open as of 2026-10-26; the standards discussion may change future engine behavior.

**Evidence:** [MDN `showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) (only dialog descendants escape document inertness); [WHATWG #10811](https://github.com/whatwg/html/issues/10811) (same modal/portal failure and `manual` toast example); [WHATWG #9936](https://github.com/whatwg/html/issues/9936) (open standards concern); [MDN popover guide](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using) (top-layer and auto/manual contracts). Browser matrix above is an isolated, repeated fixture, **not** cross-engine conformance evidence.

### Interest invokers: optional preview, not the only path to content — reviewed 2026-10-24

**Decision:** use `interestfor` as a **progressive enhancement for supplementary hover/focus/touch previews**, not as the sole path to necessary information, editing or actions. A hovercard may reduce navigation cost; it can also obscure controls, distract keyboard users and exclude browsers or input methods. Preserve a direct link or visible tap/click disclosure. Do not mistake an interest-triggered popover for a modal dialog or a fully specified tooltip/menu widget.

**Actual platform boundary:** Chrome/Edge 142 shipped `interestfor` in October 2025; Firefox and Safari have not shipped it as of this review. The WHATWG HTML integration PR #11006 is **still open** (2026-10-24), and the Open UI explainer was updated **2026-10-16**. Its proposed touch and accessibility mappings are not proof of interoperable behavior. `popover="hint"` and CSS `::interest-button` have their **own** support/standardization boundaries. Feature-detect `Object.hasOwn(HTMLButtonElement.prototype, "interestForElement")`, but a positive result is not an AT/browser-variant test. Supported invokers are enabled `<button>`, `<a href>`, `<area href>` and SVG `<a href>`; not a generic `div` or `input`.

| Need | Preferred interaction | Why not interest-only? |
|---|---|---|
| Nonessential definition or link preview | Short interest-triggered plain hint, with an independently understandable link/control | On unsupported browsers the preview never opens; essential labels cannot depend on hover. |
| Rich profile/card with buttons | Visible click/tap disclosure or full destination; optionally preview on interest | Rich content needs discoverable keyboard traversal, focus, dismissal and touch affordances, not just floating geometry. |
| Consequential action, form, permission or private record | Explicit activation with appropriate dialog/popover semantics and authorization | Passive hover/focus must never submit, change state or reveal privileged data. |
| Primary mobile navigation or required help | Always-visible button/link or equivalent touch-first disclosure | Long-press is not an adequate sole affordance; context menus and platform gestures differ. |

**Counterexample to simplistic “native = accessible”:** WAI-ARIA APG's *work-in-progress* tooltip pattern says a tooltip does **not** receive focus and focusable hover content should use a non-modal dialog. The **2026-10-16 Open UI proposal** instead distinguishes *plain hints* (exposed as invoker name/description) from *rich hints* (proposed `aria-details`, `aria-expanded` and focus-order behavior; minimum role `tooltip`). These are different layers of guidance, not evidence that every Chromium/screen-reader pair implements the proposed mapping. For a rich hovercard, explicitly inspect the accessibility tree, actual Tab/Shift+Tab traversal, announced relationship and focus return; never add `role="tooltip"` to an interactive card merely because it looks like a tooltip. Avoid redundant/contradictory author `aria-describedby` or `aria-details` when the browser supplies its own mapping.

**Interaction and fallback contract:**
1. Keep the trigger's primary action unchanged. On a link, click navigates; on a button, choose an explicit click action separately. The explainer proposes `interestfor` plus `commandfor` with `command="show-popover"` for “hover to preview, click to pin”, but test the **exact shipped combination** and avoid assuming it works on Firefox/Safari. A separate visible `popovertarget` button or destination link is a simpler cross-browser baseline.
2. Native interest follows pointer hover or keyboard focus after a delay; the target remains open while hovered/focused and Escape cancels interest. W3C WCAG 2.2 SC **1.4.13** independently requires author-controlled hover/focus content to be **dismissible, hoverable and persistent** (with stated exceptions). Test pointer travel to the card, zoom/magnification, accidental keyboard popups and focus order. Do not force zero delay for every trigger.
3. Touch is **not simply hover emulation**. The current Open UI proposal describes a “Show details” item in link long-press context menus and immediate interest on some button long-presses; the optional `::interest-button` is still being specified. The maintainer's BSD-3-Clause `mfreed7/interestfor` polyfill explicitly **cannot reproduce link long-press** without sacrificing the browser's native context menu. If using it, review/pin its source and keep a visible touch alternative; polyfill parity is not native parity.
4. Interest events are not authorization. Never mutate data on `interest`; if loading previews, gate private records server-side, minimize/abort speculative requests, avoid leaking sensitive content through shared caches and do not interpret transient hover as consent. This is an engineering risk inference, not a documented exploit.
5. Avoid hand-wired `mouseenter` + focus handlers where native behavior suffices, but **do not** replace a tested cross-browser disclosure with a Chromium-only shortcut. If a preview is nonessential, graceful absence may be the best fallback; if essential, render the same information through the normal click/tap path.

```html
<!-- Enhancement only: the link is still useful without interestfor. -->
<a href="/profiles/ada" interestfor="ada-preview">Ada's profile</a>
<div id="ada-preview" popover="hint">Research lead · 12 public projects</div>
```

This example deliberately contains **no essential action** in the preview. Validate `popover="hint"` support separately, ensure the link already has a meaningful accessible name, and test the fallback where `interestfor` is ignored. For richer cards use a deliberate interactive pattern, not this plain-hint snippet.

**Adversarial agent gate:** test Chromium 142+ and supported target versions of Firefox/Safari; hover → move pointer into preview, rapid sweep over a dense table, Tab/Shift+Tab through multiple links, Escape while focus stays on trigger, nested popovers, 200–400% zoom, screen reader name/description and card controls, Android/iOS touch and link context menu, no JS, reduced motion, slow/rejected preview fetch and unauthorized user. Compare interest enhancement vs explicit click-only baseline on discoverability, accidental obstruction, successful task completion, focus loss and network/privacy cost. **No browser, screen-reader or user study was run in this research cycle.**

**Evidence:** [Open UI explainer, updated 2026-10-16](https://open-ui.org/components/interest-invokers.explainer/), [Chrome 142 release notes](https://developer.chrome.com/release-notes/142), [MDN interest invokers](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using_interest_invokers), [W3C WCAG 1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html), [WAI-ARIA APG tooltip, work in progress](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/), [WHATWG HTML PR #11006](https://github.com/whatwg/html/pull/11006), [polyfill and touch limitations](https://github.com/mfreed7/interestfor).

### Evidence boundary — 2026-09-30

Native `<dialog>`, `showModal()`, and `inert` are broadly available in current browsers. The Popover API is also a current platform primitive, but support for adjacent newer features should be checked separately. Platform availability is evidence that custom infrastructure can often be removed; it is **not** evidence that more overlays improve usability.

WAI-ARIA APG remains useful for dialog interaction requirements, but its examples explicitly require real assistive-technology testing before production reuse. Prefer semantic HTML behavior where it already supplies the contract rather than reproducing an ARIA example mechanically.

## CSS anchor positioning for overlays — 2026-10-08

**Decision:** choose the widget's semantics and dismissal/focus contract first (dialog, menu, tooltip, listbox, or plain disclosure), then use CSS anchor positioning for **geometry**. The Popover API handles display/top-layer lifecycle, but neither popover nor anchor positioning implements a menu's arrow-key navigation or a tooltip's accessibility contract.

**Support boundary:** MDN marks core anchor-positioning features and `position-try-fallbacks` as Baseline 2026 (January). This is **newly** interoperable, not a promise about older Safari/Firefox/embedded browsers. Test the exact features and provide a usable non-anchored placement. Popover support is older, but `popover="hint"` and adjacent capabilities have separate compatibility considerations.

### Practical contract for coding agents

- A button with `popovertarget` gives its popover an **implicit CSS anchor**. Prefer this over generated global `anchor-name` identifiers for simple invoker-bound overlays. Reset UA popover `inset` and `margin` before applying `position-area`; otherwise default centering can defeat intended placement. **2026 draft nuance:** `position-anchor` now has initial value `normal`, which resolves an implicit anchor when `position-area` is not `none`; when using only `anchor()` in insets, explicitly opt in with `position-anchor: auto` and verify the installed browser.
- For repeated cards/rows using explicit `anchor-name: --name`, **do not rely on a universal duplicate-name resolution rule**: MDN still describes the last matching anchor, but the **2026-09-06 CSSWG draft** now prefers the nearest matching ancestor, falling back to the last eligible match. Browser implementations can lag the draft. Prefer component-local `anchor-scope` (where supported), distinct names, or an implicit popover invoker association; verify nested/portaled/repeated rows in each target engine. `anchor-scope` does **not** govern implicit associations.
- `position-try-fallbacks` is an ordered list, not a guarantee of visibility. `flip-block, flip-inline` alone can fail at a corner; include the combined `flip-block flip-inline` option and test all edges, small viewports, zoom, dynamic content, RTL and nested scroll containers. If no candidate fits, the original placement may still overflow.
- `position-visibility` can hide a floating surface when its anchor is offscreen or the surface overflows. **Syntax and defaults are in flux:** the 2026-09-06 CSSWG draft renamed `anchors-visible`/`anchors-valid` to **`anchor-visible`/`anchor-valid`**, permits but does not require old aliases, and sets the initial value to `anchor-visible`; MDN's current examples still use the plural spellings. Check `CSS.supports()` for the chosen value **and test actual behavior** instead of assuming a declaration applied. Conditional hiding can silently conceal **focused controls or an unfinished task**; for interactive surfaces prefer repositioning or a usable alternate layout and test focus/dismissal when the invoker scrolls away.
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

**Verification:** check keyboard activation, Escape/outside dismissal, focus return, viewport corners, 200–400% zoom, touch/hover, RTL, nested scrollers, and older target browsers. Test `position-area`, `position-try-fallbacks`, `anchor-scope` and conditional visibility **separately**: support for one property does not validate the entire layout contract. The code above demonstrates **placement**, not a complete menu, tooltip, or dialog implementation.

**Spec/implementation divergence — checked 2026-10-24:** The September CSSWG draft says `no-overflow` hides only *after* position tries, but open [CSSWG #13079](https://github.com/w3c/csswg-drafts/issues/13079) documents cases where nested scrollable containing blocks do not trigger the fallback/visibility users expect; [#13176](https://github.com/w3c/csswg-drafts/issues/13176) still tracks visibility edge cases despite a nonzero-intersection clarification in the draft. Neither the Baseline 2026 label nor a passing `CSS.supports()` call proves a floating control remains reachable. Keep consequential actions in an accessible alternate location when the anchor is clipped; use screenshots **and** keyboard/focus assertions under scrolling and zoom. The [CSSWG accessibility section](https://drafts.csswg.org/css-anchor-position-1/#accessibility) explicitly says CSS geometry creates **no semantic association**; the HTML Popover API can provide an invoker relationship, but arbitrary CSS-anchored elements need appropriate markup.

**Evidence boundary:** browser/standards documentation establishes API mechanics, newly broad support, and failure cases; no measured evidence here that CSS anchoring itself improves task outcomes. Sources: [CSSWG September 2026 draft](https://drafts.csswg.org/css-anchor-position-1/), [MDN anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using), [fallback failure modes](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Try_options_hiding), [anchor-scope](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/anchor-scope), [popover](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using), [WAI-ARIA menu button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/), [tooltip pattern caveat](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/).

## Intrinsic form-control sizing: scoped auto-grow, not global styling — 2026-10-25

**Decision:** Use `field-sizing: content` selectively for auto-growing comments or AI chat composers. **Do not apply it globally to `textarea, input, select`.** This property changes intrinsic sizing for *all* these controls, not just textarea height. Baseline **Newly available** since **2026-06-16** (Chromium 123+, Safari 26.2+, Firefox 152+), but older installed browsers still need a usable fixed-size fallback. CSS Forms Level 1 is an **editor's draft**, not a final Recommendation.

**Failure modes:** `field-sizing: content` ignores a textarea's `rows`/`cols` preferred size. An empty textarea without constraints can collapse to caret width; long content can expand it sideways. A single-line input can shrink abruptly after its placeholder disappears. `<select multiple size="3">` can expand to display *all options*, ignoring the intended visible row count. A fixed `height` prevents auto-growth; a maximum block size permits growth then internal scrolling. A blanket one-line migration is therefore unsafe.

**Bounded composer pattern (keep native semantics and fallback):**

```html
<label for="message">Message</label>
<textarea id="message" name="message" rows="3" class="message"></textarea>
```
```css
.message {
  box-sizing: border-box;
  display: block;
  inline-size: 100%;
  min-inline-size: 0; /* flex/grid shrink protection */
  min-block-size: 3lh;
  max-block-size: min(10lh, 35dvh);
  overflow-y: auto;
}
@supports (field-sizing: content) {
  .message { field-sizing: content; }
}
```

`rows="3"` supplies the older-browser preferred height; CSS minimum controls supporting browsers. Fixed inline size deliberately forces wrapping and vertical growth. The `dvh` cap is a heuristic, **not** proof of mobile keyboard safety. Keep a real label; a placeholder is not one. If auto-grow is mandatory in old browsers, gate JavaScript measurement behind a feature check so CSS and JS do not fight.

**Executed layout falsification (local Playwright + Chromium 144, 2026-10-25):** `rows="4"` default textarea measured **110 px high**; bare content-sized empty textarea measured **38 px high / 15 px wide**. After long paste, the bare textarea grew to **880 px wide** at a 900 px viewport. A 30-option `<select multiple size="3">` measured **590 px high**, versus **150 px** with `max-block-size`. A constrained textarea at a 320 px viewport remained **292 px wide**, capped at **192 px high**, with `scrollHeight` **2076 px** and no page horizontal overflow. A long-placeholder input changed width **234 → 44 px** after one typed character. These are fixture-specific **single-engine** measurements, not a browser-interoperability or accessibility claim.

**Agent QA gate:** exercise empty/cleared, short, long, unbroken-token and pasted drafts; programmatic restore, font swap, IME, keyboard caret/focus after max-height, zoom 200–400%, RTL, flex/grid shrink, actual mobile keyboard, and select lists with many options. Check geometry, internal scrolling and document overflow in a rendered browser; `CSS.supports()` alone proves none of this. Do not claim an INP/UX improvement from deleting resize JS without measured evidence.

**Evidence boundary:** CSSWG/MDN/Chrome/Mozilla document semantics and release support; local Chromium demonstrates only these layout effects. No Firefox, Safari, device, assistive-technology or controlled performance/user trial. Sources: [CSSWG draft](https://drafts.csswg.org/css-forms-1/#field-sizing), [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/field-sizing), [Chrome](https://developer.chrome.com/docs/css-ui/css-field-sizing), [Firefox 152](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/152), [Web Features](https://web-platform-dx.github.io/web-features-explorer/features/field-sizing/).
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

## CSS-generated carousel controls: accessible to browsers, invisible to some agent locators — 2026-10-26

**Decision:** CSS Overflow 5 `::scroll-button()`, `::scroll-marker-group` and `::scroll-marker` can reduce hand-written carousel state in supporting browsers, but **generated controls are not ordinary DOM buttons/tabs**. Their accessibility, localization, testability and fallback must be evaluated independently. Prefer a readable list/scrollable region and native scroll snap as the baseline; provide **real HTML controls** when discoverable previous/next or direct-slide navigation is required across browsers. Do not add an autoplay carousel merely because CSS can generate controls.

**Repeated Chromium probe (144.0.7559.96, Playwright Python, three fresh browsers):** Two three-slide scroll-snap lists had generated previous/next buttons and marker groups. Chrome DevTools Protocol `Accessibility.getFullAXTree` exposed **four generated buttons, two tablists and six tabs**; three marker tabs were **unnamed** when `content: ""`. Playwright's `get_by_role('tab')` and `get_by_role('tablist')` each returned **zero** and `body.aria_snapshot()` omitted the generated controls; `get_by_role('button')` found only a separate real HTML button. Yet keyboard Tab focused a generated tab and then the generated Next button in the browser AX tree, and Enter moved the scroller **330px** in each run. `document.activeElement` was the originating `<ul>` during pseudo-control focus. **Do not equate Playwright locator invisibility with an inaccessible browser control**, or treat a passing DOM-only audit as complete coverage.

**Naming/localization counterexamples:** In the same fixture, `content: ""` gave empty tab names; `" "` yielded whitespace, `"●"` yielded identical bullet names, and `"●" / "Choose slide"` gave three indistinguishable “Choose slide” tabs. `content: attr(data-label)` yielded distinct “Slide one/two/three” names. Changing only the carousel's `lang` to `es` left English generated names intact; updating the underlying `data-label` to “Diapositiva uno” immediately changed the AX name. A button with `content: "◀"` was named “◀”, while `"◀" / "Anterior"` exposed “Anterior”; empty button content fell back to “Scroll left” in **this Chromium build**, not a portable naming guarantee. CSS content and its alt string are **not automatically translated by changing `lang`**. CSSWG [issue #12268](https://github.com/w3c/csswg-drafts/issues/12268) remains open (checked 2026-10-26) about automatic translation; the [MDN carousel guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Overflow/Carousels) explicitly warns that `attr()`-sourced marker labels are not picked up by automatic translation services.

**Implementation/QA contract:**
1. Decide whether a carousel is better than a static list. Preserve swipe/scroll, keyboard traversal and a meaningful no-CSS/no-pseudo fallback. CSS-generated navigation is **limited availability** (Chromium support; Firefox/Safari need verification or explicit controls), not a universal replacement for HTML buttons/links.
2. Give every generated marker a **distinct, localized name** and each icon-only scroll button a textual alternative using `content: "▶" / "Next"` (translate the alternative too). If using `attr(data-slide-label)`, update it with the app's locale, slide ordering and content; do not rely on browser auto-translation or identical dot names. Verify actual visual label-in-name obligations when labels are visible.
3. Test **both** DOM-facing agent tooling and the browser's generated accessibility tree. Exercise actual Tab, arrow keys within markers, Enter/Space, pointer and touch; check scroll movement, focus indicator, selected marker, target sizes, RTL, zoom, forced colors, and dynamic content/locale changes. Generated pseudo-controls cannot be directly queried or assigned `aria-label` like DOM nodes.
4. Autoplay, if genuinely necessary, is a **separate behavior contract**: [WAI-ARIA APG Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) calls for visible rotation control, stopping on keyboard focus/hover and no automatic restart after focus. CSS scroll controls alone do not satisfy this.
5. **Evidence boundary:** these are repeated synthetic Chromium AX/keyboard probes, not Firefox/Safari behavior, actual screen-reader speech, automatic-translation tests, Playwright JS parity or user-outcome evidence. CSS Overflow 5 remains a developing spec; do not infer conformance or usability from generated semantics alone.

## CSS scrollspy: active styling is not an accessible current-location state — 2026-10-26

**Decision:** `scroll-target-group: auto` on ordinary fragment links plus `a:target-current` provides **progressive visual** table-of-contents highlighting without scroll listeners in supporting browsers. It does **not** create route state, update the URL fragment on manual scroll, or automatically author `aria-current`. Never promise a semantically announced current section from CSS alone.

**Repeated browser counterexample (Chromium 144.0.7559.96, Playwright Python, three fresh browsers):** A fixed `<nav aria-label="On this page"><ol>…<a href="#sN">…` with four 700px sections selected section 1 at `scrollY=0`, section 3 at `scrollY=1400`, and section 4 after clicking its link. Each selection matched `:target-current` and the red computed text color, but **every link's `aria-current` attribute remained absent**. After clicking section 4 and manually scrolling back to the top, `:target-current` returned to section 1 while `location.hash` and `:target` still referred to section 4. Therefore neither `:target` nor URL hash reliably represents the currently visible section. Chromium CDP AX did not serialize a useful `current` property even when an explicit `aria-current` was added to a control: **do not interpret AX-property absence as proof of actual screen-reader speech**. The DOM/selector mismatch is the verified result.

**Draft versus shipped semantics (three fresh Chromium 144 probes):** The current [CSS Overflow 5 draft](https://drafts.csswg.org/css-overflow-5/) specifies generated `scroll-marker-group` **`links`** (default) and **`tabs`** modes with distinct roles and keyboard models. Chromium parsed and computed both `after links` and `after tabs`, yet CDP AX reported `tablist` + `tab` for both in a two-slide fixture (2 tabs, 0 links per variant). Parsing a value does **not** certify its intended semantics are implemented. This qualifies, rather than negates, the previous Chromium generated-carousel findings.

**Implementation and QA contract:**
1. Preserve real `<nav>`, ordinary labeled `<a href="#…">` links and heading IDs. Treat `scroll-target-group` and `:target-current` as optional visual enhancement; use a non-color current cue and test fixed-header visibility, zoom, nested scrollers and responsive layout.
2. If **current visible section** is an explicit accessibility/product requirement, synchronize **exactly one** `aria-current="location"` (or `true` where appropriate) from a tested application visibility model. Reconcile scroll, resize, fragment navigation, asynchronous layout changes and dynamically added sections. `aria-current="page"` describes the current page, not automatically each section of the same document. This semantic sync costs JavaScript; CSS alone cannot write attributes.
3. Test three separate states: URL fragment target (`:target`), CSS-active viewport marker (`:target-current`) and authored accessible current (`aria-current`). They may diverge during scroll; choose an explicit authoritative state rather than deriving semantic current from a stale hash. Check keyboard activation and actual screen-reader announcements separately.
4. On unsupported browsers the fragment links should still navigate, but viewport highlight is absent; add a JavaScript observer only if the feature is genuinely required. Verify real behavior, not just `CSS.supports` or computed CSS values. Ordinary links and generated CSS pseudo-markers are different semantic/QA surfaces.

**Evidence boundary:** CSS Overflow 5 is an evolving draft; [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-target-group) marks this feature limited availability; [WAI-ARIA](https://www.w3.org/TR/wai-aria/#aria-current) defines author-supplied current semantics. These are synthetic Chromium DOM/computed-style/CDP AX experiments, **not** Firefox/Safari, actual AT speech, user comprehension or cross-engine conformance. [Chrome 140 release note](https://developer.chrome.com/blog/chrome-140-beta).

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
