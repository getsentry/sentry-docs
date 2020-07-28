Request data is attached to all events: **HTTP method, URL, headers, form data, JSON payloads**. Sentry excludes raw bodies and multipart file uploads. Sentry also excludes personally identifiable information (such as user ids, usernames, cookies, authorization headers, IP addresses) unless you set ``send_default_pii`` to ``True``.

Each request has a separate scope. Setting a tag during web app initialization will set a global tag, while setting a tag within a view/request handler will attach the tag only to events sent as part of handling that individual request.
