# AI-Native UX

Patterns for products incorporating models, copilots, generative systems, or autonomous agents.

## Core model: autonomy should be risk-shaped

Do not choose between “ask for everything” and “fully autonomous.” Match oversight to the consequence and reversibility of the action.

### Low-risk, reversible work
Prefer bounded autonomy with visible status and easy correction. Repeated approval prompts create friction and can produce approval fatigue.

### Consequential side effects
Pause before actions such as sending, publishing, deleting, purchasing, cancelling, changing permissions, modifying shared resources, or other operations with meaningful external impact. Show the concrete action and target rather than a vague “Allow?” prompt.

### Irreversible or high-blast-radius work
Require stronger confirmation and constrain what the agent is technically able to affect. Permission UX is not a substitute for sandboxing, scoped credentials, network/filesystem boundaries, or policy enforcement.

**Evidence:** OpenAI currently recommends human review around side-effecting tool calls; Anthropic reports that users approved roughly 93% of Claude Code permission prompts and found sandboxing reduced prompts by 84%, motivating risk-sensitive automated approvals rather than blanket prompting.

## Progressive autonomy

Autonomy is a product control, not a binary property.

Expose meaningful scopes such as:
- always allow a narrow routine action
- require approval for a specific class of side effects
- block a capability
- limit accessible tools, files, accounts, domains, or resources

Prefer narrow capability grants over broad “trust this agent” switches.

## Approval design

Approval is most useful at a decision boundary where user intent is ambiguous or consequences are significant.

A good approval surface communicates:
- **action** — what will happen
- **target** — which object/person/system is affected
- **scope** — one item, a batch, or an ongoing permission
- **consequence** — what changes externally
- **reversibility** — whether and how it can be undone
- **reason** — why the agent believes the action is needed

Avoid approval spam. If users approve routine actions reflexively, redesign the boundary: automate genuinely low-risk work inside constrained permissions and reserve interruptions for decisions worth attention.

## Progress and inspectability

Long-running agents need more than a spinner.

Expose enough information for a user to answer:
1. What is the agent trying to achieve?
2. What is it doing now?
3. What has it already changed?
4. Is it blocked or waiting for me?
5. Can I interrupt it safely?
6. What did it use to reach the result?

Prefer layered detail:
- concise state/progress by default
- expandable actions, tools, data sources, and logs when inspection matters
- a post-run summary for consequential work

Microsoft's current agent-risk guidance explicitly recommends showing planned actions for high-impact work, real-time status, outcome summaries, and accessible post-execution logs.

## Recovery: design before-action and after-action controls together

Pre-action approval and post-action undo solve different problems.

Use approval when a mistake would be expensive, external, or difficult to reverse. Use undo/revert when an automated action is reversible and interruption would add more cost than protection.

When the agent changes user content automatically:
- make the change visible
- provide a clear way back to the previous state
- identify exactly which action will be reverted
- preserve enough history to recover safely

Microsoft HAX specifically recommends undo for proactive automated changes that may be wrong. If users must repeatedly correct the AI, reconsider whether that automation should exist or remain enabled.

## Denial should be recoverable

When policy or permission blocks an action, do not make “blocked” a dead end if a safe alternative exists.

A useful recovery pattern is:
1. state the boundary concisely
2. preserve completed safe work
3. propose or automatically attempt a lower-risk route
4. escalate only when the remaining decision genuinely requires the user

Anthropic's 2026 auto-mode design uses this deny-and-continue approach so false positives do not automatically terminate long-running work.

## Provenance should be proportional to consequence

Not every AI output needs a wall of citations. Provenance becomes more important when users must verify factual claims, understand what data affected an action, audit consequential automation, or communicate AI-produced material downstream.

For consequential agent work, retain inspectable records of relevant tools/data and actions. Present a concise summary first and expose detail on demand.

## Trust calibration

Do not communicate AI confidence through anthropomorphic certainty.

Help users calibrate trust through:
- explicit scope and limitations
- observable actions and results
- source/provenance access where relevant
- visible uncertainty when it changes a decision
- correction and recovery paths
- predictable permission boundaries

## Implementation checklist for AI coding agents

For every autonomous feature, define:
- action classes and their risk level
- side effects and blast radius
- permission scopes
- approval thresholds
- progress states
- interrupt/cancel semantics
- retry behavior
- undo/revert behavior
- audit/provenance requirements
- failure and partial-success states
- what happens when a guardrail denies an action

Do not ship the happy-path agent loop without these states.

## Evidence boundary

The approval-fatigue and sandboxing numbers above are Anthropic product telemetry and engineering evidence, not universal UX measurements. OpenAI and Microsoft guidance independently support risk-based approvals, guardrails, inspectability, and recovery, while Microsoft HAX provides longer-lived human-AI interaction research. Together they support the architecture, but exact thresholds should be validated for each product and risk domain.

Do not treat AI-native UX as synonymous with chat UI.
