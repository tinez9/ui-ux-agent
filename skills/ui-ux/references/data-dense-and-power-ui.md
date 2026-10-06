# Data-dense and power-user UI

Tables and grids, selection and bulk actions, command palettes, previews, comparison and direct
manipulation. Each adds capability *and* an interaction contract; add them when the task earns them.

## Quick rules

1. Use the **weakest interaction model** that fully supports the task: native `<table>` before
   ARIA `grid`; visible commands before palettes; navigation before previews.
2. Focus, selection, editing and activation are **different states** — never one highlight.
3. "Select all" must name its scope (selected / page / all matching query / dataset) and count.
4. Bulk and drag operations act on **semantic operations** with explicit targets, partial-failure
   reporting and recovery proportional to consequence.
5. Accelerators (palette, shortcuts, drag, peek) share **one command/operation model** with the
   visible UI — same permissions, validation, confirmation, undo.
6. Never make an accelerator (shortcut, palette, drag, hover) the only path to an important capability.
7. On small screens preserve relationships and operations, not desktop geometry.

## Tables and data grids

**Separate five layers:** data/query state (filter, sort, pagination, totals) · presentation
(columns, widths, density, pinning) · interaction (focus, selection, editing, expansion) ·
rendering strategy (DOM, pagination, virtualization) · operation state (saves, jobs, failures,
staleness). Rendering optimizations must not redefine the dataset.

**Escalation:**
`read/compare → <table>` · `+ occasional controls → table with native controls` · `repeated 2-D
navigation/edit/select → ARIA grid` · `+ expandable hierarchy → treegrid`.
`grid` means one Tab stop and an author-implemented arrow-key model, edit mode entry/exit
(Enter/F2 in, Escape/F2 out are common conventions) — a behavioural contract, not a styling role.
Don't use `grid` just to cut Tab stops; consolidate row actions instead.

**Audit checklist:**
- Semantic model justified (why isn't `<table>` enough?); real `<th>` headers; `aria-sort` on the
  sorted header; header labels stable.
- Alignment by data type (numbers right-aligned, tabular figures); stable column positions; concise
  headers with full meaning available.
- Status styling restrained (not a badge per value); not stripes + borders + backgrounds + pills at once.
- Not every cell interactive; row actions vs batch actions vs query-wide actions separated.
- Sorting/filtering applies to the logical result set, not the rendered window; client/server
  semantics match.
- Sticky header/pinned columns earn their space; don't cover focused content at zoom; widths don't drift.
- Editable grids: view/edit/pending/saved/error/conflict states; value kept on failed save; save
  boundary (cell/row/batch) visible; Escape semantics explicit.
- Focus after sort/filter/pagination/deletion/save/virtualization defined.
- Virtualization only for a measured bottleneck; logical identity independent of DOM reuse; focus
  survives unmount; truthful row/column counts; find/export semantics defined. Try server
  pagination, fewer columns, cheaper cells or `content-visibility: auto` first.
- Small screens: comparison essential → keep table + localized horizontal scroll + sticky
  identifiers; few attributes matter → prioritize columns; per-record reading → list/cards; complex
  editing → dedicated view. Cards are not an automatic mobile table.

## Selection and bulk actions

Admission test (heuristic): **repetition cost × expected selection size × recurrence >
selection/safety complexity.** Don't add multi-select just because a list exists.

**Scopes (treat as different operations):** explicit IDs · visible/page · all matching the query
(including unloaded) · entire dataset. Escalate explicitly: "50 selected on this page — Select all
3,247 matching". Represent query-wide selection symbolically (`query snapshot + excluded IDs`), and
decide snapshot vs live semantics — prefer snapshot for consequential actions.

**Selection persistence:** sorting keeps identities; pagination shouldn't silently drop a
deliberate cross-page selection; filter changes are dangerous — clear, keep explicit IDs with a
visible count, or keep a stated query snapshot. Hidden selections must be discoverable/clearable.

**Action eligibility for heterogeneous sets:** intersection (safest), partition (preview eligible
vs ineligible "Disable 37 of 42; 5 already disabled"), or per-item outcome. Never claim N when the
backend acts on fewer.

**Execution:** selection changes the action context — show a batch bar with count and exit;
disable conflicting row actions. Low-risk reversible → execute + "Undo archive of 842". Consequential
→ review consequence/scope. Irreversible → specific confirmation. Long jobs → durable job record,
progress only if trustworthy, navigate away safely, results later, explicit cancel semantics.
**Partial failure:** succeeded/failed/skipped counts, reasons, inspect failed items, retry only the
failed subset, idempotency. Re-authorize at execution.

**Accessibility/mobile:** native checkboxes, indeterminate header state; `aria-multiselectable`
and selected states for real composites; focus ≠ selection; visible checkboxes before Ctrl/Shift
conventions. Mobile: explicit selection mode, count + exit always visible, 1–2 primary actions +
labelled menu, long-press not the only entry.

## Command palettes and accelerators

**Earns its place** when the action space is large, repeated and context-dependent, users can name
what they want, keyboard-heavy work matters, or extensions grow the capability set. **Avoid** for a
handful of actions, mostly occasional/touch users, unpredictable jargon, or as a patch over weak IA.

- **Jobs:** navigate · find · act. Mixing them is fine only if result type, **scope** and
  consequence stay legible ("Archive project" must show *which* project).
- **One command registry:** `id · label · aliases · category · scope/context predicate ·
  availability · permission · target description · risk/confirmation policy · shortcut · execute()`
  — shared by menus, buttons, context menus, shortcuts, palette and automation.
- **Ranking:** exact/prefix match → aliases → current context/scope → recency/frequency →
  availability. Personalization never makes critical commands unpredictable or outranks the
  semantically correct contextual command.
- **Disabled vs absent:** show relevant-but-unavailable commands with a reason when it teaches;
  omit irrelevant ones; never leak unauthorized object names.
- **Execution safety:** finding ≠ committing; same confirmation/permission/undo as the visible path.
- **Accessibility:** combobox/listbox semantics (or dialog containing one); native text editing;
  arrows, Enter on the active result only, Escape closes without side effects and restores focus;
  result types not styling-only; shortcuts customizable and conflict-aware (browser, OS, AT,
  non-QWERTY, IME). ⌘/Ctrl+K is not universal.
- **Discovery:** visible search/command entry where important; shortcuts shown next to visible
  actions and in a help surface; zero results preserve the query and offer broader search.
- **Mobile:** keep the capability through a touch-native entry (search, action sheet), not a
  transplanted ⌘K overlay.
- **Measure:** retrieval success, zero-result/reformulation, wrong-command/target, novice vs expert
  usage — not invocation counts.

## Previews / peek

Use when users **scan → inspect → compare → continue scanning** and full navigation would destroy
position, filters or selection (**inspection frequency × navigation cost × value of preserved
context**). Skip when the preview repeats what's visible or most inspections lead to full open.

Contracts: transient peek (held key/deliberate) · toggle preview · persistent inspector pane
(selection updates it) · popover/definition preview (one narrow question) · system/content preview.
Content: identity and state → discriminating details missing from the row → evidence to decide →
few safe frequent actions → clear route to full detail. Preserve the source frame (scroll, filters,
selection, adjacent traversal). Deliberate trigger over hover (WCAG 1.4.13 for hover content); an
interactive preview isn't a tooltip. Decide live state vs snapshot. Cancel superseded requests;
preview must be cheaper than opening. On mobile, a sheet or plain navigation may be better.

Failure modes: mini destination (second UI to maintain) · context loss · preview inception ·
hover storms · stale dual representation · action-target ambiguity · mobile cargo cult.

## Comparison workspaces

For a small candidate set evaluated on shared criteria: normalize labels, units and missing-value
semantics; narrow first (filter/shortlist) for large sets; keep candidate identity visible;
highlight meaningful differences; preserve table semantics; don't hide compare selection behind
hover. Desktop evidence is stronger than mobile (narrow screens reduce usefulness).

## Direct manipulation and drag & drop

Use when **spatial relationship is information** (kanban, layers, canvas, timelines, splitters,
crop handles, node graphs). Prefer explicit commands for semantic outcomes, numerous/remote/hidden
destinations, precision, repeatability, auditability. Often expose both over one operation model:
`reorder(item, before|after target)`, `move(item, destination)`, `combine`, `copy`, `position`.

State machine: `idle → armed → manipulating → valid/invalid target preview → commit | cancel →
settled/recoverable`. Continuously answer: what am I moving, where can it go, what happens if I
release now (before/after/inside, move vs copy, rejection), how do I cancel?

**Checklist:** discoverable handle (a real button) when drag is primary; whole-card drag doesn't
fight links/text/scroll; predicted result shown at the target, not color-only; invalid state
explicit; count for multi-item drags and partial eligibility shown; controllable autoscroll;
commit on release (pointer cancellation, WCAG 2.5.2); Escape cancels; moved object stays visible
with focus/selection restored; undo for reversible moves; confirmation for consequential drops.

**Accessibility = outcome equivalence:** WCAG 2.5.7 requires a single-pointer alternative to
dragging; keyboard support alone doesn't satisfy it. Provide semantic commands ("Move to Doing",
"Move before Task B", move dialog for trees, numeric fields for geometry) rather than arrow-key
coordinate emulation; announce the result concisely.

**Touch:** respect scrolling/zoom (`touch-action` with care); handles where drag competes with
scroll; on phones a Move command may beat dragging. Don't remove mouse/keyboard controls because a
touchscreen was detected (hybrid devices).

**Remote/collaborative:** local preview ≠ committed state; send intent ("move A before B") not stale
indices; parent + position as one transition; define policies for concurrent moves, deleted
targets, reparenting cycles; presence is advisory, not a lock; explain material remote corrections;
undo must not restore a stale snapshot over others' work.

## Evidence boundary

W3C WAI-ARIA APG (table, grid, combobox, dialog), WCAG 2.5.2/2.5.7/1.4.13, MDN; Carbon, PatternFly,
HashiCorp Helios, Atlassian (data tables, bulk selection, pragmatic drag and drop); TanStack
(virtualization); GitHub, VS Code, Raycast, Notion, Linear, Apple Quick Look (palettes, previews);
Baymard (comparison); Figma and CRDT research (collaborative ordering). These establish semantics
and shipped conventions, not universal productivity gains or thresholds (virtualization row count,
confirmation size, ranking formula).
