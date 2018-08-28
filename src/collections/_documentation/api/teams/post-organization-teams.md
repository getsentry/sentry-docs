---
title: 'Create a new Team'
sidebar_order: 1
---

POST /api/0/organizations/_{organization_slug}_/teams/

: Create a new team bound to an organization. Only the name of the team is needed to create it, the slug can be auto generated.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the team should be created for.</td></tr><tr><th>Parameters:</th><td><ul><li><strong>name</strong> (<em>string</em>) – the optional name of the team.</li><li><strong>slug</strong> (<em>string</em>) – the optional slug for this team. If not provided it will be auto generated from the name.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>POST</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/teams/</td></tr></tbody></table>

## Example

```http
POST /api/0/organizations/the-interstellar-jurisdiction/teams/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: app.getsentry.com
Content-Type: application/json

{
  "name": "Ancient Gabelers"
}
```

```http
HTTP/1.1 201 CREATED
Allow: GET, POST, HEAD, OPTIONS
Content-Language: en
Content-Length: 231
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

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
  "id": "3"
}
```
