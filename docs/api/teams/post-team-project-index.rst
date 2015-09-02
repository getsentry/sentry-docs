.. this file is auto generated. do not edit

Create a New Project
====================

.. sentry:api-endpoint:: post-team-project-index

    Create a new project bound to a team.

    :pparam string organization_slug: the slug of the organization the
                                      team belongs to.
    :pparam string team_slug: the slug of the team to create a new project
                              for.
    :param string name: the name for the new project.
    :param string slug: optionally a slug for the new project.  If it's
                        not provided a slug is generated from the name.
    :auth: required

    :http-method: POST
    :http-path: /api/0/teams/{organization_slug}/{team_slug}/projects/

Example
-------


.. sentry:api-scenario:: CreateNewProject
