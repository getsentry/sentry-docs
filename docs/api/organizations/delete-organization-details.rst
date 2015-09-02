.. this file is auto generated. do not edit

Delete an Organization
======================

.. sentry:api-endpoint:: delete-organization-details

    Schedules an organization for deletion.  This API endpoint cannot
    be invoked without a user context for security reasons.  This means
    that at present an organization can only be deleted from the
    Sentry UI.

    Deletion happens asynchronously and therefor is not immediate.
    However once deletion has begun the state of a project changes and
    will be hidden from most public views.

    :pparam string organization_slug: the slug of the organization the
                                      team should be created for.
    :auth: required, user-context-needed

    :http-method: DELETE
    :http-path: /api/0/organizations/{organization_slug}/

    .. note::
       This endpoint needs a user context which is currently not possible through API keys. This endpoint is presently only useful for Sentry itself.
