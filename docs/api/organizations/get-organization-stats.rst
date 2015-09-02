.. this file is auto generated. do not edit

Retrieve Event Counts for an Organization
=========================================

.. sentry:api-endpoint:: get-organization-stats

    .. caution::
       This endpoint may change in the future without notice.

    Return a set of points representing a normalized timestamp and the
    number of events seen in the period.

    :pparam string organization_slug: the slug of the organization for
                                      which the stats should be
                                      retrieved.
    :qparam string stat: the name of the stat to query (``"received"``,
                         ``"rejected"``)
    :qparam timestamp since: a timestamp to set the start of the query
                             in seconds since UNIX epoch.
    :qparam timestamp until: a timestamp to set the end of the query
                             in seconds since UNIX epoch.
    :qparam string resolution: an explicit resolution to search
                               for (eg: ``10s``).  This should not be
                               used unless you are familiar with Sentry's
                               internals as it's restricted to pre-defined
                               values.
    :auth: required

    :http-method: GET
    :http-path: /api/0/organizations/{organization_slug}/stats/

Example
-------


.. sentry:api-scenario:: RetrieveEventCountsOrganization
