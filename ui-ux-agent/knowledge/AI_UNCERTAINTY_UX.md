# AI Uncertainty UX

Operational guidance for representing uncertainty in AI-assisted and agentic products without manufacturing false precision or making every output feel unreliable.

## Core rule: uncertainty is not one variable

Do not collapse every unknown into a generic confidence score. Before designing the UI, identify what is uncertain:

- **intent uncertainty** — the system does not know what the user means or wants;
- **epistemic uncertainty** — the answer cannot be supported strongly enough by available knowledge/evidence;
- **data uncertainty** — required inputs are missing, stale, conflicting, low quality, or inaccessible;
- **model uncertainty** — the model/classifier has a meaningful calibrated estimate of predictive uncertainty;
- **execution uncertainty** — an agent attempted work but cannot yet verify whether the external effect occurred;
- **coverage uncertainty** — only part of the requested scope was searched, processed, or verified;
- **source disagreement** — credible evidence supports incompatible conclusions;
- **forecast/estimate uncertainty** — the result is inherently probabilistic rather than a hidden fact waiting to be recovered.

These states imply different user actions. A single yellow warning or `72% confident` label usually destroys that distinction.

## Confidence numbers require a contract

A percentage should not appear merely because a model can emit one.

Use numeric confidence only when the value has a defined meaning, is calibrated against relevant outcomes, and helps the user make a decision. The UI should make clear what the number applies to: a classification, forecast, extraction, measurement, or other measurable event.

Do **not** present a language model's verbal or self-generated certainty as if it were a calibrated probability of factual correctness. Fluent certainty is not evidence.

When reliable metrics are unavailable, communicate the operational limitation instead: `I couldn't verify this from the available sources`, `3 of 12 files could not be checked`, or `two authoritative sources disagree` is more actionable than an invented confidence percentage.

Microsoft HAX explicitly recommends matching the precision of language/numbers to actual system performance and warns that both excessive certainty and excessive vagueness distort user expectations.

## Prefer evidence state over confidence theater

For factual/research outputs, expose the evidence condition that matters to the decision:

| Condition | Better UI response |
|---|---|
| Supported by relevant evidence | State the result; expose provenance when useful |
| Evidence incomplete | State what was checked and what remains unchecked |
| Sources conflict | Surface the disagreement and its decision-relevant consequence |
| Required source unavailable | Name the missing dependency rather than guessing |
| Ambiguous user intent | Clarify before consequential action |
| Plausible answer but not verifiable | Mark it as unverified; do not phrase as established fact |
| Inherently probabilistic forecast | Show calibrated range/probability plus assumptions when available |

Provenance and uncertainty are related but not interchangeable. A citation proves that a source exists; it does not prove that the source supports the claim, is current, or resolves disagreement.

## Uncertainty should change behavior

A warning that changes nothing is often decoration. Define what the product does when uncertainty crosses a meaningful boundary.

Possible responses, ordered roughly from least to most interruptive:

1. proceed normally;
2. soften claim precision;
3. expose evidence/assumptions;
4. return partial results and identify gaps;
5. offer alternatives;
6. request disambiguation;
7. narrow the operation or capability;
8. require verification/approval;
9. abstain or fall back to another strategy.

The threshold depends on consequence and reversibility. Low-stakes suggestions can tolerate more uncertainty than sending money, modifying production data, or giving safety-critical advice.

Microsoft HAX specifically recommends disambiguating before acting when intent is uncertain and gracefully degrading or falling back when uncertainty makes the intended action unsafe or unreliable.

## Partial results are a first-class state

Avoid the binary `success / failed` model for research and agent workflows.

Represent at least:

- requested scope;
- completed scope;
- failed/skipped scope;
- reason for incompleteness;
- whether conclusions depend on the missing portion;
- a recovery path when one exists.

Example: `Checked 428 of 500 records; 72 were inaccessible because the account lacks permission. No issue was found in the checked records.` This is materially different from `No issues found`.

Do not silently extrapolate from processed items to unprocessed items.

## Separate answer uncertainty from action uncertainty

An agent can be uncertain about a conclusion while being certain that an operation succeeded, or highly confident in a plan while unable to verify the resulting external effect.

For consequential actions, distinguish:

`planned → attempted → acknowledged by tool/service → externally verified`

Do not tell the user `Sent`, `Published`, or `Deleted` merely because the model decided to call a tool. The strongest wording should reflect the strongest verified state.

## Disagreement is not automatically an averaging problem

When credible sources conflict:

- preserve the disagreement;
- identify differences in date, scope, definitions, methodology, jurisdiction, or assumptions;
- say which source governs when an authoritative hierarchy exists;
- avoid averaging incompatible claims into a fabricated midpoint;
- explain what evidence would resolve the disagreement when useful.

The user often needs to know **why the answer is unsettled**, not how uncertain the model feels.

## Explanations can increase trust even when they should not

Do not add an explanation merely to make an uncertain output feel legitimate. Microsoft HAX cautions that explanations can increase trust and therefore contribute to over-reliance; it also warns against offering low-confidence explanations as if they established why a decision occurred.

Use explanations when they improve diagnosis, verification, correction, or prediction of system behavior. Keep uncertainty in the explanation itself when causal attribution is not established.

## Abstention is a valid product behavior

Design for `I don't know`, `I can't verify that`, and `I need X before I can answer` as intentional states rather than generic failures.

OpenAI's 2025 hallucination research argues that evaluation regimes which reward guessing can increase confident errors and explicitly distinguishes correct answers, errors, and abstentions. The product implication is not to maximize abstention; it is to make abstention available when the expected cost of a confident error exceeds the value of guessing.

A useful abstention should preserve momentum where possible:

- state the unresolved point;
- state what was established safely;
- request the minimum missing information or propose a verification route;
- avoid repeating a confident-looking guess beneath the disclaimer.

## Language precision

Match wording to evidence, not personality.

Prefer specific uncertainty:
- `The documentation does not specify this behavior.`
- `I found evidence for A, but not for B.`
- `These two sources disagree.`
- `This is an estimate based on X and Y.`

Avoid empty hedging:
- `maybe` everywhere;
- `probably` without a basis;
- repetitive disclaimers detached from the claim;
- certainty adjectives that imply measurement when none exists.

Uncertainty should be local to the uncertain claim where practical. Do not weaken an entire response because one subsection is unresolved.

## Risk-shaped presentation

Increase uncertainty visibility when any of these increase:

- consequence of error;
- irreversibility;
- automation/autonomy;
- difficulty detecting a wrong result;
- reliance on stale/external data;
- disagreement among credible sources;
- incomplete coverage;
- downstream propagation of the output.

For low-stakes creative work, constant confidence indicators usually add noise. For consequential decisions, evidence state and unresolved assumptions may deserve primary placement.

## Accessibility and comprehension

Do not encode uncertainty only through color, opacity, animation, or iconography. Use concise text labels where the distinction matters.

Progressively disclose technical diagnostics. Most users need the decision-relevant limitation first; auditors and expert users may need raw evidence, timestamps, traces, calibration information, or source-level details.

Avoid warning saturation. If every AI output carries the same generic caution, users learn to ignore it.

## Failure modes

- **Confidence theater:** displaying an uncalibrated percentage because it looks scientific.
- **Hedge fog:** qualifying every sentence until the user cannot distinguish established facts from real unknowns.
- **Citation laundering:** treating cited content as automatically verified.
- **Silent partial success:** presenting conclusions as complete when part of the scope failed.
- **Tool-call certainty:** reporting an external effect from an attempted invocation rather than verification.
- **Explanation laundering:** adding a plausible rationale that increases trust without increasing evidence.
- **False consensus:** hiding credible source disagreement behind one synthesized answer.
- **Warning wallpaper:** repeating the same AI disclaimer until it carries no information.
- **Unsafe clarification avoidance:** guessing user intent because asking one question feels less fluid.
- **Abstention dead end:** refusing to guess without preserving known facts or offering a recovery route.

## Decision contract for AI coding/design agents

Before adding uncertainty UI, answer:

1. What exactly is uncertain?
2. Is uncertainty measured/calibrated or merely inferred?
3. What decision does the user make differently because of it?
4. What evidence or coverage state can be shown instead of a synthetic score?
5. Does the uncertainty affect only wording, or should system behavior change?
6. What threshold requires clarification, verification, narrower scope, approval, fallback, or abstention?
7. Could partial success be mistaken for complete success?
8. Are external effects verified separately from the model's intent?
9. Could an explanation or citation create unjustified trust?
10. Is the uncertain claim visually/textually distinguishable without making the whole interface noisy?

If these questions have no concrete answers, a confidence badge is unlikely to improve the product.

## Evidence boundary

Microsoft HAX provides evidence-based human-AI design guidance for communicating system performance, disambiguating uncertain intent, fallback behavior, and explanation risks. OpenAI's September 2025 hallucination research provides current model-evaluation evidence that rewarding guesses over abstention can produce more confident errors. NIST's human-centered AI Use Taxonomy reinforces evaluating AI by human tasks and outcomes rather than by technique alone.

These sources support the architecture above, but they do **not** establish a universal confidence threshold, wording vocabulary, color scale, or probability display. Calibration quality and decision thresholds are domain- and model-specific and should be validated against real outcomes.
