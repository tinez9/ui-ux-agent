# Settings and preference architecture

Settings are not a dumping ground for every adjustable value. They are a state-management and mental-model problem: users need to know **what a value affects, who/what owns it, when it takes effect, whether it was saved, and how to recover the effective value**.

## Core decision model

Before adding a setting, classify it on four axes:

1. **Scope** — current task/view, object/project, user/account, workspace/organization, device, or system.
2. **Source** — explicit local value, inherited value, system value, product default, or policy-enforced value.
3. **Commit model** — immediate/autosaved, staged then explicitly saved, or requires a separate apply/restart/reload step.
4. **Reversibility** — trivially reversible, disruptive, consequential, or policy constrained.

Do not expose a setting until these are defined. Many confusing settings screens are actually ambiguous state models rendered as controls.

## Put controls where their effect lives

Prefer task-specific controls in the task itself when people are likely to change them while working. Reserve a settings area for broader, relatively infrequent preferences. Apple explicitly recommends contextual placement for task-specific options and warns that moving them into Settings disconnects the option from its effect. It also recommends minimizing settings and choosing defaults that let most people start without configuration.

Respect system-level preferences rather than duplicating them unless the product has a genuine, clearly scoped reason to override them. A product-specific duplicate of a system preference creates ambiguity about which value wins.

## Autosave versus explicit Save

Neither model is universally superior.

### Prefer immediate/autosave when
- each change is small, local, independently valid, and cheap to reverse;
- the effect is easy to observe;
- partial intermediate states are safe;
- there is no expectation that several fields form one atomic configuration;
- persistence can be acknowledged reliably.

Show saving/error state when persistence is asynchronous. Do not display a successful state before durable persistence is known.

### Prefer explicit Save/Discard when
- several edits form one conceptual transaction;
- intermediate combinations can be invalid or externally consequential;
- users benefit from reviewing a set of changes before commitment;
- saving triggers expensive work, external effects, publication, permissions, billing, deployment, or other meaningful consequences;
- the surrounding product has a strong established save model.

Shopify's current Admin guidance is a useful production example: forms use a contextual save bar rather than continuous autosave because autosave is inconsistent with the Admin's established save UX. The current Save Bar API tracks dirty state, offers Save/Discard, and can guard navigation. Shopify also specifies that failed persistence must keep the dirty state and user values rather than falsely clearing them.

### Do not mix commit semantics silently

A page where some controls autosave while adjacent controls wait for a page-level Save is dangerous unless the distinction is unmistakable. Users naturally infer one commit boundary from one editing surface. If mixed semantics are necessary, visually and structurally separate the scopes and label the behavior.

## Dirty state is a first-class state

For staged settings, model at least:

`persisted -> dirty -> saving -> saved`

with branches for `save_failed`, `discarded`, and navigation while dirty.

Dirty state means the editable representation differs from the last confirmed persisted baseline. Do not clear it merely because a request was sent. On save failure, preserve values, errors, and retry capability. When navigation can lose changes, guard navigation while dirty; do not prompt when nothing is dirty.

A global Save action should have a defined transaction scope. Shopify's mature pattern explicitly recommends one save operation for the page rather than several simultaneously editable independent forms; independently editable sections should have their own clear edit boundary.

## Defaults are product decisions

A default should represent the safest/useful starting behavior for the intended population, not simply the easiest implementation value. Prefer detecting information the system already knows instead of asking users to configure it. Apple explicitly recommends strong defaults and avoiding setup questions that can be inferred from device/context.

When changing a default in a later release, distinguish:
- **new-default migration** — existing users adopt the new default;
- **grandfathering** — existing effective behavior remains;
- **explicit-value preservation** — only users who never chose a value inherit the new default.

Do not overwrite an explicit user choice merely because the product default changed.

## Inheritance and overrides

Multi-scope products need an explicit effective-value model. A useful conceptual form is:

`effective = enforced policy ?? local explicit override ?? inherited parent ?? product/system default`

The exact precedence is product-specific, but it must be deterministic and inspectable.

For an inherited setting, expose enough provenance to answer:
- What is the effective value now?
- Is it inherited, explicitly overridden, or enforced?
- Where does the inherited value come from?
- Can this scope override it?
- What will Reset do?

Avoid copying an inherited value into a local explicit value merely because the user opened or saved a form. That destroys future inheritance without an intentional decision.

### Reset semantics

“Reset” is ambiguous in a layered system. Prefer specific operations such as:
- **Use workspace setting** — remove the local override;
- **Use system setting** — resume following the platform value;
- **Restore product defaults** — deliberately discard explicit customization.

Removing an override and writing the parent's current value are not equivalent: the latter stops following future parent changes.

## Dependency visibility

If setting B only matters when A is enabled, represent that relationship near the controls. Disable/hide conditionally only when the consequence remains understandable; unexplained disappearing options make the state model harder to learn.

For enforced policies, do not merely disable a control. Explain that it is controlled elsewhere and identify the governing scope when useful. A disabled control without provenance looks broken.

## Information architecture

Group by user goal or affected behavior, not by implementation subsystem. Use stable categories for infrequently changed global preferences. Keep frequently adjusted task controls in context.

Search becomes valuable for large settings surfaces, but it does not repair a poor taxonomy. Search results should lead to the canonical setting and preserve category/context so users can build a mental model.

Minimize the number of exposed preferences. A setting is often compensation for a product decision the system could make safely itself.

## Accessibility and controls

Use native controls matching the value model: checkbox/switch for a boolean state where immediate toggling is appropriate, radio group for a small mutually exclusive set, select/combobox when option count or space justifies it. Do not use a switch merely to imply modernity.

Labels should describe the state/choice, while supporting text explains consequence or scope. Ensure validation and asynchronous save failures are programmatically available; persistence feedback should not depend only on color or transient toast visibility.

## Failure modes

- **Settings landfill:** every edge case becomes a preference instead of a product decision.
- **Invisible scope:** users cannot tell whether they changed this object, themselves, or the organization.
- **Fake autosave:** UI appears committed before persistence succeeds.
- **Mixed commit boundary:** adjacent controls have different save semantics without clear separation.
- **Inheritance destruction:** saving materializes inherited values as explicit overrides.
- **Ambiguous reset:** “default” could mean product, organization, system, or original value.
- **Policy mystery:** disabled controls provide no reason or provenance.
- **Configuration as onboarding:** users must understand internal concepts before they can use the product.
- **Redundant system preference:** app-level setting conflicts with an OS/platform preference.
- **Dependency maze:** enabling one option silently changes or invalidates several others.

## Agent implementation contract

Before implementing a settings surface, an AI coding/design agent should write down:

1. the scope and owner of every setting;
2. the precedence/inheritance rule;
3. whether the control is inherited, overridden, or enforced;
4. the commit boundary and save model;
5. dirty/saving/error/retry behavior;
6. navigation behavior with unsaved edits;
7. reset semantics;
8. dependencies between settings;
9. whether the option belongs in context instead of Settings;
10. whether a strong default can eliminate the setting entirely.

If those cannot be answered, the state model is not ready to render.

## Evidence boundary

Apple's Human Interface Guidelines support minimizing settings, choosing useful defaults, respecting system preferences, and keeping task-specific options in context. Shopify's current App Home/Save Bar documentation provides production evidence for explicit dirty-state Save/Discard workflows, navigation protection, and preserving dirty state after failed persistence. These establish strong design/implementation patterns, but they do **not** prove that autosave or explicit save universally performs better; commit semantics remain dependent on consequence, atomicity, task shape, and established product expectations.

## Sources

- Apple Human Interface Guidelines — Settings: https://developer.apple.com/design/human-interface-guidelines/settings (reviewed 2026-10-03)
- Shopify — Forms UX guidance: https://shopify.dev/docs/apps/design/user-experience/forms (reviewed 2026-10-03)
- Shopify — Save Bar API: https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api (reviewed 2026-10-03)
- Shopify — Migrate ContextualSaveBar: https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/contextual-save-bar (reviewed 2026-10-03)
