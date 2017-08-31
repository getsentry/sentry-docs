Code Review
===========

Code review is mandatory at Sentry. This adds overhead to each change, but ensures
that simple, often overlooked problems are more easily avoided.

Code review is managed via GitHub's Pull Requests (see below for rationale).
Templates may exist on repositories, if they do not, consider
`creating one <https://help.github.com/articles/creating-a-pull-request-template-for-your-repository/>`_.

When creating a pull request, reference any tickets or Sentry issues which are
being addressed. Additionally **@mention** an appropriate team (or teams) for review.

GitHub Teams
------------

The following teams are defined in GitHub and should be used when creating Pull Requests:

- `@getsentry/api <https://github.com/orgs/getsentry/teams/api>`_
- `@getsentry/ui <https://github.com/orgs/getsentry/teams/ui>`_
- `@getsentry/infrastructure <https://github.com/orgs/getsentry/teams/infrastructure>`_
- `@getsentry/ops <https://github.com/orgs/getsentry/teams/ops>`_
- `@getsentry/team <https://github.com/orgs/getsentry/teams/team>`_ -- the entire product team, use sparingly

Additionally, language specific teams exist, primarily for SDKs:

- `@getsentry/cocoa <https://github.com/orgs/getsentry/teams/cocoa>`_
- `@getsentry/java <https://github.com/orgs/getsentry/teams/java>`_
- `@getsentry/javascript <https://github.com/orgs/getsentry/teams/javascript>`_
- `@getsentry/php <https://github.com/orgs/getsentry/teams/php>`_
- `@getsentry/python <https://github.com/orgs/getsentry/teams/python>`_

Why Pull Requests
-----------------

Because Sentry is an open source project maintained via GitHub we want to ensure that
the barrier to entry for external contributions is minimal. By using GitHub features
when possible, we make it easy for developers familiar with other projects on GitHub.
While GitHub's tools `aren't always the best <http://cra.mr/2014/05/03/on-pull-requests>`_,
they're usable enough that we'll make do.
