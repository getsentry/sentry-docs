---
title: 'Update an Organization'
sidebar_order: 10
---

PUT /api/0/organizations/_{organization_slug}_/

: Update various attributes and configurable settings for the given organization.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the team should be created for.</td></tr><tr><th>Parameters:</th><td><ul><li><strong>name</strong> (<em>string</em>) – an optional new name for the organization.</li><li><strong>slug</strong> (<em>string</em>) – an optional new slug for the organization. Needs to be available and unique.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>PUT</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/</td></tr></tbody></table>

## Example

```http
PUT /api/0/organizations/badly-misnamed/ HTTP/1.1
Authorization: Basic {base64-encoded-key-here}
Host: app.getsentry.com
Content-Type: application/json

{
  "name": "Impeccably Designated",
  "slug": "impeccably-designated"
}
```

```http
HTTP/1.1 200 OK
Allow: GET, PUT, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 1064
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
  "id": "3",
  "isEarlyAdopter": false,
  "scrubIPAddresses": false,
  "access": [],
  "allowSharedIssues": true,
  "projects": [],
  "isDefault": false,
  "require2FA": false,
  "sensitiveFields": [],
  "quota": {
    "maxRateInterval": 60,
    "projectLimit": 100,
    "accountLimit": 0,
    "maxRate": 0
  },
  "dateCreated": "2018-08-22T18:24:11.516Z",
  "scrapeJavaScript": true,
  "slug": "impeccably-designated",
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
  "name": "Impeccably Designated",
  "enhancedPrivacy": false,
  "storeCrashReports": false,
  "teams": [],
  "pendingAccessRequests": 0,
  "dataScrubberDefaults": false,
  "dataScrubber": false,
  "avatar": {
    "avatarUuid": null,
    "avatarType": "letter_avatar"
  },
  "onboardingTasks": []
}
```
