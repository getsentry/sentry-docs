.. this file is auto generated. do not edit

Update a Project
================

.. sentry:api-endpoint:: put-project-details

    Update various attributes and configurable settings for the given
    project.  Only supplied values are updated.

    :pparam string organization_slug: the slug of the organization the
                                      project belongs to.
    :pparam string project_slug: the slug of the project to delete.
    :param string name: the new name for the project.
    :param string slug: the new slug for the project.
    :param object options: optional options to override in the
                           project settings.
    :auth: required

    :http-method: PUT
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/

Example
-------


.. sentry:api-scenario:: UpdateProject
