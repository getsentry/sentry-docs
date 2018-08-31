---
title: GitHub
sidebar_order: 2
---
Sentry’s new GitHub integration has the following features: commit tracking, issue management, and Github SSO. You can now use the data from your commits to GitHub to help you find and fix bugs faster.

## Configure GitHub


1. In Sentry, navigate to Organization Settings > Integrations. *Note: only users with Owner and Manager permissions will have access to this page.*
2. If you have the legacy GitHub integration installed, you’ll see a button next to Github that says ‘Upgrade’. If you do not have the legacy GitHub integration installed, you’ll see a button that says ‘Install.’ Click this button.
3. In the resulting modal, click ‘Add Installation’.
4. A GitHub install window should pop up. Click ‘Install’.
5. Select which repositories Sentry should have access to (or, select all repositories).
6. You should then be redirected back to Sentry.
7. On your new GitHub instance in Sentry, click ‘Configure’.
8. Add any repositories from which you want to collect commit data. Note: Make sure you have given Sentry access to these repositories in GitHub.

Github should now be enabled for all projects under your Sentry organization.


## Commit Tracking

Commit tracking allows you to hone in on problematic commits. Learn more about commit tracking here.

## Suspect Commits and Suggested Assignees

Once you set up commit tracking, you’ll be able to see the most recent changes to files found in the issue’s stacktrace with suspect commits.

For issues where the files in the stacktrace match files included in commits sent to Sentry, you’ll see the suspect commit, with a link to the commit itself.

You’ll also see that the author of the suspect commit will be listed as a suggested assignee for this issue. To assign the issue to the suggested assignee, click on their icon.

## Issue Management

Issue tracking allows you to create GitHub issues from within Sentry, and link Sentry issues to existing Github Issues.

Once you’ve navigated to a specific issue, you’ll find the ‘Linked Issues’ section on the right hand panel. Here, you’ll be able to create or link GitHub issues.

## Resolving in Commit/Pull Request

Once you are sending commit data, you can start resolving issues by including `fixes <SENTRY-SHORT-ID>` in your commit messages. For example, a commit message might look like:

```
Prevent empty queries on users

Fixes MYAPP-317
```

You can also resolve issues with pull requests by including `fixes <SENTRY-SHORT-ID>` in the title or description.

When Sentry sees this, we’ll automatically annotate the matching issue with a reference to the commit or pull request, and, later, when that commit or pull request is part of a release, we’ll mark the issue as resolved.

## GitHub SSO

[Enable Single Sign-on]({%- link _documentation/learn/sso.md -%})

