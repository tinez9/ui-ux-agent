# Project context — <product name>

Project-specific facts the UI/UX skill reads before working. Keep it short and current. General
UI/UX knowledge does not belong here; decisions and constraints of *this* product do.

## Product
- **What it is:** <one sentence>
- **Business goal:** <what success means>
- **Stage:** <prototype / MVP / growth / mature>

## Users
- **Primary users:** <who, expertise, frequency of use, context (on the move, at a desk, stressed…)>
- **Secondary users / roles:** <admins, viewers…>
- **Accessibility needs known:** <target WCAG level, known user needs>

## Platform
- **Platforms:** <web, PWA, iOS/Android webview…> · **Primary device:** <mobile-first / desktop-first>
- **Viewports to inspect:** <default 390x844, 768x1024, 1440x900; add others that matter>
- **Browser support matrix:** <…>
- **Languages / RTL:** <…>

## Important flows
| Flow | Core? | Entry point | Notes |
|---|---|---|---|
| <e.g. log a meal> | core | </route> | |

## Brand and design system
- **Brand rules:** <logo, colors, voice; link to brand assets>
- **Design system / tokens:** <paths, library, Storybook URL>
- **Design contract:** `.claude/ui-ux/design-contract.md` <or none yet>
- **DESIGN.md or other design docs:** <paths>

## Technical constraints
- **Stack:** <framework, styling, component library>
- **Run locally:** <command, URL, test accounts/seed — no real credentials here>
- **Forcing states:** <how to get empty/error/loading data: seeds, flags, mocks, query params>
- **Do not touch:** <legal copy, analytics hooks, generated files…>

## Known issues and decisions
- <deliberate decisions the skill should not "fix", with reason>
- <known pain points, research findings, analytics>
