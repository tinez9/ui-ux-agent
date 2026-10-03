# AI Advice Sequencing and Cognitive Friction

Operational guidance for deciding **when** to reveal AI recommendations in decision-support interfaces. The goal is appropriate reliance, not maximum acceptance of AI output or maximum user satisfaction.

## Core rule: recommendation timing is part of the decision architecture

Showing AI first is not neutral. It can anchor the user's search, interpretation, and final judgment before they have formed an independent view. Showing AI second is also not universally superior: the user's initial answer can become its own anchor, and mandatory pre-commitment adds effort and latency.

Treat sequencing as a risk-shaped design decision:

- **AI-first** is reasonable when speed, generation, exploration, or low-cost suggestion is the main value and independent human judgment adds little safety value.
- **Human-first** is worth considering when the human has relevant evidence/expertise, an incorrect recommendation has meaningful cost, and independent assessment is feasible before exposure.
- **Evidence-first** can be preferable when both a human-first guess and an AI-first answer would prematurely anchor the task: show observations/cases/evidence before a recommendation.
- **Adaptive sequencing** may vary by consequence, disagreement, expertise, model reliability, time pressure, or whether the action is reversible.

Do not turn `human first` into a universal AI-safety ritual.

## What the evidence currently supports

A 2025 systematic review of 35 quantitative human-AI decision studies (19,774 participants) identifies recommendation order, workload, task complexity, expertise, trust, and verification effort as interacting factors in automation bias. It reports evidence that AI-first advice can prime subsequent judgment, while human-first protocols can reduce some AI anchoring but also produce conservatism toward the user's initial answer or complacency when AI confirms it.

Buçinca, Malaya & Gajos (CSCW 2021, N=199) tested cognitive forcing functions designed to make people engage more analytically before relying on AI. The interventions reduced overreliance relative to simple explainable-AI baselines, but the most effective designs received worse subjective ratings and benefited participants with higher Need for Cognition more. This is a critical product trade-off: friction that improves decision behavior can simultaneously make the interface less liked.

A 2025 CSCW study on partial explanations (two studies, N=264 and N=210) found further evidence that interaction design can change overreliance, but effects varied with explanation form, task difficulty, and cognitive motivation. This argues against treating one forcing mechanism as a portable universal pattern.

A 2025 glaucoma-referral study with 87 optometrists found human-AI teams outperformed humans alone but underperformed the AI alone; explanations did not improve team performance and post-hoc explanations increased overreliance on incorrect AI recommendations. The authors explicitly propose staged initial-assessment → AI-review → final-decision designs as a way to observe and potentially manage these effects, while noting that confirmation bias can still operate after an initial judgment.

## Independent-first is a measurement tool as well as a UX pattern

Capturing a meaningful initial judgment before AI exposure creates a baseline that lets a product distinguish:

- **beneficial reliance:** initial wrong → final correct after AI;
- **harmful overreliance:** initial correct → final wrong after AI;
- **under-reliance:** initial wrong → final remains wrong despite useful AI advice;
- **resistance/verification:** initial correct → final remains correct despite wrong AI advice.

Without the initial state, an acceptance rate cannot tell whether AI improved judgment. `User accepted 82% of suggestions` is not a quality metric unless suggestion correctness and decision outcomes are known.

Do not capture an artificial initial answer solely to manufacture analytics. The pre-AI judgment should represent a decision the user could reasonably make from available evidence.

## Cognitive friction should be targeted, not ambient

Friction can be useful when it creates **diagnostic cognitive work**: inspecting evidence, articulating a rationale, comparing alternatives, checking a contradiction, or making an independent assessment.

Weak friction merely delays the click: arbitrary countdowns, repeated confirmations, or forced explanation expansion can increase annoyance without improving verification.

Prefer friction where:

`expected cost of uncritical acceptance × plausible AI error > cost of additional human effort`

This is a design heuristic, not a calibrated formula. The important point is to tie friction to consequence and verification value.

Escalate selectively:

1. low-stakes suggestion → show directly;
2. moderate decision → expose evidence and easy verification;
3. consequential decision with capable human reviewer → consider independent judgment before recommendation;
4. human/AI disagreement → make the conflicting evidence inspectable rather than simply asking which answer to trust;
5. irreversible/high-blast-radius action → combine decision review with the separate approval/recovery controls appropriate to the action.

## Preserve the ability to change one's mind

Human-first designs fail when the initial answer becomes a commitment device. Label it as an **initial assessment**, not a verdict. After AI advice appears:

- preserve both initial and final judgments when useful;
- make revision socially and mechanically easy;
- show decision-relevant evidence, not just `AI disagrees`;
- avoid language that frames changing one's mind as admitting failure;
- distinguish a changed answer from blindly accepting AI.

The objective is independent evidence processing followed by integration, not stubbornness.

## Time pressure changes the trade-off

Independent review consumes time. Research summarized in the 2025 automation-bias review indicates that shorter decision time can increase anchoring and that additional observation/verification time can improve resistance to bad advice in some tasks. Therefore a workflow cannot demand careful independent judgment while operational metrics simultaneously punish users for taking that time.

For time-critical work, consider whether AI should instead prioritize evidence, anomalies, or alternatives rather than force a complete duplicate human decision before revealing assistance.

## Explanations are not a substitute for sequencing

An explanation shown beside an already-salient recommendation can itself become persuasive evidence. Existing studies repeatedly find that explanations can increase trust or overreliance without improving accuracy.

Ask what the user should evaluate **before** revealing the recommendation. In some domains, showing relevant observations, comparable cases, assumptions, or contradictory evidence first can support reasoning without immediately supplying an answer to anchor on.

Do not infer that hiding AI predictions is always safer. The correct comparison is decision quality under realistic workflow constraints.

## When not to require independent judgment

Avoid mandatory human-first assessment when:

- the task is primarily generative or exploratory rather than adjudicative;
- the user lacks the information or expertise needed for a meaningful independent judgment;
- AI is performing tedious low-risk transformation with easy undo;
- duplicating the decision creates high workload with little error-detection value;
- latency is safety-critical and independent review would delay a more reliable response;
- the recommendation is merely one optional input among many and cannot trigger consequential action by itself.

A ritualized `decide before seeing AI` step can become oversight theater just as easily as a ritualized approval button.

## Evaluation: measure reliance quality, not trust alone

For decision-support experiments, record where feasible:

- initial human decision and confidence;
- AI recommendation and whether it was correct under the evaluation ground truth;
- final human decision;
- correct acceptance and correct rejection separately;
- harmful switches caused by wrong AI;
- missed beneficial switches when AI was right;
- verification behavior and time cost;
- workload and subjective satisfaction;
- subgroup/expertise effects;
- downstream decision quality, not only agreement with AI.

A design that lowers AI acceptance can be worse if it creates systematic under-reliance. A design that users dislike slightly can be better for consequential work if it materially improves decision quality. Neither conclusion should be assumed without measurement.

## Failure modes

- **AI-first anchoring:** the recommendation becomes the frame through which all evidence is interpreted.
- **Human-first conservatism:** users defend their initial answer after better evidence arrives.
- **Confirmation amplification:** AI agreement makes an initial human belief feel more certain without independent corroboration.
- **Friction theater:** extra clicks create delay but no verification.
- **Satisfaction optimization:** removing useful cognitive work because the lower-friction version scores better subjectively.
- **Throughput contradiction:** the UI asks users to verify carefully while organizational incentives reward speed.
- **Explanation persuasion:** a plausible rationale increases acceptance without improving error detection.
- **Expertise mismatch:** novices are forced to produce meaningless initial judgments they cannot evaluate.
- **Acceptance-rate proxy:** high agreement with AI is reported as successful collaboration without measuring correctness.
- **Universal human-first rule:** a pattern supported in some decision tasks is copied into low-risk or generative workflows where it only adds cost.

## Decision contract for AI coding/design agents

Before choosing AI-first or human-first presentation, answer:

1. Is this a decision, a suggestion, a generation task, or an action approval?
2. Can the user form a meaningful independent judgment from available evidence?
3. What is the cost of an incorrect AI anchor?
4. What is the cost of delaying AI assistance?
5. Would an initial human judgment become a harmful anchor of its own?
6. Could evidence be shown before either party's conclusion?
7. What verification behavior should the added friction actually cause?
8. Can the user revise the initial assessment without penalty or stigma?
9. Are workload, time pressure, expertise, and accessibility compatible with the extra step?
10. Will evaluation measure correct reliance rather than acceptance, trust, or satisfaction alone?

If these cannot be answered, do not add a mandatory pre-AI decision step by default.

## Evidence boundary

The strongest current evidence is concentrated in controlled decision-support tasks and high-stakes professional domains, not ordinary generative-product UX. The 2025/2026 automation-bias review is useful for cross-study synthesis but reports heterogeneous tasks and interventions. Buçinca et al. provides direct experimental evidence for cognitive forcing with a satisfaction and individual-difference trade-off. The glaucoma study demonstrates that explanations and human-AI combination can behave unexpectedly in a real professional population.

These sources support treating recommendation order and cognitive friction as consequential design variables. They do **not** establish that human-first always improves accuracy, a universal delay duration, a universal confidence threshold, or a single interaction that works across domains. Validate sequencing against task outcomes and realistic workload.

## Key sources

- Romeo, G. & Conti, D. (2025/2026), *Exploring automation bias in human–AI collaboration: a review and implications for explainable AI*, AI & Society. https://doi.org/10.1007/s00146-025-02422-7
- Buçinca, Z., Malaya, M. B. & Gajos, K. Z. (2021), *To Trust or to Think: Cognitive Forcing Functions Can Reduce Overreliance on AI in AI-Assisted Decision-Making*, PACM HCI / CSCW. https://doi.org/10.1145/3449287
- *Cognitive Forcing for Better Decision-Making: Reducing Overreliance on AI Systems Through Partial Explanations* (2025), PACM HCI / CSCW. https://doi.org/10.1145/3710946
- *The explainable AI dilemma under knowledge imbalance in specialist AI for glaucoma referrals in primary care* (2025), professional user study, N=87. https://pmc.ncbi.nlm.nih.gov/articles/PMC12635309/
