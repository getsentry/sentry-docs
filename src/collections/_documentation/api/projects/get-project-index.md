---
title: 'List your Projects'
sidebar_order: 9
---

GET /api/0/projects/

: Return a list of projects available to the authenticated session.

  <table class="table"><tbody valign="top"><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/projects/</td></tr></tbody></table>

## Example

```http
GET /api/0/projects/ HTTP/1.1
Authorization: Basic {base64-encoded-key-here}
Host: app.getsentry.com
```

```http
HTTP/1.1 200 OK
Allow: GET, HEAD, OPTIONS
Content-Language: en
Content-Length: 2145
Content-Type: application/json
Link: <https://sentry.io/api/0/projects/?&cursor=1534962237044:0:1>; rel="previous"; results="false"; cursor="1534962237044:0:1", <https://sentry.io/api/0/projects/?&cursor=1534962224414:1:0>; rel="next"; results="false"; cursor="1534962224414:1:0"
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

[
  {
    "status": "active",
    "slug": "the-spoiled-yoghurt",
    "features": [
      "data-forwarding",
      "rate-limits"
    ],
    "hasAccess": true,
    "color": "#bf6e3f",
    "isInternal": false,
    "isPublic": false,
    "dateCreated": "2018-08-22T18:23:57.044Z",
    "platform": null,
    "firstEvent": null,
    "avatar": {
      "avatarUuid": null,
      "avatarType": "letter_avatar"
    },
    "isMember": false,
    "organization": {
      "require2FA": false,
      "status": {
        "id": "active",
        "name": "active"
      },
      "slug": "the-interstellar-jurisdiction",
      "name": "The Interstellar Jurisdiction",
      "dateCreated": "2018-08-22T18:23:44.398Z",
      "avatar": {
        "avatarUuid": null,
        "avatarType": "letter_avatar"
      },
      "id": "2",
      "isEarlyAdopter": false
    },
    "isBookmarked": false,
    "id": "4",
    "name": "The Spoiled Yoghurt"
  },
  {
    "status": "active",
    "slug": "prime-mover",
    "features": [
      "data-forwarding",
      "rate-limits",
      "releases"
    ],
    "hasAccess": true,
    "color": "#bf5b3f",
    "isInternal": false,
    "isPublic": false,
    "dateCreated": "2018-08-22T18:23:48.009Z",
    "platform": null,
    "firstEvent": null,
    "avatar": {
      "avatarUuid": null,
      "avatarType": "letter_avatar"
    },
    "isMember": false,
    "organization": {
      "require2FA": false,
      "status": {
        "id": "active",
        "name": "active"
      },
      "slug": "the-interstellar-jurisdiction",
      "name": "The Interstellar Jurisdiction",
      "dateCreated": "2018-08-22T18:23:44.398Z",
      "avatar": {
        "avatarUuid": null,
        "avatarType": "letter_avatar"
      },
      "id": "2",
      "isEarlyAdopter": false
    },
    "isBookmarked": false,
    "id": "3",
    "name": "Prime Mover"
  },
  {
    "status": "active",
    "slug": "pump-station",
    "features": [
      "data-forwarding",
      "rate-limits",
      "releases"
    ],
    "hasAccess": true,
    "color": "#3fbf7f",
    "isInternal": false,
    "isPublic": false,
    "dateCreated": "2018-08-22T18:23:44.413Z",
    "platform": null,
    "firstEvent": null,
    "avatar": {
      "avatarUuid": null,
      "avatarType": "letter_avatar"
    },
    "isMember": false,
    "organization": {
      "require2FA": false,
      "status": {
        "id": "active",
        "name": "active"
      },
      "slug": "the-interstellar-jurisdiction",
      "name": "The Interstellar Jurisdiction",
      "dateCreated": "2018-08-22T18:23:44.398Z",
      "avatar": {
        "avatarUuid": null,
        "avatarType": "letter_avatar"
      },
      "id": "2",
      "isEarlyAdopter": false
    },
    "isBookmarked": false,
    "id": "2",
    "name": "Pump Station"
  }
]
```
