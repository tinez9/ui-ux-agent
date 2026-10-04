# Command palettes and accelerator layers

Command palettes are useful when they compress navigation and action execution for repeat users. They are weak when used as a fashionable replacement for visible information architecture.

## Core model

Treat a command palette as an **accelerator layer over an already coherent product model**. It can unify navigation, search, and actions, but it should not become the only place where important capabilities are discoverable.

A robust palette has three separable jobs:

1. **Navigate** to an object or destination.
2. **Find** an object or content by query.
3. **Act** on the current context or a selected object.

Mixing these jobs is acceptable only when result type, scope, and consequence remain legible. GitHub's current command palette explicitly supports all three and exposes current scope; Notion's search surface combines destination search with recent/frequent destinations; Linear uses command-menu actions alongside direct keyboard navigation and contextual menus.

## Scope is part of the command

A command name is insufficient when its target can vary. Before executing an action, the interface must make the effective scope predictable: current object, current project/repository/workspace, current selection, or global account.

GitHub's palette visibly scopes suggestions and commands to the current repository, organization, account, or underlying page and lets users change that scope. This is a useful general rule: **contextual ranking is helpful; invisible contextual semantics are dangerous**.

For consequential commands, show the target in the result or confirmation rather than relying on users to remember where they invoked the palette.

## Discovery versus speed

A palette primarily improves **retrieval and execution cost after users know or can name what they want**. It does not automatically solve feature discovery.

Therefore:

- keep primary and frequent novice actions available in the normal interface;
- expose keyboard shortcuts near corresponding visible actions where practical;
- let menus, contextual controls, and the palette invoke the same underlying command rather than implementing separate behavior;
- rank recent/contextual items to reduce repeated search effort;
- do not hide an important feature only because it is searchable by name;
- treat telemetry such as repeated palette use as evidence for a useful fast path, not proof that the normal IA is unnecessary.

Linear demonstrates the complementary model well: selected issues can be acted on through shortcuts, the command menu, or a contextual menu. Its Peek feature is deliberately keyboard-only, but that is an expert accelerator for preview rather than the sole path to the underlying issue information.

## Command architecture

Represent commands as structured capabilities, not strings wired directly to UI handlers. Useful fields include:

```text
id
label
aliases / search terms
category
scope requirements
availability predicate
target description
risk / reversibility
default shortcut
execute()
```

This enables the same command to appear in menus, buttons, contextual actions, shortcuts, and a palette while preserving availability and consequence semantics.

### Search ranking

Ranking should normally combine:

- textual match and aliases;
- current context/scope;
- recency or frequency when appropriate;
- command availability;
- object type or category.

Do not let frequency silently override semantic correctness. A frequently used command for another scope is worse than a slightly lower-ranked valid command for the current object.

### Disabled versus absent

If a command is conceptually relevant but unavailable because of current state, permission, or selection, showing it disabled with a concise reason can teach the model and recovery path. Omit commands that are irrelevant to the context or would create noise. Do not expose unauthorized object names or actions merely to explain why they cannot be used.

## Keyboard and accessibility

A keyboard-first surface still needs complete focus and screen-reader behavior.

- Opening the palette should move focus intentionally into the search/command input or composite widget.
- Arrow-key movement must have a programmatically determinable active result.
- `Enter` should execute or navigate only the clearly active result.
- `Esc` should close without side effects and restore focus to a sensible origin when possible.
- Result type, state, shortcut, and disabled reason must not rely on visual styling alone.
- Do not hijack common browser/editor shortcuts without a conflict strategy. GitHub currently offers customizable palette shortcuts and separate alternatives when Markdown editing would conflict.
- International keyboard layouts and IME/text-entry contexts make single-key shortcuts especially risky; shortcuts are accelerators, not semantic foundations.

## Risk-shaped execution

A palette should not make dangerous actions easier to trigger accidentally just because it optimizes speed.

Use the same risk model as the rest of the product:

- low-risk reversible actions may execute immediately with feedback;
- actions whose target is ambiguous should expose scope before execution;
- consequential or irreversible actions should route through the same review/confirmation/technical safeguards as their visible UI equivalent;
- do not create a "fast path" that bypasses permission, validation, or recovery semantics.

The command layer should call the same domain operation as other surfaces, so safety behavior cannot drift.

## When a palette is high value

Prefer one when the product has several of these properties:

- many destinations or objects that users can name;
- repeated expert workflows;
- a meaningful keyboard-using audience;
- actions that are stable but scattered across contexts;
- deep navigation where direct retrieval saves multiple transitions;
- contextual commands whose availability can be reliably computed.

GitHub, Notion, and Linear provide current shipped evidence for this pattern in dense knowledge/work-management/developer products. This is adoption evidence, not proof that palettes improve outcomes in every product.

## When not to lead with it

A palette has low value when:

- the product has very few destinations/actions;
- users cannot reasonably know the vocabulary they need to search;
- tasks are primarily visual/spatial and hard to express as named commands;
- mobile/touch is the dominant context and the palette has no equally efficient discoverable entry point;
- the underlying IA is inconsistent, so the palette merely masks conceptual debt;
- command consequences depend on hidden context that cannot be made legible.

Do not add `Cmd/Ctrl+K` merely to make a simple product feel sophisticated.

## Failure modes

- **Palette as hidden IA:** important capabilities exist only if users know what to type.
- **Scope roulette:** the same label affects different objects depending on invisible context.
- **Duplicate command logic:** menu, shortcut, and palette implementations drift apart.
- **Search/action ambiguity:** a result looks like navigation but executes a mutation.
- **Shortcut collision:** browser, OS, editor, assistive-technology, or text-entry behavior is overridden.
- **Stale availability:** a command remains executable after selection/state changed.
- **Unsafe acceleration:** destructive actions bypass safeguards used elsewhere.
- **Popularity ranking trap:** frequent commands crowd out the semantically correct contextual result.
- **Mobile afterthought:** a keyboard-centric architecture is treated as the product's only efficient command path.

## Agent decision rule

Before adding a command palette, answer:

1. Which existing user costs does it reduce: navigation depth, object retrieval, or repeated action execution?
2. Can users name the destinations/actions they seek?
3. What is the command's effective scope and how will the UI make it visible?
4. Is there still a discoverable non-palette path for important functionality?
5. Can every surface invoke one shared command/domain operation?
6. What keyboard, focus, localization, and shortcut conflicts exist?
7. Which commands need stronger safeguards despite the accelerator layer?

If these answers are weak, improve the underlying IA and command model before adding a palette.

## Evidence and boundaries

- GitHub Command Palette: current first-party implementation of scoped navigation, search, commands, contextual suggestions, customizable shortcuts, and explicit editor-conflict handling. As of review on 2026-10-04, GitHub documents it as a public preview and disabled by default. https://docs.github.com/en/get-started/accessibility/github-command-palette
- Notion Search / Command Search: current first-party evidence for `Cmd/Ctrl+P/K`, recent destinations, workspace search, and desktop system-level invocation. https://www.notion.com/help/search
- Linear Search, Select issues, Favorites, and Peek: current first-party evidence that keyboard accelerators, command-menu actions, direct navigation, contextual menus, favorites, and preview can coexist rather than replace one another. https://linear.app/docs/search ; https://linear.app/docs/select-issues ; https://linear.app/docs/favorites ; https://linear.app/docs/peek

These sources establish shipped interaction models and implementation choices. They do **not** provide controlled evidence that command palettes universally reduce task time, improve discoverability, or outperform menus. Treat those outcome claims as hypotheses to validate for the product and audience.

## Research needs

Comparative task-time/error evidence for palette versus menu/navigation use; novice-to-expert transition; mobile equivalents; ranking failures in very large command sets; accessibility testing with screen readers and non-QWERTY/IME input; and evidence about whether palettes conceal or expose weak information architecture.
