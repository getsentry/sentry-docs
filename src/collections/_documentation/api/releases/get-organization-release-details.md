---
title: 'Retrieve an Organization’s Release'
sidebar_order: 14
---

GET /api/0/organizations/_{organization_slug}_/releases/_{version}_/

: Return details on an individual release.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>version</strong> (<em>string</em>) – the version identifier of the release.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/releases/<em>{version}</em>/</td></tr></tbody></table>

## Example

```http
GET /api/0/organizations/the-interstellar-jurisdiction/releases/e48e7b5b90327ea1a4d1a4360c735eee7b536f82/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: sentry.io
```

```http
HTTP/1.1 200 OK
Allow: GET, PUT, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 454
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

{
  "dateReleased": null,
  "newGroups": 0,
  "url": null,
  "ref": null,
  "lastDeploy": null,
  "deployCount": 0,
  "dateCreated": "2018-08-22T18:23:44.439Z",
  "lastEvent": "2018-08-22T18:23:44.590Z",
  "version": "e48e7b5b90327ea1a4d1a4360c735eee7b536f82",
  "firstEvent": "2018-08-22T18:23:44.590Z",
  "lastCommit": null,
  "shortVersion": "e48e7b5",
  "authors": [],
  "owner": null,
  "commitCount": 0,
  "data": {},
  "projects": [
    {
      "name": "Pump Station",
      "slug": "pump-station"
    }
  ]
}
```
