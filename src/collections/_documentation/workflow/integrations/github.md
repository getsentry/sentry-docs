---
title: GitHub
sidebar_order: 4
---
You can now use the data from your GitHub commits to help you find and fix bugs faster.

## Configure GitHub

{% capture __alert_content -%}
Sentry owner or manager permissions, and Github owner permissions are required to install this integration.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

1. In Sentry, navigate to Organization Settings > **Integrations**.
2. If you have the legacy GitHub integration installed, you’ll see a button next to Github that says **Upgrade**. If you do not have the legacy GitHub integration installed, you'll see a button that says **Install**.

    > [{% asset github-global-install.png %}]({% asset github-global-install.png @path %})

3. In the resulting modal, click **Add Installation**.

    > [{% asset github-global-add-installation.png %}]({% asset github-global-add-installation.png @path %})
    
4. A GitHub install window should pop up. Click **Install**.
5. Select which repositories Sentry should have access to (or select all repositories).
6. You should then be redirected back to the Sentry **Integrations** page.
7. On your new GitHub instance in Sentry, click **Configure**.
8. Add any repositories from which you want to collect commit data. Note: Make sure you have given Sentry access to these repositories in GitHub in the previous steps.

    > [{% asset github-global-add-repo.png %}]({% asset github-global-add-repo.png @path %})

Github should now be enabled for all projects under your Sentry organization.

## Commit Tracking

Commit tracking allows you to hone in on problematic commits. Learn more about [commit tracking]({%- link _documentation/workflow/releases.md -%}#link-repository).

## Suspect Commits and Suggested Assignees

Once you set up commit tracking, you’ll be able to see the most recent changes to files found in the issue’s stacktrace with suspect commits.

For issues where the files in the stacktrace match files included in commits sent to Sentry, you’ll see the suspect commit, with a link to the commit itself.

> [{% asset github-global-suspect-commits.png %}]({% asset github-global-suspect-commits.png @path %})

You’ll also see that the author of the suspect commit will be listed as a suggested assignee for this issue. To assign the issue to the suggested assignee, click on their icon.

## Issue Management

Issue tracking allows you to create GitHub issues from within Sentry, and link Sentry issues to existing Github Issues.

Once you’ve navigated to a specific issue, you’ll find the **Linked Issues** section on the right hand panel. Here, you’ll be able to create or link GitHub issues.

> [{% asset github-global-link-issue.png %}]({% asset github-global-link-issue.png @path %})

## Resolving in Commit/Pull Request

Once you are sending commit data, you can start resolving issues by including `fixes <SENTRY-SHORT-ID>` in your commit messages. For example, a commit message might look like:

```
Prevent empty queries on users

Fixes MYAPP-317
```

You can also resolve issues with pull requests by including `fixes <SENTRY-SHORT-ID>` in the title or description.

When Sentry sees this, we’ll automatically annotate the matching issue with a reference to the commit or pull request, and, later, when that commit or pull request is part of a release, we’ll mark the issue as resolved.

## GitHub SSO

[Enable Single Sign-on]({%- link _documentation/accounts/sso.md -%})
