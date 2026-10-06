# Navigation Architecture

Navigation is an orientation and state-management system, not a collection of headers, sidebars, tabs, and breadcrumbs. Choose a navigation model from the user's information space, task transitions, URL/history requirements, switching frequency, and need to preserve context.

## Core contract

Every navigational system should make five things answerable:

1. **Where am I?** Expose current location visually and programmatically (`aria-current="page"` where appropriate).
2. **What is around me?** Show enough sibling/parent structure to form a useful mental model without exposing the whole information architecture at once.
3. **Where can I go?** Use stable labels and destinations; permissions may remove unavailable destinations, but should not make remaining navigation semantically unstable.
4. **What happens if I go there?** Distinguish navigation from actions. A link changes location; a button changes state or reveals controls.
5. **Can I return without losing work/context?** URL, history, scroll, selection, filters, draft state, and focus behavior are part of navigation design.

## Model relationships before components

Before choosing sidebar, header, tabs, or breadcrumbs, classify each transition:

- **destination identity:** new resource/location or another presentation of the same resource?
- **hierarchy:** stable parent/ancestor relation, peer relation, or non-hierarchical network?
- **scope:** global, product, section, object, or transient task?
- **frequency:** persistent high-frequency switching or occasional traversal?
- **history:** should the state be linkable, restorable, and represented in browser history?
- **permissions:** can the destination be reached, and how should unavailable capability be explained?

Do not derive information architecture from the component library. A sidebar does not make unrelated destinations siblings; tabs do not make independent pages one object.

## Choose by scope, not geometry

### Global navigation
Use for durable top-level product areas that remain meaningful across most of the product. Keep the set small enough to teach a stable product model. Do not promote every feature into global navigation.

### Local / section navigation
Use for destinations within one product area. A sidebar is only one rendering. On constrained screens it may become a disclosure, separate index, or other compact mechanism while preserving labels, order, hierarchy, and destinations where practical.

A sidebar is especially defensible when users switch frequently among many secondary destinations. Carbon's production guidance suggests its left panel when there are more than five secondary items or frequent switching, and deliberately does not support a third navigation tier. Treat those as system-specific heuristics, not universal thresholds. The durable principle is to avoid making one persistent tree carry unlimited hierarchy and disclosure state.

### Contextual navigation
Use for destinations whose relevance depends on the current object or task. Do not let contextual links silently masquerade as stable global structure.

### Breadcrumbs
Use to expose hierarchical ancestry and provide parent navigation when hierarchy matters. Breadcrumbs supplement rather than replace primary/local navigation. They are weak for histories that are not hierarchical; do not fabricate hierarchy from the user's click trail. WAI models breadcrumbs as an ordered set of parent links inside a labelled navigation landmark. GOV.UK explicitly advises against breadcrumbs for flat structures or linear transaction progress and recommends questioning whether breadcrumbs add value when another navigational element such as a sidebar already supplies orientation.

## Hierarchy, location, and local mode are different

A product can legitimately expose all of these at once:

- global navigation: `Projects / Reports / Settings`
- section navigation: destinations inside `Projects`
- breadcrumb: `Projects / Atlas / Releases`
- local tabs: `Overview / Activity / Settings` for the selected release

This is not automatically duplication: each surface may encode a different relationship. It becomes harmful when persistent surfaces encode the **same** hierarchy differently, disagree about current location, or add no additional orientation/traversal value.

## Tabs are not generic navigation chrome

Use tabs when users switch among a small set of peer views within one local context and the relationship between those views matters. A tablist is an interactive widget with a specific keyboard/focus contract; ordinary links styled like tabs do not automatically need ARIA tab semantics.

Prefer routes/links when destinations are independently meaningful pages that users should be able to open separately, revisit through browser history, or understand as part of site/application hierarchy. If a visual tab changes the URL, that is not a problem by itself; the key question is whether its semantics and keyboard model are truly a tabbed interface or ordinary navigation.

Do not use tabs to hide a long sequence, create arbitrary categories, or avoid designing a real hierarchy. If users need to compare content across tabs, hiding one view at a time may actively harm the task.

### Activation latency changes the correct tab interaction

W3C APG recommends automatic tab activation on focus only when the associated panel can appear without noticeable latency; otherwise arrow-key exploration becomes expensive and manual activation is preferable. Therefore:

- instant/preloaded panels → automatic activation can be appropriate;
- network-bound or expensive panels → prefer manual activation, or reconsider whether the destinations are actually tabs;
- never make keyboard focus traversal trigger repeated expensive network side effects.

Latency is therefore not merely a performance concern; it changes the appropriate interaction contract.

## Navigation disclosure versus application menu

Do not assign `menu`/`menubar` roles to ordinary website navigation merely because it visually resembles a menu. W3C APG recommends disclosure-style navigation for typical expandable site navigation because ARIA menus imply a richer managed-focus and keyboard contract.

For expandable navigation:
- use a real button for expansion;
- expose `aria-expanded` state;
- keep destination links as links;
- preserve normal Tab navigation;
- support Escape where an open disclosure benefits from explicit dismissal;
- avoid hover-only access;
- provide another path to submenu destinations when precision-dependent fly-outs would exclude users.

A top-level destination that also owns children often benefits from separate link and disclosure controls rather than one ambiguous control that both navigates and expands.

## Current location and orientation

Current location needs more than color. Combine visible shape/text treatment with semantic current-state markup. Parent groups may also need a visible indication that they contain the current destination, especially in deep navigation.

Do not equate:
- **selected** — a user-selected object/state;
- **expanded** — children are visible;
- **focused** — keyboard interaction target;
- **current** — destination representing the active page/step/item.

These states can coexist and must not be styled or announced as interchangeable.

Derive active navigation surfaces from one canonical route/object state where practical. A URL pointing at settings while a local tab still announces Overview is an orientation bug even when both components work independently.

## URL, history, and state preservation

Navigation architecture should explicitly classify state:

| State | Default expectation |
|---|---|
| Shareable/query-defining state | Encode in URL when practical |
| Temporary UI disclosure | Usually local UI state |
| Unsaved user-authored work | Preserve or warn before destructive navigation |
| Scroll/selection in a revisited view | Restore when it helps task continuity and is not misleading |
| Security/permission context | Revalidate; never trust stale client navigation state |

Deep links should restore enough context for the destination to make sense. Do not require users to reproduce an invisible sequence of prior clicks to reach a valid state.

Back should normally reverse meaningful navigation, not every incidental UI toggle. Conversely, replacing routes with local state can break browser history, refresh, sharing, and recovery.

## Navigation landmarks and semantics

Prefer semantic HTML. `<nav>` creates a navigation landmark. When several navigation regions exist, give them concise, distinct labels such as `Primary`, `Project`, and `Breadcrumb`; W3C recommends labels to distinguish multiple regions of the same type.

Do not over-landmark the page. W3C notes that landmarks lose value as they proliferate; group meaningful regions instead of wrapping every link cluster in `<nav>`.

Provide a skip mechanism when persistent navigation precedes the main content. GOV.UK's skip-link pattern exists specifically so keyboard users can bypass top-level navigation.

## Responsive navigation

Responsive design may change presentation but should avoid changing the product's conceptual map. WAI guidance recommends keeping visible navigation items consistent in order, wording, and destination across screen sizes even when some are collapsed or moved into subnavigation.

Avoid treating mobile as “put everything in a hamburger.” Decide what must remain directly discoverable, what can be disclosed, and whether a bottom navigation model is justified by a small set of frequent peer destinations.

A desktop sidebar becoming a drawer should preserve the same conceptual hierarchy and current-location state. Do not automatically turn every tab row into a dropdown on narrow screens; horizontal scrolling, wrapping, a select-like control, or restructuring may each be right depending on item count, label length, comparison needs, and semantics.

## Permission- and role-aware navigation

Navigation should represent what the current user can meaningfully reach, but permission filtering can damage orientation when roles differ or documentation/support refers to hidden areas.

Rules:
- authorization belongs on the destination/server boundary, never only in navigation visibility;
- avoid showing actionable-looking destinations that always fail authorization unless explaining their existence has real value;
- avoid silently renaming or relocating the same concept across roles;
- after permission changes, reconcile current location and fallback destination explicitly;
- preserve stable canonical destination identifiers independently of labels and ordering.

## AI-generated or personalized navigation

AI may rank suggestions or surface contextual shortcuts, but should not freely mutate the stable information architecture. Separate a **stable navigation spine** from **adaptive recommendations/shortcuts**.

Do not let generated destinations:
- invent routes that do not exist;
- bypass authorization;
- rename canonical concepts unpredictably;
- reorder primary navigation so aggressively that spatial memory becomes unreliable;
- hide the deterministic path to a capability.

If personalization changes ordering, keep a stable recovery mechanism such as search, all-destinations view, or fixed primary areas.

Command palettes may expose both navigation and actions, but the underlying command model should distinguish `navigate` from state-changing commands so permission, confirmation, and risk policies do not diverge from the visible UI.

## Focus after navigation

A route change and an in-place content replacement are not the same event. Decide where keyboard/screen-reader users need to continue:
- traditional page navigation normally relies on document/page semantics;
- SPA navigation may need explicit focus management so the new view is perceivable;
- navigation trees used for rapid content browsing can reasonably retain focus in the tree while updating `aria-current`, but users still need an efficient route into the loaded content.

Do not move focus merely to announce that navigation happened. Focus should support the next task.

## Failure modes

- **Component-driven IA:** hierarchy is inferred from available components or screen width instead of product structure.
- **Everything is a tab:** independent destinations lose appropriate route semantics and comparison becomes difficult.
- **Slow auto-activating tabs:** keyboard traversal repeatedly triggers latency or network work.
- **Everything is a menu:** ordinary links inherit unnecessary ARIA widget complexity and broken keyboard behavior.
- **Unbounded tree navigation:** nested disclosure becomes the product's entire information architecture.
- **Duplicated hierarchy:** header, sidebar, and breadcrumbs encode conflicting versions of the same structure.
- **Hover maze:** nested fly-outs require pointer precision and lack alternate access.
- **Color-only current state:** users cannot reliably orient, especially in forced/high-contrast modes.
- **Responsive conceptual drift:** mobile labels/order/destinations differ from desktop without a product reason.
- **Back-button sabotage:** incidental state changes flood history, or meaningful view changes never enter history.
- **Permission as CSS:** hidden links are mistaken for authorization.
- **Adaptive instability:** personalization or AI constantly moves primary destinations.
- **Fake breadcrumbs:** click history or workflow progress is presented as hierarchy.
- **Landmark inflation:** excessive navigation regions reduce the usefulness of landmark navigation.
- **Navigation destroys work:** route transitions discard drafts, filters, or selection without an explicit preservation/recovery policy.

## Agent decision contract

Before implementing navigation, answer:

1. What are the stable top-level concepts in the user's mental model?
2. Is this transition global, local, contextual, hierarchical, a peer view, a workflow step, or merely an action?
3. Does the destination deserve its own URL/history/deep link?
4. Which state must survive forward/back, refresh, and return navigation?
5. What exactly represents current location, and is it programmatically exposed?
6. Are persistent surfaces representing different relationships, or duplicating the same hierarchy?
7. Are expandable groups disclosures, or is there a genuine application-menu interaction model?
8. If using tabs, are the views truly peers, is the keyboard contract implemented, and is activation latency compatible with the chosen model?
9. How does navigation transform on narrow screens without changing its conceptual meaning?
10. How do permissions/personalization affect visibility without destabilizing canonical structure?
11. Are multiple navigation landmarks meaningfully grouped and distinctly labelled?
12. After navigation, where should focus and user context logically continue?

If these answers are unclear, changing navigation components or styling is premature.

## Evidence boundary

W3C WAI/APG provides strong normative/practice guidance for semantics, current location, disclosure navigation, breadcrumbs, landmarks, and tab keyboard behavior. GOV.UK and Carbon provide independent deployed design-system guidance for breadcrumbs, skip links, global/secondary navigation, and shell composition. Carbon's item-count/tier guidance is a product-system heuristic, not a measured universal threshold. These sources do **not** prove a universal ideal number of navigation items, sidebar width, breakpoint, or shell geometry. Information architecture, switching frequency, domain scale, user familiarity, and state-preservation decisions remain contextual.

## Sources

- W3C WAI APG — Disclosure Navigation Menu: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
- W3C WAI — Menu Structure: https://www.w3.org/WAI/tutorials/menus/structure/
- W3C WAI APG — Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
- W3C WAI APG — Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- W3C WAI APG — Landmarks Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/
- W3C WAI — Labeling Regions: https://www.w3.org/WAI/tutorials/page-structure/labels/
- W3C WAI — Fly-out Menus: https://www.w3.org/WAI/tutorials/menus/flyout/
- W3C WAI APG — Navigation Treeview Example: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-navigation/
- GOV.UK Design System — Navigate a service: https://design-system.service.gov.uk/patterns/navigate-a-service/
- GOV.UK Design System — Breadcrumbs: https://design-system.service.gov.uk/components/breadcrumbs/
- GOV.UK Design System — Skip link: https://design-system.service.gov.uk/components/skip-link/
- Carbon Design System — UI shell left panel: https://www.carbondesignsystem.com/building-blocks/core/components/ui-shell-left-panel/guidelines
- Carbon Design System — Global header: https://www.carbondesignsystem.com/building-blocks/core/patterns/global-header

**Reviewed:** 2026-10-03
