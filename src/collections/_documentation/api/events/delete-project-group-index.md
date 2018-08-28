---
title: 'Bulk Remove a List of Issues'
sidebar_order: 1
---

DELETE /api/0/projects/_{organization_slug}_/_{project_slug}_/issues/

: Permanently remove the given issues. The list of issues to modify is given through the _id_ query parameter. It is repeated for each issue that should be removed.

  Only queries by ‘id’ are accepted.

  If any ids are out of scope this operation will succeed without any data mutation.

  <table class="table"><tbody valign="top"><tr><th>Query Parameters:</th><td><strong>id</strong> (<em>int</em>) – a list of IDs of the issues to be removed. This parameter shall be repeated for each issue.</td></tr><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the issues belong to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project the issues belong to.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>DELETE</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/issues/</td></tr></tbody></table>

## Example

```http
DELETE /api/0/projects/the-interstellar-jurisdiction/amazing-plumbing/issues/?id=5&id=6 HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: app.getsentry.com
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
