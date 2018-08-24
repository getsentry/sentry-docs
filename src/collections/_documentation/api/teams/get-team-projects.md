---
title: 'List a Team’s Projects'
sidebar_order: 3
---

GET /api/0/teams/_{organization_slug}_/_{team_slug}_/projects/

: Return a list of projects bound to a team.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the team belongs to.</li><li><strong>team_slug</strong> (<em>string</em>) – the slug of the team to list the projects of.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/teams/<em>{organization_slug}</em>/<em>{team_slug}</em>/projects/</td></tr></tbody></table>

## Example

```http
GET /api/0/teams/the-interstellar-jurisdiction/powerful-abolitionist/projects/ HTTP/1.1
Authorization: Basic {base64-encoded-key-here}
Host: app.getsentry.com
```

```http
HTTP/1.1 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Language: en
Content-Length: 1272
Content-Type: application/json
Link: <https://sentry.io/api/0/teams/the-interstellar-jurisdiction/powerful-abolitionist/projects/?&cursor=100:-1:1>; rel="previous"; results="false"; cursor="100:-1:1", <https://sentry.io/api/0/teams/the-interstellar-jurisdiction/powerful-abolitionist/projects/?&cursor=100:1:0>; rel="next"; results="false"; cursor="100:1:0"
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

[
  {
    "slug": "prime-mover",
    "name": "Prime Mover",
    "hasAccess": true,
    "teams": [
      {
        "slug": "powerful-abolitionist",
        "id": "2",
        "name": "Powerful Abolitionist"
      }
    ],
    "isBookmarked": false,
    "platform": null,
    "firstEvent": null,
    "isMember": false,
    "team": {
      "slug": "powerful-abolitionist",
      "id": "2",
      "name": "Powerful Abolitionist"
    },
    "platforms": [],
    "dateCreated": "2018-08-22T18:23:48.009Z",
    "id": "3",
    "latestDeploys": null
  },
  {
    "slug": "pump-station",
    "name": "Pump Station",
    "hasAccess": true,
    "teams": [
      {
        "slug": "powerful-abolitionist",
        "id": "2",
        "name": "Powerful Abolitionist"
      }
    ],
    "isBookmarked": false,
    "platform": null,
    "firstEvent": null,
    "isMember": false,
    "team": {
      "slug": "powerful-abolitionist",
      "id": "2",
      "name": "Powerful Abolitionist"
    },
    "platforms": [],
    "dateCreated": "2018-08-22T18:23:44.413Z",
    "id": "2",
    "latestDeploys": null
  },
  {
    "slug": "the-spoiled-yoghurt",
    "name": "The Spoiled Yoghurt",
    "hasAccess": true,
    "teams": [
      {
        "slug": "powerful-abolitionist",
        "id": "2",
        "name": "Powerful Abolitionist"
      }
    ],
    "isBookmarked": false,
    "platform": null,
    "firstEvent": null,
    "isMember": false,
    "team": {
      "slug": "powerful-abolitionist",
      "id": "2",
      "name": "Powerful Abolitionist"
    },
    "platforms": [],
    "dateCreated": "2018-08-22T18:23:57.044Z",
    "id": "4",
    "latestDeploys": null
  }
]
```
