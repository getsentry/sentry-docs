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

The first two are standard search tokens, both using reserved keywords. The third
is pointing to a custom tag sent by the SDK. The fourth is passed as part of the
issue search query (which uses a CONTAINS match).

The following tokens are reserved and known to Sentry:

.. describe:: is

    Filter on the status of an issue.

    Values are ``resolved``, ``unresolved``, ``muted``, ``assigned``, and ``unassigned``.

.. describe:: assigned

    Filter on the user which the issue is assigned to.

    Values can be your user ID (your email address) or ``me`` for yourself.

.. describe:: bookmarks

    Filter on the user which the issue is bookmarked by.

    Values can be your user ID (your email address) or ``me`` for yourself.

.. describe:: has

    Restrict results to issues which have *any* value for a tag.

    ``has:user``

.. describe:: release

    Restrict results to issues seen within the given release.

    Exact match on the version of a release.

.. describe:: first-release

    Restrict results to issues first seen within the given release.

    Exact match on the version of a release.

.. describe:: user.id
.. describe:: user.email
.. describe:: user.username
.. describe:: user.ip

    Restrict results to issues affecting the given user.

.. describe:: age

    Restrict results to issues created since ``age``. The syntax is similar to the unix ``find`` command:

    Issues new in the last 24 hours:

    ``age:-24h``

    Issues older than 12 hours:

    ``age:+12h``

    Issues created between 12 and 24 hours ago:

    ``age:+12h age:-24h``

    Supported suffixes:

    ``m -> minutes``
    ``h -> hours``
    ``d -> days``
    ``w -> weeks``

.. describe:: event.timestamp

    Restrict results to issues in which an event occurred at the given timestamp. This filter can
    be passed twice to provide a range.

    Events occurred on January 2nd 2016:

    ``event.timestamp:2016-01-02``

    Events between 01:00 and 02:00 (UTC):

    ``event.timestamp:>=2016-01-02T01:00:00 event.timestamp:<2016-01-02T02:00:00``

    The following comparative operators are available:

    - greater than (``>``)
    - greater than or equal (``>=``)
    - less than (``<``)
    - less than or equal (``<=``)

.. describe:: timesSeen

    Restrict results to issues that have been seen exactly, at least, or at
    most some number of times.

    Exact match:

    ``timesSeen:10``

    Upper or lower bounds:

    * ``timesSeen:>10``
    * ``timesSeen:>=10``
    * ``timesSeen:<10``
    * ``timesSeen:<=10``

.. describe:: lastSeen

   Restrict results that were last seen since or until a given point in time.
   Usage is similar to the ``age`` token (see above).

   Issues last seen 30 days ago or more:

   ``lastSeen:+30d``

   Issues last seen within the last two days:

   ``lastSeen:-2d``

Additionally you can use any tag you've specified as a token.
