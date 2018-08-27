---
title: 'Retrieve Event Counts for a Team'
sidebar_order: 6
---

GET /api/0/teams/_{organization_slug}_/_{team_slug}_/stats/

: {% capture __alert_content -%}
  This endpoint may change in the future without notice.
  {%- endcapture -%}
  {%- include components/alert.html
    level="warning"
    title="Caution"
    content=__alert_content
  %}

  Return a set of points representing a normalized timestamp and the number of events seen in the period.

  Query ranges are limited to Sentry’s configured time-series resolutions.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization.</li><li><strong>team_slug</strong> (<em>string</em>) – the slug of the team.</li></ul></td></tr><tr><th>Query Parameters:</th><td><ul><li><strong>stat</strong> (<em>string</em>) – the name of the stat to query (<code class="docutils literal">"received"</code>, <code class="docutils literal">"rejected"</code>)</li><li><strong>since</strong> (<em>timestamp</em>) – a timestamp to set the start of the query in seconds since UNIX epoch.</li><li><strong>until</strong> (<em>timestamp</em>) – a timestamp to set the end of the query in seconds since UNIX epoch.</li><li><strong>resolution</strong> (<em>string</em>) – an explicit resolution to search for (eg: <code class="docutils literal">10s</code>). This should not be used unless you are familiar with Sentry’s internals as it’s restricted to pre-defined values.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/teams/<em>{organization_slug}</em>/<em>{team_slug}</em>/stats/</td></tr></tbody></table>

## Example

```http
GET /api/0/teams/the-interstellar-jurisdiction/powerful-abolitionist/stats/ HTTP/1.1
Authorization: Basic {base64-encoded-key-here}
Host: app.getsentry.com
```

```http
HTTP/1.1 200 OK
Allow: GET, HEAD, OPTIONS
Content-Language: en
Content-Length: 2
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

[]
```
