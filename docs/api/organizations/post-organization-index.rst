.. this file is auto generated. do not edit

Create a New Organization
=========================

.. sentry:api-endpoint:: post-organization-index

    Create a new organization owned by the request's user.  To create
    an organization only the name is required.

    :param string name: the human readable name for the new organization.
    :param string slug: the unique URL slug for this organization.  If
                        this is not provided a slug is automatically
                        generated based on the name.
    :auth: required, user-context-needed

    :http-method: POST
    :http-path: /api/0/organizations/

    .. note::
       This endpoint needs a user context which is currently not possible through API keys. This endpoint is presently only useful for Sentry itself.
