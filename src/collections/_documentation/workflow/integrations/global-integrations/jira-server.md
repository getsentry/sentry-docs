---
title: JIRA Server
sidebar_order: 6
---

Connect errors from Sentry with your Jira Server issues.

## Installing Jira Server with Sentry

{% capture __alert_content -%}
Sentry owner or manager permissions, and Jira administrator permissions are required to install this integration.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

### I. Generate an RSA public/private key pair
Complete the instructions in the section titled **Generate an RSA public/private key pair** in [these Jira docs](https://developer.atlassian.com/server/jira/platform/oauth/). 
You'll need your public and private keys for later in the process.

### II. Create a new application link in Jira
1. In Jira, click the **gear icon** > **Applications** > **Application Links**.
1. Enter the following as the application URL: 
`https://sentry.io/extensions/jira_server/setup/`
1. Click **Create New Link**. If you see a warning that “No response was received from the URL you entered”, ignore and click **Continue**.
1. In the resulting dialog, fill out the form as follows:

    | Application Name                 | Sentry        |
    | Application Type                   | Generic Application |
    | Service Provider Name | Sentry |
    | Consumer Key                       | (your choice, but keep this handy for the next step) |
    | Shared Secret                     | sentry |
    | Request Token URL                  | https://sentry.io |
    | Access Token URL | https://sentry.io    |
    | Authorize URL           | https://sentry.io    |
    | Create Incoming Link               | Yes    |
1. Click **Continue**.
1. On the next screen of the dialog, enter into the form the consumer key from the previous step, `Sentry` as the consumer name, and the public key created in Section I.
1. Click **Continue**. You should now see an application link called Sentry.

### III. Connect your Jira Server application with Sentry
1. In Sentry, navigate to **Organization Settings** > **Integrations**.
2. Next to Jira Server, click **Install**.
3. In the resulting modal, click **Add Installation**.
4. In the resulting window, enter the base URL for your Jira Server instance, your consumer key, and your private key. Click **Submit**. Then, complete the OAuth process as prompted.
5. In Sentry, you’ll see a new Jira Server instance appear on the Integrations page.

Jira should now be authorized for all projects under your Sentry organization.

## Issue Management

Issue tracking allows you to create Jira issues from within Sentry, and link Sentry issues to existing Jira Issues.

{% capture __alert_content -%}
Issue management is available for organizations on the Team, Business, and Enterprise plans.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

To configure Issue management, once you’ve navigated to a specific Sentry issue, you’ll find the **Linked Issues** section on the right hand panel.

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
  level="warning"
%}

To configure Issue sync, navigate to **Organization Settings** > **Integrations**, and click **Configure** next to your Jira Server instance. On the following page, you’ll see options of what information you’d like synced between Sentry and Jira.

[{% asset jira-sync.png %}]({% asset jira-sync.png @path %})
