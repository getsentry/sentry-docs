.. this file is auto generated. do not edit

Retrieve an Event for a Project
===============================

.. sentry:api-endpoint:: get-project-event-details

    Return details on an individual event.

    :pparam string organization_slug: the slug of the organization the
                                      event belongs to.
    :pparam string project_slug: the slug of the project the event
                                 belongs to.
    :pparam string event_id: the hexadecimal ID of the event to
                             retrieve (as reported by the raven client).
    :auth: required

    :http-method: GET
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/events/{event_id}/

Example
-------


.. sentry:api-scenario:: RetrieveEventForProject
