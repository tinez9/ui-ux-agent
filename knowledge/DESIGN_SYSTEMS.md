# Design Systems

How visual and interaction rules become reusable systems that humans and AI agents can apply consistently.

## Core model: constrain decisions, not pages

An agent-readable design system should separate **invariants** from **degrees of freedom**.

### Invariants
Rules an agent should not casually reinterpret:
- semantic roles for color, typography, spacing, state, focus, elevation, and motion
- accessibility contracts
- component anatomy, supported states, and interaction behavior
- token relationships and theme mappings
- brand-critical assets or rules
- platform constraints

### Degrees of freedom
Decisions that may vary by product context:
- page composition and hierarchy
- density within allowed ranges
- which approved components/patterns to combine
- editorial rhythm and whitespace
- imagery/art direction within brand constraints
- optional expressive motion
- responsive recomposition when behavior remains valid

The purpose is **bounded creativity**: preserve system integrity without turning every screen into the same template.

## Encode meaning, not raw appearance

Prefer semantic roles over literal values. A useful chain is:

`primitive → semantic role → component role → rendered value`

For example, an agent should usually choose a role such as `text.secondary` or `border.focus`, not invent a hex value. This allows themes and accessibility contexts to change without changing the intended meaning.

This is consistent with mature platform systems: Apple defines dynamic colors semantically by purpose and warns against reassigning their meanings; Carbon defines tokens by stable roles whose values change across themes.

## Tokens are infrastructure, not the whole design system

The Design Tokens Community Group's stable 2025.10 format provides a vendor-neutral exchange layer for design decisions. It supports typed values, groups, aliases/references, and extensions; the resolver specification supports contextual values such as light/dark themes.

Use interoperable tokens where they reduce drift between design and code. Do not infer UX behavior, component anatomy, layout intent, or product hierarchy from token files alone: the DTCG format standardizes exchange, not design-system methodology.

### Recommended layers

1. **Primitives** — raw palette, type scale, spacing scale, radii, durations.
2. **Semantic tokens** — roles such as text-primary, surface-raised, border-subtle, focus, danger.
3. **Component tokens** — only where a component genuinely needs a scoped role.
4. **Themes/contexts** — map stable roles to values for light/dark, brand, high-contrast, platform, or other supported contexts.

Avoid exposing a large primitive palette as the primary interface to an agent. Semantic choices reduce arbitrary styling and make intent reviewable.

## What an AI coding agent needs

A token dump or component library is insufficient. Provide a compact **design contract** containing:

### 1. Foundations
- semantic token source of truth
- typography roles
- spacing/density rules
- responsive breakpoints or container behavior
- motion and reduced-motion policy
- accessibility requirements

### 2. Components
For important components specify:
- purpose and when to use
- anatomy
- variants
- states: default, hover, focus, active, disabled, loading, error, selected where relevant
- content constraints
- responsive behavior
- accessibility/keyboard behavior
- composition constraints
- canonical implementation or import path

### 3. Composition rules
Define relationships that components alone cannot express:
- page/grid constraints
- hierarchy and density expectations
- nesting rules
- common product shells
- when cards/containers are unnecessary
- mobile recomposition principles
- preferred patterns for repeated tasks

### 4. Degrees of freedom
Explicitly tell the agent where it may depart from defaults. Without this, agents tend either to improvise inconsistently or overfit to a component catalog.

### 5. References and evaluation
Supply representative real screens or rendered references and evaluate the implementation visually. Claude Design's current workflow provides first-party product evidence for building a reusable team design system from code/design files and applying it automatically, while preserving design intent in handoff to Claude Code.

## Agent decision order

When implementing UI, prefer:

1. existing product pattern that already solves the task
2. existing component with supported variant
3. composition of existing primitives/components
4. bounded extension consistent with tokens and interaction contracts
5. new component/pattern only when the existing system cannot express the requirement

Do not force a bad existing component merely for consistency. Document why a new pattern is needed.

## Accessibility belongs in the contract

Accessibility variants should not be post-processing. The system should encode focus treatment, contrast expectations, semantic state, reduced motion, input behavior, and supported high-contrast/appearance contexts.

Apple's system colors demonstrate the principle: semantic colors can adapt across light, dark, and increased-contrast contexts while preserving their role. The DTCG resolver likewise models alternate token contexts; however, support in a token format does not by itself guarantee accessible component behavior.

## Failure modes for agent-readable systems

### Token dump
**Failure:** hundreds of values with no semantic guidance.  
**Better:** expose role-based tokens and usage rules.

### Component catalog without composition guidance
**Failure:** correct components arranged into generic or incoherent pages.  
**Better:** document hierarchy, density, layout relationships, and representative compositions.

### Screenshot-only grounding
**Failure:** an agent imitates appearance while missing states, semantics, responsiveness, and behavior.  
**Better:** pair visual references with machine-readable rules and component contracts.

### Overconstraint
**Failure:** every page becomes a rearrangement of the same shell/cards.  
**Better:** lock system invariants while naming safe degrees of freedom.

### Underconstraint
**Failure:** local invention creates drift in spacing, color, interaction, and accessibility.  
**Better:** make semantic roles and canonical components easy to discover and reuse.

### Primitive leakage
**Failure:** agents choose arbitrary palette/spacing primitives rather than meaningful roles.  
**Better:** reserve primitives for system construction and make semantic tokens the normal implementation interface.

## Evidence boundary

The DTCG specification strongly supports interoperable token representation and contextual resolution; Apple and Carbon support semantic role-based styling and theme adaptation; Anthropic provides current first-party evidence that AI design workflows can ingest and reuse team design systems.

These sources **do not yet prove** which exact design-system artifact mix produces the best agent-generated UI, nor how much creative freedom maximizes quality. Those remain empirical questions.

## Current research questions

- Which artifact contributes most to agent fidelity: tokens, component contracts, composition rules, rendered references, or real content?
- How should degrees of freedom be encoded so agents remain distinctive without violating system integrity?
- Which design-system rules can be automatically validated in generated frontend?
- How much system context should be always-on versus retrieved only for the current component/page?
