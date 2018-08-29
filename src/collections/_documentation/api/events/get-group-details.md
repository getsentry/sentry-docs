---
title: 'Retrieve an Issue'
sidebar_order: 9
---

GET /api/0/issues/_{issue_id}_/

: Return details on an individual issue. This returns the basic stats for the issue (title, last seen, first seen), some overall numbers (number of comments, user reports) as well as the summarized event data.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><strong>issue_id</strong> (<em>string</em>) – the ID of the issue to retrieve.</td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/issues/<em>{issue_id}</em>/</td></tr></tbody></table>

## Example

```http
GET /api/0/issues/1/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: sentry.io
```

```http
HTTP/1.1 200 OK
Allow: GET, PUT, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 2674
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

{
  "status": "unresolved",
  "pluginIssues": [],
  "lastSeen": "2018-08-22T18:23:44Z",
  "userReportCount": 0,
  "subscriptionDetails": null,
  "id": "1",
  "userCount": 0,
  "stats": {
    "30d": [
      [
        1532304000.0,
        2340
      ],
      [
        1532390400.0,
        12206
      ],
      [
        1532476800.0,
        13527
      ],
      [
        1532563200.0,
        13066
      ],
      [
        1532649600.0,
        13562
      ],
      [
        1532736000.0,
        13840
      ],
      [
        1532822400.0,
        12226
      ],
      [
        1532908800.0,
        13686
      ],
      [
        1532995200.0,
        15427
      ],
      [
        1533081600.0,
        11293
      ],
      [
        1533168000.0,
        13166
      ],
      [
        1533254400.0,
        11816
      ],
      [
        1533340800.0,
        14001
      ],
      [
        1533427200.0,
        12733
      ],
      [
        1533513600.0,
        12837
      ],
      [
        1533600000.0,
        14971
      ],
      [
        1533686400.0,
        12164
      ],
      [
        1533772800.0,
        11867
      ],
      [
        1533859200.0,
        11580
      ],
      [
        1533945600.0,
        11242
      ],
      [
        1534032000.0,
        15601
      ],
      [
        1534118400.0,
        11676
      ],
      [
        1534204800.0,
        12261
      ],
      [
        1534291200.0,
        12721
      ],
      [
        1534377600.0,
        13990
      ],
      [
        1534464000.0,
        13646
      ],
      [
        1534550400.0,
        12734
      ],
      [
        1534636800.0,
        14589
      ],
      [
        1534723200.0,
        11709
      ],
      [
        1534809600.0,
        14450
      ],
      [
        1534896000.0,
        9662
      ]
    ],
    "24h": [
      [
        1534874400.0,
        280
      ],
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
  "pluginContexts": [],
  "pluginActions": [],
  "assignedTo": null,
  "participants": [],
  "logger": null,
  "type": "default",
  "annotations": [],
  "metadata": {
    "title": "This is an example Python exception"
  },
  "seenBy": [],
  "tags": [],
  "numComments": 0,
  "isPublic": false,
  "permalink": null,
  "firstRelease": {
    "dateReleased": null,
    "newGroups": 0,
    "url": null,
    "ref": null,
    "lastDeploy": null,
    "deployCount": 0,
    "dateCreated": "2018-08-22T18:23:44.439Z",
    "lastEvent": "2018-08-22T18:23:44.590Z",
    "version": "e48e7b5b90327ea1a4d1a4360c735eee7b536f82",
    "firstEvent": "2018-08-22T18:23:44.590Z",
    "lastCommit": null,
    "shortVersion": "e48e7b5",
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
  },
  "shortId": "PUMP-STATION-1",
  "shareId": null,
  "firstSeen": "2018-08-22T18:23:44Z",
  "count": "1",
  "hasSeen": false,
  "level": "error",
  "isSubscribed": false,
  "title": "This is an example Python exception",
  "isBookmarked": false,
  "project": {
    "slug": "pump-station",
    "id": "2",
    "name": "Pump Station"
  },
  "lastRelease": null,
  "activity": [
    {
      "type": "first_seen",
      "user": null,
      "data": {},
      "id": "0",
      "dateCreated": "2018-08-22T18:23:44Z"
    }
  ],
  "statusDetails": {}
}
```
