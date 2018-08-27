---
title: 'Retrieve a Team'
sidebar_order: 5
---

GET /api/0/teams/_{organization_slug}_/_{team_slug}_/

: Return details on an individual team.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the team belongs to.</li><li><strong>team_slug</strong> (<em>string</em>) – the slug of the team to get.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/teams/<em>{organization_slug}</em>/<em>{team_slug}</em>/</td></tr></tbody></table>

## Example

```http
GET /api/0/teams/the-interstellar-jurisdiction/powerful-abolitionist/ HTTP/1.1
Authorization: Basic {base64-encoded-key-here}
Host: app.getsentry.com
```

```http
HTTP/1.1 200 OK
Allow: GET, PUT, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 550
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

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
  "id": "2"
}
```
