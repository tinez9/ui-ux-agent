# Open Research Questions

Prioritize questions whose answers could materially change future agent behavior.

## Resolved / narrowed this cycle
The broad question “Which context artifacts most improve visual quality in AI-generated frontend work?” now has a useful first answer for Claude: a brief-grounded design contract plus visual references/rendered inspection and explicit evaluation criteria are supported by Anthropic's current workflow evidence. Remaining comparative questions belong below.

## Current queue
- In autonomous browser-based UI reviews, which controls prevent unintended cross-origin requests or state-changing behavior? Compare Playwright MCP origin filters (documented as non-boundaries), Chrome DevTools MCP URL filters (Chrome-version and attachment constraints), and agent-browser opt-in domain/action policies. Use benign redirect, subresource, WebSocket, file, WebMCP, and state-changing-button fixtures; separate browser guardrails, host isolation, visible-UI coverage, and actual blocked actions.
- Does Microsoft's Playwright CLI skill improve visual-QA defect detection beyond CLI without the skill or Playwright MCP? Compare seeded defects and clean controls, inspected screenshots versus semantic snapshots, real UI journeys versus page-provided WebMCP shortcuts, accessibility/focus regressions, and context cost. Separate successful browser automation from verified visual quality; treat vendor efficiency claims as unvalidated.
- On blinded accessibility repairs, do specialized agent skills improve correct behavioral fixes beyond ordinary Playwright + axe, without increasing false-positive edits or regressions? Test OTP paste, focus persistence, stale autocomplete, live status, chart/table parity, and clean controls; keep repair oracles hidden from the agent.
- How much incremental benefit comes from each context artifact (design contract, screenshot/reference, design-system tokens, real content, acceptance criteria) when isolated experimentally?
- Which recurring visual traits most strongly make current AI-generated interfaces feel generic across models, rather than only in Claude?
- When does generative UI outperform fixed interfaces?
- How should approval/undo thresholds vary by domain, blast radius, reversibility, and user expertise?
- Which provenance details materially improve verification without overwhelming users?
- Which products benefit from spatial navigation or direct manipulation?
- When does spatial continuity measurably improve comprehension or task success versus an instant state change, and for which navigation structures?
- Which direct-manipulation and drag/drop feedback patterns remain robust across pointer, touch, keyboard, and reduced-motion modes?
- Under realistic latency, when do skeletons outperform preserved stale content, spinners, or no transitional UI in perceived speed and task success?
- How should agent activity be visualized for long-running tasks?
- Which mix of semantic tokens, component contracts, composition rules, rendered references, and real content most improves agent fidelity when tested independently?
- How should design-system degrees of freedom be encoded so agents preserve brand/system integrity without converging on repetitive layouts?
- Which patterns show real product adoption versus showcase-only visibility?
- Which modern browser capabilities enable distinctive UX with acceptable complexity?
- Which scroll-linked effects measurably improve orientation/comprehension versus adding distraction, and when is a discrete scroll-state query preferable to a continuous timeline?
- When is an independent visual evaluator worth its latency/token cost for current frontier models?
