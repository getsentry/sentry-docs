---
title: 'Remove an Issue'
sidebar_order: 7
---

DELETE /api/0/issues/_{issue_id}_/

: Removes an individual issue.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><strong>issue_id</strong> (<em>string</em>) – the ID of the issue to delete.</td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>DELETE</td></tr><tr><th>Path:</th><td>/api/0/issues/<em>{issue_id}</em>/</td></tr></tbody></table>

## Example

```http
DELETE /api/0/issues/5/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: sentry.io
```

```http
HTTP/1.1 202 ACCEPTED
Allow: GET, PUT, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 0
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block
```
