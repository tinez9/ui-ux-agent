# Overlays: dialogs, drawers, sheets, popovers, menus, tooltips

Choose an overlay because its **interaction contract** fits the task, not because floating looks
convenient. `overlay contract = modality + semantics + dismissal + invoker/focus relationship +
stacking/nesting + positioning`.

## Quick rules

1. Choose the **least disruptive surface** that preserves the task: inline → popover/non-modal →
   non-modal dialog/inspector → modal dialog → dedicated page/route.
2. Modality is a behavioural promise (background inert for everyone), not a dimmed backdrop. Never
   `aria-modal="true"` on a surface that allows outside interaction.
3. Geometry doesn't define semantics: a side panel or centered box can be modal or not; "drawer" is
   presentation.
4. Long, deep-linkable, information-dense or collaborative work deserves a page, not an overlay.
5. Avoid overlay stacks; if unavoidable, Escape closes only the topmost and focus returns coherently.
6. Initial focus is semantic; return focus to the invoker unless it's gone or the workflow advances.
7. Confirm on dismiss only when meaningful work would be lost.
8. Native `<dialog>` (modal via `showModal()`) and the Popover API (non-modal) before custom
   top-layer/inert/focus plumbing — but they don't decide product behaviour.

## Choosing the surface

| Surface | Use when |
|---|---|
| Inline / in-page | content belongs to the flow and can coexist without obscuring context |
| Popover (non-modal) | contextual actions, pickers, teaching UI, auxiliary info; page stays usable |
| Non-modal dialog / inspector | persistent auxiliary work in its own labelled region while the page stays usable |
| Modal dialog | bounded task/decision that must be finished, cancelled or dismissed first |
| Alert dialog | brief, important message requiring an immediate response — exceptional |
| Drawer / side panel | preserving the visible relationship to the workspace materially helps (inspect, short edits, move through nearby items) |
| Page / route | long, deep, shareable, navigable, large forms, nested steps |

Destructive ≠ automatically alert dialog: reversible operations can execute with undo (see
`risk-and-recovery.md`).

## Audit checklist

- Why does this content leave the flow? Could it be inline?
- Modal: focus moves in on open, stays in, background inert (not just dimmed), visible close/cancel,
  Escape works (unless a task-specific reason), focus returns to the invoker.
- Initial focus: first meaningful input (forms) · heading with `tabindex="-1"` (long content) ·
  least destructive action (destructive decisions) · primary action (simple acknowledgement). Not
  the container by default.
- Accessible name from the visible title; dialog role correct; alert dialog only for urgent decisions.
- Exits defined: Escape, outside click/tap, browser Back, explicit close, Save/Cancel — what is
  committed, discarded or recoverable in each? Cancel vs Close vs Save/Apply vs Back distinguished.
- Unsaved changes: confirm/preserve only if something meaningful changed.
- Nested overlays: modal over only part of the page (e.g. over a panel) — avoid; second step could
  replace content, expand inline, follow after closing, or become a page.
- Mobile: same semantics when geometry changes (modal → full-screen sheet stays modal; title, close
  path, focus, unsaved state, Back behaviour designed); a non-modal inspector may need to become a
  route on narrow screens.
- Popovers: non-modal — no focus trap; content uses its own semantics (menu, listbox, dialog-like,
  explanation); light dismiss behaviour intended (`auto` vs `manual` vs `hint`).
- Tooltips: plain-text supplementary labels; no interactive content (that's a non-modal dialog or
  popover); dismissible, hoverable, persistent (WCAG 1.4.13); not the only source of essential info;
  touch has no hover.
- Positioning: corners, small viewports, zoom, long strings, virtual keyboard don't push surfaces
  off-screen or over their anchor's meaning.
- Scroll lock and background scroll on mobile behave; sticky headers don't cover the dialog content.

## Native platform notes (verify support for your matrix)

- `<dialog>.showModal()` → top layer + inert document; `.show()` → non-modal; `closedby` controls
  which close mechanisms apply; declarative `command`/`commandfor` invokers in supporting browsers.
- Popover API (Baseline 2025-01) → non-modal top layer; `popovertarget` creates an invoker
  relationship (focus order after the invoker, expanded state, focus return on Escape). Prefer the
  declarative invoker over unrelated click handlers + `showPopover()`. `<dialog popover>` = dialog
  semantics without modality.
- `autofocus` inside a newly shown dialog/popover only when immediate focus transfer is the intended workflow.
- CSS anchor positioning (`position-anchor`, `position-area`, `anchor()`, `position-try-fallbacks`,
  `position-try-order`) became Baseline across 2026; a fallback list isn't magic collision
  avoidance — test corners. Basic flip/reposition alone no longer justifies a positioning library;
  keep one for complex collision scoring, composite widgets, virtualization, legacy browsers.
- Top layer ≠ widget semantics; `popover` doesn't make a `div` a menu.
- One focus owner per transition: don't let native restoration and a framework effect both move focus.

## Failure modes

Modal for information that could be inline · drawer because it feels modern · dimmed but interactive
background · `aria-modal` without modality · first-control focus regardless of content/risk · lost
point of regard after close · multi-step workflow trapped in an overlay · confirm-on-every-close ·
nested overlays with ambiguous Escape · desktop inspector turned into a modal mobile sheet without
rethinking · popover + custom focus trap (accidental quasi-modality) · `menu` role for site
navigation · custom overlay code re-implementing native behaviour · interactive tooltips.

## Evidence boundary

WAI-ARIA APG (dialog, alert dialog, tooltip, menu), MDN/WHATWG (dialog, popover, `closedby`,
anchor positioning, `autofocus`), web.dev Baseline notes, Atlassian/Carbon/Primer guidance. APG
examples need AT testing before production. Platform availability is evidence custom
infrastructure can shrink — not that more overlays improve usability. Support status dated 2026-10.
