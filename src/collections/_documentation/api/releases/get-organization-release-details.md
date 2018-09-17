---
{
  "authentication": "required", 
  "description": "Return details on an individual release.", 
  "example_request": "GET /api/0/organizations/the-interstellar-jurisdiction/releases/88dc638c8ccb84e5b7c750da882232aa1b394ac1/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}", 
  "example_response": "HTTP/1.1\nContent-Length: 454\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, PUT, DELETE, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json\n\n{\n  \"authors\": [], \n  \"commitCount\": 0, \n  \"data\": {}, \n  \"dateCreated\": \"2018-09-10T20:36:34.590Z\", \n  \"dateReleased\": null, \n  \"deployCount\": 0, \n  \"firstEvent\": \"2018-09-10T20:36:34.719Z\", \n  \"lastCommit\": null, \n  \"lastDeploy\": null, \n  \"lastEvent\": \"2018-09-10T20:36:34.719Z\", \n  \"newGroups\": 0, \n  \"owner\": null, \n  \"projects\": [\n    {\n      \"name\": \"Pump Station\", \n      \"slug\": \"pump-station\"\n    }\n  ], \n  \"ref\": null, \n  \"shortVersion\": \"88dc638\", \n  \"url\": null, \n  \"version\": \"88dc638c8ccb84e5b7c750da882232aa1b394ac1\"\n}", 
  "method": "GET", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the slug of the organization the release belongs to.", 
      "name": "organization_slug", 
      "type": "string"
    }, 
    {
      "description": "the version identifier of the release.", 
      "name": "version", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 3, 
  "title": "Releases"
}
---
