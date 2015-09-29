Search
======

Search in Sentry currently exists in a limited fashion. You can perform
basic CONTAINS matches on the title of an issue or exact matches on tags.

Queries are constructed using a ``token:value`` pattern::

    is:resolved user.email:foo@example.com example error

If the value contains spaces, it must be enclosed within quotes::

    user.username:"Jane Doe"

The following tokens are reserved and known to Sentry:

.. describe:: is

    Filter on the status of an issue.

    Values are ``resolved``, ``unresolved``, and ``muted``

.. describe:: assigned

    Filter on the user which the issue is assigned to.

    Values can be your user ID (your email address) or ``me`` for yourself.

.. describe:: release

    Restrict results to issues seen within the given release.

    Exact match on the version of a release.

.. describe:: user.id
.. describe:: user.email
.. describe:: user.username
.. describe:: user.ip

    Restrict results to issues affecting the given user.

Additionally you can use any tag you've specified as a token.
