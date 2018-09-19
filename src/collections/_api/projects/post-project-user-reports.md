---
{
  "authentication": "required", 
  "description": "Submit and associate user feedback with an issue.", 
  "example_request": "POST /api/0/projects/the-interstellar-jurisdiction/plain-proxy/user-feedback/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}\nContent-Type: application/json\n\n{\n  \"comments\": \"It broke!\", \n  \"email\": \"jane@example.com\", \n  \"event_id\": \"2ceeaba521024f7a9d30378e40bddb61\", \n  \"name\": \"Jane Smith\"\n}", 
  "example_response": "HTTP/1.1\nContent-Length: 276\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, POST, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json\n\n{\n  \"comments\": \"It broke!\", \n  \"dateCreated\": \"2018-09-10T20:36:52.355Z\", \n  \"email\": \"jane@example.com\", \n  \"event\": {\n    \"eventID\": \"2ceeaba521024f7a9d30378e40bddb61\", \n    \"id\": null\n  }, \n  \"eventID\": \"2ceeaba521024f7a9d30378e40bddb61\", \n  \"id\": \"1\", \n  \"issue\": null, \n  \"name\": \"Jane Smith\", \n  \"user\": null\n}", 
  "method": "POST", 
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
  "query_parameters": null, 
  "sidebar_order": 20, 
  "title": "Projects"
}
---
