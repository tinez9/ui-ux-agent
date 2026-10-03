# AI Advice Sequencing and Cognitive Friction

Operational guidance for deciding **when and in what form** to reveal AI recommendations in decision-support interfaces. The goal is appropriate reliance and stable evidence standards, not maximum acceptance of AI output or maximum user satisfaction.

## Core rule: recommendation timing is part of the decision architecture

Showing AI first is not neutral. It can anchor the user's search, interpretation, and final judgment before they have formed an independent view. Showing AI second is also not universally superior: the user's initial answer can become its own anchor, and mandatory pre-commitment adds effort and latency.

Treat sequencing as a risk-shaped design decision:

- **AI-first** is reasonable when speed, generation, exploration, or low-cost suggestion is the main value and independent human judgment adds little safety value.
- **Human-first** is worth considering when the human has relevant evidence/expertise, an incorrect recommendation has meaningful cost, and independent assessment is feasible before exposure.
- **Evidence-first** can be preferable when both a human-first guess and an AI-first answer would prematurely anchor the task: show observations, cases, anomalies, or source evidence before a recommendation.
- **Adaptive sequencing** may vary by consequence, disagreement, expertise, model reliability, time pressure, or whether the action is reversible.

Do not turn `human first` into a universal AI-safety ritual.

## Evidence-first is not merely AI-first with citations

The useful distinction is **prescriptive recommendation vs inspectable decision evidence**. Evidence-first should help the user evaluate the case before the interface supplies a conclusion that can become an anchor.

A controlled emergency-decision experiment with 438 clinicians and 516 non-experts provides unusually concrete evidence for this distinction. Participants were influenced by biased AI when it issued prescriptive recommendations, including discriminatory shifts in decisions. Reframing the same support as **descriptive flags** allowed participants to retain their original unbiased decision-making. This does not prove that descriptive evidence is universally safer, but it shows that the *form* of assistance can materially change whether model bias propagates into human decisions.

A 2024 synthesis on verifiability reaches a complementary conclusion: explanations improve AI-advised decisions only insofar as they let a person efficiently verify whether a recommendation is correct. Plausible reasoning text is therefore not equivalent to evidence. If the user cannot check the explanation against task-relevant observations, the explanation can add persuasion without adding verification capability.

A 2026 fact-checking experiment (preprint; treat as emerging evidence) found that participants used underlying evidence to validate AI claims across experimental conditions, while natural-language explanations reduced evidence inspection and users returned to evidence when explanations appeared insufficient or flawed. This strengthens a practical hypothesis worth testing: **an answer-shaped explanation can compete with evidence for attention**.

Therefore, when evidence-first is appropriate:

1. surface the smallest decision-relevant evidence set, not a document dump;
2. distinguish observed/source-backed facts from model interpretation;
3. preserve provenance and make the underlying source inspectable;
4. expose contradictions, missing coverage, and uncertainty rather than curating only evidence supporting the model's likely conclusion;
5. reveal the recommendation after meaningful inspection when independence has decision value;
6. do not label model-generated rationale as `evidence` unless it actually points to independently checkable support.

Evidence-first is a poor fit when evidence is too complex for the user to interpret, when verification would take longer than the decision permits, or when the AI's value is generative rather than adjudicative.

## What the evidence currently supports

A 2025 systematic review of 35 quantitative human-AI decision studies (19,774 participants) identifies recommendation order, workload, task complexity, expertise, trust, and verification effort as interacting factors in automation bias. It reports evidence that AI-first advice can prime subsequent judgment, while human-first protocols can reduce some AI anchoring but also produce conservatism toward the user's initial answer or complacency when AI confirms it.

Buçinca, Malaya & Gajos (CSCW 2021, N=199) tested cognitive forcing functions designed to make people engage more analytically before relying on AI. The interventions reduced overreliance relative to simple explainable-AI baselines, but the most effective designs received worse subjective ratings and benefited participants with higher Need for Cognition more. This is a critical product trade-off: friction that improves decision behavior can simultaneously make the interface less liked.

A 2025 CSCW study on partial explanations (two studies, N=264 and N=210) found further evidence that interaction design can change overreliance, but effects varied with explanation form, task difficulty, and cognitive motivation. This argues against treating one forcing mechanism as a portable universal pattern.

A 2025 glaucoma-referral study with 87 optometrists found human-AI teams outperformed humans alone but underperformed the AI alone; explanations did not improve team performance and post-hoc explanations increased overreliance on incorrect AI recommendations. The authors explicitly propose staged initial-assessment → AI-review → final-decision designs as a way to observe and potentially manage these effects, while noting that confirmation bias can still operate after an initial judgment.

A 2026 experiment comparing recommendation-driven and hypothesis-driven AI (N=290; preprint) reports an important process-level warning: aggregate performance can remain similar while recommendation-driven interfaces lower users' thresholds for what counts as sufficient evidence and shift the distribution of errors. Experts were not immune. Until replicated, treat this as emerging rather than settled evidence, but it argues for measuring whether an interface changes **evidence standards**, not only final accuracy.

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

## Explanations are not a substitute for sequencing or evidence

An explanation shown beside an already-salient recommendation can itself become persuasive evidence. Existing studies repeatedly find that explanations can increase trust or overreliance without improving accuracy.

Ask what the user should evaluate **before** revealing the recommendation. In some domains, showing relevant observations, comparable cases, assumptions, or contradictory evidence first can support reasoning without immediately supplying an answer to anchor on.

Use a verification test: **after reading this explanation, can the user actually check whether the recommendation is right?** If not, treat it primarily as interpretation/rationale, not as a safeguard against overreliance.

Do not infer that hiding AI predictions is always safer. The correct comparison is decision quality and decision process under realistic workflow constraints.

## When not to require independent judgment

Avoid mandatory human-first assessment when:

- the task is primarily generative or exploratory rather than adjudicative;
- the user lacks the information or expertise needed for a meaningful independent judgment;
- AI is performing tedious low-risk transformation with easy undo;
- duplicating the decision creates high workload with little error-detection value;
- latency is safety-critical and independent review would delay a more reliable response;
- the recommendation is merely one optional input among many and cannot trigger consequential action by itself.

A ritualized `decide before seeing AI` step can become oversight theater just as easily as a ritualized approval button.

## Evaluation: measure reliance quality and evidence behavior, not trust alone

For decision-support experiments, record where feasible:

- initial human decision and confidence;
- AI recommendation and whether it was correct under the evaluation ground truth;
- final human decision;
- correct acceptance and correct rejection separately;
- harmful switches caused by wrong AI;
- missed beneficial switches when AI was right;
- which evidence users inspect, in what order, and whether inspection changes after AI exposure;
- whether users apply different evidence thresholds with and without recommendations;
- verification behavior and time cost;
- workload and subjective satisfaction;
- subgroup/expertise effects;
- downstream decision quality, not only agreement with AI.

A design that lowers AI acceptance can be worse if it creates systematic under-reliance. A design that users dislike slightly can be better for consequential work if it materially improves decision quality. Equal final accuracy can still conceal a worse decision process if the interface systematically shifts evidence standards or error types. None of these conclusions should be assumed without measurement.

## Failure modes

- **AI-first anchoring:** the recommendation becomes the frame through which all evidence is interpreted.
- **Human-first conservatism:** users defend their initial answer after better evidence arrives.
- **Confirmation amplification:** AI agreement makes an initial human belief feel more certain without independent corroboration.
- **Evidence laundering:** model rationale or selected snippets are labeled as evidence despite lacking independent verifiability.
- **Evidence cherry-picking:** the UI surfaces only support for the recommendation and hides contradictory or missing evidence.
- **Evidence overload:** dumping every source makes nominal transparency unusable and pushes users back toward the recommendation shortcut.
- **Friction theater:** extra clicks create delay but no verification.
- **Satisfaction optimization:** removing useful cognitive work because the lower-friction version scores better subjectively.
- **Throughput contradiction:** the UI asks users to verify carefully while organizational incentives reward speed.
- **Explanation persuasion:** a plausible rationale increases acceptance without improving error detection.
- **Expertise mismatch:** novices are forced to produce meaningless initial judgments they cannot evaluate.
- **Acceptance-rate proxy:** high agreement with AI is reported as successful collaboration without measuring correctness.
- **Universal human-first rule:** a pattern supported in some decision tasks is copied into low-risk or generative workflows where it only adds cost.

## Decision contract for AI coding/design agents

Before choosing AI-first, human-first, or evidence-first presentation, answer:

1. Is this a decision, a suggestion, a generation task, or an action approval?
2. Can the user form a meaningful independent judgment from available evidence?
3. What is the cost of an incorrect AI anchor?
4. What is the cost of delaying AI assistance?
5. Would an initial human judgment become a harmful anchor of its own?
6. Is there independently checkable evidence that can be surfaced before either party's conclusion?
7. Does the proposed explanation enable verification, or mainly make the recommendation more persuasive?
8. What verification behavior should the added friction actually cause?
9. Can the user revise the initial assessment without penalty or stigma?
10. Are workload, time pressure, expertise, and accessibility compatible with the extra step?
11. Will evaluation measure correct reliance, evidence inspection, and error distribution rather than acceptance, trust, or satisfaction alone?

If these cannot be answered, do not add a mandatory pre-AI decision step by default.

## Evidence boundary

The strongest current evidence is concentrated in controlled decision-support tasks and high-stakes professional domains, not ordinary generative-product UX. The 2025/2026 automation-bias review is useful for cross-study synthesis but reports heterogeneous tasks and interventions. Buçinca et al. provides direct experimental evidence for cognitive forcing with a satisfaction and individual-difference trade-off. The emergency-decision study provides controlled evidence that descriptive flags can propagate less model bias than prescriptive recommendations in its task. The verifiability synthesis provides a useful theory for why many explanations fail to improve complementary performance.

The 2026 fact-checking and hypothesis-vs-recommendation results are promising but currently preprints; retain them as emerging evidence rather than general rules. Together, these sources justify testing evidence-first and hypothesis-oriented interfaces, but they do **not** establish that evidence-first always improves accuracy, that explanations are useless, that human-first is universally safer, or that one sequencing pattern transfers across domains.

## Key sources

- Romeo, G. & Conti, D. (2025/2026), *Exploring automation bias in human–AI collaboration: a review and implications for explainable AI*, AI & Society. https://doi.org/10.1007/s00146-025-02422-7
- Buçinca, Z., Malaya, M. B. & Gajos, K. Z. (2021), *To Trust or to Think: Cognitive Forcing Functions Can Reduce Overreliance on AI in AI-Assisted Decision-Making*, PACM HCI / CSCW. https://doi.org/10.1145/3449287
- de Jong, S., Paananen, V., Tag, B. & van Berkel, N. (2025), *Cognitive Forcing for Better Decision-Making: Reducing Overreliance on AI Systems Through Partial Explanations*, PACM HCI / CSCW. https://doi.org/10.1145/3710946
- Fok, R. & Weld, D. S. (2024), *In search of verifiability: Explanations rarely enable complementary performance in AI-advised decision making*, AI Magazine. https://doi.org/10.1002/aaai.12182
- *Mitigating the impact of biased artificial intelligence in emergency decision-making* (2023), Communications Medicine; controlled experiment with 438 clinicians and 516 non-experts. https://doi.org/10.1038/s43856-022-00214-4
- *The explainable AI dilemma under knowledge imbalance in specialist AI for glaucoma referrals in primary care* (2025), professional user study, N=87. https://pmc.ncbi.nlm.nih.gov/articles/PMC12635309/
- Warren, G. et al. (2026), *Show me the evidence: Evaluating the role of evidence and natural language explanations in AI-supported fact-checking*, preprint. https://arxiv.org/abs/2601.11387
- Benk, M. & Miller, T. (2026), *Same Performance, Hidden Bias: Evaluating Hypothesis- and Recommendation-Driven AI*, preprint. https://arxiv.org/abs/2603.15824
