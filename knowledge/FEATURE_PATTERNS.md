# Distinctive Feature Patterns

A catalog of product functionality and interaction models that can create meaningful differentiation. This is not a collection of decorative effects.

## Admission test
A pattern belongs here when it meaningfully improves capability, speed, comprehension, discovery, comparison, user control, collaboration, personalization, recovery, or useful delight.

## Candidate research areas
Contextual command palettes; interactive previews; comparison workspaces; smart filters; saved views; progressive exploration; direct manipulation; adaptive onboarding; contextual AI actions; reversible bulk operations; activity timelines; explainable recommendations; multimodal input; collaborative presence; spatial information navigation.

Each promoted feature should include use cases, risks, and implementation guidance.


## Contextual command surfaces

**Problem solved:** complex products accumulate actions and destinations that cannot all remain visible. A searchable command surface can provide a secondary, keyboard-efficient route while keeping the primary interface simpler.

**Evidence boundary:** this is a shipped-product pattern, not evidence of universal task improvement. VS Code exposes broad editor functionality through its Command Palette; Linear combines command-menu actions, dedicated shortcuts, pointer UI, and previews; Notion uses Cmd/Ctrl+K or P for search and quick navigation. These examples establish viability in command-dense products.

### When it earns its place
Use one when command density is high, actions repeat frequently, available actions depend on current context, or users benefit from discovering dedicated shortcuts. Do not use it to hide core navigation, repair weak information architecture, or merely imitate expert tools. Essential actions still need an appropriate visible path.

### Separate intents
A palette can execute actions, navigate to objects, search content, or switch scope. If one surface combines these jobs, make the active intent and result type legible. VS Code demonstrates explicit modes for commands, files, and symbols.

### Context is the differentiator
Prefer contextual results over one giant global catalog. Filter or rank from the current view, focused or selected objects, permissions, object state, and availability. Linear repeatedly exposes the same capability through pointer UI, shortcuts, and its command menu; treat the palette as an accelerator and discovery layer over one coherent command model.

### Keyboard and accessibility contract
A searchable palette is closer to an autocomplete/combobox plus action invocation than to a generic visual modal.
- Keep text-entry behavior native and do not intercept standard editing keys.
- Provide predictable arrow navigation, Enter activation, and Escape dismissal.
- Preserve a visible active-result state and orientation when results update.
- Make shortcuts discoverable in menus, tooltips, or help.
- Use aria-keyshortcuts only to expose shortcuts that actually exist; it does not implement keyboard behavior.

Avoid collisions with browser, operating-system, and assistive-technology shortcuts. Keyboard layout and locale matter: Slack and Notion both document differences or limitations for non-English layouts, so do not assume US QWERTY.

### Preview and ranking
Preview is useful when it reduces open/back churn for information-rich results. Linear Peek can update while navigating supported command-menu items. Skip preview when it only repeats the label.

A reasonable ranking starting point is text match, contextual relevance, then recent/frequent relevant actions, but this is synthesis rather than a universal formula. Stable labels, aliases, categories, and visible shortcuts should keep results learnable even when ranking adapts.

### Implementation model
Represent commands as shared data rather than scattered keyboard handlers: stable id, localized label and aliases, category, availability/context rules, shortcut metadata, action callback, and optional preview. Toolbar actions, context menus, shortcuts, help, and the palette can then share the same command registry and avoid behavioral drift.

### Failure modes
- palette is the only way to discover essential functionality;
- one huge flat list with weak contextual ranking;
- navigation, search, and actions are visually indistinguishable;
- result state becomes stale after selection/context changes;
- global key listeners interfere with text editing or assistive technology;
- shortcuts assume one keyboard layout;
- keyboard-only functionality has no equivalent path;
- adding a palette instead of fixing poor navigation.

### Agent decision rule
Add a command surface because **command density + repetition + context** make a secondary searchable layer valuable, not because sophisticated products happen to have one.


## Interactive previews / peek

**Problem solved:** repeated open/back navigation is expensive when users need to inspect many adjacent objects before deciding which one deserves full attention. A preview can expose enough information to evaluate an item while preserving the surrounding list, board, search, or file context.

**Evidence boundary:** this is a shipped interaction model, not proof of universal task improvement. Linear Peek previews issue/project details from lists and boards, can remain open while arrowing through adjacent items, and also previews supported command-menu results. Apple's Quick Look similarly previews files without opening their owning app and supports moving through multiple selected files. These examples establish a durable inspect-without-navigate pattern; they do not establish that previews outperform normal navigation in every task.

### When it earns its place
Prefer preview when users repeatedly **scan → inspect → compare → continue scanning**, objects contain decision-relevant detail that cannot fit in the parent view, and full navigation would destroy useful position/filter/selection context.

Skip it when the preview merely enlarges information already visible, the object is normally opened once rather than compared, or the task requires most of the full detail surface anyway.

### Three preview contracts
Do not collapse these into one interaction:
1. **Transient glance:** fast, read-mostly, easily dismissed, no commitment.
2. **Persistent inspector:** stays open while selection/focus moves through adjacent objects; useful for triage and comparison.
3. **Full detail:** canonical surface for deep reading, editing, history, destructive actions, or complex workflows.

A preview should have an obvious path to full detail. If it accumulates enough editing and navigation to become a second full-detail implementation, the abstraction is probably wrong.

### Preserve browsing context
The strongest value is not “show more in a popup”; it is **inspect without losing place**. Keep parent filters, ordering, scroll position, and selection stable. When the user advances to another item, update the preview rather than forcing close/open cycles. Linear's arrow-through-adjacent-items behavior and Quick Look's multi-file navigation are concrete examples.

### Trigger semantics matter
Keyboard- or click-invoked previews are more predictable than hover-only previews. Hover/focus content introduces accidental-trigger and accessibility costs. If author-controlled additional content appears on hover or focus, WCAG 2.2 SC 1.4.13 requires it to be dismissible, hoverable when pointer-triggered, and persistent under the criterion's conditions. A keyboard-accessible deliberate trigger is therefore a safer baseline for information-rich previews.

Do not label an interactive preview as a tooltip. WAI-ARIA's tooltip pattern keeps focus on the trigger and explicitly notes that a popup containing focusable elements should use another pattern such as a non-modal dialog.

### Information design
Show the smallest set of fields that answers the likely “is this the item I need?” question. Prioritize identity, status, salient metadata, short content/context, and preview-specific media. Avoid copying the entire detail page.

Preview freshness is product-specific. Linear previews current issue/project state; for comment/evidence workflows, a stable snapshot can be preferable. Linear's Figma integration deliberately keeps the embedded snapshot unchanged until refresh so comments retain historical context. Decide whether the preview contract is **live state** or **snapshot evidence** rather than refreshing implicitly.

### Latency and resource budget
A preview that is slower than opening the object defeats its purpose. Keep the shell responsive, cancel superseded requests while rapidly moving between items, cache cheap adjacent data where justified, and avoid expensive eager media. Apple's Quick Look documentation explicitly recommends avoiding long-running/resource-intensive preview preparation and exposes asynchronous loading.

### Failure modes
- hover-only access or accidental previews that obscure the list;
- preview duplicates the full page and creates two competing interaction models;
- parent scroll/filter/selection state is lost on close;
- arrowing rapidly shows stale data from an earlier request;
- preview contains essential actions unavailable elsewhere;
- focus enters a surface that is still modeled as a tooltip;
- heavy preview generation makes scanning slower than normal navigation;
- stale snapshots are presented as live state, or live updates destroy evidence/context that users expected to remain stable.

### Agent decision rule
Add preview when **inspection frequency × navigation cost × value of preserved context** is high. Design it as an explicit intermediate depth level, not as decorative hover chrome.
