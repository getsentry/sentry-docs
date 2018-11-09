---
title: Bitbucket
sidebar_order: 3
---
Sentry’s new Bitbucket integration has the following features: commit tracking and issue management. You can now use the data from your commits to Bitbucket to help you find and fix bugs faster.

## Configure Bitbucket


1. In Sentry, navigate to Organization Settings > Integrations. *Note: only users with Owner and Manager permissions will have access to this page.*
1. If you have the legacy Bitbucket integration installed, you’ll see a button next to Bitbucket that says ‘Upgrade’. If you do not have the legacy Bitbucket integration installed, you’ll see a button that says ‘Install.’ Click this button.
1. In the resulting modal, click ‘Add Installation’.
1. A Bitbucket install window should pop up. Select the Bitbucket account you'd like to grant Sentry access to, and click ‘Grant Access’.
1. On your new Bitbucket instance in Sentry, click ‘Configure’.
1. Add any repositories from which you want to collect commit data.

Bitbucket should now be enabled for all projects under your Sentry organization.


## Commit Tracking

Commit tracking allows you to hone in on problematic commits. Learn more about commit tracking [here]({%- link _documentation/workflow/releases.md -%}#link-repository).

## Suspect Commits and Suggested Assignees

Once you set up commit tracking, you’ll be able to see the most recent changes to files found in the issue’s stacktrace with suspect commits.

For issues where the files in the stacktrace match files included in commits sent to Sentry, you’ll see the suspect commit, with a link to the commit itself.

You’ll also see that the author of the suspect commit will be listed as a suggested assignee for this issue. To assign the issue to the suggested assignee, click on their icon.

## Issue Management

Issue tracking allows you to create Bitbucket issues from within Sentry, and link Sentry issues to existing Bitbucket Issues.

Once you’ve navigated to a specific issue, you’ll find the ‘Linked Issues’ section on the right hand panel. Here, you’ll be able to create or link Bitbucket issues.

## Resolving in Commit

Once you are sending commit data, you can start resolving issues by including `fixes <SENTRY-SHORT-ID>` in your commit messages. For example, a commit message might look like:

```
Prevent empty queries on users

Fixes MYAPP-317
```

When Sentry sees this, we’ll automatically annotate the matching issue with a reference to the commit, and, later, when that commit is part of a release, we’ll mark the issue as resolved.
