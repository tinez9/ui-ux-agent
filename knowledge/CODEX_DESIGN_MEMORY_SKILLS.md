# Codex design-memory skills: preserving project taste without freezing the UI

Last reviewed: 2026-10-05

## Research question

Do Codex-oriented design-memory skills add a distinct capability beyond general critique/retrieval skills, and which current candidates are credible enough to recommend?

## Core finding

A persistent project design contract is a genuinely separate layer from design advice. Its job is not to make an interface "better" in the abstract; it is to prevent an agent from silently inventing a new visual system on each task.

The useful pattern is:

1. locate the project's design source before UI work;
2. distinguish normative tokens/rules from rationale and bounded freedoms;
3. prefer existing components/tokens over new abstractions;
4. make the smallest reasonable choice when the contract is incomplete rather than fabricating a parallel system;
5. verify the real rendered UI after implementation;
6. report which design source governed the change.

This complements critique skills such as Impeccable and retrieval systems such as UI/UX Pro Max. A critique skill can improve a bad direction; a design-memory skill can preserve an intentional direction across sessions. Neither substitutes for rendered QA.

## `danieloleary/design-md-for-codex`

**Decision:** useful mechanism/reference, but **not a current default-install recommendation**.

### What it actually does

The inspected `skills/design-system/SKILL.md` makes Codex search for a repo-local `DESIGN.md`, read it before touching UI, treat front-matter tokens as normative, preserve existing behavior, reuse project components/tokens, lint the design file when possible, and perform desktop/mobile rendered checks. It explicitly asks the final response to name the design file and rules applied.

This is better than merely placing a design document in the repository and hoping the agent remembers it: the skill turns the document into a repeatable precondition for UI work.

### Important weakness

If no local design source exists, the skill falls back to its bundled starter, which carries a specific aesthetic bias (dark command surfaces, warm editorial support surfaces, one accent, clean borders). That is convenient bootstrap behavior but also a **template-leakage risk**. For an established product, absence of `DESIGN.md` should not be interpreted as permission to import another author's taste; existing code, tokens, screenshots and brand artifacts may be better evidence.

The skill also contains broad stylistic defaults such as avoiding decorative gradients/blobs/nested cards unless the design contract asks for them. Treat these as author heuristics, not universal UX laws.

### Freshness/adoption check

Canonical GitHub metadata inspected 2026-10-05: MIT, unarchived, created 2026-05-09, **last pushed 2026-05-12**, 1 star / 0 forks. GitHub's `updated_at` was 2026-10-05, demonstrating again that metadata/search freshness must not be confused with code maintenance.

The repository includes smoke/browser QA and maintenance material, but the stale `pushed_at` plus minimal adoption prevent promotion. Its strongest contribution is the workflow pattern, not current ecosystem validation.

## `MaxHan7/frontend-ui-standards-skill`

**Decision:** useful implementation-discipline reference; **not a current default-install recommendation**.

### What it actually adds

The inspected skill is less about visual taste and more about encoding a design system in maintainable frontend code. Its strongest operational model separates:

- global design tokens;
- component-specific metrics;
- screen-specific layout metrics.

It requires agents to inspect existing components first, classify visual values before placing them, encode relationships instead of copying coordinates, update same-family surfaces, and visually sanity-check the result. It explicitly spans SwiftUI, React/web, React Native and Flutter.

This is useful because screenshot/Figma fidelity and maintainable implementation are different goals. A screen can look correct once while embedding duplicated numbers, local patches and divergent components that make later UI work drift.

### Where it overlaps

Much of the advice overlaps mature design-system/frontend-engineering practice already represented elsewhere in this repository: semantic tokens, component reuse, accessibility states, responsive behavior and visual verification. It does not provide a persistent project design memory by itself, nor does it add a strong visual-direction or critique layer.

Some rules are too categorical to inherit unchanged. For example, immediate extraction when a component repeats can create premature abstraction; reuse decisions should consider semantic role, likely evolution and whether shared behavior is genuinely stable. Likewise, fixed platform touch-target numbers need to remain platform/version scoped rather than becoming universal constants.

### Freshness/adoption check

Canonical GitHub metadata inspected 2026-10-05: MIT, unarchived, created and **last pushed 2026-06-27**, 105 stars / 1 fork. The adoption signal is notably stronger than `design-md-for-codex`, but the repository currently has only one commit and no subsequent code activity. Stars do not compensate for maintenance depth or prove output quality.

## Design memory is a contract, not a style preset

A high-value project design memory should preserve **intent** without freezing legitimate evolution. Prefer a contract containing:

- semantic tokens and theme relationships;
- typography roles rather than isolated sizes;
- component/state contracts;
- composition/layout rules that matter to identity;
- accessibility invariants;
- motion principles where product-specific;
- voice/content constraints when they affect UI;
- explicit no-go decisions with rationale;
- bounded freedoms: what an agent may reinterpret;
- unresolved questions/conflicts instead of invented certainty.

Do not turn every observed CSS value into a rule. Existing implementation may contain accidental drift, legacy debt or one-off campaign styling. Extraction needs confidence/provenance and human/product judgment.

## Operational recommendation

For projects that already have a coherent visual identity, prefer **repo-local design memory + a thin enforcement skill** over installing another broad aesthetic pack. The memory should belong to the product and be reviewable in version control; the skill should mainly ensure it is found, applied, validated and reported.

A useful composition is:

`project design contract → implementation discipline → critique/refinement → rendered QA`

The layers can be provided by different tools. Do not make a single skill authoritative merely because it bundles all four.

## Evidence boundary

This cycle inspected canonical repository metadata and the actual skill instructions for both candidates. It establishes what their mechanisms do and exposes maintenance/overlap risks. It does **not** establish causal improvement over baseline Codex: neither candidate currently provides a same-model, same-task, blinded baseline-vs-skill evaluation sufficient to support that claim.

## Next research direction

Investigate **design-contract extraction/generation** rather than another enforcement skill: compare tools that derive `DESIGN.md` from real code/rendered evidence against hand-authored contracts. The key question is whether extraction can distinguish intentional system rules from accidental implementation values and represent confidence/conflicts without laundering legacy drift into the new source of truth.
