# Navigation Architecture

Navigation is an orientation and state-management system, not a collection of headers, sidebars, tabs, and breadcrumbs. Choose a navigation model from the user's information space, task transitions, URL/history requirements, and need to preserve context.

## Core contract

Every navigational surface should make five things answerable:

1. **Where am I?** Expose current location visually and programmatically (`aria-current="page"` where appropriate).
2. **What is around me?** Show enough sibling/parent structure to form a useful mental model without exposing the whole information architecture at once.
3. **Where can I go?** Use stable labels and destinations; permissions may remove unavailable destinations, but should not make remaining navigation semantically unstable.
4. **What happens if I go there?** Distinguish navigation from actions. A link changes location; a button changes state or reveals controls.
5. **Can I return without losing work/context?** URL, history, scroll, selection, filters, draft state, and focus behavior are part of navigation design.

## Choose by scope, not geometry

### Global navigation
Use for durable top-level product areas that remain meaningful across most of the product. Keep the set small enough to teach a stable product model. Do not promote every feature into global navigation.

### Local / section navigation
Use for destinations within one product area. A sidebar is only one rendering. On constrained screens it may become a disclosure, separate index, or other compact mechanism while preserving labels, order, hierarchy, and destinations where practical.

### Contextual navigation
Use for destinations whose relevance depends on the current object or task. Do not let contextual links silently masquerade as stable global structure.

### Breadcrumbs
Use to expose hierarchical ancestry and provide parent navigation when hierarchy matters. Breadcrumbs supplement rather than replace primary/local navigation. They are weak for histories that are not hierarchical; do not fabricate hierarchy from the user's click trail. WAI models breadcrumbs as an ordered set of parent links inside a labelled navigation landmark, with the current page identified when represented as a link.

## Tabs are not generic navigation chrome

Use tabs when users switch among a small set of peer views within one local context and the relationship between those views matters. A tablist is an interactive widget with a specific keyboard/focus contract; ordinary links styled like tabs do not automatically need ARIA tab semantics.

Prefer routes/links when destinations are independently meaningful pages that users should be able to deep-link, open separately, revisit through browser history, or understand as part of site/application hierarchy. If a visual tab changes the URL, that is not a problem by itself; the key question is whether its semantics and keyboard model are truly a tabbed interface or ordinary navigation.

Do not use tabs to hide a long sequence, create arbitrary categories, or avoid designing a real hierarchy. If users need to compare content across tabs, hiding one view at a time may actively harm the task.

## Navigation disclosure versus application menu

Do not assign `menu`/`menubar` roles to ordinary website navigation merely because it visually resembles a menu. W3C APG explicitly recommends disclosure-style navigation for typical expandable site navigation because ARIA menus imply a richer managed-focus and keyboard contract.

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

## Responsive navigation

Responsive design may change presentation but should avoid changing the product's conceptual map. WAI guidance recommends keeping visible navigation items consistent in order, wording, and destination across screen sizes even when some are collapsed or moved into subnavigation.

Avoid treating mobile as “put everything in a hamburger.” Decide what must remain directly discoverable, what can be disclosed, and whether a bottom navigation model is justified by a small set of frequent peer destinations.

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

## Focus after navigation

A route change and an in-place content replacement are not the same event. Decide where keyboard/screen-reader users need to continue:
- traditional page navigation normally relies on document/page semantics;
- SPA navigation may need explicit focus management so the new view is perceivable;
- navigation trees used for rapid content browsing can reasonably retain focus in the tree while updating `aria-current`, but users still need an efficient route into the loaded content.

Do not move focus merely to announce that navigation happened. Focus should support the next task.

## Failure modes

- **Sidebar as information architecture:** hierarchy is inferred from available screen width instead of product structure.
- **Everything is a tab:** independent destinations lose URL/history semantics and comparison becomes difficult.
- **Everything is a menu:** ordinary links inherit unnecessary ARIA widget complexity and broken keyboard behavior.
- **Hover maze:** nested fly-outs require pointer precision and lack alternate access.
- **Color-only current state:** users cannot reliably orient, especially in forced/high-contrast modes.
- **Responsive conceptual drift:** mobile labels/order/destinations differ from desktop without a product reason.
- **Back-button sabotage:** incidental state changes flood history, or meaningful view changes never enter history.
- **Permission as CSS:** hidden links are mistaken for authorization.
- **Adaptive instability:** personalization or AI constantly moves primary destinations.
- **Fake breadcrumbs:** click history is presented as hierarchy.
- **Navigation destroys work:** route transitions discard drafts, filters, or selection without an explicit preservation/recovery policy.

## Agent decision contract

Before implementing navigation, answer:

1. What are the stable top-level concepts in the user's mental model?
2. Is this transition global, local, contextual, hierarchical, or merely an action?
3. Does the destination deserve its own URL/history/deep link?
4. Which state must survive forward/back, refresh, and return navigation?
5. What exactly represents current location, and is it programmatically exposed?
6. Are expandable groups disclosures, or is there a genuine application-menu interaction model?
7. If using tabs, are the views truly peers within one context and is the tab keyboard contract implemented?
8. How does the model transform on narrow screens without changing its meaning?
9. How do permissions/personalization affect visibility without destabilizing canonical structure?
10. After navigation, where should focus and user context logically continue?

If these answers are unclear, changing navigation components or styling is premature.

## Evidence boundary

W3C WAI/APG provides strong normative/practice guidance for semantics, current location, disclosure navigation, breadcrumbs, and keyboard behavior. GOV.UK provides deployed evidence that separating site-wide and service-level navigation can clarify scope. These sources do **not** prove a universal ideal number of navigation items, sidebar width, breakpoint, or that one navigation geometry outperforms another. Information architecture and state-preservation decisions remain product/task dependent.

## Sources

- W3C WAI APG — Disclosure Navigation Menu: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
- W3C WAI — Menu Structure: https://www.w3.org/WAI/tutorials/menus/structure/
- W3C WAI APG — Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
- W3C WAI — Fly-out Menus: https://www.w3.org/WAI/tutorials/menus/flyout/
- W3C WAI APG — Navigation Treeview Example: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-navigation/
- GOV.UK Design System — Navigate a service: https://design-system.service.gov.uk/patterns/navigate-a-service/

**Reviewed:** 2026-10-02
