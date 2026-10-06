# AI Agent Presence and Attention UX

How long-running agents should communicate activity without requiring continuous supervision.

## Core principle: optimize for supervision by exception

A long-running agent should not demand the user's continuous attention merely to prove that it is working. The useful question is not “How can we expose more activity?” but “What is the minimum signal that lets the user safely keep doing something else, notice meaningful change, and resume quickly?”

Treat attention as a scarce control resource. Separate **awareness**, **interruption**, **inspection**, and **resumption** rather than routing every event through a chat transcript or notification.

## Presence has modes, not one universal surface

Match communication density to the user's relationship to the running task.

### Background: peripheral awareness

When the user is doing other work, expose a compact, glanceable state such as:
- running normally
- waiting on an external condition
- needs attention
- appears stuck or repeatedly failing
- completed

Do not stream every tool call into the user's foreground. Routine healthy activity should remain inspectable without becoming interruptive.

### Returning: rapid resumption

After an absence, prioritize the delta since the user last attended:
- what materially changed
- important decisions or assumptions
- failures/retries that affected the result
- unresolved issues
- whether the agent now needs input

A chronological transcript is an audit artifact, not an efficient resumption interface.

### Foreground: richer steering

When the user is actively supervising or collaborating, expose more actionable detail: current objective/step, relevant actions, affected objects, errors, planned consequential operations, and pause/redirect controls. Detail should remain layered rather than forcing raw logs into the primary view.

## Evidence: richer communication can reduce errors without increasing monitoring

The 2026 Sidekick study evaluated communication for computer-use agents in a dual-task experiment with 30 participants. Its design combined ambient background cues, multimodal resumption summaries, and richer foreground grounding. Compared with a text-chat baseline, participants ended with fewer spreadsheet errors (mean 1.31 vs 2.51, p<.001) while task-switch frequency and time spent inspecting the agent did not significantly increase. A peripheral text-only condition did not provide the same benefit.

Operational implication: **glanceability is not achieved by shrinking a transcript**. Recode state into compact signals for background awareness, then provide richer evidence when attention returns.

Evidence boundary: this is one controlled CUA study with a deliberately constructed multitasking task and N=30. It supports staged/peripheral communication as a promising pattern, not universal claims about modality, colors, speech, or exact thresholds.

## Progress should communicate evidence, not theater

Avoid invented percentages or phase labels that imply knowledge the system does not have. Prefer observable state:
- current objective or externally meaningful phase
- last meaningful progress/event time
- completed/remaining units when those units are genuinely known
- retries or repeated failure
- waiting reason and dependency
- unresolved approval/input

“Still working” can hide a loop or stall. Activity is also not equivalent to useful progress. Where possible, distinguish healthy progress from repeated activity with no advancement.

Microsoft's 2026 SentinelBench reinforces the architectural distinction for monitoring agents: some long-running tasks are correctly **waiting** rather than continuously acting, and evaluation must balance task completion, reaction time, and resource use. UI should therefore represent `waiting/monitoring` as a legitimate state instead of making inactivity look broken or encouraging wasteful activity merely to appear alive.

## Interruption policy: interrupt for decisions, not telemetry

Escalate from peripheral state to interruption when delay has meaningful cost or the user can materially improve the outcome, for example:
- approval/input is required to continue
- a consequential action is approaching a decision boundary
- repeated failure/drift makes continued autonomy unsafe or wasteful
- a time-sensitive external event requires action
- the requested result is complete and completion itself is time-sensitive

Routine tool success, low-value retries, internal phase transitions, and verbose reasoning usually belong in inspectable history rather than notifications.

Do not assign universal notification thresholds. Interruption value depends on consequence, urgency, recoverability, task duration, user context, and whether the system can safely continue without attention.

## Preserve operator context while the agent continues

Live updates must not steal the user's place. Streaming activity should not:
- snap a scrolled inspection view back to the newest event
- steal keyboard focus
- close expanded evidence
- invalidate a draft the user is preparing
- erase the distinction between events already seen and events that arrived during inspection

A useful presence surface lets the agent continue producing state while the human independently inspects older state.

## Multi-agent supervision amplifies the attention problem

Do not scale a single-agent event feed by simply adding more feeds. For multiple concurrent agents, aggregate routine health and prioritize exceptions. The user should be able to answer:
- which tasks are healthy enough to ignore
- which one needs me now
- why it needs me
- what changed since I last looked

An interruption budget is a useful design hypothesis for multi-agent systems, but current evidence is not mature enough to prescribe a universal algorithm. Keep attention-ranking policies inspectable and validate them against missed-important-event rate as well as notification volume.

## Failure modes

### Transcript-as-dashboard
Users must reread prose/tool logs to discover whether the agent is healthy, blocked, or done.

### Presence theater
Constant animation, token streaming, or tool-call churn creates the appearance of work without proving progress.

### Notification-per-event
Every tool failure or phase transition competes for attention, training users to ignore the agent.

### Silent autonomy
The user can ignore the agent, but cannot tell whether ignoring it remains safe.

### False stuck state
A monitoring agent that is correctly waiting for an external event is shown as inactive or broken.

### Resume by replay
After returning, the user must reconstruct state from the entire history rather than receiving a delta-oriented summary.

### Attention theft
Live updates move viewport/focus or otherwise disrupt the user's current inspection/work.

## Implementation contract for AI coding/design agents

For every long-running-agent surface, define:
1. background states and the minimal peripheral representation
2. what counts as meaningful progress versus mere activity
3. legitimate waiting/monitoring states
4. conditions that escalate to `needs attention`
5. interruption channels and urgency levels
6. what is shown on return since last attention
7. foreground inspection/steering controls
8. how live updates preserve viewport, focus, drafts, and inspection state
9. audit/history access separate from the default status surface
10. metrics for missed critical events, unnecessary interruptions, resumption time, error escape, and task outcome

Prefer **quiet when healthy, explicit when blocked, interruptive only when action is worth the attention**.

## Evidence boundary

Sidekick provides direct controlled evidence for staged multimodal communication in computer-use-agent multitasking, but its exact modalities and error thresholds should not be generalized. AgentGUI separately reports faster identification of key elements from agent traces, supporting the value of purpose-built observability over raw logs, but it evaluates a specific research interface. Anthropic's long-running-agent engineering work supports persistent progress artifacts and resumability at the harness level rather than user-facing attention outcomes. Microsoft SentinelBench establishes that waiting can be correct agent behavior and that responsiveness/resource cost are distinct dimensions. Practitioner proposals around interruption budgets remain emerging and should be treated as hypotheses until better validated.
