---
title: 'Submit User Feedback'
sidebar_order: 15
---

POST /api/0/projects/_{organization_slug}_/_{project_slug}_/user-feedback/

: Submit and associate user feedback with an issue.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Parameters:</th><td><ul><li><strong>event_id</strong> (<em>string</em>) – the event ID</li><li><strong>name</strong> (<em>string</em>) – user’s name</li><li><strong>email</strong> (<em>string</em>) – user’s email address</li><li><strong>comments</strong> (<em>string</em>) – comments supplied by user</li></ul></td></tr><tr><th>Method:</th><td>POST</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/user-feedback/</td></tr></tbody></table>

## Example

```http
POST /api/0/projects/the-interstellar-jurisdiction/plain-proxy/user-feedback/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: app.getsentry.com
Content-Type: application/json

{
  "event_id": "181913bfbbe846ab85b0664757e42fc2",
  "email": "jane@example.com",
  "comments": "It broke!",
  "name": "Jane Smith"
}
```

```http
HTTP/1.1 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Language: en
Content-Length: 276
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

{
  "eventID": "181913bfbbe846ab85b0664757e42fc2",
  "name": "Jane Smith",
  "comments": "It broke!",
  "id": "1",
  "email": "jane@example.com",
  "user": null,
  "dateCreated": "2018-08-22T18:24:01.092Z",
  "issue": null,
  "event": {
    "eventID": "181913bfbbe846ab85b0664757e42fc2",
    "id": null
  }
}
```
