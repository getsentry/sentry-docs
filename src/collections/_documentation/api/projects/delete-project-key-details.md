---
title: 'Delete a Client Key'
sidebar_order: 1
---

DELETE /api/0/projects/_{organization_slug}_/_{project_slug}_/keys/_{key_id}_/

: Delete a client key.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the client keys belong to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project the client keys belong to.</li><li><strong>key_id</strong> (<em>string</em>) – the ID of the key to delete.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>DELETE</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/keys/<em>{key_id}</em>/</td></tr></tbody></table>

## Example

```http
DELETE /api/0/projects/the-interstellar-jurisdiction/pump-station/keys/bb6cf36bf2a94bd9b7c57bee5ccb0993/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: sentry.io
```

```http
HTTP/1.1 204 NO CONTENT
Allow: GET, PUT, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 0
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block
```
