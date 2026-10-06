# Risk, prevention and recovery

Destructive actions, confirmations, undo, optimistic updates, autosave, version history and
activity history — one coherent model: **match the intervention to consequence, reversibility,
scope, detectability and frequency**.

## Quick rules

1. Use the **cheapest reliable intervention** (ladder below). Confirmation is a last-mile guard,
   not the safety system.
2. Friction must create a decision: show **action, target, scope/count, consequence,
   reversibility, timing**. "Are you sure?" with Yes/No is not a safeguard.
3. Undo is a capability, not a toast: only promise what the system can truly restore.
4. Reversible, frequent, low-risk → act immediately + visible undo. Irreversible/high blast radius →
   pre-commit protection + technical safeguards.
5. Pending ≠ done; saved ≠ synced; queued ≠ deleted; partial success is a first-class state.
6. Recovery never destroys newer work (no snapshot rollback over later or other users' changes).
7. Confirmation is not authorization; re-authorize at execution.
8. Danger is never conveyed by red alone; the destructive action is never the easy default.

## Intervention ladder (prevention → recovery)

1. **Remove the error opportunity** when the system knows what's valid.
2. **Constrain choices** so invalid states are hard to express (explain *why* something is unavailable).
3. **Instructions/examples** where the rule can't be inferred.
4. **Validate and suggest corrections** when invalid input must stay expressible.
5. **Review before commitment** when correctness depends on meaning (recipient, amount, scope) —
   a check-answers surface, not a tiny dialog.
6. **Make it reversible** (undo, trash, versions, delayed commit).
7. **Confirmation / friction** only when consequence and irreversibility justify interruption.
8. **Recovery/compensation** when prevention can't guarantee success.

WCAG 3.3.4: for legal, financial and stored-data changes, at least one of reversible / checked /
confirmed. These are alternatives — don't stack every one.

## Friction escalation

| Level | When |
|---|---|
| direct action | low consequence, easy recovery |
| direct action + visible undo/recovery | frequent, reliably reversible |
| inline warning / consequence preview | meaningful risk, interruption not justified |
| confirmation dialog / interruption step | consequential, unusual, hard to reverse, plausibly accidental |
| review/check surface | decision needs context: values, recipients, permissions, large scope, side effects |
| strong verification (re-auth, typed **target** name) | exceptional consequence where the input verifies something real (identity, the exact target) |
| technical prevention / policy gate | when no human confirmation makes it acceptable |

Match friction to the failure you're preventing:

| Failure | Better control |
|---|---|
| accidental tap/click | placement, target size/spacing, undo; focused confirm if consequence is high |
| wrong object | show target identity and discriminating context |
| wrong scope | show count, query/selection rule, recipients, environment |
| misunderstood consequence | concise consequence + recovery status |
| stale state | revalidate at commit (copy can't fix it) |
| unauthorized actor | authN/authZ, not a dialog |
| agent/automation mistake | risk routing, capability limits, reviewable plan, technical gates |

Typed confirmation of a generic word ("DELETE") verifies nothing; typing the target name verifies
the target. Hold-to-confirm and countdowns need a real safety property and accessible equivalents.

### Confirmation content
Title and commit button carry the meaning: **"Delete production database?"** / "This permanently
deletes 42 tables and cannot be undone." / **[Delete production database]** [Cancel]. Include
environment, workspace, object name, count, recipients, cost or affected people when they
distinguish the target. Initial focus on the least destructive action for danger dialogs; return
focus to the trigger. If the decision needs information outside the modal, use a review page.

Confirmation fatigue: a ~100% confirm rate is ambiguous (agreement or ceremony). Evaluate by
prevented/corrected errors, immediate reversals, cancellations after seeing scope — not acceptance rate.

## Reversibility classes (say exactly which one applies)

| Class | Meaning | UI promise |
|---|---|---|
| local reversible mutation | true inverse inside a controlled boundary | "Undo move" (named) |
| delayed commit | side effect deferred; cancellable window | "Undo" while pending; state the window; stop promising after commit |
| optimistic mutation | shown before authority confirms | not undo — needs failure/reconciliation path |
| committed distributed side effect | already propagated (email sent, payment, webhook) | compensating action ("Refund", "Send correction", "Unpublish") — not "Undo" |
| soft delete / trash / versions / support restore | recoverable with limits | state retention, permissions, what is/isn't restored |
| irreversible | no recovery | prevent before commit; say so honestly (don't call it permanent if a recovery window exists) |

Undo must define: what state is restored (relations, order, permissions, external effects), for how
long, what if someone else changed it meanwhile. Name the unit ("Undo archive of 842 results").
Partial recovery is reported as such ("7 restored, 2 pending, 1 couldn't be reversed").

## Destructive actions — audit checklist

- Every destructive action: reversible? If yes, is undo/trash offered instead of a modal? If no, is
  the confirmation specific (target, count, consequence)?
- Destructive button not the primary/default visual or keyboard target; separated from routine actions.
- Danger communicated by wording, not only red.
- Bulk: scope explicit (selected vs page vs all matching vs dataset), count shown, ineligible items
  surfaced before commit, partial failure reported, retry only failed subset.
- Delayed/async destruction: "scheduled for deletion" vs "deleted" distinguished; deadline and
  cancel location shown; durable job record, not just a toast.
- Effects on other people (access removed for 12 members) surfaced.
- After execution: completion with undo, queued with status route, partial with details, failure
  preserving context, receipt for irreversible consequential actions.
- Consequential errors/warnings don't auto-dismiss.

## Optimistic UI

Choose from **failure probability × consequence × reconciliation cost**, not latency alone.

Good candidates: toggles/favorites with known authorization; adding locally predictable content;
simple low-rejection edits; reorder with defined reconciliation. Prefer **visible pending** when
server validation/uniqueness, inventory/quotas/locks, server-computed results, payments, publishing,
deletion or large batches decide success.

Model `canonical state + pending intents → optimistic projection → confirmed | transformed |
rejected | conflicted`. Track pending per item (not one `isSaving`). Rollback is not always
recovery (later dependent actions, other actors, navigation away): design the failure path —
visible explanation, preserved input, no silent snap-back, derived state (counts, totals, order)
reconciled. Retry only if idempotent. Optimistic ≠ offline-durable.

## Autosave, drafts and save status

"Saved" is a durability claim. Define the boundary first:
working state → local durable draft → remote accepted → shared/canonical synced.

Statuses (expose only what changes risk or next action): **Saving… · Saved locally/Offline ·
Saved · Syncing… · Couldn't save (action needed) · Conflict — review changes.**

- Debounce is traffic policy, not durability; add a max interval; tie acknowledgements to revision
  IDs (an old response must not mark newer edits saved).
- Don't rely on `beforeunload`/`unload` (unreliable, especially mobile); use `visibilitychange`/
  `pagehide` as extra flush points; persist continuously.
- Dirty state = changes not covered by the durability boundary; clear only when the acknowledged
  revision covers the current one.
- Separate **saving a draft** from **publishing/submitting/sending** (explicit action). Drafts may
  be invalid; validate strictly at the commit boundary.
- Concurrency even for one user (two tabs, two devices): version preconditions (ETag/`If-Match`
  → 412) prevent lost updates; on conflict keep **base, local intent, remote current** separately;
  never refetch over unsaved work; resolve at the smallest meaningful unit; last-writer-wins only
  where loss is harmless.
- On failure: keep content, local copy, explain risk, retry safely, export/copy path; preserve
  drafts through auth expiry.
- Status changes are status messages: no flicker, no announcement per keystroke.

Autosave raises the importance of undo/version history (mistakes persist quickly).

## Version history

Keep distinct: **undo/redo** (recent intent, active context) · **version history** (durable states
across sessions) · **activity/audit history** (what happened, who) · **trash** (deleted objects).

- Versions may be checkpoints, not every edit — say so; show retention limits.
- Inspect before restore: identity (time, author, name), semantic diff at the domain's unit, scope
  (children, properties, comments, permissions), blast radius.
- **Restore creates a new head** and keeps the pre-restore state recoverable; never truncate history.
- Offer copy/fork/partial recovery when restoring everything is too blunt.
- Revalidate if the head changed during preview (collaborators).
- Named versions for milestones; automatic history stays automatic.

## Collaborative undo

Undo in shared state = reverse **my** most recent user action while preserving later independent
work (selective, actor-scoped), not "go back one global state". History holds semantic user actions
(not autosave, sync, presence, normalization). Inverse operations can be semantically destructive
when targets changed — transform, block with explanation, or route to version history. Redo
re-applies against current context. Don't claim this without a data model that supports it.

## Activity and audit history

Don't merge **activity** (orientation), **version history** (recovery), **audit/security logs**
(investigation, completeness, retention, export) and **notifications** (attention) into one feed.

- Event grammar: **actor → semantic action → target/change → time** (+ cause when it changes
  interpretation). Domain verbs, not endpoints.
- Actor types: human, system, integration, automation, **agent on behalf of** a human — never
  launder agent actions as the human's.
- Group without destroying evidence (never collapse permission/security changes, failures among
  successes, different actors, destructive/external operations).
- Exact timestamps on demand; adjacency ≠ causality.
- Audit: structured filters, bounded ranges, export; state scope, retention and exclusions.
- Before/after values carry privacy risk — minimize, redact secrets.
- A log entry is evidence, not an undo stack; link to version history or compensating actions.
- Live updates: "3 new events" rather than shifting the list or stealing focus.

## Failure modes

Confirmation wallpaper · vague confirmation · Yes/No buttons · danger as primary · color-only
warning · ritual typing · fake undo · toast-only recovery · count-only bulk safety (selection rule
unclear) · double safety (modal + undo for trivial reversible actions) · false atomicity ·
optimistic lie · silent rollback · derived-state contamination · false "Saved" · unload dependence
· stale acknowledgement · blind last-writer-wins · refetch-as-recovery · autosave-as-publish ·
snapshot rollback · stale-head restore · history-as-backup · global-stack undo surprise ·
universal history feed · attribution laundering · confirmation used as authorization.

## Evidence boundary

WCAG 3.3.x (error prevention, identification, suggestion), GOV.UK (warning buttons, interruption
pages, check answers), Carbon, Atlassian, GitHub Primer and Apple (destructive roles, modal use,
undo/redo), Microsoft (compensating transactions; SharePoint/OneDrive version restore), Notion,
React/TanStack (optimistic mechanics), MDN/RFC 9110 (lifecycle events, conditional requests),
ProseMirror/Yjs (selective undo), GitHub/Atlassian audit logs. No universal thresholds exist for
when confirmation fatigues, undo window length, debounce interval or merge granularity.
