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

`vercel-labs/agent-browser` is an active, Apache-2.0 Vercel Labs Chrome/CDP CLI (GitHub `pushed_at` 2026-10-08, ~43.6k stars). Its installable discovery skill delegates to version-matched CLI-served `core` and `dogfood` instructions. Dogfood prescribes named sessions, accessibility snapshots, annotated screenshots, real interaction, retry-to-reproduce, and step-by-step screenshots/videos. This is useful **reproduction evidence**, not proof of better defect detection or design judgment. Do not optimize for its suggested 5–10 issue count; clean apps may have none.

**Decision boundary:** Playwright CLI already provides CLI browser interaction, snapshots, screenshots and sessions. Test agent-browser only when its repro workflow or debugging surface has incremental value; do not install both by default. Its `benchmarks/` compare its own Node and Rust daemons, while `evals/` chiefly measure skill selection, command patterns and context footprint—not visual quality or detection accuracy. Chrome-only evidence does not establish cross-browser behavior. Refresh snapshot refs after DOM changes and inspect screenshots, rather than treating snapshots as visual tests.

**Security caveat:** WebMCP is experimental and enabled by default in managed Chrome; page-provided tools/text are untrusted. The core documentation says `alert` and `beforeunload` are auto-accepted unless configured otherwise, so default exploratory runs can miss unsaved-change guards. Use isolated test accounts, explicit permissions, named sessions, scoped domains and host egress limits; redact auth state, HAR, screenshots and videos. Pin the npm package/browser version; matching CLI-served instructions reduce version drift but do not eliminate supply-chain risk.

**Next falsification:** blinded seeded-defect/clean-control trials of Playwright CLI without skill, Playwright CLI with skill, and agent-browser dogfood. Score verified defects, false positives, reproduction quality, focus/async/mobile coverage, tokens, time and regressions.

Primary sources: https://github.com/vercel-labs/agent-browser ; https://github.com/vercel-labs/agent-browser/blob/main/skill-data/dogfood/SKILL.md ; https://github.com/vercel-labs/agent-browser/blob/main/skill-data/core/references/trust-boundaries.md ; https://github.com/vercel-labs/agent-browser/blob/main/evals/README.md ; https://github.com/vercel-labs/agent-browser/blob/main/benchmarks/README.md ; https://github.com/microsoft/playwright-cli .
