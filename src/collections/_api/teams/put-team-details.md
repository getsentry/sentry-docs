---
{
  "authentication": "required", 
  "description": "Update various attributes and configurable settings for the giventeam.", 
  "example_request": "PUT /api/0/teams/the-interstellar-jurisdiction/the-obese-philosophers/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}\nContent-Type: application/json\n\n{\n  \"name\": \"The Inflated Philosophers\"\n}", 
  "example_response": "HTTP/1.1\nContent-Length: 246\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, PUT, DELETE, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json\n\n{\n  \"avatar\": {\n    \"avatarType\": \"letter_avatar\", \n    \"avatarUuid\": null\n  }, \n  \"dateCreated\": \"2018-09-10T20:37:04.882Z\", \n  \"hasAccess\": true, \n  \"id\": \"4\", \n  \"isMember\": false, \n  \"isPending\": false, \n  \"name\": \"The Inflated Philosophers\", \n  \"slug\": \"the-obese-philosophers\"\n}", 
  "method": "PUT", 
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
  "sidebar_order": 4, 
  "title": "Teams"
}
---
