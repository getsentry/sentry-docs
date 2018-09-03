---
title: 'List your Organizations'
sidebar_order: 5
---

GET /api/0/organizations/

: Return a list of organizations available to the authenticated session. This is particularly useful for requests with an user bound context. For API key based requests this will only return the organization that belongs to the key.

  <table class="table"><tbody valign="top"><tr><th>Query Parameters:</th><td><ul><li><strong>member</strong> (<em>bool</em>) – restrict results to organizations which you have membership</li><li><strong>owner</strong> (<em>bool</em>) – restrict results to organizations which are owner</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/organizations/</td></tr></tbody></table>

## Example

```http
GET /api/0/organizations/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: sentry.io
```

```http
HTTP/1.1 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Language: en
Content-Length: 293
Content-Type: application/json
Link: <https://sentry.io/api/0/organizations/?&cursor=1534962224398:0:1>; rel="previous"; results="false"; cursor="1534962224398:0:1", <https://sentry.io/api/0/organizations/?&cursor=1534962224399:100:0>; rel="next"; results="false"; cursor="1534962224399:100:0"
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

[
  {
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
  }
]
```
