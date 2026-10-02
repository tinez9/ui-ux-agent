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

Passkeys/WebAuthn can therefore improve both security architecture and entry UX, but “passwordless” is not itself a complete journey. Agents must design:
- enrollment and discoverability;
- sign-in on a familiar device;
- cross-device sign-in;
- users with multiple accounts;
- authenticator/device loss;
- recovery and replacement;
- fallback without silently downgrading the security model;
- explicit account identity before a consequential action when ambiguity remains.

As of 2026-10, WebAuthn Level 3 has progressed through W3C Candidate Recommendation work and proposed advancement, while Level 4 is a First Public Working Draft (2026-09-15). Treat Level 4 capabilities as emerging until implementation/support evidence justifies production assumptions.

## Entry UX should communicate the task, not the mechanism

Keep **create account**, **sign in**, **recover access**, and **prove identity** conceptually distinct. Users should know which task they are performing and why a stronger check appears.

Avoid ambiguous entry screens where “Continue” silently switches among account creation, login, linking, and identity proofing without explaining the consequence. Federated sign-in can simplify credential handling, but account-linking and duplicate-account behavior still need explicit product semantics.

When authentication interrupts an in-progress task:
- preserve safe progress and intended destination;
- return the user to the initiating context after success;
- explain session expiry without presenting it as a generic application failure;
- avoid making the user reconstruct filters, form data, selections, or navigation unnecessarily.

## Reauthentication is different from signing in from scratch

Reauthentication should establish sufficient fresh assurance for the next action while preserving context. Do not automatically throw users to a generic home/login journey.

Use step-up authentication when the current session is valid for ordinary use but insufficient for a consequential operation. Explain the protected action in user language. After successful reauthentication, resume that action rather than requiring the user to rediscover it.

Do not ask for the current password merely as a ritual when the account may not even use a password. Define reauthentication in terms of an accepted authenticator and required assurance.

## Recovery is part of the security model

A strong primary authenticator with a weak recovery path produces a weak account system. Design recovery alongside enrollment, not after launch.

For every authenticator, define:
- what happens if it is lost or unavailable;
- what evidence can establish account control again;
- whether recovery changes assurance or privileges temporarily;
- notifications for sensitive recovery/authenticator changes;
- safe revocation of lost authenticators/sessions;
- support/escalation for users who cannot complete the normal path.

Do not create a fallback that attackers can choose simply because it is easier than the primary method. Avoid security questions based on discoverable personal facts. Recovery should not reveal whether sensitive accounts exist more precisely than the threat model allows.

## Session UX

A session is user-visible product state even when tokens are not.

Design explicitly for:
- expiry after inactivity or elapsed assurance windows;
- revocation from another device/admin action;
- privilege or membership changes during a session;
- multiple tabs/windows;
- sensitive operations that need fresh authentication;
- shared/public devices;
- sign-out scope (this session, device, or all sessions) where relevant.

Warn before expiry only when the warning enables a meaningful action and the security policy permits extension. Preserve unsent local work when safe. Never imply that closing a tab is equivalent to server-side sign-out.

## Error and privacy behavior

Authentication errors should enable recovery without leaking unnecessary account information.

- Distinguish fixable input problems from invalid/expired credentials and unavailable services when the distinction is safe to expose.
- Rate limits and abuse controls need humane recovery paths; do not use CAPTCHA by default as a generic security layer.
- Do not clear identifiers or non-secret progress unnecessarily after a failed attempt.
- Avoid dead ends such as “contact support” without a viable route.
- Ensure password managers, paste, autofill, platform authenticators, and accessibility APIs can work; do not fight them with custom controls.

## Authentication contract for agents

Before implementing account entry, answer:
1. Why is an account required at this point, and can the gate be delayed or removed?
2. Is the requirement authentication, identity proofing, authorization, or a combination?
3. What consequence determines the required assurance?
4. Which authenticator is primary, and is phishing resistance required?
5. What happens on a new/lost/shared device?
6. What is the recovery path, and is it weaker than the primary security model?
7. When does the session expire or require step-up authentication?
8. What task state and destination survive an auth interruption?
9. Can the user understand whether they are signing in, creating/linking an account, proving identity, or reauthenticating?
10. Have keyboard, screen-reader, autofill/password-manager, passkey, localization, rate-limit, offline/service-failure, multiple-account, and recovery paths been tested?

## Failure modes

- requiring registration before the product has demonstrated why persistence is needed;
- conflating authentication with real-world identity proof;
- adding OTP because “2FA feels secure” while ignoring phishing resistance and recovery;
- shipping passkeys as a button without device-loss/cross-device/account-selection journeys;
- requiring a password for reauthentication in a passwordless account model;
- making recovery materially easier to attack than normal sign-in;
- destroying task state on session expiry;
- repeated high-friction authentication for low-risk actions instead of risk-shaped step-up;
- treating CAPTCHA as a default human-verification UX;
- custom inputs that break password managers, paste, autofill, or platform authenticators;
- exposing technical session/token failures instead of a recoverable access state.

## Evidence boundary

NIST SP 800-63B-4 (published 2025-08-01) is authoritative security guidance for authentication assurance and establishes that passwords and manually entered OTP/out-of-band outputs are not phishing-resistant; its assurance levels and exact reauthentication windows are not universal product defaults. W3C WebAuthn specifications establish the web platform's public-key authentication model and standards maturity; they do not prove that any particular passkey onboarding UX is universally best. GOV.UK provides deployed service-design guidance to avoid unnecessary accounts, delay account creation when possible, distinguish authentication from identity assurance, and avoid CAPTCHA by default; these are strong design signals but should be adapted to product risk and population.

## Primary sources reviewed

- NIST SP 800-63B-4 — Authentication and Authenticator Management (2025-08-01): https://pages.nist.gov/800-63-4/sp800-63b.html
- NIST authentication assurance levels: https://pages.nist.gov/800-63-4/sp800-63b/aal/
- W3C WebAuthn Level 3 status (2026): https://www.w3.org/news/2026/proposed-advancement-of-webauthn-3-to-w3c-recommendation/
- W3C WebAuthn Level 4 First Public Working Draft (2026-09-15): https://www.w3.org/news/2026/first-public-working-draft-web-authentication-an-api-for-accessing-public-key-credentials-level-4/
- GOV.UK Design System — Create accounts: https://design-system.service.gov.uk/patterns/create-accounts/
- GOV.UK Service Manual — Checking users' identities (updated 2026-02-05): https://www.gov.uk/service-manual/design/checking-users-identities
