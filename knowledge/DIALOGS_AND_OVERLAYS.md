# Dialogs and overlays

Use an overlay because its **interaction contract** fits the task, not because a drawer, sheet, or modal looks convenient.

## Start with interruption and context

Choose the least disruptive surface that preserves the task:

- **Inline / in-page** — default when the content belongs naturally in the current flow and can coexist without obscuring useful context.
- **Popover / lightweight non-modal surface** — contextual actions, pickers, teaching UI, or auxiliary information where users should still be able to interact with the page.
- **Non-modal dialog / inspector** — persistent auxiliary work that benefits from its own labelled region while the primary page remains usable.
- **Modal dialog** — a bounded task or decision that genuinely requires users to finish, cancel, or dismiss it before interacting with the underlying page.
- **Navigation / dedicated detail view** — prefer when the work is long, deep-linkable, collaboration-relevant, information-dense, or likely to become a destination in its own right.

Do not infer modality from geometry. A side panel can be modal or non-modal; a centered box can be either. "Drawer" describes presentation more reliably than interaction semantics.

## Modal is a behavioral promise

A modal means the background is unavailable, not merely dimmed. When modal:

- move focus inside on open;
- keep keyboard focus within the modal while it is active;
- make outside content inert for all users, not just visually obscured;
- provide a visible way to close/cancel where the task permits it;
- support `Escape` as the conventional close request unless there is a strong task-specific reason not to;
- return focus to the invoker on close, except when the invoker disappeared or task completion makes another destination logically correct.

Never set `aria-modal="true"` on a surface that still permits interaction with the page behind it. WAI-ARIA explicitly warns that this mismatch can make outside content inaccessible to assistive-technology users.

## Initial focus is semantic, not "first control" by rule

Choose initial focus from what users need to perceive or do:

- straightforward transactional form: usually the first meaningful input;
- long/structured explanatory content: a static heading or introductory element with `tabindex="-1"` can preserve the beginning and semantic reading order;
- hard-to-reverse destructive decision: consider the least destructive action;
- simple acknowledgement: the primary dismissal/continue action may be efficient.

Do not focus the dialog container merely as a generic workaround when a more meaningful target exists. Test focus visibility and scroll position on small viewports.

## Alert dialog is exceptional interruption

Use an alert dialog for a brief important message that **requires an immediate response**. Do not use it for ordinary notifications. A non-blocking alert/status should not steal keyboard focus; frequent interruptions impose usability and accessibility costs.

A destructive action does not automatically require an alert dialog. If the operation is safely reversible, immediate execution plus visible undo can be a better control model. Escalate interruption with consequence, irreversibility, ambiguity, and blast radius.

## Drawers and side panels need a reason

A side surface is useful when preserving visible relationship to the underlying workspace materially helps: inspecting an object, making short contextual edits, or moving through nearby items without losing the collection context.

Prefer a page/detail route when the surface accumulates deep workflows, extensive navigation, shareable state, large forms, or nested overlays. Avoid treating drawers as a universal alternative to navigation.

Do not stack local modals visually "inside" a panel. If a blocking decision is necessary while a panel is open, modality applies to the whole active page context. Atlassian's current panel guidance explicitly warns against placing a modal over only the panel; its legacy Drawer component is also being deprecated in favor of Modal in its new navigation system. Treat that deprecation as product-system evidence, not a universal ban on side panels.

## Avoid overlay stacks

Nested modal workflows increase focus, escape, return, z-order, and context-recovery complexity. Before opening an overlay from another overlay, ask whether the second step can:

1. replace content within the current surface;
2. expand inline;
3. complete after closing the first surface;
4. become a dedicated page.

If nesting is unavoidable, closing the topmost modal must reveal a coherent previous state and restore focus logically. `Escape` should affect only the active/topmost modal.

## Responsive behavior

Do not change semantics merely because geometry changes. A desktop modal may become full-screen on a narrow viewport while remaining modal. A non-modal inspector may need to become a route or explicit sheet if there is no longer enough space to preserve meaningful background interaction.

Full-screen mobile presentation can improve reading and prevent background movement, but the title, close path, focus contract, unsaved-state behavior, and browser/history expectations still need deliberate design.

## Prefer native platform primitives where they fit

As of October 2026, native HTML provides mature primitives that remove substantial custom overlay plumbing:

- `<dialog>.showModal()` places a modal in the top layer and makes the rest of the document inert;
- `<dialog>.show()` is non-modal;
- the Popover API is non-modal and supports light-dismiss/contextual surfaces;
- declarative `command` / `commandfor` can open, close, or request-close dialogs in supporting browsers;
- `closedby` can express which close mechanisms a dialog accepts.

Prefer `<dialog>` for genuine dialogs when its semantics and browser behavior fit. Prefer Popover for non-modal overlay behavior. Native primitives do **not** decide whether the product should interrupt the user, what initial focus means, whether data is safe to discard, or how navigation/history should work.

## Unsaved changes and dismissal

Do not make every dismiss action trigger a confirmation. Track whether meaningful user state actually changed. If dismissal would lose material work, preserve a draft, provide recovery, or confirm proportionally to loss. If nothing changed, close normally.

Distinguish:
- **Cancel** — abandon the current operation according to its defined semantics;
- **Close** — dismiss the surface, which may or may not imply abandonment;
- **Save/Apply** — commit a change;
- **Back** — navigate within a process/history model, not a synonym for closing a modal.

## Agent decision contract

Before adding an overlay, answer:

1. Why must this content leave normal document flow?
2. Must background interaction be blocked? Why?
3. Is this a short bounded task or actually a destination?
4. What receives initial focus, and why?
5. What happens on `Escape`, outside click/tap, browser Back, and explicit close?
6. What state is committed, discarded, or recoverable on each exit path?
7. Where does focus go after completion and cancellation?
8. Does narrow-screen presentation preserve the same interaction semantics?
9. Can the workflow avoid opening another overlay from this one?
10. Can native `<dialog>` or Popover supply the platform behavior instead of custom focus/inert/top-layer code?

## Failure modes

- using a modal to display information that could remain inline;
- using a drawer because it feels modern, without a context-preservation need;
- visually dimming the page while leaving it interactive;
- declaring `aria-modal` without real modality;
- defaulting focus to the first DOM control regardless of content/risk;
- losing the user's point of regard after close;
- trapping a long multi-step workflow in an overlay that should be navigable/deep-linkable;
- confirming every close even when no meaningful changes exist;
- nested overlays with ambiguous `Escape` and focus restoration;
- converting a non-modal desktop inspector into a modal mobile sheet without reconsidering the task contract;
- custom overlay code that reimplements top-layer, inertness, focus, and dismissal behavior already available natively.

## Evidence boundary

WAI-ARIA APG defines the modal dialog and alert-dialog interaction/accessibility contracts, including inert background, contained tab sequence, focus placement, `Escape`, and return focus. APG examples are illustrative and explicitly require browser/assistive-technology testing before production use. MDN documents current native `<dialog>`, `showModal()`, Popover, `inert`, declarative commands, and close behavior. Atlassian provides production-system evidence about panel/modal composition and its own Drawer deprecation. These sources support interaction mechanics and implementation choices; they do not prove that a modal, drawer, page, or inspector produces better task outcomes in every domain.