.. this file is auto generated. do not edit

Update an Organization
======================

.. sentry:api-endpoint:: put-organization-details

    Update various attributes and configurable settings for the given
    organization.

    :pparam string organization_slug: the slug of the organization the
                                      team should be created for.
    :param string name: an optional new name for the organization.
    :param string slug: an optional new slug for the organization.  Needs
                        to be available and unique.
    :auth: required

    :http-method: PUT
    :http-path: /api/0/organizations/{organization_slug}/

Example
-------


.. sentry:api-scenario:: UpdateOrganization
