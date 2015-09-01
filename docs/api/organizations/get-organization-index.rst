.. this file is auto generated. do not edit

List your Organizations
=======================

.. sentry:api-endpoint:: get-organization-index

    Return a list of organizations available to the authenticated
    session.  This is particularly useful for requests with an
    user bound context.  For API key based requests this will
    only return the organization that belongs to the key.

    :auth: required

    :http-method: GET
    :http-path: /api/0/organizations/

Example
-------


.. sentry:api-scenario:: ListYourOrganizations
