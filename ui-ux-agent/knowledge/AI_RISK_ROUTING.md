# Risk routing for agent oversight

## Research question

How should an agentic product decide which operations may run autonomously, which need synchronous review, and which deserve post-run inspection without hiding tail risk behind a single score?

## Core conclusion

Do not reduce agent risk to one opaque `risk_score`. Route oversight from a **risk vector plus hard policy gates**.

A useful router separates at least:
- consequence severity;
- blast radius / number and importance of affected entities;
- reversibility and recovery cost;
- privilege and data sensitivity;
- external visibility or commitment;
- time-to-harm and time available to intervene;
- novelty / distance from validated operating conditions;
- evidence quality and unresolved uncertainty;
- anomaly or policy signals;
- cumulative exposure across repeated individually-small actions.

Some dimensions are **non-compensatory**. A low anomaly score must not cancel an irreversible destructive action; high model confidence must not cancel a privilege escalation; low per-item impact must not cancel a bulk operation with large aggregate exposure.

## Route by operation, not model confidence

The primary object is the risk-bearing semantic operation: e.g. “send 4,000 customer emails”, “grant repository admin”, “delete 12 records”, or “draft a report”. Tool calls are implementation detail and model confidence is, at most, one weak signal about epistemic uncertainty.

Classify the proposed operation before deciding the review route. Useful routing outcomes are:

1. **Block / constrain** — outside allowed authority or risk tolerance.
2. **Require synchronous approval** — consequential action where human review can still prevent harm.
3. **Autonomous within bounded policy** — sufficiently contained/reversible operation with enforceable limits.
4. **Execute + mandatory post-run review** — synchronous interruption adds little but outcome inspection matters.
5. **Execute + sampled monitoring** — established low-risk class, still subject to drift and unknown-failure detection.

The router should be able to choose a safer transformed operation rather than only approve/deny: reduce batch size, narrow recipients, remove write permission, stage a draft, require a dry run, or create a reversible checkpoint.

## Hard gates before weighted prioritization

Use deterministic gates for known unacceptable or specially governed conditions. Examples:
- operation exceeds the actor's authorization;
- irreversible destructive action above an explicit scope;
- privilege/role expansion;
- sensitive-data transfer to a new destination;
- financial or contractual commitment above policy;
- public/external publication where review is mandated;
- security-control modification;
- action class explicitly forbidden by policy.

Only after hard gates should a product use a weighted or learned ranking to prioritize ambiguous review work. This prevents a favorable aggregate score from compensating for a dimension that should never be traded away.

## Blast radius is multidimensional

Do not define blast radius only as record count. Consider:
- **scope:** number of users, records, systems, recipients, environments;
- **criticality:** production vs sandbox; payroll vs test data;
- **propagation:** whether downstream systems/agents automatically consume the change;
- **persistence:** whether the effect survives the session or creates future authority;
- **coupling:** whether one action can trigger cross-system consequences;
- **recoverability:** whether rollback restores the original state completely;
- **latency:** how quickly damage occurs relative to detection/intervention.

This matters because ten permission changes can be more consequential than deleting thousands of disposable cache rows, and a single orchestration-layer change can propagate across many agents.

## Reversibility is not binary

Treat recovery as a gradient:
- trivially undoable with verified inverse;
- recoverable from version/history with bounded cost;
- compensatable but not truly reversible (e.g. send a correction after an email);
- partially recoverable;
- practically irreversible.

A UI must not label an operation “reversible” merely because an undo button exists. Verify that rollback covers external side effects, downstream propagation, permissions, notifications, financial effects, and time-sensitive consequences.

## Cumulative and correlated risk

Routing each action independently creates a loophole: an agent can perform 1,000 individually acceptable actions whose aggregate exposure violates policy.

Maintain episode/session/window budgets for dimensions such as:
- money spent;
- records modified/deleted;
- messages sent;
- external recipients/domains;
- privileged changes;
- API/tool volume;
- compute/time;
- sensitive data accessed or transferred.

Escalate when cumulative exposure crosses a boundary even if no individual action does. Also detect correlated sequences: `read secrets → contact new domain → transmit data` is more meaningful than three isolated low-level calls.

## Novelty and anomaly are escalation signals, not safety proofs

Novel tools, destinations, workflows, permission combinations, data classes, or unusually large deviations from validated behavior deserve increased review until evidence accumulates.

But “normal-looking” must never mean safe. Known dangerous operations can be statistically ordinary. Conversely, benign new behavior can look anomalous. Use anomaly detection to discover/rank cases, not to override hard safety policy.

## Designing the review queue

For each routed episode show:
- proposed outcome and side effect;
- the dimensions that drove routing;
- any hard gate crossed;
- affected scope and critical resources;
- reversibility/recovery path;
- cumulative exposure before and after approval;
- relevant evidence/provenance;
- why the operation differs from its normal baseline, if anomaly contributed;
- safer alternatives such as narrower scope or draft-only execution.

Avoid unexplained badges such as `Risk 83/100`. If an aggregate score is retained internally for ordering, expose the causal dimensions reviewers can act on.

## Validate the router, not just the agent

A risk router is itself a decision system and can fail silently. Evaluate it with a labeled/adversarial suite containing:
- ordinary low-risk operations;
- known high-impact actions;
- rare catastrophic/tail cases;
- cumulative-risk sequences;
- permission escalation;
- indirect prompt-injection/tool-output scenarios;
- new tools/destinations;
- high-confidence wrong actions;
- low-confidence harmless actions;
- actions where recovery appears available but is incomplete.

Measure by risk class, not only global accuracy:
- high-impact miss rate / false negatives;
- unnecessary interruption rate / false positives;
- time-to-detection relative to time-to-harm;
- coverage of hard-gated classes;
- cumulative-risk detection;
- reviewer workload and queue latency;
- successful containment/rollback;
- drift after policy/tool/model changes.

A router with excellent average classification but one systematic catastrophic blind spot is not “99% safe”. Thresholds should follow explicit risk tolerance and domain obligations, not a universal benchmark.

## Threat model the score itself

Treat routing inputs, thresholds, and risk scores as security-sensitive. Attackers or compromised agents may attempt to:
- split a large operation into sub-threshold actions;
- manipulate model confidence;
- disguise a new destination as familiar;
- poison anomaly baselines;
- choose tools with weaker metadata;
- omit or misstate expected side effects;
- exploit stale policies after permissions/tooling change.

Compute enforceable properties outside the model where possible: actual authorization, destination, batch size, data classification, spend, environment, and tool capability. Do not let free-form model self-description be the authority for these facts.

## Evidence and boundaries

- NIST AI RMF explicitly treats risk tolerance as contextual and organization/use-case specific; it does not prescribe universal thresholds. Its Measure function calls for ongoing testing, uncertainty-aware measurement, benchmarking, monitoring, and independent review where useful.
- NIST's safety guidance says different failure types can cause different harm and calls for tailored approaches based on context and severity. This supports risk-class evaluation rather than one global performance number.
- OWASP's current AI Agent Security Cheat Sheet identifies tool abuse, privilege escalation, excessive autonomy, high-impact action abuse, approval manipulation, cascading failures, and sensitive-data exposure as distinct agent risks. This supports multidimensional routing and treating the routing mechanism itself as attackable.
- OWASP Excessive Agency guidance separates excessive functionality, permissions, and autonomy, and recommends minimizing these independently. Rate limiting can reduce damage even when an action remains available.
- Anthropic's 2026 containment write-up provides shipped-product evidence that repeated human permission prompts are fallible: its Claude Code telemetry observed roughly 93% of prompts being approved and reports declining diligence with approval volume. It argues for limiting what agents are able to do, not relying only on behavioral supervision. This is product-specific evidence, not a universal approval-fatigue rate.
- OWASP's agentic threat material illustrates why cross-system authority and missing transactional safeguards increase blast radius. Treat scenario catalogs as threat-model guidance, not empirical incident-frequency estimates.

There is no defensible universal formula or cutoff for an agent `risk_score`. Risk dimensions, non-compensatory gates, thresholds, and review routes must be calibrated to the product's consequences, obligations, recovery mechanisms, operating environment, and observed failures.

## Sources

- NIST AI RMF, risk framing and tolerance: https://airc.nist.gov/airmf-resources/airmf/1-sec-risk/
- NIST AI RMF, Measure: https://airc.nist.gov/airmf-resources/airmf/5-sec-core/
- NIST AIRC, AI risks and trustworthiness: https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/
- OWASP AI Agent Security Cheat Sheet (accessed 2026-10-03): https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html
- OWASP LLM06:2025 Excessive Agency: https://genai.owasp.org/llmrisk/llm062025-excessive-agency/
- OWASP Cornucopia Agentic AI AAIK, excessive agency / cross-system impact: https://cornucopia.owasp.org/cards/AAIK
- Anthropic, “How we contain Claude across products” (2026): https://www.anthropic.com/engineering/how-we-contain-claude
