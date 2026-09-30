# Learning State

This file guides autonomous research selection. Use qualitative states; do not invent numeric coverage percentages.

## Knowledge map

| Area | State | Priority | Notes |
|---|---|---:|---|
| Foundations | WEAK | High | Seed principles; needs evidence and depth |
| Visual design | WEAK | High | Needs current visual-language research |
| UX patterns | WEAK | High | Needs operational pattern guidance |
| Interaction & motion | WEAK | Medium | Needs evidence and implementation patterns |
| AI-native UX | WEAK | High | Strategic and fast-changing |
| Design systems | WEAK | High | Especially agent-readable systems |
| Distinctive features | WEAK | High | Core differentiation objective |
| Frontend implementation | WEAK | Medium | Needs current platform capabilities |
| Claude/AI-agent workflows | ADEQUATE | Medium | First evidence-backed workflow established; comparative testing still missing |
| Anti-patterns / AI slop | WEAK | High | Claude-specific tells identified; cross-model evidence and alternatives still needed |
| Trend observatory | WEAK | Medium | Separate adoption from showcase momentum |

## First research priorities
1. What currently causes AI-generated web/app interfaces to look generic across models, and what practical alternatives work?
2. Which current UI/UX trends show real product adoption rather than showcase-only popularity?
3. Which AI-native interaction patterns best preserve control, feedback, provenance, and recovery?
4. Which distinctive features provide product value beyond decoration?
5. How should agent-readable design systems balance invariants with creative degrees of freedom?

## Recent research

### 2026-09-30 — Claude frontend context and evaluation workflow
**Question:** What context and workflow most improves frontend output from Claude/AI coding agents?

**Finding:** Current Anthropic evidence supports a brief-grounded design contract before coding, explicit criteria for coherence/originality/craft/functionality, rendered-browser evaluation rather than code-only review, and an independent skeptical evaluator for sufficiently difficult subjective work. Claude Code now directly supports AGENTS.md in current versions, while modular/path-scoped rules and skills can reduce always-on context noise. Claude Design also reinforces preserving design intent and design-system context in handoffs.

**Evidence boundary:** Mostly first-party Anthropic engineering and product evidence. Strong for Claude workflow design; insufficient to claim universal user aesthetic preference or cross-model superiority.

## Sections needing review
All areas except the initial Claude workflow remain seed-level. Claude workflow guidance should itself be revalidated as models and Claude Code evolve.

## Research selection rule
Prefer a focused question that can improve one or two files substantially. Avoid broad “research UI/UX” passes.
