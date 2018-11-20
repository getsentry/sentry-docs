---
title: JIRA
sidebar_order: 8
---

## Installing Jira with Sentry

{% capture __alert_content -%}
Sentry owner or manager permissions, and Jira admin permissions are required to install this integration.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

1. In Sentry, navigate to Organization Settings > `Integrations`.
2. Next to Jira, click `Install`.
3. Click on the `Jira Marketplace` button to begin installing the Sentry app through the Jira marketplace.
4. Select which Sentry organizations you’d like to use Jira with, and `Save Settings`.
5. In Sentry, you’ll see a new Jira instance appear on the Integrations page.

Jira should now be authorized for all projects under your Sentry organization.

[{% asset jira-install.png %}]({% asset jira-install.png @path %})

## Issue Management

Issue tracking allows you to create Jira issues from within Sentry, and link Sentry issues to existing Jira Issues.

{% capture __alert_content -%}
Issue management is available for organizations on the Team, Business, and Enterprise plans.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

To configure Issue management, once you’ve navigated to a specific Sentry issue, you’ll find the `Linked Issues` section on the right hand panel.

[{% asset jira-link-issue.png %}]({% asset jira-link-issue.png @path %})

Here, you’ll be able to create or link Jira issues.

[{% asset jira-create-issue.png %}]({% asset jira-create-issue.png @path %})

## Issue Sync

Sync comments, assignees and status updates for issues in Sentry to Jira, to minimize duplication. When you delegate an issue to an assignee or update a status on Jira, the updates will also populate in Sentry. When you resolve an issue in Sentry, it will automatically update in Jira.

{% capture __alert_content -%}
Issue sync is available for organizations on the Team, Business, and Enterprise plans.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

To configure Issue sync, navigate to Organization Settings > `Integrations`, and click `Configure` next to your Jira instance. On the following page, you’ll see options of what information you’d like synced between Sentry and Jira.

[{% asset jira-sync.png %}]({% asset jira-sync.png @path %})