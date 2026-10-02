# Notifications and Attention Management

Notifications are an **attention-routing system**, not a collection of toast components. Choose a surface from the user's current context, required response time, persistence, consequence, and ability to recover later.

## Start with the attention contract

For every event, determine:
1. Does the user need to know at all, or is this merely system activity?
2. Are they currently inside the relevant context?
3. How long does the information remain useful?
4. Is action required, and by when?
5. What happens if the user misses it?
6. Can related events be aggregated?
7. Where can the user recover the information later?
8. Can the user control this class of interruption?

Do not promote importance merely because the product wants engagement.

## Choose the least interruptive surface that preserves the task

### Inline feedback
Prefer inline state when the message belongs to the object/action currently in view: validation, save state, local failure, upload progress, or an actionable warning. Proximity preserves causality and avoids making the user reconstruct what a generic toast refers to.

### Transient in-app message / toast
Use for brief confirmation or low-consequence status that does not require later retrieval. A transient message must not be the only home for information the user must read, compare, copy, act on later, or recover after timeout. Do not stack routine successes until the interface becomes an activity log.

### Banner
Use when information applies to a page/workspace/service rather than one control and should remain visible long enough to understand or act. Persistence should follow consequence, not visual severity. GOV.UK's notification banner is a production example; its own guidance notes unresolved research around missed banner information and dismissibility, so do not treat banners as guaranteed attention.

### Notification center / inbox
Use for durable asynchronous events that users may need to review after being away. Preserve event identity, timestamp/context, read/unread semantics only when meaningful, and a route to the affected object. An inbox is not justification to emit more events; aggregate repeated low-value activity.

### Badge
A badge is an orientation cue, not a complete message. It should correspond to a meaningful recoverable set. Avoid counts that users cannot reconcile with the destination, permanently stale dots, or badge inflation designed only to pull users back.

### OS push notification
Use when useful information must reach the user outside the product and delay materially reduces value. Push consumes system-level attention and permission; it should deep-link to the relevant state and remain understandable without requiring the user to infer which object changed.

### Email
Use when asynchronous durability, cross-device retrieval, an external record, or a longer actionable message is valuable. Do not duplicate every in-product event into email by default. Security-sensitive messages may require email or another independent channel, but channel choice belongs to the threat model rather than marketing convention.

## Interruption is a scarce resource

Model urgency separately from importance. An important quarterly report may not be urgent; a short-lived approval deadline may be both. Escalate interruption only when the cost of delayed awareness warrants it.

Current platform models encode this principle rather than treating every notification equally. Apple exposes passive, active, time-sensitive, and critical interruption levels; Android notification-channel importance affects whether delivery is silent, audible, or heads-up, while users retain control over channel importance. These are platform mechanics and useful design evidence, not universal business-priority taxonomies.

A practical escalation ladder is:
- record only / no notification;
- inline or inbox;
- passive badge/banner;
- active external notification;
- time-sensitive interruption;
- critical interruption only for genuinely critical domains and platform-qualified cases.

## Persistence and recovery

The more consequential a message, the less acceptable it is for timeout to destroy it. If a transient surface disappears, the underlying state or durable history must still make the outcome discoverable when that matters. Notifications should point to canonical product state rather than become a second inconsistent source of truth.

For asynchronous work, distinguish **event delivery** from **event state**. Dismissing a notification does not necessarily acknowledge, resolve, approve, or mark the underlying object complete. Define these semantics explicitly.

## Aggregation and rate control

Repeated individually-correct notifications can create a collectively unusable system. Aggregate by object, conversation, actor, or time window when individual interruption adds little value. Preserve exceptional events that materially change required action. Avoid replacing a meaningful event with an opaque “12 updates” summary when one update requires urgent action.

Notification preferences should map to user-recognizable event classes and outcomes, not internal service names. Let users reduce interruption without necessarily losing durable access to events. Respect OS-level controls; never imply the app can guarantee delivery behavior the platform/user may suppress.

## Permission timing

Ask for push permission when the user has enough context to understand what useful notifications they would receive. Apple explicitly recommends requesting authorization in context and supports provisional quiet delivery so users can evaluate notification value before fully authorizing. Permission acquisition is not the product goal; sustained relevance is.

## Accessibility contract

Dynamic in-app status should normally be exposed without moving focus. WCAG 4.1.3 requires status messages to be programmatically determinable so assistive technology can announce them without an unnecessary context change. Reserve `role="alert"` / assertive live behavior for information important and time-sensitive enough to justify interruption; W3C explicitly identifies non-important assertive alerts as a failure pattern.

Do not assume a visual toast is announced correctly. Test creation timing, live-region behavior, repeated messages, rapid updates, dismissal, keyboard access to any actions, zoom/reflow, and screen-reader interruption. If an action is required, do not make access depend on racing a timeout.

## Deep links and returnability

External notifications should open the smallest stable context that lets the user understand and act, while preserving expected navigation/back behavior. Android's current notification documentation explicitly distinguishes notification-only activities from regular app-flow destinations and recommends constructing the back stack accordingly.

Handle stale links: the object may have been deleted, permission may have changed, the event may already be resolved, or the account/workspace may differ. Explain the current state instead of failing silently or replaying an obsolete action.

## Failure modes

- sending a toast for information that must survive dismissal;
- using push for routine engagement rather than time-sensitive user value;
- treating “important” as synonymous with “interrupt immediately”;
- duplicating the same event across push, email, badge, banner, and inbox without an escalation reason;
- notification counts that do not reconcile with the destination;
- using assertive live regions for routine successes;
- allowing low-value events to crowd out exceptional ones;
- requesting notification permission on first launch before value is understood;
- marking the underlying task resolved merely because its notification was dismissed;
- deep-linking to a context the user can no longer access without explaining why;
- exposing internal event taxonomy as notification preferences.

## Agent decision contract

Before implementing a notification, answer:
1. What user decision or awareness need does this event serve?
2. What is the cost of missing it? What is the cost of interrupting for it?
3. Is the user already in the relevant context?
4. What is its useful lifetime and required response window?
5. Must it remain retrievable after dismissal/time-out?
6. Which single surface is sufficient, and what justifies any escalation or duplication?
7. Can repeated events be grouped without hiding an exceptional action?
8. What does dismiss/read/acknowledge/resolve mean for the underlying state?
9. How can users control this event class and its interruption level?
10. What happens when delivery, deep linking, authorization, or the underlying state is stale?

## Evidence boundary

W3C provides normative accessibility behavior for status messages and cautions against unnecessary assertive interruption. Apple and Android provide current production platform models for permission, interruption level, user control, channels, and deep linking; they demonstrate platform capabilities and constraints, not that any exact importance taxonomy is universally optimal. GOV.UK supplies deployed banner guidance while explicitly acknowledging open research on missed information and dismissibility. This cycle found no strong basis for universal toast durations, badge-count thresholds, batching windows, or claims that push/email inherently improve engagement without unacceptable attention cost.
