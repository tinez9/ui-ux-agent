# Focus and composite-widget testing for AI agents

Last reviewed: 2026-10-06

## Research question

When DOM semantics and automated accessibility rules pass, which focus and keyboard failures can an AI coding agent verify safely with browser automation, and which require rendered or human/assistive-technology review?

## Core finding

**Semantic correctness, focus-state correctness, focus appearance, and interaction usability are separate evidence layers.** A component can expose valid roles and names while still moving focus incorrectly, hiding the visual focus indicator, confusing focus with selection, or implementing the wrong keyboard model for a composite widget.

Primary sources reviewed:
- https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
- https://www.w3.org/WAI/WCAG22/Understanding/focus-order
- https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance
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

## What each evidence layer can prove

### Browser interaction tests — strong for deterministic mechanics

Use browser automation for:
- expected entry/exit from the composite;
- pattern-specific key mappings;
- deterministic focus destination after open/close/delete/reorder;
- roving-tabindex invariants;
- `aria-activedescendant` references and state changes;
- focus restoration after transient UI closes;
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

1. **Identify the widget contract.** Prefer native HTML behavior; otherwise resolve the design-system/APG pattern and any intentional product deviation.
2. **Drive the real interaction.** Do not infer behavior from markup or roles.
3. **Assert mechanics and semantics separately.** Track DOM focus, active descendant, selected/expanded/checked state, and resulting content/action.
4. **Verify visible focus separately.** A mechanical pass is not a perceptual pass.
5. **Run axe on each materially different activated state.** Static initial-state analysis is incomplete for menus, dialogs, expanded regions and other hidden states.
6. **Auto-fix only deterministic contract violations.** Examples: wrong arrow mapping in a standard tablist, stale `aria-activedescendant`, two `tabindex=0` items in a roving composite, or focus not restored where the component contract explicitly requires it.
7. **Escalate judgment-sensitive cases.** Do not autonomously rewrite focus order, selection model, or custom interaction when multiple valid behaviors exist or user/AT consequences are uncertain.

## Failure cases worth encoding in regression tests

- **ARIA-valid, keyboard-broken:** roles/states are correct but arrow keys do nothing.
- **DOM-focus-only false negative:** `aria-activedescendant` changes correctly while `document.activeElement` intentionally remains on the container.
- **Attribute-only false positive:** `aria-activedescendant` changes but visible focus/scroll does not follow.
- **Tab-everything false positive:** all composite children are reachable with Tab but the expected arrow-key interaction is absent.
- **Selection/focus conflation:** navigating tabs triggers expensive activation when manual activation is the safer contract.
- **Focus restoration loss:** a transient surface closes and focus falls to body or an unrelated location.
- **Semantic pass, invisible focus:** automation sees focus but the indicator is absent, obscured, or indistinguishable on the resolved theme/background.
- **Snapshot pass, AT uncertainty:** accessibility-tree structure matches expected YAML while actual announcement or interaction remains unverified.

## Durable rule

**Test the focus protocol, not just focusability.** For composites, accessibility is a state machine: input, focus location, semantic state, visual focus and resulting action must remain coherent. Browser automation can verify deterministic transitions; accessibility-tree snapshots can verify structural postconditions; rendered checks verify perceivability; human/AT review remains the boundary for contextual meaning and real assistive experience.

## Evidence boundary

W3C APG establishes recommended keyboard/focus patterns rather than universal normative implementations for every product. WCAG establishes outcome requirements such as logical focus order and visible focus, which can admit multiple valid implementations. Playwright documents accessibility-tree snapshot capability, not accessibility conformance. Deque documents automation limits and the need to activate hidden states. The agent auto-fix boundary above is synthesis from these sources and still needs validation against production incidents and browser/AT interoperability failures.

## Next research direction

Investigate **focus recovery after destructive and asynchronous UI changes**—item deletion, optimistic updates, virtualized lists, dialogs/popovers, route transitions and streaming content—where the mechanically nearest focus target is not always the most meaningful one. Compare native platform behavior, established design systems and assistive-technology guidance before defining autonomous repair rules.
