# Command palettes as capability surfaces

## Decision rule

A command palette is valuable when it compresses a **large, repeated, context-sensitive action space** into a fast searchable surface. It is not a substitute for primary navigation, visible core actions, or good information architecture.

Use it as an **accelerator and capability-discovery layer**, not as the only place important functionality exists.

## What the pattern can unify

A mature palette can combine:
- navigation to objects and destinations;
- search across resources;
- execution of commands;
- context-specific actions on the current object;
- recent/frequent destinations;
- shortcut discovery;
- extension/plugin capabilities.

GitHub's palette demonstrates scoped navigation, search and commands, with suggestions shaped by current location and recently used resources. VS Code exposes its command set through the Command Palette and displays shortcuts alongside common commands. Raycast extends the same interaction model into an installable command ecosystem. These are useful product-adoption examples, not evidence that every application benefits from a palette.

## When it earns its complexity

Prefer a command palette when several of these are true:
- expert or repeat users perform many actions frequently;
- the product has many destinations or commands that cannot all remain visible;
- users often know roughly what they want but not where it lives;
- keyboard-heavy workflows matter;
- actions vary meaningfully with current context;
- extensibility creates a growing action surface;
- the same command model can power menus, shortcuts and automation as well as the palette.

Avoid or deprioritize it when:
- the product has only a handful of actions;
- most users are occasional and primarily touch/mobile users;
- the palette would hide essential first-use actions;
- command names are jargon users cannot predict;
- search quality, permissions or context cannot be made trustworthy;
- implementing it would create a second inconsistent command system.

## Architecture: one command model, several surfaces

Do not hard-code palette-only behavior. Model commands as product capabilities with metadata such as:

```text
id
label
aliases / keywords
category
scope / context predicate
availability predicate
permission predicate
shortcut (optional)
risk / confirmation policy
action
```

Then reuse the same command definitions in menus, shortcuts, contextual actions and the palette where appropriate. This reduces drift such as a disabled menu action remaining executable from the palette.

### Context is part of correctness

Contextual ranking can make a large command set tractable, but scope must be visible when ambiguity could cause the wrong action. GitHub explicitly exposes the current scope and lets users narrow or expand it.

For mutating commands, make the target legible before execution. `Archive project` is unsafe if the user cannot tell which project will be affected.

## Discoverability without hiding the product

A keyboard shortcut alone is weak discovery. Useful complementary entry points include:
- a visible search/command affordance for products where the feature is important;
- shortcuts shown beside equivalent visible actions;
- a keyboard-shortcut help surface;
- contextual hints after users repeatedly perform a slower equivalent action;
- recent/frequent commands after opening the palette.

GitHub's shortcut help and VS Code's shortcut display illustrate how a palette can teach faster paths without requiring memorization up front.

Do not move essential actions out of visible UI merely because they are searchable. The palette should reward growing expertise while leaving novice task completion intact.

## Search and ranking

Rank from product semantics, not only fuzzy string similarity. Useful signals can include:
1. exact/prefix label match;
2. aliases and domain vocabulary;
3. current context and valid scope;
4. recent/frequent use;
5. object relevance;
6. permission and availability.

Never let personalization make critical commands unpredictable. Stable naming and sensible default ordering matter more than clever ranking.

Handle zero matches as a recovery state: preserve the query, explain that no command matched, and offer a route to broader search/help when appropriate.

## Execution safety

Separate **finding** a command from **committing** its consequence.

- Navigation and reversible local UI changes can usually execute immediately.
- Consequential or destructive actions should retain the same confirmation, permission, undo, or review policy they have elsewhere.
- Never make a destructive action safer-looking merely because it is invoked from a keyboard-first surface.
- Disabled/unavailable commands should either be omitted when irrelevant or shown with a concise reason when discoverability is valuable.

The palette must not bypass authorization checks. Permission is enforced at execution, not inferred from whether a result was rendered.

## Accessibility and keyboard behavior

A command palette often resembles an editable combobox controlling a list of suggestions, sometimes inside a dialog. Use the actual semantic pattern that matches the implementation rather than adding ARIA by visual resemblance.

For a combobox/listbox implementation, WAI-ARIA APG establishes useful behavior:
- keep text editing behavior native;
- expose expanded/collapsed state and popup relationship;
- arrow keys navigate suggestions;
- `Enter` accepts/executes the active suggestion;
- `Escape` dismisses without accidentally committing a different choice;
- distinguish visual focus from selection where relevant;
- do not intercept platform text-editing keys unnecessarily.

If implemented as a modal dialog, follow dialog focus containment and return focus appropriately when it closes.

Additional requirements:
- visible focus must remain clear;
- results and state changes need understandable accessible names;
- shortcuts should avoid unnecessary browser/OS conflicts and be configurable when the product depends heavily on them;
- pointer users need equivalent access to important commands;
- do not assume `Cmd/Ctrl+K` is universally available: GitHub documents conflicts and offers shortcut customization.

## Mobile and touch

Do not mechanically transplant a desktop `Cmd+K` overlay to mobile. If the underlying capability is valuable on touch, expose it through an obvious search/action entry point, contextual action sheet, or another platform-appropriate surface. Preserve the command model; adapt the interaction surface.

## Extensions and growing capability spaces

Raycast shows a stronger version of the pattern: extensions add focused commands that become available through root search. This is especially useful when a product has a plugin ecosystem because the palette can become a stable retrieval surface while capabilities grow.

The failure mode is command pollution. Extensions need namespacing, permissions, predictable ranking and a way to inspect provenance when similarly named commands come from different providers.

## Common failure modes

### Palette as hidden navigation
Core destinations disappear from visible navigation and novice users must know the magic shortcut.

**Fix:** keep primary IA independently usable; use the palette as acceleration.

### Command dump
Hundreds of technically available actions appear with weak labels and no context.

**Fix:** contextual eligibility, categories, aliases, ranking and progressive search.

### Ambiguous target
`Delete`, `Move`, or `Archive` appears without a clear object/scope.

**Fix:** encode the target in the result or confirmation when consequence matters.

### Second command system
Menu, shortcut and palette behavior diverge.

**Fix:** derive surfaces from one command registry and shared permission/action logic.

### Fuzzy-search cleverness over predictability
A personalized ranking moves common commands unpredictably.

**Fix:** privilege stable semantics and exact matches; personalization is secondary.

### Accessibility afterthought
A visually polished overlay implements custom keyboard handling but breaks text editing, focus return or screen-reader navigation.

**Fix:** start from native input behavior and the appropriate APG combobox/dialog pattern.

### Mobile cargo cult
Desktop palette UI is squeezed onto touch screens despite little keyboard use.

**Fix:** preserve capabilities but choose a touch-native access surface.

## Evaluation

Do not measure success only by palette invocation count. Useful measures include:
- time/steps to complete repeated commands versus visible navigation;
- successful command retrieval rate;
- zero-result and query-reformulation rate;
- wrong-command / wrong-target execution;
- shortcut learning over time;
- distribution between novice and expert usage;
- discoverability of capabilities users did not already know;
- keyboard and assistive-technology task completion;
- whether visible navigation remains sufficient for first-use tasks.

A palette is successful when it makes a genuinely broad capability space faster and more discoverable **without making the rest of the product dependent on knowing it exists**.

## Evidence boundaries

- **GitHub Docs:** current first-party evidence that a production developer platform uses a context-scoped palette for navigation, search and commands, exposes scope, supports alternate search prefixes, and allows shortcut customization. GitHub currently labels the feature public preview; treat exact behavior as changeable.
- **VS Code Docs:** mature first-party evidence for a keyboard-accessible command surface that exposes broad functionality and teaches associated shortcuts.
- **Raycast Manual:** first-party product evidence for a palette/root-search architecture that scales through installable extension commands.
- **W3C WAI-ARIA APG:** authoritative interaction/semantic guidance for combobox/listbox and dialog primitives. It does not prescribe a product-level command-palette pattern.

These sources establish shipped patterns and accessibility mechanics. They do **not** establish a universal productivity gain, a universal `Cmd/Ctrl+K` convention, or superiority over visible navigation for novice/general-audience products.

## Sources

- GitHub Docs — GitHub Command Palette: https://docs.github.com/en/get-started/accessibility/github-command-palette (reviewed 2026-10-03)
- GitHub Docs — Keyboard shortcuts: https://docs.github.com/en/get-started/accessibility/keyboard-shortcuts (reviewed 2026-10-03)
- Visual Studio Code — User interface / Command Palette: https://code.visualstudio.com/docs/editing/getting-started/userinterface (reviewed 2026-10-03)
- Visual Studio Code — Accessibility: https://code.visualstudio.com/docs/configure/accessibility/accessibility (reviewed 2026-10-03)
- Raycast Manual — Extensions: https://manual.raycast.com/extensions (reviewed 2026-10-03)
- W3C WAI-ARIA APG — Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ (reviewed 2026-10-03)
