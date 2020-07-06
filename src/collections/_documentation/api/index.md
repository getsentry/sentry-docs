---
title: 'API Reference'
sidebar_order: 6
---

The Sentry API is used for submitting events to the Sentry collector as well as exporting and managing data. The reporting and web APIs are individually versioned. This document refers to the web APIs only. For information about the reporting API see [_SDK Development_](https://develop.sentry.dev/sdk/overview/).

## Versioning

The current version of the web API is known as **v0** and is considered to be in a draft phase. While we don’t expect public endpoints to change greatly, keep in mind that the API is still under development.

## Reference

-   [Requests](/api/requests/)
-   [Authentication](/api/auth/)
-   [Permissions](/api/permissions/)
-   [Pagination](/api/pagination/)

## Endpoints

A full list of the currently supported API endpoints:

-   Issues
    -   [List a Project’s Issues](/api/events/get-project-group-index/)
    -   [Retrieve an Issue](/api/events/get-group-details/)
    -   [Update an Issue](/api/events/put-group-details/)
    -   [Remove an Issue](/api/events/delete-group-details/)
    -   [List an Issue’s Events](/api/events/get-group-events/)
    -   [List an Issue’s Hashes](/api/events/get-group-hashes/)
    -   [Retrieve an Issue Tag's Details](/api/events/get-group-tag-key-details/)
    -   [List an Issue Tag’s Values](/api/events/get-group-tag-key-values/)
    -   [Retrieve the Newest Event for an Issue](/api/events/get-group-events-latest/)
    -   [Retrieve the Oldest Event for an Issue](/api/events/get-group-events-oldest/)
    -   [Bulk Mutate a List of Issues](/api/events/put-project-group-index/)
    -   [Bulk Remove a List of Issues](/api/events/delete-project-group-index/)
-   [Events](/api/events/)
    -   [List a Project’s Events](/api/events/get-project-events/)
    -   [Resolve an Event ID](/api/organizations/get-event-id-lookup/)
    -   [Resolve a Short ID](/api/organizations/get-short-id-lookup/)
    -   [Retrieve an Event for a Project](/api/events/get-project-event-details/)
    -   [Retrieve Event Counts for a Project](/api/projects/get-project-stats/)
    -   [Retrieve Event Counts for a Team](/api/teams/get-team-stats/)
-   User Feedback
    -   [List a Project’s User Feedback](/api/projects/get-project-user-reports/)
    -   [Submit User Feedback](/api/projects/post-project-user-reports/)
-   [Releases](/api/releases/)
    -   [List Releases](/api/releases/get-organization-releases/)
    -   [Retrieve a Release](/api/releases/get-organization-release-details/)
    -   [Create a New Release](/api/releases/post-organization-releases/)
    -   [Update a Release](/api/releases/put-organization-release-details/)
    -   [Delete a Release](/api/releases/delete-organization-release-details/)
    -   [List issues to be resolved in a particular release](/api/releases/get-project-issues-resolved-in-release/)
    -   Deploys
        -   [List a Release’s Deploys](/api/releases/get-release-deploys/)
        -   [Create a Deploy](/api/releases/post-release-deploys/)
    -   Files
        -   [List Files](/api/releases/get-organization-release-files/)
        -   [Retrieve a File](/api/releases/get-organization-release-file-details/)
        -   [Upload a New File](/api/releases/post-organization-release-files/)
        -   [Update a File](/api/releases/put-organization-release-file-details/)
        -   [Delete a File](/api/releases/delete-organization-release-file-details/)
    -   Commits
        -   [List a Release’s Commits](/api/releases/get-organization-release-commits/)
        -   [Retrieve Files Changed in a Release’s Commits](/api/releases/get-commit-file-change/)
-   [Organizations](/api/organizations/)
    -   [Create a New Organization](/api/organizations/post-organization-index/)
    -   [Delete an Organization](/api/organizations/delete-organization-details/)
    -   [List a Repository’s Commits](/api/organizations/get-organization-repository-commits/)
    -   [List an Organization’s Projects](/api/organizations/get-organization-projects/)
    -   [List an Organization’s Repositories](/api/organizations/get-organization-repositories/)
    -   [List your Organizations](/api/organizations/get-organization-index/)
    -   [Retrieve an Organization](/api/organizations/get-organization-details/)
    -   [Retrieve Event Counts for an Organization](/api/organizations/get-organization-stats/)
    -   [Update an Organization](/api/organizations/put-organization-details/)
-   [Projects](/api/projects/)
    -   [List your Projects](/api/projects/get-project-index/)
    -   [Create a New Project](/api/teams/post-team-projects/)
    -   [Retrieve a Project](/api/projects/get-project-details/)
    -   [Update a Project](/api/projects/put-project-details/)
    -   [Delete a Project](/api/projects/delete-project-details/)
    -   [List a Project’s Users](/api/projects/get-project-users/)
    -   [List a Tag’s Values](/api/projects/get-project-tag-key-values/)
    -   [List a Team’s Projects](/api/teams/get-team-projects/)
    -   Client Keys
        -   [List a Project’s Client Keys](/api/projects/get-project-keys/)
        -   [Create a new Client Key](/api/projects/post-project-keys/)
        -   [Update a Client Key](/api/projects/put-project-key-details/)
        -   [Delete a Client Key](/api/projects/delete-project-key-details/)
    -   Service Hooks (Beta)
        -   [List a Project’s Service Hooks](/api/projects/get-project-service-hooks/)
        -   [Retrieve a Service Hook](/api/projects/get-project-service-hook-details/)
        -   [Create a new Service Hook](/api/projects/post-project-service-hooks/)
        -   [Update a Service Hook](/api/projects/put-project-service-hook-details/)
        -   [Remove a Service Hook](/api/projects/delete-project-service-hook-details/)
-   [Teams](/api/teams/)
    -   [List an Organization’s Teams](/api/teams/get-organization-teams/)
    -   [Create a new Team](/api/teams/post-organization-teams/)
    -   [Retrieve a Team](/api/teams/get-team-details/)
    -   [Update a Team](/api/teams/put-team-details/)
    -   [Delete a Team](/api/teams/delete-team-details/)
