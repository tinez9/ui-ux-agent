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

## Federated identity and account linking are identity-graph mutations

Treat a federated login identity as a tuple anchored in the issuer/provider and its stable subject identifier, not as an email address. OpenID Connect defines the `sub` claim as the subject identifier in an ID token; email is additional profile data. Email can change, can collide across identity-provider connections, and a provider's `email_verified` claim does not necessarily mean that provider remains authoritative for ownership of an arbitrary third-party mailbox.

Therefore **same email is evidence for a possible match, not sufficient proof that two product accounts are the same person**. Do not automatically merge accounts merely because normalized email strings match. Auth0's deployed model demonstrates why: the same email can legitimately exist in different connections, and its current user-initiated linking guidance requires authentication of the identities being linked rather than equality of their email addresses.

### Link only after proving control of both sides

A safe user-initiated linking ceremony starts from an authenticated product account, makes the intended secondary identity explicit, and requires fresh authentication with that secondary identity before mutation. For higher-risk products, consider fresh authentication of the existing/primary account too. The UI should state what linking changes: future sign-in methods, data/account that will be reached, permissions that remain separate, and whether the operation is reversible.

Do not turn “Sign in with Google/Apple/SSO” into an implicit linking action simply because the returned email matches an existing local account. If policy wants one product account per person, route the collision into an explicit prove-and-link/recover-existing-account journey rather than silently choosing an identity.

### Define canonical product identity independently of login identities

Keep the application's durable account/person/workspace identifier separate from any provider-specific login identifier. A product account may have multiple authenticators and federated identities over time. Business data, ownership, entitlements, audit history, billing, and collaboration references should not depend on whichever login method happens to be marked “primary.”

This matters during linking because provider implementations may choose a primary identity and discard or subordinate profile metadata from the secondary identity. Auth0, for example, documents that after linking its primary identity remains the main profile and secondary `user_metadata`/`app_metadata` are not automatically merged. An application that equates provider profile merge with domain-account merge can lose metadata or transfer authority unexpectedly.

Before linking, define explicitly:
- canonical product account ID;
- identities/authenticators attached to it;
- which profile attributes are authoritative and from where;
- how entitlements, organization memberships, billing and ownership combine—or deliberately do not combine;
- what happens to active sessions for both pre-link accounts;
- audit record and notifications;
- unlink/recovery behavior.

### Enterprise federation adds organization authority

A matching email domain is not sufficient evidence of enterprise membership. Provider-specific authoritative organization/tenant claims should be used when access depends on organizational membership, and membership/authorization should remain distinct from authentication. Auth0's current Google Workspace guidance illustrates the edge case: a Google account can use a non-Google mailbox, so `email_verified=true` alone does not establish that Google is authoritative for that email domain; the hosted-domain claim is needed for Workspace-domain authority.

Do not persist enterprise access forever from a one-time login assertion. Define what happens when the IdP removes the user, changes tenant membership, disables the identity, or changes claims. SSO proves an authentication event; application authorization still needs its own lifecycle.

### Unlinking can be destructive or create lockout

Before unlinking, prove the current user's authority and ensure at least one viable sign-in/recovery path remains. Show which sign-in method will stop working and whether any organization access depends on it. Do not offer unlink as a harmless profile toggle if it can orphan the account, change the canonical identity, remove access, or weaken recovery.

Account deletion also needs identity-graph semantics: deleting a provider identity, unlinking it, deleting the product account, and deleting a provider account are different operations. Never infer one from another silently.

### Linking failure modes

- automatic merge on matching email without proving both identities;
- using mutable email as the durable foreign key instead of provider + stable subject;
- assuming `email_verified=true` means the IdP is authoritative for every email/domain;
- allowing a newly authenticated low-assurance identity to attach itself to a high-value existing account;
- silently selecting which duplicate account “wins” and losing the other's data or entitlements;
- coupling product data ownership to the provider's notion of primary identity;
- unlinking the final viable authenticator and locking the user out;
- preserving enterprise privileges after the IdP no longer asserts membership;
- treating link/unlink as profile decoration rather than an account-control event.

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
9. If identities can link/unlink, what is the canonical product account, how is control of both sides proved, and what happens to data/entitlements/sessions?
10. When does the session expire or require step-up, and what task state survives interruption?
11. Have keyboard, screen-reader, autofill/password-manager, passkey, localization, rate-limit, service-failure, multiple-account, federated, lost-device, linking/unlinking, and support-assisted recovery paths been tested?

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

NIST SP 800-63B-4 (published 2025-08-01) is authoritative security guidance for authentication/authenticator management in its scope and provides a useful recovery-method taxonomy; its assurance levels and exact requirements are not universal consumer-product defaults. W3C WebAuthn Level 3 is a Recommendation as of 2026-08-25 and establishes the web platform public-key authentication model; it does not define an application's account-recovery policy or prove a particular passkey UX best. OpenID Connect establishes stable subject identity semantics for federated authentication but does not prescribe an application's account-linking policy. Auth0 documentation supplies concrete production behavior and failure cases around cross-connection duplicates, linking and provider authority; those mechanics are vendor-specific evidence, so generalize the identity principles rather than Auth0's exact data model. Google's passkey documentation demonstrates one major ecosystem's sync and cross-device model; do not generalize its exact behavior to every credential provider. Product rules above about cooling-off periods, notifications, support protocols, factor-change protection, explicit linking and canonical product identity are risk-based synthesis and must be calibrated to the product threat model.

## Primary sources reviewed

- NIST SP 800-63B-4 — Authentication and Authenticator Management (2025-08-01): https://pages.nist.gov/800-63-4/sp800-63b.html
- NIST authentication assurance levels: https://pages.nist.gov/800-63-4/sp800-63b/aal/
- W3C — WebAuthn Level 3 became Recommendation (2026-08-25): https://www.w3.org/news/2026/web-authentication-an-api-for-accessing-public-key-credentials-level-3-is-now-a-w3c-recommendation/
- W3C — WebAuthn Level 4 First Public Working Draft (2026-09-15): https://www.w3.org/news/2026/first-public-working-draft-web-authentication-an-api-for-accessing-public-key-credentials-level-4/
- OpenID Foundation — How OpenID Connect works: https://openid.net/developers/how-connect-works/
- Auth0 Support — Implement client-side user-initiated account linking (updated 2026-02-20): https://support.auth0.com/center/s/article/Implement-Client-Side-User-Initiated-Account-Linking
- Auth0 Support — Unique email address per user requirements (updated 2025-09-10): https://support.auth0.com/center/s/article/Does-Auth0-Require-a-Unique-Email-Address-Per-User
- Auth0 Support — Google hosted-domain claim and provider authority (updated 2026-02-20): https://support.auth0.com/center/s/article/How-to-get-hd-claim-from-google-sign-in-to-verify-user-belongs-to-a-Google-Workspace-or-Cloud-organization-account
- Auth0 Support — User ID and profile behavior after linked accounts (updated 2025-09-10): https://support.auth0.com/center/s/article/After-2-accounts-linked-what-will-be-the-user-id-in-the-token-generated-by-Auth0
- Google for Developers — Passkeys: https://developers.google.com/identity/passkeys
- GOV.UK Design System — Create accounts: https://design-system.service.gov.uk/patterns/create-accounts/
- GOV.UK Service Manual — Checking users' identities: https://www.gov.uk/service-manual/design/checking-users-identities
