# Skill evaluation scenarios

Behavioural regression scenarios for the `ui-ux` skill. Use them after any sync from the lab or
any change to `SKILL.md`/workflows: walk each scenario through the skill files (or run it on a real
project) and check the expectations. A scenario passes when every **must** holds.

Last validated: 2026-10-06 (desk walkthrough against the files; gaps found are listed per scenario).

---

## S1 — Audit an existing React dashboard

**Prompt:** "Audita el dashboard de mi app React" / `/ui-ux audit src/app/dashboard`

**Must:**
- Route to `audit` (read-only); load evidence, inspection, states, severity references.
- Lenses: ux (+ `data-dense-and-power-ui.md` for tables/KPIs, `navigation-and-search.md`),
  visual, responsive, a11y floor, design-system (run `style-census.mjs`), distinctiveness.
- Ask ≤ 5 questions if no project context: primary users, the top decisions the dashboard
  supports, core flows, target devices, design-system constraints.
- Detect browser tooling; run the dev server; inspect 390/768/1440 + loading/empty/error states;
  keyboard pass; contrast of text roles; table semantics.
- Findings follow the schema with sources; visual claims from code alone capped at medium.
- Group root causes (e.g. "no semantic tokens"); Top 5 with "ranked above … because".
- Check the "dashboard template" pattern with pattern + context + purpose + execution.
- Write `.claude/ui-ux/audits/<date>-dashboard.md`; modify no code.

**Walkthrough result:** pass. Known gap: chart/data-visualization accessibility and dashboard
composition have no dedicated reference (handled by general principles; listed in SYNC known gaps).

## S2 — Design a mobile-first nutrition app

**Prompt:** "Diseña una app de nutrición mobile-first" / `/ui-ux design "nutrition app, mobile-first"`

**Must:**
- Route to `design`; no code edits.
- Understanding gate first: users (goals, frequency, on-the-go/one-handed context), core job
  (e.g. logging a meal fast), real content (food names, portions, macros), constraints, success criteria.
- Conceptual model (objects → relationships → states → actions) for meals, foods, goals, days.
- 2–3 directions differing in ≥ 2 structural channels, one close to conventions; ASCII wireframes
  of the representative screen (e.g. log meal / today view); counterfactual test per direction.
- Evaluation matrix with per-cell reasons; recommendation + what would change it; **stop for the user's choice**.
- After the choice: design contract (product truth, thesis, roles, signature, restraint, a11y floor,
  required states incl. first-use empty states, responsive invariants, anti-goals, acceptance criteria).
- Pull onboarding/empty-state and forms guidance; touch targets (44px for frequent actions).

**Walkthrough result:** pass.

## S3 — Review an AI-powered SaaS interface

**Prompt:** "Revisa la interfaz de nuestro SaaS con IA"

**Must:**
- With no diff/prior report/contract, treat as `audit` (not `review`) and say so.
- Auto-apply the `ai` lens: `ai-ux.md` checklist — model fit (chat vs embedded), action classes and
  approvals, draft vs commit, uncertainty types, provenance at claim level, execution truth
  (attempt ≠ effect), activity/progress, control (pause/stop/redirect), recovery, attribution.
- Flag confidence theater, blanket "AI can make mistakes" banners, citation theater — with evidence.
- `ai-agent-oversight.md` only if the product supervises many agents.

**Walkthrough result:** **gap found and fixed** — "review" would have routed to the review mode,
which expects changes to verify. Added a routing rule in `SKILL.md` and a fallback in
`workflows/review.md`.

## S4 — Improve an existing design system

**Prompt:** "Mejora nuestro design system" / `/ui-ux improve` (no findings given)

**Must:**
- Run a scoped design-system audit first (`design-systems.md` § Audit procedure + `style-census.mjs`):
  sources of truth, value census, parallel component implementations, state consistency,
  semantic misuse, composition sameness, per-variant accessibility, drift triage.
- Settle architecture decisions (token layers/naming, migration strategy) through `design` or an
  approved options section before implementing.
- Plan in dependency order: semantic roles/tokens → core components → call-site migration
  (deprecation, codemods for low-ambiguity cases) → composition guidance.
- Respect invariants vs controlled freedom; don't componentize everything (≥ 3 same-semantics usages rule).
- Verify rendered states per theme/variant; visual regression treated as detection, not adjudication.

**Walkthrough result:** **gap found and fixed** — `improve` didn't route system-level decisions
to `design`. Added a pre-step in `workflows/improve.md` and a routing note in `SKILL.md`.

## S5 — Audit responsive behaviour

**Prompt:** `/ui-ux audit --focus responsive`

**Must:**
- Load `responsive.md`; write the four invariants (task, relationship, comparison, state) for key surfaces.
- Inspect 390/768/1440 **and** 320px reflow, 200% text, a narrow container in a wide viewport;
  sweep widths to find where composition fails; measure overflow and targets.
- Check navigation model, hierarchy inversion, density, touch/hover dependence, tables, images,
  long/localized content, DOM vs visual order.
- Accessibility floor still checked.
- In static mode: declare it, reconstruct from CSS, cap confidence at medium, list "verify when rendered".

**Walkthrough result:** pass. Fixed alongside: finding-ID prefixes are now listed in
`workflows/audit.md` so IDs stay consistent across re-audits.

---

## Cross-cutting checks (every scenario)

- No code modified in audit/design/review.
- Every finding: evidence (with source) separated from interpretation and recommendation; a
  verification criterion; confidence respecting caps.
- Coverage table with `not assessed` where applicable.
- Generic-looking patterns never flagged by rule alone.
- Output in the user's language; IDs/fields in English.

## Tool checks

- `scripts/style-census.mjs`: run on a fixture with duplicated radii/colors, Tailwind arbitrary
  values, undefined/unused custom properties → all reported; `node_modules` skipped. (Passed 2026-10-06.)
- `scripts/render-check.mjs`: without Playwright → exits with code 2 and instructions, installs
  nothing (passed). Measurement logic validated in a browser on a fixture with a 900px nav at 390px,
  a 16×16 button, an unnamed SVG button, an image without alt and an h1→h3 skip → all detected
  (passed 2026-10-06). Full Playwright run not yet exercised — do it on the first project that has Playwright.
