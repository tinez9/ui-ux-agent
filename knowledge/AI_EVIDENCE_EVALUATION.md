# Evaluating Evidence-First AI Interfaces

Operational protocol for testing whether an evidence-first interface improves **decision quality and appropriate reliance**, rather than merely looking transparent. Use with `AI_EVIDENCE_SELECTION.md` and `AI_ADVICE_SEQUENCING.md`.

## Core rule: evaluate the decision process, not only the final answer

An evidence surface can achieve the same final accuracy as a recommendation-first UI while changing how users reach decisions, which errors they make, what evidence they inspect, and how vulnerable they are to bad advice. Conversely, more source clicks are not automatically better: inspection that does not help users discriminate correct from incorrect advice is just workload.

Evaluation therefore needs three layers:

1. **system evidence quality** — did the interface preserve relevant, supporting, contradictory, independent, current evidence?
2. **human evidence use** — did people inspect and understand the evidence that mattered?
3. **decision consequence** — did evidence use improve discrimination between good and bad AI advice under realistic cost and time constraints?

Do not substitute trust, satisfaction, citation count, or AI-agreement rate for these outcomes.

## Minimum experimental comparison

When practical, compare at least:

- **recommendation-first:** AI conclusion is salient before evidence;
- **evidence-first:** decision-relevant evidence is available before the conclusion;
- **baseline:** no AI recommendation, or ordinary task workflow, when a meaningful baseline exists.

A useful study manipulates AI correctness rather than testing only correct advice. If users never encounter plausible AI errors, the experiment cannot measure whether the interface helps them reject bad advice.

Where the product claims contradiction handling, seed a credible minority contradiction. Where it claims provenance robustness, include duplicated/shared-upstream sources or a stale authoritative source. These are evaluation probes, not production deception patterns.

## Capture the state transitions

For adjudicative tasks where an initial judgment is meaningful, record:

`initial human judgment -> evidence inspected -> AI advice -> final judgment`

This enables separate measurement of:

- **beneficial switch:** initially wrong, then correct after useful AI/evidence;
- **harmful switch:** initially correct, then wrong after bad AI;
- **correct resistance:** initially correct and rejects bad AI;
- **missed assistance:** initially wrong and fails to use correct AI/evidence.

Schemmer et al.'s appropriate-reliance work formalizes two related dimensions: relative AI reliance (correctly moving from an initially wrong answer toward correct AI advice) and relative self-reliance (retaining an initially correct answer against incorrect AI advice). These are more diagnostic than raw acceptance rate, but they are not a universal product KPI: recent decision-theoretic work argues that reliance metrics can conflate following advice with users' ability to distinguish underlying signals. Preserve task utility/error cost alongside reliance measures.

## Measure evidence behavior without rewarding clicking

Useful instrumentation can include:

- which evidence items were opened and in what order;
- whether supporting and contradictory evidence were both inspected;
- dwell/inspection time only as a weak behavioral signal, not proof of comprehension;
- whether users reached source context or stayed at summary level;
- whether they noticed source date, scope, independence, or contradiction when those attributes matter;
- whether evidence inspection changed the decision;
- whether users can identify why two sources conflict;
- verification time and workload.

The 2026 `Show me the evidence` fact-checking preprint is an important emerging signal: participants used underlying evidence across conditions, while natural-language explanations reduced evidence inspection and evidence was revisited when explanations seemed inadequate. This supports measuring **inspection displacement**: does adding an explanation or recommendation make users inspect independently checkable evidence less often? It does not establish that more evidence clicks always improve accuracy.

## Error difficulty is an experimental variable

Do not seed only obvious failures. Rieger et al. (TOCHI, published 2026-08-08) ran three experiments in a simulated medical visual-detection task and found that explainability's benefit depended on how difficult the AI error was to detect: it reduced reliance on incorrect recommendations for difficult errors, showed no benefit for easy errors, and only a small benefit for virtually impossible errors.

This creates an important evaluation rule: **test errors across realistic detectability levels**.

- **easy error:** ordinary task evidence should reveal it;
- **difficult but verifiable error:** careful evidence inspection can reveal it;
- **effectively unverifiable error:** available human-facing evidence cannot realistically resolve it.

An interface that succeeds only on easy seeded mistakes may add no value; one that appears to fail on impossible-to-verify mistakes may be testing the limit of human oversight rather than a UI defect. For the latter, escalation, abstention, independent review, or technical safeguards may be more appropriate than more explanation UI.

## Separate explanation correctness from recommendation correctness

A correct recommendation can carry a misleading explanation, and an incorrect recommendation can be accompanied by plausible-looking rationale. Spitzer et al. (TiiS 2025, N=136) found that imperfect explanations and user expertise affected human-AI decision behavior. Therefore factorial tests should vary, when relevant:

- advice correct / explanation or evidence representation correct;
- advice correct / explanation misleading;
- advice wrong / explanation plausible;
- advice wrong / evidence exposes the error.

This prevents the experiment from treating `has explanation` as one uniform condition.

## Evaluate compression as a lossy channel

For a fixed source corpus, compare the visible evidence set against an expert- or protocol-defined reference set. Track:

- **support recall:** important supporting evidence retained;
- **contradiction recall:** important counterevidence retained;
- **coverage:** major decision dimensions represented;
- **independence:** duplicated evidence chains not counted as corroboration;
- **temporal validity:** stale/version-conflicted evidence exposed;
- **claim support:** cited passages actually support the displayed claim;
- **compression loss:** decision-relevant facts/qualifiers lost in selection or summary.

Then test whether those technical properties translate into better human decisions. High contradiction recall is valuable only if the presentation makes material conflict understandable under realistic workload.

## Appropriate reliance is not trust

Trust is an attitude; reliance is behavior; appropriate reliance depends on whether following or rejecting advice was warranted in that case. They may correlate, but they are not interchangeable.

Do not declare success because users report greater trust. Behavioral research has found cases where AI framing or explanations increase reliance, including harmful reliance. Fok & Weld's verifiability synthesis likewise argues that explanations rarely enable complementary performance unless users can actually verify relevant aspects of the recommendation.

For consequential decision support, prioritize:

- final task utility/accuracy;
- harmful and beneficial switches;
- correct rejection of bad advice;
- use of decision-relevant evidence;
- calibration across advice quality;
- time/workload cost;
- subgroup/expertise effects.

Treat trust and satisfaction as secondary experience measures, not safety/performance proxies.

## Test expertise and time pressure explicitly

Evidence-first designs assume the user can do something useful with the evidence. Stratify or model expertise when possible. A novice forced to inspect specialist evidence may gain workload without gaining verification capability.

Likewise, test under realistic time constraints. A design that works only with unlimited inspection time may fail in production. Report the cost of verification rather than hiding it behind accuracy gains.

## Recommended adversarial test matrix

A compact but meaningful evaluation can cross these dimensions selectively:

| Dimension | Conditions worth probing |
|---|---|
| AI advice | correct / incorrect |
| Error detectability | easy / difficult-verifiable / effectively unverifiable |
| Evidence | balanced / missing key support / missing contradiction |
| Provenance | independent / duplicated chain / stale authority |
| Presentation | recommendation-first / evidence-first |
| Explanation | absent / verifiable / plausible-but-misleading |
| User | relevant expertise levels |
| Pressure | realistic normal / time-constrained when domain-relevant |

Do not build a full factorial study by default; choose cells that can falsify the product's strongest claims.

## Failure modes in evaluation

- **Correct-advice-only testing:** cannot detect overreliance.
- **Easy-error theater:** UI appears safe because every seeded error is obvious.
- **Click-count optimization:** more evidence opens are interpreted as better reasoning.
- **Trust proxy:** higher reported trust is labeled better collaboration.
- **Acceptance proxy:** agreement with AI is labeled success without advice correctness.
- **Accuracy-only blindness:** equal final scores hide harmful changes in error type or evidence threshold.
- **Unlimited-time lab effect:** verification succeeds only under conditions absent in production.
- **Expertise averaging:** benefits for experts conceal failure for novices, or vice versa.
- **Explanation bundling:** correct and misleading explanations are pooled into one XAI condition.
- **Compression self-grading:** the same model that selected evidence decides whether anything important was omitted.
- **No ordinary baseline:** added UI complexity is never compared with the workflow it replaces.

## Decision contract for AI coding/design agents

Before shipping or evaluating an evidence-first interface, answer:

1. What concrete decision-quality claim is the interface supposed to improve?
2. What realistic AI errors can users actually detect from available evidence?
3. Are both correct and incorrect AI recommendations represented in evaluation?
4. Is error detectability varied rather than assumed?
5. Can recommendation correctness and explanation/evidence correctness fail independently?
6. What baseline and recommendation-first comparison are meaningful?
7. Which evidence behaviors are diagnostic rather than vanity engagement metrics?
8. How will support, contradiction, coverage, independence, freshness, and compression loss be assessed?
9. Are expertise and time pressure realistic?
10. Will results separate beneficial reliance, harmful reliance, correct resistance, and missed assistance?
11. Are trust and satisfaction kept separate from behavioral correctness?
12. What result would falsify the claim that evidence-first is better for this workflow?

If the last question has no concrete answer, the evaluation is likely confirmatory rather than diagnostic.

## Evidence boundary

Evidence for evidence-first UI remains domain-dependent. Fok & Weld (2024) provides a strong conceptual synthesis around verifiability, not a universal interface prescription. Schemmer et al. (IUI 2023) provides operational reliance constructs, while later decision-theoretic work challenges simplistic interpretation of reliance metrics. Spitzer et al. (2025) supplies empirical evidence that imperfect explanations and expertise matter. Rieger et al. (2026) provides direct experimental evidence that error difficulty moderates explanation effectiveness. Warren et al. (2026) directly studies evidence inspection in fact-checking but remains a preprint.

Together these justify a **falsification-oriented evaluation protocol**, not the claim that evidence-first presentation is universally superior.

## Key sources

- Fok, R. & Weld, D. S. (2024), *In search of verifiability: Explanations rarely enable complementary performance in AI-advised decision making*, AI Magazine. https://doi.org/10.1002/aaai.12182
- Schemmer, M. et al. (2023), *Appropriate Reliance on AI Advice: Conceptualization and the Effect of Explanations*, IUI. https://doi.org/10.1145/3581641.3584066
- Guo, Z., Wu, Y., Hartline, J. & Hullman, J. (2024), *A Decision Theoretic Framework for Measuring AI Reliance*, preprint. https://arxiv.org/abs/2401.15356
- Spitzer, P. et al. (2025), *Imperfections of XAI: Phenomena Influencing AI-Assisted Decision-Making*, ACM TiiS. https://doi.org/10.1145/3750052
- Rieger, T., Schindler, H., Koch, K. & Onnasch, L. (2026), *AI Error Difficulty Modulates the Effectiveness of Explainability in Decision Support Systems*, ACM TOCHI. https://doi.org/10.1145/3817603
- Warren, G. et al. (2026), *Show me the evidence: Evaluating the role of evidence and natural language explanations in AI-supported fact-checking*, preprint. https://arxiv.org/abs/2601.11387
