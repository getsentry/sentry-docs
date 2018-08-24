---
title: 'Retrieve a Project'
sidebar_order: 12
---

GET /api/0/projects/_{organization_slug}_/_{project_slug}_/

: Return details on an individual project.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the project belongs to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project to delete.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/</td></tr></tbody></table>

## Example

```http
GET /api/0/projects/the-interstellar-jurisdiction/pump-station/ HTTP/1.1
Authorization: Basic {base64-encoded-key-here}
Host: app.getsentry.com
```

```http
HTTP/1.1 200 OK
Allow: GET, PUT, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 2663
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

{
  "subjectPrefix": "[Sentry] ",
  "defaultEnvironment": null,
  "features": [
    "data-forwarding",
    "rate-limits",
    "releases"
  ],
  "safeFields": [],
  "color": "#3fbf7f",
  "isInternal": false,
  "platforms": [],
  "latestRelease": {
    "dateReleased": null,
    "newGroups": 0,
    "url": null,
    "ref": "6ba09a7c53235ee8a8fa5ee4c1ca8ca886e7fdbb",
    "lastDeploy": null,
    "deployCount": 0,
    "dateCreated": "2018-08-22T18:23:57.009Z",
    "lastEvent": null,
    "version": "2.0rc2",
    "firstEvent": null,
    "lastCommit": null,
    "shortVersion": "2.0rc2",
    "authors": [],
    "owner": null,
    "commitCount": 0,
    "data": {},
    "projects": [
      {
        "name": "Pump Station",
        "slug": "pump-station"
      }
    ]
  },
  "plugins": [
    {
      "status": "unknown",
      "slug": "webhooks",
      "description": "Integrates web hooks.",
      "isTestable": true,
      "author": {
        "url": "https://github.com/getsentry/sentry",
        "name": "Sentry Team"
      },
      "contexts": [],
      "doc": "",
      "resourceLinks": [
        {
          "url": "https://github.com/getsentry/sentry/issues",
          "title": "Bug Tracker"
        },
        {
          "url": "https://github.com/getsentry/sentry",
          "title": "Source"
        }
      ],
      "enabled": false,
      "hasConfiguration": true,
      "name": "WebHooks",
      "version": "9.1.0.dev0",
      "canDisable": true,
      "shortName": "WebHooks",
      "metadata": {},
      "type": "notification",
      "id": "webhooks",
      "assets": []
    }
  ],
  "teams": [
    {
      "slug": "powerful-abolitionist",
      "id": "2",
      "name": "Powerful Abolitionist"
    }
  ],
  "id": "2",
  "verifySSL": false,
  "allowedDomains": [
    "*"
  ],
  "scrubIPAddresses": false,
  "platform": null,
  "firstEvent": null,
  "digestsMaxDelay": 1800,
  "processingIssues": 0,
  "status": "active",
  "digestsMinDelay": 300,
  "sensitiveFields": [],
  "isPublic": false,
  "dateCreated": "2018-08-22T18:23:44.413Z",
  "scrapeJavaScript": true,
  "resolveAge": 0,
  "securityToken": "9092f711a63811e8b5ebacde48001122",
  "slug": "pump-station",
  "name": "Pump Station",
  "hasAccess": true,
  "storeCrashReports": false,
  "isBookmarked": false,
  "dataScrubberDefaults": true,
  "dataScrubber": true,
  "avatar": {
    "avatarUuid": null,
    "avatarType": "letter_avatar"
  },
  "isMember": false,
  "team": {
    "slug": "powerful-abolitionist",
    "id": "2",
    "name": "Powerful Abolitionist"
  },
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
  "options": {
    "sentry:csp_ignored_sources_defaults": true,
    "sentry:reprocessing_active": false,
    "sentry:csp_ignored_sources": "",
    "filters:blacklisted_ips": "",
    "filters:error_messages": "",
    "feedback:branding": true,
    "filters:releases": ""
  },
  "subjectTemplate": "$shortID - $title",
  "securityTokenHeader": null
}
```
