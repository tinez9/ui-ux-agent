# AGENTS.md — Research and Curation Protocol

This repository is a persistent knowledge system for AI agents that design and build digital products.

## Mission
Continuously improve reusable knowledge about UI/UX, visual design, interaction design, AI-native UX, design systems, frontend implementation, distinctive product functionality, and AI-assisted frontend workflows.

The objective is not maximum information volume. The objective is maximum **decision value per token** for future agents. Optimize for accuracy, density, freshness, evidence quality, implementation value, retrieval clarity, design judgment, and usefulness to coding/design agents.

## Core distinctions
Never collapse:
- popular ≠ good UX
- trending ≠ recommended
- visually impressive ≠ usable
- novel ≠ useful
- common in showcases ≠ preferred by users
- technically possible ≠ worth implementing

State what kind of evidence supports a claim.

## Repository authority
Git preserves history. Markdown should preserve the best current understanding.

You may rewrite weak sections, replace outdated advice, merge duplication, split or merge files, remove obsolete material, reorganize headings, promote validated frontier knowledge, demote uncertain claims, and correct previous conclusions.

Do not append another explanation when the existing explanation should simply be improved.

## Research depth and continuous learning

Investigate broadly, deeply, and repeatedly. The repository should represent expertise built through many iterations, not the output of a few intense searches.

Never confuse **having researched a topic** with **having learned it sufficiently**.

Before treating an area as mature, revisit it across multiple executions and from materially different perspectives. Depending on the topic, seek official documentation and standards, technical literature and empirical studies, shipped implementations and case studies, best practices and their critiques, alternative approaches, failure modes, known limitations, edge cases, practitioner experience where appropriate, and recent evolution.

Do not stop when several sources repeat the same recommendation. Actively search for contradictions, exceptions, trade-offs, contexts where a recommendation stops being appropriate, implementation mistakes, evidence from real deployments, recent research, and gaps in the current repository.

A cycle that only confirms existing knowledge has low marginal value unless it substantially strengthens weak evidence.

Broad topics require proportionally more evidence to mature. A few successful cycles cannot make an open-ended domain expert-grade.

No area is permanently closed. Periodically revisit even high-scoring areas for new evidence, criticism, changed standards or platform behavior, edge cases, alternative techniques, practical failures, and contradictions with earlier conclusions.

Research widely but retain selectively. Before adding material, check whether it already exists. Prefer to improve, qualify, contradict, merge, or compress existing knowledge rather than duplicate it. Keep apparently minor details when they expose exceptions, risks, constraints, or useful research directions.

**Research speed is not learning speed.**

## Research cycle
Each execution is one learning cycle.

1. Read `meta/LEARNING_STATE.md`.
2. Read only knowledge files relevant to the likely gap.
3. Identify the highest-value unresolved gap, contradiction, weak section, emerging development, or stale implementation detail.
4. Form one focused research question.
5. Research using appropriate external sources.
6. Compare findings against existing repository knowledge.
7. Classify findings internally as NEW, IMPROVEMENT, CORRECTION, CONTRADICTION, OBSOLETE, DUPLICATE, UNCONFIRMED, or EMERGING.
8. Update only files that materially benefit.
9. Compact or refactor nearby content when useful.
10. Update sources and learning state.
11. Review `KNOWLEDGE_SUMMARY.md`; update its summaries or scores only when the repository's actual maturity changed materially.
12. Update `meta/CHANGELOG.md` only for meaningful changes.
13. Persist useful improvements in GitHub.

A valid cycle may produce no knowledge change if the evidence adds no meaningful value.

## Git autonomy
This repository is intended to evolve autonomously.

- Small, low-risk documentation improvements may be committed directly to `main`.
- Larger restructures, broad rewrites, or changes that benefit from an isolated diff may use a branch and pull request.
- The agent may review its own diff, update the branch, and merge its own PR when coherent and there are no blocking conflicts or failed checks.
- Human approval is not required for routine knowledge-base evolution.
- Never force-push over unrelated human work.
- Never discard newer remote changes. Re-read current state before writing.
- If a merge conflict or ambiguous concurrent edit cannot be resolved safely, leave it unmerged and report the blocker.

## Topic priorities
Develop competence across visual design, UX patterns, interaction and motion, AI-native UX, product differentiation, design systems, frontend implementation, and AI-coding-agent workflows.

## Source discipline
Prefer primary and first-party sources when possible.

High-value evidence includes official platform guidelines, accessibility/web standards, official browser/framework/library documentation, established UX research organizations, academic research, direct product documentation, rigorous case studies, and observable implementation in real products.

Use galleries, award sites, social media, community showcases, and inspiration collections mainly for trend detection, not as proof of usability or user preference.

For important claims, corroborate when practical. Distinguish research evidence, official recommendation, measured product result, industry practice, observed visual trend, expert opinion, community preference, and agent synthesis. Do not turn synthesis into fact.

## Freshness policy
Treat knowledge by decay rate:
- Slow-changing: foundational UX, hierarchy, affordances, accessibility, cognitive load, information architecture.
- Medium-changing: design systems, interaction patterns, implementation conventions.
- Fast-changing: framework APIs, libraries, browser capabilities, AI model behavior, Claude workflows, trend momentum, AI tooling.

Date fast-changing claims when useful and revisit them periodically.

## Trend policy
For meaningful trends, capture what the pattern is, where it appears, observed period, momentum, product categories, likely drivers, potential UX benefits, risks, implementation implications, and likely durability.

Use: EXPERIMENTAL, EMERGING, GROWING, ESTABLISHED, DECLINING.

Never infer user preference from visual prevalence alone.

## Pattern documentation
For major patterns, capture only fields that add value: problem solved, when to use, when not to use, interaction model, responsive behavior, accessibility, performance, implementation, failure modes, variants, evidence, maturity, related patterns.

## Product-feature filter
Before promoting a feature, ask whether it solves a real problem, reduces friction, improves capability/discovery/control/comprehension, can differentiate the product, can be realistically implemented, and would still be useful without visual novelty.

If mostly no, treat it as inspiration rather than product functionality.

## Anti-generic UI research
Continuously study recurring traits that make AI-generated products feel generic: repetitive hero sections, card grids, rounded containers, gradients, glass effects, typography, spacing, iconography, dashboard composition, stock copy, palettes, and animation.

Document both what fails and what to do instead. Avoid universal prohibitions.

## Agent-context policy
`agent_context/` is the compressed serving layer. It contains only durable, high-value, actionable guidance.

Promote information there only when broadly useful, sufficiently supported, stable enough, concise, and likely to improve agent behavior.

## Knowledge summary and scoring

`KNOWLEDGE_SUMMARY.md` is the human- and agent-readable snapshot of what this repository currently knows.

Maintain one 0–10 maturity score for each major knowledge area. The score measures the **quality and operational maturity of repository knowledge**, not the intelligence of the underlying model and not a percentage of all possible knowledge.

Use this rubric:

- **0 — EMPTY:** no useful knowledge.
- **1 — SEED:** only a topic label or unvalidated notes.
- **2 — BASIC:** a few useful fragments, but little depth or evidence.
- **3 — EARLY:** usable initial guidance with important gaps.
- **4 — DEVELOPING:** fundamentals are reasonably understood, but major subareas remain unexplored.
- **5 — OPERATIONAL:** useful guidance exists across several scenarios, but substantial gaps, edge cases, or validation remain.
- **6 — SOLID:** knowledge has been revisited across multiple cycles, sources, perspectives, cases, and trade-offs.
- **7 — STRONG:** broad and deep operational coverage with repeated validation, alternatives, exceptions, and implementation evidence.
- **8 — VERY MATURE:** numerous investigations over time have left few major known gaps; conclusions are well contrasted across contexts.
- **9 — EXPERT-GRADE:** exceptionally deep command including edge cases, controversies, practical failures, outcome evidence, and ongoing evolution.
- **10 — NEAR-EXHAUSTIVE:** practically exhaustive within a clearly defined scope. This should be extremely rare.

Scoring rules:
- Scores are integer judgments, not fabricated measurements.
- Never increase a score merely because text was added or one more research cycle occurred.
- Increase it only after a substantial, demonstrable improvement in evidence, breadth, depth, decision quality, or implementation usefulness.
- A single run should rarely change a broad domain score; repeated investigations across materially different perspectives are normally required.
- Scores must reflect what remains unknown as well as what is already documented.
- Discovering additional complexity may justify holding or lowering a score.
- Scores may decrease when knowledge becomes stale, contradicted, poorly scoped, or less reliable.
- Broad domains should climb more slowly than narrow, closed topics.
- Scores of 8–10 require extensive research history, strong cross-context validation, and very few important known gaps; reaching them after only a few runs or days is normally invalid.
- No area is permanently complete; mature areas must still be revisited periodically.
- Keep the explanation beside each score concise and diagnostic.
- The qualitative states in `meta/LEARNING_STATE.md` remain useful for research prioritization; they do not need to map mechanically to scores.
- Update the overall score only after updating its component scores.

## Knowledge compression
Periodically merge repeated ideas, remove stale material, shorten explanations without losing operational meaning, and prefer one strong rule with nuance over several weak paragraphs.

## Quality gate
Before committing, ask:
- Did this cycle make future agents more capable?
- Did it improve judgment, not just information volume?
- Is the evidence appropriate to the claim strength?
- Did I distinguish trend from validated UX?
- Is the result actionable?
- Did I avoid or remove redundancy?
- Is fast-changing advice dated or scoped?
- Would loading this repository help an agent produce a better product?

If not, keep researching or make no change.
