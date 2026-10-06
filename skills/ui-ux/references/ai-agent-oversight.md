# AI agent oversight (specialized)

Load only for products where humans supervise many agent actions or several agents: agent
consoles, automation/ops dashboards, review queues, multi-agent workspaces — or when evaluating
such UX. For ordinary AI features use `ai-ux.md`.

## Quick rules

1. "Human in the loop" is not oversight. Meaningful oversight needs information, time, authority,
   controls and consequences that are still preventable — and someone responsible for acting.
2. The unit of oversight is the **risk-bearing operation/episode**, not each tool call.
3. Route by a **risk vector + hard gates**, never one opaque `risk_score` or model confidence.
4. Layer controls: constrain **before**, intervene selectively **during**, inspect outcomes and
   samples **after**.
5. Attention is a budget: interrupt, queue, batch or suppress by time-to-harm and value of human judgement.
6. Compression (grouping, summaries) must preserve every **decision-changing exception**.
7. Recency is not authority; agreement is not evidence; mergeable is not compatible.
8. Test the oversight layer itself adversarially; measure the whole chain to safe state.

## Risk routing

Dimensions: consequence severity · blast radius (scope, criticality, propagation, persistence,
coupling) · reversibility (trivial inverse → recoverable from history → compensatable → partial →
irreversible) · privilege and data sensitivity · external visibility/commitment · time-to-harm vs
time to intervene · novelty · evidence quality · anomaly/policy signals · **cumulative exposure**
(1,000 individually small actions).

Some are **non-compensatory**: low anomaly never cancels an irreversible destructive action; high
confidence never cancels privilege escalation. Hard gates first (exceeds authorization,
irreversible destruction above scope, privilege/role expansion, sensitive data to new destination,
financial commitment above policy, mandated-review publication, security-control changes,
forbidden classes), then weighted prioritization for the ambiguous rest.

Routing outcomes: block/constrain · synchronous approval · autonomous within bounded policy ·
execute + mandatory post-run review · execute + sampled monitoring — and **transform to a safer
operation** (smaller batch, narrower recipients, draft-only, dry run, checkpoint). Track
episode/session budgets (spend, records modified, messages sent, new destinations, privileged
changes) and correlated sequences (`read secrets → contact new domain → transmit`). Compute
enforceable facts outside the model (actual authorization, destination, batch size, data class);
treat routing thresholds as attackable (splitting, baseline poisoning).

## Review queues and attention arbitration

Each queued episode shows: proposed outcome and side effect · which dimensions drove routing · hard
gates crossed · scope and critical resources · reversibility/recovery path · cumulative exposure
before/after · evidence/provenance · why it differs from baseline · safer alternatives. No bare
"Risk 83/100".

Prioritize by time-to-harm/deadline, consequence, dependency criticality, information value of
human judgement, novelty, recovery window, review effort, current reviewer load. Decide per item:
**interrupt now** (waiting reduces recovery options) · **queue visibly** (with deadline/dependency)
· **batch** (independent low-urgency, no hidden differences) · **suppress/auto-resolve** (covered by
reliable policy, audited and sampled). Priority ages; low-priority items need expiry/escalation.
Coordinate across agents, not per agent (per-agent alert localism overwhelms the human).

Sampling isn't a safety guarantee: random-only misses rare high-impact failures; one global
percentage hides uncovered risk classes; stratify by risk class.

## Alerts: dedupe, group, inhibit, correlate

Different operations: **deduplicate** identical state → **group** related siblings (individually
inspectable) → **inhibit** downstream symptoms only under a known stronger parent (state preserved)
→ **correlate** a causal episode only with evidence, keeping uncertainty. Split groups when the
required decisions diverge. Similarity and temporal proximity aren't causality. Grouping must be
reversible; never merge across tenants, permissions, recipients or environments. Objective: less
redundant attention, not fewer notifications.

## Outlier-preserving summaries

A summary is safe only relative to a decision. Dual representation: **majority picture** + **exception
channel** (every minority event whose omission could change consequence, deadline, permissions,
reversibility, ownership or required action). Detect exceptions structurally before narrative
compression; don't ask an LLM to "summarize what's important". Layers: overview (dominant pattern +
exception count + worst/nearest risk) → exceptions grouped by why they matter → clusters → raw
evidence. Expose truncation, sampling and unclassified events. Avoid majority laundering, mean-hides-tail,
count without consequence, exception floods.

## State authority and conflicts

Distinguish **authoritative** (system of record), **intent** (what the user wants — not proof of
effects), **observed** (seen at a version/time), **derived** (summaries, plans, predictions) and
**historical** state. Authority is per field. Consequential reads carry freshness; writes carry
preconditions (versions), not optimism in prose. Conflict classes need different UX: stale
observation (refresh, show change, recompute) · independent mergeable edits · semantic conflict
(don't auto-merge) · authority conflict · evidence conflict (keep disagreement) · intent conflict
(newer explicit intent usually wins unless already executed or blocked by policy). Preserve work,
expose the decision. Failure modes: last-message-wins truth, last-writer-wins mutation, transcript
as database, user-as-universal-authority, agent consensus as truth, retry overwrite.

## Handoffs and context transfer

A handoff is an interface contract: **task state** (goal, stage, done, unresolved decision, next
action) · **decision state** (choices + still-binding rationale, rejected alternatives) · **evidence
state** (claims, provenance, freshness, conflicts, what's verified) · **boundary state**
(permissions, privacy/audience, side effects performed vs prepared vs approved vs pending,
deadlines, forbidden actions). Structured packet first, raw history as drill-down; compression is
not access control; preserve decisions, not hidden reasoning; ask the receiver only for what's missing.

## Multi-agent disagreement

Consensus is an aggregation result, not evidence quality: same model, prompts, sources or tools
produce correlated errors (sycophantic conformity, majority suppression of correct minorities).
Present **where they agree · where they differ (smallest decision-relevant conflict) · why ·
what would resolve it · recommended next step**. Aggregate by evidence, rule/policy, user
adjudication or independent verifier before voting; protect safety-critical minority findings;
LLM judges aren't oracles.

## Evaluating oversight UX

Measure the chain: `event exists → preserved by transformations → detected → surfaced → understood
→ correct action available → action in time → recovery succeeds`, weighting misses by severity.
Seed adversarial scenarios: rare critical outlier, stale-state trap, authority conflict, permission
drift, irreversible side effect, correlated cascade with one different child, summary omission,
plausible-but-wrong narrative, monitor blind spot, supervisor overload, waiting ambiguity, recovery
difficulty. Use scenario families with hidden parameterized instances and field replays (avoid
benchmark overfitting); test with real supervisors under realistic load, not simulated humans
alone; track false-positive burden. Synthetic suites give coverage; production data gives prevalence.

## Failure modes

Rubber-stamp approval · approval flooding · dashboard theater (no one on duty) · late intervention ·
trace dumping · confidence routing · anomaly-only or random-only supervision · silent scope creep
(new tools inherit old policy) · skill atrophy of passive reviewers · detection theater ·
alert-opened = understood · happy-path recovery.

## Evidence boundary

NIST AI RMF / ARIA, OWASP AI Agent Security and Excessive Agency, Anthropic containment write-up,
OpenAI/Microsoft agent frameworks, Prometheus Alertmanager / PagerDuty grouping, recent HCI and
multi-agent-debate research. Mostly synthesis for agent-supervision products; thresholds and
algorithms must be calibrated per domain.
