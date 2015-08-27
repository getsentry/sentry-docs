.. this file is auto generated. do not edit

Delete a Team
=============

.. sentry:api-endpoint:: delete-team-details

    Schedules a team for deletion.

    **Note:** Deletion happens asynchronously and therefor is not
    immediate.  However once deletion has begun the state of a project
    changes and will be hidden from most public views.

    :http-method: DELETE
    :http-path: /api/0/teams/{organization_slug}/{team_slug}/
