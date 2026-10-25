# Learning State

This file guides autonomous research selection. Use qualitative states; do not invent numeric coverage percentages.

## Knowledge map

| Area | State | Priority | Notes |
|---|---|---:|---|
| Foundations | WEAK | High | Seed principles; needs evidence and depth |
| Visual design | WEAK | High | First 2026 creative signals identified; needs durable operational rules |
| UX patterns | DEVELOPING | High | Forms, result sets, async states, navigation, notifications, drag/reorder and file-upload lifecycle contracts documented; many common patterns remain |
| Interaction & motion | DEVELOPING | Medium | Operational motion-purpose, reduced-motion, transition, and web implementation rules documented; direct manipulation and measured outcome evidence remain |
| AI-native UX | ADEQUATE | Medium | Risk-shaped autonomy, approvals, progress, recovery, provenance, and denial recovery documented; domain-specific validation remains |
| Design systems | DEVELOPING | Medium | Agent-readable contract plus token builder/export trust gates; cross-tool context fidelity and comparative agent-output validation still missing |
| Distinctive features | WEAK | High | Core differentiation objective |
| Frontend implementation | DEVELOPING | Medium | Operational container-responsive and scroll-driven CSS guidance documented; broader native UI primitives, performance, testing, and semantic patterns remain |
| Claude/AI-agent workflows | ADEQUATE | Medium | First evidence-backed workflow established; comparative testing still missing |
| Anti-patterns / AI slop | WEAK | High | Claude-specific tells identified; cross-model evidence and alternatives still needed |
| Trend observatory | ADEQUATE | Medium | Evidence ladder established; first adoption-vs-showcase distinctions documented |

## First research priorities
1. What currently causes AI-generated web/app interfaces to look generic across models, and what practical alternatives work?
2. Which AI-native interaction patterns best preserve control, feedback, provenance, approval, and recovery?
3. Which distinctive features provide product value beyond decoration?
4. Which current browser capabilities enable distinctive interaction with acceptable accessibility/performance cost?
5. Which design-system artifact mix most improves agent fidelity when isolated experimentally?

## Recent research
### 2026-10-25 — Customizable select clone can disagree with submitted data
**Question:** Does native `appearance: base-select` remove custom-dropdown data/accessibility hazards during dynamic option updates?

**Finding:** Not entirely. Three isolated Chromium 144/Playwright runs showed that editing selected option text left `selectedcontent` displaying the old cloned label until selection changed. Without explicit `value`, a decorative `aria-hidden` star still entered the submitted string; after a label edit, `FormData` reflected the new text while the visible clone remained stale. An explicit stable value prevents data-string drift, not clone staleness. Favor progressive enhancement, real text labels, noninteractive options and a classic-select baseline.

**Evidence boundary:** MDN, Chrome, WebKit/Safari 27, WHATWG open #12328 and a repeatable single-engine DOM fixture. No cross-engine, real mobile, AT, framework-hydration or user-outcome testing. UX patterns remain 4/10 and overall 3.7/10; next: real keyboard/AT and framework update comparisons.

### 2026-10-25 — Text spacing exposes hidden losses in line-clamped UI
**Question:** Can two-line cards that look correct at default typography lose information after WCAG text-spacing overrides even though the full text remains in the DOM?

**Finding:** Yes in an isolated Chromium 144/Playwright fixture. The same two-line sentence fitted 48px initially; after the four WCAG spacing overrides, fixed-height/hidden and prefixed two-line clamp remained 48px while scrollHeight rose to 72px, whereas an auto-height variant grew to 72px. A functional `aria-expanded` disclosure removing the clamp restored the full visual text. The decision rule is not “ban truncation”: reserve it for optional previews with an actual full-content path; avoid hiding essential labels/instructions/errors.

**Evidence boundary:** W3C SC 1.4.12, F104, C35/C36 establish normative and technique boundaries; MDN documents line-clamp compatibility. The browser fixture establishes only one rendering failure mode. No cross-browser/AT test, WCAG certification or user-outcome evidence. Frontend maturity remains 3/10.

### 2026-10-25 — Reduced transparency is not a backdrop-filter switch
**Question:** Can AI-generated glass UI honor Reduce Transparency merely by removing blur or increasing element opacity, and can the web reliably detect the OS setting?

**Finding:** No. Chromium 144 paired CSS/pixel controls showed both blur-only removal and `opacity:1` retained alpha-background bleed-through (156 RGB-channel delta on a striped fixture), while an opaque background plus no blur removed it (delta 0). MDN lists the media query as limited availability: Safari 27 does not expose it despite a native OS setting; Firefox remains disabled by default. A solid-first progressive enhancement is a safer default for essential UI, with translucent-first reserved for independently contrast-tested contexts. Contrast, motion and forced-colors media queries do not imply reduced transparency.

**Evidence boundary:** W3C/MDN/Apple establish platform semantics and compatibility; one headless Chromium/CDP fixture demonstrates CSS behavior, not real OS propagation, accessibility outcomes or cross-browser parity. No broad maturity-score change. Next: real OS/browser toggle matrix and dynamic-background legibility trials.

### 2026-10-25 — Safari MCP: real signed-in profile is a privilege, not a QA upgrade
**Question:** When does a third-party Safari MCP tool add value beyond Apple's newly shipped first-party Safari MCP, and what are the hidden operational boundaries?

**Finding:** Apple's Safari 27 `safaridriver --mcp` already provides 17 browser inspection/interaction tools without npm or ordinary-profile access. The actively maintained MIT `achiya-automation/safari-mcp` 2.22.18 offers a much broader published tool catalog but intentionally operates against a user's real signed-in Safari and installs a helper with a macOS `codesign` postinstall step. Source inspection found that its `SECURITY.md` blanket “no ports” claim omits opt-in HTTP/extension modes, and “no data leaves” omits downstream model transmission; tab ownership is actively guarded but not a security sandbox. A separate Apple MCP stdio handshake was independently reproduced by an open GitHub integration spike. Prefer Apple's isolated development workflow for Safari QA; require explicit authorization and negative controls before real-profile automation.

**Evidence boundary:** WebKit first-party docs, GitHub integration spike and community package/source inspection, **not** a local Mac test, package execution, exploit, independent performance measurement or causal agent-quality benchmark. AI-agent workflows **5/10** and overall **3.7/10** unchanged; next: compare actual defect detection and forbidden-action controls with clean fixtures.

### 2026-10-25 — Native scroll anchoring is not conditional chat follow
**Question:** When does the browser preserve a chat/feed reader's position, and when must an application deliberately follow new output?

**Finding:** CSS scroll anchoring protects an eligible visible node against *above-viewport* insertion but does not automatically pin a normal feed to its bottom on append. In a Chromium 144 fixture, prepending 180px changed `scrollTop` 600→780 while preserving the visible row; disabling anchoring held it at 600 and shifted the row 180px. A manual 180px correction layered over native compensation double-shifted to 960. Appending at bottom left `scrollTop` 901 while max rose to 1081; a visible end sentinel selectively followed to 1081 but did not preserve mid-list prepend. TanStack Virtual now exposes explicit end anchoring and conditional follow options, with a reported padding/threshold edge case (#1258); a separate count-neutral append+trim bug was closed September 11. Documented a decision contract for prepend, append, streaming, virtualization, user interruption and accessible history.

**Evidence boundary:** CSSWG/MDN, TanStack first-party docs/issues, W3C ARIA23 and a local Chromium DOM fixture. No TanStack runtime reproduction, Firefox/WebKit, real AT, mobile or user-outcome evidence. **Maturity unchanged** (overall 3.7/10, frontend 3/10); next test must isolate native/browser/library/application correction and pinned-state semantics.

### 2026-10-25 — Focus occlusion: scroll-padding is not a substitute for scroll range
**Question:** Does the common AI-agent recipe `scroll-padding-bottom` alone keep last-page focused controls clear of fixed footer overlays?

**Finding:** Not in an isolated Chromium 144 fixture. A 180px fixed footer covered the final focused button even with root scroll-padding: at the maximum scroll offset the button remained entirely behind the footer. Pairing 180px physical end padding with the scroll inset made it reachable; a midpage button was correctly repositioned by scroll-padding alone. Root-only scroll-padding did not affect an inner scrolling pane, and `focus({preventScroll:true})` intentionally skipped scrolling. W3C C43's actual example includes **both** physical padding and scroll-padding; recipes that quote only the latter omit a material constraint. Added scroller-ownership, focus-path, reflow/zoom and keyboard QA guidance.

**Evidence boundary:** W3C WCAG/techniques, MDN, historical CSSWG discussion and local Chromium 144/Playwright Python geometry probes; no cross-browser, real AT or user-outcome testing. **Frontend 3/10, UX patterns 4/10, overall 3.7/10 unchanged.** Next: browser/device/AT and dynamic-overlay matrix with first/last focusable controls and short viewport/zoom.

### 2026-10-25 — Native dialog light dismiss: a first-party agent guide confuses backdrop with dismissal semantics
**Question:** Is `closedby="any"` only valid for modal `showModal()` dialogs, as GoogleChrome's installable modern-web-guidance tells agents?

**Finding:** No in Chromium 144. WHATWG defines close policy separately from modal state. Three isolated runs per condition showed that an outside click closes both modal and **non-modal** `show()+closedby="any"` dialogs (`cancel→close`); default modal/non-modal did not light-dismiss. The guide's “always showModal / never use closedby for non-modal” is overbroad, and Safari still lacks `closedby` support. An open WHATWG issue and local test also show `requestClose()` on a non-modal dialog can remain open when its `cancel` handler removes `closedby` (without preventing default); modal behavior differs. Documented modal-vs-dismissal decision, unsaved-draft/cancel guard and browser/AT falsification.

**Evidence boundary:** WHATWG/MDN/WAI-ARIA APG/web-features, first-party skill source and 27 isolated Chromium 144/Playwright case runs; no Firefox/WebKit, real touch/Back/AT or product outcome. **UX patterns 4/10, frontend 3/10, agent workflows 5/10, overall 3.7/10 unchanged.** Next: cross-engine `closedby`/cancel mutation matrix and actual agent output comparison.

### 2026-10-25 — Modern Web Guidance: self-eval uplift is not an independent behavior oracle
**Question:** How much trust should coding agents place in GoogleChrome's installable modern-web-guidance skill and its published evaluation gains?

**Finding:** First-party skill, CLI, telemetry, guide, grader and metric-source inspection supports a **conditional implementation-reference recommendation**, not automatic design certification. Maintainer Oct-19 assertions report Codex 56→83% and Claude 56→88%, but early failures are excluded from pass-rate denominators and the author-built `search-hidden-content` grader can pass two requirements from a bare `beforematch` string without testing actual reveal/fallback. Sensitive-content checking covers two literal markers. The skill's local retrieval is distinct from default-on query telemetry and networked `@latest` installation. Clarified browser support and state/fallback behavior for `hidden="until-found"`.

**Evidence boundary:** Source inspection and current WHATWG/MDN/web-features documentation; no independent agent, browser, screen-reader or installer execution. Overall **3.7/10**, frontend **3/10**, agent workflows **5/10** unchanged. Next: independent seeded-good/bad comparison and actual cross-browser/AT checks.

### 2026-10-25 — `ariaNotify`: Baseline availability does not certify delivery or iframe containment
**Question:** Should AI agents replace live regions with the new announcement API, and is cross-origin use restricted by default?

**Finding:** WAI-ARIA 1.3's 2026-10-21 editor's draft and June Working Draft set `aria-notify` Permissions Policy default to **`*`**, while MDN's March 2026 policy reference says **`self`**. W3C security review #2861 remains open over possible cross-origin announcement flooding. MDN marks the API Baseline Newly Available since September 2026 but notes queue loss, silent policy failure and platform-dependent delivery; a June practitioner test of Safari **26.5** cannot be extrapolated to Safari 27. Added visible-state/announcement-channel, policy-isolation, localization and AT test gates to the existing notifications pattern.

**Evidence boundary:** W3C draft, MDN, open standards/security discussion, dated independent AT tests, and an isolated Chromium 144 feature-presence probe; cross-origin navigation was blocked by the environment, and no live AT speech was measured. UX patterns **4/10**, overall **3.7/10** unchanged. Next: cross-origin Permissions Policy and actual AT delivery matrix.

### 2026-10-25 — Command palette IME guards stop at component boundaries
**Question:** Does a component's IME-safe Enter handler also protect consumer callbacks and global shortcuts?

**Finding:** Not automatically. Source inspection of `dip/cmdk` found its consumer `onKeyDown` executes before the internal `isComposing || keyCode===229` check; the library's own selection is guarded, but host actions can run early. MDN describes IME keydown ordering and WCAG 2.1.4 constrains bare-character shortcuts. Independent resolved OpenCode and reported Codex issues demonstrate the failure class in different apps. Added end-to-end keyboard/IME acceptance guidance.

**Evidence boundary:** First-party source, W3C/MDN, separate product issue reports and a Chromium 144 synthetic-event callback-order probe; no real IME, actual cmdk React runtime, cross-browser/AT or outcome experiment. UX patterns **4/10**, overall **3.7/10** unchanged. Next: real-IME integration and screen-reader testing.

### 2026-10-25 — Visual screenshot stabilization is not always read-only
**Question:** Can Playwright's default visual-assertion animation suppression change the application state an AI agent is trying to verify?

**Finding:** Yes for finite transitions with completion handlers. Playwright documents that `toHaveScreenshot()` defaults to `animations: 'disabled'`, fast-forwarding finite CSS transitions and firing `transitionend`, unlike direct `page.screenshot()`'s default `allow`. In three paired Linux Chromium 144 / Playwright Python 1.57 fixture runs, disabling animation during a 20-second toast exit transition immediately fired `transitionend`, removed the toast and changed a status label; allowing animation left the toast present. Added before/after state-oracle and intermediate-vs-settled capture rules to the existing visual-regression guidance.

**Evidence boundary:** Real browser reproduction but synthetic fixture, only Chromium/Python direct screenshot; no Playwright JS assertion, Firefox/WebKit, React app, AT or user-outcome validation. Not a Playwright defect claim. Frontend **3/10**, agent workflows **5/10**, overall **3.7/10** unchanged. Next: compare actual `toHaveScreenshot()` and cross-engine/animation-type side effects.

### 2026-10-25 — Activity-retained routes contradict a first-party Playwright locator recommendation
**Question:** When route DOM survives navigation, can an agent assume all semantic Playwright locators ignore hidden route copies?

**Finding:** No. Next.js's current Cache Components guide correctly describes Activity retaining route DOM/state (up to three routes) and offers nuanced draft/transient/reset policies, but incorrectly says `getByLabel` and `getByPlaceholder` automatically filter hidden elements like `getByRole`. In an isolated Chromium 144 / Playwright Python 1.57 fixture, role lookup matched only the visible textbox; label and placeholder lookups each matched both visible and `display:none` inputs and failed strict-mode `fill`. Explicit visible filtering fixed it. A separate opacity/ARIA-hidden control showed that role matching is not a visual-visibility test. Documented state-retention and agent-QA contracts, including bfcache vs Activity distinction.

**Evidence boundary:** Reproduced against plain DOM, not a live Next.js/React Activity app or current Playwright JS; official React/Next/Playwright docs and an upstream Next discussion provide context. No cross-engine/AT, auth-switch or task-outcome validation. Frontend and agent maturity scores unchanged. Next: pin a real Cache Components fixture and compare selector behavior, focus, stale forms and route eviction.

### 2026-10-25 — Native accordions: exclusive names are tree-scoped, not component-scoped
**Question:** When does `<details name>` replace a custom accordion safely, and what hidden state/focus regressions can occur in composed apps?

**Finding:** WHATWG explicitly warns that exclusive accordions can harm users who compare content. Its grouping is based on identical nonempty names within the *same tree*, not the surrounding component/section. In an isolated Chromium 144 Playwright probe, two unrelated sections with the same name closed each other; a shadow-root item did not; rapid toggles coalesced; and programmatic closure left focus on a now-hidden child button. Documented when to use independent versus exclusive disclosures, unique group naming, Boolean/open semantics, focus preservation, and a comparative QA gate.

**Evidence boundary:** Normative WHATWG, MDN, W3C APG and GOV.UK production guidance plus one headless Chromium probe. No cross-engine/AT/React hydration or measured user study. **Overall 3.7/10 and UX patterns 4/10 unchanged.** Next: test focus recovery and content comparison across browsers, screen readers and multiple accordion instances.

### 2026-10-25 — Localized dynamic messages: CLDR precision and runtime availability are separate contracts
**Question:** Can an agent safely construct dynamic multilingual UI strings using basic singular/plural checks or assume standardized MF2 is natively available?

**Finding:** CLDR 49 (released 2026-10-22) updated plural rules and stabilized MF2 currency/percent functions, while TC39's native `Intl.MessageFormat` remains Stage 1. A local Node 22.16 / ICU 77 / CLDR 47 probe found Spanish million and Russian singular categories change with `Intl.PluralRules` fractional-display options. Established whole-message translation, exact-zero vs grammatical-zero, formatter-version, bidi and SSR/client parity gates.

**Evidence boundary:** Unicode normative spec/release, official TC39/FormatJS/i18next/MDN and one Node probe. No cross-runtime hydration failure reproduced, MF2 engine benchmark, translator study or maturity-score change. Next: compare pinned CLDR 47/49 runtimes and live MF1/MF2 renderers with mixed RTL and rich-text fixtures.

### 2026-10-25 — Agent-rule corpora: runnable examples can propagate non-normative advice
**Question:** Does a 411-rule interactive good/bad corpus provide trustworthy incremental design guidance over existing skills, and how should an agent detect misleading rules?

**Finding:** Source-inspected strongeron/ui-guides-agent-rules (411 Good/Bad pairs, selective Markdown retrieval, 17 explicitly checked rule IDs) and two smaller Codex skills. Its `forms-enter-submits` example reproduces a Vercel last-control heuristic but demonstrates only a single-input form. WHATWG HTML instead defines the first associated submit button as default; a Chromium 144 Playwright probe confirmed Enter from both inputs activates that button, while no-button/disabled/textarea cases differ. Added native form contract and a rule-corpus promotion gate; no skill was promoted.

**Evidence boundary:** First-party GitHub source/metadata, WHATWG/MDN and isolated Chromium probe; no cross-browser/AT demo audit, user-outcome data, upstream license analysis or controlled agent uplift. **Overall 3.7/10, UX patterns 4/10, agent workflows 5/10 unchanged.** Next: multi-engine negative controls and blinded agent comparisons of retrieved rules versus spec-grounded guidance.

### 2026-10-25 — Browser-agent guardrails: configured is not contained
**Question:** Can AI frontend QA agents trust browser-tool allowlists, action policies and “disable JS” flags to confine autonomous inspection?

**Finding:** Source-inspected canonical `agent-browser` 0.39.2 still treats an empty parsed domain allowlist as unrestricted, consistent with open reporter issue #1902; its action-policy checks compare exact action strings, consistent with open issue #1612 that documented categories do not protect related actions. Chrome DevTools MCP 1.12.0 documents Chrome 149+ URL-filter requirements, attachment/hot-reload gaps, agent-writable config risk, persistent browser profiles, and a DevTools Console path not disabled by `--no-javascript-evaluation`. Established a fail-closed preflight/negative-control and OS isolation decision contract; compared Playwright MCP's explicitly non-security-boundary origin filters.

**Evidence boundary:** Current upstream docs and source plus two open GitHub reporter reproductions; no local browser/binary containment test or measured agent-quality uplift. AI-agent workflows **unchanged at 5/10**, overall **3.7/10**. Next: execute pinned cross-tool forbidden-origin/action fixtures with benign controls and host-level egress instrumentation.

### 2026-10-25 — Native form sizing: auto-grow is not a global one-line migration
**Question:** Can newly Baseline `field-sizing: content` safely replace textarea resize scripts without affecting other controls?

**Finding:** CSS Forms makes controls intrinsically content-sized, ignoring textarea `rows`/`cols` and potentially expanding listboxes beyond `size`. Local Chromium 144 Playwright reproduced a 15px-wide empty textarea, a 590px-tall 30-option multi-select, and placeholder-driven input width change; a bounded textarea remained capped with internal scroll. Added scoped CSS/fallback and adversarial QA. Firefox 152 made this Baseline *Newly available* on 2026-06-16, not universally supported by older installed browsers.

**Evidence boundary:** CSSWG editor's draft, MDN/Chrome/Mozilla release docs and one Chromium fixture; no Firefox/Safari/mobile/AT/INP comparison. Frontend maturity **unchanged at 3/10**; overall **3.7/10**. Next: cross-engine keyboard/caret/mobile and JS fallback comparison.
### 2026-10-25 — WebAuthn Signal API: stale-passkey cleanup can damage another account
**Question:** Is passkey-provider reconciliation safe to automate when users hold multiple accounts under the same relying-party ID?

**Finding:** W3C's signal methods are best-effort and intentionally scoped to one user/credential; however, open WebKit bug 322267 reports deletion of an unrelated account's passkey when a password and passkey share a Passwords-app entry. Both deletion signals were implicated. Separate open bug 324909 reports unresolved Signal API promises for Safari 27 on macOS 26, despite an earlier, distinct promise bug being fixed. Added conditional rollout/kill-switch, complete-list, no-claim-of-device-deletion and nonblocking-signaling safeguards to authentication guidance.

**Evidence boundary:** W3C/MDN/Chrome/WebKit primary docs and WebKit Bugzilla reports, not local Apple reproduction or user tests. One reported regression is not evidence all Safari/provider combinations fail. Authentication/UX maturity **unchanged** (overall **3.7/10**; UX patterns **4/10**). Next: multi-account provider matrix with destructive side-effect and promise-liveness assertions.

### 2026-10-24 — Workbox replay is not single-flight: dependent offline edits can disappear
**Question:** Does default Workbox Background Sync preserve the order and outcome of dependent queued mutations when manual replays overlap?

**Finding:** No method-level guarantee. Inspected pinned Workbox v7.4.1 `Queue.replayRequests()` and ran its exact method body with mocked storage/network. Two overlapping manual invocations sent B while A was still in flight; the controlled create-then-edit sequence became `create-start → edit-404 → create-201`, and the queue ended empty although the edit never applied. Separate 503 replay also emptied the queue; rejected fetch retained the entry. The method has no single-flight guard and does not inspect resolved HTTP statuses. GitHub issue #2640 was administratively closed, not shown repaired. Added explicit single-replay-owner, dependency, server reconciliation and falsification guidance.

**Boundary:** Dynamic execution of the pinned source method, **not** full Workbox package, IndexedDB, service-worker sync, browser, or user testing. Do not infer that native browser sync necessarily overlaps; the demonstrated hazard is concurrent manual calls. **UX patterns 4/10 and overall 3.7/10 unchanged.** Next: full package/browser fixture, HTTP-status classification, worker restart and account switch.

### 2026-10-24 — Playwright ARIA snapshots can miss CSS reading-flow focus order
**Question:** Does a passing ARIA snapshot assertion verify the navigation order produced by `reading-flow`?

**Finding:** No in pinned local Chromium 144 / Playwright Python 1.57.0. A reversed flex row with `flex-visual` yielded actual Tab and reconstructed CDP AX **Three/Two/One**, but Playwright snapshot **One/Two/Three**; the source-ordered snapshot assertion passed. Explicit grid `grid-rows` reproduced the discrepancy. CDP's flat node-array order also differed from the hierarchy in a nested wrapper; traverse `childIds`. Current Playwright source walks DOM children, explaining the snapshot limitation.

**Boundary:** Local headless Chromium plus current upstream source and official docs; no newer Playwright runtime, Safari/Firefox, real screen-reader or user study. Responsive-composition QA contract updated. **Frontend 3/10 and overall 3.7/10 unchanged.** Next: Playwright MCP/CLI and NVDA/VoiceOver validation.

### 2026-10-24 — Offline mutation queues: local save, replay and server confirmation diverge
**Question:** When may an offline-capable UI claim “Saved,” and do common background-sync libraries preserve failed writes?

**Finding:** Local drafts, queued requests, network attempts and server-accepted changes require separate UI states. Workbox source inspection found that its initial plugin queues thrown failures, while Queue.replayRequests() drops entries after any resolved HTTP response (including 503). TanStack v5 requires a default mutation function to resume persisted mutations after reload. Stripe's v1/v2 idempotency differences and RFC 9110 preconditions show why timeout retry and concurrent-edit recovery require server contracts, not a spinner.

**Evidence boundary:** Primary browser, Workbox source, TanStack, RFC, Stripe and Google offline UX guidance; no runtime, cross-browser/AT or outcome trial. UX patterns **4/10** and overall **3.7/10** unchanged. Next: reproduce replay loss and test duplicates, account switching, conflicts and truthful status.

### 2026-10-24 — Forced-colors design-system regression: opting out can leak later author styles
**Question:** Does a dark/high-contrast token mapping suffice for Windows contrast themes, and is `forced-color-adjust: none` safe when copied across components?

**Finding:** No. UA forced colors replace authored colors at paint time based on native semantics, remove shadows/gradients, and require rendered-state checks; `prefers-color-scheme` is a different contract. Microsoft's Fluent intentionally opts out to avoid text backplates, while Sarah Higley's maintainability counterexample shows inherited `none` exposing downstream high-specificity author colors. Local Chromium 144/Playwright emulation reproduced a lost shadow and opted-out red/purple style leak. Added scoped CSS and adversarial QA guidance.

**Evidence boundary:** CSSWG/MDN/Microsoft, practitioner counterexample and one Linux Chromium emulation; no real Windows custom theme, Firefox/AT or outcome validation. Visual-design **3/10**, design-systems **4/10**, overall **3.7/10** unchanged. Next: real theme/engine and component-override matrix.

### 2026-10-24 — Recurring schedules: RFC DST contradiction and exception identity
**Question:** Can agents safely equate a local weekly meeting with fixed UTC intervals or assume one rule for nonexistent local times?

**Finding:** No. Local series need an IANA zone, local-time rule, duration semantics and stable original occurrence IDs. RFC 5545 §3.3.10 conflicts with itself on DST-gap skip versus DATE-TIME resolution; local Python dateutil 2.9.0.post0 produced an imaginary Madrid spring-gap occurrence despite its documented skip rule, while monthly invalid dates were skipped. Google Calendar's originalStartTime and split-series edits clarify exception scope. Added explicit preview/ambiguity and testing contracts.

**Evidence boundary:** RFC/Temporal/Google docs plus one local library probe; no cross-engine, provider, AT or user benchmark. UX-pattern maturity stays **4/10**, overall **3.7/10**. Next: multi-engine recurrence and edit-scope falsification.

### 2026-10-24 — Saved views as notification rules: membership, mutation and delivery diverge
**Question:** When saved views power alerts, what changes trigger notifications and who may receive them?

**Finding:** Linear ships personal/Slack subscriptions for view entry and completion/cancellation, with self-action suppression; its Pulse custom feeds are a counterexample that cannot be subscribed to. Live membership, event trigger and delivery permissions are separate. Jira Software's admin-managed shared baseline contrasts with a documented Jira Product Discovery autosave pitfall; a proposed default change was not confirmed. Added view-revision/dedup/redaction guidance and a seeded falsification test.

**Evidence boundary:** First-party Linear/Atlassian docs and OWASP authorization guidance. Event-engine rules are synthesis; no live notification, permission or outcome benchmark. Distinctive-feature maturity remains **2/10**. Next: paired alert-vs-manual monitoring and cross-audience tests.

### 2026-10-24 — Interest invokers: a Chromium hovercard shortcut is not cross-browser disclosure
**Question:** When does native `interestfor` improve hover/focus preview UX, and where does it create false accessibility or touch guarantees?

**Finding:** Chrome/Edge 142 shipped interest invokers, but WHATWG integration PR #11006 remains open and Firefox/Safari lack support. The 2026-10-16 Open UI explainer proposes different plain/rich hint accessibility mappings from WAI-ARIA APG's work-in-progress tooltip guidance; rich interactive cards still require direct AT/focus tests. WCAG 1.4.13 remains independently applicable. The maintained polyfill cannot provide link long-press while preserving native context menus. Documented optional-preview versus explicit-activation decision, speculative-fetch/privacy boundaries and adversarial test plan.

**Evidence boundary:** Chromium release notes, Open UI/WHATWG proposals, W3C WCAG/APG, MDN and maintainer polyfill source; no live browser, AT or usability study. Frontend implementation maturity **unchanged at 3/10**, overall **3.7/10**. Next: matched native/polyfill/explicit-click tests across browser, touch, AT and private-data conditions.

### 2026-10-24 — Superdesign hosted canvas: source-grounded design is not private or production-validated by default
**Question:** Does Superdesign's current agent skill provide useful design fidelity beyond a local code-first loop, and what does its actual source-to-cloud workflow expose?

**Finding:** Revalidated the canonical v0.6.0 skill and its init/generation/resume instructions. It can reproduce existing UI from real render branches, branch canvas variants, reuse brand assets and resume with SHA-256 source checks. The init artifacts duplicate full UI source locally; the hosted CLI receives selected context and assets, while only temporary HTML is explicitly gitignored in the SOP. Path/secret-pattern guards and context enumeration are helpful but cannot establish absence of sensitive literals or permission to upload. A canvas logo postcondition checks HTML references, not rendering/behavior/a11y. The original IDE extension is archived and distinct; the published independent trial was blocked by login.

**Evidence boundary:** Direct upstream Markdown/plugin/license and a login-limited independent trial; no authenticated generation, CLI source audit, privacy/retention confirmation, or outcome benchmark. Conditional candidate only; maturity **unchanged** (3.7 overall; 5 agent workflows). Next: compare sanitized local and hosted design flows with upload inventory, source-fidelity and post-integration tests.

### 2026-10-24 — CSS reading-flow: Chromium focus-order enhancement cannot replace logical source order
**Question:** Can responsive flex/grid visual reordering be repaired accessibly with `reading-flow`, and what happens in unsupported engines or assistive-technology modes?

**Finding:** CSS Display 4 distinguishes `flex-visual` from `flex-flow`, grid row/column traversal from `grid-order`, and ordinal `reading-order` groups from DOM changes. Chrome 137+ supports these properties, but MDN BCD still records no Safari/Firefox support (2026-10-24); a 2026 community claim of Safari 26.4 support is uncorroborated and conflicts with primary support data. `display: contents` focus-scope behavior has open WHATWG questions. Added an agent decision/QA contract to responsive composition: preserve meaningful source order; use CSS as optional enhancement, not an accessibility certification.

**Evidence boundary:** CSSWG draft, Chrome documentation, current MDN BCD, open platform issues and WCAG 1.3.2/2.4.3; no cross-browser/AT experiment or observed task uplift. Maturity **unchanged** (3.7 overall; 3 frontend). Next: paired source-order and CSS-reordering fixtures across Chromium/Safari/Firefox with real keyboard and screen-reader traversal.

### 2026-10-24 — CSS anchor positioning: September draft drift changes duplicate-name and visibility assumptions
**Question:** Which seemingly stable 2026 anchor-positioning recipes conflict with the current specification or real overflow constraints?

**Finding:** The 2026-09-06 CSSWG draft now prefers the nearest eligible ancestor for duplicate anchor names (MDN still says last in source order), changes `position-anchor`'s initial value to `normal`, and renames `position-visibility` values to singular `anchor-visible`/`anchor-valid` while allowing old aliases only optionally. The default visibility and nested-scroller fallback behavior are therefore not safe to infer from old snippets; CSSWG #13079/#13176 remain open. Updated the existing overlay contract with compatibility and focused-action safety gates, rather than adding a new pattern file.

**Evidence boundary:** W3C draft/MDN/HTML Popover docs and checked CSSWG issue status on 2026-10-24; no cross-browser execution, assistive-technology verification or user-outcome data. Frontend maturity **3/10**, overall **3.7/10** unchanged. Next: pinned-browser adversarial fixture with nested/portaled anchors, syntax variants, clipped interactive popovers and keyboard/AT tests.

### 2026-10-24 — Google Labs Stitch skills: cloud design value versus upload, credential and validator boundaries
**Question:** Does the official Stitch skill suite add distinct design-to-code value for coding agents, and which shipped checks are unsafe to treat as authority?

**Finding:** Stitch offers genuinely different cloud screen/variant and code-to-design workflows, but the inspected React SWC validator only detects an arbitrary `*Props` interface and literal hex in `className`, not its stated architectural/a11y rules. The upload skill instructs agents to extract API keys from MCP config and pass them as CLI args; authenticated DOM/image snapshots may contain private data before cloud upload. Upstream requires user confirmation for upload and some verification steps, while the autonomous baton loop leaves visual checks optional. The Google Labs repository is Apache-2.0, active and popular, but explicitly not an officially supported Google product.

**Evidence boundary:** Direct upstream source/README/scripts and official MCP setup (2026-10-24); no installation, live Stitch API call, exploit reproduction, or agent outcome benchmark. **Conditional trial only**; overall maturity **3.7/10** and agent-workflow maturity **5/10** unchanged. Next: paired sanitized/non-sanitized import, validator false-negative, permission/credential and responsive-output tests.

### 2026-10-24 — React Doctor: static agent QA, subjective design lint and a restrictive license
**Question:** Does the React Doctor agent skill add reliable UI/React implementation validation beyond existing lint and prose skills, and what trust boundaries limit its use?

**Finding:** The maintained React Doctor CLI/skill adds configurable deterministic React/Next/React Native diagnostics, changed-vs-full scope, optional hooks/CI and Chrome tracing, but neither its 0–100 score nor its design rules prove usable UI. The official skill fetches mutable remote /doctor and per-rule instructions that can edit the working tree. The changelog documents false-positive removals (including bold headings) and a 2,000-project parity correction. The repository's actual **Modified MIT** license restricts ML training/evaluation-data uses despite some “MIT” summaries. CLI telemetry can retain pseudonymous paths and default Socket.dev checks make separate network requests.

**Evidence boundary:** First-party skill/repo/docs, changelog, license and data-use statements; no installation, empirical agent uplift, runtime audit or legal determination. Conditional tool trial only; agent-workflow maturity remains **5/10**, overall **3.7/10**. Next: clean/buggy paired trials against existing lint, with licensed evaluation handling, privacy isolation and verified repairs.

### 2026-10-24 — Swipe actions: hidden-only controls and native full-swipe defaults
**Question:** When do row swipe shortcuts improve triage, and when do they introduce undiscoverable controls, accidental mutations or inaccessible paths?

**Finding:** W3C F105 explicitly flags swipe-to-reveal actions lacking a simple tap/click route; keyboard access alone does not satisfy WCAG 2.5.1. Distinguish directional swipes from unconstrained dragging (2.5.7), pointer cancellation (2.5.2), and target size (2.5.8). SwiftUI's `swipeActions` defaults `allowsFullSwipe=true`, automatically invoking the first action; this deserves explicit review for delete/archive. Prefer visible/tap-accessible actions with optional gesture acceleration and recoverable persistence. Native browser/OS gestures can conflict with horizontal swipes.

**Evidence boundary:** Normative W3C, first-party Apple/Android APIs, Apple HIG, and older NN/g carousel observations; no row-swipe comparative outcomes or device trials. No maturity-score change. Next: matched always-visible/menu/swipe test with accidental deletion, RTL, edge navigation, AT, and offline recovery.

### 2026-10-24 — Vercel React Best Practices: high-value checklist, unsafe unqualified snippets
**Question:** Should React/Next.js agents install Vercel's official performance skill, and which source-level recipes can degrade correctness, privacy or UX if applied mechanically?

**Finding:** The 70-rule first-party skill is useful for focused waterfall, bundle, authorization and render reviews, but a rule is a *hypothesis*, not an optimization proof. Its cross-request `getUser(id)` LRU sample lacks tenant/authorization boundaries; a module cache example keeps a cookie-derived login boolean stale; its inline theme script promises no flicker/hydration mismatch without proving timing, React parity or CSP compliance; and its `content-visibility` example claims a 10× improvement without measurement. React Compiler and request-scoped caching further narrow when generic memo/caching advice applies. Keep the skill conditional, load only relevant rules, test against clean/adversarial controls and do not copy unsafe examples.

**Evidence boundary:** canonical Vercel skill/rule files, React/Next/Vercel first-party docs; no live install, exploit, measured speedup or cross-model trial. AI-agent workflows stay **5/10**, frontend implementation **3/10**, overall **3.7/10**. Next: paired agent/no-skill React tasks with cross-tenant cache, strict-CSP hydration, compiler and long-list controls.

### 2026-10-24 — Offscreen rendering: CSS skipping is not DOM virtualization or guaranteed AT parity
**Question:** When does `content-visibility: auto` improve long-page performance without compromising scroll stability, find/focus behavior or accessibility?

**Finding:** CSS containment skips rendering work but retains mounted DOM, so it is not a substitute for pagination/windowing when node count dominates. Intrinsic-size estimates can produce scrollbar jumps and `scrollIntoView()` misalignment. More importantly, MDN's broad 'remains in accessibility tree' explanation has a **qualification in the current CSSWG editor's draft**: §4.6 permits omitting skipped content from the AT tree if exposing it would create an assistive-technology timing side channel. Offscreen CSS-hidden descendants can conversely appear in the AT tree. Added a conditional optimization decision table, block-axis sizing contract, semantic-state boundary and adversarial cross-browser/AT tests.

**Evidence boundary:** CSSWG draft, MDN/WHATWG and Chrome documentation; no measured benchmark or observed browser-specific defect. Frontend implementation remains **3/10**, overall **3.7/10**. Next: paired browser/AT traces and realistic long-page versus virtualized-list fixtures with false-positive hidden elements, deep links and bad size estimates.
### 2026-10-24 — Playwright CLI skill: lower context overhead, higher page-tool trust demands
**Question:** When does the official Playwright CLI skill improve AI coding-agent browser QA versus MCP, and can its WebMCP shortcut be safely followed?

**Finding:** CLI is a credible, maintained first-party option for shell-capable coding agents; GitHub Agentic Workflows chose it for schema/deployment economy, not proven UI quality. The current skill encourages page-provided WebMCP calls even when a cookie banner obstructs the UI: that crosses a new trust boundary because tool metadata, outputs and behavior come from the visited site. Apply origin/consent/action-scope checks and independent verification, not automatic invocation. Source inspection also uncovered a stale `microsoft/playwright-cli` skill mirror (three documented errors fixed in canonical `microsoft/playwright` on 2026-10-19) and a closed password-snapshot report that does **not** establish automatic masking.

**Evidence boundary:** official Playwright/Chrome docs, canonical and mirrored skill source, fixed issue/commit history; no runtime comparison, adoption or security test. AI-agent workflow maturity **unchanged at 5/10**, overall **3.7/10**. Next: matched CLI/no-skill/CLI+skill/MCP trials with adversarial page-tool metadata, secret-bearing snapshots and clean controls.

## Recent research
### 2026-10-24 — Server-backed data tables: page-local sorting is not dataset sorting
**Question:** When can a sortable/filterable table falsely imply it transformed the entire result set, and how should agents test this across server pagination and concurrent changes?

**Finding:** TanStack Table v8 explicitly warns that client sorting combined with server pagination sorts only loaded rows. Its manual sorting/filtering/pagination flags delegate the corresponding transforms to the backend; manual pagination also disables automatic page reset, and unknown `pageCount: -1` cannot determine the last page. PostgreSQL 18 requires uniquely ordered LIMIT/OFFSET queries for predictable page subsets; concurrent changes can still shift offset boundaries. Strengthened the existing table contract with server query scope, deterministic tie-breakers, stale-response rejection and a two-page falsification fixture rather than duplicating the bulk-selection contract.

**Evidence boundary:** TanStack v8 and PostgreSQL 18 first-party documentation plus explicitly marked engineering inferences; no runtime benchmark or user/AT experiment. UX-pattern maturity **unchanged at 4/10**, overall **3.7/10**. Next: run matched client/server/mixed fixtures with concurrent mutation, unknown totals, cursor/snapshot variants and accessible status feedback.

### 2026-10-24 — Responsive imagery: composition is not resource resolution
**Question:** How can AI agents keep imagery meaningful, accessible and performant when a layout changes aspect ratio and focal subject?

**Finding:** `srcset`/`sizes` select appropriate bytes, `object-fit` crops within a box, and `<picture>` art-directs composition; they are not interchangeable. `<source media>` follows viewport/media conditions rather than component container size, and variant-specific intrinsic dimensions matter for CLS. W3C image alternatives depend on contextual purpose; one `<picture>` has one `img alt`, so radically different crops can invalidate a shared description. Cloudinary's documented people-versus-storefront example falsifies any claim that auto-gravity always preserves editorial intent. Current Next.js 16 deprecates `priority` and warns against overusing preloads; `fill` without `sizes` may waste bytes. Added a focal-subject brief, delivery decision table and adversarial image QA gate to visual-design knowledge.

**Evidence boundary:** WHATWG, MDN, W3C, web.dev, Next.js and Cloudinary primary documentation; no live crop experiment, AT trial or outcome study. Visual design remains 3/10 and overall 3.7/10. Next: compare center crop, auto-gravity, manual focal point and curated art-directed variants on content-critical images with desktop/mobile/embedded-card contexts.

### 2026-10-24 — Version recovery: historical snapshots are not universal undo
**Question:** How should an agent design undo, selective recovery and whole-object restore without erasing later collaboration, losing provenance or falsely promising a complete rollback?

**Finding:** Figma's restore checkpoints preserve the pre-restore file and later comments but cannot resurrect deleted comments; its duplicate loses original history/comments. Notion's sampled page versions are incomplete diffs, and restoring a database does not restore the contents of its pages. Google Sheets restoration can erase earlier cell-by-cell edit history. Yjs selective UndoManager has transaction-origin and capture-grouping boundaries, not durable historical audit semantics. Added a recovery-granularity decision table, exact-scope preview, revision-concurrency/authorization gate, accessible recovery and adversarial tests. WCAG 3.3.4 permits reversible OR checked OR confirmed safeguards for consequential actions; no blanket confirmation for every save.

**Evidence boundary:** First-party shipped-product docs, Yjs API and W3C; no runtime collaborative restore, AT or outcome benchmark. Distinctive-feature maturity **unchanged at 2/10** and overall **3.7/10**. Next: compare Undo, selective block recovery, full restore and copy in concurrent-edit fixtures with nested data, permissions and history loss; measure collateral loss, recovery time and user understanding.

### 2026-10-24 — Collaborative presence: temporary coordination is not durable proof
**Question:** When do live cursors, collaborator selections and follow modes help coordination, and what do they falsely imply about online status, saving, identity and privacy?

**Finding:** Yjs Awareness uses ephemeral client state with 15-second suggested heartbeat and 30-second expiry; Liveblocks' reconnect UI can reset other users after a separate 5-second lost-connection timeout. A cursor is neither a lock nor a save receipt. Miro's shipped follow/bring interactions are reversible attention modes; its cursor chat is transient rather than a comment trail. Liveblocks separates server-enforced room permissions from presence, and its retention policy discloses persisted session metadata even though cursor state disappears. Added a graduated participant → selection → cursor/follow decision model, accessibility/noise rules and adversarial multiuser tests.

**Evidence boundary:** Yjs protocol, Liveblocks/Tiptap API and retention docs, Miro shipped behavior and MDN accessibility guidance; no controlled multiuser, AT, performance or privacy test. Distinctive-feature maturity **unchanged at 2/10**; overall **3.7/10**. Next: test matched participant-only, selection and full-cursor/follow modes with seeded disconnect, stale presence, unauthorized writes, duplicate tabs and privacy-sensitive work; measure coordination errors, interruptions, accessibility and cost.

### 2026-10-24 — Numeric entry: localized amount is not an identifier or spinbutton
**Question:** When should agents choose `type="number"`, `inputmode="decimal"`, or a locale-aware number field, and which silent data changes must be prevented?

**Finding:** The correct split is identifier strings vs step-adjustable quantities vs localized precise amounts. GOV.UK's June 2026 revision warns that decimal mobile keyboards may omit minus, contradicting blanket `inputmode="decimal"` advice for negative values. `inputmode` is only a keyboard hint, native number inputs imply spinbutton behavior/default integer steps, and `Intl.NumberFormat` does not supply an inverse parser. React Spectrum's `NumberField` handles locale formatting but commits on blur/step and defaults to snap/clamp; a version-specific open negative/signDisplay issue motivates targeted regression tests. Documented resolved issues were not presented as active bugs. Preserve raw edits, distinguish parsed/committed/serialized values, validate ambiguity and precision, and test multilingual/AT/mobile paths.

**Evidence boundary:** Official GOV.UK/MDN/W3C and Adobe documentation, with GitHub issue reports for falsification. No device/browser execution or comparative usability experiment. UX-pattern maturity remains **4/10** and overall **3.7/10**. Next: compare native number, text+parser and locale-aware NumberField using mixed-locale amounts, step edits, screen readers, keyboard, and interrupted edits; measure silent value changes and task success.

### 2026-10-24 — DTCG token builders: a valid export can erase design-system context
**Question:** Can an AI coding agent trust “DTCG compatible” Style Dictionary/Terrazzo builds or Adobe Spectrum exports to preserve semantic token contexts and aliases?

**Finding:** No. Style Dictionary 5.7.0 still explicitly disclaims full DTCG 2025.10 support; Terrazzo 2.10.0 does implement resolver/context permutations despite a stale generic “coming in 2.0” page, but CSS selector/cascade mapping remains an application contract. Adobe Spectrum's 2026-09-17 DTCG export is deliberately a single resolved-context snapshot that removes alias provenance and emits nonconformant hex color values. A separate security revalidation found three Style Dictionary prototype-pollution advisories with successive bypasses, finally patched in 5.5.5. An agent must test spec validity, context resolution, generated output and rendered UI separately; token sources/plugins are executable-build trust inputs.

**Evidence boundary:** Official DTCG final spec, direct tool source/docs, Adobe's shipped export documentation and maintainer security advisories. No runtime comparison, conformance test or agent-output benchmark. Design-system maturity remains **4/10** and overall **3.7/10**. Next: paired version-pinned builder fixtures with clean/invalid contexts, aliases, wide-gamut colors, CSS collisions and untrusted-token handling; compare correct output, false acceptance and agent repair quality.

### 2026-10-24 — OpenPencil local design-file agents: editable context versus false lint assurance
**Question:** Does OpenPencil's installable skill/MCP add unique design-to-code value over screenshots and Figma/Penpot, and can its design lint be trusted?

**Finding:** OpenPencil 0.16.0 (released 2026-10-14) offers MIT-licensed headless `.fig` inspection/edit/export, local live MCP and design tokens/JSX. It fills an offline editable-source gap, but is not a production component mapping or design-quality oracle. Source inspection exposes high-impact false-assurance risks: contrast lint samples only solid text/ancestor fills, touch targets are inferred from node names, and the 12px text threshold is heuristic rather than WCAG. Selection-only MCP offers five server-enforced read tools; full mode and scripting need narrow file roots and version-paired app/server. Windows root defaults to home despite generalized cwd docs. Two older serious issues (#579, #750) were fixed/closed and should be used as regression cases, not current bug claims.

**Evidence boundary:** Primary source, release/docs and resolved issues; no local install or comparative outcome evidence. Maturity **unchanged** (3.7 overall; 5 agent workflows). Next: paired screenshot-only versus OpenPencil CLI/skill versus live MCP trials with gradient/alpha contrast, misleading control names, component override round-trips, production-component reuse and unauthorized edits.

### 2026-10-24 — Argos visual-regression agent skills: diff evidence versus baseline authority
**Question:** Do installable visual-regression review skills materially improve agent QA, and can their flakiness and approval advice be trusted?

**Finding:** Source inspection of Argos `argos-pr-review`, `argos-cli`, SDK and reporter found a real complement to browser-only inspection: deterministic CI snapshots, structured baseline/current/diff URLs, trace metadata and PR-intent review. Argos now has remote MCP (October 2026), contrary to its older August article. The review skill's recurrence/flakiness heuristics can wrongly dismiss persistent defects; `change ignore` suppresses checks, and approval makes a build eligible for future baselines. Read-only agents should triage and report; baseline-affecting writes need explicit human authorization. Reporter uploads screenshots and failure traces, creating a privacy boundary. Compared with local Playwright snapshots, Chromatic per-browser baselines and Percy DOM capture; no tool is a UX oracle.

**Evidence boundary:** Actual upstream skills/package/source and primary docs, no live evaluation. Maturity **unchanged** (3.7 overall; 5 agent workflows). Next: seeded BUG/CLEAN PRs across local Playwright, Argos and Chromatic; test false approvals, false positives, missing states, suppressed regressions, cost and sensitive-data leakage.

### 2026-10-23 — Storybook MCP: component manifests are fallible, and plugin setup can change agent instructions
**Question:** When does Storybook's first-party component context help agents reuse UI correctly, and when does generated documentation or the plugin itself create false authority?

**Finding:** The official 10.6 manifests guide treats component metadata as derived from CSF/MDX and docgen, not guaranteed-complete types. A still-open issue (#34710) shows manifest error entries instead of prop documentation; a named-alias issue (#35778) was closed via #36661 on 2026-10-15, so its older reproduction must not be presented as a current unresolved bug. In experimental docgen-server mode, dev JSON manifest endpoints intentionally 404 while the debugger remains available. Current addon source allows no-Origin MCP clients and only requires auth for specific composition configurations; the experimental Codex plugin can update a marked `AGENTS.md` section during setup/upgrade. Agent instructions should **verify manifest errors against source**, protect test side effects and review instruction-file changes.

**Evidence boundary:** Official Storybook docs, canonical addon/plugin source and issue history; no installed runtime or agent benchmark. Maturity stays **5/10 for agent workflows** and **3.7/10 overall**. Next: pinned-version seeded-error/clean-control benchmark for props, latency, testing side effects and design outcomes.

### 2026-10-23 — Accessibility audit skills: no-violation exit codes can conceal untested criteria and active side effects
**Question:** Does a WCAG-oriented Claude Code/Codex audit skill add genuine decision value beyond Playwright+axe, and is its CLI safe to run as an autonomous conformance gate?

**Finding:** Inspected `masuP9/a11y-specialist-skills` (six skills, criterion-specific judgment lines, 22 Playwright/axe checks plus page snapshot, npm 0.16.1) against a thin alternative and official W3C/Playwright guidance. Its distinction between confirmed findings and NT/manual review is useful. However, the CLI exits 0 despite `incomplete`/skipped checks when no violations occur; it runs fresh initial-page contexts rather than a complete authenticated journey; and source-confirmed change/press checks can trigger real autosaves or submissions. A zero exit is **not** WCAG conformance and the all-checks mode belongs on isolated fixtures, not production accounts.

**Evidence boundary:** Inspected actual skill, CLI, input/press check source, package manifest and CI workflow; compared W3C full-page/process requirements and Playwright guidance. No runtime experiment, security audit, agent performance benchmark or maturity-score increase. Next: matched seeded/clean fixtures comparing direct Playwright+axe with the skill, measuring false assurance, manual queue quality, missed states and irreversible side effects.

### 2026-10-23 — INP is next-paint responsiveness, not task completion
**Question:** How should AI coding agents diagnose and repair sluggish interaction without mistaking immediate animation, React scheduling, or a good load score for actual responsiveness?

**Finding:** INP combines input delay, handler processing, and presentation delay; remedies must target the measured phase. The official `web-vitals` attribution build reports changes in worst-case INP, not every interaction, and a visit without eligible interactions has no INP. React Transitions cannot control text inputs; `requestAnimationFrame` runs before paint; `Promise.resolve()` does not create a task boundary. The newer `scheduler.yield()` needs a compatibility fallback, while MDN now deprecates `isInputPending()`. Added an agent-oriented measurement/diagnosis matrix that also preserves honest pending/success semantics and protects telemetry privacy.

**Evidence boundary:** Google Chrome/web.dev, MDN, React and Shopify document mechanics and operational constraints. No field RUM data, cross-browser performance experiment or measured outcome uplift was produced. Frontend maturity remains 3/10. Next: seeded slow-interaction fixtures with input-delay, processing, layout, React-input and async-network variants; compare baseline fixes against phase-aware diagnosis on mobile and desktop, with false-positive/clean controls.

### 2026-10-23 — Consent UX versus actual tracking and jurisdiction-specific exceptions
**Question:** Can an AI agent infer a correct consent experience from “Accept/Reject” button parity, and when does a blanket opt-in rule become wrong?

**Finding:** A consent interface needs independent purpose classification, comprehensible choice/scope, and enforced storage/access behavior. EDPB taskforce and CNIL guidance expose deceptive choice and withdrawal patterns, but the UK's final April 2026 ICO guidance now recognizes narrow statistical and appearance exceptions with a simple free objection rather than consent, subject to strict purpose/data-use limits. France's January 2026 cross-device guidance requires refusal and withdrawal to match the reach of acceptance. A generic “all analytics off until opt-in everywhere” rule is overbroad; a generic “analytics is exempt” rule is dangerous. Added purpose inventory, cross-device scope, and pre-choice/reject/withdraw network-storage test matrix.

**Evidence boundary:** Official regulator guidance (EDPB, CNIL, ICO) establishes jurisdiction-scoped rules and examples, not legal clearance or a verified CMP implementation. No live test, comparative UX experiment or legal review. UX-pattern maturity unchanged (4/10). Next: instrument real CMP configurations for pre-consent calls, refusal persistence, tag-manager races and cross-device propagation; compare UK statistical-exception eligibility against EU country-specific requirements.

### 2026-10-23 — Saved-view filters versus exports and real access control
**Question:** When do filtered screens, shared-view links, exported data and field permissions disagree in ways that can mislead users or expose more than the visible subset?

**Finding:** Airtable's current docs explicitly confirm that temporary URL filters do not restrict the original shared-view dataset and that a viewer's CSV download ignores those added filters; grouped/cover fields and expanded-record settings also defeat assumptions about hidden fields. In contrast, Notion's genuine property-level access rules can make views referencing restricted fields unavailable to recipients, including agents inheriting limited permissions. GitHub Projects documents view-based TSV export; export scope must be checked per product, not generalized. Agents must distinguish authorization, base-view membership, temporary filters and export scope; disclose mismatches and test low-privilege exports and links.

**Evidence boundary:** First-party product behavior/docs (Airtable last updated August 2026, Notion, GitHub) plus an agent-facing implementation/test contract. No exploit or runtime test was performed; these are documented product-specific exceptions, not universal security claims. Distinctive-feature maturity remains **2/10**. Next: test matched view/share/export workflows with actual lower-privilege accounts and permission changes.


### 2026-10-23 — Cascade-layer and scoped-selector boundaries for AI frontend edits
**Question:** When do native `@layer` and `@scope` reduce style regressions, and where can they create false confidence?

**Finding:** Layers order competing CSS *sources* before specificity; `@scope` limits selector matching but not inherited styles. Unlayered normal rules outrank layered normal rules, while important layer order reverses. Scoping proximity resolves only otherwise tied declarations. Tailwind v3 and v4 use materially different `@layer` semantics. Safari 26.0–26.3 had a documented `@scope` form-control regression fixed in 26.4. Agents should inspect built CSS and computed declarations rather than escalating specificity or adding `!important`.

**Evidence boundary:** MDN, Chrome and Tailwind first-party documentation plus a Safari compatibility issue establish mechanics and known pitfalls. Proposed layer architecture and QA matrix are agent synthesis; no empirical agent-output uplift or cross-browser runtime tests were conducted. No maturity-score change. Next: seeded CSS conflict benchmark across layered/unlayered, nested scope, framework version and browser variants.


### 2026-10-23 — Visual-to-source feedback: React Grab versus Agentation
**Question:** Which browser-to-agent feedback tool adds useful source localization and review intent without creating false confidence or unsafe autonomous edits?

**Finding:** React Grab targets immediate rendered-element → source-context lookup; Agentation adds structured human feedback and optional MCP acknowledgment/resolution. A maintainer-associated, reproducible 330-case synthetic retrieval benchmark reports 86% baseline versus 96% for both, with React Grab faster under its accuracy-penalized metric; this does **not** establish superior design, fixes or accessibility. Source-map path failures, Agentation endpoint/subcommand sync traps, clipboard-watcher preemption, local HTTP/CORS trust boundaries and Agentation's PolyForm Shield licensing materially change installation decisions. Prefer explicit copy/annotation first, verified end-to-end sync second, autonomous fix loops only with clear permissions and tests.

**Evidence boundary:** Primary repo source, install/skill/MCP docs, reported GitHub issues and vendor-associated benchmark; one model/trial, synthetic corpus and inconsistent 330/331 published case count. No independent comparison or local install performed. Next: paired source-identification *and verified repair* tasks across real apps, clean controls, remote development and sensitive-data fixtures. Agent-workflow maturity unchanged.


### 2026-10-23 — Safari 27 MCP: actual Safari versus patched WebKit
**Question:** Does first-party Safari MCP provide unique value to coding/design agents beyond Playwright WebKit and Chrome DevTools MCP?

**Finding:** Safari 27's bundled macOS `safaridriver --mcp` exposes 17 documented browser interaction/inspection tools, enabling actual branded Safari reproduction where Playwright's patched WebKit may diverge. It complements rather than replaces cross-browser Playwright regression suites or Chrome-specific tracing. No dedicated iOS-device control, accessibility audit, or CI assertion runner was established from the tool inventory. Local MCP transport does not prevent page content/screenshots reaching the model or browser interactions from causing side effects; use isolated test state.

**Evidence boundary:** First-party WebKit release/tool documentation and Playwright browser documentation establish capabilities and limitations, not superior defect detection. No Mac/Safari execution or benchmark was run. Next: compare actual Safari MCP, Playwright WebKit and manual Safari on seeded Safari-only defects and clean controls, including iOS-only counterexamples. Maturity unchanged.


### 2026-10-23 — shadcn/ui official skill and registry MCP: source-level capability versus semantic overreach
**Question:** Does the official shadcn agent skill/MCP provide unique, safe project-grounded UI implementation guidance beyond direct CLI/docs and component inspection?

**Finding:** Official v4.22.1 source separates a project-aware skill (config, primitive-base-specific patterns, design-system/CLI references) from a seven-tool MCP server that browses registry items and **returns install commands**, not direct installation. Useful conditionally for existing shadcn projects, especially with custom aliases/multiple registries; MCP adds limited value if CLI/docs are already accessible. Inspected skill contains a contradictory categorical `2–7 choices → ToggleGroup` rule despite its own `single choice → RadioGroup` guidance: choose by semantics, not count. Registry Health tests operational availability/schema/installability, not safety or design quality. Universal/GitHub registries can distribute instructions/workflows and transitive dependencies; pin/review payloads before any agent shell installation.

**Evidence boundary:** Official skill/MCP/CLI source, shadcn registry docs, W3C radio/toggle patterns, npm package-script docs. No install, benchmark or AT trial; no score change. Next: compare CLI-only, skill-only and skill+MCP using Base/Radix projects, custom aliases, radio-vs-toggle controls, stale APIs and hostile registry fixtures.


### 2026-10-23 — Figma MCP first-party skills: design handoff versus stale instructions
**Question:** Are Figma's current agent skills a trustworthy, low-friction design-to-code/write-back capability, and can their preflight instructions be treated as authoritative?

**Finding:** Inspected the actively maintained official plugin (2.2.163, updated 2026-10-20) and actual `figma-design-to-code`, `figma-use`, `figma-generate-design`, `figma-code-connect`, and `figma-code-workflows` skills. The workflow usefully distinguishes structured design context, visual reference, production component mapping, editable Figma nodes and runnable code. But the Code Connect skill incorrectly excludes Professional Full/Dev seats relative to Figma's current official help; the repository README's 6/month low-tier limit conflicts with the current 20/month rate-limit page. Current service docs/tool responses take precedence over copied skill/README entitlements. Privileged Plugin API execution, beta write quality, mutable pricing and client allowlisting make this a conditional trial, not a blanket recommendation.

**Evidence boundary:** Direct GitHub source/commit/tree inspection plus Figma developer/help documentation (2026-10-23); no live Figma authorization, install test, output-fidelity benchmark or write-back experiment. No maturity-score change. Next: matched screenshot/context/Code Connect implementation trials with stale mappings, sparse frames, assets and an isolated write-back test.

### 2026-10-23 — Vercel web-design-guidelines skill: checklist versus conformance
**Question:** Can a widely adopted first-party code-review skill safely serve as a frontend UX/accessibility gate?

**Finding:** The Vercel skill fetches a mutable remote checklist and delegates all judgment to the agent; it runs no tests. Primary-source inspection found overbroad keyboard-handler and aria-label requirements, an incorrect equivalence between `content-visibility` and virtualization, a blanket font-loading policy, and a direct contradiction between the full guidelines' `maximum-scale=1` suggestion and the condensed checklist's zoom anti-pattern. Retained a conditional triage workflow and adversarial clean-control test, not an unconditional install recommendation.

**Evidence boundary:** Direct inspection of Vercel's SKILL.md, both guideline variants, W3C and MDN; no model/agent benchmark, install execution or measured uplift. Parent-repo stars are not skill effectiveness. Agent-workflow maturity unchanged. Next: benchmark checklist-driven review against baseline plus browser/AT verification using seeded compliant and defective controls.


### 2026-10-23 — APCA skills and contrast authority
**Question:** Can contrast-checking skills for Claude Code/Codex be trusted as a release gate, and has WCAG 3 adopted APCA?

**Finding:** The September 2026 W3C WCAG 3 draft explicitly leaves its contrast algorithm undecided. Two inspected installable skills illustrate why primary-source checking matters: `apca-cli` correctly calculates a separate WCAG 2 ratio but markets APCA as the WCAG 3 foundation and prioritizes APCA on disagreements; `oklch-skill` reverses APCA sign conventions and misstates WCAG's large-text pixel threshold. Added a WCAG-first dual-metric review contract and documented installer/global-instruction supply-chain risk.

**Evidence boundary:** Direct inspection of skill, CLI, installer and upstream source plus W3C standards/draft; no comparative testing or adoption evidence. Visual-design and agent-workflow scores unchanged. Next: controlled tests with known contrast pairs, alpha compositing, OKLCH/P3, light/dark polarity and browser-verified rendering; assess whether a narrowly scoped contrast skill actually improves agent fixes versus native axe/Playwright workflows.


### 2026-10-23 — RTL and bidirectional content as separate contracts
**Question:** What do coding agents miss when they equate localized strings with a correct right-to-left UI?

**Finding:** Correctness requires independent language (`lang`), direction (`dir`), bidi isolation of dynamic values, logical layout, selective directional-icon mirroring and keyboard/focus validation. Browser-locale emulation alone does not assert application `dir`, translations or interactive behavior. The frontend implementation guide now includes a concrete decision/test contract and W3C/Mozilla/React Aria/Playwright primary references.

**Evidence boundary:** Standards and platform/vendor guidance, not user-outcome or cross-device validation. Frontend maturity unchanged (3/10). Next: paired RTL/LTR E2E tests with mixed-script content and screen readers, including pseudo-RTL vs actual Arabic/Hebrew and keyboard navigation.


### 2026-10-23 — Webfont fallback as a visible typography state
**Question:** Which loading and fallback policies preserve reading flow, brand intent and layout stability under slow or failed font delivery?

**Finding:** The CSS Fonts 4 Working Draft recommends `fallback` for long body text while Next.js defaults to `swap`; neither is a universal winner. Design and test first-paint fallback, metric matching, browser support, selective preload and multilingual glyph coverage rather than assuming a loaded-font screenshot or framework defaults are sufficient.

**Evidence boundary:** W3C draft, MDN, web.dev and Next.js establish proposed semantics, platform mechanics and framework defaults, not comparative user outcomes. Visual-design maturity stays 3/10. Next: matched cold-network trials of `swap` + calibrated fallback, `fallback`, `optional` and system-only, including CLS/LCP and reading/task continuity.


### 2026-10-18 — Figma Code Connect v2 design-to-code handoff
**Question:** Can Figma's official Code Connect skill give AI agents trustworthy production-component mappings, and which version/verification traps matter?

**Finding:** Code Connect binds published design components to real code, but does not verify rendered fidelity. CLI v2.0.0 (2026-08-18) ended normal publishing support for legacy parser files; v2.0.2 (2026-10-14) documents limited Professional-plan publishing despite older official skill/Help gating. Use parserless templates, preview representative variants, verify Dev Mode and the rendered app. The official skill's source read-back is not a runtime check.

**Evidence boundary:** Figma's own source/changelog establishes mechanics and version changes; individual issue reports show possible failure modes, not prevalence. No paired agent trial proves uplift. Design-systems maturity remains DEVELOPING / 4/10. Next: benchmark no mapping vs simple mapping vs templates on hallucinated props, variants, stale mappings and visual QA.


### 2026-10-15 — Dark themes as semantic and accessible reading conditions
**Question:** How should AI agents implement dark mode without conflating system color-scheme behavior, WCAG contrast, user comfort, and forced-colors accessibility?

**Finding:** Use semantic light/dark token pairs and test rendered surfaces, focus states, browser-painted controls, images, and forced colors independently. WCAG 2.2 ratios remain the conformance baseline; APCA is not a WCAG 3 substitute because the September 2026 working draft has not selected a contrast algorithm. Platform guidance differs on manual theme overrides, and reading-polarity studies conflict when luminance is controlled.

**Evidence boundary:** W3C/MDN establish standards/platform mechanics; Apple/Material/Carbon provide production conventions; task-specific studies do not prove universal theme superiority. Broad visual-design maturity remains WEAK and 3/10. Next: test mixed-mode embeds, forced-colors regression and measured reading performance.




### 2026-10-10 — File-upload lifecycle and accessible recovery
**Question:** When does selecting or transferring a file become a successful upload, and what feedback/recovery must survive errors and long transfers?

**Finding:** Treat selection, measured transfer, server processing and accepted/usable as separate states. Keep the native picker as the accessible fallback to optional drop zones; use specific per-file errors and partial-batch recovery; reserve “Uploaded” for confirmed server acceptance. Resumability requires a real server/client protocol, not just progress UI.

**Evidence boundary:** GOV.UK, HMRC and USWDS provide production pattern guidance; MDN and tus define browser/protocol mechanics; OWASP defines server-validation boundaries. No comparative task-outcome evidence or maturity-score change. Next: test partial failures, screen-reader status, refresh/resume, and transfer-complete-but-server-rejected cases.


### 2026-10-09 — Notification persistence, timing and announcement
**Question:** When may an informational toast disappear, and when must feedback persist or demand an explicit response?

**Finding:** WCAG 2.2.1 explicitly allows a short-lived toast when the same information/function remains available elsewhere; a fixed five-second duration alone does not make unique actions or important messages accessible. Separate routine status (`status`), urgent non-interrupting-focus announcements (`alert`), persistent actionable notifications, and truly blocking alert dialogs. Carbon's current actionable toast guidance differs from its older v10 warning; React Aria provides one focus/timer model, not a universal keyboard convention.

**Evidence boundary:** W3C standards/APG and current Carbon/React Aria documentation establish implementation and timing contracts, not measured task outcomes. No broad UX maturity-score change; comparative user/AT trials remain open.

### 2026-09-30 — Scroll-driven timelines vs discrete scroll state
**Question:** When should agents use native scroll-driven animations or scroll-state queries instead of JavaScript scroll tracking?

**Finding:** Use scroll/view timelines when a presentational effect is genuinely a continuous, reversible function of scroll progress; use scroll-state queries when the requirement is discrete such as stuck/scrollable/snapped state. Keep application/domain state out of scroll plumbing unless scrolling truly changes that state. Native CSS removes main-thread JavaScript tracking for these visual effects, but that performance capability does not justify adding motion. The no-animation path must remain complete, and reduced-motion handling remains mandatory for non-essential scroll-linked movement.

**Evidence boundary:** MDN documents current platform behavior and the performance architecture of CSS timelines; existing W3C/MDN reduced-motion guidance establishes the accessibility boundary. This cycle found no strong outcome evidence that scroll-linked animation itself improves comprehension or task success.


### 2026-09-30 — Purposeful motion, reduced motion, and view transitions
**Question:** How should agents decide when interface motion is useful, how should reduced-motion variants preserve meaning, and which current web primitives are safe to build on?

**Finding:** Motion should earn its cost by communicating state, causality, spatial relationship, feedback, continuity, or progress. Reduced motion is a semantic interaction variant rather than a blanket late-stage disable: preserve the information while removing or replacing problematic spatial movement. `prefers-reduced-motion` is broadly available; W3C documents it as a sufficient technique for non-essential interaction-triggered motion. The View Transition API now provides current-platform primitives for SPA/MPA continuity and skippable transitions, but animation remains progressive enhancement and application state/focus/history must stay correct without it.

**Evidence boundary:** W3C establishes accessibility requirements/techniques; MDN establishes platform availability and API behavior; Apple independently supports intent-driven motion and adaptation for Reduce Motion. These sources do not justify universal durations/easings or claims that animation always improves comprehension or perceived performance.


### 2026-09-30 — Loading, progress, empty, and error states
**Question:** How should products represent asynchronous loading, progress, empty, stale, and failure states without destroying context or creating misleading feedback?

**Finding:** Model asynchronous UI as explicit states, preserve useful existing content during background work, scope blocking to what is actually unavailable, and choose skeleton/spinner/progress from the information the system truly has. Skeletons are best justified as structural placeholders that reserve expected geometry; determinate progress requires trustworthy progress. Empty and error states are semantically different. Dynamic waiting/progress/result/error messages need accessible status semantics without unnecessary focus movement.

**Evidence boundary:** W3C defines status/progress accessibility behavior; Carbon and Atlassian independently provide mature production pattern guidance; MDN supplies platform semantics/rendering capabilities. This cycle found no strong basis for a universal wait-time threshold or for claiming skeletons always improve perceived speed.


### 2026-09-30 — Search, filtering, and result-set orientation
**Question:** How should search, filtering, result state, and pagination work together so users stay oriented and can recover?

**Finding:** Treat them as one result-set control system. Applied constraints need a visible summary outside potentially hidden controls; result changes need clear state/count feedback; zero results need explicit recovery; filtering/sorting applies to the whole set and resets pagination. Explicit Apply versus live filtering is conditional: choose from task shape, latency, stability, and accessibility rather than assuming either is universally superior. Pagination remains a robust default for goal-directed retrieval; automatic infinite scroll has accessibility/location costs.

**Evidence boundary:** Baymard supplies behavioral ecommerce evidence for applied-filter visibility. GOV.UK, MOJ, DWP, and Home Office provide deployed public-service/accessibility guidance. W3C defines dynamic status-message requirements. Commerce-specific prevalence and public-service conventions are not universal outcome evidence.


### 2026-09-30 — Agent-readable design systems and bounded creativity
**Question:** How should an agent-readable design system preserve coherence without forcing every generated page into the same composition?

**Finding:** Separate invariants from degrees of freedom. Semantic role-based tokens, component contracts, accessibility/state behavior, and theme relationships should be stable; composition, density, imagery, and selected expressive choices can remain bounded freedoms. Tokens are infrastructure rather than the whole system: agents also need component usage, composition rules, representative references, and explicit permission boundaries. The stable DTCG 2025.10 format now provides a vendor-neutral machine-readable token layer, while Apple and Carbon independently support semantic role-based styling across contexts.

**Evidence boundary:** DTCG, Apple, and Carbon establish mature design-system mechanics; Anthropic shows current product adoption of reusable design-system grounding for AI design workflows. Comparative evidence about which artifact mix best improves agent output is still missing.


### 2026-09-30 — Risk-shaped autonomy and recovery for agents
**Question:** Which AI-native interaction patterns best preserve control, feedback, provenance, approval, and recovery without creating approval fatigue?

**Finding:** Oversight should be proportional to consequence and reversibility. Low-risk work can run autonomously inside narrow capability boundaries; consequential side effects deserve concrete approvals; irreversible/high-blast-radius work needs stronger confirmation plus technical containment. Long-running agents need layered progress and post-run records, while reversible automation should favor visible undo. Denials should preserve safe progress and recover through a lower-risk path where possible.

**Evidence boundary:** Anthropic telemetry supplies product-specific evidence for approval fatigue and sandboxing; OpenAI independently recommends approvals around side effects; Microsoft agent guidance and HAX support inspectability, human control, and undo. Exact thresholds remain product/domain-specific.

### 2026-09-30 — 2026 trend signal vs real product adoption
**Question:** Which current UI/UX trends have evidence of real product adoption rather than showcase-only popularity?

**Finding:** Trend evidence must be tiered. 2026 creative sources consistently signal a reaction against generic AI polish toward tactile/human-specific expression, but that remains mainly creative/commercial evidence. By contrast, infinite canvas is demonstrably shipped in creation/diagramming products, and contextual human-agent work surfaces are now shipped by products including Linear and Notion. Product adoption still does not prove superior UX. A four-level evidence ladder now separates showcase signal, commercial creative signal, product adoption, and measured behavior/outcomes.

**Evidence boundary:** Webflow and Adobe support current creative momentum; Canva, Linear, Notion, and Webflow product materials support adoption claims. This cycle did not find controlled comparative outcome evidence for the aesthetic trends.

### 2026-09-30 — Claude frontend context and evaluation workflow
**Question:** What context and workflow most improves frontend output from Claude/AI coding agents?

**Finding:** Current Anthropic evidence supports a brief-grounded design contract before coding, explicit criteria for coherence/originality/craft/functionality, rendered-browser evaluation rather than code-only review, and an independent skeptical evaluator for sufficiently difficult subjective work. Claude Code now directly supports AGENTS.md in current versions, while modular/path-scoped rules and skills can reduce always-on context noise. Claude Design also reinforces preserving design intent and design-system context in handoffs.

**Evidence boundary:** Mostly first-party Anthropic engineering and product evidence. Strong for Claude workflow design; insufficient to claim universal user aesthetic preference or cross-model superiority.

## Sections needing review
Foundations, distinctive features, and cross-model anti-generic guidance remain weak. Frontend implementation is now developing after container-responsive and scroll-driven CSS guidance, but still needs broader native UI primitives, semantic HTML patterns, performance, testing, and framework integration. Interaction/motion now has an operational baseline for purposeful transitions and reduced-motion behavior, but still needs direct-manipulation patterns and measured outcome evidence. UX patterns are now developing after form/error-recovery, search/filter/result-set, and loading/empty/error-state coverage, but onboarding, tables, settings, dialogs, and other common interactions remain. Design systems now have an operational architecture but still need comparative agent-output validation and richer component/composition examples. Trend evidence classification is now usable but should be expanded only with meaningful new evidence.

## Research selection rule
Prefer a focused question that can improve one or two files substantially. Avoid broad “research UI/UX” passes.

Do not infer maturity from recency or number of completed cycles. A topic already researched several times may still be the best target when important contradictions, edge cases, implementation failures, alternatives, or evidence gaps remain.

Balance:
- weak areas that need foundational coverage;
- developing areas that need depth and competing perspectives;
- mature areas that deserve periodic adversarial revalidation.

For broad domains, prefer multiple investigations over time from different angles rather than attempting to “finish” the area in one or a few runs.

A useful research cycle does not need to raise a score.
