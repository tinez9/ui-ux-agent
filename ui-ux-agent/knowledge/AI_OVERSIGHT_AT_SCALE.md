# AI oversight at scale

## Research question

How should products supervise hundreds or thousands of agent actions when reviewing every action would destroy the value of autonomy?

## Core conclusion

Do not equate **human-in-the-loop** with meaningful oversight. At agent scale, exhaustive reactive review is usually neither cognitively credible nor operationally compatible with autonomy. Design oversight as a layered control system: constrain before execution, interrupt selectively during execution, and inspect outcomes and samples after execution.

The useful unit of oversight is not every tool call. It is the **risk-bearing operation or episode**: a semantically coherent action whose consequence, reversibility, permissions, affected resources, uncertainty, anomaly signals, dependencies, and time-to-harm can be evaluated.

## Why per-action review fails

Agentic systems can plan and execute long action chains faster than a person can inspect them. Requiring approval at every step creates approval fatigue and turns autonomy back into manual operation; reviewing only a final aggregate can hide cumulative or early irreversible harm. Recent human-oversight research explicitly warns that merely inserting a person does not guarantee understanding, intervention capacity, robustness, or accountability.

Therefore never describe a workflow as “human supervised” merely because an approval button or dashboard exists. Meaningful oversight requires:

- enough information to understand what matters;
- realistic time and attention to inspect it;
- authority and controls to intervene;
- consequences that are still preventable or recoverable when intervention occurs;
- explicit responsibility for responding to alerts/escalations.

## Layered oversight architecture

### 1. Anticipatory controls — before execution

Move repeated judgment out of runtime approvals and into policy where possible.

Define:
- permitted goals and resource boundaries;
- tool and data permissions using least privilege;
- maximum spend, volume, duration, recipients, affected records, or other blast-radius limits;
- operations that always require approval;
- operations allowed autonomously only while bounded and reversible;
- escalation conditions;
- stop conditions and safe fallback behavior.

This is not a substitute for runtime supervision. It reduces the number of runtime decisions humans must make and prevents some unsafe states from becoming reachable.

### 2. Selective runtime intervention — during execution

Interrupt when the risk state changes, not at arbitrary step counts.

Useful escalation signals include:
- entering a higher-consequence action class;
- irreversible or difficult-to-reverse side effects;
- permission expansion or unexpected resource access;
- spending/volume approaching a policy limit;
- unusual action sequences or anomalous destinations;
- repeated failures/retries;
- meaningful divergence from the approved plan;
- unresolved uncertainty that changes the safety of acting;
- conflicting evidence on a consequential decision;
- suspicious external instructions or possible agent hijacking.

An escalation should explain **why this run crossed the boundary**, what will happen if approved, affected scope, relevant evidence, and available lower-risk alternatives. Do not make the reviewer reconstruct this from raw traces.

### 3. Post-execution monitoring — after execution

For operations safe enough to execute without synchronous review, retain inspectable records and evaluate behavior over time.

Use:
- risk-stratified sampling;
- targeted sampling of novel tools/workflows and recently changed policies;
- anomaly-triggered review;
- outcome/failure monitoring;
- escalation and override rates;
- drift checks;
- periodic review of supposedly low-risk classes;
- incident-driven expansion of future sampling or gates.

Random sampling is useful for estimating routine quality and finding unknown problems, but it is not enough for rare catastrophic failures. Combine it with deterministic gates for known high-consequence actions and targeted/anomaly-based review.

## Sampling is not a safety guarantee

Never present “10% reviewed” as “90% safe” or as proof that unreviewed actions were correct.

A useful oversight report separates:

- total eligible operations;
- operations blocked/gated before execution;
- operations escalated at runtime;
- operations reviewed after execution;
- sampling method and strata;
- anomalies/violations detected;
- unresolved/unobservable operations;
- known coverage limits.

Coverage should be described by **risk strata and detection mechanism**, not only a global percentage. A high sample rate of low-risk events can coexist with zero coverage of the failure class that matters most.

## Review queue design

A scalable supervisor view should prioritize episodes, not chronological tool-call noise.

Each review item should expose:
1. intended outcome;
2. risk-bearing operation and why it was selected;
3. affected entities/resources and blast radius;
4. policy/risk signal that triggered review;
5. evidence/provenance necessary to judge it;
6. actual result or proposed side effect;
7. reversibility/recovery options;
8. related actions collapsed behind progressive disclosure;
9. reviewer action: approve, deny, modify scope, stop, undo/rollback, escalate, or mark for policy change where supported.

Do not rank a queue solely by model confidence. Prioritize expected consequence, irreversibility, policy violations, anomaly severity, uncertainty/evidence quality, novelty, time sensitivity, and dependencies.

## Multi-agent attention arbitration

When several agents can request attention, treat human attention as a **shared, time-varying capacity**, not as an unlimited notification channel. The relevant design problem is no longer “which agent is most urgent?” but “which intervention should consume scarce attention now, which can be batched, and which can safely wait?”

A useful arbitration score should consider at least:

- **time-to-harm / deadline:** how long a decision can safely wait;
- **consequence and irreversibility:** cost if the episode proceeds incorrectly;
- **dependency criticality:** whether other work is blocked by this decision;
- **information value:** whether human judgment can materially change the outcome;
- **novelty / policy coverage:** whether the case falls outside known safe policy;
- **recovery window:** whether deferral preserves undo or fallback options;
- **review effort:** expected attention needed to judge the item well;
- **current reviewer load/fatigue:** capacity is dynamic, not a fixed number of agents per human.

### Interrupt, queue, batch, or suppress

Use four different delivery modes rather than one notification stream:

- **Interrupt now:** imminent/high-consequence state where waiting materially reduces recovery options.
- **Queue visibly:** important but not immediately time-critical work; preserve deadline and dependency context.
- **Batch:** independent, low-urgency episodes that can be judged together without hiding meaningful differences.
- **Suppress/auto-resolve:** bounded cases already covered by reliable policy; keep an audit trail and sampling path rather than demanding attention.

Do not batch merely because items look similar. Preserve separate treatment when consequence, deadline, affected entity, provenance, or recovery differs materially.

### Priority is not static

Priority should age and recompute. A low-priority item can become critical because its deadline approaches, dependent work accumulates, recovery becomes harder, or repeated similar events reveal a systemic failure. Conversely, several alerts caused by one upstream incident should be correlated into a single causal episode where possible rather than competing independently for attention.

Avoid **starvation**: every queued item needs either an expiry/escalation rule, a safe autonomous fallback, or an explicit state showing that no human response is required. “Low priority forever” is not a valid lifecycle.

### Coordinate across agents, not just within each agent

Independent agent-level notification policies can recreate the medical-device “single-device paradigm”: each component behaves reasonably in isolation while the combined system overwhelms the operator. Arbitration therefore belongs above individual agents. Correlate related requests, understand shared dependencies, and budget interruptions across the whole workspace/team.

This is especially important because coordination itself consumes attention. Goodrich, Shields & Adams (2026) model human/robot/AI organizations as an **attention-demand economy** and show why simple human-to-agent ratios hide nonlinear overload and cascading coordination costs. The design implication is not that their graph model supplies a production ranking formula; it is that adding agents, managers, or coordination edges can increase supervisory demand nonlinearly.

A 2026 mixed-methods study of humans supervising multiple AI teammates (N=80) likewise found that agent dependency and information abstraction affect supervision. Do not assume that simply compressing or aggregating agent state always improves oversight: abstraction can reduce information burden while also changing what the supervisor can notice and understand. Test the abstraction level against detection and intervention performance, not visual cleanliness alone.

Emerging evidence from multi-human/multi-robot supervision further suggests that supervisory capacity should be treated dynamically. Lee et al. (2026 preprint) allocate intervention tasks using estimated workload/fatigue and report higher performance and lower behavioral fatigue signs than a fixed-capacity baseline. This is promising evidence for capacity-aware routing, but it is a robotics preprint and should not be generalized into a validated UI algorithm for knowledge-work agents.

### Metrics for attention arbitration

Do not optimize only notification count or mean response time. Track:

- consequential events noticed before the recovery window closed;
- interruption precision: proportion of interruptions that truly required immediate attention;
- queue age by risk/deadline stratum, including worst-case age;
- starvation/expiry count;
- duplicate/correlated alerts collapsed without loss of distinct risk;
- reviewer switching rate and time spent reconstructing context;
- interventions that changed outcomes;
- missed or late escalations;
- workload distribution when multiple reviewers exist;
- whether batching/abstraction hides minority or unusual failure classes.

A quieter interface is not automatically safer. The objective is **better allocation of attention**, not minimum notifications.

## Semantic compression

Compress traces by meaningful operation while preserving evidence needed to investigate failures.

Good: “Checked 428 invoices; 7 exceeded policy threshold; 2 were escalated; 1 could not be verified.”

Bad: 437 nearly identical rows of tool invocations.

Compression must not erase:
- partial failures;
- skipped/unobserved items;
- permission changes;
- external side effects;
- agent/subagent provenance when responsibility changed;
- evidence that caused a consequential decision;
- retries that indicate instability;
- actions hidden by grouping that differ materially in risk.

## Human capacity is part of the safety budget

A control is weak if its expected alert/review load exceeds available attention. Track queue depth, time-to-review, review latency relative to consequence, alert acceptance/override patterns, and whether reviewers meaningfully inspect evidence.

Repeated low-value alerts should lead to better policy/routing, not simply pressure reviewers to click faster. Conversely, a low alert rate is not automatically healthy: thresholds may be suppressing important cases.

## Avoid the “human-in-the-loop illusion”

Treat these as failure modes:

- **Rubber-stamp approval:** reviewer lacks time/context and approvals become habitual.
- **Approval flooding:** too many low-risk interruptions obscure consequential ones.
- **Per-agent alert localism:** each agent optimizes its own alerts while aggregate demand overwhelms the human.
- **Static priority:** an item never ages despite shrinking recovery time or growing dependencies.
- **Priority starvation:** low-ranked work has no expiry, fallback, or escalation path.
- **Dashboard theater:** observability exists but nobody has duty or capacity to act.
- **Late intervention:** the UI alerts after an irreversible effect.
- **Trace dumping:** technically complete logs are cognitively unusable.
- **Global sampling theater:** one review percentage hides uncovered risk classes.
- **Confidence routing:** uncertain model self-reports substitute for consequence/risk analysis.
- **Anomaly-only supervision:** known dangerous actions are allowed because they look statistically normal.
- **Random-only supervision:** rare/high-impact failures are unlikely to enter the sample.
- **Silent scope creep:** new tools, permissions, or action volumes inherit an old oversight policy without reassessment.
- **Skill atrophy:** long periods of passive monitoring reduce reviewers’ ability to intervene effectively; preserve periodic active evaluation/training for consequential domains.

## Decision contract for future agents

When designing supervision for an autonomous workflow:

1. Identify the risk-bearing operations, not just tool calls.
2. Classify consequence, reversibility, blast radius, data/permission sensitivity, dependencies, and time-to-harm.
3. Prevent or constrain unacceptable states before runtime.
4. Gate known consequential/irreversible actions deterministically.
5. Route ambiguous or changed-risk episodes to selective runtime review.
6. Arbitrate attention across agents globally; choose interrupt, queue, batch, or suppress rather than letting each agent notify independently.
7. Recompute priority as deadlines, dependencies, recovery windows, and reviewer capacity change; provide anti-starvation behavior.
8. Let bounded low-risk work run, but preserve auditability and recovery.
9. Sample post-run behavior by risk strata; add targeted and anomaly-triggered review.
10. Expose coverage limits explicitly; never imply unreviewed means safe.
11. Measure reviewer capacity and intervention effectiveness, not only system throughput.
12. Feed incidents and review findings back into policies, permissions, thresholds, tests, routing, and sampling strategy.

## Evidence and boundaries

- NIST AI RMF/AIRC treats AI risk management as an ongoing governance and test/evaluation/verification/validation problem rather than a single approval mechanism. This supports layered monitoring but does not prescribe a universal sampling rate.
- Microsoft’s current agentic-risk guidance identifies lack of meaningful review, approval, correction, interruption, and intelligibility as design risks and recommends risk-specific mitigations across the agent lifecycle.
- Wittens et al., *HHAI 2026* (published 2026-08-19), argues that adding a human does not inherently create effective oversight and highlights cognitive overload, unclear responsibility, and evolving behavior as structural problems.
- Zhu et al., *AI and Ethics* (published 2026-05-04), frames oversight for agentic AI as a design problem that can otherwise collapse autonomy or reduce humans to rubber stamps.
- Goodrich, Shields & Adams, *AI Magazine* (published 2026-08-24), provides a formal attention-demand framing for heterogeneous human/robot/AI organizations and demonstrates nonlinear coordination/overload effects. Its model is a design abstraction with subjective parameters, not a validated universal queue-ranking algorithm.
- “Designing for Oversight” (2026, N=80) directly studies supervision of multiple AI teammates and shows that dependency structure and information abstraction affect oversight; use it to justify testing supervisory information architecture, not a single universal abstraction level.
- Lee et al. (2026 preprint, submitted 2026-10-01) reports benefits from workload/fatigue-aware task allocation in multi-human/multi-robot supervision. Treat this as emerging domain-specific evidence, not settled evidence for knowledge-work agent UIs.
- Koomen et al. (2021) argues from ICU alarm systems that independently alarming devices create overload and that alerts should be integrated and prioritized across devices. The cross-agent analogy is useful, but medical-device safety evidence should not be treated as direct validation of AI-agent notification policies.
- Mitchell, Ghosh & Passi (2026 preprint) argues that agent use can degrade the cognitive capacities required for oversight. Treat this as an important emerging warning, not settled quantitative evidence.
- Baum et al. (2026 preprint) proposes anticipatory oversight alongside reactive intervention for agentic systems. The pre-execution policy framing is promising but remains conceptual and should not be presented as experimentally validated.

There is currently no defensible universal percentage for human review, number of agents per reviewer, or priority formula. Sampling intensity, synchronous gates, and attention arbitration must be derived from consequence, failure distribution, observability, reversibility, dependencies, recovery windows, reviewer capacity, and domain obligations.

## Sources

- NIST, AI Risk Management Framework / AI Resource Center: https://www.nist.gov/itl/ai-risk-management-framework and https://airc.nist.gov/
- Microsoft Learn, “Reduce autonomous agentic AI risk” (accessed 2026-10-03): https://learn.microsoft.com/en-us/security/zero-trust/sfi/manage-agentic-risk
- Wittens et al., “The Challenge of Designing for Meaningful Effective Human Oversight in Rapidly Evolving Complex AI Systems,” HHAI 2026, published 2026-08-19: https://doi.org/10.3233/FAIA260543
- Zhu et al., “Designing meaningful human oversight in AI,” AI and Ethics, published 2026-05-04: https://link.springer.com/article/10.1007/s43681-026-01147-7
- Goodrich, Shields & Adams, “Reframing the human–robot ratio: Collaborative autonomy and the attention-demand economy,” AI Magazine, published 2026-08-24: https://doi.org/10.1002/aaai.70086
- “Designing for Oversight: An Empirical Investigation of the Dual Impact of AI Dependency and Information Abstraction on Human Supervision in Decision-Making Teams,” International Journal of Human–Computer Interaction, published online 2026-02-05: https://doi.org/10.1080/10447318.2026.2618568
- Lee et al., “Real-Time Human-Adaptive Task Allocation for Multi-Human Multi-Robot Supervision,” preprint submitted 2026-10-01: https://arxiv.org/abs/2610.00897
- Koomen et al., “Reducing medical device alarms by an order of magnitude: A human factors approach,” Anaesthesia and Intensive Care, 2021: https://doi.org/10.1177/0310057X20968840
- Mitchell, Ghosh & Passi, “AI Agents Push Humans Out of the Loop,” preprint, 2026: https://arxiv.org/abs/2608.23642
- Baum et al., “Anticipatory Human Oversight of Agentic AI: A Philosophical Account,” preprint, 2026: https://arxiv.org/abs/2609.24242
