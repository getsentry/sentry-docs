---
# Note: Normally this file would be automatically generated from the API using `api-docs/generate.py`
{
  "api_path": "/api/0/organizations/{organization_slug}/users/", 
  "authentication": "required", 
  "description": "Return a list of users that belong to a given organization.", 
  "example_request": "GET /api/0/organizations/the-interstellar-jurisdiction/users/?project=123456 HTTP/1.1\nHost: sentry.io\nAuthorization: Bearer <token>", 
  "example_response": "HTTP/1.1 200 OK\nContent-Language: en\nContent-Type: application/json\nContent-Length: 886\nX-Content-Type-Options: nosniff\nX-XSS-Protection: 1; mode=block\nAllow: GET, HEAD, OPTIONS\nX-Frame-Options: deny\n\n
 [\n
  {\n
    \"dateCreated\": \"2019-05-09T18:06:01.728Z\", \n
    \"user\": { \n
      \"username\": \"testEmail@test.com\", \n
      \"lastLogin\": \"2019-09-16T02:56:06.806Z\", \n
      \"isSuperuser\": false, \n
      \"isManaged\": false, \n
      \"lastActive\": \"2019-10-08T15:05:38.715Z\", \n
      \"isStaff\": false, \n
      \"id\": \"433307\", \n
      \"isActive\": true, \n
      \"has2fa\": false, \n
      \"name\": \"OtherTest McTestuser\", \n
      \"avatarUrl\":
        \"https://secure.gravatar.com/avatar/1eb103c0e899f372a85eb0a44f0a0f42?s=32&d=mm\", \n
      \"dateJoined\": \"2019-05-09T18:06:01.443Z\", \n
      \"emails\": [{ is_verified: true, id: \"468229\", email: \"testEmail@test.com\" }], \n
      \"avatar\": { avatarUuid: null, avatarType: \"letter_avatar\" }, \n
      \"hasPasswordAuth\": false, \n
      \"email\": \"testEmail@test.com\"  \n
    }, \n
    \"roleName\": \"Organization Owner\", \n
    \"expired\": false, \n
    \"id\": \"9376061\", \n
    \"projects\": [\"buggy-sentry-project\"], \n
    \"name\": \"OtherTest McTestuser\", \n
    \"role\": \"owner\", \n
    \"flags\": { \"sso:linked\": false, \"sso:invalid\": false }, \n
    \"email\": \"testEmail@test.com\", \n
    \"pending\": false \n
  }, \n
  { \n
    \"dateCreated\": \"2019-09-30T16:06:51.949Z\", \n
    \"user\": { \n
      \"username\": \"otherTestEmail@test.com\", \n
      \"lastLogin\": \"2019-09-30T16:08:10.517Z\", \n
      \"isSuperuser\": false, \n
      \"isManaged\": false, \n
      \"lastActive\": \"2019-10-02T23:15:43.773Z\", \n
      \"isStaff\": false, \n
      \"id\": \"518100\", \n
      \"isActive\": true, \n
      \"has2fa\": false, \n
      \"name\": \"OtherTest McTestuser\", \n
      \"avatarUrl\":
        \"https://secure.gravatar.com/avatar/7828bc81ef4bbd6d38d749803e1a02c6?s=32&d=mm\", \n
      \"dateJoined\": \"2019-09-30T16:08:09.839Z\", \n
      \"emails\": [{ is_verified: true, id: \"562269\", email: \"otherTestEmail@test.com\" }], \n
      \"avatar\": { avatarUuid: null, avatarType: \"letter_avatar\" }, \n
      \"hasPasswordAuth\": true, \n
      \"email\": \"otherTestEmail@test.com\" \n
    }, \n
    \"roleName\": \"Member\", \n
    \"expired\": false, \n
    \"id\": \"9496972\", \n
    \"projects\": [\"buggy-sentry-project\"], \n
    \"name\": \"OtherTest McTestuser\", \n
    \"role\": \"member\", \n
    \"flags\": { \"sso:linked\": false, \"sso:invalid\": false }, \n
    \"email\": \"otherTestEmail@test.com\", \n
    \"pending\": false \n
  } \n
]",
 "method": "GET", 
  "parameters": null, 
  "path_parameters": [
    {
      "description": "the slug of the organization for which the users should be listed.", 
      "name": "organization_slug", 
      "type": "string"
    }
  ], 
  "query_parameters": [
    {
      "description": "restrict results to users who have access to a given project ID", 
      "name": "project", 
      "type": "string"
    } 
  ], 
  "sidebar_order": 8, 
  "title": "List an Organization's Users", 
  "warning": null
}
---
