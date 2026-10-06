# Responsive composition

Responsive design is **preservation of meaning under changing constraints**, not device-shaped
rearrangement. Mobile is not scaled-down desktop: reconsider hierarchy, density, navigation,
ordering, input method, target size and persistent controls.

## Quick rules

1. Define what must survive before choosing breakpoints: **task, relationship, comparison, state**.
2. A breakpoint is an implementation trigger, not a rationale. Change composition where the
   current arrangement **fails** its task — find that point by sweeping widths.
3. Viewport queries for page/device conditions; **container queries** for components that live
   in variable-width parents.
4. Reflow at 320 CSS px and 200% text are correctness requirements, not edge cases.
5. Representation may change (toolbar → overflow menu, inspector → sheet); meaning, capability,
   state visibility and naming may not.
6. Don't destroy genuinely 2-D structures (tables, comparisons, maps) to avoid horizontal scroll.
7. Visual order changes must not break DOM/focus/reading order.

## The four invariants

| Invariant | Question | Typical breakage |
|---|---|---|
| Task | Are the primary job, required actions and consequential alternatives still available? | "Responsive disappearance": secondary-but-required actions, errors, active filters vanish |
| Relationship | Do labels, values, help, status, controls and consequences still read as belonging together? | mechanical stacking separates a total from its items, help text from its field |
| Comparison | Can attributes that must be compared still be compared? | table → isolated cards; users must memorize values across cards |
| State | Do selection, progress, errors, filters, scope and location survive recomposition? | filters reset, selection lost, current location hidden in a closed menu |

## Audit checklist

At each sampled width (default 390 / 768 / 1440, plus 320 reflow and 200% text when in scope),
and in at least one narrow container on a wide viewport:

- **Overflow:** no unintended horizontal scroll at page level; localized scroll only for 2-D content (measure it — `inspection.md` §5).
- **Navigation model:** core destinations reachable; current location visible; menu pattern
  coherent with keyboard/focus; no duplicate simultaneously-focusable nav trees.
- **Hierarchy:** the primary task still leads; no hierarchy inversion (promos or secondary content
  above the task on mobile); sticky/fixed elements not eating the viewport.
- **Information priority:** what was dropped is genuinely secondary and still reachable.
- **Density:** appropriate for the context (not just "smaller"); comparison preserved where needed.
- **Touch:** targets ≥ 24px (44px for frequent/critical), spacing between adjacent destructive
  and routine actions, no hover-dependent functions, gestures have visible alternatives.
- **Typography:** readable sizes without shrinking body text below legibility; measure bounded on
  wide screens; headings wrap gracefully (2+ lines tested).
- **Controls:** inputs usable with the on-screen keyboard (correct `type`/`inputmode`, not hidden
  behind it); pickers suitable for touch.
- **Interaction model:** what replaces hover, right-click, drag, keyboard shortcuts on touch?
- **Tables:** deliberate choice (see below), sticky identifiers if horizontal scroll.
- **Images:** focal point survives crops; no unreadable shrunk screenshots/diagrams.
- **Zoom / reflow:** 200% text without clipping or overlap; 320px without 2-D scrolling; breakpoints
  don't shrink text so much that zoom stops enlarging it.
- **Long content / i18n:** long labels, translations, user strings without spaces, RTL.

## Recomposition strategies (in order of preference)

1. **Reflow** — flexible tracks, wrapping, intrinsic sizing (`minmax()`, `flex-wrap`, `auto-fit`)
   absorb moderate changes before any mode switch.
2. **Regroup** — when adjacency becomes cramped or misleading, change groups but keep semantic
   ownership (help stays with its field, totals with their items, actions with their object).
3. **Reorder carefully** — only where DOM/focus order still makes sense.
4. **Collapse safe detail** — progressive disclosure for information safe to fetch on demand;
   never active state, errors, prices/scope, consequential alternatives.
5. **Change representation** — overflow menu, sheet, disclosure, tabs — when capability, state
   visibility and naming remain predictable.
6. **Preserve 2-D structure** — for grids/matrices: prioritize columns, sticky identifier column,
   user-selectable columns, localized horizontal scroll, or a purpose-built detail view.

## Tables and comparison on small screens

Choose by the dominant task:
- comparison across rows/columns essential → keep the table, localized horizontal scroll, sticky
  identifiers, fewer default columns;
- only a few attributes matter on mobile → prioritize columns, reveal others on demand;
- each record is consumed independently (directory-like) → stacked list/cards are fine;
- complex editing → dedicated detail/edit view rather than a squeezed spreadsheet.
Card stacks are not an automatic "mobile table".

## Density is contextual

Narrow ≠ mobile ≠ novice; wide ≠ expert. A desktop user can have a narrow split pane; zoom produces
narrow CSS widths; a component can be narrow inside a wide dashboard. Expert tools may need
throughput on every size. Preserve the task's required simultaneous visibility before optimizing
for calm.

## Components: container queries

- Reusable components (cards, toolbars, result items, inspectors, dashboard panels, embedded
  widgets) should adapt to the space **their container** gives them.
- Start from a robust narrow default; enhance when there is room.
- `container-type: inline-size` when only width matters; name containers when nesting could bind
  the wrong ancestor.
- Thresholds come from where the component's content stops fitting (labels truncate harmfully,
  targets get unsafe, side-by-side stops helping) — not from device names.
- Don't duplicate every viewport breakpoint as a container breakpoint.
- Write the adaptation into the component contract, e.g.
  `ResultCard: default stacked · ≥28rem media beside content · ≥44rem reveal secondary metadata ·
  invariant: heading/action semantics, reading order, target size`.

Size container queries are broadly supported (since 2023); style/scroll-state/anchored queries
are newer — check the exact feature against the support matrix.

## Navigation across sizes

Preserve the conceptual navigation model and the names/order of core destinations; change only
presentation. If secondary destinations move into a menu, keep current location understandable.
Mobile filters: keep the entry point tied to the results, show applied filters outside the hidden
panel, make returning to updated results obvious. Bulk selection on mobile: explicit selection
mode, visible count and exit, one or two primary actions plus a labelled menu; long-press must not
be the only way in. Command palettes: preserve the capability with a touch-appropriate entry
point (search/action sheet), not a transplanted ⌘K overlay.

## Failure modes

- Device-name breakpoints chosen first, design forced into them.
- Mechanical stacking: desktop columns become one long column regardless of meaning or task order.
- Viewport-coupled components that break in a narrow pane on a big screen.
- Responsive disappearance of required functions or state.
- Comparison destruction (table → cards).
- Zoom treated as mobile emulation (shrinking text or removing function at high zoom).
- CSS order diverging from focus/reading order.
- Testing only English placeholder copy at three screenshots.
- Fixed heights that clip enlarged or translated text.

## Evidence boundary

W3C sets the normative floor (reflow 1.4.10, resize text 1.4.4, target size 2.5.8). MDN documents
media/container query behaviour. The four-invariant model and recomposition order are synthesis;
no source establishes universal breakpoint values or proves one composition improves outcomes —
validate with real content and tasks.
