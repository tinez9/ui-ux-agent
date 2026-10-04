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

## Design the verification path around stakes

### Low-stakes generative output
Prefer lightweight source access or no persistent provenance UI when factual verification is not central. Correction/iteration may be cheaper than inspection.

### Factual synthesis and research
Provide claim-to-evidence mapping for consequential assertions, direct passage access, source metadata, freshness, and visible unsupported claims. Avoid forcing users to inspect every sentence.

### High-stakes decisions and actions
Provenance should sit beside independent validation, domain rules, human review, and technical safeguards. AI cannot certify its own correctness. Microsoft’s current Copilot validation guidance explicitly recommends tracing key statements to sources and independently checking important facts before acting.

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

## Evaluation

Measure whether provenance improves decisions, not whether users like seeing citations.

Useful measures include:
- detection of unsupported/incorrect claims;
- verification rate when stakes warrant it;
- time/effort to inspect a claim;
- correct acceptance vs correct rejection;
- reliance conditional on answer correctness;
- ability to identify the supporting source/passage;
- sensitivity to stale or conflicting evidence;
- recovery after discovering unsupported content.

Track subjective trust separately. Lower trust can represent better calibration; lower trust without changed reliance can represent unresolved verification friction.

## Implementation rules for coding/design agents

When building factual or agentic AI UX:
- define which claims/actions require provenance before choosing a citation component;
- keep source IDs and evidence mappings in data structures, not only rendered text;
- expose exact evidence near consequential claims;
- show freshness/context when it can change validity;
- mark missing/partial support explicitly rather than hiding it behind aggregate confidence;
- make verification selective and fast;
- preserve reading/task context while inspecting evidence;
- do not label something “verified” merely because retrieval succeeded;
- test with intentionally unsupported, stale, conflicting, and misattributed evidence;
- evaluate behavioral calibration, not only trust ratings.

## Evidence boundary

This guidance combines standards/risk guidance, shipped product guidance, and recent HCI evidence. NIST’s GenAI risk work treats content provenance as one component of trustworthy AI rather than a correctness guarantee. Microsoft HAX warns that explanations can increase trust and over-reliance; Microsoft’s current Copilot guidance states that Copilot can assist validation but cannot certify its own correctness. IJCAI 2026 Provenance Density provides experimental evidence that support visualization can improve factual discernment in its tested setting. CHI 2026 PaperTrail provides counterevidence that richer provenance may reduce trust without changing reliance when verification is cognitively expensive. A 2026 clinical formative study supports low-friction sentence-level inspection as usable in one high-stakes domain but does not establish outcome superiority. Generalize the architecture cautiously across domains.
