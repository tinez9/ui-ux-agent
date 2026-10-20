# Onboarding and Contextual Help — 2026-10-20

**Core decision:** First make the primary task understandable without instruction. Add onboarding only for a *specific learning barrier* demonstrated by research; choose the least interruptive format that resolves it. Feature exposure, tour completion and tip impressions are not evidence of learned ability.

## Choose the intervention

| Situation | Preferred approach | Avoid |
|---|---|---|
| Familiar first task | Clear labels, examples, visible affordances, sensible defaults; start work immediately | Mandatory welcome carousel explaining conventional controls |
| Optional detail some users need | Short, discoverable inline help or labeled native `<details>` | Hiding information most users need |
| Unfamiliar control encountered during work | On-demand explanation adjacent to the control; optional contextual prompt if need signal is reliable | Full-screen tour on app launch or speculative intent detection |
| Novel multi-step interaction | Reversible practice task with feedback and instructions alongside the steps | Slides that require memorizing later actions |
| Complex professional / spatial / safety-critical workflow | Consider a guided sequence or rehearsal if task analysis establishes the prerequisite; validate empirically | Universal prohibition on training |

## Interaction and implementation contract

- Keep help **dismissible and recoverable** from the relevant feature or Help. A skipped tour should not reappear on every launch; version feature-specific dismissal when an interface materially changes. Do not use an account-wide "has seen onboarding" bit to suppress genuinely new help.
- For a passive explanation use inline text, `<details>`, or a short noninteractive tooltip. Use a nonmodal help panel/dialog when content contains links or controls. Reserve modal interruption for an actual prerequisite; never put buttons inside `role="tooltip"`. WAI-ARIA APG's tooltip pattern remains a **work-in-progress**, and focus is expected to stay on the trigger.
- Make the same help available to keyboard, touch and assistive-technology users; hover alone is not enough. For hover/focus-triggered author content, apply WCAG 1.4.13's relevant **dismissible, hoverable, persistent** conditions. Test Escape, focus visibility, return, screen-reader announcements, zoom, reflow and the mobile keyboard. Do not mark the page inert for a nonmodal tip.
- Keep the instructional anchor attached to the correct UI state after navigation, responsive reflow or scrolling. If the target disappears, dismiss or relocate the hint rather than pointing at empty space. Do not cover the action being taught.
- Defer nonessential setup and permissions until users understand the benefit. Keep guidance near the action; do not require remembering several screens of instructions before trying it.

## Evidence and limits

A 2020 Nielsen Norman Group between-subjects study assigned 70 experienced iOS users to read or skip card-based tutorials in four relatively simple apps. Task success was **91% vs 94%** (p=.443; not significant), and completion time was also not significantly different. Readers rated the tasks harder (**SEQ 4.92 vs 5.49**, p=.047). Time spent reading the tutorial was excluded from reported task-completion time. **Do not extrapolate** this result to all onboarding, complex professional applications, interactive rehearsal, other platforms or long-term retention.

NN/g's later analysis advocates help available at the point of need, but its examples are practitioner analysis, not a controlled head-to-head trial. Apple's HIG similarly favors optional, interactive, context-specific onboarding. GOV.UK's deployed `details` pattern cautions that disclosure is inappropriate for information most users need. WCAG provides the accessibility constraints; it does not prove that contextual tips improve learning.

## Verification / falsification

Compare **no tutorial**, **optional contextual help**, and **interactive practice** on matched novice tasks. Measure unassisted first-task success, *total* time including instruction, errors, recovery, later unaided success, perceived difficulty, and keyboard/screen-reader access. Stratify returning users and genuinely novel workflows. If a tip increases interruptions without improving outcomes, remove it; if an unfamiliar high-risk action cannot be learned safely by exploration, test a guided prerequisite.

## Sources (primary / evidence boundaries)

- NN/g, Alita Kendrick (2020-03-08), quantitative four-app tutorial study: https://www.nngroup.com/articles/mobile-tutorials/
- NN/g, Page Laubheimer (2023-02-12), contextual-help critique and exceptions: https://www.nngroup.com/articles/onboarding-tutorials/
- Apple Human Interface Guidelines, Onboarding (platform guidance; reviewed 2026-10-20): https://developer.apple.com/design/human-interface-guidelines/onboarding
- GOV.UK Design System, Details (deployed component guidance): https://design-system.service.gov.uk/components/details/
- W3C WAI-ARIA APG, Tooltip (draft pattern, not consensus): https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
- W3C WCAG 2.2 Understanding SC 1.4.13: https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html
