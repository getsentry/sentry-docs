---
title: Bitbucket
sidebar_order: 1
---
You can now use the data from your Bitbucket commits to help you find and fix bugs faster.

## Configure Bitbucket

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

## Commit Tracking

Commit tracking allows you to hone in on problematic commits. Learn more about [commit tracking]({%- link _documentation/workflow/releases.md -%}#link-repository).

## Suspect Commits and Suggested Assignees

Once you set up commit tracking, you’ll be able to see the most recent changes to files found in the issue’s stacktrace with suspect commits.

For issues where the files in the stacktrace match files included in commits sent to Sentry, you’ll see the suspect commit, with a link to the commit itself.

You’ll also see that the author of the suspect commit will be listed as a suggested assignee for this issue. To assign the issue to the suggested assignee, click on their icon.

## Issue Management

Issue tracking allows you to create Bitbucket issues from within Sentry, and link Sentry issues to existing Bitbucket Issues.

Once you’ve navigated to a specific issue, you’ll find the **Linked Issues** section on the right hand panel. Here, you’ll be able to create or link Bitbucket issues.

[{% asset bitbucket-link-issue.png %}]({% asset bitbucket-link-issue.png @path %})

## Resolving in Commit

Once you are sending commit data, you can start resolving issues by including `fixes <SENTRY-SHORT-ID>` in your commit messages. For example, a commit message might look like:

```
Prevent empty queries on users

Fixes MYAPP-317
```

When Sentry sees this, we’ll automatically annotate the matching issue with a reference to the commit, and, later, when that commit is part of a release, we’ll mark the issue as resolved.
