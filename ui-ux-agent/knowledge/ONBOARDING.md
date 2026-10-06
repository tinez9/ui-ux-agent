# Onboarding and Progressive Enablement

Onboarding is not a mandatory tour. It is the smallest set of interventions needed to help a user reach meaningful value, understand unfamiliar concepts, and become independently capable.

## Start from the activation gap

Before adding onboarding UI, identify the actual gap between entry and first meaningful outcome:
- missing data or setup;
- an unfamiliar concept or workflow;
- an undiscovered but necessary capability;
- lack of confidence about consequences;
- permissions/integration prerequisites;
- or no gap at all.

If the normal interface already makes the next useful action obvious, additional onboarding is likely friction.

## Prefer learning in the real task

A useful default hierarchy is:
1. make the product itself understandable;
2. use the natural empty/first-use state to explain what belongs there and expose the next action;
3. add contextual guidance at the moment a user encounters an unfamiliar capability;
4. use checklists/setup flows when several real prerequisites must be completed and order/progress matters;
5. reserve tours/spotlights for genuinely unfamiliar, distributed, or newly introduced capabilities that cannot be learned locally.

Do not use a tour to compensate for unclear labels, weak information architecture, or an interface that cannot explain itself.

Carbon's current empty-state guidance is useful production evidence: first-use empty states should explain what will occupy the space and provide the relevant next step; optional onboarding can supplement rather than replace that durable state. This is design-system guidance, not proof that one onboarding mechanism maximizes activation in every product.

## Empty-state onboarding is durable

First-use guidance embedded in the surface has several advantages over a transient walkthrough:
- it appears where the knowledge is needed;
- it remains available after a skipped introduction;
- it can provide the actual action that creates value;
- it disappears naturally when real content replaces it.

Keep it contextual and concise. Describe what will exist here, why it matters when necessary, and the strongest next action. Do not turn every empty panel into a promotional card or repeat illustrations across a dashboard.

## Progressive enablement, not progressive obstruction

Introduce complexity when the user has enough context to understand it. This can mean revealing advanced controls after a relevant object exists, exposing secondary features in context, or delaying account/setup requirements until they are necessary.

This does **not** mean hiding core capability indefinitely. Discovery failure is costly when a feature is required to complete the user's goal. In those cases, expose the capability in the primary workflow and teach locally rather than hoping users discover it later.

GOV.UK's account guidance provides a strong adjacent principle: when an account is necessary, let people use as much of the service as possible before forcing account creation. Generalize the friction principle cautiously; public-service transaction design is not identical to SaaS activation.

## Tours and spotlights are conditional

A tour is justified only when all of these are reasonably true:
- the knowledge is important to near-term success;
- the relevant elements are distributed enough that local guidance is insufficient;
- the user can understand the explanation before performing the task;
- the tour can be skipped/exited without making the product unusable;
- the guidance can be maintained as the interface changes.

Atlassian continues to ship a Spotlight system for focused onboarding messages and multi-step tours, which establishes this as a production pattern, not as evidence that tours outperform contextual learning.

Avoid tours that enumerate the navigation, point at self-explanatory controls, front-load features unrelated to the user's immediate goal, or force users to remember several explanations before they can act.

## Teach actions with actions

When safe, prefer a real or reversible task over a passive explanation. A useful onboarding step should advance product state, create meaningful content, connect required data, or practice a capability the user will immediately reuse.

Use sample/demo content only when its status is unmistakable and the transition to real data is clear. Do not let examples masquerade as user-owned production state.

## New-feature onboarding is not first-use onboarding

For an existing user, preserve their established workflow. Announce a new feature only when it is relevant to their role/context, then provide a direct way to try it or learn more. Do not replay generic onboarding or hijack login with unrelated release notes.

A spotlight can be appropriate for a high-value changed capability; ordinary improvements often need no interruption at all.

## Personalization and persistence

Onboarding state should reflect meaningful capability/setup state, not merely `tour_step = 4`.

Track separately when needed:
- prerequisite/setup completion;
- whether a contextual hint was dismissed;
- whether the underlying capability has actually been used;
- role/permission eligibility;
- product/version changes that invalidate prior guidance.

Do not equate dismissing a message with mastering the feature. Do not repeatedly resurrect dismissed guidance unless circumstances materially changed and the benefit justifies the interruption.

## Accessibility and interaction

Onboarding must not create a parallel inaccessible product:
- keep the underlying task operable when guidance is optional;
- maintain logical focus order and visible focus;
- make overlays dismissible and restore focus coherently;
- do not rely on animation, pointer gestures, or spatial language alone;
- ensure magnification/reflow does not detach callouts from meaning;
- expose step count/progress semantically when a sequence genuinely has steps;
- preserve the user's data if onboarding is exited.

If a spotlight behaves as a modal, it inherits the modal focus/inertness contract; visual appearance does not exempt it.

## Measure outcomes, not completion theater

Tour completion is weak evidence of onboarding success. Prefer product-relevant measures such as:
- time/steps to first meaningful outcome;
- setup or prerequisite completion;
- successful independent reuse of the capability;
- error/recovery rates during first attempts;
- abandonment at imposed onboarding gates;
- later discovery of important capabilities;
- support/help demand for the taught concept.

Instrument skip/dismiss behavior as diagnostic evidence, not automatically as failure. A user who skips guidance and succeeds may demonstrate that the guidance was unnecessary.

## Agent decision contract

Before implementing onboarding, answer:
1. What concrete first value or capability is the user trying to reach?
2. What exact knowledge/setup gap blocks it?
3. Can normal interface design or an empty state remove the gap?
4. Why must any instruction appear now rather than at the moment of use?
5. Does each step advance a real task, or merely describe UI?
6. What can be skipped, postponed, resumed, or recovered?
7. How does role, permission, existing data, or prior use change the experience?
8. What happens after the UI changes and the guidance becomes stale?
9. Can keyboard, screen-reader, zoom/reflow, and reduced-motion users complete the same underlying task?
10. Which downstream behavior demonstrates independent success?

## Failure modes

- mandatory product tours before the user can do anything useful;
- carousel-style introductions that teach concepts with no immediate context;
- spotlighting every navigation item;
- onboarding used to patch unclear product architecture;
- empty states that advertise features but offer no useful next action;
- blocking account/integration/setup earlier than necessary;
- forcing experienced or returning users through beginner guidance;
- treating dismissal as mastery or tour completion as activation;
- brittle callouts anchored to UI that moves across breakpoints;
- stale guidance surviving feature/permission changes;
- multiple onboarding systems competing for attention;
- no durable path to recover information after a transient tour disappears.

## Evidence boundary

Carbon provides current production guidance for first-use empty states and explicitly treats onboarding flows as optional supplements rather than replacements for basic empty-state guidance. GOV.UK provides deployed evidence for delaying account friction until necessary and for giving only enough information to start a service. Atlassian provides current production evidence for spotlight/tour mechanics and onboarding-specific illustration guidance. These sources establish viable mechanisms and constraints; they do **not** establish that tours, checklists, empty states, or progressive disclosure universally improve activation. Product-specific outcome claims require product-specific measurement or stronger comparative research.
