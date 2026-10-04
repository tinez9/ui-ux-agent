# AI Collaborative Editing and Concurrency UX

Operational guidance for products where a person and one or more AI agents may work on the same artifact while work is still in progress.

## Core principle: concurrency is a coordination mode, not a feature checkbox

Do not infer that simultaneous editing is better merely because the storage layer can merge concurrent operations. The product must separately solve **awareness, ownership, interruption, intent preservation, integration, and recovery**.

A useful architecture separates:

- **workspace concurrency** — actors can work at the same time;
- **mutation concurrency** — actors can change the same underlying object at the same time;
- **semantic concurrency** — their intentions can coexist without invalidating each other.

CRDTs, operational transforms, optimistic locking, branches, and worktrees can solve parts of the first two. They do not prove the third.

## Prefer isolation when work is chunky; shared surfaces when coordination itself has value

GitHub's current cloud coding-agent workflow isolates agent work on a branch, exposes a diff, supports iteration, and uses pull requests as the review/integration boundary. Humans can also push their own changes to the agent's feature branch. This is a strong production pattern for code because many changes are multi-file, consequential, and naturally reviewed as a patch rather than keystroke-by-keystroke.

By contrast, collaborative documents and canvases can benefit from shared presence when the human needs to react while work emerges. A CHI 2026 study of collaborative document editing integrated agents as visible shared objects through agent profiles and tasks instead of treating AI use as private side activity.

**Decision rule:** choose the collaboration granularity from the work, not from technical novelty.

```text
Long-running / multi-file / consequential change
-> isolated draft or branch -> inspect diff -> integrate

Fine-grained co-creation where seeing work changes the next human action
-> shared surface + presence + explicit task/ownership cues

Same object, high contention, weak semantic merge model
-> serialize or partition ownership rather than pretending concurrency is free
```

## Presence should communicate intent, not just activity

A glowing avatar saying “AI is working” is weak coordination information. When useful, expose:

- what task the agent believes it owns;
- which artifact/region it may change;
- current phase or plan at a useful granularity;
- whether the human may safely edit concurrently;
- what changed since the human last inspected it;
- whether new human edits have been incorporated into the agent's plan.

This last point matters. Recent 2026 research on concurrent human-agent co-creation with professional designers found that participants noticed opportunities to contribute while observing agent progress, but sometimes avoided intervening because the agent could misinterpret their edits. A second probe explicitly tracked user actions and selectively updated the agent plan. Concurrent contribution happened in a meaningful minority of observed turns, including users expressing newly discovered preferences and completing pending work themselves.

The implication is not “always co-edit.” It is: **if the UI invites concurrent intervention, the system must make intervention semantics legible.**

## Human edits are signals, not automatically instructions

A human changing an artifact while an agent is working may mean:

- “preserve this exact change”;
- “here is a new preference; adapt the remaining plan”;
- “I am taking ownership of this subtask”;
- “this is exploratory; do not treat it as final”;
- “stop changing this region.”

Do not blindly feed every mutation into the agent as a new imperative. Use explicit ownership/intent cues where ambiguity would be costly, and preserve enough provenance to distinguish human-authored state from agent-authored state.

## Mergeability is not permission to overwrite intent

Automerge demonstrates that CRDTs can automatically merge concurrent data-structure changes without a central coordinator. This is valuable infrastructure, but conflict-free storage does not mean conflict-free meaning.

Examples:

- Human changes a heading to a quieter tone while the agent rewrites the paragraph toward a louder campaign voice.
- Human deletes a component while the agent adds a dependency on it elsewhere.
- Two changes touch different fields but encode incompatible product decisions.

Therefore keep the distinction:

```text
mechanically mergeable != semantically compatible
```

After an automatic structural merge, validate invariants and, for consequential intent conflicts, surface the decision rather than silently choosing by timestamp.

## Locks are a coordination tool, not the default UX

Use exclusive locks when simultaneous mutation is genuinely unsafe or integration cost is high. Avoid broad locks merely because conflict handling is difficult: they destroy the benefit of concurrent work and create stale-lock failure modes.

Prefer the smallest useful ownership boundary:

- object/region/task ownership before whole-document locking;
- short-lived leases before indefinite locks;
- visible ownership before invisible rejection;
- preserved drafts when a write cannot be accepted.

Optimistic version checks remain appropriate when contention is low: read a version, prepare the change, write conditionally, and replan on mismatch. Under high overlap, isolation/partitioning can be better than repeated optimistic retries.

## Review boundaries should match blast radius

Do not make users approve every generated token. Review should occur at a unit where the user can understand consequences.

Useful boundaries include:

- a suggested inline edit;
- a coherent object/section change;
- a patch/diff;
- a feature branch or pull request;
- an irreversible side effect.

GitHub's agent workflow is instructive: the agent works asynchronously on a branch and the user reviews a diff/PR; privileged workflows do not necessarily run automatically on agent pushes, preserving an additional boundary for potentially sensitive execution.

## Interruption needs a defined contract

For a running agent, define what happens when the human edits, pauses, redirects, or takes over.

Possible semantics:

```text
observe-only       human edit does not alter current plan
rebase             agent incorporates latest state before next mutation
redirect           human change updates goal/constraints
claim              human takes ownership of a region/subtask
pause              agent stops before next side effect
cancel             pending work is abandoned; completed work remains inspectable
```

Never leave this implicit in a product that visibly encourages simultaneous work.

## Failure modes

### Cursor theater
Showing agent presence without communicating scope, ownership, or whether intervention is safe.

**Instead:** expose task/region/phase and intervention semantics where they affect user action.

### CRDT = solved collaboration
Assuming conflict-free data structures eliminate intent conflicts.

**Instead:** treat storage merge and semantic reconciliation as separate layers.

### Invisible rebase
The agent silently changes its plan after a human edit, leaving the user unable to know which intent it followed.

**Instead:** make material plan adaptation or ownership changes inspectable.

### Human edit clobber
The agent finishes from an old snapshot and overwrites newer human work.

**Instead:** version-guard writes, re-read before mutation, and preserve the agent patch when conflict occurs.

### Lock everything
One actor monopolizes the artifact to avoid designing conflict handling.

**Instead:** isolate work or lock the smallest unsafe boundary; use concurrency only where it creates value.

### Merge-everything
Every mechanically compatible change is integrated automatically.

**Instead:** validate semantic/product invariants after merge and escalate incompatible intent.

### Approval per micro-change
Human oversight becomes a stream of low-information confirmations.

**Instead:** align review granularity with understandable consequence and reversibility.

## Implementation contract for coding/design agents

Before implementing human-agent concurrent editing, answer:

```text
Why does simultaneous work improve this task?
What is the unit of ownership: task, object, region, file, branch?
Can human and agent mutate the same unit concurrently?
What merge mechanism handles structural conflicts?
What detects semantic incompatibility after a clean merge?
How does the agent learn about human edits made mid-run?
Does a human edit imply preference, instruction, ownership, or merely exploration?
What can the user safely do while the agent is running?
How are pause, redirect, takeover, and cancel represented?
What state/version guards each write?
What work is preserved when integration fails?
At what unit is review actually comprehensible?
```

## Evaluation

Test collaboration, not just merge correctness:

- human edits the same region while the agent is reasoning from an older version;
- human edits a different region but changes a shared product constraint;
- agent and human make mechanically mergeable but semantically incompatible changes;
- user takes over a subtask the agent still believes it owns;
- user pauses immediately before a side effect;
- agent receives several human edits during a long run;
- a lock holder disappears;
- automatic merge succeeds but application invariants fail;
- user wants to restore only the human version of one region;
- agent branch diverges substantially while main continues changing.

Measure lost human edits, unnecessary blocking, semantic-conflict escape rate, interruption success, resumption/rebase cost, review burden, time-to-integrate, and how often users avoid useful intervention because collaboration semantics are unclear.

## Evidence boundary

The strongest production evidence here is GitHub's branch/diff/PR model for asynchronous coding agents and mature CRDT infrastructure for mechanically mergeable collaborative data. Emerging 2026 HCI research provides direct evidence that concurrent human-agent work can create useful contribution opportunities, while also exposing a key failure mode: users may avoid intervening when they fear the agent will misinterpret their edits. Sample sizes and domains are still narrow, so this does not justify universal live co-editing.

The durable synthesis is: **choose collaboration granularity from task semantics; make ownership and intervention legible; preserve human work with versioned writes; distinguish structural merge from intent compatibility; and prefer isolated drafts/branches when reviewable integration is more valuable than live simultaneity.**

## Sources

- GitHub Docs — About GitHub Copilot cloud agent (reviewed 2026-10-04): https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent
- GitHub Docs — Best practices for using GitHub Copilot to work on tasks (reviewed 2026-10-04): https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks/best-practices-for-using-copilot-to-work-on-tasks
- GitHub Docs — Using Copilot cloud agent on GitHub (reviewed 2026-10-04): https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github
- Automerge — CRDT / automatic merging documentation (reviewed 2026-10-04): https://automerge.org/
- Lehmann, Shauchenka & Buschek — Collaborative Document Editing with Multiple Users and AI Agents, CHI 2026: https://doi.org/10.1145/3772318.3790648
- Son et al. — “When to Hand Off, When to Work Together”: Understanding Concurrent Human-Agent Interaction in Shared Co-Creative Workspaces, 2026 preprint (reviewed 2026-10-04): https://arxiv.org/abs/2603.02050
