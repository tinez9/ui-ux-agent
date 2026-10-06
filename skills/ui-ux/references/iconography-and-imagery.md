# Iconography and imagery

Icons are **semantic compression**; images earn space by doing a job. Both fail when used as
decoration that makes a screen look "designed".

## Quick rules

1. Icon-only controls need **semantic clarity** (familiar metaphor), **contextual clarity**
   (placement narrows meaning) and **programmatic clarity** (accessible name on the interactive
   element). Missing one → add a visible label.
2. Primary/consequential actions and non-universal navigation: text (optionally with icon).
3. One icon family; stable concept → icon → label mapping across the product.
4. State is not a tiny glyph change or color alone.
5. Tooltips are secondary labels, not the interaction contract (no hover on touch).
6. Choose imagery by job: recognition, explanation, evidence, comparison, orientation, identity.
   If removing it changes nothing, it's decoration — question its cost.
7. Alt text follows purpose and context (informative / functional / complex / decorative), not pixels.

## Icon vs text

| Situation | Default |
|---|---|
| primary or consequential action | text, optional icon |
| unfamiliar, product-specific, abstract concept | text + optional icon |
| familiar utility in a constrained context (close, search, more) | icon-only can be valid |
| dense expert toolbar | familiar icon-only + tooltip + accessible name |
| navigation categories | persistent text, optional icon |
| status | text or icon + text when ambiguity matters |

## Icon audit checklist

- For each icon: what concept does it encode? would a first-time user know without a tooltip?
  if the label disappeared, is ambiguity acceptable? if the icon disappeared, does the text
  already do all the work?
- Same concept, same icon everywhere; same icon never means two things (metaphor drift).
- Family consistency: stroke/fill strategy, corner/terminal style, optical weight vs adjacent
  text, grid sizes, baseline alignment, no mixed libraries.
- Selected/active/expanded states perceivable beyond a regular→filled swap; toggles expose
  `aria-pressed`; accessible name stable across states.
- Decorative SVG inside labelled buttons hidden (`aria-hidden="true"`); icon-only buttons have the
  name on the button, matching visible meaning.
- RTL: mirror only direction-dependent icons; don't mirror brand/text/clock-like symbols.
- Culturally specific metaphors reviewed for target locales.
- **Icon deletion pass** (anti-generic): remove icons that repeat adjacent text, decorative icons
  on headings/cards, icons creating a badge-card grammar; reintroduce only those with a semantic
  or navigational job.

Failure modes: icon confetti; mystery toolbar (serial tooltip exploration); metaphor drift;
library collage; ARIA camouflage (`aria-label` "fixes" a cryptic icon for AT but not for sighted
users); color-only semantics; tiny-state mutation; blind mirroring; novelty tax (custom metaphor
replacing a familiar one to look original).

## Imagery by purpose

| Need | Default medium | Common failure |
|---|---|---|
| recognize a real person/place/object | photography | generic stock that proves nothing |
| understand a concept/process | diagram / explanatory illustration | decorative illustration pretending to explain |
| learn a product workflow | current UI screenshot, annotated, or live demo | outdated marketing mockups |
| compare quantitative structure | chart + accessible data/description | raster chart with no text equivalent |
| establish an expressive world | illustration/art direction/selective photography | style collage |
| show something not photographable | render | render presented as evidence |

## Imagery audit checklist

- Each image: which job? what disappears if removed? lowest-complexity medium for that job?
- Image system: roles, subject policy, medium policy, framing/crop, treatment, aspect-ratio
  families, responsive focal behaviour, fallback when missing/slow, provenance where trust matters.
- Crops by semantic loss: faces, products, annotations, chart axes, UI controls must survive
  `object-fit: cover`; use focal positioning or art-directed crops; keep screenshots/diagrams whole.
- Screenshots current with the product (stale screenshots imply capabilities that don't exist);
  annotations outside pixels when possible.
- Text baked into images (harms zoom, translation, search, accessibility).
- Generated imagery not passing as documentary evidence (real people, results, product states).
- Alt text by purpose; complex images with short identification + structured nearby equivalent
  (not a giant `alt`); decorative images `alt=""`.
- Card-thumbnail reflex: every item gets an image regardless of meaning/quality.
- Missing asset doesn't collapse hierarchy (fallback defined).

## Evidence boundary

W3C (images tutorial, ACT rules, APG button), Apple HIG (labels, buttons, app icons — illustration
preferred for app icons specifically) and Microsoft Fluent (literal metaphors, toolbar labels,
cultural validation) support these rules. The three-clarity test, icon registry, deletion pass,
medium matrix and semantic-crop test are synthesis to validate with real tasks.
