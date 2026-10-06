# Error Prevention and Recovery

## Core model

Do not treat every possible mistake with the same mechanism. Design the cheapest reliable intervention for the error's **cause, consequence, detectability, reversibility, and frequency**.

Prefer, roughly in this order:

1. **Remove the error opportunity** when the system already knows what is valid.
2. **Constrain choices** so invalid states are difficult or impossible to express.
3. **Provide instructions/examples** where the rule cannot be inferred from the control.
4. **Validate and suggest correction** when invalid input must remain expressible.
5. **Review before commitment** when correctness depends on meaning/context rather than syntax.
6. **Make the action reversible** when safe reversal is possible.
7. **Add confirmation/friction** only when consequence and irreversibility justify interruption.
8. **Support recovery/compensation** when prevention cannot guarantee success.

This is not a rigid hierarchy. Security, legal requirements, concurrency, external side effects, expert workflows, and domain constraints can change the correct choice.

## Prevent invalid state before explaining it

If the application can know that a state is impossible, prefer preventing or constraining it over accepting it and later displaying an error. Examples include mutually exclusive choices, bounded ranges, unavailable dates, permission-gated actions, and impossible transitions.

But constraints can become harmful when they hide *why* something is unavailable or when validity depends on information the UI does not yet possess. A disabled action with no explanation can be less recoverable than an enabled action that returns a precise, actionable error.

**Agent rule:** do not disable merely to make the interface look safe. If users may reasonably ask “why can't I do this?”, expose the reason near the blocked capability or provide a discoverable explanation.

## Validation is detection, not prevention

Validation answers “is this acceptable?” after or while the user supplies a value. It does not necessarily prevent the cognitive error that produced the value.

Separate:
- **format/syntax errors** — malformed email, invalid date representation;
- **constraint errors** — value outside an allowed range;
- **cross-field errors** — end date before start date;
- **business-rule errors** — unavailable inventory, permission conflict;
- **semantic errors** — syntactically valid but wrong account/date/recipient;
- **concurrency errors** — value was valid but became stale before commit.

Inline validation is useful when feedback is trustworthy and can help before submission. Avoid noisy validation on every keystroke when an incomplete intermediate value is expected. Preserve entered values after errors.

When the system knows a correction, suggest it rather than only announcing failure. W3C WCAG 2.x explicitly distinguishes error identification from error suggestion.

## Serious commitments: reversible, checked, or reviewed

For legal commitments, financial transactions, modifications/deletions of user-controlled stored data, and test submissions, WCAG 2.2 SC 3.3.4 requires at least one of three protections: the submission is reversible; input is checked and can be corrected; or users can review, confirm, and correct before finalizing.

This is a useful design model beyond minimum conformance: **reversal, checking, and review are alternative safety mechanisms**, not reasons to stack every possible warning onto the flow.

A review step is especially valuable for semantic mistakes that validation cannot detect: a valid but unintended recipient, amount, shipping address, account, scope, or destructive target.

## Reversibility often beats interruption

When an action can genuinely be reversed, visible Undo can preserve flow better than repeatedly asking “Are you sure?”. W3C's form-validation guidance explicitly recommends undo where possible and gives trash, delayed-send, and cancellable-purchase examples.

Do not promise Undo when the underlying side effect is already irreversible or only partially compensatable. Distinguish:
- **cancel before commit**;
- **rollback of a committed reversible change**;
- **compensating action** that creates a new state;
- **manual recovery** when neither is guaranteed.

The UI language must match the real guarantee.

## Confirmation is a last-mile guard, not a universal safety layer

Use confirmation when a meaningful residual risk remains after better mechanisms, especially for high-consequence or hard-to-reverse actions. Confirmation should expose the decision-critical facts: target, scope, consequence, and relevant irreversibility.

Do not use generic confirmation for frequent, low-risk, easily reversible actions. Repetition creates interruption without necessarily increasing understanding.

Typed or hold-to-confirm interactions prove a narrow kind of deliberate action, not comprehension. Use them only when their added friction addresses a demonstrated error mode.

## Recovery quality

A good error state answers:
- what failed;
- what did and did not change;
- whether entered/worked-on data is preserved;
- what the user can do next;
- whether retry is safe;
- whether the failure may resolve without user action.

For partial operations, report succeeded / failed / skipped subsets rather than collapsing the entire operation into “failed”. Retry only the failed subset when the operation semantics permit it.

For network or server failures, never imply that an action definitely failed if commit status is unknown. Use idempotency or server reconciliation where duplicate side effects matter.

## Forgiving interaction

Forgiveness is broader than Undo. Useful techniques include drafts, autosave with visible persistence state, trash/soft delete, grace periods, restoring prior versions, preserving form input, safe retries, cancelable background jobs, and reversible previews.

The correct mechanism depends on the cost of retaining state and the consequences of stale or sensitive data. Do not preserve sensitive information indefinitely merely to make recovery convenient.

## Accessibility boundaries

Errors that are automatically detected must be identified and described in text under WCAG 2.x SC 3.3.1. When correction suggestions are known, SC 3.3.3 requires suggestions at Level AA unless that would jeopardize security or purpose.

Do not communicate error solely through color. Associate field-level errors with the relevant control, provide an error summary for larger forms when useful, and manage focus intentionally rather than moving it for every validation event.

Preserving work is also an accessibility issue: W3C's timeout guidance emphasizes avoiding unexpected data loss for users who need more time.

## Failure modes

- **Error-message architecture:** allow invalid states everywhere, then compensate with copy.
- **Disabled-without-reason:** prevention removes the path but also removes comprehension.
- **Premature validation:** an incomplete value is treated as wrong while the user is still typing.
- **Success amnesia:** failed submission clears valid data or resets context.
- **Confirmation wallpaper:** every destructive-looking action gets the same modal.
- **Fake Undo:** UI says Undo although external effects cannot be reliably reversed.
- **Retry duplication:** uncertain commit status plus naive retry creates duplicate side effects.
- **Overconstraint:** valid expert or edge-case workflows become impossible because the UI encoded an incomplete business rule.
- **Silent correction:** the system changes user input without exposing what changed.

## Agent decision checklist

Before adding an error message or confirmation, ask:

1. Can the error opportunity be removed safely?
2. Can valid choices be constrained without hiding legitimate cases?
3. Is this a syntax/constraint problem or a semantic decision problem?
4. Can the system detect the error reliably before commitment?
5. Can the user review the facts that validation cannot understand?
6. Is the action genuinely reversible?
7. What is the consequence if prevention fails?
8. What state must be preserved for recovery?
9. Could retry duplicate a side effect?
10. Does added friction address a known error mode or merely signal caution?

## Evidence boundary

W3C/WCAG provides normative accessibility requirements and informative techniques for identification, suggestions, review, reversibility, and preserving data. Nielsen Norman Group's usability heuristics independently support user control, exits, Undo, and error prevention as general usability principles. These sources support the architecture above, but they do **not** establish universal thresholds for when to use inline validation, confirmation, Undo duration, or particular friction levels. Those remain domain- and risk-dependent and should be validated with product evidence where consequences are material.

## Sources

- W3C WAI, WCAG 2.2 — Guideline 3.3 / Error Prevention (Legal, Financial, Data): https://www.w3.org/WAI/WCAG22/Understanding/
- W3C WAI, Validating Input tutorial: https://www.w3.org/WAI/tutorials/forms/validation/
- W3C WAI, Understanding Timeouts: https://www.w3.org/WAI/WCAG22/Understanding/timeouts.html
- Nielsen Norman Group, 10 Usability Heuristics: https://www.nngroup.com/articles/ten-usability-heuristics/

## Maturity

Operational foundation. Strong standards support exists for important boundaries, but comparative outcome evidence across domains remains limited. Revisit with empirical evidence on prevention vs validation vs review/undo, especially for high-frequency expert workflows and consequential transactions.
