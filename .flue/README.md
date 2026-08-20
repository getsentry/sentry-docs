# Issue Triage Bot

The Flue v2 bot classifies GitHub issues, routes their synced Linear issues, enforces lifecycle rules, and can open validated broken-link PRs. Model output is schema-validated; identity, deadlines, permissions, and mutations are deterministic.

## Modes

| Variable                            | Effect                                                                |
| ----------------------------------- | --------------------------------------------------------------------- |
| `FLUE_TRIAGE_MODE=shadow`           | Produce job summaries and JSON artifacts; never write.                |
| `FLUE_TRIAGE_MODE=apply`            | Apply routing, priority, comments, labels, and due lifecycle actions. |
| `FLUE_TRIAGE_AUTO_FIX_ENABLED=true` | Allow validated content-link or exact-redirect PRs.                   |

Apply and auto-fix are disabled unless the repository variables are explicitly set.

## Decision Rules

| Requester and decision                  | Result                                                               |
| --------------------------------------- | -------------------------------------------------------------------- |
| Employee, actionable, auto-fix eligible | Attempt a validated PR; retain High-priority fallback and owner SLA. |
| Employee, actionable, no auto-fix       | Minimum High priority and individual owner required.                 |
| Employee, needs information             | Ask on GitHub, minimum High priority, never auto-close.              |
| External, actionable, auto-fix eligible | Attempt a validated PR.                                              |
| External, actionable, prioritized       | Route with Urgent, High, Medium, or Low priority.                    |
| External, actionable, no priority       | Add `Parking Lot`, leave open, and request human review in Linear.   |
| External, needs information             | Ask on GitHub with no priority; close after 14 days without a reply. |

High/Urgent issues without an owner get a Linear reminder after seven days. High/Urgent unresolved issues get a Linear reminder after four weeks. External Medium/Low issues inactive for three months are labeled `Parking Lot`, moved to Linear `Canceled`, commented, and closed.

Specific technical SDK issues move to the owning Linear team. Editorial, cross-SDK, and ambiguous work remains with DOCS. Team aliases and mentions live in `triage-config.json`.

## Validate

```bash
pnpm triage:test
ANTHROPIC_API_KEY=... GH_TOKEN=... LINEAR_API_KEY=... \
  pnpm triage:shadow --issue 17799
ANTHROPIC_API_KEY=... GH_TOKEN=... LINEAR_API_KEY=... \
  pnpm triage:backtest --limit 50 --state open
```

The backtest writes HTML, CSV, and JSON review tables under `.flue/output/backtest`. After merge, dispatch `Triage Backtest` with a small calibration sample, then increase the limit to cover the open backlog before enabling apply mode.

Create the GitHub `Parking Lot` label outside the incomplete declarative label catalog before enabling apply mode. Reviewed backtest corrections belong in `fixtures/triage-feedback.json` and should be promoted to executable eval cases.
