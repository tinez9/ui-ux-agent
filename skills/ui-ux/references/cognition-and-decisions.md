# Cognition and decision architecture

Durable principles about how people understand products, choose, remember, trust and learn —
the layer under every pattern.

## Quick rules

1. **Simplify interaction, not causality.** Hide machinery freely; never hide a concept whose
   misunderstanding changes what users choose, pay, share, lose or can recover.
2. Design the **product world first**: objects → relationships → states → actions → consequences → scope.
3. One concept, one name; same action, same verb; same look, same behaviour (WCAG 3.2.4 and beyond).
4. "Too many choices" is not a number. Reduce *effective* complexity (clarify, group, prioritize,
   stage only on real dependency, add narrowing) before removing capability.
5. Recognition over recall for actions users must discover, understand or reliably repeat;
   hidden surfaces (overflow, context menu, shortcuts, palette) are accelerators, not homes for
   required functions.
6. Progressive disclosure defers what is *safely obtainable on demand*, never what is needed
   *before this decision*.
7. Defaults are decisions: justify them from user welfare, not KPI; consent and recurring money
   need affirmative action.
8. Trust is **calibration**, not reassurance: predictable behaviour, legible state, visible
   consequences, real reversibility.
9. Preserve the learned map: adapt *around* stable locations; never mistake exposure for preference.
10. One capability model, many access paths: novices find it, experts accelerate it, automation
    reuses it — same semantics everywhere.

## Mental models and conceptual integrity

A **mental model** is the user's belief about objects, relationships, states and consequences; the
**conceptual model** is what the product presents to support useful beliefs. Users differ (domain,
expertise, prior products); there isn't one universal mental model.

**Expose a concept when it has:** decision relevance (could change the choice) · consequence
relevance (cost, privacy, permissions, eligibility, ownership, scope, persistence, reversibility) ·
state relevance · relationship relevance (owner/editor, source/derived, local/shared,
draft/published) · recovery relevance · transfer relevance (recurs across workflows).

**Concept test before simplifying/merging/renaming/automating:** what behaviour does it explain?
could two identical-looking actions produce different outcomes because of it? does it affect
money, data, authority, audience, permanence or recovery? if hidden, can the UI still explain the
consequence at the decision point? can users recover without learning it after failure? If (2 or
3) and not (4 or 5) → the abstraction is too aggressive.

**Distinctions not to merge visually:** saved vs published · local vs synced · owner vs editor ·
archive vs delete · scheduled vs completed · draft AI output vs committed side effect · source
evidence vs generated interpretation · permission to view vs to modify.

**Implementation leakage** — users must understand service boundaries, sync mechanics, schema
artifacts, team-specific synonyms, hidden propagation, raw technical statuses. Surface technical
detail only when it changes a decision (cost, risk, timing, permissions, privacy, reliability).

**Familiar metaphors** are priors, not vetoes: reuse them while their predictions hold; drop them
when they start lying about behaviour, and make the new rule observable.

**Test predictions, not vocabulary:** "where would you look for X? what happens if you
move/delete/share this? who can see it now? is this a copy or the same object? what persists?"
Repeated wrong predictions = model mismatch; fix the model before adding explanatory copy.

**Coherence across surfaces:** navigation, search, settings, notifications, palettes, URLs, errors,
AI-generated copy all reuse the canonical vocabulary. A design system should include semantic
vocabulary, not only tokens.

Failure modes: false simplicity · synonym drift · same appearance, different semantics ·
implementation leakage · hidden mode (behaviour depends on non-visible mode/scope) · automation
erases causality · documentation repairs the UI (fix the decision surface instead).

Audit questions users should be able to answer *before acting*: what object am I changing? who/what
is affected? what happens if I continue? private or shared, draft or committed, temporary or
persistent? can I reverse it, how? where would I look to recover?

## Choice architecture

Choice overload is **conditional**: meta-analyses find near-zero average effect, rising with set
complexity, task difficulty, preference uncertainty and an effort-minimizing goal. Hick-Hyman
does not justify "max 5/7 items". Distinguish decision cost from visual search cost; ten clearly
differentiated, familiar commands can beat four ambiguous ones.

Levers, in order:
1. **Clarify the decision** — labels describing outcomes/goals, not internal categories.
2. **Group by meaningful relationship** (scope, purpose, comparison), semantically too
   (`fieldset/legend`, headings, regions).
3. **Hierarchy, not arbitrary scarcity** — one likely-next action; don't demote recovery/safety.
4. **Stage only on real dependency** — wizards for independent choices add navigation cost and
   hide the option space.
5. **Narrowing for legitimately large sets** — search, filters, categories, favorites, recents,
   contextual ranking, with a route back to the full set.

Identify the task type first: **explore · compare · choose · configure · retrieve a known
command**. Comparison needs simultaneous visibility; known-command retrieval tolerates search/palettes.

Failure modes: magic-number minimalism · false Hick certainty · wizard inflation · category
laundering (opaque buckets) · priority flattening · over-hierarchy (alternatives invisible) ·
adaptive reshuffling · expert trap · novice trap · comparison amnesia · semantic mismatch (compact
custom widget with wrong ARIA).

## Recognition, discoverability and placement

Classify each action: **required · primary · contextual · secondary · expert accelerator**.

| Placement | When |
|---|---|
| visible / directly reachable | required to progress, primary/frequent, consequential, needed for recovery/escape, not inferable from convention, needed by novices |
| contextual reveal | only meaningful after a selection/state; keep a visible cue; never hover-only for task-critical controls |
| overflow | lower-frequency, lower-priority — not a dumping ground |
| shortcuts / palette | accelerators for retrieval speed after learning; not first-use discovery |
| context menu | secondary access for object-local repeated actions; never the only path |

Before hiding: need? frequency? consequence? recoverability? audience? what visible cue tells
users where it went? will it keep identity/location across contexts? Hiding that forces users to
memorize existence/location hasn't reduced cognitive load — it moved it. Keep visible labels and
accessible names aligned (WCAG 2.5.3, speech input). Hidden recovery (undo, cancel, restore,
history) must not be less discoverable than the destructive action.

## Progressive disclosure

Keep visible what materially affects: whether to start/continue · meaning, consequence, price,
eligibility, scope, privacy, reversibility · interpretation of current state · comparison ·
recovery · discovery of capabilities users can't infer. Disclose: advanced configuration, optional
explanation, uncommon variants, diagnostics, expert controls.

Disclosure has a **discoverability tax**: users must infer that more exists, where, what it
contains, and whether revealing it changes state. Use descriptive triggers ("Advanced filters",
"Show 8 more results"), persistent summaries/counts of collapsed state, native `button` +
`aria-expanded`, headings around accordion buttons, no `menu` role for ordinary nav. Never let
collapsed sections hide errors, newly applied constraints, active filters or changed values.

In-place disclosure when subordinate to the current decision; staged flow when later questions
depend on earlier answers or eligibility may end the journey. Don't fragment short tasks.

Failure modes: complexity laundering · capability burial · accordion everything · hidden active
state · disclosure nesting (`More → Advanced → Details`) · false simplification · semantics by
appearance · conceptual deception ("Share" hiding different audience models; "Save" that publishes).

## Defaults

Before preselecting: consequence if unnoticed? reversibility? preference confidence (user evidence
or business wish)? materiality (money, privacy, permissions, sharing, safety, rights, data loss,
recurring commitments)? switching friction? comprehension? symmetry of alternatives?

- low consequence + reversible + confident → convenience default;
- meaningful consequence or weak confidence → visible, easy to inspect/change;
- consent, recurring payment, destructive action, material permission → affirmative action;
  never pre-ticked boxes, silence, dismissal or "continue" as consent.

Defaults act as starting point, implied endorsement, effort asymmetry, information shortcut and
inaction path at once. Acceptance of a default is **not** evidence of preference. Keep explicit
prior choices across redesigns/migrations; label personalized defaults when it matters; reserve
"recommended" for defensible evidence. No default when it would fake a preference or create harm
(high-stakes exclusive alternatives, permission exposure, deletion/retention, recipients) — but
don't force choices among low-risk options just to look neutral.

Failure modes: conversion-optimized default · consent by inertia · hidden-default trap · sticky
migration · "recommended therefore safe" · personalized-default feedback loop · default churn.

## Trust and perceived control

Optimize **calibration** — accurate expectations plus proportionate control when they're wrong.

Mechanics: **predictability** (stable names/behaviour) · **legible state** (current, in progress,
done, failed, changed — where it matters) · **consequence visibility** before acting ·
**reversibility** with predictable undo scope · **correction** paths (repeated corrections signal
behaviour needs redesign) · **transparency at decision boundaries** (permissions, data use,
automation, side effects — not every implementation detail) · **stable agency** (no surprising
context changes on focus/input).

Control is not the number of controls: it's the ability to **predict, intervene, correct, reverse
or exit** at meaningful boundaries. More settings and confirmations can reduce control.

Feedback proportional to severity:
1. ambient state (no interruption) → 2. transient confirmation (only when outcome isn't
self-evident) → 3. actionable failure (what failed, what's intact, next step) → 4. interruptive
warning (serious, unexpected, hard to recover). Overused alerts lose force.

Failure modes: reassurance exceeding guarantees · hidden uncertainty/partial completion/stale data
· inconsistent names · silent automation · confirmation habituation · settings instead of good
defaults · ambiguous undo · explanations after the side effect.

## Novice to expert: progressive acceleration

Visible path → learnable accelerator → expert path → automation path, all invoking **one domain
operation** (same validation, permissions, confirmation policy, undo, analytics, resulting state).
Test: *if every shortcut, tooltip, palette and gesture disappeared, could users still discover and
complete the important task?*

Teach accelerators where intent exists (shortcut beside the menu item; searchable shortcut help;
dismissible hints after meaningful repetition), not via shortcut tutorials. Preserve platform
shortcuts. Single-character shortcuts must be disable-able/remappable or focus-scoped (WCAG 2.1.4;
speech input). Keyboard acceleration ≠ keyboard accessibility. Expert ≠ keyboard: touch experts
need direct manipulation, contextual actions, batch, favorites, presets. Don't infer a permanent
"expert" identity and hide labels or move controls.

## Adaptive interfaces and spatial stability

Prefer: improve base IA → user customization (adaptable) → non-displacing adaptive cues → adaptive
reordering only when prediction quality, reversibility and evaluation justify instability. Static
menus beat frequency-based reordering in controlled studies; adaptation effects vary by technique
and raise memorization load.

Architecture: **stable core** (navigation, object model, primary and safety actions) ·
**user-controlled layer** (favorites, pins, saved views, toolbar customization) · **adaptive edge**
(recents, recommendations, ranked search, contextual suggestions). Adapt by highlighting, separate
recents, ranking inside dynamic surfaces — not by moving canonical controls.

For recommendation-like surfaces, separate **exposure**, **behaviour**, **explicit preference**
and **context**; clicks on promoted items are confounded by promotion. Provide distinct controls
(hide here · not interested · exclude from personalization · pause learning · edit inferred
interests · reset with stated scope) and deliberate exploration where discovery is the value.

Failure modes: frequency trap · moving-target navigation · prediction hides capability ·
self-reinforcing ranking · context becomes identity · "not clicked" read as dislike · controls
without model effect · shared-screen inconsistency · adaptation without provenance ·
personalization as decoration.

## Evidence boundary

W3C cognitive-accessibility guidance and WCAG (3.2.4, 2.5.3, 2.1.4) support predictability,
consistency, visible controls and recognition; NN/g supports recognition over recall and the cost
of hidden navigation; choice-overload meta-analyses (2010, 2015) show context dependence; privacy
field studies, EDPB and FTC guidance support affirmative consent and the material effect of
defaults; adaptive-menu studies (2004–2026) support spatial stability. Concept-exposure tests,
action placement classes and the stable-core model are synthesis — validate with domain users when
consequences are material.
