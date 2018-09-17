---
{
  "authentication": "required", 
  "description": ".. caution::This endpoint may change in the future without notice.Return a set of points representing a normalized timestamp and thenumber of events seen in the period.Query ranges are limited to Sentry's configured time-seriesresolutions.", 
  "example_request": "GET /api/0/teams/the-interstellar-jurisdiction/powerful-abolitionist/stats/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}", 
  "example_response": "HTTP/1.1\nContent-Length: 2\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json", 
  "method": "GET", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the slug of the organization.", 
      "name": "organization_slug", 
      "type": "string"
    }, 
    {
      "description": "the slug of the team.", 
      "name": "team_slug", 
      "type": "string"
    }
  ], 
  "query_parameters": [
    {
      "description": "the name of the stat to query (\"received\", \"rejected\")", 
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
  "sidebar_order": 8, 
  "title": "Teams"
}
---
