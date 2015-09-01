.. this file is auto generated. do not edit

List a Tag's Values
===================

.. sentry:api-endpoint:: get-project-tag-key-values

    Return a list of values associated with this key.  The `query`
    parameter can be used to to perform a "starts with" match on
    values.

    :pparam string organization_slug: the slug of the organization.
    :pparam string project_slug: the slug of the project.
    :pparam string key: the tag key to look up.
    :auth: required

    :http-method: GET
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/tags/{key}/values/
