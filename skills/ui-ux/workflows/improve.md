# Workflow: improve

**Question answered:** implement prioritized UI/UX improvements and prove they worked.

This is the only mode that changes product code.

## Inputs (one of)

- Finding IDs from an audit report (`RESP-003 A11Y-001`), or "critical", "top 5", "RC-02".
- A design contract / chosen direction to implement.
- A direct request ("fix the mobile nav") — then run a **scoped mini-audit** first (steps 1–7 of
  `audit.md` on that surface) so the change has a baseline and a verification criterion.

## Load

`references/evidence-and-confidence.md`, `references/inspection.md`, `references/states.md`,
the references behind each targeted finding, `references/design-systems.md` (to reuse tokens and
components), `references/frontend-implementation.md` (platform primitives).

## Steps

If the work requires decisions that aren't settled yet — a new visual direction, a new token
architecture or naming scheme, a navigation model change, a design-system migration strategy —
run `workflows/design.md` first (or include a short options section with a recommendation in the
plan and get it approved). `improve` implements decisions; it doesn't make them silently.

### 1. Baseline
Locate the latest audit report and/or design contract. For each target finding, confirm the
evidence still reproduces (the code may have changed). If there's no report, capture a baseline
now: screenshots/measurements at the viewports and states that matter.

### 2. Plan
Write a short plan table:

| # | Change | Findings | Files/components | Verification (from finding) | Risk |
|---|---|---|---|---|---|

Order: root causes and dependencies first (e.g. tokens before components, layout primitives
before pages), then by priority. Prefer the design system's decision order:
1. existing pattern that solves it → 2. existing component variant → 3. composition of existing
components/tokens → 4. bounded extension consistent with tokens/contracts → 5. new component only
when the system can't express the need (say why).

Flag changes that alter behaviour users rely on, product copy/legal text, analytics hooks, or
public APIs.

### 3. Confirm scope
Show the plan and wait for approval — unless the user already said to proceed. Keep the change
set reviewable; split very large plans into batches.

### 4. Implement the representative slice first
For directional changes, implement one information-rich screen/flow end-to-end (all relevant
states, responsive behaviour, accessibility) before scaling. Check it rendered; refine or pivot
before propagating.

Implementation rules:
- Use semantic tokens/roles, not new literals; extend tokens deliberately if needed.
- Use native semantics and platform primitives before custom ones (`frontend-implementation.md`,
  `overlays.md`, `accessibility.md`).
- Implement states and reduced-motion/dark/zoom behaviour together with the default, not later.
- Keep DOM/focus order aligned with visual order.
- Don't fix unrelated issues silently — note them as new findings.

### 5. Render and verify each change
Re-run the inspection for every change at the **same viewports and states as the original
evidence**, plus the states the change touches. Check the finding's verification criterion
literally. Also check for regressions in neighbouring surfaces and other viewports.

A passing build/test suite is necessary, not sufficient. If you cannot render, mark the finding
`needs-verification` and list exactly what to check — never `fixed`.

### 6. Re-audit
Update each target finding's `status`: `fixed` (verified with evidence at ≥ the original
evidence level), `partially-fixed`, `needs-verification`, or still `open`. Record new findings
introduced or discovered. For substantial redesigns, recommend running `review` in a fresh
context to counter self-evaluation bias.

### 7. Report
Summarize: what changed (files), which findings moved to which status with evidence, what
regressed or remains, what needs human/AT verification. Append a "Re-audit" section to the
audit report (or create `.claude/ui-ux/audits/<date>-<scope>-improve.md`).

## Definition of done

- Every targeted finding has verification evidence at least as strong as the evidence that
  detected it.
- States and viewports touched by the change were inspected.
- No new `high`/`critical` regressions in the touched surfaces.
- Accessibility floor holds (focus visible, names, contrast, keyboard, reflow).
- The change respects the design contract or documents a deliberate exception.
