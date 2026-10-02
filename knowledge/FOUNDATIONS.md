# Foundations

Durable principles that should survive changing visual trends and frontend libraries.

## Core principles
- Design starts with the user's task, required information, and decisions the interface must support.
- Prefer recognition over unnecessary recall for frequent tasks, but do not equate "visible" with "show everything at once".
- Important actions need understandable feedback: accepted, processing, succeeded, failed, or requires input.
- Consistency improves learnability, but exceptions can clarify hierarchy, state, or task importance.
- Progressive disclosure can manage complexity when secondary information can safely wait; hiding frequent or prerequisite information merely adds interaction and discovery cost.
- Defaults are product decisions, especially for privacy, destructive actions, AI autonomy, notifications, and irreversible operations.

## Choice architecture: reduce uncertainty, not mechanically the option count

### Decision rule
Optimize the user's ability to identify the next useful action. Ask:

1. Does the user already know the target, or are they genuinely choosing among alternatives?
2. Can labels and surrounding context predict what lies behind each action?
3. Are options meaningfully grouped and distinguishable?
4. Would hiding an option reduce cognitive competition, or merely create another navigation/search step?
5. Is the user a novice learning the space or an expert repeatedly accessing known commands?

### Information scent
Navigation is a prediction problem. Information-foraging research models users as evaluating proximal cues against their current goal and deciding whether the expected value of continuing exceeds alternatives. In practice:

- write labels that predict destination/content rather than clever internal terminology;
- add context when a label alone is ambiguous;
- preserve distinctions users actually need to choose a path;
- treat repeated backtracking, pogo-sticking, or abandonment as possible scent failures rather than automatically as "too many choices";
- test navigation using realistic goals, because a label has strong scent only relative to what the user is seeking.

### Recognition vs recall
Externalize information that users would otherwise have to remember across steps: labels, current state, constraints, recent/relevant choices, and recoverable context. Recognition is especially valuable when mappings are unfamiliar or infrequent.

Do not turn the heuristic into "make every command permanently visible." Visibility competes for attention and space. Frequent/critical actions should normally be visible or immediately discoverable; infrequent advanced actions can be disclosed contextually when their hiding cost is lower than their competition cost.

### Hick-Hyman: use narrowly
Hick's original choice-reaction experiments linked reaction time to information/uncertainty across alternatives, not to a universal UI rule such as "menus must contain at most N items." Later work continues to treat stimulus probability and information as important to the relationship.

Therefore:

- do not derive arbitrary limits such as 5, 7, or 10 visible choices from Hick-Hyman;
- distinguish **decision cost** from **visual search/scanning cost**;
- a user locating a known command in a structured list is not the same task as choosing among equally plausible alternatives;
- probability, familiarity, ordering, grouping, discriminability, and prior knowledge can matter as much as raw option count;
- reducing options is useful when it removes irrelevant or competing decisions, but harmful when it hides likely targets behind vague categories or extra steps.

### Progressive disclosure
Use progressive disclosure when advanced, conditional, risky, or infrequent controls would otherwise compete with the primary task and users can correctly predict where to find them.

Avoid it when hidden information is required to understand the current decision, frequently used, safety-critical, or difficult to rediscover. For expert workflows, consider shortcuts, remembered expansion state, customization, or dense modes rather than forcing repeated disclosure.

### Agent checklist
Before simplifying an interface by hiding choices:

- identify whether the bottleneck is choosing, finding, understanding, or remembering;
- remove irrelevant choices before hiding relevant ones;
- improve labels/grouping/scent before adding hierarchy;
- keep state and prerequisites visible at the point of decision;
- preserve fast paths for repeated expert work;
- validate with task-based behavior rather than applying a fixed option-count heuristic.

## Trust and perceived control: optimize calibration, not reassurance

A trustworthy interface should help people form an accurate expectation of what the product will do and give them proportionate control when that expectation is wrong. Do not treat trust as a visual style or as something created by adding reassuring copy.

### Trust-supporting mechanics

Build confidence through observable behavior:

- **Predictability:** identical or equivalent actions should keep stable names and behavior across contexts. WCAG's consistent-identification guidance provides an accessibility basis for this: repeated functions are harder to learn when they are identified differently.
- **Legible state:** show relevant current state, in-progress state, completion, failure, and changed content at the point where it matters. Feedback should be proportional to consequence; routine status can remain quiet while serious risks may justify interruption.
- **Consequence visibility:** labels and nearby context should help people predict what an action changes before they invoke it. Prefer concrete outcomes over vague commands when consequences are not obvious.
- **Reversibility:** where feasible, make consequential changes recoverable and make the scope of undo predictable. Recovery increases safe exploration only when people can understand what will be restored.
- **Correction:** when the system makes a mistake, expose a familiar correction path and reflect the correction promptly. Repeated corrections are evidence that the underlying behavior may need redesign rather than more explanation.
- **Transparency at decision boundaries:** explain permissions, data use, automation, or unusual side effects when the explanation changes an informed decision. Do not front-load every implementation detail.
- **Stable agency:** avoid surprising context changes or actions that fire merely because a control receives focus/input unless that behavior is expected and safe. Major context changes should normally follow an intentional request.

### Control is not the number of controls

Perceived control comes from the ability to **predict, intervene, correct, reverse, or exit** at meaningful boundaries. Adding settings, confirmations, and buttons can reduce control if they obscure the primary path or force people to supervise trivial operations.

Use stronger intervention points as consequence, irreversibility, ambiguity, or blast radius rises. For low-risk predictable operations, immediate execution plus visible feedback or undo is often more controllable than repeated confirmation. For high-impact or irreversible operations, preview/review, explicit confirmation, stronger authentication, or technical containment may be appropriate.

### Feedback should match severity

Do not announce every success with the same visual weight. Apple HIG explicitly distinguishes quiet contextual feedback from interruptive alerts and warns that overusing alerts weakens their effectiveness. A useful hierarchy is:

1. **Ambient state** — persistent or locally visible state requiring no interruption.
2. **Transient confirmation** — a meaningful completed action whose result may otherwise be unclear.
3. **Actionable failure** — what failed, why when useful, what remains intact, and the next recovery action.
4. **Interruptive warning** — reserve for sufficiently serious, unexpected, or hard-to-recover consequences.

Success feedback can often be implicit in the changed interface. Extra confirmation is valuable when completion is consequential, delayed, remote, or otherwise not self-evident.

### Trust failure modes

Avoid:

- reassuring language that exceeds what the system can guarantee;
- hiding uncertainty, partial completion, stale data, or degraded behavior behind a generic success state;
- inconsistent names or behavior for the same operation;
- silent automation whose effects are difficult to inspect or reverse;
- asking for confirmation so often that confirmation becomes habitual rather than meaningful;
- exposing many settings as a substitute for good defaults and recovery;
- undo that is ambiguous about which action or scope it will reverse;
- explanations that appear only after an unexpected side effect has already happened.

### Agent decision rule

Before adding UI intended to increase trust, ask:

1. What uncertainty does the user actually have: system state, consequence, capability, data handling, or recoverability?
2. Can behavior itself resolve that uncertainty through visible state, predictable action, or recovery rather than prose?
3. What can go wrong, how severe is it, and can the user detect and reverse it?
4. Where is the cheapest meaningful intervention point: edit, cancel, undo, review, confirmation, or permission?
5. Does the proposed reassurance accurately reflect system guarantees and current state?
6. If users repeatedly need to verify the system, is the underlying behavior insufficiently predictable?

Prefer **evidence of reliability + understandable limits + recovery** over decorative signals of confidence.

## Evidence boundaries
- Hick (1952) is controlled choice-reaction research, not direct evidence for arbitrary menu-size thresholds.
- Pirolli's information-foraging models provide a stronger basis for reasoning about navigation cues and expected value, but they do not prescribe one universal information architecture.
- Recognition-over-recall and progressive-disclosure guidance are heuristics; context, frequency, expertise, risk, and information dependencies determine whether exposing or hiding information is better.
- WCAG 2.2 establishes accessibility requirements around predictable behavior and consistent identification; it does not prove that consistency alone creates generalized product trust.
- Apple HIG independently supports clear/proportionate feedback, reversibility, transparent intent, consistency, and correction. These are mature platform guidelines, not controlled evidence that a specific combination maximizes trust in every product category.
- Claims about "trust" should therefore be framed as calibrated design mechanics and hypotheses to validate in context, not as a guaranteed emotional outcome.

## Research needs
Mental models, trust calibration outcome evidence, decision architecture beyond simple choice reaction, expert-vs-novice adaptation, cross-cultural expectations, and measured comparisons of disclosure/navigation/recovery structures.
