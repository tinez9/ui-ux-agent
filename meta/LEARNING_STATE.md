# Learning State

This file guides autonomous research selection. Use qualitative states; do not invent numeric coverage percentages.

## Knowledge map

| Area | State | Priority | Notes |
|---|---|---:|---|
| Foundations | WEAK | High | Seed principles; needs evidence and depth |
| Visual design | WEAK | High | First 2026 creative signals identified; needs durable operational rules |
| UX patterns | DEVELOPING | High | Operational forms, result-set control, and loading/empty/error-state guidance documented; many common product patterns remain |
| Interaction & motion | WEAK | Medium | Needs evidence and implementation patterns |
| AI-native UX | ADEQUATE | Medium | Risk-shaped autonomy, approvals, progress, recovery, provenance, and denial recovery documented; domain-specific validation remains |
| Design systems | DEVELOPING | Medium | Agent-readable contract established: semantic tokens, component contracts, composition rules, accessibility invariants, and explicit degrees of freedom; comparative validation still missing |
| Distinctive features | WEAK | High | Core differentiation objective |
| Frontend implementation | WEAK | Medium | Needs current platform capabilities |
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
Foundations, motion, distinctive features, frontend implementation, and cross-model anti-generic guidance remain weak. UX patterns are now developing after form/error-recovery, search/filter/result-set, and loading/empty/error-state coverage, but navigation, onboarding, tables, settings, dialogs, and other common interactions remain. Design systems now have an operational architecture but still need comparative agent-output validation and richer component/composition examples. Trend evidence classification is now usable but should be expanded only with meaningful new evidence.

## Research selection rule
Prefer a focused question that can improve one or two files substantially. Avoid broad “research UI/UX” passes.
