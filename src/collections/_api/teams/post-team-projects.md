---
{
  "authentication": "required", 
  "description": "Create a new project bound to a team.", 
  "example_request": "POST /api/0/teams/the-interstellar-jurisdiction/powerful-abolitionist/projects/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}\nContent-Type: application/json\n\n{\n  \"name\": \"The Spoiled Yoghurt\"\n}", 
  "example_response": "HTTP/1.1\nContent-Length: 406\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, POST, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json\n\n{\n  \"avatar\": {\n    \"avatarType\": \"letter_avatar\", \n    \"avatarUuid\": null\n  }, \n  \"color\": \"#bf6e3f\", \n  \"dateCreated\": \"2018-09-10T20:36:48.492Z\", \n  \"features\": [\n    \"data-forwarding\", \n    \"rate-limits\"\n  ], \n  \"firstEvent\": null, \n  \"hasAccess\": true, \n  \"id\": \"4\", \n  \"isBookmarked\": false, \n  \"isInternal\": false, \n  \"isMember\": false, \n  \"isPublic\": false, \n  \"name\": \"The Spoiled Yoghurt\", \n  \"platform\": null, \n  \"slug\": \"the-spoiled-yoghurt\", \n  \"status\": \"active\"\n}", 
  "method": "POST", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the slug of the organization the team belongs to.", 
      "name": "organization_slug", 
      "type": "string"
    }, 
    {
      "description": "the slug of the team to create a new project for.", 
      "name": "team_slug", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 7, 
  "title": "Teams"
}
---
