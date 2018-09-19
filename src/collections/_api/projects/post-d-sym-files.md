---
{
  "authentication": "required", 
  "description": "Upload a new dsym file for the given release.Unlike other API requests, files must be uploaded using thetraditional multipart/form-data content-type.The file uploaded is a zip archive of a Apple .dSYM folder whichcontains the individual debug images.  Uploading through this endpointwill create different files for the contained images.", 
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
      "description": "the slug of the project to change the release of.", 
      "name": "project_slug", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 6, 
  "title": "Projects"
}
---
