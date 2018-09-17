---
{
  "authentication": "required", 
  "description": "Upload a new file for the given release.Unlike other API requests, files must be uploaded using thetraditional multipart/form-data content-type.The optional 'name' attribute should reflect the absolute paththat this file will be referenced as. For example, in the case ofJavaScript you might specify the full web URI.", 
  "example_request": "", 
  "example_response": "", 
  "method": "POST", 
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
  "sidebar_order": 7, 
  "title": "Releases"
}
---
