# Adaptive Interfaces and Spatial Stability

## Decision rule

Do not equate personalization with automatic rearrangement. Preserve stable locations for learned, frequently repeated actions unless there is evidence that adaptation benefits outweigh relearning, prediction errors, and loss of spatial memory.

Prefer this order of intervention:

1. improve the base information architecture;
2. let users explicitly customize when customization has durable value;
3. add non-displacing adaptive cues or recommendations;
4. adapt ordering/visibility only when prediction quality, task context, reversibility, and evaluation justify instability.

The key distinction is **adaptive** (the system changes the interface) versus **adaptable** (the user changes it). They have different control, learning, and trust costs.

## Why spatial stability matters

Repeated interaction can shift from visual search toward learned spatial retrieval. A stable command location therefore becomes part of the interaction contract, not merely layout decoration.

Recent spatial-menu research continues to show that users learn command locations and that landmarks can accelerate expert selections. This does not prove every interface must be static, but it strengthens the case against gratuitously moving high-frequency controls.

Treat these as high-cost adaptation targets:

- primary navigation;
- destructive or safety-relevant actions;
- repeated expert commands;
- controls used through motor/spatial memory;
- locations referenced by training, support, documentation, or collaboration.

## Evidence against naive auto-reordering

A controlled CHI 2004 comparison of static, system-adaptive, and user-adaptable split menus found the static condition significantly faster than the adaptive condition; participants generally preferred the adaptable approach. This is older menu-specific evidence, not a universal prohibition, but it falsifies the assumption that frequency-based reordering automatically improves efficiency.

A 2026 Journal of Systems and Software experiment comparing a static menu with many graphical adaptive menu styles found adaptation effects varied substantially by technique. Changing interfaces generally increased measured cognitive load/memorization demands relative to the static baseline, while some adaptive techniques improved completion time or engagement. Preference and objective performance did not collapse into one measure.

Operational implication: **“personalized” is not an outcome metric.** Measure selection time, errors, cognitive effort, recovery, learning, and user control separately.

## Adapt without moving things

When adaptation has value but location stability matters, prefer additive or ephemeral mechanisms:

- highlight or annotate likely actions while keeping order stable;
- show a separate recent/frequent region without removing canonical locations;
- suggest the next action contextually;
- provide search/command-palette ranking while preserving ordinary navigation;
- expose user-controlled favorites/pinning;
- use transient attention guidance that does not permanently relocate commands.

Research on ephemeral adaptation demonstrated that prediction can reduce visual search while retaining spatial consistency: predicted items appeared immediately while others faded in, producing faster selection than static menus when prediction accuracy was high without significant slowdown at low accuracy in the reported experiments. The broader lesson is not to copy the animation; it is that **adaptation policy and adaptation presentation are separate design decisions**.

## Stable core, adaptive edge

A robust architecture is:

- **stable core:** canonical navigation, object model, primary actions, safety controls;
- **user-controlled layer:** favorites, pinned views, toolbar customization, saved filters;
- **adaptive edge:** recommendations, recents, ranked search, contextual suggestions, optional shortcuts.

This lets the system optimize discovery and efficiency without continuously rewriting the user's map of the product.

## When automatic adaptation is more defensible

System-driven adaptation becomes more plausible when several conditions hold:

- the option space is large enough that static search cost is meaningful;
- usage is repetitive enough to learn a useful signal;
- predictions are sufficiently accurate for the consequence of a miss;
- movement cannot cause dangerous slips;
- a canonical route remains available;
- the adaptation is explainable or unsurprising in context;
- users can recover, pin, reset, or disable it when appropriate;
- benefits are measured longitudinally rather than only on first exposure.

Contextual adaptation can be safer than identity-based personalization. For example, surfacing actions that are valid for the selected object may reduce irrelevant choice without pretending to infer enduring user preference.

## Adaptable interfaces: user control is not free

User-controlled customization avoids surprise but creates other costs:

- setup burden;
- poor self-optimization;
- configuration drift across devices/teams;
- support/documentation divergence;
- hidden capabilities after aggressive customization;
- migration problems when the product changes.

Do not expose customization merely because it is technically easy. Offer it where repeated use makes the investment recoverable.

Useful safeguards include sensible defaults, reset-to-default, visible customization mode, bounded placement zones, synchronization rules, and migration behavior that preserves intent.

## Failure modes

### Frequency trap
A frequently used action rises in rank even though its old stable location was already faster through muscle/spatial memory.

### Moving-target navigation
Primary destinations reorder after use, forcing repeated visual reacquisition.

### Prediction hides capability
Low-ranked or predicted-irrelevant actions disappear, making the product appear less capable and damaging discovery.

### Self-reinforcing ranking
Surfaced items receive more clicks because they are surfaced, which is then interpreted as stronger preference.

### Shared-screen inconsistency
Two collaborators cannot reliably tell each other where an action is because their layouts differ.

### Automation without provenance
The interface changes but gives no clue whether the cause was user customization, context, role/policy, experiment, or algorithmic adaptation.

### Personalization as decoration
The system rearranges UI to signal intelligence without a measurable task benefit.

## Implementation model

Keep canonical information architecture separate from presentation ranking.

```text
command {
  id
  canonical_group
  canonical_position
  availability(context)
  risk
}

presentation {
  pinned_by_user
  recent_score
  predicted_score
  adaptation_reason
}
```

Never make an adaptive rank the sole identifier of a command. Preserve stable IDs, semantics, shortcuts where appropriate, analytics attribution, accessibility names, and a canonical fallback path.

For experimentation, log enough to distinguish exposure from preference. A click on an adaptively promoted item is confounded by its increased visibility.

## Evaluation

Do not evaluate only immediate click time. Include:

- first-use search time;
- repeated-use selection time;
- errors/misselections;
- ability to locate non-promoted commands;
- retention after time away;
- adaptation-prediction accuracy;
- recovery after wrong predictions;
- preference/control perception;
- expert performance after learning;
- cross-device and collaborative consistency.

A short experiment can favor novelty or visual salience while missing long-term spatial-learning costs.

## Evidence boundaries

- Findlater & McGrenere, CHI 2004, is controlled but old and menu-specific. It is strong evidence against universal claims that automatic adaptation is faster, not proof that all modern adaptive UI is worse.
- Gaspar-Figueiredo et al., Journal of Systems and Software 2026, supplies recent comparative evidence across graphical adaptive menus; its menu-selection task does not directly generalize to whole-app adaptive layouts.
- Findlater et al., CHI 2009, supports adaptation that preserves spatial consistency under its experimental conditions; the specific fade technique should not be universalized.
- Uddin et al., Graphics Interface 2026, supports spatial learning and landmarks in tablet command menus; it strengthens the stability mechanism but does not establish outcomes for ordinary web navigation.

## Sources

- Findlater, L. & McGrenere, J. (2004). *A comparison of static, adaptive, and adaptable menus*. CHI '04. https://doi.org/10.1145/985692.985704
- Gaspar-Figueiredo, D., Vanderdonckt, J., Abrahao Gonzales, S. M., & Insfran, E. (2026). *User experience with adaptive user interfaces: Comparing performance and preferences*. Journal of Systems and Software, 231, 112598. https://doi.org/10.1016/j.jss.2025.112598
- Findlater, L., Moffatt, K., McGrenere, J., & Dawson, J. (2009). *Ephemeral adaptation: The use of gradual onset to improve menu selection performance*. CHI '09. https://www.cs.ubc.ca/labs/imager/tr/2009/findlater_chi_ephemeral/
- Uddin, S. et al. (2026). *Enhancing Spatial Learning of Large Command Sets in Two FastTap Menus with Artificial Landmarks*. Graphics Interface 2026. https://doi.org/10.1145/3769872.3769882

## Agent checklist

Before making an interface adaptive, ask:

1. What measurable user cost is adaptation reducing?
2. Can the same benefit be achieved without moving established controls?
3. Does this element benefit from spatial/motor learning?
4. What happens when the prediction is wrong?
5. Is canonical access still visible and stable?
6. Would user-controlled customization be more appropriate?
7. Could ranking create a self-reinforcing analytics loop?
8. Have long-term learning and non-promoted-item discovery been evaluated?

Default stance: **preserve the learned map; adapt around it unless evidence supports changing it.**
