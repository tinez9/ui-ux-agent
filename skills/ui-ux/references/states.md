# States

Most UI defects live outside the default, happy-path, fast-network, seeded-data state. Treat a
surface as a **state machine**, not a picture.

## Quick rules

1. For every surface in scope, list which states exist and which were inspected.
2. Empty ≠ error. Loading ≠ stale. Pending ≠ done. Saved ≠ synced. Shown ≠ understood.
3. Preserve valid content while working; block only what is actually unavailable.
4. Never invent progress, success or certainty the system doesn't have.
5. Every state must remain understandable without color alone, without motion, at 200% text and
   in the narrowest supported width.
6. A state that cannot be forced is `not covered`, not "OK".

## State matrix

Use this as the checklist and as the coverage table in reports. Mark each cell:
`observed` (BROWSER/INTERACTION), `code-inferred` (CODE), `not covered`, `n/a`.

### A. Data and async

| State | Must communicate | Common failures |
|---|---|---|
| default / success-with-data | content, current scope (filters, query), freshness when it matters | — |
| initial loading | structure about to appear (skeleton) or bounded wait (spinner) | layout shift on arrival; full-page spinner for one widget |
| background refresh | content still valid, refreshing | wiping visible content; focus/scroll jump |
| determinate progress | real progress only | fake percentages/ETAs |
| empty — first use | what will live here, why it's useful, the next action | blank area; marketing card with no action |
| empty — no results | the query/filters still visible, how to broaden | silently showing unrelated results; losing the query |
| error — recoverable | what failed, what is intact, what to do (retry, fix input) | generic "Something went wrong"; clearing input |
| error — permission/auth | why, who can grant, how to proceed | dead end; leaking existence of restricted items |
| partial / stale | which part is missing or old | presenting stale data as fresh |
| offline | what still works, what is queued | buttons that silently fail |

Choosing the indicator: **skeleton** when the destination structure is predictable and reserving
geometry avoids reflow; **spinner/indeterminate** for bounded work without measurable progress;
**determinate** only with trustworthy progress; **inline pending** next to the initiating control
for mutations. No universal wait threshold is established; skeletons are not proven to always
feel faster. Dynamic status, progress, results and errors need accessible status semantics
(WCAG 4.1.3) without stealing focus.

### B. Interaction (per interactive component)

| State | Check |
|---|---|
| hover | not the only way to reveal actions or information (touch has no hover) |
| focus-visible | visible on every background/theme; not obscured by sticky headers/overlays |
| active / pressed | feedback is immediate |
| selected / current | distinct from focus and from hover; not color-only; `aria-current`/`aria-selected`/`aria-pressed` as appropriate |
| disabled | still legible; reason discoverable if users may ask "why can't I?" (consider enabled + explanatory error instead) |
| loading (in control) | prevents duplicate submission; keeps label width stable |
| expanded / collapsed | state exposed (`aria-expanded`), not just an icon rotation |
| read-only vs disabled | not conflated |

### C. Input and validation

| State | Check |
|---|---|
| untouched / dirty | dirty work protected on navigation when loss would hurt |
| validating (async) | pending indicator; stale results ignored |
| invalid | text message tied to the field, says how to fix; values preserved; summary for long forms |
| valid | success shown only when meaningful (async checks, consequential fields) |
| submitted / submitting | duplicate submission prevented; outcome unambiguous |

See `forms-and-feedback.md`.

### D. Mutation and persistence

| State | Meaning | Check |
|---|---|---|
| pending / optimistic | local prediction, authority unresolved | distinguishable when confirmation matters; per item, not a global boolean |
| confirmed | authority agrees | — |
| transformed | accepted but normalized by the server | identity preserved, no flicker/disappear-reappear |
| failed / rolled back | rejected | visible explanation, not a silent snap-back; user input kept |
| conflicted | needs a decision | user work preserved; scope of conflict shown |
| saving / saved / saved locally / syncing / couldn't save | durability boundary | "Saved" only after the defined boundary; no status flicker; failures persistent |
| queued job / partial success | long or bulk work | durable result (succeeded/failed/skipped), not just a toast |

See `risk-and-recovery.md`.

### E. Environment and preferences

| State | Check |
|---|---|
| slow network (e.g. throttled) | feedback appears; nothing double-submits; layout stable |
| offline | see A |
| reduced motion | information conveyed by motion survives; no large spatial motion |
| dark / light | every role and interaction state resolves correctly; images/logos/charts adapted |
| forced colors / high contrast | boundaries, focus, selection survive when shadows/backgrounds are removed |
| 200% text / zoom, 320px reflow | no clipping, overlap or lost function |
| long / localized / RTL content | wrapping, truncation, alignment, mirrored icons |
| permission-limited role | no dead controls; explanations where useful |

### F. User lifecycle

| State | Check |
|---|---|
| first use (no data, no history) | path to first value; empty states doing onboarding work |
| returning user | fast path; no re-onboarding; state restored (filters, drafts, location) |
| expert/power use | accelerators exist; density adequate |
| interrupted / resumed | drafts, unsaved changes, deep links, session expiry handled without data loss |

See `onboarding-settings-auth.md`.

## Minimum coverage per mode

- **audit (full):** for each core flow: default, loading, empty (both kinds if applicable),
  error, validation (if forms), focus-visible + keyboard path, the narrowest viewport, reduced
  motion if motion exists, dark mode if supported.
- **audit (lens):** the states the lens depends on (responsive → widths/zoom/long content;
  a11y → focus/keyboard/contrast/zoom/reduced motion/forced colors; design-system → interaction
  states across a component family).
- **improve / review:** every state touched by the change, at the viewports where the original
  evidence was captured, plus a regression look at sibling states.

## Failure patterns to look for

- Loading UI that destroys context (full-page spinner on refresh; scroll reset).
- Empty and error rendered identically.
- Errors auto-dismissed before they can be read; consequential results living only in a toast.
- Success feedback before the system knows it succeeded.
- Global `isLoading`/`isSaving` booleans that can't represent concurrent operations.
- Focus lost to `<body>` after deletion, closing, or re-render.
- States designed in light mode only.
- Disabled buttons with no reason; hover-only actions on touch devices.
