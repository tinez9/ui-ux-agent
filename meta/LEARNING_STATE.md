# Learning State

This file guides autonomous research selection. Use qualitative states; do not invent numeric coverage percentages.

## Knowledge map

| Area | State | Priority | Notes |
|---|---|---:|---|
| Foundations | WEAK | High | Seed principles; needs evidence and depth |
| Visual design | WEAK | High | First 2026 creative signals identified; needs durable operational rules |
| UX patterns | DEVELOPING | High | Forms, result sets, async states, navigation, notifications, drag/reorder and file-upload lifecycle contracts documented; many common patterns remain |
| Interaction & motion | DEVELOPING | Medium | Operational motion-purpose, reduced-motion, transition, and web implementation rules documented; direct manipulation and measured outcome evidence remain |
| AI-native UX | ADEQUATE | Medium | Risk-shaped autonomy, approvals, progress, recovery, provenance, and denial recovery documented; domain-specific validation remains |
| Design systems | DEVELOPING | Medium | Agent-readable contract established: semantic tokens, component contracts, composition rules, accessibility invariants, and explicit degrees of freedom; comparative validation still missing |
| Distinctive features | WEAK | High | Core differentiation objective |
| Frontend implementation | DEVELOPING | Medium | Operational container-responsive and scroll-driven CSS guidance documented; broader native UI primitives, performance, testing, and semantic patterns remain |
| Claude/AI-agent workflows | ADEQUATE | Medium | First evidence-backed workflow established; comparative testing still missing |
| Anti-patterns / AI slop | WEAK | High | Claude-specific tells identified; cross-model evidence and alternatives still needed |
| Trend observatory | ADEQUATE | Medium | Evidence ladder established; first adoption-vs-showcase distinctions documented |

## First research priorities
1. What currently causes AI-generated web/app interfaces to look generic across models, and what practical alternatives work?
2. Which AI-native interaction patterns best preserve control, feedback, provenance, approval, and recovery?
3. Which distinctive features provide product value beyond decoration?
4. Which current browser capabilities enable distinctive interaction with acceptable accessibility/performance cost?
5. Which design-system artifact mix most improves agent fidelity when isolated experimentally?

## Recent research
### 2026-10-23 — Saved-view filters versus exports and real access control
**Question:** When do filtered screens, shared-view links, exported data and field permissions disagree in ways that can mislead users or expose more than the visible subset?

**Finding:** Airtable's current docs explicitly confirm that temporary URL filters do not restrict the original shared-view dataset and that a viewer's CSV download ignores those added filters; grouped/cover fields and expanded-record settings also defeat assumptions about hidden fields. In contrast, Notion's genuine property-level access rules can make views referencing restricted fields unavailable to recipients, including agents inheriting limited permissions. GitHub Projects documents view-based TSV export; export scope must be checked per product, not generalized. Agents must distinguish authorization, base-view membership, temporary filters and export scope; disclose mismatches and test low-privilege exports and links.

**Evidence boundary:** First-party product behavior/docs (Airtable last updated August 2026, Notion, GitHub) plus an agent-facing implementation/test contract. No exploit or runtime test was performed; these are documented product-specific exceptions, not universal security claims. Distinctive-feature maturity remains **2/10**. Next: test matched view/share/export workflows with actual lower-privilege accounts and permission changes.


### 2026-10-23 — Cascade-layer and scoped-selector boundaries for AI frontend edits
**Question:** When do native `@layer` and `@scope` reduce style regressions, and where can they create false confidence?

**Finding:** Layers order competing CSS *sources* before specificity; `@scope` limits selector matching but not inherited styles. Unlayered normal rules outrank layered normal rules, while important layer order reverses. Scoping proximity resolves only otherwise tied declarations. Tailwind v3 and v4 use materially different `@layer` semantics. Safari 26.0–26.3 had a documented `@scope` form-control regression fixed in 26.4. Agents should inspect built CSS and computed declarations rather than escalating specificity or adding `!important`.

**Evidence boundary:** MDN, Chrome and Tailwind first-party documentation plus a Safari compatibility issue establish mechanics and known pitfalls. Proposed layer architecture and QA matrix are agent synthesis; no empirical agent-output uplift or cross-browser runtime tests were conducted. No maturity-score change. Next: seeded CSS conflict benchmark across layered/unlayered, nested scope, framework version and browser variants.


### 2026-10-23 — Visual-to-source feedback: React Grab versus Agentation
**Question:** Which browser-to-agent feedback tool adds useful source localization and review intent without creating false confidence or unsafe autonomous edits?

**Finding:** React Grab targets immediate rendered-element → source-context lookup; Agentation adds structured human feedback and optional MCP acknowledgment/resolution. A maintainer-associated, reproducible 330-case synthetic retrieval benchmark reports 86% baseline versus 96% for both, with React Grab faster under its accuracy-penalized metric; this does **not** establish superior design, fixes or accessibility. Source-map path failures, Agentation endpoint/subcommand sync traps, clipboard-watcher preemption, local HTTP/CORS trust boundaries and Agentation's PolyForm Shield licensing materially change installation decisions. Prefer explicit copy/annotation first, verified end-to-end sync second, autonomous fix loops only with clear permissions and tests.

**Evidence boundary:** Primary repo source, install/skill/MCP docs, reported GitHub issues and vendor-associated benchmark; one model/trial, synthetic corpus and inconsistent 330/331 published case count. No independent comparison or local install performed. Next: paired source-identification *and verified repair* tasks across real apps, clean controls, remote development and sensitive-data fixtures. Agent-workflow maturity unchanged.


### 2026-10-23 — Safari 27 MCP: actual Safari versus patched WebKit
**Question:** Does first-party Safari MCP provide unique value to coding/design agents beyond Playwright WebKit and Chrome DevTools MCP?

**Finding:** Safari 27's bundled macOS `safaridriver --mcp` exposes 17 documented browser interaction/inspection tools, enabling actual branded Safari reproduction where Playwright's patched WebKit may diverge. It complements rather than replaces cross-browser Playwright regression suites or Chrome-specific tracing. No dedicated iOS-device control, accessibility audit, or CI assertion runner was established from the tool inventory. Local MCP transport does not prevent page content/screenshots reaching the model or browser interactions from causing side effects; use isolated test state.

**Evidence boundary:** First-party WebKit release/tool documentation and Playwright browser documentation establish capabilities and limitations, not superior defect detection. No Mac/Safari execution or benchmark was run. Next: compare actual Safari MCP, Playwright WebKit and manual Safari on seeded Safari-only defects and clean controls, including iOS-only counterexamples. Maturity unchanged.


### 2026-10-23 — shadcn/ui official skill and registry MCP: source-level capability versus semantic overreach
**Question:** Does the official shadcn agent skill/MCP provide unique, safe project-grounded UI implementation guidance beyond direct CLI/docs and component inspection?

**Finding:** Official v4.22.1 source separates a project-aware skill (config, primitive-base-specific patterns, design-system/CLI references) from a seven-tool MCP server that browses registry items and **returns install commands**, not direct installation. Useful conditionally for existing shadcn projects, especially with custom aliases/multiple registries; MCP adds limited value if CLI/docs are already accessible. Inspected skill contains a contradictory categorical `2–7 choices → ToggleGroup` rule despite its own `single choice → RadioGroup` guidance: choose by semantics, not count. Registry Health tests operational availability/schema/installability, not safety or design quality. Universal/GitHub registries can distribute instructions/workflows and transitive dependencies; pin/review payloads before any agent shell installation.

**Evidence boundary:** Official skill/MCP/CLI source, shadcn registry docs, W3C radio/toggle patterns, npm package-script docs. No install, benchmark or AT trial; no score change. Next: compare CLI-only, skill-only and skill+MCP using Base/Radix projects, custom aliases, radio-vs-toggle controls, stale APIs and hostile registry fixtures.


### 2026-10-23 — Figma MCP first-party skills: design handoff versus stale instructions
**Question:** Are Figma's current agent skills a trustworthy, low-friction design-to-code/write-back capability, and can their preflight instructions be treated as authoritative?

**Finding:** Inspected the actively maintained official plugin (2.2.163, updated 2026-10-20) and actual `figma-design-to-code`, `figma-use`, `figma-generate-design`, `figma-code-connect`, and `figma-code-workflows` skills. The workflow usefully distinguishes structured design context, visual reference, production component mapping, editable Figma nodes and runnable code. But the Code Connect skill incorrectly excludes Professional Full/Dev seats relative to Figma's current official help; the repository README's 6/month low-tier limit conflicts with the current 20/month rate-limit page. Current service docs/tool responses take precedence over copied skill/README entitlements. Privileged Plugin API execution, beta write quality, mutable pricing and client allowlisting make this a conditional trial, not a blanket recommendation.

**Evidence boundary:** Direct GitHub source/commit/tree inspection plus Figma developer/help documentation (2026-10-23); no live Figma authorization, install test, output-fidelity benchmark or write-back experiment. No maturity-score change. Next: matched screenshot/context/Code Connect implementation trials with stale mappings, sparse frames, assets and an isolated write-back test.

### 2026-10-23 — Vercel web-design-guidelines skill: checklist versus conformance
**Question:** Can a widely adopted first-party code-review skill safely serve as a frontend UX/accessibility gate?

**Finding:** The Vercel skill fetches a mutable remote checklist and delegates all judgment to the agent; it runs no tests. Primary-source inspection found overbroad keyboard-handler and aria-label requirements, an incorrect equivalence between `content-visibility` and virtualization, a blanket font-loading policy, and a direct contradiction between the full guidelines' `maximum-scale=1` suggestion and the condensed checklist's zoom anti-pattern. Retained a conditional triage workflow and adversarial clean-control test, not an unconditional install recommendation.

**Evidence boundary:** Direct inspection of Vercel's SKILL.md, both guideline variants, W3C and MDN; no model/agent benchmark, install execution or measured uplift. Parent-repo stars are not skill effectiveness. Agent-workflow maturity unchanged. Next: benchmark checklist-driven review against baseline plus browser/AT verification using seeded compliant and defective controls.


### 2026-10-23 — APCA skills and contrast authority
**Question:** Can contrast-checking skills for Claude Code/Codex be trusted as a release gate, and has WCAG 3 adopted APCA?

**Finding:** The September 2026 W3C WCAG 3 draft explicitly leaves its contrast algorithm undecided. Two inspected installable skills illustrate why primary-source checking matters: `apca-cli` correctly calculates a separate WCAG 2 ratio but markets APCA as the WCAG 3 foundation and prioritizes APCA on disagreements; `oklch-skill` reverses APCA sign conventions and misstates WCAG's large-text pixel threshold. Added a WCAG-first dual-metric review contract and documented installer/global-instruction supply-chain risk.

**Evidence boundary:** Direct inspection of skill, CLI, installer and upstream source plus W3C standards/draft; no comparative testing or adoption evidence. Visual-design and agent-workflow scores unchanged. Next: controlled tests with known contrast pairs, alpha compositing, OKLCH/P3, light/dark polarity and browser-verified rendering; assess whether a narrowly scoped contrast skill actually improves agent fixes versus native axe/Playwright workflows.


### 2026-10-23 — RTL and bidirectional content as separate contracts
**Question:** What do coding agents miss when they equate localized strings with a correct right-to-left UI?

**Finding:** Correctness requires independent language (`lang`), direction (`dir`), bidi isolation of dynamic values, logical layout, selective directional-icon mirroring and keyboard/focus validation. Browser-locale emulation alone does not assert application `dir`, translations or interactive behavior. The frontend implementation guide now includes a concrete decision/test contract and W3C/Mozilla/React Aria/Playwright primary references.

**Evidence boundary:** Standards and platform/vendor guidance, not user-outcome or cross-device validation. Frontend maturity unchanged (3/10). Next: paired RTL/LTR E2E tests with mixed-script content and screen readers, including pseudo-RTL vs actual Arabic/Hebrew and keyboard navigation.


### 2026-10-23 — Webfont fallback as a visible typography state
**Question:** Which loading and fallback policies preserve reading flow, brand intent and layout stability under slow or failed font delivery?

**Finding:** The CSS Fonts 4 Working Draft recommends `fallback` for long body text while Next.js defaults to `swap`; neither is a universal winner. Design and test first-paint fallback, metric matching, browser support, selective preload and multilingual glyph coverage rather than assuming a loaded-font screenshot or framework defaults are sufficient.

**Evidence boundary:** W3C draft, MDN, web.dev and Next.js establish proposed semantics, platform mechanics and framework defaults, not comparative user outcomes. Visual-design maturity stays 3/10. Next: matched cold-network trials of `swap` + calibrated fallback, `fallback`, `optional` and system-only, including CLS/LCP and reading/task continuity.


### 2026-10-18 — Figma Code Connect v2 design-to-code handoff
**Question:** Can Figma's official Code Connect skill give AI agents trustworthy production-component mappings, and which version/verification traps matter?

**Finding:** Code Connect binds published design components to real code, but does not verify rendered fidelity. CLI v2.0.0 (2026-08-18) ended normal publishing support for legacy parser files; v2.0.2 (2026-10-14) documents limited Professional-plan publishing despite older official skill/Help gating. Use parserless templates, preview representative variants, verify Dev Mode and the rendered app. The official skill's source read-back is not a runtime check.

**Evidence boundary:** Figma's own source/changelog establishes mechanics and version changes; individual issue reports show possible failure modes, not prevalence. No paired agent trial proves uplift. Design-systems maturity remains DEVELOPING / 4/10. Next: benchmark no mapping vs simple mapping vs templates on hallucinated props, variants, stale mappings and visual QA.


### 2026-10-15 — Dark themes as semantic and accessible reading conditions
**Question:** How should AI agents implement dark mode without conflating system color-scheme behavior, WCAG contrast, user comfort, and forced-colors accessibility?

**Finding:** Use semantic light/dark token pairs and test rendered surfaces, focus states, browser-painted controls, images, and forced colors independently. WCAG 2.2 ratios remain the conformance baseline; APCA is not a WCAG 3 substitute because the September 2026 working draft has not selected a contrast algorithm. Platform guidance differs on manual theme overrides, and reading-polarity studies conflict when luminance is controlled.

**Evidence boundary:** W3C/MDN establish standards/platform mechanics; Apple/Material/Carbon provide production conventions; task-specific studies do not prove universal theme superiority. Broad visual-design maturity remains WEAK and 3/10. Next: test mixed-mode embeds, forced-colors regression and measured reading performance.




### 2026-10-10 — File-upload lifecycle and accessible recovery
**Question:** When does selecting or transferring a file become a successful upload, and what feedback/recovery must survive errors and long transfers?

**Finding:** Treat selection, measured transfer, server processing and accepted/usable as separate states. Keep the native picker as the accessible fallback to optional drop zones; use specific per-file errors and partial-batch recovery; reserve “Uploaded” for confirmed server acceptance. Resumability requires a real server/client protocol, not just progress UI.

**Evidence boundary:** GOV.UK, HMRC and USWDS provide production pattern guidance; MDN and tus define browser/protocol mechanics; OWASP defines server-validation boundaries. No comparative task-outcome evidence or maturity-score change. Next: test partial failures, screen-reader status, refresh/resume, and transfer-complete-but-server-rejected cases.


### 2026-10-09 — Notification persistence, timing and announcement
**Question:** When may an informational toast disappear, and when must feedback persist or demand an explicit response?

**Finding:** WCAG 2.2.1 explicitly allows a short-lived toast when the same information/function remains available elsewhere; a fixed five-second duration alone does not make unique actions or important messages accessible. Separate routine status (`status`), urgent non-interrupting-focus announcements (`alert`), persistent actionable notifications, and truly blocking alert dialogs. Carbon's current actionable toast guidance differs from its older v10 warning; React Aria provides one focus/timer model, not a universal keyboard convention.

**Evidence boundary:** W3C standards/APG and current Carbon/React Aria documentation establish implementation and timing contracts, not measured task outcomes. No broad UX maturity-score change; comparative user/AT trials remain open.

### 2026-09-30 — Scroll-driven timelines vs discrete scroll state
**Question:** When should agents use native scroll-driven animations or scroll-state queries instead of JavaScript scroll tracking?

**Finding:** Use scroll/view timelines when a presentational effect is genuinely a continuous, reversible function of scroll progress; use scroll-state queries when the requirement is discrete such as stuck/scrollable/snapped state. Keep application/domain state out of scroll plumbing unless scrolling truly changes that state. Native CSS removes main-thread JavaScript tracking for these visual effects, but that performance capability does not justify adding motion. The no-animation path must remain complete, and reduced-motion handling remains mandatory for non-essential scroll-linked movement.

**Evidence boundary:** MDN documents current platform behavior and the performance architecture of CSS timelines; existing W3C/MDN reduced-motion guidance establishes the accessibility boundary. This cycle found no strong outcome evidence that scroll-linked animation itself improves comprehension or task success.


### 2026-09-30 — Purposeful motion, reduced motion, and view transitions
**Question:** How should agents decide when interface motion is useful, how should reduced-motion variants preserve meaning, and which current web primitives are safe to build on?

**Finding:** Motion should earn its cost by communicating state, causality, spatial relationship, feedback, continuity, or progress. Reduced motion is a semantic interaction variant rather than a blanket late-stage disable: preserve the information while removing or replacing problematic spatial movement. `prefers-reduced-motion` is broadly available; W3C documents it as a sufficient technique for non-essential interaction-triggered motion. The View Transition API now provides current-platform primitives for SPA/MPA continuity and skippable transitions, but animation remains progressive enhancement and application state/focus/history must stay correct without it.

**Evidence boundary:** W3C establishes accessibility requirements/techniques; MDN establishes platform availability and API behavior; Apple independently supports intent-driven motion and adaptation for Reduce Motion. These sources do not justify universal durations/easings or claims that animation always improves comprehension or perceived performance.


### 2026-09-30 — Loading, progress, empty, and error states
**Question:** How should products represent asynchronous loading, progress, empty, stale, and failure states without destroying context or creating misleading feedback?

**Finding:** Model asynchronous UI as explicit states, preserve useful existing content during background work, scope blocking to what is actually unavailable, and choose skeleton/spinner/progress from the information the system truly has. Skeletons are best justified as structural placeholders that reserve expected geometry; determinate progress requires trustworthy progress. Empty and error states are semantically different. Dynamic waiting/progress/result/error messages need accessible status semantics without unnecessary focus movement.

**Evidence boundary:** W3C defines status/progress accessibility behavior; Carbon and Atlassian independently provide mature production pattern guidance; MDN supplies platform semantics/rendering capabilities. This cycle found no strong basis for a universal wait-time threshold or for claiming skeletons always improve perceived speed.


### 2026-09-30 — Search, filtering, and result-set orientation
**Question:** How should search, filtering, result state, and pagination work together so users stay oriented and can recover?

**Finding:** Treat them as one result-set control system. Applied constraints need a visible summary outside potentially hidden controls; result changes need clear state/count feedback; zero results need explicit recovery; filtering/sorting applies to the whole set and resets pagination. Explicit Apply versus live filtering is conditional: choose from task shape, latency, stability, and accessibility rather than assuming either is universally superior. Pagination remains a robust default for goal-directed retrieval; automatic infinite scroll has accessibility/location costs.

**Evidence boundary:** Baymard supplies behavioral ecommerce evidence for applied-filter visibility. GOV.UK, MOJ, DWP, and Home Office provide deployed public-service/accessibility guidance. W3C defines dynamic status-message requirements. Commerce-specific prevalence and public-service conventions are not universal outcome evidence.


### 2026-09-30 — Agent-readable design systems and bounded creativity
**Question:** How should an agent-readable design system preserve coherence without forcing every generated page into the same composition?

**Finding:** Separate invariants from degrees of freedom. Semantic role-based tokens, component contracts, accessibility/state behavior, and theme relationships should be stable; composition, density, imagery, and selected expressive choices can remain bounded freedoms. Tokens are infrastructure rather than the whole system: agents also need component usage, composition rules, representative references, and explicit permission boundaries. The stable DTCG 2025.10 format now provides a vendor-neutral machine-readable token layer, while Apple and Carbon independently support semantic role-based styling across contexts.

**Evidence boundary:** DTCG, Apple, and Carbon establish mature design-system mechanics; Anthropic shows current product adoption of reusable design-system grounding for AI design workflows. Comparative evidence about which artifact mix best improves agent output is still missing.


### 2026-09-30 — Risk-shaped autonomy and recovery for agents
**Question:** Which AI-native interaction patterns best preserve control, feedback, provenance, approval, and recovery without creating approval fatigue?

**Finding:** Oversight should be proportional to consequence and reversibility. Low-risk work can run autonomously inside narrow capability boundaries; consequential side effects deserve concrete approvals; irreversible/high-blast-radius work needs stronger confirmation plus technical containment. Long-running agents need layered progress and post-run records, while reversible automation should favor visible undo. Denials should preserve safe progress and recover through a lower-risk path where possible.

**Evidence boundary:** Anthropic telemetry supplies product-specific evidence for approval fatigue and sandboxing; OpenAI independently recommends approvals around side effects; Microsoft agent guidance and HAX support inspectability, human control, and undo. Exact thresholds remain product/domain-specific.

### 2026-09-30 — 2026 trend signal vs real product adoption
**Question:** Which current UI/UX trends have evidence of real product adoption rather than showcase-only popularity?

**Finding:** Trend evidence must be tiered. 2026 creative sources consistently signal a reaction against generic AI polish toward tactile/human-specific expression, but that remains mainly creative/commercial evidence. By contrast, infinite canvas is demonstrably shipped in creation/diagramming products, and contextual human-agent work surfaces are now shipped by products including Linear and Notion. Product adoption still does not prove superior UX. A four-level evidence ladder now separates showcase signal, commercial creative signal, product adoption, and measured behavior/outcomes.

**Evidence boundary:** Webflow and Adobe support current creative momentum; Canva, Linear, Notion, and Webflow product materials support adoption claims. This cycle did not find controlled comparative outcome evidence for the aesthetic trends.

### 2026-09-30 — Claude frontend context and evaluation workflow
**Question:** What context and workflow most improves frontend output from Claude/AI coding agents?

**Finding:** Current Anthropic evidence supports a brief-grounded design contract before coding, explicit criteria for coherence/originality/craft/functionality, rendered-browser evaluation rather than code-only review, and an independent skeptical evaluator for sufficiently difficult subjective work. Claude Code now directly supports AGENTS.md in current versions, while modular/path-scoped rules and skills can reduce always-on context noise. Claude Design also reinforces preserving design intent and design-system context in handoffs.

**Evidence boundary:** Mostly first-party Anthropic engineering and product evidence. Strong for Claude workflow design; insufficient to claim universal user aesthetic preference or cross-model superiority.

## Sections needing review
Foundations, distinctive features, and cross-model anti-generic guidance remain weak. Frontend implementation is now developing after container-responsive and scroll-driven CSS guidance, but still needs broader native UI primitives, semantic HTML patterns, performance, testing, and framework integration. Interaction/motion now has an operational baseline for purposeful transitions and reduced-motion behavior, but still needs direct-manipulation patterns and measured outcome evidence. UX patterns are now developing after form/error-recovery, search/filter/result-set, and loading/empty/error-state coverage, but onboarding, tables, settings, dialogs, and other common interactions remain. Design systems now have an operational architecture but still need comparative agent-output validation and richer component/composition examples. Trend evidence classification is now usable but should be expanded only with meaningful new evidence.

## Research selection rule
Prefer a focused question that can improve one or two files substantially. Avoid broad “research UI/UX” passes.

Do not infer maturity from recency or number of completed cycles. A topic already researched several times may still be the best target when important contradictions, edge cases, implementation failures, alternatives, or evidence gaps remain.

Balance:
- weak areas that need foundational coverage;
- developing areas that need depth and competing perspectives;
- mature areas that deserve periodic adversarial revalidation.

For broad domains, prefer multiple investigations over time from different angles rather than attempting to “finish” the area in one or a few runs.

A useful research cycle does not need to raise a score.
