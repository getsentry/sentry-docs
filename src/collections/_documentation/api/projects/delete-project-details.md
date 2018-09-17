---
{
  "authentication": "required", 
  "description": "Schedules a project for deletion.Deletion happens asynchronously and therefor is not immediate.However once deletion has begun the state of a project changes andwill be hidden from most public views.", 
  "example_request": "DELETE /api/0/projects/the-interstellar-jurisdiction/plain-proxy/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}", 
  "example_response": "HTTP/1.1\nContent-Length: 75\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, PUT, DELETE, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json\n\n{\n  \"detail\": \"Internal Error\", \n  \"errorId\": \"55d54ce4b3a74f8ebd708be68b5de34f\"\n}", 
  "method": "DELETE", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the slug of the organization the project belongs to.", 
      "name": "organization_slug", 
      "type": "string"
    }, 
    {
      "description": "the slug of the project to delete.", 
      "name": "project_slug", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 4, 
  "title": "Projects"
}
---
