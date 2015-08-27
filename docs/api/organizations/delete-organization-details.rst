.. this file is auto generated. do not edit

Delete an Organization
======================

.. sentry:api-endpoint:: delete-organization-details

    Schedules an organization for deletion.

    **Note:** Deletion happens asynchronously and therefor is not
    immediate.  However once deletion has begun the state of a project
    changes and will be hidden from most public views.

    :http-method: DELETE
    :http-path: /api/0/organizations/{organization_slug}/
