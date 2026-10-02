# Authentication and account-entry UX

Authentication is a **risk-shaped access system**, not a login-form styling problem. Design the journey around what the service actually needs to know, the consequence of being wrong, and the user's ability to recover.

## Start by asking whether an account is necessary

Do not require an account merely because the product has users. Accounts add abandonment risk, credential lifecycle, recovery, privacy, support, and security obligations.

Prefer no account when a one-off task can be completed safely without persistent identity. Delay account creation until persistence, return access, collaboration, protected personal data, or another real capability requires it. If an account is eventually required, let users reach useful context or progress before gating when the domain permits.

Separate four questions that products often collapse:
1. **Identification:** which account is this?
2. **Authentication:** does the claimant control an accepted authenticator for that account?
3. **Identity proofing:** is this account tied to the real-world person/entity the product needs?
4. **Authorization:** what may this authenticated account do?

Do not demand stronger identity proof merely to make ordinary authentication feel safer. Assurance can increase at the point where the consequence increases.

## Match authentication strength to risk

Use a risk/assurance model rather than adding friction uniformly. Consider data sensitivity, transaction consequence, privilege, device/session context, attack model, recoverability, and regulatory constraints.

NIST SP 800-63B-4 (2025) distinguishes authentication assurance levels and explicitly varies reauthentication and phishing-resistance requirements by assurance. Treat its exact thresholds as requirements for systems in its scope or as a security reference elsewhere—not as universal consumer-product defaults.

A useful product rule:
- ordinary low-risk access should not repeatedly prove more than necessary;
- elevated-risk actions can trigger step-up/re-authentication near the consequential action;
- privileged/high-impact access should prefer phishing-resistant authenticators and stronger session controls.

**Security friction is justified by mitigated risk, not by how “secure” the UI looks.**

## Prefer phishing-resistant authentication where appropriate

Passwords are not phishing-resistant. Manually entered OTP/out-of-band codes are also not phishing-resistant because an attacker can relay them. NIST identifies cryptographic authentication such as WebAuthn as the mechanism class that can provide phishing resistance through verifier binding.

Passkeys/WebAuthn can therefore improve both security architecture and entry UX, but “passwordless” is not itself a complete journey. Agents must design enrollment, familiar-device sign-in, cross-device sign-in, multiple accounts, authenticator/device loss, recovery and replacement, fallback without silent security downgrade, and explicit account identity before consequential actions when ambiguity remains.

**Current standards status (2026-10):** WebAuthn Level 3 became a W3C Recommendation on 2026-08-25. Level 4 is a First Public Working Draft published 2026-09-15. Treat Level 3 as the current Recommendation baseline and Level 4 additions as emerging until implementation/support evidence justifies production assumptions.

## Entry UX should communicate the task, not the mechanism

Keep **create account**, **sign in**, **recover access**, and **prove identity** conceptually distinct. Users should know which task they are performing and why a stronger check appears.

Avoid ambiguous entry screens where “Continue” silently switches among account creation, login, linking, and identity proofing without explaining the consequence. Federated sign-in can simplify credential handling, but account-linking and duplicate-account behavior still need explicit product semantics.

When authentication interrupts an in-progress task, preserve safe progress and intended destination, return to the initiating context after success, explain session expiry as an access state rather than generic failure, and avoid making users reconstruct filters, form data, selections, or navigation unnecessarily.

## Reauthentication is different from signing in from scratch

Reauthentication should establish sufficient fresh assurance for the next action while preserving context. Do not automatically throw users to a generic home/login journey.

Use step-up authentication when the current session is valid for ordinary use but insufficient for a consequential operation. Explain the protected action in user language. After successful reauthentication, resume that action rather than requiring rediscovery.

Do not ask for the current password merely as a ritual when the account may not even use a password. Define reauthentication in terms of an accepted authenticator and required assurance.

## Recovery is an alternate authentication ceremony

A strong primary authenticator with a weak recovery path produces a weak account system. Treat recovery as an alternate way to regain account authority, with its own threat model—not as a customer-support exception.

NIST SP 800-63B-4 recognizes structured recovery mechanisms including saved recovery codes, issued recovery codes, recovery contacts, repeated identity proofing, and risk-analysed application-specific methods. This is useful as a taxonomy, not a universal requirement for every product.

### Design recovery against the cheapest attack path

For each recovery route, ask what an attacker needs compared with normal sign-in. If obtaining control of email, persuading support, intercepting a weak code, or knowing public personal facts is easier than defeating the primary authenticator, recovery has become the effective security boundary.

Do not use security questions based on discoverable personal facts. Do not add a weaker fallback merely so every failure has an immediate path. For high-consequence accounts, inability to recover instantly can be safer than an attacker-friendly bypass; recovery friction should be proportional to account consequence.

### Prefer redundancy before emergency recovery

Reduce lockout risk before failure occurs. Where appropriate, let users register multiple independent authenticators or passkeys and make authenticator management understandable. Syncable passkeys can reduce single-device loss risk because credentials may become available on replacement devices through the credential provider; that convenience is not equivalent to application-level recovery and depends on the user's credential-provider account and ecosystem.

Offer recovery codes only when the product can explain storage and lifecycle clearly. Codes should be generated as recovery credentials, shown deliberately, replaceable/revocable, and treated as secrets. Do not repeatedly expose them in ordinary settings.

### Recovery must have post-recovery containment

A successful recovery is not merely “login succeeded.” Define what happens next:
- notify through trustworthy pre-existing channels when appropriate;
- expose what recovery/authenticator change occurred;
- allow revocation of lost authenticators and suspicious sessions;
- decide whether sensitive actions require a cooling-off period or fresh stronger authentication based on risk;
- avoid silently changing unrelated recovery factors;
- provide a path to report an unauthorized recovery.

A delay is useful only when it creates a real detection/intervention window. Do not add arbitrary waiting as security theatre.

### Contact changes are recovery events in disguise

Changing the email address, phone number, recovery contact, federated identity link, or other recovery factor can transfer future account control. Protect these mutations at least as carefully as the recovery capability they enable. A currently authenticated session is not always sufficient evidence for a high-impact recovery-factor change; consider fresh authentication and out-of-band notification to the old factor where the threat model warrants it.

### Support-assisted recovery needs a protocol

“Contact support” is not a security design. If staff can restore access, define what evidence they may accept, what they may never request, how exceptions are audited, what privileges are temporarily constrained, and how social-engineering pressure is handled. Avoid ad-hoc agent discretion for high-impact accounts.

### Federated accounts need explicit ownership semantics

For accounts created through an identity provider, decide what happens if that provider account disappears, changes address, or becomes inaccessible. Do not silently create a local-password recovery route that weakens the original model. Account linking/unlinking can change who controls the product account and therefore deserves explicit authentication and recovery semantics.

For every authenticator or recovery factor, define loss/unavailability behavior, evidence required to regain control, temporary assurance/privilege changes, notifications, revocation, and escalation when the normal path cannot be completed.

## Session UX

A session is user-visible product state even when tokens are not. Design explicitly for expiry, remote revocation, privilege/membership changes, multiple tabs/windows, sensitive operations requiring fresh authentication, shared/public devices, and sign-out scope where relevant.

Warn before expiry only when the warning enables meaningful action and policy permits extension. Preserve unsent local work when safe. Never imply that closing a tab equals server-side sign-out.

## Error and privacy behavior

Authentication errors should enable recovery without leaking unnecessary account information.

- Distinguish fixable input problems from invalid/expired credentials and unavailable services when safe to expose.
- Rate limits and abuse controls need humane recovery paths; do not use CAPTCHA by default as a generic security layer.
- Do not clear identifiers or non-secret progress unnecessarily after a failed attempt.
- Avoid dead ends such as “contact support” without a viable protocol.
- Ensure password managers, paste, autofill, platform authenticators, and accessibility APIs can work; do not fight them with custom controls.

## Authentication contract for agents

Before implementing account entry, answer:
1. Why is an account required here, and can the gate be delayed or removed?
2. Is the requirement authentication, identity proofing, authorization, or a combination?
3. What consequence determines required assurance?
4. Which authenticator is primary, and is phishing resistance required?
5. What happens on a new/lost/shared device?
6. What are **all** recovery routes, and which is cheapest for an attacker to exploit?
7. Can users establish redundancy before loss, and can they revoke lost authenticators afterward?
8. Which changes (email/phone/IdP/recovery contact) transfer future account control, and how are they protected/notified?
9. When does the session expire or require step-up, and what task state survives interruption?
10. Have keyboard, screen-reader, autofill/password-manager, passkey, localization, rate-limit, service-failure, multiple-account, federated, lost-device, and support-assisted recovery paths been tested?

## Failure modes

- requiring registration before persistence is needed;
- conflating authentication with real-world identity proof;
- adding OTP because “2FA feels secure” while ignoring phishing resistance and recovery;
- shipping passkeys as a button without loss/cross-device/account-selection journeys;
- requiring a password for reauthentication in a passwordless model;
- making email, SMS, or support recovery materially easier to attack than normal sign-in;
- treating a recovery-factor/contact change as an ordinary profile edit;
- relying on one device/passkey and only designing recovery after loss;
- allowing support staff to improvise high-impact recovery evidence;
- adding arbitrary recovery delays that provide no detection/intervention opportunity;
- destroying task state on session expiry;
- repeated high-friction authentication for low-risk actions instead of risk-shaped step-up;
- custom inputs that break password managers, paste, autofill, or platform authenticators.

## Evidence boundary

NIST SP 800-63B-4 (published 2025-08-01) is authoritative security guidance for authentication/authenticator management in its scope and provides a useful recovery-method taxonomy; its assurance levels and exact requirements are not universal consumer-product defaults. W3C WebAuthn Level 3 is a Recommendation as of 2026-08-25 and establishes the web platform public-key authentication model; it does not define an application's account-recovery policy or prove a particular passkey UX best. Google's passkey documentation demonstrates one major ecosystem's sync and cross-device model; do not generalize its exact behavior to every credential provider. Product rules above about cooling-off periods, notifications, support protocols, and factor-change protection are risk-based synthesis and must be calibrated to the product threat model.

## Primary sources reviewed

- NIST SP 800-63B-4 — Authentication and Authenticator Management (2025-08-01): https://pages.nist.gov/800-63-4/sp800-63b.html
- NIST authentication assurance levels: https://pages.nist.gov/800-63-4/sp800-63b/aal/
- W3C — WebAuthn Level 3 became Recommendation (2026-08-25): https://www.w3.org/news/2026/web-authentication-an-api-for-accessing-public-key-credentials-level-3-is-now-a-w3c-recommendation/
- W3C — WebAuthn Level 4 First Public Working Draft (2026-09-15): https://www.w3.org/news/2026/first-public-working-draft-web-authentication-an-api-for-accessing-public-key-credentials-level-4/
- Google for Developers — Passkeys: https://developers.google.com/identity/passkeys
- GOV.UK Design System — Create accounts: https://design-system.service.gov.uk/patterns/create-accounts/
- GOV.UK Service Manual — Checking users' identities: https://www.gov.uk/service-manual/design/checking-users-identities
