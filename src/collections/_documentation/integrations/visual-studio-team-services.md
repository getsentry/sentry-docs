---
title: Visual Studio Team Services
sidebar_order: 2
---
Sentry’s new Visual Studio Team Services (VSTS) integration has the following features: commit tracking, issue management, issue sync, and sign in with VSTS. You can now use the data from your commits to VSTS to help you find and fix bugs faster.

Note: This feature is only available for early adopters. To become an early adopter, navigate to Organization Settings > General Settings, and enable 'Early Adopter.'

## Configure VSTS


1. In Sentry, navigate to Organization Settings > Integrations. *Note: only users with Owner and Manager permissions will have access to this page.*
2. If you have the legacy VSTS integration installed, you’ll see a button next to VSTS that says ‘Upgrade’. If you do not have the legacy VSTS integration installed, you’ll see a button that says ‘Install.’ Click this button.
3. In the resulting modal, click ‘Add Installation’.
4. A VSTS install window should pop up. Select the VSTS account you'd like to link with Sentry, and press 'Submit.'


VSTS should now be enabled for all projects under your Sentry organization, but you'll need to configure the features below.


## Commit Tracking

Commit tracking allows you to hone in on problematic commits. Learn more about commit tracking [here](https://docs.sentry.io/learn/releases/#link-repository).

## Suspect Commits and Suggested Assignees

Once you set up commit tracking, you’ll be able to see the most recent changes to files found in the issue’s stacktrace with suspect commits.

For issues where the files in the stacktrace match files included in commits sent to Sentry, you’ll see the suspect commit, with a link to the commit itself.

You’ll also see that the author of the suspect commit will be listed as a suggested assignee for this issue. To assign the issue to the suggested assignee, click on their icon.

## Issue Management

Issue tracking allows you to create VSTS issues from within Sentry, and link Sentry issues to existing VSTS Issues.

Once you’ve navigated to a specific issue, you’ll find the ‘Linked Issues’ section on the right hand panel. Here, you’ll be able to create or link VSTS issues.

## Resolving in Commit/Pull Request

Once you are sending commit data, you can start resolving issues by including `fixes <SENTRY-SHORT-ID>` in your commit messages. For example, a commit message might look like:

```
Prevent empty queries on users

Fixes MYAPP-317
```

You can also resolve issues with pull requests by including `fixes <SENTRY-SHORT-ID>` in the title or description.

When Sentry sees this, we’ll automatically annotate the matching issue with a reference to the commit or pull request, and, later, when that commit or pull request is part of a release, we’ll mark the issue as resolved.

