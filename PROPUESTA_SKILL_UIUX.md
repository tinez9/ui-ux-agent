# ui-ux-agent → Skill de UI/UX para Claude Code

Fase 1 (Discovery) y Fase 2 (Skill Architecture). No se ha modificado ningún archivo del repositorio.

Fecha: 2026-10-06 · Repositorio analizado: `tinez9/ui-ux-agent` @ `4b474c9` (rama `main`)

---

# FASE 1 — REPOSITORY ANALYSIS

## 1. Resumen ejecutivo

- **Qué es hoy.** Es una base de conocimiento de investigación, no un sistema operativo. Tiene 93 archivos Markdown (~15.000 líneas). 81 de ellos (14.017 líneas) están en `knowledge/`. Todo se generó en ~7 días (2026-09-30 → 2026-10-06) mediante ciclos autónomos de investigación con commit directo a `main`.
- **Calidad del contenido.** Es alta y disciplinada. Casi todos los documentos separan evidencia, síntesis y límites ("evidence boundary"), evitan reglas absolutas y terminan en un "agent decision contract". Ese es el activo principal y hay que preservarlo.
- **Problema estructural 1: no hay enrutamiento.** 65 de los 81 archivos de `knowledge/` no los cita ningún otro archivo. El README describe 10 archivos y existen 81. `KNOWLEDGE_SUMMARY.md` no nombra ningún archivo de `knowledge/`. Un agente no puede saber qué cargar.
- **Problema estructural 2: duplicación por crecimiento autónomo.** Cada ciclo creó un archivo nuevo en vez de mejorar el existente, contradiciendo el propio `AGENTS.md`. Hay 10 clústeres con 2–4 documentos sobre el mismo tema.
- **Problema estructural 3: metadatos obsoletos.** `KNOWLEDGE_SUMMARY.md`, `LEARNING_STATE.md` y `CHANGELOG.md` reflejan el estado del 30-sep. Siguen listando como "huecos" navegación, onboarding, tablas, settings y diálogos, que ahora tienen 2–3 documentos cada uno.
- **Problema estructural 4: el conocimiento no es operativo.** El repositorio no tiene workflow de auditoría, ni formato de hallazgos, ni rúbrica de severidad, ni un documento de accesibilidad. La accesibilidad está repartida en unos 30 archivos. Tampoco hay un catálogo real de anti-patrones: `ANTI_PATTERNS.md` es un esqueleto de 15 líneas.
- **Deriva temática.** Unas 3.000 líneas (clúster "AI oversight") tratan la supervisión de flotas de agentes y la evaluación de interfaces de decisión: benchmarks, coalescencia de alertas, enrutado de riesgo. Es contenido valioso pero muy especializado. Para una Skill generalista de UI/UX es referencia de nicho, no núcleo.

**Conclusión.** El conocimiento existe y es bueno, pero hay que convertirlo de "biblioteca de investigación" a "procedimiento + criterios + referencias enrutadas". La transformación es sobre todo **consolidar (14k → ~6,5k líneas sin perder conocimiento único), enrutar y operativizar**, no escribir conocimiento nuevo de UI/UX.

## 2. Arquitectura actual

```
Capa de gobierno     AGENTS.md (protocolo de investigación + autonomía Git)
                     automation/RESEARCH_PROMPT.md (prompt programado)
Capa de servicio     agent_context/CORE.md + DESIGN_PLAYBOOK.md   ← lo único "operativo"
Capa de conocimiento knowledge/*.md (81 archivos, planos, sin índice)
Capa de investigación research/ (TRENDS, FRONTIER, OPEN_QUESTIONS, SOURCES)
Capa de aprendizaje  meta/LEARNING_STATE.md, meta/CHANGELOG.md, KNOWLEDGE_SUMMARY.md (scores 0–10)
```

**Metodología implícita (muy buena).** Distingue *popular ≠ buena UX*, *trending ≠ recomendado* y *visualmente impresionante ≠ usable*. Usa una escalera de evidencia: showcase → señal comercial → adopción en producto → evidencia de resultado. Clasifica los hallazgos de investigación en NEW / IMPROVEMENT / CORRECTION / CONTRADICTION / OBSOLETE / DUPLICATE / UNCONFIRMED / EMERGING. Aplica una política de frescura (lento / medio / rápido) y una puerta de calidad antes de cada commit.

**Workflow de diseño existente.** Está en `DESIGN_PLAYBOOK` y `CLAUDE_FRONTEND`: contexto → tesis visual → design contract → jerarquía y flujos → patrones → diferenciación selectiva → slice representativo → inspección renderizada → criterios explícitos → estados → refinar o pivotar. Es la semilla directa de los workflows `design` e `improve`.

**Lo que falta para ser operativo.** No hay modo auditoría, ni esquema de hallazgos, ni severidad o priorización, ni modelo de confianza de la propia salida, ni contexto de proyecto, ni cierre de ciclo (re-auditoría).

## 3. Inventario

Leyenda. **Nivel**: CP = Core principle, ME = Methodology, WF = Workflow, HE = Heuristic, PA = Pattern, AP = Anti-pattern, RE = Research, RF = Reference, IM = Implementation guidance, TO = Tooling, LM = Learning/meta.
**Importancia** para una Skill generalista: CRIT / HIGH / MED / LOW / OBS.
**Uso**: I = instrucción permanente (SKILL.md), W = workflow, R = referencia consultable, C = checklist (dentro de la referencia), S = schema/plantilla, L = lab (mantenimiento, fuera de la Skill), D = descartable.

### 3.1 Raíz, gobierno, meta e investigación (12 archivos)

| Archivo | Líneas | Nivel | Imp. | Uso → destino | Notas |
|---|---:|---|---|---|---|
| README.md | 62 | RF | MED | → README nuevo | Estructura obsoleta (10 de 81 archivos) |
| AGENTS.md | 172 | LM/ME | HIGH | I (distinciones core) + L (protocolo) | Contiene la epistemología que debe vivir en SKILL.md |
| KNOWLEDGE_SUMMARY.md | 72 | LM | MED (obsoleto) | L, fusionar con LEARNING_STATE | Scores del 30-sep; no refleja ~60 archivos posteriores |
| agent_context/CORE.md | 42 | CP | **CRIT** | I → SKILL.md | Los 13 principios núcleo |
| agent_context/DESIGN_PLAYBOOK.md | 75 | WF | **CRIT** | W → design/improve/audit | Semilla de los workflows |
| meta/LEARNING_STATE.md | 106 | LM | MED (obsoleto) | L | Prioridades desfasadas |
| meta/CHANGELOG.md | 32 | LM | LOW (obsoleto) | L | Solo 2 entradas tras el 1-oct pese a ~60 archivos nuevos |
| automation/RESEARCH_PROMPT.md | 48 | TO/LM | MED | L (actualizar) | Dice "repositorio privado"; autoriza merge autónomo |
| research/SOURCES.md | 303 | RF | MED | L | Registro de fuentes; sigue siendo útil para mantenimiento |
| research/TRENDS.md | 86 | RE | MED | Escalera de evidencia → R; señales 2026 → L | Las señales caducan rápido |
| research/FRONTIER.md | 20 | RE | LOW | L (fusionar con OPEN_QUESTIONS) | 3 entradas |
| research/OPEN_QUESTIONS.md | 24 | RE | LOW | L | |

### 3.2 `knowledge/` por clúster (81 archivos)

**A. Fundamentos y cognición** → `references/cognition-and-decisions.md` (+ principios en SKILL.md)

| Archivo | Líneas | Nivel | Imp. | Notas |
|---|---:|---|---|---|
| FOUNDATIONS | 203 | CP/HE | **CRIT** | Modelos mentales, arquitectura de elección, confianza y control, jerarquía de feedback. Se solapa con los 4 siguientes |
| MENTAL_MODELS_AND_CONCEPTUAL_INTEGRITY | 175 | HE | HIGH | "Simplify interaction, not causality". Solapa con FOUNDATIONS §mental models |
| CHOICE_ARCHITECTURE_FOR_DENSE_INTERFACES | 166 | HE | HIGH | Solapa con FOUNDATIONS §choice architecture |
| DEFAULTS_AND_DECISION_ARCHITECTURE | 182 | HE | HIGH | Defaults como decisión de producto; consentimiento |
| RECOGNITION_RECALL_AND_ACTION_DISCOVERABILITY | 132 | HE | HIGH | Modelo de colocación de acciones |
| PROGRESSIVE_DISCLOSURE_AND_DISCOVERABILITY | 130 | HE | HIGH | 3.ª versión de progressive disclosure (también en FOUNDATIONS y ONBOARDING_AND_PD) |
| NOVICE_TO_EXPERT_INTERACTION | 144 | PA | MED | "Progressive acceleration"; solapa con command palettes |
| ADAPTIVE_INTERFACES_AND_SPATIAL_STABILITY | 285 | HE/PA | MED | Estabilidad espacial frente a personalización |
| INFORMATION_SCENT_AND_NAVIGATION_PREDICTABILITY | 161 | HE | HIGH | → navigation |

**B. Diseño visual, dirección de arte y anti-genérico**

| Archivo | Líneas | Nivel | Imp. | Destino |
|---|---:|---|---|---|
| VISUAL_HIERARCHY_UNDER_DENSITY | 173 | HE | **CRIT** | layout-and-hierarchy (los tiers T0–T4 alimentan la severidad) |
| VISUAL_DESIGN | 128 | HE | HIGH | typography + layout-and-hierarchy (densidad) |
| RESPONSIVE_TYPOGRAPHY_SYSTEMS | 132 | IM | HIGH | typography (duplica VISUAL_DESIGN §typography) |
| FONT_LOADING_FALLBACK_METRICS_AND_LAYOUT_STABILITY | 166 | IM | MED | typography §font loading |
| DARK_UI_AND_COLOR_ADAPTATION | 153 | HE/IM | HIGH | color-and-theming |
| ICONOGRAPHY_AS_A_SEMANTIC_SYSTEM | 131 | HE | HIGH | iconography-and-imagery ("icon deletion pass" → anti-slop) |
| IMAGERY_SYSTEMS_FOR_PRODUCT_INTERFACES | 107 | HE | MED | iconography-and-imagery |
| ART_DIRECTION_FOR_PRODUCT_INTERFACES | 197 | ME | **CRIT** | art-direction + workflow design (tesis, presupuesto de expresión, firmas, test de ablación de identidad) |
| ANTI_PATTERNS | 15 | AP | HIGH concepto / LOW contenido | Esqueleto; reconstruir como generic-ui-and-distinctiveness |
| CLAUDE_FRONTEND | 142 | WF/TO | **CRIT** (workflow) / OBS (detalles de versión) | Workflows design/audit; "AI tells" → anti-slop; arquitectura de contexto de Claude Code → descartar (caduca) |
| INTERACTION_MOTION | 77 | HE | HIGH | motion |

**C. Responsive, overlays, foco e implementación**

| Archivo | Líneas | Nivel | Imp. | Destino |
|---|---:|---|---|---|
| RESPONSIVE_COMPOSITION_BEYOND_BREAKPOINTS | 154 | ME | **CRIT** | responsive (invariantes + matriz de evaluación) |
| FRONTEND_IMPLEMENTATION | 162 | IM | MED | frontend-implementation (container queries → responsive) |
| NATIVE_ANCHORED_OVERLAYS_2026 | 93 | IM | LOW–MED (caduca rápido) | frontend-implementation, fechado |
| DIALOGS_AND_OVERLAYS | 124 | PA | HIGH | overlays |
| ROUTE_OVERLAY_FOCUS_OWNERSHIP | 152 | IM | HIGH | accessibility §focus ownership |
| FOCUS_COMPOSITE_WIDGET_TESTING | 213 | ME | HIGH | accessibility + evidence-and-confidence ("qué prueba cada capa de evidencia") |

**D. Design systems y tooling**

| Archivo | Líneas | Nivel | Imp. | Destino |
|---|---:|---|---|---|
| DESIGN_SYSTEMS | 150 | ME | **CRIT** | design-systems (invariantes frente a grados de libertad) |
| DESIGN_SYSTEM_MIGRATION_CASES | 213 | RE/ME | HIGH | design-systems (variantes, migración) + accessibility (capas de test de a11y) |
| CODEX_DESIGN_MEMORY_SKILLS | 179 | TO/ME | HIGH (mecanismos) / LOW (herramientas) | design-systems: jerarquía de extracción NORMATIVE…CONFLICT, triage de deriva en 6 clases, deriva multi-eje. Recomendaciones de herramientas → lab |
| AI_DESIGN_SKILLS_AND_AGENT_TOOLING | 219 | TO | MED (caduca rápido) | lab/TOOLING; "separa los trabajos de verificación" → evidence |
| SUPERDESIGN_SKILL_EVALUATION | 135 | TO | LOW | lab/TOOLING |

**E. Patrones UX núcleo**

| Archivo | Líneas | Nivel | Imp. | Destino |
|---|---:|---|---|---|
| UX_PATTERNS | 171 | PA | **CRIT** | forms-and-feedback (formularios), states (async), navigation-and-search (búsqueda/filtros, navegación) |
| NAVIGATION_ARCHITECTURE | 226 | PA | HIGH | navigation-and-search (duplica UX_PATTERNS §navigation) |
| ONBOARDING | 143 | PA | HIGH | onboarding-settings-auth (duplicado) |
| ONBOARDING_AND_PROGRESSIVE_DISCLOSURE | 198 | PA | HIGH | Canónico: tabla de superficies + estados de exposición frente a dominio |
| NOTIFICATIONS | 133 | PA | HIGH | forms-and-feedback §notifications |
| SETTINGS_AND_PREFERENCES | 156 | PA | MED | onboarding-settings-auth (duplicado) |
| SETTINGS_ARCHITECTURE | 168 | PA | MED | Canónico: modelo de "configuración resuelta" |
| AUTHENTICATION | 215 | PA | MED | onboarding-settings-auth (comprimir recuperación y federación) |

**F. Errores, riesgo y recuperación** → `references/risk-and-recovery.md`

| Archivo | Líneas | Nivel | Imp. | Notas |
|---|---:|---|---|---|
| ERROR_PREVENTION_AND_RECOVERY | 140 | HE | HIGH | Canónico: escalera de 8 intervenciones + taxonomía de errores |
| ERROR_PREVENTION_CONFIRMATION_AND_UNDO | 148 | HE | HIGH | Duplicado (~70 %) |
| CONFIRMATION_AND_RISK_FRICTION | 209 | HE | HIGH | Canónico para la fricción: escalera de 7 niveles + tabla "fallo → control" |
| DESTRUCTIVE_ACTIONS | 147 | HE | HIGH | Duplicado; aporta tipos de reversibilidad y destrucción diferida |
| UNDO_OPTIMISTIC_COMPENSATION | 182 | PA | HIGH | 5 clases: undo, commit diferido, optimista, compensación, irreversible |
| OPTIMISTIC_UI | 147 | IM | MED | Estados pending/confirmed/transformed/failed/conflicted |
| AUTOSAVE_DRAFTS | 248 | PA/IM | MED–HIGH | Qué puede significar "Saved"; estados de guardado |
| VERSION_HISTORY | 174 | PA | MED | |
| COLLABORATIVE_UNDO | 187 | PA/IM | LOW–MED | Solo productos colaborativos |
| ACTIVITY_AUDIT_HISTORY | 223 | PA | MED | |

**G. UI densa y para usuarios avanzados** → `references/data-dense-and-power-ui.md`

| Archivo | Líneas | Nivel | Imp. | Notas |
|---|---:|---|---|---|
| TABLES_AND_DATA_GRIDS | 214 | PA | HIGH | Canónico: 5 capas, tabla frente a grid |
| DATA_GRIDS | 146 | PA | HIGH | Duplicado (mismo título "Tables and data grids") |
| BULK_ACTIONS_AND_SELECTION | 163 | PA | HIGH | Canónico: 4 alcances de selección |
| BULK_ACTIONS | 164 | PA | HIGH | Duplicado (~75 %) |
| COMMAND_PALETTES | 204 | PA | MED | Duplicado |
| COMMAND_PALETTES_AND_ACCELERATOR_LAYERS | 162 | PA | MED | Duplicado |
| FEATURE_PATTERNS | 112 | PA | MED | 3.ª copia de command palette, 2.ª de preview, workspace de comparación (único) |
| PREVIEW_PEEK_NAVIGATION | 205 | PA | MED | Duplica FEATURE_PATTERNS §preview |
| SAVED_VIEWS | 94 | PA | MED | → navigation-and-search |
| DIRECT_MANIPULATION | 226 | PA | MED | Duplicado |
| DIRECT_MANIPULATION_AND_DRAG_DROP | 134 | PA | MED | Duplicado |

**H. AI UX operativo** → `references/ai-ux.md`

| Archivo | Líneas | Nivel | Imp. |
|---|---:|---|---|
| AI_NATIVE_UX | 171 | ME | **CRIT** (para productos con IA) — autonomía según riesgo, aprobaciones, recuperación |
| AI_UNCERTAINTY_UX | 201 | HE | HIGH — 8 tipos de incertidumbre |
| AI_RELIANCE_AND_TRUST_CALIBRATION_UX | 145 | HE | HIGH (duplica la calibración de AI_NATIVE_UX) |
| AI_PROVENANCE_AND_VERIFICATION_UX | 178 | HE | HIGH |
| AI_ABSTENTION_AND_ESCALATION_UX | 202 | HE | HIGH |
| AI_AGENT_ACTIVITY | 221 | PA | HIGH — actividad orientada a resultados frente a traza |
| AI_AGENT_PRESENCE_AND_ATTENTION_UX | 138 | PA | HIGH — "supervisión por excepción" |
| AI_ADVICE_SEQUENCING | 193 | RE/HE | MED — IA primero / humano primero / evidencia primero |
| AI_COLLABORATIVE_EDITING_AND_CONCURRENCY_UX | 211 | PA | MED |
| MULTI_AGENT_DELEGATION_UX | 200 | PA | MED |
| AI_HANDOFF_AND_CONTEXT_TRANSFER_UX | 261 | PA | MED → ai-agent-oversight |
| MULTI_AGENT_CONSENSUS_UX | 279 | RE | LOW–MED → ai-agent-oversight |

**I. Supervisión de agentes e investigación de evaluación** → `references/ai-agent-oversight.md` (nicho) + lab

| Archivo | Líneas | Nivel | Imp. | Destino |
|---|---:|---|---|---|
| AI_RISK_ROUTING | 172 | ME | MED | ai-agent-oversight (vector de riesgo + gates no compensatorios, también útiles para la priorización) |
| AI_OVERSIGHT_AT_SCALE | 255 | RE | MED | ai-agent-oversight |
| AI_STATE_AUTHORITY_AND_CONFLICT_RESOLUTION | 250 | RE/IM | LOW–MED | ai-agent-oversight |
| AI_ALERT_COALESCING_AND_CAUSAL_GROUPING | 166 | RE | LOW | ai-agent-oversight (compactado) |
| AI_OUTLIER_PRESERVING_SUMMARIZATION | 188 | RE | LOW | ai-agent-oversight (compactado) |
| AI_EVIDENCE_SELECTION | 205 | RE | MED | ai-ux §provenance (compactado) |
| AI_EVIDENCE_EVALUATION | 183 | RE | LOW | ai-agent-oversight §evaluation |
| AI_OVERSIGHT_ADVERSARIAL_EVALUATION | 159 | RE | LOW | ai-agent-oversight §evaluation |
| AI_OVERSIGHT_BENCHMARK_DESIGN | 207 | RE | LOW | ai-agent-oversight §evaluation (resumen) |

## 4. Redundancias (clústeres duplicados)

| Tema | Archivos | Solapamiento estimado | Canónico propuesto |
|---|---|---|---|
| Tablas/grids | DATA_GRIDS, TABLES_AND_DATA_GRIDS | ~65 % (hasta el título es igual) | TABLES_AND_DATA_GRIDS + escalada de DATA_GRIDS |
| Acciones masivas | BULK_ACTIONS, BULK_ACTIONS_AND_SELECTION, + §§ en DATA_GRIDS, CONFIRMATION, ERROR_PREV_CONF_UNDO | ~75 % | BULK_ACTIONS_AND_SELECTION (alcances simbólicos) + "undo como capacidad" de BULK_ACTIONS |
| Command palette | COMMAND_PALETTES, COMMAND_PALETTES_AND_ACCELERATOR_LAYERS, FEATURE_PATTERNS §1, NOVICE_TO_EXPERT §one command | ~70 % | Un registro de comandos con varias superficies |
| Preview/peek | FEATURE_PATTERNS §2, PREVIEW_PEEK_NAVIGATION | ~60 % | PREVIEW_PEEK (taxonomía) + "tres contratos" de FEATURE_PATTERNS |
| Confirmación/destructivo/undo | ERROR_PREVENTION_AND_RECOVERY, ERROR_PREVENTION_CONFIRMATION_AND_UNDO, CONFIRMATION_AND_RISK_FRICTION, DESTRUCTIVE_ACTIONS, UNDO_OPTIMISTIC_COMPENSATION | ~50–70 % entre pares | Una sola "escalera de intervención" + tabla fallo→control + 5 clases de reversibilidad |
| Onboarding | ONBOARDING, ONBOARDING_AND_PROGRESSIVE_DISCLOSURE | ~60 % | Tabla de superficies + modelo de estados |
| Progressive disclosure | FOUNDATIONS §PD, PROGRESSIVE_DISCLOSURE_AND_DISCOVERABILITY, ONBOARDING_AND_PD §PD, RECOGNITION_RECALL | ~50 % | Una regla de decisión (rol de decisión, no importancia visual) |
| Settings | SETTINGS_AND_PREFERENCES, SETTINGS_ARCHITECTURE | ~65 % | Modelo de configuración resuelta |
| Manipulación directa | DIRECT_MANIPULATION, DIRECT_MANIPULATION_AND_DRAG_DROP | ~55 % | Máquina de estados + equivalencia de resultado |
| Navegación | UX_PATTERNS §navigation, NAVIGATION_ARCHITECTURE, INFORMATION_SCENT | ~40 % | NAVIGATION_ARCHITECTURE (5 preguntas) + scent |
| Tipografía | VISUAL_DESIGN §typography, RESPONSIVE_TYPOGRAPHY_SYSTEMS | ~50 % | Roles + medida + escala acotada |
| Calibración de confianza | FOUNDATIONS §trust, AI_NATIVE_UX §trust, AI_RELIANCE, AI_UNCERTAINTY, AI_PROVENANCE | ~30–40 % | Confianza (producto) en cognition; dependencia apropiada (IA) en ai-ux |

**Causa raíz.** El ciclo autónomo elige "una pregunta enfocada" y la responde en un archivo nuevo, sin leer los 81 existentes porque no hay índice. La duplicación seguirá creciendo si no cambia el protocolo.

## 5. Contradicciones e inconsistencias

**Contradicciones reales de contenido.** Son pocas, porque casi todo está matizado.

1. **Escalera de confirmación.** DESTRUCTIVE_ACTIONS sitúa "typed confirmation / re-auth" como escalón natural para lo irreversible de gran alcance. CONFIRMATION_AND_RISK_FRICTION dice explícitamente que la confirmación tecleada "no es un nivel por defecto por encima del diálogo de peligro" y que solo se justifica si verifica algo relevante (el objetivo). → **Prevalece CONFIRMATION_AND_RISK_FRICTION** (más reciente y más preciso). DESTRUCTIVE_ACTIONS ya aporta el caso de GitHub como ejemplo de verificación del objetivo, así que la reconciliación es trivial.
2. **Longitud de línea.** VISUAL_DESIGN cita "~75 caracteres (GOV.UK)". RESPONSIVE_TYPOGRAPHY usa `65ch` en el ejemplo y pide "evitar cifras universales". → Unificar: rango heurístico de 45–75 caracteres, validado con fuente y contenido reales, nunca como regla.
3. **Ownership de la selección masiva.** DESTRUCTIVE_ACTIONS remite a `DATA_GRIDS.md` y TABLES_AND_DATA_GRIDS remite a `BULK_ACTIONS_AND_SELECTION.md` para el mismo contrato. → Fuente canónica única.

**Inconsistencias de mantenimiento.**

4. `KNOWLEDGE_SUMMARY` / `LEARNING_STATE` declaran huecos (navegación, onboarding, tablas, settings, diálogos) que ya están cubiertos. Los scores (media 3,7/10) no se han revisado desde el 30-sep.
5. `RESEARCH_PROMPT` dice "repositorio privado"; ahora es público.
6. `CLAUDE_FRONTEND` §"Context architecture" fija comportamiento de versiones de Claude Code (v2.1.277+). Es conocimiento de decaimiento rápido sin fecha de caducidad.
7. DESIGN_SYSTEM_MIGRATION_CASES habla de "the repository's multi-axis drift model" como si viviera en DESIGN_SYSTEMS. En realidad está en CODEX_DESIGN_MEMORY_SKILLS, un archivo de evaluación de herramientas. Un concepto núcleo de design systems vive en el sitio equivocado.
8. `AGENTS.md` dice "improve existing files rather than duplicate"; el historial muestra lo contrario. El protocolo no tiene mecanismo que lo haga cumplir.

## 6. Conceptos fragmentados (aparecen en muchos sitios y no tienen hogar)

| Concepto | Dónde aparece | Hogar propuesto |
|---|---|---|
| **Accesibilidad** | ~30 archivos (contraste en VISUAL_HIERARCHY/DARK_UI/DS_MIGRATION, reflow en RESPONSIVE_COMPOSITION/VISUAL_DESIGN, targets en VISUAL_DESIGN, foco en FOCUS/ROUTE/DIALOGS, status messages en UX_PATTERNS, errores en FORMS, motion en INTERACTION_MOTION, hover content en FEATURE_PATTERNS…) | `references/accessibility.md` (nuevo, consolidado) + checklist del lente |
| **Estados** | UX_PATTERNS (async), DESIGN_PLAYBOOK §10, DARK_UI (matriz de estados de componente), DESIGN_SYSTEMS (estados de componente), OPTIMISTIC_UI, AUTOSAVE, ONBOARDING (first-use), INTERACTION_MOTION (reduced motion) | `references/states.md` (matriz única) |
| **Design contract** | DESIGN_PLAYBOOK §3, CLAUDE_FRONTEND §2, ART_DIRECTION (workflow de 7 pasos), DESIGN_SYSTEMS ("what an agent needs"), CODEX ("design memory is a contract") | `templates/design-contract.md` con capas (ver §F2.9) |
| **Capas de evidencia / qué prueba cada verificación** | FOCUS_COMPOSITE (interacción / árbol a11y / render / humano-AT), DS_MIGRATION (estático / DOM / comportamiento / render / humano), AI_DESIGN_SKILLS (visual QA: navegador visible / geometría E2E / barrido headless / razonamiento sobre código), CODEX (NORMATIVE / REPEATED / OBSERVED / APPROXIMATED / CONFLICT / EXCEPTION), axe (violations / passes / incomplete), TRENDS (escalera de evidencia) | `references/evidence-and-confidence.md` — base del sistema de confianza que pides |
| **Anti-genérico / AI slop** | ANTI_PATTERNS (lista), CLAUDE_FRONTEND (tells), ART_DIRECTION (fallos), ICONOGRAPHY (icon confetti, deletion pass), VISUAL_HIERARCHY (cardification), DARK_UI (gray card soup), IMAGERY (stock photo, style collage), DESIGN_PLAYBOOK §8 | `references/generic-ui-and-distinctiveness.md` |
| **Distintividad / test contrafactual** | DESIGN_PLAYBOOK §3 ("si una elección podría reutilizarse sin cambios para un producto no relacionado, reconsidérala"), CLAUDE_FRONTEND, ART_DIRECTION (ablación de identidad, tests de firma) | Mismo archivo + lente de auditoría |
| **Riesgo según consecuencia** | AI_NATIVE_UX, AI_RISK_ROUTING, CONFIRMATION, DESTRUCTIVE, BULK, FOUNDATIONS (control) | risk-and-recovery (producto) + ai-ux (agentes) |

## 7. Fortalezas

1. **Epistemología explícita.** Separa evidencia, síntesis y límites en casi cada documento. Es exactamente lo que necesita el sistema de confianza de la Skill.
2. **"Agent decision contracts".** Más de 60 documentos terminan con preguntas de decisión accionables. Son checklists listas para usar.
3. **Anti-dogmatismo.** Rechaza reglas absolutas (Hick-Hyman, "nunca negro", "siempre confirmar"…). Encaja con tu requisito de no convertir el anti-slop en prohibiciones.
4. **Responsive como recomposición, con invariantes (tarea, relación, comparación, estado).** Es superior a la mayoría de guías públicas.
5. **Design systems como invariantes + libertad acotada + triage de deriva.** Es justo la distinción que pides para evitar sistemas rígidos.
6. **AI UX muy por encima de lo habitual.** Autonomía según riesgo, tipos de incertidumbre, dependencia apropiada, actividad frente a traza.
7. **Workflow de Claude basado en evidencia de Anthropic.** Design contract → criterios explícitos → evaluación renderizada → refinar o pivotar.

## 8. Debilidades

1. Sin enrutamiento ni índice: el 80 % de los archivos son huérfanos.
2. Duplicación del 30–40 % del volumen.
3. Sin capa operativa de auditoría: formato, severidad, priorización, cobertura.
4. Accesibilidad, estados y anti-slop fragmentados.
5. Deriva hacia investigación de nicho (supervisión de agentes, benchmarks) a costa de lo básico. Por ejemplo, no hay guía de **contenido/microcopy** como tema propio ni de **dashboards / visualización de datos**.
6. Metadatos de aprendizaje desactualizados. El sistema de scores no se ha mantenido.
7. Contenido de herramientas (qué skills instalar) mezclado con conocimiento de diseño. Caduca en semanas.
8. Autonomía Git sin revisión. Aceptable para un laboratorio; peligroso cuando el contenido pasa a ser comportamiento de una Skill instalada en proyectos.

## 9. Clasificación de uso

- **Instrucciones permanentes (SKILL.md):** CORE (13 principios), distinciones epistemológicas de AGENTS.md, protocolo de evidencia, reglas de modo (read-only en auditoría), orden de prioridades.
- **Workflows:** DESIGN_PLAYBOOK + CLAUDE_FRONTEND (workflow) + ART_DIRECTION (workflow anti-genérico) + DESIGN_PLAYBOOK §8–12 (inspección y evaluación) → audit / design / improve / review.
- **Referencias consultables:** el resto del conocimiento, consolidado en 24 archivos temáticos.
- **Checklists:** los "agent decision contracts", que se convierten en la sección `## Audit checklist` de cada referencia.
- **Schema / plantillas:** nuevo (formato de finding, informe, design contract, contexto de proyecto, direcciones).
- **Laboratorio (fuera de la Skill):** protocolo de investigación, estado de aprendizaje, changelog, fuentes, preguntas abiertas, tendencias, evaluaciones de herramientas.
- **Descartable:** detalles de versión de Claude Code en CLAUDE_FRONTEND, métricas de adopción (stars/forks) de repos de terceros, la mención "privado" del prompt. Git conserva el original en cualquier caso.

## 10. Oportunidades

1. Convertir los ~60 "decision contracts" en checklists de lente sin escribir conocimiento nuevo.
2. Unificar las 6 taxonomías de evidencia en un único sistema fuente + confianza. Es el corazón de la Skill y ya está investigado.
3. Usar los tiers de jerarquía T0–T4 y los gates no compensatorios de AI_RISK_ROUTING para una priorización defendible.
4. Usar los 4 criterios de Anthropic (calidad, originalidad, oficio, funcionalidad) + el test contrafactual + la ablación de identidad para evaluar direcciones de diseño.
5. Separar el **laboratorio** (investigación continua) de la **Skill** (producto estable). La investigación sigue, pero sus cambios llegan a la Skill por PR revisable.

---

# FASE 2 — SKILL ARCHITECTURE

## F2.1 Decisiones clave (resumen)

| # | Decisión | Por qué |
|---|---|---|
| 1 | **Una sola Skill (`ui-ux`) con modos**, no 7 Skills | Comparten referencias, protocolo de evidencia y formato de hallazgos. Skills separadas obligarían a duplicar o a usar rutas entre Skills, lo que rompe la portabilidad |
| 2 | **4 workflows: `audit`, `design`, `improve`, `review`** | Corresponden a 4 procedimientos distintos (entrada → proceso → salida). Responsive, accesibilidad y design system **no** son procedimientos distintos: son el mismo pipeline de auditoría con otra lista de verificación |
| 3 | **Lentes (`--focus`)** para responsive, a11y, design system, AI UX, distintividad… | Evita duplicar el pipeline. `/ui-ux audit --focus responsive` es tu `/uiux-responsive` sin un workflow redundante |
| 4 | **Evidence-first con fuente + confianza obligatorias en cada hallazgo** | Requisito 9–10 y 29; la base ya existe en el repo |
| 5 | **Read-only por protocolo en `audit`, `review` y `design`** | Requisitos 25 y 30. Límite honesto: una Skill no puede bloquear técnicamente las ediciones (ver §F2.20) |
| 6 | **Referencias = conocimiento consolidado, con checklist arriba y detalle abajo** | Progressive disclosure dentro del archivo: Claude lee primero ~40 líneas y profundiza solo si hace falta |
| 7 | **Contexto de proyecto fuera de la Skill** (`.claude/ui-ux/` en el proyecto) | Separa conocimiento general y contexto de proyecto (requisito 24); permite instalar la Skill a nivel de usuario para todos los proyectos |
| 8 | **Sin RAG** | ~24 referencias con índice "cargar X cuando Y" + Grep resuelven la recuperación (ver §F2.17) |
| 9 | **Laboratorio separado** (`lab/`) que mantiene la Skill vía PR | Preserva el ciclo de aprendizaje sin que cambios no revisados alteren el comportamiento de la Skill instalada |
| 10 | **Instrucciones de la Skill en inglés; informes en el idioma del usuario** | El repo está en inglés y es portable; los informes salen en español si hablas en español |

## F2.2 Estructura de carpetas

```
ui-ux-agent/                                  (repositorio)
├── README.md                                 Qué es, instalación, uso, filosofía, límites, extensión
├── AGENTS.md                                 Corto: reglas para mantener el repo (remite a lab/)
├── CLAUDE.md                                 1 línea: @AGENTS.md
│
├── skills/ui-ux/                             ← UNIDAD INSTALABLE (se copia a .claude/skills/ui-ux)
│   ├── SKILL.md                              Núcleo siempre cargado (~220 líneas)
│   ├── workflows/
│   │   ├── audit.md                          Inspeccionar → evidencia → hallazgos → priorizar → informe
│   │   ├── design.md                         Brief → direcciones A/B/C → evaluación → design contract
│   │   ├── improve.md                        Plan → implementar → renderizar → verificar → re-auditar
│   │   └── review.md                         Verificar cambios/diff contra hallazgos y contrato
│   ├── references/
│   │   ├── evidence-and-confidence.md        ★ siempre en audit/review/improve
│   │   ├── inspection.md                     ★ cómo inspeccionar (navegador, viewports, estados, fallback estático)
│   │   ├── states.md                         ★ matriz de estados
│   │   ├── severity-and-prioritization.md    ★ rúbricas de severidad, prioridad, puntuación
│   │   ├── cognition-and-decisions.md        modelos mentales, elección, defaults, disclosure, confianza y control
│   │   ├── navigation-and-search.md          navegación, scent, URL/historial, búsqueda/filtros, saved views
│   │   ├── forms-and-feedback.md             formularios, validación, mensajes, jerarquía de feedback, notificaciones
│   │   ├── risk-and-recovery.md              prevención, confirmación, destructivo, undo/optimista, autosave, historial
│   │   ├── data-dense-and-power-ui.md        tablas/grids, selección/masivas, densidad, command palette, preview, DnD
│   │   ├── onboarding-settings-auth.md       onboarding, settings, autenticación
│   │   ├── overlays.md                       modal / no modal / popover / drawer / vista dedicada
│   │   ├── layout-and-hierarchy.md           tiers T0–T4, presupuesto de saliencia, agrupación, cardificación, densidad
│   │   ├── typography.md                     roles, escala, medida, responsive, zoom/espaciado, carga de fuentes
│   │   ├── color-and-theming.md              color semántico, contraste como suelo, dark mode, forced colors
│   │   ├── iconography-and-imagery.md
│   │   ├── motion.md
│   │   ├── responsive.md                     ★ lente responsive
│   │   ├── accessibility.md                  ★ lente a11y (consolidado, nuevo hogar)
│   │   ├── design-systems.md                 ★ lente DS: invariantes/libertad, censo, deriva, variantes
│   │   ├── art-direction.md                  tesis, canales, presupuesto de expresión, firmas, análisis de referencias
│   │   ├── generic-ui-and-distinctiveness.md ★ catálogo de AI slop con análisis de contexto + test contrafactual
│   │   ├── ai-ux.md                          productos con IA: autonomía, incertidumbre, procedencia, actividad
│   │   ├── ai-agent-oversight.md             nicho: consolas de supervisión de agentes y evaluación
│   │   └── frontend-implementation.md        CSS frente a JS, primitivas nativas, capacidades fechadas
│   ├── templates/
│   │   ├── project-context.md                Producto, usuarios, plataforma, flujos, restricciones, viewports
│   │   ├── audit-report.md                   Formato de informe (humano + Claude)
│   │   ├── design-directions.md              Direcciones A/B/C + matriz de evaluación
│   │   └── design-contract.md                Contrato de diseño por capas
│   ├── schemas/
│   │   └── finding.schema.json               Estructura de un hallazgo (validable)
│   └── scripts/
│       ├── style-census.mjs                  Censo estático de valores visuales (sin dependencias)
│       └── render-check.mjs                  Capturas + mediciones con Playwright (opcional)
│
└── lab/                                      ← LABORATORIO (no se instala)
    ├── RESEARCH_PROTOCOL.md                  AGENTS.md actual adaptado (ciclo, clasificación, calidad)
    ├── LEARNING_STATE.md                     Fusión de LEARNING_STATE + KNOWLEDGE_SUMMARY (scores por referencia)
    ├── CHANGELOG.md
    ├── SOURCES.md
    ├── OPEN_QUESTIONS.md                     (+ FRONTIER)
    ├── TRENDS.md                             Señales con fecha
    ├── TOOLING.md                            Evaluación de skills/herramientas de terceros
    ├── RESEARCH_PROMPT.md                    Actualizado
    ├── MIGRATION_MAP.md                      Archivo original → destino, con conocimiento único preservado
    └── evals/                                Escenarios de validación de la Skill (Fase 4) para regresión
```

**Por qué `skills/ui-ux/` y no la Skill en la raíz.** Así la unidad instalable queda limpia: no arrastra el laboratorio a cada proyecto. Además, la estructura `skills/<nombre>/` es la que usan los plugins de Claude Code. Si en el futuro quieres distribuirla como plugin (marketplace), basta con añadir un manifiesto (opcional, no incluido en el alcance).

**Archivos originales.** Una vez consolidados, se eliminan de `main`. Git conserva el historial completo y `lab/MIGRATION_MAP.md` registra, para cada uno de los 93 archivos, dónde vive ahora su conocimiento único.

## F2.3 SKILL.md (esquema)

```markdown
---
name: ui-ux
description: >
  UI/UX engineering skill: audit, design, improve and review real web/app interfaces
  with evidence, confidence levels and prioritized findings. Use for UI/UX audits,
  redesigns, design direction, design-system review, responsive or accessibility
  review, AI-product UX, or when asked whether an interface is good, generic,
  usable or consistent.
argument-hint: "[audit|design|improve|review] [target] [--focus …] [--viewports …] [--static]"
---
```

Secciones (objetivo ≤ 220 líneas):

1. **Mission y orden de prioridades.** Product thinking > UX > jerarquía > interacción > accesibilidad > responsive > design system > visual > decoración; evidencia > suposición; propósito > tendencia; identidad > estética IA genérica.
2. **Router de modos.** Interpreta `$ARGUMENTS`; si no hay modo, lo infiere de la petición ("¿qué falla?" → audit; "rediseña" → design; "arregla/implementa" → improve; "¿lo he resuelto?" / un diff → review). Ante la duda, `audit`.
3. **Bucle operativo con puertas.** Understand → Inspect → Hypothesize → Evaluate → Prioritize → Design → Implement → Render → Verify → Iterate. **Puerta 1:** prohibido proponer cambios visuales antes de tener usuario, tarea, flujo y jerarquía. **Puerta 2:** no se cierra un cambio sin evidencia renderizada (o sin declarar que no la hay).
4. **Protocolo de evidencia (resumen).** Observación → interpretación → recomendación; fuentes y confianza obligatorias; frases prohibidas sin evidencia visual ("the layout is broken" cuando solo se ha leído código).
5. **Detección de capacidades del entorno.** ¿Hay herramientas de navegador (in-app browser, Chrome, Playwright MCP, Playwright en el proyecto)? ¿Se puede arrancar el dev server? Si no → **modo estático** declarado, con confianza limitada.
6. **Contexto de proyecto.** Buscar `.claude/ui-ux/project-context.md`, `design-contract.md`, `DESIGN.md`, tokens y Storybook. Si falta, inferirlo y preguntar solo lo imprescindible (máx. 3–5 preguntas). Nunca mezclar conocimiento general con decisiones del proyecto.
7. **Índice de referencias.** Tabla "Carga X cuando Y" (progressive disclosure).
8. **Reglas innegociables** (~10). No modificar código en audit/review/design. No inventar evidencia. No puntuar sin cobertura. No tratar el anti-slop como prohibición. Respetar el design system antes de inventar. Accesibilidad como suelo, no como lente opcional. El build no es verificación. Etc.
9. **Contratos de salida.** Punteros a plantillas y schema.

## F2.4 Workflows

| Modo | Entrada | Proceso (resumido) | Salida | ¿Modifica código? |
|---|---|---|---|---|
| **audit** | alcance (app, ruta, flujo, componente), lentes opcionales | contexto → mapa de flujos y superficies → plan de inspección (viewports × estados) → recoger evidencia → hallazgos → agrupar por causa raíz → priorizar → informe | `.claude/ui-ux/audits/<fecha>-<alcance>.md` (+ capturas) | **No** |
| **design** | brief o hallazgos de una auditoría | entender el producto → restricciones e invariantes (proyecto + DS) → 2–3 direcciones de distinto carácter → evaluación con matriz → recomendación → **espera elección** → design contract (+ wireframe ASCII del slice representativo) | `design-directions.md`, luego `design-contract.md` | **No** (solo artefactos de diseño) |
| **improve** | IDs de hallazgos, "críticos", o un design contract | plan ordenado (cambio ↔ hallazgo ↔ criterio de aceptación) → confirmar alcance → slice representativo primero → implementar → renderizar en los mismos viewports/estados que la evidencia original → re-auditar los hallazgos afectados → actualizar estados | código + plan + estado de hallazgos | **Sí** (solo tras aprobación del plan) |
| **review** | diff/PR, informe previo o "verifica lo hecho" | por hallazgo: ¿resuelto con evidencia de nivel ≥ original? → regresiones en superficies tocadas → coherencia con el design contract → hallazgos nuevos | informe delta: fixed / partially / still-open / regressed / new | **No** |

**Por qué no 7 workflows.** `/uiux-responsive`, `/uiux-accessibility` y `/uiux-design-system` comparten el 100 % del pipeline de `audit`. Lo que cambia es *qué evidencia se recoge* y *qué checklist se aplica*, y eso es un lente. Sí existe un procedimiento propio para DS (censo de valores, inventario de componentes, triage de deriva), pero vive en `design-systems.md § Audit procedure`, que el lente carga.

**Evaluador independiente (opcional).** El repo documenta que la autoevaluación tiende a elogiar el propio trabajo (evidencia de Anthropic). Para cambios grandes, `improve` termina recomendando ejecutar `review` en contexto limpio (subagente) en lugar de autoevaluarse.

## F2.5 Lentes de auditoría

| Lente (`--focus`) | Referencias que carga | Dimensión de la puntuación |
|---|---|---|
| `ux` (por defecto) | cognition, navigation-and-search, forms-and-feedback, risk-and-recovery, onboarding… según superficie | UX & flow |
| `interaction` | states, forms-and-feedback, overlays, motion, risk-and-recovery | Interaction & states |
| `visual` | layout-and-hierarchy, typography, color-and-theming, iconography-and-imagery | Visual & hierarchy |
| `responsive` | responsive (+ typography §zoom, data-dense §responsive tables) | Responsive |
| `a11y` | accessibility (+ color §contrast, states §focus) | Accessibility |
| `design-system` | design-systems (+ script style-census) | Design system |
| `distinctiveness` | generic-ui-and-distinctiveness, art-direction | Identity & distinctiveness |
| `ai` (automático si el producto tiene IA) | ai-ux (+ ai-agent-oversight si es una consola de agentes) | AI UX |

Una auditoría completa sin `--focus` aplica todos los lentes con profundidad proporcional al alcance. La accesibilidad básica (contraste, foco, nombres, targets, reflow) **se comprueba siempre**, también en auditorías de otro lente.

## F2.6 Sistema de evidencia y confianza

**Tres capas obligatorias en cada hallazgo:**
- **Evidence** — lo observado, verificable y reproducible ("At 390px, `nav.primary` has scrollWidth 612 > clientWidth 390").
- **Interpretation** — qué significa ("The navigation model does not adapt to narrow screens").
- **Recommendation** — qué hacer, y el criterio de verificación.

**Fuente de la evidencia** (`evidence[].source`):

| Fuente | Qué es | Puede sostener confianza HIGH en… |
|---|---|---|
| `BROWSER` | interfaz renderizada inspeccionada (DOM, estilos computados, medidas) | layout, overflow, contraste computado, estados alcanzados |
| `INTERACTION` | comportamiento ejercitado (teclado, clics, foco, transiciones) | foco, flujo, feedback, estados dinámicos |
| `SCREENSHOT` | imagen vista (propia o aportada) | jerarquía, composición, impresión visual; **no** semántica oculta |
| `CODE` | lectura de código | estructura, semántica, tokens, lógica de estados; **no** apariencia final |
| `TOOL` | salida de herramienta determinista (axe, style-census, Lighthouse) | solo la regla o medida concreta ejecutada |
| `USER` | dato aportado por el usuario o el proyecto (analytics, research) | según su procedencia |

**Base del juicio** (`basis`): `STANDARD` (WCAG, especificaciones de plataforma) · `RESEARCH` (estudios) · `DESIGN_PRINCIPLE` · `HEURISTIC` · `INFERENCE`. Viene de la escalera de evidencia del repo.

**Reglas de confianza:**
- **HIGH:** evidencia directa (BROWSER / INTERACTION / TOOL) del fenómeno + base STANDARD/RESEARCH/DESIGN_PRINCIPLE + impacto claro.
- **MEDIUM:** evidencia directa de una parte e inferencia del resto; o evidencia de CODE muy específica (p. ej., `outline: none` sin sustituto de foco).
- **LOW:** inferencia desde código sobre apariencia o comportamiento no observado; o juicio puramente heurístico o estético.
- **Techo:** un hallazgo visual o responsive basado solo en CODE **no puede ser HIGH** y debe redactarse como posibilidad ("The code suggests a potential overflow at narrow widths because…").
- **Resultados de herramienta en tres estados** (modelo de axe documentado en el repo): violation / pass-for-this-rule / needs-review. Un "pass" nunca equivale a "accesible".

**Cobertura.** El informe declara qué viewports × estados × flujos se inspeccionaron. Lo no cubierto aparece como **"not assessed"**, nunca como "OK" implícito.

## F2.7 Esquema de hallazgo (`finding.schema.json`)

```yaml
id: RESP-003                 # prefijo de categoría + secuencia; estable entre re-auditorías
title: Primary navigation overflows horizontally at narrow widths
severity: high               # critical | high | medium | low | opportunity
category: responsive         # una principal
tags: [navigation, overflow]
location:
  route: /dashboard
  component: src/components/TopNav.tsx:42
  viewport: 390x844
  state: default
evidence:
  - source: BROWSER
    observation: "nav.primary scrollWidth 612px > viewport 390px; 4 of 7 items unreachable without horizontal scroll"
    artifact: audits/2026-10-06-dashboard/390-default-nav.png
interpretation: The navigation model does not adapt to narrow screens; secondary destinations become undiscoverable.
why_it_matters: Users on phones cannot reach Reports/Settings; violates the task invariant (core destinations reachable).
hierarchy_tier: T1          # T0 seguridad/estado · T1 ancla de tarea · T2 soporte · T3 utilidad · T4 ambiente
affected_flow: Navigate to Reports
reach: core                  # core | secondary | edge
recommendation: Replace horizontal nav with a compact mobile model preserving the 3 primary destinations visibly.
verification: At 320/390/768px all destinations reachable without horizontal scroll; current location announced (aria-current).
confidence: high
basis: [STANDARD, DESIGN_PRINCIPLE]
effort: m                    # s | m | l
root_cause: RC-02            # agrupa síntomas de una misma causa
status: open                 # open | fixed | partially-fixed | regressed | wont-fix | needs-verification
```

Los campos `verification` + `status` + `id` estable son el mecanismo que permite cerrar el ciclo (ver §F2.15).

## F2.8 Severidad, priorización y puntuación

**Severidad con anclas, no por intuición:**
- **critical** — impide completar una tarea núcleo; pérdida de datos o daño irreversible; bloqueo de acceso (WCAG A en flujo núcleo); estado consecuente engañoso (tier T0).
- **high** — fricción o error significativo en un flujo núcleo; fallo WCAG AA en flujo núcleo; rotura responsive en un viewport principal; feedback engañoso.
- **medium** — fricción en flujos secundarios; inconsistencias que confunden; calidad visual que afecta la comprensión.
- **low** — pulido, inconsistencias menores sin impacto en la tarea.
- **opportunity** — no es un defecto: mejora de diferenciación, eficiencia o deleite.

**Priorización.** Mi propuesta es una alternativa a Impact × Severity × Confidence × Frequency, porque esa fórmula cuenta dos veces el impacto (severidad e impacto miden casi lo mismo) y permite que la baja confianza "esconda" un crítico.

1. **Gates no compensatorios** (de AI_RISK_ROUTING): todo `critical` va por encima de todo lo demás; los bloqueos de accesibilidad en flujos núcleo tienen suelo `high`; un hallazgo LOW-confidence no entra en el Top 5 salvo que sea crítico, y entonces aparece como "verificar primero".
2. **Puntuación dentro de cada banda:** `severidad (4/3/2/1/0,5) × alcance (core 3 · secondary 2 · edge 1) × confianza (1 · 0,7 · 0,4)`.
3. **Desempate:** causa raíz que resuelve más síntomas → dependencia (lo que desbloquea otros arreglos) → esfuerzo (quick wins).
4. **Explicación obligatoria** en el Top 5: "ranked above X because …".

**Agrupación por causa raíz.** Por ejemplo, "47 colores hex distintos + 9 radios + botones duplicados" es **1 causa raíz** (no hay capa de tokens semánticos) con 3 síntomas. Esto evita informes de 100 recomendaciones sueltas.

**Puntuación por dimensión.** Mi recomendación se desvía aquí de tu ejemplo:
- Escala **0–10 con anclas** por dimensión (alineada con la cultura de scores 0–10 del repo), derivada de los hallazgos con una rúbrica, no por intuición.
- Cada dimensión lleva **confianza** y **cobertura** al lado. Si no hay evidencia suficiente: `not assessed`.
- **Sin "Overall Score" único por defecto.** Un número global oculta la distribución: un 78 puede esconder un bloqueo crítico de accesibilidad. El repo documenta este fallo como "aggregate-accuracy laundering". En su lugar, un **veredicto** de una línea + el Top 5. Si quieres el número global, puede añadirse como derivado y con advertencia (lo pregunto al final).

## F2.9 Design contract y direcciones múltiples

**Design contract como pieza central.** Sí: es el artefacto que conecta `design` → `improve` → `review`. Vive en el proyecto (`.claude/ui-ux/design-contract.md`), no en la Skill. Capas:

1. **Product truth** — usuario, tarea, contexto, contenido, plataforma (enlaza `project-context.md`).
2. **Visual direction** — tesis visual (1 frase concreta), roles de color, roles tipográficos, concepto de composición, **decisión distintiva** (1–2 firmas), **regla de contención** (qué queda deliberadamente sobrio), política de imagen e iconografía, principios de motion, voz.
3. **System invariants** — suelo de accesibilidad, matriz de estados obligatoria, invariantes responsive (tarea, relación, comparación, estado), invariantes del DS.
4. **Bounded freedoms** — dónde se permite variar (composición, densidad dentro de rangos, expresión en superficies de identidad).
5. **Anti-goals** — atajos genéricos *específicos de este proyecto* que se evitan (no una lista universal).
6. **Acceptance & evaluation** — criterios (coherencia, originalidad, oficio, funcionalidad), test contrafactual, ablación de identidad.

Si el proyecto ya tiene `DESIGN.md` o tokens, el contrato **los referencia como autoridad** en vez de duplicarlos (el repo advierte del riesgo de una "segunda fuente de verdad"). En productos existentes, cada afirmación lleva procedencia: `NORMATIVE / REPEATED / OBSERVED / APPROXIMATED / CONFLICT / EXCEPTION`.

**Direcciones A/B/C.** Sí, pero condicionadas:
- **Cuándo:** producto nuevo, rediseño o petición exploratoria. **Cuándo no:** arreglos acotados, o cuando el DS o el usuario ya fijan la dirección. En ese caso hay 1 dirección y como mucho alternativas de composición.
- **Regla de divergencia:** las direcciones deben diferir en ≥ 2 canales estructurales (composición, tipografía, modelo de interacción), no solo en paleta.
- **Ancla de calibración:** una de ellas debe quedarse cerca de las convenciones, para hacer visible el coste de la diferenciación.
- **Matriz de evaluación** (1–5 + justificación por celda; no una suma ciega): usabilidad/encaje con la tarea, encaje con el producto, distintividad (test contrafactual), viabilidad de accesibilidad, coste de implementación, consistencia con el sistema existente, escalabilidad.
- **Salida:** recomendación + "qué cambiaría mi recomendación" + riesgos. **Se espera la elección del usuario** antes de escribir el contrato.

## F2.10 Estados

`references/states.md` define una **matriz de estados** que todo workflow usa:

| Grupo | Estados |
|---|---|
| Datos/async | default, loading (skeleton / spinner / progress), empty (first-use frente a filtro sin resultados), error (por clase), partial/stale, success |
| Interacción | hover, focus-visible, active/pressed, selected/current, disabled (con motivo), validation (pending/error/success) |
| Mutación | pending/optimistic, confirmed, failed/rolled-back, saving/saved/offline/conflict |
| Entorno | offline, slow network, reduced motion, dark/light/forced-colors, zoom 200 %, idioma largo/RTL |
| Usuario | first use, returning user, permisos/rol limitado |

- **audit:** construye la matriz superficie × estado y marca cada celda como `observed` (BROWSER/INTERACTION), `code-inferred` (CODE), `not covered` o `n/a`. La cobertura sale en el informe.
- **inspection.md** documenta cómo **forzar** estados: throttling/offline de red, datos vacíos o de error (query params, mocks, feature flags, fixtures), teclado, `prefers-reduced-motion` y `color-scheme` emulados, zoom.
- **improve:** un cambio no está terminado hasta verificar los estados que toca.

## F2.11 Responsive como composición

- Parte de **invariantes**, no de dispositivos: tarea, relación, comparación, estado.
- **Viewports por defecto: 390×844, 768×1024, 1440×900.** Son configurables en `project-context.md`. Además, por reglas del repo y WCAG: **320 CSS px** (reflow), **texto al 200 %** y **componente en contenedor estrecho** dentro de un viewport ancho.
- **Barrido opcional** de anchos (p. ej., 320 → 1600 en pasos) para encontrar el punto donde la composición *falla*, en vez de comprobar solo tres capturas.
- **Checklist:** recomposición, inversión de jerarquía, modelo de navegación, densidad, touch targets (24 px AA / 44 px recomendado), tipografía y medida, overflow, controles dependientes de hover, prioridad de información, modelo de interacción (gestos, sticky que tapa contenido), tablas (scroll localizado frente a "cardificación").

## F2.12 Auditoría de design system

Procedimiento en `design-systems.md`:

1. **Inventario de fuentes de verdad:** tokens, tema, componentes, Storybook, DESIGN.md. Con jerarquía de autoridad.
2. **Censo estático** (`style-census.mjs`): colores literales, tamaños de fuente, radios, sombras, espaciados, z-index y su frecuencia; uso de tokens frente a literales.
3. **Inventario de componentes:** detecta equivalentes visuales implementados de forma distinta (p. ej., 4 botones primarios con 3 implementaciones) y variantes innecesarias.
4. **Consistencia de estados** entre componentes de la misma familia.
5. **Triage de deriva** (6 clases del repo): violación de contrato, evolución intencional, excepción aprobada, deuda legacy, contrato obsoleto o ambiguo, ruido de captura. Deriva **multi-eje**: visual, semántica, API, documentación.
6. **Invariantes frente a libertad controlada:** el informe distingue explícitamente qué *debe* unificarse (semántica, estados, accesibilidad, roles de token) y qué **no** debe convertirse en componente (composición, densidad, momentos expresivos). Regla anti-rigidez: no recomendar abstraer en un componente salvo que haya ≥ 3 usos con la misma semántica, o una divergencia que cause errores o inconsistencia percibida.

## F2.13 Anti-AI-slop y distintividad

`generic-ui-and-distinctiveness.md` reconstruye `ANTI_PATTERNS.md` como catálogo con el formato que el propio repo prometía y nunca completó. Para cada patrón (gradient hero, cardificación, glassmorphism arbitrario, pills sin significado, feature grid icono-título-párrafo, titulares gigantes con poca densidad, blobs decorativos, animación en todo, copy IA genérico, dark+neón arbitrario, contenedores anidados, estilo por defecto de librería, eyebrows en mayúsculas, "icon confetti", "gray card soup", stock photos…):

`señal (cómo detectarlo: visual / código) → por qué se percibe genérico → cuándo es legítimo → alternativas → coste de cambiarlo`

**Análisis obligatorio en 4 pasos:** patrón + contexto + propósito + ejecución. El principio rector viene del repo: *"a legitimate style becomes an AI tell when it appears independent of subject matter"*.

**Severidad:** por defecto `opportunity` o `low`. Sube a `medium/high` **solo** si además daña la jerarquía, la legibilidad o la tarea. En ese caso se clasifica bajo esa categoría, no como "estética".

**Distintividad** (dimensión propia, `opportunity` por defecto):
- **Test contrafactual:** ¿la dirección visual podría trasplantarse sin cambios a un producto no relacionado? Se responde con evidencia concreta: qué decisiones son específicas del dominio y cuáles intercambiables.
- **Ablación de identidad:** quitar logo → neutralizar el acento → sustituir el hero. ¿Sobrevive el carácter?
- **Test de firma:** reconocible, sistemática, no obstructiva.
- **Resultado:** "intercambiable / parcialmente propia / propia", con las oportunidades de diferenciación. Explícitamente **no** es una regla: un producto de utilidad puede elegir convencionalidad con razón.

## F2.14 AI UX

`ai-ux.md` (~400 líneas, consolidado de 12 archivos) se carga automáticamente si el producto tiene funciones de IA:
- autonomía según riesgo y diseño de aprobaciones;
- 8 tipos de incertidumbre;
- confianza calibrada frente a "confidence theater";
- procedencia proporcional a la consecuencia;
- abstención como enrutado;
- actividad orientada a resultados frente a traza;
- presencia y atención;
- secuenciación IA-primero / evidencia-primero;
- coedición humano-agente;
- "AI ≠ chat box".

`ai-agent-oversight.md` solo se carga para consolas de supervisión de agentes.

## F2.15 Cierre del ciclo

```
audit ──► informe con findings (id estable + verification)
  │
design ──► direcciones → contrato (criterios de aceptación)
  │
improve ─► plan: cambio ↔ finding ↔ verification
  │        implementar slice → render (mismos viewports/estados que la evidencia original)
  ▼
review ──► por finding: fixed / partially / still-open / regressed + findings nuevos
           (evidencia de nivel ≥ al original; "npm run build" no cuenta como verificación)
```

**Definición de terminado:** cada hallazgo objetivo tiene evidencia de verificación de igual o mayor nivel que la que lo detectó, y no hay regresiones en las superficies tocadas. Si no se puede renderizar, el estado queda `needs-verification`, nunca `fixed`.

## F2.16 Contexto de proyecto

Ubicación propuesta en cada proyecto (configurable):

```
<proyecto>/.claude/ui-ux/
├── project-context.md     Producto, usuarios, plataforma, objetivo de negocio, restricciones técnicas,
│                          marca, DS existente, flujos importantes, viewports, cómo arrancar la app,
│                          cómo forzar estados (seeds, flags)
├── design-contract.md     (lo crea design)
└── audits/
    ├── 2026-10-06-dashboard.md
    └── 2026-10-06-dashboard/   capturas (recomendado en .gitignore)
```

- La Skill **lee** el contexto; **nunca escribe** aprendizajes del proyecto en sus referencias generales.
- Si `project-context.md` no existe, `audit` y `design` proponen crearlo a partir de lo inferido + preguntas mínimas.
- Ejemplo AppFit: rellenaría producto, usuarios objetivo, "mobile-first", flujos (registro de comidas, progreso…) y viewports. Nada de AppFit entra en la Skill.

## F2.17 Progressive disclosure y RAG

**Orden de carga:**

| Capa | Contenido | Tamaño |
|---|---|---|
| CORE | `SKILL.md` | siempre, ~220 líneas |
| WORKFLOW | 1 archivo de workflow según el modo | 120–250 líneas |
| TASK | evidence-and-confidence + inspection + states + severity (solo audit/review/improve) | ~600 líneas |
| RELEVANT KNOWLEDGE | 2–6 referencias según lente y superficie; primero su sección `Audit checklist` / `Quick rules`, el detalle solo si hace falta | variable |
| PROJECT CONTEXT | `.claude/ui-ux/*` | variable |

**Sin RAG.** Unas 24 referencias temáticas de ~150–400 líneas, un índice explícito "cargar X cuando Y" y Grep sobre encabezados resuelven la recuperación con precisión y sin infraestructura. El RAG semántico solo tendría sentido con >80–100 archivos o con búsqueda entre muchos proyectos y auditorías históricas. Ninguna de las dos cosas aplica hoy, y la consolidación reduce el riesgo de que vuelva a hacer falta.

## F2.18 Scripts (solo 2, con responsabilidad clara)

1. **`style-census.mjs`** (Node, sin dependencias). Escanea CSS/SCSS/TSX/JSX/Vue/Svelte y produce frecuencias de colores literales, tamaños tipográficos, radios, sombras, espaciados y z-index, más el ratio token/literal. Da evidencia `TOOL` de confianza HIGH para la deriva del DS. Es barato y determinista.
2. **`render-check.mjs`** (opcional; usa Playwright **solo si ya está instalado en el proyecto**, nunca instala nada por su cuenta). Para URLs × viewports, hace capturas y mide overflow horizontal, elementos fuera del viewport, targets < 24 px, imágenes sin texto alternativo y foco visible en el primer recorrido de Tab. Es útil cuando no hay herramientas de navegador en la sesión (CLI pura) y hace las re-auditorías reproducibles.

No incluyo un validador de informes ni otros scripts: Claude puede verificar el schema él mismo y añadirlos sería crear archivos porque sí.

## F2.19 Aprendizaje (laboratorio)

Se preserva el ciclo `research → compare → classify → update knowledge → update learning state`, con estos cambios:
- **El destino de las actualizaciones** pasa a ser `skills/ui-ux/references/*.md`. Antes de crear un archivo, la regla es: "¿qué referencia existente debe mejorar?" (`MIGRATION_MAP` y el índice lo hacen posible).
- **La clasificación** NEW / IMPROVEMENT / CORRECTION / CONTRADICTION / OBSOLETE / DUPLICATE (+ UNCONFIRMED / EMERGING) se conserva tal cual.
- **Un único `LEARNING_STATE.md`** fusiona los scores (por referencia) y las prioridades. Desaparece `KNOWLEDGE_SUMMARY.md` como archivo separado.
- **Los cambios a la Skill van por PR** (no commit directo a `main`), porque ahora son comportamiento de producto. Se puede mantener la autonomía para crear la PR.
- **Puente desde el uso real.** Los informes de auditoría pueden incluir una sección "Knowledge gaps" (dudas que las referencias no resolvieron). Es la entrada natural para la siguiente investigación, sin que la Skill se automodifique durante un proyecto.

## F2.20 Integración con Claude Code y límites honestos

- **Instalación:** copiar `skills/ui-ux/` a `<proyecto>/.claude/skills/ui-ux/` (solo ese proyecto) o a `~/.claude/skills/ui-ux/` (todos tus proyectos). La Skill no depende de rutas de `ui-ux-agent`: todas sus referencias son relativas a su propia carpeta.
- **Invocación:** `/ui-ux audit src/app/dashboard --focus responsive,a11y`, `/ui-ux design "onboarding de AppFit"`, `/ui-ux improve RESP-003 A11Y-001`, `/ui-ux review`. También se activa sola por la descripción ("¿esta pantalla está bien?").
- **Read-only:** se garantiza por protocolo (instrucciones + puerta explícita), **no técnicamente**. Una Skill no puede retirar herramientas de edición. Para una garantía dura: ejecutar la auditoría en *plan mode*, o en el futuro empaquetar un subagente de solo lectura (requiere el formato plugin). Lo documentaré en el README.
- **Coexistencia** con la skill oficial `frontend-design` de Anthropic u otras: `ui-ux` declara su ámbito (auditar, decidir, verificar). Si hay solape en generación de UI nueva, sigue su propio contrato.
- **Coste de contexto:** una auditoría completa carga ~1.500–2.500 líneas de instrucciones/referencias más la evidencia. Por eso existen los lentes y la carga por secciones.

## F2.21 Mapa de migración (resumen)

| Destino | Fuentes |
|---|---|
| SKILL.md | CORE, AGENTS.md (distinciones), DESIGN_PLAYBOOK (puertas), CLAUDE_FRONTEND (reglas de evaluación) |
| workflows/audit + review | DESIGN_PLAYBOOK §8–10, CLAUDE_FRONTEND §5, FOCUS_COMPOSITE §agent decision rule, AI_DESIGN_SKILLS §verification jobs |
| workflows/design | DESIGN_PLAYBOOK §1–7, 11–12; CLAUDE_FRONTEND §1–4, 6–7; ART_DIRECTION §anti-generic workflow |
| workflows/improve | DESIGN_PLAYBOOK §7, 10–12; CLAUDE_FRONTEND §7; DESIGN_SYSTEMS §agent decision order |
| evidence-and-confidence | TRENDS §ladder, FOCUS_COMPOSITE §evidence layers, DS_MIGRATION §case 4, CODEX §evidence hierarchy, AI_DESIGN_SKILLS §rendered verification |
| inspection, states, severity | síntesis de UX_PATTERNS, RESPONSIVE_COMPOSITION §matrix, DARK_UI §state audit, OPTIMISTIC/AUTOSAVE estados, VISUAL_HIERARCHY tiers, AI_RISK_ROUTING gates |
| cognition-and-decisions | FOUNDATIONS, MENTAL_MODELS, CHOICE_ARCHITECTURE, DEFAULTS, RECOGNITION_RECALL, PROGRESSIVE_DISCLOSURE, NOVICE_TO_EXPERT, ADAPTIVE_INTERFACES |
| navigation-and-search | UX_PATTERNS §search + §navigation, NAVIGATION_ARCHITECTURE, INFORMATION_SCENT, SAVED_VIEWS |
| forms-and-feedback | UX_PATTERNS §forms, FOUNDATIONS §feedback severity, NOTIFICATIONS |
| risk-and-recovery | ERROR_PREVENTION ×2, CONFIRMATION, DESTRUCTIVE, UNDO_OPTIMISTIC, OPTIMISTIC_UI, AUTOSAVE, VERSION_HISTORY, COLLABORATIVE_UNDO, ACTIVITY_AUDIT |
| data-dense-and-power-ui | TABLES, DATA_GRIDS, BULK ×2, COMMAND_PALETTES ×2, FEATURE_PATTERNS, PREVIEW_PEEK, DIRECT_MANIPULATION ×2, VISUAL_DESIGN §density |
| onboarding-settings-auth | ONBOARDING ×2, SETTINGS ×2, AUTHENTICATION |
| overlays | DIALOGS_AND_OVERLAYS, FRONTEND §native overlays, NATIVE_ANCHORED_OVERLAYS |
| layout-and-hierarchy | VISUAL_HIERARCHY_UNDER_DENSITY, VISUAL_DESIGN §density |
| typography | VISUAL_DESIGN §typography, RESPONSIVE_TYPOGRAPHY, FONT_LOADING |
| color-and-theming | DARK_UI, DS_MIGRATION §forced colors |
| iconography-and-imagery | ICONOGRAPHY, IMAGERY |
| motion | INTERACTION_MOTION, FRONTEND §scroll-driven |
| responsive | RESPONSIVE_COMPOSITION, FRONTEND §container queries |
| accessibility | FOCUS_COMPOSITE, ROUTE_OVERLAY_FOCUS, DS_MIGRATION §a11y, + criterios WCAG dispersos en ~30 archivos |
| design-systems | DESIGN_SYSTEMS, DS_MIGRATION, CODEX §extraction/drift |
| art-direction | ART_DIRECTION, DESIGN_PLAYBOOK §2, 6 |
| generic-ui-and-distinctiveness | ANTI_PATTERNS, CLAUDE_FRONTEND §anti-patterns, ICONOGRAPHY §deletion pass, VISUAL_HIERARCHY §cardification, DARK_UI §gray card soup, IMAGERY §failure modes, TRENDS §human-crafted |
| ai-ux | AI_NATIVE, AI_UNCERTAINTY, AI_RELIANCE, AI_PROVENANCE, AI_ABSTENTION, AI_AGENT_ACTIVITY, AI_AGENT_PRESENCE, AI_ADVICE_SEQUENCING, AI_COLLAB_EDITING, MULTI_AGENT_DELEGATION, AI_EVIDENCE_SELECTION |
| ai-agent-oversight | AI_RISK_ROUTING, AI_OVERSIGHT_AT_SCALE, AI_STATE_AUTHORITY, AI_ALERT_COALESCING, AI_OUTLIER, AI_HANDOFF, MULTI_AGENT_CONSENSUS, AI_EVIDENCE_EVALUATION, AI_OVERSIGHT_ADVERSARIAL, AI_OVERSIGHT_BENCHMARK |
| frontend-implementation | FRONTEND_IMPLEMENTATION, NATIVE_ANCHORED_OVERLAYS (fechado), FONT_LOADING §implementation |
| lab/ | AGENTS (protocolo), KNOWLEDGE_SUMMARY + LEARNING_STATE, CHANGELOG, SOURCES, OPEN_QUESTIONS + FRONTIER, TRENDS §signals, RESEARCH_PROMPT, AI_DESIGN_SKILLS + SUPERDESIGN + CODEX §tools → TOOLING |

**Huecos que detecto y que NO cubriré con conocimiento inventado:** contenido/microcopy como tema propio, dashboards y visualización de datos, y formularios largos o multi-paso. Quedarán como entradas en `lab/OPEN_QUESTIONS.md` para el siguiente ciclo de investigación. La Skill los tratará con principios generales y confianza acorde.

## F2.22 Riesgos

| Riesgo | Mitigación |
|---|---|
| Perder matices al consolidar | `MIGRATION_MAP` con una lista de "conocimiento único" por archivo de origen, verificada antes de borrar; Git conserva los originales |
| La Skill se vuelve otro "documento largo" | Límites de tamaño por archivo; sección de checklist arriba; índice de carga en SKILL.md |
| Falsa confianza en las auditorías | Techos de confianza por fuente; cobertura explícita; "not assessed" |
| Ausencia de navegador | Modo estático declarado + `render-check.mjs` si hay Playwright |
| Autoevaluación complaciente en improve | `review` en contexto limpio para cambios grandes |
| Contenido que caduca (APIs de navegador, herramientas) | Fechado + `frontend-implementation.md` aislado + `TOOLING.md` fuera de la Skill |

## F2.23 Plan de implementación (Fase 3, tras tu aprobación)

1. Clonar el repo en una ruta corta (el clon falló aquí por la longitud de la ruta del workspace temporal) y crear la rama `skill-architecture`.
2. Esqueleto: `SKILL.md`, 4 workflows, plantillas, schema.
3. Referencias críticas primero: evidence, inspection, states, severity, accessibility, responsive, design-systems, generic-ui. Después el resto, cada una con su entrada en `MIGRATION_MAP`.
4. Mover meta/research a `lab/` y fusionar summary + learning state.
5. Los 2 scripts, probados contra una app de ejemplo.
6. README.
7. Validación estructural: frontmatter, todas las rutas citadas existen, el schema es JSON Schema válido, ninguna referencia huérfana, presupuesto de líneas.
8. Borrar los originales solo cuando `MIGRATION_MAP` esté completo.
9. Commits por bloques y PR para que revises el diff.

Fase 4 (validación): los 5 escenarios que propones, documentados en `lab/evals/` como pruebas de regresión de la Skill.
