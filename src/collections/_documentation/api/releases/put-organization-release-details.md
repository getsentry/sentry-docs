---
title: 'Update an Organization’s Release'
sidebar_order: 18
---

PUT /api/0/organizations/_{organization_slug}_/releases/_{version}_/

: Update a release. This can change some metadata associated with the release (the ref, url, and dates).

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>version</strong> (<em>string</em>) – the version identifier of the release.</li></ul></td></tr><tr><th>Parameters:</th><td><ul><li><strong>ref</strong> (<em>string</em>) – an optional commit reference. This is useful if a tagged version has been provided.</li><li><strong>url</strong> (<em>url</em>) – a URL that points to the release. This can be the path to an online interface to the sourcecode for instance.</li><li><strong>dateReleased</strong> (<em>datetime</em>) – an optional date that indicates when the release went live. If not provided the current time is assumed.</li><li><strong>commits</strong> (<em>array</em>) – an optional list of commit data to be associated with the release. Commits must include parameters <code class="docutils literal">id</code> (the sha of the commit), and can optionally include <code class="docutils literal">repository</code>, <code class="docutils literal">message</code>, <code class="docutils literal">author_name</code>, <code class="docutils literal">author_email</code>, and <code class="docutils literal">timestamp</code>.</li><li><strong>refs</strong> (<em>array</em>) – an optional way to indicate the start and end commits for each repository included in a release. Head commits must include parameters <code class="docutils literal">repository</code> and <code class="docutils literal">commit</code> (the HEAD sha). They can optionally include <code class="docutils literal">previousCommit</code> (the sha of the HEAD of the previous release), which should be specified if this is the first time you’ve sent commit data.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>PUT</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/releases/<em>{version}</em>/</td></tr></tbody></table>

## Example

```http
PUT /api/0/organization/the-interstellar-jurisdiction/releases/3000/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: sentry.io
Content-Type: application/json

{
  "url": "https://vcshub.invalid/user/project/refs/deadbeef1337",
  "ref": "deadbeef1337"
}
```

```http
HTTP/1.1 404 NOT FOUND
Content-Language: en
Content-Length: 0
Content-Type: text/html; charset=utf-8
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block
```
