# AI Provenance and Verification UX

Operational guidance for making AI-produced claims inspectable without confusing provenance with correctness.

## Core distinction: provenance is a verification path, not a trust badge

A citation, source label, retrieval trace, or “AI-generated” disclosure does not prove that a claim is correct. Provenance UX should reduce the cost of checking consequential claims and expose missing support, not manufacture authority.

Separate at least four questions:
1. **Origin** — where did this material come from?
2. **Support** — does the cited evidence actually support this claim?
3. **Freshness/context** — is that evidence current and applicable to this decision?
4. **Correctness** — is the resulting claim true enough for the task?

Do not collapse these into a green “verified” badge unless the product has a defensible verification process for the exact claim.

## Prefer claim-level inspectability when verification matters

Document-level source lists are cheap to render but expensive to audit: users still have to discover which passage supports which assertion. For consequential factual work, map important claims to the smallest useful evidence unit and make inspection local.

A useful interaction is:
- claim is visibly source-backed without overwhelming the reading surface;
- selecting the claim opens the exact supporting passage/data;
- source identity, date/freshness, and relevant context remain visible;
- unsupported or partially supported claims are distinguishable from supported ones;
- users can return to the answer without losing reading position.

Sentence-level provenance is not universally necessary. Use coarser provenance for low-stakes synthesis; increase granularity as verification cost and consequence rise.

## Provenance density can outperform authorship disclosure

A binary “made with AI” label answers who/what produced content, not whether its claims are supported. IJCAI 2026 research on an idealized Provenance Density interface (N=81) found substantially better discrimination between truthful and fabricated content than a no-signal condition. Importantly, its technical audit found retrieval density alone insufficient: evidence presence is not equivalent to evidence consistency.

Design implication: when factual discernment matters, expose **support structure**, not merely AI authorship or a count of citations.

## More provenance can lower trust without changing behavior

Do not assume transparency automatically produces safer reliance. PaperTrail (CHI 2026) mapped scholarly LLM claims to evidence and made unsupported/omitted material visible. In a within-subject study with 26 researchers it lowered reported trust, but participants still relied on generated edits when verification was cognitively burdensome.

This creates a critical design requirement: optimize **verification cost**, not provenance volume. A provenance system can successfully create skepticism and still fail to change risky behavior if checking remains slower than accepting.

A September 2026 formative clinical study (46 clinicians) provides complementary evidence: a click-to-inspect, sentence-level provenance interface received high usability scores, and clinicians described rapid access to supporting evidence as important for first-pass review. This is promising domain-specific usability evidence, not proof that sentence-level provenance improves clinical outcomes.

## Allocate a verification budget instead of asking users to check everything

Human review is a scarce resource. A product that marks every AI statement for manual verification can be safer in theory and worse in practice: attention is diluted, checking becomes ritualized, and users learn to accept warnings without inspecting them. Treat verification effort as a **budget to allocate by expected decision value**.

For each claim, recommendation, or proposed action, consider:
- **consequence if wrong** — financial, safety, legal, reputational, destructive, or merely inconvenient;
- **reversibility** — whether an error can be cheaply undone;
- **uncertainty / known failure likelihood** — grounded in actual evaluation where available, not invented confidence;
- **independent checkability** — whether a rule, database, calculation, source, or deterministic tool can validate it automatically;
- **verification cost** — time and cognitive effort required from the reviewer;
- **novelty / distribution shift** — whether the case is outside well-tested conditions;
- **downstream amplification** — whether one bad claim feeds many later decisions or actions.

Use those factors to choose the cheapest adequate control:

| Situation | Preferred control |
|---|---|
| Low consequence + reversible | Allow flow; lightweight provenance or correction may be enough |
| Machine-checkable invariant | Verify automatically; surface failures, not routine successful checks |
| Moderate consequence + cheap human check | Flag the exact claim/evidence needed for selective review |
| High consequence or irreversible | Require stronger independent validation/review before action |
| High verification cost + low expected benefit | Do not dump review onto the user; redesign, constrain scope, gather better evidence, or abstain |
| Repeated homogeneous items | Validate programmatically or sample strategically only when the sampling assumptions are defensible |

This is **not** a universal numeric risk formula. Thresholds are domain-specific and should be validated against actual error costs and system performance.

### Human review is not automatically the safest fallback

Human-in-the-loop design can fail through automation bias, fatigue, weak domain knowledge, or effort displacement. Microsoft HAX explicitly notes that repeated AI correction can become costlier than doing the task manually. NIST frames trustworthy deployment around testing, evaluation, verification, and validation (TEVV), rather than treating a human glance as sufficient assurance.

A 2025 NBER human-AI fact-checking experiment, revised August 2026, adds an important complication: participants reduced effort when shown confident AI predictions. In that studied classification setting, the estimated optimal policy automated cases where AI was confident and delegated uncertain cases to humans while disclosing the prediction. This is evidence against the blanket rule “always make a human verify AI”; it is not evidence that confidence-based automation is safe in every domain.

Design implication: route work according to **comparative capability and risk**, then measure whether the chosen routing improves outcomes. Do not use review merely as organizational liability transfer.

### Verification UI should answer “why me, why this?”

When requesting human verification, make the review target and reason concrete:
- identify the exact claim/action requiring attention;
- show the evidence or conflicting evidence beside it;
- explain the relevant uncertainty or rule violation without pretending to know more than the system knows;
- preserve surrounding context and downstream consequence;
- offer a clear accept/correct/escalate/abstain path;
- batch only items that can genuinely be reviewed under the same decision rule.

Avoid generic banners such as “AI can make mistakes — check everything.” They communicate liability but provide almost no prioritization value.

## Design the verification path around stakes

### Low-stakes generative output
Prefer lightweight source access or no persistent provenance UI when factual verification is not central. Correction/iteration may be cheaper than inspection.

### Factual synthesis and research
Provide claim-to-evidence mapping for consequential assertions, direct passage access, source metadata, freshness, and visible unsupported claims. Avoid forcing users to inspect every sentence.

### High-stakes decisions and actions
Provenance should sit beside independent validation, domain rules, human review, and technical safeguards. AI cannot certify its own correctness.

## Preserve provenance through transformations

For tool-using agents, provenance should survive the pipeline rather than being reconstructed only at presentation time. Where practical, retain stable relationships among:
- tool/source identifier;
- retrieved record/document and timestamp;
- extracted evidence span or data fields;
- claim(s) derived from it;
- transformations/aggregation applied;
- action or recommendation that consumed the claim.

This helps detect **cross-source conflation**: a claim may be supported somewhere in the evidence pool while being attributed to the wrong source. It also separates “retrieved,” “cited,” and “materially influential” evidence; these are not guaranteed to be identical.

## Progressive disclosure for provenance

Do not turn every answer into an audit log. Use layers:
1. readable answer/result;
2. compact support/freshness cues where decision-relevant;
3. claim-level evidence inspection;
4. deeper source/tool/transformation history for audit or debugging.

The default layer should help users notice where verification is warranted. Detail should be close enough that inspection is cheap but not so dominant that provenance itself becomes persuasive decoration.

## Failure modes

- **Citation theater** — many links create authority without demonstrating support.
- **Source-list dumping** — sources exist, but claim-to-source relationships are unclear.
- **Binary verified badge** — collapses origin/support/freshness/correctness into false certainty.
- **Retrieval = support** — assumes a retrieved document supports the generated statement.
- **AI-authorship-only disclosure** — identifies generation method but gives no evidence path.
- **Provenance overload** — verification UI becomes so dense that users stop checking.
- **Stale evidence invisibility** — source exists but its date/context no longer applies.
- **Cross-source conflation** — evidence from one source is attributed to another.
- **Self-certification** — asks the same model to declare its answer correct without external evidence or validation.
- **Trust as success metric** — celebrates higher trust rather than better discrimination and reliance.
- **Verify-everything theater** — pushes undifferentiated checking onto humans until review becomes ceremonial.
- **Human-review laundering** — labels a workflow safe because a person clicked approve without measuring reviewer capability, effort, or detection rate.
- **Confidence routing without calibration** — automates from a confidence score that has not been validated for the decision context.

## Evaluation

Measure whether provenance and review allocation improve decisions, not whether users like seeing citations or approvals.

Useful measures include:
- detection of unsupported/incorrect claims;
- verification rate when stakes warrant it;
- false-review rate: low-value items unnecessarily escalated;
- consequential-error escape rate;
- time/effort to inspect a claim;
- correct acceptance vs correct rejection;
- reliance conditional on answer correctness;
- reviewer effort and fatigue over repeated sessions;
- ability to identify the supporting source/passage;
- sensitivity to stale or conflicting evidence;
- recovery after discovering unsupported content.

Track subjective trust separately. Lower trust can represent better calibration; lower trust without changed reliance can represent unresolved verification friction.

## Implementation rules for coding/design agents

When building factual or agentic AI UX:
- define which claims/actions require provenance before choosing a citation component;
- classify what can be automatically validated before assigning work to a human;
- allocate human attention by consequence, reversibility, uncertainty, check cost, and downstream amplification;
- keep source IDs and evidence mappings in data structures, not only rendered text;
- expose exact evidence near consequential claims;
- show freshness/context when it can change validity;
- mark missing/partial support explicitly rather than hiding it behind aggregate confidence;
- make verification selective and fast;
- explain why a specific item was escalated for review;
- preserve reading/task context while inspecting evidence;
- do not label something “verified” merely because retrieval succeeded or a human clicked approve;
- test with intentionally unsupported, stale, conflicting, and misattributed evidence;
- test review queues under realistic volume, not only isolated examples;
- evaluate behavioral calibration and error escape, not only trust ratings.

## Evidence boundary

This guidance combines risk guidance, shipped design guidance, and recent HCI/economic evidence. NIST treats testing, evaluation, verification, validation, and provenance as components of AI risk management rather than correctness guarantees. Microsoft HAX warns that explanations can increase trust and over-reliance and that repeated correction can become costlier than manual work. IJCAI 2026 Provenance Density provides experimental evidence that support visualization can improve factual discernment in its tested setting. CHI 2026 PaperTrail provides counterevidence that richer provenance may reduce trust without changing reliance when verification is cognitively expensive. A 2026 clinical formative study supports low-friction sentence-level inspection as usable in one high-stakes domain but does not establish outcome superiority. The NBER human-AI collaboration experiment supports selective routing in one fact-checking/classification setting and documents effort crowd-out from confident AI predictions; its optimal policy must not be generalized mechanically to safety-critical or differently structured tasks. Generalize the architecture cautiously across domains.
