# Tables and data grids

Use the least interactive tabular model that supports the task. A visually dense table is not automatically a `grid`.

## Choose the interaction model before the component

### Native data table by default
Use semantic HTML `<table>` when the primary task is reading, scanning, comparing, sorting, or following occasional links/actions. Native table semantics preserve document-style reading and do not require application-style focus management. Sorting controls can live in column headers without turning the entire table into a grid.

### Data grid only when two-dimensional interaction is real
Promote to an ARIA `grid` when users need spreadsheet-like behavior such as efficient cell-by-cell keyboard navigation, editable cells, cell/row selection, cut/copy/paste, or similarly intensive tabular interaction. `grid` is a composite widget: only one contained focus target normally participates in the page Tab sequence and the implementation owns directional focus movement. That is a substantial behavioral contract, not a styling role.

### Treegrid only for genuinely hierarchical tabular data
Use `treegrid` when rows form an expandable/collapsible hierarchy *and* the tabular/grid interaction remains useful. Do not use hierarchy as decoration or to avoid designing a clearer drill-down model.

## Complexity budget

Every capability changes the interaction contract. Add sorting, filtering, selection, editing, reordering, pinning, virtualization, hierarchy, and bulk actions independently only when the task earns them. A grid that combines all of them inherits their state, focus, recovery, responsive, and accessibility interactions.

A useful escalation rule:

`read/compare → table`

`table + occasional controls → table with native controls`

`repeated 2D navigation/edit/select → grid`

`2D interaction + expandable row hierarchy → treegrid`

Do not choose `grid` merely to reduce the number of Tab stops. If the table contains many row actions, first ask whether those actions should be consolidated, contextual, or moved to a detail/bulk-action workflow.

## Focus and editing are separate modes

In a true grid, arrow keys conventionally move among cells. Once a cell contains an editor or widget that itself needs arrow keys, the design must explicitly enter an interaction/edit mode and later restore grid navigation. WAI-ARIA APG documents Enter/F2-style entry and Escape/F2-style return as common conventions, but product behavior must remain internally consistent and tested with assistive technology.

Do not let the same arrow key unpredictably mean “move to another cell,” “move the text caret,” and “change this control.”

## Selection is not focus

Keep current keyboard focus, selected rows/cells, and the active editing cell as distinct states. Visual styling must not collapse them into one ambiguous highlight. If row checkboxes are the primary selection mechanism, preserve their ordinary checkbox semantics and make bulk-action scope explicit.

For “select all,” state whether it means visible rows, the current page, filtered results, or the entire result set. Never imply dataset-wide selection from a header checkbox that only affects rendered rows.

## Bulk selection is a query-state contract

Treat bulk selection as explicit state, not as a side effect of which rows happen to be rendered. At minimum model:

- **explicit IDs** — the user selected particular objects;
- **page scope** — all objects on the current page are selected;
- **query scope** — all objects matching the current filter/search are selected, including unloaded pages;
- **query scope with exclusions** — all matching objects except IDs the user subsequently deselected.

The UI must expose which model is active and the selected count when known. PatternFly's current bulk-selection guidance deliberately distinguishes “Select page” from “Select all” across pages and keeps a cross-page selected-item count; this is stronger than an ambiguous header checkbox. Carbon likewise uses a three-state header checkbox and exposes batch actions only after selection. These are mature implementation conventions, not evidence that every product needs bulk selection.

A useful two-step escalation for very large result sets is: header checkbox selects the visible/current page, then an explicit control offers “Select all N results matching these filters.” Do not silently upgrade page selection to dataset selection.

### Selection and filters must have defined semantics

Before implementing cross-page selection, decide what happens when search, filters, sort, pagination, refresh, or route changes. Sorting normally should not change membership. Filter/query changes are more dangerous: either clear selection, preserve only explicitly selected IDs with a visible count, or preserve a query-scoped selection only when the product can state exactly which query snapshot/rule it represents. Never let a hidden filter change expand the destructive target set without the user understanding it.

For mutable datasets, query-scoped bulk actions need a consistency policy. “All matching” can mean matches at selection time or matches when the action executes. If records can arrive/change between those moments, freeze a snapshot/version where feasible or disclose that the action applies to the current matching set at execution. Consequential operations should not hide this distinction.

### Bulk actions operate on eligibility, not merely selection

A selected set can contain objects with different permissions, states, locks, dependencies, or supported actions. Compute action eligibility across the whole target set before presenting or executing a bulk action.

Prefer one of these explicit policies:

- **all-or-nothing** — disable/block an action unless every target is eligible;
- **eligible subset** — state before execution that only `X of N` targets can be changed and why others are excluded;
- **per-item outcome** — attempt each target and return a durable success/failure summary.

Do not silently skip ineligible rows while presenting the operation as successful. For destructive or high-blast-radius actions, confirmation should name the action and scope/count, and recovery/undo should be proportional to consequence.

### Long-running bulk mutations need job semantics

Large actions may outlive the page request. Once work is asynchronous, preserve a job record with target definition, initiating user, progress when trustworthy, completion state, failures, and a route back to results. Do not keep a modal open as the only representation of a 10-minute operation.

Partial failure is a first-class state: report succeeded, failed, skipped, and still-pending counts separately when relevant; retain enough item-level detail to retry or repair failures without repeating successful work. If retrying is supported, define whether it retries failed IDs or re-evaluates the original query.

## Sorting and headers

Use real column headers. Sorting should expose the active sort column and direction programmatically (`aria-sort` is appropriate on the relevant header) and visually. Keep the header label stable; the control changes sort state rather than renaming the data concept.

## Virtualization changes the accessibility problem

Virtualization is a performance technique, not a UX feature. When only part of a logical grid is in the DOM, keyboard commands such as End/Control+End can otherwise resolve to the last rendered row rather than the last logical row. If virtualization is necessary, preserve logical row/column position and counts for assistive technology where supported, maintain focus across window changes, and test real browser + screen-reader combinations. Do not adopt ARIA examples as production code without this testing; WAI-ARIA APG explicitly warns that support can vary, especially on mobile/touch.

Prefer pagination or bounded rendering when it meets the task and materially reduces focus/virtualization complexity.

## Responsive behavior preserves relationships, not desktop geometry

Do not make every desktop column microscopic. Rank columns by task importance and choose deliberately among:
- horizontal scrolling when cross-row/cross-column comparison is essential;
- hiding genuinely secondary columns behind an explicit reveal/customization mechanism;
- a detail view when each record is better inspected individually;
- a stacked representation only when it preserves the relationships users need.

A card stack is not an automatic “mobile table.” It often destroys rapid column comparison. Conversely, preserving a very wide spreadsheet on a narrow phone may be technically responsive but practically unusable. Let the dominant task decide.

## Editing and mutation

For editable grids:
- distinguish view, edit, pending-save, saved, validation-error, and conflict states;
- preserve the user's value when a save fails;
- show whether edits save per cell, per row, or as a batch;
- make Escape/cancel semantics explicit and avoid silently discarding committed edits;
- handle server validation and concurrent updates rather than assuming local success;
- keep undo/recovery proportional to consequence.

Do not make every cell editable simply because the grid library supports it. Dense inline editing is justified when repeated cross-record editing is a core task; otherwise a focused editor/detail surface may be clearer and safer.

## Agent decision contract

Before implementing a complex table, answer:
1. Is the dominant task reading/comparison or spreadsheet-like manipulation?
2. Why is native `<table>` insufficient?
3. What exactly can be focused, selected, activated, and edited?
4. Which keys move between cells and which operate the widget inside a cell?
5. What does “select all” include: page, loaded items, filtered query, or entire dataset?
6. If selection spans pages, how is it represented and what happens when filters/data change?
7. Are all selected objects eligible for each bulk action; what happens on partial failure?
8. What happens to focus after sort, filter, pagination, row deletion, save, and virtualization?
9. Which columns/relationships must survive narrow layouts?
10. Are row/column counts and positions truthful when data is virtualized or partially loaded, and has the implementation been tested with keyboard and real assistive technologies?

## Failure modes

- assigning `role="grid"` to a normal table because it sounds more powerful;
- making every cell a Tab stop in a spreadsheet-scale surface;
- implementing arrow-key navigation without a coherent way to enter/exit cell widgets;
- treating focus and selection as the same state;
- ambiguous page-vs-dataset “select all”;
- silently expanding selection when filters/query change;
- storing “all selected” as only the IDs currently rendered;
- executing a bulk action against mixed permissions/states without an eligibility policy;
- reporting partial success as complete success or forcing users to rediscover failed items;
- long-running bulk work represented only by a blocking modal/spinner;
- virtualization that loses focused rows or reports misleading position/count information;
- responsive card conversion that destroys comparison;
- horizontal compression that makes targets/text unusably small;
- inline editing with unclear save boundaries or weak failure recovery;
- copying an APG example without production assistive-technology testing.

## Evidence boundary

W3C WAI-ARIA Authoring Practices defines the current `grid` and `treegrid` interaction contracts and explicitly distinguishes composite grid behavior from ordinary tables. Its examples are illustrative, not production guarantees, and warn about browser/assistive-technology support gaps. MDN independently recommends native table semantics where they satisfy the requirement and reserves `grid`/`treegrid` for structures with selection, two-dimensional navigation, or comparable interaction. Carbon's current data-table guidance establishes mature selectable-table and batch-action conventions; PatternFly's current bulk-selection pattern explicitly distinguishes page-level from cross-page selection and exposes selected counts. These sources establish semantics and implementation conventions; they do not prove that spreadsheet-like interaction or bulk operations improve a particular product task. Product research should justify whether the added interaction complexity is worthwhile.