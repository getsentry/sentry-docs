---
{
  "authentication": "required",
  "description": "Return a list of issues (groups) bound to a project.  All parameters aresupplied as query string parameters.A default query of ``is:unresolved`` is applied. To return resultswith other statuses send an new query value (i.e. ``?query=`` for allresults).The ``statsPeriod`` parameter can be used to select the timelinestats which should be present. Possible values are: '' (disable),'24h', '14d'",
  "example_request": "GET /api/0/projects/the-interstellar-jurisdiction/pump-station/issues/?statsPeriod=24h HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}",
  "example_response": "HTTP/1.1\nContent-Length: 2445\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Max-Hits: 1000\nVary: Accept-Language, Cookie\nX-Content-Type-Options: nosniff\nLink: <https://sentry.io/api/0/projects/the-interstellar-jurisdiction/pump-station/issues/?statsPeriod=24h&cursor=1536611796000:0:1>; rel=\"previous\"; results=\"false\"; cursor=\"1536611796000:0:1\", <https://sentry.io/api/0/projects/the-interstellar-jurisdiction/pump-station/issues/?statsPeriod=24h&cursor=1536611794000:1:0>; rel=\"next\"; results=\"false\"; cursor=\"1536611794000:1:0\"\nX-Hits: 2\nAllow: GET, PUT, DELETE, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json\n\n[\n  {\n    \"annotations\": [], \n    \"assignedTo\": null, \n    \"count\": \"1\", \n    \"culprit\": \"io.sentry.example.ApiRequest in perform\", \n    \"firstSeen\": \"2018-09-10T20:36:36Z\", \n    \"hasSeen\": false, \n    \"id\": \"2\", \n    \"isBookmarked\": false, \n    \"isPublic\": false, \n    \"isSubscribed\": false, \n    \"lastSeen\": \"2018-09-10T20:36:36Z\", \n    \"level\": \"error\", \n    \"logger\": null, \n    \"metadata\": {\n      \"type\": \"ApiException\", \n      \"value\": \"Authentication failed, token expired!\"\n    }, \n    \"numComments\": 0, \n    \"permalink\": null, \n    \"project\": {\n      \"id\": \"2\", \n      \"name\": \"Pump Station\", \n      \"slug\": \"pump-station\"\n    }, \n    \"shareId\": null, \n    \"shortId\": \"PUMP-STATION-2\", \n    \"stats\": {\n      \"24h\": [\n        [\n          1536526800.0, \n          253\n        ], \n        [\n          1536530400.0, \n          351\n        ], \n        [\n          1536534000.0, \n          689\n        ], \n        [\n          1536537600.0, \n          160\n        ], \n        [\n          1536541200.0, \n          817\n        ], \n        [\n          1536544800.0, \n          764\n        ], \n        [\n          1536548400.0, \n          923\n        ], \n        [\n          1536552000.0, \n          149\n        ], \n        [\n          1536555600.0, \n          969\n        ], \n        [\n          1536559200.0, \n          428\n        ], \n        [\n          1536562800.0, \n          141\n        ], \n        [\n          1536566400.0, \n          641\n        ], \n        [\n          1536570000.0, \n          196\n        ], \n        [\n          1536573600.0, \n          311\n        ], \n        [\n          1536577200.0, \n          155\n        ], \n        [\n          1536580800.0, \n          631\n        ], \n        [\n          1536584400.0, \n          986\n        ], \n        [\n          1536588000.0, \n          114\n        ], \n        [\n          1536591600.0, \n          491\n        ], \n        [\n          1536595200.0, \n          469\n        ], \n        [\n          1536598800.0, \n          334\n        ], \n        [\n          1536602400.0, \n          622\n        ], \n        [\n          1536606000.0, \n          777\n        ], \n        [\n          1536609600.0, \n          733\n        ]\n      ]\n    }, \n    \"status\": \"unresolved\", \n    \"statusDetails\": {}, \n    \"subscriptionDetails\": null, \n    \"title\": \"ApiException: Authentication failed, token expired!\", \n    \"type\": \"error\", \n    \"userCount\": 0\n  }, \n  {\n    \"annotations\": [], \n    \"assignedTo\": null, \n    \"count\": \"1\", \n    \"culprit\": \"raven.scripts.runner in main\", \n    \"firstSeen\": \"2018-09-10T20:36:34Z\", \n    \"hasSeen\": false, \n    \"id\": \"1\", \n    \"isBookmarked\": false, \n    \"isPublic\": false, \n    \"isSubscribed\": false, \n    \"lastSeen\": \"2018-09-10T20:36:34Z\", \n    \"level\": \"error\", \n    \"logger\": null, \n    \"metadata\": {\n      \"title\": \"This is an example Python exception\"\n    }, \n    \"numComments\": 0, \n    \"permalink\": null, \n    \"project\": {\n      \"id\": \"2\", \n      \"name\": \"Pump Station\", \n      \"slug\": \"pump-station\"\n    }, \n    \"shareId\": null, \n    \"shortId\": \"PUMP-STATION-1\", \n    \"stats\": {\n      \"24h\": [\n        [\n          1536526800.0, \n          888\n        ], \n        [\n          1536530400.0, \n          712\n        ], \n        [\n          1536534000.0, \n          961\n        ], \n        [\n          1536537600.0, \n          175\n        ], \n        [\n          1536541200.0, \n          239\n        ], \n        [\n          1536544800.0, \n          815\n        ], \n        [\n          1536548400.0, \n          771\n        ], \n        [\n          1536552000.0, \n          256\n        ], \n        [\n          1536555600.0, \n          496\n        ], \n        [\n          1536559200.0, \n          452\n        ], \n        [\n          1536562800.0, \n          912\n        ], \n        [\n          1536566400.0, \n          976\n        ], \n        [\n          1536570000.0, \n          730\n        ], \n        [\n          1536573600.0, \n          660\n        ], \n        [\n          1536577200.0, \n          309\n        ], \n        [\n          1536580800.0, \n          217\n        ], \n        [\n          1536584400.0, \n          246\n        ], \n        [\n          1536588000.0, \n          737\n        ], \n        [\n          1536591600.0, \n          360\n        ], \n        [\n          1536595200.0, \n          327\n        ], \n        [\n          1536598800.0, \n          813\n        ], \n        [\n          1536602400.0, \n          543\n        ], \n        [\n          1536606000.0, \n          913\n        ], \n        [\n          1536609600.0, \n          598\n        ]\n      ]\n    }, \n    \"status\": \"unresolved\", \n    \"statusDetails\": {}, \n    \"subscriptionDetails\": null, \n    \"title\": \"This is an example Python exception\", \n    \"type\": \"default\", \n    \"userCount\": 0\n  }\n]", 
  "method": "GET",
  "parameters": null,
  "path_parameters": [
    {
      "description": "the slug of the organization the issues belong to.",
      "name": "organization_slug",
      "type": "string"
    },
    {
      "description": "the slug of the project the issues belong to.",
      "name": "project_slug",
      "type": "string"
    }
  ],
  "query_parameters": [
    {
      "description": "an optional stat period (can be one of \"24h\", \"14d\", and \"\").",
      "name": "statsPeriod",
      "type": "string"
    },
    {
      "description": "if this is set to true then short IDs are looked up by this function as well.  This can cause the return value of the function to return an event issue of a different project which is why this is an opt-in. Set to 1 to enable.",
      "name": "shortIdLookup",
      "type": "bool"
    },
    {
      "description": "an optional Sentry structured search query.  If not provided an implied \"is:unresolved\" is assumed.)",
      "name": "query",
      "type": "querystring"
    }
  ],
  "sidebar_order": 3,
  "title": "Events"
}
---
