# AI State Authority and Conflict Resolution

Operational guidance for AI products where the transcript, user, database, artifacts, tools, and multiple agents can disagree about current state.

## Core principle: recency is not authority

Do not let the last message received become truth merely because it is newest. State needs **domain-specific authority, version, provenance, and conflict semantics**.

A useful distinction is:

- **Authoritative state** — the system of record for a fact or mutation (for example, current database value, current file revision, permission service).
- **Intent state** — what the user currently wants; authoritative for preference/goal, but not proof that an external side effect succeeded.
- **Observed state** — what an agent/tool saw at a particular version/time.
- **Derived state** — summaries, plans, classifications, predictions, cached views, or agent conclusions computed from other state.
- **Historical state** — what was true or believed earlier; useful for audit, not automatically valid now.

The authority relation is **field-specific**, not a universal source ranking. A user can authoritatively change their goal while being wrong about whether a payment settled; a database can authoritatively report the payment while being unable to decide the user's preferred next step.

## Separate state from claims about state

Treat agent text as a claim unless the agent is itself the designated system of record for that field.

Bad architecture:

```text
Agent B says “deployment complete” -> shared transcript -> everyone assumes deployed
```

Safer architecture:

```text
Agent B requests deployment
-> deployment tool returns operation id + result
-> authoritative deployment state is updated
-> transcript references that state/version
```

A summary saying an action happened must never substitute for checking the authoritative mutation record when duplicate execution would matter.

## Every consequential read should carry freshness

For mutable state, preserve enough metadata to answer:

```text
value
source / authority domain
version or validator
observed_at
scope
verification status
```

A timestamp alone is weaker than a revision/version because clocks do not establish whether the underlying object changed. Prefer revision IDs, ETags, commit/blob SHAs, sequence numbers, or equivalent validators where the backing system exposes them.

## Writes need preconditions, not optimism in prose

The durable distributed-systems lesson applies directly to agents: **read -> think -> write** creates a lost-update window.

RFC 9110 specifies `If-Match` precisely to make state-changing HTTP requests conditional on the representation still matching an entity tag and to prevent accidental overwrites by parallel actors. GitHub's Contents API similarly requires the current file blob SHA when updating an existing file, and its documentation warns that conflicting content operations must be serialized.

For agentic writes:

```text
1. read authoritative object + version
2. reason / prepare patch
3. immediately before write, validate expected version
4. write conditionally
5. on mismatch: do not overwrite
6. fetch current state
7. classify conflict
8. merge/replan or escalate
```

Do not “solve” a version mismatch by silently re-fetching and applying the old generated replacement to the new version. That merely moves the lost update one step later.

## Conflict classes require different UX

### Stale observation
The world changed after the agent read it.

**Response:** refresh, show what changed if material, then recompute the action.

### Independent mergeable edits
Two actors changed non-overlapping fields or regions.

**Response:** deterministic merge may be safe if semantics are genuinely independent; still preserve provenance and resulting version.

### Semantic conflict
Two changes are syntactically mergeable but encode incompatible intent.

**Response:** do not auto-merge merely because the text/data merge is clean. Present the decision-relevant difference or route to the authority for that decision.

### Authority conflict
Two sources disagree and neither is universally superior because they own different domains.

**Response:** identify which field/decision each source is authoritative for; avoid winner-takes-all source ranking.

### Evidence conflict
Two sources make incompatible factual claims.

**Response:** retain the disagreement explicitly. Do not compress it into an averaged or arbitrarily selected claim; verify against a stronger/closer source when possible.

### Intent conflict
A newer user instruction contradicts an older goal/constraint.

**Response:** newer explicit user intent normally supersedes older user intent for the same scope, unless an external policy, permission, irreversible side effect, or already-executed action makes that impossible. Preserve the supersession rather than silently rewriting history.

## Multi-agent systems need an ownership model

Current Microsoft Agent Framework documentation makes an important implementation boundary visible: handoff participants do not necessarily share one session, and participants are responsible for context consistency; tool-control contents are not all broadcast. Its concurrent-orchestration guidance explicitly warns against concurrency when agents cannot coordinate shared-state changes or when there is no clear conflict-resolution strategy.

OpenAI's current agent guidance similarly distinguishes conversation/session continuation state, final output, handoff ownership, interruptions, and resumable run state. These are separate surfaces; a final answer is not the whole workflow state.

**Design implication:** before adding parallel agents, define:

```text
Who owns each mutable object?
Can multiple actors write it?
What validator/version guards writes?
Which operations commute?
Who resolves semantic conflicts?
What is the canonical record of performed side effects?
What state is local/session-only vs durable/domain state?
```

If these answers are unclear, parallelism is premature.

## A practical authority registry

For complex products, encode authority rather than relying on prompt memory:

```text
state_field:
  authority: service | user | artifact | policy | derived
  source_ref
  version
  freshness_policy
  writers[]
  conflict_policy
  verification_required_before_side_effect: true | false
```

This need not be one giant schema. The point is to make ownership and conflict behavior inspectable by the runtime and UI.

## UX for conflicts: preserve work, expose the decision

A conflict dialog should not merely say “something changed.” It should answer, when relevant:

- what changed since the user's/agent's read
- who/what changed it, if known and appropriate
- which parts of the pending work are still safe
- whether an automatic merge is available and why it is safe
- what choice requires human judgment
- what will happen to the losing version

Prefer preserving the pending draft/patch while the conflict is resolved. Avoid forcing users to copy text out of an error dialog to save their work.

For low-level machine conflicts that can be safely reconciled, do not create unnecessary human approval. Escalate semantic intent, policy, or high-consequence ambiguity—not every version mismatch.

## Failure modes

### Last-message-wins truth
A later agent summary overwrites a verified earlier fact.

**Instead:** attach authority/provenance/verification to claims; recency is only one signal.

### Last-writer-wins mutation
Parallel agents overwrite each other without version checks.

**Instead:** conditional writes or transactions plus explicit conflict handling.

### Freshness theater
A UI shows “updated just now” for a cached/derived value whose underlying source is older.

**Instead:** expose freshness of the evidence that matters, not merely render time.

### Clean-merge fallacy
A textual merge has no line conflict, so the system assumes intent is compatible.

**Instead:** distinguish structural mergeability from semantic compatibility.

### Transcript as database
The system infers current external state from conversation history.

**Instead:** re-read authoritative mutable state before consequential decisions/writes.

### User-as-universal-authority
The product treats a user's factual belief about external state as equivalent to their authority over intent.

**Instead:** respect user intent while verifying external facts against the appropriate system of record.

### Agent consensus as truth
Several agents repeat the same stale or shared-source claim, creating false confidence.

**Instead:** count independent evidence/authority, not number of agreeing model messages.

### Retry overwrite
After a conflict, the agent re-fetches the new revision but reapplies its old full replacement unchanged.

**Instead:** recompute the patch against the new state and revalidate assumptions.

## Implementation contract for coding/design agents

Before implementing collaborative or long-running state, answer:

```text
What are the mutable domain objects?
For each important field, what source is authoritative and why?
Which user statements are intent vs factual claims?
How is freshness/version represented?
Which writes use preconditions/transactions/idempotency?
Can multiple agents write concurrently?
Which operations commute safely?
How are semantic conflicts distinguished from mechanical conflicts?
What side effects have an authoritative execution record?
What does the UI preserve when a conflict occurs?
When should conflict resolution be automatic vs human?
How can an agent discover that its context is stale before acting?
```

## Evaluation

Test more than happy-path synchronization:

- two agents read version N and write different changes
- user changes intent while an agent is mid-run
- tool succeeds but transcript/reporting fails
- transcript says success but authoritative tool state says pending/failed
- stale cache is newer in render time than its source evidence
- syntactically clean merge creates a semantic contradiction
- agent retries after a version conflict
- one agent's summary omits a side effect performed by another
- sources disagree with different authority scopes

Measure lost updates, duplicate side effects, stale-state actions, unnecessary human escalations, conflict-recovery success, preserved user work, and time to resolve semantic conflicts.

## Evidence boundary

The strongest evidence here is architectural rather than a controlled UX comparison. RFC 9110 provides a mature protocol mechanism for preventing lost updates; GitHub demonstrates revision-guarded content mutation in a production API; Microsoft explicitly warns about shared-state/conflict constraints in concurrent agent orchestration; OpenAI separates resumable/session state from final output and handoff ownership. None establishes one universal state schema or conflict UI.

The durable synthesis is: **make authority field-specific, make freshness/version explicit, treat agent prose as claims rather than mutable-system truth, guard consequential writes with machine-checkable preconditions, and escalate semantic conflicts rather than silently resolving them by recency.**

## Sources

- RFC 9110 — HTTP Semantics, §13 conditional requests / `If-Match`: https://www.rfc-editor.org/rfc/rfc9110.html
- GitHub Docs — REST API endpoints for repository contents: https://docs.github.com/en/rest/repos/contents
- Microsoft Azure Architecture Center — AI Agent Orchestration Patterns (reviewed 2026-10-04): https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns
- Microsoft Agent Framework — Handoff orchestration (reviewed 2026-10-04): https://learn.microsoft.com/en-us/agent-framework/user-guide/workflows/orchestrations/handoff
- OpenAI — Agents: Results and state (reviewed 2026-10-04): https://developers.openai.com/api/docs/guides/agents/results
- OpenAI — Orchestration and handoffs (reviewed 2026-10-04): https://developers.openai.com/api/docs/guides/agents/orchestration
