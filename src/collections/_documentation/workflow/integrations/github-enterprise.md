---
title: GitHub Enterprise
sidebar_order: 5
---
Sentry’s new Github Enterprise integration has the following features: commit tracking and issue management. You can now use the data from your commits to Github to help you find and fix bugs faster.

## Configure Github Enterprise

### Part One: Setup a Github App

1. Make sure you’ve whitelisted Sentry’s [outbound request IPs addresses](https://docs.sentry.io/ip-ranges/) for your Github Enterprise instance.
2. In your Github Enterprise organization, navigate to Settings > Developer Settings > Github Apps.
3. Fill out the resulting form as follows; then, click Create Github app.

  | Github App Name                 | Sentry        |
  | Homepage URL                    | https://sentry.io |
  | User authorization callback URL | https://sentry.io/extensions/github-enterprise/setup/ |
  | Setup URL                       | https://sentry.io/extensions/github-enterprise/setup/ |
  | Webhook URL                     | https://sentry.io/extensions/github-enterprise/webhook/ |
  | Webhook secret                  | *You’ll need to have this filled in. Make sure to have this information ready for the next steps. You can use the following command to generate a secret:* `openssl rand -base64 500 | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1` |
  | **Permissions** |
  | Repository metadata       | Read-only    |
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

### Part Two: Installing Your Github App to Sentry

1. In Sentry, navigate to Organization Settings > Integrations. *Note: only users with Owner and Manager permissions will have access to this page.*
2. Next to Github Enterprise, click ‘Install.’
3. Fill out the corresponding form.
  You can find your domain and app ID on your Sentry Github App page. Your private key can also be generated on the app page.
4. A Github install window should pop up. Click ‘Install.’
5. Select which repositories Sentry should have access to (or, select all repositories).
6. You should then be redirected back to Sentry.
7. On your new Github Enterprise instance, click ‘Configure.’
8. Add any repositories from which you want to collect commit data. Note: Make sure you have given Sentry access to these repositories in Github.

Github Enterprise should now be enabled for all projects under your Sentry organization.


## Commit Tracking

Commit tracking allows you to hone in on problematic commits. Learn more about commit tracking [here]({%- link _documentation/workflow/releases.md -%}#link-repository).

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
