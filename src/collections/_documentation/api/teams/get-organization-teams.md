---
title: 'List an Organization’s Teams'
sidebar_order: 4
---

GET /api/0/organizations/_{organization_slug}_/teams/

: Return a list of teams bound to a organization.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization for which the teams should be listed.</td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/teams/</td></tr></tbody></table>

## Example

```http
GET /api/0/organizations/the-interstellar-jurisdiction/teams/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: app.getsentry.com
```

```http
HTTP/1.1 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Language: en
Content-Length: 1724
Content-Type: application/json
Link: <https://sentry.io/api/0/organizations/the-interstellar-jurisdiction/teams/?&cursor=100:-1:1>; rel="previous"; results="false"; cursor="100:-1:1", <https://sentry.io/api/0/organizations/the-interstellar-jurisdiction/teams/?&cursor=100:1:0>; rel="next"; results="false"; cursor="100:1:0"
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

[
  {
    "slug": "ancient-gabelers",
    "name": "Ancient Gabelers",
    "hasAccess": true,
    "isPending": false,
    "dateCreated": "2018-08-22T18:23:57.105Z",
    "avatar": {
      "avatarUuid": null,
      "avatarType": "letter_avatar"
    },
    "isMember": false,
    "id": "3",
    "projects": []
  },
  {
    "slug": "powerful-abolitionist",
    "name": "Powerful Abolitionist",
    "hasAccess": true,
    "isPending": false,
    "dateCreated": "2018-08-22T18:23:44.409Z",
    "avatar": {
      "avatarUuid": null,
      "avatarType": "letter_avatar"
    },
    "isMember": false,
    "id": "2",
    "projects": [
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
        "isBookmarked": false,
        "id": "2",
        "name": "Pump Station"
      },
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
        "isBookmarked": false,
        "id": "4",
        "name": "The Spoiled Yoghurt"
      }
    ]
  }
]
```
