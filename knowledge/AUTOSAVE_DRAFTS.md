# Autosave, drafts, dirty state, and recovery

Autosave is not merely a timer that calls `save()`. It is a durability contract: the interface must distinguish what exists only in the current UI, what is durable locally, what the server has accepted, and what has synchronized across collaborators/devices.

## Core model

Treat editing state as at least four concepts rather than one `saved` boolean:

- **working state** — what the user currently sees and can still change;
- **local durable draft** — recoverable after reload/crash on this device, but not necessarily synchronized;
- **remote accepted state** — the server has durably accepted a revision;
- **shared/canonical state** — the revision has been reconciled with the current collaborative version and is safe to describe as synchronized.

A product may collapse layers when its architecture truly makes them equivalent. Do not collapse them only to simplify UI copy.

## What “Saved” is allowed to mean

Never display `Saved` merely because a debounce timer fired, a request was queued, or local state was written. Define the acknowledgement boundary first.

Useful states include:

- **Saving…** — a write is outstanding;
- **Saved locally** / **Offline** — work is durable on the device but not remote;
- **Saved** — the product-defined durability boundary has been crossed;
- **Syncing…** — remote propagation/reconciliation is still pending;
- **Couldn’t save** — durability failed and user action or retry is required;
- **Conflict / Review changes** — the system cannot safely claim one canonical result.

Do not expose every internal transition. Expose distinctions that change the user's risk or next action.

Microsoft Office provides a useful production boundary: offline edits can be saved locally and pending changes synchronize after connectivity returns. This demonstrates why `saved` and `synced` are not inherently equivalent.

## Autosave policy

Prefer autosave when editing is frequent, reversible, and users reasonably expect continuity. A robust implementation typically combines:

1. immediate in-memory updates;
2. debounced/coalesced persistence during active editing;
3. durable local recovery where losing recent work would be costly;
4. remote persistence with revision/version identity;
5. explicit retry/conflict handling.

Do not make correctness depend on one final save when the page closes. Browsers may never deliver that lifecycle event, especially on mobile.

### Browser lifecycle

Current MDN guidance is explicit:

- `unload` should be avoided;
- `beforeunload` is unreliable, especially on mobile, and can harm bfcache behavior;
- `visibilitychange` is a more useful signal for preserving application state;
- `pagehide` is a bfcache-compatible fallback but is also not guaranteed.

Therefore persist continuously enough that sudden termination is survivable. Use lifecycle signals as an extra flush/recovery opportunity, not the sole durability mechanism.

Use `beforeunload` sparingly and only while genuinely unsaved work is at risk. Its role is a last-resort browser warning, not an autosave implementation.

## Debounce is a traffic policy, not a durability guarantee

A 500 ms, 2 s, or 5 s debounce has no universal UX correctness. Choose timing from write cost, editing cadence, backend capacity, collaboration needs, and maximum acceptable loss window.

Important consequences:

- continuous typing can indefinitely postpone a pure trailing debounce unless a maximum interval exists;
- requests can complete out of order;
- saving every keystroke can create needless contention/version churn;
- waiting too long increases the amount of work at risk.

Associate writes with revision/mutation identity. A late response from an older save must not make the UI claim that a newer edit is saved.

## Dirty state

`dirty` should mean “the current working state contains changes not yet covered by the required durability boundary,” not merely “an input changed once.”

Track dirty state at the smallest useful recovery scope. A long editor may need per-document or per-section knowledge rather than one page-wide boolean.

Clear dirty state only when the acknowledged revision covers the current working revision. If the user edits again while a save is in flight, completion of that older save must not clear the newer dirty state.

## Drafts and publishing

Do not confuse **saving a draft** with **publishing/committing a consequential state**.

Autosave is usually appropriate for recoverable working content. Publication, submission, sending, deployment, approval, or another externally consequential transition often deserves an explicit action even when the draft itself is continuously saved.

This separation lets users experiment safely without accidental publication.

## Undo and version history

Autosave increases the importance of recovery because temporary or mistaken edits become durable quickly.

Microsoft's AutoSave documentation explicitly warns that automatic saving can overwrite the original as the user works and points users toward version recovery/copies. The general design lesson is: the more aggressively a system persists edits, the stronger its undo/version-history story should be.

Prefer operation-aware undo or version history over restoring an old full snapshot when later edits or collaborator changes may exist.

## Offline editing

Offline capability needs an explicit queue/reconciliation model:

- make offline status discoverable when it changes the durability guarantee;
- persist queued mutations locally if they must survive reload/crash;
- distinguish `saved locally` from `synced`;
- retry with stable mutation identity/idempotency where appropriate;
- do not silently discard queued edits after authentication expiry or permission changes;
- surface conflicts that cannot be reconciled safely.

Do not promise offline editing merely because an already-open page keeps accepting keystrokes.

## Multiple tabs, devices, and collaborators

Autosave creates concurrency even in apparently single-user products: the same user can open two tabs or devices.

Use revision/version preconditions or an equivalent concurrency mechanism when overwriting newer remote state would be harmful. A server rejection due to stale base state is not a generic network error; it is a reconciliation event.

Possible policies:

- automatic merge for independent changes when semantics permit;
- operation-based reconciliation for structured editors;
- explicit conflict review when intent is ambiguous;
- exclusive editing only when the domain truly requires locking.

Do not silently implement last-writer-wins for valuable content unless that loss policy is intentional and acceptable.

## Validation

Autosave and validation have separate jobs.

A draft may legitimately contain incomplete or temporarily invalid intermediate states. Persisting a recoverable draft does not mean declaring it publishable.

Prefer:

- permissive draft persistence;
- contextual validation during editing where useful;
- strict validation at the consequential transition boundary.

If the backend cannot persist invalid intermediate states, design a separate draft representation instead of forcing users to keep every keystroke globally valid.

## Failure and recovery

When saving fails:

- keep the user's working content intact;
- preserve a durable local copy when feasible;
- explain whether work is at risk;
- retry safely when appropriate;
- provide an explicit retry/export/copy path for prolonged failure;
- never replace the editor with an error page if doing so destroys unsaved content.

Authentication expiration deserves special handling: preserve the draft before re-authentication and restore the editing context afterward when safe.

## Accessibility and status feedback

Saving status is a dynamic status message. It should be perceivable without stealing focus. Avoid announcing every keystroke/save cycle to assistive technology; announce meaningful state transitions such as persistent failure, offline state, or successful completion when users need that confirmation.

Avoid visually noisy perpetual `Saving… → Saved` flicker during rapid editing. Stable status is more useful than exposing request chatter.

## Decision contract for agents

Before implementing autosave, answer:

1. What exact durability boundary does `Saved` mean?
2. What is the maximum acceptable work-loss window?
3. Is there a durable local draft?
4. Can users edit offline, or only remain visually interactive?
5. How are overlapping saves ordered/versioned?
6. What happens if another tab/device/collaborator edits concurrently?
7. Can invalid intermediate drafts be persisted?
8. Which action is the explicit publish/submit/send boundary?
9. How can users recover mistaken automatically saved edits?
10. What happens on network failure, auth expiry, crash, tab close, and process kill?

If these questions are unanswered, adding a debounce and a `Saved` label is not a complete autosave design.

## Failure modes

- **False saved:** UI says Saved before the defined durability boundary.
- **Debounce-only durability:** a crash before the delayed request loses meaningful work.
- **Unload dependence:** correctness relies on a lifecycle event browsers may not fire.
- **Stale acknowledgement:** an older request completes and clears dirty state for newer edits.
- **Last-writer loss:** another tab/device silently overwrites newer work.
- **Autosave-as-publish:** transient edits immediately become externally consequential.
- **Invalid-state rejection loop:** intermediate drafts cannot be persisted because publish validation is reused for saving.
- **Offline ambiguity:** edits look saved but exist only in volatile memory.
- **Snapshot rollback:** recovery restores an old whole document and erases later valid work.
- **Status spam:** assistive technology or visual UI announces every tiny persistence cycle.

## Evidence boundary

The browser lifecycle guidance above is current platform documentation. Microsoft Office supplies shipped-product evidence that autosave, offline persistence, synchronization, recovery, and versioning are distinct concerns. These sources support the architecture and failure boundaries; they do not establish a universal debounce interval, save-status wording, or conflict strategy. Those remain product- and data-model-specific.

## Sources

- MDN — `beforeunload`: https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
- MDN — `unload`: https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event
- MDN — `pagehide`: https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event
- Microsoft Support — What is AutoSave?: https://support.microsoft.com/en-gb/office/collab-files/what-is-autosave
- Microsoft Support — Can I work offline?: https://support.microsoft.com/en-us/word/can-i-work-offline
