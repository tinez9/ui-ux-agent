# Collaborative undo and redo

Undo in a collaborative product is not “restore the previous document.” It is an intent-preserving operation over a history that may now contain remote edits, dependent local edits, asynchronous side effects, and objects that no longer exist.

## Core rule

For shared mutable state, prefer **selective, actor-scoped undo** over snapshot rollback.

A useful default meaning of Undo is:

> reverse my most recent undoable user action while preserving unrelated later work, especially work from other actors.

That contract is stronger than “go back one state.” ProseMirror’s history is explicitly selective for this reason: it can roll back selected changes while retaining later changes, including collaborator edits. Yjs similarly provides a selective UndoManager whose tracked origins can constrain which transactions enter a user’s history.

Do not claim this behavior unless the data model can actually provide it.

## History is semantic, not merely chronological

An undo stack should contain **user-meaningful actions**, not every implementation transaction.

Examples:
- typing a short phrase may reasonably be one undo event;
- moving an object and persisting its coordinates should not become separate visible undos merely because they were separate writes;
- autosave, remote synchronization, presence updates, server normalization, analytics, and derived recalculation normally should not enter the user’s undo history;
- a compound command such as “duplicate section” may require several model operations but one undo boundary.

Time-based grouping can help with continuous input, but it is only a heuristic. Yjs exposes a capture timeout and an explicit `stopCapturing()` boundary; ProseMirror similarly groups nearby changes. Product semantics should be able to override timing.

## Actor and origin matter

Record enough provenance to answer:

- who or what originated this operation?
- is it user-initiated, remote, system-derived, migration, import, or automation?
- should this origin be undoable by this actor?
- which semantic action does it belong to?

In collaborative editors, a global chronological stack can make Ctrl/Cmd+Z undo another person’s latest change. That is usually a severe violation of expectation.

Yjs `trackedOrigins` is a concrete implementation example of origin-scoped history. The general lesson is broader: **history membership is a product policy, not an accidental consequence of observing mutations**.

## Selective undo under concurrent change

Suppose Alice inserts A, Bob later inserts B, then Alice presses Undo. Restoring the document snapshot from before A would also erase B. Correct collaborative undo instead needs to reverse Alice’s action in the current document while preserving Bob’s independent work.

This requires operation-aware history or an equivalent transformation/reconciliation mechanism. ProseMirror explicitly avoids resetting to an earlier state; its selective history keeps later changes intact. Research on CRDT undo likewise treats concurrency and causality as part of undo semantics rather than assuming inverse operations are universally sufficient.

### Inverse operation is not automatically a correct undo

`insert x` → `delete x` is easy only while identity and context remain valid. Harder examples include:

- undoing deletion after another actor edited or referenced the deleted object;
- undoing a move after the destination or parent was removed;
- undoing creation after collaborators added children/comments to the created object;
- undoing a rename after other operations referenced the new identifier;
- undoing a permission change after consequential actions occurred under that permission.

A mechanically valid inverse can be semantically destructive. Treat dependencies and current context as part of undoability.

## Object identity beats positional replay

Prefer stable identities and semantic operations over replaying stale indices or coordinates.

For example, “restore object X” or “move X relative to Y” is more resilient than restoring “whatever occupied index 4” from an old snapshot. This aligns with the broader collaborative-manipulation rule that intent should survive intervening edits when possible.

If the target identity has disappeared or its context has fundamentally changed, the product may need to adapt the inverse, disable that undo, or offer explicit recovery rather than pretending exact reversal is still safe.

## Redo is not time travel either

Redo should reapply the previously undone semantic action against the current valid context, not blindly restore a future snapshot.

A new user edit after Undo commonly invalidates or branches the redo chain. In collaborative systems, remote edits alone need not necessarily clear local redo if the history engine can transform/rebase the redo operation safely.

Do not expose Redo as available merely because an old stack entry exists; it must still have a meaningful applicable effect.

## Undo versus version history

They solve different recovery problems:

- **Undo/redo:** fast correction of recent user actions while preserving surrounding work.
- **Version history:** inspect, compare, recover, or restore durable historical states over longer periods.
- **Trash/soft delete:** recover removed entities across sessions.
- **Audit log:** explain who/what changed state; it is not necessarily executable history.

Do not overload Ctrl/Cmd+Z to solve long-range historical recovery. Conversely, requiring version-history navigation for every small editing mistake makes recovery unnecessarily expensive.

## Consequential side effects

Not every visible action can be undone by reversing local state. Sending email, charging money, publishing externally, triggering deployment, notifying users, or calling an irreversible external API may have escaped the application boundary.

For such actions:

1. distinguish **state reversal** from **side-effect compensation**;
2. use pre-action confirmation when consequence/reversibility warrants it;
3. provide a compensating action only when it has truthful semantics (`refund`, `unpublish`, `send correction`) rather than labeling it Undo;
4. do not imply that reverting the local record retracts an already-observed external effect.

Undo is a promise. Its label should match what the system can actually reverse.

## Dependencies and cascading effects

Before undoing action A, ask what later actions depend on A.

Possible policies:
- transform the inverse so independent later work survives;
- cascade only when the dependent state has no independent meaning and the consequence is clear;
- block the undo and explain the dependency;
- create a recoverable replacement rather than resurrecting an invalid historical structure;
- escalate to version/history recovery for complex cases.

Silent cascading deletion of collaborator work is usually worse than refusing an exact undo.

## UI behavior

### Labels and discoverability

Generic `Undo` is appropriate when the result is obvious from immediate context. Prefer descriptive labels such as `Undo delete`, `Undo move`, or `Undo archive` when ambiguity or consequence is higher.

After an undo, feedback should describe the semantic result, not implementation details. If the result was adapted because concurrent changes made exact reversal impossible, say so when that changes user understanding.

### Focus and selection

Recovery should preserve interaction continuity when feasible. History entries may store useful UI metadata such as selection/cursor context; Yjs explicitly supports metadata on stack items for restoring cursor location. Restore focus/selection only when the target still exists and doing so remains sensible after concurrent changes.

### Availability

Disable or omit Undo when no safe meaningful action exists. Do not let a command appear successful while changing nothing.

For destructive operations, a temporary snackbar Undo may complement keyboard/history undo, but do not make recovery depend solely on a short-lived toast when the consequence warrants durable recovery.

## Offline and synchronization

Local undo can occur while earlier operations are unconfirmed or offline. Treat the undo as another semantic operation with stable identity, not as deletion of evidence that the original operation existed.

A synchronization protocol must preserve convergence when original operations and their undo/redo arrive in different orders. CodeMirror’s collaborative model illustrates the broader requirement: local unconfirmed changes are rebased/transposed around remote changes rather than assuming one globally synchronized timeline.

Do not mark an undo “synced” until the same durability/reconciliation boundary used for ordinary edits has been crossed.

## Accessibility

Undo and redo need operable controls or standard keyboard commands appropriate to the platform; do not make recovery available only through transient pointer UI.

When an undo materially changes dynamic content, communicate the result without stealing focus unnecessarily. Avoid announcing every internal history mutation. If focus/selection is restored, ensure the resulting location remains valid and understandable.

## Decision contract for agents

Before implementing undo/redo, answer:

1. What does one user perceive as a single undoable action?
2. Which origins enter history, and whose history?
3. Does Undo reverse my action or the globally latest mutation?
4. Can later independent local/remote work survive the inverse?
5. What stable identities and semantic operations make that possible?
6. What happens when the original target, parent, or dependency no longer exists?
7. When is redo invalidated, transformed, or retained?
8. Which effects are truly reversible versus merely compensatable?
9. How do offline/unconfirmed operations and undo synchronize and converge?
10. When should recovery use undo, trash, version history, or an explicit compensating action instead?

If these are unanswered, a snapshot stack is not a complete collaborative undo design.

## Failure modes

- **Snapshot rollback:** undo restores an old document and erases later valid work.
- **Global-stack surprise:** my Undo reverses another actor’s action.
- **Transaction leakage:** implementation writes become separate user-visible undo steps.
- **Timer-defined semantics:** arbitrary grouping timeout determines action meaning with no explicit boundaries.
- **Blind inverse:** the inverse executes even though later dependencies make it destructive.
- **Identity loss:** positional/index replay changes the wrong current object.
- **Fake undo:** UI says Undo although an external side effect cannot be retracted.
- **Cascade surprise:** undoing a parent silently removes collaborator work added later.
- **Redo resurrection:** redo blindly restores stale state after incompatible edits.
- **Remote-clears-history:** harmless collaborator activity destroys useful local undo/redo solely because the document changed.
- **Toast-only recovery:** a brief transient control is the only route back from a consequential action.
- **Unsynced ambiguity:** local reversal looks final while remote state still contains the original action.

## Evidence boundary

ProseMirror and Yjs provide shipped implementation evidence for selective history, transaction/origin filtering, grouping, and preserving later collaborative edits. CodeMirror documents rebasing of unconfirmed local changes around remote updates in a centralized collaborative model. Distributed-systems research shows that concurrent undo is not generically solved by naïve inverse operations and requires explicit semantics around concurrency/causality. These sources support the architectural rules above; they do **not** establish one universal grouping timeout, redo policy, dependency policy, or conflict presentation. Those depend on the product’s data model and user semantics.

## Sources

- Yjs — UndoManager: https://docs.yjs.dev/api/undo-manager
- ProseMirror — history module reference: https://prosemirror.net/docs/ref/#history
- CodeMirror — collaborative editing example: https://codemirror.net/examples/collab/
- Yu, Elvinger & Ignat — *A Generic Undo Support for State-Based CRDTs* (OPODIS 2019): https://doi.org/10.4230/LIPIcs.OPODIS.2019.14
- Chen & Sun — *Undoing Any Operation in Collaborative Graphics Editing Systems* (GROUP 2001): https://doi.org/10.1145/500286.500296
