# UX Patterns

Reusable interaction patterns and their tradeoffs. Prefer task-oriented guidance over component catalogs.

## Forms: validation and error recovery

Treat a form as a sequence of user decisions, not a collection of inputs.

### Reduce work before optimizing messages
- Ask only for information needed for the task.
- Prefer removing a field over polishing it. Baymard's checkout research finds field count can matter more than step count; treat this as commerce evidence, not a universal numeric rule.
- Hide uncommon optional inputs behind a clearly named reveal only when most users do not need them.
- Keep persistent visible labels and put constraints, examples, and reasons for unexpected requests near the relevant field.

### Be tolerant before declaring an error
Accept or normalize harmless format variation when the input remains unambiguous. Validation should reject information because the system cannot safely use it, not because it differs cosmetically from a preferred format. Server-side validation remains authoritative.

### Choose validation timing by the cost of delayed feedback
Do not default to errors on every keystroke or blur. For ordinary forms, let users finish input and validate on attempted progression/submission. Earlier feedback is justified when waiting creates meaningful wasted work, such as a character limit or safely checkable constraint. Asynchronous facts need explicit pending/success/failure states.

### Make errors recovery instructions
When an error is detected:
- identify the affected field in text, not color alone;
- explain what is wrong or what acceptable input requires;
- suggest a correction when one is known and safe;
- reuse language from the field label;
- preserve entered values unless security requires otherwise;
- avoid blame, generic "invalid input", or clearing the form.

For multiple errors, combine field-local messages with a summary that links to affected fields. Deliberately manage focus after failed submission.

### Accessibility contract
- Programmatically associate labels, hints, and error descriptions with controls.
- Meet WCAG 3.3.1 by identifying/describing detected errors in text.
- Provide correction suggestions where known and safe (WCAG 3.3.3).
- Do not rely on color, iconography, or border treatment alone.
- Use correct semantic input/autocomplete metadata for personal-data fields where applicable.
- Expose dynamic validation/status changes accessibly without noisy announcements.

### Progressive disclosure is conditional
Hide an optional field/section when most users do not need it and the reveal clearly names it. Keep it visible when discovery failure is costly or many users need it.

### Implementation checks
Test keyboard-only recovery, screen-reader error order, zoom/reflow, mobile keyboards, autofill, paste/equivalent formats, server failures, stale async validation, data preservation, first-error navigation, repeated submission, slow networks, and localization.

## Evidence boundary
GOV.UK provides extensively deployed guidance recommending progression-time validation by default, preservation of entered data, specific corrective errors, and error summaries. W3C provides accessibility requirements and implementation techniques. Baymard provides behavioral evidence strongest for commerce/checkout forms. Generalize the mechanisms cautiously; do not universalize checkout-specific percentages or conventions.

## Next research domains
Onboarding; settings; tables/data grids; dashboards; feeds; catalogs; authentication; dialogs/drawers; tabs; comparison; undo/recovery.

## Search, filtering, and result-set orientation

Treat search, filters, sort, result count, applied state, and result navigation as one **result-set control system**. The user should always be able to answer: what did I ask for, what constraints are active, what set am I viewing, and how do I broaden or narrow it?

### Separate retrieval from refinement
Use search when the user can express a target or identifying clue; use filters to refine a known result set. Avoid turning “advanced search” into a dense form when progressive refinement will do. For exact-identifier workflows, surface the matching record rather than silently navigating into it so the user can verify the match.

### Make applied state visible outside the controls
Do not rely on checked boxes inside a sidebar/drawer as the only record of state. Show a compact applied-filter overview near the results, especially when controls can be hidden or off-screen. Each applied constraint should be removable; provide “clear all” when several constraints can accumulate. A bare badge such as “3 filters” is weaker than naming the active constraints.

### Apply timing is a product decision, not a universal rule
Use explicit apply when users commonly choose several criteria, updates are expensive/slow, result movement destabilizes controls, or a predictable submit-result transition matters. Live filtering can fit fast stable updates where each selection is independently meaningful and immediate feedback helps. If updates are dynamic, announce concise result status without stealing focus.

### Preserve orientation after a result-set change
After search/filter/sort, show query and constraints, show a useful result count, apply controls to the whole set, reset pagination when the set changes, avoid unnecessary focus jumps, and expose in-place result/status changes programmatically.

### Zero results are a recovery state
Preserve query and constraints, state that no matches were found, and provide the cheapest relevant recovery actions. Do not silently substitute unrelated results without labeling that change.

### Mobile filters
Keep the filter entry point tied to results, surface applied state outside hidden panels, and make return to updated results obvious.

### Pagination vs continuous loading
- **Pagination** favors location, returnability, explicit progress, deep linking, and bounded loading.
- **Load more** can preserve browsing continuity while retaining an explicit user action.
- **Infinite scroll** fits low-commitment feeds better than goal-directed retrieval; avoid it when users need stable position, comparison, keyboard navigation, footer access, or reliable return.

### Implementation checks
Test query persistence, back/forward, deep links, refresh, empty/error states, race conditions, focus, announcements, keyboard filtering, zoom/reflow, mobile drawers, result-count accuracy, sort/filter interaction, pagination reset, and return-from-detail restoration.

## Search/filter evidence boundary
Baymard supplies behavioral evidence for ecommerce product lists. GOV.UK/MOJ/DWP/Home Office provide deployed public-service guidance. W3C defines dynamic status-message requirements. Live vs explicit apply remains conditional on task, latency, stability, and tested accessibility.

## Loading, progress, empty, and error states

Treat asynchronous UI as a **state machine**, not a spinner decoration. Define idle, pending, success-with-data, success-with-no-data, and failure; add stale/refreshing, partial, queued, or cancelled states when real.

### Preserve useful context while work is pending
Keep already-valid content visible during background refreshes where possible. Scope blocking and loading feedback to what is actually unavailable.

### Choose the indicator from what the system knows
- **Skeleton:** when destination structure is predictable and reserving geometry reduces reflow.
- **Spinner / indeterminate activity:** for bounded work whose meaningful progress cannot be estimated.
- **Determinate progress:** when trustworthy quantitative progress exists; never fabricate percentages or ETA.
- **Inline pending state:** for mutations, adjacent to the initiating action or affected object where possible.

### Prevent loading UI from causing layout instability
Reserve approximately final geometry. Performance engineering should remove latency where possible rather than only mask it.

### Make completion and failure unambiguous
Preserve valid information, state failures in task language, distinguish failure classes when remedies differ, keep recovery near the failed region, and never present stale data as freshly confirmed.

### Empty is not the same as error
Empty means the system successfully has no content; error means intended state could not be obtained or changed.

### Accessibility contract
WCAG 4.1.3 covers status messages for waiting, progress, results, or errors without moving focus. Use appropriate semantics and avoid chatty announcements. Native `<progress>` is preferable when it fits.

### Implementation checks
Test fast/slow responses, offline/network failure, retry, partial/stale data, background refresh, duplicate submission, cancellation, navigation, focus, screen readers, reduced motion, geometry, and unrelated controls.

## Loading-state evidence boundary
W3C defines accessibility behavior. Carbon and Atlassian provide mature production guidance separating skeleton, loading, and progress use cases. These sources do not establish a universal wait threshold or prove skeletons always feel faster.

## Notifications and toasts: choose persistence before presentation

Treat a notification as **information with a consequence and an expiration policy**, not a generic floating component. Choose the surface from the user's next required action and whether the message can be recovered.

### Surface and dismissal contract

- **Transient, non-critical confirmation** (for example, a save also reflected in the document): a short non-modal toast/status may auto-dismiss **if the same information remains discoverable elsewhere**. Do not make it the sole proof of success.
- **Field/task failure:** use a persistent message adjacent to the affected object, with field-level recovery and an error summary when appropriate; a toast alone is insufficient.
- **Important system-wide condition:** use a persistent banner/notification center entry that remains findable after navigating. Avoid burying outages or unsaved changes in a disappearing corner.
- **Action required, including Undo:** keep the action available until explicitly resolved/dismissed or provide an equally usable persistent recovery route. Do not make a five-second toast the only way to reverse a consequential operation.
- **Decision that must interrupt work:** use a properly managed dialog/alert dialog, not an assertive toast that pretends to be modal.

**Timing nuance:** WCAG 2.2 SC 2.2.1 (Level A) explicitly allows a five-second email-arrival toast when the inbox offers another way to discover the same information; if the toast is the **only** way to obtain the information or perform an action, the time limit must satisfy that criterion. This is not a blanket five-second accessibility rule. WAI-ARIA APG separately cautions against automatically disappearing **alerts**; the two recommendations address different consequences. A minimum duration alone does not make a toast accessible.

### Announcements and focus

- For routine completion/progress use a concise `role="status"` (polite). Reserve `role="alert"` (assertive) for urgent, time-sensitive text; frequent alerts interrupt screen-reader work. WCAG 4.1.3 (Level AA) requires status messages to be programmatically determinable without stealing focus.
- Neither `status` nor `alert` is a substitute for a keyboard-operable interactive component. Do not put buttons inside the **alert text** region and assume the announcement exposes their function. If an actionable notification is used, provide a separately reachable control and explicit focus/return behavior; if a response must interrupt, use an alert dialog.
- Establish live regions before updating their text where practical; newly mounted populated regions and repeated identical strings may not announce consistently. Test the actual browser/screen-reader combination rather than assuming DOM or axe checks prove an announcement occurred.
- A persistent actionable toast must be discoverable from the keyboard without requiring pointer hover. React Aria's toast region supports F6 navigation and restores focus; that is a **library implementation**, not a universal native browser shortcut.

### Implementation and failure checks

Specify a single owner for queueing, deduplication, priority, replacement and dismissal; otherwise repeated saves/background jobs can stack overlays and flood live announcements. Avoid obscuring essential controls at narrow widths, 200–400% zoom, mobile keyboards and safe-area insets. Pause any *permitted* auto-dismiss timer on hover/focus (and consider inactive tabs), but **do not use pause as a substitute for persistence** when a unique action or important information is at stake. Verify screen-reader announcement, keyboard reachability and focus restoration, action expiry, repeated identical messages, concurrent errors, offline/retry, navigation, and reduced motion.

**Evidence boundary (reviewed 2026-10-09):** [WCAG 2.2.1](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable) supplies the explicit alternative-access exception; [WCAG 4.1.3](https://www.w3.org/WAI/WCAG21/Understanding/status-messages) defines status semantics; [WAI-ARIA APG alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) and [MDN live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions) explain interruption/announcement pitfalls. Current [Carbon notification patterns](https://www.carbondesignsystem.com/building-blocks/core/patterns/notifications) distinguish persistent actionable toasts from optional timed informational toasts; [React Aria Toast](https://react-aria.adobe.com/Toast) supplies one implemented keyboard/timer model. Carbon's older v10 guidance warns against interactive toasts while its current guidance supports **persistent** actionable notifications: do not treat historical component limitations as a universal prohibition. These are standards/platform and production-design-system mechanisms, not controlled evidence that toasts improve outcomes.

## Navigation and wayfinding

Design navigation from the **task topology**, not from a preferred component. First determine whether the experience is primarily a linear transaction, repeated multi-task workspace, hierarchical information space, or a mixture with explicit boundaries.

### Do not add global navigation by default
A clear end-to-end transaction often benefits from fewer escape routes and stronger progression cues. Persistent service/product navigation is more justified when users return repeatedly, switch among multiple independent tasks, or need stable access to top-level areas. Navigation is not a sitemap: expose the few durable destinations that describe the product's useful top-level structure rather than every reachable screen.

This distinction is visible in deployed GOV.UK guidance: repeated multi-task services may use service navigation, while clear end-to-end journeys are directed toward task/progress structures instead. Treat that as strong production guidance for the mechanism, not proof that government information architecture transfers unchanged to every product.

### Separate hierarchy from history and progress
Do not make breadcrumbs, Back, and steppers interchangeable:
- **Breadcrumbs** represent location in a meaningful hierarchy and can provide jumps to ancestors. They are weak when the structure is flat and should not represent transaction progress.
- **Back** represents return to the prior meaningful state. In a transaction, preserve the previous page's state rather than treating Back as a parent-hierarchy link.
- **Progress/task structures** represent position or completion within a process, not information hierarchy.

Avoid showing breadcrumb + Back merely because both are available; redundant navigation adds noise without necessarily adding orientation. GOV.UK explicitly advises choosing between them for its service patterns.

### Preserve stable landmarks, labels, and relative order
Repeated navigation should remain predictable across views. Keep durable destinations in stable relative positions and use consistent labels for the same destination/function. A responsive layout may change presentation (for example, expanded sidebar to disclosure) without changing the conceptual navigation model or silently renaming/reordering core destinations.

WCAG 2.x requires repeated navigation mechanisms to occur in the same relative order unless the user initiates a change. Current WCAG 3 drafts continue to develop consistent structural order, navigation order, and labels; treat draft WCAG 3 material as directional, not yet normative.

### Expose current location without relying on styling alone
Users should be able to identify the current page/section from page title/heading plus navigation state. Mark the current destination semantically where appropriate (`aria-current="page"` for the current page link); distinguish “current page” from “inside this section” when the design system supports both concepts.

### Preserve returnability
Navigation quality includes what happens after leaving a list, workspace, or transaction step. Preserve meaningful query/filter state, selection, scroll/location, and unsaved work according to product semantics. Browser back/forward and deep links should not become second-class paths. Do not create a custom Back control that contradicts browser history or reconstructs a different state.

### Responsive navigation is an information-architecture decision
Do not solve narrow screens by hiding arbitrary destinations. Preserve the priority and naming of core destinations; change presentation when necessary. If secondary destinations move behind a menu, keep the current location understandable and keyboard/focus behavior coherent. Avoid duplicating the same active navigation tree in two simultaneously focusable DOM regions just to support breakpoints.

### Navigation contract for agents
Before implementing navigation, answer:
1. What are the stable user-recognizable objects/areas?
2. Is the dominant journey hierarchical, linear, multi-task, or mixed?
3. Which destinations must remain globally reachable, and which belong only in context?
4. What does Back mean here: history, parent, cancel, or previous process step?
5. What state must survive leaving and returning?
6. How is current location communicated visually and semantically?
7. Does responsive transformation preserve the same conceptual model?
8. Can keyboard, assistive-technology, deep-link, refresh, and browser-history paths reach equivalent states?

### Failure modes
- mirroring backend modules or org charts as navigation without validating user concepts;
- using breadcrumbs as a history trail or progress indicator;
- persistent global navigation inside a focused transaction where it mainly creates exits;
- mega-navigation that exposes the sitemap instead of prioritizing destinations;
- moving/renaming repeated destinations between pages without a user-controlled reason;
- mobile navigation that hides critical state or changes the information architecture accidentally;
- custom history behavior that loses form/filter state or fights browser Back;
- icon-only primary navigation whose meaning depends on memorization.

### Implementation checks
Test direct entry on deep pages, refresh, browser back/forward, return from detail, expired/auth-changed sessions, unsaved state, keyboard traversal, skip links/landmarks, screen-reader current-location announcement, zoom/reflow, long/localized labels, narrow/wide transitions, permission-dependent destinations, and URLs copied into a new session.

## Navigation evidence boundary
WCAG 2.x provides normative accessibility requirements for consistent repeated navigation; WCAG 3 material reviewed in October 2026 is still draft and should not be treated as a final requirement. GOV.UK provides current deployed guidance that clearly separates hierarchical breadcrumbs, historical/process Back, and repeated multi-task service navigation. These sources strongly support semantic separation and predictability, but they do not prove one navigation shell, sidebar pattern, or information architecture is universally superior.

## Reordering and drag-and-drop: design the non-drag operation first

**Decision rule (reviewed 2026-10-09):** Model the operation as *move item X to position/group Y* before choosing drag gestures. A draggable UI is an optional input method for that operation, not its sole definition. For a small ordered list, visible **Move up / Move down** buttons may be sufficient without any drag library. For cross-column boards or large lists, offer a click/tap-operable **Move to…** menu or destination chooser as well as dragging. Preserve the same permissions, ordering rules, and outcome across methods.

### Two independent accessibility obligations

- **Keyboard operation** (WCAG 2.1.1) requires a usable keyboard path; a keyboard sensor can help, but keyboard-only drag is not enough.
- **Single-pointer operation without dragging** (WCAG **2.5.7, Level AA**) separately requires click/tap alternatives for author-controlled drag operations unless the defined exception applies. A drag handle operated by arrow keys alone does **not** satisfy this criterion for someone using touch without a keyboard. A menu or buttons that can be activated by a single pointer can serve both obligations. This distinction is explicit in [W3C's understanding of 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements) and [technique G219](https://www.w3.org/WAI/WCAG22/Techniques/general/G219).

### Interaction contract

1. **Discoverability:** make movable items identifiable without hover alone. If an item contains links, buttons, text selection, or editable content, use a dedicated drag handle rather than hijacking the entire item's pointer behavior. Expose the equivalent action menu on the item.
2. **Before moving:** distinguish manual rank from current *display order*. If results are sorted by date/name or filtered, either disable manual reordering with an explanation and a route back to rank order, or define precisely what the change means. Do not silently reorder hidden rows or mutate the wrong canonical sequence. [Jira's April 2026 list rollout](https://confluence.atlassian.com/cloud/blog/2026/04/atlassian-cloud-changes-mar-30-to-apr-6-2026) demonstrates the disable-with-explanation choice (shipped behavior, not measured UX superiority).
3. **During moving:** show the proposed destination (before/after/on another item or into a group), distinguish *move* from *copy*, and support cancellation without committing changes. Do not use motion or color as the only indicator.
4. **After moving:** announce a concrete outcome such as “Task A moved from To do to Doing” or “Item B moved to position 2 of 8”; retain or restore focus to a meaningful control for the moved item, including when the item remounts in another parent. Preserve selection and scroll context where sensible. For consequential/remote moves, provide error recovery and a durable undo path.
5. **Boundaries:** disable impossible moves explicitly (first item up, locked group, invalid drop target). Make failed drops and server rejections visible and reversible; avoid optimistic visual success that silently rolls back.

### Choose the implementation by semantics and ownership

- **Buttons/menus first:** the least complex robust option for basic reorder/move operations, and an essential complement to drag in many richer interfaces.
- **Atlassian Pragmatic drag and drop:** framework-agnostic, native-browser drag core with optional visuals; **the core does not implement accessible alternatives for you**. Atlassian's [accessibility guidance](https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines/) favors explicit move menus, live announcements and focus continuation over making arrow-key dragging the only alternative.
- **React Spectrum:** its [drag-and-drop collections](https://react-spectrum.adobe.com/dnd) include keyboard and screen-reader drag mode, target navigation, announcements and mobile screen-reader interaction. This is a stronger integrated interaction model for supported React collection components, but requires checking the actual version, app integration and AT behavior; it is not a reason to replace a simple move menu.
- **Raw HTML `draggable`:** [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) documents drag events and a text-selection tradeoff; setting `draggable=true` does not supply keyboard semantics, single-pointer alternatives, announcements or focus restoration.
- **WAI-ARIA APG rearrangeable listbox:** [illustrative example](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-rearrangeable/) combines listbox actions, move buttons and live status. Do not copy its `listbox` role onto an ordinary list of interactive cards: listbox is a selection widget with its own keyboard contract. APG warns its examples need browser/AT testing and are not production-ready components.

**Design disagreement worth preserving:** Atlassian discourages directional-key movement as a general accessibility strategy because it can be awkward for screen readers and complex boards; React Spectrum supports keyboard drag/drop for richer collection navigation; W3C APG shows move-up/down controls for a rearrangeable listbox. These are context-specific approaches, not mutually exclusive universal standards. The common invariant is **equivalent, discoverable operations and recoverable feedback across input modes**.

### Validation / evidence boundary

Test click/tap-only (no dragging or physical keyboard), keyboard-only, screen reader on desktop and touch, item remount/focus, long lists/scroll, zoom, RTL, nested interactive controls, multiple selection, invalid targets, sort/filter changes, async save failure, and drag cancellation. Add file-input alternatives for file upload drop zones. Standards establish required input equivalence; library documentation describes mechanisms; the Jira rollout shows a production constraint. None establishes that dragging improves completion time or satisfaction compared with menus. Measure that separately before adding a gesture-heavy interaction.
