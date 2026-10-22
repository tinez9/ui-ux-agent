# Anti-Patterns

Patterns that frequently reduce usability, coherence, accessibility, performance, or visual distinctiveness. Avoid absolute rules; record context and exceptions.

## AI-generated UI watchlist
Generic gradient heroes; floating decorative blobs; interchangeable SaaS layouts; excessive cards; excessive rounded containers; nested containers without hierarchy; gratuitous glassmorphism; oversized headings with weak density; generic icon/title/paragraph feature grids; decorative animation everywhere; stock AI copy; arbitrary dark neon palettes; inconsistent spacing; component-library defaults presented as art direction.

## Cards: a task-based exception to anti-slop rules (2026-10-11)
Cards are appropriate for independent, self-contained previews and navigation choices; they are often inferior to tables for cross-record comparison, lists for homogeneous scanning, and headings/sections for continuous text. USWDS explicitly warns against decorative cards and table-row substitutes. Material Design 1 supports cards for mixed, non-comparison content; NHS discourages whole-card anchor wrappers; Scotland uses a heading link with a stretched clickable area for single-destination cards and prohibits nested actions in that variant. Thus “avoid nested cards” is a diagnostic, not a universal ban. For multiple actions, keep the container non-interactive and provide separate focusable controls. Validate keyboard, screen-reader naming, heading/list semantics and responsive reflow. No controlled outcome comparison was established.

Sources (reviewed 2026-10-11): https://designsystem.digital.gov/components/card/ ; https://service-manual.nhs.uk/design-system/components/card ; https://designsystem.gov.scot/components/card ; https://m1.material.io/components/cards.html .

## Invented social proof: no evidence, no trust badge — 2026-10-22

**Failure:** AI-generated landing pages often look complete by adding five-star quotes, named customer portraits, “trusted by” logos, case-study outcomes, live counters, or certifications before the owner supplies evidence. The problem is **fabricated claims presented as independent proof**, not the visual style of testimonials. A plausible mockup can become deceptive production content when placeholders lose their status.

### Evidence and counterexample

- **Behavioral evidence is context-specific:** Baymard's direct-to-consumer usability testing found users often distrusted reviews on the brand's own site and sought independent sources; visible critical reviews, user photos and external feedback can help them judge authenticity. This does **not** mean all on-site reviews are useless: Baymard reports heavy reliance on reviews on conventional multibrand ecommerce sites. Avoid the simplistic “add testimonials to build trust” and the opposite “remove all reviews.”
- **Legal boundaries differ by jurisdiction:** the US FTC's 2024 Consumer Reviews and Testimonials Rule addresses fake reviews/testimonials, undisclosed insider relationships and other specified conduct; the FTC clarifies that featuring hosted reviews in advertising makes them *testimonials*, and does **not** ban every AI avatar or require every review host to investigate every submission. EU rules prohibit fake reviews and require reasonable/proportionate steps before claiming reviews are from actual users; UK CMA guidance (April 2025) covers publishing and handling fake/concealed-incentive reviews. Do not turn this summary into jurisdiction-independent legal advice.
- **SEO is not validation:** Google's review-snippet guidance (updated **2026-09-08**) excludes fake or undisclosed incentivized reviews from eligible markup. A business's own `LocalBusiness`/`Organization` page is ineligible for self-serving review stars even when it embeds third-party reviews. A Rich Results Test passing syntax does not prove the claim is authentic, policy-compliant, or eligible for display.

### Better agent workflow

1. **Request a proof inventory** before building a public-facing trust section: exact approved quote, speaker identity and relationship, source URL or customer permission/approval, date, applicable product/service, review sampling/verification method, evidence for numeric outcomes, and rights to logos/photographs. For ratings, record denominator, source, date and selection rules. Distinguish verified data from claims awaiting owner approval.
2. **Design an honest empty state.** With no verified proof, prioritize real product screenshots, a demonstrable workflow, factual capabilities, pricing/terms, concrete process details, team/contact information, or an explicitly labeled example. A page without testimonials is preferable to invented ones.
3. **Keep prototypes unmistakable:** synthetic quotes/metrics may help layout exploration only when visibly labeled as fictional sample content, kept out of structured data, analytics, public metadata and deployment. Use a release gate that fails on unapproved placeholder proof. A label cannot make a false production endorsement acceptable.
4. **Render evidence in context:** attribute a quote accurately without silently changing its meaning; identify incentivized or insider relationships where relevant; link to an external source when permitted; avoid cropped context, cherry-picked all-positive ratings, “verified purchase” without a verification process, or a review count inconsistent with the actual dataset. Do not publish private reviewer information without permission.
5. **Treat logos, badges and counters as separate claim classes:** a client logo implies a relationship; a security/compliance badge implies an audit or certification; a “10k users” counter implies measured adoption. Verify each claim's provenance and permitted use. Do not infer authorization from finding a logo online.
6. **Audit the shipped artifact**, not only the copy: scan visible pages, alt text, structured data, Open Graph/social previews, translation variants, seed/demo content and hardcoded components for fabricated names, ratings, award badges, counts and partner logos. Ensure the CMS source and visible aggregates stay synchronized.

**When legitimate:** attributable, permissioned, accurately scoped reviews/case studies can support decisions; curated testimonials are not inherently dishonest, and fiction is acceptable in clearly identified internal prototypes. **Failure test:** ask an agent to build the same landing page with (a) no proof supplied, (b) three verified mixed reviews, and (c) tempting unverified “4.9/5 from 2,000 users” copy. Pass only if it omits or clearly confines synthetic proof, preserves real negative feedback and never invents public `Review`/`AggregateRating` markup. Measure unsupported claims, provenance traceability and user comprehension, not merely conversion.

**Sources / evidence types:** [Baymard DTC review testing](https://baymard.com/research-articles/user-reviews-dtc) (qualitative usability research; DTC-specific); [FTC final rule](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials) and [FTC Q&A](https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers) (US regulatory scope/interpretation); [EU consumer guidance](https://europa.eu/youreurope/citizens/consumers/unfair-treatment/unfair-commercial-practices/index_en.htm) (EU legal guidance); [UK CMA fake-review guidance](https://www.gov.uk/government/publications/fake-reviews) (UK regulatory guidance); [Google review snippets](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) (search eligibility policy). The release-gate checklist is agent synthesis, **not** a controlled UX outcome study.

## Mature analysis format
For each anti-pattern explain:
1. what tends to go wrong
2. why
3. when it may still be appropriate
4. better alternatives
5. implementation implications
6. evidence type
