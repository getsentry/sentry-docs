---
title: 'List a Release’s Files'
sidebar_order: 7
---

GET /api/0/projects/_{organization_slug}_/_{project_slug}_/releases/_{version}_/files/

: Retrieve a list of files for a given release.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project to list the release files of.</li><li><strong>version</strong> (<em>string</em>) – the version identifier of the release.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/releases/<em>{version}</em>/files/</td></tr></tbody></table>

## Example

```http
GET /api/0/projects/the-interstellar-jurisdiction/pump-station/releases/e48e7b5b90327ea1a4d1a4360c735eee7b536f82/files/ HTTP/1.1
Authorization: Basic {base64-encoded-key-here}
Host: app.getsentry.com
```

```http
HTTP/1.1 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Language: en
Content-Length: 230
Content-Type: application/json
Link: <https://sentry.io/api/0/projects/the-interstellar-jurisdiction/pump-station/releases/e48e7b5b90327ea1a4d1a4360c735eee7b536f82/files/?&cursor=100:-1:1>; rel="previous"; results="false"; cursor="100:-1:1", <https://sentry.io/api/0/projects/the-interstellar-jurisdiction/pump-station/releases/e48e7b5b90327ea1a4d1a4360c735eee7b536f82/files/?&cursor=100:1:0>; rel="next"; results="false"; cursor="100:1:0"
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

[
  {
    "sha1": "2ef7bde608ce5404e97d5f042f95f89f1c232871",
    "dist": null,
    "name": "/demo/message-for-you.txt",
    "dateCreated": "2018-08-22T18:24:11.104Z",
    "headers": {
      "Content-Type": "text/plain; encoding=utf-8"
    },
    "id": "1",
    "size": 12
  }
]
```
