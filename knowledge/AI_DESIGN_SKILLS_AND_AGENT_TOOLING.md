# AI Design Skills and Agent Tooling

Last reviewed: 2026-10-06

## Purpose

Evaluate design skills as executable design infrastructure, not prompt collections or popularity contests. Keep this file selective: promotion requires source inspection and clear marginal value.

## Evaluation model

Before recommending an install, inspect the canonical repository for:

1. **Decision value** — judgment versus style presets.
2. **Workflow leverage** — grounding, exploration, implementation, rendered review, iteration.
3. **Evidence/provenance** — standards, platform guidance, practitioner heuristics, or observable implementation.
4. **Progressive disclosure** — load only relevant guidance.
5. **Verification** — inspect rendered states rather than infer quality from source/build success.
6. **Compatibility** — explicit support for the target harness; syntactic portability is not behavioral equivalence.
7. **Operational cost** — dependencies, hooks, browsers, generated files, context and update burden.
8. **Security/supply chain** — inspect installers, scripts, hooks and package execution separately from Markdown instructions.
9. **Maintenance/freshness** — canonical upstream, license, `archived`, `pushed_at`, commits/releases.
10. **Marginal value** — prefer complementary capabilities over overlapping anti-slop packs.
11. **Behavioral evidence** — distinguish installation/trigger success, output quality, and causal uplift. A skill that reliably activates is not thereby proven to improve the result.

Stars are adoption signal, never evidence of design quality or user outcomes.

## Recommended candidates

### `pbakaus/impeccable` — direction, critique and refinement

**Status:** recommended candidate; active upstream and strong adoption signal as of 2026-10-05.

Provides a shared design vocabulary plus focused operations for auditing, polishing, simplifying, hierarchy, typography, color, responsiveness and motion, with deterministic detectors/hooks for recurring generated-UI problems.

**Best fit:** iterative visual refinement of existing or newly built interfaces. It changes the critique loop rather than merely asking an agent to “make it beautiful.”

**Boundary:** its anti-slop rules are opinionated heuristics, not universal prohibitions. Legitimate brand choices can intentionally violate them. Provider hooks increase trust surface and should be inspected.

**License:** Apache-2.0.

### `nextlevelbuilder/ui-ux-pro-max-skill` — retrieval and stack guidance

**Status:** recommended candidate, especially as a knowledge/retrieval layer.

Uses searchable local data for styles, product reasoning, palettes, typography, UX, icons, charts, motion and stack-specific implementation. Current upstream supports Claude Code, Codex and other agent environments. v2.15.0 reports relevance evaluation, provenance/freshness metadata, framework routing, abstention, semantic validators and automated tests; these retrieval-quality mechanisms matter more than catalog size.

**Best fit:** early grounding, design-system exploration, broad UX checks and stack questions.

**Boundary:** retrieved palettes/category rules are candidates, not evidence of preference. Broad catalogs can create false authority and category stereotypes. Fast-changing stack advice needs freshness checks; CLI/generated assets expand maintenance and supply-chain surface.

**License:** MIT.

### `emilkowalski/skills` — specialist motion and design engineering

**Status:** recommended specialist complement, not a general UX replacement.

Focused skills cover animation creation/review, interaction craft, design engineering, prototyping, mobile-native web details and adversarial UI breaking.

**Best fit:** motion, micro-interactions, direct manipulation and post-build craft. Narrow loading gives useful progressive disclosure.

**Boundary:** duration/easing/spring rules are practitioner heuristics; accessibility, product motion language, platform conventions and brand requirements can override defaults.

**License:** MIT.

### `daymade/claude-code-skills/frontend-visual-qa` — rendered verification

**Status:** recommended candidate for Claude Code when post-implementation verification is the missing capability.

Its strongest idea is falsifiable evidence: build success, DOM presence and uninspected screenshots are supporting signals, not visual proof. It defines target identity, state, viewport, journeys, reference/pass condition and then inspects the actual rendered artifact. It distinguishes visible browser/native evidence, browser/E2E geometry and interaction evidence, headless mechanical sweeps, and source/build reasoning.

**Best fit:** responsive defects, overflow/wrapping, conditional states, charts, browser output, reference parity and release-oriented visual review after a design/refinement skill has acted.

**Boundary:** currently Claude-oriented; do not infer Codex parity from Markdown readability. Browser/native tooling increases operational and trust surface. Visual QA cannot certify unexercised functional correctness, domain facts or user preference.

**License/maintenance:** parent repo MIT, unarchived and pushed 2026-10-05 when inspected.

## Promising but not yet recommended

### `Syo-M/codex-frontend-skills` — Codex-native orchestration plus unusually explicit evaluation

**Status:** high-value research reference and promising Codex-specific candidate; not promoted to the default stack yet because maintenance/adoption and causal-uplift evidence are still weak.

This repository is materially more interesting than a Claude skill copied into `~/.codex/skills`: it treats Codex as a runtime with skills, custom-agent delegation, profiles, installation/verification logic and an evaluation harness. That makes it useful evidence for what **Codex-native** design tooling can exploit beyond portable `SKILL.md` prose.

**Evidence inspected 2026-10-05:** canonical GitHub metadata shows MIT, unarchived, 0 stars / 0 forks, created 2026-07-13 and last pushed **2026-07-15**. Low adoption and nearly three months without a push prevent a maintenance-based recommendation despite the repository's unusually rigorous internal evidence.

Its `EVALUATION.md` is stronger than typical skill marketing. For v2.0.0 it records a model-pinned Codex CLI 0.144.1 series using `gpt-5.6-terra`: **90/90 valid PASS runs across 30 prompts**, **9/9 over-trigger negatives clean**, and **21/21 expected custom-agent delegations initiated and completed**. A separate targeted regression reports **18/18 PASS**. A blinded review of 10 retained outputs reports 10/10 PASS and 92.7% across its applicable rubric. These are useful operational signals because reports and validators are retained rather than only showing curated screenshots.

**Crucial boundary:** the repository itself correctly labels **harness causal uplift as NOT CONFIGURED**. It has not run the same-model, same-prompt, same-fixture paired comparison with and without the skills. Therefore 90/90 activation/task success does **not** establish that the skill pack caused better design. The blinded review shows acceptable retained outputs, not improvement over baseline. Preserve this distinction when evaluating every skill.

**Model-specific finding:** its recorded comparison found `gpt-5.6-terra` completed expected custom-agent delegation while `gpt-5.4-mini` passed the same task contracts without delegating. This is direct evidence that a workflow depending on Codex custom-agent behavior can be **model-sensitive even when final task contracts pass**. Do not infer runtime equivalence from compatible skill syntax.

**Best fit:** study or trial when Codex-specific delegation, profiles, trigger discipline and reproducible evaluation matter. Its evaluation architecture is worth borrowing even if the skill pack itself is not installed.

**Do not infer:** independent certification, broad framework coverage, cross-model equivalence, user preference, or causal improvement from the current reports.

**Promotion gate:** refresh canonical maintenance state; inspect current skill/agent executable surfaces and installer; then run a paired baseline-vs-pack visual benchmark on representative projects. A positive blinded causal comparison would be substantially stronger evidence than another activation series.

### `wenkang-deepblue/frontend-design` — human-in-the-loop visual decision sandbox

**Status:** promising workflow reference; do not promote to the default install stack yet.

This skill addresses a different problem from critique or QA: translating visual preference into structured implementation instructions. It reads the real project's routes, components and tokens, generates a self-contained local HTML preview, exposes project-specific token controls, supports direct text edits and DevTools-style element comments, then exports decisions as Markdown for the coding agent to apply. Separate packages explicitly target Claude Code and Codex.

**Why the mechanism is interesting:** it replaces vague feedback such as “make this tighter” with explicit choices and element-scoped annotations. The inspected `SKILL.md` also contains an unusually useful anti-anchoring rule: understand and design from the real project *before* reading the provided template, and treat the template as interaction scaffolding rather than a visual source. This directly attacks template leakage and text-substitution behavior in coding agents.

**Operational strengths:** the skill preview itself is local and self-contained: inline CSS/vanilla JS, no build step, CDN, remote fonts, analytics or backend. It can open through `file://`, so the executable surface is materially smaller than browser automation or an external design service. The Markdown export creates an auditable human→agent handoff rather than silently mutating production code.

**Important boundary:** this is a **decision sandbox**, not rendered verification of the real application. The preview is a reconstruction generated by the agent; it can diverge from actual browser layout, application state, responsive behavior or framework semantics. Use real rendered QA after applying decisions. It also does not supply design judgment by itself: weak alternatives still produce weak choices.

**Freshness/adoption caution:** canonical GitHub metadata inspected 2026-10-05 shows MIT, unarchived, 5 stars / 1 fork, but last push **2026-07-03**. The README has evolved into promoting a newer FrontCap Chrome-extension workflow, while the open-source skill remains available. That split raises a maintenance question: useful architecture, but insufficient current activity/adoption to classify as a validated default install.

**Best fit:** a user wants to tune tokens/copy and annotate a proposed UI visually before asking Claude/Codex to change the real code. It is especially complementary to a later rendered-QA pass.

**Do not use as:** proof of implementation parity, accessibility verification, automated regression, or a substitute for product/design judgment.

### `danieloleary/design-md-for-codex` — thin DESIGN.md consumption habit

**Status:** useful architecture reference; not a default install recommendation.

Direct source inspection on 2026-10-06 shows a deliberately small Codex skill whose main behavior is to locate a repository `DESIGN.md`, read it before UI work, treat YAML token values as normative, preserve existing project components/tokens, and verify changed UI at desktop/mobile widths. This is materially different from a design-judgment pack: it is a **context-consumption policy** that tries to make persistent design memory reliably enter the agent loop.

The important development is upstream rather than this wrapper. Google's `google-labs-code/design.md` is now an open, agent-oriented DESIGN.md specification and CLI. The format combines machine-readable token front matter with explanatory Markdown; the official tool can lint, diff and export to Tailwind and DTCG. As of this review the format is explicitly **alpha**, so it should be treated as emerging infrastructure rather than a settled design-system standard.

**Why the mechanism matters:** persistent design memory and design judgment are separate capabilities. A strong critique skill cannot obey product-specific constraints it never reads; conversely a perfectly consumed `DESIGN.md` can encode mediocre design. A thin “read the local contract first” skill can therefore complement Impeccable/UI-UX guidance without competing with them.

**Important correction to the wrapper's apparent simplicity:** its validation step runs `npx @google/design.md lint DESIGN.md` when Node/npm are available. That executes a registry package and is a different trust surface from merely reading Markdown. For autonomous agents, prefer a pinned/installed official CLI or explicitly approved execution policy rather than treating ad-hoc `npx` as zero-risk. The skill itself is MIT and has no substantial runtime of its own.

**Freshness/adoption caution:** canonical repository metadata inspected 2026-10-06 shows MIT, unarchived, only **1 star / 0 forks**, created 2026-05-09 and last pushed **2026-05-12**. `updated_at` was 2026-10-05, but that does not establish code maintenance. The wrapper therefore has weak maintenance/adoption evidence even though the underlying Google format is active.

**Design-system boundary:** do not let `DESIGN.md` become a second unsynchronized source of truth beside production tokens/components. If both exist, define authority and generate/validate one against the other where possible. A memory file that silently drifts from implementation can increase agent confidence while reducing fidelity.

**Best fit:** Codex projects that already maintain a deliberate `DESIGN.md` and need a lightweight trigger ensuring it is read before frontend edits.

**Do not use as:** a substitute for design-system governance, visual QA, accessibility testing, design critique, or evidence that DESIGN.md itself improves output quality.

**Promotion gate:** first test whether Codex already consumes the project's design contract reliably through existing project instructions. If it does, this wrapper adds little. If it does not, compare baseline vs wrapper on repeated UI edits and measure contract violations, invented tokens/components and rendered regressions. Reassess when the upstream DESIGN.md format leaves alpha or the wrapper resumes substantive maintenance.

## Rendered verification: separate the jobs

1. **Visual regression:** did an approved baseline change unintentionally?
2. **Reference parity:** does implementation match a specified design/reference?
3. **Rendered visual QA:** does the real state exhibit responsive, visual or journey defects?
4. **Design critique:** is the direction itself appropriate, coherent, distinctive and usable?
5. **Visual decision sandbox:** can a human cheaply express token, copy and element-level preferences before implementation?
6. **Persistent design memory:** did the agent actually consume the project's declared visual contract before editing?

Pixel similarity is not UX quality. A perfect reproduction can preserve a bad design; an intentional improvement can correctly fail regression. A sandbox preview is not evidence that the real application renders equivalently. Contract consumption is not evidence that the contract is good or current.

### `Krowli/visual-parity` — useful mechanism, not a current install recommendation

**Source-inspection correction (2026-10-05):** discovery results made this look like a fresh cross-LLM candidate, but direct GitHub metadata shows the repository was created and last pushed on **2026-06-26**, has **0 stars / 0 forks**, is unarchived, and is MIT licensed. Search recency was therefore misleading.

The implementation is compact and inspectable: `SKILL.md`, shell scripts, temporary Vite/React harness templates and reference docs. It explicitly targets Claude Code, Codex, Gemini CLI or any agent able to run shell and view images. `render.sh` starts an isolated Vite server on a dedicated port, locates a Chromium-family browser and captures PNGs for selected theme/viewport; cleanup is separated to avoid broad process killing.

**Important precision:** despite README wording such as “pixel by pixel,” the inspected `SKILL.md`/render script does **not** implement an automated pixel-diff metric. The core loop is render → open/view PNG → agent visually compares against a reference → fix → re-render. Treat it as a screenshot-assisted reference-parity harness, not a deterministic image-diff engine.

**Strengths:** small surface, explicit theme checks, dedicated port, temporary harness discipline, no requirement for a proprietary service, and a workflow that forces the agent to actually view pixels.

**Limits:** strongest path assumes Vite/React component isolation; deep Electron/Tauri/native states are explicitly out of scope. `npx vite` and shell/browser execution enlarge the trust surface. Cross-LLM support is architecturally plausible because the mechanism is shell + image viewing, but equivalent behavior has not been benchmarked here. Stale maintenance and zero adoption signal make broad installation hard to justify while better-maintained verification options exist.

**Decision:** keep as an implementation reference/experimental fallback, **not** promoted to the recommended stack. Reconsider only if maintenance resumes or direct comparative testing shows unique value.

Other categories remain worth separating:

- `maxrihter/claude-skill-visual-regression`: baseline screenshot regression; promising concept, not design-quality judgment.
- `Huc91/pixel-perfect-skill`: reference parity; inspect further before recommendation.
- broad UAT/audit skills: useful only if their journey/accessibility claims survive source inspection.
- screenshot design-review skills: can overlap heavily with Impeccable unless they add real rendered-state evidence.

## 2026-10-06 platform correction: Codex skills are moving under Plugins

OpenAI's canonical `openai/skills` repository now marks itself **deprecated** and directs current Codex skill/plugin examples to `openai/plugins` plus the Codex “Build plugins” documentation. Treat old `openai/skills` install/catalog instructions as historical even when search results surface them prominently. This is a concrete freshness failure mode: a highly starred official repository can still be the wrong current distribution path.

The deprecated repository's current `skill-creator` remains useful as design evidence for skill architecture, not distribution authority. It makes three durable distinctions worth applying when evaluating design skills:

- **trigger metadata is part of the product:** Codex decides whether to consider a skill from its name/description before loading the body, so trigger quality and false-positive/false-negative behavior deserve evaluation separately from content quality;
- **progressive disclosure is architectural:** keep core procedure in `SKILL.md`, load detailed references only when needed, and use deterministic scripts for fragile/repeated mechanics rather than bloating always-loaded prose;
- **degrees of freedom should match fragility:** subjective art direction benefits from high-freedom guidance, while repeatable audits, token validation, screenshot capture and other failure-prone mechanics benefit from constrained scripts/checklists.

This sharpens the evaluation model: a large design “mega-skill” is not automatically more capable. If it loads broad palettes, stacks, accessibility rules and animation guidance for every frontend request, its context cost and conflicting priors may outweigh retrieval value. Conversely, splitting every heuristic into a skill can create trigger competition and orchestration overhead. Evaluate **trigger precision, conditional context loaded, deterministic mechanics, and overlap** in addition to raw content.

Anthropic's current official `frontend-design` skill illustrates the high-freedom side well: it is short, brief-specific, asks for a design plan and self-critique, and explicitly frames its anti-generic tells as defaults that remain legitimate when the brief calls for them. UI/UX Pro Max illustrates the opposite retrieval-heavy architecture: searchable local datasets, explicit domains/stacks and persistent design-system output. They are therefore not interchangeable. The former primarily changes aesthetic judgment; the latter supplies indexed reference candidates and implementation checks. Composing them is plausible only if the retrieval layer does not silently override the product brief or the direction layer.

**Operational consequence for Codex evaluations:** record the current plugin/skill packaging and invocation path as part of the benchmark. A candidate can have excellent design doctrine yet fail in practice because its trigger, packaging or runtime integration is stale.

## Composition strategy

Do not maximize skill count. A plausible, non-exclusive architecture is:

- **persistent product design contract:** `DESIGN.md` or equivalent, with explicit authority and drift checks;
- **knowledge/retrieval:** UI/UX Pro Max;
- **direction/refinement:** Impeccable;
- **specialist craft:** selected Emil skills when needed;
- **human visual decisions:** a sandbox such as `wenkang-deepblue/frontend-design` only when visual round-trip feedback materially helps;
- **rendered verification:** `frontend-visual-qa` in Claude Code, or another validated target-specific verifier;
- **Codex orchestration/evaluation:** treat native delegation/profile harnesses as a separate layer, not as evidence that their design doctrine is superior.

This is a workflow hypothesis, not a proven ranking. Install only layers with marginal value for the project. A wrapper whose only job is “read DESIGN.md” is redundant when project-level instructions already enforce that behavior reliably.

## Installation decision gate

Before adding a skill:

1. inspect `SKILL.md`, references, scripts, manifests, hooks and installers;
2. identify the capability not already covered;
3. prefer project-scoped evaluation;
4. pin/record version or commit where practical;
5. run the same representative task with and without it;
6. compare rendered desktop/mobile states, accessibility, task correctness, originality, complexity and churn;
7. separately record **activation**, **output quality**, and **causal uplift**; never substitute one for another;
8. retain only if marginal improvement outweighs conflict, context and maintenance cost.

## Freshness policy: search recency is not repository recency

Search indexes can recrawl old repositories. Promotion requires canonical metadata: `archived`, `pushed_at`, commit/release history, license, executable surface and README-to-files consistency. `updated_at` is weak because metadata can change without meaningful development.

Useful negative evidence already found:

- `billhector/design-skills`: archived; last push 2026-04-10; interesting extraction/audit ideas but not a current install recommendation.
- `vmarafetti/crit`: useful six-lens audit taxonomy; last push 2026-06-01 and small adoption signal; study ideas, do not promote yet.
- `wonjyou/design-audit`: last push 2026-03-28 and no repository license exposed; do not recommend.
- `fol2/claude-design`: activity ended 2026-04-25, no declared license/adoption signal; discovery candidate only.
- `Krowli/visual-parity`: last push 2026-06-26 despite fresh search surfacing; useful compact harness, but stale/unadopted and not an automated pixel-diff engine.
- `danieloleary/design-md-for-codex`: thin and inspectable but last substantive push 2026-05-12 with 1 star / 0 forks; underlying DESIGN.md format is more important than the wrapper.

Negative evidence should remain recorded so future cycles do not repeatedly rediscover and over-promote fresh-looking results.

## Candidates for focused investigation

Current search surfaced potentially relevant candidates including `MaxHan7/frontend-ui-standards-skill` (design-system-first Codex implementation), `Enixes/astra-frontend-design` (evaluation-oriented Codex/Astra frontend workflow), `superdesigndev/superdesign-skill` (design workflow plus external CLI/service), and `dobromirdikov/codex-frontend-design-skill`. None should be promoted from README claims alone. Inspect provenance, executable/service dependencies, maintenance, licensing, overlap and actual marginal workflow value first.

## Open evidence gap

Evidence is much stronger for **what skills contain** than for **how much they improve output**. Build a repeatable benchmark: identical brief + starter repo + baseline agent versus one skill versus composed skills, then blind/rubric rendered evaluation. For Codex-native harnesses, preserve model/version and delegation behavior because syntactic compatibility does not imply behavioral equivalence. For verification skills, seed known responsive/state/visual defects and measure detection, false positives, missed states, time/context cost and whether captured evidence is actually opened and reasoned about. For decision sandboxes, measure whether structured visual feedback reduces clarification turns and implementation churn without increasing divergence from the real app. For persistent design-memory wrappers, measure whether they reduce contract violations beyond what ordinary project instructions already achieve. Popularity, activation rates and attractive before/after examples are weak proxies for causal value.
