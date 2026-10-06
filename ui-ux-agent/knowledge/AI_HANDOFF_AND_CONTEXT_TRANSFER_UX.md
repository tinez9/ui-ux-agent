# AI Handoff and Context Transfer UX

Operational guidance for transferring work between AI agents, humans, and sessions without forcing the receiver to reconstruct intent, state, evidence, or constraints.

## Core principle: a handoff is an interface contract, not a summary

The receiver needs the **minimum sufficient state to continue correctly**, not the shortest possible recap and not the entire transcript.

A useful handoff separates four things that ordinary prose summaries tend to blur:

1. **Task state** — goal, current stage, completed work, unresolved decision, next useful action.
2. **Decision state** — choices already made, rationale that still constrains future work, rejected alternatives when retrying them would waste effort.
3. **Evidence state** — claims, source/provenance, freshness, conflicts, and what has actually been verified.
4. **Boundary state** — permissions, privacy/audience constraints, side effects already performed, approvals, deadlines, and actions the receiver must not take.

Compression is allowed inside those fields; silently deleting a field is not equivalent to compression.

## Why repository state alone is insufficient

A successor can often inspect artifacts, but artifacts do not reliably reveal why they exist, what remains unresolved, what was tried, or which constraints were learned during the preceding work.

A 2026 coding-agent takeover study formalizes this as **handoff debt**. Across interrupted repository tasks, context-bearing handoffs reduced median successor-agent events by 20–59% and cumulative prompt tokens by 42–63% relative to repository-state-only takeover. Effects on solved rate were smaller and model-dependent, so the defensible conclusion is about **rediscovery cost**, not universal correctness gains.

**Design implication:** measure resumption cost separately from final success. A handoff can be valuable even when both conditions eventually solve the task.

## Full transcript, prose summary, and structured packet solve different problems

Do not treat these representations as interchangeable.

### Full/raw history
Useful when exact wording, chronology, tool outputs, or unusual edge details may matter. It is expensive to inspect, can contain irrelevant or sensitive material, and pushes reconstruction work onto the receiver.

### Free-text summary
Useful for orientation and narrative continuity. It is lossy by construction and can preserve salient facts while dropping rules about how those facts may be used.

### Structured handoff packet
Useful for preserving known invariants, decisions, boundaries, and next-step semantics. It should point to inspectable artifacts/evidence rather than copying everything into itself.

The default architecture should therefore be **structured packet + references + selective drill-down**, with raw history available only when the receiver genuinely needs it.

## Compression has asymmetric failure modes

A critical 2026 result on multi-agent handoffs found that compression can preserve operational facts while weakening the metadata governing their permitted use. Under a 25-word handoff budget, boundary-marker survival fell to about 0.57 while operational-fact survival stayed near ceiling in the study's controlled scenarios. Explicit boundary constraints substantially reduced downstream leakage, and a correctly populated typed audience allowlist performed much better than relying on prose salience alone.

This is a stronger failure than ordinary information loss: the receiver can retain **what happened** while losing **who may know it, where it may be used, or what may be done with it**.

**Operational rule:** privacy, authorization, audience, approval, and safety boundaries belong in typed/policy-controlled state when possible. Never assume a generic summarizer will preserve them because it preserved the task facts.

The study used semi-synthetic scenarios; exact leakage rates should not be generalized to production. The structural warning is still actionable and independently aligns with current SDK designs that expose explicit context/filtering controls.

## A minimum viable handoff envelope

Use only fields that affect downstream decisions. A practical schema is:

```text
handoff_id
from -> to
reason_for_handoff

objective
current_state
completed_work[]
unresolved[]
next_action

active_decisions[]:
  decision
  rationale_if_still_relevant
  status: fixed | revisit_if | provisional

attempts[]:
  action
  outcome
  retry_condition

artifacts[]:
  reference
  role
  version/freshness_if_relevant

evidence[]:
  claim_or_decision
  source/reference
  verification_state
  conflict_or_uncertainty

boundaries:
  audience/data-use constraints
  permissions/authority
  approvals_received_or_required
  forbidden_or_out_of_scope_actions
  side_effects_already_performed

resume_contract:
  owner
  expected_output
  blocking_conditions
  completion_condition
```

Do not populate every field ceremonially. Omit fields that genuinely do not apply; preserve fields whose absence would change behavior.

## Preserve decisions, not hidden reasoning traces

A receiver usually needs the **decision and decision-relevant rationale**, not a reconstruction of every internal reasoning step.

Transfer:
- assumptions that remain load-bearing
- trade-offs that explain a non-obvious choice
- alternatives already tested when repeating them would waste time
- conditions under which a prior decision should be reopened

Avoid:
- long chain-of-thought-style narratives
- speculative reasoning that never affected the artifact
- duplicated source material available by reference
- every failed micro-attempt

This keeps the handoff auditable without making the predecessor's narrative the receiver's only path to understanding.

## Human handoff requires recipient-aware repair

A 2026 conversation-analysis study of real chatbot-to-human customer-service handovers found that customers changed communication style after transfer: concise chatbot-oriented requests became more elaborate human-directed explanations. Understanding trouble and repair practices affected conversational progressivity.

The UX implication is not merely “send the transcript to the human.” A good handoff should reduce the need for the user to **retell the problem for a new recipient** while still letting the human ask a precise repair question when the transferred representation is inadequate.

For user-facing transfer:
- tell the user what was transferred at a useful level of abstraction
- prefill the human/operator with the task packet before asking the user to repeat anything
- expose the unresolved point that caused transfer
- let the recipient verify/correct the packet rather than treating it as ground truth
- preserve user-visible continuity: completed safe work should not disappear at the boundary

## Source-attributed briefs are useful but still need review in high-risk domains

A 2026 ICU-to-ward handoff study generated source-attributed briefs from structured data and notes. Across 84 held-out handoffs and 100 physician reviews, 98.8% of adjudicable claims were verified against source records, yet only 62% of briefs were entirely free of incorrect claims; 38% contained at least one error requiring review.

This is a useful counterexample to “structured + cited = safe.” Structure and provenance can reduce verification cost, but they do not remove the need for accountable review where consequences are high.

Do not generalize the clinical percentages outside that setting. Generalize the architecture: **source attribution supports inspection; it does not certify the handoff.**

## Current implementation implications

Current OpenAI Agents SDK documentation (reviewed 2026-10-04) exposes several distinct mechanisms that map to the architecture above:
- typed `input_type` for small model-generated handoff metadata such as reason or priority
- application-owned run context for state/dependencies that already exist outside the model
- `input_filter` for selecting or redacting what history the next agent receives
- optional nested/compacted history for reducing transcript volume
- per-handoff enablement for controlling which routes are available

Important boundary: nested history is **not a redaction mechanism**. Tool arguments/results can survive in generated summary text, so sensitive source fields must be sanitized before nesting or the resulting history must be sanitized before forwarding.

Do not make a framework-specific API the conceptual model. The durable pattern is to separate **application state, transfer metadata, history selection, policy boundaries, and inspectable evidence** instead of forcing all five through one prose summary.

## Context transfer by direction

### Agent -> agent
Optimize for machine-readable state, capability boundaries, explicit destination semantics, references, and avoiding duplicated rediscovery. Make route ownership unambiguous to prevent ping-pong handoffs.

### Agent -> human
Optimize for fast situational awareness, inspectable evidence, actions already taken, unresolved judgment, and user continuity. The human needs to know what deserves attention, not merely what the model said.

### Human -> agent
Preserve authoritative user decisions, approvals, corrections, constraints, and artifacts as first-class state. Do not demote a human correction into an easily overwritten conversational hint.

### Session -> session / interrupted work
Checkpoint task-relative state before context disappears: current goal, artifact versions, completed work, open decisions, next action, tests/evidence, and constraints. The successor should be able to resume without replaying the whole session.

## Failure modes

### Transcript dumping
Everything is transferred, so the receiver must rediscover the actual state.

**Instead:** lead with a structured packet and retain raw history as drill-down evidence.

### Summary collapse
Task facts survive but privacy, audience, permission, or other boundary metadata disappears.

**Instead:** preserve critical boundaries as typed/policy-controlled state and test their survival across compression.

### Decision amnesia
The artifact survives but the reason for a non-obvious decision does not, so the successor reverses it or repeats rejected work.

**Instead:** transfer only rationale that remains decision-relevant plus reopen conditions.

### False finality
The predecessor's summary is treated as authoritative truth.

**Instead:** label verification state, conflicts, provenance, and provisional decisions; let the receiver inspect sources.

### Repetition tax
The user has to restate information the system already collected.

**Instead:** transfer known state first and ask only for missing/ambiguous information.

### Handoff ping-pong
Two agents repeatedly route the task to each other because ownership/capability boundaries overlap.

**Instead:** define destination criteria, owner after transfer, and a bounded escalation path.

### Side-effect amnesia
The next actor repeats an email, payment, deployment, mutation, or approval because executed actions were summarized as plans.

**Instead:** separate `performed`, `prepared`, `approved`, and `pending` states explicitly; use idempotency controls where applicable.

### Compression as privacy control
A team assumes summarization removes sensitive material.

**Instead:** apply explicit selection/redaction/policy before transfer. Compression optimizes representation; it is not access control.

## Evaluation

Evaluate the boundary, not only the final agent:
- time/events/tokens until productive resumption
- repeated work and repeated tool calls
- task-state fidelity
- decision/constraint survival
- boundary-marker survival
- source/provenance inspectability
- duplicate side effects
- number of user restatements
- handoff bounce rate
- receiver correction rate
- final task quality
- privacy/authorization violations after transfer

Use adversarial handoff tests: compress aggressively, interrupt at awkward states, include conflicting evidence, mix performed and planned actions, change recipients, and include information with explicit audience constraints.

## Implementation contract for AI coding/design agents

Before implementing a handoff, answer:

```text
Why is control moving?
Who owns the task after transfer?
What state is authoritative outside the transcript?
Which decisions/rationales must survive?
Which evidence must remain inspectable?
Which privacy/permission/audience boundaries must survive losslessly?
Which side effects have already happened?
What can be compressed safely?
What can be fetched by reference instead of copied?
How does the receiver detect stale or conflicting state?
What constitutes successful resumption?
How will duplicate work and duplicate side effects be detected?
```

## Evidence boundary

The strongest current evidence is heterogeneous. The coding-agent takeover study supports reduced rediscovery cost from context-bearing handoffs but does not prove one universal packet schema or consistent solved-rate gains. The boundary-metadata study provides controlled evidence of asymmetric compression loss but uses semi-synthetic scenarios. The customer-service study provides real conversational evidence about recipient changes and repair, not a quantitative packet-format comparison. The ICU study supports source-attributed structured drafts in one high-risk workflow while simultaneously showing why provenance does not eliminate review.

The durable synthesis is therefore narrower than any single implementation: **handoffs should preserve task state, decision state, evidence state, and boundary state as distinct concerns; use structured context plus references for continuation, and treat summaries as lossy orientation aids rather than authoritative state or access control.**

## Sources

- OpenAI Agents SDK — Handoffs (current documentation, reviewed 2026-10-04): https://openai.github.io/openai-agents-python/handoffs/
- OpenAI Agents SDK — Context management (reviewed 2026-10-04): https://openai.github.io/openai-agents-python/context/
- KC & Budathoki — *Handoff Debt: The Rediscovery Cost When Coding Agents Take Over Interrupted Tasks* (2026), arXiv:2606.02875: https://arxiv.org/abs/2606.02875
- Wang, Goyal, Chandrasekharan & Sundaram — *Facts Without Rules: Boundary Metadata Collapse in Multi-Agent LLM Handoffs* (2026), arXiv:2608.29028: https://arxiv.org/abs/2608.29028
- Martijn et al. — *“Hold on, I’ll connect you to a human agent”: Recipient design, repair, and their impact on progressivity in human-chatbot conversations* (2026): https://doi.org/10.1177/17504813261418360
- Amagai et al. — *PAUSE-Agents: A Clinician-in-the-Loop Multi-Agent AI Pipeline for ICU-to-Ward Handoff Briefs* (2026 preprint): https://doi.org/10.64898/2026.07.10.26357759
