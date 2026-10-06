# Undo and recovery architecture

## Decision rule

Treat **undo as a product guarantee backed by state architecture**, not as a toast button. Offer undo only when the system can still restore a valid user-meaningful state after the original action, including relevant side effects and concurrent changes.

A useful hierarchy is:

1. **Local reversible edit** — use command/history undo when the inverse is deterministic and scoped to the current editing session.
2. **Reversible deletion/removal** — prefer soft-delete, trash, archival, or delayed finalization when retaining the object is acceptable.
3. **Committed operation with a valid inverse business action** — expose a compensating action, but describe the real effect (`Cancel booking`, `Restore member`, `Issue refund`) rather than pretending time was rolled back.
4. **Irreversible or externally committed operation** — do not advertise undo. Move protection before the point of no return with review, confirmation, validation, or delayed commitment where feasible.

The core question is not “can we draw an Undo button?” but **what invariant makes recovery truthful?**

## Undo is not rollback

Three mechanisms that can look identical in UI have different guarantees:

- **rollback/history reversal:** restore earlier local state before it has conflicting external consequences;
- **soft deletion/delayed finalization:** the apparent destructive action is intentionally not final yet, so restoration reactivates retained state;
- **compensation:** the first action already happened and a new domain action counteracts some of its effects.

Do not describe compensation as exact reversal when it is not. Microsoft’s current compensating-transaction guidance explicitly notes that compensation can be domain-specific, may not run in exact reverse order, can itself fail, and must account for concurrent work. A cancelled reservation, for example, may not imply a full refund. In distributed workflows there may also be a **pivot / point of no return** after which earlier compensable assumptions no longer apply.

For agents, this means a UI affordance must inherit the semantics of the backend mechanism. `Undo` is appropriate for a genuine restoration users can understand as undo; otherwise name the compensating action honestly.

## Recovery-window design

Do not cargo-cult a universal 5- or 10-second snackbar. Choose the recovery window from the underlying guarantee:

- If the object remains in Trash for 30 days, a 6-second toast is only a **shortcut**, not the recovery boundary. Provide a durable recovery surface as well.
- If an operation is delayed for 10 seconds before irreversible dispatch, communicate that cancellation is available only while pending.
- If undo exists only in the current editor history, define what ends that history: navigation, save, collaboration merge, session expiry, or another command.
- If restoration remains available indefinitely, avoid making a transient toast the only discoverable path.

The visible affordance may be brief; the **recoverability contract must not be accidentally briefer than the system capability**.

## Async and distributed operations

A destructive action that crosses services should be modeled as a state machine, not a binary `done/undone` flag. Useful states may include `pending`, `committed`, `cancellation requested`, `compensating`, `restored`, `partially restored`, and `recovery failed`.

Design requirements:

- record enough state to resume recovery after refresh/reconnect;
- make retry/compensation idempotent where duplicate execution is possible;
- do not show `Restored` before compensation actually succeeds;
- preserve a durable audit/status surface for long-running recovery instead of relying only on ephemeral notifications;
- define the point of no return explicitly;
- when compensation can only partially restore the prior outcome, state the residual consequence;
- provide escalation/manual recovery when automated compensation can fail without a safe automatic resolution.

Microsoft’s Saga and Compensating Transaction patterns are architecture evidence for these constraints, not a prescription that every UI action needs distributed-systems machinery.

## Concurrency changes what “restore” means

Naively restoring a stored snapshot can overwrite legitimate work performed after the original action. Before implementing undo in collaborative or multi-client systems, decide whether recovery should:

- restore the deleted entity while preserving later independent edits;
- reverse only fields changed by the original command;
- create a new version rather than overwrite current state;
- reject/branch when the inverse conflicts with newer state;
- compensate through domain rules instead of data replacement.

Therefore, **snapshot available ≠ safe undo**. Recovery must respect current state and ownership/concurrency semantics.

## Relationship to confirmation

Carbon’s current deletion guidance treats low-impact/reversible deletion as a case where pre-action confirmation may be unnecessary, while irreversible moderate/high-impact deletion warrants stronger confirmation. This supports a useful split:

- robust recovery can remove repetitive pre-action friction for low-impact operations;
- weak or uncertain recovery must not be used as an excuse to remove safeguards;
- high-impact operations should not rely on a tiny transient undo window as their only protection.

Undo and confirmation are not mutually exclusive. A consequential action can justify both pre-commit review and post-commit recovery when mistakes remain plausible and recovery is technically reliable.

## Failure modes for AI-generated interfaces

Avoid these patterns:

- adding an `Undo` toast while the backend immediately hard-deletes;
- optimistically announcing restoration while an async compensating request is still pending;
- restoring an old snapshot over newer collaborative changes;
- making a transient toast the only recovery route when the backend retains data much longer;
- promising `Undo` for an operation whose external side effects cannot be reversed;
- hiding a failed compensation and leaving the UI looking restored;
- using soft-delete without defining retention, permissions, purge behavior, or uniqueness/reference conflicts on restore.

## Agent implementation checklist

Before generating an undo affordance, answer:

1. What exactly is retained or inverted?
2. Is this rollback, delayed finalization, soft-delete, or compensation?
3. What is the point of no return?
4. How long is recovery actually guaranteed, and what ends it?
5. Does recovery survive navigation, refresh, reconnect, and another device when it should?
6. Can newer/concurrent state make restoration unsafe?
7. Can the recovery operation itself fail or partially succeed?
8. Does the UI distinguish pending recovery from completed recovery?
9. Is there a durable recovery path if the transient affordance disappears?
10. Would a domain-specific inverse label be more truthful than `Undo`?

## Evidence boundary

Carbon provides mature product/design-system guidance that reversible low-impact deletion can avoid confirmation; it does not establish a universal undo duration. Microsoft’s Azure Architecture Center establishes the technical limits of compensation in long-running/eventually consistent workflows: compensation is domain-specific, can fail, should be resumable/idempotent, and must account for concurrency and points of no return. These architecture constraints support the UX rules above, but exact retention periods, undo windows, and conflict policies remain product/domain decisions requiring validation.

## Sources

- Carbon Design System, *Common actions — Delete*: https://www.carbondesignsystem.com/building-blocks/core/patterns/common-actions/tab-1
- Carbon Design System, *Remove*: https://carbondesignsystem.com/community/patterns/remove-pattern/
- Microsoft Azure Architecture Center, *Compensating Transaction pattern*: https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction
- Microsoft Azure Architecture Center, *Saga design pattern*: https://learn.microsoft.com/en-us/azure/architecture/patterns/saga

Last researched: 2026-10-06.
