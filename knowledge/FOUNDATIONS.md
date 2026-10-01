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

## Evidence boundaries
- Hick (1952) is controlled choice-reaction research, not direct evidence for arbitrary menu-size thresholds.
- Pirolli's information-foraging models provide a stronger basis for reasoning about navigation cues and expected value, but they do not prescribe one universal information architecture.
- Recognition-over-recall and progressive-disclosure guidance are heuristics; context, frequency, expertise, risk, and information dependencies determine whether exposing or hiding information is better.

## Research needs
Error prevention and recovery, mental models, trust, decision architecture beyond simple choice reaction, perceived control, expert-vs-novice adaptation, and outcome evidence comparing disclosure/navigation structures.
