# Error prevention, confirmation, and undo

## Decision rule

Do not treat confirmation dialogs as the default safety mechanism. Match the intervention to **consequence, reversibility, error likelihood, detectability, scope, and recovery cost**.

A useful hierarchy is:

1. **Prevent or constrain** invalid/error-prone actions when the system can know they are wrong.
2. **Make consequences legible at the action point** when the action is valid but consequential.
3. **Prefer immediate action + undo** when reversal is reliable, fast, complete, and safe.
4. **Require confirmation** when the action is destructive or unusually consequential and cannot be easily undone.
5. **Escalate friction further** only when blast radius or irreversibility warrants it; friction itself is not safety.

This avoids two opposite failures: allowing catastrophic slips with no guardrail, and training users to dismiss routine confirmations automatically.

## Confirmation is conditional, not universal

Confirmation is strongest when all or most of these hold:

- the action is irreversible or recovery is expensive;
- consequences are serious or unusually broad;
- the action is uncommon enough that interruption remains meaningful;
- a plausible slip could trigger it;
- the confirmation can expose information needed to make the decision (target, scope, side effects, permanence).

GOV.UK explicitly reserves warning treatment for serious destructive consequences that cannot be easily undone and recommends an additional confirmation step in that case. Its interruption-page guidance also warns that interruption itself can obstruct task completion and should be used selectively. Atlassian similarly frames warnings around risk, consequence and immediacy rather than every potentially negative action.

Do **not** add a modal merely because an action is labelled Delete, Remove, Cancel, or Discard. First ask whether it is actually recoverable. A reversible removal with a trustworthy undo may need less pre-action friction than a permanent deletion.

## Prefer prevention before interrogation

When the system can eliminate an error-prone condition without removing legitimate capability, prevention is usually stronger than asking users to repeatedly certify intent. Examples include:

- constraints that make impossible states unrepresentable;
- disabling submission only when the reason is visible and understandable;
- preventing duplicate submissions technically rather than asking whether the user meant to click twice;
- validating dangerous scope before execution;
- separating visually or spatially destructive actions from routine high-frequency controls.

Nielsen Norman Group's error-prevention heuristic distinguishes eliminating error-prone conditions from checking them and confirming before commitment. Treat confirmation as one tool in the prevention system, not the system itself.

## Design a confirmation around the consequence

A useful confirmation answers, at scan speed:

- **What exactly will happen?**
- **To what object(s), account, environment, or audience?**
- **Can it be undone or recovered?**
- **What important side effect follows?**

Use explicit action labels such as `Delete project` rather than `Yes`, `OK`, or `Confirm`. Atlassian's button guidance specifically favors labels describing the resulting action and rejects vague Yes/No confirmation labels.

Do not rely on danger color alone. GOV.UK explicitly requires context and button text to communicate destructive consequence independently of red styling.

The confirmation should not introduce surprise terms after the user has already committed psychologically. If a consequence is material to the decision, expose it before the final action.

## Undo is a capability, not a toast

Only promise undo when reversal is operationally trustworthy.

Check whether undo restores:

- the full object/state rather than a partial approximation;
- relationships and ordering that matter;
- permissions and ownership where relevant;
- external side effects, notifications, billing, publication, or downstream actions;
- the state after concurrent changes without silently overwriting newer work.

If these cannot be restored safely, describe the mechanism as recovery/restore where appropriate rather than presenting a misleading `Undo` control.

Undo should be discoverable immediately after the action, identify what changed, and remain available for a period proportionate to recovery needs. Do not make a short-lived toast the only recovery path for high-value data.

## Bulk actions need scope safety

Bulk operations multiply both efficiency and blast radius. Before a consequential bulk commit, make the affected scope inspectable:

- selected count and selection rule;
- whether selection means visible page, filtered result set, or all matching records;
- excluded/exception items when material;
- action consequence and reversibility.

A confirmation that says `Delete 1,248 records` is more useful than `Are you sure?`, but count alone is insufficient when the selection rule itself may be misunderstood.

For agent-initiated actions, apply the same principle to the proposed **blast radius**, not merely the number of tool calls. Ten reversible local edits and one external irreversible send do not have equivalent risk.

## Confirmation fatigue and habituation

Repeated low-information confirmations create a predictable failure mode: the safety step becomes part of the motor sequence instead of a decision point. Avoid measuring confirmation quality by acceptance rate; a near-universal `Confirm` rate can indicate either correct intent or meaningless friction.

Useful evaluation signals include:

- accidental-action rate;
- cancellation after seeing consequence/scope;
- undo/recovery rate;
- repeated immediate reversals;
- time and errors introduced by the safeguard itself;
- whether users can correctly state consequence and scope;
- frequency of confirmations per task/session;
- irreversible incidents that bypassed the safeguard.

If users repeatedly confirm and immediately undo, investigate the initiating control, defaults, scope model, or workflow rather than adding another confirmation layer.

## Accessibility and interaction

A modal confirmation must behave as a real dialog: clear accessible name, predictable focus entry/return, keyboard operation, and dismiss/cancel behavior appropriate to the risk. Preserve the user's underlying context; do not erase unsaved work merely because a confirmation was dismissed.

Do not encode severity solely through color or iconography. Keep the dangerous action's wording specific and consistent between trigger, dialog title/body, and commit button.

## Failure modes

- **Confirm everything:** habituation makes the dialog ceremonial.
- **Vague confirmation:** `Are you sure?` forces users to reconstruct the consequence from memory.
- **Yes/No buttons:** the action cannot be understood from the controls alone.
- **Fake undo:** UI claims reversibility while external or concurrent side effects persist.
- **Toast-only recovery:** a transient surface is the sole route to restore important data.
- **Count-only bulk safety:** the number is visible but the selection semantics are ambiguous.
- **Danger-color dependence:** severity disappears for users who cannot perceive or interpret the color.
- **Double safety:** a reversible action gets both a modal and undo without evidence the extra interruption helps.
- **Agent call-count risk:** approval policy counts operations instead of consequence, reversibility and blast radius.

## Implementation contract for coding/design agents

Before adding a confirmation, document:

1. likely user error;
2. consequence and blast radius;
3. reversibility and recovery fidelity;
4. why prevention/constraint cannot remove the error first;
5. what new decision-relevant information the confirmation presents;
6. exact target/scope shown to the user;
7. cancellation and focus-return behavior;
8. post-action recovery path;
9. metric that would reveal confirmation fatigue or safeguard failure.

If items 4–5 have weak answers, reconsider the modal.

## Evidence boundary

This guidance combines mature heuristic and production design-system guidance. GOV.UK and Atlassian independently support consequence-sensitive warning/confirmation and explicit action wording; Nielsen Norman Group supports preventing error-prone conditions before relying on confirmation. These sources do **not** establish a universal numeric threshold for when confirmation becomes fatigue, nor do they prove undo is always superior. Product/domain testing remains necessary for frequency, timing, recovery windows, and high-stakes workflows.

## Sources reviewed 2026-10-04

- GOV.UK Design System — Button: https://design-system.service.gov.uk/components/button/
- GOV.UK Design System — Interruption pages: https://design-system.service.gov.uk/patterns/interruption-pages/
- Atlassian Design System — Warning messages: https://atlassian.design/content/writing-guidelines/writing-a-warning-message
- Atlassian Design System — Button usage/examples: https://atlassian.design/components/button/button-legacy/usage
- Nielsen Norman Group — Usability Heuristic 5: Error Prevention: https://www.nngroup.com/videos/usability-heuristic-error-prevention/
