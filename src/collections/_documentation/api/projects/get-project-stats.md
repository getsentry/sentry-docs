---
title: 'Retrieve Event Counts for a Project'
sidebar_order: 14
---

GET /api/0/projects/_{organization_slug}_/_{project_slug}_/stats/

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

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project.</li></ul></td></tr><tr><th>Query Parameters:</th><td><ul><li><strong>stat</strong> (<em>string</em>) – the name of the stat to query (<code class="docutils literal">"received"</code>, <code class="docutils literal">"rejected"</code>, <code class="docutils literal">"blacklisted"</code>, <code class="docutils literal">generated</code>)</li><li><strong>since</strong> (<em>timestamp</em>) – a timestamp to set the start of the query in seconds since UNIX epoch.</li><li><strong>until</strong> (<em>timestamp</em>) – a timestamp to set the end of the query in seconds since UNIX epoch.</li><li><strong>resolution</strong> (<em>string</em>) – an explicit resolution to search for (eg: <code class="docutils literal">10s</code>). This should not be used unless you are familiar with Sentry’s internals as it’s restricted to pre-defined values.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/stats/</td></tr></tbody></table>

## Example

```http
GET /api/0/projects/the-interstellar-jurisdiction/pump-station/stats/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: sentry.io
```

```http
HTTP/1.1 200 OK
Allow: GET, HEAD, OPTIONS
Content-Language: en
Content-Length: 520
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

[
  [
    1534878000.0,
    2031
  ],
  [
    1534881600.0,
    725
  ],
  [
    1534885200.0,
    609
  ],
  [
    1534888800.0,
    532
  ],
  [
    1534892400.0,
    1345
  ],
  [
    1534896000.0,
    1324
  ],
  [
    1534899600.0,
    1658
  ],
  [
    1534903200.0,
    1824
  ],
  [
    1534906800.0,
    1581
  ],
  [
    1534910400.0,
    1179
  ],
  [
    1534914000.0,
    1264
  ],
  [
    1534917600.0,
    1551
  ],
  [
    1534921200.0,
    1029
  ],
  [
    1534924800.0,
    887
  ],
  [
    1534928400.0,
    592
  ],
  [
    1534932000.0,
    1861
  ],
  [
    1534935600.0,
    1064
  ],
  [
    1534939200.0,
    1430
  ],
  [
    1534942800.0,
    1433
  ],
  [
    1534946400.0,
    934
  ],
  [
    1534950000.0,
    761
  ],
  [
    1534953600.0,
    1125
  ],
  [
    1534957200.0,
    594
  ],
  [
    1534960800.0,
    1010
  ]
]
```
