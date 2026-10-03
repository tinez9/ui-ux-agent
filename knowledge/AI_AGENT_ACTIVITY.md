# AI Agent Activity and Trace UX

## Core distinction

Do not expose an execution trace as the default user-facing history of an AI agent.

A **trace** answers engineering questions such as which model/tool/subagent ran, in what parent-child relationship, for how long, with what status and inputs/outputs. A **user activity record** answers product questions: what the agent intended to accomplish, what it actually changed, what remains unresolved, what evidence supports the result, and what the user can inspect or recover.

Current agent platforms make this distinction increasingly important. OpenAI tracing records model responses, tool calls, delegated work, duration, status, inputs/outputs and overlapping spans; Microsoft Agent Framework similarly emits a tree of agent, model and tool spans. That structure is valuable telemetry, but rendering every span directly to end users would confuse observability detail with product meaning.

## Use two linked representations

### 1. Outcome-oriented activity

Default to semantic units users recognize:

- **Intent** — the requested objective or bounded delegated goal.
- **Plan/approach** — only when useful for understanding scope or risk; do not dump hidden reasoning.
- **Execution summary** — meaningful actions grouped by product operation, not every model turn.
- **Result** — artifacts, mutations, decisions, failures and unresolved items.
- **Evidence/provenance** — sources, files, records or external systems that materially support the result.
- **Recovery/control** — inspect, retry, continue, revert, compare, approve, or open technical details when those actions are valid.

Example:

> **Updated onboarding copy** · Agent on behalf of Maya  
> Reviewed 12 screens, changed 5 strings, left 2 ambiguous items unchanged.  
> Evidence: research brief + current design-system guidance.  
> [Review changes] [View run details]

This is not a claim that every agent workflow has a literal planning phase. Preserve the actual workflow; do not fabricate a plan after the fact.

### 2. Technical trace

Expose a deeper trace for debugging, evaluation, administration, support, or expert inspection. Preserve:

- run/trace identity;
- parent-child relationships;
- agent/subagent identity;
- handoffs or agent-as-tool delegation;
- model/tool operations;
- status, errors and cancellation;
- timing and overlap;
- usage/cost when trustworthy and useful;
- sanitized inputs/outputs subject to permissions and privacy.

OpenAI's current tracing UI explicitly represents a turn as a tree containing root-agent work, subagent spans, generations and tool spans, while its timeline shows overlapping work. Microsoft Agent 365 likewise models a run as a tree of OpenTelemetry spans. Treat tree structure as execution evidence, not as the only information architecture for end users.

## Compress by semantic operation, not arbitrary count

A long-running agent may emit hundreds or thousands of low-level events. Group them under a meaningful parent operation when the children are mechanical implementation detail:

> **Compared supplier records** — 428 records checked · 3 sources · 17 exceptions

Expansion can reveal batches, tool calls or individual records when needed.

Do not compress away:

- failed or partially successful side effects;
- approvals and denials;
- changes to permissions or external systems;
- handoffs that materially changed responsibility;
- evidence used for consequential conclusions;
- retries that may have duplicated or altered effects;
- divergence between intended and actual outcome.

A useful test: if hiding the child step could cause a user to misunderstand **what changed, who/what was responsible, why the result is trustworthy, or how to recover**, keep it discoverable.

## Delegation needs provenance, not visual noise

Multi-agent systems introduce two different relationships:

- **handoff:** ownership/control moves to another specialist;
- **agent as tool:** a manager retains ownership while invoking a specialist capability.

OpenAI's current orchestration guidance explicitly distinguishes these patterns. The UI should preserve the distinction when it changes responsibility or user expectations, but does not need to render every internal delegation as a new conversational persona.

Represent at least:

- initiating human/system;
- accountable user-facing agent or workflow;
- executing specialist when materially relevant;
- `on behalf of` relationship for delegated side effects;
- parent run/correlation identity.

Avoid both extremes: attribution laundering (`Victor changed…` when an agent did it) and delegation theater (showing a cast of internal agents that adds no decision value).

## Intent, action, and result are different facts

Do not infer successful completion from a tool call being attempted.

For consequential work preserve separately:

1. **intent** — what the agent was trying to achieve;
2. **operation** — what tool/API/action it attempted;
3. **result** — success, partial success, failure, unknown, cancelled;
4. **observable effect** — what actually changed when this can be verified.

This prevents misleading histories such as `Agent deleted 40 files` when the delete operation failed after 7.

When a run is partial, summarize the boundary explicitly:

> Updated 7 of 40 files. 33 were not changed after permission expired.

## Evidence should attach to claims and decisions

A generic `Sources (12)` footer is weaker than provenance connected to the result it supports. For high-consequence or review-heavy workflows, let users inspect which evidence supported which decision, artifact, or exception.

Distinguish:

- **input/context** supplied to the run;
- **retrieved evidence** actually consulted;
- **derived conclusion** produced by the agent;
- **side effect/artifact** created from that conclusion.

Do not imply that merely retrieving a source means it supports the final claim. Preserve enough linkage to audit important transformations without exposing private chain-of-thought.

## Live progress is not permanent history

During execution, users need orientation: current phase, completed milestones, blockers, approvals, and meaningful outputs as they become available. Permanent history has a different job: reconstruct what happened after completion.

Therefore transient progress chatter may be compacted after the run. Preserve durable milestones, consequential actions, failures, approvals, outputs and provenance. OpenAI currently separates live session events from post-turn traces; this reinforces the architectural distinction between progress delivery and retrospective inspection.

## Concurrency and subagents

Parallel subagents should not be rendered as if they ran sequentially merely because their completion messages arrived in an order. Tracing systems can represent overlapping spans; user-facing summaries should avoid false causal narratives.

Prefer:

> Researched accessibility and performance in parallel; synthesis started after both completed.

only when the dependency is known. If ordering is merely observed timing, present it as timing rather than causality.

For complex runs, a phase/group view can be more legible than a raw tree:

`Understand → Research (3 parallel tasks) → Synthesize → Apply changes → Verify`

This is a UI projection over recorded execution, not permission to invent phases that telemetry cannot support.

## Sensitive data boundary

Trace payloads can contain prompts, tool arguments, retrieved content and tool outputs. Microsoft Agent Framework explicitly gates prompt/response and tool argument/result capture behind sensitive-data configuration in its observability layer. User-facing history should therefore never assume raw trace payloads are safe to display.

Apply:

- permission-aware disclosure;
- secret/token redaction;
- data minimization;
- retention appropriate to payload sensitivity;
- separate product-history and developer-observability access where audiences differ.

A useful activity summary may be retained longer than raw tool payloads.

## Cost and token usage

Usage is useful for operators and sometimes users, but label uncertainty. OpenAI's current tracing documentation notes that usage can arrive after a turn and a blank/null count means unknown, not zero. Do not render missing telemetry as `0 tokens` or final cost.

Show cost/usage where it supports budgeting, diagnosis, or comparison; do not let it dominate ordinary task history when users primarily need outcome and recovery.

## Failure modes

### Trace dump
Every generation and tool call is shown in the primary UI. Technically transparent, operationally unreadable.

### Outcome-only black box
The UI shows only `Done`, hiding partial effects, evidence, delegation and recovery paths.

### Delegation theater
Every internal specialist appears as a persona even when the distinction has no user value.

### Attribution laundering
Agent side effects are attributed directly to the delegating human.

### Attempt-as-success
An invoked tool is rendered as a completed real-world effect without verifying result/status.

### Fake causal story
Parallel or asynchronously delivered events are rewritten as a sequential narrative unsupported by telemetry.

### Evidence laundering
Retrieved documents are displayed as if each one supported the final conclusion.

### Chain-of-thought leakage
Transparency is implemented by exposing hidden reasoning instead of actions, evidence, decisions, outcomes and uncertainty.

### Sensitive trace mirroring
Raw prompts, arguments or tool outputs are copied into a broadly visible activity feed.

### Zero-from-unknown
Delayed/missing usage telemetry is rendered as zero cost or zero tokens.

## Agent decision contract

Before implementing AI-agent history, answer:

1. Who is the audience: end user, reviewer, admin, support engineer, evaluator, developer?
2. What is the semantic unit of work users care about: task, artifact, decision, mutation, batch, run?
3. Which low-level spans can be grouped without hiding consequence, responsibility, failure or evidence?
4. How are human initiator, accountable agent, subagent, tool/integration and `on behalf of` relationships represented?
5. Can intent, attempted operation, operation result and verified external effect be distinguished?
6. Which claims/actions need evidence links, and what provenance can safely be exposed?
7. Which live progress events deserve durable retention after the run?
8. How are parallel work and causal dependencies represented without inventing sequence?
9. Which trace payloads contain sensitive information, and who may inspect them?
10. What recovery path exists for partial, failed, cancelled or harmful side effects?

## Evidence boundary

Current OpenAI and Microsoft agent platforms provide strong implementation evidence that agent runs naturally form hierarchical traces containing model, tool and delegated-agent spans, with status/timing and potentially sensitive payloads. OpenAI also explicitly distinguishes handoffs from manager-controlled specialist calls. These sources support the telemetry model and the need for trace inspection; they do **not** establish that a particular user-facing visualization improves comprehension or trust. The outcome-oriented activity layer and semantic grouping rules above are design synthesis grounded in the repository's existing activity/provenance principles and should be validated with user tasks before being treated as outcome-proven UX.

## Sources

- OpenAI API — Tracing: https://developers.openai.com/api/docs/guides/agents-api/tracing
- OpenAI API — Observability and usage: https://developers.openai.com/api/docs/guides/agents-api/observability
- OpenAI API — Evaluate agent workflows: https://developers.openai.com/api/docs/guides/agent-evals
- OpenAI API — Orchestration and handoffs: https://developers.openai.com/api/docs/guides/agents/orchestration
- Microsoft Learn — Agent Framework observability: https://learn.microsoft.com/en-us/agent-framework/agents/observability
- Microsoft Learn — Agent 365 observability concepts: https://learn.microsoft.com/en-us/microsoft-agent-365/developer/observability-concepts
- OpenTelemetry — Tracing API: https://opentelemetry.io/docs/specs/otel/trace/api/

**Reviewed:** 2026-10-03
