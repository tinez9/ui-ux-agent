# Settings and Preference Architecture

Settings UX is primarily a **scope, authority, and inheritance problem**, not a form-layout problem. Before choosing controls, define who owns a value, what it affects, where its default comes from, whether it can be overridden, and when a change takes effect.

## Model settings as resolved configuration

For every setting, define:

`key → value/type → scope → authority → inherited/default source → override policy → effective value → effect timing → reversibility`

Common scopes are not interchangeable:
- **personal/account** — follows a person across contexts;
- **organization/workspace** — shared policy or default for a collaborative space;
- **project/repository/object** — configuration local to one resource;
- **device/session/view** — ephemeral or presentation state that should not silently become shared policy.

Do not expose backend storage boundaries as the conceptual model. Name scope in terms users understand.

## Distinguish defaults, inheritance, overrides, and enforcement

A default is a starting or fallback value. An inherited value is resolved from a parent scope. An override replaces that value at a narrower scope. An enforced policy prevents a narrower scope from choosing freely.

These states need different UX. A disabled control with no explanation is insufficient when a parent policy owns the value. Show the effective value and, where useful, its source: for example, “Inherited from organization” or “Enforced by workspace policy.” Provide a route to the controlling scope only when the user can meaningfully access it.

GitHub provides a useful shipped example rather than a universal template: organization-level base permissions can apply broadly while repository-specific access can grant higher access, and organization/enterprise policies can constrain repository-level configuration. This demonstrates why a settings surface must represent both local controls and upstream authority instead of pretending every visible value is locally owned.

## Separate personal preference from shared configuration

Ask whether changing a value should affect **me**, **this object**, or **everyone in this scope**. If more than one answer is legitimate, make the target explicit before commitment or provide deliberately separate controls.

Personal display choices such as density or theme should not accidentally mutate shared workspace state. Conversely, security, retention, access, automation, or data-governance policy should not be presented as a harmless personal preference.

Avoid labels such as “Settings” as the only scope cue when multiple scopes coexist. Use page context, headings, breadcrumbs, object identity, or concise scope text so users can predict blast radius.

## Show effective state, not only stored state

In inherited systems, the locally stored value may be absent while the product still has an effective value. The UI should answer:
1. What is in effect now?
2. Why is that value in effect?
3. Can I change it here?
4. What will changing it affect?

Do not force users to mentally evaluate a precedence chain. Resolve it for them.

A useful internal model is:

`effective = nearest permitted override ?? inherited value ?? product default`

Real systems may have more complex precedence; if so, document and test that precedence explicitly rather than relying on visual nesting to explain it.

## Reset semantics must name the destination

“Reset” is ambiguous in layered configuration. It may mean:
- restore the product default;
- remove the local override and resume inheritance;
- restore the administrator-defined default;
- discard unsaved edits;
- reset every setting in a section.

Prefer action language that describes the resulting state: “Use organization setting,” “Restore default,” or “Discard changes.” Before destructive broad resets, make scope and affected values inspectable.

## Choose save behavior from consequence

Immediate persistence fits low-risk, independently reversible preferences when the changed result is obvious. Explicit Save/Apply is better when several fields form one coherent configuration, validation is cross-field, changes have costly side effects, or users need to review a set before commitment.

Do not mix auto-save and explicit-save semantics unpredictably within the same conceptual group. If some changes require restart, reload, reauthentication, deployment, or affect future resources only, state that next to the control before the user commits.

## Defaults are product decisions

A default can affect every user who never visits settings. Treat defaults as part of product behavior, not neutral implementation values.

For consequential defaults:
- choose deliberately from safety, common intent, compatibility, and reversibility;
- distinguish defaults for new resources from retroactive policy changes;
- state when changing a parent default affects existing children versus only future ones;
- avoid using a default to disguise an irreversible or high-risk opt-in.

## Permissions and unavailable settings

When a user cannot modify a setting, distinguish:
- lacks permission;
- setting is enforced upstream;
- capability is unavailable on the current plan/platform/resource;
- setting is temporarily unavailable because of system state.

These causes imply different recovery paths. Do not collapse them into a generic disabled control.

For sensitive settings, read access itself may need restriction. Never reveal secrets or privileged configuration merely to explain why a control is unavailable.

## Failure modes

- A workspace setting and a personal preference share the same label with no scope cue.
- A child override survives after a parent changes, but the UI makes the parent change appear universal.
- “Reset” unexpectedly restores factory defaults when the user expected inheritance.
- A disabled control gives no explanation of the policy or permission that owns it.
- A local value is displayed even though an upstream enforced value is actually effective.
- Changing a default silently mutates existing objects when users expected it to affect only new ones, or vice versa.
- Auto-save triggers expensive or externally visible side effects on every intermediate edit.
- Settings are organized by internal service/team ownership rather than user-recognizable concerns.
- Search finds a setting but drops the user into a page without scope/context, increasing wrong-scope edits.

## Agent contract

Before implementing a settings surface, answer:
1. What scopes exist and which one owns each value?
2. What is the precedence/inheritance rule?
3. Is the current value local, inherited, defaulted, or enforced?
4. Who may read and who may change it?
5. What exact blast radius does a change have?
6. Does it affect existing state, future state, or both?
7. When does it take effect?
8. Can it be reversed, and what does reset mean?
9. Is immediate persistence safer than an explicit commit?
10. Can the UI explain the effective value without exposing implementation internals or privileged data?

## Implementation checks

Test nested scopes, missing local values, parent changes, stale concurrent edits, permission changes while the page is open, deep links from settings search, unsaved navigation, failed saves, partial multi-setting saves, rollback, localization, keyboard/screen-reader operation, narrow layouts, audit/history requirements, and old clients encountering newly introduced settings.

Where configuration is collaborative, consider optimistic-concurrency/version checks for consequential edits. Never silently overwrite a newer administrator change merely because the settings page was opened earlier.

## Evidence boundary

GitHub's current documentation provides concrete production evidence for layered organization/repository configuration, base permissions, repository overrides, and organization/enterprise constraints. It demonstrates the need to model scope, inheritance, override, and authority, but GitHub's exact precedence rules are product-specific and should not be copied blindly. General guidance above is an agent synthesis from those mechanics plus established principles of visibility, predictability, error prevention, and user control; this cycle did not find strong controlled evidence proving one settings information architecture or save model universally superior.
