# UI/UX Agent

Two things live in this repository:

1. **`skills/ui-ux/` — a Claude Code skill** that audits, designs, improves and reviews real web
   and app interfaces with evidence, confidence levels and prioritized findings. This is the
   installable product.
2. **The knowledge lab** (`knowledge/`, `research/`, `meta/`, `agent_context/`, `automation/`) —
   an evolving research base about UI/UX, design systems, AI-native UX and agent frontend
   workflows. The skill's references are a curated, consolidated synthesis of it.

The lab evolves continuously; the skill is updated from it **manually and deliberately** (see
[`skill-dev/SYNC.md`](skill-dev/SYNC.md)).

---

## The skill: `ui-ux`

### What it is

A UI/UX engineering skill that makes Claude Code behave like a Staff Product Designer + UX
Researcher + Design Systems Engineer + Frontend UI Reviewer. It is not a style generator and not a
checklist dump: it teaches a way of reasoning —

`Understand → Inspect → Form hypotheses → Evaluate → Prioritize → Design → Implement → Render → Verify → Iterate`

— with priorities (`product thinking > UX > hierarchy > interaction > accessibility > responsive >
design system > visual > decoration`), and with **evidence over assumption, purpose over trend,
product identity over generic AI aesthetics**.

### What problems it solves

- Agents jumping from "this looks bad" to "change the colors" without understanding users and tasks.
- Opinions presented as facts; claims about layouts the agent never actually saw.
- Unranked lists of 100 recommendations.
- Changes considered "done" because `npm run build` passed.
- Generic, interchangeable "AI-made" interfaces — without turning taste into prohibitions.
- Design systems that are either chaotic or so rigid every page looks the same.

### Install

Copy the skill folder into a project, or into your user skills folder to use it everywhere.

Project-level (only that project):

```bash
mkdir -p .claude/skills && cp -r path/to/ui-ux-agent/skills/ui-ux .claude/skills/ui-ux
```

User-level (all your projects):

```bash
mkdir -p ~/.claude/skills && cp -r path/to/ui-ux-agent/skills/ui-ux ~/.claude/skills/ui-ux
```

Windows PowerShell equivalent:

```powershell
Copy-Item -Recurse path\to\ui-ux-agent\skills\ui-ux "$HOME\.claude\skills\ui-ux"
```

The skill is self-contained: every path inside it is relative to its own folder. It never depends
on this repository being present.

Optional: `scripts/render-check.mjs` uses Playwright **if your project already has it**; it never
installs anything. Without it, the skill uses whatever browser tool your Claude Code session has
(in-app browser, Chrome, Playwright MCP) or works in declared static mode.

### Use

Invoke explicitly or just ask — the skill also triggers from its description.

| Command | What happens | Edits code? |
|---|---|---|
| `/ui-ux audit [scope] [--focus …]` | Inspects (rendered when possible), gathers evidence, writes structured, prioritized findings to `.claude/ui-ux/audits/` | No |
| `/ui-ux design [brief or findings]` | Understands the product, proposes 2–3 genuinely different directions with an evaluation matrix, waits for your choice, writes a design contract | No |
| `/ui-ux improve [finding IDs / "critical" / contract]` | Plans changes mapped to findings, implements after approval (representative slice first), re-renders and re-audits | Yes |
| `/ui-ux review [diff / PR / report]` | Verifies each finding: fixed / partially / still open / regressed; finds regressions; checks contract conformance | No |

Lenses for audits (`--focus`, comma-separated): `ux`, `interaction`, `visual`, `responsive`, `a11y`,
`design-system`, `distinctiveness`, `ai`. The accessibility floor is checked in every audit.
Viewports default to 390×844, 768×1024 and 1440×900 (plus 320px reflow and 200% text when
relevant); override with `--viewports` or in the project context. `--static` forces code-only mode.

Examples:

```text
/ui-ux audit src/app/dashboard --focus responsive,a11y
/ui-ux audit --focus design-system
/ui-ux design "mobile-first meal logging flow for AppFit"
/ui-ux improve RESP-003 A11Y-001 RC-02
/ui-ux review
¿Esta pantalla de checkout está bien? ¿Parece genérica?
```

### What you get

- **Findings** with a fixed structure (`schemas/finding.schema.json`): stable ID, severity
  (critical/high/medium/low/opportunity), category, location (route, component, viewport, state),
  **evidence with its source** (BROWSER, INTERACTION, SCREENSHOT, CODE, TOOL, USER), interpretation,
  why it matters, recommendation, **verification criterion**, confidence (high/medium/low with
  caps — e.g. visual claims from code alone can't be high), basis (STANDARD, RESEARCH,
  DESIGN_PRINCIPLE, HEURISTIC, INFERENCE), reach, effort, root cause, status.
- **Reports** (`templates/audit-report.md`): verdict, coverage table (what was and wasn't
  inspected), dimension ratings 0–10 with confidence and coverage (no misleading overall score),
  top 5 actions with "ranked above X because", root-cause clusters, opportunities, distinctiveness
  assessment (counterfactual test), assumptions, re-audit log.
- **Design artifacts**: `design-directions.md` (A/B/C + matrix) and `design-contract.md`
  (product truth, visual direction, invariants, bounded freedoms, anti-goals, acceptance criteria).

### Project context

Project-specific facts live in the project, never in the skill:

```text
<project>/.claude/ui-ux/
├── project-context.md   # product, users, platform, flows, brand/design system, how to run, viewports
├── design-contract.md   # created by /ui-ux design
└── audits/              # reports (+ screenshots — consider .gitignore for images)
```

If `project-context.md` is missing, the skill infers what it can, asks a few questions and offers
to create it from `templates/project-context.md`. If you have a `DESIGN.md` or design tokens, the
skill treats them as the authority instead of duplicating them.

### Structure

```text
skills/ui-ux/
├── SKILL.md                 always loaded: mission, priorities, modes, gates, evidence rules, index
├── workflows/               audit.md · design.md · improve.md · review.md
├── references/              24 consolidated knowledge files, loaded on demand (each starts with
│                            quick rules / an audit checklist; details below)
├── templates/               project-context · audit-report · design-directions · design-contract
├── schemas/                 finding.schema.json
└── scripts/                 style-census.mjs (no deps) · render-check.mjs (optional Playwright)
```

Context strategy: `SKILL.md` (~170 lines) → one workflow → the four cross-cutting references
(evidence, inspection, states, severity) → only the lens/pattern references the task needs.
No RAG: an explicit "load X when Y" index plus progressive disclosure inside each file is enough.

### Philosophy

- Evidence first: observation → interpretation → recommendation, with source and confidence.
- Audit before modifying; design before implementing; verify rendered results before "done".
- Responsive is recomposition that preserves task, relationships, comparison and state.
- Design systems separate invariants from controlled freedom.
- Generic patterns are judged by pattern + context + purpose + execution, never by rule.
- Distinctiveness is tested (counterfactual, identity ablation, signatures), not asserted.

### Limitations

- **Read-only is enforced by instructions, not technically.** A skill cannot remove edit tools.
  For a hard guarantee, run audits in Claude Code's plan mode.
- Rendered evidence depends on available browser tooling; without it, confidence is capped and
  stated.
- Accessibility checks catch a lot but not everything: assistive-technology experience still
  needs human testing; the skill says when.
- The knowledge is synthesis with evidence boundaries — not universal laws. Fast-changing notes
  (browser support, tools) are dated.
- Agents tend to over-rate their own work; for big redesigns, run `review` in a fresh session.

### Extending the skill

- New knowledge → improve the existing reference that owns the topic (see the index in `SKILL.md`);
  keep the `Quick rules` / checklist section at the top; keep evidence boundaries.
- New lens → add a reference with a checklist and register it in `SKILL.md` and `workflows/audit.md`.
- New finding category → update `schemas/finding.schema.json` (ID prefix + category).
- Keep `SKILL.md` small; put detail in references.

### Updating the skill from the lab

See [`skill-dev/SYNC.md`](skill-dev/SYNC.md): baseline commit, which lab files feed which
reference, and the manual merge procedure. Regression scenarios for checking skill behaviour are
in [`skill-dev/EVALS.md`](skill-dev/EVALS.md).

---

## The knowledge lab

An evolving research base for AI agents that design and build digital products. Its north star:

> Increase the density, accuracy, freshness, and implementation value of the knowledge available to future AI agents.

It distinguishes **popular** from **good UX**, **trending** from **recommended**, and **visually
impressive** from **useful**.

```text
AGENTS.md                 research and curation protocol
KNOWLEDGE_SUMMARY.md      maturity scorecard (0–10) of the lab's knowledge
agent_context/            compressed principles and design playbook
knowledge/                topic files (one per researched question)
research/                 trends, frontier, sources, open questions
meta/                     learning state, changelog
automation/               scheduled research prompt
```

For research cycles, start with `AGENTS.md`, `meta/LEARNING_STATE.md`, and the relevant knowledge
files. The research process does not modify `skills/` — the skill is synced manually.

Git preserves history. Markdown should preserve the **best current understanding**, not every old version.
