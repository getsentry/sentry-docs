---
{
  "authentication": "required", 
  "description": "Bulk mutate various attributes on issues.  The list of issuesto modify is given through the `id` query parameter.  It is repeatedfor each issue that should be modified.- For non-status updates, the `id` query parameter is required.- For status updates, the `id` query parameter may be omittedfor a batch \"update all\" query.- An optional `status` query parameter may be used to restrictmutations to only events with the given status.The following attributes can be modified and are supplied asJSON object in the body:If any ids are out of scope this operation will succeed withoutany data mutation.", 
  "example_request": "PUT /api/0/projects/the-interstellar-jurisdiction/pump-station/issues/?id=1&id=2 HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}\nContent-Type: application/json\n\n{\n  \"isPublic\": false, \n  \"status\": \"unresolved\"\n}", 
  "example_response": "HTTP/1.1\nContent-Length: 64\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, PUT, DELETE, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json\n\n{\n  \"isPublic\": false, \n  \"status\": \"unresolved\", \n  \"statusDetails\": {}\n}", 
  "method": "PUT", 
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
      "description": "a list of IDs of the issues to be mutated.  This parameter shall be repeated for each issue.  It is optional only if a status is mutated in which case an implicit update all is assumed.", 
      "name": "id", 
      "type": "int"
    }, 
    {
      "description": "optionally limits the query to issues of the specified status.  Valid values are \"resolved\", \"unresolved\" and \"ignored\".", 
      "name": "status", 
      "type": "string"
    }
  ], 
  "sidebar_order": 4, 
  "title": "Events"
}
---
