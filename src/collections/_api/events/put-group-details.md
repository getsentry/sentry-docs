---
{
  "authentication": "required", 
  "description": "Updates an individual issues's attributes.  Only the attributessubmitted are modified.", 
  "example_request": "PUT /api/0/issues/1/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}\nContent-Type: application/json\n\n{\n  \"status\": \"unresolved\"\n}", 
  "example_response": "HTTP/1.1\nContent-Length: 671\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, PUT, DELETE, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json\n\n{\n  \"annotations\": [], \n  \"assignedTo\": null, \n  \"count\": \"1\", \n  \"culprit\": \"raven.scripts.runner in main\", \n  \"firstSeen\": \"2018-09-10T20:36:34Z\", \n  \"hasSeen\": false, \n  \"id\": \"1\", \n  \"isBookmarked\": false, \n  \"isPublic\": false, \n  \"isSubscribed\": false, \n  \"lastSeen\": \"2018-09-10T20:36:34Z\", \n  \"level\": \"error\", \n  \"logger\": null, \n  \"metadata\": {\n    \"title\": \"This is an example Python exception\"\n  }, \n  \"numComments\": 0, \n  \"permalink\": null, \n  \"project\": {\n    \"id\": \"2\", \n    \"name\": \"Pump Station\", \n    \"slug\": \"pump-station\"\n  }, \n  \"shareId\": null, \n  \"shortId\": \"PUMP-STATION-1\", \n  \"status\": \"unresolved\", \n  \"statusDetails\": {}, \n  \"subscriptionDetails\": null, \n  \"title\": \"This is an example Python exception\", \n  \"type\": \"default\", \n  \"userCount\": 0\n}", 
  "method": "PUT", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the ID of the group to retrieve.", 
      "name": "issue_id", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 7, 
  "title": "Events"
}
---
