# Activity and Audit History

## Core distinction

Do not collapse **activity history**, **version history**, **audit/security logs**, and **notifications** into one feed.

- **Activity history** answers: *What changed around this object or workspace, and who/what changed it?* It is optimized for human orientation and collaboration.
- **Version history** answers: *What state existed at a point in time, what differs, and can I recover it?* It is optimized for comparison and recovery.
- **Audit/security logs** answer: *What security-, administration-, or compliance-relevant event occurred, under which actor/context, and can an investigator retrieve evidence?* They prioritize completeness, fidelity, retention, filtering, and export over conversational readability.
- **Notifications** answer: *What needs my attention now?* They are selective delivery mechanisms, not authoritative history.

A product may derive several views from related event data, but their UX contracts differ. Do not make a friendly activity feed the only audit record, and do not expose a raw audit stream as the default collaboration history.

## Event model

For durable history, model an event around semantic identity rather than rendered prose. Useful fields include, where applicable:

- stable event ID;
- timestamp and ordering metadata;
- actor identity and actor type (human, system, integration, agent/bot);
- action/verb;
- target/resource identity and type;
- scope/container (workspace, project, repository, account);
- affected subject when different from the actor;
- relevant before/after or structured change metadata;
- origin/channel when useful (UI, API, automation, integration);
- correlation/request/job ID for related events;
- authorization/security context only when the audience is entitled to see it.

GitHub's organization audit log is a useful production example: events expose action, actor, affected user/resource, repository, location and time, and support structured qualifiers such as `actor`, `action`, `repo`, and `created`. Atlassian similarly structures audit activities by activity type, date/time, actor, app, location and IP. These are audit-oriented schemas, not a mandate to show every field in a user-facing feed.

## Design the view around the user's question

### Object activity

For a document, issue, project, order, or similar object, optimize for reconstructing meaningful change:

> Maya changed Status from Draft to Approved · 14:32

Prefer domain verbs over implementation verbs. `Changed billing owner to…` is more useful than `PATCH /settings succeeded`.

Show enough context to understand consequence. For important mutations, structured before → after values can be more useful than a generic “updated settings.” Avoid dumping noisy field diffs when they do not help users reason about the object.

### Workspace/team activity

The stream is broader, so filtering and grouping become more important. Preserve actor, target, action, and time as first-class dimensions. Let users narrow by object/category/actor/date where volume justifies it.

### Security/admin audit

Optimize for investigation rather than storytelling. Exact event identity, actor, timestamp, target, origin/context, retention boundaries, search/filtering, and export can matter more than compact prose. GitHub and Atlassian both expose structured filtering rather than relying on free-text search alone; GitHub also supports JSON/CSV export and recommends external streaming for datasets too large for its export limits.

Security views may legitimately expose IP/location or programmatic-access metadata that would be excessive or privacy-invasive in ordinary collaboration history. Apply audience- and purpose-specific disclosure.

## Human-readable event grammar

A robust default is:

**actor → semantic action → target/change → time**

Add cause/origin only when it changes interpretation:

> Deployment bot changed Production status to Degraded · triggered by monitor policy · 14:32

For agents and automations, label the actual actor rather than laundering the action through the human who configured it. When useful, distinguish:

- `Victor changed…`
- `Automation changed…`
- `Agent X changed… on behalf of Victor`

This is especially important for AI-native products: provenance should make delegated actions attributable without implying that the delegating human manually performed every step.

## Grouping without destroying evidence

Grouping reduces noise but can erase causal detail. Group only when individual events remain inspectable or are genuinely interchangeable.

Good candidates:
- repeated low-consequence edits by the same actor in a short editing session;
- mechanically generated child events under one meaningful parent operation;
- high-volume repetitive system events where the count and interval are the primary signal.

Avoid collapsing:
- permission/security changes;
- failures mixed with successes;
- events by different actors when attribution matters;
- destructive or externally visible operations;
- events whose ordering explains an incident.

Prefer summaries such as `Maya edited 6 fields` with expansion over fabricating one event that never existed.

## Time and ordering

Relative time (`5 min ago`) helps scanning; exact time helps reconstruction. Provide exact timestamp on demand, and default to explicit timestamps when investigation/compliance is the task.

Do not assume display order equals causality. Distributed systems can deliver events late or out of order. If causal reconstruction matters, retain server/event timestamps plus correlation or sequence metadata where available. UI copy should not imply certainty about causal order that the system does not possess.

## Causal context beats adjacent noise

An investigator often needs the events immediately before and after a suspicious or important event. Atlassian's alert investigation UI explicitly shows the triggering event in the context of nearby actor activity. This suggests a useful pattern beyond security: let users pivot from an event to **related actor activity**, **same target**, **same job/request**, or **same session/operation** rather than forcing them to manually recreate filters.

Do not infer causality merely because two events are adjacent in time. Label links as causal only when the system has actual correlation/provenance data.

## Filtering and retrieval

For large histories, make important event dimensions queryable rather than encoding all retrieval in prose. Common dimensions:

- actor / actor type;
- action or event category;
- target/resource;
- date/time range;
- result/status;
- source/integration;
- scope/project/workspace;
- security-sensitive dimensions where authorized.

Use human labels in the UI while preserving stable machine event types underneath. This supports reliable filters even if display copy changes.

For compliance or incident workflows, export is part of the product contract, not an afterthought. State retention and export limits honestly. GitHub, for example, has distinct retention/access behavior for some Git events and hard export limits; a UI that silently implies complete indefinite history would therefore be misleading.

## Activity feed versus audit completeness

A user-facing feed can intentionally omit low-value events. An audit record generally cannot claim completeness if events are sampled, grouped destructively, silently dropped, or retained for inconsistent periods.

Therefore expose the contract:

- **Recent activity** may be curated for relevance.
- **Audit log** should state its scope, retention, permissions, and known exclusions.

Do not use infinite-scroll discoverability as the only retrieval mechanism for audit-scale data. Filters, bounded date ranges, pagination/search, and export are more robust for targeted reconstruction.

## Before/after data and privacy

Before/after values improve explanation but can create a second copy of sensitive data. Decide explicitly:

1. which changes require old/new values;
2. whether values are redacted or hashed;
3. who can see them;
4. how long they are retained;
5. whether deleting the primary object should or should not delete its audit evidence under the applicable policy.

Never expose secrets, credentials, tokens, or sensitive payloads merely because “audit logs should be detailed.” Audit fidelity and data minimization must be balanced deliberately.

## Recovery actions

History can provide contextual recovery (`Restore version`, `Revert permission change`, `Undo`) but do not imply that every logged event is reversible.

- Link to version history when state restoration is the right primitive.
- Offer a compensating action when a safe inverse exists.
- Require fresh authorization and current-state validation before consequential reversal.
- Explain when an external side effect cannot be undone.

A log entry is evidence that something happened; it is not itself an undo stack.

## Accessibility

- Use real text and semantic list/table structures appropriate to the task.
- Do not encode actor/action/status solely by color or icon.
- Keep chronological navigation and filter controls keyboard-operable.
- If new activity arrives live, avoid stealing focus or announcing every high-volume event. Provide a restrained status such as `3 new events` and let the user choose when to reveal them.
- Preserve focus and reading position when expanding event details or loading older/newer entries.
- For dense audit tables, give columns meaningful headers and ensure expandable detail is reachable and associated with its row.

## Failure modes

### The universal history feed
One feed tries to serve collaboration, recovery, notifications, security, and compliance. It becomes either too noisy for users or too incomplete for auditors.

### Technical event leakage
Raw endpoint/database verbs are exposed instead of domain actions. Users cannot infer consequence.

### Attribution laundering
Automation or AI actions appear as if a human directly performed them. Accountability becomes ambiguous.

### Pretty but lossy grouping
The UI compresses events so aggressively that actor, order, failures, or meaningful differences disappear.

### Adjacency-as-causality
Events next to each other are presented as cause and effect without correlation evidence.

### False completeness
The UI is titled “Audit log” but silently samples events, omits channels, or hides retention limits.

### Retention surprise
Users discover only during an incident that relevant events expired or were never captured.

### Snapshot confusion
Activity events are treated as versions. Users expect to restore an event even though no recoverable state was stored.

### Sensitive echo
Old/new values or request metadata replicate secrets or personal data into a long-lived log.

### Human-only actor model
The schema cannot distinguish people, systems, integrations, and AI agents, making modern delegated workflows impossible to reconstruct accurately.

## Agent decision contract

Before implementing history, answer:

1. Is this view for collaboration/orientation, recovery, notification, security investigation, compliance, or several separate surfaces?
2. What event classes are authoritative and which are intentionally curated?
3. What are the stable actor, action, target, scope, timestamp, and correlation identities?
4. Can the actor be a system, integration, automation, or AI agent, and how is delegation represented?
5. Which fields are useful to the audience, and which are sensitive?
6. What filtering, date-range, pagination/search, and export capabilities match expected volume?
7. What grouping is safe without losing attribution, ordering, failures, or causal clues?
8. What are the retention policy and known coverage exclusions, and are they visible where they matter?
9. Which events link to version history, diffs, recovery, or remediation rather than pretending the log itself is reversible?
10. How will live updates preserve accessibility, reading position, and investigative context?

## Evidence boundary

The durable distinctions and design rules above are synthesis from audit-system behavior and established history/recovery principles. GitHub and Atlassian provide strong current production evidence for structured audit dimensions, filtering, retention/export constraints, actor context, and investigation workflows. Their exact fields, retention windows, and subscription behavior are product-specific and should not be generalized as universal requirements. This research does not establish controlled evidence that one visual feed layout produces better task outcomes.

## Sources

- GitHub Docs — Reviewing the audit log for your organization: https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization
- GitHub Enterprise Cloud Docs — Exporting audit log activity: https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/exporting-audit-log-activity-for-your-enterprise
- GitHub Docs — Audit log events for your organization: https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/audit-log-events-for-your-organization
- Atlassian Support — View audit log activities: https://support.atlassian.com/security-and-access-policies/docs/view-audit-log-activities/
- Atlassian Support — Advanced search / ALQL: https://support.atlassian.com/security-and-access-policies/docs/what-is-advanced-search-in-audit-log/
- Atlassian Support — Investigate and remediate an alert: https://support.atlassian.com/security-and-access-policies/docs/investigate-and-remediate-an-alert/
- Atlassian Statuspage — Activity log: https://support.atlassian.com/statuspage/docs/view-the-activity-log/

**Reviewed:** 2026-10-03
