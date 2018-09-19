---
{
  "authentication": "required", 
  "description": "Update a release. This can change some metadata associated withthe release (the ref, url, and dates).", 
  "example_request": "PUT /api/0/organization/the-interstellar-jurisdiction/releases/3000/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}\nContent-Type: application/json\n\n{\n  \"ref\": \"deadbeef1337\", \n  \"url\": \"https://vcshub.invalid/user/project/refs/deadbeef1337\"\n}", 
  "example_response": "HTTP/1.1\nContent-Length: 0\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nX-Frame-Options: deny\nContent-Type: text/html; charset=utf-8", 
  "method": "PUT", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the slug of the organization the release belongs to.", 
      "name": "organization_slug", 
      "type": "string"
    }, 
    {
      "description": "the version identifier of the release.", 
      "name": "version", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 4, 
  "title": "Releases"
}
---
