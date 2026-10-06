# Onboarding, settings and authentication

The lifecycle flows around the core task: getting to first value, configuring the product, and
getting (back) in.

## Quick rules

1. Onboarding is the **smallest intervention** that moves users from unoriented → first value →
   independent. Not a tour.
2. Prefer learning in the real task: understandable UI → empty states → contextual hints →
   checklists/setup for real prerequisites → tours only for distributed, unfamiliar workflows.
3. Delay friction, not truth: postpone account creation and setup until needed; never postpone
   price, eligibility, permissions or consequences.
4. Exposure ≠ mastery: `shown` is not `understood`; dismissal is information, not permission to nag.
5. Settings are a state model: scope, source (local/inherited/default/enforced), commit model,
   reversibility — define before rendering controls.
6. Show the **effective** value and why; "Reset" names its destination; returning to inheritance
   removes the override instead of copying today's parent value.
7. Accounts only when persistence, return access, collaboration or protected data require them;
   authentication strength proportional to risk; recovery is part of security.
8. Preserve task state across sign-in, session expiry and step-up authentication.

## Onboarding

**Start from the activation gap:** missing data/setup · unfamiliar concept · undiscovered required
capability · lack of confidence about consequences · permission/integration prerequisite · or no
gap (then add nothing).

| Surface | Job | Trigger | Stop |
|---|---|---|---|
| Start/orientation | what the product does, whether it fits | before commitment when suitability is unclear | user can decide |
| Setup | real prerequisites for value | a prerequisite blocks the first task | minimum viable configuration exists |
| Empty-state guidance | turn absence into the next action | user reaches an empty working surface | first object exists |
| Contextual hint | explain a capability when relevant | relevant UI + plausible need | acted, dismissed, or demonstrated |
| Spotlight | point at one unfamiliar important control | important new/non-obvious capability | understood or dismissed |
| Tour | short connected workflow not learnable locally | several unfamiliar connected steps | user can execute the workflow |
| Checklist | several independent activation tasks across sessions | value needs multiple setups | done or irrelevant |
| Reference help | recall/uncommon complexity | user asks | need resolved |

A tooltip doesn't replace labels; a tour doesn't replace coherent navigation; a checklist doesn't
replace a UI that exposes the next action.

**Empty states** are durable onboarding: what lives here, why it's empty if non-obvious, the
primary next action, optionally a compact example. Not marketing; disappears with real content;
don't repeat illustrations across a dashboard. Sample data must be unmistakably sample.

**Tours** only when knowledge is needed soon, elements are distributed, users can understand
before doing, it's skippable and resumable, and it can be maintained. One actionable relationship
per step, anchored to the real UI; no screenshot-within-screen drift; overlays obey modal focus rules.

**Checklists:** outcomes ("Connect a data source"), not tourism ("Visit Settings"); verifiable
items; no fixed order for independent tasks; retire after activation.

**New-feature education** for existing users: local signal near the capability or a changelog;
spotlight only for important workflow changes; no login hijacks, no feature-launch harassment.

**State:** `not_relevant · eligible · shown · dismissed · acted · demonstrated ·
stale_after_major_change`; scope (local, account, workspace, role) — an admin finishing setup
doesn't mean members understand it.

**Measure** value, not completion theater: time/steps to first meaningful outcome, abandonment at
gates, setup errors, independent reuse, later discovery, help demand; skip-then-succeed means the
guidance wasn't needed; segment new/returning/invited/admin/expert.

Audit checklist: Can a new user reach first value without reading anything? What does each empty
state say and offer? Is an account/permission/integration demanded before value is visible? Can
returning/expert users avoid beginner guidance? Are tours skippable, keyboard-operable, focus-safe,
anchored to elements that exist at all breakpoints? Is consequential information hidden behind
"progressive" onboarding?

Failure modes: front-loaded classroom · tour over broken IA · premature commitment · hidden
consequential info · celebration without value (confetti for setup) · onboarding amnesia (repeat
or suppress forever) · feature-launch harassment · screenshot drift · multiple competing onboarding systems.

## Settings and preferences

**Before adding a setting:** could a strong default or a contextual control make it unnecessary?
A setting is often compensation for a product decision the system could make safely. Task-specific
options belong in the task; Settings holds broader, infrequent preferences.

**Resolved configuration model:**
`key → type → scope → authority → inherited/default source → override policy → effective value →
effect timing → reversibility`, e.g. `effective = enforced policy ?? local override ?? inherited
parent ?? product/system default` (precedence is product-specific but must be deterministic and inspectable).

- **Scope cues:** users must know whether a change affects me, this object or everyone in the
  workspace. Personal display choices must not mutate shared state; security/retention/access
  policies must not look like personal preferences.
- **Effective state:** what's in effect now, why, can I change it here, what will it affect. Show
  "Inherited from organization" / "Enforced by workspace policy".
- **Reset semantics:** "Use organization setting" (remove override), "Use system setting",
  "Restore defaults", "Discard changes" — not a bare "Reset".
- **Commit model:** immediate for small, independent, observable, reversible changes (toggles mean
  immediate); explicit Save/Discard for coherent sets, cross-field validation, costly or external
  side effects. Don't mix silently on one surface. Dirty state: `persisted → dirty → saving → saved`
  + `save_failed`, guard navigation only when dirty, preserve values on failure.
- **Effect timing:** restart/reload/re-auth/future-resources-only stated next to the control;
  changing a parent default — does it affect existing children or only new ones?
- **Unavailable settings:** distinguish no permission · enforced upstream · plan/platform · temporary
  system state — each with its recovery path; don't reveal privileged values.
- **Controls follow behaviour:** switch = immediate binary; checkbox = independent selection in a
  form; radio = small exclusive set; select = long lists (last resort in public services); button =
  launches a workflow. Don't preselect risky payment/privacy/security options.
- **System-following preferences** (theme "System") are durable choices, not a copy of today's OS
  value; say whether a preference is device-local or account-synced.
- **Migrations:** never overwrite explicit choices when product defaults change.
- **IA:** organize by user concerns, not services/teams; settings search lands on the canonical
  setting with its scope.

Failure modes: settings landfill · invisible scope · fake autosave · mixed commit boundary ·
inheritance destruction (saving materializes inherited values) · ambiguous reset · policy mystery
(disabled without reason) · configuration as onboarding · redundant system preference · dependency maze.

## Authentication and account entry

- **Is an account necessary?** Let users do one-off tasks without one; let them reach value before
  the gate when an account is eventually required.
- Separate **identification**, **authentication**, **identity proofing** and **authorization**;
  raise assurance at the point consequence rises (step-up), not everywhere.
- Passwords and typed OTP/SMS codes are not phishing-resistant; WebAuthn/passkeys can be (NIST
  SP 800-63B-4; WebAuthn L3 is a W3C Recommendation as of 2026-08). Passkeys need full journeys:
  enrollment, cross-device, multiple accounts, device loss, recovery, fallback without silent downgrade.
- **Entry UX names the task:** create account vs sign in vs recover vs prove identity; "Continue"
  must not silently switch between them.
- **Interruptions:** preserve progress and destination; return to the initiating context; session
  expiry is an access state, not a generic error; step-up resumes the protected action.
- **Recovery is an alternate authentication ceremony:** compare each route with normal sign-in —
  the cheapest attack path is the real boundary; no security questions on public facts; redundancy
  before loss (multiple authenticators, recovery codes explained and revocable); post-recovery
  containment (notify, show changes, revoke sessions/authenticators, report path). Email/phone/
  recovery-contact changes are recovery events. Support recovery needs a protocol.
- **Federated identity/linking:** identity = issuer + stable subject, not email; same email is a
  hint, not proof — link only after proving control of both sides; canonical product account
  separate from login identities; enterprise membership from authoritative claims and revalidated;
  unlinking must not remove the last viable sign-in.
- **Errors and privacy:** fixable vs invalid vs unavailable without leaking account existence
  unnecessarily; humane rate limits; keep identifiers after failures; no dead-end "contact support".
- **Accessibility:** password managers, paste, autofill (`autocomplete`), platform authenticators
  must work; no cognitive-function tests without alternatives (WCAG 3.3.8); no CAPTCHA by default.

Failure modes: registration before it's needed · conflating auth with identity proofing · OTP as
"secure enough" without considering phishing and recovery · passkeys as a button without journeys ·
password re-auth in a passwordless model · recovery weaker than sign-in · contact change as ordinary
profile edit · improvised support recovery · arbitrary recovery delays · task state lost on expiry ·
uniform high friction for low-risk actions · custom inputs that break password managers.

## Evidence boundary

Carbon (empty states), GOV.UK (start pages, suitability, accounts, step-by-step), Atlassian
(spotlight, onboarding, radio defaults), Apple (contextual settings, strong defaults), Shopify (save
bar), GitHub (scoped permissions), NIST SP 800-63B-4, W3C WebAuthn, OpenID Connect and Auth0
documentation. No universal tour length, checklist size, time-to-value threshold or settings
precedence is established.
