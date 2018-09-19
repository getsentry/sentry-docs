---
{
  "authentication": "required", 
  "description": ".. caution::This endpoint may change in the future without notice.Return a set of points representing a normalized timestamp and thenumber of events seen in the period.Query ranges are limited to Sentry's configured time-seriesresolutions.", 
  "example_request": "GET /api/0/projects/the-interstellar-jurisdiction/pump-station/stats/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}", 
  "example_response": "HTTP/1.1\nContent-Length: 520\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json\n\n[\n  [\n    1536526800.0, \n    1254\n  ], \n  [\n    1536530400.0, \n    1169\n  ], \n  [\n    1536534000.0, \n    1814\n  ], \n  [\n    1536537600.0, \n    368\n  ], \n  [\n    1536541200.0, \n    1160\n  ], \n  [\n    1536544800.0, \n    1736\n  ], \n  [\n    1536548400.0, \n    1863\n  ], \n  [\n    1536552000.0, \n    444\n  ], \n  [\n    1536555600.0, \n    1610\n  ], \n  [\n    1536559200.0, \n    967\n  ], \n  [\n    1536562800.0, \n    1158\n  ], \n  [\n    1536566400.0, \n    1778\n  ], \n  [\n    1536570000.0, \n    1018\n  ], \n  [\n    1536573600.0, \n    1068\n  ], \n  [\n    1536577200.0, \n    509\n  ], \n  [\n    1536580800.0, \n    932\n  ], \n  [\n    1536584400.0, \n    1354\n  ], \n  [\n    1536588000.0, \n    935\n  ], \n  [\n    1536591600.0, \n    936\n  ], \n  [\n    1536595200.0, \n    874\n  ], \n  [\n    1536598800.0, \n    1261\n  ], \n  [\n    1536602400.0, \n    1281\n  ], \n  [\n    1536606000.0, \n    1858\n  ], \n  [\n    1536609600.0, \n    1406\n  ]\n]", 
  "method": "GET", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the slug of the organization.", 
      "name": "organization_slug", 
      "type": "string"
    }, 
    {
      "description": "the slug of the project.", 
      "name": "project_slug", 
      "type": "string"
    }
  ], 
  "query_parameters": [
    {
      "description": "the name of the stat to query (\"received\", \"rejected\", \"blacklisted\", generated)", 
      "name": "stat", 
      "type": "string"
    }, 
    {
      "description": "a timestamp to set the start of the query in seconds since UNIX epoch.", 
      "name": "since", 
      "type": "timestamp"
    }, 
    {
      "description": "a timestamp to set the end of the query in seconds since UNIX epoch.", 
      "name": "until", 
      "type": "timestamp"
    }, 
    {
      "description": "an explicit resolution to search for (eg: 10s).  This should not be used unless you are familiar with Sentry's internals as it's restricted to pre-defined values.", 
      "name": "resolution", 
      "type": "string"
    }
  ], 
  "sidebar_order": 16, 
  "title": "Projects"
}
---
