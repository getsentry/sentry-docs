---
{
  "authentication": "required", 
  "description": "Update various attributes and configurable settings for the givenorganization.", 
  "example_request": "PUT /api/0/organizations/badly-misnamed/ HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer {base64-encoded-key-here}\nContent-Type: application/json\n\n{\n  \"name\": \"Impeccably Designated\", \n  \"slug\": \"impeccably-designated\"\n}", 
  "example_response": "HTTP/1.1\nContent-Length: 1136\nX-XSS-Protection: 1; mode=block\nContent-Language: en\nX-Content-Type-Options: nosniff\nVary: Accept-Language, Cookie\nAllow: GET, PUT, DELETE, HEAD, OPTIONS\nX-Frame-Options: deny\nContent-Type: application/json\n\n{\n  \"access\": [], \n  \"allowSharedIssues\": true, \n  \"availableRoles\": [\n    {\n      \"id\": \"member\", \n      \"name\": \"Member\"\n    }, \n    {\n      \"id\": \"admin\", \n      \"name\": \"Admin\"\n    }, \n    {\n      \"id\": \"manager\", \n      \"name\": \"Manager\"\n    }, \n    {\n      \"id\": \"owner\", \n      \"name\": \"Owner\"\n    }\n  ], \n  \"avatar\": {\n    \"avatarType\": \"letter_avatar\", \n    \"avatarUuid\": null\n  }, \n  \"dataScrubber\": false, \n  \"dataScrubberDefaults\": false, \n  \"dateCreated\": \"2018-09-10T20:37:01.214Z\", \n  \"defaultRole\": \"member\", \n  \"enhancedPrivacy\": false, \n  \"experiments\": {}, \n  \"features\": [\n    \"sso\", \n    \"api-keys\", \n    \"github-apps\", \n    \"new-settings\", \n    \"repos\", \n    \"new-issue-ui\", \n    \"github-enterprise\", \n    \"jira-integration\", \n    \"suggested-commits\", \n    \"new-teams\", \n    \"open-membership\", \n    \"shared-issues\"\n  ], \n  \"id\": \"3\", \n  \"isDefault\": false, \n  \"isEarlyAdopter\": false, \n  \"name\": \"Impeccably Designated\", \n  \"onboardingTasks\": [], \n  \"openMembership\": true, \n  \"pendingAccessRequests\": 0, \n  \"projects\": [], \n  \"quota\": {\n    \"accountLimit\": 0, \n    \"maxRate\": 0, \n    \"maxRateInterval\": 60, \n    \"projectLimit\": 100\n  }, \n  \"require2FA\": false, \n  \"safeFields\": [], \n  \"scrapeJavaScript\": true, \n  \"scrubIPAddresses\": false, \n  \"sensitiveFields\": [], \n  \"slug\": \"impeccably-designated\", \n  \"status\": {\n    \"id\": \"active\", \n    \"name\": \"active\"\n  }, \n  \"storeCrashReports\": false, \n  \"teams\": []\n}", 
  "method": "PUT", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the slug of the organization the team should be created for.", 
      "name": "organization_slug", 
      "type": "string"
    }
  ], 
  "query_parameters": null, 
  "sidebar_order": 4, 
  "title": "Organizations"
}
---
