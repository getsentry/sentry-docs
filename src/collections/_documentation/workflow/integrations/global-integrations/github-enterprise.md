---
title: GitHub Enterprise
sidebar_order: 3
---
You can now use the data from your GitHub Enterprise commits to help you find and fix bugs faster.

## Configure GitHub Enterprise

{% capture __alert_content -%}
Sentry owner or manager permissions, and GitHub owner permissions are required to install this integration.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

#### Add new GitHub App

1. Make sure you've whitelisted Sentry’s outbound request [IPs addresses](https://docs.sentry.io/ip-ranges/) for your GitHub Enterprise instance.
2. In your Github Enterprise organization, navigate to Settings > Developer Settings > **GitHub Apps** and click to add a new **New GitHub App**.

    [{% asset github-e-new-app.png %}]({% asset github-e-new-app.png @path %})

#### Register new GitHub App

1. First, you'll need to generate a webhook secret. For example, in terminal:

    ```
    openssl rand -base64 500 | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1
    ```

2. Then in GitHub, fill out the form as follows and click **Create GitHub App**.

    | Github App Name                 | sentry-app        |
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

#### Install your Github App

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
  
7. Add any repositories that you want to collect commit data from. Note: Make sure you have given Sentry access to these repositories in GitHub in the previous steps.

    [{% asset github-e-add-repo.png %}]({% asset github-e-add-repo.png @path %})
    
GitHub Enterprise should now be enabled for all projects under your Sentry organization.

## Commit Tracking

Commit tracking allows you to hone in on problematic commits. Learn more about [commit tracking]({%- link _documentation/workflow/releases.md -%}#link-repository).

## Suspect Commits and Suggested Assignees

Once you set up commit tracking, you’ll be able to see the most recent changes to files found in the issue’s stacktrace with suspect commits.

For issues where the files in the stacktrace match files included in commits sent to Sentry, you’ll see the suspect commit, with a link to the commit itself.

You’ll also see that the author of the suspect commit will be listed as a suggested assignee for this issue. To assign the issue to the suggested assignee, click on their icon.

## Issue Management

Issue tracking allows you to create GitHub issues from within Sentry, and link Sentry issues to existing GitHub Issues.

Once you’ve navigated to a specific issue, you’ll find the **Linked Issues** section on the right hand panel. Here, you’ll be able to create or link GitHub issues.

[{% asset github-e-link-issue.png %}]({% asset github-e-link-issue.png @path %})

## Resolving in Commit/Pull Request

Once you are sending commit data, you can start resolving issues by including `fixes <SENTRY-SHORT-ID>` in your commit messages. For example, a commit message might look like:

```
Prevent empty queries on users
Fixes MYAPP-317
```

You can also resolve issues with pull requests by including `fixes <SENTRY-SHORT-ID>` in the title or description.

When Sentry sees this, we’ll automatically annotate the matching issue with a reference to the commit or pull request, and, later, when that commit or pull request is part of a release, we’ll mark the issue as resolved.
