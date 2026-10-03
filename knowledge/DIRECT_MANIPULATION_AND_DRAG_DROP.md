# Direct Manipulation and Drag-and-Drop

## Decision rule
Use drag-and-drop when the spatial act itself communicates the operation: reordering, grouping, moving between visible containers, positioning on a canvas, or transferring content to a visible destination. Do not make dragging the only route to an outcome that can be expressed more simply as a command.

Drag is a **direct-manipulation accelerator**, not a complete command model. The underlying operation should remain explicit enough to expose through buttons, menus, forms, keyboard-accessible controls, automation, and undo/recovery.

Prefer direct manipulation when **spatial relationship is information**. Prefer explicit commands when the user primarily needs **precision, distant/non-visible destinations, repeatability, or unambiguous semantics**. Often the strongest design exposes both over one shared operation model rather than choosing one globally.

## Model the operation before the gesture
Represent the domain operation independently from pointer coordinates:

- `reorder(item, before|after target)`
- `move(item, destination)`
- `combine(item, target)`
- `copy(item, destination)`
- `position(item, coordinates)`

Pointer/touch drag, keyboard/menu actions, and programmatic commands should invoke the same operation semantics. This prevents accessibility alternatives from becoming a second, divergent feature.

Distinguish **reorder** from **transfer**. A line between siblings communicates relative placement; highlighting a container communicates transfer into that container. Trees may need both plus combine/nesting. Never show a valid-looking target that will reject the drop.

## Spatial manipulation vs explicit commands
Do not frame the choice as “natural drag” versus “clunky controls.” Each interaction optimizes a different problem.

Use spatial manipulation when:
- source and destination are simultaneously visible and their relationship matters;
- approximate placement is sufficient or snapping makes the final state deterministic;
- direct preview helps the user understand the consequence before commitment;
- repeated local rearrangement benefits from low ceremony.

Prefer or prominently pair explicit controls when:
- exact numeric/ordinal placement matters;
- destinations are numerous, remote, collapsed, filtered, off-screen, or expensive to traverse;
- users need to repeat the same transformation reliably;
- the geometry changes across responsive layouts but domain semantics do not;
- the action needs strong naming, auditability, automation, or assistive-technology access.

This is also a **precision spectrum**. Dragging can be excellent for rough spatial placement while a field, menu, stepper, alignment command, or snapping rule supplies exactness. W3C explicitly uses a precise text value as a valid alternative to dragging a slider; Atlassian likewise advises against a range control when selecting an exact value is important. Do not force motor precision to stand in for semantic precision.

## Modality continuity
Users can switch among touch, mouse, keyboard, stylus, speech, or assistive input on the same device. Do not permanently simplify or hide controls merely because a touchscreen was detected. Preserve concurrent input mechanisms and let the same domain operation remain reachable as modality changes.

Responsive adaptation should therefore change **interaction mechanics**, not silently change capability. A desktop board may make drag prominent while a phone emphasizes Move commands, but both should preserve the same valid destinations and operation semantics.

## Before drag
- Make draggable objects discoverable. Prefer a visible handle when movement is a primary action; if the object contains other interactive controls, restrict drag initiation to the handle to avoid click/drag conflicts.
- Do not rely on cursor changes, hover, or learned convention alone; touch and keyboard users do not receive hover affordances.
- Whole-item dragging can interfere with text selection and embedded controls. Treat that as a real trade-off, not an implementation detail.
- Preserve selection semantics. Selection and dragging are related but distinct; starting a drag should not silently destroy a meaningful multi-selection unless the product explicitly defines that behavior.

## During drag
The interface must continuously answer:
1. **What am I moving?** Use a recognizable preview; simplify large/complex items rather than cloning an entire surface.
2. **Where can it go?** Expose only valid targets.
3. **What will happen if I release now?** Show the operation, not merely proximity: before/after indicator, destination highlight, copy/move state, nesting level, or rejection.
4. **Can I cancel?** Releasing outside a valid target should preserve prior state where feasible; provide an explicit cancellation path for modes that otherwise remain active.

Pointer cancellation is not merely polish. W3C technique G210 treats the ability to abort a path-based drag after pickup as a sufficient approach for Pointer Cancellation: dropping outside a target or undoing the move are examples. Prefer commitment on the up/release event rather than causing irreversible effects at pointer-down.

For long scrollable surfaces, auto-scroll can be useful but must not become an uncontrollable mode. Keep direction/speed predictable and retain non-drag alternatives for distant destinations.

## After drop
- Reflect the intended result immediately when optimistic persistence is safe, but preserve rollback/error recovery if persistence fails.
- Keep the moved object visible when practical, especially after tree moves or cross-container transfers.
- Preserve or deliberately restore focus for non-pointer flows so users can continue from the moved item rather than rediscovering it.
- Announce a concise semantic outcome to assistive technology when the visible change alone is insufficient, e.g. item moved from A to B.
- Offer undo when the domain operation is genuinely reversible; do not label compensation or best-effort recovery as Undo.

## Accessibility is outcome equivalence
WCAG 2.2 SC 2.5.7 requires author-provided dragging functionality to have a single-pointer alternative unless dragging is essential. Keyboard support alone does not satisfy the pointer requirement.

Provide an accessible non-drag route to the **same meaningful outcomes**. Mature patterns include:
- a More/Move menu with commands such as Move to top / Move before… / Move to…;
- a drag-handle button that opens movement commands when no other action menu exists;
- a modal/form for complex tree or cross-container destinations;
- select-source then select-destination flows where direct movement is difficult.

Avoid blindly mapping movement to arrow keys. Directional keys become ambiguous across wrapping layouts, boards, trees, RTL, responsive changes, and nested destinations. Semantic commands such as “Move to Doing” or “Move before Task B” are more stable when geometry is not the domain model.

Accessible names should identify both action and target object. After an alternative move, restore focus to the original control when possible and report the achieved result.

## Touch and mobile
Touch increases the cost of precise dragging and competes with scrolling. Use sufficiently large initiation/target regions, clear pickup feedback, and avoid making a long-distance drag the only way to move an item. On small screens, a Move command with destination selection can be faster and more reliable than spatial manipulation.

Do not infer that a desktop board interaction should be reproduced literally on mobile. Preserve the operation and intent; the gesture may change.

## Multi-item drag
If multiple selected objects can move together:
- make membership in the dragged set unambiguous;
- show a count when representing every item would create visual noise;
- define whether invalid members block the whole operation or produce a partial move;
- update the preview/feedback if a destination accepts only a subset;
- keep ordering semantics deterministic.

Do not let a visual stack hide partial eligibility.

## Performance and implementation
High-frequency pointer movement is rendering-sensitive. Keep drag calculations local and cheap, minimize layout thrashing, and avoid rebuilding large application trees on every pointer move. The visual preview/drop indicator can be transient; authoritative domain state should normally commit at drop, not on every pixel crossed.

Use a library when it materially improves collision detection, scrolling, sensors, virtualization integration, or accessibility plumbing, but do not outsource the product semantics. Libraries cannot decide what constitutes a valid destination, equivalent non-drag commands, partial failure, or safe persistence.

## Failure modes
- **Drag-only capability:** excludes users who cannot perform precise dragging and violates WCAG where a simple pointer alternative is required.
- **False binary:** product chooses drag *or* commands globally instead of matching each to spatial versus semantic/precision needs.
- **Precision theater:** exact outcomes require delicate motor placement even though the domain has discrete or numeric semantics.
- **Input lock-in:** touch detection removes mouse/keyboard-accessible controls on hybrid devices.
- **Invisible capability:** movement exists only if the user guesses an object is draggable.
- **Gesture conflict:** whole-row dragging steals text selection, scrolling, links, buttons, or long-press behavior.
- **Ambiguous drop:** target highlights without communicating before/after/inside/copy/move semantics.
- **Geometry as business logic:** coordinates determine domain meaning differently from keyboard/menu operations.
- **Focus evaporation:** moving/remounting an item strands keyboard or assistive-technology users.
- **Optimistic lie:** UI shows a successful move after persistence failed without rollback or visible recovery.
- **Auto-scroll runaway:** crossing an edge unexpectedly moves the viewport faster than the user can control.
- **Responsive semantic drift:** desktop drag and mobile fallback perform subtly different operations.
- **Animation dependence:** movement is understandable only from motion; reduced-motion users lose the state transition.

## Evidence and boundaries
- **W3C WCAG 2.2:** SC 2.5.7 establishes the normative simple-pointer alternative requirement for dragging; the Input Modalities guidance also stresses concurrent mechanisms and the lower precision of touch. G210 supplies a cancellation pattern. These are accessibility requirements/techniques, not evidence that drag is universally inferior.
- **Atlassian Pragmatic Drag and Drop:** mature shipped design guidance supports visible handles, operation-specific drop indicators, accessible move controls, focus restoration, outcome announcements, optimistic updates, and complex tree alternatives. Atlassian's Range guidance independently warns against approximate slider interaction when exact selection matters. Treat exact visual dimensions/timings as Atlassian conventions, not universal constants.
- **Apple HIG:** platform guidance supports multi-item drag, destination feedback, operation-specific behavior, and alternative commands. Platform conventions do not automatically generalize to every web/mobile product.

There is still limited comparative outcome evidence establishing when drag-and-drop outperforms explicit commands for productivity, comprehension, or error rate. The decision matrix above is therefore operational synthesis from standards and mature product guidance, not a measured universal law. Prefer drag when spatial manipulation has intrinsic meaning; otherwise test against simpler command-based interaction.

## Sources
- W3C WAI, WCAG 2.2 — Dragging Movements (2.5.7): https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- W3C WAI — Understanding Guideline 2.5 Input Modalities: https://www.w3.org/WAI/WCAG22/Understanding/input-modalities
- W3C WAI — G210 Ensuring that drag-and-drop actions can be cancelled: https://www.w3.org/WAI/WCAG21/Techniques/general/G210
- Atlassian Design System — Pragmatic drag and drop design guidelines: https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines/
- Atlassian Design System — Pragmatic drag and drop accessibility guidelines: https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines/
- Atlassian Design System — Range usage: https://atlassian.design/components/range/usage
- Apple Human Interface Guidelines — Drag and drop: https://developer.apple.com/design/human-interface-guidelines/drag-and-drop

**Reviewed:** 2026-10-04
