---
title: 'Create a New Project'
---

POST /api/0/teams/_{organization_slug}_/_{team_slug}_/projects/

: Create a new project bound to a team.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the team belongs to.</li><li><strong>team_slug</strong> (<em>string</em>) – the slug of the team to create a new project for.</li></ul></td></tr><tr><th>Parameters:</th><td><ul><li><strong>name</strong> (<em>string</em>) – the name for the new project.</li><li><strong>slug</strong> (<em>string</em>) – optionally a slug for the new project. If it’s not provided a slug is generated from the name.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>POST</td></tr><tr><th>Path:</th><td>/api/0/teams/<em>{organization_slug}</em>/<em>{team_slug}</em>/projects/</td></tr></tbody></table>

## Example

```http
POST /api/0/teams/the-interstellar-jurisdiction/powerful-abolitionist/projects/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: app.getsentry.com
Content-Type: application/json

{
  "name": "The Spoiled Yoghurt"
}
```

```http
HTTP/1.1 201 CREATED
Allow: GET, POST, HEAD, OPTIONS
Content-Language: en
Content-Length: 406
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

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
```
