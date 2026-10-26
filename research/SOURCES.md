# Source Registry

## Virtualized collections: positions, focus, and window boundaries (2026-10-26)
- **Standards and authoring guidance:** https://www.w3.org/WAI/ARIA/apg/practices/grid-and-table-properties/ — rowcount includes header rows; rowindex on each rendered row; colindex per cell for noncontiguous columns; unknown total -1. https://www.w3.org/TR/wai-aria-1.3/ — activedescendant MUST resolve to an accessibility descendant (or qualifying controlled popup); partial list/listbox sets use posinset/setsize. ARIA is normative; APG is authoring guidance.
- **Independent implementation perspectives:** https://www.ag-grid.com/javascript-data-grid/accessibility/ — recommends DOM order and sometimes pagination with virtualization disabled, documents sticky/grouped/pinned and unknown server row-count limitations. https://react-spectrum.adobe.com/ListView — row keyboard-navigation model with interactive-field alternative. https://tanstack.com/virtual/latest/docs/api/virtualizer — scrollToIndex is positioning plumbing, not automatic focus/ARIA semantics.
- **Isolated Chromium fixture:** Chromium 144.0.7559.96/Linux, Playwright Python, 3 repeated runs 2026-10-26. Removing a focused button's parent row dropped `document.activeElement` to BODY; focusing mounted successor before removal preserved BUTTON focus. Removing referenced `#opt-2` left the listbox's `aria-activedescendant=opt-2` DOM attribute but removed its resolved relation from CDP `Accessibility.getFullAXTree` (present beforehand). Not a real virtualizer, Firefox/WebKit/AT test, performance benchmark or user study.

## CSS soft-wrap: composition and engine-specific trade-offs (2026-10-26)
- **Standards / platform:** https://drafts.csswg.org/css-text-4/ (CSS Text Level 4 editor's draft, 2026-08-14; user-agent discretion); https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-wrap (shorthand and `wrap`/`balance`/`pretty`/`stable`); https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-wrap-style (inherited style, Chromium/Firefox line limits, performance/editing caveats). Reviewed 2026-10-26.
- **Independent engine perspectives:** https://webkit.org/blog/15383/webkit-features-in-safari-17-5/ (2024-05; WebKit's unlimited balancing vs Chromium/Firefox limits at that time); https://webkit.org/blog/16547/better-typography-with-text-wrap-pretty/ (2025-04-08; `balance` can narrow a headline and WebKit's `pretty` differs from Chromium); https://webkit.org/blog/17333/webkit-features-in-safari-26-0/ (Safari 26 shipped `pretty`); https://web.dev/learn/css/typography (Chrome team's guidance). Algorithms and thresholds are version-dependent.
- **Controlled browser fixture:** Two matching runs on Chromium 144.0.7559.96/Linux/Playwright, Arial 28px, line-height 1.25; per-character `Range.getBoundingClientRect()` grouped by line. At 430px a three-line English heading had rounded ink widths `wrap` 403/380/59px, `balance` 252/269/321px, `pretty` 319/381/142px. A longer sample at 430px/eight lines had identical `balance` and `wrap`; at 580px/six lines `balance` changed breaks. `pretty` improved a last line from 70px to 117px at 430px/eight lines but did not guarantee a balanced last line. No Safari/Firefox runtime, other fonts, real users, screen readers or performance measurement.

## UI UX Pro Max: constraint negation and style-dial source audit (2026-10-26)
- **Canonical upstream / current skill:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill ; https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/skill.json (v2.15.0 at inspection); https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/SKILL.md (explicit query-contract verification, no claim of automated contradiction resolution). MIT, unarchived; popularity is an adoption signal only.
- **Deterministic predicates:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/src/ui-ux-pro-max/scripts/reasoning_contract.py — `CONDITION_PATTERNS` matches keyword boundaries but not negation, and `apply_decision_rules` applies every triggered action. https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/src/ui-ux-pro-max/data/ui-reasoning.csv — actual Educational App `if_gamification → add-progress-animation`, Photography Studio `if_booking → add-calendar-system`, Personal Finance Tracker `if_light_mode_needed → provide-theme-toggle`. Source-equivalent predicate probes of negative requests activated the first two actions. This is **not** a full generator or agent execution.
- **Dark/variance hazards:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/src/ui-ux-pro-max/scripts/design_system.py — `_query_wants_dark` performs positive substring matching (so “no dark mode” matches), and high `--variance` prepends Brutalism to style priorities before `_select_best_match` resolves the first valid canonical row. https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/src/ui-ux-pro-max/data/styles.csv — Brutalism is active and explicitly cautions against conservative/professional contexts. Neither code path proves actual agent compliance or user harm.
- **Installer / distribution:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/cli/src/commands/init.ts — default bundled template path, networked GitHub release path under `--legacy`; `--dry-run` available. https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/cli/package.json (2.5.0 source) differs from top-level `skill.json` (2.15.0): inspect pinned npm artifact rather than assuming release parity. No package installation or security execution in this cycle.
- **Independent evaluation framing:** https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex — test skill trigger specificity, script enforcement, preservation of project conventions and regressions. Next: full pinned runtime, agent-output comparisons and adversarial forbidden-feature prompts.

## Passkeys: conditional create versus conditional get (researched 2026-10-25)
- **Normative draft, not universal implementation:** https://www.w3.org/TR/webauthn/ — registration `mediation:conditional` requires recently mediated same-origin authentication and user consent; server registration step 15 skips UP only for conditional, step 16 still verifies UV when required. https://www.w3.org/TR/2026/WD-credential-management-1-20260903/ — earlier consent and recent mediation can permit non-modal creation; conditional *get* remains a user-selected autofill interaction.
- **Capability and platform split:** https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/getClientCapabilities_static ; https://passkeys.dev/docs/reference/terms/ ; https://passkeys.dev/device-support/ — `conditionalCreate` is a client capability, not assurance that a particular OS/provider/account can upgrade. Chrome desktop 136 (2025-05-09) https://developer.chrome.com/blog/passkey-automatic-upgrades ; Chrome Android 142 (2025-10-08) https://developer.chrome.com/blog/automatic-passkey-creation-android . Both document provider-controlled opt-out/confirmation; do not infer all providers behave alike.
- **Implementation check:** https://simplewebauthn.dev/docs/packages/browser/ (v14 `useAutoRegister:true`, optional UP=0, opportunistic errors); https://github.com/MasterKale/SimpleWebAuthn/blob/master/packages/server/src/registration/verifyRegistrationResponse.ts (`requireUserPresence` and `requireUserVerification` independent, both default true); https://developers.google.com/identity/passkeys/developer-guides/server-registration (verify origin/RP/challenge/algorithm and UV if required).
- **Outcome evidence and confounding:** https://web.dev/case-studies/adidas-passkeys (last updated 2026-03-10) reports 47% creation, +8% Conditional Create creation uplift, >99% initiated passkey sign-in success and <0.3% orphan errors **alongside** Signal API/ROR and opt-in paths; no randomized control or comparable password cohort established. https://developer.chrome.com/blog/passkeys-signal-api ; https://simplewebauthn.dev/docs/packages/browser/ — signal delivery is best effort and does not prove provider cleanup.
- **Adversarial exception:** https://github.com/w3c/webauthn/issues/2295 (OPEN, comments through 2026-08-02): reported Safari/iOS 18.5 `userVerification:"required"` conditional-create mismatch; no local replication or claim about Safari 27. Normative UP/UV checks must not be conflated.

## Target size: rendered geometry and axe rule coverage (2026-10-25)
- **Normative:** https://www.w3.org/TR/WCAG22/#target-size-minimum ; https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum — AA 24 CSS px axis-aligned square or five exceptions, circle spacing, clipped/irregular targets, mixed-size neighbors and 20px+4px example. Enhanced 44px criterion is AAA.
- **Pinned implementation and selection precedence (source-checked 2026-10-25):** https://github.com/dequelabs/axe-core/blob/v4.14.0/lib/rules/target-size.json — `enabled:false` with `wcag22aa`/`wcag258` tags; https://github.com/dequelabs/axe-core/blob/v4.14.0/lib/core/utils/rule-should-run.js — explicit rule ID > `rules[id].enabled` > matching tag > enabled default; https://github.com/dequelabs/axe-core/blob/v4.14.0/lib/core/utils/normalize-run-options.js — validates/normalizes tag/rule selection; https://github.com/dequelabs/axe-core/blob/v4.14.0/lib/core/base/audit.js — delegates rule selection to `ruleShouldRun`. Exact pinned function executed in isolated JS harness with stub audit exclusions: default **false**, `wcag22aa` tag **true**, `wcag21aa` only **false**, explicit rule ID **true**, explicit `enabled:true` **true**, tag+explicit `enabled:false` **false**. **Not** full axe/browser execution; no verdict on detection precision or performance. Release 2026-10-05: https://github.com/dequelabs/axe-core/releases/tag/v4.14.0 ; API: https://github.com/dequelabs/axe-core/blob/v4.14.0/doc/API.md ; older algorithm guide: https://dequeuniversity.com/rules/axe/4.10/target-size .
- **Maintenance:** https://github.com/dequelabs/axe-core/issues/5225 (open default-enable epic, 7/9 subissues complete at inspection 2026-10-25); https://github.com/dequelabs/axe-core/issues/5389 (performance subissue **closed** 2026-10-20); https://github.com/dequelabs/axe-core/issues/5183 (open fixed-position-ancestor off-viewport regression, reported in 4.11.3, scoped by maintainer; no 4.14 reproduction).
- **Agent testing:** https://playwright.dev/docs/accessibility-testing — official sample's WCAG tags stop at 2.1; inactive UI states require explicit reveal, automated tests are not full WCAG conformance.
- **Independent limited browser fixture:** Chromium 144.0.7559.96/Playwright Python 2026-10-25: 24px normal button had 24px rect and near-edge hit; `scale(.5)` retained computed 24px but 12px rendered rect; `clip-path:inset(4px)` kept 24px rect but near-edge point missed and center hit. Sampled points only, **not** axe runtime, multi-engine or real touch evidence.

## Comparison workspaces: mobile tension and semantic-difference safety (2026-10-25)
- **Research on fit and content:** https://www.nngroup.com/articles/comparison-tables/ (2024-02-09; static vs dynamic, small-set compensatory decisions, five-item heuristic, missing data, scan structure, conditional mobile alternatives); https://baymard.com/research-articles/provide-comparison-features (2022-09-06; 67% use in spec-driven research, 17% benchmark gap, 3/38 mobile users across two sites and one illustrated 51%-viewport tray; do not generalize the small mobile sample); https://baymard.com/research-articles/user-friendly-comparison-tools (2022-10-19; differences toggle, grouping, persistent identities and row styling). NN/g supports retaining some mobile compare when feasible; Baymard questions ROI of *new* mobile compare; this is a **context-dependent evidence tension**, not a universal rule.
- **Data integrity update:** https://baymard.com/blog/product-spec-sheet-ux-design (2026-09-24; same-category label/unit consistency, 30% of benchmarked sites with severe spec inconsistency; commerce benchmark, not all domains). Typed equality, distinct missing-value states, price freshness and retaining disqualifying shared rows are **agent synthesis**, not direct findings of these studies.
- **Normative accessibility:** https://www.w3.org/WAI/tutorials/tables/two-headers/ ; https://www.w3.org/WAI/tutorials/tables/multi-level/ (semantic row/column headers, complex associations); https://www.w3.org/WAI/WCAG22/Understanding/reflow (table/grid exception does not excuse cell or surrounding UI reflow); https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum (24 CSS px or exception, not a universal 7mm requirement). No cross-browser/AT, production data-model or comparative mobile user test performed.

## 21st MCP / CLI / agent skills: migration, trust and provenance (2026-10-25)
- **Current vendor surface and limits:** https://21st.dev/mcp (12,000+ vendor catalog claim, search/retrieval quota, AI separately enabled, current plugin routes); https://github.com/21st-dev/magic-mcp/blob/main/README.md and https://github.com/21st-dev/magic-mcp/blob/main/src/index.ts (v0.2.3 is a serial stdio→hosted HTTP proxy, legacy aliases, API key and `MCP_URL_21ST` override); https://github.com/21st-dev/magic-mcp/blob/main/LICENSE (ISC). Hosted server source and tool internals **not** independently audited.
- **Skills / install behavior:** https://github.com/21st-dev/skill (Apache-2.0 seven-skill pack); https://github.com/21st-dev/skill/blob/main/skills/21st-cli-use/SKILL.md (search-before-build and auto-trigger on `components.json`, `21st add` dependencies); https://github.com/21st-dev/skill/blob/main/skills/21st-ui-build/SKILL.md (project-first integration); https://github.com/21st-dev/skill/blob/main/skills/21st-ui-explore/SKILL.md (meaningful variant axes); https://github.com/21st-dev/skill/blob/main/skills/21st-ui-review/SKILL.md (`review --fix` but no benchmark); https://github.com/21st-dev/skill/blob/main/skills/21st-design-sync/SKILL.md (public theme publishing); https://github.com/21st-dev/skill/blob/main/skills/21st-registry/SKILL.md (publish default). No skill-trigger or review-accuracy experiment.
- **Current CLI source gap:** https://github.com/21st-dev/cli/blob/main/package.json (public GitHub v0.0.29, legacy installer) versus https://www.npmjs.com/package/@21st-dev/cli (npm v1.18.0 observed 2026-10-25). Do **not** infer the current npm binary's behavior from that stale GitHub tree; tarball was not inspected or executed.
- **Rights, privacy and threat model:** https://21st.dev/terms (July 20, 2026; independent rights in previews, redistribution restrictions, author rights); https://21st.dev/privacy (April 26, 2026; submitted prompts/code and platform traces, no-training-without-consent statement); https://ui.shadcn.com/docs/registry/github (review/pin/preview external registry items); https://github.com/21st-dev/magic-mcp/issues/46 (old-backend prompt-injection report closed after migration, not proof of current fix); https://cornucopia.owasp.org/cards/AAI7 (untrusted tool output). Vendor documentation + direct public-source inspection; no live service, client or outcome testing.

## Customizable native select: stale clone versus submitted value (2026-10-25)
- **Official mechanics/compatibility:** https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select (rich markup, inert select button, fallback, SSR caveat); https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/selectedcontent (cloning only on selection changes); https://developer.chrome.com/blog/a-customizable-select (Chrome 135; native mobile picker and intrinsic-width tradeoffs); https://webkit.org/blog/18325/webkit-features-for-safari-27-0/ (Safari 27, Sep 2026); https://web-platform-dx.github.io/web-features-explorer/features/customizable-select/ (Firefox unsupported as of 2026-10-25).
- **Accessibility/standards:** https://webkit.org/blog/18117/the-golden-rule-of-customizable-select/ (2026-06-15, option text labels required for AT and classic fallback); https://github.com/whatwg/html/issues/12328 (open, interactive descendants of options prohibited but error handling unsettled). Platform guidance, not evidence of better task outcomes.
- **Local three-run falsification, 2026-10-25:** Playwright Python 1.57 / Chromium 144.0.7559.96, `page.set_content`, `appearance:base-select` on select and picker, `<button><selectedcontent>`. Editing the selected option label did not update the displayed clone until selection changed. With `<option><span aria-hidden>★ </span><span>Basic</span></option>` and no `value`, `FormData` submitted `★ Basic`; after label mutation it submitted `★ Renamed` while `selectedcontent` still displayed `★ Basic`. Explicit `value="basic"` kept submission stable. No Safari/Firefox, actual mobile/AT, framework hydration, or user tests.

## Text spacing and visually hidden clamp overflow (2026-10-25)
- **Normative requirement:** https://www.w3.org/TR/WCAG22/#text-spacing ; https://www.w3.org/WAI/WCAG22/Understanding/text-spacing — simultaneous user spacing overrides, no loss; not a requirement to use those values as defaults. Script-dependent exceptions.
- **Implementation and counterexamples:** https://www.w3.org/WAI/WCAG22/Techniques/failures/F104 (updated 2026-01-12; constrained/clipped/overlapping text); https://www.w3.org/WAI/WCAG22/Techniques/css/C36 (expanding paragraphs, responsive-layout retest); https://www.w3.org/WAI/WCAG22/Techniques/css/C35 (short nonwrapping content, approximate 20% width heuristic); https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/line-clamp (unprefixed limited availability, prefixed legacy combination and clipping behavior).
- **Local reproducible fixture (2026-10-25):** Playwright Python + `/usr/bin/chromium` 144.0.7559.96, three 260px-wide cards with identical 16px Arial text fitting two 24px lines before override. Applied `line-height:1.5`, `letter-spacing:.12em`, `word-spacing:.16em`, `p{margin-bottom:2em}` together: fixed hidden and two-line prefixed clamp measured 48px rendered paragraph vs 72px scrollHeight; auto-height expanded to 72px; a wired disclosure removing clamp restored 72px. No screen-reader, Firefox, Safari, user outcome or formal conformance test. **Not a general claim that all clamping violates WCAG**; accessible full-content alternatives matter.


## Reduced transparency is an opaque-material contract, not a blur toggle (2026-10-25)
- **Standard / browser availability:** https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-transparency (independent user preference); https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency (limited availability; Chromium 118+, Firefox flag, Safari 27 absent); https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter (filter acts on *backdrop*, requires transparency to be visible).
- **Platform counterexample:** https://developer.apple.com/documentation/swiftui/environmentvalues/accessibilityreducetransparency (native OS setting explicitly calls for opaque backgrounds); https://developer.apple.com/design/human-interface-guidelines/materials (Apple system materials adapt to transparency/contrast preferences, not a guarantee for authored web glass); https://www.w3.org/WAI/WCAG21/Techniques/general/G18 (text/background contrast must be checked in rendered context).
- **Local experiment:** Linux headless Chromium 144 + Playwright Python, 2026-10-25, striped dark/light background with 192×90px panels and `rgba(255,255,255,.3)`. CDP media emulation: blur-only removal and element-opacity-only change both retained 156 max RGB-channel variation between 24px-spaced pixels; opaque white background + blur removal yielded 0. Separate contrast/forced-colors/motion media emulation did not imply reduced transparency. Geometry, colors and emulation are a *fixture*, not universal values or OS/AT validation. Open questions: real device setting propagation and legibility outcomes.

## Safari MCP first-party versus real-profile community tooling (2026-10-25)
- **Apple official:** https://webkit.org/blog/18136/introducing-the-safari-mcp-server-for-web-developers/ (2026-07-01: 17 named tools, stdio setup for Claude/Codex, page/network/screenshot/JS access, local server but captured content passed to the connected agent); https://webkit.org/blog/18325/webkit-features-for-safari-27-0/ (2026-09-17: Safari 27 stable shipping, actual Safari QA). Apple says no access to personal Safari AutoFill/history; this does **not** certify the downstream agent's privacy or forbid state-changing page actions.
- **Independent primary implementation evidence:** https://github.com/Anglesite/Anglesite/blob/main/docs/superpowers/specs/2026-09-04-safari-mcp-transport-spike.md (2026-09-04: captured real `safaridriver --mcp` stdio handshake, 17 tools and stdio-only transport, plus optional third-party proxy; single developer report, not a security audit).
- **Community source inspected at 2026-10-25:** https://github.com/achiya-automation/safari-mcp (MIT, unarchived, ~224 stars, pushed 2026-10-25; metadata is activity/adoption only); https://github.com/achiya-automation/safari-mcp/blob/main/package.json (v2.22.18, Node >=20, macOS, postinstall, dependencies); https://github.com/achiya-automation/safari-mcp/blob/main/scripts/postinstall.cjs (may re-sign Swift helper via `codesign`); https://github.com/achiya-automation/safari-mcp/blob/main/SECURITY.md (claims no ports/data leaving); https://github.com/achiya-automation/safari-mcp/blob/main/docs/http-transport-design.md (optional localhost HTTP mode; document notes a corrected shared-session tab-pointer bug); https://github.com/achiya-automation/safari-mcp/blob/main/ownership-match.js and https://github.com/achiya-automation/safari-mcp/blob/main/ownership-state.js (owned URL/marker/TTL, opt-in user-tab adoption). A local-only server cannot control whether its MCP client transmits captures to a remote model. Source-level contradiction is not proof of exploit.
- **Alternative / boundary:** https://github.com/citrolabs/safari-browser-use (MIT, ~10 stars, last pushed 2026-09-24; existing-tab Apple Events plugin/skill that itself advises official Safari MCP for Safari 27). No local Mac execution, live permission test, cross-agent output evaluation or independent CPU benchmark; do not repeat the community package's “60% less CPU” as established fact.


## Chat/feed scroll anchoring versus tail-following (2026-10-25)
- **Standards and browser mechanics:** https://drafts.csswg.org/css-scroll-anchoring/ (anchor selection, excluded subtrees, suppression triggers, zero-offset condition); https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_anchoring/Overview (default behavior, opt-out irreversibility for descendants); https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-anchor (Baseline Newly Available September 2026); https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight (integer dimensions versus fractional `scrollTop`, tolerance); https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop (negative offsets with column-reverse, Safari overscroll). Standards specify browser behavior, **not** application follow policy.
- **Current production library contract:** https://tanstack.com/virtual/latest/docs/chat and https://tanstack.com/virtual/latest/docs/api/virtualizer — normal-order chat, stable IDs, end anchor, conditional append following, stream-height measurements, end threshold and user-scroll cancellation. https://github.com/TanStack/virtual/issues/1258 (open report 2026-08-24: `paddingEnd` versus end-distance during streaming; issue reproduction uses 3.14.10); https://github.com/TanStack/virtual/issues/1271 (2026-09-08 append+trim bug **closed 2026-09-11** via #1272). These are source-reported cases, not independently rerun package regressions.
- **Accessibility:** https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA23.html (named sequential `role=log` and polite append announcements); https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/log_role (role intended for meaningful sequential append, not arbitrary reordering). Actual screen-reader/virtualized-history delivery remains untested.
- **Isolated reproduction:** Linux headless Chromium **144.0.7559.96** via Playwright Python using system browser, 300px pane, 20 × 60px rows and 1px sentinel. At `scrollTop=600`, prepend 3 rows: default native anchor => **780** and same row y=0; `overflow-anchor:none` on scroller => **600** and row y=180; descendant `auto` did not restore it; extra manual +180 on default => **960**. At original bottom `scrollTop=901`, append 3 rows: default => 901 despite max 1081; exclude message subtree but retain visible end sentinel => **1081**; same sentinel technique failed to preserve mid-list row position on prepend. No Firefox/WebKit, React/virtualizer integration, OS touch, screen-reader or user study. Do not infer generalized compatibility from this one engine.

## Focus occlusion: scroll-padding does not add scroll range (2026-10-25)
- **Normative/accessibility:** https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum (AA: component not entirely hidden by author content, with user-opened dismissibility exception); https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced (AAA: no part hidden); https://www.w3.org/WAI/WCAG22/Techniques/css/C43 (explicitly combines physical `html` padding and scroll-padding under fixed footer); https://www.w3.org/WAI/WCAG22/Techniques/css/C34 (unfix bulky sticky UI on short/narrow viewports); https://www.w3.org/WAI/WCAG22/Techniques/failures/F110.html (keyboard navigation in both directions).
- **Mechanism:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-padding (scrollport optimal viewing region, non-inherited, any scroll container); https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView (scroll-margin and alignment); https://github.com/w3c/csswg-drafts/issues/5066 (closed historical request about focus-driven scrolling and scroll-padding; do not label it an open bug).
- **Local reproduction:** Chromium **144.0.7559.96**, Playwright Python, Linux headless, 600×600. Fixed 180px footer at y=420; 1200px body, final 36px button y=1154. With only root `scroll-padding-bottom:180px`, `focus()` reached scroll max 600 but left button at y=554–590, entirely under footer. Add physical `html{padding-bottom:180px}`: max scroll 780, focus button y=374–410, clear. At midpage y=530, root scroll-padding corrected Tab/focus to y=192–228; without it, button remained y=530–566 under footer. Inner `overflow:auto` scroller ignored root-only scroll-padding; own 180px scroll-padding moved focus to y=192–228. `focus({preventScroll:true})` bypassed scrolling. Separate `scrollIntoView({block:'nearest'})` had different alignment from `focus()` and, without scroll-padding, could leave target covered despite physical padding. No Firefox/WebKit, real AT, zoom/device or product outcome measurements; rectangle overlap is a proxy for visible occlusion, not a complete WCAG audit.


## Dialog dismissal: first-party guide contradicted by native behavior (reviewed 2026-10-25)
- **Normative:** https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element (WHATWG Living Standard updated 2026-10-22; `closedby` any/closerequest/none, auto modal vs non-modal defaults, `requestClose` cancel path, danger of manually removing `open`); https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ (focus placement/return and modal keyboard semantics). The APG is design guidance, not a browser interop test.
- **Skill counterexample:** https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/light-dismiss-a-dialog.md — guide mandates `showModal()` and says not to use `closedby` with `show()`; its no-backdrop rationale does not imply no light-dismiss behavior. This is a source-level error in a *single guide*, not an overall skill score.
- **Support and API:** https://web-platform-dx.github.io/web-features-explorer/features/dialog-closedby/ (Chrome 134+, Firefox 141+, Safari/iOS Safari unsupported, Interop 2026); https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/requestClose (Baseline Newly Available 2025, cancelable `cancel` versus `close()`); https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event ; https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog (non-modal/popover alternative).
- **Open spec/implementation contradiction:** https://github.com/whatwg/html/issues/12482 (opened 2026-05-25; reports Chromium/Firefox `requestClose()` leaves non-modal dialog open when `cancel` handler removes `closedby`, while then-current spec/WebKit algorithm closes it; status open at review). Do not generalize issue to modal behavior.
- **Local reproduction:** Linux headless Chromium **144.0.7559.96**, Playwright Python, nine isolated `page.set_content` scenarios × three runs. Default `showModal`/default `show` resisted outside click; `closedby=any` closed both modal and non-modal on outside click (`cancel,close`); `closedby=none` modal resisted. Removing `closedby` during `cancel` left non-modal `requestClose` open (only `cancel`), while modal closed; `preventDefault` blocked `requestClose` but not `close()`. **No Firefox/WebKit, OS Back, touch, screen-reader, real product, or outcome testing.**

## Modern Web Guidance: source-audited self-eval, grader and telemetry (2026-10-25)
- **Published skill and package:** https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/SKILL.md ; https://github.com/GoogleChrome/modern-web-guidance/blob/main/package.json ; https://github.com/GoogleChrome/modern-web-guidance-src/blob/main/README.md — inspected package 0.0.195, Node >=20, Apache-2.0 code / CC-BY-4.0 guides. Source and published repositories differ; `@latest` and mandatory triggering are vendor preferences.
- **CLI and privacy:** https://github.com/GoogleChrome/modern-web-guidance-src/blob/main/src/cli/modern-web.ts ; https://github.com/GoogleChrome/modern-web-guidance-src/blob/main/src/cli/telemetry/clearcut-logger.ts ; https://github.com/GoogleChrome/modern-web-guidance-src/blob/main/src/cli/telemetry/watchdog-client.ts — local `search/retrieve`, installer delegates to `npx skills add`, default-on query/guide/OS/agent/version telemetry through detached process, `DISABLE_TELEMETRY=1` opt-out.
- **Eval boundaries:** https://github.com/GoogleChrome/modern-web-guidance/blob/main/README.md ; https://github.com/GoogleChrome/modern-web-guidance-src/blob/main/guides/README.md ; https://github.com/GoogleChrome/modern-web-guidance-src/blob/main/src/harness/lib/metrics.ts — Oct-19 self-eval Codex 56→83% (172 tasks/1,445 assertions), Claude 56→88% (171/1,438); grader calibration against own gold/negative examples; early-failure runs excluded from pass-rate denominators. These are not independent UX outcomes.
- **One grader's false-positive surface:** https://github.com/GoogleChrome/modern-web-guidance-src/blob/main/guides/ui-behaviors/search-hidden-content/guide.md ; https://github.com/GoogleChrome/modern-web-guidance-src/blob/main/guides/ui-behaviors/search-hidden-content/expectations.md ; https://github.com/GoogleChrome/modern-web-guidance-src/blob/main/guides/ui-behaviors/search-hidden-content/grader.ts — `html.includes('beforematch')` can satisfy two checks without listener/fallback; only two literal secret markers detected; no actual find/fragment/AT/Safari test. **Source inspection, not executed agent/browser trial.**
- **Platform comparison:** https://html.spec.whatwg.org/multipage/interaction.html ; https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden ; https://developer.mozilla.org/en-US/docs/Web/API/Element/beforematch_event ; https://web-platform-dx.github.io/web-features-explorer/features/hidden-until-found/ — event availability ≠ complete attribute behavior; compatibility summaries currently differ.

## `ariaNotify()`: Baseline 2026 versus audible delivery and cross-origin policy (reviewed 2026-10-25)
- **Normative/editorial:** https://w3c.github.io/aria/#ARIANotifyMixin (editor's draft 2026-10-21, API processing and excluded accessibility nodes); https://w3c.github.io/aria/#arianotify-permissions-policy and https://www.w3.org/TR/wai-aria-1.3/#arianotify-permissions-policy (both say default allowlist `*`). WAI-ARIA 1.3 is a **draft**, not a Recommendation.
- **Platform docs with a material contradiction:** https://developer.mozilla.org/en-US/docs/Web/API/Document/ariaNotify ; https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaNotify (Baseline Newly Available Sept 2026; delivery/priority/coalescing/element language); https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy/aria-notify (last edited 2026-03-07, says default `self`, conflicting with the W3C draft's `*`). Feature presence and `undefined` return do not verify an announcement.
- **Standards debate:** https://github.com/w3c/aria/issues/2861 (open security review: permissive cross-origin default, notification flooding; discussions Aug–Oct 2026); https://github.com/w3c/aria/pull/2914 (security editorial work); https://github.com/w3c/aria/issues/2499 (noise/abuse concern); https://github.com/w3c/aria/issues/2828 (language/direction request **closed**, no per-call language option). The security concern is not a demonstrated exploit.
- **Independent, dated device evidence:** https://oidaisdes.org/de/blog/aria-notify-browser-support/ (2026-06-03, reported successful Firefox 151/Chrome 149/Edge 148 + NVDA on Windows and Chrome/Firefox + TalkBack on Android; failed Safari/iOS 26.5 + VoiceOver; **predates Safari 27**). Practitioner experiment, not representative population or latest-device certification.
- **Isolated runtime check:** Linux Chromium 144.0.7559.96, Playwright Python, `page.set_content`: `typeof document.ariaNotify === "function"`; `document.featurePolicy.features()` included `aria-notify`, `allowsFeature("aria-notify") === true` in a blank document. Attempts to navigate to two localhost origins returned `ERR_BLOCKED_BY_ADMINISTRATOR`; **no cross-origin policy result, actual speech, braille, or AT testing**.

## Command palette IME: consumer callback executes before cmdk's guard (reviewed 2026-10-25)
- **First-party source:** https://github.com/dip/cmdk/blob/main/cmdk/src/index.tsx (root `onKeyDown`: `etc.onKeyDown?.(e)` precedes `e.nativeEvent.isComposing || e.keyCode === 229` check; internal Enter selection follows guard). https://github.com/dip/cmdk/blob/main/README.md (host binds Cmd/Ctrl+K; no built-in virtualization). Not a proven live cmdk defect. Repository reported last push 2025-10-29; adoption does not prove IME correctness.
- **Standards and platform:** https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event (composition boundary and 229 fallback); https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html (disable/remap/focus rule for bare-character shortcuts); https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ (semantic focus/Enter contract, not OS IME validation).
- **Independent reports:** https://github.com/anomalyco/opencode/issues/9563 (list Enter mis-selection; closed with #9564 Jan 2026); https://github.com/openai/codex/issues/11026 (Japanese IME Plan Mode premature submit reported in 2026). Separate applications, not evidence that cmdk's internal guard fails.
- **Isolated test:** 2026-10-25 Linux headless Chromium 144, synthetic KeyboardEvents dispatched to a minimal DOM listener reproducing inspected callback/guard order. Normal Enter invoked consumer + internal action; `isComposing:true` and `keyCode:229` Enter invoked consumer only. **Not real IME, actual cmdk runtime, cross-engine, or AT validation.**


## Screenshot stabilization can execute UI state transitions (reviewed 2026-10-25)
- **Primary API contract:** https://playwright.dev/docs/api/class-pageassertions (`toHaveScreenshot` defaults `animations: 'disabled'`; finite transitions are fast-forwarded and fire `transitionend`; screenshots retry until two consecutive captures match); https://playwright.dev/docs/api/class-page (direct `page.screenshot` defaults to `animations: 'allow'`); https://playwright.dev/docs/api/class-locator (same capture-time animation semantics and masking of invisible elements).
- **Browser event contract:** https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event (event occurs on completion; cancellation and zero-duration are different). **Alternative tool:** https://www.chromatic.com/docs/animations/ (CSS animations paused; JS-driven animation requires application-specific control; different mechanism, not an equivalent Playwright reproduction).
- **Controlled local reproduction:** 2026-10-25, Linux headless Chromium 144.0.7559.96 / Playwright Python 1.57.0, `page.set_content` fixture: `#toast` opacity 1→0 over 20s, `transitionend` listener removes `#toast` and changes status text. After 120ms transition progress, three paired runs: `page.screenshot(animations='allow')` left toast present, no completion event (~0.059–0.083 s); `animations='disabled'` fired `transitionend` with `elapsedTime=20`, removed toast, changed status (~0.019–0.022 s). **Observed state mutation during screenshot, not a cross-browser/JS-runner/AT or user-outcome experiment.** Implication: do not treat a stabilized screenshot as a read-only state oracle.

## Retained-route state and hidden Playwright locator contradiction (reviewed 2026-10-25)
- **Framework contracts:** https://nextjs.org/docs/app/guides/preserving-ui-state (requires `cacheComponents: true`; React Activity retains DOM/state for up to three routes; explicit per-pattern reset, account scoping, `bfcacheId` migration, and **incorrect claim** that `getByLabel`/`getByPlaceholder` automatically filter hidden Activity DOM); https://react.dev/reference/react/Activity (hidden DOM/state with Effects cleanup; media/iframe side-effect caveats); https://github.com/vercel/next.js/discussions/88044 (Jan 2026 practitioner complaint about stale modal/flow state, not independently validated prevalence).
- **Locator primary documentation:** https://playwright.dev/docs/api/class-page (`getByRole` excludes ARIA-hidden by default; label/placeholder methods do not document equivalent filtering); https://playwright.dev/docs/locators (strictness, explicit visible filters, role/region scoping); https://playwright.dev/docs/api/class-locator (new `.visible()` introduced v1.63). Do not confuse Playwright's visible/actionable criterion with perceptual opacity or accessibility-tree inclusion.
- **Browser history counterexample:** https://web.dev/articles/bfcache (last updated 2026-10-16; whole-document snapshots, `pageshow.persisted`, stale/sensitive data, avoid `unload` and conditional `beforeunload`). This differs from Next's **in-document** Activity retention.
- **Local isolated reproduction:** Playwright Python 1.57.0, Linux headless Chromium 144.0.7559.96, `page.set_content` with one `display:none` and one visible labeled email input sharing label/placeholder. `get_by_role("textbox",name="Email")` matched 1; `get_by_label("Email")` and `get_by_placeholder("Search...")` matched 2 each and `fill()` raised strict-mode errors; `.filter(visible=True)` reduced to 1. Separate `opacity:0` button remained role-matchable and clickable, while an `aria-hidden=true` visually displayed button was omitted by role lookup. **No actual Next.js/React Activity runtime, JS Playwright, Firefox/Safari, or assistive technology was tested.**


## Native `details name` accordions: global tree scope, event coalescing and hidden focus (reviewed 2026-10-25)
- **Normative platform contract:** https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element (same-tree/nonempty-name grouping, nonadjacent membership, exclusivity, author prohibition on multiple initial `open`, same-group nesting, event coalescing, and explicit warning that forced exclusivity can frustrate comparison); https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details (Boolean `open`, native interaction, `toggle` and group behavior); https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/name (Baseline 2024 for `name`, older-browser caveat).
- **Competing product patterns and accessibility:** https://design-system.service.gov.uk/components/accordion/ (multiple panels can remain open, user-research gate, visible-content alternatives, progressive no-JS fallback, remembered state); https://design-system.service.gov.uk/components/details/ (optional secondary help); https://www.w3.org/WAI/ARIA/apg/patterns/accordion/ (custom button/heading/expanded-state contract and optional arrow keys); https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ (disclosure semantics); https://getbootstrap.com/docs/6.0/components/accordion/ (current native-details-based shipped framework documentation, not independent usability evidence).
- **Local isolated probe:** Python Playwright + system headless Chromium 144 on Linux, in-memory HTML. Two sections with `name=shared` closed across section boundaries; same name in a shadow root remained independent; programmatically opening another member while a button in the previous panel was focused left `document.activeElement` on the now-hidden button; rapid state changes coalesced `toggle` events; summary Enter/Space toggled. No Firefox/Safari/Windows/macOS/mobile, real screen-reader, React hydration or comparative task test. Do not treat this as universal focus behavior or claim that native accordions are universally better.

## Dynamic-message localization, plural precision and MF2 readiness (reviewed 2026-10-25)
- **Unicode CLDR 49, released 2026-10-22:** https://cldr.unicode.org/downloads/cldr-49 (plural-rule changes for af/bg/es/fr/gl/nn/tg/vi; MF2 `:currency` and `:percent` now stable); https://www.unicode.org/reports/tr35/tr35-messageFormat.html (stable MF2 spec, bidi isolation and function conformance); https://unicode.org/reports/tr35/tr35-numbers.html (visible fractional digits `v`, `1` vs `1.0` and selection semantics); https://unicode.org/cldr/charts/49/supplemental/language_plural_rules.html (locale categories including Spanish `many`).
- **Runtime boundary:** https://github.com/tc39/proposal-intl-messageformat and https://github.com/tc39/proposals/blob/main/ecma402/README.md (native `Intl.MessageFormat` remains Stage 1 as checked); https://formatjs.github.io/docs/core-concepts/icu-syntax/ (MF1 plural/select/ordinal, exact-value branch and rich-text callbacks); https://www.i18next.com/translation-function/plurals (`count`, `_zero`, `Intl.PluralRules` dependency); https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/PluralRules (fraction digit/rounding options). Unicode standard maturity must not be confused with runtime availability.
- **Isolated probe:** Node v22.16.0, ICU 77.1, CLDR 47.0: `new Intl.PluralRules("es").select(1000000)` = `many`, forced one fractional digit = `other`; `ru` 1 = `one`, forced 1.0 = `other`; rounding `1.2` to zero fraction digits can select `one`. This demonstrates **runtime precision dependence**, not a CLDR 47→49 difference or actual SSR hydration failure. No cross-browser test, live MF2 runtime audit or user study.

## Agent-rule corpus validation: source claims versus native form semantics (reviewed 2026-10-25)
- **Primary platform rule:** https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission (first associated submit button in tree order; disabled default; no-button multiple-field blocker); https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event (SubmitEvent.submitter and implicit submission summary). Normative platform behavior is distinct from suggested form UX.
- **Upstream and downstream wording:** https://vercel.com/design/guidelines ("Enter submits" last-control heuristic); https://github.com/strongeron/ui-guides-agent-rules/blob/main/src/data/principles/forms.ts (copies heuristic); https://github.com/strongeron/ui-guides-agent-rules/blob/main/src/components/examples/forms/EnterSubmitsGood.tsx (only one field); https://github.com/strongeron/ui-guides-agent-rules/blob/main/scripts/validate-agent-rules.ts (17 declared static regex checks; unchecked rules acknowledged); https://github.com/strongeron/ui-guides-agent-rules/blob/main/src/components/ExampleRenderer.tsx (lazy demo loading and fallback). A rule's attribution and example do not imply that it was tested against the HTML Standard.
- **Actual corpus / operational surface:** https://github.com/strongeron/ui-guides-agent-rules (411 Good + 411 Bad TSX files counted in recursive GitHub tree, 16-source claim in README, per-rule static lookup, MIT repository license, last push 2026-08-10, 2 stars checked 2026-10-25); no full demo/browser audit or upstream-license audit. Static retrieval is preferable to running a cloned web app for one rule.
- **Small-skill alternatives inspected:** https://github.com/MaxHan7/frontend-ui-standards-skill/blob/main/frontend-ui-standards/SKILL.md (token/component/screen metrics, manual Codex copy, MIT, one commit, ~106 stars); https://github.com/Enixes/astra-frontend-design/blob/main/SKILL.md and https://github.com/Enixes/astra-frontend-design/blob/main/assets/evals.json (task routing and six evaluation *briefs*, not measured results; four commits, ~3 stars). Neither establishes incremental agent output improvement.
- **Local behavioral probe:** Playwright Python + system Chromium **144.0.7559.96**, isolated in-memory form; Enter on both of two single-line fields with two submitters clicked/submitted the first button; two fields/no button yielded no submit; one field/no button submitted with no submitter; disabled first submitter blocked; textarea Enter did not submit. No cross-browser, mobile IME, screen-reader or agent-output validation. Do not extrapolate to all platforms.

## Browser-agent containment: source-verified configuration and policy traps (reviewed 2026-10-25)
- **Chrome DevTools MCP v1.12.0, first-party:** https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/SECURITY.md (untrusted page output, trusted workspace/npm environment, roots retain temp access, URL restrictions only on attached targets, no-JS-eval is not a sandbox); https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/configuration.md (Chrome **149+** for URL patterns; on-the-fly policy changes leave already-open disallowed targets attached; agent-writable config bypass; experimental DevTools Console evaluation path; default telemetry and CrUX lookups); https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/advanced-usage.md (persistent profile by default, isolated temporary profile, Chrome 144+ auto-connect, exposed remote-debugging port); https://developer.chrome.com/docs/devtools/agents/use-cases/auto-connect (profile/cookie exposure, consent and telemetry).
- **Agent-browser 0.39.2 source versus reports:** https://github.com/vercel-labs/agent-browser/issues/1902 (**OPEN** 2026-10-25; reporter tested 0.37.1; empty/comma-only allowlist fail-open), current https://github.com/vercel-labs/agent-browser/blob/main/cli/src/native/network.rs (empty `allowed_domains` returns allowed); https://github.com/vercel-labs/agent-browser/issues/1612 (**OPEN**; documented action categories do not match literal names), current https://github.com/vercel-labs/agent-browser/blob/main/cli/src/native/policy.rs (literal string comparisons); https://github.com/vercel-labs/agent-browser/blob/main/skill-data/core/references/trust-boundaries.md (supported containment modes, CDP/restore limitations and host-egress warning). Reporter results **not independently reproduced** with current binary.
- **Comparison / design tradeoff:** https://github.com/microsoft/playwright-mcp (official origin filters explicitly *not* a security boundary and do not cover redirects); https://github.com/vercel-labs/agent-browser/issues/991 (open request to separate navigation versus subresource allowlists, **not** a shipped feature). Successful QA with broken subresources is not representative; successful navigation is not proof of isolation. No controlled cross-tool containment/agent-accuracy benchmark in this cycle.

## CSS `field-sizing`: bounded composer and intrinsic-size side effects (reviewed 2026-10-25)
- **Primary specification/semantics:** https://drafts.csswg.org/css-forms-1/#field-sizing (editor's draft dated 2026-10-08; `content` ignores host-language preferred sizes, default `fixed`); https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/field-sizing (textarea `rows`/`cols` ignored, multi-select grows to show all options, placeholder/width interactions); https://developer.chrome.com/docs/css-ui/css-field-sizing (per-element behavior and defensive min/max constraints).
- **Release/support:** https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/152 (Firefox 152, 2026-06-16); https://web-platform-dx.github.io/web-features-explorer/features/field-sizing/ (Baseline Newly available 2026-06-16, not Widely available; Chromium 123+, Safari 26.2+, Firefox 152+).
- **Local executed probe:** Chromium 144.0.7559.96 + Playwright Python, headless at 900×700 and 320×600. Default rows=4 textarea 110px high; bare content-sized empty 38px high/15px wide and pasted content 880px wide; 30-option multi-select size=3 590px high versus 150px capped; bounded textarea 292px wide/192px high with scrollHeight 2076px at 320px viewport, no document horizontal overflow; input width 234→44px after placeholder replaced by one character. Layout is fixture/font-dependent; **not** cross-engine, device, AT, INP or user-outcome evidence.
- **Operational implication:** scope to textarea, preserve fallback `rows`, use width/min/max-block bounds, test caret and internal scroll after cap; never infer that all form controls benefit from `field-sizing`.

## WebAuthn Signal API: per-account deletion risk and liveness regressions (reviewed 2026-10-25)
- **Normative intended semantics:** https://www.w3.org/TR/2026/REC-webauthn-3-20260825/ (Signal API §§5.1.10.2–5.1.10.4; authenticator's accepted-credential action scoped by RP ID + user handle; best-effort; possible irreversible omission). https://www.w3.org/TR/webauthn-4/ is a **draft**, not a replacement Recommendation. https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/signalAllAcceptedCredentials_static and https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/signalUnknownCredential_static (authenticated full-list versus signed-out unknown-ID use, empty-list hazard, non-Baseline support). https://developer.chrome.com/docs/identity/webauthn-signal-api (first-party implementation guidance; page has an outdated Safari “not yet implemented” sentence despite its support table).
- **Shipped Safari support and contradiction:** https://webkit.org/blog/17333/webkit-features-in-safari-26-0/ (Safari 26.0 introduced Signal API). **OPEN WebKit bug 322267**, https://bugs.webkit.org/show_bug.cgi?id=322267 (reported 2026-08-21, status NEW on 2026-10-25): multi-account RP, account B passkey+password merged in Passwords app; signaling deletion for account A also removed B's passkey in reporter's tests; affects both `signalUnknownCredential` and `signalAllAcceptedCredentials`; comments extend observed versions beyond title and include macOS. Single reporter's reproducible evidence/video, **not independently verified or a blanket Safari claim**.
- **Liveness distinct from destructive bug:** **OPEN WebKit bug 324909**, https://bugs.webkit.org/show_bug.cgi?id=324909 (reported 2026-09-22, NEW on 2026-10-25): Safari 27 on macOS 26 unresolved signal promises, reporter says Safari 27/macOS 27 resolves. https://bugs.webkit.org/show_bug.cgi?id=298951 is **RESOLVED FIXED 2025-12-17**, an earlier similar issue; not proof 324909 is fixed. The bug reports warrant a feature-flagged provider/OS test, not inferred universal behavior.
- **Product inference, not measured outcome:** server authorization must remain authoritative; signal success does not confirm provider deletion; avoid awaiting optional sync in sign-in-critical paths; test account-B preservation, stale display, device/provider absence and legitimate server outages. No real Apple device or comparative usability experiment this cycle.

## Offline outbox: delivery truth, Workbox replay and conflict safety (reviewed 2026-10-24)
- **Platform support / persistence:** https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API (not Baseline); https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine (unreliable reachability signal); https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria (best-effort eviction, private mode, persistence limits).
- **Workbox docs/source and controlled falsification (2026-10-24):** https://developer.chrome.com/docs/workbox/modules/workbox-background-sync (initial `fetchDidFail` only on thrown failures; 4xx/5xx require a strategy-level status plugin, which does not alter replay); pinned https://github.com/GoogleChrome/workbox/blob/v7.4.1/packages/workbox-background-sync/src/Queue.ts (`replayRequests()` shifts before fetch, never checks `response.ok`, has no method-level single-flight lock); https://github.com/GoogleChrome/workbox/blob/v7.4.1/packages/workbox-background-sync/src/lib/QueueStore.ts (shift/unshift storage behavior); https://github.com/GoogleChrome/workbox/blob/v7.4.1/test/workbox-background-sync/sw/test-Queue.mjs (replay tests cover success/network rejection, not the overlapping-manual/HTTP-status case). **Executed the exact pinned `replayRequests()` method body in an isolated JS harness** with mocked queue/fetch: HTTP 503 → queue empty; rejected fetch → entry retained; overlapping calls → `create-start, edit-404, create-201`, queue empty and edit not applied. This is method-level dynamic evidence, **not** full package/IndexedDB/browser integration. https://github.com/GoogleChrome/workbox/issues/2640 reports an ordering hazard; it was administratively closed in the 2024 issue-backlog reset, not shown fixed. https://github.com/GoogleChrome/workbox/releases/tag/v7.4.1 (published 2026-05-05).
- **Framework persistence:** https://tanstack.com/query/latest/docs/framework/react/guides/mutations (persisted mutation state needs a default mutation function after reload; scope.id controls serial execution); no server deduplication guarantee.
- **Server conflict and dedup:** https://www.rfc-editor.org/rfc/rfc9110.html#section-13.1.1 (If-Match prevents lost updates, with already-applied 2xx exception); https://docs.stripe.com/api/idempotent_requests (API **v1 versus v2** differences, 500 caching and v1 24h key retention; provider-specific).
- **First-party UX guidance:** https://developers.google.com/open-health-stack/design/offline-sync-guideline (contextual pending/sync/failure, timestamps, manual recovery; healthcare-specific); https://web.dev/articles/offline-ux-design-guidelines (locally saved versus synced and nonblocking workflow; older). No comparative user outcome test.

## Forced-colors/high-contrast CSS: opt-out inheritance and rendered-state failure (reviewed 2026-10-24)
- **Normative mechanism:** https://www.w3.org/TR/css-color-adjust-1/ (Candidate Recommendation 2025-12-16, §§3–3.2; `forced-color-adjust` inherited; SVG `preserve-parent-color` special case); https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/forced-color-adjust — system palette/UA paint overrides, non-URL gradient removal, shadows suppressed, native semantics versus ARIA role; `none` bypasses forced colors and text backplates.
- **First-party production pattern versus maintenance counterexample:** https://learn.microsoft.com/en-us/fluent-ui/web-components/design-system/high-contrast (Fluent accent button intentionally uses `none` for backplates and system-color inversion); https://sarahmhigley.com/writing/forced-color-adjust-none/ (2025-09-17: higher-specificity downstream custom styles leak author red/purple through inherited opt-out). The former is a conditional implementation, **not** proof that global opt-out is safe. https://adrianroselli.com/2021/02/whcm-and-system-colors.html (updated 2026-05-24) documents system-color pairings and SVG pitfalls.
- **Test tools and version boundary:** https://playwright.dev/docs/api/class-page (emulateMedia forcedColors); https://learn.microsoft.com/en-us/microsoft-edge/devtools/accessibility/preferred-color-scheme-simulation ; https://blogs.windows.com/msedgedev/2025/06/30/removing-ms-high-contrast-and-embracing-standards-based-forced-colors-in-microsoft-edge/ (legacy `-ms-` removed Edge 138); https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html (required UI/graphic indicators and focus). Playwright emulation is **not** a real Windows customized theme or AT test.
- **Local minimal probe, 2026-10-24:** Python Playwright + headless Debian Chromium 144.0.7559.96, `emulate_media(forced_colors="active")`, 4-element HTML fixture: `box-shadow` changed from authored shadow to `none` under auto; native button blue/white replaced by UA system colors; opted-out customized button retained red background, purple text and authored shadow. No external app, cross-browser run or user test; fixture is described in `knowledge/DARK_UI_AND_COLOR_ADAPTATION.md`.


## Recurrence, DST and exception identity (reviewed 2026-10-24)
- **Protocol contradiction:** https://www.rfc-editor.org/rfc/rfc5545.html#section-3.3.10 both excludes nonexistent recurrence times and later defers their resolution to https://www.rfc-editor.org/rfc/rfc5545.html#section-3.3.5 (pre-gap offset/first overlap). https://www.rfc-editor.org/rfc/rfc5545.html#section-3.8.5.3 documents local-zone series and exact-versus-nominal duration. Do not assume interoperable DST gap handling.
- **Provider series semantics:** https://developers.google.com/workspace/calendar/api/guides/recurringevents (immutable originalStartTime; moved/canceled exceptions; this-and-following split; avoid per-instance mass edits); https://developers.google.com/workspace/calendar/api/v3/reference/events (recurrence expansion zone).
- **Clock-to-instant conversion:** https://tc39.es/proposal-temporal/docs/timezone.html (compatible/earlier/later/reject; changing zone rules).
- **Falsification:** https://dateutil.readthedocs.io/en/stable/rrule.html claims invalid times are ignored. Local Python dateutil 2.9.0.post0 `rrule(DAILY,count=3,dtstart=2026-03-28 02:30 Europe/Madrid)` returned imaginary 2026-03-29 02:30+02:00 (`dateutil.tz.datetime_exists=False`); monthly Jan-31 `COUNT=4` did skip invalid calendar dates. Not a cross-engine benchmark.


## Saved-view subscriptions and shared-definition mutation — product-specific (reviewed 2026-10-24)
- **View event subscriptions:** https://linear.app/docs/custom-views ; https://linear.app/changelog/2024-08-23-slack-channel-notifications-for-custom-views — shipped entry/completion/cancellation alerts, personal/Slack channels, self-action suppression; no specified backfill, flapping or delivery-idempotency guarantee.
- **Negative case:** https://linear.app/docs/pulse — personal custom feeds cannot be shared or subscribed to.
- **Cross-audience caveat:** https://linear.app/docs/slack — some team/project Slack channel notifications can be read by non-Linear members; do not extrapolate custom-view payload behavior.
- **Different shared-edit contracts:** https://support.atlassian.com/jira-software-cloud/docs/save-and-share-views-from-your-list/ versus https://community.atlassian.com/forums/discussion/3223773/when-people-change-a-view-e-g-filters-it-is-saved-for-everyone-help — Jira Software admin baseline vs 2026-04-20 Jira Product Discovery shared-autosave pitfall; proposed default change not verified.
- **Authorization principles:** https://api-security.owasp.org/editions/2023/en/0x11-t10/ — object/property/function authorization independent of UI and notification filters.

## Interest invokers: optional hovercards versus cross-input accessibility (reviewed 2026-10-24)
- **Shipped versus proposed:** https://developer.chrome.com/release-notes/142 ; https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using_interest_invokers ; https://open-ui.org/components/interest-invokers.explainer/ (updated 2026-10-16); https://github.com/whatwg/html/pull/11006 (open, unmerged 2026-10-24). Chromium 142+ implements interest invokers; the latest proposed rich-hint semantics and `::interest-button` remain moving targets, not cross-browser promises. Firefox/Safari unsupported at review.
- **Accessibility countercheck:** https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html ; https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/ . WCAG 1.4.13 requires dismissible/hoverable/persistent author content; APG tooltip is work in progress and excludes focusable controls, while Open UI proposes rich-hint tooltip-minimum role and `aria-details`/focus-order mappings. Do not equate a proposal or role with tested AT behavior.
- **Touch/polyfill reality:** https://github.com/mfreed7/interestfor ; https://github.com/mfreed7/interestfor/blob/main/LICENSE ; https://github.com/mozilla/standards-positions/issues/1181 (closed neutral/concerns, **not** support); https://github.com/WebKit/standards-positions/issues/464 (open). Maintainer polyfill BSD-3-Clause, pushed 2026-10-06; its own README says link long-press cannot be polyfilled while preserving native context menu. No live test or measured user benefit.

## Superdesign hosted design skill: source-grounded branching versus cloud and cache boundaries (reviewed 2026-10-24)
- **Actual workflow:** https://github.com/superdesigndev/superdesign-skill/blob/main/skills/superdesign/SKILL.md ; https://github.com/superdesigndev/superdesign-skill/blob/main/skills/superdesign/references/INIT.md ; https://github.com/superdesigndev/superdesign-skill/blob/main/skills/superdesign/references/SUPERDESIGN.md — six local extraction artifacts include full component/layout source; line-ranged source/context and asset uploads feed a cloud canvas; source-grounded reproduction precedes branching; Petite-Vue canvas component conversion is not a guarantee of production React behavior. UI drafts rely on user canvas review, not automated a11y/visual certification.
- **Resume and trust:** https://github.com/superdesigndev/superdesign-skill/blob/main/skills/superdesign/references/RESUME.md — SHA-256 freshness, repo-contained path/secret-pattern validation and incremental repair; generated cache records remote draft/asset IDs. The SOP explicitly ignores temporary HTML but does not require ignoring the entire local extracted state. These guards do not prove source files are free of sensitive literals or that a remote upload is approved.
- **Maintenance, install, alternatives:** https://github.com/superdesigndev/superdesign-skill ; https://github.com/superdesigndev/superdesign-skill/blob/main/INSTALL.md ; https://github.com/superdesigndev/superdesign-skill/blob/main/LICENSE ; https://github.com/superdesigndev/superdesign — upstream skill MIT, plugin bundle v0.6.0, unarchived, last pushed 2026-08-21; separate hosted CLI via unpinned `@latest`, login required. The archived IDE extension is a distinct older project. ~895 stars observed 2026-10-24, not outcome evidence.
- **Independent counter-evidence / evidence limit:** https://skillproof.dev/skills/superdesign (2026-07-16: install succeeded but authenticated design generation was not tested). The service privacy-policy page was not retrievable during this review; no claim about specific retention, data isolation, model-training terms, security certification, output quality or measured uplift is made. No local CLI execution.


## CSS reading-flow: responsive keyboard/speech order is not DOM repair (reviewed 2026-10-24)
- **Specification and shipped Chromium mechanics:** https://drafts.csswg.org/css-display-4/#reading-flow (CSS Display 4 editor's draft 2026-06-05, §§3.1, 4–4.1); https://developer.chrome.com/blog/reading-flow/ (2025-05-01). `flex-visual` differs from `flex-flow` under reversal; `grid-rows`/`grid-columns` differ from `grid-order`; `reading-order` is ordinal within a reading-flow container. The property changes speech/sequential focus, not DOM/layout/paint; source must remain meaningful without CSS.
- **Support and unresolved edge:** https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/reading-flow.json ; https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/reading-order.json (checked 2026-10-24: Chrome 137+, Firefox/Safari false); https://github.com/WebKit/standards-positions/issues/378 ; https://github.com/mozilla/standards-positions/issues/1056 ; https://github.com/whatwg/html/issues/10407 ; https://github.com/whatwg/html/issues/10533 (open at review). Do **not** repeat unsupported community claims of Safari 26.4 support. `display: contents`/focus-scope details need engine and AT verification.
- **Pinned local runtime check (2026-10-24):** Chromium 144.0.7559.96 / Playwright Python 1.57.0: flex `row-reverse; reading-flow: flex-visual` produced Tab and CDP AX child traversal Three/Two/One, but Playwright `aria_snapshot` and a passing source-ordered snapshot assertion gave One/Two/Three. Explicit grid `grid-rows` reproduced this. With a nested wrapper, the raw CDP `nodes` array differed from its actual `childIds` tree. Single-engine observation, not an AT verdict.
- **Tool source and contracts:** https://github.com/microsoft/playwright/blob/main/packages/injected/src/ariaSnapshot.ts (DOM `firstChild/nextSibling` traversal inspected 2026-10-24); https://playwright.dev/python/docs/aria-snapshots (order-sensitive structural snapshots); https://chromedevtools.github.io/devtools-protocol/tot/Accessibility/ (AX `nodeId`, `childIds`). No current-release Playwright/MCP or real screen-reader comparison.
- **Accessibility outcome, not a property certification:** https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html ; https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/reading-flow . Multiple meaningful sequences can be valid; neither keyboard screenshots nor support detection alone prove AT parity. A local Chromium keyboard/CDP experiment now exists; cross-engine and real AT validation are still missing.


## CSS anchor positioning — 2026 draft versus browser/documentation behavior (reviewed 2026-10-24)
- **Authoritative draft, not uniform implementation:** https://drafts.csswg.org/css-anchor-position-1/ (W3C Working Draft dated 2026-09-06), especially §§2.3–2.4, 6.6, 7 and change log. The draft prefers nearest eligible ancestor before last matching anchor; `position-anchor` initially `normal` (auto with `position-area`); `position-visibility` now spells `anchor-visible`/`anchor-valid`, with legacy plural aliases optional. This is a *specification change*, not proof all shipped engines implement it.
- **Documentation drift and practical mechanics:** https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-visibility ; https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Try_options_hiding ; https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using — MDN still illustrates last-in-tree matching and plural visibility values; its Baseline 2026 label covers newly available features, not every subfeature/old browser. Popover invoker association is distinct from CSS geometry/ARIA semantics.
- **Open falsification cases (status checked 2026-10-24):** https://github.com/w3c/csswg-drafts/issues/13079 (nested scroller fallback and `no-overflow`, open); https://github.com/w3c/csswg-drafts/issues/13176 (`anchor-visible` edge cases, open, despite spec's nonzero-intersection clarification). No browser execution, AT audit, or measured benefit in this cycle.


## Google Labs Stitch agent skills — cloud design and validator/secret boundaries (2026-10-24)
- **Canonical source / support / install:** https://github.com/google-labs-code/stitch-skills ; https://github.com/google-labs-code/stitch-skills/blob/main/README.md ; https://github.com/google-labs-code/stitch-skills/blob/main/LICENSE ; https://stitch.withgoogle.com/docs/mcp/setup — Apache-2.0, active Google Labs repository (~8.6k stars / 98 commits observed 2026-10-24), but README expressly disclaims official Google product support; Codex/Claude/Cursor/OpenCode paths differ and require authenticated Stitch MCP. Popularity is not evidence of UI quality.
- **Generated-code gate is narrow:** https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-build/skills/react-components/SKILL.md ; https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-build/skills/react-components/scripts/validate.js — SWC validator checks any interface suffix `Props` plus literal className hex; it does not enforce the skill's promised Readonly, component-specific interfaces, accessibility, navigation or architecture. Validation/browser steps are permission-optional, not evidence of complete QA.
- **Cloud export and credential boundary:** https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-design/skills/code-to-design/SKILL.md ; https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-design/skills/extract-static-html/SKILL.md ; https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-design/skills/extract-static-html/scripts/snapshot.ts ; https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-design/skills/upload-to-stitch/SKILL.md ; https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-design/skills/upload-to-stitch/scripts/upload_to_stitch.py — rendered DOM/images may contain sensitive content; upload script requires `--api-key` CLI arg; upstream upload skill includes explicit approval gate. Data exposure and argv risk are source-based analyses, not tested incidents.
- **Loop / context:** https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-utilities/skills/stitch-loop/SKILL.md ; https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-utilities/skills/design-md/SKILL.md — baton creates successive pages with optional visual verification; DESIGN.md captures descriptive visual language, not a validated semantic/interaction contract. No live Stitch or agent uplift benchmark.

## React Doctor agent skill — deterministic scan versus design authority (2026-10-24)
- **Mechanism / activity:** https://github.com/millionco/react-doctor/blob/main/skills/react-doctor/SKILL.md ; https://github.com/millionco/react-doctor ; https://www.react.doctor/docs/getting-started/install-for-coding-agents ; https://www.react.doctor/docs/reference/cli-reference — official skill v1.2.0 triggers changed/full/design scans and downloads a mutable /doctor playbook; CLI 0.9.18 and ~14.9k parent repo stars observed 2026-10-24. Agent installer can add hooks; dry-run exists. Neither score nor stars validate UX.
- **Scope and false-positive correction:** https://www.react.doctor/docs/configuration/config-files ; https://www.react.doctor/docs/configuration/eslint-and-oxlint-plugins ; https://www.react.doctor/docs/community/changelog ; https://github.com/millionco/react-doctor/issues/669 — changed vs full scopes have different coverage; project security checks are not provided by standalone plugins; v0.2.6 removed bold-heading heuristic due to false positives, v0.8.2 reported 2,000-project rule-parity corrections, and Compiler false positives have been reported/fixed. Static design warnings are not usability evidence.
- **License exception (inspect actual file):** https://github.com/millionco/react-doctor/blob/main/LICENSE ; https://www.react.doctor/docs/legal/license — **Modified MIT** restricts using source/outputs as ML training/evaluation data and substantially derived paid hosted services without written permission; some upstream README/registry snippets still say MIT. Ordinary project scanning is permitted per vendor explanation; ambiguous agent-benchmark datasets require review.
- **Privacy and network:** https://www.react.doctor/docs/legal/data-use ; https://www.react.doctor/docs/configuration/config-files ; https://www.react.doctor/docs/reference/cli-reference — Sentry/Axiom telemetry may retain scrubbed file/directory/repository names (pseudonymous), opt out with --no-telemetry; Socket.dev dependency checks are enabled by default and independently networked; GitHub App processes archives in hosted sandbox, unlike local CLI. Runtime Chrome traces can contain sensitive paths/URLs.
- **Evidence boundary:** reviewed first-party repo/skill/docs/changelog and reported issues 2026-10-24; no local package execution, no verified defect-detection rates, no accessibility/UX benchmark or model comparison. Conditional trial only; AI-agent maturity stays 5/10.


## Swipe-to-reveal/commit: WCAG and native full-swipe traps (2026-10-24)
- **Normative pointer alternatives:** https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html ; https://www.w3.org/WAI/WCAG22/Techniques/failures/F105.html — a direction-constrained swipe is path-based; the explicit F105 example fails when revealed actions have no simple tap/click route. Keyboard-only equivalence does **not** satisfy SC 2.5.1.
- **Distinct drag/cancel/target obligations:** https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html ; https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html ; https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html — distinguish path-based gesture from unconstrained drag, require cancellation/undo where applicable and appropriately sized/ spaced alternatives. Do not collapse these criteria.
- **Native implementation caveats:** https://developer.apple.com/documentation/swiftui/view/swipeactions(edge:allowsfullswipe:content:) ; https://developer.apple.com/design/human-interface-guidelines/gestures ; https://developer.android.com/develop/ui/compose/touch-input/user-interactions/swipe-to-dismiss ; https://developer.apple.com/documentation/swiftui/view/accessibilityaction(named:_:)-6t20v — SwiftUI full-swipe **defaults true** and commits the first edge action; custom swipe actions replace synthesized row delete; Android exposes explicit gesture-state callback. Platform guidance requires alternatives and predictable feedback; native gesture APIs do not prove discoverability or safe persistence.
- **Adjacent behavioral evidence, not row-swipe outcome evidence:** https://www.nngroup.com/articles/mobile-carousels/ ; https://www.nngroup.com/articles/mobile-usability-2nd-study/ — carousel research documents hidden swipe discovery and OS Back edge conflicts; applicability to row actions is a hypothesis to test. No device execution, comparative usability study, or score change in this cycle.


## Vercel React Best Practices skill — source-level exceptions (2026-10-24)
- **Canonical skill and install:** https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md ; https://github.com/vercel-labs/agent-skills/blob/main/README.md ; https://github.com/vercel-labs/skills/blob/main/docs/commands.md — first-party Vercel Markdown rules, 70 in SKILL.md versus README's 40+; version 1.0.0 in frontmatter, Agent Skills installer supports targeted project install. MIT declared in frontmatter/README; root LICENSE path returned 404 during inspection. Popularity/registry install totals do not establish quality.
- **Cross-request state and authorization:** https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/server-cache-lru.md ; https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/js-cache-function-results.md ; https://vercel.com/docs/fluid-compute ; https://nextjs.org/docs/app/guides/authentication — source samples omit auth/tenant scoping for a shared user-by-ID LRU, use an unbounded module Map, and cache cookie-derived login state. Potential leaks/staleness are **conditional failure analyses**, not reproduced exploits. Fluid Compute confirms shared-process concurrent requests; Next recommends request-aware authorized DAL.
- **Distinct caching layers and compiler:** https://react.dev/reference/react/cache ; https://nextjs.org/docs/app/getting-started/fetching-data ; https://nextjs.org/docs/app/getting-started/revalidating ; https://react.dev/learn/react-compiler — React.cache is per request, Next identical fetch memoization is not persistent Data Cache, and React Compiler can remove manual memoization needs. Skill's own memo rule acknowledges compiler behavior.
- **Hydration and CSP:** https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/rendering-hydration-no-flicker.md ; https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/rendering-hydration-suppress-warning.md ; https://react.dev/reference/react-dom/client/hydrateRoot ; https://nextjs.org/docs/app/guides/content-security-policy — inline post-element DOM mutation is not proof of no flash/no mismatch; strict CSP needs approved script policy. React treats hydration mismatches as bugs and warning suppression as a narrow escape hatch.
- **Performance claims requiring measurements:** https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/rendering-content-visibility.md ; https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-parallel.md ; https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-dependencies.md — sample 10× long-list speedup and 2–10× async impacts are **not independently measured transferable effects**. Use repo's offscreen-rendering contract and instrument realistic traces.
- **Evidence boundary:** direct inspection of 2026-10-24 canonical skill and selected rule files plus first-party React/Next/Vercel docs; no package execution, runtime reproductions, controlled performance measurements or comparative agent-quality experiment. Conditional recommendation; maturity unchanged.

## Offscreen rendering, `content-visibility` and accessibility exceptions (2026-10-24)
- **Normative/editor's-draft behavior:** https://drafts.csswg.org/css-contain/ — `auto` keeps content eligible for find/focus, triggers on focus/selection/top-layer, may change `scrollIntoView()` alignment under placeholder size, suppresses skipped descendant `innerText`/intersection/animation work. Section 4.6 permits AT-tree omission when representing skipped content would expose AT usage via layout-timing differences. This is a **draft requirement/exception**, not evidence of a specific browser bug.
- **Implementation and caveat:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/contain-intrinsic-size ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/contain-intrinsic-block-size — MDN describes normal DOM/AT availability and the CSS-hidden-descendant exception; the size demo demonstrates wrong estimates causing scroll jumps, and the shorthand's single value covers both dimensions.
- **Rendering state event:** https://developer.mozilla.org/en-US/docs/Web/API/Element/contentvisibilityautostatechange_event — use to suspend visual canvas work, not semantic DOM updates.
- **Performance comparison and alternative:** https://web.dev/blog/css-content-visibility-baseline ; https://web.dev/articles/virtualize-long-lists-react-window — Chrome's ~7× result is a demo, not a universal uplift; virtualization actually reduces mounted DOM, with overscan/semantics tradeoffs. The older react-window article is architectural background, not a claim about its latest API.
- **Different hidden mechanism:** https://html.spec.whatwg.org/dev/interaction.html ; https://developer.chrome.com/docs/css-ui/hidden-until-found — `hidden=until-found` differs from CSS `content-visibility: hidden` and remains limited to Chromium in the current WHATWG support note.
- **Evidence boundary:** reviewed CSSWG/WHATWG, MDN and Chrome documentation on 2026-10-24; no browser performance trace, assistive-technology reproduction or controlled usability test. Frontend maturity unchanged.
## Playwright CLI skill, MCP comparison and page-tool trust (2026-10-24)
- **Official mechanism and install:** https://playwright.dev/docs/getting-started-cli ; https://playwright.dev/agent-cli/skills ; https://playwright.dev/agent-cli/snapshots ; https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/tools/skills/playwright-cli/SKILL.md — first-party Node 20+ CLI, copied Claude/agents skill, shell-driven snapshots, refs and optional page WebMCP. Apache-2.0 Playwright parent-project maintenance does not measure this skill's effectiveness.
- **Comparative rationale, not outcome trial:** https://playwright.dev/mcp/introduction ; https://github.github.com/gh-aw/blog/2026-09-01-why-playwright-cli-replaces-playwright-mcp/ — GitHub Agentic Workflows made built-in integration CLI-only on 2026-09-01; MCP remains explicit/available. Claims about reduced schema/context overhead are implementation rationale, not an independently measured UI-quality uplift.
- **Stale-copy correction:** https://github.com/microsoft/playwright-cli/issues/480 ; https://github.com/microsoft/playwright-cli/issues/481 ; https://github.com/microsoft/playwright-cli/issues/482 ; https://github.com/microsoft/playwright/commits/main/ — incorrect trace ordering, raw snapshot description and nonexistent matcher reported Oct 16; fixed in canonical Playwright main Oct 19. Mirrored skill text may lag; compare installed artifact before attributing current behavior.
- **Privacy and runtime exceptions:** https://github.com/microsoft/playwright-cli/issues/317 ; https://github.com/microsoft/playwright-cli/issues/483 ; https://github.com/microsoft/playwright/issues/39955 — password-snapshot report closed with secrets-file guidance, not universal auto-masking; CDP attach can hang on suspended extension tabs; a snapshot's accessible elements need not be in viewport.
- **Untrusted page tool boundary:** https://developer.chrome.com/docs/agents/security ; https://developer.chrome.com/docs/ai/webmcp/secure-tools ; https://developer.chrome.com/docs/ai/webmcp/imperative-api ; https://github.com/webmachinelearning/webmcp/blob/main/index.bs — site-provided WebMCP metadata/output can inject instructions; annotations are hints, not independent authorization; tool invocation can mutate state in authenticated context. The Playwright skill's preference for WebMCP to bypass UI overlays must not be generalized into bypassing consent/approval.
- **Evidence boundary:** direct current/mirrored skill and reference-source inspection, primary Playwright/Chrome docs and issue/commit histories; no local install, live comparison, measured token savings, or tested prompt-injection exploit. Status: **conditional recommendation**, no maturity-score increase.

## Server-backed table query integrity (2026-10-24)
- **Whole-set versus loaded-page transforms:** https://tanstack.com/table/v8/docs/guide/sorting ; https://tanstack.com/table/v8/docs/guide/column-filtering ; https://tanstack.com/table/v8/docs/guide/pagination — TanStack Table v8 explicitly warns against client sorting with server pagination; `manualSorting`, `manualFiltering` and `manualPagination` mean the caller owns those operations. Manual pagination disables automatic page reset; unknown `pageCount: -1` cannot establish a true end.
- **Stable database ordering:** https://www.postgresql.org/docs/current/queries-limit.html — PostgreSQL 18 requires a unique `ORDER BY` for predictable LIMIT/OFFSET subsets and warns about large-offset cost. Concurrent mutations shifting offset boundaries, cursor/snapshot mitigation and stale-response rejection are engineering inferences requiring app-specific tests, not measured library behavior.
- **Identity and scope cross-check:** https://tanstack.com/table/v8/docs/guide/row-selection — `getRowId` should use stable IDs; with manual pagination, selected row models contain loaded-page rows even when selection state tracks off-page IDs. Existing bulk-selection guidance covers authorization, query-wide membership and confirmation.
- **Evidence boundary:** First-party library and PostgreSQL documentation, reviewed 2026-10-24; no live database race, screen-reader or cross-framework benchmark. This corrects a common partial-data failure mode, not a claim that server-side tables are always preferable.

## Responsive image art direction, semantic crops and delivery (2026-10-24)
- **Normative image selection:** https://html.spec.whatwg.org/dev/images.html ; https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture ; https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/source — art direction versus resolution choice, first matching source, viewport/media matching, per-source intrinsic dimensions, fallback image and `srcset`/`sizes` mechanics.
- **Cropping and image semantics:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit ; https://www.w3.org/WAI/tutorials/images/ ; https://www.w3.org/WAI/tutorials/images/decorative/ ; https://www.w3.org/WAI/tutorials/images/informative/ — CSS cover can clip content; `alt` reflects contextual meaning and purpose, not image filenames or a generic literal description.
- **Performance and layout:** https://web.dev/learn/html/images ; https://web.dev/articles/optimize-lcp — reserve image aspect ratio, discover LCP images early, do not lazy-load LCP, avoid high-priority competition; guidance, not a measured result for this repository.
- **Framework integration:** https://nextjs.org/docs/app/api-reference/components/image — checked current Next.js 16 docs: `priority` deprecated, `preload` selective, `fill` needs accurate `sizes`, `getImageProps()` enables `<picture>` but cannot clear a blur placeholder.
- **Automatic crop counterexample:** https://cloudinary.com/documentation/cloudinary_ai_content_analysis_object_aware_cropping — first-party demonstration that default saliency can favor people over a storefront, object-specific cropping can omit same-class subjects, and detection fallback depends on crop mode. Vendor examples do not establish error rates.
- **Evidence boundary:** Platform specifications, accessibility tutorials, browser/performance documentation and vendor implementation examples. No independently run device/browser matrix, controlled visual-comprehension trial, or crop-model benchmark.

## Version history, selective undo and restore-scope exceptions (2026-10-24)
- **Figma shipped recovery:** https://help.figma.com/hc/en-us/articles/360038006754-View-a-file-s-version-history — 30-minute checkpoints; restore creates pre/post checkpoints, retains later comments but cannot recover deleted comments; duplicate omits original history/comments; historical access requires edit permission.
- **Notion shipped recovery:** https://www.notion.com/help/duplicate-delete-and-restore-content — 10-minute active / 2-minute idle snapshots; highlights not exhaustive, plan-limited retention and mobile diff limitations; restoring a database does not restore its pages' internal content.
- **Google Docs/Sheets shipped recovery:** https://support.google.com/docs/answer/190843/find-out-what-s-changed-in-a-file-computer — edit access, grouped revisions, restore/copy/named versions; Sheets restore clears earlier cell-by-cell edit history, so copying can preserve evidence.
- **Operation-level alternative:** https://docs.yjs.dev/api/undo-manager — scoped selective undo, tracked origins, default 500 ms capture grouping, stopCapturing; not a durable snapshot or audit log.
- **Normative error-prevention scope:** https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html — for consequential submissions, reversible OR checked OR confirmed; explicitly not a mandate to confirm each routine save.
- **Evidence boundary:** First-party product behavior, library API and WCAG interpretation, reviewed 2026-10-24. No live multiuser/AT test, security review or comparative recovery outcome study.

## Collaborative presence, stale awareness and privacy boundaries (2026-10-24)
- **Protocol and separation:** https://docs.yjs.dev/getting-started/adding-awareness ; https://github.com/yjs/y-protocols/blob/master/PROTOCOL.md — Yjs Awareness is not persisted in Y.Doc; per-client state, clock, null/offline, recommended 15-second refresh and 30-second stale expiry. Protocol semantics, not a real-world user-attention measurement.
- **Shipped integration:** https://liveblocks.io/docs/products/sync/presence ; https://liveblocks.io/docs/use-cases/presence ; https://tiptap.dev/docs/collaboration/core-concepts/awareness — temporary cursors/selections, editor carets, AI-agent TTL, provider-level awareness. Product documentation, not comparative UX validation.
- **Reliability and performance:** https://liveblocks.io/docs/api-reference/liveblocks-react — 100 ms default WebSocket message throttle, 5-second default lost-connection threshold, others reset/reconnect, selective subscriptions and independent sync status.
- **Permissions and privacy counterexample:** https://liveblocks.io/docs/products/sync/permissions ; https://liveblocks.io/docs/platform/data-storage — server-enforced room storage permissions; server-side agents have elevated backend access; transient live presence does not eliminate retained session metadata (room/user ID, approximate geolocation) or data-residency considerations.
- **Shipped attention/communication tradeoffs:** https://help.miro.com/hc/en-us/articles/360013358479-Attention-management ; https://help.miro.com/hc/en-us/articles/360017730553-Toolbars ; https://help.miro.com/hc/en-us/articles/39970518294674-Cursor-chat — follow/bring controls and exit semantics, cursor visibility toggle, temporary chat not preserved in history/export.
- **Accessible update discipline:** https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions — do not flood live regions with frequent pointer events; choose consequential announcements and on-demand alternatives.
- **Evidence boundary:** First-party protocol, vendor docs and shipped-product help. No comparative experiment, verified runtime, assistive-technology testing, security penetration test or user-outcome measurement. Reviewed 2026-10-24.

## Numeric entry, locale parsing and spinbutton failure modes (2026-10-24)
- **Public-service tested guidance and June 2026 revision:** https://design-system.service.gov.uk/components/text-input/ ; https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/ — prefer text/inputmode for most numeric entry; decimal mobile keyboard may lack minus; old AT observations are historical, not assumed current across all AT.
- **Platform and accessibility contracts:** https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number ; https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode ; https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/ — native number implicit spinbutton/default step, inputmode hint only, keyboard semantics.
- **Locale/precision:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat ; https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER — locale-dependent formatting, no general parse inverse, safe-integer limits.
- **Library implementation contract:** https://react-spectrum.adobe.com/NumberField ; https://react-spectrum.adobe.com/v3/NumberField.html — commit-on-blur/step, default snap vs validate, wheel setting, locale/numbering, raw form submission.
- **Version-specific counterexamples:** https://github.com/adobe/react-spectrum/issues/9059 (open signDisplay/negative decrement report, React Aria 1.12.1); https://github.com/adobe/react-spectrum/issues/9671 (closed via #9683); https://github.com/adobe/react-spectrum/issues/1893 and https://github.com/adobe/react-spectrum/issues/9899 (closed via #9905). Do not infer issue prevalence or untested present-day reproducibility.
- **Evidence boundary:** Documentation and reported failure cases; no direct browser/AT trial or quantified UX outcome.


## DTCG builders and export fidelity (2026-10-24)
- **Normative status:** https://www.designtokens.org/tr/2025.10/ ; https://www.designtokens.org/tr/2025.10/format/ ; https://www.designtokens.org/tr/2025.10/resolver/ — stable Community Group Report (not W3C Recommendation); https://www.designtokens.org/tr/drafts/ — 2026-09-08 preview explicitly non-authoritative.
- **Style Dictionary:** https://github.com/style-dictionary/style-dictionary/blob/main/package.json (inspected 5.7.0, Node >=22, Apache-2.0); https://styledictionary.com/info/dtcg/ (2025.10 incomplete); https://styledictionary.com/reference/hooks/transforms/ (ordered transforms, alias interactions).
- **Terrazzo:** https://github.com/terrazzoapp/terrazzo/blob/main/packages/cli/package.json ; https://github.com/terrazzoapp/terrazzo/blob/main/packages/plugin-css/package.json (inspected 2.10.0, MIT); https://github.com/terrazzoapp/terrazzo/blob/main/packages/parser/src/resolver/create-resolver.ts ; https://terrazzo.app/docs/guides/resolvers/ ; https://terrazzo.app/docs/integrations/css/ (resolver/context implementation, CSS permutation/alias/cascade caveats). https://terrazzo.app/docs/ still contains stale “coming in 2.0” copy.
- **Counterexample from shipped token system:** https://opensource.adobe.com/spectrum-design-data/articles/exporting-tokens-to-dtcg/ (2026-09-17) — Spectrum's single-context DTCG export resolves aliases and emits hex color strings; explicitly acknowledges deviation from structured DTCG 2025.10 colors. Direct producer documentation, not inference.
- **Security advisories:** https://github.com/style-dictionary/style-dictionary/security/advisories/GHSA-vj5c-m527-mpff ; https://github.com/style-dictionary/style-dictionary/security/advisories/GHSA-xmr7-549p-98w3 ; https://github.com/style-dictionary/style-dictionary/security/advisories/GHSA-cr3w-v879-f973 — iterative prototype-pollution bypasses through 5.5.4, patched in 5.5.5; risks depend on untrusted token input.
- **Evidence boundary:** Primary spec, vendor implementation/docs, shipped producer docs and maintainers' advisories. No local execution, comparative performance benchmark, output-fixture reproduction or independent security audit. Release/package versions are dated to 2026-10-24.

## OpenPencil design-source agent workflow and lint limitations (2026-10-24)
- **Canonical skill and docs:** https://github.com/open-pencil/open-pencil/blob/master/skills/open-pencil/SKILL.md ; https://openpencil.dev/programmable/mcp-server ; https://github.com/open-pencil/open-pencil/releases/tag/v0.16.0 — headless vs live mode, install/version pairing, scoped reads, design export and 2026-10-14 breaking changes.
- **Inspected implementation, license and security:** https://github.com/open-pencil/open-pencil/blob/master/packages/mcp/package.json ; https://github.com/open-pencil/open-pencil/blob/master/packages/mcp/src/stdio.ts ; https://github.com/open-pencil/open-pencil/blob/master/packages/mcp/src/tool/scope.ts ; https://github.com/open-pencil/open-pencil/blob/master/packages/mcp/src/root.ts ; https://github.com/open-pencil/open-pencil/blob/master/LICENSE ; https://github.com/open-pencil/open-pencil/blob/master/SECURITY.md — MIT, token/loopback/scope, opt-in eval and Windows-home vs Unix-cwd default; explicitly narrow filesystem root.
- **Lint falsification:** https://github.com/open-pencil/open-pencil/blob/master/packages/core/src/lint/rules/color-contrast.ts ; https://github.com/open-pencil/open-pencil/blob/master/packages/core/src/lint/rules/touch-target-size.ts ; https://github.com/open-pencil/open-pencil/blob/master/packages/core/src/lint/rules/min-text-size.ts ; https://github.com/open-pencil/open-pencil/blob/master/packages/core/src/lint/presets.ts — solid-fill/ancestor heuristic, name-based target inference and non-normative 12px heuristic. Compare actual WCAG criteria: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html ; https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html .
- **Resolved issues, not current blockers:** https://github.com/open-pencil/open-pencil/issues/579 (Codex false error, fixed in 0.15.0); https://github.com/open-pencil/open-pencil/issues/750 (reopen lost overrides, closed 2026-10-09). https://github.com/open-pencil/open-pencil/issues/173 is an older open format report whose assumptions require revalidation against current conversion tooling.
- **Evidence boundary:** Direct upstream source and current docs plus maintainer issue/release lifecycle; no local install, runtime security test, WCAG conformance audit, or paired agent fidelity experiment. GitHub stars/forks are adoption signal only.


## Agent-readable visual regression: Argos skills vs Playwright/Chromatic/Percy (2026-10-24)
- **Canonical skill/source inspection:** https://github.com/argos-ci/argos-javascript/blob/main/skills/argos-pr-review/SKILL.md ; https://github.com/argos-ci/argos-javascript/blob/main/skills/argos-cli/SKILL.md ; https://github.com/argos-ci/argos-javascript/blob/main/skills/argos-pr-review/references/baseline.md ; https://github.com/argos-ci/argos-javascript/blob/main/skills/argos-pr-review/references/flaky-fixes.md — PR-intent review, review/ignore commands, baseline semantics, stabilization workarounds; heuristic flakiness claims require adversarial validation.
- **Implementation, license and upload boundary:** https://github.com/argos-ci/argos-javascript/blob/main/packages/playwright/src/screenshot.ts ; https://github.com/argos-ci/argos-javascript/blob/main/packages/playwright/src/reporter.ts ; https://github.com/argos-ci/argos-javascript/blob/main/packages/playwright/package.json ; https://github.com/argos-ci/argos ; https://github.com/argos-ci/argos-playwright — v7.8.0/Node >=22/MIT, optional ARIA captures, screenshot/trace uploads; old integration repository archived.
- **Current agent access / freshness contradiction:** https://argos-ci.com/blog/visual-testing-mcp-servers (2026-10-15), https://argos-ci.com/ai-agents , https://argos-ci.com/blog/review-builds-ai-agents (2026-05-19), vs https://argos-ci.com/blog/playwright-mcp-visual-testing (2026-08-27, stale "no MCP" claim). Current remote MCP supports scoped read/write; older article is superseded.
- **Independent alternatives and limits:** https://playwright.dev/docs/test-snapshots ; https://playwright.dev/docs/api/class-pageassertions ; https://www.chromatic.com/docs/browsers/ ; https://www.chromatic.com/docs/unstable-tests/ ; https://www.browserstack.com/docs/percy/advanced-snapshots/responsive-dom . Local PNG baselines, per-browser cloud baselines, flaky capture and DOM-responsive constraints.
- **Evidence boundary:** First-party code, documentation and vendor comparisons establish mechanisms and risks, not measured agent accuracy or causal product outcomes. No runtime benchmark or third-party security audit performed.


## Storybook MCP revalidation: generated contracts, docgen defects and agent trust (2026-10-23)
- **Storybook 10.6 manifests:** https://storybook.js.org/docs/ai/manifests — generated from stories/docgen; types/JSDoc limits; debugger and experimental docgen-server JSON-404 exception; faster but less detailed parser fallback.
- **Storybook 10.6 MCP API:** https://storybook.js.org/docs/ai/mcp/api — `dev/docs/test` toolset controls, default enabled; Vitest-dependent `test-run`; preview API.
- **Maintainer bug reports:** https://github.com/storybookjs/storybook/issues/34710 — open props-extraction error with react-docgen-typescript; https://github.com/storybookjs/storybook/issues/35778 and https://github.com/storybookjs/storybook/pull/36661 — named-union issue closed 2026-10-15, not an unresolved defect; https://github.com/storybookjs/mcp/issues/214 — one large-monorepo OOM/timeouts report.
- **Canonical current source:** https://github.com/storybookjs/storybook/blob/next/code/addons/mcp/src/preset.ts — Origin/JSON checks, optional composition auth; https://github.com/storybookjs/storybook/blob/next/code/addons/mcp/package.json — MIT, alpha.8 package/dependencies; https://github.com/storybookjs/storybook/blob/next/code/lib/codex-plugin/README.md — experimental plugin setup, story workflows and generated `AGENTS.md` block.
- **Evidence boundary:** Official docs, current package/preset/plugin source and issue lifecycle; no local installation, execution or comparative agent-quality benchmark. Do not infer a closed issue's fix is present in every deployed version.

## Accessibility agent-audit skills: automation, side effects and conformance limits (2026-10-23)
- **masuP9 upstream skill and package:** https://github.com/masuP9/a11y-specialist-skills ; https://github.com/masuP9/a11y-specialist-skills/blob/main/skills/auditing-wcag/SKILL.md ; https://github.com/masuP9/a11y-specialist-skills/blob/main/skills/a11y-knowledge/references/checks-axe.md — six linked skills, criterion-specific evidence/NT rules, installation, compatibility and audit scope.
- **Executable source and CI:** https://github.com/masuP9/a11y-specialist-skills/blob/main/packages/a11y-audit/src/cli.ts ; https://github.com/masuP9/a11y-specialist-skills/blob/main/packages/a11y-audit/src/playwright/runChangeOnInputCheck.ts ; https://github.com/masuP9/a11y-specialist-skills/blob/main/packages/a11y-audit/src/playwright/runPointerCancellationCheck.ts ; https://github.com/masuP9/a11y-specialist-skills/blob/main/.github/workflows/ci.yml — CLI zero-exit conditions, active input/press side effects, declared tests; code inspected, not executed.
- **Comparator:** https://github.com/airowe/claude-a11y-skill/blob/main/skill.md — thin axe/JSX wrapper with CDN-loaded axe 4.8.4 and WCAG 2.1 tag scope; one-commit upstream.
- **Playwright official:** https://playwright.dev/docs/accessibility-testing ; https://playwright.dev/docs/aria-snapshots — axe integration, state-specific scanning, snapshot structure and explicit limits.
- **W3C WAI:** https://www.w3.org/WAI/test-evaluate/tools/selecting/ ; https://www.w3.org/WAI/test-evaluate/ ; https://www.w3.org/WAI/WCAG22/Understanding/conformance — tools assist but cannot determine conformance alone; full pages and complete processes matter.
- **Evidence boundary:** Direct source inspection + standards/official documentation; no execution, independent benchmark, accessibility conformance certification or observed CI run. Upstream adoption signal is not effectiveness evidence.

## Interaction responsiveness, INP phases and scheduler limits — primary docs (2026-10-23)
- **Chrome/web.dev (updated 2025-09-02):** https://web.dev/articles/optimize-inp — INP definition, ≤200 ms / >500 ms thresholds, p75 page visits, three diagnostic phases, field-to-lab workflow.
- **Chrome/web.dev (updated 2024-12-19):** https://web.dev/articles/optimize-long-tasks — main-thread tasks, >50 ms long-task boundary, yielding/chunking trade-offs.
- **Chrome DevTools:** https://developer.chrome.com/docs/performance/insights — INP breakdown, forced reflow and related performance diagnostics.
- **GoogleChrome/web-vitals (current upstream README):** https://github.com/GoogleChrome/web-vitals — maintained `onINP`, attribution build, reporting lifecycle, no-interaction absence, `reportAllChanges` caveat and telemetry examples.
- **MDN Event Timing:** https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming — modern API and default event-duration threshold; compatibility caveats.
- **MDN Long Animation Frames:** https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongAnimationFrameTiming ; https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongAnimationFrameTiming/scripts — limited-availability LoAF and attribution gaps for cross-origin frames/workers.
- **MDN scheduler.yield and deprecated isInputPending:** https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield ; https://developer.mozilla.org/en-US/docs/Web/API/Scheduling/isInputPending — limited scheduler support, prioritized continuation, explicit deprecation of the older input-pending check.
- **React official:** https://react.dev/reference/react/useTransition ; https://react.dev/reference/react/startTransition — non-urgent state rendering versus synchronous controlled input; no blanket fix for blocking JavaScript.
- **Shopify official storefront guidance:** https://shopify.dev/docs/storefronts/themes/best-practices/performance/understanding-inp — independent shipped-platform description of third-party/main-thread competition and INP phases.
- **Evidence boundary:** Platform guidance and API docs, not independent comparative agent-performance evidence. The 2026 contract is synthesis; no real-user or cross-browser benchmark was performed.

## Consent-choice parity, runtime enforcement and country exceptions — regulators (2026-10-23)
- **EDPB taskforce (2023):** https://www.edpb.europa.eu/system/files/2023-01/edpb_20230118_report_cookie_banner_taskforce_en.pdf — majority position on missing rejection, no pre-ticks, misleading visual contrast; explicit minimum-position/national-law disclaimer.
- **EDPB deceptive design (2023):** https://www.edpb.europa.eu/documents/guideline/guidelines-032022-on-deceptive-design-patterns-in-social-media-platform_en — consent withdrawal, obstruction, transparency; social-media scope.
- **CNIL cookie FAQ (updated 2026-04-29):** https://cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/FAQ — choice design, refusal/withdrawal and non-prescriptive recommendations.
- **CNIL cross-device guidance (2026-01-16):** https://www.cnil.fr/fr/cookies-et-autres-traceurs-quelles-conditions-consentir-en-une-fois-pour-plusieurs-appareils — symmetrical scope for accept/reject/withdraw across linked devices.
- **ICO final storage/access guidance (2026-04-29):** https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/ ; https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-we-manage-consent-in-practice/ — choice parity and actual enforcement.
- **ICO narrow UK exceptions (2026):** https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/ — statistical/appearance exceptions with free objection, not a broad advertising exemption.
- **Evidence boundary:** Official regulator guidance is jurisdiction- and purpose-scoped. The repository's implementation tests are synthesis, not a compliance certification or measured user-outcome study.

## Saved-view security and export-scope exceptions — primary product docs (2026-10-23)
- **Airtable URL filters:** https://support.airtable.com/articles/3784973334-shared-view-url-filters — viewer URL predicates can be removed and do not limit the original shared-view dataset.
- **Airtable sharing/export:** https://support.airtable.com/articles/4130354023-Using-the-view-share-menu-in-Airtable — August 2026 guidance: CSV ignores viewer-added filters; hidden-field exceptions, expanded-record exposure, link access/revocation.
- **Notion property permissions:** https://www.notion.com/help/database-property-access — restricted columns can make a view fail to open, and inherited agent access may hide the column entirely; plan-scoped feature.
- **GitHub Projects export:** https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-your-project/exporting-your-projects-data — documents TSV export of a view, illustrating product-specific export contracts.
- **Evidence boundary:** first-party documented behaviors, not an independent penetration test, causal UX study or guarantee of current runtime behavior across accounts. Recheck fast-changing permissions/export details before implementation.

Maintain useful, traceable sources without creating an undifferentiated link dump.

## CSS cascade layers and scoped selectors — standards and implementation references (2026-10-23)
- **Primary docs:** https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40scope ; https://developer.chrome.com/docs/css-ui/at-scope
- **Framework integration:** https://tailwindcss.com/docs/upgrade-guide ; https://tailwindcss.com/docs/preflight ; https://v3.tailwindcss.com/docs/adding-custom-styles
- **Regression report:** https://github.com/mdn/browser-compat-data/issues/29259
- **Why it matters:** Layer precedence outranks specificity; scope proximity is a later tie-breaker and selector scoping does not stop inheritance. Tailwind v3/v4 and Safari 26.0–26.3 exceptions can invalidate agent-generated CSS fixes.
- **Evidence type/boundary:** browser and framework documentation plus a tracked Safari compatibility issue; not a measured UX or agent-quality improvement. Reviewed 2026-10-23.

## Anthropic Engineering — Harness design for long-running application development
- **URL:** https://www.anthropic.com/engineering/harness-design-long-running-apps
- **Type:** first-party engineering experiment
- **Topics:** frontend generation, evaluator agents, visual criteria, Playwright evaluation, long-running agents, acceptance contracts
- **Why it matters:** Direct 2026 evidence from Anthropic about techniques that improved Claude frontend output and full-stack agent reliability.
- **Freshness / date:** Published 2026-03-24; reviewed 2026-09-30.
- **Notes:** Strong evidence about Claude workflow behavior; not controlled UX research about universal aesthetic preference.

## Anthropic Claude Code — official frontend-design skill
- **URL:** https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md
- **Type:** official agent guidance
- **Topics:** visual direction, typography, generic AI UI, design planning, screenshot critique, motion, interface copy
- **Why it matters:** Current first-party instructions intended to steer Claude away from templated frontend defaults.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Treat named aesthetic tells as model-specific calibration signals rather than universal anti-patterns.

## Claude Code Docs — project memory and instruction files
- **URL:** https://code.claude.com/docs/en/memory
- **Type:** official documentation
- **Topics:** AGENTS.md, CLAUDE.md, .claude/rules, path-scoped rules, skills, context architecture
- **Why it matters:** Defines current behavior for persistent and conditional repository instructions.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** AGENTS.md direct support is documented for Claude Code v2.1.277+; loading behavior changes when CLAUDE.md is present.

## Anthropic — Introducing Claude Design by Anthropic Labs
- **URL:** https://www.anthropic.com/news/claude-design-anthropic-labs
- **Type:** official product announcement
- **Topics:** design systems, design-to-code handoff, interactive prototyping, design intent
- **Why it matters:** Shows Anthropic's current design workflow: code/design-file grounding, reusable team design systems, iterative visual controls, and handoff bundles to Claude Code.
- **Freshness / date:** Published 2026-04-17; reviewed 2026-09-30.
- **Notes:** Product capabilities and customer testimonials are not independent comparative research.

## Webflow — 8 web design trends to watch in 2026
- **URL:** https://webflow.com/blog/web-design-trends-2026
- **Type:** trend observation / vendor-curated product examples
- **Topics:** human craft, minimal copy, TL;DR experiences, expressive color/type, scroll guidance, infinite-canvas visual metaphor
- **Why it matters:** Current web-design signal with concrete deployed examples and an explicit intentionality/anti-homogeneity thesis.
- **Freshness / date:** Updated 2026-01-08; reviewed 2026-09-30.
- **Notes:** Many examples are Webflow/community selections. Useful for prevalence and vocabulary, not proof of usability or preference.

## Adobe — 2026 Creative Trends
- **URL:** https://business.adobe.com/resources/creative-trends-report.html
- **Type:** commercial creative trend research
- **Topics:** multisensory/tactile expression, human connection, surreal play, local cultural specificity
- **Why it matters:** Adobe states its trend program combines internal/external data, Creative Cloud community feedback, campaign/project analysis, and search behavior; useful evidence beyond a pure inspiration gallery.
- **Freshness / date:** 2026 report; reviewed 2026-09-30.
- **Notes:** Creative/marketing trend evidence is not equivalent to product UX outcome evidence.

## Canva — Online Whiteboard
- **URL:** https://www.canva.com/online-whiteboard/
- **Type:** first-party product evidence
- **Topics:** infinite canvas, spatial creation, collaboration, diagrams, direct manipulation
- **Why it matters:** Confirms infinite canvas as a shipped interaction model with collaboration, connectors, zoomable space, and workflow integration rather than merely a visual motif.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Establishes adoption, not comparative superiority.

## Webflow Conf 2026 — Builder updates
- **URL:** https://webflow.com/blog/2026-builder-keynote
- **Type:** first-party product evidence
- **Topics:** component canvas, pan/zoom, controlled component styling, performance
- **Why it matters:** Additional product evidence for canvas-like authoring and for balancing component invariants with bounded creative control.
- **Freshness / date:** Published 2026-09; reviewed 2026-09-30.
- **Notes:** Product announcement, not UX experiment.

## Linear — UI refresh and agent workflows
- **URL:** https://linear.app/changelog/2026-03-12-ui-refresh
- **Type:** first-party product evidence
- **Topics:** calmer information hierarchy, consistent navigation, focus, AI coding-tool handoff
- **Why it matters:** Shows a production product explicitly reducing visual competition and increasing workflow consistency while integrating AI coding context.
- **Freshness / date:** Published 2026-03-12; reviewed 2026-09-30.
- **Notes:** Rationale is first-party; no independent outcome measurement provided.

## Linear — Move work forward across teams and agents
- **URL:** https://linear.app/build
- **Type:** first-party product evidence
- **Topics:** agent delegation, parallel work, progress monitoring, contextual AI collaboration
- **Why it matters:** Strong evidence that agent UX is moving from isolated chat toward AI actors embedded in existing work objects and workflows.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Establishes shipped/product positioning, not universal best practice.

## Notion AI — workspace agents
- **URL:** https://www.notion.com/product/ai
- **Type:** first-party product evidence
- **Topics:** embedded agents, enterprise search, scheduled/triggered work, workspace context
- **Why it matters:** Independent product-adoption evidence for contextual agents that edit and act inside the primary workspace.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Use as adoption evidence; product marketing claims are not independent UX outcomes.

## Anthropic Engineering — How we built Claude Code auto mode
- **URL:** https://www.anthropic.com/engineering/claude-code-auto-mode
- **Type:** first-party engineering experiment / product telemetry
- **Topics:** approval fatigue, risk classification, autonomy, deny-and-continue, prompt injection, blast radius
- **Why it matters:** Current quantitative evidence that blanket permission prompting is weak supervision: Anthropic reports roughly 93% approval rates and describes risk-sensitive automated gating and recoverable denials.
- **Freshness / date:** Published 2026-03-25; reviewed 2026-09-30.
- **Notes:** Claude Code telemetry is product-specific; use the architecture, not the exact thresholds, as general guidance.

## Anthropic Engineering — Claude Code sandboxing
- **URL:** https://www.anthropic.com/engineering/claude-code-sandboxing
- **Type:** first-party engineering evidence
- **Topics:** bounded autonomy, filesystem isolation, network isolation, permission fatigue
- **Why it matters:** Reports an 84% reduction in permission prompts from sandboxing and frames technical containment as an enabler of safer autonomy.
- **Freshness / date:** Published 2025-10-20; reviewed 2026-09-30.
- **Notes:** Security/engineering evidence, not a universal UX outcome study.

## OpenAI API — Guardrails and human review
- **URL:** https://developers.openai.com/api/docs/guides/agents/guardrails-approvals
- **Type:** official documentation
- **Topics:** guardrails, human-in-the-loop, side effects, tool approvals
- **Why it matters:** Independent current guidance to pause for human review around consequential side effects while using automated guardrails for validation.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Implementation guidance rather than comparative UX research.

## Microsoft — Guidelines for Human-AI Interaction / HAX Toolkit
- **URL:** https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/
- **Type:** research-backed design guidance
- **Topics:** human-AI interaction, control, correction, failure, trust calibration
- **Why it matters:** The 18 guidelines synthesize more than 20 years of research and provide a durable evidence base beyond current agent-product conventions.
- **Freshness / date:** Reviewed 2026-09-30; original guideline validation published at CHI 2019.
- **Notes:** Broad human-AI guidance; map patterns carefully to autonomous-agent contexts.

## Microsoft HAX — Undo automated actions
- **URL:** https://www.microsoft.com/en-us/haxtoolkit/pattern/g9-c-undo-automated-actions/
- **Type:** research-backed design pattern
- **Topics:** undo, correction, automated changes, user control
- **Why it matters:** Gives explicit conditions and pitfalls for reversible AI automation, including making changes visible and providing a clear reversal mechanism.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Particularly useful for reversible content/state changes; repeated correction can indicate that automation itself should be reconsidered.

## Microsoft Learn — Manage agentic AI risk
- **URL:** https://learn.microsoft.com/security/zero-trust/sfi/manage-agentic-risk
- **Type:** official guidance
- **Topics:** human oversight, plans, progress, audit logs, provenance, interruptibility, uncertainty
- **Why it matters:** Provides a current operational model for agent intelligibility: plans before high-impact work, live status, outcome summaries, logs, and explicit boundaries.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Security-oriented guidance with direct UX implications; not comparative usability testing.

## Design Tokens Community Group — Design Tokens Specification 2025.10
- **URL:** https://www.designtokens.org/TR/2025.10/format/
- **Type:** stable community specification / interoperability standard
- **Topics:** design tokens, typed values, groups, aliases, extensions, cross-tool interoperability
- **Why it matters:** First stable vendor-neutral format for exchanging design decisions; provides a machine-readable foundation that agents and tools can consume without tying the system to one vendor.
- **Freshness / date:** Final Community Group Report published 2025-10-28; reviewed 2026-09-30.
- **Notes:** Stable and intended for implementation, but not a W3C Standards Track Recommendation. It standardizes exchange format, not design-system methodology.

## Design Tokens Community Group — Resolver Module 2025.10
- **URL:** https://www.designtokens.org/TR/2025.10/resolver/
- **Type:** stable community specification
- **Topics:** theming, contextual tokens, light/dark modes, accessibility contexts, token resolution
- **Why it matters:** Defines how stable token roles can resolve differently across contexts without duplicating the whole system.
- **Freshness / date:** Final Community Group Report published 2025-10-28; reviewed 2026-09-30.
- **Notes:** Useful infrastructure for contextual values; does not guarantee accessible or coherent component behavior by itself.

## Apple Human Interface Guidelines — Color
- **URL:** https://developer.apple.com/design/Human-Interface-Guidelines/color
- **Type:** official platform guideline
- **Topics:** semantic color, dynamic appearance, increased contrast, accessibility, role consistency
- **Why it matters:** Strong platform evidence for encoding visual decisions by semantic purpose rather than literal appearance and preserving those meanings across themes/accessibility contexts.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Apple-platform guidance; the semantic-role principle generalizes more safely than platform-specific values.

## IBM Carbon Design System — Themes
- **URL:** https://carbondesignsystem.com/elements/themes/overview/
- **Type:** mature production design-system documentation
- **Topics:** role-based tokens, themes, component tokens, typography, spacing
- **Why it matters:** Concrete production example where token roles remain stable while values change across themes, and where component-specific tokens are scoped rather than treated as global primitives.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Product-system evidence, not comparative research on AI-agent performance.

## Baymard — Applied Filters Overview
- **URL:** https://baymard.com/research-articles/how-to-design-applied-filters
- **Type:** UX research
- **Topics:** filtering, applied state, ecommerce product lists, mobile filters, orientation
- **Why it matters:** Large-scale desktop/mobile testing found that missing applied-filter summaries deprive users of confirmation, fast removal, and context; updated 2026 benchmark reports 28% of sites still omit them.
- **Freshness / date:** Updated 2026-05-13; reviewed 2026-09-30.
- **Notes:** Strong ecommerce evidence; generalize the orientation mechanism more safely than benchmark percentages.

## W3C WAI — Understanding WCAG 4.1.3 Status Messages
- **URL:** https://www.w3.org/WAI/WCAG21/Understanding/status-messages
- **Type:** accessibility standard guidance
- **Topics:** dynamic results, status messages, assistive technology, live updates
- **Why it matters:** Explicitly identifies messages such as “18 results returned” and “No results returned” as status messages when results update without moving focus.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** The result list itself is not the status message; avoid unnecessary focus changes and overly chatty announcements.

## GOV.UK Design System — Pagination
- **URL:** https://design-system.service.gov.uk/components/pagination/
- **Type:** official design-system guidance
- **Topics:** pagination, search results, filtering, sorting, accessibility, infinite scroll
- **Why it matters:** Provides a robust goal-directed result-navigation model, requires whole-set filter/sort behavior and first-page reset, and explicitly warns against automatic infinite scroll for keyboard users.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Public-service guidance; task context still determines whether pagination, load-more, or another model is appropriate.

## MOJ Design System — Filter a list
- **URL:** https://design-patterns.service.justice.gov.uk/patterns/filter-a-list/
- **Type:** official design-system pattern
- **Topics:** filtering, explicit apply, search refinement, state persistence
- **Why it matters:** Deployed pattern for refining result sets with explicit submission and clear separation between initial search and subsequent filtering.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Supports explicit-apply as a valid model, not as a universal prohibition on live filtering.

## DWP Design System — Filter design notes
- **URL:** https://design-system.dwp.gov.uk/contribute/filters/design-notes
- **Type:** official design-system research notes
- **Topics:** filter state, mobile, applied filters, synchronization, focus, zero results
- **Why it matters:** Documents practical state-synchronization and mobile-orientation problems when filters and results are not simultaneously visible.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Research notes are less normative than a mature standard but useful implementation evidence.

## Source record template
### Source / organization
- **URL:**
- **Type:** primary research | official guideline | official documentation | product evidence | case study | trend observation | expert opinion | community signal
- **Topics:**
- **Why it matters:**
- **Freshness / date:**
- **Notes:**


## W3C WAI — WCAG 4.1.3 Status Messages and ARIA25
- **URL:** https://www.w3.org/WAI/WCAG21/Understanding/status-messages
- **Type:** accessibility standard guidance
- **Topics:** loading, waiting, progress, success, errors, live regions
- **Why it matters:** Defines when dynamically presented waiting/progress/result/error information must be programmatically determinable without moving focus.
- **Freshness / date:** Reviewed 2026-09-30; ARIA25 updated 2026.
- **Notes:** Progress-bar values alone are not necessarily announced as live updates; use an appropriate status mechanism when updates need announcement.

## IBM Carbon Design System — Loading pattern
- **URL:** https://carbondesignsystem.com/patterns/loading-pattern/
- **Type:** mature production design-system guidance
- **Topics:** skeletons, loading indicators, scope, progress
- **Why it matters:** Separates structural skeleton states from process indicators and scopes loading feedback to full-page versus inline work.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Useful pattern guidance, not controlled evidence that one indicator universally improves perceived speed.

## Atlassian Design System — Skeleton and progress bar
- **URL:** https://atlassian.design/components/skeleton/usage
- **Type:** mature production design-system guidance
- **Topics:** skeleton geometry, layout stability, shimmer, determinate progress
- **Why it matters:** Explicitly recommends matching skeleton geometry to expected content to avoid jumps and using progress UI when completion state matters.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Product-system guidance; avoid turning implementation conventions into universal perceptual claims.

## MDN — aria-busy and content-visibility
- **URL:** https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy
- **Type:** platform documentation
- **Topics:** busy regions, assistive technology, deferred rendering
- **Why it matters:** Documents current semantics for incomplete region updates; MDN's content-visibility documentation also describes deferring offscreen rendering and using intrinsic sizing to reduce layout instability.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Platform capability evidence, not user-outcome research.


## W3C WAI — Understanding WCAG 2.3.3 Animation from Interactions
- **URL:** https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions
- **Type:** accessibility standard guidance
- **Topics:** interaction-triggered motion, vestibular safety, essential motion, reduced motion
- **Why it matters:** Defines the accessibility rationale for making non-essential interaction-triggered motion preventable and explicitly identifies `prefers-reduced-motion` as a sufficient technique.
- **Freshness / date:** Updated 2025-09-16; reviewed 2026-09-30.
- **Notes:** SC 2.3.3 is WCAG 2.2 Level AAA; avoid misrepresenting it as an AA requirement.

## MDN — View Transition API and ViewTransition
- **URL:** https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- **Type:** platform documentation
- **Topics:** SPA transitions, MPA transitions, shared continuity, skippable transitions, browser support
- **Why it matters:** Documents a current native mechanism for view continuity without hand-managing duplicate old/new DOM states; core ViewTransition is Baseline 2025 and transition types are Baseline 2026.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Platform availability does not prove that a transition improves UX; use as progressive enhancement.

## MDN — prefers-reduced-motion
- **URL:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- **Type:** platform documentation
- **Topics:** user motion preference, CSS media queries, vestibular accessibility
- **Why it matters:** Confirms the widely available web primitive for detecting a user's preference to reduce non-essential motion.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Prefer this mature primitive over experimental preference APIs as the baseline implementation path.

## Apple Human Interface Guidelines — Motion / Reduced Motion
- **URL:** https://developer.apple.com/design/human-interface-guidelines/motion
- **Type:** official platform guideline
- **Topics:** motion intent, feedback, accessibility, reduced motion, depth effects
- **Why it matters:** Independent platform guidance that motion should serve a clear purpose, should not carry essential information alone, and should adapt problematic depth/parallax effects for Reduce Motion.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Platform guidance rather than comparative user-outcome research.


## MDN — Scroll-driven animation timelines
- **URL:** https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines
- **Type:** platform documentation
- **Topics:** scroll progress timelines, view progress timelines, CSS animation timelines, performance, reduced motion
- **Why it matters:** Documents native scroll/view timelines, their direct reversible relationship to scrolling, the main-thread cost avoided versus JavaScript scroll tracking for presentational effects, and reduced-motion handling.
- **Freshness / date:** Reviewed 2026-09-30; page updated in September 2026.
- **Notes:** Platform/performance evidence only; it does not establish that scroll animation improves usability or comprehension.

## MDN — Container scroll-state queries
- **URL:** https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries
- **Type:** platform documentation
- **Topics:** scrollable, scrolled, snapped, stuck, container queries
- **Why it matters:** Provides a discrete CSS alternative when the UI needs to react to scroll state rather than interpolate continuously across scroll progress.
- **Freshness / date:** Reviewed 2026-09-30.
- **Notes:** Check exact descriptor/browser support independently; do not hide essential navigation or information behind unsupported enhancement.
