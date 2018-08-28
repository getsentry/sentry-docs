---
title: 'List a Project’s Issues'
sidebar_order: 3
---

GET /api/0/projects/_{organization_slug}_/_{project_slug}_/issues/

: Return a list of issues (groups) bound to a project. All parameters are supplied as query string parameters.

  A default query of `is:unresolved` is applied. To return results with other statuses send an new query value (i.e. `?query=` for all results).

  The `statsPeriod` parameter can be used to select the timeline stats which should be present. Possible values are: ‘’ (disable), ‘24h’, ‘14d’

  <table class="table"><tbody valign="top"><tr><th>Query Parameters:</th><td><ul><li><strong>statsPeriod</strong> (<em>string</em>) – an optional stat period (can be one of <code class="docutils literal">"24h"</code>, <code class="docutils literal">"14d"</code>, and <code class="docutils literal">""</code>).</li><li><strong>shortIdLookup</strong> (<em>bool</em>) – if this is set to true then short IDs are looked up by this function as well. This can cause the return value of the function to return an event issue of a different project which is why this is an opt-in. Set to <cite>1</cite> to enable.</li><li><strong>query</strong> (<em>querystring</em>) – an optional Sentry structured search query. If not provided an implied <code class="docutils literal">"is:unresolved"</code> is assumed.)</li></ul></td></tr><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the issues belong to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project the issues belong to.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/issues/</td></tr></tbody></table>

## Example

```http
GET /api/0/projects/the-interstellar-jurisdiction/pump-station/issues/?statsPeriod=24h HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: app.getsentry.com
```

```http
HTTP/1.1 200 OK
Allow: GET, PUT, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 2445
Content-Type: application/json
Link: <https://sentry.io/api/0/projects/the-interstellar-jurisdiction/pump-station/issues/?statsPeriod=24h&cursor=1534962226000:0:1>; rel="previous"; results="false"; cursor="1534962226000:0:1", <https://sentry.io/api/0/projects/the-interstellar-jurisdiction/pump-station/issues/?statsPeriod=24h&cursor=1534962224000:1:0>; rel="next"; results="false"; cursor="1534962224000:1:0"
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Hits: 2
X-Max-Hits: 1000
X-Xss-Protection: 1; mode=block

[
  {
    "lastSeen": "2018-08-22T18:23:46Z",
    "id": "2",
    "userCount": 0,
    "stats": {
      "24h": [
        [
          1534878000.0,
          880
        ],
        [
          1534881600.0,
          242
        ],
        [
          1534885200.0,
          220
        ],
        [
          1534888800.0,
          298
        ],
        [
          1534892400.0,
          696
        ],
        [
          1534896000.0,
          939
        ],
        [
          1534899600.0,
          667
        ],
        [
          1534903200.0,
          787
        ],
        [
          1534906800.0,
          918
        ],
        [
          1534910400.0,
          841
        ],
        [
          1534914000.0,
          808
        ],
        [
          1534917600.0,
          768
        ],
        [
          1534921200.0,
          431
        ],
        [
          1534924800.0,
          456
        ],
        [
          1534928400.0,
          300
        ],
        [
          1534932000.0,
          798
        ],
        [
          1534935600.0,
          716
        ],
        [
          1534939200.0,
          348
        ],
        [
          1534942800.0,
          855
        ],
        [
          1534946400.0,
          251
        ],
        [
          1534950000.0,
          151
        ],
        [
          1534953600.0,
          451
        ],
        [
          1534957200.0,
          360
        ],
        [
          1534960800.0,
          558
        ]
      ]
    },
    "culprit": "io.sentry.example.ApiRequest in perform",
    "title": "ApiException: Authentication failed, token expired!",
    "numComments": 0,
    "assignedTo": null,
    "logger": null,
    "type": "error",
    "annotations": [],
    "metadata": {
      "type": "ApiException",
      "value": "Authentication failed, token expired!"
    },
    "status": "unresolved",
    "subscriptionDetails": null,
    "isPublic": false,
    "permalink": null,
    "shortId": "PUMP-STATION-2",
    "shareId": null,
    "firstSeen": "2018-08-22T18:23:46Z",
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
  },
  {
    "lastSeen": "2018-08-22T18:23:44Z",
    "id": "1",
    "userCount": 0,
    "stats": {
      "24h": [
        [
          1534878000.0,
          967
        ],
        [
          1534881600.0,
          418
        ],
        [
          1534885200.0,
          334
        ],
        [
          1534888800.0,
          187
        ],
        [
          1534892400.0,
          528
        ],
        [
          1534896000.0,
          266
        ],
        [
          1534899600.0,
          841
        ],
        [
          1534903200.0,
          872
        ],
        [
          1534906800.0,
          520
        ],
        [
          1534910400.0,
          231
        ],
        [
          1534914000.0,
          342
        ],
        [
          1534917600.0,
          643
        ],
        [
          1534921200.0,
          505
        ],
        [
          1534924800.0,
          351
        ],
        [
          1534928400.0,
          239
        ],
        [
          1534932000.0,
          895
        ],
        [
          1534935600.0,
          252
        ],
        [
          1534939200.0,
          953
        ],
        [
          1534942800.0,
          449
        ],
        [
          1534946400.0,
          599
        ],
        [
          1534950000.0,
          541
        ],
        [
          1534953600.0,
          572
        ],
        [
          1534957200.0,
          180
        ],
        [
          1534960800.0,
          411
        ]
      ]
    },
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
]
```
