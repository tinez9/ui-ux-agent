# Multi-agent delegation UX

**Status:** operational guidance with important validation gaps  
**Last researched:** 2026-10-03

## Research question

When should a product expose multiple AI agents, handoffs, delegation, parallel specialists, and human supervision—and when should orchestration stay invisible behind one accountable interface?

## Core rule

**Expose responsibility changes, not implementation topology.** A system may use many agents internally without making users manage an artificial org chart. Surface another agent when the change materially affects ownership, capability, permissions, context, waiting, approval, or accountability. Otherwise keep specialists behind the primary interaction.

Current agent frameworks independently distinguish two useful orchestration semantics:

- **Manager / agent-as-tool:** one agent retains user-facing ownership and calls specialists for bounded subtasks. Prefer this when the user still has one coherent job and one party can integrate the result.
- **Handoff:** control and task ownership move to a specialist. Prefer this when routing itself matters, the specialist needs an extended interaction, or its instructions/capabilities meaningfully differ.

OpenAI and Microsoft both document this distinction. This is implementation evidence and a strong conceptual boundary, not proof that users prefer visible multi-agent interfaces.

## User-facing model

A delegation event should answer only the questions that change the user's decisions:

1. **Who owns the task now?** Keep one clearly accountable owner for the current outcome.
2. **What was delegated?** Describe the bounded responsibility, not an internal prompt or tool name.
3. **Why was delegation useful?** Explain only when surprising, consequential, or needed for trust.
4. **What context crossed the boundary?** Important when data scope, privacy, permissions, or interpretation can change.
5. **What can the delegate do?** Capability and side-effect boundaries matter more than an agent persona.
6. **Does the user need to act?** Distinguish passive progress from request-for-input and approval.
7. **Where does the result return?** Make integration/ownership explicit when several branches run.

### Visibility ladder

Use the least visible level that preserves comprehension and control:

| Level | UI treatment | Use when |
|---|---|---|
| Internal specialist | invisible; primary agent reports result | bounded analysis with no material ownership/capability change |
| Inspectable delegate | collapsed activity row / details | provenance or debugging is useful but no user action is required |
| Visible collaborator | named workstream with status/output | long-running or parallel work is independently meaningful |
| Handoff | explicit ownership transition | specialist now owns the interaction or needs direct user dialogue |
| Human escalation | explicit transition to a person | policy, judgment, support, or responsibility crosses the AI boundary |

Do not promote every subagent to a visible collaborator merely because the runtime calls it an agent.

## Delegation vs parallelism

Parallel work is useful when subtasks are sufficiently independent. The UI should summarize the **workstreams and their convergence**, not animate every concurrent call.

For each meaningful parallel branch preserve:
- scope;
- state: queued / working / blocked / needs input / completed / failed / cancelled;
- meaningful result or evidence;
- whether failure blocks the parent task;
- integration status.

Avoid fake precision such as continuously changing completion percentages unless progress has a defensible denominator.

When branches disagree, do not silently let the manager erase disagreement. Surface the decision-relevant conflict, evidence, and the rule or judgment used to resolve it. Agreement among agents is not independent corroboration when they share the same model, context, or source failure.

## Handoff design

A handoff is a **control transition**, not merely a different avatar speaking.

Before or at a material handoff, preserve:
- the user's original intent;
- commitments already made;
- relevant constraints and decisions;
- unresolved questions;
- permission/approval state;
- provenance needed to continue safely.

Do not assume all runtime context should cross the boundary. OpenAI supports handoff input filtering, while Microsoft documents context synchronization that deliberately excludes some tool-control content. This makes context transfer an explicit architecture decision rather than a UI fiction that every specialist automatically knows everything.

### Make handoffs legible when

- the specialist may ask follow-up questions directly;
- the available actions or permissions change;
- a regulated or high-stakes responsibility changes;
- a human is entering the loop;
- the user needs to know who can fulfill the next commitment;
- prior context may not fully transfer.

### Keep handoffs quiet when

- the specialist is a bounded implementation detail;
- the primary agent remains accountable for checking and integrating the result;
- exposing it would add names/statuses without changing user decisions.

## Ownership and accountability

Multi-agent UI fails when every participant appears active but nobody appears responsible.

Maintain separate concepts:
- **request owner:** interface/agent accountable to the user;
- **delegate:** performs a bounded responsibility;
- **approver:** human or policy gate authorizing a consequential action;
- **executor:** component that actually causes the external side effect;
- **verifier:** confirms the intended external effect occurred.

One actor can fill several roles, but the data model should not collapse them. This supports accurate activity history and prevents statements such as “Agent A completed the task” when A only requested a tool call that later failed.

## Human supervision

Human involvement should attach to the **decision that needs judgment**, not to arbitrary agent boundaries. Microsoft Agent Framework supports approval-required tools that pause orchestration; OpenAI similarly separates orchestration from tool/guardrail boundaries.

For an approval:
- show the proposed side effect, target, scope, important parameters, and consequence;
- identify which work can continue without approval;
- preserve the pending request durably for long-running workflows;
- after denial, prefer a safe alternative or return to the owner rather than collapsing the entire run when possible.

A user should not need to approve “handoff to researcher agent” if the handoff itself has no consequence. Approval belongs around consequential capabilities.

## Interrupt, cancel, redirect

Users need control over meaningful workstreams, but cancellation semantics must be truthful.

Distinguish:
- **stop future work** — no more steps will start;
- **cancel pending operation** — operation has not taken effect;
- **best-effort cancellation** — external work may already be running;
- **compensate/reverse** — effect happened and a new action attempts to undo it.

Redirecting a parent task should specify whether active delegates are cancelled, allowed to finish, or retained as evidence. Do not orphan invisible branches that can later produce surprising side effects.

## Delegation provenance

Persist enough structure to reconstruct:

`user intent → owner decision → delegation → delegate result → integration decision → external action → verification`

User-facing history can compress this chain, but audit/debug views should retain the links. “On behalf of” is important when an agent acts under a user's authority; it should not rewrite the agent's action as if the human directly performed it.

## Failure modes

### Agent theater
Several named personas narrate trivial subtasks. **Failure:** complexity rises without capability or control benefit. **Fix:** collapse internal specialists behind one owner.

### Ownership ping-pong
Agents repeatedly hand off and the user must restate context. **Fix:** constrain routing graph, retain a fallback owner, preserve a compact handoff packet, detect repeated routing.

### Invisible capability escalation
A specialist gains broader tools or permissions after handoff. **Fix:** treat capability expansion as a meaningful boundary; require policy checks and, when consequential, explicit approval.

### Context laundering
A delegate receives sensitive or irrelevant history simply because the parent had it. **Fix:** minimize handoff context by task need and permission scope.

### Consensus theater
Multiple agents return similar answers and the UI presents this as independent confidence. **Fix:** record source/model/context dependence; seek genuinely independent evidence when corroboration matters.

### Parallel-status noise
The interface exposes every internal call as a progress item. **Fix:** group by user-meaningful workstream and reveal traces on demand.

### Manager overclaim
The manager reports success after a delegate merely attempted an action. **Fix:** separate attempted, acknowledged, and verified effects.

### Dead-end specialist
A delegate cannot solve the task and has no route back. **Fix:** define return/escalation paths and preserve unresolved state.

### Approval by topology
Users are asked to approve internal delegation rather than the risky action. **Fix:** gate consequences, not architecture.

## Implementation contract for agents

Before exposing multi-agent behavior, answer:

1. Is this actually a user-visible ownership change or only internal decomposition?
2. Who remains accountable for the final outcome?
3. What capability/permission changes at each boundary?
4. What minimum context must cross, and what must not?
5. Can workstreams run independently, and how are results reconciled?
6. Which failures block the parent task versus degrade one branch?
7. Where can the user interrupt, redirect, approve, or escalate?
8. How are delegation and external effects recorded for provenance?
9. What happens on repeated handoff, delegate failure, or stale context?
10. Could the same capability be clearer with one visible agent and hidden specialists?

If these answers are unclear, adding visible agents is premature.

## Evidence and boundaries

### Primary / official sources

- OpenAI Agents SDK, **Agent orchestration**: manager/agents-as-tools versus handoffs; LLM-driven versus code-driven orchestration. Reviewed 2026-10-03. https://openai.github.io/openai-agents-python/multi_agent/
- OpenAI Agents SDK, **Handoffs**: control transfer, handoff metadata, input filtering, authorization caveat, history behavior. Reviewed 2026-10-03. https://openai.github.io/openai-agents-js/guides/handoffs/
- Microsoft Agent Framework, **Handoff orchestration**: explicit task ownership distinction, context synchronization, interactive/autonomous modes, routing and checkpointing. Reviewed 2026-10-03. https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/handoff
- Microsoft Agent Framework, **Human-in-the-loop**: approval-required tools and request/response pauses in orchestrated workflows. Reviewed 2026-10-03. https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop

### Evidence boundary

These sources strongly establish current orchestration semantics and implementation constraints across independent frameworks. They do **not** provide controlled comparative evidence that users benefit from seeing named subagents, agent org charts, or a particular visualization. The visibility ladder, ownership model, grouping rules, and anti-theater guidance are design synthesis grounded in those mechanics plus existing repository principles on provenance, risk-shaped approval, agent activity, and uncertainty. Treat them as operational hypotheses to validate in product contexts rather than measured universal laws.

## Next research questions

- What controlled or field evidence exists on whether users understand visible multi-agent delegation better than a single accountable assistant?
- How should conflicting specialist recommendations be compared when sources/models are not independent?
- Which delegation visualizations scale from 2–3 workstreams to dozens without becoming workflow-debug UIs?
- How should permissions be inherited, attenuated, or re-authorized across delegation chains?
