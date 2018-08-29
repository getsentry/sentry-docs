---
title: 'List a Project’s Service Hooks'
sidebar_order: 5
---

GET /api/0/projects/_{organization_slug}_/_{project_slug}_/hooks/

: Return a list of service hooks bound to a project.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the client keys belong to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project the client keys belong to.</li></ul></td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/hooks/</td></tr></tbody></table>

## Example

```http
GET /api/0/projects/the-interstellar-jurisdiction/pump-station/hooks/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: sentry.io
```

```http
HTTP/1.1 403 FORBIDDEN
Allow: GET, POST, HEAD, OPTIONS
Content-Language: en
Content-Length: 89
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

{
  "error_type": "unavailable_feature",
  "detail": [
    "You do not have that feature enabled"
  ]
}
```
