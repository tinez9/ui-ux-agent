# AI outlier-preserving summarization

## Research question

How should an AI supervision interface compress hundreds or thousands of agent events without statistically or narratively burying rare events that materially change risk or the human decision?

## Core conclusion

**A summary is safe only relative to a decision.** Frequency, average behavior, and the dominant cluster are useful for orientation, but they are not sufficient compression criteria when a rare child can change consequence, deadline, permissions, reversibility, ownership, or the action a reviewer should take.

For operational supervision, use a dual representation:

1. **majority picture** — what is typical, repeated, stable, or shared;
2. **exception channel** — every minority event whose omission could change the decision.

Do not ask an LLM to “summarize everything important” and assume that salience will preserve risk. Determine decision-critical exceptions structurally before narrative compression when possible.

## Why ordinary summarization is dangerous

Summaries naturally privilege repeated themes. In high-volume agent systems this creates a mismatch: probability mass and decision value are different quantities.

Examples:

- 999 reversible read operations succeeded; one agent sent data to an external recipient.
- 200 tasks are waiting normally; one is waiting past a contractual deadline.
- 80 failures share an upstream outage; one child also completed a partial irreversible write.
- 50 agents used the expected permission scope; one crossed a tenant boundary.

The minority event may deserve more attention than the majority pattern even though it is statistically negligible.

## Production precedent and useful limits

Alerting systems provide a strong operational analogue.

Prometheus Alertmanager groups hundreds or thousands of related alerts into one notification during large failures **while retaining the individual alerts**. Its notification data model exposes the complete alert list in a group plus group/common labels. This is an important architectural precedent: compression is a presentation layer over inspectable child records, not destructive replacement.

Grafana likewise documents grouping as a way to reduce notification volume for first responders, but makes grouping criteria and timing explicit. Group wait introduces a real trade-off: a longer wait captures more related events, while a shorter wait surfaces the first event earlier. Compression therefore has a latency cost as well as an information-loss cost.

Prometheus also supports limits that can drop new active alerts after a per-alert-name cap is reached, while exposing a metric counting dropped alerts. This is a useful warning for AI supervision: if the system must sample or discard under overload, **loss itself must become observable**. A clean summary must never imply complete coverage when records were dropped, sampled, delayed, or unavailable.

These systems validate operational patterns, not a claim that infrastructure alert rules transfer unchanged to autonomous-agent oversight.

## Separate four operations

Do not collapse these into one “summarize” step:

### 1. Aggregate
Compute counts, distributions, shared state, trends, and dominant clusters.

### 2. Detect exceptions
Identify children whose attributes differ on decision-critical dimensions, even when they are numerically rare.

### 3. Compress narrative
Explain the dominant state and exceptions concisely.

### 4. Preserve drill-down
Keep stable references to the underlying records and evidence.

A language model can help with step 3. Steps 1, 2, and 4 should use structured state and deterministic rules wherever the domain permits.

## Decision-critical exception dimensions

An event should escape ordinary compression, or visibly elevate its parent summary, when it differs materially in one or more of:

- consequence / blast radius;
- reversibility or rollback availability;
- time-to-harm, deadline, or recovery window;
- permission, privacy, tenant, environment, or recipient boundary;
- external side effect versus internal computation;
- required human decision or owner;
- policy violation or approval state;
- evidence/provenance quality;
- completion state when the majority is merely proposed or pending;
- uncertainty about whether it belongs to the dominant cluster;
- novelty relative to known failure modes.

This list is a design checklist, not a universal risk formula. Domain-specific systems need explicit exception predicates.

## Summary contract

A high-volume supervisory summary should expose at least:

- total events considered;
- time window and freshness;
- dominant state/pattern and its count;
- number of decision-critical exceptions;
- highest-severity consequence and nearest deadline among children;
- whether any data was sampled, dropped, stale, unavailable, or still processing;
- changes since the previous summary;
- stable drill-down to exceptions and source records;
- provenance for any inferred grouping or causal claim.

Prefer language such as:

> 482 actions reviewed. 469 completed normally. 12 share the same retryable API failure. **1 exception needs review:** an external write completed before the failure and has no automatic rollback.

The exception is not relegated to “1 other”.

## Preserve tails, not just extrema

Showing only the single “worst” event is also unsafe. Several qualitatively different minorities may require different actions. Preserve exception **classes** as well as extrema:

- highest consequence;
- shortest deadline;
- different permission/tenant boundary;
- different side-effect state;
- unexplained/uncorrelated child;
- novel event type.

A top-N list based on one scalar severity score can hide orthogonal risk. If the system uses a score, retain the dimensions that produced it and allow policy rules to bypass ranking.

## Overload and incomplete coverage

When volume exceeds processing or display capacity:

- do not silently truncate;
- state the number/range of records not represented when known;
- distinguish **not inspected**, **sampled**, **suppressed**, **grouped**, and **verified normal**;
- preserve deterministic escape paths for high-risk predicates before sampling lower-risk traffic;
- surface telemetry about dropped/suppressed events as a first-class health signal;
- degrade from narrative detail before degrading risk visibility.

“Nothing important found” is invalid when the system did not inspect the full relevant population and cannot justify its sampling guarantees.

## Progressive disclosure

A useful hierarchy is:

1. **overview:** dominant pattern + explicit exception count + worst/nearest risk;
2. **exception layer:** decision-critical outliers grouped by why they matter;
3. **cluster layer:** normal/repeated groups and trends;
4. **raw evidence:** child events, provenance, timestamps, actions, and state transitions.

Progressive disclosure may hide detail, but should not hide the **existence** of exceptions or incomplete coverage.

## Failure modes

- **Majority laundering:** the dominant safe pattern makes the whole batch appear safe.
- **Mean hides tail:** averages conceal a rare catastrophic or irreversible event.
- **Top-N blindness:** one ranking suppresses qualitatively different risk dimensions.
- **Narrative omission:** an LLM omits a rare structured fact because it is not salient in the dominant text pattern.
- **Count without consequence:** “1 of 1,000 failed” is shown without what that one failure did.
- **Silent truncation:** UI or context-window limits drop children without exposing loss.
- **Sampled certainty:** a sample is summarized as though the full population was inspected.
- **Stale exception:** a once-important outlier remains pinned after resolution and steals attention.
- **Exception flood:** overly broad predicates mark everything exceptional and destroy compression value.
- **Hidden unknowns:** unclassified events are folded into normal/other rather than surfaced as unresolved.

## Validation

Test summarization with adversarial event streams, not only representative traffic. Seed rare cases deliberately and measure:

- **critical-outlier recall:** did every decision-changing seeded event remain visible?
- time to notice the outlier;
- whether the reviewer chose the same action with summary versus full evidence;
- false-exception rate and resulting attention cost;
- reconstruction time from summary to source event;
- detection of dropped/sampled/stale coverage;
- performance when several orthogonal exception classes coexist;
- behavior under extreme imbalance (for example 1 consequential event among thousands of normal ones).

A/B testing only notification count or reading time is insufficient. A shorter summary that lowers outlier recall is a regression.

## Decision contract for future agents

When compressing high-volume agent activity:

1. Define the human decision the summary supports.
2. Define decision-critical exception predicates before narrative generation where possible.
3. Aggregate normal/repeated behavior separately from exception detection.
4. Preserve child identity and drill-down; summarization is a view, not data deletion.
5. Make exception count and worst/nearest consequence visible even when details are collapsed.
6. Preserve qualitatively different exception classes rather than relying only on top-N severity.
7. Expose sampling, truncation, dropped events, stale data, and unprocessed coverage explicitly.
8. Let deterministic policy/risk predicates bypass statistical or semantic compression.
9. Re-evaluate exceptions as state changes so resolved outliers do not remain permanently salient.
10. Validate with seeded rare-but-consequential cases and measure critical-outlier recall, not compression ratio alone.

## Evidence boundary

Prometheus and Grafana provide mature production evidence that high-volume operational events can be grouped while preserving child records and that grouping introduces timing/noise trade-offs. Prometheus additionally exposes dropped-alert counts when overload limits discard new alerts. These sources support the information architecture and observability principles above, but they do not establish an optimal summarization algorithm for AI-agent supervision. The exception dimensions and dual-channel summary contract are agent synthesis derived from risk-preservation requirements and should be validated in domain-specific workflows.

## Sources

- Prometheus, Alertmanager documentation (accessed 2026-10-04): https://prometheus.io/docs/alerting/latest/alertmanager/
- Prometheus, notification template reference (accessed 2026-10-04): https://prometheus.io/docs/alerting/latest/notifications/
- Prometheus, Alertmanager configuration (accessed 2026-10-04): https://prometheus.io/docs/alerting/latest/configuration/
- Grafana, Group alert notifications (accessed 2026-10-04): https://grafana.com/docs/grafana/latest/alerting/fundamentals/notifications/group-alert-notifications/
