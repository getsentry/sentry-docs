---
{
  "authentication": "required", 
  "description": ".. caution::This endpoint may change in the future without notice.Return a set of points representing a normalized timestamp and thenumber of events seen in the period.", 
  "example_request": "GET /api/0/organizations/the-interstellar-jurisdiction/stats/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}", 
  "example_response": "HTTP/1.1\nContent-Length: 528\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json\n\n[\n  [\n    1536526800.0, \n    7125\n  ], \n  [\n    1536530400.0, \n    7004\n  ], \n  [\n    1536534000.0, \n    7392\n  ], \n  [\n    1536537600.0, \n    6413\n  ], \n  [\n    1536541200.0, \n    7657\n  ], \n  [\n    1536544800.0, \n    5715\n  ], \n  [\n    1536548400.0, \n    7534\n  ], \n  [\n    1536552000.0, \n    7788\n  ], \n  [\n    1536555600.0, \n    7381\n  ], \n  [\n    1536559200.0, \n    7250\n  ], \n  [\n    1536562800.0, \n    7784\n  ], \n  [\n    1536566400.0, \n    7528\n  ], \n  [\n    1536570000.0, \n    8249\n  ], \n  [\n    1536573600.0, \n    8042\n  ], \n  [\n    1536577200.0, \n    7708\n  ], \n  [\n    1536580800.0, \n    6969\n  ], \n  [\n    1536584400.0, \n    8162\n  ], \n  [\n    1536588000.0, \n    7142\n  ], \n  [\n    1536591600.0, \n    6482\n  ], \n  [\n    1536595200.0, \n    7421\n  ], \n  [\n    1536598800.0, \n    8998\n  ], \n  [\n    1536602400.0, \n    6714\n  ], \n  [\n    1536606000.0, \n    6892\n  ], \n  [\n    1536609600.0, \n    9267\n  ]\n]", 
  "method": "GET", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the slug of the organization for which the stats should be retrieved.", 
      "name": "organization_slug", 
      "type": "string"
    }
  ], 
  "query_parameters": [
    {
      "description": "the name of the stat to query (\"received\", \"rejected\", \"blacklisted\")", 
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
  "sidebar_order": 11, 
  "title": "Organizations"
}
---
