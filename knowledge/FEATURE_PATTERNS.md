# Distinctive Feature Patterns

A catalog of product functionality and interaction models that can create meaningful differentiation. This is not a collection of decorative effects.

## Admission test
A pattern belongs here when it meaningfully improves capability, speed, comprehension, discovery, comparison, user control, collaboration, personalization, recovery, or useful delight.

## Candidate research areas
Contextual command palettes; interactive previews; comparison workspaces; smart filters; saved views; progressive exploration; direct manipulation; adaptive onboarding; contextual AI actions; reversible bulk operations; activity timelines; explainable recommendations; multimodal input; spatial information navigation.

Each promoted feature should include use cases, risks, and implementation guidance.

## Collaborative presence: coordination signal, not proof of activity — 2026-10-24

**Decision:** add live collaborators, selections, typing or cursors only when users actually need to coordinate *in the same object*. The valuable feature is reduced collision and faster handoff, not decorative cursor movement. For solo workflows, sensitive drafting, or primarily asynchronous review, comments, assignments, activity history or explicit locks may be clearer and cheaper.

### Four different contracts
- **Ephemeral awareness:** who appears connected, current selection/caret, pointer, typing or viewport. It may disappear on disconnect and should not become the document's source of truth. Yjs Awareness is a separate state-based CRDT; the protocol uses client clocks and heartbeat/expiry (15-second suggested rebroadcast, 30-second stale removal). "Online" is therefore an *approximate connection signal*, not proof a person is attentive or currently editing.
- **Durable shared work:** document contents, accepted edits, comments, history and audit evidence belong in separately persisted, permission-checked storage. Presence is **not** an edit lock, conflict resolver, save receipt, ownership claim or audit log. Tiptap/Yjs document sync and awareness are separate channels.
- **Attention steering:** following a collaborator's viewport is an *explicit, reversible mode*, not a passive consequence of seeing a cursor. Miro lets a user follow or bring others to a view and breaks following when the follower interacts; it also shows the followed person a notice. Preserve a visible Stop following control, independent navigation, and role-aware permission for pulling someone else's viewport.
- **Identity and authority:** a presence payload (especially a client-supplied name/color) is not authenticated identity. Bind displayed identity to server-authenticated user metadata and authorize room access and document writes on the server. Distinguish an AI agent from a human in the participant list and action history; agent presence TTL is not proof that a tool action succeeded.

### Implementation and privacy boundaries
- Prefer a compact participant list + object-level "editing/selected by" cues before full pointer broadcasting. Publish only necessary fields; use container-relative or document coordinates, handle transforms/zoom, null/offscreen positions, and throttle pointer updates. Liveblocks' default React client throttle is 100 ms; subscribing to the entire unfiltered others array can cause excessive rerenders. Use targeted subscriptions for high-frequency cursors.
- Treat network loss separately from a collaborator leaving. Liveblocks exposes reconnect/lost-connection state; its default lost-connection timeout is 5 seconds, while Yjs awareness has its own expiry protocol. Show "Reconnecting" and a distinct **unsynced edits** indicator rather than claiming everyone left or everything saved. Re-establish state on reconnect; do not replay stale pointer coordinates as current.
- **Ephemeral UI does not mean zero retained data.** Liveblocks' storage disclosure distinguishes temporary realtime presence from retained session metadata (room ID, user ID, approximate IP-based location) and data-region processing. Review provider retention, data residency, user visibility and logs. A local "hide others' cursors" toggle must not be presented as an invisibility/privacy mode unless the server actually stops publishing that user's presence.
- Avoid screen-reader speech on every movement or keystroke. Expose an accessible, on-demand participant/selection summary; announce consequential events (someone joins, edit conflict, permission change) selectively via a polite status region. Provide keyboard/touch routes to select, inspect and follow without needing a visible pointer. Respect reduced-motion preferences for cursor interpolation/viewport following and allow users to disable distracting cursors. Color alone must not identify a collaborator.
- Treat cursor chat as a different, explicitly transient communication channel: Miro documents live typed messages with no send button and no persistence in exports/history; this is not a substitute for comments, decisions or audit trails.

### Agent validation gate
Use two accounts plus multiple tabs, a read-only user, and an agent identity. Test room authorization and forged presence names, join/leave/reconnect/permission revocation, a network partition with unsynced edits, duplicate tabs, concurrent editing of one object, zoom/scroll/RTL and mobile touch, follow/escape and reduced motion, screen-reader announcement volume, many cursors/CPU/network cost, and sensitive-document privacy. Check the actual server state after reconnection; never infer persistence or access rights from avatar/cursor rendering.

**Evidence boundary:** Yjs protocol/docs establish ephemeral state and expiry mechanics; Liveblocks/Tiptap establish concrete APIs, permissions and retention caveats; Miro documents shipped attention and cursor-chat behaviors. These are implementation and product examples, **not** comparative proof that live cursors improve completion or trust. No multiuser runtime, AT or privacy audit was conducted. Compare participant-list-only, selection cues and full cursors on coordination accuracy, interruption, latency and cost before promoting the richest variant.

**Primary references:** [Yjs awareness](https://docs.yjs.dev/getting-started/adding-awareness), [Yjs awareness protocol](https://github.com/yjs/y-protocols/blob/master/PROTOCOL.md), [Liveblocks presence](https://liveblocks.io/docs/products/sync/presence), [Liveblocks React API](https://liveblocks.io/docs/api-reference/liveblocks-react), [Liveblocks permissions](https://liveblocks.io/docs/products/sync/permissions), [Liveblocks data retention](https://liveblocks.io/docs/platform/data-storage), [Tiptap awareness](https://tiptap.dev/docs/collaboration/core-concepts/awareness), [Miro attention management](https://help.miro.com/hc/en-us/articles/360013358479-Attention-management), [Miro cursor chat](https://help.miro.com/hc/en-us/articles/39970518294674-Cursor-chat), [MDN live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions).


## Contextual command surfaces

**Problem solved:** complex products accumulate actions and destinations that cannot all remain visible. A searchable command surface can provide a secondary, keyboard-efficient route while keeping the primary interface simpler.

**Evidence boundary:** this is a shipped-product pattern, not evidence of universal task improvement. VS Code exposes broad editor functionality through its Command Palette; Linear combines command-menu actions, dedicated shortcuts, pointer UI, and previews; Notion uses Cmd/Ctrl+K or P for search and quick navigation. These examples establish viability in command-dense products.

### When it earns its place
Use one when command density is high, actions repeat frequently, available actions depend on current context, or users benefit from discovering dedicated shortcuts. Do not use it to hide core navigation, repair weak information architecture, or merely imitate expert tools. Essential actions still need an appropriate visible path.

### Separate intents
A palette can execute actions, navigate to objects, search content, or switch scope. If one surface combines these jobs, make the active intent and result type legible. VS Code demonstrates explicit modes for commands, files, and symbols.

### Context is the differentiator
Prefer contextual results over one giant global catalog. Filter or rank from the current view, focused or selected objects, permissions, object state, and availability. Linear repeatedly exposes the same capability through pointer UI, shortcuts, and its command menu; treat the palette as an accelerator and discovery layer over one coherent command model.

### Keyboard and accessibility contract
A searchable palette is closer to an autocomplete/combobox plus action invocation than to a generic visual modal.
- Keep text-entry behavior native and do not intercept standard editing keys.
- Provide predictable arrow navigation, Enter activation, and Escape dismissal.
- Preserve a visible active-result state and orientation when results update.
- Make shortcuts discoverable in menus, tooltips, or help.
- Use aria-keyshortcuts only to expose shortcuts that actually exist; it does not implement keyboard behavior.

Avoid collisions with browser, operating-system, and assistive-technology shortcuts. Keyboard layout and locale matter: Slack and Notion both document differences or limitations for non-English layouts, so do not assume US QWERTY.

### Preview and ranking
Preview is useful when it reduces open/back churn for information-rich results. Linear Peek can update while navigating supported command-menu items. Skip preview when it only repeats the label.

A reasonable ranking starting point is text match, contextual relevance, then recent/frequent relevant actions, but this is synthesis rather than a universal formula. Stable labels, aliases, categories, and visible shortcuts should keep results learnable even when ranking adapts.

### Implementation model
Represent commands as shared data rather than scattered keyboard handlers: stable id, localized label and aliases, category, availability/context rules, shortcut metadata, action callback, and optional preview. Toolbar actions, context menus, shortcuts, help, and the palette can then share the same command registry and avoid behavioral drift.

### Failure modes
- palette is the only way to discover essential functionality;
- one huge flat list with weak contextual ranking;
- navigation, search, and actions are visually indistinguishable;
- result state becomes stale after selection/context changes;
- global key listeners interfere with text editing or assistive technology;
- shortcuts assume one keyboard layout;
- keyboard-only functionality has no equivalent path;
- adding a palette instead of fixing poor navigation.

### Agent decision rule
Add a command surface because **command density + repetition + context** make a secondary searchable layer valuable, not because sophisticated products happen to have one.


## Interactive previews / peek

**Problem solved:** repeated open/back navigation is expensive when users need to inspect many adjacent objects before deciding which one deserves full attention. A preview can expose enough information to evaluate an item while preserving the surrounding list, board, search, or file context.

**Evidence boundary:** this is a shipped interaction model, not proof of universal task improvement. Linear Peek previews issue/project details from lists and boards, can remain open while arrowing through adjacent items, and also previews supported command-menu results. Apple's Quick Look similarly previews files without opening their owning app and supports moving through multiple selected files. These examples establish a durable inspect-without-navigate pattern; they do not establish that previews outperform normal navigation in every task.

### When it earns its place
Prefer preview when users repeatedly **scan → inspect → compare → continue scanning**, objects contain decision-relevant detail that cannot fit in the parent view, and full navigation would destroy useful position/filter/selection context.

Skip it when the preview merely enlarges information already visible, the object is normally opened once rather than compared, or the task requires most of the full detail surface anyway.

### Three preview contracts
Do not collapse these into one interaction:
1. **Transient glance:** fast, read-mostly, easily dismissed, no commitment.
2. **Persistent inspector:** stays open while selection/focus moves through adjacent objects; useful for triage and comparison.
3. **Full detail:** canonical surface for deep reading, editing, history, destructive actions, or complex workflows.

A preview should have an obvious path to full detail. If it accumulates enough editing and navigation to become a second full-detail implementation, the abstraction is probably wrong.

### Preserve browsing context
The strongest value is not “show more in a popup”; it is **inspect without losing place**. Keep parent filters, ordering, scroll position, and selection stable. When the user advances to another item, update the preview rather than forcing close/open cycles. Linear's arrow-through-adjacent-items behavior and Quick Look's multi-file navigation are concrete examples.

### Trigger semantics matter
Keyboard- or click-invoked previews are more predictable than hover-only previews. Hover/focus content introduces accidental-trigger and accessibility costs. If author-controlled additional content appears on hover or focus, WCAG 2.2 SC 1.4.13 requires it to be dismissible, hoverable when pointer-triggered, and persistent under the criterion's conditions. A keyboard-accessible deliberate trigger is therefore a safer baseline for information-rich previews.

Do not label an interactive preview as a tooltip. WAI-ARIA's tooltip pattern keeps focus on the trigger and explicitly notes that a popup containing focusable elements should use another pattern such as a non-modal dialog.

### Information design
Show the smallest set of fields that answers the likely “is this the item I need?” question. Prioritize identity, status, salient metadata, short content/context, and preview-specific media. Avoid copying the entire detail page.

Preview freshness is product-specific. Linear previews current issue/project state; for comment/evidence workflows, a stable snapshot can be preferable. Linear's Figma integration deliberately keeps the embedded snapshot unchanged until refresh so comments retain historical context. Decide whether the preview contract is **live state** or **snapshot evidence** rather than refreshing implicitly.

### Latency and resource budget
A preview that is slower than opening the object defeats its purpose. Keep the shell responsive, cancel superseded requests while rapidly moving between items, cache cheap adjacent data where justified, and avoid expensive eager media. Apple's Quick Look documentation explicitly recommends avoiding long-running/resource-intensive preview preparation and exposes asynchronous loading.

### Failure modes
- hover-only access or accidental previews that obscure the list;
- preview duplicates the full page and creates two competing interaction models;
- parent scroll/filter/selection state is lost on close;
- arrowing rapidly shows stale data from an earlier request;
- preview contains essential actions unavailable elsewhere;
- focus enters a surface that is still modeled as a tooltip;
- heavy preview generation makes scanning slower than normal navigation;
- stale snapshots are presented as live state, or live updates destroy evidence/context that users expected to remain stable.

### Agent decision rule
Add preview when **inspection frequency × navigation cost × value of preserved context** is high. Design it as an explicit intermediate depth level, not as decorative hover chrome.


## Comparison workspaces

Comparison workspaces are appropriate when a small candidate set must be evaluated against several shared criteria and serial detail-page inspection creates memory/navigation cost. Normalize labels, units, missing-value semantics, and attribute meaning before designing the matrix. Treat comparison as a narrowing stage rather than an unbounded data view; for many candidates, filter/sort/shortlist first. Desktop evidence from Baymard supports dedicated comparison for spec-driven products, while its mobile testing shows materially lower usefulness under narrow viewport constraints. When the content is tabular, preserve native table/header relationships per W3C guidance. Optimize for meaningful differences, keep candidate identity visible, and do not hide compare selection behind hover.

## Saved views: reusable task lenses, not permission boundaries — 2026-10-19

**Decision:** save a named, revisitable *query plus presentation settings* when people repeatedly inspect a changing subset of records or need a shared operational lens. A filtered URL is enough for a one-off handoff; an explicit-ID shortlist is better for a fixed cohort; a snapshot is necessary for historical evidence. Do not add saved views just to make a simple filter bar look sophisticated.

**Shipped contrasts:** Linear offers persistent team/workspace custom views, favorites, owners and subscriptions, but its ordinary URL filters are already shareable and omit some view options. Notion lets users experiment with filters/sorts without publishing them, then choose “Save for everyone.” GitHub Projects marks unsaved view changes with a dot and requires “Save changes.” Airtable distinguishes collaborative, personal and locked *view configurations*. These models establish viable choices, not measured superiority.

### Agent contract

- **State and scope:** distinguish ephemeral personal filter overrides, personal saved views and shared view definitions. Display the active view and applied criteria; show unsaved changes and offer Save, Reset and Save as new where shared edits could surprise colleagues. Separate filter predicates from sorting, grouping, layout and visible fields. Provide rename/duplicate/delete and an unfiltered escape route; prevent tab/sidebar clutter.
- **Dynamic versus fixed:** a saved predicate normally re-evaluates against current records. It is not a historical snapshot or manually curated membership list. Make that distinction explicit for audits, planning commitments and exports. If a field is renamed/deleted or a filter becomes invalid, surface a repair state rather than silently broadening results.
- **Security is product-specific:** a view's visibility/edit permissions do **not** inherently enforce record-level authorization. Linear states that copying a custom-view URL does not grant access. In contrast, Airtable's separately generated **shared-view links can grant anyone holding the link access** unless restricted; Airtable warns that extra URL filters are removable and must not hide private records. Never assume either sharing model universally. Enforce data permissions server-side; audit shared exports, embeds and expanded-record fields as separate surfaces.
- **Actions and notifications:** a filtered context can affect create-item defaults (GitHub Projects applies filter metadata to newly created items). Show such defaults and verify them before saving. For bulk operations, use the separate explicit-ID versus matching-query selection contract; a view is not an authorization boundary. Subscriptions to entries/exits are optional and need clear trigger semantics and noise controls.
- **Falsification tests:** user A edits without saving while B views the shared definition; A publishes an edit; a recipient opens a copied link without membership; a public share link is forwarded; records enter/leave the predicate; fields disappear; create-from-view applies defaults; bulk action membership changes; keyboard, screen reader, narrow viewport, refresh and Back navigation. Compare against a simpler bookmarked filtered URL and a fixed shortlist; measure task return time, wrong-scope actions and accidental shared edits.

### Cross-surface consistency and permission adversarial checks — 2026-10-23

A visible filtered result, a saved/shared view, and a downloadable export may represent **different record sets**. Model four scopes separately: **authorized records/fields** (server-side access policy), **base shared-view membership**, **temporary viewer/URL filters**, and **exported rows/columns**. Never use a client-side predicate, hidden column, or hard-to-guess URL as a security boundary.

- **Documented export mismatch:** Airtable's shared-view URL filters are removable and the *entire original shared view* is loaded before viewer-side refinement. Its August 2026 sharing docs explicitly say that downloading CSV **ignores filters applied by the viewer** and exports the original shared-view records. This is a concrete counterexample to the tempting “what you see is what you export” assumption, not a claim about all products.
- **Hidden is not unauthorized:** Airtable normally omits hidden fields from shared links, but grouping/date/cover/stack fields have visibility exceptions, and the optional “Show all fields in expanded records” setting reveals hidden fields on expansion. Shared links may be accessible to any holder unless restricted; domain restrictions are not per-person allowlists. For confidential data, use real per-record/per-field access controls and review embeds, API, expanded records, sync, downloads and revoked links independently.
- **The opposite failure is possible:** Notion's actual property-level permissions (Business/Enterprise) can make a view **fail to open** when its filter, sort or group references a column the recipient cannot access. Notion AI may describe that column as nonexistent under inherited permissions. A broken view for a lower-privilege user is not evidence that the filter should be removed or that the user's permissions should be broadened. GitHub Projects documents *view* TSV exports; that product-specific behavior does not validate assumptions about Airtable's viewer-filtered CSV.

**Agent implementation contract:** on Share/Export, state the intended audience and **effective data scope** (e.g. “Export original shared view — 38 records,” not “Export these 4 filtered results” when untrue). In owned implementations, authorize every request on the server, derive the export from an explicitly selected and validated filter scope, and apply column/record policy **again at export time**. Make preview and download agree or disclose the difference before action. Treat view configuration visibility, record permissions, and link access as separate settings.

**Adversarial fixture:** seed two tenants, an owner, a read-only guest, a private record and a hidden salary field. As guest, open a shared view, append/remove URL filters, expand grouped/cover records, download CSV/TSV, follow a forwarded/revoked link, and call the backing API; compare actual exported **IDs and columns** against the authorized set, not merely the on-screen count. Separately test a view that filters by a column denied to the recipient: it should fail safely with a recoverable explanation, not broaden results or invite unauthorized access. Repeat after a permission change and for embedded/synced surfaces. These are **proposed regression tests**, not tests performed in this research cycle.

Sources (reviewed 2026-10-23): [Airtable URL filters](https://support.airtable.com/articles/3784973334-shared-view-url-filters), [Airtable share menu, expanded fields and CSV exception](https://support.airtable.com/articles/4130354023-Using-the-view-share-menu-in-Airtable), [Notion property access and inaccessible-view behavior](https://www.notion.com/help/database-property-access), [GitHub Projects export](https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-your-project/exporting-your-projects-data).

**Evidence boundary:** primary product docs demonstrate behavior and security differences, not a universal productivity uplift. Sources (reviewed 2026-10-19): [Linear custom views](https://linear.app/docs/custom-views), [Linear URL filters](https://linear.app/docs/filters), [Notion view settings](https://www.notion.com/help/views-filters-and-sorts), [GitHub Projects saved views](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views), [Airtable view types](https://support.airtable.com/articles/5189551686-getting-started-with-airtable-views), [Airtable share-link access](https://support.airtable.com/articles/4130354023-using-the-view-share-menu-in-airtable), [Airtable URL-filter warning](https://support.airtable.com/articles/3784973334-shared-view-url-filters).

## Spatial canvases: use only when relationships are spatial (2026-10-22)

**Decision:** a pan/zoom canvas is appropriate for drawing, diagramming, connected workflows or spatial collaboration, not as a replacement for ordinary dashboards, tables or lists. Give users search, fit-to-content, explicit zoom controls, a navigable object list, clear selection, undo and a way back to a previous location. A minimap is optional, not a substitute for discoverability.

**Accessibility:** WCAG 2.2 SC 2.5.7 requires a non-drag *single-pointer* alternative for drag operations; keyboard movement alone is insufficient. Provide click/tap-to-connect, explicit move actions and keyboard access. React Flow supports keyboard selection/movement and click-to-connect by default; tldraw documents keyboard shape navigation, announcements and shortcut controls. Custom nodes, reading order, offscreen culling and focus recovery still require testing with assistive technology.

**Implementation:** React Flow (`@xyflow/react`) is MIT-licensed and specializes in node/edge editors. tldraw provides richer whiteboard tools, spatial navigation, deep links and culling, but its SDK is **source-available, not MIT**, and requires a license key for production (trial, commercial or hobby). Check licensing before choosing it from a free local prototype. Neither library provides application authorization or verified persistence by default.

**Validation:** compare a canvas against a simpler structured view on actual find/connect/edit/resume tasks. Test touch without drag, keyboard, screen reader, zoom, RTL/grouped nodes, offscreen focus, large documents, stale links, permissions, offline edits and undo. Primary docs establish features, not measured superiority or automatic accessibility compliance.

Sources: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements ; https://reactflow.dev/learn/advanced-use/accessibility ; https://reactflow.dev/api-reference/react-flow ; https://reactflow.dev/pro ; https://tldraw.dev/sdk-features/accessibility ; https://tldraw.dev/sdk-features/culling ; https://tldraw.dev/sdk-features/license-key .
