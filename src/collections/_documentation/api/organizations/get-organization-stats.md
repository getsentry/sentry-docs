---
title: 'Retrieve Event Counts for an Organization'
sidebar_order: 9
---

GET /api/0/organizations/_{organization_slug}_/stats/

: {% capture __alert_content -%}
  This endpoint may change in the future without notice.
  {%- endcapture -%}
  {%- include components/alert.html
    level="warning"
    title="Caution"
    content=__alert_content
  %}

  Return a set of points representing a normalized timestamp and the number of events seen in the period.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization for which the stats should be retrieved.</td></tr><tr><th>Query Parameters:</th><td><ul><li><strong>stat</strong> (<em>string</em>) – the name of the stat to query (<code class="docutils literal">"received"</code>, <code class="docutils literal">"rejected"</code>, <code class="docutils literal">"blacklisted"</code>)</li><li><strong>since</strong> (<em>timestamp</em>) – a timestamp to set the start of the query in seconds since UNIX epoch.</li><li><strong>until</strong> (<em>timestamp</em>) – a timestamp to set the end of the query in seconds since UNIX epoch.</li><li><strong>resolution</strong> (<em>string</em>) – an explicit resolution to search for (eg: <code class="docutils literal">10s</code>). This should not be used unless you are familiar with Sentry’s internals as it’s restricted to pre-defined values.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/stats/</td></tr></tbody></table>

## Example

```http
GET /api/0/organizations/the-interstellar-jurisdiction/stats/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: sentry.io
```

```http
HTTP/1.1 200 OK
Allow: GET, HEAD, OPTIONS
Content-Language: en
Content-Length: 529
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

[
  [
    1534878000.0,
    7748
  ],
  [
    1534881600.0,
    7011
  ],
  [
    1534885200.0,
    7752
  ],
  [
    1534888800.0,
    6528
  ],
  [
    1534892400.0,
    7234
  ],
  [
    1534896000.0,
    8369
  ],
  [
    1534899600.0,
    7158
  ],
  [
    1534903200.0,
    8480
  ],
  [
    1534906800.0,
    7803
  ],
  [
    1534910400.0,
    7216
  ],
  [
    1534914000.0,
    6825
  ],
  [
    1534917600.0,
    8065
  ],
  [
    1534921200.0,
    8090
  ],
  [
    1534924800.0,
    6334
  ],
  [
    1534928400.0,
    7012
  ],
  [
    1534932000.0,
    8337
  ],
  [
    1534935600.0,
    8180
  ],
  [
    1534939200.0,
    7987
  ],
  [
    1534942800.0,
    5556
  ],
  [
    1534946400.0,
    5754
  ],
  [
    1534950000.0,
    6830
  ],
  [
    1534953600.0,
    6559
  ],
  [
    1534957200.0,
    6663
  ],
  [
    1534960800.0,
    10757
  ]
]
```
