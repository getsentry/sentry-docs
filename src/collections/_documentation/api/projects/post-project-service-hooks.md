---
title: 'Register a new Service Hook'
sidebar_order: 10
---

POST /api/0/projects/_{organization_slug}_/_{project_slug}_/hooks/

: Register a new service hook on a project.

  Events include:

  -   event.alert: An alert is generated for an event (via rules).
  -   event.created: A new event has been processed.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the client keys belong to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project the client keys belong to.</li></ul></td></tr><tr><th>Parameters:</th><td><ul><li><strong>url</strong> (<em>string</em>) – the url for the webhook</li><li><strong>events</strong> (<em>array[string]</em>) – the events to subscribe to</li></ul></td></tr><tr><th>Method:</th><td>POST</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/hooks/</td></tr></tbody></table>

## Example

```http
POST /api/0/projects/the-interstellar-jurisdiction/pump-station/hooks/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: sentry.io
Content-Type: application/json

{
  "url": "https://example.com/sentry-hook",
  "events": [
    "event.alert",
    "event.created"
  ]
}
```

```http
HTTP/1.1 401 UNAUTHORIZED
Allow: GET, POST, HEAD, OPTIONS
Content-Language: en
Content-Length: 0
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block
```
