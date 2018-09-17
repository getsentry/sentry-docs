---
{
  "authentication": "required", 
  "description": "Upload a new file for the given release.Unlike other API requests, files must be uploaded using thetraditional multipart/form-data content-type.The optional 'name' attribute should reflect the absolute paththat this file will be referenced as. For example, in the case ofJavaScript you might specify the full web URI.", 
  "example_request": "POST /api/0/projects/the-interstellar-jurisdiction/pump-station/releases/88dc638c8ccb84e5b7c750da882232aa1b394ac1/files/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}\nContent-Type: multipart/form-data; boundary=17410b7afb71494db1e46f9723c56fec\n\n\"--17410b7afb71494db1e46f9723c56fec\\r\\nContent-Disposition: form-data; name=\\\"header\\\"\\r\\n\\r\\nContent-Type:text/plain; encoding=utf-8\\r\\n--17410b7afb71494db1e46f9723c56fec\\r\\nContent-Disposition: form-data; name=\\\"name\\\"\\r\\n\\r\\n/demo/hello.py\\r\\n--17410b7afb71494db1e46f9723c56fec\\r\\nContent-Disposition: form-data; name=\\\"file\\\"; filename=\\\"hello.py\\\"\\r\\n\\r\\nprint \\\"Hello World!\\\"\\r\\n--17410b7afb71494db1e46f9723c56fec--\\r\\n\"", 
  "example_response": "HTTP/1.1\nContent-Length: 217\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, POST, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json\n\n{\n  \"dateCreated\": \"2018-09-10T20:37:04.913Z\", \n  \"dist\": null, \n  \"headers\": {\n    \"Content-Type\": \"text/plain; encoding=utf-8\"\n  }, \n  \"id\": \"4\", \n  \"name\": \"/demo/hello.py\", \n  \"sha1\": \"7dc0876d778eae1093028f7bf368d0b95a53ec1a\", \n  \"size\": 20\n}", 
  "method": "POST", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the slug of the organization the release belongs to.", 
      "name": "organization_slug", 
      "type": "string"
    }, 
    {
      "description": "the slug of the project to change the release of.", 
      "name": "project_slug", 
      "type": "string"
    }, 
    {
      "description": "the version identifier of the release.", 
      "name": "version", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 18, 
  "title": "Releases"
}
---
