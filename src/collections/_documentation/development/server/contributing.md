---
title: Contribution Guidelines
sidebar_order: 0
---

This documentation serves as reference points for developing against Sentry.

## Code Review

Code review is mandatory at Sentry. This adds overhead to each change, but ensures that simple, often overlooked problems are more easily avoided.

Code review is managed via GitHub’s Pull Requests (see below for rationale). Templates may exist on repositories, if they do not, consider [creating one](https://help.github.com/articles/creating-a-pull-request-template-for-your-repository/).

When creating a pull request, reference any tickets or Sentry issues which are being addressed. Additionally **@mention** an appropriate team (or teams) for review.

### GitHub Teams

The following teams are defined in GitHub and should be used when creating Pull Requests:

-   [@getsentry/app-backend](https://github.com/orgs/getsentry/teams/app-backend)
-   [@getsentry/app-frontend](https://github.com/orgs/getsentry/teams/app-frontend)
-   [@getsentry/infrastructure](https://github.com/orgs/getsentry/teams/infrastructure)
-   [@getsentry/ops](https://github.com/orgs/getsentry/teams/ops)
-   [@getsentry/app](https://github.com/orgs/getsentry/teams/app) – the entire product team, use sparingly

Additionally, language specific teams exist, primarily for SDKs:

-   [@getsentry/cocoa](https://github.com/orgs/getsentry/teams/cocoa)
-   [@getsentry/java](https://github.com/orgs/getsentry/teams/java)
-   [@getsentry/javascript](https://github.com/orgs/getsentry/teams/javascript)
-   [@getsentry/php](https://github.com/orgs/getsentry/teams/php)
-   [@getsentry/python](https://github.com/orgs/getsentry/teams/python)

### Why Pull Requests

Because Sentry is an open source project maintained via GitHub we want to ensure that the barrier to entry for external contributions is minimal. By using GitHub features when possible, we make it easy for developers familiar with other projects on GitHub. While GitHub’s tools [aren’t always the best](http://cra.mr/2014/05/03/on-pull-requests), they’re usable enough that we’ll make do.

## Commit Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to more readable messages that are easy to follow when looking through the project history.

### General Rules

1.  Separate subject from body with a blank line
2.  Limit the subject line to 70 characters
3.  Capitalize the subject line
4.  Do not end the subject line with a period
5.  Use the imperative mood in the subject line
6.  Use the body to explain what and why vs. how
7.  Each commit should be a single, stable change

### Merge vs Rebase

Sentry uses a rebase workflow. That means that every commit on its own should be a clear, functional, and stable change. This means then when you’re building a new feature, you should try to pare it down into functional steps, and when that’s not reasonable, the end patch should be a single commit. This is counter to having a Pull Request which may include “fix [unmerged] behavior”. Those commits should get squashed, and the final patch when landed should be rebased.

Remember: each commit should follow the commit message format and be stable (green build).

#### Rebase and Merge

The GitHub UI exposes a “Rebase and Merge” option, which, if your commits are already in following the commit guidelines, is a great way to bring your change into the codebase.

#### Squashing

If you are squashing your branch, it’s important to make sure you update the commit message. If you’re using GitHub’s UI it will by default create a new commit message which is a combination of all commits and **does not follow the commit guidelines**.

If you’re working locally, it often can be useful to `--amend` a commit, or utilize `rebase -i` to reorder, squash, and reword your commits.

### Commit Message Format

Each commit message consists of a **header**, a **body**, and an optional **footer**.

The header has a special format that includes a type, a scope and a subject:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier to read on GitHub as well as in various git tools.

The footer should contain a closing reference to an issue as well as a relevant Sentry issue if any.

For example:

```
feat(stream): Add resolve in next release action

Expose a new action labeled 'resolve in next release'. It uses the existing API
behavior and sends the 'inNextRelease=true' payload.

Fixes GH-1234
```

As well as:

```
fix(stream): Handle empty reference on resolve action

Gracefully handle when a user has not selected any issues and tries to complete
the resolve action in the UI.

Fixes GH-1234
Fixes SENTRY-1234
```

#### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

#### Type

Must be one of the following:

<table class="table"><tbody valign="top"><tr><th>build:</th><td>Changes that affect the build system or external dependencies (example scopes: webpack, python, npm)</td></tr><tr><th>ci:</th><td>Changes to our CI configuration files and scripts (example scopes: travis, zeus)</td></tr><tr><th>docs:</th><td>Documentation only changes</td></tr><tr><th>feat:</th><td>A new feature</td></tr><tr><th>fix:</th><td>A bug fix</td></tr><tr><th>perf:</th><td>A code change that improves performance</td></tr><tr><th>ref:</th><td>A code change that neither fixes a bug nor adds a feature (refactor)</td></tr><tr><th>style:</th><td>Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)</td></tr><tr><th>test:</th><td>Adding missing tests or correcting existing tests</td></tr><tr><th>meta:</th><td>Some meta information in the repo changes (example scopes: owner files, editor config etc.)</td></tr><tr><th>license:</th><td>Changes to licenses</td></tr></tbody></table>

#### Scope

The scope should be the name of the core component affected (as perceived by person reading changelog generated from commit messages). This means it should be the system impacted, not the literal file changed. For example, if the code primarily affects billing, you’d use the _billing_ scope, even if the changes are in utility files or db schema.

The following is the list of suggested scopes:

-   **api**
-   **billing**
-   **workflow**

#### Subject

The subject contains a succinct description of the change:

-   Use the imperative, present tense: “change” not “changed” nor “changes”
-   Capitalize the first letter
-   No dot (.) at the end

#### Body

Just as in the **subject**, use the imperative, present tense: “change” not “changed” nor “changes”. The body should include the motivation for the change and contrast this with previous behavior.

#### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

Breaking Changes should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

References

-   [https://chris.beams.io/posts/git-commit/](https://chris.beams.io/posts/git-commit/)
-   [https://conventionalcommits.org/](https://conventionalcommits.org/)
-   [https://github.com/angular/angular/blob/master/CONTRIBUTING.md](https://github.com/angular/angular/blob/master/CONTRIBUTING.md)
