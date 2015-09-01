.. this file is auto generated. do not edit

Delete a Project
================

.. sentry:api-endpoint:: delete-project-details

    Schedules a project for deletion.

    Deletion happens asynchronously and therefor is not immediate.
    However once deletion has begun the state of a project changes and
    will be hidden from most public views.

    :pparam string organization_slug: the slug of the organization the
                                      project belongs to.
    :pparam string project_slug: the slug of the project to delete.
    :auth: required

    :http-method: DELETE
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/

Example
-------


.. sentry:api-scenario:: DeleteProject
