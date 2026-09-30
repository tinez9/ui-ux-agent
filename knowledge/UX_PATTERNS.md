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
