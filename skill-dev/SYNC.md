# Skill ↔ lab sync

The `ui-ux` skill (`skills/ui-ux/`) is a consolidated, operational synthesis of the knowledge lab.
The lab keeps evolving (often autonomously); the skill is updated **manually** by merging what is
new. This file is the record that makes that merge tractable.

## Baseline

| Field | Value |
|---|---|
| Lab commit the skill was built from | `51c4155` (research: add native overlay primitive decision model) |
| Date | 2026-10-06 |
| Lab files covered | 94 Markdown files (82 in `knowledge/`) |

## Procedure for a future sync

1. List what changed in the lab since the baseline:

   ```bash
   git diff --stat 51c4155..HEAD -- knowledge research meta agent_context automation
   ```

2. For each changed or new file, find its destination in the mapping table below (new files:
   decide which reference owns the topic — avoid creating new references unless a genuinely new
   area appears).
3. Classify each change, as the lab protocol does: **NEW · IMPROVEMENT · CORRECTION ·
   CONTRADICTION · OBSOLETE · DUPLICATE · UNCONFIRMED · EMERGING**.
   - NEW / IMPROVEMENT / CORRECTION with operational value → edit the owning reference (quick
     rules/checklist first if behaviour should change; details below; keep the evidence boundary).
   - CONTRADICTION → resolve explicitly in the reference; don't keep two rules.
   - OBSOLETE → remove or date the skill text.
   - DUPLICATE / UNCONFIRMED / EMERGING → usually no skill change (EMERGING may get a dated note).
4. If behaviour changes (new rule, lens, severity anchor, finding field), update `SKILL.md`,
   the workflow, the schema or templates accordingly.
5. Re-run the scenarios in `EVALS.md` mentally or with a real project; check links (below).
6. Update the baseline commit above and add a line to the sync log.

Link check (every `references/…`, `workflows/…`, `templates/…`, `schemas/…`, `scripts/…` path
mentioned in the skill must exist):

```bash
cd skills/ui-ux && grep -rhoE '(references|workflows|templates|schemas|scripts)/[a-z0-9._-]+' . | sort -u | while read p; do [ -e "$p" ] || echo "MISSING: $p"; done
```

## Mapping: lab file → skill destination

Legend: destination files are under `skills/ui-ux/`. "lab only" = intentionally not in the skill.

### Governance, meta, research

| Lab file | Destination | Notes |
|---|---|---|
| `AGENTS.md` | `SKILL.md` (core distinctions, evidence discipline) | research protocol stays in the lab |
| `KNOWLEDGE_SUMMARY.md` | lab only | maturity scores belong to the lab |
| `agent_context/CORE.md` | `SKILL.md` (priorities, principles) | |
| `agent_context/DESIGN_PLAYBOOK.md` | `workflows/design.md`, `workflows/improve.md`, `references/inspection.md` | |
| `meta/LEARNING_STATE.md`, `meta/CHANGELOG.md` | lab only | |
| `automation/RESEARCH_PROMPT.md` | lab only | |
| `research/TRENDS.md` | `references/evidence-and-confidence.md` (evidence ladder), `references/generic-ui-and-distinctiveness.md` (trend stance) | dated 2026 signals stay in the lab |
| `research/SOURCES.md`, `FRONTIER.md`, `OPEN_QUESTIONS.md` | lab only | sources summarized in each reference's evidence boundary |

### knowledge/

| Lab file | Destination |
|---|---|
| FOUNDATIONS | `cognition-and-decisions.md`, `forms-and-feedback.md` (feedback hierarchy) |
| MENTAL_MODELS_AND_CONCEPTUAL_INTEGRITY | `cognition-and-decisions.md` |
| CHOICE_ARCHITECTURE_FOR_DENSE_INTERFACES | `cognition-and-decisions.md` |
| DEFAULTS_AND_DECISION_ARCHITECTURE | `cognition-and-decisions.md` |
| RECOGNITION_RECALL_AND_ACTION_DISCOVERABILITY | `cognition-and-decisions.md` |
| PROGRESSIVE_DISCLOSURE_AND_DISCOVERABILITY | `cognition-and-decisions.md` |
| NOVICE_TO_EXPERT_INTERACTION | `cognition-and-decisions.md`, `data-dense-and-power-ui.md` |
| ADAPTIVE_INTERFACES_AND_SPATIAL_STABILITY | `cognition-and-decisions.md` |
| INFORMATION_SCENT_AND_NAVIGATION_PREDICTABILITY | `navigation-and-search.md` |
| NAVIGATION_ARCHITECTURE | `navigation-and-search.md` |
| SAVED_VIEWS | `navigation-and-search.md` |
| UX_PATTERNS | `forms-and-feedback.md` (forms), `states.md` (async), `navigation-and-search.md` (search, navigation) |
| NOTIFICATIONS | `forms-and-feedback.md` |
| ONBOARDING, ONBOARDING_AND_PROGRESSIVE_DISCLOSURE | `onboarding-settings-auth.md` |
| SETTINGS_AND_PREFERENCES, SETTINGS_ARCHITECTURE | `onboarding-settings-auth.md` |
| AUTHENTICATION | `onboarding-settings-auth.md` |
| ERROR_PREVENTION_AND_RECOVERY, ERROR_PREVENTION_CONFIRMATION_AND_UNDO | `risk-and-recovery.md` |
| CONFIRMATION_AND_RISK_FRICTION, DESTRUCTIVE_ACTIONS | `risk-and-recovery.md` |
| UNDO_OPTIMISTIC_COMPENSATION, OPTIMISTIC_UI | `risk-and-recovery.md`, `states.md` |
| AUTOSAVE_DRAFTS, VERSION_HISTORY, COLLABORATIVE_UNDO, ACTIVITY_AUDIT_HISTORY | `risk-and-recovery.md` |
| TABLES_AND_DATA_GRIDS, DATA_GRIDS | `data-dense-and-power-ui.md`, `responsive.md` |
| BULK_ACTIONS, BULK_ACTIONS_AND_SELECTION | `data-dense-and-power-ui.md` |
| COMMAND_PALETTES, COMMAND_PALETTES_AND_ACCELERATOR_LAYERS | `data-dense-and-power-ui.md` |
| FEATURE_PATTERNS | `data-dense-and-power-ui.md` (palette, preview, comparison), `generic-ui-and-distinctiveness.md` (feature filter) |
| PREVIEW_PEEK_NAVIGATION | `data-dense-and-power-ui.md` |
| DIRECT_MANIPULATION, DIRECT_MANIPULATION_AND_DRAG_DROP | `data-dense-and-power-ui.md` |
| DIALOGS_AND_OVERLAYS | `overlays.md` |
| NATIVE_ANCHORED_OVERLAYS_2026, NATIVE_OVERLAY_PRIMITIVES | `overlays.md`, `frontend-implementation.md` |
| ROUTE_OVERLAY_FOCUS_OWNERSHIP | `accessibility.md` (focus ownership) |
| FOCUS_COMPOSITE_WIDGET_TESTING | `accessibility.md`, `evidence-and-confidence.md` (evidence layers) |
| VISUAL_HIERARCHY_UNDER_DENSITY | `layout-and-hierarchy.md`, `severity-and-prioritization.md` (tiers) |
| VISUAL_DESIGN | `layout-and-hierarchy.md` (density), `typography.md` |
| RESPONSIVE_TYPOGRAPHY_SYSTEMS, FONT_LOADING_FALLBACK_METRICS_AND_LAYOUT_STABILITY | `typography.md` |
| DARK_UI_AND_COLOR_ADAPTATION | `color-and-theming.md` |
| ICONOGRAPHY_AS_A_SEMANTIC_SYSTEM, IMAGERY_SYSTEMS_FOR_PRODUCT_INTERFACES | `iconography-and-imagery.md` |
| INTERACTION_MOTION | `motion.md` |
| RESPONSIVE_COMPOSITION_BEYOND_BREAKPOINTS | `responsive.md` |
| FRONTEND_IMPLEMENTATION | `frontend-implementation.md`, `responsive.md`, `motion.md` |
| ART_DIRECTION_FOR_PRODUCT_INTERFACES | `art-direction.md`, `workflows/design.md` |
| ANTI_PATTERNS | `generic-ui-and-distinctiveness.md` (rebuilt as a full catalog) |
| CLAUDE_FRONTEND | `workflows/design.md`, `workflows/improve.md`, `evidence-and-confidence.md` (bias controls), `generic-ui-and-distinctiveness.md` (tells) | Claude Code version notes: lab only |
| DESIGN_SYSTEMS | `design-systems.md` |
| DESIGN_SYSTEM_MIGRATION_CASES | `design-systems.md`, `accessibility.md`, `color-and-theming.md` |
| CODEX_DESIGN_MEMORY_SKILLS | `design-systems.md` (extraction hierarchy, drift triage), `evidence-and-confidence.md` | tool recommendations: lab only |
| AI_DESIGN_SKILLS_AND_AGENT_TOOLING, SUPERDESIGN_SKILL_EVALUATION | `evidence-and-confidence.md` (verification jobs) | tool recommendations: lab only |
| AI_NATIVE_UX, AI_UNCERTAINTY_UX, AI_RELIANCE_AND_TRUST_CALIBRATION_UX | `ai-ux.md` |
| AI_PROVENANCE_AND_VERIFICATION_UX, AI_EVIDENCE_SELECTION | `ai-ux.md` |
| AI_ABSTENTION_AND_ESCALATION_UX, AI_ADVICE_SEQUENCING | `ai-ux.md` |
| AI_AGENT_ACTIVITY, AI_AGENT_PRESENCE_AND_ATTENTION_UX | `ai-ux.md` |
| AI_COLLABORATIVE_EDITING_AND_CONCURRENCY_UX, MULTI_AGENT_DELEGATION_UX | `ai-ux.md` |
| AI_RISK_ROUTING, AI_OVERSIGHT_AT_SCALE, AI_STATE_AUTHORITY_AND_CONFLICT_RESOLUTION | `ai-agent-oversight.md` (risk vector + hard gates also in `severity-and-prioritization.md`) |
| AI_ALERT_COALESCING_AND_CAUSAL_GROUPING, AI_OUTLIER_PRESERVING_SUMMARIZATION | `ai-agent-oversight.md` |
| AI_HANDOFF_AND_CONTEXT_TRANSFER_UX, MULTI_AGENT_CONSENSUS_UX | `ai-agent-oversight.md` |
| AI_EVIDENCE_EVALUATION, AI_OVERSIGHT_ADVERSARIAL_EVALUATION, AI_OVERSIGHT_BENCHMARK_DESIGN | `ai-agent-oversight.md` (evaluation section, compressed) |

### New in the skill (not present as such in the lab)

- `workflows/audit.md`, `workflows/review.md`, `severity-and-prioritization.md`, `inspection.md`,
  `states.md`, the finding schema and report template — operational layer synthesized from the lab.
- `accessibility.md` — first single home for accessibility knowledge scattered across ~30 lab files.

## Reconciled contradictions (baseline)

1. **Typed confirmation:** DESTRUCTIVE_ACTIONS treated it as an escalation step for high-blast-radius
   actions; CONFIRMATION_AND_RISK_FRICTION treats it as exceptional target verification. Skill
   follows the latter (`risk-and-recovery.md`).
2. **Line length:** "~75 characters (GOV.UK)" vs `65ch` example — skill uses "45–75 as a starting
   heuristic; validate" (`typography.md`).
3. **Bulk-selection ownership:** two lab files pointed to each other as canonical — consolidated in
   `data-dense-and-power-ui.md`.

## Known gaps (not filled with invented knowledge)

Content/microcopy as its own topic; dashboards and data visualization; long multi-step forms;
landing-page conversion structure; native mobile (iOS/Android) specifics. The skill handles them
with general principles and appropriately capped confidence. Good candidates for lab research.

## Sync log

| Date | Lab commit | Summary |
|---|---|---|
| 2026-10-06 | `51c4155` | Initial skill built from the lab. |
