---
title: Global Integrations
sidebar_order: 0
---

These integrations are set up once per organization, and are then usable in all projects.

## Issue Management

Issue tracking allows you to create issues from within Sentry, and link Sentry issues to existing supported integration Issues.

Once you’ve navigated to a specific issue, you’ll find the **Linked Issues** section on the right hand panel. Here, you’ll be able to create or link issues.

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

Commit tracking allows you to hone in on problematic commits. Learn more about [commit tracking]({%- link _documentation/workflow/releases/index.md -%}#link-repository).

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

Once you send commit data, you can start resolving issues by including `fixes &lt;SENTRY-SHORT-ID&gt;` in your commit messages. For example, a commit message might look like:

```
Prevent empty queries on users

Fixes MYAPP-317
```

When Sentry sees this, we’ll automatically annotate the matching issue with reference to the commit, and later, when that commit is part of a release, we’ll mark the issue as resolved.

#### Troubleshooting

###### No accounts during installation

[{% asset azure-add-account-no-accounts.png %}]({% asset azure-add-account-no-accounts.png @path %})  

If you reach the account selection page during the Azure Devops installation process (step 4 in the instructions above) and see that there are no accounts available to select, please check the following possibilities:

- Ensure you are logged into the account connected to your Azure DevOps organization.
- Double-check that your account is a Microsoft Account (MSA). At this time, we do not support Azure Active Directory (AAD) accounts. 

### Bitbucket

You can use the data from your Bitbucket commits to help find and fix bugs faster.

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

Commit tracking allows you to hone in on problematic commits. Learn more about [commit tracking]({%- link _documentation/workflow/releases/index.md -%}#link-repository).

#### Suspect Commits and Suggested Assignees

Once you set up commit tracking, you’ll be able to see the most recent changes to files found in the issue’s stack trace with suspect commits.

For issues where the files in the stack trace match files included in commits sent to Sentry, you’ll see the suspect commit, with a link to the commit itself.

You’ll also see that the author of the suspect commit will be listed as a suggested assignee for this issue. To assign the issue to the suggested assignee, click on their icon.

#### Issue Management

Issue tracking allows you to create Bitbucket issues from within Sentry, and link Sentry issues to existing Bitbucket Issues.

Once you’ve navigated to a specific issue, you’ll find the **Linked Issues** section on the right hand panel. Here, you’ll be able to create or link Bitbucket issues.

[{% asset bitbucket-link-issue.png %}]({% asset bitbucket-link-issue.png @path %})

#### Resolving in Commit

Once you are sending commit data, you can start resolving issues by including `fixes &lt;SENTRY-SHORT-ID&gt;` in your commit messages. For example, a commit message might look like:

```
Prevent empty queries on users

Fixes MYAPP-317
```

When Sentry sees this, we’ll automatically annotate the matching issue with reference to the commit, and later, when that commit is part of a release, we’ll mark the issue as resolved.


### Bitbucket Server

You can use the data from your Bitbucket Server commits to help find and fix bugs faster. [Troubleshooting](/workflow/integrations/global-integrations/#troubleshooting-2)

#### Installing Bitbucket Server with Sentry

{% capture __alert_content -%}
Sentry owner or manager permissions, and Bitbucket administrator permissions are required to install this integration.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

##### I. Generate an RSA public/private key pair
To generate an RSA public/private key pair, run the following commands in your terminal window one by one.
```
openssl genrsa -out bitbucket_privatekey.pem 1024
openssl req -newkey rsa:1024 -x509 -key bitbucket_privatekey.pem -out bitbucket_publickey.cer -days 365
openssl pkcs8 -topk8 -nocrypt -in bitbucket_privatekey.pem -out bitbucket_privatekey.pcks8
openssl x509 -pubkey -noout -in bitbucket_publickey.cer  > bitbucket_publickey.pem
```

##### II. Create a new application link in Bitbucket
1. In Bitbucket, click the **gear icon** > **Applications** > **Application Links**.
1. Enter the following as the application URL: 
`https://sentry.io/extensions/bitbucket_server/setup/`
1. Click **Create New Link**. If you see a warning that “No response was received from the URL you entered,” ignore and click **Continue**.
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
1. Click **Continue**. This will return you to the **Configure Application Links** page, where you'll see an application called **Sentry**.
1. Click the pencil icon next to the **Sentry** application.
1. On the lefthand side of the resulting modal, click **Incoming Authentication**. Fill out the form as follows, and press **Save**:

    | Consumer Key                 | (the consumer key from Step II.4)        |
    | Consumer Name                   | Sentry |
    | Public Key | (the public key you created in Section I) |
    | Consumer Callback URL                       | https://sentry.io/extensions/bitbucket_server/setup/ |
    | Allow 2-Legged OAuth                     | no |

##### III. Connect your Bitbucket Server application with Sentry
{% capture __alert_content -%}
Confirm [Sentry's IP ranges]({%- link _documentation/meta/ip-ranges.md -%}) are whitelisted.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}
1. In Sentry, navigate to **Organization Settings** > **Integrations**.
2. Next to Bitbucket Server, click **Install**.
3. In the resulting modal, click **Add Installation**.
4. In the resulting window, enter the base URL for your Bitbucket Server instance, your consumer key, and your private key. Click **Submit**. Then, complete the OAuth process as prompted.
5. In Sentry, you’ll see a new Bitbucket Server instance appear on the Integrations page.

Bitbucket should now be authorized for all projects under your Sentry organization.

#### Commit Tracking

Commit tracking allows you to hone in on problematic commits. Learn more about [commit tracking]({%- link _documentation/workflow/releases/index.md -%}#link-repository).

#### Suspect Commits and Suggested Assignees

Once you set up commit tracking, you’ll be able to see the most recent changes to files found in the issue’s stack trace with suspect commits.

For issues where the files in the stack trace match files included in commits sent to Sentry, you’ll see the suspect commit, with a link to the commit itself.

You’ll also see that the author of the suspect commit will be listed as a suggested assignee for this issue. To assign the issue to the suggested assignee, click on their icon.

#### Resolving in Commit

Once you are sending commit data, you can start resolving issues by including `fixes &lt;SENTRY-SHORT-ID&gt;` in your commit messages. For example, a commit message might look like:

```
Prevent empty queries on users

Fixes MYAPP-317
```

When Sentry sees this, we’ll automatically annotate the matching issue with reference to the commit, and later, when that commit is part of a release, we’ll mark the issue as resolved.

### ClickUp

ClickUp’s core focus is about removing frustrations, inefficiencies, and disconnect caused by current project management solutions. You can create an issue in ClickUp from a Sentry issue or link it to an existing issue.

{% include components/alert.html
  title="Note"
  content="This integration **won't** work with self-hosted Sentry."
  level="warning"
%}

#### Install and Configure ClickUp

Follow the instructions in the link below:  
<https://docs.clickup.com/en/articles/3420285-sentry-io>

### Clubhouse

Create a more efficient workflow by linking your Sentry Issues with your Clubhouse Stories. Errors, features, and anything else you track in Clubhouse can now live side by side. The new Clubhouse integration has feature parity with the Clubhouse plugin. If you're choosing between the two, we recommend installing the Clubhouse integration.

{% include components/alert.html
  title="Note"
  content="This integration **won't** work with self-hosted Sentry."
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

You can use the data from your GitHub commits to help find and fix bugs faster.

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
8. Add any repositories from which you want to collect commit data. _Make sure you have given Sentry access to these repositories in GitHub in the previous steps._

    [{% asset github-global-add-repo.png %}]({% asset github-global-add-repo.png @path %})

The GitHub integration is available for all projects under your Sentry organization. You can connect multiple GitHub organizations to one Sentry organization, but you **cannot** connect a single GitHub organization to multiple Sentry organizations.

#### Commit Tracking

Commit tracking allows you to hone in on problematic commits. Learn more about [commit tracking]({%- link _documentation/workflow/releases/index.md -%}#link-repository).

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

Once you are sending commit data, you can start resolving issues by including `fixes &lt;SENTRY-SHORT-ID&gt;` in your commit messages. For example, a commit message might look like:

```
Prevent empty queries on users

Fixes MYAPP-317
```

You can also resolve issues with pull requests by including `fixes &lt;SENTRY-SHORT-ID&gt;` in the title or description.

When Sentry sees this, we’ll automatically annotate the matching issue with a reference to the commit or pull request, and, later, when that commit or pull request is part of a release, we’ll mark the issue as resolved.

#### GitHub SSO

[Enable Single Sign-on]({%- link _documentation/accounts/sso.md -%})

### GitHub Enterprise

You can use the data from your GitHub Enterprise commits to help find and fix bugs faster. [Troubleshooting](/workflow/integrations/global-integrations/#troubleshooting-2)

#### Configure GitHub Enterprise

{% capture __alert_content -%}
Sentry owner or manager permissions, and GitHub owner permissions are required to install this integration.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

###### Add new GitHub App

1. Confirm [Sentry's IP ranges]({%- link _documentation/meta/ip-ranges.md -%}) are whitelisted for your GitHub Enterprise instance.
2. In your GitHub Enterprise organization, navigate to Settings > Developer Settings > **GitHub Apps** and click to add a new **New GitHub App**.

    [{% asset github-e-new-app.png %}]({% asset github-e-new-app.png @path %})

###### Register new GitHub App

1. First, you'll need to generate a webhook secret. For example, in terminal:

    ```
    openssl rand -base64 500 | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1
    ```

2. Then in GitHub, fill out the form as follows and click **Create GitHub App**.

    | GitHub App Name                 | sentry-app        |
    | Homepage URL                    | https://sentry.io |
    | User authorization callback URL | https://sentry.io/extensions/github-enterprise/setup/ |
    | Setup URL                       | https://sentry.io/extensions/github-enterprise/setup/ |
    | Webhook URL                     | https://sentry.io/extensions/github-enterprise/webhook/ |
    | Webhook secret                  | `Input your secret from the previous step` |
    | Repository Administration | Read-only    |
    | Commit Statuses           | No Access    |
    | Deployments               | No Access    |
    | Issues                    | Read & Write |
    | Pages                     | No Access    |
    | Pull Requests             | Read-only    |
    | Repository Contents       | Read-only    |
    | Single File               | No Access    |
    | Repository Projects       | No Access    |
    | Organization members      | Read-only    |
    | Organization projects     | No Access    |
    | **Subscribe to Events** |
    | Pull Request        | Yes |
    | Push                | Yes |

###### Install your GitHub App

1. In Sentry, navigate to Organization Settings > **Integrations**.
2. Next to GitHub Enterprise, click **Install**.

    [{% asset github-e-install.png %}]({% asset github-e-install.png @path %})
    
3. Click **Add Installation**.

    [{% asset github-e-add-installation.png %}]({% asset github-e-add-installation.png @path %})
    
4. Fill out the following form with information from your GitHub apps configuration page.
    
    [{% asset github-e-form.png %}]({% asset github-e-form.png @path %})
    
    You'll need to generate a private key on your GitHub apps configuration page, and paste the entire contents into the **GitHub App Private Key** field.

    [{% asset github-e-generate-private-key.png %}]({% asset github-e-generate-private-key.png @path %})

    For example, in terminal:

    ```
    cat <YOUR_PRIVATE_KEY_FILE> | pbcopy
    ```

5. Click **Configure** and then a GitHub install window will pop up. Select which repositories Sentry should have access to (or select all repositories) and click **Install**.

    [{% asset github-e-repo-access.png %}]({% asset github-e-repo-access.png @path %})

6. You will then be redirected back to Sentry. On your new GitHub Enterprise instance, click **Configure**.

    [{% asset github-e-configure.png %}]({% asset github-e-configure.png @path %})
  
7. Add any repositories that you want to collect commit data from. _Make sure you have given Sentry access to these repositories in GitHub in the previous steps._

    [{% asset github-e-add-repo.png %}]({% asset github-e-add-repo.png @path %})
    
GitHub Enterprise should now be enabled for all projects under your Sentry organization.

#### Commit Tracking

Commit tracking allows you to hone in on problematic commits. Learn more about [commit tracking]({%- link _documentation/workflow/releases/index.md -%}#link-repository).

#### Suspect Commits and Suggested Assignees

Once you set up commit tracking, you’ll be able to see the most recent changes to files found in the issue’s stack trace with suspect commits.

For issues where the files in the stack trace match files included in commits sent to Sentry, you’ll see the suspect commit, with a link to the commit itself.

You’ll also see that the author of the suspect commit will be listed as a suggested assignee for this issue. To assign the issue to the suggested assignee, click on their icon.

#### Issue Management

Issue tracking allows you to create GitHub issues from within Sentry, and link Sentry issues to existing GitHub Issues.

Once you’ve navigated to a specific issue, you’ll find the **Linked Issues** section on the right hand panel. Here, you’ll be able to create or link GitHub issues.

[{% asset github-e-link-issue.png %}]({% asset github-e-link-issue.png @path %})

#### Resolving in Commit/Pull Request

Once you are sending commit data, you can start resolving issues by including `fixes &lt;SENTRY-SHORT-ID&gt;` in your commit messages. For example, a commit message might look like:

```
Prevent empty queries on users
Fixes MYAPP-317
```

You can also resolve issues with pull requests by including `fixes &lt;SENTRY-SHORT-ID&gt;` in the title or description.

When Sentry sees this, we’ll automatically annotate the matching issue with a reference to the commit or pull request, and, later, when that commit or pull request is part of a release, we’ll mark the issue as resolved.

### GitLab

Sentry’s GitLab integration helps you find and fix bugs faster by using data from your GitLab commits. Additionally, you can streamline your triaging process by creating a GitLab issue directly from Sentry. [Troubleshooting](/workflow/integrations/global-integrations/troubleshooting-2)

#### Configure GitLab

{% capture __alert_content -%}
Sentry owner or manager permissions and GitLab owner or maintainer permissions are required to install this integration.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

1. In Sentry, navigate to Organization Settings > **Integrations**.

1. Within Integrations, find the GitLab icon and click **Install**.

    [{% asset gitlab/integration-pg.png alt="GitLab icon and install button" %}]({% asset gitlab/integration-pg.png @path %})

1. In the resulting modal, click **Add Installation**.

    [{% asset gitlab/add-installation.png alt="Connect Sentry to a GitLab instance" %}]({% asset gitlab/add-installation.png @path %})

1. In the pop-up window, complete the instructions to create a Sentry app within GitLab. Once you’re finished, click **Next**.

    [{% asset gitlab/configuration-modal.png alt="Configuration modal and Sentry app within GitLab" %}]({% asset gitlab/configuration-modal.png @path %})

1. Fill out the resulting GitLab Configuration form with the following information:

    1. The GitLab URL is the base URL for your GitLab instance. If using gitlab.com, enter https://gitlab.com/.

    1. Find the GitLab Group Path in your group’s GitLab page.

        [{% asset gitlab/gitlab-groups.png alt="GitLab page showing group path" %}]({% asset gitlab/gitlab-groups.png @path %})

    1. Find the GitLab Application ID and Secret in the Sentry app within GitLab.

        [{% asset gitlab/gitlab-app-id.png alt="GitLab application id and secret" %}]({% asset gitlab/gitlab-app-id.png @path %})

    1. Use this information to fill out the GitLab Configuration and click **Submit**.
    
        [{% asset gitlab/gitlab-configuration.png alt="GitLab configuration form" %}]({% asset gitlab/gitlab-configuration.png @path %})

1. In the resulting panel, click **Authorize**.

1. In Sentry, return to Organization Settings > **Integrations**. You’ll see a new instance of GitLab underneath the list of integrations.

1. Next to your GitLab Instance, click **Configure**. _It’s important to configure to receive the full benefits of commit tracking._

    [{% asset gitlab/configure-button.png alt="GitLab instance with connected group and highlighted configure button" %}]({% asset gitlab/configure-button.png @path %})

1. On the resulting page, click **Add Repository** to select which repositories in which you’d like to begin tracking commits.

    [{% asset gitlab/add-repo.png alt="Add repository" %}]({% asset gitlab/add-repo.png @path %})

#### Issue Management
Issue tracking allows you to create GitLab issues from within Sentry and link Sentry issues to existing GitLab issues.

1. Select your issue

    [{% asset gitlab/sentry-unresolved-issues.png alt="List of unresolved issues" %}]({% asset gitlab/sentry-unresolved-issues.png @path %})

1. Navigate to Linked Issues on the right panel of the issue's page and click **Link GitLab Issue**.
    
    [{% asset gitlab/link-gitlab-issue.png alt="GitLab logo with Link GitLab Issue text" %}]({% asset gitlab/link-gitlab-issue.png @path %}) 

1. You have two options to complete the issue link:

    1. In the pop-up, you can fill out the appropriate details in the _Create_ tab, and then click **Create Issue**.
    
        [{% asset gitlab/gitlab-create-issue.png alt="pop-up modal to create issue" %}]({% asset gitlab/gitlab-create-issue.png @path %})
    
    1. Or, in the pop-up, you can click the _Link_ tab, search the issue by name, and then click **Link Issue**. _Issues aren't currently searchable by number._
    
        [{% asset gitlab/link-issue-by-name.png alt="pop-up modal to search issue name" %}]({% asset gitlab/link-issue-by-name.png @path %})

1. To unlink an issue, click on the **X** next to its name under Linked Issues.

    [{% asset gitlab/unlink-issue.png alt="GitLab logo and project next to an X icon" %}]({% asset gitlab/unlink-issue.png @path %})
    
#### Commit Tracking

Commit tracking allows you to hone in on problematic commits. With commit tracking, you can better isolate what might be problematic by leveraging information from releases like tags and metadata.

Once you've configured both [release and commit tracking]({%- link _documentation/workflow/releases/index.md -%}), you'll be able to see more thorough information about a release: who made commits, which issues were newly introduced by this release, and which deploys were impacted.

[{% asset gitlab/last-commit-in-releases.png alt="Dashboard with last commit highlighted" %}]({% asset gitlab/last-commit-in-releases.png @path %})

When you investigate deeper into that commit, you can leverage information from metadata like tags.

[{% asset gitlab/highlighting-tags.png alt="Issue detail highlighting tags" %}]({% asset gitlab/highlighting-tags.png @path %})

Broadly, this lets you isolate problems in order to see which commits might be problematic.

Learn more about [release and commit tracking]({%- link _documentation/workflow/releases/index.md -%}).

#### Suspect Commit

Once you are tracking the commits, the 'suspect commit' is the commit that likely introduced the error.

One special benefit of using Sentry's Commit Tracking is the ability to know the suspect commit that likely caused the error, with a suggested plan of action for how to rectify the error. For example, after pinpointing the suspect commit, you can also identify the developer who made the commit and assign them the task of fixing the error. 

[{% asset gitlab/highlighting-suspect-commits.png alt="Issue detail highlighting suspect commits" %}]({% asset gitlab/highlighting-suspect-commits.png @path %})

Here is where you can find info for [suspect commit setup]({%- link _documentation/workflow/releases/index.md -%}#link-repository).

#### Resolve via Commit or PR

Once you've added a repository (see configuration step 8), you can start resolving issues by including `fixes &lt;SHORT-ID&gt;` in your commit messages. You might want to type something in the commit like: "this fixes MyApp-AB12" or "Fixes MyApp-317". The keyword to include is **fixes**. You can also resolve issues with pull requests by including `fixes &lt;SHORT-ID&gt;` in the title or description. This will automatically resolve the issue in the next release. 

A `&lt;SHORT-ID&gt;` may look something like 'BACKEND-C' in the image below.

[{% asset gitlab/short-id.png alt="Issue detail highlighting suspect commits" %}]({% asset gitlab/short-id.png @path %})

#### Troubleshooting

FAQ:
- I'm using GitLab on-premise. Do I need to whitelist Sentry's IP addresses?
    - Yes. You can find our IP ranges [ here ]({%- link _documentation/meta/ip-ranges.md -%}).
- Do you support subgroups?
    - Currently, we only support subgroups for users using GitLab 11.6 or higher.
- My repositories are hosted under my user account, not a group account. Can I still use this integration?
    - Unfortunately, not. The GitLab integration only works for repositories that are hosted under group accounts.
- Are there pricing restrictions?
    - This integration is available for organizations on the [Team, Business, or Enterprise plan](https://sentry.io/pricing/).
- Who has permission to install this?
    - You must have both owner/manager permissions in Sentry and owner permissions in GitLab to successfully install this integration. 

### JIRA

Connect errors from Sentry with your Jira issues.

#### Installing Jira with Sentry

{% capture __alert_content -%}
Sentry owner or manager permissions, and Jira admin permissions are required to install this integration.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

1. In Sentry, navigate to Organization Settings > **Integrations**.
2. Next to Jira, click **Install**.
3. Click on the **Jira Marketplace** button to begin installing the Sentry app through the Jira marketplace.
4. Select which Sentry organizations you’d like to use Jira with, and **Save Settings**.
5. In Sentry, you’ll see a new Jira instance appear on the Integrations page.

    [{% asset jira-install.png %}]({% asset jira-install.png @path %})

Jira should now be authorized for all projects under your Sentry organization.

#### Issue Management

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

#### Issue Sync

Sync comments, assignees and status updates for issues in Sentry to Jira, to minimize duplication. When you delegate an issue to an assignee or update a status on Jira, the updates will also populate in Sentry. When you resolve an issue in Sentry, it will automatically update in Jira.

{% capture __alert_content -%}
Issue sync is available for organizations on the Team, Business, and Enterprise plans.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

To configure Issue sync, navigate to Organization Settings > **Integrations**, and click **Configure** next to your Jira instance. On the following page, you’ll see options of what information you’d like synced between Sentry and Jira.

[{% asset jira-sync.png %}]({% asset jira-sync.png @path %})

Sentry's assignee sync requires that user's email addresses be visible. You may
need to adjust your Jira instance's privacy settings or the privacy settings of
individual users if you experience assignee sync not behaving as expected.

### JIRA Server

Connect errors from Sentry with your Jira Server issues. [Troubleshooting](https://docs.sentry.io/workflow/integrations/global-integrations/#troubleshooting-2)

#### Installing Jira Server with Sentry

{% capture __alert_content -%}
Sentry owner or manager permissions, and Jira administrator permissions are required to install this integration.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

##### I. Generate an RSA public/private key pair
To generate an RSA public/private key pair, run the following commands in your terminal window one by one.
```
openssl genrsa -out jira_privatekey.pem 1024
openssl req -newkey rsa:1024 -x509 -key jira_privatekey.pem -out jira_publickey.cer -days 365
openssl pkcs8 -topk8 -nocrypt -in jira_privatekey.pem -out jira_privatekey.pcks8
openssl x509 -pubkey -noout -in jira_publickey.cer  > jira_publickey.pem
```

##### II. Create a new application link in Jira
1. In Jira, click the **gear icon** > **Applications** > **Application Links**.
1. Enter the following as the application URL: 
`https://sentry.io/extensions/jira_server/setup/`
1. Click **Create New Link**. If you see a warning that “No response was received from the URL you entered,” ignore and click **Continue**.
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
1. Click **Continue**. This will return you to the **Configure Application Links** page, where you'll see an application called **Sentry**.
1. Click the pencil icon next to the **Sentry** application.
1. On the lefthand side of the resulting modal, click **Incoming Authentication**. Fill out the form as follows, and press **Save**:

    | Consumer Key                 | (the consumer key from Step II.4)        |
    | Consumer Name                   | Sentry |
    | Public Key | (the public key you created in Section I) |
    | Consumer Callback URL                       | https://sentry.io/extensions/jira_server/setup/ |
    | Allow 2-Legged OAuth                     | no |

##### III. Connect your Jira Server application with Sentry
{% capture __alert_content -%}
Confirm [Sentry's IP ranges]({%- link _documentation/meta/ip-ranges.md -%}) are whitelisted.
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

#### Issue Management

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

#### Issue Sync

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

{% capture __alert_content -%}
If you hit a 4xx or 5xx error during or after setting up the Jira Server integration, please take a look at this [Help Center article](https://help.sentry.io/hc/en-us/articles/360034547794-Why-am-I-receiving-a-4xx-5xx-error-for-the-Jira-Server-Integration-).
{%- endcapture -%}
{%- include components/alert.html
  title="Troubleshooting"
  content=__alert_content
  level="warning"
%}

## Issue Notifications

Alert notifications in Sentry can be routed to many supported integrations, but by default are aimed at email. You will need to configure a project’s [**Alert Rules**]({%- link _documentation/workflow/alerts-notifications/alerts.md -%}) to properly route notifications to a specific integration.

### Slack

The global Slack integration creates workflows for your team. Now you can triage, resolve, and ignore Sentry issues directly from Slack.

#### Configure Slack

{% capture __alert_content -%}
Sentry owner or manager permissions are required to install this integration. Slack defaults to let any workspace member authorize apps, but they may have to request access. See this [Slack help article](https://get.slack.help/hc/en-us/articles/202035138-Add-an-app-to-your-workspace) for more details.

{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

1. In Sentry, navigate to Organization Settings > **Integrations**.

1. When you enter the page, the integrations list displays, which includes Slack. Use the search bar to filter quickly for the Slack integration. 
Click **Slack** to navigate to the details page for this integration.

    [{% asset slack-integration-directory.png %}]({% asset slack-integration-directory.png @path %})

1. Click **Add workspace**.

    [{% asset slack-overview-details-page.png %}]({% asset slack-overview-details-page.png @path %})


1. Toggle to the Slack workspace to which you want to connect using the dropdown menu in the upper right corner of the authentication window, then select **Allow**. Repeat this process if you are connecting to multiple workspaces.

    [{% asset slack-allow-install.png %}]({% asset slack-allow-install.png @path %})

1. Your integration details page will refresh and show the Slack workspace you just added.

    [{% asset slack-install-success.png %}]({% asset slack-install-success.png @path %})

Your Slack integration is now available to all projects in your Sentry organization. To enable Slack notification for private channels, add the Slack app to the channel. One quick method: use `@sentry` to invite the Sentry bot the Slack channel.

In the next section, we'll walk you through configuring your notification settings.

#### Configure Alert Rules

1. Confirm your Slack workspace is configured globally for your Sentry organization by navigating to Organization Settings > **Integrations**. Click on **Configuration(s)** to go to the configuration details page. 

    [{% asset slack-directory-installed.png %}]({% asset slack-directory-installed.png @path %})
    
1. Select the Slack workspace to configure from the list, then click **Configure**.

    [{% asset slack-install-success.png %}]({% asset slack-install-success.png @path %})

1. Click **Add Alert Rule** for this project to navigate to Alert Rule settings.

    [{% asset slack-project-configuration.png %}]({% asset slack-project-configuration.png @path %})

    You can also access **Alerts** from your **Project Settings**. From here, you can configure when notifications are sent to your Slack workspace(s).

    You can route notifications in a few ways: to a specific channel in your Slack workspace, to multiple channels in your Slack workspace, or to multiple Slack workspaces.

1. Click **New Alert Rule** to configure a new Alert.

    [{% asset slack-alert-rules.png %}]({% asset slack-alert-rules.png @path %})

    Update the Slack channel routing by for existing Alert Rules by choosing Slack as the action under **Perform these actions**:

    [{% asset slack-alert-rule-edit.png %}]({% asset slack-alert-rule-edit.png @path %})

    After selecting **Send a Slack notification**, specify the workspace, channel(s), and tags you’d like to include with your Alert Rule.

    [{% asset slack-alert-rule-edit-channels.png %}]({% asset slack-alert-rule-edit-channels.png @path %})

    You can add Alert Rules routing to as many Slack channels as you’d like.

1. Then once you receive a Slack notification, you can use the Resolve, Ignore, or Assign buttons to update the Issue in Sentry.

    [{% asset slack-alert-message.png %}]({% asset slack-alert-message.png @path %})
    
#### Deleting the legacy project-based Slack integration

We recommend disabling the legacy project-based integration after setting up the global integration.

Once you configure the global Slack integration and Alert Rules, you can disable the old project-based Slack integration. Go to each project that has the old project-based Slack enabled and disable it. If you're looking to upgrade your global integration, please refer to the information below under **Upgrading Slack**.

### Upgrading Slack

#### How do I know if I need to upgrade? 

You need to upgrade if you installed the global Slack integration on a Sentry organization before May 8, 2020. Unsure whether or not that includes your organization? Please visit your integration's page via **Organization Settings > Integrations**. You will see a call to action for the Slack integration. 

[{% asset slack-migration-integration-directory.png %}]({% asset slack-migration-integration-directory.png @path %})

Please note we are still rolling this out, if you don't see this yet you may be in a later wave.

If you installed the Slack integration on a Sentry organization after May 8, 2020, your integration will be up-to-date, and no upgrade is needed.

#### Why do I need to upgrade?

Sentry built its previous Slack integration on top of Slack's workspace apps. Unfortunately, Slack deprecated the workspace apps shortly afterward. You can find more details about that decision on [the Slack blog](https://medium.com/slack-developer-blog/an-update-on-workspace-apps-aabc9e42a98b). 

While we were able to maintain the integration in the past, our workspace app relies on Slack APIs that will soon deprecate. We now need to move to Slack's newly supported bot app framework.


#### What changes after my integration is upgraded?

Previously, Slack workspace apps allowed you to give Sentry access to whichever channels you chose, including public or specific channels -- which could be either public or private.

Bot apps in Slack work differently. By default, the Sentry bot will be able to post alerts in public channels, but in order to be able to post to private channels, you'll need to add the bot to that specific channel.

In terms of your alert rule configurations, if your current Slack integration only uses public channels, then nothing needs to change after you upgrade.

Going forward, if you want to add private channels to alert rules, you'll need to add the Sentry bot to the channel first before making the Sentry rule. 

If you have any private channels currently used in your alert rules, for the alerts to work, you'll need to add the Sentry bot after you've upgraded. In the upgrade flow, you'll have a chance to review which private channels you're using. Sentry will send a message to each channel, once you've upgraded, as a reminder to add the Sentry bot to that channel.

#### How do I upgrade?

1. Go to your Slack configurations page in Sentry. Click **Upgrade Now**.
    [{% asset slack-migration-configurations.png %}]({% asset slack-migration-configurations.png @path %})

2. Click **Continue**.
    [{% asset slack-migration-intro.png %}]({% asset slack-migration-intro.png @path %})

3. If you have any private channels in use, you'll see them listed.
    [{% asset slack-migration-private-channels.png %}]({% asset slack-migration-private-channels.png @path %})
    
    Otherwise, you'll see:
    [{% asset slack-migration-no-private-channels.png %}]({% asset slack-migration-no-private-channels.png @path %})
    
    Either way, when you're ready, Click **Upgrade**.


#### When do I need to migrate by?

All Sentry organizations will have until October 1, 2020, to upgrade their Slack integration. If you have any questions or concerns, please email us at [partners@sentry.io](mailto:partners@sentry.io).

## Incident Management

These integrations will connect your Sentry to incident management platforms to increase your visibility into incidents.

### PagerDuty
The global PagerDuty integration allows you to connect your Sentry organization with one or more PagerDuty accounts, and start getting incidents triggered from Sentry alerts.

1. In Sentry, navigate to **Organization Settings** > **Integrations**

2. Find PagerDuty in the list of the available Global Integrations list and click **Install.**
    
    [{% asset pagerduty/pd_not_installed.png %}]({% asset pagerduty/pd_not_installed.png @path %})

3. Click **Add Installation.**

    [{% asset pagerduty/pd_learn_more.png %}]({% asset pagerduty/pd_learn_more.png @path %})

4. You'll then be redirected to sign into PagerDuty and choose the account you'd like to connect to the current Sentry organization you are in.

    [{% asset pagerduty/pd_account_picker.png %}]({% asset pagerduty/pd_account_picker.png @path %})

5. After picking the account, you'll be prompted to add the PagerDuty services you want Sentry to send incidents to. Click **Connect** once you've added your services.  

    [{% asset pagerduty/pd_add_services.png %}]({% asset pagerduty/pd_add_services.png @path %})

6. The PagerDuty integration should now be installed. You'll be able to see the services connected by going to the **configure** page for your installation. 

    [{% asset pagerduty/pd_installed.png %}]({% asset pagerduty/pd_installed.png @path %})

7. You can now set up rules to use the new integration under **Project Configuration** in the configure section of your installation. 

    [{% asset pagerduty/pd_org_configuration.png %}]({% asset pagerduty/pd_org_configuration.png @path %})

If you re-generate an integration key for one of your services in PagerDuty you can manually update that value in configuration page for your PagerDuty installation. Additionally, you can add services by clicking the **Add Services** button in the top right. This will take you to the same page, as shown in step 5. 

8. Click **Add Alert Rule** in the integration configuration page or go to the **Project Settings** > **Alerts** to set up a **New Alert Rule** for the PagerDuty Integration.

    [{% asset pagerduty/pd_alert_rule.png %}]({% asset pagerduty/pd_alert_rule.png @path %})
    

#### Deleting the legacy PagerDuty integration

Once you configure the global PagerDuty integration and Alert Rules, you can disable the old PagerDuty integration. You’ll need to go to each project that has it enabled and disable it. We recommend disabling the legacy integration after setting up the global integration.

### Amixr

In Amixr, issues from Sentry get stored as well as alerts from other sources like Grafana or Alertmanager. The Amixr integration synchronizes issue statuses between Amixr and Sentry. Issues get posted to your Slack, and users can change the statuses of those issues by clicking on buttons within the message.

{% include components/alert.html
  title="Note"
  content="This integration **won't** work with self-hosted Sentry."
  level="warning"
%}

#### Install and Configure Amixr

Follow the instructions in the link below:  
<https://docs.amixr.io/#/integrations/sentry>

## Code Linking

These integrations will allow seamlessly connect a Sentry error to the underlying code behind the error in a separate platform.

### Rookout

Rookout's new integration adds a layer of depth to Sentry Issues by allowing you to jump right from an Issue to a non-breaking breakpoint on the line that caused the error. 

{% include components/alert.html
  title="Note"
  content="This integration **won't** work with self-hosted Sentry."
  level="warning"
%}

#### Installation

1. In Sentry, navigate to Organization Settings > **Integrations**.
2. Find the Rookout Integration and click **Install**.

    [{% asset rookout/rookout_install.png alt="Sentry's integrations page with Rookout at the top." %}]({% asset rookout/rookout_install.png @path %})

3. In the resulting modal, approve the permissions by clicking **Install**.

    [{% asset rookout/rookout_modal.png alt="Sentry modal indicating that permissions need installation." %}]({% asset rookout/rookout_modal.png @path %})

4. Your Rookout Integration is ready to use!

#### Use Integration in Stack Trace

After installing Rookout in Sentry, you can go straight to the line of code in your stack trace, and click the Rookout icon. That will take you directly to the same line of code in the same file inside Rookout.

1. In Sentry, navigate to the specific **Issue** you want to link and navigate to the **Stack Trace**.
2. In the Stack Trace, you'll see the option to open the line in Rookout by clicking on the Rookout icon.

    [{% asset rookout/rookout_line_in_stack_trace.png alt="Sentry stack trace showing the Rookout icon on a specific line." %}]({% asset rookout/rookout_line_in_stack_trace.png @path %})

3. Clicking on the Rookout icon takes you to Rookout's web UI where you can continue the debugging process. Rookout makes the best guess for the corresponding project and file in its web UI and will take you to the correct line of code in the file.

    [{% asset rookout/rookout_screen_1.png alt="Sentry modal indicating that permissions need installation." %}]({% asset rookout/rookout_screen_1.png @path %})


## A/B Testing

These integrations will connect your Sentry to A/B testing platforms to give you better insight when users in one of your test groups are encountering errors.

### Split

The Split integration quickly processes and displays Sentry exception data in the Split platform as track events for analysis. You can control what environments and traffic types you're capturing exceptions for in the Split dashboard without having to touch any code.

The Split integration is only available for organizations on the Business and Enterprise plans.

{% include components/alert.html
  title="Note"
  content="This integration **won't** work with self-hosted Sentry."
  level="warning"
%}

#### Install and Configure Split

Follow the instructions in the link below:  
<https://help.split.io/hc/en-us/articles/360029879431>

## Troubleshooting

If you're having trouble setting up Sentry with your on-premise integration like JIRA Server, Bitbucket Server, GitHub Enterprise, or Gitlab:
- Ensure that the installation URL you provided is a fully qualified domain name (FQDN), which is resolvable on the internet.
- Double-check that the IP addresses Sentry uses to make outbound requests are whitelisted <{%- link _documentation/meta/ip-ranges.md -%}>.
- Make sure that Sentry's access to your installation URL is not path restricted.
