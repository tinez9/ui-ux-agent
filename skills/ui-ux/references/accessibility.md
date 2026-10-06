# Accessibility

Accessibility is a design constraint from the start — color, type, focus, semantics, motion,
input, content structure — not a final pass. In this skill it is both a **lens** and a **floor**
checked in every audit.

## Quick rules (the floor — check in every audit)

1. **Contrast:** body text ≥ 4.5:1, large text (≥ 24px, or ≥ 18.66px bold) ≥ 3:1, meaningful
   non-text (control boundaries, focus indicators, icons that convey meaning, chart marks) ≥ 3:1.
   Contrast is a floor, not the hierarchy system — "secondary" must not mean illegible.
2. **Focus:** every interactive element reachable by keyboard, focus **visible** on every
   background/theme, not obscured by sticky UI, no keyboard traps, logical order.
3. **Names and semantics:** native elements first (`button`, `a`, `label`, `table`, `dialog`);
   every control has an accessible name matching its visible label; state exposed
   (`aria-expanded`, `aria-pressed`, `aria-current`, `aria-selected`…).
4. **Not color alone:** status, errors, selection, required fields, chart series.
5. **Targets:** pointer targets ≥ 24×24 CSS px or adequately spaced (WCAG 2.5.8 AA); 44×44 is the
   enhanced (AAA) level and a sensible default for frequent/critical touch actions.
6. **Reflow and zoom:** usable at 320 CSS px width without 2-D scrolling (except inherently 2-D
   content like tables/maps), text at 200% without loss; text-spacing overrides don't clip.
7. **Motion:** honour `prefers-reduced-motion`; no essential information carried by motion only.
8. **Status and errors:** dynamic status/progress/results announced without stealing focus
   (4.1.3); errors identified in text, tied to the field, with suggestions (3.3.1/3.3.3).
9. **Alternatives:** informative images have text equivalents by purpose; decorative ones are
   hidden (`alt=""`).
10. **Automation is a detector, not a verdict:** axe-like tools catch a minority of issues; keep
    `violation / pass-for-rule / needs-review`.

## WCAG 2.2 criteria most often relevant to UI audits

| SC | Level | What to check |
|---|---|---|
| 1.1.1 Non-text content | A | alt text by purpose (informative/functional/complex/decorative) |
| 1.3.1 Info & relationships | A | headings, lists, tables, labels, landmarks reflect visual structure |
| 1.3.2 Meaningful sequence | A | DOM order = reading order after CSS reordering |
| 1.4.1 Use of color | A | meaning not only by color |
| 1.4.3 Contrast (minimum) | AA | 4.5:1 / 3:1 large |
| 1.4.4 Resize text | AA | 200% without loss |
| 1.4.10 Reflow | AA | 320 CSS px, no 2-D scroll except essential |
| 1.4.11 Non-text contrast | AA | 3:1 for UI component boundaries/states and meaningful graphics |
| 1.4.12 Text spacing | AA | 1.5 line height, 2× paragraph, 0.12em letter, 0.16em word — no clipping |
| 1.4.13 Content on hover/focus | AA | dismissible, hoverable, persistent |
| 2.1.1 / 2.1.2 Keyboard, no trap | A | everything operable; can always leave |
| 2.3.3 Animation from interactions | AAA | non-essential motion can be disabled (reduced motion) |
| 2.4.3 Focus order | A | preserves meaning and operability (more than one valid order may exist) |
| 2.4.7 Focus visible | AA | visible indicator |
| 2.4.11 Focus not obscured (min) | AA | not fully hidden by sticky headers/footers/overlays |
| 2.5.7 Dragging movements | AA | single-pointer alternative to drag |
| 2.5.8 Target size (min) | AA | 24×24 or spacing/equivalent/inline exceptions |
| 3.2.3 / 3.2.4 Consistent navigation / identification | AA | same order, same names for same functions |
| 3.3.1 / 3.3.3 Error identification / suggestion | A / AA | text errors, correction hints |
| 3.3.4 Error prevention (legal, financial, data) | AA | reversible, checked, or confirmed |
| 3.3.7 Redundant entry | A | don't make users re-enter known info in a process |
| 3.3.8 Accessible authentication (min) | AA | no cognitive function test without alternative (allow paste/password managers) |
| 4.1.2 Name, role, value | A | custom widgets expose them |
| 4.1.3 Status messages | AA | announced without focus change |

WCAG 3 material is still draft: directional, not normative.

## Audit checklist (a11y lens)

**Structure:** one `h1`, logical heading outline, landmarks (`header`, `nav`, `main`, `footer`),
skip link on long pages, lists/tables used semantically, language set.

**Keyboard:** Tab through each core flow; composite widgets follow their APG pattern; Escape
closes overlays; no traps; shortcuts don't hijack typing or AT keys.

**Focus:** visible everywhere (screenshot it on each surface/theme); not obscured; restoration
after dialogs, deletion, route change (see focus ownership below).

**Forms:** visible persistent labels (placeholder is not a label), programmatic association,
required indication not color-only, error text tied with `aria-describedby`, error summary for
long forms, autocomplete attributes for personal data, paste allowed in auth fields.

**Color/contrast:** computed contrast of text roles and component boundaries in every theme and
interaction state (hover/focus/disabled/selected/error); text over images/gradients reviewed
visually.

**Zoom/reflow/spacing:** 320px, 200% text, text-spacing bookmarklet or CSS override.

**Dynamic content:** live regions for status, no chatty announcements, loading/progress semantics
(`<progress>` when it fits), focus not moved merely to announce.

**Media and imagery:** alt text by purpose; complex images with structured equivalents; no text
baked into images where it must be read; captions for video.

**Motion:** reduced-motion variant preserves meaning; no auto-playing large motion without control.

**Forced colors / high contrast:** boundaries, focus and selection survive when shadows and
background images are removed (`forced-colors: active`).

## Focus: a protocol, not focusability

Semantic correctness, focus-state correctness, focus appearance and interaction usability are
**separate evidence layers**. Valid roles can coexist with broken arrow keys; a focused element
can be invisible.

### Composite widgets
Tabs, menus, listboxes, grids, trees, toolbars, radio groups: **one Tab stop into the composite**,
then pattern keys (arrows, Home/End). So:
- "Tab through everything" tests falsely fail correct composites and falsely pass widgets where
  every child is a Tab stop.
- **Roving tabindex:** DOM focus moves; assert exactly one `tabindex=0`, arrows move
  `document.activeElement`, item scrolls into view.
- **`aria-activedescendant`:** DOM focus stays on the container; assert the attribute points to an
  existing item, the visual focus moves with it, and it scrolls into view. `activeElement` alone
  is the wrong oracle.
- **Focus ≠ selection.** Selection-on-focus is fine when activation is instant; harmful when it
  triggers latency/network work (use manual activation).

### Focus recovery after destructive or async changes
When the focused element disappears, unmanaged focus falls to `<body>` — the user loses their
place. Choose the destination by workflow, not geometry:
1. same logical entity if it still exists (reordered/remounted);
2. the component's established contract (deleted list item → next item, then previous/outer);
3. the workflow's next step when the old context is gone (e.g. "add rows" dialog → first new row);
4. escalate when several destinations are plausible.

Optimistic updates need a policy: does focus follow the optimistic state or wait for commit, and
what happens on rollback? Don't chase render timing with `setTimeout(focus)`. Virtualized lists:
recover by item identity, not DOM adjacency. Use **status announcements** for results that don't
invalidate the current focus; move focus only when the old target is invalid or the workflow
advances.

### Focus ownership: routes and overlays
Navigation transport (history, prefetch, streaming) is not an accessibility transition policy,
and rendering completion is not user intent.

| Transition | Owner | Posture |
|---|---|---|
| full document navigation | browser | don't recreate SPA focus code |
| client-side route to a genuinely new view | app/router integration | define a meaningful target (heading/main) + announcement |
| query/filter/tab state in the same view | the component | keep focus where it is |
| streaming / hydration / rerender | existing anchor | never move focus because data arrived |
| native modal dialog open/close | browser + dialog contract | set initial focus only when semantics require; restore to invoker unless it's gone or the workflow advances |
| non-modal popover | trigger/component | no modal focus trap |
| destructive action removes the anchor | workflow | logical successor policy |

Smells: `useEffect(() => ref.focus(), [data])`; `autofocus` on streamed content; route effects
that fire on search-param changes; two owners racing (router + dialog both calling `.focus()`).

### Initial focus in dialogs
Not "first control by rule": long/structured content can start on a heading (`tabindex="-1"`);
destructive confirmations start on the least destructive action; always keep a visible
close/cancel even with Escape.

## Testing layers — what each proves

| Layer | Use for | Cannot prove |
|---|---|---|
| static/token checks | role pairs' contrast, deprecated tokens, missing semantics | real rendering |
| axe-like rules on rendered states | machine-decidable violations in **activated** states (open menus, dialogs, async finished) | focus order meaning, keyboard model, usability |
| keyboard-driven browser tests | key mappings, focus destinations, restoration, roving/activedescendant invariants | perceivability, AT experience |
| accessibility-tree snapshots | roles/names/states after each step (postconditions) | that the keyboard got there |
| rendered checks | visible focus on real backgrounds, clipping at zoom, forced colors | semantics |
| human / AT review | meaning, predictability, announcement quality, custom widgets without a pattern | — |

Wait for async content before running rules (testing an unfinished state gives false
negatives). Track regression ("no new violations") separately from conformance.

**Agent auto-fix boundary.** Safe to fix when the pattern is unambiguous (native/APG/design-system
contract): wrong arrow mapping in a standard tablist, stale `aria-activedescendant`, two
`tabindex=0` in a roving composite, focus falling to body where a documented successor exists,
missing return to a surviving dialog invoker, missing accessible names, missing labels.
Escalate: inventing focus destinations, rewriting a selection model, deciding whether a route
change is a new context, judging announcement quality.

## Themes and variants

The accessibility requirement is invariant; the **proof** is per resolved theme/brand/mode.
Semantic token names (`text-primary`, `focus-ring`) prove intent, not contrast. Test per variant:
text and non-text contrast, focus visibility on each background/state, hover/pressed/selected/
disabled mappings, typography metrics changes, content over images. Forced colors is a different
rendering regime (browser replaces colors, removes shadows/background images): boundaries built
only from `box-shadow` disappear. Prefer native semantics and system colors; treat
`forced-color-adjust: none` as an exception needing its own proof. Cover **independent
variation**, not every combination.

## Failure modes

- ARIA by resemblance (`role="grid"` on a reading table; `role="menu"` on site navigation).
- `aria-label` used to "fix" a cryptic icon — fixes AT exposure, not visual ambiguity.
- Placeholder-as-label; errors only in red; disabled buttons without reasons.
- Global `outline: none` with no replacement; focus ring invisible in dark mode.
- Sticky headers covering focused elements; cookie banners trapping focus.
- Hover-only actions and tooltips containing interactive content.
- Drag as the only way to reorder/move.
- Auth that blocks paste or password managers.
- "axe is green" reported as "accessible".
