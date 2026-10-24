# Source Registry

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
