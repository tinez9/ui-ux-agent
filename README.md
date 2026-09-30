# UI/UX Agent Knowledge Lab

An evolving knowledge base for AI agents that design and build digital products.

The repository is optimized for agents such as Claude Code, Codex, ChatGPT, and similar coding/design systems. Its goal is not to accumulate links or trends, but to continuously improve the quality of reusable knowledge about:

- product and interface design
- visual direction and art direction
- UX patterns
- interaction and motion
- AI-native UX
- design systems
- distinctive product features
- frontend implementation
- Claude/AI-agent frontend workflows
- anti-patterns and generic AI-generated UI

## North star

> Increase the density, accuracy, freshness, and implementation value of the knowledge available to future AI agents.

The repository must distinguish **popular** from **good UX**, **trending** from **recommended**, and **visually impressive** from **useful**.

## Structure

```text
.
├── AGENTS.md
├── agent_context/
│   ├── CORE.md
│   └── DESIGN_PLAYBOOK.md
├── knowledge/
│   ├── FOUNDATIONS.md
│   ├── VISUAL_DESIGN.md
│   ├── UX_PATTERNS.md
│   ├── INTERACTION_MOTION.md
│   ├── AI_NATIVE_UX.md
│   ├── DESIGN_SYSTEMS.md
│   ├── FEATURE_PATTERNS.md
│   ├── FRONTEND_IMPLEMENTATION.md
│   ├── CLAUDE_FRONTEND.md
│   └── ANTI_PATTERNS.md
├── research/
│   ├── TRENDS.md
│   ├── FRONTIER.md
│   ├── SOURCES.md
│   └── OPEN_QUESTIONS.md
├── meta/
│   ├── LEARNING_STATE.md
│   └── CHANGELOG.md
└── automation/
    └── RESEARCH_PROMPT.md
```

## How agents should use it

For normal product work, load `agent_context/CORE.md` and `agent_context/DESIGN_PLAYBOOK.md` first. Read deeper files from `knowledge/` only when relevant.

For research cycles, start with `AGENTS.md`, `meta/LEARNING_STATE.md`, and the relevant knowledge files. Update the knowledge base only when the new research materially improves it.

Git preserves history. Markdown should preserve the **best current understanding**, not every old version.
