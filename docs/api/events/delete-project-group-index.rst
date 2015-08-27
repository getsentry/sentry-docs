.. this file is auto generated. do not edit

Bulk Remove a List of Aggregates
================================

.. sentry:api-endpoint:: delete-project-group-index

    Permanently remove the given aggregates. The list of groups to
    modify is given through the `id` query parameter.  It is repeated
    for each group that should be removed.

    Only queries by 'id' are accepted.

    If any ids are out of scope this operation will succeed without
    any data mutation.

    :qparam int id: a list of IDs of the groups to be removed.  This
                    parameter shall be repeated for each group.
    :pparam string organization_slug: the slug of the organization the
                                      groups belong to.
    :pparam string project_slug: the slug of the project the groups
                                 belong to.
    :auth: required

    :http-method: DELETE
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/groups/

Example
-------


.. sentry:api-scenario:: BulkRemoveAggregates
