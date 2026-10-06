# Progressive Disclosure and Discoverability

Progressive disclosure is a complexity-management technique, not a default instruction to hide secondary UI. Use it when delaying information or controls reduces decision load **without hiding what users need to understand the current state, choose correctly, or discover important capability**.

## Core decision rule

Before collapsing or deferring something, classify it by decision role rather than visual importance.

Keep information visible when it materially affects:
- whether the user should start or continue;
- the meaning, consequence, price, eligibility, scope, privacy, or reversibility of an action;
- interpretation of the current state;
- comparison between options;
- recovery from an error;
- discovery of a capability that users cannot reasonably infer exists.

Good candidates for disclosure are details that are useful **after** a primary choice is understood: advanced configuration, optional explanation, uncommon variants, supporting detail, diagnostics, and expert controls.

The test is not `primary vs secondary`; it is `needed before this decision vs safely obtainable on demand`.

## Progressive disclosure has a discoverability tax

Hiding complexity changes the user's mental model. The interface becomes simpler only if users can correctly infer:
1. that more information or capability exists;
2. where to reveal it;
3. what kind of content will appear;
4. whether revealing it changes state or merely shows detail.

A Microsoft Research study of a UI that intentionally hid market complexity found that users understood some simplified concepts but pricing was difficult for many participants to discover or understand. This is older, domain-specific evidence, but it is a useful counterexample to the assumption that hiding complexity automatically makes the underlying system understandable.

**Implication:** never use disclosure to conceal a concept whose absence causes users to form the wrong model of the system.

## Disclosure vs staged workflow

Use **in-place disclosure** when hidden material is subordinate to the current object or decision and users benefit from preserving page context.

Use a **staged / step-by-step flow** when later questions depend on earlier answers, eligibility can terminate the journey, or showing every branch at once would force users to reason about irrelevant paths. GOV.UK's suitability pattern explicitly uses simple questions to avoid making users parse large bodies of eligibility documentation. Its step-by-step navigation pattern was iterated through eight rounds of user research, including users with disabilities and low digital literacy; GOV.UK also documents a discoverability limitation: users rarely use its step-by-step header.

Do not split a short, easily scanned task into many screens merely to create a feeling of simplicity. Page count and click count are costs too.

## Disclosure controls

A disclosure control must look and behave like a control. Prefer a native `button` when JavaScript controls visibility.

For a basic disclosure:
- the control has a stable, descriptive accessible name;
- `aria-expanded` reflects the actual expanded state;
- `aria-controls` may reference the controlled region;
- `Enter` and `Space` activate a button naturally;
- the visual indicator changes with state but does not carry the meaning alone;
- focus normally remains on the disclosure control unless the interaction explicitly requires another focus destination.

For accordions, preserve the document heading hierarchy. WAI-ARIA APG recommends a heading containing the accordion button and warns against proliferating `region` landmarks when many panels can be open. Treat APG examples as patterns to test, not production code to copy blindly; APG itself notes assistive-technology support gaps and recommends native semantics where possible.

Do not apply `menu`/`menubar` semantics to ordinary site navigation just because it visually resembles a menu. WAI-ARIA APG's disclosure-navigation example deliberately avoids `menu` because that role implies a more complex keyboard interaction model.

## Labeling

The trigger should predict the hidden content. `Advanced`, `More`, or a chevron alone can be acceptable only when surrounding context makes the destination obvious. Prefer labels such as `Advanced filters`, `Technical details`, or `Show 8 more results` when they reduce uncertainty.

Do not make users open a disclosure to learn whether it contains something relevant. A concise persistent summary, count, selected-value preview, or status can preserve orientation while details remain collapsed.

## State persistence

Preserve expansion state when collapse/expand represents the user's working configuration and a re-render would otherwise create repeated effort. Reset it when the context has genuinely changed and the previous state would be misleading.

Never let a collapsed section silently hide:
- an error blocking completion;
- a newly applied constraint;
- an active filter or setting whose effect is visible elsewhere;
- a changed value that materially affects the result.

If validation finds an error inside collapsed content, expose enough context to locate and fix it. Expansion alone is insufficient if the user still cannot identify the failing field.

## Responsive use

Do not equate smaller viewport with permission to hide more meaning. Mobile can justify changing layout density or moving secondary controls behind disclosure, but decision-critical state must remain visible or immediately legible. If desktop exposes an important comparison simultaneously, replacing it with serial disclosure on mobile may change the task from comparison to memory.

## Common failure modes

### Complexity laundering
The product remains complex but the interface hides the evidence. Users discover constraints only after committing.

### Capability burial
Valuable functionality is technically present but users have no cue that it exists.

### Accordion everything
Every section becomes collapsible, increasing interaction cost and making scanning worse.

### Hidden active state
A collapsed filter/settings area changes output without a visible summary of the applied state.

### Disclosure nesting
Repeated `More → Advanced → Details` layers destroy information scent and make recovery difficult. Prefer reorganizing the information architecture.

### False simplification
A multi-step flow fragments a task that users could understand faster as one coherent page.

### Semantics by appearance
A visual dropdown is implemented as an ARIA menu even though it is ordinary navigation or disclosure, creating unexpected keyboard behavior.

## Agent implementation contract

Before implementing progressive disclosure, an agent should answer:

1. **What decision is the user making at this point?**
2. **Which information is required before that decision?** Keep it visible.
3. **What exactly is being deferred, and why is deferral beneficial?**
4. **How will a first-time user know the hidden capability/content exists?**
5. **What persistent summary must remain visible while details are collapsed?**
6. **Can hidden state affect visible output?** If yes, expose that state.
7. **What happens when hidden content contains an error or urgent change?**
8. **Is in-place disclosure better than a staged workflow, or vice versa?**
9. **Are native semantics sufficient before adding ARIA?**
10. **Does the design still work for keyboard, screen-reader, zoomed, narrow, and touch interaction?**

## Evidence boundary

Strong current evidence here concerns interaction semantics and accessibility: W3C WAI-ARIA APG defines disclosure/accordion behavior and explicitly cautions that examples require production testing. GOV.UK provides deployed service-pattern guidance and documents user-research history plus known discoverability gaps. Evidence that progressive disclosure universally improves task success is not established here; the Microsoft study is a useful domain-specific failure case rather than a universal outcome estimate.

## Sources

- W3C WAI-ARIA APG — Disclosure pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- W3C WAI-ARIA APG — Accordion pattern: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
- W3C WAI-ARIA APG — Disclosure navigation example: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
- GOV.UK Design System — Check a service is suitable: https://design-system.service.gov.uk/patterns/check-a-service-is-suitable/
- GOV.UK Design System — Step by step navigation: https://design-system.service.gov.uk/patterns/step-by-step-navigation/
- Microsoft Research — Hidden Markets: UI Design for a P2P Backup Application (CHI 2010): https://www.microsoft.com/en-us/research/publication/hidden-markets-ui-design-for-a-p2p-backup-application/

**Reviewed:** 2026-10-04
