Search
======

Search in Sentry currently exists in a limited fashion. You can perform
basic CONTAINS matches on the title of an issue or exact matches on tags.

Queries are constructed using a ``token:value`` pattern::

    is:resolved user.username:"Jane Doe" server:web-8 example error

In the above there are four tokens:

* ``is:resolved``
* ``user.username:Jane Doe``
* ``server:web-8``
* ``example error``

The first two are standard search tokens, both using reserved keywords. The second
is pointing to a custom tag sent by the client. The third is passed as part of the
issue search query (which uses a CONTAINS match).

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
