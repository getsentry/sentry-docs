---
title: 'Issue Owners'
sidebar_order: 2
---

The Issue Owners feature allows you to create rules to decide which user or team should own an [Issue]({%- link _documentationdata-management/event-grouping.md -%}). These rules resemble a typical code owners file in a repository, and can match on file paths of files in the stack trace, URL of the request, or event tags. You can automatically assign issues to their owners and alert them about it, allowing you to get issues into the developers' hands who can fix them best.

## How It Works

While the feature is called Issue Owners, Sentry matches ownership rules against individual events in an issue. This has implications for different parts of Sentry that rely on this feature, which we describe in more detail on this page. But this is generally not a problem, and you can think of issue owners as an issue-level property.

### Creating Rules

You define ownership rules per project. To configure ownership rules, navigate to your **Project Settings > Issue Owners,** or click on the "Create Ownership Rule" button on an issue details page.

There are three types of matchers available:

1. Path: matches against all file paths in the event's stack trace
2. URL: matches against the event's `url` tag
3. Tag: matches against event tags

The general format of a rule is: `type:pattern owners`

`type`

can be either `path`, `url`, or `tags.TAG_NAME`, depending on whether you want to match on paths, URL, or a specific tag.

`pattern`

The pattern you're matching on (for example, `src/javascript/*` for `path`, `[https://www.example.io/checkout](https://www.example.io/checkout)` for `url`, or `Chrome 81.0.*` for `tags.browser`. It supports unix-style [glob syntax](https://en.wikipedia.org/wiki/Glob_(programming)). For example, `*` to match anything and `?` to match a single character. *This is not a regex.*

`owners` 

The single owner or space-separated list of owners. Each owner is the email of a Sentry user, or the name of a team prefixed with `#` (for example, `#backend-team`).

Teams and users *must* have access to the project to become owners. To grant a team access to a project, navigate to **Project Settings > Project Teams**, and click 'Add Team to [project]'. 

To grant a user access to a project, the user must be a member of a team with access to the project. To add a user to a team, navigate to **Settings > Teams**, select a team, then click "Add Member".

From project settings:

![Issue%20Owners%20page%203a4e6ced176441e484886551dd5c9ce8/Screenshot_2020-05-26_14.23.57.png](Issue%20Owners%20page%203a4e6ced176441e484886551dd5c9ce8/Screenshot_2020-05-26_14.23.57.png)

From an issue page:

![Issue%20Owners%20page%203a4e6ced176441e484886551dd5c9ce8/Screenshot_2020-06-09_14.50.21.png](Issue%20Owners%20page%203a4e6ced176441e484886551dd5c9ce8/Screenshot_2020-06-09_14.50.21.png)

When creating a rule from the issue page, you'll see some suggested paths and URLs based on the events in the issue. Note that Sentry doesn't suggest tags.

### Suggested Assignees

On the issue page, you'll see suggested assignees based on ownership rules matching the event you're looking at (by default, the issue page shows the latest event). Suggested assignees can also be based on [suspect commits]({%- link _documentation/workflow/releases.md -%}#after-associating-commits). You can assign the *issue* to a suggested assignee by clicking on the suggestion. An event can have multiple suggested assignees if it matches multiple ownership rules.

![Issue%20Owners%20page%203a4e6ced176441e484886551dd5c9ce8/Screenshot_2020-05-26_14.13.06.png](Issue%20Owners%20page%203a4e6ced176441e484886551dd5c9ce8/Screenshot_2020-05-26_14.13.06.png)

**Auto-Assign**

You can automatically assign issues to their owners by enabling the following setting in **Project Settings > Issue Owners**.

![Issue%20Owners%20page%203a4e6ced176441e484886551dd5c9ce8/Untitled.png](Issue%20Owners%20page%203a4e6ced176441e484886551dd5c9ce8/Untitled.png)

If an issue is already assigned, new events for that issue will not re-assign the issue even if they have a different owner. If an issue is not assigned, but a new event has multiple owners, Sentry assigns it to the owner matching the longest `pattern` in the rules that matched (regardless of the rule `type`).

### Issue Alerts

You can send [Issue Alerts]({%- link _documentation/workflow/alerts-notifications/alerts.md -%}#issue-alerts) to issue owners. Issue alerts are event-driven: when Sentry receives an event, it evaluates issue alert rules for the issue for that event. If the alert conditions match, Sentry sends an alert to the *event owners that triggered the alert*.

![Issue%20Owners%20page%203a4e6ced176441e484886551dd5c9ce8/Screenshot_2020-05-26_14.17.32.png](Issue%20Owners%20page%203a4e6ced176441e484886551dd5c9ce8/Screenshot_2020-05-26_14.17.32.png)

If no ownership rules match the event, the alert will either be sent to nobody or all members of the project, depending on the following setting in **Project Settings > Issue Owners:**

![https://docs.sentry.io/assets/owners_default_everyone-c7befc4231e759d8fb45a395ccdebb76ee0143ffaa30841e068f4cdc7463dc27.png](https://docs.sentry.io/assets/owners_default_everyone-c7befc4231e759d8fb45a395ccdebb76ee0143ffaa30841e068f4cdc7463dc27.png)

Alerts sent to Issue Owners only support email.

## Troubleshooting

- Make sure that all teams and users have access to the project; if they do not have the correct access, the Issue Owners rules will fail to save. To grant a team access to a project, navigate to **Project Settings > Project Teams**, and click 'Add Team to [project]'. To grant a user access to a project, the user must have at least member access to a team associated with the project. To add a user to a project's team, navigate to **Settings > Teams**, select a team, then click "Add Member".
