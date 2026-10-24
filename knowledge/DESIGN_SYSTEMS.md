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

## Figma Code Connect 2.x: design-to-code bindings, not proof of fidelity (2026-10-18)

**When useful:** a team has a maintained, published Figma component library *and* real production components. The official Figma MCP can supply selected-node structure, screenshots and variables; Code Connect maps a Figma component to its code component/source and optionally a property-aware snippet. This reduces guesswork about names and variants, but does not establish visual, responsive, functional or accessibility correctness. Storybook supplies code-side contracts/tests; Code Connect supplies design-to-code identity. Use both only if each solves a real gap.

**Critical version correction:** the actively maintained official `figma/code-connect` CLI reached **v2.0.2 on 2026-10-14**. Since **v2.0.0 (2026-08-18)**, framework-specific parser files (e.g. React `.figma.tsx` with `figma.connect()`) are legacy: normal v2 publish commands require parserless `.figma.ts`/`.figma.js` templates; use `figma connect migrate` and review its output for older libraries. Avoid copying pre-v2 tutorials or unmaintained generators that still emit `.figma.tsx`. The official `figma-code-connect` agent skill correctly writes templates, but its final checklist mostly re-reads the file; **a syntactically plausible template is not a verified rendered instance**.

**Agent acceptance path:** verify the selected Figma file/node and published library; fetch sparse metadata before targeted context; inspect actual code Props/types and each Figma variant/boolean/slot mapping; draft a parserless template without inventing props. With a reviewed/pinned `@figma/code-connect`, run `figma connect preview <file> --inspect`, targeted `--props` and representative `--all` cases (cap combinatorial explosion); validate/preview before publishing. After publish, inspect the snippet on a real instance in Figma Dev Mode and re-query MCP mapping/context; finally inspect rendered app states in browser/keyboard QA. Historical upstream issues document CLI-success/Dev-Mode-failure and prop drift, so publish success alone is insufficient.

**Entitlement and safety nuance:** Figma's current skill/Help still describe Organization/Enterprise Dev/Full seats, while the **v2.0.2 CLI changelog explicitly mentions limited Professional-plan publishing (one library/one framework)**. Treat this as a documentation/version discrepancy: check actual account, seat, tool and library access rather than asserting either universal availability or exclusion. Remote MCP can also mutate Figma canvases; separate read from write permissions, review mapping batches (partial successes possible), keep recoverable design versions and protect tokens. Template-level MCP mapping may be feature-gated. The official `figma/mcp-server-guide` hosts skills/configuration, **not** the hosted server source; the separate Code Connect CLI is MIT-licensed. Do not infer server security or licensing from the guide.

**Evidence boundary:** first-party changelog and skill source support these mechanisms; individual upstream issues are failure examples, not incidence rates. No paired agent trial yet proves better frontend output. Compare no mapping, simple mapping and templates on incorrect props, nested/variant fidelity, stale mappings, false confidence, rendered responsive states and cost.

Sources: https://github.com/figma/code-connect/blob/main/CHANGELOG.md ; https://github.com/figma/code-connect ; https://github.com/figma/mcp-server-guide/blob/main/skills/figma-code-connect/SKILL.md ; https://github.com/figma/mcp-server-guide/blob/main/skills/figma-generate-library/references/code-connect-setup.md ; https://github.com/figma/code-connect/issues/299 ; https://github.com/figma/code-connect/issues/291 .

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

## Design-token validation is a pipeline, not a file format — 2026-10-14

**Decision:** DTCG 2025.10 being stable does **not** make every token transformer fully conformant, nor does valid token JSON prove a usable UI. Separate *format validity → resolution → platform output → rendered component states*.

1. **Validate the declared specification version.** DTCG 2025.10 color tokens use a `$value` object with `colorSpace` and `components` (optional `alpha`/`hex`); a bare hex string is not a conforming 2025.10 color value. A dimension value has numeric `value` and `unit` (`px` or `rem`, including zero). Resolve aliases and `$extends`; reject unresolved, circular, or type-incompatible references rather than guessing types from values.
2. **Do not turn an organization's lint preference into a standards claim.** DTCG explicitly allows a token to inherit `$type` from a group or referenced token, and permits `$type` on groups. GitHub Primer's agent-facing [token format guide](https://github.com/primer/primitives/blob/main/contributor-docs/agents/w3c-design-token-format-guide.md) instead requires `$type` on every token and forbids it on groups. That can be a local house rule, **not** a DTCG conformance requirement. When an agent rule conflicts with a normative spec, identify the distinction before “fixing” valid files.
3. **Test the actual transformer, not its marketing label.** As reviewed 2026-10-14, [Style Dictionary's DTCG documentation](https://styledictionary.com/info/dtcg/) explicitly says its support for the latest **2025.10** format is incomplete and ongoing in v5, despite earlier DTCG support in v4. Pin the toolchain and keep a small set of valid/invalid reference, color-space, theme and unit fixtures. Fail on unsupported constructs or verified lossy transforms; do not silently claim round-trip fidelity.
4. **Validate resolved *uses*, not isolated color swatches.** For every supported theme/contrast mode and component state, verify semantic foreground/background/border/focus relationships after alpha composition and platform conversion. A passing schema cannot catch insufficient contrast, invisible focus, an inaccessible disabled/selected distinction, or wrong tokens applied to a real component. Use component stories, rendered checks, keyboard/assistive-technology tests, and review in addition to automated contrast/axe checks.
5. **Keep the agent's change boundary narrow.** It may select existing semantic roles and report violations. Changing a primitive, alias target or cross-theme mapping is a design-system migration with a potentially large blast radius; require a dependency diff, component-state regression checks and explicit review.

**Falsification fixture:** seed one valid group-inherited type (must **not** be rejected as nonconformant), a cyclic alias, a dangling `$extends`, a 2025.10 color encoded as a bare hex string, a wide-gamut conversion difference, and a theme with an unreadable focused control. Compare parser/linter acceptance with resolved CSS/native output and rendered states. Report false rejects as well as missed defects. This tests operational correctness; it does not prove that token validation alone improves user outcomes.

**Evidence:** [DTCG Format 2025.10](https://www.designtokens.org/tr/2025.10/format/), [Color Module](https://www.designtokens.org/tr/2025.10/color/), [Style Dictionary DTCG status](https://styledictionary.com/info/dtcg/), [Primer agent rules](https://github.com/primer/primitives/blob/main/contributor-docs/agents/w3c-design-token-format-guide.md), [Storybook accessibility-test limitations](https://storybook.js.org/docs/writing-tests/accessibility-testing). These are normative format rules and tool documentation, not a controlled comparison of agent-generated UI quality.

## DTCG build-tool choice: preserve contexts, validate outputs, distrust format labels — 2026-10-24

**Research question:** When does a token build tool actually preserve the design system's meaning for an AI coding agent? **Answer:** not when it merely accepts JSON or emits CSS. The test is whether it preserves *which semantic role applies in which context*, and whether its outputs are safe and correct.

**Two inspectable build options (not installable agent skills):**
- **Style Dictionary 5.7.0** (Apache-2.0; `npm i -D style-dictionary`; Node >=22) is a mature, extensible multi-platform transformer. Its v5 DTCG support remains explicitly **incomplete for 2025.10**. Transform ordering, reference preservation/resolution, and custom platform transforms can change semantics; pin the exact version and test generated outputs. Do not equate an old v3 CTI tutorial with v5 typed-token behavior.
- **Terrazzo CLI/plugin-css 2.10.0** (MIT; `npm i -D @terrazzo/cli @terrazzo/plugin-css`; `npx tz check` then `npx tz build`) is a useful DTCG-first choice for web CSS and context permutations. Its actual parser contains resolver application, and its CSS plugin maps contexts to selectors/media queries. **Freshness trap:** the generic getting-started page still says resolver/2025.10 support is “coming in 2.0”; that claim is obsolete for inspected 2.10.0 source and current resolver docs. It is not proof that *every* DTCG feature round-trips correctly. CSS permutations are application-specific code: a wrong selector, ordering, or omitted dependency can create a valid build with the wrong theme. Its docs themselves warn that `only.modifiers` can bypass downstream-token checks and that non-orthogonal contexts may collide in the CSS cascade.

**Real shipped-export counterexample:** Adobe Spectrum's **2026-09-17** DTCG exporter resolves a **single chosen context** (`--color-scheme`, `--scale`, `--contrast`) and flattens UUID/alias chains to leaf values. Its published example emits bare hex strings for `$type: "color"` while explicitly acknowledging this is **not conformant with DTCG 2025.10 structured color values**. Therefore, “DTCG export” can be a *consumption snapshot*, not a portable editable source of truth. Do not import a one-mode export as if it preserved all contexts or alias provenance; ask for the original source/resolver or export and compare every required context. A converter's pragmatic compatibility choice is not a revision to the standard.

**Security and provenance gate:** The Style Dictionary `convertTokenData` prototype-pollution fixes were iterative: advisory **GHSA-vj5c-m527-mpff** patched in 5.4.4, **GHSA-xmr7-549p-98w3** patched in 5.5.1, and nested-key bypass **GHSA-cr3w-v879-f973** patched in **5.5.5** (2026-09-20). Avoid vulnerable versions; for a new installation prefer a reviewed current 5.7.x release with a lockfile. Token JSON, generated configs, plugins, build hooks and imported Figma exports are **inputs to executable build infrastructure**, not harmless style data. Do not run `npx`/plugin installers or import unknown token packages automatically in an untrusted workspace; inspect package scripts and dependencies and restrict CI secrets. This is a supply-chain risk assessment, not a claim of a current vulnerability in 5.7.0 or Terrazzo 2.10.0.

**Agent decision/acceptance contract:** (1) identify canonical editable token source, declared 2025.10 version and all contexts; (2) prefer the project's existing pinned builder over introducing another; (3) validate spec schema **and** aliases/cycles/context resolution; (4) compile a fixed fixture matrix: light/dark, high-contrast, density/size, nested alias, wide-gamut color, missing/invalid reference, and overlapping modifiers; (5) diff generated CSS/TS/native output against reviewed expected values, test CSS cascade and rendered component states, and fail on missing tokens, wrong context, or loss of provenance where round-trip is required; (6) require review before changing shared primitives, resolver precedence, plugins or the build chain. A passing CLI exit code, linter, or visually plausible palette is **not** a conformance or UX-quality verdict.

**Evidence boundary:** DTCG 2025.10 is a stable *Community Group Report*, not a W3C Recommendation; the 2026-09-08 `/tr/drafts/` preview explicitly warns not to implement it as authoritative. Versions and failure mechanisms were checked against upstream source/docs/advisories and Adobe's direct export documentation; **no local cross-tool execution or comparative agent trial** was performed. Next: run a paired, pinned Style Dictionary/Terrazzo build with positive and negative context/alias fixtures, checking false passes, lossy transforms, CSS cascade collisions, build cost and agent repair quality.

Primary references: https://www.designtokens.org/tr/2025.10/ ; https://www.designtokens.org/tr/drafts/ ; https://styledictionary.com/info/dtcg/ ; https://styledictionary.com/reference/hooks/transforms/ ; https://github.com/style-dictionary/style-dictionary/blob/main/package.json ; https://terrazzo.app/docs/guides/resolvers/ ; https://terrazzo.app/docs/integrations/css/ ; https://github.com/terrazzoapp/terrazzo/blob/main/packages/parser/src/resolver/create-resolver.ts ; https://opensource.adobe.com/spectrum-design-data/articles/exporting-tokens-to-dtcg/ ; https://github.com/style-dictionary/style-dictionary/security/advisories/GHSA-vj5c-m527-mpff ; https://github.com/style-dictionary/style-dictionary/security/advisories/GHSA-xmr7-549p-98w3 ; https://github.com/style-dictionary/style-dictionary/security/advisories/GHSA-cr3w-v879-f973 .

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
