# Workflow: review

**Question answered:** did these changes solve the problems they targeted, respect the design
contract, and avoid regressions?

**Read-only.** Same write restrictions as `audit`.

## Inputs (any combination)

- A diff, branch, PR or list of changed files.
- A previous audit report (to verify its findings).
- The design contract (to check conformance).
- "Review what you just did" — treat your own work with the same skepticism as anyone else's.

If there is nothing to verify against (no diff, no prior report, no contract) and the user simply
wants an interface evaluated, switch to `workflows/audit.md` and say so in one line.

## Load

`references/evidence-and-confidence.md`, `references/inspection.md`, `references/states.md`,
`references/severity-and-prioritization.md`, plus the references for the lenses the changes
touch. `references/design-systems.md` when tokens/components changed.

## Steps

### 1. Establish what changed
From the diff: surfaces, components, tokens, routes affected — directly and indirectly (shared
components and tokens propagate). List the findings the change claims to address.

### 2. Plan verification
For each targeted finding: its `verification` criterion and the viewports/states of its
original evidence. For the change set: the surfaces to regression-check and the states they
touch. For design-contract conformance: the invariants and anti-goals that apply.

### 3. Verify findings
Re-inspect. Classify each targeted finding:

| Status | When |
|---|---|
| `fixed` | verification criterion met, evidence ≥ original evidence level |
| `partially-fixed` | improved but criterion not fully met (say what's missing) |
| `still-open` | no material change |
| `regressed` | worse than baseline, or fixed then broken elsewhere |
| `needs-verification` | cannot be verified with available evidence (e.g. needs AT, real data, device) |

### 4. Look for regressions and new issues
Inspect touched surfaces in the states and viewports not covered by the original findings:
neighbouring components, other themes, narrow containers, keyboard paths, reduced motion. New
problems become new findings (new IDs).

### 5. Contract conformance
Check: tokens/roles used (not new literals), components reused, invariants kept (a11y floor,
states, responsive invariants), anti-goals not reintroduced, signature/restraint rules respected.
Deviations are classified with the drift triage in `design-systems.md` (violation, intentional
evolution, approved exception, legacy debt, stale contract, capture noise) — not auto-flagged as
bugs.

### 6. Report
A delta report: counts by status, each targeted finding with status + evidence, new findings,
regressions, contract deviations, remaining verification needs. Write it to
`.claude/ui-ux/audits/<date>-<scope>-review.md` (or chat-only if asked). Update statuses in the
original report only if the user wants the original kept as the living record.

## Reviewing code without rendering

Allowed, but declare static mode. Code-level review can confirm mechanisms (token use, semantic
elements, state handling present, focus management code) — not visual outcomes. Mark visual
findings `needs-verification` rather than `fixed`.
