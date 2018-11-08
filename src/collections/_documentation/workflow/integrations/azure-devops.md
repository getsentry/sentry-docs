---
title: Azure DevOps
sidebar_order: 1
---
Sentry’s new Azure DevOps integration, formerly known as Visual Studio Team Services (VSTS), has the following features: commit tracking, issue management, issue sync, and sign in with Azure Devops. You can now use the data from your commits to Azure DevOps to help you find and fix bugs faster.

## Configure Azure DevOps


1. In Sentry, navigate to Organization Settings > Integrations. *Note: only users with Owner and Manager permissions will have access to this page.*
2. If you have the legacy VSTS integration installed, you’ll see a button next to Azure DevOps that says ‘Upgrade’. If you do not have the legacy VSTS integration installed, you’ll see a button that says ‘Install.’ Click this button.
3. In the resulting modal, click ‘Add Installation’.
4. An Azure DevOps install window should pop up. Select the Azure DevOps account you'd like to link with Sentry, and press 'Submit.'


Azure DevOps should now be enabled for all projects under your Sentry organization, but you'll need to configure the features below.


## Commit Tracking

Commit tracking allows you to hone in on problematic commits. Learn more about commit tracking [here]({%- link _documentation/workflow/releases.md -%}#link-repository).

## Suspect Commits and Suggested Assignees

Once you set up commit tracking, you’ll be able to see the most recent changes to files found in the issue’s stacktrace with suspect commits.

For issues where the files in the stacktrace match files included in commits sent to Sentry, you’ll see the suspect commit, with a link to the commit itself.

You’ll also see that the author of the suspect commit will be listed as a suggested assignee for this issue. To assign the issue to the suggested assignee, click on their icon.

## Issue Management

Issue tracking allows you to create Azure DevOps issues from within Sentry, and link Sentry issues to existing Azure DevOps Issues.

Once you’ve navigated to a specific issue, you’ll find the ‘Linked Issues’ section on the right hand panel. Here, you’ll be able to create or link Azure DevOps issues.

Issue Management is available on the Small, Medium, Large, and Enterprise plans.

## Issue Sync

Sync comments, assignees and status updates for issues in Sentry to Azure DevOps, to minimize duplication. When you delegate an issue to an assignee or update a status on Azure DevOps, the updates will also populate in Sentry. When you resolve an issue in Sentry, it will automatically update in Azure DevOps.

To configure Issue sync, navigate to Organization Settings > Integrations, and click ‘Configure’ next to your Azure DevOps instance. On the following page, you’ll see options of what information you’d like synced between Sentry and Azure DevOps.

Issue sync is available for organziations on the Medium, Large, and Enterprise plans.

## Resolve in Commit

Once you send commit data, you can start resolving issues by including `fixes <SENTRY-SHORT-ID>` in your commit messages. For example, a commit message might look like:

```
Prevent empty queries on users

Fixes MYAPP-317
```

When Sentry sees this, we’ll automatically annotate the matching issue with a reference to the commit, and, later, when that commit is part of a release, we’ll mark the issue as resolved.
