---
title: Global Integrations
sidebar_order: 0
---

These integrations are set up once per organization, and are then usable in all projects.

## Issue Management

Issue tracking allows you to create issues from within Sentry, and link Sentry issues to existing supported integration Issues.

Once you’ve navigated to a specific issue, you’ll find the **Linked Issues** section on the right hand panel. Here, you’ll be able to create or link issues.

-   [_Azure DevOps_]({%- link _documentation/workflow/integrations/global-integrations/azure-devops.md -%})
-   [_Bitbucket_]({%- link _documentation/workflow/integrations/global-integrations/bitbucket.md -%})
-   [_Clubhouse_]({%- link _documentation/workflow/integrations/global-integrations/clubhouse.md -%})
-   [_GitHub_]({%- link _documentation/workflow/integrations/global-integrations/github.md -%})
-   [_GitHub Enterprise_]({%- link _documentation/workflow/integrations/global-integrations/github-enterprise.md -%})
-   [_GitLab_]({%- link _documentation/workflow/integrations/global-integrations/gitlab.md -%})
-   [_JIRA_]({%- link _documentation/workflow/integrations/global-integrations/jira.md -%})
-   [_JIRA Server_]({%- link _documentation/workflow/integrations/global-integrations/jira-server.md -%})

### Azure DevOps
You can now use the data from your commits to Azure DevOps, formerly known as Visual Studio Team Services (VSTS), to help you find and fix bugs faster.

#### Configure Azure DevOps

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

#### Commit Tracking

Commit tracking allows you to hone in on problematic commits. Learn more about [commit tracking]({%- link _documentation/workflow/releases.md -%}#link-repository).

#### Suspect Commits and Suggested Assignees

Once you set up commit tracking, you’ll be able to see the most recent changes to files found in the issue’s stack trace with suspect commits.

For issues where the files in the stack trace match files included in commits sent to Sentry, you’ll see the suspect commit, with a link to the commit itself.

[{% asset azure-global-suspect-commit.png %}]({% asset azure-global-suspect-commit.png @path %})  

You’ll also see that the author of the suspect commit will be listed as a suggested assignee for this issue. To assign the issue to the suggested assignee, click on their icon.

#### Issue Management

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

#### Issue Sync

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

#### Resolve in Commit

Once you send commit data, you can start resolving issues by including `fixes <SENTRY-SHORT-ID>` in your commit messages. For example, a commit message might look like:

```
Prevent empty queries on users

Fixes MYAPP-317
```

When Sentry sees this, we’ll automatically annotate the matching issue with a reference to the commit, and, later, when that commit is part of a release, we’ll mark the issue as resolved.

#### Troubleshooting

###### No accounts during installation

[{% asset azure-add-account-no-accounts.png %}]({% asset azure-add-account-no-accounts.png @path %})  

If you reach the account selection page during the Azure Devops installation process (step 4 in the instructions above) and see that there are no accounts available to select, please check the following possibilities:

- Ensure you are logged into the account connected to your Azure DevOps organization.
- Double check that your account is a Microsoft Account (MSA). At this time, we do not support Azure Active Directory (AAD) accounts. 

#### Issue Notifications

Alert notifications in Sentry can be routed to many supported integrations, but by default are aimed at email. You will need to configure a project’s [**Alert Rules**]({%- link _documentation/workflow/notifications/alerts.md -%}) to properly route notifications to a specific integration.

-   [_Slack_]({%- link _documentation/workflow/integrations/global-integrations/slack.md -%})

### Bitbucket

You can now use the data from your Bitbucket commits to help you find and fix bugs faster.

#### Configure Bitbucket

{% capture __alert_content -%}
Sentry owner or manager permissions, and Bitbucket admin permissions are required to install this integration.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

1. In Sentry, navigate to Organization Settings > **Integrations**.
2. If you have the legacy Bitbucket integration installed, you’ll see a button next to Bitbucket that says **Upgrade**. If you do not have the legacy Bitbucket integration installed, you’ll see a button that says **Install**.

    [{% asset bitbucket-install.png %}]({% asset bitbucket-install.png @path %})

3. In the resulting modal, click **Add Installation**.

    [{% asset bitbucket-add-installation.png %}]({% asset bitbucket-add-installation.png @path %})

4. A Bitbucket install window should pop up. Select the Bitbucket account you'd like to grant Sentry access to, and click **Grant Access**.
5. On your new Bitbucket instance in Sentry, click **Configure**.

    [{% asset bitbucket-installed.png %}]({% asset bitbucket-installed.png @path %})

6. Add any repositories from which you want to collect commit data.

    [{% asset bitbucket-add-repo.png %}]({% asset bitbucket-add-repo.png @path %})

Bitbucket should now be enabled for all projects under your Sentry organization.

#### Commit Tracking

Commit tracking allows you to hone in on problematic commits. Learn more about [commit tracking]({%- link _documentation/workflow/releases.md -%}#link-repository).

#### Suspect Commits and Suggested Assignees

Once you set up commit tracking, you’ll be able to see the most recent changes to files found in the issue’s stack trace with suspect commits.

For issues where the files in the stack trace match files included in commits sent to Sentry, you’ll see the suspect commit, with a link to the commit itself.

You’ll also see that the author of the suspect commit will be listed as a suggested assignee for this issue. To assign the issue to the suggested assignee, click on their icon.

#### Issue Management

Issue tracking allows you to create Bitbucket issues from within Sentry, and link Sentry issues to existing Bitbucket Issues.

Once you’ve navigated to a specific issue, you’ll find the **Linked Issues** section on the right hand panel. Here, you’ll be able to create or link Bitbucket issues.

[{% asset bitbucket-link-issue.png %}]({% asset bitbucket-link-issue.png @path %})

#### Resolving in Commit

Once you are sending commit data, you can start resolving issues by including `fixes <SENTRY-SHORT-ID>` in your commit messages. For example, a commit message might look like:

```
Prevent empty queries on users

Fixes MYAPP-317
```

When Sentry sees this, we’ll automatically annotate the matching issue with a reference to the commit, and, later, when that commit is part of a release, we’ll mark the issue as resolved.

### Clubhouse

Create a more efficient workflow by linking your Sentry Issues with your Clubhouse Stories. Errors, features, and anything else you track in Clubhouse can now live side by side. The new Clubhouse integration has feature parity with the Clubhouse plugin. If you're choosing between the two, we recommend installing the Clubhouse integration.

{% include components/alert.html
  title="Note"
  content="This integration **won't** work on-premise."
  level="warning"
%}

#### Installation

1. In Sentry, navigate to Organization Settings > **Integrations**.

    [{% asset clubhouse/clubhouse_integration_2.png alt="Sentry's integrations page with Clubhouse at the top." %}]({% asset clubhouse/clubhouse_integration_2.png @path %})

2. Find the Clubhouse Integration and click **Install**.
3.  In the resulting modal, approve the permissions by clicking **Install**.

    [{% asset clubhouse/clubhouse_modal.png alt="Sentry's modal to install Clubhouse and approve permissions." %}]({% asset clubhouse/clubhouse_modal.png @path %})

4. Your Clubhouse Integration is ready to use!

#### Configuration

##### Link an Issue

When linking an issue, you'll need either an existing Clubhouse Story or you'll need to create a Clubhouse Story.

###### Route 1: Clubhouse Story Exists

You can link a Sentry Issue to an existing Clubhouse Story.

1. In Sentry, navigate to the specific **Issue** you want to link.
2. Click on **Link Clubhouse Issue** under **Linked Issues**.

    [{% asset clubhouse/clubhouse_link_issue.png alt="Sentry's sidebar button for linking issues." %}]({% asset clubhouse/clubhouse_link_issue.png @path %})

3. Select the **Issue** you want to link.

    [{% asset clubhouse/clubhouse_choose_issue.png alt="Sentry's modal to link an issue to an existing Story." %}]({% asset clubhouse/clubhouse_choose_issue.png @path %})
    
4. Click **Save Changes** to submit the form.

5. Click on the **Clubhouse Story** under **Linked Issues**. This will automatically take you to Clubhouse.

    [{% asset clubhouse/clubhouse_story_in_linked_issues_82.png alt="Sentry's sidebar button illustrating that an issue is linked." %}]({% asset clubhouse/clubhouse_story_in_linked_issues_82.png @path %})

6. In Clubhouse, you can review your Clubhouse Story and the linked external ticket to Sentry.

    [{% asset clubhouse/clubhouse_story_with_issue_linked_82.png alt="Clubhouse web interface illustrating the linked Sentry issue." %}]({% asset clubhouse/clubhouse_story_with_issue_linked_82.png @path %})

###### Route 2: Create a Clubhouse Story Based on a Sentry Issue

You can take a Sentry Issue, create a Clubhouse Story, and link the two.

1. In Sentry, navigate to the specific Issue you want to link.
2. Click on **Link Clubhouse Issue** under **Linked Issues**.

    [{% asset clubhouse/clubhouse_link_issue.png alt="Sentry's sidebar button for linking issues." %}]({% asset clubhouse/clubhouse_link_issue.png @path %})
    
3. Add information to the created Clubhouse Story.

    A) Title of Story - auto-filled from the Sentry Issue, but also editable

    B) Description of Story - auto-filled from Sentry Issue, but also editable
    
    C) Project - additional data about the Project
    
    D) Requester - the person who created the Clubhouse Story and linked it to the Sentry Issue

    [{% asset clubhouse/clubhouse_create_story_with_issue.png alt="Sentry modal that creates a Clubhouse Story that's linked to a Sentry issue." %}]({% asset clubhouse/clubhouse_create_story_with_issue.png @path %})

4. Click **Save Changes** to submit the form.

5. Click on the **Clubhouse Story** under **Linked Issues**. This will automatically take you to Clubhouse.

    [{% asset clubhouse/clubhouse_story_in_linked_issues_88.png alt="Sentry's sidebar button illustrating that an issue is linked." %}]({% asset clubhouse/clubhouse_story_in_linked_issues_88.png @path %})

6. In Clubhouse, you can review your Clubhouse Story and the linked external ticket to Sentry.

    [{% asset clubhouse/clubhouse_story_with_issue_linked_88.png alt="Clubhouse web interface illustrating the linked Sentry issue." %}]({% asset clubhouse/clubhouse_story_with_issue_linked_88.png @path %})

### GitHub

You can now use the data from your GitHub commits to help you find and fix bugs faster.

#### Configure GitHub

{% capture __alert_content -%}
Sentry owner or manager permissions, and GitHub owner permissions are required to install this integration.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

1. In Sentry, navigate to Organization Settings > **Integrations**.
2. If you have the legacy GitHub integration installed, you’ll see a button next to GitHub that says **Upgrade**. If you do not have the legacy GitHub integration installed, you'll see a button that says **Install**.

    [{% asset github-global-install.png %}]({% asset github-global-install.png @path %})

3. In the resulting modal, click **Add Installation**.

    [{% asset github-global-add-installation.png %}]({% asset github-global-add-installation.png @path %})
    
4. A GitHub install window should pop up. Click **Install**.
5. Select which repositories Sentry should have access to (or select all repositories).
6. You should then be redirected back to the Sentry **Integrations** page.
7. On your new GitHub instance in Sentry, click **Configure**.
8. Add any repositories from which you want to collect commit data. _Note: Make sure you have given Sentry access to these repositories in GitHub in the previous steps._

    [{% asset github-global-add-repo.png %}]({% asset github-global-add-repo.png @path %})

GitHub should now be enabled for all projects under your Sentry organization.

#### Commit Tracking

Commit tracking allows you to hone in on problematic commits. Learn more about [commit tracking]({%- link _documentation/workflow/releases.md -%}#link-repository).

#### Suspect Commits and Suggested Assignees

Once you set up commit tracking, you’ll be able to see the most recent changes to files found in the issue’s stack trace with suspect commits.

For issues where the files in the stack trace match files included in commits sent to Sentry, you’ll see the suspect commit, with a link to the commit itself.

[{% asset github-global-suspect-commits.png %}]({% asset github-global-suspect-commits.png @path %})

You’ll also see that the author of the suspect commit will be listed as a suggested assignee for this issue. To assign the issue to the suggested assignee, click on their icon.

#### Issue Management

Issue tracking allows you to create GitHub issues from within Sentry, and link Sentry issues to existing GitHub Issues.

Once you’ve navigated to a specific issue, you’ll find the **Linked Issues** section on the right hand panel. Here, you’ll be able to create or link GitHub issues.

[{% asset github-global-link-issue.png %}]({% asset github-global-link-issue.png @path %})

#### Resolving in Commit/Pull Request

Once you are sending commit data, you can start resolving issues by including `fixes <SENTRY-SHORT-ID>` in your commit messages. For example, a commit message might look like:

```
Prevent empty queries on users

Fixes MYAPP-317
```

You can also resolve issues with pull requests by including `fixes <SENTRY-SHORT-ID>` in the title or description.

When Sentry sees this, we’ll automatically annotate the matching issue with a reference to the commit or pull request, and, later, when that commit or pull request is part of a release, we’ll mark the issue as resolved.

#### GitHub SSO

[Enable Single Sign-on]({%- link _documentation/accounts/sso.md -%})
