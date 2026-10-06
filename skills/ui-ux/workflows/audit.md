# Workflow: audit

**Question answered:** what is wrong with this interface, or could be better — with what
evidence, how sure, and in what order to fix it.

**Read-only.** Do not edit source, styles, config or tests. Do not "quickly fix" anything you
find, however small — record it as a finding. The only files you may write are the report and
its artifacts under `.claude/ui-ux/audits/` (skip writing if the user wants chat-only output).

## Inputs

- **Scope:** whole app, route(s), flow(s), component(s) or design system. If unclear, propose a
  scope based on the primary flows and confirm in one line.
- **Lenses** (`--focus`, comma-separated): `ux`, `interaction`, `visual`, `responsive`, `a11y`,
  `design-system`, `distinctiveness`, `ai`. Default: all applicable, depth proportional to scope.
  The accessibility floor is always checked.
- **Viewports:** project context or `--viewports`; default 390, 768, 1440 (+ 320 and 200% zoom for
  responsive/a11y).

## Load

Always: `references/evidence-and-confidence.md`, `references/inspection.md`,
`references/states.md`, `references/severity-and-prioritization.md`.
Per lens (read each file's quick rules/checklist first):

| Lens | References |
|---|---|
| `ux` | `cognition-and-decisions.md`, `navigation-and-search.md`, plus the pattern references for the surfaces present (`forms-and-feedback`, `risk-and-recovery`, `data-dense-and-power-ui`, `onboarding-settings-auth`, `overlays`) |
| `interaction` | `states.md`, `forms-and-feedback.md`, `overlays.md`, `motion.md`, `risk-and-recovery.md` |
| `visual` | `layout-and-hierarchy.md`, `typography.md`, `color-and-theming.md`, `iconography-and-imagery.md` |
| `responsive` | `responsive.md` |
| `a11y` | `accessibility.md` |
| `design-system` | `design-systems.md` (+ `scripts/style-census.mjs`) |
| `distinctiveness` | `generic-ui-and-distinctiveness.md`, `art-direction.md` |
| `ai` (automatic if the product has AI features) | `ai-ux.md` (+ `ai-agent-oversight.md` for agent-supervision consoles) |

## Steps

### 1. Context
Read project context, design contract, DESIGN.md/tokens if present. If no project context, infer
it and ask ≤ 5 questions that would change conclusions (who are the users, primary flows, target
platforms, brand/design-system constraints, known pain points). Do not block on answers if the
user wants you to proceed — record assumptions.

### 2. Environment
Detect browser tooling and how to run the app (`inspection.md` §1). Decide: rendered mode or
static mode. State it.

### 3. Map
Write the flow/surface map (`inspection.md` §2): goals → flows (core/secondary) → surfaces →
relevant states → design-system sources. This is the audit's frame; findings must attach to it.

### 4. Inspection plan
Build the plan: surfaces × viewports × states × lenses. Keep it proportional — a single component
does not need 8 viewports; a checkout flow needs every error state. Note what you will
deliberately skip.

### 5. Gather evidence
Execute the plan (`inspection.md` §3–8). For each observation capture: location, viewport, state,
source, artifact. Run `scripts/style-census.mjs` for the design-system lens. Keep notes as raw
observations first — no conclusions yet.

### 6. Hypothesize, then challenge
Turn observations into candidate findings (interpretation + why it matters). For every
candidate that would be `high` or `critical`, look for counter-evidence (alternate path, handled
elsewhere, intentional per the contract). Downgrade or drop what doesn't survive.

Apply the lens checklists to catch what observation alone missed. For generic-looking patterns
use pattern + context + purpose + execution (`generic-ui-and-distinctiveness.md`).

### 7. Write findings
One finding per distinct problem, following `schemas/finding.schema.json`: stable `id` with
category prefix, severity from anchors, evidence with sources, interpretation, why it matters,
recommendation, **verification criterion**, confidence with caps applied, basis, reach, effort.
Recommendations state the *direction* of the fix; detailed design belongs to `design`.

ID prefixes by category (sequence per prefix, continuing from earlier reports so IDs stay
stable): `UX` ux-flow · `NAV` navigation · `IA` information-architecture · `CONT` content ·
`FORM` forms · `STATE` states · `ERR` error-handling · `INT` interaction · `OVL` overlays ·
`MOT` motion · `VIS` visual-hierarchy · `LAYOUT` layout · `TYPE` typography · `COLOR` color ·
`ICON` iconography · `IMG` imagery · `RESP` responsive · `A11Y` accessibility · `DS`
design-system · `PERF` performance-perception · `ONB` onboarding · `AUTH` authentication ·
`SET` settings · `DATA` data-dense · `AI` ai-ux · `TRUST` trust · `DIST` distinctiveness.

### 8. Cluster and prioritize
Group by root cause; apply gates, scores and tie-breakers
(`severity-and-prioritization.md`). Pick the Top 5 actions with "ranked above … because".

### 9. Rate and assess
Dimension ratings with confidence and coverage (or `not assessed`). One-line verdict. Run the
distinctiveness assessment (counterfactual test) if that lens applies.

### 10. Report
Write `.claude/ui-ux/audits/<YYYY-MM-DD>-<scope-slug>.md` from `templates/audit-report.md`.
In chat, give: verdict, coverage/confidence in one line, the Top 5, counts by severity, and the
report path. Do not paste the whole report unless asked.

### 11. Stop
Offer next steps — `design` for problems that need a direction, `improve` for the Top N — and
wait. Do not start changing code.

## Scope variants

- **Single component / design-system piece:** map = variants × states × containers; lenses
  usually visual, a11y, design-system, responsive (container-level).
- **Design-system audit:** follow `design-systems.md` § Audit procedure inside this workflow.
- **Landing / marketing page:** weight hierarchy, content, performance perception, responsive,
  distinctiveness; interaction states are fewer but forms/CTA states still matter.
- **Screenshot-only audit (user provides images):** sources are `SCREENSHOT`/`USER`; no
  interaction or hidden-state claims; say which states the images don't show.

## Quality bar before delivering

- Every finding has evidence with a source, and wording matches its confidence.
- No finding is a disguised implementation instruction without a user/task reason.
- Coverage table present; `not assessed` used where needed.
- Severity counts are plausible (not everything is high; not 60 findings for one screen —
  merge into root causes).
- Accessibility floor checked even if the lens wasn't requested.
- Nothing in the code was modified.
