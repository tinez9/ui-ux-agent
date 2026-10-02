# Direct Manipulation

Direct manipulation lets people act on visible objects through spatial operations such as drag, reorder, move, resize, connect, pan, or spatial selection. Use it when the spatial relationship is meaningful; do not make a gesture the only way to perform an important action.

## Core model

Treat direct manipulation as a state transition with a spatial preview, not as pointer choreography:

`idle → armed → manipulating → valid/invalid target preview → commit or cancel → settled/recoverable state`

The interaction must answer continuously:
- what object(s) am I manipulating?
- what operation will happen: move, copy, reorder, combine, resize, link, or reject?
- what destination/geometry will result if I release now?
- is that outcome valid?
- how can I cancel or reverse it?

A visually fluid drag that leaves any of these ambiguous is weak interaction design.

## When direct manipulation earns its complexity

Prefer it when position, grouping, order, geometry, or connection is itself part of the user's mental model: kanban cards, layer ordering, canvas objects, timeline items, splitters, crop handles, node graphs.

Prefer explicit controls, menus, forms, or commands when:
- the outcome is semantic rather than spatial;
- targets are numerous, hidden, remote, or difficult to hit;
- precision is hard on touch or zoomed layouts;
- the operation has consequential side effects that spatial movement does not adequately communicate;
- users need repeatable numeric input;
- accessibility would otherwise require rebuilding the whole operation as a second interaction model.

Direct manipulation may coexist with explicit controls. The alternative is not merely an accessibility fallback; it can be the faster path for keyboard users, precision work, bulk operations, or long-distance moves.

## Drag and drop contract

### Before manipulation

Make manipulability discoverable. If dragging is a primary but non-obvious action, expose a persistent handle or another clear affordance rather than relying only on cursor changes or hover. Do not turn an entire interactive card into a drag surface when that creates conflict with selection, links, text selection, scrolling, or nested controls.

A drag handle should be an actual operable control when it also exposes keyboard/accessibility actions. Atlassian's current implementation uses a native button for this purpose.

### During manipulation

Keep source identity and operation semantics visible. Show the predicted result at the target rather than merely styling the dragged object:
- insertion indicator for reorder;
- target highlight for move/combine;
- ghost/placeholder for geometry or layout;
- explicit invalid state when the target cannot accept the object;
- item count when a multi-item operation could otherwise be ambiguous.

Do not encode validity or operation type by color alone.

Autoscroll is useful for long containers, but it is part of the interaction state: stop it when the pointer leaves the relevant region and avoid acceleration that makes the destination uncontrollable.

For trees and nested structures, distinguish operations such as `before`, `after`, and `inside/combine`; a generic highlight can hide a destructive hierarchy change. If hover-expansion exists, make the eventual parent/position visible before commit.

### Commit, failure, and cancel

A successful drop must settle into an unambiguous state. Keep the moved object visible when practical and preserve or deliberately restore selection/focus so the next action does not require rediscovery.

Invalid or failed drops need explicit recovery feedback. A visual snap-back can help pointer users, but do not make animation the only indication of failure.

Support cancellation during manipulation. Escape is a strong keyboard convention for canceling transient operations on desktop/web where applicable.

Prefer undo for reversible move/reorder operations. If a drop triggers an irreversible or high-consequence side effect, direct manipulation does not remove the need for confirmation or another risk control.

## Accessibility: equivalent outcomes, not simulated dragging

Pointer dragging must not be the sole route. Apple and Atlassian both explicitly require alternative ways to accomplish drag-and-drop outcomes.

The accessible alternative should expose the **semantic operation**. Examples:
- `Move before…` / `Move after…` for a list;
- `Move to column…` for a board;
- a move dialog for a large tree where enumerating every destination in a small menu is impractical;
- numeric position/size fields for precision geometry.

Avoid forcing keyboard or assistive-technology users to emulate hundreds of pointer-coordinate updates. Their goal is the same state transition, not the same motor sequence.

After a keyboard/menu move, keep focus on the moved entity or a predictable successor and announce the meaningful result when it is not otherwise programmatically apparent, for example that an item moved from one list to another. Avoid chatty announcements for every transient pointer position.

Do not assume a custom `draggable` element is accessible merely because native HTML drag events fire.

## Pointer, touch, pen, and scrolling

For custom spatial manipulation, Pointer Events provide a unified input model across mouse, touch, and pen. Touch introduces an important conflict: browsers normally own panning and pinch-zoom. `touch-action` tells the browser which gestures it may handle; careless use can disable expected scrolling or zooming.

Rules:
- preserve page/container scrolling unless manipulation genuinely requires taking over that gesture;
- prefer dedicated handles when drag and vertical scroll compete;
- test cancellation (`pointercancel`) and pointer capture behavior, not only the happy path;
- do not assume every `pointermove` arrives or use event frequency as a clock;
- keep expensive layout/work out of high-frequency move handlers; render visual previews cheaply and commit domain state deliberately.

HTML Drag and Drop (`DragEvent`/`DataTransfer`) is useful especially when transferring content between compatible web/native destinations, but custom in-app reorder/canvas interactions may need a different pointer-driven model. Choose from semantics and platform behavior, not library fashion.

## Resize and spatial geometry

Resize handles need a visible target and a sufficiently usable hit area even if the visual grip is small. Preserve constraints explicitly: minimum/maximum dimensions, aspect ratio, snapping, collision rules, and container bounds should be predictable before release.

When snapping changes geometry, expose the snapped result continuously. Strong magnetic snapping that overrides fine control should have a clear escape or modifier where the platform supports it.

For precision-sensitive work, pair dragging with inspectable/numeric values. A person should not have to hit an exact pixel solely through motor control.

## Optimistic and remote manipulation

Do not conflate local spatial preview with committed remote state.

For server-backed moves/reorders:
1. render the local preview immediately when safe;
2. give the operation a stable identity/version if concurrent edits are possible;
3. commit explicitly;
4. reconcile authoritative state;
5. if rejected, explain the conflict and restore or rebase predictably rather than silently jumping.

Optimism is safest when the operation is likely to succeed and reversible. For permissions, inventory, scheduling, shared ordering, or other contested resources, a beautiful local drop can still fail remotely.

For expensive transfers, keep a placeholder or destination marker and show progress. Apple explicitly recommends progress feedback when dropped content needs time to transfer.

## Multi-user and concurrent state

In collaborative products, the target may move or disappear during a drag. Define whether the operation targets:
- an object identity (`move A before B`),
- an index (`move A to position 4`), or
- coordinates.

Object-relative intent usually survives concurrent list edits better than stale numeric indices. Revalidate permissions and target existence at commit. Never let the visual preview imply a guarantee the backend cannot make.

## Motion and reduced motion

Motion can clarify source-to-destination continuity, but the interaction must remain understandable without large spatial animation. Under reduced-motion preferences, preserve target indicators, placeholders, state changes, and result announcements while reducing non-essential travel/spring effects. Do not remove the affordance or feedback together with the animation.

## Failure modes

- **Gesture-only action:** no keyboard/menu/control path reaches the same outcome.
- **Invisible draggable:** discoverability depends on accidental dragging.
- **Whole-card conflict:** dragging fights links, text selection, nested controls, or scrolling.
- **Ambiguous drop:** the user cannot tell move vs copy vs combine, or before vs inside.
- **Color-only target:** valid/invalid state is inaccessible or weak.
- **Coordinate theater:** keyboard users are forced to simulate pointer movement instead of invoking semantic moves.
- **Scroll hijack:** touch manipulation disables normal page navigation or zoom.
- **Optimistic lie:** the UI settles permanently before a remote operation that can realistically fail.
- **Lost object:** after reorder/move, focus, selection, or viewport no longer reveals where the object went.
- **Index race:** collaborative reorder commits a stale numeric index and produces an unexpected result.
- **Irreversible drop:** a casual spatial gesture triggers a high-consequence action without undo or proportional confirmation.
- **Animation-only failure:** snap-back is the only evidence that the operation was rejected.

## Agent decision contract

Before implementing direct manipulation, answer:
1. What semantic state transition does the gesture represent?
2. Why is spatial manipulation better than an explicit command for this task?
3. What are the source, valid targets, invalid targets, and predicted outcomes?
4. How are move/copy/reorder/combine semantics communicated before release?
5. What equivalent non-pointer operation reaches the same outcome?
6. What happens to focus, selection, viewport, and announcements after commit?
7. How does touch coexist with scroll, zoom, and nested controls?
8. Is the result local, optimistic, asynchronous, or contested by remote state?
9. Can the action be canceled or undone, and does consequence require stronger protection?
10. What remains understandable with reduced motion and during failure/conflict?

If these answers are missing, a drag library is premature.

## Evidence boundary

Apple HIG provides mature platform guidance for move/copy semantics, alternative actions, undo, target feedback, multi-item drag, autoscroll, transfer progress, and post-drop selection. Atlassian provides a shipped web design-system model for discoverable handles, tree drop semantics, semantic accessibility alternatives, result announcements, and focus restoration. MDN documents current DragEvent, Pointer Events, and `touch-action` platform behavior.

These sources establish robust implementation and interaction constraints; they do **not** establish that drag-and-drop improves task completion versus explicit controls in every domain. The repository still lacks strong comparative outcome evidence across pointer, touch, keyboard, and assistive-technology users.

## Sources

- Apple Human Interface Guidelines — Drag and drop: https://developer.apple.com/design/human-interface-guidelines/drag-and-drop
- Atlassian Design System — Pragmatic drag and drop design guidelines: https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines
- Atlassian Design System — Pragmatic drag and drop accessibility guidelines: https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines
- MDN — DragEvent: https://developer.mozilla.org/en-US/docs/Web/API/DragEvent
- MDN — Pointer events (`pointermove`, `pointerdown`): https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event
- MDN — `touch-action`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action

**Reviewed:** 2026-10-02
