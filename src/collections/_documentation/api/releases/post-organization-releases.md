---
title: 'Create a New Release for an Organization'
sidebar_order: 1
---

POST /api/0/organizations/_{organization_slug}_/releases/

: Create a new release for the given Organization. Releases are used by Sentry to improve its error reporting abilities by correlating first seen events with the release that might have introduced the problem. Releases are also necessary for sourcemaps and other debug features that require manual upload for functioning well.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</td></tr><tr><th>Parameters:</th><td><ul><li><strong>version</strong> (<em>string</em>) – a version identifier for this release. Can be a version number, a commit hash etc.</li><li><strong>ref</strong> (<em>string</em>) – an optional commit reference. This is useful if a tagged version has been provided.</li><li><strong>url</strong> (<em>url</em>) – a URL that points to the release. This can be the path to an online interface to the sourcecode for instance.</li><li><strong>projects</strong> (<em>array</em>) – a list of project slugs that are involved in this release</li><li><strong>dateReleased</strong> (<em>datetime</em>) – an optional date that indicates when the release went live. If not provided the current time is assumed.</li><li><strong>commits</strong> (<em>array</em>) – an optional list of commit data to be associated with the release. Commits must include parameters <code class="docutils literal">id</code> (the sha of the commit), and can optionally include <code class="docutils literal">repository</code>, <code class="docutils literal">message</code>, <code class="docutils literal">author_name</code>, <code class="docutils literal">author_email</code>, and <code class="docutils literal">timestamp</code>.</li><li><strong>refs</strong> (<em>array</em>) – an optional way to indicate the start and end commits for each repository included in a release. Head commits must include parameters <code class="docutils literal">repository</code> and <code class="docutils literal">commit</code> (the HEAD sha). They can optionally include <code class="docutils literal">previousCommit</code> (the sha of the HEAD of the previous release), which should be specified if this is the first time you’ve sent commit data.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>POST</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/releases/</td></tr></tbody></table>

## Example

```http
POST /api/0/organizations/the-interstellar-jurisdiction/releases/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: sentry.io
Content-Type: application/json

{
  "version": "2.0rc2",
  "ref": "6ba09a7c53235ee8a8fa5ee4c1ca8ca886e7fdbb",
  "projects": [
    "pump-station"
  ]
}
```

```http
HTTP/1.1 201 CREATED
Allow: GET, POST, HEAD, OPTIONS
Content-Language: en
Content-Length: 413
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

{
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
}
```
