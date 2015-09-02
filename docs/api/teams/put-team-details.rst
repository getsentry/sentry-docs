.. this file is auto generated. do not edit

Update a Team
=============

.. sentry:api-endpoint:: put-team-details

    Update various attributes and configurable settings for the given
    team.

    :pparam string organization_slug: the slug of the organization the
                                      team belongs to.
    :pparam string team_slug: the slug of the team to get.
    :param string name: the new name for the team.
    :param string slug: a new slug for the team.  It has to be unique
                        and available.
    :auth: required

    :http-method: PUT
    :http-path: /api/0/teams/{organization_slug}/{team_slug}/

Example
-------


.. sentry:api-scenario:: UpdateTeam
