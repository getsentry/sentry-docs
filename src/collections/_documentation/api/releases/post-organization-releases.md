---
{
  "authentication": "required", 
  "description": "Create a new release for the given Organization.  Releases are used bySentry to improve its error reporting abilities by correlatingfirst seen events with the release that might have introduced theproblem.Releases are also necessary for sourcemaps and other debug featuresthat require manual upload for functioning well.", 
  "example_request": "POST /api/0/organizations/the-interstellar-jurisdiction/releases/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}\nContent-Type: application/json\n\n{\n  \"projects\": [\n    \"pump-station\"\n  ], \n  \"ref\": \"6ba09a7c53235ee8a8fa5ee4c1ca8ca886e7fdbb\", \n  \"version\": \"2.0rc2\"\n}", 
  "example_response": "HTTP/1.1\nContent-Length: 413\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, POST, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json\n\n{\n  \"authors\": [], \n  \"commitCount\": 0, \n  \"data\": {}, \n  \"dateCreated\": \"2018-09-10T20:36:48.447Z\", \n  \"dateReleased\": null, \n  \"deployCount\": 0, \n  \"firstEvent\": null, \n  \"lastCommit\": null, \n  \"lastDeploy\": null, \n  \"lastEvent\": null, \n  \"newGroups\": 0, \n  \"owner\": null, \n  \"projects\": [\n    {\n      \"name\": \"Pump Station\", \n      \"slug\": \"pump-station\"\n    }\n  ], \n  \"ref\": \"6ba09a7c53235ee8a8fa5ee4c1ca8ca886e7fdbb\", \n  \"shortVersion\": \"2.0rc2\", \n  \"url\": null, \n  \"version\": \"2.0rc2\"\n}", 
  "method": "POST", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the slug of the organization the release belongs to.", 
      "name": "organization_slug", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 2, 
  "title": "Releases"
}
---
