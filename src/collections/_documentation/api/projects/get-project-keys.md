---
title: 'List a Project’s Client Keys'
sidebar_order: 3
---

GET /api/0/projects/_{organization_slug}_/_{project_slug}_/keys/

: Return a list of client keys bound to a project.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the client keys belong to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project the client keys belong to.</li></ul></td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/keys/</td></tr></tbody></table>

## Example

```http
GET /api/0/projects/the-interstellar-jurisdiction/pump-station/keys/ HTTP/1.1
Authorization: Basic {base64-encoded-key-here}
Host: app.getsentry.com
```

```http
HTTP/1.1 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Language: en
Content-Length: 813
Content-Type: application/json
Link: <https://sentry.io/api/0/projects/the-interstellar-jurisdiction/pump-station/keys/?&cursor=4:0:1>; rel="previous"; results="false"; cursor="4:0:1", <https://sentry.io/api/0/projects/the-interstellar-jurisdiction/pump-station/keys/?&cursor=4:100:0>; rel="next"; results="false"; cursor="4:100:0"
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

[
  {
    "name": "Fabulous Key",
    "projectId": 2,
    "secret": "023f204141eb45f1bd95795658106896",
    "label": "Fabulous Key",
    "dsn": {
      "cdn": "https://sentry.io/js-sdk-loader/1d98e4fa473541f29018fb43a2974cd2.min.js",
      "minidump": "https://sentry.io/api/2/minidump/?sentry_key=1d98e4fa473541f29018fb43a2974cd2",
      "public": "https://1d98e4fa473541f29018fb43a2974cd2@sentry.io/2",
      "secret": "https://1d98e4fa473541f29018fb43a2974cd2:023f204141eb45f1bd95795658106896@sentry.io/2",
      "security": "https://sentry.io/api/2/security/?sentry_key=1d98e4fa473541f29018fb43a2974cd2",
      "csp": "https://sentry.io/api/2/csp-report/?sentry_key=1d98e4fa473541f29018fb43a2974cd2"
    },
    "public": "1d98e4fa473541f29018fb43a2974cd2",
    "rateLimit": null,
    "dateCreated": "2018-08-22T18:23:56.910Z",
    "id": "1d98e4fa473541f29018fb43a2974cd2",
    "isActive": true
  }
]
```
