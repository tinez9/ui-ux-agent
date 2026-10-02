# Version History and Restore UX

Version history is a recovery and inspection system, not merely a chronological list of snapshots. Its job is to let users answer: **what changed, who changed it, what will restoration affect, and can I recover if restoration is wrong?**

## Core model

Keep four concepts distinct:

- **Undo/redo** reverses recent user intent in the active editing context.
- **Version history** inspects durable historical states across sessions and collaborators.
- **Activity/event history** explains actions over time; it may be more granular than recoverable versions.
- **Trash/archive** recovers deleted objects; it is not a substitute for edit history.

Do not expose these as interchangeable recovery mechanisms.

## A version is not necessarily an event

Systems may checkpoint periodically, on idle, on explicit save, on publish, or according to storage policy. Therefore:

- do not imply every edit has a recoverable version unless the persistence model guarantees it;
- distinguish a recoverable checkpoint from a detailed audit/event log;
- expose retention limits before users depend on history as permanent backup;
- preserve author and timestamp when attribution is trustworthy.

Notion is a useful production example: it records page versions periodically and after editing stops, while explicitly noting that version history does not capture every single change. This is evidence against treating a version list as a complete event log.

## Inspect before restore

A good history surface lets users preview an older state without mutating the current one. When feasible, show:

1. version identity: timestamp plus author, and a human name/bookmark when supported;
2. meaningful change information rather than only opaque version numbers;
3. the scope of the version — whole document, page, database, object, etc.;
4. a preview or diff sufficient to understand the restoration blast radius;
5. the retention boundary and any unavailable history.

Prefer **semantic diffs** at the granularity users understand (text blocks, fields, components, properties) over raw serialized-object diffs. A line diff is useful only when the domain itself is line-oriented.

## Restore should usually create history, not erase it

For collaborative or valuable content, restoring an old version should normally produce a **new current revision derived from that historical state**, while retaining the state that was current immediately before restoration.

This property makes restore itself recoverable. SharePoint explicitly follows this model: restoring an earlier version creates a copy that becomes the latest version rather than deleting intervening history. OneDrive similarly keeps the previously current state in history. Notion states that after restoring a past version, users can return through history and restore the later state again.

### Agent rule

Never implement `restore(version)` as destructive history truncation unless the product explicitly requires that semantics and communicates the consequence.

## Restore vs copy/fork

Restoration is not always the safest intent.

Offer **copy/fork/duplicate from version** when the user wants to inspect, recover fragments, branch an alternative, or avoid replacing the shared current state. Whole-state restore is appropriate when the user's intent is genuinely to make the historical state current.

For structured documents, partial recovery may be safer than global restore. Notion, for example, supports copying specific blocks from an old version into the current page. This pattern is valuable when only a small region was damaged.

## Scope and blast radius

Before restoration, determine what the version actually contains. A parent object's history may not recursively restore every nested object.

Communicate consequential scope explicitly:

- which object becomes current;
- whether children/nested objects are included;
- whether views, properties, permissions, comments, attachments, references, automations, or external effects are included;
- whether collaborators currently editing will see their state replaced or rebased;
- whether restoring can be reversed.

A label such as “Restore page” is insufficient when the operation also rewrites embedded database state or other shared structure.

## Collaboration

History is both recovery and provenance. In collaborative products:

- attribute versions where possible;
- preserve current collaborators' work by making restore a new revision rather than rewriting history;
- detect or warn when the current head changed after the user opened the historical preview;
- avoid silently applying a restore against a stale head if its blast radius is substantial;
- announce the resulting new current state and preserve a route back to the pre-restore revision.

A preview opened at revision `R10` while collaborators advance the document to `R14` is no longer acting against the same current state. For high-impact restores, revalidate the head or present the newer activity before committing.

## Named versions and milestones

Automatic history is optimized for recovery; named/bookmarked versions are optimized for **meaningful milestones**. Support naming when users need to mark states such as “approved copy”, “before redesign”, or “release candidate”.

Do not force users to name every version. Automatic history should remain automatic.

## Retention is product behavior

History availability may depend on plan, administrator policy, storage rules, object type, or time. Treat retention as part of the recovery contract:

- communicate meaningful limits;
- do not promise indefinite recovery when policy can expire versions;
- avoid designing critical recovery workflows around history that administrators can disable without another recovery path;
- distinguish version history from backup/disaster recovery.

## Confirmation proportional to impact

Viewing history requires no confirmation. Restoring a small, recoverable personal object may need only a clear action. Shared, broad, or structurally destructive restoration deserves stronger preview and confirmation.

The confirmation should describe the consequence, not merely ask “Are you sure?”. Prefer concrete language such as making a selected revision current while preserving the present revision in history.

## Accessibility

- Historical versions and actions must be keyboard reachable.
- Do not encode additions/deletions only with color; pair visual treatment with text/semantics.
- Preserve a logical focus location when switching between current and historical previews.
- Announce successful restoration and material failures without unnecessarily moving focus.
- Dense diffs need navigable structure, especially for long documents.

## Failure modes

### Snapshot rollback
Restoring an old serialized snapshot overwrites later work and deletes the only route back.

**Better:** create a new revision and preserve the former head.

### Fake audit log
A periodic version list is presented as if it contains every edit.

**Better:** state checkpoint semantics and separate activity/audit history where needed.

### Blind restore
Users must restore to discover what a version contains.

**Better:** preview first; show diff/scope when practical.

### Hidden blast radius
Restoring a container unexpectedly rewrites children, views, or shared properties.

**Better:** make restoration scope explicit before execution.

### Stale-head restore
A user previews an old revision while collaborators continue editing, then unknowingly replaces a newer current state.

**Better:** revalidate current head and preserve the newer state in history.

### History as backup
Users assume retention is permanent and discover expired versions only after loss.

**Better:** expose retention boundaries and keep backup/disaster recovery conceptually separate.

### Diff theater
The interface displays a technically precise raw diff that users cannot map to product concepts.

**Better:** diff at the semantic unit of the domain.

## Decision contract for agents

Before implementing version history, answer:

1. What event creates a recoverable version?
2. Does history capture every edit or only checkpoints?
3. What is the version scope?
4. What metadata identifies author, time, and meaningful milestones?
5. Can users preview and understand differences before restoring?
6. Does restore create a new head while preserving the previous current state?
7. Is partial recovery or copy/fork needed in addition to whole restore?
8. What happens if the current head changes during preview?
9. What retention/plan/admin limits affect the recovery promise?
10. How does the workflow remain understandable and operable with keyboard and assistive technology?

If these answers are undefined, the product does not yet have a trustworthy version-history model.

## Evidence boundary

Microsoft SharePoint/OneDrive and Notion provide strong first-party evidence for shipped recovery semantics: previewable historical versions, restoration, retention constraints, and non-destructive restoration paths. They establish mature implementation patterns, not controlled evidence that one history UI is universally optimal. Recommendations about semantic diff granularity, stale-head revalidation, and choosing fork/partial recovery according to blast radius are agent synthesis from collaboration and recovery requirements and should be validated in domain-specific products.

## Sources

- Microsoft Support — Restore a previous version of an item or file in SharePoint: https://support.microsoft.com/en-us/sharepoint/documents-and-library/restore-a-previous-version-of-an-item-or-file-in-sharepoint
- Microsoft Support — Restore a previous version of a file stored in OneDrive: https://support.microsoft.com/en-us/onedrive/restore-a-previous-version-of-a-file-stored-in-onedrive
- Notion Help — Delete & restore content / Version history: https://www.notion.com/help/duplicate-delete-and-restore-content
