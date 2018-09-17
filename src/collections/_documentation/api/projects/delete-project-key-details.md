---
{
  "authentication": "required", 
  "description": "Delete a client key.", 
  "example_request": "DELETE /api/0/projects/the-interstellar-jurisdiction/pump-station/keys/d49dafb411c343418371daaa421a7461/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}", 
  "example_response": "HTTP/1.1\nContent-Length: 0\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, PUT, DELETE, HEAD, OPTIONS\nX-Frame-Options: deny", 
  "method": "DELETE", 
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
    }, 
    {
      "description": "the ID of the key to delete.", 
      "name": "key_id", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 15, 
  "title": "Projects"
}
---
