# Preview / peek navigation for dense work surfaces

## Decision rule

Use a preview when users need to **inspect several candidate objects before deciding which one deserves full navigation**. A preview should reduce context switching while preserving the surrounding collection as the user's navigation frame.

Do not add preview merely to make an interface feel faster or more sophisticated. If users normally need the complete object, or the preview cannot answer a meaningful triage question, direct navigation is simpler.

## The core distinction

Preview is an intermediate state between recognition and commitment:

`collection -> inspect -> continue scanning OR commit to full object`

It is especially useful in dense products where opening an object changes route, scroll position, selection context, or working state. Linear's shipped Peek interaction makes this explicit: an issue/project can be inspected from a list or board, adjacent items can be traversed while the preview remains open, and the user can close the preview without committing to navigation.

Apple Quick Look provides independent platform evidence for the same capability at the file level: users can inspect common file types and perform basic preview interactions without requiring the host app to build a full editor/viewer for each format.

These implementations establish a durable interaction pattern, not universal evidence that preview improves task outcomes.

## When preview earns its complexity

Prefer preview when several are true:
- the source surface contains many comparable objects;
- users commonly inspect multiple objects before choosing one;
- summary rows/cards omit details needed for triage;
- opening and returning has meaningful navigation or state cost;
- preview content can answer a focused decision question quickly;
- adjacent-item traversal can preserve the same comparison frame;
- the full object remains meaningfully richer than the preview.

Examples include issue/project triage, files/assets, search results, inbox-like queues, catalog administration, media libraries, code symbols, and review queues.

Avoid or deprioritize preview when:
- almost every inspection leads immediately to opening the full object;
- the object is already small enough to expose the relevant details inline;
- preview duplicates nearly the entire destination screen;
- loading the preview is expensive enough to interrupt scanning;
- critical editing/action state becomes ambiguous between preview and destination;
- touch users would trigger it accidentally through hover-like behavior.

## Preview is not one pattern

### Transient peek
Appears while a key/button is held or while an item is intentionally focused. Best for very fast inspection. Linear supports hold-Space to show Peek only while the key remains depressed.

### Toggle preview
Opens a temporary preview and remains until dismissed. Useful when the user needs more time to read or interact.

### Persistent preview pane
Selection in a collection updates a stable adjacent detail region. Appropriate when inspection is the dominant workflow and screen width permits master-detail composition.

### Popover / definition preview
A small anchored surface answers one narrow question, such as definition or metadata, without representing the full object. GitHub's code navigation surfaces definitions/references around symbols; this is better understood as contextual inspection than a miniature destination page.

### System/content preview
Quick Look-style rendering lets users inspect files/media before choosing an application-level action.

Choose by task duration and content density rather than visual fashion.

## Preserve the navigation frame

The principal value of preview is lost if opening it destroys the user's position.

Maintain, where applicable:
- source list/board scroll position;
- current filters, sorting and query;
- focused/selected item;
- adjacent-item traversal;
- predictable dismissal back to the source;
- a clear path from preview to the canonical full object.

Linear's Peek supports Up/Down traversal through adjacent issues/projects while updating the preview. That interaction is important: the preview becomes an inspection lens over a collection rather than a sequence of miniature navigations.

## Content: optimize for the triage question

Do not blindly reproduce the destination page. Preview should expose the minimum information that changes the next decision.

A useful hierarchy is:
1. identity and state;
2. discriminating details missing from the source row/card;
3. evidence/context needed to decide whether to open;
4. a small number of safe, high-frequency actions if they genuinely belong in inspection;
5. an explicit route to full detail.

Linear's issue preview includes description and operational metadata such as assignee, status, priority, cycle, labels, estimate and dates. The exact fields are product-specific; the reusable principle is to expose information needed for triage without making users navigate.

## Interaction boundaries

### Preview versus editing

Inspection and editing have different commitments. Avoid turning every preview into a miniature editor. If edits are allowed:
- make editability obvious;
- preserve the same authorization and validation as the full object;
- ensure changes are reflected immediately in the source collection;
- prevent dismissal from implying that unsaved work was safely persisted.

### Preview versus modal

A preview should not unnecessarily behave like a blocking modal if the workflow depends on moving among source items. A modal may be correct for focused inspection, but a side pane or non-destructive overlay is often better for comparative scanning.

### Preview versus hover

Hover can supplement previews for pointer users but must not be the only access path to important information. Hover-triggered large surfaces are also easy to invoke accidentally and have no direct touch equivalent. Prefer deliberate selection, focus, key, or explicit control when the preview contains substantial content.

## Keyboard and focus

Keyboard support should preserve the collection as the orientation model:
- provide a deliberate preview command when keyboard-heavy workflows matter;
- allow dismissal without losing the originating item;
- if adjacent traversal is supported, keep it predictable and announce the newly previewed item's identity/state appropriately;
- do not make a transient peek steal focus merely to display read-only information;
- if the preview contains interactive controls and focus enters it, provide a reliable route back to the originating collection item;
- never depend on Space as a universal shortcut: it conflicts with native activation/scroll behavior in many contexts and must be scoped to a product where the focused surface owns that interaction safely.

Linear's Space shortcut is evidence for one expert-oriented implementation, not a universal keyboard convention.

## Responsive behavior

A desktop side preview should not simply collapse into a cramped mobile panel.

On narrow screens, choose among:
- a full-height sheet that preserves a clear Back/Close path;
- direct navigation when preview no longer saves meaningful context;
- a compact quick-view surface for genuinely small triage content.

If the source and preview cannot be meaningfully visible together, test whether the extra intermediate state still reduces work. Sometimes mobile should intentionally skip preview.

## Performance

Preview must feel cheaper than full navigation or it loses its purpose.

- Fetch/render only the content required for triage.
- Cache adjacent likely items when justified, but do not aggressively prefetch sensitive or expensive content.
- Avoid heavy synchronous work before presentation. Apple's Quick Look documentation explicitly advises against long-running/resource-intensive work on the main thread when preparing previews.
- Reserve geometry where possible to prevent the source surface from shifting.
- Treat media autoplay as an explicit product decision; preview is not permission to start costly or disruptive playback.

## Common failure modes

### Mini destination
The preview reproduces almost the whole object and becomes a second UI to maintain.

**Fix:** define the triage question and include only information/actions that change that decision.

### Context loss despite preview
Opening the preview changes route/scroll/selection so returning is as costly as full navigation.

**Fix:** preserve the source frame and focus/selection state.

### Preview inception
Rows inside previews open more previews, creating nested transient layers.

**Fix:** cap depth. Navigate deliberately when the user crosses into another object's full context.

### Accidental hover storms
Moving the pointer across a dense list repeatedly opens expensive or distracting surfaces.

**Fix:** use deliberate activation or restrained hover intent; never rely on hover for essential access.

### Stale dual representation
The source row says one thing while the preview shows newer state.

**Fix:** share canonical data/state and reconcile updates across both representations.

### Action ambiguity
Users cannot tell whether an action affects the previewed item, selected source item, or broader collection.

**Fix:** make target scope explicit and derive actions from the same object identity/permission model.

### Mobile cargo cult
A desktop split-pane preview becomes an extra full-screen step that saves no context.

**Fix:** reevaluate the pattern by breakpoint; direct navigation may be superior.

## Evaluation

Measure the workflow the preview is supposed to improve, not preview-open counts:
- number of full navigations/returns needed to identify the desired object;
- time and interactions to inspect N candidates;
- wrong-object opens;
- preview-to-full-open ratio, interpreted with task intent rather than maximized;
- return-position/focus failures;
- adjacent-item inspection efficiency;
- preview load latency and abandoned previews;
- keyboard, touch and assistive-technology completion;
- whether users can distinguish preview state from full/edit state.

A high preview-open rate can mean value or simply that the source rows lack enough information. Test that competing explanation before declaring success.

## Evidence boundaries

- **Linear Docs — Peek:** strong first-party evidence for a shipped expert-workflow implementation: temporary/toggled preview, keyboard activation, adjacent traversal, issue/project-specific triage content, and integration with command-menu navigation. It does not provide comparative outcome data.
- **Apple Quick Look / Quick Look UI:** mature platform evidence that content preview is a reusable capability across common file types, with compact/full preview styles and explicit performance constraints. It does not prescribe web master-detail UX.
- **GitHub code navigation:** first-party evidence for contextual definition/reference inspection around code symbols, supporting the broader principle that users sometimes need local understanding before navigation. It is domain-specific.

No source reviewed in this cycle establishes a universal productivity gain, ideal preview width, hover delay, or breakpoint. Those values must come from content/task constraints and product testing.

## Sources

- Linear Docs — Peek preview: https://linear.app/docs/peek (reviewed 2026-10-03)
- Apple Developer — Quick Look UI: https://developer.apple.com/documentation/quicklookui/ (reviewed 2026-10-03)
- Apple Developer — `QLPreviewView`: https://developer.apple.com/documentation/quicklookui/qlpreviewview (reviewed 2026-10-03)
- Apple Developer — `preparePreviewOfFile(at:completionHandler:)`: https://developer.apple.com/documentation/QuickLookUI/QLPreviewingController/preparePreviewOfFile%28at%3AcompletionHandler%3A%29 (reviewed 2026-10-03)
- GitHub Docs — Navigating code on GitHub: https://docs.github.com/en/repositories/working-with-files/using-files/navigating-code-on-github (reviewed 2026-10-03)
