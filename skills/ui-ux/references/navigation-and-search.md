# Navigation, wayfinding and search

Navigation is an orientation and state-management system, not a set of headers, sidebars, tabs
and breadcrumbs. Search, filters and result sets are one control system.

## Quick rules

1. Every navigation system answers: **Where am I? What is around me? Where can I go? What happens
   if I go there? Can I return without losing work?**
2. Design from the **task topology** (linear transaction, repeated multi-task workspace,
   hierarchical information space, or mixed) — not from a preferred component.
3. Labels describe the **destination and its scope**, not the author's intent ("Explore", "Learn
   more" are suspect). Semantic discrimination between siblings beats grammatical symmetry.
4. Breadcrumbs = hierarchy; Back = history/previous meaningful state; steppers = process progress.
   Don't use one for another.
5. Current location: visible beyond color + `aria-current`. Selected ≠ expanded ≠ focused ≠ current.
6. URL/history: shareable query-defining state in the URL; incidental UI toggles out of history;
   deep links, refresh and back/forward are first-class paths.
7. Responsive changes presentation, not the conceptual map (same names, order, destinations).
8. Applied filters visible outside the filter controls; result count and zero-results recovery.
9. Authorization lives at the destination/server, never only in hidden links.

## Audit checklist

- Current location obvious on every page (title/heading + nav state)? Programmatic `aria-current`?
- Labels: predictable destination and scope? overlapping siblings? vague verbs? format-first IA
  ("Videos / Articles") where users seek topics/tasks?
- Hierarchy: does each level help choose, or merely delay? generic umbrellas ("Products") hiding
  categories on mobile?
- Global nav inside a focused transaction (exits instead of progress)?
- Breadcrumbs used for click history or linear progress? breadcrumb + Back both shown without purpose?
- Tabs: real peer views of one context? keyboard pattern implemented? auto-activation only if
  panels are instant (no network on arrow keys)? independent pages better as links/routes?
- Expandable nav uses disclosure (button + `aria-expanded`, links stay links), not ARIA `menu`;
  no hover-only fly-outs; parent link and expander separated when both navigate and expand.
- Landmarks: distinct labels for multiple `nav` regions; skip link before long persistent nav;
  not over-landmarked.
- Returnability: filters/query/selection/scroll/drafts survive leaving and returning; Back
  reverses meaningful navigation; direct entry on deep pages works; refresh keeps state.
- Card hit areas: clear whether the whole card or only parts are links; multiple destinations visibly distinct.
- Mobile: core destinations reachable without hunting; current location visible; no duplicated
  focusable nav trees; bottom nav only for a small set of frequent peers.
- Permissions: no actionable-looking dead destinations; same concept not renamed per role.
- Personalized/AI navigation: stable spine, adaptive edge only.

## Navigation scopes

| Scope | Use for | Notes |
|---|---|---|
| Global | durable top-level areas meaningful across the product | keep the set small; not every feature |
| Local / section | destinations inside one area | sidebar is one rendering; avoid unlimited tree depth (some systems cap tiers) |
| Contextual | destinations relevant to the current object/task | must not masquerade as global structure |
| Breadcrumbs | hierarchical ancestry, parent jumps | not for flat structures or linear transactions; supplement, not replacement |
| Local tabs | small set of peer views of one object | widget with keyboard contract |
| Steps / task list | progress in a process | not hierarchy |

Global nav + section nav + breadcrumb + local tabs can coexist when each encodes a different
relationship; it's harmful when surfaces encode the **same** hierarchy differently or disagree
about current location. Derive all active states from one canonical route/object state.

Classify each transition before choosing components: destination identity (new resource or another
presentation), hierarchy relation, scope, switching frequency, history/linkability, permissions.

## URL and state

| State | Default |
|---|---|
| shareable / query-defining (filters, sort, page, selected tab of a resource) | URL when practical |
| temporary disclosure | local UI state |
| unsaved authored work | preserve or warn before destructive navigation |
| scroll/selection on return | restore when it helps continuity |
| security/permission context | revalidate; never trust stale client state |

Don't build a custom Back that contradicts browser history.

## Information scent

Scent = label + surrounding context + prior experience. Check six dimensions: destination ·
scope · differentiation from siblings · location after click · recovery from a wrong choice ·
meaning out of context (screen-reader link lists, search, palettes, responsive). Use native
`<a href>` for navigation and buttons for actions. Evaluate with first-click correctness,
destination/scope prediction, backtracking and location comprehension — not click-through rate
(misleadingly attractive labels have high CTR). Tree tests isolate IA; first-click tests include
page context.

## Search, filters and result sets

Treat search, filters, sort, count, applied state and pagination as **one system**. Users should
always know: what did I ask for, what constraints are active, what set am I viewing, how do I
broaden/narrow it?

- **Search vs filters:** search when users can express a target; filters refine a known set. For
  exact identifiers, show the match rather than silently navigating into it.
- **Applied state outside the controls:** named, individually removable chips near the results;
  "clear all" when several accumulate. "3 filters" alone is weak.
- **Apply timing is a product decision:** explicit Apply when choosing several criteria, slow/
  expensive updates or destabilizing result movement; live filtering for fast, stable,
  independently meaningful choices — announce result counts without stealing focus.
- **After a change:** query and constraints visible, useful count, constraints apply to the whole
  set, pagination resets, no unnecessary focus jumps, status exposed programmatically.
- **Zero results = recovery state:** keep query/constraints, say nothing matched, offer the
  cheapest relevant broadening; label substituted results as such.
- **Mobile filters:** entry point tied to results; applied state visible outside the drawer; clear
  return to updated results.
- **Pagination vs continuous loading:** pagination favours location, return, deep links, bounded
  loading; "load more" keeps continuity with explicit action; infinite scroll suits low-commitment
  feeds, not goal-directed retrieval (position, comparison, keyboard, footer access suffer).
- Test: back/forward, deep links, refresh, race conditions between requests, result-count
  accuracy, return-from-detail restoration, keyboard filtering, zoom.

## Saved views

Worth it when users repeatedly reconstruct the same lens on a large changing dataset (triage,
planning, review, monitoring): **setup cost × recurrence × value of a stable lens**. Separate
**query/membership**, **presentation** (columns, grouping, sort, density) and **ownership/scope**
(personal, team, system). Make explicit whether an edit is temporary, saved to my view, or changes
the shared definition. Live definitions for work views; snapshots/exports for evidence. Favorites/
pinning for retrieval. Stale/invalid fields must degrade visibly, never silently broaden results.
Shared URLs don't share permissions.

## Personalized and AI-generated navigation

Keep canonical names, destination semantics, location cues and permission meaning stable;
personalize ranking, shortcuts and contextual entry points. Generated labels must map
`label → canonical concept → destination → current-location signal`; never invent routes or
bypass authorization. Keep a deterministic route (search, all-destinations, fixed primary areas).

## Focus after navigation

A route change and an in-place replacement differ. SPA route changes to a genuinely new view may
need focus on a meaningful start (heading/main) plus announcement; same-view state changes keep
focus. See `accessibility.md` § Focus ownership.

## Failure modes

Component-driven IA · everything is a tab · slow auto-activating tabs · everything is a menu ·
unbounded tree navigation · duplicated hierarchy · hover maze · color-only current state ·
responsive conceptual drift · back-button sabotage · permission as CSS · adaptive instability ·
fake breadcrumbs · landmark inflation · navigation destroys work · minimalism tax · verb fog ·
sibling ambiguity · scope deception · card hit-area ambiguity · mirroring backend modules or org
charts as navigation · icon-only primary navigation.

## Evidence boundary

W3C/WAI-APG (current location, disclosure navigation, breadcrumbs, landmarks, tabs) and WCAG 3.2.3
are normative/practice guidance; GOV.UK and Carbon provide deployed patterns; NN/g (information
foraging) and Baymard (large-scale ecommerce behaviour — transfer cautiously) supply behavioural
evidence; GitHub/Jira document saved views. No universal number of nav items, sidebar pattern or
apply-timing rule is established.
