# Codex design-memory skills: preserving project taste without freezing the UI

Last reviewed: 2026-10-05

## Research question

How should agents preserve, extract and validate project design memory without freezing the UI or laundering accidental implementation values into a new source of truth?

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

`KunalKumarkkr01/design-system-extractor` exposes an important improvement over screenshot-only extraction: it drives real Chrome through the Chrome DevTools MCP, uses the accessibility tree to map structure, reads CSS custom properties and computed styles, captures desktop/mobile screenshots, explores interaction states and secondary pages, then writes an implementation-oriented `design.md`.

**Decision:** promising mechanism/reference, **not a default-install recommendation**. Canonical metadata inspected 2026-10-05: MIT, unarchived, last pushed 2026-07-20, 1 star / 0 forks. It also has a hard Node + Chrome + Chrome DevTools MCP dependency and can execute page JavaScript through a browser, so its operational/supply-chain surface is much larger than a passive Markdown skill.

The mechanism suggests a useful evidence hierarchy for extraction:

1. **Normative source** — maintained tokens/theme files, component contracts, design docs and explicit brand rules. Strongest evidence of intent when known current.
2. **Repeated rendered/code evidence** — recurring semantic roles, components and relationships across routes/states/modes.
3. **Computed runtime values** — strong evidence of what ships, but not automatically of what should be normative.
4. **Screenshots** — strong visual grounding and useful for composition/imagery, weak for exact hidden semantics and causality.
5. **Single-instance values** — observations or exceptions until corroborated; never promote automatically to global rules.

### Critical correction: runtime truth is not design intent

A running page can establish **rendered implementation truth** but not automatically **design-system intent**. A computed `13px` gap may be a deliberate token, an inherited library default, a breakpoint interpolation, a legacy patch or an accidental override. A semantically named/reused custom property is stronger evidence, but even tokens can be deprecated or misapplied.

A robust generated contract should attach provenance and confidence to important claims:

- `NORMATIVE`: explicitly defined by current project/design source;
- `REPEATED`: inferred from consistent evidence across representative surfaces;
- `OBSERVED`: exact shipped value but intent unknown;
- `APPROXIMATED`: inferred visually or from incomplete evidence;
- `CONFLICT`: credible sources disagree;
- `EXCEPTION`: intentional or suspected local deviation, not a global rule.

When confidence is insufficient, preserve the uncertainty rather than silently inventing a rule.

### Route/state coverage is part of extraction quality

Homepage-only extraction is structurally weak. A useful contract needs representative routes, component archetypes, responsive breakpoints, themes and interaction states. Browser extraction can expose intentional-looking rule breaks, but it still cannot prove whether an inconsistency is intentional without product/design provenance.

### Preview validates the contract, not the product

Rendered design-system previews are useful for catching malformed tokens, missing modes and internally inconsistent documentation. They do **not** prove that the extracted contract reproduces the source product, nor that a later implementation is correct. Keep the transitions explicit:

`source evidence → extracted contract/preview → implementation → rendered QA/parity`

Each transition can introduce error.

## Candidate comparison: extraction mechanisms

- `KunalKumarkkr01/design-system-extractor`: strongest inspected mechanism for **live-site evidence**, combining DOM/computed values, accessibility structure, responsive screenshots, states and routes. Low adoption and non-trivial MCP/browser surface prevent promotion.
- `simonbloom/design-system-extractor-skill`: advertises source/code/rendered evidence, component inventory, extraction notes with confidence/assumptions/gaps, preview rendering and optional token exports. Conceptually strong provenance model, but canonical metadata shows no push since 2026-04-25, only 4 stars / 0 forks and no detected repository license; do not recommend installation despite recent search recrawls.
- Screenshot-first generators remain useful when screenshots are the only evidence available, but exact tokens and hidden state/responsive behavior should be marked approximate rather than laundered into authoritative design rules.

## Design-contract drift: detection is not adjudication

A visual/token diff can establish that **something changed**. It cannot establish whether the change is wrong. This distinction is critical for autonomous agents because blindly repairing every mismatch can erase intentional evolution, while blindly accepting every new baseline can canonize regressions.

Current tooling supports the detection side well. The stable DTCG 2025.10 format gives tokens explicit structure, aliases, groups, extensions and `$deprecated`, making machine-readable contract comparison practical. Storybook/Chromatic can render named component states and compare browser snapshots against accepted baselines across themes, viewports and browsers. Chromatic also exposes an important operational fact: visual changes still require review/verification; snapshot baselines are historical evidence, not design intent. Capture instability, animations, font/resource failures, DPR changes and diff thresholds can create false positives or hide subtle changes.

Therefore treat drift as a **triage problem**, not a boolean failure:

1. **Contract violation** — current implementation contradicts a still-valid normative rule. Fix implementation; do not update the contract merely to make CI green.
2. **Intentional evolution** — a deliberate product/design decision supersedes the contract. Update the normative source and implementation together, with rationale/migration where useful; then establish the new baseline.
3. **Approved exception** — a local deviation has a real contextual reason. Record scope and rationale; do not promote it into a global token/rule.
4. **Legacy debt / accidental divergence** — shipped UI differs but no credible intent supports it. Keep the contract normative and create remediation rather than reverse-engineering the drift into documentation.
5. **Contract stale or ambiguous** — evidence suggests the documentation no longer represents reality, but intent is unclear. Mark `CONFLICT`/uncertainty and escalate for evidence; do not auto-fix either side.
6. **Test/capture noise** — rendering instability, browser/font/resource variance, animation, DPR or threshold effects. Stabilize the test before making a design decision.

### Three-way comparison beats circular validation

Avoid comparing only `DESIGN.md ↔ current UI`. That allows either side to validate itself. Prefer three evidence classes:

`declared contract ↔ previous accepted implementation/baseline ↔ proposed/current implementation`

Then add decision provenance when available (design file, issue/ADR, approved review, product requirement). This separates four questions:

- Did code change?
- Did rendered output change?
- Does the change violate the current contract?
- Should the contract itself change?

Those questions require different evidence and should not be collapsed into one automated pass/fail.

### Baseline acceptance is a governance action

Visual-regression systems compare against a last-known accepted snapshot. Accepting a snapshot changes future expectations, so agents should treat baseline updates like contract-affecting writes rather than cleanup. Never auto-accept a broad visual diff solely because the build is otherwise correct. Require a traceable reason for identity-critical, accessibility-relevant or wide-surface changes.

Likewise, token migration should distinguish replacement from deprecation. DTCG's `$deprecated` field can mark tokens/groups as deprecated while preserving machine-readable compatibility; use deprecation/migration where consumers still exist rather than silently renaming or deleting contract vocabulary.

### Practical drift pipeline for agents

Use layered checks rather than one giant screenshot gate:

1. **Static contract checks:** schema/type validity, aliases, deprecated-token usage, forbidden literals where justified, component API/state contracts.
2. **Component-state checks:** representative stories/fixtures for variants, states, themes and responsive conditions.
3. **Rendered regression:** stable browser snapshots with deterministic data/fonts/animations; inspect diffs rather than equating pixels with correctness.
4. **Journey checks:** Playwright/Cypress/Vitest-browser states where composition depends on real interaction or route state.
5. **Adjudication:** classify each material drift using the six cases above and attach provenance.
6. **Write-back:** change implementation, contract, exception registry, baseline, or test harness according to classification — not all of them by default.

The goal is not zero drift. The goal is **intentional, explainable drift with the correct source of truth updated**.

## Design memory is a contract, not a style preset

A high-value project design memory should preserve **intent** without freezing legitimate evolution. Prefer semantic tokens/theme relationships, typography roles, component/state contracts, identity-critical composition rules, accessibility invariants, product-specific motion principles, explicit no-go decisions with rationale, bounded freedoms, and unresolved conflicts.

Do not turn every observed CSS value into a rule. Existing implementation may contain accidental drift, legacy debt or one-off styling. Extraction and drift detection both need provenance, confidence and judgment.

## Operational recommendation

For an existing coherent product, prefer:

`evidence inventory → confidence-aware contract → implementation discipline → drift detection/adjudication → critique/refinement → rendered QA`

If a maintained design source already exists, do not reverse-engineer it from screenshots merely because an extractor is available. Use extraction to fill documented gaps and detect divergence between declared intent and shipped UI.

For products without a trustworthy source of truth, browser/code extraction can bootstrap one, but generated rules should initially be reviewable hypotheses rather than automatically normative policy.

## Evidence boundary

The extraction-skill findings establish mechanisms, dependencies and failure modes; they do not establish causal improvement over baseline Codex/Claude or prove generated contracts preserve designer intent. The drift model is an agent synthesis grounded in the DTCG stable token format and current Storybook/Chromatic visual-testing mechanics. Those sources establish machine-readable contracts, rendered diffing, baselines and known capture failure modes; they do **not** empirically validate this six-way adjudication taxonomy or prove that visual regression improves product outcomes.

## Next research direction

Test the drift model against real design-system change histories: deprecations, theme migrations, intentional redesigns and visual-regression incidents. The key question is whether the six-way classification remains useful under real multi-team governance, especially when design files, tokens and shipped code disagree for long periods.
