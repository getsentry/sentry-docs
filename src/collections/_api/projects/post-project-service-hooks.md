---
{
  "authentication": "", 
  "description": "Register a new service hook on a project.Events include:- event.alert: An alert is generated for an event (via rules).- event.created: A new event has been processed.", 
  "example_request": "POST /api/0/projects/the-interstellar-jurisdiction/pump-station/hooks/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}\nContent-Type: application/json\n\n{\n  \"events\": [\n    \"event.alert\", \n    \"event.created\"\n  ], \n  \"url\": \"https://example.com/sentry-hook\"\n}", 
  "example_response": "HTTP/1.1\nContent-Length: 0\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, POST, HEAD, OPTIONS\nX-Frame-Options: deny", 
  "method": "POST", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the slug of the organization the client keys belong to.", 
      "name": "organization_slug", 
      "type": "string"
    }, 
    {
      "description": "the slug of the project the client keys belong to.", 
      "name": "project_slug", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 8, 
  "title": "Projects"
}
---
