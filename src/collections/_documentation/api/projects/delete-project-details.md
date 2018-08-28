---
title: 'Delete a Project'
sidebar_order: 2
---

DELETE /api/0/projects/_{organization_slug}_/_{project_slug}_/

: Schedules a project for deletion.

  Deletion happens asynchronously and therefor is not immediate. However once deletion has begun the state of a project changes and will be hidden from most public views.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the project belongs to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project to delete.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>DELETE</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/</td></tr></tbody></table>

## Example

```http
DELETE /api/0/projects/the-interstellar-jurisdiction/plain-proxy/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: app.getsentry.com
```

```http
HTTP/1.1 500 INTERNAL SERVER ERROR
Allow: GET, PUT, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 75
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

{
  "detail": "Internal Error",
  "errorId": "b13712a28fbc4fbc887cf79dee1af7f7"
}
```
