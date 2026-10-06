# Workflow: design

**Question answered:** how should this product, flow or screen be designed or redesigned — and
why this direction over the alternatives.

Acts as a design director, not a style generator. **Does not edit product code.** Outputs are
design artifacts: direction options, a design contract, wireframes, acceptance criteria.

## Inputs

- A brief (new product/feature/screen), or audit findings to solve, or a redesign request.
- Project context, existing design contract, design system, brand assets, real content.

## Load

`references/art-direction.md`, `references/generic-ui-and-distinctiveness.md`,
`references/layout-and-hierarchy.md`, `references/cognition-and-decisions.md`,
`references/states.md`, `references/responsive.md`, `references/accessibility.md` (quick rules),
`references/design-systems.md` (when a system exists). Add pattern references for the surfaces
involved (navigation, forms, data-dense, onboarding, overlays, AI…).

## Steps

### 1. Understand (gate — no visual decisions before this)
Write a compact brief:
- product type, primary user(s), their goal, context of use (device, frequency, stress, expertise);
- the job of each surface in scope and the primary flow;
- **real content** and data density (ask for or extract real examples; never design around lorem ipsum);
- constraints: platform, tech stack, existing design system, brand, accessibility target, deadlines;
- success criteria: what would make this design measurably better (from audit findings or goals).

For features with domain complexity, write the conceptual model:
**objects → relationships → states → actions → consequences → scope** (`cognition-and-decisions.md`).

### 2. Constraints and freedoms
From the project and design system, list **invariants** (semantic tokens, components, a11y floor,
platform conventions, brand-critical rules) and **bounded freedoms** (composition, density,
imagery, expressive moments). Bounded creativity: preserve system integrity without forcing
every screen into the same template.

### 3. Structure before surface
Define hierarchy and flow for the representative screen(s): page purpose, primary action,
secondary actions, information grouping and order, navigation, key states, responsive priorities.
Use ASCII wireframes — they are cheap and keep attention on structure.

### 4. Decide whether to explore multiple directions
Produce **2–3 directions** when: new product or major redesign; the user asks to explore;
the current direction is generic or failing. Produce **one direction** (with at most minor
composition alternatives) when: the change is scoped; the design system/brand already fixes the
visual language; the user specified the direction.

Rules for multiple directions (`templates/design-directions.md`):
- They must differ in **at least two structural channels** (composition, typography, interaction
  model, density, imagery logic) — a palette swap is not a direction.
- Include one direction that stays close to conventions/the current system, to make the cost
  and value of distinctiveness visible.
- Each direction: visual thesis (one concrete sentence, not "modern/clean/premium"), key
  decisions per channel, the signature decision, what stays restrained, ASCII wireframe of the
  representative screen, mobile recomposition, risks, implementation cost.
- Run the **counterfactual test** on each: could this direction be applied unchanged to an
  unrelated product? If yes, it is not yet derived from this product.

### 5. Evaluate
Score each direction 1–5 per criterion **with a one-line justification per cell**:
usability/task fit · product fit · distinctiveness · accessibility feasibility · implementation
cost (5 = cheap) · consistency with existing system · scalability across screens/states.
Do not sum blindly; weigh by the project's priorities (e.g. an internal tool weights task fit and
cost over distinctiveness).

Then recommend one direction, say **what would change the recommendation**, and list its risks.

### 6. Stop for the choice
Present the options and the recommendation. Wait for the user to choose (or accept the
recommendation) before writing the contract — unless they explicitly asked you to decide.

### 7. Design contract
Write `.claude/ui-ux/design-contract.md` from `templates/design-contract.md`: product truth,
visual direction, system invariants, bounded freedoms, project-specific anti-goals, acceptance
criteria. If `DESIGN.md`/tokens exist, reference them as the authority instead of duplicating
values. Critique the contract against the brief before finalizing: replace any decision that
could be copied unchanged into an unrelated product.

### 8. Acceptance criteria and handoff
Define observable acceptance criteria for the representative slice (what must be true at which
viewports/states). Recommend implementing **one representative, information-rich slice first**
via `improve`, then evaluating it rendered before scaling the system.

## Evaluating a direction after it's built

Use four criteria (from Anthropic's frontend-harness experiments; strong for Claude workflows,
not universal UX proof): **design quality/coherence** (one product, distinct identity),
**originality** (deliberate custom decisions vs template/library defaults), **craft** (type
hierarchy, spacing, contrast, alignment), **functionality** (users understand and complete
tasks). Then decide: **refine** (thesis works, execution weak) or **pivot** (thesis generic or
mismatched). Don't keep a weak direction because implementation started; don't assume the
latest iteration is the best.

## Anti-patterns in this workflow

- Jumping from "it looks bad" to colors/fonts without the understanding gate.
- Adjective briefs ("modern, clean") never translated into concrete rules.
- Directions that are reskins of each other.
- Copying a reference's surface instead of extracting its relationships (`art-direction.md`).
- Designing only the default state and the desktop width.
- Writing a second source of truth that drifts from the real tokens.
