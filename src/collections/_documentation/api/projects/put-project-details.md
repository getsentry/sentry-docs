---
title: 'Update a Project'
sidebar_order: 17
---

PUT /api/0/projects/_{organization_slug}_/_{project_slug}_/

: Update various attributes and configurable settings for the given project. Only supplied values are updated.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the project belongs to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project to delete.</li></ul></td></tr><tr><th>Parameters:</th><td><ul><li><strong>name</strong> (<em>string</em>) – the new name for the project.</li><li><strong>slug</strong> (<em>string</em>) – the new slug for the project.</li><li><strong>team</strong> (<em>string</em>) – the slug of new team for the project. Note, will be deprecated soon when multiple teams can have access to a project.</li><li><strong>platform</strong> (<em>string</em>) – the new platform for the project.</li><li><strong>isBookmarked</strong> (<em>boolean</em>) – in case this API call is invoked with a user context this allows changing of the bookmark flag.</li><li><strong>digestsMinDelay</strong> (<em>int</em>) –</li><li><strong>digestsMaxDelay</strong> (<em>int</em>) –</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>PUT</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/</td></tr></tbody></table>

## Example

```http
PUT /api/0/projects/the-interstellar-jurisdiction/plain-proxy/ HTTP/1.1
Authorization: Basic {base64-encoded-key-here}
Host: app.getsentry.com
Content-Type: application/json

{
  "platform": "javascript",
  "slug": "plane-proxy",
  "name": "Plane Proxy",
  "options": {
    "sentry:origins": "http://example.com\nhttp://example.invalid"
  }
}
```

```http
HTTP/1.1 200 OK
Allow: GET, PUT, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 2751
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
  "color": "#bf803f",
  "isInternal": false,
  "platforms": [],
  "latestRelease": {
    "dateReleased": null,
    "newGroups": 0,
    "url": null,
    "ref": null,
    "lastDeploy": null,
    "deployCount": 0,
    "dateCreated": "2018-08-22T18:24:11.642Z",
    "lastEvent": "2018-08-22T18:24:11.733Z",
    "version": "32323079c2b301234d6370fe76f0c5a7a8913881",
    "firstEvent": "2018-08-22T18:24:11.733Z",
    "lastCommit": null,
    "shortVersion": "3232307",
    "authors": [],
    "owner": null,
    "commitCount": 0,
    "data": {},
    "projects": [
      {
        "name": "Plane Proxy",
        "slug": "plane-proxy"
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
  "id": "5",
  "verifySSL": false,
  "allowedDomains": [
    "http://example.com",
    "http://example.invalid"
  ],
  "scrubIPAddresses": false,
  "platform": "javascript",
  "firstEvent": null,
  "digestsMaxDelay": 1800,
  "processingIssues": 0,
  "status": "active",
  "digestsMinDelay": 300,
  "sensitiveFields": [],
  "isPublic": false,
  "dateCreated": "2018-08-22T18:24:11.618Z",
  "scrapeJavaScript": true,
  "resolveAge": 0,
  "securityToken": "937d968aa63811e8bf6dacde48001122",
  "slug": "plane-proxy",
  "name": "Plane Proxy",
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
