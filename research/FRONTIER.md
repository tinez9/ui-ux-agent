# Research Frontier

Promising ideas that are not yet mature enough for stable guidance.

## Rules
Keep uncertainty explicit. Record missing evidence. Promote into `knowledge/` only when confidence improves. Remove ideas that prove weak, redundant, or irrelevant.

## Initial frontier

### Generative interfaces beyond chat
**Status:** OPEN
Research when AI-generated or adaptive interface elements outperform fixed UI and what control/recovery patterns are required.

### Agent activity visualization
**Status:** OPEN
Research how users should understand plans, progress, tool calls, pending approvals, failures, and background work without overwhelming them.

### Design systems optimized for coding agents
**Status:** OPEN
Research which forms of design context most reliably improve agent-generated frontend while preserving room for art direction.

### Native dialog close-request policy
**Status:** EMERGING — interoperability split

`HTMLDialogElement.requestClose()` is now a useful stable primitive (MDN: Baseline 2025, broadly available since May 2025): unlike `close()`, it routes programmatic dismissal through the cancelable `cancel` event before `close`, matching the dialog close-watcher path used by platform close requests. This suggests a durable ownership rule: when product logic must be allowed to veto a dismissal (for example unsaved work), route dismiss *requests* through one cancelable policy rather than giving Escape, Back, buttons, and application code independent close paths. Reserve `close()` for cases where closure has already been decided and must not be vetoed.

The newer `closedby`/`closedBy` surface separates three dismissal contracts: `any` (including light dismiss), `closerequest` (platform close request plus developer mechanisms), and `none` (developer mechanism only). Modal dialogs without a valid value default to `closerequest`; non-modal dialogs default to `none`. This is promising because dismissal policy becomes declarative instead of being reconstructed from backdrop click handlers and Escape listeners.

Do **not** promote `closedby` to default stable guidance yet: as of 2026-10-06 MDN still marks `HTMLDialogElement.closedBy` as limited availability/non-Baseline. Progressive enhancement and the supported-browser matrix therefore remain part of the decision.

Nested confirmation is a separate UX question, not solved by the API. A second modal may be semantically justified when a close request reveals a genuinely consequential unresolved decision, but routinely stacking dialogs for multi-step flows increases context/focus complexity. Research real nested-dialog behavior, topmost close-watcher semantics, focus restoration, Back/Escape behavior, and browser/AT interoperability before recommending nested modals as a general pattern.

**Evidence:** WHATWG HTML dialog algorithms; MDN `<dialog>`, `HTMLDialogElement.requestClose()`, `cancel`, `close()`, and `closedBy` documentation. Platform docs establish mechanics and support, not that nested confirmation improves task outcomes.

### Behavioral accessibility skill uplift
**Status:** UNVALIDATED (2026-10-08)

`smukh/a11y-agent-skills` 0.2.0 provides Playwright/axe fixtures for OTP paste, grid focus, async status, stale autocomplete, and chart/table parity. Its own evaluation guide states that no model-uplift benchmark has been published and the scorer cannot represent several of those behaviors. Fixture tests prove the oracle distinguishes broken/repaired cases, not that an agent with the skill outperforms an agent without it. Next: blinded paired repair trials against plain Playwright + axe, hiding repaired source/oracles, retaining negative controls, functional regressions and manual AT review. Sources: https://github.com/smukh/a11y-agent-skills/blob/main/docs/SPECIALIST-EVALUATION.md ; https://playwright.dev/docs/accessibility-testing .
