---
title: 'List an Organization’s Releases'
sidebar_order: 10
---

GET /api/0/organizations/_{organization_slug}_/releases/

: Return a list of releases for a given organization.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><strong>organization_slug</strong> (<em>string</em>) – the organization short name</td></tr><tr><th>Query Parameters:</th><td><strong>query</strong> (<em>string</em>) – this parameter can be used to create a “starts with” filter for the version.</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/releases/</td></tr></tbody></table>

## Example

```http
GET /api/0/organizations/the-interstellar-jurisdiction/releases/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: app.getsentry.com
```

```http
HTTP/1.1 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Language: en
Content-Length: 1325
Content-Type: application/json
Link: <https://sentry.io/api/0/organizations/the-interstellar-jurisdiction/releases/?&cursor=100:-1:1>; rel="previous"; results="false"; cursor="100:-1:1", <https://sentry.io/api/0/organizations/the-interstellar-jurisdiction/releases/?&cursor=100:1:0>; rel="next"; results="false"; cursor="100:1:0"
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

[
  {
    "dateReleased": null,
    "newGroups": 0,
    "url": null,
    "ref": "6ba09a7c53235ee8a8fa5ee4c1ca8ca886e7fdbb",
    "lastDeploy": null,
    "deployCount": 0,
    "dateCreated": "2018-08-22T18:23:57.009Z",
    "lastEvent": null,
    "version": "2.0rc2",
    "firstEvent": null,
    "lastCommit": null,
    "shortVersion": "2.0rc2",
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
  },
  {
    "dateReleased": null,
    "newGroups": 0,
    "url": null,
    "ref": null,
    "lastDeploy": null,
    "deployCount": 0,
    "dateCreated": "2018-08-22T18:23:48.032Z",
    "lastEvent": "2018-08-22T18:23:48.112Z",
    "version": "d4a63db21e64373388c271828b0f368c8157fdd8",
    "firstEvent": "2018-08-22T18:23:48.112Z",
    "lastCommit": null,
    "shortVersion": "d4a63db",
    "authors": [],
    "owner": null,
    "commitCount": 0,
    "data": {},
    "projects": [
      {
        "name": "Prime Mover",
        "slug": "prime-mover"
      }
    ]
  },
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
]
```
