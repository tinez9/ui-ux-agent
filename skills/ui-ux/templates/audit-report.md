---
type: ui-ux-audit            # or ui-ux-review
scope: <routes / flows / components>
date: YYYY-MM-DD
commit: <git sha of the audited code, if available>
mode: rendered               # rendered | static | screenshots
browser_tool: <tool used, or none>
viewports: [390x844, 768x1024, 1440x900]
lenses: [ux, interaction, visual, responsive, a11y, design-system, distinctiveness]
design_contract: <path or none>
---

# UI/UX Audit — <scope>

## Verdict

<One or two sentences: overall state and the single most important thing to know.>

## Coverage and confidence

- **Environment:** <rendered with X / static / screenshots>, data: <seed/real/mock>.
- **Flows exercised:** <list, marked core/secondary>.
- **Not assessed:** <surfaces/states/lenses not covered and why>.

| Surface | default | loading | empty | error | validation | focus/keyboard | 390 | 768 | 1440 | 320/zoom | dark |
|---|---|---|---|---|---|---|---|---|---|---|---|
| <route> | observed | code-inferred | not covered | … | | | | | | | |

## Ratings

| Dimension | Rating (0–10) | Confidence | Coverage | Driven by |
|---|---|---|---|---|
| UX & flow | | | | <finding IDs> |
| Interaction & states | | | | |
| Visual & hierarchy | | | | |
| Responsive | | | | |
| Accessibility | | | | |
| Design system | | | | |
| Identity & distinctiveness | | | | |
| AI UX (if applicable) | | | | |

Counts: critical <n> · high <n> · medium <n> · low <n> · opportunity <n>

## Top actions

1. **<action>** — fixes <IDs / RC>. <why first; ranked above #2 because …>
2. …
3. …
4. …
5. …

Verify first (critical but low confidence): <IDs or none>

## Root causes

### RC-01 — <cause>
Symptoms: <finding IDs>. Systemic fix: <…>. Local fallback: <…>.

## Findings

### Critical

```yaml
id: <PREFIX-001>
title:
severity: critical
category:
location: { route: , component: , viewport: , state: }
evidence:
  - source: BROWSER
    observation:
    artifact:
interpretation:
why_it_matters:
hierarchy_tier:
affected_flow:
reach: core
recommendation:
verification:
confidence:
basis: []
effort:
root_cause:
status: open
```

### High
### Medium
### Low

## Opportunities

| ID | Opportunity | Value | Effort |
|---|---|---|---|

## Distinctiveness assessment

- **Counterfactual test:** could this visual direction be transplanted unchanged to an unrelated
  product? <answer with concrete evidence: which decisions are domain-specific, which interchangeable>
- **Identity ablation:** without logo / accent color / hero imagery, what character remains?
- **Assessment:** interchangeable · partly own · own — and whether that matters for this product.

## Assumptions and open questions

<What you assumed about users, goals, data; questions whose answers would change findings.>

## Knowledge gaps

<Questions the skill's references could not answer well — input for the maintainers.>

## Re-audit log

| Date | Mode | Findings fixed | Partially | Still open | Regressed | New |
|---|---|---|---|---|---|---|
