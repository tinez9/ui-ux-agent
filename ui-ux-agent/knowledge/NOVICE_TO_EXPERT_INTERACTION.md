# Novice-to-expert interaction architecture

Products should not force a choice between a discoverable novice UI and an efficient expert UI. Build **one capability model with multiple access paths** whose semantics stay aligned.

## Core principle

Use progressive acceleration rather than progressive concealment:

1. **Visible path** — important actions remain findable through ordinary controls, menus, navigation, or contextual actions.
2. **Learnable accelerator** — expose a shortcut, command, gesture, or faster path beside the action when it becomes relevant.
3. **Expert path** — repeat users can invoke the same underlying capability with less navigation or pointer travel.
4. **Automation path** — where appropriate, automation invokes the same domain operation and preserves its scope, validation, permissions, safety, and recovery semantics.

The expert path should usually compress interaction cost, not introduce a second product model.

## Progressive acceleration is not progressive disclosure

Progressive disclosure hides complexity until it is relevant. Progressive acceleration keeps the capability understandable while making repeated execution cheaper.

Do not hide a required capability merely because experienced users can invoke it from a shortcut, palette, gesture, context menu, or automation. Apple explicitly notes that context menus are hidden by default and may be missed; Atlassian likewise treats tooltip information as non-critical because tooltips are difficult to discover across devices.

A useful test: **If every shortcut, tooltip, command palette, and gesture disappeared, could a user still discover and complete the important task?** If not, the accelerator layer has become hidden information architecture.

## Teach in context, not through shortcut inventory

Expose acceleration where intent already exists:

- show a shortcut beside its menu item or corresponding visible action;
- include a shortcut in an accessible tooltip when useful, but do not make the tooltip the only shortcut reference;
- provide a searchable shortcut/help surface for users who actively want to learn more;
- teach a faster path after repeated use only when the prompt is dismissible, low-noise, and based on meaningful repetition rather than arbitrary time in product;
- avoid onboarding screens whose main purpose is memorizing shortcuts before users understand the underlying tasks.

Microsoft's current Windows guidance automatically surfaces declared keyboard accelerators in tooltips or menu labels, demonstrating that discoverability can be derived from the same command declaration rather than maintained as separate copy. Atlassian explicitly warns that shortcuts shown only in tooltips are not accessible to everyone and recommends another discoverable panel/dialog path.

## One command, multiple surfaces

Model the operation once and bind surfaces to it:

```text
capability
  id
  label
  scope / target
  availability
  risk / reversibility
  execute()

surfaces
  visible control
  menu / context menu
  command palette
  keyboard shortcut
  gesture / direct manipulation
  automation
```

The surfaces may differ in efficiency and presentation, but they should not drift in meaning. Validation, permission checks, confirmation policy, undo/recovery, analytics identity, and resulting state should belong to the capability/domain operation rather than to one UI entry point.

## Shortcut design

### Preserve platform expectations

Do not repurpose familiar platform shortcuts merely to optimize local ergonomics. Apple explicitly recommends preserving standard shortcuts unless their standard action is irrelevant in the product. Platform consistency is part of learnability: users bring knowledge from other applications.

### Single-character shortcuts are a special risk

WCAG 2.1.4 requires character-only shortcuts to be turn-off-able, remappable to include a non-printable key, or active only while the relevant component has focus. This is not merely a keyboard preference: speech input can inadvertently trigger bare character shortcuts.

Therefore agents should not casually copy single-key productivity shortcuts from expert software. If they are valuable, design configuration/focus scope intentionally and test speech-input implications.

### Do not equate keyboard acceleration with keyboard accessibility

All functionality must remain keyboard operable where WCAG requires it; custom accelerators are optional efficiency paths. A product can have many shortcuts and still have poor focus order, traps, missing semantics, or inaccessible controls.

## Adaptation without two products

Personalization can reduce friction, but silently mutating the interface around inferred expertise can damage spatial memory and predictability.

Prefer:

- stable primary structure;
- user-invoked customization for meaningful expert workflows;
- recent/frequent ranking inside explicitly dynamic surfaces such as palettes;
- contextual suggestions that do not move or remove core actions;
- remembering explicit user choices rather than inferring a permanent 'expert' identity from usage frequency.

Avoid automatically hiding labels, collapsing controls, changing shortcut semantics, or relocating primary actions because telemetry says someone is experienced. Expertise is task-specific: an experienced user can still be a novice in a newly introduced feature.

## Mobile and multimodal boundaries

Do not design 'expert' as synonymous with physical keyboard. Expert acceleration may be:

- direct manipulation when spatial intent is visible;
- context actions near the selected object;
- batch selection and bulk operations;
- recent/favorite destinations;
- configurable toolbars;
- automation or reusable presets;
- keyboard shortcuts when a keyboard is present.

The fastest path should fit the task and input context. Preserve semantic equivalence across modalities rather than forcing desktop shortcut metaphors onto touch.

## Failure modes

- **Hidden expert product:** critical features exist only behind shortcuts, gestures, palettes, or context menus.
- **Tutorial-before-meaning:** users are asked to memorize accelerators before understanding the task.
- **Shortcut confetti:** many accelerators exist without stable command vocabulary or prioritization.
- **Tooltip-only learning:** shortcut discovery depends on hover and is unavailable to some users/assistive technologies.
- **Surface drift:** button, menu, shortcut, and automation versions of an action behave differently.
- **Adaptive reshuffling:** inferred expertise causes controls to move/disappear and destroys learned location.
- **Expert = keyboard:** touch, switch, voice, and pointer users are denied efficient paths.
- **Bare-key collision:** single-character shortcuts conflict with text entry, IME, speech input, or assistive technology.
- **Safety bypass:** the expert path skips safeguards applied to the visible path.
- **Platform vocabulary break:** familiar system shortcuts are repurposed for unrelated local actions.

## Agent decision rule

For every proposed accelerator ask:

1. What repeated cost does it remove?
2. What visible/discoverable path teaches the underlying capability?
3. Can the accelerator be surfaced at the moment users already express intent?
4. Does it invoke the same domain operation as other surfaces?
5. Does it preserve scope, availability, risk, validation, and recovery semantics?
6. Does it collide with platform, browser, editor, international input, speech, or assistive-technology behavior?
7. Is there an efficient path for relevant non-keyboard modalities?
8. Will personalization preserve structural predictability?

If the only justification is 'power users expect shortcuts,' the design is underspecified.

## Evidence and boundaries

- Apple Human Interface Guidelines — Keyboards: standard shortcuts should generally retain standard meanings; current platform guidance also exposes shortcuts through system shortcut interfaces. https://developer.apple.com/design/human-interface-guidelines/keyboards/
- Apple Human Interface Guidelines — Context menus: context menus provide efficient contextual access but are hidden by default and may be undiscovered. https://developer.apple.com/design/human-interface-guidelines/context-menus
- W3C WAI — WCAG 2.1.4 Character Key Shortcuts: bare printable-character shortcuts require off/remap/focus-scoped handling; updated understanding reviewed 2026-10-04. https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html
- Microsoft Learn — Keyboard accelerators: current Windows guidance exposes declared accelerators in tooltips/menu labels to improve discoverability. https://learn.microsoft.com/en-us/windows/apps/develop/input/keyboard-accelerators
- Atlassian Design System — Tooltip usage: shortcuts are valid non-critical tooltip content, but shortcut information must also be available elsewhere because tooltip-only presentation is not accessible to everyone. https://atlassian.design/components/tooltip/usage

These sources strongly support semantic consistency, discoverability, platform conventions, and accessibility constraints. They do **not** establish a universal learning curve, a number of repetitions after which prompting is optimal, or controlled evidence that progressive shortcut hints improve task time. Treat those as product-specific hypotheses requiring measurement.

## Research needs

Controlled novice-to-expert longitudinal evidence; whether contextual shortcut teaching changes retention or task time; when adaptive interfaces help versus damage spatial memory; modality-specific expert workflows on touch; cross-platform shortcut conflicts; and comparative outcomes for customization, palettes, direct manipulation, presets, and automation as acceleration mechanisms.
