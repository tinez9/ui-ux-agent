# Undo, optimistic updates, and compensating actions

## Decision rule

Do not use **Undo** as a generic promise that every consequence can be erased. First classify what actually happens after an action:

1. **Local reversible mutation** — a true inverse can restore the previous state. Use ordinary undo/redo.
2. **Pending external side effect** — execution can be deliberately delayed. An “Undo” window can cancel the pending operation before commitment.
3. **Optimistic mutation** — the UI shows an expected result before authoritative confirmation. It needs an explicit failure/reconciliation path; this is not the same thing as user-requested undo.
4. **Committed distributed side effect** — the original event may already have propagated. Recovery is a new **compensating action** (cancel, refund, restore, corrective message), not historical erasure.
5. **Irreversible consequence** — prevent the mistake before commitment and describe the consequence honestly; do not advertise Undo.

The product copy and interaction must match the strongest guarantee the system can actually provide.

## Why the distinction matters

A local state reversal and a real-world reversal are different claims. Removing a sent message from the sender’s UI does not recall a notification already delivered; restoring a deleted record locally does not necessarily retract downstream webhooks; refunding a payment does not make the original charge never have happened.

Microsoft’s compensating-transaction guidance treats recovery across multiple services/data stores as domain-specific work rather than a simple rollback. Compensation can itself fail and may not restore the exact original state. This is the right mental model for agent workflows and other distributed operations.

## True undo

Use conventional undo when an operation has a reliable inverse inside a controlled state boundary.

- Name the operation semantically: **Undo move**, **Undo delete**, **Undo formatting**, not an unexplained generic reversal.
- Make the next effect predictable. Apple explicitly recommends communicating what will be undone/redone and visually exposing the result, including when it occurs outside the current viewport.
- Group implementation-level mutations into the unit the user perceives as one action. Apple’s undo architecture groups related mutations into one reversible operation.
- Preserve redo when the product’s editing model supports it.
- Do not impose arbitrary shallow history limits merely for UI convenience when users reasonably expect multi-level editing history.

### Undo boundaries must be semantic

One user intention may produce many implementation mutations. Conversely, several distinct user intentions should not be collapsed merely because they occurred in one request. Define the undo unit from the user-visible operation, then make engineering preserve that boundary.

For agent work, “Undo agent run” is unsafe unless every consequential sub-operation belongs to a known recovery plan. Prefer granular labels such as **Restore 18 records**, **Cancel 3 pending invites**, or **Create corrective update** when that is what the system can guarantee.

## Delayed commit: the strongest short-window Undo

When a side effect can safely wait, the most reliable short-lived Undo is often to **delay irreversible commitment** rather than execute immediately and hope to reverse it.

Interaction:

1. reflect the intended result locally;
2. show a clear pending/cancellable state where appropriate;
3. allow cancellation for the defined window;
4. commit after the window expires;
5. after commitment, stop promising the same form of Undo if the guarantee changed.

This is particularly valuable for consequential actions whose external system has no reliable inverse. The UX may feel immediate while the architecture preserves a genuine cancellation boundary.

Do not choose an arbitrary universal timer. Timing must account for consequence, reading/decision time, workflow interruption, accessibility, and how long commitment can legitimately be deferred.

## Optimistic UI is a latency strategy, not an undo guarantee

Atlassian recommends optimistic updates for drag-and-drop so users can continue quickly while persistence occurs asynchronously. That is appropriate when success is likely and reconciliation is safe. It does **not** justify optimistic treatment for every mutation.

Use optimistic presentation when:

- the expected result is highly likely;
- failure can be detected;
- local/derived state can be reconciled coherently;
- the user does not need authoritative confirmation before making the next consequential decision;
- duplicate/reordered requests are handled safely.

Avoid presenting an operation as complete optimistically when success is security-critical, financially consequential, externally committed, difficult to reconcile, or when a false success could trigger further harmful decisions.

### Design the failure path before shipping optimism

Specify:

- the authoritative source of truth;
- the optimistic mutation and all derived views it contaminates (counts, sorting, totals, badges, caches);
- request identity/idempotency behavior;
- what happens when responses arrive out of order;
- rollback or reconciliation behavior;
- retained user input/work;
- visible failure and retry behavior;
- what happens if the user navigates away or performs another dependent action while pending.

A silent snap-back is poor feedback. If the optimistic state was visible, reconciliation failure should also be visible enough to explain what changed.

## Compensation: recovery after commitment

For multi-step or distributed operations, model recovery as a **saga/compensation plan**, not as a UI stack.

Each consequential step should declare, when relevant:

| Property | Question |
|---|---|
| commitment | Has the external effect happened? |
| inverse | Is there a true inverse, a compensating action, or neither? |
| idempotency | Can retrying recovery duplicate effects? |
| propagation | What downstream effects may already exist? |
| preconditions | Can later state make compensation invalid? |
| observability | Can the system verify recovery outcome? |
| failure path | What happens if compensation itself fails? |

Compensations need not run as a naive reverse stack. Dependencies and domain rules determine ordering; some steps can run independently, while others require prior recovery. Microsoft explicitly notes that compensation is application-specific and may itself be resumable/retryable.

### Partial compensation is a first-class state

Never collapse a partially recovered workflow into “Undone.” Represent outcomes such as:

- 7 restored;
- 2 cancellations pending;
- 1 could not be reversed;
- 1 requires manual follow-up.

Provide retry only where retry is safe, and provide the concrete next action for unrecoverable consequences. Keep the original operation and compensation linked in history/audit surfaces.

## Undo vs confirmation

Undo can replace confirmation only when recovery is genuinely reliable enough for the consequence. Do not turn “avoid confirmation dialogs” into a universal rule.

Prefer **undo/recovery after action** when the operation is frequent, low-risk, easy to reverse, and accidental activation is recoverable.

Prefer **pre-commit confirmation or stronger friction** when consequences are irreversible, externally visible, expensive, permission-changing, destructive at large scope, legally meaningful, or difficult to compensate.

For bulk actions, include scope in both execution and recovery: **Archive 842 results** and **Undo archive of 842 results** are safer than a generic “Undo.” Snapshot semantics may be necessary so the recovery target does not drift with a live query.

## AI-agent implications

Agent actions amplify the difference between interface reversal and consequence reversal because one intent can fan out across tools.

Before offering run-level Undo, the orchestrator should know:

- which tool calls are read-only, pending, committed, reversible, compensatable, or irreversible;
- which effects escaped the product boundary;
- whether compensations require fresh authorization;
- whether another actor has changed the affected state;
- which recovery steps have completed, failed, or remain pending.

If this information is unavailable, offer **recovery assistance** rather than a false atomic Undo. For high-risk workflows, technical containment and pre-commit gates remain stronger controls than optimistic execution plus hoped-for compensation.

## Failure modes

1. **Fake undo** — UI reverts while an external consequence remains.
2. **Optimistic false completion** — a pending operation is presented as authoritative and drives another decision.
3. **Silent rollback** — visible optimistic state disappears after failure without explanation.
4. **Derived-state contamination** — the item rolls back but totals/order/caches remain optimistic.
5. **Compensation-as-erasure** — a refund/cancellation is described as if the original event never happened.
6. **Partial recovery hidden as success** — some downstream effects survive while UI says “Undone.”
7. **Ambiguous undo unit** — implementation calls rather than user intentions determine history.
8. **Stale inverse** — later edits make an old inverse destructive or invalid.
9. **Retry duplication** — compensation or mutation is retried without idempotency protection.
10. **Undo window theater** — the UI offers a timer even though the external side effect was already committed and cannot reliably be recalled.

## Implementation contract for agents

Before implementing a mutation, answer:

1. What is the user-perceived operation?
2. When does it become externally committed?
3. Can commitment be delayed?
4. Is recovery a true inverse, cancellation, compensation, or impossible?
5. What state is optimistic, pending, confirmed, failed, partially recovered, or irrecoverable?
6. What dependent/derived state must reconcile with it?
7. How is duplicate/reordered execution controlled?
8. What exact claim may the UI safely make after recovery?
9. What does the user do when recovery fails?
10. What history/audit evidence must remain?

If these cannot be answered, do not label the operation reversible.

## Evidence and boundaries

**Official platform guidance:** Apple Human Interface Guidelines, “Undo and redo,” recommends predictable named undo/redo, visible outcomes, and multi-level undo; Foundation `UndoManager` documents grouped reversible actions. These establish mature editing conventions, not distributed-system guarantees.

**Shipped design-system guidance:** Atlassian Pragmatic Drag and Drop recommends optimistic UI after drop to preserve responsiveness. This is strong implementation-pattern evidence for a constrained interaction, not evidence that optimism is universally preferable.

**Architecture guidance:** Microsoft Azure Architecture Center, “Compensating Transaction pattern,” documents compensation for eventually consistent multi-step workflows and stresses domain-specific recovery. This supports the distinction between rollback and compensation; exact UX must still be designed per product.

### Sources

- Apple Human Interface Guidelines — Undo and redo: https://developer.apple.com/design/human-interface-guidelines/undo-and-redo
- Apple Foundation — UndoManager: https://developer.apple.com/documentation/foundation/undomanager
- Atlassian Design System — Pragmatic drag and drop design guidelines: https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines
- Microsoft Azure Architecture Center — Compensating Transaction pattern: https://learn.microsoft.com/azure/architecture/patterns/compensating-transaction

## Maturity

**DEVELOPING.** The distinctions between undo, delayed commit, optimistic reconciliation, and compensation are supported by mature platform and architecture guidance. Exact thresholds, recovery-copy conventions, and measured user outcomes remain domain-specific and need further comparative evidence.
