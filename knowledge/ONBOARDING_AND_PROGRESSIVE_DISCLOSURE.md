# Onboarding and Progressive Disclosure

## Core rule

Onboarding is not a tour. It is the shortest support needed to move a user from **unoriented → able to obtain first value → able to continue independently**.

Prefer learning in the context where knowledge becomes actionable. Add dedicated onboarding only when the user cannot safely or reasonably discover the prerequisite while doing the task.

The design question is therefore not “what should we teach?” but:

> What is the smallest missing understanding, setup, or action preventing this user from reaching value now?

## Separate the jobs

Do not collapse these surfaces into one generic onboarding system.

| Surface | Job | Good trigger | Stop condition |
|---|---|---|---|
| Start / orientation | Explain what the product can do and whether it fits the user's need | Before commitment when suitability is unclear | User can choose whether/how to proceed |
| Setup | Collect or configure prerequisites genuinely required for value | A prerequisite blocks the first useful task | Minimum viable configuration exists |
| Empty-state guidance | Turn absence of content into the next meaningful action | User reaches an empty working surface | First object/action exists |
| Contextual hint | Explain a capability at the point it becomes relevant | Relevant UI + plausible user need | User acts, dismisses, or demonstrates knowledge |
| Spotlight / coach mark | Direct attention to a specific unfamiliar control | Important new/non-obvious capability | Capability is understood or dismissed |
| Tour | Explain a short connected workflow that cannot be learned locally | Workflow spans several unfamiliar steps | User can execute the workflow |
| Checklist | Externalize several meaningful activation tasks | Value requires multiple independent setup/actions | Tasks completed or no longer relevant |
| Reference help | Support recall or uncommon complexity | User requests help | Information need resolved |

A tooltip is not a substitute for missing labels; a tour is not a substitute for coherent navigation; a checklist is not a substitute for a product that can expose the next useful action itself.

## Progressive disclosure

Progressive disclosure should defer **secondary complexity**, not hide prerequisites, consequences, or essential controls.

Use it when:
- advanced choices would compete with the primary task;
- a capability only becomes meaningful after earlier state exists;
- expert controls can remain reachable without burdening the default path;
- contextual information is more useful at the moment of action than before it.

Do not use it when:
- the hidden information changes whether the user should proceed;
- consequences, price, permissions, eligibility, destructive effects, or required commitments would be revealed too late;
- repeated disclosure forces experts through unnecessary steps;
- users need to compare hidden options simultaneously;
- the product is concealing complexity rather than structuring it.

GOV.UK's suitability pattern provides a useful boundary: if essential eligibility can reasonably be stated up front, state it on the start page; only introduce a question flow when the rules are genuinely complicated. Its account guidance similarly recommends letting people use as much of a service as possible before requiring account creation. These are strong examples of delaying friction rather than delaying necessary truth.

## Activation over education

Measure onboarding against a meaningful product outcome, not completion of onboarding UI.

Useful questions:
1. Can the user explain what to do next?
2. Can they reach first meaningful value without replaying instruction?
3. Can they recover if they skip onboarding?
4. Does the guidance disappear once it is no longer useful?
5. Does a returning/expert user retain a fast path?

A 100% tour-completion rate can coexist with poor activation. Conversely, users who skip all onboarding but successfully perform the task may need no intervention.

Do not invent a universal “activation event.” Define it from the product's actual value loop and validate it with behavior and research.

## Tours and spotlights

Use tours sparingly. They are justified when several unfamiliar elements form one coherent workflow and learning them separately would be materially harder.

Rules:
- teach one actionable relationship per step;
- anchor guidance to the actual interface when possible;
- keep the underlying UI truthful and available rather than teaching an obsolete screenshot;
- allow exit and later recovery;
- do not block unrelated work unless completing the instruction is genuinely required;
- avoid replaying steps the user has already demonstrated;
- preserve keyboard/focus behavior and expose headings/structure to assistive technology;
- treat dismissal as information, not permission to nag elsewhere.

Atlassian's current Spotlight component is explicitly for focusing attention on a specific UI element, while its illustration guidance recommends simplified low-fidelity UI for onboarding/complex workflows rather than screen-within-screen screenshots. Treat this as mature product-system guidance, not evidence that tours improve outcomes universally.

## Empty states as just-in-time onboarding

An empty state is often the best onboarding surface because the user has already navigated to the relevant context.

A useful empty state answers only what matters now:
- what this area is for;
- why it is empty, if non-obvious;
- the primary next action;
- optionally, a compact example if the expected object is unfamiliar.

Do not turn every empty state into marketing. Once the user has data, the teaching surface should normally disappear.

## Checklists

Use a checklist when activation genuinely consists of multiple separable tasks and users benefit from seeing progress across sessions.

Checklist items should represent outcomes, not product tourism. Prefer “Invite one teammate” or “Connect a data source” over “Visit Settings.”

Avoid:
- rewarding meaningless clicks;
- listing optional features as mandatory setup;
- permanently occupying prime UI after activation;
- counting tasks that the system cannot verify reliably;
- forcing a fixed order when tasks are independent.

If tasks have a strict required order, model a workflow/step sequence instead of pretending they are independent checklist items.

## New-feature education

New-feature onboarding differs from first-run onboarding: the user already has a mental model and active work.

Prefer a local signal near the relevant capability, release/change surface, or contextual hint. Escalate to a spotlight/tour only when the change is important, difficult to discover, and materially alters the workflow.

Never make every shipped feature compete for attention. Attention is a finite product resource.

## State model

Onboarding should be stateful enough to avoid repetition but should not infer mastery from a single click.

Useful states can include:
- `not_relevant`
- `eligible`
- `shown`
- `dismissed`
- `acted`
- `demonstrated`
- `stale_after_major_change`

Keep **exposure** separate from **mastery**. `shown=true` is not `understood=true`.

For cross-device/account products, decide deliberately whether progress is local, account-level, workspace-level, or role-specific. A workspace admin completing setup does not imply every member understands the workflow.

## Failure modes

### Front-loaded classroom
Users must consume explanations before touching the product. Replace with minimum orientation plus contextual learning unless prerequisites truly demand instruction.

### Tour over broken IA
The tour says where things are because labels/navigation do not. Fix discoverability first.

### Premature commitment
Account creation, permissions, integrations, or profile completion are demanded before the user can judge value. Delay nonessential commitment.

### Hidden consequential information
Progressive disclosure conceals price, eligibility, permissions, destructive effects, or other decision-critical facts. Surface them before commitment.

### Celebration without value
Confetti/checkmarks reward setup completion even though the user has not achieved a useful outcome. Tie success to real product progress.

### Onboarding amnesia
The system repeatedly shows guidance because it stores exposure poorly, or suppresses needed help forever because it equates dismissal with mastery. Track states separately and retain user-invoked help.

### Feature-launch harassment
Every release introduces banners, dots, modals, and coach marks. Prioritize by user relevance and consequence; provide a quieter change log for the rest.

### Screenshot drift
Tutorial imagery no longer matches the product. Prefer live/contextual UI or deliberately abstract low-fidelity representations where exact pixels are unnecessary.

## Evaluation

Instrument the value path rather than only onboarding UI:
- time/steps to first meaningful outcome;
- abandonment before that outcome;
- setup errors and recovery;
- repeated help invocation at the same step;
- hint/tour dismissal followed by successful task completion;
- return success without onboarding replay;
- feature discovery among users for whom the feature is relevant;
- accessibility/keyboard completion of any blocking setup.

Segment results. New users, returning users, invited collaborators, administrators, experts, and users arriving with an explicit task may need different intervention.

Avoid causal claims from funnel correlation alone: users who complete onboarding may already be more motivated. Prefer controlled experiments when feasible, supplemented by usability observation to explain why behavior changed.

## Decision procedure for agents

Before adding onboarding UI:
1. Name the concrete user blockage.
2. Ask whether better IA, copy, defaults, or affordance removes it.
3. Identify the earliest point where the missing information becomes both relevant and actionable.
4. Choose the least interruptive surface that can resolve it.
5. Keep consequences and prerequisites visible before commitment.
6. Define dismissal, replay, persistence, role/scope, and accessibility behavior.
7. Define the real activation/value metric before measuring the onboarding surface.
8. Remove or retire the intervention when evidence shows users no longer need it.

## Evidence boundary

- **GOV.UK Design System — Start using a service / Check a service is suitable / Create accounts / Step-by-step navigation:** deployed public-service guidance with explicit research for some patterns; strong evidence for minimizing unnecessary preconditions and matching guidance to journey structure, but not universal SaaS outcome evidence.
  - https://design-system.service.gov.uk/patterns/start-using-a-service/
  - https://design-system.service.gov.uk/patterns/check-a-service-is-suitable/
  - https://design-system.service.gov.uk/patterns/create-accounts/
  - https://design-system.service.gov.uk/patterns/step-by-step-navigation/
- **Atlassian Design System — Spotlight / Onboarding / Illustration guidance:** mature shipped design-system patterns showing contextual spotlight mechanics and low-fidelity instructional imagery. The onboarding package history also demonstrates that component APIs evolve; copy implementation details only after checking current docs.
  - https://atlassian.design/components/spotlight/
  - https://atlassian.design/components/onboarding/
  - https://atlassian.design/guidelines/brand/illustrations/

No source reviewed in this cycle establishes a universal ideal tour length, checklist size, time-to-value threshold, or claim that product tours reliably improve activation. Treat those as product-specific hypotheses requiring validation.
