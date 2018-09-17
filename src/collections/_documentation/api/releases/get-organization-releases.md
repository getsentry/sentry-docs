---
{
  "authentication": "", 
  "description": "Return a list of releases for a given organization.", 
  "example_request": "GET /api/0/organizations/the-interstellar-jurisdiction/releases/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}", 
  "example_response": "HTTP/1.1\nContent-Length: 1325\nX-XSS-Protection: 1; mode=block\nX-Content-Type-Options: nosniff\nContent-Language: en\nVary: Accept-Language, Cookie\nLink: <https://sentry.io/api/0/organizations/the-interstellar-jurisdiction/releases/?&cursor=100:-1:1>; rel=\"previous\"; results=\"false\"; cursor=\"100:-1:1\", <https://sentry.io/api/0/organizations/the-interstellar-jurisdiction/releases/?&cursor=100:1:0>; rel=\"next\"; results=\"false\"; cursor=\"100:1:0\"\nAllow: GET, POST, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json\n\n[\n  {\n    \"authors\": [], \n    \"commitCount\": 0, \n    \"data\": {}, \n    \"dateCreated\": \"2018-09-10T20:36:48.447Z\", \n    \"dateReleased\": null, \n    \"deployCount\": 0, \n    \"firstEvent\": null, \n    \"lastCommit\": null, \n    \"lastDeploy\": null, \n    \"lastEvent\": null, \n    \"newGroups\": 0, \n    \"owner\": null, \n    \"projects\": [\n      {\n        \"name\": \"Pump Station\", \n        \"slug\": \"pump-station\"\n      }\n    ], \n    \"ref\": \"6ba09a7c53235ee8a8fa5ee4c1ca8ca886e7fdbb\", \n    \"shortVersion\": \"2.0rc2\", \n    \"url\": null, \n    \"version\": \"2.0rc2\"\n  }, \n  {\n    \"authors\": [], \n    \"commitCount\": 0, \n    \"data\": {}, \n    \"dateCreated\": \"2018-09-10T20:36:38.621Z\", \n    \"dateReleased\": null, \n    \"deployCount\": 0, \n    \"firstEvent\": \"2018-09-10T20:36:38.711Z\", \n    \"lastCommit\": null, \n    \"lastDeploy\": null, \n    \"lastEvent\": \"2018-09-10T20:36:38.711Z\", \n    \"newGroups\": 0, \n    \"owner\": null, \n    \"projects\": [\n      {\n        \"name\": \"Prime Mover\", \n        \"slug\": \"prime-mover\"\n      }\n    ], \n    \"ref\": null, \n    \"shortVersion\": \"9ac8eae\", \n    \"url\": null, \n    \"version\": \"9ac8eae3593c24c98e1f49578144064fbaa625ac\"\n  }, \n  {\n    \"authors\": [], \n    \"commitCount\": 0, \n    \"data\": {}, \n    \"dateCreated\": \"2018-09-10T20:36:34.590Z\", \n    \"dateReleased\": null, \n    \"deployCount\": 0, \n    \"firstEvent\": \"2018-09-10T20:36:34.719Z\", \n    \"lastCommit\": null, \n    \"lastDeploy\": null, \n    \"lastEvent\": \"2018-09-10T20:36:34.719Z\", \n    \"newGroups\": 0, \n    \"owner\": null, \n    \"projects\": [\n      {\n        \"name\": \"Pump Station\", \n        \"slug\": \"pump-station\"\n      }\n    ], \n    \"ref\": null, \n    \"shortVersion\": \"88dc638\", \n    \"url\": null, \n    \"version\": \"88dc638c8ccb84e5b7c750da882232aa1b394ac1\"\n  }\n]", 
  "method": "GET", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the organization short name", 
      "name": "organization_slug", 
      "type": "string"
    }
  ], 
  "query_parameters": [
    {
      "description": "this parameter can be used to create a \"starts with\" filter for the version.", 
      "name": "query", 
      "type": "string"
    }
  ], 
  "sidebar_order": 1, 
  "title": "Releases"
}
---
