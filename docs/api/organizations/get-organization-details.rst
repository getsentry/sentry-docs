.. this file is auto generated. do not edit

Retrieve an Organization
========================

.. sentry:api-endpoint:: get-organization-details

    Return details on an individual organization including various details
    such as membership access, features, and teams.

    :pparam string organization_slug: the slug of the organization the
                                      team should be created for.
    :auth: required

    :http-method: GET
    :http-path: /api/0/organizations/{organization_slug}/

Example
-------


.. sentry:api-scenario:: RetrieveOrganization
