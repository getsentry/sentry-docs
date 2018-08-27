---
title: 'Retrieve a Project Release’s File'
sidebar_order: 12
---

GET /api/0/projects/_{organization_slug}_/_{project_slug}_/releases/_{version}_/files/_{file_id}_/

: Return details on an individual file within a release. This does not actually return the contents of the file, just the associated metadata.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project to retrieve the file of.</li><li><strong>version</strong> (<em>string</em>) – the version identifier of the release.</li><li><strong>file_id</strong> (<em>string</em>) – the ID of the file to retrieve.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/releases/<em>{version}</em>/files/<em>{file_id}</em>/</td></tr></tbody></table>

## Example

```http
GET /api/0/projects/the-interstellar-jurisdiction/pump-station/releases/e48e7b5b90327ea1a4d1a4360c735eee7b536f82/files/2/ HTTP/1.1
Authorization: Basic {base64-encoded-key-here}
Host: app.getsentry.com
```

```http
HTTP/1.1 200 OK
Allow: GET, PUT, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 219
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

{
  "sha1": "2ef7bde608ce5404e97d5f042f95f89f1c232871",
  "dist": null,
  "name": "/demo/readme.txt",
  "dateCreated": "2018-08-22T18:24:11.424Z",
  "headers": {
    "Content-Type": "text/plain; encoding=utf-8"
  },
  "id": "2",
  "size": 12
}
```
