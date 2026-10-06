# AI Reliance and Trust Calibration UX

## Decision objective
Design for **appropriate reliance**, not maximum trust, agreement, acceptance, or satisfaction. A useful AI interface helps people accept good assistance and reject bad assistance. Over-reliance and under-reliance are both failures.

Trust is an attitude; reliance is behavior. Measure both separately. A product can increase reported trust or agreement while making discrimination between correct and incorrect advice worse.

## Core model
For decision support, evaluate at least four outcomes when ground truth is available:

| Human response | AI correct | AI incorrect |
|---|---|---|
| Accept AI | useful reliance | over-reliance |
| Reject AI | under-reliance | useful rejection |

Do not optimize `acceptance_rate` alone. Prefer metrics such as final decision accuracy, acceptance conditional on AI correctness, rejection conditional on AI incorrectness, and the delta from human-only and AI-only baselines. Segment by task, failure mode and user expertise.

For generative or open-ended work without simple ground truth, substitute observable verification targets: requirement satisfaction, source validity, test results, policy compliance, reversible outcomes, independent review, or downstream error rate.

## What current evidence changes

### 1. More trust is not the goal
Recent human-AI research repeatedly separates self-reported trust from behavioral reliance. A 2026 study comparing one-step and two-step decision workflows found no evidence that forcing an initial human decision universally reduced over-reliance and again showed that reported trust and reliance are distinct constructs. Do not treat a trust survey as proof of calibrated use.

### 2. Explanations can increase reliance on wrong answers
Microsoft HAX explicitly warns that the mere presence of explanations can increase trust and over-reliance. A preregistered LLM study (N=308) likewise found explanations increased reliance on both correct and incorrect responses; sources and visible inconsistencies reduced reliance on incorrect responses. Therefore `show explanation` is not a generic calibration fix.

Use explanations when they provide **decision-relevant evidence the user can interrogate**: source/provenance, assumptions, uncertainty/failure region, inputs that drove the result, counterevidence, or a way to test the claim. Avoid persuasive rationale whose primary effect is making an answer sound coherent.

### 3. Confidence displays are conditional, not sufficient
Showing calibrated model uncertainty alone does not guarantee calibrated human reliance. Experimental work has found effects depend on representation, task, initial human judgment and user characteristics. Confidence must correspond to a validated quantity and a relevant reference class; do not expose model self-confidence as if it were empirical probability of correctness.

When reliable uncertainty exists, pair it with actionable meaning: what is uncertain, what failure mode is plausible, and what the user should verify. Do not manufacture precise percentages to create an appearance of calibration.

### 4. Error type matters, not only aggregate reliability
Automation studies show false alarms and misses can affect trust, compliance, reliance and situation awareness differently even at similar overall reliability. A single `95% accurate` label can therefore hide the behavior that matters to the user's decision.

Communicate performance in terms aligned with consequences: false-positive/false-negative tendencies, weak regions, known unsupported cases, or task-specific reliability when those distinctions are validated and decision-relevant.

### 5. Expertise and self-confidence change reliance
A 2025 study of 529 chess players found expertise related to greater self-confidence and lower trust in AI advice; appropriate reliance was shaped by both. Other empirical work shows interventions can help one user group while harming another. Do not assume novices and experts need the same explanation, interruption, or verification burden.

Adapt primarily to observable task/risk conditions and demonstrated behavior. Treat inferred psychological `trust scores` cautiously: they are noisy, contextual and can create manipulative feedback loops.

### 6. Calibration is longitudinal
Users learn a system's reliability from experience. Capability/model changes can invalidate that learned calibration. HAX therefore recommends notifying users when capabilities change; importantly, an overall improvement can still introduce regressions in a subdomain.

After material model/tool/policy changes, surface the change where it affects decisions and re-establish expectations. Do not preserve a UI implication of stable competence across a changed system.

## Interaction contract

### Before reliance
- State the task boundary: what the AI is intended to do and important unsupported cases.
- Communicate consequential limitations using the user's task vocabulary, not generic disclaimers.
- For high-stakes advice, make the verification path available before acceptance.
- Preserve the user's ability to form an independent judgment when doing so materially improves the decision; do not force a two-step workflow everywhere because evidence does not support it as a universal anti-bias mechanism.

### At the decision point
- Distinguish **recommendation** from **evidence**.
- Show provenance, assumptions, uncertainty or known failure region when they change the decision.
- Make accepting, rejecting, editing, comparing and verifying feasible; avoid UI asymmetry that makes acceptance effortless but correction expensive.
- Escalate friction with consequence and irreversibility, not merely with low model confidence.
- When an answer conflicts with authoritative evidence or the user's verified state, expose the conflict rather than smoothing it into one confident narrative.

### After outcomes
- Make consequential errors and corrections observable so users can update expectations.
- Do not hide failures while prominently celebrating successes; selective visibility creates false calibration.
- If users repeatedly override the same class of output, investigate the model/workflow rather than merely adding more explanation.
- Recalibrate expectations after material capability changes.

## Calibration interventions: use conditionally

| Intervention | Can help when | Can fail when |
|---|---|---|
| Confidence/uncertainty | quantity is empirically calibrated and users can act on it | confidence is self-reported/model-generated, poorly understood, or increases blanket deference |
| Explanation | exposes checkable evidence, assumptions or failure modes | fluent rationale merely increases persuasiveness |
| Sources/provenance | claims can be independently checked | citation presence is mistaken for source quality or entailment |
| Initial human judgment | anchoring on AI is a demonstrated problem and task cost is acceptable | adds friction; evidence does not show universal over-reliance reduction |
| Forced pause | consequence warrants deliberation and over-reliance is observed | applied indiscriminately, causing ritual friction/approval fatigue |
| Counterevidence | high trust/deference needs active challenge | fabricated or low-quality counterarguments create false balance |
| Tutorial/examples | stable failure patterns can be taught | static examples become stale or shift reliance incorrectly for some users |
| Human review | reviewer has relevant competence, context and time | `human in loop` becomes ceremonial approval under overload |

## Failure modes

### Trust-maximization theater
**Smell:** success is reported as trust, satisfaction, agreement or adoption rising.  
**Fix:** measure decision quality and conditional reliance.

### Explanation halo
**Smell:** every AI output gets a polished rationale.  
**Risk:** plausibility is mistaken for evidence.  
**Fix:** expose checkable evidence and limitations; test reliance on incorrect outputs.

### Confidence theater
**Smell:** precise confidence numbers with no validated reference class.  
**Fix:** either calibrate and define the quantity or omit numeric precision.

### Aggregate-accuracy laundering
**Smell:** one reliability percentage hides asymmetric failures.  
**Fix:** communicate decision-relevant failure modes and subgroup/task performance where validated.

### Permanent first-impression calibration
**Smell:** onboarding describes capabilities once, then the model changes silently.  
**Fix:** notify material changes and regressions at the point they affect work.

### Universal friction
**Smell:** force users to independently answer, explain, confirm or pause on every interaction.  
**Fix:** reserve deliberative friction for demonstrated bias/risk; measure its net effect.

### Human-review laundering
**Smell:** presence of a reviewer is counted as safety without testing whether they catch bad advice.  
**Fix:** measure reviewer discrimination, workload, misses, overrides and recovery.

## Evaluation protocol
For consequential AI-assisted decisions, test with deliberately mixed-quality assistance. A system that is nearly always correct cannot reveal whether users can recognize its failures.

1. Include correct outputs plus realistic failure modes, including plausible high-confidence failures.
2. Randomize or counterbalance interface interventions where feasible.
3. Record initial human judgment when the research question requires it, but do not impose it as product policy by default.
4. Measure final accuracy/quality, correct acceptance, incorrect acceptance, correct rejection, incorrect rejection, verification behavior, time/workload, and self-reported trust separately.
5. Segment by expertise and relevant task familiarity.
6. Repeat after exposure; first-use calibration can differ from learned behavior.
7. Re-test after meaningful model or capability changes.
8. Track false alarms and misses separately when their consequences differ.

A calibration intervention succeeds when it improves **discrimination and outcomes at acceptable cost**, not simply when trust moves toward a target value.

## Evidence boundary
The strongest evidence here comes from controlled decision-support experiments, human-factors automation research, and Microsoft's research-backed HAX guidance. Effects are task- and population-dependent; findings from chess, driving, UAV control, factual QA or medicine should not be converted into universal thresholds. Adaptive trust interventions are promising but are not mature enough to justify silently manipulating every user's interface from an inferred psychological state.

## Sources reviewed
- Microsoft HAX, “Make clear how well the system can do what it can do”: https://www.microsoft.com/en-us/haxtoolkit/guideline/make-clear-how-well-the-system-can-do-what-it-can-do/
- Microsoft HAX, “Make clear why the system did what it did”: https://www.microsoft.com/en-us/haxtoolkit/guideline/make-clear-why-the-system-did-what-it-did/
- Microsoft HAX, “Notify users about changes”: https://www.microsoft.com/en-us/haxtoolkit/guideline/notify-users-about-changes/
- NIST AI Use Taxonomy (2024): https://www.nist.gov/publications/ai-use-taxonomy-human-centered-approach
- Kim et al., “Fostering Appropriate Reliance on Large Language Models” (2025): https://arxiv.org/abs/2502.08554
- Cao, Liu & Huang, “Designing for Appropriate Reliance” (2024): https://arxiv.org/abs/2401.05612
- Srinivasan & Thomason, “Adjust for Trust” (2025): https://arxiv.org/abs/2502.13321
- Spillner et al., “Not All Trust is the Same” (2026): https://arxiv.org/abs/2603.05229
- Li et al., “Effect of Reliability, Its Framing and Error Bias on Trust in Human-Vehicle Collaboration” (2025): https://doi.org/10.1002/hfm.70008
- Jackson et al., “Automation Error Bias, Trust, and Dependence Behaviors in a Simulated Drone Collision Avoidance Task” (2026): https://doi.org/10.1177/00187208261425068
- “Investigating appropriate reliance on AI-Based decision support systems” (2025): https://doi.org/10.1080/12460125.2025.2593251

**Reviewed:** 2026-10-04
