# AI Evidence Selection and Compression

Operational guidance for AI interfaces that must select a small, inspectable evidence set from many retrieved sources. The objective is **decision-relevant coverage with auditable provenance**, not maximum retrieval similarity, citation count, or persuasive coherence.

## Core rule: evidence selection is part of the model's argument

An evidence-first interface is not neutral merely because it shows sources before a recommendation. The system still decides what is retrieved, ranked, omitted, grouped, summarized, and made visually salient. Those editorial choices can anchor users as strongly as an explicit recommendation.

Treat the evidence surface as a lossy compression layer whose losses must be controlled.

A useful evidence set should optimize jointly for:

- **claim relevance** — directly bears on the decision or factual claim;
- **source quality** — appropriate authority, methodology, directness, and domain fit;
- **coverage** — represents the important dimensions of the question, not just the easiest-to-retrieve one;
- **stance diversity** — preserves material contradiction, qualification, and minority evidence;
- **independence** — avoids counting copies, syndication, common upstream sources, or correlated analyses as separate corroboration;
- **freshness** — when the claim is time-sensitive, exposes date/version and avoids silently mixing stale and current evidence;
- **inspectability** — a user can reach the supporting passage/context without reconstructing the retrieval pipeline;
- **compression cost** — the set remains small enough to inspect under realistic workload.

Do not collapse these into one opaque `evidence score` unless its semantics are validated and useful to the user.

## Retrieval relevance is not evidence quality

Semantic similarity answers `does this passage look related?`, not `should this passage carry decision weight?`.

Recent contradiction-aware RAG research shows that highly similar retrieved material can contain outdated or mutually inconsistent claims and can degrade generated answers. Research on source preference also shows a separate failure: models may prefer apparently institutional sources, yet repeated lower-credibility claims can reverse that preference. Therefore neither similarity, source label, nor repetition is a safe proxy for truth.

For consequential evidence surfaces, ranking should distinguish at least:

1. topical relevance;
2. direct support/refutation of the specific claim;
3. source provenance and authority for that claim type;
4. temporal/version validity;
5. independence from already-selected evidence;
6. contradiction or uncertainty value.

The last two criteria mean the next best item is not always the next highest-scoring similar passage.

## Select for marginal information, not citation volume

Ten sources repeating one upstream claim can add less decision value than one credible contradictory source.

When building the visible evidence set:

- cluster duplicates, syndications, mirrors, and documents citing the same primary source;
- prefer the primary artifact when it is available and understandable;
- count independent evidence chains rather than raw URLs when expressing corroboration;
- add an item when it materially changes coverage, confidence, interpretation, or known uncertainty;
- stop adding evidence when marginal decision value becomes lower than inspection cost;
- retain access to the larger corpus behind progressive disclosure.

`12 sources agree` is misleading when eleven derive from the twelfth.

## Contradiction is first-class evidence

A smooth synthesis can erase the most important information in the set: reputable sources disagree.

When contradiction is material:

- surface it before or alongside synthesis, not in a buried caveat;
- identify what differs: fact, date, population, method, definition, scope, assumption, or interpretation;
- preserve source dates/versions where staleness could explain the conflict;
- avoid forcing a winner when available evidence does not justify adjudication;
- state what additional evidence would resolve the disagreement when knowable.

The interface should distinguish `evidence is mixed` from `the model is uncertain`. Those are different states.

## Provenance must survive compression

A generated evidence summary should never sever a claim from its source context.

For each decision-relevant claim, preserve enough metadata to answer:

- What source supports this?
- Which passage, observation, or record supports it?
- Is this direct evidence, a source's interpretation, or the AI's synthesis?
- When was it produced or last updated?
- Is the source primary, derivative, or quoting another source?
- What scope/population/version does the claim apply to?

NIST's AI risk-management work treats provenance and transparency as important risk-management concerns. But provenance is not itself proof of quality: knowing where a claim came from enables evaluation; it does not validate the claim.

## Citation presence is not citation faithfulness

Do not use `has citations` as a trust signal by itself.

Published 2025 work on RAG attribution distinguishes **citation correctness** (the cited text can support the claim) from **citation faithfulness** (the citation genuinely reflects the evidence the model relied on rather than a post-hoc attribution). Its experiments found substantial post-rationalized attribution. A September 2026 preprint goes further, demonstrating a citation-laundering attack in which a malicious source can drive a wrong answer while the output attributes that answer to a trusted source.

The latter is emerging security research and should not yet be generalized into prevalence claims. It is sufficient, however, to establish an important design boundary: a polished citation chip does not prove causal provenance.

For high-consequence systems, consider claim-level support checks and, where feasible, counterfactual/source-ablation tests during evaluation to detect whether removing a cited source changes the supported conclusion.

## Compression architecture

Prefer layered evidence over either extreme of `three cherry-picked cards` or `dump all 200 documents`.

### Layer 1 — decision view
Show the smallest set needed to understand:
- strongest relevant support;
- strongest material counterevidence;
- major coverage gap or unresolved uncertainty;
- source/date provenance.

### Layer 2 — evidence map
Allow expansion by claim, stance, source type, date, or subquestion. Group duplicates and reveal how many independent evidence chains exist.

### Layer 3 — source inspection
Open the original source at the supporting context when technically possible. Preserve surrounding text/data needed to detect quote mining or scope mismatch.

### Layer 4 — audit/debug view
For expert or regulated workflows, expose retrieval/query details, excluded evidence rationale, versions, and machine-level trace separately from the ordinary user surface.

Progressive disclosure should reduce cognitive load without hiding disagreement.

## Summaries need explicit epistemic boundaries

When compressing evidence into prose, distinguish:

- **observed/source-stated:** directly present in the underlying evidence;
- **derived:** calculated or logically inferred from evidence;
- **synthesized:** the model integrates multiple sources;
- **unknown/uncovered:** the evidence set does not answer it.

Do not turn a source's opinion into an observed fact by removing attribution. Do not turn absence of retrieved evidence into evidence of absence.

## Evidence ranking should be task-shaped

Different questions require different source hierarchies.

Examples:

- API behavior → current official documentation/source code can dominate commentary;
- legal requirement → controlling legal text and authoritative interpretation matter more than popularity;
- product sentiment → first-party docs establish capability, while independent user evidence is needed for experience claims;
- scientific effect → study design, population, replication, and synthesis matter more than publisher familiarity;
- current event → freshness and direct reporting may dominate older authoritative background.

Therefore `official source first` is a useful default for platform facts, not a universal evidence-ranking algorithm.

## Failure modes

- **Similarity tunnel:** top-k near-duplicates create an illusion of overwhelming support.
- **Authority flattening:** all citations render identically despite different evidentiary roles.
- **Source-count theater:** URL count is presented as independent corroboration.
- **Citation laundering:** a trustworthy citation visually legitimizes a claim it did not actually drive or support.
- **Contradiction burial:** dissenting evidence is technically available but visually subordinated to a confident synthesis.
- **Freshness collision:** old and new evidence are merged without date/version context.
- **Primary-source inversion:** derivative commentary outranks the primary artifact because it is easier to retrieve or summarize.
- **Evidence overload:** transparency becomes unusable, causing users to rely on the AI summary anyway.
- **Evidence laundering:** model-generated rationale is presented with the visual treatment of external evidence.
- **Coverage blindness:** retrieved evidence is strong for one subquestion while the UI implies the entire question is resolved.
- **Missingness-as-negative:** failure to retrieve support is interpreted as proof against the claim.
- **Polished-source bias:** typography, logo, or institutional branding substitutes for evaluation of actual support.

## Evaluation contract

Do not evaluate an evidence surface only by answer accuracy or citation precision. Test:

- claim-level support: does each cited item actually support the associated claim?
- contradiction recall: are material counterclaims retained?
- coverage: are major decision dimensions represented?
- independence: how many distinct evidence chains exist after deduplication?
- temporal validity: are stale/version-conflicted sources identified?
- source-to-claim inspectability: can users verify the relevant context efficiently?
- compression loss: what decision-relevant information disappears between corpus and visible evidence set?
- human behavior: do users inspect evidence, detect seeded bad recommendations, and notice disagreement?
- calibration: does the interface improve appropriate reliance rather than merely increase trust?

For adversarial evaluation, seed plausible high-similarity misinformation, duplicated claims, stale authoritative documents, and a credible minority contradiction. A robust evidence UI should not simply reward frequency or retrieval rank.

## Decision contract for AI coding/design agents

Before implementing an evidence-first surface, answer:

1. What decision or claim is the evidence meant to support?
2. Which source types are authoritative for that specific claim type?
3. What dimensions of coverage would make a one-sided evidence set misleading?
4. How will duplicates and shared upstream sources be detected or represented?
5. How will material contradiction survive ranking and summarization?
6. How will date/version/scope be visible when relevant?
7. Can each summarized claim be traced to inspectable supporting context?
8. Is model synthesis visually distinguishable from external evidence?
9. What evidence remains hidden by compression, and how can the user reach it?
10. What is the smallest useful visible set under realistic workload?
11. How will the system test citation support and not merely citation presence?
12. What should the UI say when evidence is insufficient or irreducibly mixed?

If these questions are unanswered, `evidence-first` may only be recommendation-first with the editorial choices hidden one layer earlier.

## Evidence boundary

The durable principles here are provenance preservation, claim-level support, explicit contradiction, deduplication/independence, task-shaped source quality, and progressive disclosure. Evidence that these improve every human decision context is not established.

NIST provides governance-level support for provenance/transparency rather than a concrete evidence-card UI. Google PAIR supports calibrating mental models and trust but does not prescribe this ranking architecture. The 2025 citation-faithfulness work is published research directly relevant to attribution. Contradiction-aware RAG and source-preference studies strengthen the technical case that similarity/frequency are insufficient. The September 2026 citation-laundering result is a recent preprint and should remain an adversarial research signal until independently replicated.

## Key sources

- NIST, *AI Risk Management Framework* and Generative AI Profile resources. https://www.nist.gov/itl/ai-risk-management-framework
- Google PAIR, *People + AI Guidebook*. https://pair.withgoogle.com/old-gb/
- Wallat et al. (ICTIR 2025), *Correctness is not Faithfulness in Retrieval Augmented Generation Attributions*. https://doi.org/10.1145/3731120.3744592
- Javadi et al. (2025), *When Evidence Contradicts: Toward Safer Retrieval-Augmented Generation in Healthcare*, preprint. https://arxiv.org/abs/2511.06668
- Schuster, Gautam & Markert (2026), *Whose Facts Win? LLM Source Preferences under Knowledge Conflicts*. https://arxiv.org/abs/2601.03746
- Guo (2026), *CiteShade: Citation Laundering in Multi-Source Retrieval-Augmented Generation and Its Counterfactual Defense*, preprint. https://arxiv.org/abs/2609.15660
