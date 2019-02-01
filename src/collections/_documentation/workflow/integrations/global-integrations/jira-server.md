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
To generate an RSA public/private key pair, run the following commands in your terminal window one by one.
```
openssl genrsa -out jira_privatekey.pem 1024
openssl req -newkey rsa:1024 -x509 -key jira_privatekey.pem -out jira_publickey.cer -days 365
openssl pkcs8 -topk8 -nocrypt -in jira_privatekey.pem -out jira_privatekey.pcks8
openssl x509 -pubkey -noout -in jira_publickey.cer  > jira_publickey.pem
```


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
    | Create Incoming Link               | No    |
1. Click **Continue**. You should be returned to the **Configure Application Links** page, where you should see an application called **Sentry**.
1. Click the pencil icon next to the **Sentry** application.
1. On the lefthand side of the resulting modal, click **Incoming Authentication**. Fill our the form as follows, and press **Save**:
    | Consumer Key                 | (the consumer key from Step II.4)        |
    | Consumer Name                   | Sentry |
    | Public Key | (the public key you created in Section I) |
    | Consumer Callback URL                       | https://sentry.io/extensions/jira_server/setup/ |
    | Allow 2-Legged OAuth                     | no |

### III. Connect your Jira Server application with Sentry
{% capture __alert_content -%}
Make sure you have whitelisted [Sentry's IP ranges.](https://docs.sentry.io/ip-ranges/)
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}
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
