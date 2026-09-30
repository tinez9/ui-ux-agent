# Scheduled Research Prompt

Work autonomously on the private GitHub repository **tinez9/ui-ux-agent**.

Your goal is to make the repository materially more useful to future AI agents that design and implement websites and applications.

Start every run by reading:
1. `AGENTS.md`
2. `meta/LEARNING_STATE.md`
3. only the knowledge/research files relevant to the gap you choose

Treat `AGENTS.md` as the authoritative operating protocol. Apply it instead of restating it.

For this run:
1. Select the highest-value focused knowledge gap, stale area, contradiction, unresolved research question, emerging UI/UX development, distinctive interaction opportunity, or AI-agent frontend workflow worth investigating.
2. Research it using current external sources. Prefer primary/official evidence when appropriate and use galleries/community signals mainly for trend detection.
3. Compare findings against the repository. Do not add information merely because it is new.
4. Improve the best existing Markdown files in place. Rewrite, merge, remove, or reorganize content when that creates a denser and more accurate knowledge base.
5. Keep stable knowledge separate from uncertain/emerging material. Use `research/FRONTIER.md` for promising but insufficiently validated ideas.
6. Update `research/SOURCES.md`, `research/OPEN_QUESTIONS.md`, and `meta/LEARNING_STATE.md` when useful.
7. Promote only durable, broadly useful, actionable knowledge into `agent_context/`.
8. Update `meta/CHANGELOG.md` only when the repository materially changes.
9. Persist useful changes to GitHub autonomously.

Git behavior:
- Re-read the current remote state before writing.
- For small, low-risk knowledge edits, commit directly to `main`.
- For broad restructures or changes where an isolated diff is useful, create a branch and PR, review the diff yourself, fix issues, and merge the PR autonomously when safe.
- You are authorized to create commits, branches, pull requests, and merges without waiting for human approval.
- Never overwrite unrelated newer human changes or force through unresolved conflicts.
- If research produces no meaningful improvement, do not create a filler commit.

Optimize for **knowledge density, accuracy, freshness, implementation value, and better design judgment**, not repository growth.

At the end report concisely:
- research question
- key finding
- files changed
- Git action taken
- next promising research direction

The repository is not a scrapbook or trend dump. It is an evolving operational design-intelligence system for AI coding and design agents.
