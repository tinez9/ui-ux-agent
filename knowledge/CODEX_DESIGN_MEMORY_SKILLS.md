# Codex design-memory skills: preserving project taste without freezing the UI

Last reviewed: 2026-10-05

## Research question

How should agents preserve or extract project design memory without freezing the UI or laundering accidental implementation values into a new source of truth?

## Core finding

A persistent project design contract is a separate layer from design advice. Its job is not to make an interface "better" in the abstract; it is to prevent an agent from silently inventing a new visual system on each task.

The useful pattern is:

1. locate the project's strongest design evidence before UI work;
2. distinguish normative tokens/rules from observations, rationale, exceptions and bounded freedoms;
3. prefer existing components/tokens over new abstractions;
4. make the smallest reasonable choice when the contract is incomplete rather than fabricating a parallel system;
5. verify the real rendered UI after implementation;
6. report which design source governed the change.

This complements critique skills such as Impeccable and retrieval systems such as UI/UX Pro Max. A critique skill can improve a bad direction; a design-memory skill can preserve an intentional direction across sessions. Neither substitutes for rendered QA.

## `danieloleary/design-md-for-codex`

**Decision:** useful mechanism/reference, but **not a current default-install recommendation**.

The inspected skill makes Codex search for a repo-local `DESIGN.md`, read it before touching UI, treat front-matter tokens as normative, preserve existing behavior, reuse project components/tokens, lint the design file when possible, and perform desktop/mobile rendered checks. This turns the document into a repeatable precondition rather than passive documentation.

Its fallback is a risk: when no local source exists it imports a bundled aesthetic starter. For established products, absence of `DESIGN.md` is not permission to import another author's taste; existing code, tokens, screenshots and brand artifacts may be stronger evidence.

Canonical metadata inspected 2026-10-05: MIT, unarchived, last pushed 2026-05-12, 1 star / 0 forks. Useful workflow reference, weak current ecosystem validation.

## `MaxHan7/frontend-ui-standards-skill`

**Decision:** useful implementation-discipline reference; **not a current default-install recommendation**.

Its strongest operational model separates global design tokens, component-specific metrics and screen-specific layout metrics. It asks agents to inspect existing components first, classify visual values before placing them, encode relationships rather than coordinates, update same-family surfaces and visually sanity-check results. This matters because one-time screenshot fidelity and maintainable design-system implementation are different goals.

Some rules are too categorical to inherit unchanged: immediate abstraction on repetition can be premature, and platform touch-target numbers must remain platform/version scoped.

Canonical metadata inspected 2026-10-05: MIT, unarchived, last pushed 2026-06-27, 105 stars / 1 fork, but currently only one commit. Adoption is not causal evidence of output quality.

## Extracting a contract from existing UI: evidence hierarchy

A newly inspected candidate, `KunalKumarkkr01/design-system-extractor`, exposes an important improvement over screenshot-only extraction: it drives real Chrome through the Chrome DevTools MCP, uses the accessibility tree to map structure, reads CSS custom properties and computed styles, captures desktop/mobile screenshots, explores interaction states and secondary pages, then writes an implementation-oriented `design.md`.

**Decision:** promising mechanism/reference, **not a default-install recommendation**. Canonical metadata inspected 2026-10-05: MIT, unarchived, last pushed 2026-07-20, 1 star / 0 forks. It also has a hard Node + Chrome + Chrome DevTools MCP dependency and can execute page JavaScript through a browser, so its operational/supply-chain surface is much larger than a passive Markdown skill.

The mechanism suggests a useful evidence hierarchy for extraction:

1. **Normative source** — maintained tokens/theme files, component contracts, design docs and explicit brand rules. Strongest evidence of intent when known current.
2. **Repeated rendered/code evidence** — recurring semantic roles, components and relationships across routes/states/modes.
3. **Computed runtime values** — strong evidence of what ships, but not automatically of what should be normative.
4. **Screenshots** — strong visual grounding and useful for composition/imagery, weak for exact hidden semantics and causality.
5. **Single-instance values** — observations or exceptions until corroborated; never promote automatically to global rules.

### Critical correction: runtime truth is not design intent

The extractor claims a running page contains the "ground truth" because computed styles expose exact shipped values. That is true only for **rendered implementation truth**. It does not establish **design-system intent**.

A computed `13px` gap may be a deliberate token, an inherited library default, a breakpoint interpolation, a legacy patch or an accidental override. A CSS custom property is stronger evidence when it is semantically named and reused, but even tokens can be deprecated or misapplied. Therefore extraction should not flatten observation into prescription.

A robust generated contract should attach provenance and confidence to important claims:

- `NORMATIVE`: explicitly defined by current project/design source;
- `REPEATED`: inferred from consistent evidence across representative surfaces;
- `OBSERVED`: exact shipped value but intent unknown;
- `APPROXIMATED`: inferred visually or from incomplete evidence;
- `CONFLICT`: credible sources disagree;
- `EXCEPTION`: intentional or suspected local deviation, not a global rule.

When confidence is insufficient, preserve the uncertainty rather than silently inventing a rule.

### Route/state coverage is part of extraction quality

Homepage-only extraction is structurally weak. A useful contract needs representative routes, component archetypes, responsive breakpoints, themes and interaction states. The inspected extractor improves on shallow token scrapers by explicitly mapping secondary pages and noting intentional rule breaks. That is valuable, but its output template still cannot prove whether an inconsistency is intentional without product/design provenance.

### Preview validates the contract, not the product

Rendered design-system previews are useful for catching malformed tokens, missing modes and internally inconsistent documentation. They do **not** prove that the extracted contract reproduces the source product, nor that a later implementation is correct. Keep three checks separate:

`source evidence → extracted contract/preview → implementation → rendered QA/parity`

Each transition can introduce error.

## Candidate comparison: extraction mechanisms

Several current repositories advertise `DESIGN.md` generation, but the mechanism matters more than the file name.

- `KunalKumarkkr01/design-system-extractor`: strongest inspected mechanism this cycle for **live-site evidence**, because it combines DOM/computed values, accessibility structure, responsive screenshots, states and routes. Low adoption and non-trivial MCP/browser surface prevent promotion.
- `simonbloom/design-system-extractor-skill`: advertises source/code/rendered evidence, component inventory, extraction notes with confidence/assumptions/gaps, preview rendering and optional token exports. This provenance model is conceptually strong, but canonical metadata shows no push since 2026-04-25, only 4 stars / 0 forks and no detected repository license; do not recommend installation despite recent search recrawls.
- Screenshot-first generators remain useful when screenshots are the only evidence available, but exact tokens and hidden state/responsive behavior should be marked approximate rather than laundered into authoritative design rules.

## Design memory is a contract, not a style preset

A high-value project design memory should preserve **intent** without freezing legitimate evolution. Prefer a contract containing semantic tokens/theme relationships, typography roles, component/state contracts, identity-critical composition rules, accessibility invariants, product-specific motion principles, explicit no-go decisions with rationale, bounded freedoms, and unresolved conflicts.

Do not turn every observed CSS value into a rule. Existing implementation may contain accidental drift, legacy debt or one-off styling. Extraction needs provenance, confidence and judgment.

## Operational recommendation

For an existing coherent product, prefer:

`evidence inventory → confidence-aware contract → implementation discipline → critique/refinement → rendered QA`

If a maintained design source already exists, do not reverse-engineer it from screenshots merely because an extractor is available. Use extraction to fill documented gaps and to detect divergence between declared intent and shipped UI.

For products without a trustworthy source of truth, browser/code extraction can bootstrap one, but generated rules should initially be reviewable hypotheses rather than automatically normative policy.

## Evidence boundary

This research inspected canonical repository metadata and actual skill instructions. It establishes mechanisms, dependencies and failure modes; it does not establish causal improvement over baseline Codex/Claude, nor does it prove that generated contracts preserve designer intent. No candidate inspected here currently supplies a rigorous same-task comparison of extracted-contract fidelity and downstream implementation quality.

## Next research direction

Test **design-contract drift detection**: how agents should compare declared tokens/components against rendered production UI, distinguish legitimate exceptions from accidental divergence, and update either implementation or contract without making the documentation circularly self-validating.
