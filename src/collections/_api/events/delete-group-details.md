---
{
  "authentication": "required", 
  "description": "Removes an individual issue.", 
  "example_request": "DELETE /api/0/issues/5/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}", 
  "example_response": "HTTP/1.1\nContent-Length: 0\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, PUT, DELETE, HEAD, OPTIONS\nX-Frame-Options: deny", 
  "method": "DELETE", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the ID of the issue to delete.", 
      "name": "issue_id", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 8, 
  "title": "Events"
}
---
