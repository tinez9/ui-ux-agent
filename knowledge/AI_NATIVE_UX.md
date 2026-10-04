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

## Trust calibration: optimize decisions, not perceived trust

The goal is not to make users trust AI more. It is to help them rely on it when warranted and scrutinize, override, or verify it when not.

Treat **system trustworthiness**, **displayed confidence**, **user trust**, **user self-confidence**, and **decision quality** as separate variables. NIST's trustworthiness model includes validity/reliability and explainability/interpretability as distinct characteristics; an explanation is not evidence that an output is correct.

### Confidence is an intervention, not neutral metadata

Show confidence only when it is meaningful for the task, calibrated against outcomes, and likely to change a useful decision. Do not manufacture precise percentages from model tone, token probabilities, or an unvalidated heuristic.

A 2025 randomized Microsoft Research study found that users' self-confidence aligned with displayed AI confidence and that this effect could persist after AI assistance ended; real-time correctness feedback reduced the alignment. Therefore a confidence badge can alter human metacognition rather than merely report model state.

Prefer, when appropriate:
- calibrated uncertainty tied to the specific decision or claim
- concrete limitations or missing evidence
- source/provenance access
- verification or comparison actions
- outcome feedback that lets users learn when reliance was justified

### Explanation can increase persuasion without increasing correctness

Do not equate more reasoning text with transparency or calibration. A 2026 preregistered study (N=559) found that summarized reasoning traces increased trust and appeal without improving task performance over answer-only output; full traces impaired performance in that experiment, and neither trace format calibrated users' self-evaluation. Separate 2025 research found confident delivery could suppress error detection even when reasoning was flawed.

Use explanations to answer decision-relevant questions such as:
- What evidence materially supports this output?
- What assumptions or constraints matter?
- What would make the recommendation change?
- What should the user verify before acting?

Do not expose verbose reasoning merely to create an impression of rigor. Prefer concise evidence, assumptions, provenance, and actionable verification over persuasive narrative.

### Match uncertainty UX to consequence

For low-consequence generative work, correction and iteration may be more useful than persistent confidence UI. For consequential factual or decision-support work, uncertainty, provenance, alternatives, and verification paths deserve more prominence.

When uncertainty is high and the system can reduce it, prefer an action over a decorative warning: ask for missing context, retrieve stronger evidence, compare alternatives, run a check, or defer a consequential action.

### Evaluate calibration behaviorally

Do not measure trust UX only with “How much do you trust the AI?” Track whether users:
- accept correct assistance and reject incorrect assistance
- verify when verification is warranted
- detect failures and recover
- maintain appropriate self-confidence
- understand scope and limitations
- avoid both automation bias and needless distrust

Where ground truth is available, evaluate reliance conditional on AI correctness and confidence, not only aggregate acceptance rate.

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
- whether confidence is actually calibrated and decision-relevant
- what uncertainty/provenance users need at the decision point
- how users can verify consequential outputs
- how calibration will be evaluated beyond self-reported trust

Do not ship the happy-path agent loop without these states.

## Evidence boundary

The approval-fatigue and sandboxing numbers above are Anthropic product telemetry and engineering evidence, not universal UX measurements. OpenAI and Microsoft guidance independently support risk-based approvals, guardrails, inspectability, and recovery, while Microsoft HAX provides longer-lived human-AI interaction research. NIST supports separating trustworthiness characteristics and evaluating AI in context of human goals. Recent Microsoft studies provide experimental evidence that confidence and explanation presentation can themselves alter reliance, self-confidence, error detection, and subjective trust; these findings are task- and study-specific and do not justify a universal prohibition on confidence displays or explanations. Exact thresholds and presentation choices should be validated for each product and risk domain.

Do not treat AI-native UX as synonymous with chat UI.
