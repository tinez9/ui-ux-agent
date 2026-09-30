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
