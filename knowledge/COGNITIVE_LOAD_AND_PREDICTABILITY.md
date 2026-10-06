# Cognitive load and predictable interaction

## Decision rule

Reduce **avoidable memory, interpretation, and relearning**, not useful complexity. A powerful product may legitimately expose many concepts; the design failure is making users repeatedly reconstruct relationships, remember transient facts, re-enter known information, or relearn equivalent controls.

For agents, prefer this order:

1. **Recognition before recall** — keep relevant choices, state, constraints, and prior input available where the decision is made.
2. **Reuse learned structure** — equivalent functions should remain recognizable across views; preserve stable labels, control behavior, relative structure, and help placement unless context creates a real reason to differ.
3. **Carry information forward** — do not ask users to retype information already supplied in the same process when it can safely be populated or selected.
4. **Externalize transient state** — show applied filters, selections, progress, pending consequences, prerequisites, and recoverable history instead of relying on memory.
5. **Make complexity conditional** — progressive disclosure is useful when secondary information can genuinely wait; hiding information needed to understand the current choice merely moves cognitive cost into navigation and memory.
6. **Preserve escape and help** — when a process is difficult, predictable help and recovery matter more than decorative simplification.

## Cognitive load is not “number of things on screen”

Do not optimize blindly for fewer visible controls. Removing visible options can increase memory burden when users must remember what is hidden, where it lives, or what state was previously selected.

A dense expert interface can be cognitively efficient when its spatial structure, terminology, shortcuts, state, and interaction model remain stable. Conversely, a visually sparse wizard can be cognitively expensive if each step removes context needed for the next decision.

Treat these as separate costs:

- **perceptual search:** finding the relevant object;
- **interpretation:** understanding what it means;
- **working-memory demand:** retaining facts while acting elsewhere;
- **relearning:** adapting to inconsistent representations of the same function;
- **coordination:** moving information between views, devices, or steps;
- **decision complexity:** complexity inherent to the task itself.

Design can reduce the first five. It should not pretend to remove irreducible domain complexity by concealing it.

## Consistency is functional, not cosmetic

WCAG 2.2 requires consistent identification for components with the same functionality. W3C cognitive-accessibility guidance goes further: stable visual treatment, state/focus presentation, layout, and content organization let users apply what they learned on one view to the next.

Therefore:

- preserve recognizable identity for equivalent actions;
- do not rename or relocate a recurring action merely for local visual variety;
- do not require pixel-identical layouts when context differs;
- allow labels to vary when context changes the meaning while preserving recognizability;
- keep repeated help mechanisms in a consistent relative order, as required by WCAG 2.2 SC 3.2.6 when applicable.

**Anti-pattern:** generating each route as an independently “beautiful” composition and thereby forcing users to relearn navigation, action placement, state styling, or terminology.

## Carry state instead of testing memory

WCAG 2.2 SC 3.3.7 requires information previously entered or provided in the same process to be auto-populated or available for selection, subject to essential/security/validity exceptions. This is a useful product rule beyond formal conformance:

- preserve shipping/contact details between relevant steps;
- show prior selections when reviewing or revising a workflow;
- preserve filters/sort when returning to a result set when that matches task intent;
- show source facts beside a decision rather than asking users to remember them from a previous screen;
- prefer copy/select/deep-link mechanisms over transcription between surfaces.

Security is not a blanket excuse for memory tests. WCAG 2.2 SC 3.3.8 treats memorization, manipulation, and transcription during authentication as cognitive-function tests and requires an alternative or assisting mechanism unless an exception applies. Password-manager support, paste, and device-based authentication are examples of mechanisms that reduce this burden.

## Error prevention: shape friction to consequence and recoverability

Do not add a confirmation dialog merely because an action is labelled destructive. Choose the safeguard from the **cost of a mistake, reversibility, scope, frequency, and whether the user can meaningfully verify the consequence before committing**.

Use this hierarchy as a design heuristic, not a compliance formula:

| Situation | Prefer | Why |
|---|---|---|
| Low impact + reliably reversible | Execute + visible undo/recovery | Avoids repetitive interruption while preserving recovery. |
| Detectable invalid or contradictory input | Prevent/flag at the point of error + preserve input | The system already knows what is wrong; a generic confirmation adds little. |
| Consequential but reviewable transaction | Review/summary step with correction path | Users can inspect the facts that determine the outcome before commitment. |
| Irreversible or high-blast-radius destructive action | Explicit consequence-focused confirmation | A mistaken activation can cause serious loss and recovery is unavailable or costly. |
| Extremely high-impact deletion where identity/scope confusion is plausible | Consider stronger deliberate confirmation, such as re-entering a resource identifier | Adds friction specifically to verify target/scope; do not cargo-cult typed confirmation onto ordinary deletion. |

WCAG 2.2 SC 3.3.4 is an important boundary: for legal commitments, financial transactions, deletion/modification of user-controllable stored data, and test responses, **reversible, checked, or confirmed** are alternative sufficient strategies at Level AA. W3C explicitly notes that the criterion is not intended to require confirmation for every save or ordinary edit. This supports a broader design principle: **recovery can be a prevention strategy**, and confirmation is not automatically the safest or most usable choice.

### Confirmation quality

When confirmation is justified:

- name the actual action and target (`Delete “Quarterly forecast”`), not generic `Are you sure?`;
- expose the material consequence and whether recovery exists;
- make the final action label describe the commitment (`Delete project`, `Pay €240`, `Publish to all customers`), rather than `OK`;
- include the facts users need to verify inside the confirmation/review surface; do not force them to remember obscured background content;
- do not rely on danger color alone to communicate consequence;
- do not use confirmation to compensate for ambiguous labels, tiny targets, unstable layouts, or unsafe defaults—fix the initiating interaction too.

Carbon's current guidance provides a useful production example of consequence-shaped friction: low-impact/reversible deletion may proceed without warning, medium irreversible deletion uses consequence confirmation, and high-impact irreversible deletion may require entering the resource name. Treat that as a design-system policy example, not empirical proof that these exact tiers are universally optimal.

### Repetition changes the trade-off

A confirmation that is appropriate for an exceptional irreversible action can become harmful ritual when placed on a frequent operation: users must repeatedly interrupt their task and may stop inspecting boilerplate. Carbon likewise advises using modals sparingly and moving repeatedly performed work onto the main page when practical. Therefore assess **frequency together with consequence**; never infer safeguard strength from the word “delete” alone.

For repeated low-risk destructive actions, invest in robust undo/recovery, clear post-action feedback, and preserving the user's context. For repeated high-risk operations, do not simply remove safeguards because they are annoying; redesign the workflow so scope and consequences are reviewable with less repetitive modal friction.

## Progressive disclosure: useful boundary

Use progressive disclosure when secondary controls or explanation are not needed to understand the current state or make the current decision. Keep information visible when hiding it would require users to remember it, repeatedly reopen panels, or lose causal context.

Good candidates to defer:
- infrequent advanced configuration;
- optional detail after a clear summary;
- destructive/administrative controls outside the primary flow;
- diagnostic detail behind a readable status.

Poor candidates to hide:
- active constraints or filters;
- why an action is unavailable;
- consequences needed to choose safely;
- validation that changes the next decision;
- state the user must compare with another visible value.

## Disabled controls

A disabled control can lower accidental-action risk but increase interpretation cost if the reason is invisible. When users can remedy the condition, expose the prerequisite or path to enablement near the control or at the point of need. WCAG 3.0's current draft explicitly explores a supplemental requirement that visible disabled controls have an available explanation; treat this as emerging direction, not a current WCAG 2.2 conformance requirement.

Prefer hiding a control only when the action is genuinely irrelevant or unavailable to that user/context and its absence will not create a discovery problem. Prefer visible + explained when knowing that the capability exists, or how to unlock it, matters.

## Agent review checklist

Before simplifying or reorganizing a workflow, ask:

- What must the user remember from another view or earlier step?
- Which facts can the interface carry forward instead?
- Are equivalent functions still recognizable across views?
- Did visual simplification hide state, prerequisites, consequences, or recovery?
- Does progressive disclosure reduce distraction, or merely create navigation/recollection work?
- Can users paste, select, autofill, or authenticate with a mechanism instead of transcribing/recalling?
- If a control is disabled, can users discover why and what to do next?
- For a risky action, what are the actual consequence, reversibility, scope, frequency, and best recovery path?
- Does a confirmation expose information the user can genuinely verify, or merely demand an extra click?
- Does an expert workflow benefit more from stable density than from repeated disclosure?

## Evidence boundary

The strongest evidence here is accessibility standards and W3C cognitive-accessibility guidance. WCAG establishes concrete requirements for important submissions and explicitly permits reversibility, checking, or confirmation as alternative safeguards. Carbon and GOV.UK provide mature deployed design-system policies that independently shape confirmation friction around consequence/irreversibility. They are not controlled evidence that a particular modal tier, typed-confirmation pattern, or undo duration minimizes errors in every product. Claims about task speed, warning habituation magnitude, optimal undo windows, or exact confirmation thresholds require context-specific usability evidence.

## Sources

- W3C WAI, *Understanding SC 3.2.4: Consistent Identification* (WCAG 2.2): https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification
- W3C WAI, *What's New in WCAG 2.2* — SC 3.2.6 Consistent Help, 3.3.7 Redundant Entry, 3.3.8 Accessible Authentication: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- W3C WAI, *Understanding SC 3.3.8: Accessible Authentication (Minimum)*: https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum
- W3C WAI, *Understanding SC 3.3.4: Error Prevention (Legal, Financial, Data)*: https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data
- W3C WAI, *Use a Consistent Visual Design* (supplemental cognitive accessibility guidance): https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p03-consistent-design/
- W3C WAI, *Provide Human Help* (supplemental cognitive accessibility guidance): https://www.w3.org/WAI/WCAG2/supplemental/patterns/o7p01-human-help/
- Carbon Design System, *Remove*: https://www.carbondesignsystem.com/community/patterns/remove-pattern/
- Carbon Design System, *Modal*: https://www.carbondesignsystem.com/components/modal/usage/
- GOV.UK Design System, *Button* — warning/destructive actions: https://design-system.service.gov.uk/components/button/
- W3C, *WCAG 3.0 Working Draft*, including consistency/help and disabled-control proposals; draft status means requirements may change: https://www.w3.org/TR/wcag-3.0/

Last researched: 2026-10-06.
