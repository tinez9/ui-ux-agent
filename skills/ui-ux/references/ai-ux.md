# AI-native UX

Products with models, copilots, generative features or agents. AI is not automatically a chat
box: it can be search, suggestions, transformations, contextual actions, generated previews,
adaptive workflows, background agents or conversation — choose the interaction model that fits the task.

## Quick rules

1. **Autonomy is risk-shaped:** low-risk reversible work runs autonomously with visible status and
   easy correction; consequential side effects pause for concrete approval; irreversible/high blast
   radius needs stronger confirmation **plus technical containment**. Permission UX is not a
   substitute for sandboxing and scoped credentials.
2. **Approvals show** action · target · scope · consequence · reversibility · reason. No vague
   "Allow?"; no approval spam (users approved ~93% of Claude Code prompts — fatigue is real).
3. **Optimize appropriate reliance, not trust.** Users should accept good output and catch bad
   output. Explanations and confidence numbers can increase reliance on wrong answers.
4. **Uncertainty is not one variable** — name what is uncertain (intent, evidence, data, coverage,
   execution, disagreement…) and let it change behaviour, not just add a badge.
5. **Provenance is a verification path, not a trust badge**, proportional to consequence;
   citation presence ≠ support ≠ correctness.
6. **Intent, attempt, acknowledgement and verified effect are different facts.** Never say
   "Sent/Deleted/Published" because a tool was called.
7. **Partial results are first-class:** requested vs completed vs failed scope, and whether
   conclusions depend on the missing part.
8. **Long-running agents: supervision by exception** — quiet when healthy, explicit when blocked,
   interruptive only when attention is worth it; resume with a delta, not a transcript.
9. **Expose responsibility changes, not orchestration topology.** One accountable owner; agents
   act "on behalf of", never laundered into the human's name.
10. **Recovery designed with the action:** undo for reversible automation, compensation for
    committed effects, deny-and-continue when a guardrail blocks.

## Audit checklist (AI lens)

- **Model fit:** is chat the right surface, or would inline suggestions, contextual actions,
  transformations or a background agent fit the task better? Is AI embedded in the real work objects?
- **Action classes:** for each AI capability — what side effects, blast radius, reversibility?
  Where are approvals, and do they show concrete action/target/scope/consequence? Are low-risk
  actions over-gated (fatigue) or high-risk ones under-gated?
- **Draft vs commit:** is AI output clearly a proposal until accepted? Is "draft but don't send",
  "analyze but don't execute", "diff but don't merge" available?
- **Uncertainty:** what kinds exist here? How are they shown? Any uncalibrated confidence
  percentages or blanket "AI can make mistakes" banners? Does high uncertainty change the action
  path (clarify, verify, narrow, abstain) or is the risky CTA still primary?
- **Provenance:** for factual/consequential claims, is evidence reachable at claim level, with
  date/scope? Are unsupported claims distinguishable? Is model synthesis visually distinct from
  external evidence?
- **Verification:** is checking cheap (click-to-source, side-by-side)? Is human review targeted
  ("why me, why this?") or "check everything"?
- **Execution truth:** do status messages reflect verified effects? Partial completion reported?
- **Progress/activity:** goal, current step, what changed, blocked/waiting for me, can I interrupt
  safely, what it used. Layered detail (summary → actions → logs). Post-run summary for consequential work.
- **Long-running presence:** peripheral state (running / waiting / needs attention / stuck /
  done); waiting shown as legitimate; live updates don't steal scroll/focus/drafts.
- **Control:** pause, stop, redirect, take over, cancel — with truthful semantics (stop future vs
  cancel pending vs best-effort vs compensate).
- **Recovery:** undo for AI changes to user content naming exactly what reverts; repeated user
  corrections treated as a signal to change the automation.
- **Attribution:** agent actions labelled as agent (on behalf of X) in history.
- **Capability changes:** model/feature changes that affect reliability are communicated where they matter.
- **Accessibility:** streaming text and status announced sensibly; uncertainty/state not by color/opacity alone.

## Autonomy, permissions and approvals

Expose meaningful scopes: always allow a narrow routine action · require approval for a class of
side effects · block a capability · limit tools/files/accounts/domains. Prefer narrow grants to
"trust this agent". If users approve reflexively, redesign the boundary (automate the low-risk
part inside constraints; interrupt for decisions worth attention). Approvals should present the
**semantic operation** (not raw tool syntax), target/scope, external side effects, evidence/diff,
reversibility, unusual privileges; group only actions sharing a risk boundary. If the reviewer
can't realistically verify, narrow the capability or route to a stronger control — don't transfer
responsibility to a human rubber stamp.

When a guardrail denies an action: state the boundary concisely, preserve completed safe work,
attempt a lower-risk route, escalate only what genuinely needs the user.

## Reliance and trust calibration

Trust is an attitude; reliance is behaviour. Measure decision quality: accept-when-correct,
reject-when-wrong, not acceptance rate or trust surveys.

| Intervention | Helps when | Fails when |
|---|---|---|
| confidence / uncertainty | empirically calibrated quantity users can act on | self-reported model confidence; displayed precision without reference class |
| explanation | exposes checkable evidence, assumptions, failure modes | fluent rationale that only persuades |
| sources | claims can be independently checked | citation count mistaken for support |
| initial human judgement first | anchoring is a demonstrated problem and the cost is acceptable | ritual for generative/low-risk tasks |
| forced pause / friction | consequence warrants deliberation | indiscriminate — approval fatigue |
| human review | reviewer has competence, context, time | "human in the loop" as ceremony under overload |

Error types matter (false alarms vs misses); expertise changes reliance; calibration is
longitudinal (announce capability changes and regressions). Make accept, reject, edit, compare and
verify comparably easy — no UI asymmetry that makes acceptance effortless and correction expensive.

**Sequencing for decision support:** AI-first for generative/exploratory low-cost suggestions;
human-first when the human has relevant evidence and wrong AI is costly; **evidence-first**
(observations, flags, cases, contradictions before a recommendation) can reduce anchoring —
descriptive flags propagated less model bias than prescriptive recommendations in a clinical
experiment. Label initial human input as an assessment that can change. Don't force human-first
where users can't form a meaningful judgement or time pressure forbids it.

## Uncertainty

Types: **intent** · **epistemic** (evidence insufficient) · **data** (missing, stale, conflicting,
inaccessible) · **model** (calibrated predictive uncertainty) · **execution** (effect unverified) ·
**coverage** (only part of scope processed) · **source disagreement** · **forecast/estimate**.

| Condition | Better UI |
|---|---|
| supported | state result; provenance on demand |
| incomplete evidence | what was checked and what wasn't |
| sources conflict | show the disagreement and why (date, scope, definitions, method) — don't average |
| required source unavailable | name the missing dependency |
| ambiguous intent | clarify before consequential action |
| plausible but unverifiable | mark unverified |
| inherent forecast | calibrated range + assumptions |

Behaviour ladder: proceed → soften precision → expose evidence → partial result with gaps →
alternatives → ask a minimal question → narrow scope → require verification/approval → abstain or
fall back. Language precision: "I found evidence for A but not B", "these sources disagree",
"3 of 12 files couldn't be checked" — not hedge fog or confident filler. Keep uncertainty local to
the uncertain claim.

## Abstention and escalation

Abstention is routing, not failure. Route by **cause**: missing intent → one targeted question ·
retrievable evidence → retrieve first · conflict → surface it · unfamiliar case → expert review ·
missing authority → request narrow permission · too consequential → prepare work + accountable
review · safe subset → complete it and mark the rest · unsupported → state boundary + alternative.
A useful abstention says what's unresolved, why it matters, what's done, what would resolve it,
who owns the next step, and whether the user can continue safely. Clarification has a cost: ask
only what changes the action and can't be inferred; offer safe defaults. Handoffs carry a compact
decision packet (goal, state, done work, unresolved decision, evidence, attempts, side effects,
constraints) — not a transcript. Abstaining changes human behaviour too (clinicians missed more
after "AI abstained") — evaluate the routed system end to end.

## Provenance and evidence

- Separate **origin**, **support**, **freshness/context**, **correctness**; never one green "verified" badge without a real verification process.
- Claim-level inspectability for consequential factual work (select claim → exact passage/data,
  source identity, date, scope; return without losing position); coarser for low-stakes synthesis.
- Optimize **verification cost**, not provenance volume: richer provenance can lower trust without
  changing behaviour if checking stays slower than accepting.
- **Allocate a verification budget** by consequence, reversibility, failure likelihood, automatic
  checkability, check cost, novelty, downstream amplification: machine-check what can be checked;
  flag the exact claims worth human attention; don't dump "verify everything" on users.
- Evidence selection is part of the argument: deduplicate shared upstream sources (12 sources
  repeating one ≠ corroboration), keep material contradictions visible, prefer primary artifacts,
  expose dates/versions, distinguish observed / derived / synthesized / unknown, don't treat
  missing evidence as negative evidence. Layers: decision view → evidence map → source inspection → audit view.

## Agent activity and presence

- **Two representations:** outcome-oriented activity for users (intent → approach when useful →
  execution summary by semantic operation → result incl. failures/unresolved → evidence → recovery
  actions) and a technical trace for debugging/admin. Don't dump traces; don't hide behind "Done".
- Compress by meaning, never hiding: failed/partial side effects, approvals/denials, permission or
  external changes, consequential handoffs, retries that may duplicate, intended-vs-actual divergence.
- Report boundaries: "Updated 7 of 40 files. 33 unchanged after permission expired."
- Parallel work isn't a sequential story; don't invent phases telemetry can't support; unknown
  usage/cost is not zero; trace payloads may be sensitive (redact, permission-aware).
- **Presence modes:** background (glanceable health), returning (delta since last look: changes,
  decisions, failures, needs-input), foreground (objective, step, affected objects, steer/pause).
  Interrupt for decisions, not telemetry. Distinguish progress from mere activity; "waiting" is
  legitimate. Multi-agent: aggregate health, surface exceptions ("which needs me, why").

## Delegation and multiple agents

Visibility ladder: internal specialist (invisible) → inspectable delegate (collapsed row) → visible
collaborator (independently meaningful workstream) → handoff (ownership changes, specialist talks
to the user) → human escalation. Keep roles distinct: request owner · delegate · approver · executor
· verifier. Gate **consequences, not architecture**. Agreement among agents sharing models/sources
isn't independent confidence (consensus theater). Context crossing a boundary is minimized by need
and permission.

## Human + agent on the same artifact

Choose granularity from the work: long/multi-file/consequential → isolated draft/branch → diff →
integrate; fine-grained co-creation → shared surface + presence that shows **task, region, phase,
whether it's safe to edit, whether my edits were incorporated**; high contention → partition or
serialize ownership. Human edits during a run are signals with ambiguous intent (preserve /
new preference / take ownership / exploratory / stop) — define intervention semantics: observe-only,
rebase, redirect, claim, pause, cancel. Mechanically mergeable ≠ semantically compatible; version-guard
writes so agents never clobber newer human work; review at units users can understand (suggested
edit, section, diff, PR, irreversible effect).

## Failure modes

Chat bolted onto everything · approval spam / rubber-stamp review · confidence theater · hedge fog ·
warning wallpaper · explanation halo · citation theater / laundering · source-count theater ·
verify-everything theater · silent partial success · tool-call certainty (attempt reported as
effect) · trace dump · outcome-only black box · presence theater (activity without progress) ·
notification per event · attention theft by live updates · agent theater · ownership ping-pong ·
invisible capability escalation · attribution laundering · invisible rebase · human edit clobber ·
forced human-first ritual · abstention dead end · fake undo of agent runs.

## Evidence boundary

Anthropic (Claude Code permission telemetry, containment), OpenAI and Microsoft (approvals,
tracing, orchestration/handoffs), Microsoft HAX, NIST AI RMF and AI 600-1, and controlled HCI studies
(appropriate reliance, explanations increasing over-reliance, confidence displays shifting
self-confidence, cognitive forcing trade-offs, selective prediction in clinical decisions,
provenance density, PaperTrail, Sidekick staged communication). Findings are task- and
population-specific; no universal confidence threshold, wording, routing rule or visualization is
established. For agent-supervision consoles see `ai-agent-oversight.md`.
