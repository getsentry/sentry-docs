---
title: 'Retrieve an Organization'
sidebar_order: 8
---

GET /api/0/organizations/_{organization_slug}_/

: Return details on an individual organization including various details such as membership access, features, and teams.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the team should be created for.</td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/</td></tr></tbody></table>

## Example

```http
GET /api/0/organizations/the-interstellar-jurisdiction/ HTTP/1.1
Authorization: Basic {base64-encoded-key-here}
Host: app.getsentry.com
```

```http
HTTP/1.1 200 OK
Allow: GET, PUT, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 2928
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

{
  "defaultRole": "member",
  "status": {
    "id": "active",
    "name": "active"
  },
  "features": [
    "sso",
    "api-keys",
    "new-settings",
    "repos",
    "suggested-commits",
    "new-teams",
    "open-membership",
    "shared-issues"
  ],
  "safeFields": [],
  "experiments": {},
  "id": "2",
  "isEarlyAdopter": false,
  "scrubIPAddresses": false,
  "access": [],
  "allowSharedIssues": true,
  "projects": [
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
  ],
  "isDefault": false,
  "require2FA": false,
  "sensitiveFields": [],
  "quota": {
    "maxRateInterval": 60,
    "projectLimit": 100,
    "accountLimit": 0,
    "maxRate": 0
  },
  "dateCreated": "2018-08-22T18:23:44.398Z",
  "scrapeJavaScript": true,
  "slug": "the-interstellar-jurisdiction",
  "openMembership": true,
  "availableRoles": [
    {
      "id": "member",
      "name": "Member"
    },
    {
      "id": "admin",
      "name": "Admin"
    },
    {
      "id": "manager",
      "name": "Manager"
    },
    {
      "id": "owner",
      "name": "Owner"
    }
  ],
  "name": "The Interstellar Jurisdiction",
  "enhancedPrivacy": false,
  "storeCrashReports": false,
  "teams": [
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
      "id": "2"
    }
  ],
  "pendingAccessRequests": 0,
  "dataScrubberDefaults": false,
  "dataScrubber": false,
  "avatar": {
    "avatarUuid": null,
    "avatarType": "letter_avatar"
  },
  "onboardingTasks": [
    {
      "status": "complete",
      "dateCompleted": "2018-08-22T18:23:57.087Z",
      "task": 1,
      "data": {},
      "user": null
    }
  ]
}
```
