# Destructive actions, confirmation, undo, and recovery

Design destructive actions from **consequence and recoverability**, not from button color. The central question is not “should this be red?” but “what is the cheapest reliable way to prevent or recover from a harmful mistake without training users to dismiss warnings?”

## Choose prevention or recovery deliberately

Use a confirmation step when an action is consequential and difficult or impossible for the user to reverse. Prefer immediate execution plus visible undo when the action is low-risk, frequent, and genuinely reversible. GitHub Primer makes this distinction explicit: destructive or irremediable actions deserve confirmation; non-destructive actions should generally offer undo instead of a warning. GOV.UK similarly reserves warning buttons and extra confirmation for serious destructive consequences that cannot easily be undone.

This yields a practical escalation:

`routine + reversible → execute + feedback/undo`

`meaningful + reversible → clear action + durable recovery path`

`destructive + difficult to recover → explicit confirmation`

`irreversible / high blast radius / identity-sensitive → stronger confirmation + technical safeguards`

Do not add confirmation merely because an action changes data. Repeated low-value confirmations create habituation and slow expert workflows without materially improving safety.

## Reversibility must be real

An “Undo” control is only appropriate when the system can actually restore the prior state within a useful interval. Distinguish:

- **UI undo** — reverses a local or immediately reversible mutation;
- **soft delete / trash** — removes an object from normal use while preserving a recoverable server-side state;
- **version/history recovery** — restores an earlier state after a mutation;
- **delayed execution** — schedules the destructive side effect after a cancellation window;
- **support/admin recovery** — technically recoverable, but not under ordinary user control;
- **irreversible deletion** — recovery cannot be promised.

Never describe support-assisted or best-effort restoration as ordinary undo. If recovery has a retention period, permission requirement, data-loss caveat, or unavailable subresources, expose those constraints before a consequential deletion when they affect the decision.

A useful lesson from GitHub itself is that apparent finality can be nuanced: its repository deletion flow warns about permanent effects and requires several confirmations, while its documentation also states that some deleted repositories can be restored within 90 days. The product should describe the actual recovery contract rather than using generic “permanent” language that hides important exceptions.

## Confirmation friction should scale with risk

Confirmation is not binary. Escalate friction according to:

- reversibility and recovery cost;
- blast radius (one object vs account/workspace/organization);
- data or financial consequence;
- effect on other people;
- rarity and likelihood of accidental activation;
- ambiguity about the target;
- security/identity implications;
- whether execution is immediate or delayed.

A normal confirmation dialog is enough for many single-object irreversible actions. Typed confirmation, reauthentication, explicit acknowledgement of effects, or a dedicated danger flow should be reserved for unusually consequential operations. GitHub's repository-deletion flow, for example, requires the user to traverse explicit warnings and type the repository name to verify the target. This is evidence of a high-consequence production pattern, not justification for typed confirmation on routine deletes.

### Typed confirmation has a narrow purpose

Typing an object name is useful primarily as **target verification** and intentional friction when deleting a high-value or high-blast-radius object. It is weak if the phrase is generic (`DELETE`) because that proves neither target comprehension nor meaningful consent. Do not use typing as theater when a recoverable action or clearer target summary would provide better safety.

## Confirmation content is part of the safety mechanism

A confirmation should answer, as compactly as possible:

1. **What action will happen?**
2. **What exact target or scope will it affect?**
3. **What important consequences follow?**
4. **Can the user recover, and how?**
5. **When will it take effect?**

Prefer `Delete repository` / `Delete 37 records` over `Continue`, `OK`, `Yes`, or `Confirm`. Primer and Atlassian both recommend action-specific labels; Primer explicitly recommends titles such as “Delete repository?” rather than “Are you sure?”.

Do not rely on red alone. GOV.UK explicitly warns that color cannot carry the meaning by itself; context and action text must explain the consequence.

For dangerous confirmation dialogs, default focus should not make accidental confirmation easier. Primer's current ConfirmationDialog places initial focus on Cancel for danger actions and returns focus to the trigger after closing. Treat that as a robust design-system convention, while still testing the complete dialog interaction with keyboard and assistive technology.

## Destructive actions and permissions

The UI must not imply that confirmation itself grants authority. Evaluate authorization server-side at execution time. High-consequence operations may also be constrained by organization policy, object state, locks, retention rules, dependencies, or legal/compliance policy.

If an operation becomes unavailable between opening the confirmation and execution, preserve context and explain the changed condition rather than silently closing or pretending success.

For multi-object actions, combine this guidance with the selection/eligibility contract in `DATA_GRIDS.md`: state the target count, scope, ineligible subset, and partial-failure policy before destructive execution.

## Delayed and asynchronous destruction

A destructive operation may have three distinct moments:

`intent recorded → cancellation/recovery window → irreversible side effect`

If execution is delayed, communicate whether the object is merely hidden, scheduled for deletion, or already partly dismantled. If cancellation is possible, show the deadline and where the user can cancel. Do not present a success message saying “deleted” when the system has only queued a job unless that distinction is irrelevant to the user's future decisions.

Large destructive operations need durable job/result state. A toast is not sufficient if processing can fail after the initiating screen disappears. Preserve what was targeted, who initiated it, when it started, what completed, what failed, and what remains recoverable.

## Destructive actions that affect other people

Deletion, revocation, removal, unpublishing, ownership transfer, workspace changes, and access changes may have social consequences even when technically reversible. Confirmation should surface the consequence that matters to the decision, such as “removes access for 12 members,” rather than dumping implementation detail.

For collaborative systems, recovery semantics must state whether undo restores memberships, permissions, links, notifications, external integrations, and downstream state—not merely the primary database record.

## Confirmation versus interruption versus dedicated flow

Use a compact confirmation dialog for a simple decision with a small amount of context. Do not force a complex policy decision, multi-step migration, dependency review, or large impact analysis into a tiny dialog. Primer explicitly advises against ConfirmationDialog for complex decisions and multi-step processes. GOV.UK's interruption-page pattern likewise treats interruption as exceptional and appropriate for unusual probable mistakes or actions that cannot be undone.

When the user needs to inspect affected resources, choose alternatives, transfer ownership, export data, or resolve blockers, use a dedicated page/flow that supports that work before the final commit.

## After execution

Feedback should describe the actual state:

- completed and reversible → confirm completion and expose undo/recovery where useful;
- queued → state that processing has started and provide a durable route to status;
- partially completed → report successes and failures separately;
- failed → preserve the user's context and explain recovery/retry;
- irreversible completion → provide a receipt/audit reference when consequence warrants it.

Do not auto-dismiss consequential error or warning feedback before the user can understand it. If the result matters later, persist it somewhere beyond a transient toast.

## Agent decision contract

Before implementing a destructive action, answer:

1. What exactly is being changed or destroyed, and who else is affected?
2. Is it genuinely irreversible, recoverable by the user, recoverable only by support/admin, or delayed?
3. What is the blast radius: one field, one object, a collection, account, workspace, or organization?
4. Would undo/recovery reduce errors better than a pre-action confirmation?
5. If confirmation is needed, what additional information is necessary for an informed decision?
6. Is stronger friction (typed target, reauthentication, acknowledgement, delay) justified by actual risk?
7. Does the confirmation identify the target and scope rather than merely asking “Are you sure?”
8. What happens if permissions, dependencies, or target state change before execution?
9. How are asynchronous or partial outcomes represented after the initiating surface disappears?
10. Can the system prove the recovery promise it communicates?

## Failure modes

- confirmation dialog for every mutation;
- generic “Are you sure?” with no target or consequence;
- `Yes / No`, `OK`, or `Continue` instead of action-specific labels;
- using red as the only signal of danger;
- typed `DELETE` ritual for routine or reversible operations;
- claiming an action is irreversible when a meaningful recovery path exists, or promising undo when restoration is only best effort;
- irreversible deletion when soft delete/versioning would cheaply reduce harm;
- hiding blast radius, affected collaborators, dependencies, or downstream effects;
- placing the dangerous action in the easiest default-focus path;
- optimistic “deleted” feedback for a queued job that can still fail;
- transient toast as the only record of a consequential asynchronous operation;
- client-side confirmation treated as authorization;
- undo that restores the primary object but not important permissions, relationships, or side effects;
- destructive bulk execution without explicit scope and partial-failure semantics;
- confirmations so frequent that users learn to approve them reflexively.

## Evidence boundary

GitHub Primer provides current first-party design-system guidance that confirmation is appropriate for destructive/irremediable actions, while undo is preferable for actions that are not destructive; its ConfirmationDialog guidance also documents action-specific language, danger focus behavior, and avoiding confirmation for routine/frequent/complex flows. GOV.UK independently reserves warning buttons and interruption flows for serious consequences or actions that cannot be undone, and explicitly warns against relying on color alone. GitHub's live repository-deletion documentation supplies a concrete high-consequence implementation: target-name typing, effect acknowledgement, policy/permission constraints, and a nuanced recovery window for some deleted repositories. These sources support the decision architecture and production conventions, but they do not establish universal quantitative thresholds for when typed confirmation, delay, or reauthentication becomes worthwhile. Those thresholds remain product- and risk-specific.