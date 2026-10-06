# Forms, feedback and notifications

A form is a sequence of user decisions, not a collection of inputs. Feedback is an attention
budget, not a stream of toasts.

## Quick rules

1. Ask only for what the task needs; removing a field beats polishing it.
2. Persistent visible labels (placeholders are not labels); hints, constraints, examples and
   reasons near the field.
3. Be tolerant: accept harmless format variation; server validation stays authoritative.
4. Validate on attempted progression by default; earlier only when waiting wastes real work
   (limits, safely checkable constraints). Async checks need pending/success/failure states.
5. Errors are recovery instructions: which field, what's wrong, how to fix, in the field's own
   words; preserve values; summary with links for multiple errors; manage focus after failed submit.
6. Feedback proportional to consequence: ambient → transient confirmation → actionable failure →
   interruptive warning.
7. Inline feedback near the cause beats a generic toast; toasts never hold information users must
   act on later.
8. Status messages announced without moving focus; assertive alerts only for important,
   time-sensitive information.

## Forms — audit checklist

- Fields: necessary? optional ones clearly named or disclosed only when most users don't need them?
- Labels visible and persistent; programmatically associated (`label`, `aria-describedby` for hints/errors).
- Required/optional indicated in text, not color only; constraints stated before errors happen.
- Input types/`inputmode`/`autocomplete` correct (email, tel, one-time-code, address fields).
- Paste allowed (including passwords/codes); password managers work.
- Validation timing: no errors while the user is still typing an incomplete value; no "red on blur"
  before they're done unless there's a reason.
- Error messages: specific, actionable, no blame, no "Invalid input"; field-local + summary with
  links for long forms; focus moves to summary/first error after failed submission.
- Values preserved after errors (except where security requires otherwise); no form reset on server failure.
- Disabled submit buttons: users can tell why (often better: keep enabled and show errors).
- Duplicate submission prevented; submitting state visible; outcome unambiguous.
- Multi-step: progress shown when meaningful; Back preserves entered data; review/check step before
  consequential commitment; don't re-ask known info (WCAG 3.3.7).
- Long forms: autosave/draft or warning before losing work (see `risk-and-recovery.md`).
- Mobile: keyboard doesn't hide the active field or submit; targets large enough; one column.
- Zoom/reflow: labels and errors don't overlap at 200%; nothing clipped.
- Localization: names, addresses, phone and date formats not over-constrained.

## Validation taxonomy

Separate format/syntax · constraint (range) · cross-field (end before start) · business rule
(inventory, permission) · semantic (valid but wrong recipient/amount — needs review, not
validation) · concurrency (became stale before commit). Each has a different best intervention:
see the prevention ladder in `risk-and-recovery.md`.

Prefer preventing impossible states (constrained inputs, unavailable dates disabled *with a reason*)
over accepting and then erroring — but don't disable without explanation when users may ask "why
can't I?".

## Feedback hierarchy

| Level | Use | Surface |
|---|---|---|
| Ambient state | ongoing state that needs no interruption | inline status, persistent indicators |
| Transient confirmation | completed action whose result isn't otherwise visible | brief inline message or toast |
| Actionable failure | what failed, what's intact, next step | inline near the failed region; persistent until resolved |
| Interruptive warning | serious, unexpected or hard-to-recover consequences | dialog/interruption — rarely |

Success can often be implicit in the changed UI. Extra confirmation is worth it when completion is
consequential, delayed, remote or not self-evident. Never announce success before it's known.

## Notifications: choose the least interruptive surface

For each event decide: does the user need to know at all? are they in the relevant context? how
long is it useful? is action required and by when? what if it's missed? can it be aggregated?
where can it be recovered later? can the user control this class?

| Surface | Use for | Not for |
|---|---|---|
| Inline | object/action in view: validation, save state, local failure, upload progress | events elsewhere |
| Toast | brief low-consequence confirmation | anything users must read, copy, compare or act on later; stacking routine successes |
| Banner | page/workspace/service-level information that must stay visible | guaranteed attention (banners get missed) |
| Notification center / inbox | durable async events to review later | justification to emit more events |
| Badge | orientation cue for a meaningful recoverable set | counts that don't reconcile; stale dots; engagement bait |
| OS push | time-sensitive value outside the product, deep-linked | routine engagement |
| Email | durable record, cross-device, longer actionable content, security notices | duplicating every event |

- **Urgency ≠ importance.** Escalation ladder: record only → inline/inbox → passive badge/banner →
  active external → time-sensitive → critical (only genuinely critical domains).
- **Persistence follows consequence:** timeout must not destroy consequential information; point
  to canonical state, don't create a second truth. Dismissing a notification ≠ acknowledging or
  resolving the underlying item.
- **Aggregation:** semantic grouping (same object, conversation, actor) before time batching;
  preserve the exception path — never summarize away the one event that changes required action;
  generated summaries are not canonical state. Predictable batching can reduce interruption cost
  (field evidence for ~3 daily batches vs usual delivery), but time-sensitive events bypass batches.
- **Permission timing:** ask for push permission in context, when value is understood — not on
  first launch.
- **Preferences** map to user-recognizable event classes, not internal service names; reducing
  interruption shouldn't lose durable access.
- **Deep links:** open the smallest stable context; handle stale links (deleted, resolved,
  permission changed) by explaining current state.
- **Metrics:** meaningful-action rate, time-to-action for time-sensitive events, backlog age,
  mutes/opt-outs, duplicate delivery — not opens/clicks alone.

## Accessibility contract

- Labels, hints and errors programmatically associated; WCAG 3.3.1 (identify errors in text),
  3.3.3 (suggest corrections), 3.3.4 (reversible/checked/confirmed for legal, financial, data).
- Errors and status not by color/icon/border alone.
- Dynamic status via live regions without focus theft (4.1.3); `role="alert"` reserved; no chatty
  announcements; test that toasts are actually announced and their actions are keyboard reachable
  without racing a timeout.
- Grouped controls use `fieldset`/`legend`.

## Failure modes

Placeholder-as-label · premature validation · generic "invalid input" · cleared form on error ·
color-only errors · disabled-without-reason submit · toast-only consequential results · toast
stacks as activity log · assertive alerts for routine success · push for engagement · same event
on five channels · digests that hide the urgent item · badge counts that don't match · permission
prompt on first launch · dismiss treated as resolve.

## Evidence boundary

GOV.UK (deployed form and error guidance: progression-time validation, error summaries, preserved
data), W3C (WCAG 3.3.x, 4.1.3, forms tutorials), Baymard (checkout field-count evidence — commerce
specific), Apple/Android (interruption levels, channels, provisional authorization), Fitz et al.
2019 (randomized notification batching field study, 2 weeks). No universal toast duration, batch
window, badge threshold or inline-validation timing is established.
