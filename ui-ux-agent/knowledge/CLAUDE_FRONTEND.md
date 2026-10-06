# Claude and AI-Agent Frontend Workflows

Fast-changing knowledge about using coding agents effectively for UI implementation.

> Last evidence review: 2026-09-30. Model- and tool-specific guidance should be revalidated as Claude changes.

## High-value workflow: brief → design plan → build → independent evaluation → iterate

Anthropic's 2026 frontend experiments provide unusually direct evidence about improving Claude-generated UI.

### 1. Ground the visual direction in the actual subject

Before implementation, identify the product, audience, primary job, real content, brand constraints, and visual vernacular. Distinctive decisions should emerge from that context rather than from a reusable "AI aesthetic."

Anthropic's official frontend-design skill explicitly asks Claude to derive palette, typography, layout, and visual identity from the brief and subject matter rather than default patterns.

### 2. Externalize a compact design plan before coding

Create a small design contract before implementation:

- **Visual thesis:** one concrete sentence describing the intended character.
- **Color:** a compact palette with semantic roles.
- **Type:** chosen families, roles, hierarchy, measure, and spacing.
- **Layout:** composition concept and alignment logic; ASCII wireframes can help compare directions cheaply.
- **Distinctive decision:** the one memorable visual or interaction idea.
- **Restraint rule:** what will intentionally remain quiet.
- **Interaction principles:** motion and state behavior.
- **Quality floor:** responsive behavior, keyboard focus, reduced motion, accessibility, and core states.

Then critique the plan against the brief *before* writing UI code. Replace any decision that could have been copied unchanged into an unrelated product.

This is more useful than prompting only with adjectives such as "modern" or "premium": the artifact makes visual intent inspectable and gives later evaluation a target.

### 3. Make subjective quality gradable

Anthropic's frontend harness separated generation from evaluation and used four explicit criteria:

- **Design quality:** does the interface form a coherent visual whole with a distinct identity?
- **Originality:** are there deliberate custom decisions rather than templates, library defaults, or recurring AI patterns?
- **Craft:** typography hierarchy, spacing, harmony, contrast, and technical visual execution.
- **Functionality:** can users understand the interface, find actions, and complete tasks?

The important operational lesson is not a universal weighting. It is to turn "make it look good" into concrete criteria tied to the brief.

### 4. Prefer an independent evaluator for difficult subjective work

Self-evaluation is structurally weak: Anthropic observed generators tending to praise their own mediocre output. A separate evaluator can be tuned to be skeptical and gives the builder concrete feedback.

Use this selectively. Anthropic also found that as model capability improved, evaluator overhead stopped being worthwhile for tasks already within the generator's reliable capability. Add orchestration where it creates measurable lift, not by default.

### 5. Evaluate the rendered product, not just source code

For UI work, an evaluator should inspect the running interface with browser tooling:

1. open the product at realistic viewport sizes;
2. exercise primary flows and important states;
3. inspect screenshots;
4. check visual hierarchy, identity, spacing, typography, responsiveness, focus, and reduced-motion behavior;
5. test whether interactions actually work;
6. produce specific evidence-backed critique.

Anthropic's evaluator used Playwright to navigate and screenshot the live page. This caught functional gaps that source-level confidence did not.

### 6. Iterate strategically, not monotonically

After evaluation, choose between:

- **refine** when the visual thesis is working but execution is weak;
- **pivot** when the direction itself is generic, mismatched, or exhausted.

Do not assume the final iteration is automatically the best. Anthropic observed improvement trends that could plateau, increasing implementation complexity, and cases where an earlier iteration was preferable.

### 7. Define "done" before complex implementation

For larger product work, convert a high-level requirement into testable acceptance criteria before building. Anthropic's multi-agent harness used negotiated sprint contracts between generator and evaluator so both agreed on observable success before implementation.

The durable pattern is:

**intent → explicit acceptance contract → implementation → behavioral/visual evaluation**

This reduces the chance of polished-but-shallow features.

## Context architecture for Claude Code

As of Claude Code v2.1.277+, Claude Code can read repository `AGENTS.md` directly when no project `CLAUDE.md` takes precedence. If a project uses both, loading behavior depends on the project-instructions setting.

For repositories intended for multiple coding agents:

- Keep cross-agent, repository-wide rules in `AGENTS.md`.
- If Claude-specific instructions are required, use `CLAUDE.md` and import shared rules with `@AGENTS.md`, or configure Claude Code to read both.
- For larger repositories, use `.claude/rules/` to modularize persistent instructions; path-scoped rules reduce irrelevant context.
- Use skills for task-specific guidance that should load only when relevant rather than placing everything in always-on project instructions.
- Keep instructions concrete, structured, current, and non-duplicated.

### Why this matters

More persistent context is not automatically better. Agent instructions compete for attention. Separate durable project constraints from task-specific design knowledge and load the latter only when the task requires it.

## Design-to-code handoff

Anthropic's Claude Design workflow reinforces a useful general pattern: preserve **design intent**, not only pixels. Claude Design can derive a team design system from code/design files and packages designs into a handoff bundle for Claude Code.

A strong handoff should therefore include:

- product/audience/task context;
- visual thesis and design principles;
- design tokens and component constraints;
- representative screens or visual references;
- important interaction behavior;
- responsive intent;
- real content or content rules;
- states and acceptance criteria;
- explicit non-goals and generic defaults to avoid.

A screenshot without intent leaves the coding agent to infer too much; prose without visual evidence leaves aesthetic interpretation too unconstrained. Prefer both when available.

## Current anti-patterns called out by Anthropic's frontend-design skill

Treat these as model-specific calibration signals, not universal design prohibitions:

- decorative gradient hero formulas;
- identical rounded-card grids with one radius and shadow everywhere;
- automatic all-caps eyebrow labels;
- meaningless numbered sections;
- default dark + acid accent schemes;
- warm-cream/editorial styling applied regardless of subject;
- repeated fade-and-slide entrances and hover animation on every card;
- arbitrary monospace metadata and arrow suffixes;
- headline emphasis applied mechanically to one word.

The corrective principle is: **a legitimate style becomes an AI tell when it appears independent of subject matter.**

## Evidence boundaries

Anthropic's harness results are engineering experiments and first-party observations, not controlled UX research establishing universal user preference. Use them as strong evidence about Claude workflow behavior and weaker evidence about what all users find aesthetically preferable.

## Sources

- Anthropic Engineering — *Harness design for long-running application development*, 2026-03-24.
- Anthropic / Claude Code — official `frontend-design` skill, reviewed 2026-09-30.
- Claude Code Docs — project memory, `AGENTS.md`, `.claude/rules/`, and skills behavior, reviewed 2026-09-30.
- Anthropic — *Introducing Claude Design by Anthropic Labs*, 2026-04-17.
