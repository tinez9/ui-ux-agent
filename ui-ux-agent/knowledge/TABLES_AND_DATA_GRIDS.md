# Tables and data grids

Dense tabular UI is not one pattern. A **table** communicates relationships between rows and columns; a **data grid** adds a composite application-like interaction model. Choose the weakest interaction model that fully supports the task.

## Core decision

Start with a semantic HTML table when users primarily **read, compare, sort, filter, navigate, or invoke occasional row actions**. Do not upgrade to an ARIA `grid` merely because the table is visually dense or contains controls.

Use a true data-grid interaction model when users need spreadsheet-like efficiency: frequent cell navigation, editing, range/cell selection, copy/paste, or many interactive cells where a normal tab sequence becomes impractical. WAI-ARIA explicitly distinguishes static tabular structure from `grid`, which is a composite widget requiring managed focus and directional keyboard navigation.

The cost of `grid` is not just ARIA markup. It is a keyboard contract, focus architecture, editing mode, selection semantics, screen-reader behavior, and test burden.

## Separate five layers

Treat these independently:

1. **Data/query state** — filtering, sorting, pagination, server query, totals.
2. **Presentation state** — visible columns, widths, density, pinned regions.
3. **Interaction state** — focus, editing, selection, expansion.
4. **Rendering strategy** — normal DOM, pagination, incremental loading, virtualization.
5. **Operation state** — saves, batch jobs, failures, stale data.

Do not let a rendering optimization redefine the dataset. TanStack's current documentation makes this distinction explicit: virtualization decides which indexes are rendered; the table model still owns rows, columns, sorting/filtering and other table state.

## Table vs grid

### Prefer a semantic table when

- comparison across labelled columns is the main task;
- cells are mostly text/status values;
- links, checkboxes, menus, or buttons are occasional controls;
- normal document navigation remains usable;
- editing occurs in a separate detail surface or only a few explicit fields.

A native `<table>` gives the browser and assistive technology structural semantics without recreating them manually.

### Consider a data grid when

- users repeatedly move among cells with arrow keys;
- many cells are editable or actionable;
- cell/range selection is a core capability;
- spreadsheet-style keyboard efficiency materially improves the workflow;
- hundreds of cell controls would otherwise create an unusably long tab sequence.

WAI-ARIA's grid pattern keeps only one grid descendant in the page tab sequence and moves focus internally. That benefit creates an obligation: every relevant cell must remain reachable and the implementation must define how users enter/leave editing or embedded widgets.

## Focus, selection, editing, and activation are different states

Never collapse these concepts.

- **Focus:** where keyboard interaction currently occurs.
- **Selection:** which rows/cells belong to an operation set.
- **Editing:** whether keystrokes manipulate a cell value rather than navigate the grid.
- **Activation:** invoking a link/button/default cell action.

In a true grid, arrow keys normally navigate cells. Once a user enters an editable control, those same keys may be needed for caret movement or the control itself. Define an explicit transition between navigation and editing modes; WAI-ARIA documents `Enter`/`F2`-style conventions and `Escape` restoration as common patterns, but product conventions should be tested rather than copied blindly.

For row selection and bulk operations, follow `BULK_ACTIONS_AND_SELECTION.md`; focus must not silently imply selection.

## Sorting and filtering

Sorting is a transformation of the result set, not merely a visual arrow in a header.

- expose which column is sorted and direction;
- make sortable headers actual controls;
- define whether multi-sort exists and make its priority understandable;
- preserve object identity and deliberate selection across sort changes;
- do not sort only the currently rendered virtual window;
- server-side and client-side sorting/filtering must not silently produce different semantics.

Filtering belongs to the result-set control architecture. Keep applied constraints discoverable even when filter controls are collapsed. Changing filters should deliberately define what happens to pagination and query-derived selection.

## Row actions and batch actions

Separate actions by target:

- row-local actions belong to the row or its contextual menu;
- selected-set actions belong to a batch surface;
- dataset/query-wide actions must state that broader scope explicitly.

Carbon's production data-table guidance hides the normal row-action mode behind a contextual batch-action bar once selection is active. The transferable principle is **target clarity**, not Carbon's exact component geometry.

Avoid making every cell interactive simply because a control can fit there. Dense tables become slower to scan and dramatically more expensive to navigate when every value is a button, menu, tooltip, or editable input.

## Virtualization is a performance technique, not a table feature

Use virtualization only when rendering volume is a measured or credible bottleneck. For small tables, normal rendering is simpler and generally preferable. TanStack explicitly notes that virtualization is not a substitute for server-side pagination, filtering, or sorting; if the dataset itself is too large to load into the client, virtualizing the DOM does not solve the data problem.

Before virtualizing, test whether simpler techniques are sufficient:

- server pagination/querying;
- fewer or user-selectable columns;
- progressive/incremental loading;
- reducing expensive cell rendering;
- browser-native rendering containment where appropriate.

`content-visibility: auto` can let browsers skip off-screen rendering work while keeping skipped content available to features such as find-in-page and tab navigation. It is not interchangeable with row virtualization, but it can be a lower-complexity optimization for some long rendered regions.

### Virtualization invariants

If virtualization is justified:

- logical row identity must not depend on DOM reuse;
- selection, editing, validation, and save state must survive unmount/remount;
- keyboard navigation must account for rows not currently mounted;
- focus must not disappear when the focused row leaves the rendered window;
- announced row/column position and total-set semantics must remain truthful;
- find/search/export semantics must be deliberately defined;
- variable row heights and expanded content need measurement strategy;
- test zoom, screen readers, keyboard navigation, and rapid scrolling rather than validating only pointer scrolling.

A virtualizer shrinking the DOM is not evidence that the resulting grid is accessible.

## Sticky and pinned regions

Sticky headers can preserve column meaning while scanning long tables. Pinned columns can preserve row identity while horizontally exploring many attributes. Both should earn their space.

Failure modes include:

- sticky layers covering focused content at zoom;
- too many pinned columns leaving almost no scrollable viewport;
- shadows/borders becoming the dominant visual hierarchy;
- header/body column widths drifting;
- scroll containers nested so deeply that keyboard and touch navigation become confusing.

MDN notes that fixed/sticky content can introduce repaint cost and can obscure content under zoom. Test the actual table on lower-powered devices rather than assuming stickiness is free.

## Responsive behavior

Do not mechanically turn every table row into a generic card. Cards often destroy the cross-row comparison that justified a table in the first place.

Choose based on the task:

- **comparison remains essential:** preserve the table and allow deliberate horizontal scrolling; keep row identity and key columns visible where feasible;
- **only a few attributes matter on small screens:** prioritize/hide secondary columns with a discoverable way to inspect them;
- **row inspection dominates comparison:** a compact row/list plus detail surface may be better than a miniature table;
- **editing is complex:** move editing to a dedicated sheet/page rather than forcing a desktop spreadsheet into a narrow viewport.

Responsive adaptation may change geometry, but it should preserve data identity, operation scope, and access to information.

## Density and readability

High density is valuable when it increases useful comparison per viewport without increasing interpretation cost.

Prefer:

- consistent alignment by data type;
- stable column positions;
- concise headers with accessible full meaning;
- whitespace that groups rows without turning every cell into a card;
- restrained status styling rather than a badge for every value;
- user-adjustable density only when user roles/tasks genuinely differ.

Do not use zebra stripes, borders, dividers, backgrounds, and pills simultaneously as redundant row separators.

## Failure modes

### ARIA grid by visual resemblance
A developer sees a spreadsheet-like rectangle and adds `role="grid"` without implementing the composite keyboard model.

**Fix:** stay with native table semantics unless the product actually needs grid behavior.

### DOM-window semantics
Sorting, selection, export, or totals operate only on virtualized/rendered rows.

**Fix:** operations target the logical result set, never the rendering window.

### Focus evaporates
A virtualized row unmounts while a cell inside it has focus.

**Fix:** coordinate focus and virtualizer state; scroll/render the destination before moving focus and define behavior when data disappears.

### Responsive cardification
Every row becomes an isolated card and users can no longer compare a column across items.

**Fix:** preserve tabular comparison when it is the primary task; reduce columns or provide a focused detail view instead of blindly changing the information model.

### Inline-control overload
Every cell is editable/actionable, making scanning and keyboard traversal expensive.

**Fix:** expose direct manipulation only for high-frequency operations; move secondary actions to row/detail surfaces.

### Fake performance fix
A huge client dataset is virtualized while filtering/sorting still blocks the main thread or network payload remains enormous.

**Fix:** measure the bottleneck; separate data volume, computation, rendering, and network costs.

## Implementation contract for agents

Before implementing a dense table/grid, specify:

- primary task: scan, compare, retrieve, edit, select, or operate;
- semantic model: native table or true grid, with justification;
- row identity and query semantics;
- sorting/filtering/pagination ownership (client/server);
- focus, selection, editing, and activation behavior;
- row/batch action targets;
- responsive information priority;
- sticky/pinned regions and zoom behavior;
- rendering strategy and measured virtualization threshold;
- loading/stale/error/partial-save behavior;
- keyboard and assistive-technology test matrix;
- performance test with realistic row/column counts.

## Evidence and boundaries

- **W3C WAI-ARIA APG — Table pattern:** distinguishes static tabular structure from interactive composite grids. https://www.w3.org/WAI/ARIA/apg/patterns/table/
- **W3C WAI-ARIA APG — Grid pattern:** documents managed focus, keyboard navigation, editing transitions, selection conventions, and responsibilities created by `grid`. https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- **IBM Carbon — Data table:** production design-system evidence for row actions, selection, and contextual batch actions. https://www.carbondesignsystem.com/components/data-table/usage/
- **Atlassian Design System — Dynamic table:** shipped design-system evidence for a table abstraction with sorting, pagination, and reordering. https://atlassian.design/components/dynamic-table/
- **TanStack Table — Virtualization guide:** current implementation evidence that virtualization is a rendering concern separate from table/query state and is primarily for large row/column counts. https://tanstack.com/table/latest/docs/guide/virtualization
- **MDN — `content-visibility`:** current browser-platform evidence for render-skipping behavior and its different accessibility/find semantics for `auto` versus `hidden`. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility
- **MDN — `position`:** platform guidance noting repaint and zoom/accessibility concerns around sticky/fixed content. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position

These sources strongly support semantic and implementation boundaries, but they do **not** establish a universal row count at which virtualization becomes beneficial, a universal mobile transformation, or evidence that ARIA grids outperform semantic tables for ordinary data browsing. Those decisions require task shape, measured performance, assistive-technology testing, and product-specific evidence.