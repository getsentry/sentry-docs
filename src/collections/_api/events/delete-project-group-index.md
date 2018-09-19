---
{
  "authentication": "required",
  "description": "Permanently remove the given issues. The list of issues tomodify is given through the `id` query parameter.  It is repeatedfor each issue that should be removed.Only queries by 'id' are accepted.If any ids are out of scope this operation will succeed withoutany data mutation.",
  "example_request": "DELETE /api/0/projects/the-interstellar-jurisdiction/amazing-plumbing/issues/?id=5&id=6 HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}",
  "example_response": "HTTP/1.1\nContent-Length: 0\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, PUT, DELETE, HEAD, OPTIONS\nX-Frame-Options: deny",
  "method": "DELETE",
  "parameters": null,
  "path_parameters": [
    {
      "description": "the slug of the organization the issues belong to.",
      "name": "organization_slug",
      "type": "string"
    },
    {
      "description": "the slug of the project the issues belong to.",
      "name": "project_slug",
      "type": "string"
    }
  ],
  "query_parameters": [
    {
      "description": "a list of IDs of the issues to be removed.  This parameter shall be repeated for each issue.",
      "name": "id",
      "type": "int"
    }
  ],
  "sidebar_order": 5,
  "title": "Events"
}
---
