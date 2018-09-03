---
title: 'Update a File'
sidebar_order: 16
---

PUT /api/0/projects/_{organization_slug}_/_{project_slug}_/releases/_{version}_/files/_{file_id}_/

: Update metadata of an existing file. Currently only the name of the file can be changed.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project to update the file of.</li><li><strong>version</strong> (<em>string</em>) – the version identifier of the release.</li><li><strong>file_id</strong> (<em>string</em>) – the ID of the file to update.</li></ul></td></tr><tr><th>Parameters:</th><td><strong>name</strong> (<em>string</em>) – the new name of the file.</td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>PUT</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/releases/<em>{version}</em>/files/<em>{file_id}</em>/</td></tr></tbody></table>

## Example

```http
PUT /api/0/projects/the-interstellar-jurisdiction/pump-station/releases/e48e7b5b90327ea1a4d1a4360c735eee7b536f82/files/3/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: sentry.io
Content-Type: application/json

{
  "name": "/demo/goodbye.txt"
}
```

```http
HTTP/1.1 200 OK
Allow: GET, PUT, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 220
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

{
  "sha1": "94d6b21e962a9fc65889617ec1f17a1e2fe11b65",
  "dist": null,
  "name": "/demo/goodbye.txt",
  "dateCreated": "2018-08-22T18:24:15.829Z",
  "headers": {
    "Content-Type": "text/plain; encoding=utf-8"
  },
  "id": "3",
  "size": 15
}
```
