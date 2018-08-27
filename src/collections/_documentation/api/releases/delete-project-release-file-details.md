---
title: 'Delete a File'
sidebar_order: 2
---

DELETE /api/0/projects/_{organization_slug}_/_{project_slug}_/releases/_{version}_/files/_{file_id}_/

: Permanently remove a file from a release.

  This will also remove the physical file from storage.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project to delete the file of.</li><li><strong>version</strong> (<em>string</em>) – the version identifier of the release.</li><li><strong>file_id</strong> (<em>string</em>) – the ID of the file to delete.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>DELETE</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/releases/<em>{version}</em>/files/<em>{file_id}</em>/</td></tr></tbody></table>

## Example

```http
DELETE /api/0/projects/the-interstellar-jurisdiction/pump-station/releases/e48e7b5b90327ea1a4d1a4360c735eee7b536f82/files/1/ HTTP/1.1
Authorization: Basic {base64-encoded-key-here}
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
