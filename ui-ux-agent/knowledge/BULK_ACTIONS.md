# Reversible Bulk Operations

Bulk actions compress repeated work, but they also multiply the blast radius of a mistake. Treat them as a workflow contract around **selection, scope, consequence, execution, and recovery**, not as a toolbar convenience.

## Evidence boundary

Carbon's production data-table guidance establishes a mature interaction pattern: checkbox multi-selection enters a dedicated batch-action mode, exposes actions that apply to the selected set, disables conflicting row actions, and provides a clear way to cancel/deselect. W3C WCAG 2.2 provides the stronger safety boundary for consequential operations: when a flow modifies or deletes user-controlled stored data, at least one of reversibility, error checking/correction, or review/confirmation must be available. W3C cognitive-accessibility guidance independently recommends predictable back/undo behavior.

These sources justify the interaction and safety architecture below. They do **not** establish a universal item-count threshold for confirmation or prove that every bulk workflow increases productivity.

## When bulk actions earn their place

Use bulk actions when users repeatedly perform the same compatible operation across multiple independently selectable objects and the savings over repeated single-item actions are meaningful.

Do not add multi-select merely because a list exists. It adds selection state, scope ambiguity, responsive complexity, keyboard/accessibility work, and larger error consequences. For infrequent actions on small sets, repeated inline actions can be simpler.

A useful admission test is:

**repetition cost × expected selection size × recurrence > selection/safety complexity**

Treat this as a design heuristic, not a measured formula.

## Selection is explicit application state

Once one or more objects are selected, make the state unmistakable:
- show the selected count;
- expose only actions valid for that selection;
- provide an obvious exit/deselect path;
- visually preserve which objects are selected;
- do not let row-level actions ambiguously compete with the batch operation.

Carbon switches the table toolbar into a batch-action bar after selection and disables single-row action surfaces while batch mode is active. This is a useful general rule: **selection changes the action context, so the interface should visibly change with it**.

## Make scope explicit

The dangerous ambiguity is rarely the verb; it is the set the verb applies to.

Distinguish clearly between:
- selected visible items;
- all items on the current page;
- all items matching the current filter/query;
- all items in the dataset.

Never silently reinterpret `Select all` from one scope into another. If a product offers escalation from "all on this page" to "all matching 12,430 results", make that transition explicit and show the resulting count.

Filtering, pagination, refreshes, and live updates can invalidate selection assumptions. Define whether selection survives those transitions and communicate the rule. Prefer stable object IDs over row positions.

## Risk-shaped execution

Do not use confirmation dialogs mechanically. Choose protection from consequence, reversibility, detectability, and blast radius.

### Low consequence + reliably reversible

Execute directly when the result can be safely undone. Return immediate feedback containing:
- what happened;
- how many objects were affected;
- an Undo action while reversal remains valid.

This keeps high-frequency work fast while preserving recovery.

### Consequential but reviewable

When the operation changes important stored data, a pre-execution review can expose the operation, scope, exceptional items, and consequences before commitment. WCAG 2.2 SC 3.3.4 explicitly recognizes review/confirmation, checking/correction, or reversibility as valid protection strategies for important submissions.

### Irreversible / high-blast-radius

Require stronger friction when reversal is impossible or incomplete. State the concrete object count and consequence rather than asking a generic `Are you sure?`. If some selected objects behave differently because of permissions, dependencies, or lifecycle state, surface that before commitment when feasible.

The number of selected items alone is not a sufficient risk model: deleting one production credential can be more consequential than archiving hundreds of recoverable records.

## Preview when effects are not obvious

A preview is valuable when the action's consequences cannot be inferred from the selected rows alone—for example bulk permission changes, migrations, merges, replacements, notifications, or transformations.

Preview should answer:
- what will change;
- what will remain unchanged;
- which items cannot be processed and why;
- downstream or externally visible effects when material.

Do not force a review screen for trivial reversible operations merely to create ceremony.

## Partial failure is a first-class state

Bulk operations often fail per item. Avoid reducing `87 succeeded, 13 failed` to a generic error or pretending the whole operation failed.

Return a structured result with:
- succeeded count;
- failed/skipped count;
- reasons grouped when useful;
- ability to inspect failed objects;
- retry only the safe failed subset when possible.

Idempotency and per-item status are implementation concerns with direct UX consequences. A retry must not accidentally repeat successful side effects.

## Undo is a capability, not a snackbar decoration

Only offer Undo when the system can restore the relevant state reliably. Define:
- what state is restored;
- how long reversal remains possible;
- whether external side effects can also be reversed;
- what happens if another actor changes an item before undo.

For delayed/destructive operations, a soft-delete, archive, grace period, or queued execution model may provide a stronger recovery contract than a client-only notification.

If reversal is partial, label it precisely instead of promising `Undo`.

## Long-running bulk work

Do not keep the initiating screen blocked when server-side work can continue safely. For long-running jobs:
- acknowledge that the operation was accepted;
- preserve the submitted scope as a durable job record;
- expose meaningful progress only when trustworthy;
- allow navigation away when safe;
- provide completion and failure results later;
- define cancellation semantics explicitly rather than assuming cancellation can roll back completed items.

The job record is especially important when the underlying query continues changing: execution should operate on a well-defined submitted scope, not silently absorb future matches unless that is the intended automation model.

## Accessibility and input

Use native selection controls where possible. Carbon's table pattern uses checkboxes for multi-selection and an indeterminate state for aggregate selection. Keep selected state and batch controls keyboard operable and programmatically identifiable.

For operations that modify/delete user-controlled stored data, WCAG 2.2 SC 3.3.4 is an accessibility requirement at Level AA: the submission must be reversible, checked with an opportunity to correct, or reviewable/confirmable before finalization.

Do not rely on color alone to communicate selected, failed, pending, or destructive states.

## Implementation model

Represent selection and execution separately. A practical bulk command can carry:
- operation type and parameters;
- explicit object IDs or a versioned/query scope contract;
- initiating user and authorization context;
- submitted count;
- idempotency key/job ID;
- per-item outcome where needed;
- recovery/reversal metadata;
- timestamps and audit information for consequential operations.

Re-authorize at execution time. Selection does not grant permission, and permissions may differ across selected objects.

## Failure modes

- ambiguous `Select all` scope;
- a destructive action whose confirmation omits the affected count;
- confirmations on every harmless reversible operation, producing friction without meaningful safety;
- an Undo control that cannot restore external side effects;
- clearing selection after partial failure so users cannot inspect/retry the failed subset;
- retrying an entire non-idempotent job and duplicating successful side effects;
- silently skipping unauthorized/incompatible objects;
- retaining stale selection across filters/pages without communicating it;
- freezing the whole UI for long-running server work;
- treating batch actions as merely multiple client-side single-item requests without a coherent failure/recovery model.

## Agent decision rule

Use bulk actions when repeated multi-object work materially benefits from compression. Make the **selected scope and count explicit**, shape friction to **consequence + reversibility + blast radius**, prefer reliable recovery over ritual confirmation, and model partial failure and long-running execution as normal states rather than edge cases.

## Current source basis

- Carbon Design System, *Data table — Guidelines*: multi-select, batch-action mode, selected-state behavior, cancel/deselect, and separation from row actions; reviewed 2026-10-02.
- Carbon Design System, *Checkbox — Guidelines*: multi-selection and indeterminate aggregate selection; reviewed 2026-10-02.
- W3C WAI, *Understanding SC 3.3.4: Error Prevention (Legal, Financial, Data)*, WCAG 2.2: reversible / checked / confirmed protection for consequential submissions and stored-data modification/deletion; reviewed 2026-10-02.
- W3C WAI, *Let Users Go Back*, Cognitive Accessibility supplemental guidance: predictable back/undo supports mistake recovery; reviewed 2026-10-02.
