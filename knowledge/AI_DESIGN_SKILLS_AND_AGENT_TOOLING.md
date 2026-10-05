# AI Design Skills and Agent Tooling

Last reviewed: 2026-10-05

## Purpose

Design skills for coding agents should be evaluated as executable design infrastructure, not as prompt collections or popularity contests. A useful skill changes agent decisions, exposes a repeatable workflow, survives real project constraints, and can be audited when its guidance is wrong.

This file is deliberately selective. It is not a directory of every design skill on GitHub.

## Evaluation model

Before recommending an install, inspect the source repository and ask:

1. **Decision value** — does it improve design judgment, or mostly provide style presets?
2. **Workflow leverage** — does it change the loop (grounding, exploration, implementation, rendered review, iteration), not merely add prose?
3. **Evidence/provenance** — are rules attributable to standards, platform guidance, practitioner expertise, or observable implementation? Are opinionated rules presented as opinion rather than universal fact?
4. **Progressive disclosure** — can the agent load only relevant guidance instead of injecting a giant design manual into every task?
5. **Verification** — does it inspect rendered output, states, responsive behavior, accessibility, or motion rather than declaring success from source code?
6. **Compatibility** — is the install mechanism explicit for the intended harness? A Claude skill being syntactically portable does not prove equivalent behavior in Codex, Cursor, or another agent.
7. **Operational cost** — dependencies, hooks, browser installs, context use, generated files, update burden, and conflicts with existing project rules.
8. **Security/supply chain** — distinguish instruction-only skills from packages that execute installers, hooks, shell scripts, browsers, or other code. Inspect executable surfaces before adoption.
9. **Maintenance/freshness** — active upstream, clear license, source-of-truth repository, and no unexplained fork when upstream is available.
10. **Marginal value** — prefer complementary capabilities over installing several overlapping anti-slop/style skills whose rules may conflict.

GitHub stars are only an adoption signal. They are not evidence that a skill improves user outcomes or design quality.

## Initial high-confidence shortlist

### `pbakaus/impeccable` — broad design refinement and anti-generic workflow

**Status:** recommended candidate; high adoption and active upstream as of 2026-10-05.

**What is distinctive:** Impeccable provides a shared design vocabulary and a family of focused commands around auditing, critique, polishing, simplifying, motion, responsiveness, hierarchy, typography, color, and related refinement. Current upstream also ships deterministic detectors/hooks for recurring generated-UI problems and provider-specific installation support.

**Best fit:** an existing or newly built frontend that needs repeated visual critique/refinement rather than a one-shot style prompt. Its vocabulary is useful because humans can request a design operation (`audit`, `polish`, `quieter`, etc.) instead of describing every CSS symptom.

**Why it is stronger than a generic prompt:** it combines design references, task-specific commands, anti-pattern detection, and an iteration model. This changes the agent workflow rather than merely telling it to “make the UI beautiful.”

**Risks / boundaries:** many rules are intentionally opinionated. Anti-slop detectors can become cargo cult if treated as universal prohibitions; a legitimate brand may intentionally use a pattern the detector dislikes. Installation can add provider-native hooks, so teams must review hook definitions and trust changes instead of treating the package as inert Markdown. Do not install random mirrors when the canonical `pbakaus/impeccable` upstream is available.

**License:** Apache-2.0.

**Observed repository signal (2026-10-05):** canonical repo active the same day, ~76.6k stars and ~4.6k forks. Adoption is supporting context, not quality proof.

### `nextlevelbuilder/ui-ux-pro-max-skill` — searchable design knowledge and stack-specific guidance

**Status:** recommended candidate; especially useful as a retrieval layer.

**What is distinctive:** instead of relying only on a long prompt, UI/UX Pro Max uses local searchable data covering styles, product reasoning/palettes, typography, UX guidance, icons, charts, motion presets, and stack-specific implementation guidance. The current project supports many agent environments including Claude Code and Codex and has explicit platform templates.

**Best fit:** early design-system generation, product/category grounding, broad UX checks, and implementation questions spanning multiple stacks. It complements a critique/refinement skill better than another purely aesthetic ruleset would.

**Important improvement in current upstream:** v2.15.0 reports relevance evaluation, provenance/freshness metadata, legacy-vs-current framework routing, abstention, semantic validators, and substantial automated tests. These mechanisms are more important than raw catalog size because retrieval quality and provenance are common failure modes in large rule databases.

**Risks / boundaries:** catalog breadth can create false authority. A palette, style, or industry rule returned by search is a candidate, not evidence that users prefer it. Product-type mappings can stereotype categories and reduce originality if applied mechanically. Stack guidance decays faster than foundational UX guidance and needs freshness checks. The CLI and generated assets add a larger maintenance/supply-chain surface than a single Markdown skill.

**License:** MIT.

**Observed repository signal (2026-10-05):** active upstream, ~133k stars and ~14.1k forks; recent releases include explicit retrieval/provenance/test work.

### `emilkowalski/skills` — specialist design-engineering and motion craft

**Status:** recommended specialist complement, not a general UX replacement.

**What is distinctive:** a first-party skill collection from design engineer Emil Kowalski, with focused skills for design engineering, animation creation/review/improvement, animation vocabulary, Apple-inspired interaction principles, UI-library selection, prototyping, mobile-native web details, and adversarial UI breaking.

**Best fit:** motion, interaction polish, direct manipulation, micro-interactions, mobile-web feel, and post-build craft review. The narrow skills make it possible to load specialist judgment only when needed.

**Why it adds marginal value beside Impeccable/UI-UX Pro Max:** its strongest material is domain expertise in animation and design engineering rather than another general style catalog. Skills such as `find-animation-opportunities` are also valuable because they can recommend *not* animating something, reducing the common agent failure of adding motion merely because a motion skill is present.

**Risks / boundaries:** practitioner rules about durations, easing, springs, and visual craft are expert heuristics, not universal empirical laws. Product motion language, accessibility constraints, platform conventions, and brand requirements can override defaults. Do not install derivative “Emil-inspired” packs merely to duplicate the canonical source unless they add a clearly audited capability.

**License:** MIT.

**Observed repository signal (2026-10-05):** canonical repo updated 2026-10-02, ~43.5k stars and ~2.5k forks.

### `daymade/claude-code-skills/frontend-visual-qa` — rendered verification and falsifiable visual QA

**Status:** recommended candidate for Claude Code when the missing capability is post-implementation verification rather than more design advice.

**What is distinctive:** this skill explicitly treats build success, DOM presence, and uninspected screenshot files as insufficient visual proof. It establishes an audit contract (artifact, actor/job, exact target identity, state, viewport matrix, journeys, source of truth, authorization and pass condition), then selects an evidence level and inspects the rendered artifact. Its scope includes core visual quality, responsive behavior, state/journey coverage, browser output, native shells, reference parity and data visualization. It defaults to audit-only and separates visual verification from permission to edit, rebuild or deploy.

The strongest reusable idea is an **evidence hierarchy**: real visible browser/native journeys for browser/OS-level claims; same-state browser/E2E evidence for interaction and geometry; fresh headless sweeps for mechanical defects; source/lint/build reasoning only as hypotheses/regression support. This prevents a common agent failure: claiming a UI is correct because the code compiles or a screenshot was generated but never inspected.

**Best fit:** close the loop after Impeccable/UI-UX Pro Max/another design skill has produced or refined an interface. Particularly useful for responsive regressions, overflow/wrapping, wrong conditional states, reference parity, charts, downloads/print/popups, and release-oriented visual review.

**Why it adds marginal value:** it occupies a different layer from design-generation skills. Impeccable primarily improves direction/refinement; UI/UX Pro Max improves retrieval; specialist craft skills improve particular design decisions. `frontend-visual-qa` asks whether the *actual rendered product in the correct state* supports the claim. This is a more valuable complement than installing another overlapping anti-slop prompt pack.

**Risks / boundaries:** it is currently Claude-oriented and should not be assumed portable to Codex merely because the Markdown can be read there. Full value depends on browser/native tooling and project harnesses. Its detailed protocol is relatively large, so context cost and operational complexity are higher than a narrow screenshot skill. Browser-driving capabilities expand the executable/trust surface; use them against controlled targets and respect project authorization. Visual QA also cannot certify domain facts, user preference, or functional correctness that was not exercised.

**License and maintenance:** parent repository is MIT, unarchived, and was pushed on 2026-10-05. Direct GitHub metadata showed ~1.4k stars and ~222 forks on 2026-10-05. Adoption remains context, not proof of output quality.

**Decision:** promote as the first strong rendered-verification candidate, but keep the recommendation scoped to Claude Code until portability is explicitly validated.

## Rendered-verification landscape: do not collapse different jobs

A 2026-10-05 search found several superficially similar skills, but they solve different verification problems:

- **Visual regression** (`maxrihter/claude-skill-visual-regression`) uses Playwright screenshot baselines and diffs to catch *unintended change*. This is CI/regression infrastructure, not a design-quality judge. It is promising but currently has minimal adoption signal; evaluate its implementation before installing broadly.
- **Reference parity** (`Huc91/pixel-perfect-skill`, `Krowli/visual-parity`) compares a live/rendered implementation with Figma, an image, or another reference. Useful when a source of truth exists; inappropriate for deciding whether the reference itself is good UX. `visual-parity` explicitly targets Claude Code, Codex and Gemini CLI, making it an interesting portability candidate, but it was effectively unadopted at discovery time and therefore remains experimental.
- **Broad UAT/audit** (`tsilverberg/webapp-uat`, `EnchStyle/ui-ux-audit-skill`) combines browser journeys with accessibility/responsive/error checks. These may be useful when release QA is the goal, but their broad scoring/checklist claims need source inspection and evidence review before promotion.
- **Visual design review** (`AslanMazhidov/design-review-skill`) forces screenshot inspection at multiple breakpoints and proposes CSS fixes. The core loop is sound, but it currently has little adoption and overlaps more with Impeccable's critique role than `frontend-visual-qa` does.

**Operational distinction:**

1. *Does it still look like the approved baseline?* → visual regression.
2. *Does it match a specified design/reference?* → reference parity.
3. *Does the rendered product exhibit visual/responsive/state defects?* → rendered visual QA.
4. *Is the design direction itself appropriate, coherent, distinctive and usable?* → design critique/research, not screenshot diffing.

Do not use pixel similarity as a proxy for UX quality. A perfectly reproduced bad design is still a bad design, while an intentional improvement can correctly fail a visual-regression test.

## Composition strategy

Do not maximize skill count. A strong baseline stack has distinct jobs:

- **Knowledge/retrieval:** broad UX, product-category, stack, and accessibility references.
- **Direction/refinement:** explicit art direction, anti-generic critique, and iterative visual operations.
- **Specialist craft:** motion, direct manipulation, mobile-native details, accessibility, data visualization, or another domain only when the product needs it.
- **Rendered verification:** browser/screenshots/state coverage should close the loop regardless of which design skill generated the advice.

A plausible non-exclusive composition is **UI/UX Pro Max for retrieval + Impeccable for direction/refinement + selected Emil skills for motion/craft + frontend-visual-qa for rendered verification in Claude Code**. This is an agent-workflow hypothesis, not a proven ranking. Do not install every layer when the project does not need it.

## Installation decision gate

Before adding a skill to a real project:

1. inspect `SKILL.md`, references, scripts, package manifests, hooks, and install scripts;
2. identify exactly what new capability it adds over installed skills;
3. prefer project-scoped installation while evaluating;
4. record version/commit or otherwise make updates auditable;
5. run the same representative design task with and without the skill;
6. compare rendered desktop/mobile states, accessibility, task correctness, originality, implementation complexity, and unnecessary churn;
7. keep it only if the marginal improvement outweighs conflicts and maintenance cost.

## Freshness verification: search result recency is not repository recency

A fresh search hit is not evidence that a skill is actively maintained. Search indexes can recrawl an old repository and make it look current. Verify repository metadata directly before promoting a candidate: `archived`, `pushed_at`, release/commit history, license, executable surface, and whether the README still matches the shipped files.

A 2026-10-05 adversarial pass produced useful counterexamples:

- **`billhector/design-skills`** has an interesting design-system extraction/audit workflow, Tailwind theme generation, WCAG checks, screenshots, and explicit token-cost estimates. However, GitHub currently marks the repository **archived**, with its last push on **2026-04-10**. It also depends on Firecrawl for extraction. Treat it as an implementation reference, not a current install recommendation.
- **`vmarafetti/crit`** has a thoughtful six-lens audit model (accessibility, motion, UX/dark patterns, UI baseline, AI interaction, agent readability), explicit limitations, severity/effort scoring, and an MIT license. But its last push was **2026-06-01** and adoption is small. Its audit taxonomy may be worth studying; current evidence is insufficient to add it to the recommended stack.
- **`wonjyou/design-audit`** offers context-aware critique across visual design, heuristics, human factors, copy, IA, screenshots and Figma. Direct metadata shows the last push was **2026-03-28** and GitHub exposes no repository license. Do not recommend installation until maintenance and licensing are clearer.
- **`fol2/claude-design`** surfaced in current search as a broad craft/design skill, but direct GitHub metadata shows a single short activity window ending **2026-04-25**, zero adoption signal, and no declared repository license. This is a discovery candidate at most, not evidence-backed tooling.

**Operational rule:** discovery can come from search, lists, social posts, or aggregators; promotion must come from canonical-source inspection. `updated_at` is also weak on its own because repository metadata can change without meaningful code maintenance. Prefer `pushed_at` plus commit/release inspection.

This negative evidence is valuable: the repository should record why plausible candidates were *not* recommended, otherwise future agents may repeatedly rediscover and over-promote them from fresh-looking search results.

## Candidates requiring further investigation

Several newer repositories surfaced in the 2026-10-05 search (`szilu/ux-designer-skill`, `Impertio-Studio/Frontend-Design-Claude-Skill-Package`, `Krowli/visual-parity`, specialist motion/browser-review skills, and various synthesized design packs). They may contain useful ideas, but they should not be promoted from discovery to recommendation until source contents, provenance, executable surfaces, maintenance history, overlap, and real marginal value are inspected. Cross-LLM claims deserve direct testing rather than syntax-based assumptions. Forks and synthesis repos should be compared to canonical upstreams before installation.

## Open evidence gap

There is currently much stronger evidence for **what these repositories contain and how they are maintained** than for **how much they improve design output**. Future cycles should build a repeatable benchmark: identical brief + identical starter repo + baseline agent vs one skill vs composed skills, followed by blind or rubric-based rendered evaluation. The verification layer itself should also be benchmarked: seed known visual/state/responsive defects and measure detection, false positives, missed states, time/context cost and whether the agent actually opens and reasons about captured evidence. Without that, popularity, attractive before/after screenshots and elaborate audit protocols remain weak proxies for causal value.
