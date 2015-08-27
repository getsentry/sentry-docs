.. this file is auto generated. do not edit

List a Project's Aggregates
===========================

.. sentry:api-endpoint:: get-project-group-index

    Return a list of aggregates bound to a project.  All parameters are
    supplied as query string parameters.

    A default query of ``is:resolved`` is applied. To return results
    with other statuses send an new query value (i.e. ``?query=`` for all
    results).

    The ``statsPeriod`` parameter can be used to select the timeline
    stats which should be present. Possible values are: '' (disable),
    '24h', '14d'

    :qparam string statsPeriod: an optional stat period (can be one of
                                ``"24h"``, ``"14d"``, and ``""``).
    :qparam querystring query: an optional Sentry structured search
                               query.  If not provided an implied
                               ``"is:resolved"`` is assumed.)
    :pparam string organization_slug: the slug of the organization the
                                      groups belong to.
    :pparam string project_slug: the slug of the project the groups
                                 belong to.
    :auth: required

    :http-method: GET
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/groups/

Example
-------


.. sentry:api-scenario:: ListProjectAggregates
