# Optimistic UI

Optimistic UI shows a predicted successful result before the authoritative system has confirmed it. Use it to remove avoidable waiting, not to hide uncertainty.

## Core rule

Choose optimism from **failure probability × consequence × reconciliation cost**, not from latency alone.

A fast-feeling interface is not worth presenting false finality when rejection is plausible or expensive. Optimism is strongest for frequent, low-consequence, reversible mutations whose successful result is locally predictable. Prefer pending-but-stable UI when server validation, scarce resources, permissions, payments, destructive bulk work, or server-generated consequences make the final state materially uncertain.

Model at least:

`canonical state + pending intent(s) → optimistic projection → confirmed | transformed | rejected`

Do not overwrite canonical state conceptually with the prediction. React's current `useOptimistic` makes the same distinction: optimistic state exists while an Action is pending and converges back to the canonical value when the Action completes; reducer-based optimistic state can be recalculated over newer canonical data.

## A decision matrix

### Good optimism candidates
- toggles/favorites where authorization is already known;
- adding locally predictable content with a temporary stable identity;
- simple edits with low rejection probability and cheap reversal;
- reorder/move when conflicts are rare and reconciliation is defined.

### Prefer visible pending state
- uniqueness or complex server validation determines success;
- inventory, scheduling, quotas, permissions, or locks can invalidate the request;
- server computes a materially different result;
- payment, publishing, deletion, or another consequential action should not appear complete prematurely;
- large batch mutations would create a disruptive rollback.

TanStack DB explicitly supports disabling optimism for server-dependent processing, validation-heavy operations, deletes awaiting synced confirmation, and large batch work. This is useful implementation evidence for a broader UX principle: optimism is optional policy, not a default virtue.

## Pending must remain representable

Do not make predicted state visually indistinguishable from durable state when confirmation matters. The pending marker should be proportional to consequence: subtle local feedback for a harmless favorite; explicit status for a message, upload, financial action, publication, or offline mutation.

Useful entity-level states include:
- `pending`: intent accepted locally, authority unresolved;
- `confirmed`: authoritative state agrees;
- `transformed`: authority accepted the intent but normalized/changed the result;
- `failed`: intent rejected or persistence failed;
- `conflicted`: user intervention or explicit conflict policy is needed.

Avoid a global spinner when only one row/item is pending. React's current documentation demonstrates per-item pending flags for optimistic list additions; TanStack Query likewise supports tracking concurrent optimistic mutations separately.

## Rollback is not always recovery

Rollback is appropriate when restoring the prior state is still truthful and understandable. It is insufficient when:
- later local actions depend on the optimistic result;
- another actor changed the same data meanwhile;
- the original state is no longer valid;
- a side effect partially succeeded;
- the user has navigated away and the failure becomes invisible;
- refetch itself cannot succeed.

TanStack Query distinguishes refetch-based recovery from explicit rollback because refetch may itself be unavailable after some server failures. Therefore design the recovery path, not just the mutation callback.

For dependent optimistic actions, preserve intent/transaction identity so failure can invalidate, rebase, retry, or compensate the affected chain deliberately. Do not blindly restore an old snapshot over newer confirmed work.

## Reconciliation: success is not always equality

The server may accept an intent while returning normalized text, canonical ordering, generated IDs, timestamps, prices, permissions, or conflict-resolved state. Treat this as reconciliation, not necessarily failure.

When the authoritative result differs materially:
- preserve stable identity so the object does not appear to disappear/reappear;
- merge/rebase over newer canonical data rather than replaying a stale snapshot;
- explain consequential corrections;
- avoid celebratory success feedback before the system knows the operation succeeded.

React's reducer form of `useOptimistic` is instructive: when canonical list data changes while an action is pending, the optimistic reducer is re-run over the newer data. That is safer than assuming the snapshot from action start remains authoritative.

## Concurrency and multiple pending intents

Multiple optimistic mutations may coexist. Give each mutation stable identity and ordering metadata when their relationship matters. A single `isSaving` boolean cannot represent two edits where one succeeds and one fails.

Define:
- whether pending mutations compose, replace, or serialize;
- whether later intent depends on earlier unconfirmed state;
- how remote updates rebase the projection;
- what happens when responses arrive out of order;
- whether retry is safe and idempotent.

Automatic retry is not universally correct. TanStack DB deliberately leaves failed-mutation retry to the application because idempotency, error classes, and backoff policy vary by domain.

## Offline is stronger than optimistic

Optimistic rendering does not imply durable offline capability. If the app tells users that work is saved while only memory contains the mutation, closing the tab can turn optimism into data loss.

For offline-capable workflows distinguish:
- locally staged;
- durably stored on device;
- queued for synchronization;
- acknowledged remotely;
- conflicted/failed.

Only expose distinctions users need, but keep them available in the system model.

## Accessibility and feedback

Pending/failure status that matters must not depend only on opacity, animation, or color. Keep controls and focus behavior predictable during reconciliation. Do not remove the focused object solely because its optimistic mutation failed; restore a meaningful state and communicate the error through the appropriate status/error semantics.

Avoid announcing every optimistic micro-state. Announce meaningful completion/failure when the result would otherwise be unclear, especially for long-running or consequential operations.

## Failure modes

- **Optimistic lie:** predicted success is presented as durable completion.
- **Rollback theater:** an old snapshot is restored over newer valid state.
- **One-bit pending:** a global boolean hides concurrent mutation identities.
- **Invisible failure:** rollback happens after navigation with no durable error/retry path.
- **Server surprise:** server-normalized output is treated as corruption instead of reconciliation.
- **Retry duplication:** a non-idempotent mutation is automatically retried and duplicates a side effect.
- **Dependency collapse:** a failed optimistic mutation leaves later dependent actions apparently successful.
- **Offline fiction:** UI says saved although the pending mutation is not durably stored.
- **Success confetti early:** completion feedback fires before authoritative success.
- **Batch rollback shock:** a large speculative mutation visibly rewinds thousands of items.

## Agent decision contract

Before making a mutation optimistic, answer:
1. What exactly is predicted locally, and what remains authoritative remotely?
2. How likely is rejection or server transformation?
3. What is the consequence of briefly showing a false result?
4. Can the prior state still be truthfully restored if failure arrives later?
5. Can multiple pending mutations touch the same entity or depend on each other?
6. How are pending, transformed, failed, and conflicted states represented?
7. What happens if the user navigates away, closes the app, or goes offline?
8. Is retry idempotent and domain-safe?
9. How are remote updates and out-of-order responses reconciled?
10. When is success actually known strongly enough to communicate completion?

If these answers are unclear, prefer explicit pending state over speculative finality.

## Evidence boundary

React 19/current React documentation provides first-party implementation evidence for temporary optimistic projections, per-item pending state, automatic return to canonical values on failure, and reducer recomputation over newer canonical data. TanStack Query documents refetch versus explicit rollback and concurrent optimistic mutations. TanStack DB documents a transaction-oriented optimistic layer, automatic rollback on persistence failure, and explicit cases where optimism should be disabled.

These sources establish robust implementation mechanics and failure boundaries. They do **not** prove that optimistic UI universally improves user outcomes, nor provide universal latency thresholds. The risk model and product consequences remain domain-specific.

## Sources

- React — `useOptimistic`: https://react.dev/reference/react/useOptimistic
- React — React 19: https://react.dev/blog/2024/12/05/react-19
- TanStack Query — Optimistic Updates: https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates
- TanStack DB — Mutations: https://tanstack.com/db/latest/docs/guides/mutations

**Reviewed:** 2026-10-02
