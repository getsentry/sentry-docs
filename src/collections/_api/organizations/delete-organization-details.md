---
{
  "authentication": "required, user-context-needed", 
  "description": "Schedules an organization for deletion.  This API endpoint cannotbe invoked without a user context for security reasons.  This meansthat at present an organization can only be deleted from theSentry UI.Deletion happens asynchronously and therefor is not immediate.However once deletion has begun the state of a project changes andwill be hidden from most public views.", 
  "example_request": "", 
  "example_response": "", 
  "method": "DELETE", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the slug of the organization the team should be created for.", 
      "name": "organization_slug", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 5, 
  "title": "Organizations"
}
---
