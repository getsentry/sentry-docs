---
title: 'Resolve a Short ID'
sidebar_order: 7
---

GET /api/0/organizations/_{organization_slug}_/shortids/_{short_id}_/

: This resolves a short ID to the project slug and internal issue ID.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the short ID should be looked up in.</li><li><strong>short_id</strong> (<em>string</em>) – the short ID to look up.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/shortids/<em>{short_id}</em>/</td></tr></tbody></table>

## Example

```http
GET /api/0/organizations/the-interstellar-jurisdiction/shortids/PUMP-STATION-1/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: sentry.io
```

```http
HTTP/1.1 200 OK
Allow: GET, HEAD, OPTIONS
Content-Language: en
Content-Length: 811
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

{
  "organizationSlug": "the-interstellar-jurisdiction",
  "projectSlug": "pump-station",
  "shortId": "PUMP-STATION-1",
  "group": {
    "lastSeen": "2018-08-22T18:23:44Z",
    "id": "1",
    "userCount": 0,
    "culprit": "raven.scripts.runner in main",
    "title": "This is an example Python exception",
    "numComments": 0,
    "assignedTo": null,
    "logger": null,
    "type": "default",
    "annotations": [],
    "metadata": {
      "title": "This is an example Python exception"
    },
    "status": "unresolved",
    "subscriptionDetails": null,
    "isPublic": false,
    "permalink": null,
    "shortId": "PUMP-STATION-1",
    "shareId": null,
    "firstSeen": "2018-08-22T18:23:44Z",
    "count": "1",
    "hasSeen": false,
    "level": "error",
    "isSubscribed": false,
    "isBookmarked": false,
    "project": {
      "slug": "pump-station",
      "id": "2",
      "name": "Pump Station"
    },
    "statusDetails": {}
  },
  "groupId": "1"
}
```
