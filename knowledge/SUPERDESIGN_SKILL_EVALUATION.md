# Superdesign Skill Evaluation

Last reviewed: 2026-10-05

## Research question

Does `superdesigndev/superdesign-skill` add enough distinct design capability to justify consideration alongside local-first layers such as UI/UX Pro Max, Impeccable, specialist craft skills, and rendered visual QA?

## Decision

**Status: promising conditional candidate, not a default install recommendation.**

Superdesign is materially more than a style-prompt pack. Its strongest differentiator is an external design workspace with branchable drafts, model choice, reusable design-system context, website/reference extraction, multi-page flows, persistent project state, and an infinite canvas. That can add real exploration leverage when a team wants to compare visual directions before implementation.

The trade-off is equally material: unlike mostly local Markdown guidance, the useful canvas workflow depends on the Superdesign CLI/service and authentication. Treat it as a remote design system in the workflow, not as a passive skill.

## Canonical repository evidence

Canonical GitHub metadata inspected 2026-10-05:

- repository: `superdesigndev/superdesign-skill`;
- MIT licensed, unarchived;
- 623 stars / 48 forks at inspection time;
- created 2026-01-21;
- last repository push 2026-08-21;
- the older `superdesigndev/superdesign` IDE extension is explicitly historical and no longer the maintained product.

Search recency must not be mistaken for code recency: the skill remains actively presented as the current product integration, but its canonical repository had not been pushed for roughly six weeks at inspection time.

## What the skill actually adds

### 1. Design exploration rather than direct code styling

The skill can create and branch design drafts, compare independent directions, iterate a selected direction, design multi-page flows, and return draft HTML. This is a different job from Impeccable-style critique/refinement of code that already exists.

**Use when:** alternative visual directions are genuinely valuable before committing implementation effort.

**Do not infer:** that more generated variants improve design quality. Branching increases search space; selection still needs product judgment and evaluation criteria.

### 2. Codebase grounding with explicit context artifacts

Its init workflow scans framework, component library, shared primitives, layouts, routes, tokens, key-page dependency trees, and extractable components. It stores this under `.superdesign/init/` and explicitly distinguishes discovery context from the smaller payload used for a particular design call.

This is a strong architectural idea: **discover broadly, transmit selectively**. It reduces the false choice between giving the design agent no implementation context and dumping the entire repository into every request.

However, the inspected init guidance asks for full source code for shared components/layouts and raw theme files. That improves reproduction fidelity but creates a privacy and data-minimization concern if those artifacts are subsequently sent to a remote service. Agents should select the minimum context needed and exclude secrets, proprietary business logic, user data, server code, and unrelated implementation.

### 3. Existing-UI replica as a remote design baseline

For redesigns, the workflow can create a lightweight HTML replica of the current page and use it as the baseline draft before branching new directions. The rule that the replica must contain only existing UI—not speculative new design—is useful because it separates **observation of current state** from **design intervention**.

Boundary: a reconstructed HTML replica is not the real application. It can omit framework behavior, responsive edge cases, data states, accessibility semantics, fonts/assets, or runtime layout behavior. It is design context, not implementation proof.

### 4. Persistent design state

The current skill documents project/draft continuity and reusable context so later iterations do not need to rediscover the entire codebase. This can reduce repeated context cost in longer design sessions.

Treat persisted context as cache, not truth. Revalidate affected context after code/design-system changes.

### 5. Broader visual-production surface

The skill also covers presentations, graphics, supporting image/video generation, website design-language extraction, and reusable brand assets. This breadth is useful for a product that needs coordinated interface and launch/brand collateral, but it should not be mistaken for deeper UX expertise in every domain.

## Compatibility

The canonical install documentation supports Claude Code and Codex as well as many other coding agents through the `skills` installer. Claude Code also has a plugin path. A Codex plugin manifest is present in the repository.

Compatibility means the skill can be installed/routed in those harnesses; it does **not** establish equivalent output quality across models. Cross-model quality remains an empirical question.

## Executable and trust surface

Installing the skill is only the first layer. The primary workflow instructs users to install `@superdesign/cli`, authenticate with `superdesign login`, and invoke commands that interact with the Superdesign product/service.

Therefore evaluate separately:

1. the open-source skill instructions;
2. the npm CLI package and its update policy;
3. authentication/token storage;
4. what project/code/design context is transmitted remotely;
5. service privacy/retention/terms for the actual deployment;
6. generated artifacts and persistent `.superdesign/` state;
7. any model/provider selection and associated data path.

Do not describe Superdesign as local-only merely because the skill files live in the repository.

The inspected DeepSeek harness adapter is deliberately small and local: plain ESM, no build step, reading the packaged `SKILL.md` and registering it as a skill provider. That reduces plugin-adapter surface, but it does not remove the external CLI/service dependency of the design workflow itself.

## Marginal value versus the current candidate stack

| Layer | Primary job | Superdesign overlap / difference |
|---|---|---|
| UI/UX Pro Max | local knowledge/retrieval and stack guidance | Superdesign adds remote draft generation/canvas and visual exploration; do not replace evidence-oriented guidance with prompt-library popularity. |
| Impeccable | critique, direction, polish, anti-generic refinement | Significant direction overlap, but Superdesign adds branchable pre-implementation drafts and persistent canvas state. |
| Emil Kowalski skills | specialist motion/design-engineering craft | Mostly complementary; Superdesign is broader and less specifically a motion-craft layer. |
| frontend visual QA | evidence from the real rendered implementation | Complementary and still necessary. Superdesign drafts/replicas cannot certify the shipped UI. |
| human decision sandbox | cheap human token/copy/element feedback | Some overlap; Superdesign is substantially heavier but adds model-driven generation, branching and remote canvas. |

## Recommended workflow when used

1. Inspect the real product, user/task constraints and existing design system locally.
2. Decide whether the task benefits from divergent visual exploration. If not, skip Superdesign and implement/refine directly.
3. Minimize and review context before any remote design call.
4. Generate a small number of meaningfully different drafts; do not branch variants merely because the tool can.
5. Select using explicit criteria: task fit, hierarchy, product identity, accessibility feasibility, responsive feasibility, implementation cost and consistency with the system.
6. Treat chosen draft HTML as design reference, not production code authority.
7. Implement in the real codebase using its actual primitives and semantics.
8. Run rendered QA on real routes/states/viewports; separately test accessibility and functional behavior.

## When it is a poor fit

Avoid or defer the service-backed workflow when:

- source/design context cannot be sent to an external service;
- the design direction is already settled and the task is implementation/polish;
- the project needs a tiny local change rather than divergent exploration;
- external account/CLI/model dependencies are not acceptable;
- teams would treat generated HTML as production-ready evidence;
- the additional canvas workflow would duplicate an existing Figma/design review process without reducing churn.

## Evidence boundary

The repository demonstrates a sophisticated workflow and meaningful adoption signal, but this investigation found no controlled evidence that Superdesign produces better user outcomes or consistently better interfaces than baseline Claude/Codex, Impeccable, UI/UX Pro Max, or a human-led design workflow. Marketing claims such as “tasteful” or “pixel perfect” are not treated as validated outcomes.

The correct classification is therefore **high-potential workflow/tooling candidate with meaningful external-service cost**, not “best design skill.”

## What would justify promotion

Run a controlled project-scoped comparison on the same brief and starter UI:

- baseline coding agent;
- baseline + Impeccable;
- baseline + Superdesign;
- composed workflow only if the single-skill tests show complementary gains.

Evaluate blind where possible on task correctness, hierarchy, coherence, distinctiveness, responsive behavior, accessibility feasibility, implementation churn, time/context cost, dependency cost, and how much of the chosen draft survives implementation. Also record what source/context was transmitted.
