# Anti-Patterns

Patterns that frequently reduce usability, coherence, accessibility, performance, or visual distinctiveness. Avoid absolute rules; record context and exceptions.

## AI-generated UI watchlist
Generic gradient heroes; floating decorative blobs; interchangeable SaaS layouts; excessive cards; excessive rounded containers; nested containers without hierarchy; gratuitous glassmorphism; oversized headings with weak density; generic icon/title/paragraph feature grids; decorative animation everywhere; stock AI copy; arbitrary dark neon palettes; inconsistent spacing; component-library defaults presented as art direction.

## Cards: a task-based exception to anti-slop rules (2026-10-11)
Cards are appropriate for independent, self-contained previews and navigation choices; they are often inferior to tables for cross-record comparison, lists for homogeneous scanning, and headings/sections for continuous text. USWDS explicitly warns against decorative cards and table-row substitutes. Material Design 1 supports cards for mixed, non-comparison content; NHS discourages whole-card anchor wrappers; Scotland uses a heading link with a stretched clickable area for single-destination cards and prohibits nested actions in that variant. Thus “avoid nested cards” is a diagnostic, not a universal ban. For multiple actions, keep the container non-interactive and provide separate focusable controls. Validate keyboard, screen-reader naming, heading/list semantics and responsive reflow. No controlled outcome comparison was established.

Sources (reviewed 2026-10-11): https://designsystem.digital.gov/components/card/ ; https://service-manual.nhs.uk/design-system/components/card ; https://designsystem.gov.scot/components/card ; https://m1.material.io/components/cards.html .

## Mature analysis format
For each anti-pattern explain:
1. what tends to go wrong
2. why
3. when it may still be appropriate
4. better alternatives
5. implementation implications
6. evidence type
