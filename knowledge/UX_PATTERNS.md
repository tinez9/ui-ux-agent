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
Navigation; search/filtering/results; onboarding; settings; tables/data grids; dashboards; feeds; catalogs; authentication; empty/loading/error states; notifications; dialogs/drawers; tabs; command palettes; contextual actions; comparison; bulk operations; undo/recovery.


## Search, filtering, and result-set orientation

Treat search, filters, sort, result count, applied state, and result navigation as one **result-set control system**. The user should always be able to answer: what did I ask for, what constraints are active, what set am I viewing, and how do I broaden or narrow it?

### Separate retrieval from refinement
Use search when the user can express a target or identifying clue; use filters to refine a known result set. Avoid turning “advanced search” into a dense form when progressive refinement will do. For exact-identifier workflows, surface the matching record rather than silently navigating into it so the user can verify the match.

### Make applied state visible outside the controls
Do not rely on checked boxes inside a sidebar/drawer as the only record of state. Show a compact applied-filter overview near the results, especially when controls can be hidden or off-screen. Each applied constraint should be removable; provide “clear all” when several constraints can accumulate. A bare badge such as “3 filters” is weaker than naming the active constraints.

This is both orientation and recovery: Baymard observed confirmation, removal, and context problems when ecommerce users lacked an applied-filter overview. DWP design notes independently identify the synchronization problem when controls and current results are not simultaneously visible.

### Apply timing is a product decision, not a universal rule
Two valid models exist:

**Explicit apply** is a strong default when:
- users commonly choose several criteria before wanting results;
- updates are expensive or slow;
- result movement would make the controls or current position unstable;
- accessibility/testing favors a predictable submit → result transition.

**Live filtering** can be appropriate when:
- updates are fast and stable;
- each selection is independently meaningful;
- users benefit from immediate result/count feedback;
- controls and result state remain understandable during updates.

Do not make checkbox changes silently trigger expensive or disorienting navigation. If updates are dynamic, announce concise status such as “18 results” without stealing focus. Avoid chatty live regions.

### Preserve orientation after a result-set change
After search/filter/sort:
- show the query and active constraints;
- show a useful result count when available;
- apply filters/sort to the entire result set, not only the visible page;
- reset pagination to the first page when the set changes;
- avoid unnecessary focus jumps;
- if a full navigation occurs, make the new page/state evident in title and heading;
- if content updates in place, expose the result/status change programmatically.

WCAG 4.1.3 specifically treats messages such as “18 results returned” and “No results returned” as status messages when they appear without a context change. The results themselves are not the status message.

### Zero results are a recovery state
Never treat zero results as a terminal blank state. Preserve the query and applied constraints, state that no matches were found, and provide the cheapest relevant recovery actions: remove one constraint, clear filters, edit the query, broaden scope, or use an alternative route. Do not silently substitute unrelated results without labeling that change.

Where feasible, prevent obviously impossible combinations or communicate counts before application, but do not disable options in ways that hide why a choice is unavailable.

### Mobile filters
On narrow screens, filters often move above results or into a disclosure/drawer. Keep the filter entry point visually tied to the results, surface applied state outside the hidden panel, and make returning to the updated results obvious. Test long filter groups, scrolling inside panels, keyboard/screen-reader order, and whether expanded filters push the result state out of view.

### Pagination vs continuous loading
Choose the navigation model from the task:
- **Pagination** favors location, returnability, explicit progress, deep linking, and bounded loading. It is a robust default for search, case lists, and goal-directed result sets.
- **Load more** can preserve browsing continuity while retaining an explicit user action; preserve loaded state and scroll position when users open an item and return.
- **Infinite scroll** fits low-commitment feeds better than goal-directed retrieval. Avoid it when users need the footer, stable position, comparison, keyboard navigation, or reliable return to a previous place.

GOV.UK explicitly advises against automatic infinite scroll because it causes keyboard-user problems; MOJ also notes footer reachability and recommends pagination for long result lists. This is strong public-service guidance, not proof that pagination wins every browsing context.

### Implementation checks
Test query persistence, browser back/forward, deep links/shareable filter state where useful, refresh, empty states, slow/error states, stale requests/race conditions, focus after updates, screen-reader announcements, keyboard-only filtering, 400% zoom/reflow, mobile drawers, result-count accuracy, sort + filter interaction, pagination reset, and return-from-detail scroll/state restoration.

## Search/filter evidence boundary
Baymard supplies behavioral evidence for ecommerce product lists; generalize orientation mechanisms more confidently than commerce-specific conventions. GOV.UK/MOJ/DWP/Home Office provide deployed public-service guidance and accessibility findings, including explicit-submit filtering and pagination. W3C defines the accessibility requirement for dynamic status messages. Live vs explicit apply should therefore remain conditional on task, latency, stability, and tested accessibility rather than being declared universally superior.
