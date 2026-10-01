# Saved Views as Workflow Objects

Saved views are not merely bookmarked filters. In work-heavy products they can turn repeated information-retrieval setup into a reusable workflow object: a named projection of a dataset that may encode **what appears**, **how it is arranged**, and **who shares the configuration**.

## Evidence boundary

This pattern is strongly evidenced as shipped product behavior, not as proof of universal productivity gains. GitHub Issues supports saved views built from advanced queries and, as of 2026, repository-level shared views that teams can pin in the Issues sidebar. Jira distinguishes saved filters (reusable queries) from saved views (filters plus presentation configuration such as columns, grouping, hierarchy, and display preferences). These implementations establish useful product semantics; they do not prove that every configurable list should expose saved views.

## When saved views earn their place

Use saved views when users repeatedly reconstruct the same subset or presentation of a large changing dataset, especially when the configuration represents a recurring job such as triage, planning, review, monitoring, or reporting.

The strongest signal is **repeated setup cost × recurrence × value of a stable lens**. A one-off filter does not need persistence. A small dataset with one obvious presentation usually does not need view management at all.

Saved views become more distinctive when they encode domain workflows rather than generic customization. Examples include `Needs triage`, `Blocked this week`, or `Customer-reported bugs`, not arbitrary cosmetic presets.

## Separate query, presentation, and ownership

Do not collapse three different contracts:

1. **Query / membership** — which objects belong in the result set.
2. **Presentation** — columns, grouping, hierarchy, sort, density, layout, or other display choices.
3. **Ownership / scope** — personal, team/shared, system-provided, and who may mutate the canonical definition.

Jira explicitly separates saved filters from saved views: a filter saves which work items match, while a view can additionally capture how those items are displayed. Model these layers separately even if the UI presents them together. It prevents a harmless column change from silently rewriting a team's membership criteria and makes permissions easier to reason about.

## Shared baseline + personal working state

Shared views need a conflict model. Jira's current model is useful: administrators can provide a stable shared view while regular users can temporarily tailor their own working state and reset to the shared version. This avoids two bad extremes: locking every display preference, or letting one person's local adjustment unexpectedly mutate the team's shared lens.

Agent rule: make it explicit whether an edit is **temporary/local**, **saved to my view**, or **changes the shared definition**. Never let the same control silently cross those scopes.

## Persistence semantics must be legible

A saved view can be either:
- a **live definition** whose query is re-evaluated against current data; or
- a **snapshot** of data at a point in time.

Most operational work views should be live definitions. If historical evidence is needed, use a snapshot/export/versioned report instead. Do not make a live saved view look like frozen evidence.

Likewise, distinguish saving a view's *configuration* from saving current *results*. GitHub and Jira saved views/filters persist criteria/configuration while the underlying work items continue changing.

## Discovery and retrieval

A saved view only removes setup cost if users can retrieve it cheaply. Promote frequently used views through favorites/pinning rather than forcing users through a management screen. GitHub added repository saved views and later pinning in 2026; Jira exposes starred filters prominently. This is product-adoption evidence for a useful retrieval hierarchy, not a universal navigation prescription.

Provide stable names and, for shared views, descriptions that communicate intent. A label such as `Needs triage` is more durable than exposing raw query syntax as the primary identity.

## Implementation model

Represent a view as a stable object rather than serializing incidental UI state wholesale. A practical model may include:

- stable `id`, name, optional description/icon;
- query/filter expression;
- sort definition;
- visible fields/columns and order;
- grouping/hierarchy/layout settings when semantically relevant;
- scope/owner and permissions;
- canonical/shared revision;
- optional per-user overrides or working state.

Persist only settings that users reasonably expect the view to remember. Ephemeral focus, open menus, hover state, transient selections, and arbitrary scroll position normally do not belong in the canonical view definition.

Treat schema evolution as a real concern: renamed/deleted fields, changed permissions, or unsupported filters should degrade visibly rather than silently broadening results. If a saved constraint can no longer be applied, explain which part is invalid and offer repair/reset.

## URL and collaboration contract

When practical, keep the active view/query representable in navigation state so refresh, back/forward, deep links, and collaboration remain predictable. A stable saved-view ID can identify the canonical configuration; temporary personal changes may need explicit URL/state representation if sharing the exact current lens matters.

Do not assume that sharing a URL means sharing permissions. Recipients should see an authorization-appropriate result or a clear access boundary, never leaked metadata from the creator's scope.

## Failure modes

- calling a saved query a full view while silently dropping layout/grouping state;
- saving every incidental UI state and making views brittle;
- changing a shared view when the user thought they were making a personal adjustment;
- hiding whether changes are unsaved, local, or shared;
- stale/invalid field references silently changing result membership;
- too many near-duplicate views with weak naming and no favorites/pinning;
- using saved views to compensate for an incoherent default information architecture;
- presenting a live query as if it were a historical snapshot;
- letting a view expose data the current viewer is not authorized to access.

## Agent decision rule

Add saved views when **repeated reconstruction of a meaningful data lens is itself a recurring user cost**. Model query, presentation, and ownership separately; make persistence and mutation scope explicit; and treat shared views as governed workflow objects, not bookmarks with extra chrome.

## Current source basis

- GitHub Docs, *Viewing all issues and pull requests*: dashboard saved views store named advanced queries; reviewed 2026-10-01.
- GitHub Changelog, *Saved views for repository issues* (2026-06-25): shared repository views for recurring team workflows.
- GitHub Changelog, *Pinning saved views to the repository issues sidebar* (2026-08-20): one-click retrieval for frequently used views.
- Atlassian Support, *Save and share views in Jira*: saved views capture filters plus display configuration, distinguish shared baseline from personal working state, and differ from saved filters; reviewed 2026-10-01.
- Atlassian Support, *What is a saved search?*: saved filters persist reusable query criteria and can be private/shared/starred; reviewed 2026-10-01.
