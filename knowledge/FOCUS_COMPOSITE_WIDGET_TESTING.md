# Focus and composite-widget testing for AI agents

Last reviewed: 2026-10-06

## Research question

When DOM semantics and automated accessibility rules pass, which focus and keyboard failures can an AI coding agent verify safely with browser automation, and which require rendered or human/assistive-technology review?

## Core finding

**Semantic correctness, focus-state correctness, focus appearance, and interaction usability are separate evidence layers.** A component can expose valid roles and names while still moving focus incorrectly, hiding the visual focus indicator, confusing focus with selection, or implementing the wrong keyboard model for a composite widget.

Primary sources reviewed:
- https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- https://www.w3.org/WAI/ARIA/apg/patterns/button/
- https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
- https://www.w3.org/WAI/WCAG22/Understanding/focus-order
- https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance
- https://atlassian.design/components/tag-group/
- https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines/
- https://www.carbondesignsystem.com/building-blocks/core/patterns/dialogs
- https://playwright.dev/docs/aria-snapshots
- https://www.deque.com/de/blog/support-for-wcag-2-1-in-axe-core/
- https://www.deque.com/axe/core-documentation/api-documentation/

## Why axe/DOM conformance is insufficient

Deque explicitly lists focus order and keyboard support on custom controls among areas that require manual testing rather than axe-core alone. Its API also requires inactive content such as menus and modals to be activated/rendered before analysis. Therefore an agent must not infer keyboard correctness from a clean static axe result.

WAI-ARIA APG independently explains why: browsers do not supply the keyboard behavior for custom ARIA widgets. Authors implement it. A correct `role="tablist"` or `role="menu"` can coexist with broken arrow-key behavior.

## Composite widgets change the testing model

For ordinary native controls, `Tab` often provides useful end-to-end reachability coverage. For composite widgets—tabs, menus, listboxes, grids, trees, toolbars, radio groups—APG normally expects **one tab stop into the composite**, followed by pattern-specific keys such as arrows/Home/End.

Consequences:

- a test that only repeatedly presses `Tab` can falsely label a correct composite as inaccessible because internal items are intentionally absent from the page tab sequence;
- conversely, a widget where every internal item is a tab stop may appear keyboard reachable while violating the intended efficient composite interaction model;
- keyboard tests must be generated from the component's interaction contract/pattern, not from a universal `Tab through everything` heuristic.

## Roving tabindex versus aria-activedescendant

These two valid focus-management strategies require different assertions.

### Roving tabindex

DOM focus moves between descendants. Browser automation can assert:
- exactly the intended descendant participates in the tab sequence (`tabindex=0` while peers are `-1`);
- arrow keys move `document.activeElement` to the expected item;
- the newly focused item is scrolled into view where relevant;
- re-entry behavior matches the component contract (selected, last-focused, or first item depending on pattern).

### aria-activedescendant

DOM focus remains on the composite container while logical/visual focus moves. Therefore `document.activeElement` alone is insufficient. Assert together:
- container retains DOM focus;
- `aria-activedescendant` changes to the expected owned/related item;
- the referenced item exists and satisfies the required relationship;
- visual focus treatment moves to that item;
- the active item is scrolled into view when needed.

This is a high-value failure mode for autonomous agents: a test can report “focus did not move” even when `aria-activedescendant` is correctly used, or report success because the attribute changed while the user sees no focus movement.

## Focus is not selection

APG treats focused and selected as distinct states. This matters especially in tabs and listboxes. Automatic selection-on-focus can be appropriate when activation is effectively instantaneous; APG warns it can become seriously harmful when changing focus triggers latency/network work. Agents should therefore test the declared selection model rather than normalize every widget to “arrow key changes selection.”

A robust test records at least:

`input key → DOM focus → active descendant (if any) → selected/expanded/checked state → visible content/action`

This catches semantic state transitions that a screenshot or accessibility-tree snapshot alone can miss.

## Focus recovery after destructive and asynchronous changes

A destructive or asynchronous action can remove, remount, move, disable, virtualize, or otherwise invalidate the element that held focus. APG explicitly warns that when the active element is hidden or removed, unmanaged focus can fall to `body`, effectively losing the user's position. This is not merely a DOM-cleanup problem: the correct destination depends on the workflow that remains.

### Destination hierarchy: preserve workflow before geometry

Do not use a universal “nearest DOM sibling” rule. Resolve the destination in this order:

1. **Preserve the same logical entity/action when it still exists.** If an item is reordered or remounted but remains the user's working object, restore focus to its equivalent control. Atlassian's drag-and-drop guidance explicitly favors returning to the original trigger where possible so repeated actions remain efficient.
2. **Use an established component contract.** For deletion inside a list-like sequence, APG gives the following list item as a concrete logical destination; Atlassian's removable tags similarly move to the next focusable item, then fall back beyond/behind the removed trigger when needed.
3. **Follow the resulting workflow when the old context no longer exists.** APG's dialog guidance says returning to the invoker is normal, but not when it was removed or when the completed task logically leads elsewhere. For example, an add-rows dialog can focus the first newly created row instead of its launcher.
4. **Escalate when several destinations are semantically plausible.** Geometry, DOM proximity, and tab order are evidence, not sufficient intent.

This yields a stronger invariant than “restore focus”: **after a user-triggered state transition, focus should remain persistent, visible, and located at a meaningful continuation point.**

### Deletion is a state transition, not a `.focus()` patch

For a destructive action, capture before mutation:

`focused logical entity + action + collection position + fallback candidates`

Then assert after the committed state:

`old target absent/invalid → chosen logical successor exists → DOM focus/active descendant is coherent → focus visible → user can continue without replaying navigation`

Useful deterministic cases for autonomous repair include:
- a removable tag/list item where the documented contract says next item, then previous/next external control at the boundary;
- a deleted tab where the tab pattern defines which remaining tab receives focus, with a separate workflow target when the last tab disappears;
- a closed dialog whose invoker still exists and whose workflow does not intentionally advance elsewhere;
- a moved/remounted entity with a stable identity and an equivalent focusable control after the move.

Do **not** infer that the next DOM node is correct when deletion changes the task context, removes an entire view, or completes a workflow.

### Optimistic and asynchronous updates need a commit policy

Optimistic UI creates an extra failure mode: focus can be moved after the optimistic mutation and then become wrong again if the operation rolls back or the server response changes ordering. Treat focus recovery as part of the mutation state machine, not an incidental effect:

`pre-action anchor → optimistic state → committed state OR rollback state`

The product contract should define whether focus follows the optimistic result immediately or waits for commitment. Whichever policy is chosen, browser tests should exercise success and rollback. An agent should not add repeated `setTimeout(...focus)` calls to chase render timing; that masks missing ownership of the transition and is race-prone.

### Virtualized collections require logical identity

When the intended successor is not mounted, DOM adjacency is not a reliable model of collection adjacency. Recovery should be based on stable item identity/index and the collection's own navigation/virtualization API: materialize/scroll the intended item, then apply the widget's focus mechanism. For `aria-activedescendant`, never leave the attribute pointing at an item that was deleted or is no longer validly represented.

APG's grid/treegrid guidance also notes that dynamically materialized rows can make DOM-first/last differ from the backing data's first/last. Agents should therefore avoid deriving semantic endpoints solely from currently rendered nodes.

### Focus and announcement solve different problems

Moving focus communicates location but can also disrupt reading. A status/live-region announcement communicates the result without necessarily moving the user's point of regard. Do not move focus merely to announce that an async operation succeeded. Use focus movement when the old focus target became invalid or the workflow intentionally advances; use status semantics for non-focus-changing feedback where appropriate.

### Browser-test oracle

For destructive/dynamic transitions, a useful regression test records:

`pre-action active entity → action → mutation phase → resulting entity set → expected logical anchor → document.activeElement / aria-activedescendant → visible focus → next keyboard action`

At minimum assert that focus does not silently collapse to `body` when the user should remain in an interactive workflow. Also test boundary cases: first item, middle item, last item, only item, success, rollback, and remount/reorder when those states exist.

## What each evidence layer can prove

### Browser interaction tests — strong for deterministic mechanics

Use browser automation for:
- expected entry/exit from the composite;
- pattern-specific key mappings;
- deterministic focus destination after open/close/delete/reorder;
- roving-tabindex invariants;
- `aria-activedescendant` references and state changes;
- focus restoration after transient UI closes;
- success/rollback focus behavior for asynchronous mutations when the contract defines it;
- whether hidden/inactive states are actually exercised before axe analysis.

These are good candidates for agent auto-fix **when the intended component pattern is unambiguous and encoded in a design-system contract or established APG/native pattern**.

### Accessibility-tree snapshots — structural regression evidence, not interaction proof

Playwright ARIA snapshots expose accessible hierarchy, roles, names and states such as selected/expanded/disabled. They are useful after each interaction step to verify the resulting accessibility state. They do not themselves prove that the correct keyboard event reached that state, that visual focus is perceivable, or that the interaction is usable with a real screen reader.

Treat them as **postcondition assertions**, not a substitute for keyboard-driving tests.

### Rendered checks — necessary for visible focus

WCAG focus requirements are perceptual. A DOM node being focused is not proof that users can see it. Capture/inspect focused states against their actual backgrounds and overlays; include obscuration and high-contrast/forced-colors paths when relevant. W3C's own focus-visible technique describes tabbing to elements and checking that the indicator is visible.

Visual regression can detect a changed focus ring but cannot decide by itself whether the new indicator is sufficiently perceivable or whether the logical destination is correct.

### Human/AT review — required for meaning and real assistive behavior

Escalate when the question depends on:
- whether focus order preserves meaning/operability rather than merely matching a numeric sequence;
- whether a custom interaction is discoverable or predictable;
- whether focus-versus-selection behavior is understandable in context;
- screen-reader announcement timing/quality and browser–AT interoperability;
- ambiguous custom widgets with no established interaction contract;
- whether an unusual focus destination is contextually helpful after destructive/dynamic changes.

WCAG explicitly allows more than one focus order when meaning and operability are preserved. An agent therefore cannot safely “repair” every order that differs from visual geometry.

## Agent decision rule

Use this sequence before auto-fixing a keyboard/focus issue:

1. **Identify the widget and transition contract.** Prefer native HTML behavior; otherwise resolve the design-system/APG pattern, mutation lifecycle, and any intentional product deviation.
2. **Drive the real interaction.** Do not infer behavior from markup or roles.
3. **Assert mechanics and semantics separately.** Track logical entity, DOM focus, active descendant, selected/expanded/checked state, and resulting content/action.
4. **For destructive/async work, test the committed path and rollback where applicable.** Focus recovery belongs to the transition lifecycle.
5. **Verify visible focus separately.** A mechanical pass is not a perceptual pass.
6. **Run axe on each materially different activated state.** Static initial-state analysis is incomplete for menus, dialogs, expanded regions and other hidden states.
7. **Auto-fix only deterministic contract violations.** Examples: wrong arrow mapping in a standard tablist, stale `aria-activedescendant`, two `tabindex=0` items in a roving composite, focus falling to `body` where a documented successor exists, or failure to return to a surviving dialog invoker.
8. **Escalate judgment-sensitive cases.** Do not autonomously invent a focus destination, rewrite focus order/selection model, or choose among several plausible post-mutation workflows without product intent.

## Failure cases worth encoding in regression tests

- **ARIA-valid, keyboard-broken:** roles/states are correct but arrow keys do nothing.
- **DOM-focus-only false negative:** `aria-activedescendant` changes correctly while `document.activeElement` intentionally remains on the container.
- **Attribute-only false positive:** `aria-activedescendant` changes but visible focus/scroll does not follow.
- **Tab-everything false positive:** all composite children are reachable with Tab but the expected arrow-key interaction is absent.
- **Selection/focus conflation:** navigating tabs triggers expensive activation when manual activation is the safer contract.
- **Removed-target collapse:** deletion removes the active control and focus falls to `body` instead of a logical continuation point.
- **Nearest-sibling semantic error:** automation preserves mechanical proximity but moves users into the wrong workflow.
- **Optimistic-race loss:** focus is restored for the optimistic state but lost or misplaced after commit/rollback.
- **Virtualization stale anchor:** focus state or `aria-activedescendant` refers to an item no longer represented after recycling/deletion.
- **Semantic pass, invisible focus:** automation sees focus but the indicator is absent, obscured, or indistinguishable on the resolved theme/background.
- **Snapshot pass, AT uncertainty:** accessibility-tree structure matches expected YAML while actual announcement or interaction remains unverified.

## Durable rule

**Test the focus protocol, not just focusability.** For composites and dynamic UI, accessibility is a state machine: input, logical entity, mutation phase, focus location, semantic state, visual focus and resulting action must remain coherent. Preserve workflow before geometry. Browser automation can verify deterministic transitions; accessibility-tree snapshots can verify structural postconditions; rendered checks verify perceivability; human/AT review remains the boundary for contextual meaning and real assistive experience.

## Evidence boundary

W3C APG establishes recommended keyboard/focus patterns rather than universal normative implementations for every product. Its keyboard-interface guidance explicitly identifies deletion/removal as a focus-persistence hazard and its dialog/button patterns allow workflow-dependent destinations rather than unconditional restoration. Atlassian supplies concrete production design-system conventions for removable tags and moved/remounted entities; Carbon independently supports dialog focus restoration. These sources establish useful patterns but do not prove one universal successor rule for every destructive or asynchronous workflow. The optimistic-update and virtualization lifecycle model above is agent synthesis and needs validation against production incidents and browser/AT combinations.

## Next research direction

Investigate **route transitions, streaming/server-rendered updates, popovers and native dialog focus behavior**: determine where browser/framework primitives already provide safe restoration, where application code must own focus, and which common SPA/RSC patterns accidentally steal or lose focus during navigation and hydration.
