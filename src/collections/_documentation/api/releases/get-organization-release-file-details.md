---
{
  "authentication": "required", 
  "description": "Return details on an individual file within a release.  This doesnot actually return the contents of the file, just the associatedmetadata.", 
  "example_request": "", 
  "example_response": "", 
  "method": "GET", 
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
    }, 
    {
      "description": "the ID of the file to retrieve.", 
      "name": "file_id", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 8, 
  "title": "Releases"
}
---
