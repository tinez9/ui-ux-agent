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

## Passkeys and accessible authentication: preserve the complete sign-in path — 2026-10-15

**Decision:** a passkey is a phishing-resistant credential, **not** a complete sign-in/recovery experience. Optimize the journey from discovery → enrollment → sign-in → fallback → recovery → credential management, not just the happy-path biometric prompt.

- **Mixed password/passkey accounts:** keep a normal, labeled username/password form with password-manager autofill and paste. Add `autocomplete="username webauthn"` (the `webauthn` token last) to the username field and start WebAuthn `get({ publicKey, mediation: "conditional" })` only when supported. The browser may offer stored passkeys in its native autofill UI. **Do not hide password sign-in** or infer from an unresolved conditional request that the user has no passkey; the request can remain pending while the user chooses another credential. Offer a clear explicit “Use a passkey” route when appropriate, especially when autofill is unavailable or undiscoverable.
- **Passkey-only cohorts:** a dedicated “Sign in with a passkey” button can be simpler when the product knows all users have passkeys. For mixed cohorts, a passkey-only screen can lock out legitimate users. Cross-device authentication (phone/QR/proximity) is a useful supported route, not a guarantee that the user has another compatible device or working connectivity.
- **Enrollment:** explain the device/browser prompt *before* opening it and confirm registration only after the server accepts the credential. Offer creation after a trusted sign-in, in security settings, or after recovery; allow “Not now” without blocking unrelated work. Explain that the site does not receive fingerprints/face data. On shared devices, make the account-access implications explicit; unlocking the device can enable authentication.
- **Credential lifecycle:** show registered passkeys with human-meaningful labels, last-used/backup metadata when available, add/rename/revoke actions, and a warning before removing the last usable method. Server-side revocation does **not** automatically delete the passkey from the device's credential manager; a stale credential may still appear in autofill. Where supported, use WebAuthn signal APIs to reconcile server/client state, subject to authentication and privacy constraints.
- **Recovery is part of security:** loss of a device, provider account, security key or all passkeys must have a deliberate recovery route that is usable without a cognitive-memory test. A weak email/SMS recovery channel can undermine the phishing resistance of passkey sign-in; set verification, notifications, rate limits and re-enrollment rules from account risk rather than silently assuming every fallback is equivalent. Never claim that a passkey makes the *whole account* phishing-proof.
- **WCAG 2.2 SC 3.3.8 (AA):** every authentication step must avoid requiring unaided recall, transcription or puzzles unless one of the criterion's exceptions applies. Password managers, autofill and paste can be an assisting mechanism; passkeys are one alternative, not a requirement. Test OTP paste/autofill and conditional CAPTCHA paths, not just the initial login form. The stricter 3.3.9 is AAA. A biometric-only instruction is inaccurate because authenticators may use device PIN or other screen locks.
- **Implementation/security boundary:** verify server-issued challenge, RP ID/origin, signature, user verification flags when required, credential-to-account binding and replay protection **server-side**. Browser capability and `isConditionalMediationAvailable()` checks are progressive enhancement, not authorization. Browser+OS+credential-provider combinations differ; do not assume identical conditional autofill or cross-device behavior from browser name alone.

**Falsification tests:** no stored passkey; saved password and passkey for the same account; canceled OS prompt; pending conditional request while submitting password; unsupported OS/WebView; lost phone; passkey only on another ecosystem; shared device; last-passkey revocation; server-revoked passkey still offered in autofill; keyboard/screen reader; copy/paste and password-manager/OTP autofill; CAPTCHA after risk escalation; network timeout after credential creation; malicious/expired challenge. Measure completion, abandonment, lockouts and recovery success, not only WebAuthn API success.

**Evidence boundary:** W3C defines the accessibility requirement; MDN and passkeys.dev document browser/protocol behavior and interoperability; Google's first-party UX guidance supplies shipped design patterns, **not** universal causal conversion uplift. Recovery strength and fallback risk are threat-model decisions, not blanket prohibitions. Sources (reviewed 2026-10-15): [WCAG 3.3.8](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html), [MDN passkeys](https://developer.mozilla.org/en-US/docs/Web/Security/Authentication/Passkeys), [passkeys.dev device support, updated 2026-09-21](https://passkeys.dev/device-support/), [passkeys.dev bootstrapping](https://passkeys.dev/docs/use-cases/bootstrapping/), [Google passkey journeys](https://developers.google.com/identity/passkeys/ux/user-journeys), [Google passkey use cases](https://developers.google.com/identity/passkeys/use-cases).

## Next research domains
Onboarding; settings; tables/data grids; dashboards; feeds; catalogs; authentication; dialogs/drawers; tabs; comparison; undo/recovery.

## Date entry: choose by user task, not picker fashion — 2026-10-20

**Decision:** ask what the date *means* before choosing a control or storage type. A known birthday, a date copied from a document, an approximate month, a booking date, and a time-zone-specific appointment are different tasks. A calendar is not automatically more usable than typed fields.

- **Known or document dates:** prefer directly editable, clearly labelled day/month/year fields (GOV.UK) or a month select with day/year text fields (USWDS). Both are defensible production patterns; neither is a universal winner. Match the order/format printed on a document when copying it. Group fields with `fieldset`/`legend`; label each part and give an unambiguous example. Use `type="text" inputmode="numeric"` for numeric day/year rather than number spinners; do not auto-advance focus. GOV.UK accepts full/abbreviated month names based on observed errors; USWDS uses a month select. Treat this as a local design decision, not a contradiction to erase.
- **Approximate or relative dates:** if users only know “March 2024,” do not silently manufacture March 1 as a precise date. Represent precision explicitly and validate the question's actual requirement. If users think “tomorrow” or “three days before,” resolve it against a clearly stated reference date and relevant time zone, and show the resulting calendar date before committing.
- **Scheduling/weekday context:** a calendar can help users compare nearby dates and availability. Keep a direct-entry route; both GOV.UK and USWDS warn against calendar-only input. Native `<input type="date">` is a reasonable low-complexity candidate when its platform-specific UI, typing affordance, locale presentation, min/max constraints and mobile accessibility work for the actual audience. Its `value` is normalized `YYYY-MM-DD`, independent of displayed locale. A bespoke calendar incurs month navigation, focus, grid keyboard controls, screen-reader announcements, unavailable-date explanation, touch, localization and testing obligations. W3C APG date-picker examples are **illustrative, not production-ready**.
- **Validation and recovery:** distinguish missing parts, impossible dates (e.g. 31 February), out-of-policy ranges, unavailable appointments and server-side booking conflicts. Preserve the user's entries and explain the precise fix; validate on the server too. A date being syntactically valid does not make a booking available. Do not auto-submit on calendar selection. In a date range, explain start/end constraints without silently swapping dates.
- **Date-only is not an instant:** store a birthday or all-day calendar date as a civil date (for example, ISO `YYYY-MM-DD`), not as UTC midnight later formatted in an arbitrary locale. JavaScript `new Date("2026-10-20")` parses date-only ISO as UTC; `input.valueAsDate` must be read with UTC getters or it can appear as the previous day west of UTC. Avoid converting through `Date` when a date-only string or a verified `PlainDate`-style type suffices.
- **Appointments need zone policy:** `datetime-local` contains no time-zone identifier and may accept nonexistent local wall times during a daylight-saving gap; repeated fall-back times can refer to two instants. Ask which location's zone governs the event, preserve an IANA zone identifier when relevant, and define how the system resolves ambiguous/nonexistent times. Only convert to a UTC instant after applying that policy; do not assume the user's current device zone is the venue's zone. Temporal's `PlainDate`/`ZonedDateTime` distinction is a useful model, but verify runtime support or use a reviewed library.

**Agent acceptance checks:** known vs approximate vs scheduling tasks; typed entry and calendar route; keyboard/screen reader/touch; 320px/zoom; locale day-month ordering; leap years and impossible dates; timezone west/east of UTC; DST gap/overlap; stale availability; server rejection; clear focus and error recovery. Compare task success and correction cost before claiming a picker is superior. USWDS reports manual-entry trouble in its own date picker despite an accessibility test status; component test passes do not settle usability.

**Evidence:** [GOV.UK dates](https://design-system.service.gov.uk/patterns/dates/), [GOV.UK date input](https://design-system.service.gov.uk/components/date-input/), [USWDS memorable date](https://designsystem.digital.gov/components/memorable-date/), [USWDS date picker](https://designsystem.digital.gov/components/date-picker/), [MDN date input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date), [MDN valueAsDate](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/valueAsDate), [MDN Date parsing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date), [MDN datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/datetime-local), [Temporal time zones](https://tc39.es/proposal-temporal/docs/timezone.html), [W3C APG date picker](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/). This is an operational synthesis of platform/design-system guidance, **not** a controlled comparison of the competing controls.

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

## Bulk selection across filters and pages: scope is part of the action — 2026-10-12

**Decision rule:** a checked row is an item; a checked page is a page; “all matching results” is a *query*. Never let the same unlabeled “Select all” control silently switch among those meanings. For small datasets, explicit IDs suffice; for large server-filtered sets, selecting a query needs a separate, visible escalation step.

### Selection model and transitions
- **Explicit selection:** `{mode: "ids", ids: Set<stableResourceId>}`. Page-header select/deselect adds/removes *only eligible IDs on the current page*, preserving selections on other pages if cross-page selection is promised. Calculate header checked/mixed/unchecked from eligible page IDs, with an explicit empty-page guard. Do not use row indices as identifiers.
- **Query-wide selection:** `{mode: "matching", filterSnapshot, excludedIds, scopeVersion?}`. After “All 50 on this page selected,” offer “Select all 2,430 matching items” only when the backend can actually execute that scope. This is **not** a client-side set of 2,430 IDs. Bind the operation to the confirmed query, exclusion set, resource type/tenant, and an explicit *snapshot-versus-live-membership* policy.
- **Scope changes:** changing search/filter or switching resource set must either clear query-wide selection with explanation or require deliberate reconfirmation. Sort-only changes normally alter order rather than membership; do not reset selection reflexively unless the product's scope contract changes. If explicit IDs survive filtering, show the total selected *including hidden rows* and offer clear selection; do not imply the visible checkboxes are the full set.
- **Counts and eligibility:** derive “N selected” and actionable count from the authoritative selection scope, not from the current page length. Disable or explain ineligible rows; the server must recheck per-item permissions and current eligibility at execution time. If totals are approximate or changed since selection, say so before a consequential action.

### Action and recovery contract
Use specific verbs and resource names (“Archive 50 products,” not “Apply”). Before destructive or hard-to-reverse actions, confirm the *scope*, filters, count, and consequences. The backend must validate the operation and each target against current authorization; never treat disabled checkboxes or client-supplied filters as a security boundary. Decide whether matching-set execution uses a fixed snapshot or the set at execution time; prevent unintended expansion if new matching records appear after confirmation. For long jobs, show queued/running/completed/partial-failure states, idempotent retry where supported, and a result summary (succeeded, skipped, failed). Preserve failed-item selection and recovery controls; clear only the successfully completed portion or after an explicit reset.

### Accessibility and implementation pitfalls
Use native labelled checkboxes when possible; name the header control with its actual scope (“Select all 50 items on this page”). The mixed state is **not** a third submitted boolean: `input.indeterminate` is presentation-only and must be synchronized from actual selection state. Ensure keyboard access to rows, bulk toolbar, confirmation and recovery; announce meaningful selection/result changes without flooding live regions. A custom `role=checkbox` needs its own keyboard/state behavior; APG examples are illustrative, not tested production widgets.

**Library trap (verified 2026-10-12):** Shopify's *page-only* migration snippet uses `setSelectedIds(checked ? new Set(pageIds) : new Set())`; copying that handler into a cross-page UI silently discards off-page IDs. Its separate migration guidance correctly requires an explicit page-to-query escalation. TanStack Table documents that with `manualPagination`, `getSelectedRowModel()` contains only loaded-page rows even when row-selection state holds off-page IDs. MUI X supports include/exclude selection models and `keepNonExistentRowsSelected` but warns that select-all and server pagination can leave unexpected retained selections; component state is not the authoritative backend operation contract. Audit exact installed library/version and adapt behavior rather than assuming a built-in checkbox solves cross-page semantics.

**Release tests:** page A select → page B select → deselect page B → return A; sort and filter changes; hidden selected items; empty page; select-all then exclude two; changing counts/data/permissions between preview and execute; another user editing/deleting targets; huge result sets; partial success and retry; mobile, keyboard, screen reader, zoom, and destructive confirmation. Test *actual affected IDs* and recovery, not merely visual checkbox states.

**Evidence boundary:** Shopify's current migration docs establish a shipped product pattern and expose a copy/paste pitfall; TanStack/MUI document framework state semantics; W3C/MDN document checkbox mechanics; OWASP establishes server-side authorization. The snapshot/live-set and partial-failure rules are risk-based agent synthesis, not controlled UX outcome evidence. No study here proves bulk selection improves speed for every task.

Sources (reviewed 2026-10-12): [Shopify bulk actions](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/unstable-bulk-actions), [Shopify select-all migration](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/select-all-actions), [TanStack row selection](https://tanstack.dev/table/v8/docs/guide/row-selection), [MUI X selection](https://mui.com/x/react-data-grid/row-selection), [WAI-ARIA checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/), [MDN indeterminate](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/indeterminate), [OWASP authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

## Optimistic edits: distinguish provisional UI from saved state — 2026-10-13

A quick visual response is not a confirmed write. For low-risk predictable changes, provisional rendering can improve responsiveness; for consequential actions or complex server validation, prefer visible pending state until confirmation. Distinguish local draft, durable offline queue, sending, server-confirmed, and needs-attention states. Do not label a locally queued change “Synced.”

React's `useOptimistic` supplies temporary rendering, not persistence. TanStack Query offers pending-variable rendering as a simpler alternative to shared-cache mutation; concurrent mutations and refetches can make naive rollback display stale data. Server-side version checks (`If-Match` / HTTP 412) protect against lost updates; optimistic rendering alone does not. Browser `navigator.onLine` is unreliable, and Background Sync is not universal. Preserve edits after rejection, provide recovery, and test concurrent updates, timeout-after-commit, offline restart, and accessible status announcements.

Sources: https://react.dev/reference/react/useOptimistic ; https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates ; https://tkdodo.eu/blog/concurrent-optimistic-updates-in-react-query ; https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/If-Match .

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

## Web push permission: grant is not subscription — 2026-10-13

**Decision:** ask for system notification permission only when the user has opted into a concrete, valuable alert (delivery update, followed topic, price change). Never request it on page load or treat an OS-level grant as consent to every notification category. Provide a persistent in-product preference/opt-out route; keep essential task information available inside the app even when push is unavailable.

**Separate the states:** (1) feature preference in the user's account, (2) browser/OS permission (`default`, `granted`, `denied`), (3) device-specific Push API subscription, (4) server-side endpoint/account association, and (5) actual delivery. None proves the next. A granted permission does not create a push subscription, and a successful subscription does not prove delivery. Reconcile these states on activation, resume and settings changes; don't display “alerts enabled” until the required server registration succeeds. Guard subscription and server writes against duplicate concurrent calls; remove stale endpoints and honor account switching/sign-out.

**2026 browser change:** Chrome 155 on Android introduces a non-blocking notification prompt. If it times out, `Notification.requestPermission()` resolves `default`; users can subsequently grant permission through Chrome's site controls **without repeating the original request**. Code that subscribes only inside `requestPermission().then(permission => permission === 'granted')` can therefore miss the later grant. Where supported, observe `navigator.permissions.query({name: 'notifications'})` / `PermissionStatus.onchange`, *and* reconcile the current state immediately and on return to the app; treat the change event as a trigger to check, not as proof of an existing subscription. This is a **Chrome Android 155 behavior**, not a universal browser promise.

**Platform boundaries:** Push needs HTTPS, a service worker, an actual PushSubscription (typically `userVisibleOnly: true` and a VAPID public key), and a functioning push backend. On iOS/iPadOS, WebKit supports Web Push for eligible **Home Screen web apps**, not an ordinary Safari tab; permission must follow direct user interaction. Feature-detect, explain the install prerequisite only when relevant, and offer in-app/email alternatives. Browser controls can revoke permission independently: Chrome's 2025 policy targets high-volume, low-engagement sites, while excluding installed web apps. Never repeatedly nag after denial or assume a previous grant is permanent.

**Validation:** no permission, ignored/timed-out prompt, later grant in browser controls, explicit denial, permission revocation, offline/expired endpoint, duplicated subscribe calls, account change, multi-device settings, quiet hours, sensitive lock-screen previews, iOS Safari tab vs installed app, keyboard/screen-reader operation. Evaluate useful delivery and opt-out rates, not just permission-grant conversion.

**Evidence boundary:** Chrome documents the new prompt and its `onchange` consequence; WebKit and MDN document platform mechanics; Google's engagement and revocation data are vendor-reported, not a controlled demonstration that push improves product outcomes. Sources: [Chrome 155 Android prompt (2026-07-22)](https://developer.chrome.com/blog/notification-prompts-android), [Chrome notification revocation (2025-10-10)](https://blog.google/chromium/automatic-notification-permission/), [WebKit iOS Web Push](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/), [MDN permission](https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission_static), [MDN PushManager.subscribe](https://developer.mozilla.org/en-US/docs/Web/API/PushManager/subscribe).

## Async comboboxes: preserve typed text and committed selection — 2026-10-10

**Choose the interaction before choosing ARIA.** A native `<select>` is usually the lower-risk choice for a manageable, stable set; a combobox earns its complexity when users need search/filtering over a large or changing set. If arbitrary text is valid, define that explicitly; if only catalog items are valid, show a clear validation/recovery path. For multiple choices, consider a filterable list with persistent checkboxes before adopting token/chip-based multi-select. React Aria now supports multi-select ComboBox, but library support alone does not establish usability for a particular task.

**Model three different states:** (1) `inputText` — what the user typed, (2) `activeOptionId` — the suggestion currently navigated/highlighted, and (3) `committedValueId` (or IDs) — the actual form value. Merely highlighting a suggestion must not silently commit it. Decide whether blur restores the committed label, preserves free text, or displays an explicit unresolved-value error; React Aria's current ComboBox defaults to restoring the selected item on blur unless `allowsCustomValue` is enabled. Keep the distinction visible to users and to submission logic.

**Keyboard and assistive-technology contract:** WAI-ARIA APG documents editable combobox variants with manual versus automatic suggestion selection; neither is a universal default. For listbox popups, keep DOM focus on the text input while `aria-activedescendant` tracks the active option; connect the visible popup with `aria-controls`, reflect open state with `aria-expanded`, and use `aria-autocomplete` according to actual behavior. Preserve native text-editing keys; `Escape` dismisses suggestions, while `Enter` accepts an actively navigated option. Do not hijack `Enter` while an IME composition is active. A popup containing buttons or a complex editor is not automatically a listbox; use the correct dialog/grid interaction model or simplify it. APG examples are illustrative, not production certification.

**Async contract:** debounce only when justified by backend cost/latency; it does not prevent races. Cancel obsolete requests where possible *and* guard against stale completions (request generation/query identity) before changing visible results. React's own docs demonstrate why older searches can resolve after newer ones; React Aria `useAsyncList` supports abortable loads and explicit loading/error state. Do not replace results for the current query with late results for a previous query. Distinguish “no matches” from “request failed” and offer retry. If the active option disappears after filtering, clear/reconcile `aria-activedescendant` rather than referencing a removed DOM node. Keep previously committed selections stable when suggestion pages change.

**Input modality and fallback:** IME `compositionstart`/`compositionend` delimit in-progress character composition; defer commit/navigation shortcuts during composition and test the event order in supported browsers. Verify touch exploration, dictation/voice control, screen magnification, mobile virtual keyboards, zoom, and screen readers rather than treating axe/ARIA validity as sufficient. GOV.UK's accessible-autocomplete is a useful implementation study, but its own README says maintenance is minimal and lists incomplete testing for newer React/Preact versions; do not treat its name as a blanket accessibility guarantee. Where feasible, progressively enhance a server-rendered native control so the form still works without the custom widget.

**Release checks:** rapid typing with out-of-order responses; query deletion and empty query; zero results, timeout and retry; composition with Enter; pointer/touch selection; blur and Escape; keyboard cursor editing; selected value no longer in the loaded page; focus/announcements after async updates; zoom/voice input; and native fallback. Compare task completion and correction errors, not just ARIA attributes.

**Evidence boundary:** APG establishes interaction patterns; React Aria and React document concrete implementation behavior; MDN documents composition events; GOV.UK documents operational maintenance constraints. These sources do not prove that autocomplete is faster or more accessible than native select/checkbox alternatives for all audiences. Sources: [WAI-ARIA APG combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), [React Aria ComboBox](https://react-aria.adobe.com/ComboBox), [React Aria useAsyncList](https://react-aria.adobe.com/useAsyncList), [React race-condition guidance](https://react.dev/learn/you-might-not-need-an-effect), [MDN compositionend](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event), [GOV.UK accessible-autocomplete](https://github.com/alphagov/accessible-autocomplete), [GOV.UK checkbox guidance](https://design-system.service.gov.uk/components/checkboxes/).

## Data tables: preserve table navigation before adding grid behavior — 2026-10-13

**Decision:** start with a semantic HTML `<table>` for information organized in rows and columns, **even when columns can be sorted or rows contain links/buttons**. Use an interactive ARIA `grid` only when **managed arrow-key navigation** materially improves the task: spreadsheet-like editing/selection **or** link-heavy rows where ordinary Tab navigation would be excessively long. A table with action buttons is not automatically a grid; a grid introduces its own focus and assistive-technology obligations.

### Three interaction contracts

1. **Reading/comparing:** native `<table>`, a useful `<caption>`, `<th scope="col|row">` and, for irregular/multi-level headers, explicit `id`/`headers` associations. Prefer simplifying an overly complex table before adding ARIA. Native table navigation and ordinary tab order remain available.
2. **Sorting/selection/actions:** keep table semantics; make sortable header labels actual `<button>` elements and set `aria-sort="ascending|descending"` on the **currently sorted header**. `aria-sort` announces state; it does **not** sort records. Provide visible sort direction, a stable tie-breaker, and an understandable result count. Checkbox row selection and action menus can remain normal controls. Avoid turning the entire table into `role="grid"` solely for these features.
3. **Dense keyboard navigation or spreadsheet-like manipulation:** a grid is a composite widget with **one entry in the page Tab sequence** and author-managed arrow-key focus among cells. This may be worthwhile even for many linked records, but **every meaningful cell must be focusable or label a focusable target**: screen readers often switch to application mode and can miss otherwise inaccessible cell text. For editors/comboboxes, provide a deliberate navigation-versus-interaction mode (`Enter`/`F2` to enter, `Escape`/`F2` to return as appropriate); arrows cannot simultaneously navigate cells and move a caret. Test keyboard, touch and screen readers rather than assuming an ARIA role implements the behavior.

### Operational failure boundaries

- **Sorting:** changing a sort key must update both the actual row order and the announced sort state. WAI-ARIA can describe only limited multi-column precedence; expose multi-sort priority in visible text and an accessible description instead of assigning `aria-sort` to every header. Do not rely on hover-only sort affordances.
- **Selection:** keep selected row IDs distinct from visible page indices and from all matching results. A filter or page change must not silently change the action scope; see the existing bulk-selection contract. Stable row identity is essential during reorder, refresh and pagination.
- **Large data:** paginate when users need location, returnability and a bounded working set. Virtualization renders only a window and changes the accessibility contract: represent known full counts (or unknown `-1`) and absolute row/column positions correctly where required; verify focus does not disappear when an edited/selected row unmounts. **Vendor-documented counterexample (AG Grid, reviewed 2026-10-19):** virtualized rows/columns and sticky group rows can create DOM/visual-order mismatches for screen readers. Its accessibility guidance recommends `ensureDomOrder`, disabling sticky group rows and, when practical, pagination with virtualization disabled; it also documents grouped-header announcements and server-side unknown-row-count limitations. These mitigations trade memory/rendering performance for navigability and require AT testing on the exact configuration. Do not infer that a library's 100k-row demo proves accessibility or performance.
- **Responsive:** preserve the ability to compare across columns. Horizontal scrolling with clear affordances and stable row identifiers may be better than turning every row into an unrelated card. A card/list adaptation is reasonable when each item is consumed independently, but it must retain labels, actions, order, and relationships; test 200–400% zoom and keyboard access. Reduce/split columns when possible instead of shrinking all text.
- **State changes:** sorting, filtering, pagination and inline edits must preserve focus or move it to a predictable successor, keep URL/return context when appropriate, and announce important result changes without flooding live regions. Validate empty, loading, error and stale-data states separately.

**Agent acceptance test:** compare a read-only table, a sortable/action table, a link-dense table versus grid, and an editable grid using keyboard and screen reader. Measure Tab stops *and* missed cell content; test sort order versus `aria-sort`, selection across pages/filters, long/grouped headers, sticky/pinned columns, horizontal scroll, 400% zoom, row removal during edit, virtualization boundaries, unknown server-side counts, RTL and touch. A clean automated accessibility scan is not proof that composite-grid navigation works.

**Evidence boundary:** W3C/APG establishes semantic and keyboard contracts (including link-heavy grids as a possible Tab-stop optimization); GOV.UK and Carbon show deployed design-system choices; React Aria documents a grid implementation with a separate Tab navigation mode for interactive cells; TanStack describes pagination/virtualization trade-offs. AG Grid documents concrete limitations of its own implementation, not universal failure prevalence. None is a controlled comparison proving a grid, pagination or responsive cards universally superior.

**Primary sources:** [W3C table tutorial](https://www.w3.org/WAI/tutorials/tables/), [APG grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/), [APG sortable table](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/), [APG grid/table properties](https://www.w3.org/WAI/ARIA/apg/practices/grid-and-table-properties/), [GOV.UK tables](https://design-system.service.gov.uk/components/table/), [Carbon data-table accessibility (updated 2026-09-30)](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/accessibility), [React Aria Table](https://react-aria.adobe.com/Table), [TanStack pagination](https://tanstack.com/table/v8/docs/guide/pagination), [AG Grid accessibility limitations](https://www.ag-grid.com/javascript-data-grid/accessibility/).

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

## Command palettes: accelerator, not navigation replacement — 2026-10-14

**Decision:** add a searchable action launcher when a repeat-use, multi-task workspace has enough commands or destinations that keyboard-first retrieval materially reduces navigation cost. Do **not** replace visible primary navigation, search, or contextual controls with a hidden `Cmd/Ctrl+K` interface. A command palette is an **expert accelerator and discovery aid**, not proof of better usability.

### Separate intents and scope

- **Go to** navigates to an existing resource; **Find** searches content or records; **Do** executes a command. Keep these distinguishable in labels, result groups and empty states. Linear ships separate workspace search (`/`), view search (`Cmd/Ctrl+F`) and a contextual command menu; GitHub's command palette scopes suggestions to the current location and offers explicit resource-type prefixes. These are examples of deployed patterns, **not** measured evidence that one unified palette is always preferable.
- Make scope visible (workspace, project, current selection) and avoid stale-context actions. When the selection, permissions, or active workspace changes, re-evaluate available actions before execution. A result labeled “Delete” is not safe if it silently targets an earlier selection.
- Show human-readable verbs and object names, with destructive/irreversible actions clearly distinguished. Palette search and Enter should **not** bypass the same confirmation, authorization, undo and server validation required by the ordinary UI. A disabled result needs a useful reason; hide unauthorized data rather than merely disabling its command.
- Keep a visible launch button or menu entry, show the shortcut as a hint, and retain ordinary discoverable routes to essential actions. Provide meaningful empty results, recent/relevant suggestions where justified, and a way to recover from a mistaken command.

### Keyboard and accessibility contract

- An overlay palette that blocks the underlying page needs a correctly named **modal dialog** with initial focus in its search input, contained Tab sequence, Escape close, and logical focus return. A non-modal palette must not falsely claim modality. Search input plus suggestions can use the **combobox/listbox** pattern when its focus and selection semantics fit; a list of executable actions is **not automatically** a list of values to commit to an input. Choose semantics from actual behavior, not a library's component name.
- Preserve native text-editing shortcuts while the query input is focused. Test arrow-key active option, Enter activation, Escape, IME composition, screen-reader announcements of result count/selection, focus return, and no-results state. Prevent Enter from accidentally running a stale result during asynchronous search.
- **WCAG 2.2 SC 2.1.4 (Level A):** global printable-character shortcuts, including multi-character sequences, must be disableable/remappable to include a non-printable key **or** active only while the relevant component has focus. Merely suppressing them inside text inputs does not satisfy the global-shortcut rule. `aria-keyshortcuts` documents an implemented shortcut; it does not implement it or make it discoverable.
- Test `Cmd/Ctrl+K` against browser/OS/assistive-technology shortcuts and text editing; do not globally swallow collisions. Let users access all important functions without memorizing key combinations.

### Agent implementation and falsification

Start with the app's **authoritative action registry** (stable ID, verb, label, scope, availability predicate, permission check, navigation/action handler, risk and recovery), then render visible controls and palette entries from compatible contracts. Re-check context/permissions at execution; do not trust a client-side list as an authorization boundary. Compare a visible-navigation-only baseline with an added palette on novice/expert, keyboard/touch/voice-input tasks; measure command discovery, completion/error rate, mistaken destructive actions, shortcut conflicts, time and focus recovery. A successful keyboard demo or shipped example does not establish net UX benefit.

**Evidence:** shipped behavior: [Linear search](https://linear.app/docs/search), [Linear selected-item actions](https://linear.app/docs/select-issues), [GitHub command palette](https://docs.github.com/en/enterprise-cloud@latest/get-started/accessibility/github-command-palette), [VS Code shortcuts](https://code.visualstudio.com/docs/configure/keybindings). Normative/technical: [WCAG character shortcuts](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts), [W3C combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), [W3C modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [MDN aria-keyshortcuts](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-keyshortcuts). No comparative user-outcome evidence was established in this cycle.

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


## File uploads: separate selection, transfer and acceptance

**Decision rule (2026-10-10):** A selected file is not an uploaded file; a completed network transfer is not necessarily an accepted file. Model per-file states explicitly: selected → validating → transferring → server processing → accepted, with distinct rejection, failure, cancellation and retry paths. Never announce “Uploaded” solely because a progress indicator reaches 100%.

### Choose the interaction
- Start with a labelled native `<input type="file">`, descriptive format/size/count hints, and a working non-JavaScript path. Drag-and-drop is optional progressive enhancement; retain the picker for touch, keyboard and assistive technology. GOV.UK introduced an enhanced accessible picker in March 2025, while USWDS documents an outstanding focus-indicator issue in its own enhancement.
- For distinct required documents, prefer separately labelled controls; for interchangeable batches, allow multi-selection or “Add another”. USWDS notes that multi-selection can be unfamiliar and its file-input component does not upload asynchronously; avoid falsely marking selected files as uploaded.
- Before upload, identify specific problems: wrong type, size, empty file, count limit or template mismatch. Preserve unaffected files and form data. Let users reuse previously accepted files in the same journey when privacy permits.

### Transfer, processing and recovery
- Show per-file status and aggregate batch count. Only show determinate percentages when measured; `XMLHttpRequest.upload` provides progress events, but `lengthComputable=false` means a trustworthy percentage is unavailable. Avoid announcing every percentage tick through a live region.
- Distinguish “Transferring” from “Processing / checking” and “Ready”. HMRC's deployed upload pattern announces success after the file has been received **and scanned**, not merely after bytes have arrived.
- Provide a clear Cancel/Retry/Remove or Replace operation as appropriate. Client cancellation may not immediately delete partial server data; design status accordingly. On partial batch failure, retain accepted files and retry only affected items. Test same-file re-selection, refresh/navigation, timeouts and slow connections.
- Resumable upload is a **protocol choice**, not a visual feature. The tus 1.0 specification uses `HEAD` to recover the server-confirmed offset and `PATCH` to continue; mismatched offsets return `409`. Handle expiration, authorization and cleanup before promising recovery after interruption.

### Validation boundary
The HTML `accept` attribute only guides the file picker; it does not replace server-side checks. Apply file size/type/content validation and safe storage on the server. A thumbnail or client-side parse is not evidence of acceptance. Keep original file names and private previews from being exposed unintentionally.

**Agent checks:** native picker, drop, keyboard/touch, screen reader, mobile file providers, duplicate names, invalid/empty/oversized files, partial batch success, 100%-transfer-then-server-rejection, cancellation, retry, stale progress, focus and status announcements, and no-JS fallback. Measure whether users complete the task; official design-system patterns and platform APIs establish implementation mechanics, not universal UX superiority.

**Primary sources:** [GOV.UK](https://design-system.service.gov.uk/components/file-upload/), [HMRC](https://design.tax.service.gov.uk/hmrc-design-patterns/file-upload/), [USWDS](https://designsystem.digital.gov/components/file-input/) and [its accessibility tests](https://designsystem.digital.gov/components/file-input/accessibility-tests/), [MDN accept](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept), [MDN XHR upload](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload), [tus 1.0](https://tus.io/protocols/resumable-upload), [OWASP file upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).
