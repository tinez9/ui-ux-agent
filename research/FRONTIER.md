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

### Superdesign: external canvas versus local design verification
**Status:** CONDITIONAL / NOT VALIDATED (2026-10-08)

The maintained `superdesigndev/superdesign-skill` routes Claude/Codex and other agents through a logged-in external CLI and branchable design canvas. Its codebase init captures full component/layout source locally, then `--context-file` sends selected UI source and tokens to the design workflow. The upstream instructions explicitly warn that oversized context can return HTTP 400; dropping too much source on retry can yield an invented generic reproduction. Saved context bundles and hashes support resuming designs, but do not prove visual or functional fidelity.

**Decision boundary:** useful candidate for authorized visual exploration, not a default for sensitive/offline repos or accessibility certification. Inspect the exact outbound source bundle, pin/audit CLI separately from the MIT skill, and verify the real app after implementation. An independent July 2026 test stopped at authentication and measured no design quality; do not interpret that as an output-quality failure. Last observed repo push: 2026-08-21. Compare baseline screenshot-driven work against an authenticated Superdesign run, scoring reproduction fidelity, missing states, blind design preference, regressions, data exposure and cost.

Sources: https://github.com/superdesigndev/superdesign-skill/blob/main/skills/superdesign/SKILL.md ; https://github.com/superdesigndev/superdesign-skill/blob/main/skills/superdesign/references/INIT.md ; https://github.com/superdesigndev/superdesign-skill/blob/main/skills/superdesign/references/SUPERDESIGN.md ; https://skillproof.dev/skills/superdesign .

### agent-browser dogfood versus Playwright CLI (2026-10-08)
**Status:** CONDITIONAL / NOT VALIDATED.

**2026-10-09 security comparison:** Playwright MCP says origin/file restrictions are convenience checks, not security boundaries (including redirects). Chrome DevTools MCP says URL filters apply only while attached, and its allowlist requires Chrome 149+; JavaScript evaluation, file navigation and unredacted network headers are defaults unless restricted. agent-browser documents stronger opt-in domain/action controls but also unsupported attach/provider modes and best-effort network interception. None replaces host egress isolation. For untrusted visual QA use a disposable browser/test account, restrict consequential actions, and decide explicitly whether page-provided WebMCP tools should be available; bypassing visible controls can invalidate interaction testing. These are documented mechanisms, not measured containment. Sources: https://playwright.dev/mcp/configuration/options ; https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/SECURITY.md ; https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/configuration.md ; https://agent-browser.dev/security .

`vercel-labs/agent-browser` is an active, Apache-2.0 Vercel Labs Chrome/CDP CLI (GitHub `pushed_at` 2026-10-08, ~43.6k stars). Its installable discovery skill delegates to version-matched CLI-served `core` and `dogfood` instructions. Dogfood prescribes named sessions, accessibility snapshots, annotated screenshots, real interaction, retry-to-reproduce, and step-by-step screenshots/videos. This is useful **reproduction evidence**, not proof of better defect detection or design judgment. Do not optimize for its suggested 5–10 issue count; clean apps may have none.

**Decision boundary:** Playwright CLI already provides CLI browser interaction, snapshots, screenshots and sessions. Test agent-browser only when its repro workflow or debugging surface has incremental value; do not install both by default. Its `benchmarks/` compare its own Node and Rust daemons, while `evals/` chiefly measure skill selection, command patterns and context footprint—not visual quality or detection accuracy. Chrome-only evidence does not establish cross-browser behavior. Refresh snapshot refs after DOM changes and inspect screenshots, rather than treating snapshots as visual tests.

**Security caveat:** WebMCP is experimental and enabled by default in managed Chrome; page-provided tools/text are untrusted. The core documentation says `alert` and `beforeunload` are auto-accepted unless configured otherwise, so default exploratory runs can miss unsaved-change guards. Use isolated test accounts, explicit permissions, named sessions, scoped domains and host egress limits; redact auth state, HAR, screenshots and videos. Pin the npm package/browser version; matching CLI-served instructions reduce version drift but do not eliminate supply-chain risk.

**Next falsification:** blinded seeded-defect/clean-control trials of Playwright CLI without skill, Playwright CLI with skill, and agent-browser dogfood. Score verified defects, false positives, reproduction quality, focus/async/mobile coverage, tokens, time and regressions.

Primary sources: https://github.com/vercel-labs/agent-browser ; https://github.com/vercel-labs/agent-browser/blob/main/skill-data/dogfood/SKILL.md ; https://github.com/vercel-labs/agent-browser/blob/main/skill-data/core/references/trust-boundaries.md ; https://github.com/vercel-labs/agent-browser/blob/main/evals/README.md ; https://github.com/vercel-labs/agent-browser/blob/main/benchmarks/README.md ; https://github.com/microsoft/playwright-cli .

### Penpot MCP design-editing workflow (2026-10-11)
**Status:** CONDITIONAL; version-sensitive. The official Penpot MCP integration is maintained in the main `penpot/penpot` repository, not its archived standalone MCP repository. Unlike screenshot-only handoff, it reads and edits live design components, pages and tokens via a browser-tab plugin. This is valuable for teams already using Penpot, but requires exact page targeting, limited edits, inspection and rollback; tab suspension and remote/local asset differences complicate automation. Official advisories GHSA-22qr-rp27-j9wm and GHSA-ch2q-6x56-qg5r document historical MCP listener exposure; the latter lists 2.18.0 as patched. Do not install old releases or assume the default listener configuration provides isolation. No independent causal evidence yet shows better generated frontend. Test against screenshots/direct source with matched tasks, tracking token fidelity, unintended design changes, rendered parity, accessibility and time.

Sources: https://help.penpot.dev/mcp/ ; https://github.com/penpot/penpot/blob/develop/mcp/README.md ; https://github.com/penpot/penpot/security/advisories/GHSA-ch2q-6x56-qg5r .

### Virtualized data-grid accessibility (2026-10-11)
**Status:** implementation trade-off, comparative outcomes untested. W3C APG distinguishes native tables (including sortable/action cells) from composite grids requiring managed keyboard focus. When virtualization removes rows or columns from the DOM, 1-based ARIA indices/counts must remain consistent; incorrect indices can break assistive-technology navigation. AG Grid recommends DOM-order preservation or pagination with virtualization disabled when needed. USWDS reports a keyboard/screen-reader exception for horizontally scrollable tables. Test native table vs interactive grid with pagination/virtualization using screen readers, zoom, focus continuity and actual task outcomes. Sources: https://www.w3.org/WAI/ARIA/apg/patterns/grid/ ; https://www.w3.org/WAI/ARIA/apg/practices/grid-and-table-properties/ ; https://www.ag-grid.com/react-data-grid/accessibility/ ; https://designsystem.digital.gov/components/table/accessibility-tests/ .
