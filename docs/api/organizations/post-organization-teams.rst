.. this file is auto generated. do not edit

Create a new Team
=================

.. sentry:api-endpoint:: post-organization-teams

    Create a new team bound to an organization.  Only the name of the
    team is needed to create it, the slug can be auto generated.

    :pparam string organization_slug: the slug of the organization the
                                      team should be created for.
    :param string name: the name of the organization.
    :param string slug: the optional slug for this organization.  If
                        not provided it will be auto generated from the
                        name.
    :auth: required

    :http-method: POST
    :http-path: /api/0/organizations/{organization_slug}/teams/

Example
-------


.. sentry:api-scenario:: CreateNewTeam
