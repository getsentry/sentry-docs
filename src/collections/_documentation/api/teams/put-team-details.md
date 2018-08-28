---
title: 'Update a Team'
sidebar_order: 7
---

PUT /api/0/teams/_{organization_slug}_/_{team_slug}_/

: Update various attributes and configurable settings for the given team.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the team belongs to.</li><li><strong>team_slug</strong> (<em>string</em>) – the slug of the team to get.</li></ul></td></tr><tr><th>Parameters:</th><td><ul><li><strong>name</strong> (<em>string</em>) – the new name for the team.</li><li><strong>slug</strong> (<em>string</em>) – a new slug for the team. It has to be unique and available.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>PUT</td></tr><tr><th>Path:</th><td>/api/0/teams/<em>{organization_slug}</em>/<em>{team_slug}</em>/</td></tr></tbody></table>

## Example

```http
PUT /api/0/teams/the-interstellar-jurisdiction/the-obese-philosophers/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: app.getsentry.com
Content-Type: application/json

{
  "name": "The Inflated Philosophers"
}
```

```http
HTTP/1.1 200 OK
Allow: GET, PUT, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 246
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

{
  "slug": "the-obese-philosophers",
  "name": "The Inflated Philosophers",
  "hasAccess": true,
  "isPending": false,
  "dateCreated": "2018-08-22T18:24:15.867Z",
  "avatar": {
    "avatarUuid": null,
    "avatarType": "letter_avatar"
  },
  "isMember": false,
  "id": "4"
}
```
