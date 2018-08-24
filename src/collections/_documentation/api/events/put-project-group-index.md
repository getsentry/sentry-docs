---
title: 'Bulk Mutate a List of Issues'
---

PUT /api/0/projects/_{organization_slug}_/_{project_slug}_/issues/

: Bulk mutate various attributes on issues. The list of issues to modify is given through the _id_ query parameter. It is repeated for each issue that should be modified.

  -   For non-status updates, the _id_ query parameter is required.
  -   For status updates, the _id_ query parameter may be omitted for a batch “update all” query.
  -   An optional _status_ query parameter may be used to restrict mutations to only events with the given status.

  The following attributes can be modified and are supplied as JSON object in the body:

  If any ids are out of scope this operation will succeed without any data mutation.

  <table class="table"><tbody valign="top"><tr><th>Query Parameters:</th><td><ul><li><strong>id</strong> (<em>int</em>) – a list of IDs of the issues to be mutated. This parameter shall be repeated for each issue. It is optional only if a status is mutated in which case an implicit <cite>update all</cite> is assumed.</li><li><strong>status</strong> (<em>string</em>) – optionally limits the query to issues of the specified status. Valid values are <code class="docutils literal">"resolved"</code>, <code class="docutils literal">"unresolved"</code> and <code class="docutils literal">"ignored"</code>.</li></ul></td></tr><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the issues belong to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project the issues belong to.</li></ul></td></tr><tr><th>Parameters:</th><td><ul><li><strong>status</strong> (<em>string</em>) – the new status for the issues. Valid values are <code class="docutils literal">"resolved"</code>, <code class="docutils literal">"resolvedInNextRelease"</code>, <code class="docutils literal">"unresolved"</code>, and <code class="docutils literal">"ignored"</code>.</li><li><strong>ignoreDuration</strong> (<em>int</em>) – the number of minutes to ignore this issue.</li><li><strong>isPublic</strong> (<em>boolean</em>) – sets the issue to public or private.</li><li><strong>merge</strong> (<em>boolean</em>) – allows to merge or unmerge different issues.</li><li><strong>assignedTo</strong> (<em>string</em>) – the actor id (or username) of the user or team that should be assigned to this issue.</li><li><strong>hasSeen</strong> (<em>boolean</em>) – in case this API call is invoked with a user context this allows changing of the flag that indicates if the user has seen the event.</li><li><strong>isBookmarked</strong> (<em>boolean</em>) – in case this API call is invoked with a user context this allows changing of the bookmark flag.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>PUT</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/issues/</td></tr></tbody></table>

## Example

```http
PUT /api/0/projects/the-interstellar-jurisdiction/pump-station/issues/?id=1&id=2 HTTP/1.1
Authorization: Basic {base64-encoded-key-here}
Host: app.getsentry.com
Content-Type: application/json

{
  "status": "unresolved",
  "isPublic": false
}
```

```http
HTTP/1.1 200 OK
Allow: GET, PUT, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 64
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

{
  "status": "unresolved",
  "isPublic": false,
  "statusDetails": {}
}
```
