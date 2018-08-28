---
title: 'Update an Issue'
sidebar_order: 13
---

PUT /api/0/issues/_{issue_id}_/

: Updates an individual issues’s attributes. Only the attributes submitted are modified.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><strong>issue_id</strong> (<em>string</em>) – the ID of the group to retrieve.</td></tr><tr><th>Parameters:</th><td><ul><li><strong>status</strong> (<em>string</em>) – the new status for the issue. Valid values are <code class="docutils literal">"resolved"</code>, <code class="docutils literal">resolvedInNextRelease</code>, <code class="docutils literal">"unresolved"</code>, and <code class="docutils literal">"ignored"</code>.</li><li><strong>assignedTo</strong> (<em>string</em>) – the actor id (or username) of the user or team that should be assigned to this issue.</li><li><strong>hasSeen</strong> (<em>boolean</em>) – in case this API call is invoked with a user context this allows changing of the flag that indicates if the user has seen the event.</li><li><strong>isBookmarked</strong> (<em>boolean</em>) – in case this API call is invoked with a user context this allows changing of the bookmark flag.</li><li><strong>isSubscribed</strong> (<em>boolean</em>) –</li><li><strong>isPublic</strong> (<em>boolean</em>) – sets the issue to public or private.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>PUT</td></tr><tr><th>Path:</th><td>/api/0/issues/<em>{issue_id}</em>/</td></tr></tbody></table>

## Example

```http
PUT /api/0/issues/1/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: app.getsentry.com
Content-Type: application/json

{
  "status": "unresolved"
}
```

```http
HTTP/1.1 200 OK
Allow: GET, PUT, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 671
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

{
  "lastSeen": "2018-08-22T18:23:44Z",
  "id": "1",
  "userCount": 0,
  "culprit": "raven.scripts.runner in main",
  "title": "This is an example Python exception",
  "numComments": 0,
  "assignedTo": null,
  "logger": null,
  "type": "default",
  "annotations": [],
  "metadata": {
    "title": "This is an example Python exception"
  },
  "status": "unresolved",
  "subscriptionDetails": null,
  "isPublic": false,
  "permalink": null,
  "shortId": "PUMP-STATION-1",
  "shareId": null,
  "firstSeen": "2018-08-22T18:23:44Z",
  "count": "1",
  "hasSeen": false,
  "level": "error",
  "isSubscribed": false,
  "isBookmarked": false,
  "project": {
    "slug": "pump-station",
    "id": "2",
    "name": "Pump Station"
  },
  "statusDetails": {}
}
```
