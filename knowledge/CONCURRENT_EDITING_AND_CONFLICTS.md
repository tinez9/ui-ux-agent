# Concurrent editing and conflict UX

## Decision rule

Treat concurrent editing as a **state-consistency problem with a user-facing conflict policy**, not as a generic “save failed” error. Before designing the conflict UI, define what unit can conflict, how freshness is detected, whether independent changes can be merged safely, and which actor is allowed to decide when intent is ambiguous.

Do not default to last-write-wins for user-authored work merely because it is easy to implement. It silently destroys valid work when two clients edit stale copies of the same state.

## Choose conflict granularity deliberately

The technical conflict unit and the user's mental unit should be as close as practical.

- **Whole-record/version token:** simple and safe, but two independent field edits can conflict unnecessarily.
- **Field/property-level comparison:** can preserve independent edits, but only if fields are actually independent. Two columns can be semantically coupled even when they differ technically.
- **Operation-based collaborative model / CRDT:** appropriate when concurrent local edits and offline work must converge without a central lock, but convergence does not mean every concurrent intention was semantically reconciled.
- **Pessimistic lock:** useful when concurrent mutation is intolerable or resolution would be prohibitively expensive, but locks create waiting, expiry, abandoned-session, ownership and recovery problems.

Microsoft's current EF Core guidance is a useful architectural baseline: optimistic concurrency allows edits without locking, then rejects a write when the concurrency token no longer matches the version originally read. This prevents silent overwrite but deliberately pushes conflict resolution into the application.

## CRDT convergence is not semantic agreement

Do not market or design a CRDT-backed editor as “conflict-free” in the user-intent sense. CRDTs can guarantee deterministic convergence of replicated state while still producing a result that requires domain or human review.

Automerge documents the boundary directly. Concurrent edits can be made locally and later merged, but some values cannot be merged sensibly. If two actors concurrently assign different values to the same map key, Automerge chooses a deterministic winner while retaining the conflicting values for inspection. Its rich-text marks similarly choose a consistent but arbitrary value for overlapping conflicting marks. A converged document can therefore contain a technically resolved state without proving that the winning meaning is correct.

Design from the data type and domain invariant:

- **Commutative operations:** counters and genuinely independent insertions can often converge without user intervention.
- **Concurrent scalar replacement:** retain enough conflict/history information to inspect alternatives when the value is consequential; a deterministic winner is not a product decision.
- **Structured/domain state:** validate the converged candidate against invariants. Two individually valid operations can jointly produce an invalid or surprising business state.
- **Human-authored meaning:** text may merge structurally while the combined sentence, requirement, policy, or design intent becomes contradictory. Semantic review remains a UX problem.

The useful promise is therefore **replica convergence and local availability**, not “users can never conflict.”

## Offline and reconnect are product states, not transport details

Local-first collaboration permits work while peers are disconnected and synchronization later. Automerge's model explicitly supports independent document instances that can be modified locally and merged later; its sync protocol exchanges missing changes between peers.

That capability should not collapse the UI into a binary online/offline badge. Distinguish states only when they change what the user can safely infer or do, for example:

- **local change recorded:** the user's work is durable on this device/local store;
- **sync pending/offline:** the work has not yet reached relevant peers or a server-backed durability boundary;
- **synchronized:** known changes have been exchanged with the intended sync target;
- **needs attention:** convergence exposed a semantic conflict, rejected invariant, permission change, deleted target, or other condition requiring resolution.

Do not label locally persisted work “Saved to workspace” if it has not crossed the durability/synchronization boundary implied by that phrase. Conversely, avoid persistent alarm styling for ordinary offline editing when local persistence is reliable and no action is required.

Reconnect should preserve authorship and causal history rather than replaying a stale whole-document snapshot. A CRDT merge can make reconnect mechanically safe from classic whole-record overwrite while still requiring product-specific handling for permissions, server validation, side effects, and semantic conflicts.

## Presence and CRDT state have different lifetimes

Presence, cursors, selections, typing indicators and viewport positions are typically **ephemeral awareness**, not durable document truth. Keep them out of the persistent collaborative model unless replaying that state later has real meaning.

This distinction prevents stale collaborators or old cursor positions from reappearing after reconnect and reinforces the earlier rule: presence can reduce collisions, but it is not the mechanism that makes document state converge.

## Collaborative undo must preserve intent, not restore a snapshot

In a shared document, `Undo` should normally mean **reverse my most recent undoable intent while preserving later independent work**, not “put the document back into the state I saw a moment ago.” A whole-document snapshot rollback can erase remote changes that arrived after the user's edit.

This is not merely theoretical. ProseMirror's history is explicitly selective: it can undo some changes while keeping other later changes intact, which its documentation identifies as necessary for collaborative editing. Yjs exposes the same architectural idea through `Y.UndoManager`: undo is scoped to shared types and can be filtered by transaction `origin`, with local changes tracked by default. These are stronger models for collaborative products than a global stack of serialized document snapshots.

Design the undo boundary deliberately:

- **Personal/local undo:** the usual editing default. Undo operations attributable to the current user/session while preserving collaborators' intervening work.
- **Shared/global revert:** a different, consequential command. Reverting another person's change or restoring a historical revision affects shared truth and should expose scope/authorship rather than masquerading as ordinary Ctrl/Cmd+Z.
- **Domain action reversal:** if an edit triggered external effects, permissions, notifications, billing, workflow transitions, or other side effects, document-level undo may be insufficient. Use the domain's compensating/reversal action instead.

Do not infer authorship from the current document value. Preserve operation/transaction origin or equivalent causal metadata. Yjs' `trackedOrigins` is a concrete example: different sources can be included or excluded from an undo manager, allowing programmatic normalization, remote updates, imports, or other changes to stay outside a user's editing history when appropriate.

### Undo grouping is a semantic UX decision

A low-level operation is rarely the right user-visible undo unit. Typing a word, pasting a block, applying formatting, moving an object, or accepting an AI rewrite may each contain many mutations but should often undo as one intention.

Both Yjs and ProseMirror expose explicit grouping boundaries. Yjs merges captured changes within a configurable `captureTimeout` and provides `stopCapturing()`; ProseMirror groups history events and exposes `closeHistory()`. Do not treat their default timing values as universal UX constants. Break groups at semantic boundaries such as explicit commands, focus/context changes, paste, drag completion, AI acceptance, or a change in the object being edited when that better matches user expectation.

### Remote edits must not invalidate positional intent

Selections, cursor positions, comments and undo targets should not be stored only as raw character indexes when concurrent edits can shift the document. Yjs relative positions are designed to remain attached to a logical location as remote changes alter surrounding indexes. The general rule is broader than Yjs: store collaborative anchors in a representation that can be transformed/rebased through concurrent operations.

After undo, restore selection/viewport only when doing so remains meaningful. Yjs allows metadata on undo stack items specifically for information such as cursor location, but restoring stale view state should not unexpectedly jump a collaborator's current context or target a deleted object.

### Version history and undo are different products

`Undo` is an immediate intention-reversal mechanism. Version history is an inspectable record for attribution, audit, comparison, recovery, and possibly restoration. Do not overload one with the other.

A historical restore should normally create a **new revision derived from an older state**, not erase the intervening history. Before restoring shared state, show what period/version is being restored, who made relevant later changes, and what current work would be displaced. In high-consequence domains, restoration may require permission and a fresh concurrency check.

## A conflict screen must preserve both intents

When an optimistic save is rejected, do not discard the user's draft and do not simply reload server state. Preserve at least:

1. the version the user started from;
2. the user's proposed changes;
3. the latest authoritative version;
4. enough field/operation identity to determine what actually overlaps.

Then choose the least disruptive truthful resolution:

- **No semantic overlap:** merge automatically, then tell the user only when the merge has a meaningful consequence.
- **Resolvable overlap:** show the conflicting values in context and let the user choose/merge them.
- **High-risk or coupled data:** reject automatic merge and require explicit review.
- **Deleted/permission-changed target:** do not offer a misleading overwrite path; explain that the precondition changed and preserve reusable draft content where possible.

Microsoft's Power Pages editor demonstrates a useful conflict shape for stale files: a save against outdated content offers comparison rather than immediately overwriting, with choices to accept individual changes, keep current content, or overwrite. The exact UI is code-editor-specific, but the durable principle is **compare before destructive overwrite**.

## “Overwrite” is a consequential action

An overwrite after conflict is not an ordinary retry. It means “apply my intent despite a newer committed state.” Make the scope visible and require the backend to verify the version again; otherwise another write can land between conflict display and resolution.

Never implement conflict resolution as:

1. receive `409` / concurrency exception;
2. show a dialog;
3. on “Overwrite”, issue an unconditional write.

The resolution itself needs concurrency semantics. It may need a fresh version token, field-level preconditions, a merge transaction, or a new revision.

## Presence is not concurrency control

Avatars, “Victor is editing”, cursors and field-focus indicators can reduce accidental collisions, but they are advisory. Presence can be delayed, disconnected, opened on another device, or disappear before a save. Do not use presence as the invariant that protects data.

Presence is most useful when it answers an actionable question: **who else is here, what are they touching, and should I coordinate before making a large change?** Avoid decorating every surface with collaborator telemetry when collisions are rare or the information cannot change user behavior.

## Merge only what the domain says is mergeable

Automatic merge is safest when operations commute or affect genuinely independent state. It becomes dangerous when independent-looking fields participate in a shared invariant: quantity + price, start + end date, role + permissions, or two edits to the meaning of the same paragraph.

A database-level “different columns changed” test therefore does not prove that a user-level merge is correct. Validation must run on the merged candidate, not only on each isolated edit.

For generated applications, prefer conservative conflict detection over inventing a clever merge algorithm without domain rules.

## Long forms and drafts

Conflict cost rises with the amount of unsaved user work. For long editing sessions:

- retain the local draft when save fails;
- surface that newer server state exists before the final save when practical;
- compare only meaningful changes rather than dumping raw serialized state;
- allow copying/exporting a draft if automatic resolution is impossible;
- distinguish “your draft is safe locally” from “your changes are saved to the shared record.”

Autosave does not remove concurrency; it can increase collision frequency. Each autosave still needs ordering/version semantics, and a late response must not overwrite a newer local edit.

## Relationship to optimistic UI and undo

Optimistic UI, conflict resolution and undo share one rule: **an old snapshot is not automatically current truth**. A rollback, retry, restore or stale save can all destroy later work if applied unconditionally.

Use mutation/revision identity so late responses cannot regress newer intent. If a user undoes an edit after another collaborator changed the same state, reverse the user's operation when that is valid; do not blindly restore the entire old object.

## Failure modes for AI-generated products

Avoid:

- unconditional last-write-wins for collaborative records;
- claiming a CRDT makes user intent “conflict-free”;
- treating deterministic CRDT winner selection as proof that the chosen meaning is correct;
- showing “synced” when work is only locally persisted;
- replaying stale whole-document snapshots after reconnect;
- persisting ephemeral cursor/presence state as document history without a reason;
- reloading after a conflict and losing the user's unsaved draft;
- a generic “Something went wrong” for a known version conflict;
- treating presence indicators as a data-integrity mechanism;
- auto-merging technically separate fields without checking domain invariants;
- offering “Overwrite” without showing what newer work will be replaced;
- making the post-conflict overwrite unconditional;
- implementing collaborative undo by restoring a serialized old document;
- letting ordinary Ctrl/Cmd+Z silently revert other users' work;
- grouping undo solely by arbitrary timer when explicit semantic boundaries are available;
- storing collaborative cursor/comment anchors only as raw indexes;
- presenting historical restore as ordinary undo or deleting the history between versions;
- assuming autosave prevents conflicts;
- reporting “Saved” while the write is still speculative or has been rejected for stale state.

## Agent checklist

Before implementing collaborative or multi-client editing, answer:

1. What is the conflict unit: document, entity, field, block, operation, or domain aggregate?
2. What token/revision/causal history proves which state the user edited?
3. Can independent changes be merged safely, and what domain invariant proves that?
4. If using a CRDT, which concurrent values are merged semantically and which merely converge deterministically?
5. What does “saved” mean here: local durability, server receipt, peer synchronization, or domain acceptance?
6. What happens after offline edits reconnect and server permissions/validation have changed?
7. What user work is retained if the save is rejected or a converged result needs attention?
8. Can the UI show base, mine and latest in a form users can actually compare?
9. When is automatic merge safe versus explicit review required?
10. Is overwrite allowed, and does the overwrite itself re-check current state?
11. Are presence indicators advisory, ephemeral and separate from durable state?
12. Can late autosave/mutation responses overwrite newer local intent?
13. Does ordinary undo reverse the current user's intent selectively while preserving intervening remote work?
14. What defines one undo unit, and which origins/actions must stay outside that user's history?
15. Are selections/comments/history anchors transformable through remote edits rather than fixed raw indexes?
16. Is historical restore a new auditable revision rather than destructive time travel?
17. After resolution/convergence/undo, is the result revalidated as a whole?

## Evidence boundary

Microsoft EF Core documentation establishes the mechanics and rationale of optimistic concurrency: stale writes are detected through concurrency tokens and resolution belongs to the application. Microsoft's older ASP.NET concurrency material remains useful for the core failure mode—last-write-wins silently overwrites another user's changes—and for distinguishing optimistic from pessimistic control. Current Power Pages documentation supplies a shipped example of stale-save UX that offers compare/merge/overwrite choices.

Automerge documentation establishes a different architectural boundary: replicas can accept local changes and later synchronize/merge, but concurrent assignments can still retain conflicting values while exposing one deterministic winner; overlapping rich-text marks may likewise resolve consistently but arbitrarily. Its sync documentation establishes exchange/convergence mechanics, not a universal UX policy for offline state, semantic conflict, validation, permissions, or awareness.

Yjs and ProseMirror provide independent implementation evidence for **selective, operation-aware collaborative undo** rather than whole-state rollback. Yjs additionally documents origin-scoped undo, semantic capture boundaries, stack metadata, and relative positions; ProseMirror explicitly states that selective history is necessary to undo some changes while preserving later collaborative changes. These APIs establish robust mechanisms, not universal user expectations about undo grouping, retention depth, attribution UI, or historical restore policy.

None of these sources establishes a universal best conflict UI or proves that CRDT/OT collaboration improves outcomes in every product. Conflict granularity, semantic merge policy, presence design, offline messaging, undo grouping, history retention and escalation remain product/domain decisions.

## Sources

- Microsoft Learn, *Handling Concurrency Conflicts — EF Core*: https://learn.microsoft.com/en-us/ef/core/saving/concurrency
- Microsoft Learn, *Implementing Optimistic Concurrency*: https://learn.microsoft.com/en-us/aspnet/web-forms/overview/data-access/editing-inserting-and-deleting-data/implementing-optimistic-concurrency-cs
- Microsoft Learn, *Edit code with Visual Studio Code for the Web (Power Pages)*: https://learn.microsoft.com/en-us/power-pages/configure/visual-studio-code-editor
- Automerge documentation, *Automerge crate / Data Model / Conflicts*: https://automerge.org/automerge/automerge/
- Automerge documentation, *Sync Protocol*: https://automerge.org/automerge/automerge/sync/index.html
- Automerge documentation, *Marks*: https://automerge.org/automerge/automerge/marks/struct.Mark.html
- Yjs documentation, *Y.UndoManager*: https://docs.yjs.dev/api/undo-manager
- Yjs documentation, *Relative Positions*: https://docs.yjs.dev/api/relative-positions
- ProseMirror documentation, *Reference manual — history*: https://prosemirror.net/docs/ref/
- ProseMirror documentation, *Guide — transforms, history and collaborative editing*: https://prosemirror.net/docs/guide/

Last researched: 2026-10-06.
