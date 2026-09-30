# Design Playbook for AI Coding Agents

## 1. Establish context
Identify product type, primary user, primary task, product goal, real content, content density, target devices, brand constraints, technical constraints, and accessibility requirements.

## 2. Define an explicit visual thesis
Use concrete language such as:
- editorial, restrained, high-contrast, image-led
- technical, dense, calm, data-forward
- cinematic, dark, spacious, content-first
- playful, tactile, bright, motion-led

Avoid vague directions such as “modern”, “clean”, or “premium” unless translated into concrete rules.

## 3. Externalize a small design contract before coding
Define:
- visual thesis
- compact color system and semantic roles
- typography roles and hierarchy
- composition/alignment concept
- one distinctive visual or interaction decision
- what stays deliberately restrained
- motion/state principles
- responsive and accessibility quality floor

Review the contract against the actual brief. If a choice could be reused unchanged for an unrelated product, reconsider it.

## 4. Design hierarchy and flows first
Establish page hierarchy, primary action, secondary actions, navigation, information grouping, content order, key states, and responsive priorities before polishing surfaces.

## 5. Choose patterns intentionally
For each major interaction ask what problem is solved, which conventional pattern already works, whether novelty adds value, what happens on mobile, how keyboard/touch behave, and what loading/empty/error/success states exist.

## 6. Add differentiation selectively
Explore richer previews, contextual actions, intelligent filtering, comparison, progressive exploration, command interfaces, direct manipulation, personalization, and AI-assisted workflows only where they improve the product.

Spend boldness deliberately: one memorable idea surrounded by disciplined supporting design is often stronger than novelty everywhere.

## 7. Implement one representative slice
Build one high-information page or workflow before scaling the system. For complex features, define observable acceptance criteria before implementation.

## 8. Inspect the rendered product
Do not judge UI from source code alone. Use browser interaction and screenshots at realistic viewports.

Look for:
- weak hierarchy
- generic or subject-independent styling
- accidental symmetry
- repetitive cards/containers
- poor density
- inconsistent alignment
- typography without a clear role
- bad mobile recomposition
- visual noise
- interactions that look complete but do not work

## 9. Evaluate with explicit criteria
For demanding design work, evaluate separately on:
- **coherence / design quality**
- **originality / deliberate custom decisions**
- **craft**
- **functionality / usability**

A separate skeptical evaluator can outperform generator self-review on subjective work. Use that overhead selectively rather than automatically.

## 10. Test states
Verify hover, focus, active, disabled, loading, empty, error, success, reduced motion, keyboard navigation, touch targets, and responsive transitions. Treat async UI as explicit states: preserve valid existing content during background work, block only what is actually unavailable, distinguish empty from failure, and never invent determinate progress.

## 11. Refine or pivot
After inspection, decide whether to refine the current direction or replace it. Do not preserve a generic visual thesis merely because implementation has already begun, and do not assume the latest iteration is necessarily the best.

## 12. Refine with evidence
Identify whether a change is motivated by user task, UX principle, accessibility, performance, visual coherence, brand, product differentiation, observed trend, model-specific calibration, or stakeholder preference.

Do not present subjective taste or first-party agent experiments as universal UX evidence.
