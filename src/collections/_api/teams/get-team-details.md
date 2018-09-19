---
{
  "authentication": "required", 
  "description": "Return details on an individual team.", 
  "example_request": "GET /api/0/teams/the-interstellar-jurisdiction/powerful-abolitionist/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}", 
  "example_response": "HTTP/1.1\nContent-Length: 550\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, PUT, DELETE, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json\n\n{\n  \"avatar\": {\n    \"avatarType\": \"letter_avatar\", \n    \"avatarUuid\": null\n  }, \n  \"dateCreated\": \"2018-09-10T20:36:34.557Z\", \n  \"hasAccess\": true, \n  \"id\": \"2\", \n  \"isMember\": false, \n  \"isPending\": false, \n  \"name\": \"Powerful Abolitionist\", \n  \"organization\": {\n    \"avatar\": {\n      \"avatarType\": \"letter_avatar\", \n      \"avatarUuid\": null\n    }, \n    \"dateCreated\": \"2018-09-10T20:36:34.545Z\", \n    \"id\": \"2\", \n    \"isEarlyAdopter\": false, \n    \"name\": \"The Interstellar Jurisdiction\", \n    \"require2FA\": false, \n    \"slug\": \"the-interstellar-jurisdiction\", \n    \"status\": {\n      \"id\": \"active\", \n      \"name\": \"active\"\n    }\n  }, \n  \"slug\": \"powerful-abolitionist\"\n}", 
  "method": "GET", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the slug of the organization the team belongs to.", 
      "name": "organization_slug", 
      "type": "string"
    }, 
    {
      "description": "the slug of the team to get.", 
      "name": "team_slug", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 3, 
  "title": "Teams"
}
---
