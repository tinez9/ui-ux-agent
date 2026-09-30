# Interaction and Motion

Knowledge about state transitions, microinteractions, direct manipulation, gestures, animation, and spatial continuity.

## Core decision rule

Motion is justified when it communicates something the interface would otherwise make harder to understand: state change, causality, spatial relationship, feedback, continuity, or progress. Decorative motion is optional and should never carry essential information by itself.

Before adding significant motion, ask:

1. **What information does movement add?** If the answer is only “polish,” prefer the simpler static transition unless delight is an explicit product goal.
2. **What moves?** Large-area translation, zoom, parallax, depth simulation, and scaling deserve more caution than small/local changes.
3. **Who controls it?** Interaction-triggered motion, automatic motion, and scroll-linked motion have different interruption and accessibility costs.
4. **What happens with reduced motion?** Design the alternative as part of the interaction contract, not as a late CSS patch.
5. **Can the transition fail or be interrupted?** Navigation and state changes must remain correct without animation.

## Reduced motion is a semantic variant, not “animation: none”

Respect the platform preference by default. On the web, `prefers-reduced-motion: reduce` is the broadly available mechanism. W3C identifies it as a sufficient technique for allowing users to prevent non-essential interaction-triggered motion under WCAG 2.2 SC 2.3.3 (AAA).

A reduced-motion variant should preserve the information the original transition communicated:

- replace spatial travel/zoom/parallax with instant state changes or restrained opacity/color emphasis where appropriate;
- keep status, hierarchy, selection, and navigation understandable without movement;
- avoid requiring users to discover a second site setting before honoring their OS/browser preference;
- a product-specific motion control can add granularity, but should not silently ignore the system preference;
- never use motion as the only channel for essential information.

Apple independently recommends adapting problematic depth simulation, parallax, animated blur, and depth-of-field effects when Reduce Motion is enabled.

## Transition patterns

### Local state change

For toggles, selection, disclosure, validation, or small component changes, motion can clarify cause-and-effect when it is local, brief, and does not delay interaction.

Prefer animating the affected relationship rather than the whole viewport. A state change must remain legible if the transition is skipped.

### View and navigation continuity

Use a view transition when preserving spatial continuity genuinely helps users understand where an object or context went. Do not add shared-element movement merely because the platform makes it easy.

As of 2026, the web platform has materially improved here:

- MDN marks the core `ViewTransition` interface Baseline 2025 for current browsers;
- the API supports same-document SPA transitions and cross-document MPA transitions;
- transition types became Baseline 2026, allowing different navigation/state transitions to select different animation treatments;
- a transition can be skipped, so application correctness must not depend on its animation.

Treat View Transitions as progressive enhancement. Older/unsupported clients and reduced-motion users still need a complete state change.

### Scroll-linked and large spatial motion

Parallax, large zoom/pan, persistent scroll-driven transformations, and depth simulation have a higher vestibular and distraction risk. Use them only when they add task-relevant orientation or storytelling value that survives a reduced-motion alternative.

Do not make scroll progress or navigation meaning depend solely on an animated spatial effect.

## Implementation contract for agents

When implementing motion:

- define the **purpose** of each non-trivial transition in a comment/design spec, not arbitrary duration folklore;
- implement reduced-motion behavior at the same time as the default behavior;
- prefer platform primitives (CSS transitions/animations, Web Animations API, View Transition API) when they satisfy the interaction instead of adding a library solely for basic motion;
- do not duplicate a browser/user-agent visual navigation transition when the platform exposes that one already occurred;
- keep DOM state, focus, history, URL, and accessible state correct independently of animation;
- make interruption/cancellation safe;
- test keyboard navigation and reduced-motion mode, not only pointer interaction;
- treat experimental preference APIs and client hints as enhancements, not the only way to honor reduced motion.

## Evidence boundary

W3C provides normative/accessibility guidance for disabling non-essential interaction-triggered motion and documents `prefers-reduced-motion` techniques. MDN establishes current browser capabilities and compatibility, not that animated transitions improve task outcomes. Apple supplies independent platform guidance on motion intent and reduced-motion adaptation. This evidence supports the safety and implementation rules above, but **does not establish a universal duration, easing curve, or claim that animation improves comprehension/perceived speed**.

## Research directions

Direct manipulation and gesture feedback; interruption-safe drag/drop; measured comprehension effects of spatial continuity; scroll-linked motion tradeoffs; motion timing/easing by task; performance under complex transitions; perceived performance versus actual task success.
