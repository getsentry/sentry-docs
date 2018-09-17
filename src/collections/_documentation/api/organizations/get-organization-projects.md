---
{
  "authentication": "required", 
  "description": "Return a list of projects bound to a organization.", 
  "example_request": "GET /api/0/organizations/the-interstellar-jurisdiction/projects/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}", 
  "example_response": "HTTP/1.1\nContent-Length: 1272\nX-XSS-Protection: 1; mode=block\nX-Content-Type-Options: nosniff\nContent-Language: en\nVary: Accept-Language, Cookie\nLink: <https://sentry.io/api/0/organizations/the-interstellar-jurisdiction/projects/?&cursor=100:-1:1>; rel=\"previous\"; results=\"false\"; cursor=\"100:-1:1\", <https://sentry.io/api/0/organizations/the-interstellar-jurisdiction/projects/?&cursor=100:1:0>; rel=\"next\"; results=\"false\"; cursor=\"100:1:0\"\nAllow: GET, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json\n\n[\n  {\n    \"dateCreated\": \"2018-09-10T20:36:38.601Z\", \n    \"firstEvent\": null, \n    \"hasAccess\": true, \n    \"id\": \"3\", \n    \"isBookmarked\": false, \n    \"isMember\": false, \n    \"latestDeploys\": null, \n    \"name\": \"Prime Mover\", \n    \"platform\": null, \n    \"platforms\": [], \n    \"slug\": \"prime-mover\", \n    \"team\": {\n      \"id\": \"2\", \n      \"name\": \"Powerful Abolitionist\", \n      \"slug\": \"powerful-abolitionist\"\n    }, \n    \"teams\": [\n      {\n        \"id\": \"2\", \n        \"name\": \"Powerful Abolitionist\", \n        \"slug\": \"powerful-abolitionist\"\n      }\n    ]\n  }, \n  {\n    \"dateCreated\": \"2018-09-10T20:36:34.562Z\", \n    \"firstEvent\": null, \n    \"hasAccess\": true, \n    \"id\": \"2\", \n    \"isBookmarked\": false, \n    \"isMember\": false, \n    \"latestDeploys\": null, \n    \"name\": \"Pump Station\", \n    \"platform\": null, \n    \"platforms\": [], \n    \"slug\": \"pump-station\", \n    \"team\": {\n      \"id\": \"2\", \n      \"name\": \"Powerful Abolitionist\", \n      \"slug\": \"powerful-abolitionist\"\n    }, \n    \"teams\": [\n      {\n        \"id\": \"2\", \n        \"name\": \"Powerful Abolitionist\", \n        \"slug\": \"powerful-abolitionist\"\n      }\n    ]\n  }, \n  {\n    \"dateCreated\": \"2018-09-10T20:36:48.492Z\", \n    \"firstEvent\": null, \n    \"hasAccess\": true, \n    \"id\": \"4\", \n    \"isBookmarked\": false, \n    \"isMember\": false, \n    \"latestDeploys\": null, \n    \"name\": \"The Spoiled Yoghurt\", \n    \"platform\": null, \n    \"platforms\": [], \n    \"slug\": \"the-spoiled-yoghurt\", \n    \"team\": {\n      \"id\": \"2\", \n      \"name\": \"Powerful Abolitionist\", \n      \"slug\": \"powerful-abolitionist\"\n    }, \n    \"teams\": [\n      {\n        \"id\": \"2\", \n        \"name\": \"Powerful Abolitionist\", \n        \"slug\": \"powerful-abolitionist\"\n      }\n    ]\n  }\n]", 
  "method": "GET", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the slug of the organization for which the projects should be listed.", 
      "name": "organization_slug", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 8, 
  "title": "Organizations"
}
---
