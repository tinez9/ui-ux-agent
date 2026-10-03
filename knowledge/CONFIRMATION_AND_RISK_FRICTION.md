# Confirmation and risk-shaped friction

## Decision rule

Do not add confirmation merely because an action is destructive. Add **the least friction that materially improves error detection before the consequence becomes hard to recover from**.

Choose friction from consequence, reversibility, scope, accidental-trigger likelihood, user ability to verify the target, and whether the system can technically contain or delay the effect.

A useful escalation model is:

1. **Direct action** — low consequence and easy recovery.
2. **Direct action + visible Undo/recovery** — frequent action with reliable reversal.
3. **Inline warning / consequence preview** — risk is meaningful but interruption is not yet justified.
4. **Confirmation dialog or interruption step** — consequential, unusual, difficult-to-reverse, or plausibly accidental action where a second look can catch a mistake.
5. **Review/check step** — the user needs context, scope, recipients, values, permissions, or side effects to make the decision; prefer a real review surface over a tiny generic dialog.
6. **Strong verification** — only for exceptional consequences where proving deliberate intent or target identity adds real protection. Examples can include re-authentication or an explicit target-matching challenge. Do not use ritual typing or hold-to-confirm merely to make an action feel serious.
7. **Technical prevention / policy gate** — when human confirmation cannot make an unsafe action acceptable, block or constrain it instead.

Friction is a control with a cost, not a visual severity scale.

## Confirmation is useful only when it creates a decision

A confirmation step should introduce information or reflection capable of changing the user's choice. Useful confirmations answer concrete questions such as:

- **What exactly will happen?**
- **To what target and scope?**
- **What important consequence follows?**
- **Can it be undone, and how?**
- **Is this unusual enough that accidental activation is plausible?**

A dialog that merely repeats “Are you sure?” after an intentional click often adds ceremony without improving the decision.

GOV.UK explicitly limits warning buttons and extra confirmation to serious destructive consequences that cannot easily be undone, and its interruption-page guidance warns that interruption itself can obstruct task completion. Carbon likewise says modals should be used sparingly and recommends danger confirmation for destructive or irreversible actions. These are mature production conventions, not proof that every destructive action needs a modal.

## Reversibility changes the preferred control

Use the classification in `UNDO_OPTIMISTIC_COMPENSATION.md` before selecting confirmation strength.

### Easy, reliable reversal

For low-impact operations where the user can trivially recover, execute directly and expose recovery rather than forcing repetitive confirmation. Carbon's common-action guidance explicitly treats low-impact deletion this way.

Examples: archive one item, remove a tag, reorder an object, move a recoverable item to trash.

### Difficult or impossible reversal

Move protection before commitment. Explain the consequence and target before the final action. GOV.UK reserves warning buttons for serious destructive actions that cannot easily be undone; Apple gives destructive actions a distinct semantic role and warns against styling destructive actions as the default/primary choice because prominent defaults can be activated without careful reading.

### External or distributed consequence

Do not claim that a confirmation makes the operation safe. Confirmation can reduce accidental intent errors; it does not solve authorization, downstream propagation, stale state, prompt injection, or incorrect agent reasoning. Pair consequential actions with technical boundaries, current-state validation, idempotency, and recovery/compensation where possible.

## Match friction to the error you are trying to prevent

Before adding a control, name the failure mode.

| Failure to prevent | Better control |
|---|---|
| accidental tap/click | safer placement, target size/spacing, undo, or a focused confirmation if consequence is high |
| wrong object | show target identity and discriminating context |
| wrong scope | show count, query/scope, recipients, environment, or affected resources |
| misunderstood consequence | concise consequence statement and recovery status |
| stale or changed state | revalidate at commit; confirmation copy alone is insufficient |
| unauthorized actor | authentication/authorization, not an “Are you sure?” dialog |
| automated/agent mistake | risk routing, capability boundaries, reviewable plan/evidence, and technical gates |
| impulsive but intentional action | a pause may help only if the extra step meaningfully exposes consequence; measure rather than assume |

Do not make users solve the wrong problem. Typing a repository name may prove attention to a string while doing nothing to reveal that the selected repository is the wrong one.

## Confirmation content

A consequential confirmation should be scannable enough that the title and commit action carry the core meaning.

Prefer:

- title: **Delete production database?**
- consequence: **This permanently deletes 42 tables and cannot be undone.**
- context: environment, account/workspace, object name, count, recipients, cost, or permissions when they materially distinguish the target;
- commit action: **Delete production database**;
- escape action: **Cancel**.

Avoid generic `OK`, `Yes`, `Continue`, and `Are you sure?` when a specific verb and object can describe the commitment. Carbon recommends that both modal title and action reflect the action; Atlassian warning guidance emphasizes scannable consequence-oriented messaging. Apple distinguishes destructive role from primary role rather than treating “most likely action” as sufficient reason to emphasize destruction.

Color is supplemental. GOV.UK explicitly warns not to rely on warning-button red alone; context and button text must explain the consequence.

## Dialog versus review surface

A modal is appropriate only when the decision can be made from the information inside it. Carbon explicitly warns against modals when users need information from the underlying page because modal interaction blocks that context.

Prefer a dedicated review/check step when users need to inspect several fields, compare a before/after state, verify recipients or permissions, review a large bulk scope, or understand multiple side effects. GOV.UK's check-answers pattern is an example of making the material being committed inspectable before submission rather than hiding it behind a generic confirmation.

For very high-information decisions, “more severe modal” is often the wrong escalation. Increase **decision quality**, not merely visual alarm.

## Typed confirmation

Treat typed confirmation as an exceptional verification mechanism, not a default tier above a danger dialog.

It is justified only when the input itself verifies something relevant, for example:

- matching the exact high-risk target to reduce wrong-target execution;
- supplying a deliberately chosen phrase or value that demonstrates understanding required by policy;
- re-authenticating when identity/authorization is the actual risk.

It is weak when users can mechanically copy the displayed text without learning anything new. It also imposes disproportionate cost on keyboard, mobile, motor, cognitive, voice-input, and localization workflows.

If ordinary confirmation is insufficient, first ask whether the product should instead improve target context, split scope, delay commitment, require stronger authorization, or technically prevent the dangerous operation.

## Hold-to-confirm and time-based friction

Do not use press-and-hold as decorative seriousness. A hold gesture can reduce instantaneous accidental activation, but it does not inherently verify comprehension and creates input/accessibility complexity across pointer, touch, keyboard, switch, and assistive technology.

Use it only when there is a demonstrated accidental-trigger problem and an equivalent accessible mechanism. Never make duration itself the evidence that the user understood a consequence.

Similarly, countdowns should correspond to a real safety property (for example, a delayed commit/cancellation boundary), not merely force waiting.

## Frequency and habituation

Repeated prompts can become routine acknowledgement rather than meaningful review. Therefore:

- do not confirm ordinary reversible actions merely for consistency with rare dangerous ones;
- avoid asking the same user to approve predictable low-risk operations repeatedly when scope/capability controls can contain them;
- make exceptional prompts genuinely exceptional;
- measure cancellation, correction, immediate recovery, repeated approval, and accidental completion rather than treating prompt display as safety success.

A high confirmation rate is ambiguous: it can mean users deliberately agree, or that the prompt has become ceremony. Confirmation UX should be evaluated by **prevented/corrected errors and residual harm**, not acceptance rate alone.

## Bulk actions

Bulk consequence depends on both per-item severity and scope. Before commitment show a stable selection definition, count, and meaningful exceptions. “Delete selected” is inadequate when the selection represents a query spanning thousands of records.

For large or heterogeneous scopes:

1. expose the actual target set or a trustworthy summary;
2. surface ineligible/exceptional items before commitment where practical;
3. snapshot or otherwise stabilize the target semantics when drift would be dangerous;
4. use recovery/partial-failure states from `BULK_ACTIONS_AND_SELECTION.md` and `UNDO_OPTIMISTIC_COMPENSATION.md`.

## AI-agent implications

Agent approvals should follow the same principle: a human prompt is useful only if the human has enough information and ability to make a better decision than the agent/router alone.

Approval surfaces for consequential agent actions should prioritize:

- semantic operation rather than raw tool-call syntax;
- target and scope;
- external side effects;
- relevant evidence or diff;
- reversibility/compensation status;
- unusual privilege or environment changes;
- grouped approval only when grouped actions share a meaningful risk boundary.

Do not use confirmation to transfer responsibility to the human after presenting an opaque plan. If the reviewer cannot realistically verify the operation, redesign the evidence, narrow the capability, or route the action to a stronger control.

## Failure modes

1. **Confirmation theater** — an extra click is treated as risk reduction without evidence that it catches the relevant error.
2. **Generic consequence** — “Are you sure?” supplies no target, scope, or effect.
3. **Danger as primary** — destructive action receives default visual/keyboard prominence and is triggered reflexively.
4. **Modal starvation** — necessary context is hidden behind the dialog, so the user must confirm from memory.
5. **Ritual typing** — users copy a phrase that verifies no meaningful property.
6. **Friction inflation** — frequent reversible actions inherit controls intended for rare irreversible ones.
7. **Color-only warning** — severity depends on red rather than language and context.
8. **Scope blindness** — the same confirmation is used for one object and ten thousand objects.
9. **Accessibility tax** — hold, typing, or timing mechanisms lack equivalent accessible paths.
10. **Human rubber stamp** — agent approval arrives too frequently or with too little evidence to support real review.
11. **False safety boundary** — confirmation is used instead of authorization, containment, validation, or idempotency.
12. **Recovery mismatch** — UI says “permanent” when recovery exists, or promises Undo when external consequences cannot be reversed.

## Implementation contract for agents

Before implementing confirmation, answer:

1. What concrete error or harm is this friction intended to prevent?
2. What is the consequence and blast radius?
3. Is the operation truly reversible, cancellable, compensatable, or irreversible?
4. How likely is accidental activation versus deliberate misuse or wrong reasoning?
5. What target/scope/context must the user inspect to make a better decision?
6. Can the decision be made inside a dialog, or does it need a review surface?
7. Does stronger friction verify anything meaningful, or merely consume effort?
8. What accessible equivalent exists for any gesture/timing/input requirement?
9. What technical control remains necessary regardless of user confirmation?
10. How will we know whether the confirmation prevented errors rather than created habituation?

If the system cannot name the error the confirmation prevents, do not add it by default.

## Evidence and boundaries

**Production design-system convergence:** GOV.UK, Apple, Carbon, and Atlassian independently distinguish destructive actions and recommend consequence-aware warning/confirmation. GOV.UK and Carbon explicitly caution against unnecessary interruption/modal use. This supports risk-shaped friction, not a universal numeric threshold.

**Reversibility evidence:** Carbon distinguishes low-impact deletion that can be trivially recovered from deletion requiring warning. This aligns with the repository's existing undo/compensation model.

**Context evidence:** Carbon warns that modal decisions are inappropriate when information outside the modal is needed; GOV.UK provides check/review patterns for inspecting information before submission. This supports escalating information quality rather than merely increasing dialog severity.

**Evidence gap:** this cycle did not find strong comparative outcome evidence establishing universal thresholds for typed confirmation, hold duration, number of confirmation steps, or a fixed risk score. Treat those as product/domain hypotheses requiring validation, not best-practice constants.

### Sources

- GOV.UK Design System — Button: https://design-system.service.gov.uk/components/button/
- GOV.UK Design System — Interruption pages: https://design-system.service.gov.uk/patterns/interruption-pages/
- GOV.UK Design System — Check answers: https://design-system.service.gov.uk/patterns/check-answers/
- Apple Human Interface Guidelines — Buttons: https://developer.apple.com/design/human-interface-guidelines/buttons
- Apple Developer Documentation — destructive notification action option: https://developer.apple.com/documentation/usernotifications/unnotificationactionoptions/destructive
- IBM Carbon Design System — Modal: https://www.carbondesignsystem.com/building-blocks/core/components/modal/guidelines
- IBM Carbon Design System — Common actions: https://www.carbondesignsystem.com/building-blocks/core/patterns/common-actions/tab-1
- Atlassian Design System — Warning messages: https://atlassian.design/foundations/content/designing-messages/warning-messages

## Maturity

**DEVELOPING.** Mature platform/design-system guidance strongly supports consequence-aware destructive styling, selective interruption, explicit consequences, and reversibility-sensitive protection. Evidence is much weaker for universal escalation thresholds and for typed/hold-to-confirm mechanisms; those remain contextual and should be validated rather than ritualized.
