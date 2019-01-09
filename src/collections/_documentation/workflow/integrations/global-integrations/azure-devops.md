---
title: Azure DevOps
sidebar_order: 0
---
You can now use the data from your commits to Azure DevOps, formerly known as Visual Studio Team Services (VSTS), to help you find and fix bugs faster.

## Configure Azure DevOps

{% capture __alert_content -%}
Sentry owner or manager permissions, and Azure project admin permissions are required to install this integration.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

1. In Sentry, navigate to Organization Settings > **Integrations**.
2. If you have the legacy VSTS integration installed, you’ll see a button next to Azure DevOps that says **Upgrade**. If you do not have the legacy VSTS integration installed, you’ll see a button that says **Install**.

    [{% asset azure-global-install.png %}]({% asset azure-global-install.png @path %})

3. In the resulting modal, click **Add Installation**.

    [{% asset azure-global-add-installation.png %}]({% asset azure-global-add-installation.png @path %})
    
4. An Azure DevOps install window should pop up. Select the Azure DevOps account you'd like to link with Sentry, and press **Submit**.

    [{% asset azure-global-installed.png %}]({% asset azure-global-installed.png @path %})  

Azure DevOps should now be enabled for all projects under your Sentry organization, but you'll need to configure the features below.

## Commit Tracking

Commit tracking allows you to hone in on problematic commits. Learn more about [commit tracking]({%- link _documentation/workflow/releases.md -%}#link-repository).

## Suspect Commits and Suggested Assignees

Once you set up commit tracking, you’ll be able to see the most recent changes to files found in the issue’s stacktrace with suspect commits.

For issues where the files in the stacktrace match files included in commits sent to Sentry, you’ll see the suspect commit, with a link to the commit itself.

[{% asset azure-global-suspect-commit.png %}]({% asset azure-global-suspect-commit.png @path %})  

You’ll also see that the author of the suspect commit will be listed as a suggested assignee for this issue. To assign the issue to the suggested assignee, click on their icon.

## Issue Management

Issue tracking allows you to create Azure DevOps issues from within Sentry, and link Sentry issues to existing Azure DevOps Issues.

{% capture __alert_content -%}
Issue management is available for organizations on the Team, Business, and Enterprise plans.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

Once you’ve navigated to a specific issue, you’ll find the **Linked Issues** section on the right hand panel. Here, you’ll be able to create or link Azure DevOps issues.

[{% asset azure-global-link-issue.png %}]({% asset azure-global-link-issue.png @path %})


## Issue Sync

Sync comments, assignees and status updates for issues in Sentry to Azure DevOps, to minimize duplication. When you delegate an issue to an assignee or update a status on Azure DevOps, the updates will also populate in Sentry. When you resolve an issue in Sentry, it will automatically update in Azure DevOps.

{% capture __alert_content -%}
Issue sync is available for organizations on the Team, Business, and Enterprise plans.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

To configure Issue sync, navigate to Organization Settings > **Integrations**, and click **Configure** next to your Azure DevOps instance. On the following page, you’ll see options of what information you’d like synced between Sentry and Azure DevOps.

[{% asset azure-global-issue-sync.png %}]({% asset azure-global-issue-sync.png @path %})

## Resolve in Commit

Once you send commit data, you can start resolving issues by including `fixes <SENTRY-SHORT-ID>` in your commit messages. For example, a commit message might look like:

```
Prevent empty queries on users

Fixes MYAPP-317
```

When Sentry sees this, we’ll automatically annotate the matching issue with a reference to the commit, and, later, when that commit is part of a release, we’ll mark the issue as resolved.

## Troubleshooting

#### No accounts during installation

[{% asset azure-add-account-no-accounts.png %}]({% asset azure-add-account-no-accounts.png @path %})  

If you reach the account selection page during the Azure Devops installation process (step 4 in the instructions above) and see that there are no accounts available to select, please check the following possibilities:

- Ensure you are logged into the account connected to your Azure DevOps organization.
- Double check that your account is a Microsoft Account (MSA). At this time, we do not support Azure Active Directory (AAD) accounts. 
