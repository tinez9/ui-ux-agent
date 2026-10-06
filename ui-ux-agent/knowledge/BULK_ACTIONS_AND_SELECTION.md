# Bulk actions and multi-selection

Bulk actions are not merely a toolbar pattern. They are a **set-definition and consequence-communication problem**: the user must know exactly which objects are selected, which action is available for that set, and what will happen if only part of the operation succeeds.

## Core rule

Model selection independently from focus, pagination, rendering, and action execution. A robust product can answer at every moment:

1. **What set is selected?**
2. **Why are those objects in the set?**
3. **Does the set extend beyond what is currently visible?**
4. **Which actions are valid for every selected object?**
5. **What will happen if the operation is destructive, slow, or partially fails?**

Do not let a checkbox labelled or perceived as “all” silently change scope from visible rows to the entire query or dataset.

## Selection scopes

Treat these as different operations:

- **Explicit selection:** individually chosen objects.
- **Visible/page selection:** all currently rendered objects.
- **Query selection:** every object matching the current filters/search, including unloaded pages.
- **Dataset selection:** every object in the collection, independent of the current query.

When page and query scopes differ, expose the distinction. A safe progressive pattern is: select the visible page first, then offer an explicit escalation such as “50 selected on this page — select all 3,247 matching results.” HashiCorp Helios independently documents that global selection can include rows outside the current page and recommends showing selected and total counts.

### Query selection should be symbolic

For large result sets, do not require materializing thousands of IDs in the client. Represent query-wide selection as something like:

```text
selection = {
  scope: matching_query,
  querySnapshot: <stable query/filter definition>,
  excludedIds: [...]
}
```

This supports “all matching except these few” and avoids making UI pagination define the business operation. The backend must apply the same query semantics the UI communicates.

## Selection persistence is a product decision

Do not accidentally preserve or discard selection when filters, sorting, pagination, tabs, or searches change.

- Sorting normally should not change the selected object identities.
- Pagination should not silently clear a deliberately cross-page selection.
- Changing filters is more dangerous: if selection is query-derived, define whether it refers to the **snapshot that was selected** or dynamically tracks the new query.
- Prefer snapshot semantics for consequential actions; a set should not silently gain new members after the user selected it.
- If explicit selections remain while the user changes views, keep a persistent selected count and make hidden selections discoverable/clearable.

## Action availability

When selection exists, a contextual action bar is often clearer than repeating row actions. Carbon’s production guidance shows batch actions only after selection and disables single-row action controls while batch mode is active, reducing target ambiguity.

For heterogeneous selections, choose deliberately among:

- **Intersection:** show only actions valid for every selected item. Safest default.
- **Partition:** allow the action but preview which items are eligible/ineligible.
- **Partial execution:** useful for large operational tools, but only when the result reports successes, skips, and failures precisely.

Never present an action as applying to N objects when the backend will silently operate on fewer.

## Consequence and confirmation

Confirmation should be proportional to consequence, not automatically attached to every bulk operation.

For destructive or hard-to-reverse operations, confirmation should restate the **semantic target**, not just “Are you sure?” Examples:

- “Delete 2,418 matching invoices”
- “Disable 37 of 42 selected accounts; 5 are already disabled”

Prefer undo for fast, genuinely reversible operations. For expensive asynchronous work, move from confirmation to a job model with progress, cancellation when feasible, and a durable result summary.

## Partial failure is a first-class state

A bulk operation is rarely one atomic UI event even if it looks like one. Design for:

- all succeeded;
- some succeeded, some failed;
- some were skipped because state changed after selection;
- authorization differs across objects;
- the job was interrupted or cancelled;
- retries would duplicate already-completed work.

Return item-level or grouped outcomes and make retry semantics explicit. Prefer retrying the failed subset over rerunning the entire original set.

## Accessibility and keyboard model

Use native table/checkbox semantics when they satisfy the interaction. A visual data table does **not** automatically require ARIA `grid`; MDN notes that an HTML `<table>` is sufficient for many cases. Complex interactive grids introduce a composite keyboard model and therefore additional implementation obligations.

If a true ARIA grid/listbox/tree supports multiple selection, expose that capability with `aria-multiselectable="true"` and expose selectable descendants’ selected state. **Focus and selection are separate states** in multi-select widgets; moving keyboard focus must not silently imply selection unless that interaction model is intentionally documented and implemented.

Checkbox-based row selection is often easier to understand than desktop-style Ctrl/Cmd/Shift conventions alone. Power-user range selection may supplement visible controls, not replace discoverable selection.

## Mobile and responsive behavior

Do not shrink a desktop batch toolbar until it barely fits. On constrained screens:

- enter an explicit selection mode when useful;
- keep selected count and exit/clear controls visible;
- prioritize one or two high-frequency actions and move the rest behind a labelled menu;
- make destructive scope visible before execution;
- avoid long-press as the only way to discover selection.

## Failure modes

### Ambiguous “Select all”
The UI selects only the visible page while the user believes all matching results are selected, or vice versa.

**Fix:** name scope and count; offer explicit escalation from page to query when both are useful.

### Invisible off-page selection
Selected items disappear under filtering or pagination but remain actionable.

**Fix:** persistent count plus a way to inspect or clear the hidden selection.

### Dynamic-set surprise
A query-wide selection silently changes when filters or underlying data change.

**Fix:** snapshot consequential selections or clearly communicate live-set semantics.

### Action-target ambiguity
Row actions remain visually active while a batch selection is active, making it unclear whether an action targets one row or the selected set.

**Fix:** separate or disable conflicting action surfaces during batch mode.

### False atomicity
The UI reports “Done” despite partial backend failure.

**Fix:** model the operation as a result set with succeeded/failed/skipped counts and recoverable details.

### Confirmation without information
A generic modal adds friction but does not improve the user’s understanding of scope or consequence.

**Fix:** confirm the target set, action, irreversible consequence, and exceptional items.

## Implementation contract for agents

Before implementing bulk actions, specify:

- object identity and selection state model;
- page/query/dataset scopes that exist;
- whether query selection is snapshot or live;
- behavior across sort/filter/search/page changes;
- action eligibility for heterogeneous sets;
- destructive/reversible policy;
- async job, cancellation, and retry behavior;
- partial-failure representation;
- keyboard/focus/selection semantics;
- responsive selection mode;
- server-side authorization at execution time.

Never infer authorization from the fact that an item was selectable in the client.

## Evidence and boundaries

- **HashiCorp Helios — Table multi-select:** mature production design-system guidance for selected counts, cross-page/global selection, bulk actions, and destructive confirmation. https://helios.hashicorp.design/patterns/table-multi-select
- **IBM Carbon — Data table usage:** mature production guidance for contextual batch-action mode and avoiding simultaneous row-action ambiguity. https://github.com/carbon-design-system/carbon-website/blob/main/src/pages/components/data-table/usage.mdx
- **MDN — `aria-multiselectable`:** platform/accessibility reference for exposing multi-selection and selected descendants. https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-multiselectable
- **MDN — ARIA grid role:** platform/accessibility reference; explicitly notes that native HTML tables suffice for many use cases and documents the additional keyboard model of grids. https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/grid_role

These sources strongly support the interaction/state principles above, but they do not establish universal outcome improvements or a single best selection model for every domain. Exact confirmation thresholds, persistence behavior, and cross-page semantics remain product-dependent.
