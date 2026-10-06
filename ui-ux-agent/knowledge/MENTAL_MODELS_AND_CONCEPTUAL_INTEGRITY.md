# Mental Models and Conceptual Integrity

## Research question
How should an interface decide which system concepts must remain visible so that simplification, progressive disclosure, and automation reduce effort without teaching users a false model of how the product behaves?

## Core rule
**Simplify interaction, not causality.** Hide implementation detail freely when it does not change a user's decision. Do not hide a concept when misunderstanding it can change what the user chooses, expects, pays, shares, loses, or can recover.

A useful interface does not need to expose the system's internal architecture. It does need a coherent *user-facing conceptual model*: stable objects, actions, states, relationships, boundaries, and consequences that let users predict what happens next.

## Evidence boundary
W3C cognitive-accessibility guidance directly supports familiar hierarchy, consistent identification, clear labels, visible control-to-effect relationships, recognition over memory, and predictable recovery. GOV.UK service patterns independently emphasize naming a service for the problem it solves, giving enough information to determine suitability, and using clear, consistent language. These sources strongly support predictability and conceptual consistency, but they do not prove one universal information architecture or vocabulary for every domain.

The rules below about concept exposure and abstraction boundaries are agent synthesis from those principles and should be validated with domain users when consequences are material.

## What belongs in the user-facing model
Expose or make readily inspectable a concept when one or more are true:

- **Decision relevance:** knowing it could change the user's choice.
- **Consequence relevance:** it changes cost, privacy, permissions, eligibility, ownership, scope, persistence, or reversibility.
- **State relevance:** users must distinguish states to understand what has happened or what remains possible.
- **Relationship relevance:** ownership, parent/child, source/derived, local/shared, draft/published, or similar relationships affect behavior.
- **Recovery relevance:** users need the concept to diagnose, undo, retry, restore, or escalate a problem.
- **Transfer relevance:** the same concept recurs across workflows and learning it once reduces future effort.

Hide or defer a concept when it is merely implementation machinery and exposing it does not improve prediction or control.

## Concept test before simplifying
For each concept proposed for removal, merging, renaming, or automation, ask:

1. What user-visible behavior does this concept explain?
2. Could two apparently identical actions produce different outcomes because of it?
3. Does it affect money, data, authority, audience, permanence, or recovery?
4. If hidden, can the UI still explain the consequence at the decision point?
5. Can users recover without learning the hidden concept after failure?
6. Will another part of the product use a different name or metaphor for the same thing?

If answers 2 or 3 are yes and 4 or 5 are no, the abstraction is too aggressive.

## Preserve semantic distinctions that change behavior
Do not merge states or objects merely because they look similar. Examples include:

- saved vs published;
- local vs synced;
- owner vs editor;
- archive vs delete;
- scheduled vs completed;
- draft AI output vs committed side effect;
- source evidence vs generated interpretation;
- permission to inspect vs permission to modify.

A visual simplification is safe only if the collapsed distinction is not needed for the current decision and remains discoverable before it matters.

## Consistency is semantic, not merely visual
W3C WCAG 3.2.4 requires repeating functions to be identified consistently, and supplemental cognitive guidance explains that inconsistency increases relearning and cognitive load. Apply this beyond component styling:

- one concept should have one preferred name;
- the same action should not change verbs across surfaces without reason;
- identical labels should not perform materially different actions;
- visual sameness should imply behavioral sameness;
- state names should survive navigation, responsive layouts, and alternate entry points;
- AI-generated copy must reuse the product vocabulary rather than invent synonyms for variety.

A design system should therefore include **semantic vocabulary**, not only tokens and components.

## Prefer recognition and visible relationships over memory
Do not require users to reconstruct hidden state from earlier steps. Keep consequential state near the action it affects: selected scope, audience, destination, active filters, permissions, pending changes, or current mode.

W3C specifically recommends making relationships between controls and affected content clear and avoiding processes that depend on memorized information. This matters especially when progressive disclosure separates configuration from outcome.

## Progressive disclosure boundary
Progressive disclosure is safe when deferred detail refines understanding without reversing the meaning of what is already visible.

It becomes conceptual deception when the collapsed surface implies a simpler model that is false. Examples:

- a single “Share” action hides materially different audience or permission models;
- a “Save” control actually publishes externally;
- a plan selector hides usage dimensions that determine price;
- an AI “Run” action hides that it will send messages or mutate external systems.

The remedy is not necessarily to expose every option. Surface the consequential distinction at the point where it can change the decision; defer the rest.

## Automation and AI
Automation creates a special conceptual-integrity risk because the system can remove intermediate steps that previously taught users what was happening.

For consequential agent actions, preserve a user-facing model of:

- **actor:** who/what will act;
- **scope:** which objects/accounts/people are affected;
- **authority:** what capability permits the action;
- **effect:** what state will change;
- **commit boundary:** proposed, staged, scheduled, or already executed;
- **reversibility:** what can actually be undone;
- **provenance:** where consequential claims or inputs came from when verification matters.

Do not expose chain-of-thought or internal implementation merely to appear transparent. Expose information that improves prediction, verification, or control.

## Responsive and adaptive interfaces
Responsive rearrangement may change layout without changing the conceptual map. Preserve labels, grouping meaning, state, and action relationships across breakpoints.

Adaptive/personalized interfaces should be especially cautious about moving or renaming learned controls. W3C notes that many users rely on familiar designs and consistent locations; personalization can help, but unpredictably changing the model imposes relearning cost.

## Failure modes

### False simplicity
The UI removes a concept that later becomes necessary to understand a surprising consequence.

**Fix:** reveal the distinction before commitment, not only in documentation or after failure.

### Synonym drift
Different pages or generated copy use varied words for the same product concept.

**Fix:** maintain a canonical vocabulary and test interface copy against it.

### Same appearance, different semantics
Controls look identical but have different scope, permanence, or side effects.

**Fix:** make the consequential difference visible in label, context, or confirmation.

### Implementation-model leakage
Database, API, billing, or agent internals are exposed even though users cannot act on them.

**Fix:** translate internals into stable user concepts; expose technical detail only for diagnostic/expert needs.

### Hidden mode
The same action behaves differently because of a mode or scope that is not locally visible.

**Fix:** show mode/scope at the action point and make mode changes observable.

### Automation erases causality
An agent performs several meaningful transformations behind a single progress indicator, leaving the user unable to explain the final state.

**Fix:** summarize consequential transitions and preserve an inspectable activity/history layer proportional to risk.

### Documentation repairs the UI
A misleading product model is left in place because help text explains the truth elsewhere.

**Fix:** repair the decision surface first; documentation is supplementary.

## Implementation contract for coding/design agents
Before implementing a non-trivial workflow:

1. List the user-facing nouns, verbs, states, and consequential relationships.
2. Mark which distinctions affect decisions, consequences, or recovery.
3. Choose one canonical label for each recurring concept.
4. Ensure each action's scope and effect are predictable from local context.
5. Check that responsive, empty, loading, error, and AI-generated states preserve the same conceptual vocabulary.
6. Verify that progressive disclosure hides detail, not a consequence-changing distinction.
7. Test a failure/recovery path: can a user explain what happened and what can be done next without learning implementation internals?
8. For AI automation, separate proposal/staging from committed external effects whenever that distinction exists.

## Evaluation
Do not evaluate conceptual integrity only by visual clarity. Test whether representative users can correctly answer, before acting:

- What object am I changing?
- Who or what will be affected?
- What will happen if I continue?
- Is the result private/shared, draft/committed, temporary/persistent?
- Can I reverse it, and how?
- Where would I look to understand or recover from an unexpected result?

Measure prediction errors and recovery failures, not just task completion. A fast task completed under a false model can create delayed errors elsewhere.

## Sources
- W3C WAI, *Help Users Understand What Things are and How to Use Them* — https://www.w3.org/WAI/WCAG2/supplemental/objectives/o1-understandable/
- W3C WAI, *Use a Familiar Hierarchy and Design* — https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p02-familiar-design/
- W3C WAI, *Use a Consistent Visual Design* — https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p03-consistent-design/
- W3C WAI, *Use Clear Visible Labels* — https://www.w3.org/WAI/WCAG2/supplemental/patterns/o4p06-clear-labels/
- W3C WAI, *Ensure Processes Do Not Rely on Memory* — https://www.w3.org/WAI/WCAG2/supplemental/objectives/o6-memory/
- W3C WAI, *Understanding SC 3.2.4 Consistent Identification* — https://www.w3.org/WAI/WCAG21/Understanding/consistent-identification.html
- GOV.UK Design System, *Start using a service* — https://design-system.service.gov.uk/patterns/start-using-a-service/
- GOV.UK Design System, *Check a service is suitable* — https://design-system.service.gov.uk/patterns/check-a-service-is-suitable/

## Maturity
**Developing.** The predictability/consistency/accessibility basis is strong and stable. The concept-exposure test is an operational synthesis rather than a validated universal model; high-consequence domains should test terminology and prediction with their actual users.
