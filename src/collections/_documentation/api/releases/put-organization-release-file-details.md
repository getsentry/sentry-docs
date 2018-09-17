---
{
  "authentication": "required", 
  "description": "Update metadata of an existing file.  Currently only the name ofthe file can be changed.", 
  "example_request": "", 
  "example_response": "", 
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
    }, 
    {
      "description": "the ID of the file to update.", 
      "name": "file_id", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 9, 
  "title": "Releases"
}
---
