---
title: 'API Reference'
sidebar_order: 6
---

The Sentry API is used for submitting events to the Sentry collector as well as exporting and managing data. The reporting and web APIs are individually versioned. This document refers to the web APIs only. For information about the reporting API see [_SDK Development_]({%- link _documentation/development/sdk-dev/index.md -%}).

## Versioning

The current version of the web API is known as **v0** and is considered to be in a draft phase. While we don’t expect public endpoints to change greatly, keep in mind that the API is still under development.

## Reference

-   [Requests]({%- link _documentation/api/requests.md -%})
-   [Authentication]({%- link _documentation/api/auth.md -%})
-   [Pagination]({%- link _documentation/api/pagination.md -%})

## Endpoints

A full list of the currently supported API endpoints:

-   Issues
    -   [List a Project’s Issues]({%- link _documentation/api/events/get-project-group-index.md -%})
    -   [Retrieve an Issue]({%- link _documentation/api/events/get-group-details.md -%})
    -   [Update an Issue]({%- link _documentation/api/events/put-group-details.md -%})
    -   [Remove an Issue]({%- link _documentation/api/events/delete-group-details.md -%})
    -   [List an Issue’s Events]({%- link _documentation/api/events/get-group-events.md -%})
    -   [List an Issue’s Hashes]({%- link _documentation/api/events/get-group-hashes.md -%})
    -   [Retrieve an Issue Tag's Details]({%- link _documentation/api/events/get-group-tag-key-details.md -%})
    -   [List an Issue Tag’s Values]({%- link _documentation/api/events/get-group-tag-key-values.md -%})
    -   [Retrieve the Newest Event for an Issue]({%- link _documentation/api/events/get-group-events-latest.md -%})
    -   [Retrieve the Oldest Event for an Issue]({%- link _documentation/api/events/get-group-events-oldest.md -%})
    -   [Bulk Mutate a List of Issues]({%- link _documentation/api/events/put-project-group-index.md -%})
    -   [Bulk Remove a List of Issues]({%- link _documentation/api/events/delete-project-group-index.md -%})
-   [Events]({%- link _documentation/api/events/index.md -%})
    -   [List a Project’s Events]({%- link _documentation/api/events/get-project-events.md -%})
    -   [Resolve an Event ID]({%- link _documentation/api/organizations/get-event-id-lookup.md -%})
    -   [Resolve a Short ID]({%- link _documentation/api/organizations/get-short-id-lookup.md -%})
    -   [Retrieve an Event for a Project]({%- link _documentation/api/events/get-project-event-details.md -%})
    -   [Retrieve Event Counts for a Project]({%- link _documentation/api/projects/get-project-stats.md -%})
    -   [Retrieve Event Counts for a Team]({%- link _documentation/api/teams/get-team-stats.md -%})
-   User Feedback
    -   [List a Project’s User Feedback]({%- link _documentation/api/projects/get-project-user-reports.md -%})
    -   [Submit User Feedback]({%- link _documentation/api/projects/post-project-user-reports.md -%})
-   [Releases]({%- link _documentation/api/releases/index.md -%})
    -   [List Releases]({%- link _documentation/api/releases/get-organization-releases.md -%})
    -   [Retrieve a Release]({%- link _documentation/api/releases/get-organization-release-details.md -%})
    -   [Create a New Release]({%- link _documentation/api/releases/post-organization-releases.md -%})
    -   [Update a Release]({%- link _documentation/api/releases/put-organization-release-details.md -%})
    -   [Delete a Release]({%- link _documentation/api/releases/delete-organization-release-details.md -%})
    -   [List issues to be resolved in a particular release]({%- link _documentation/api/releases/get-issues-resolved-in-release.md -%})
    -   Deploys
        -   [List a Release’s Deploys]({%- link _documentation/api/releases/get-release-deploys.md -%})
        -   [Create a Deploy]({%- link _documentation/api/releases/post-release-deploys.md -%})
    -   Files
        -   [List Files]({%- link _documentation/api/releases/get-organization-release-files.md -%})
        -   [Retrieve a File]({%- link _documentation/api/releases/get-organization-release-file-details.md -%})
        -   [Upload a New File]({%- link _documentation/api/releases/post-organization-release-files.md -%})
        -   [Update a File]({%- link _documentation/api/releases/put-organization-release-file-details.md -%})
        -   [Delete a File]({%- link _documentation/api/releases/delete-organization-release-file-details.md -%})
    -   Commits
        -   [List a Release’s Commits]({%- link _documentation/api/releases/get-organization-release-commits.md -%})
        -   [Retrieve Files Changed in a Release’s Commits]({%- link _documentation/api/releases/get-commit-file-change.md -%})
-   [Organizations]({%- link _documentation/api/organizations/index.md -%})
    -   [Create a New Organization]({%- link _documentation/api/organizations/post-organization-index.md -%})
    -   [Delete an Organization]({%- link _documentation/api/organizations/delete-organization-details.md -%})
    -   [List a Repository’s Commits]({%- link _documentation/api/organizations/get-organization-repository-commits.md -%})
    -   [List an Organization’s Projects]({%- link _documentation/api/organizations/get-organization-projects.md -%})
    -   [List an Organization’s Repositories]({%- link _documentation/api/organizations/get-organization-repositories.md -%})
    -   [List your Organizations]({%- link _documentation/api/organizations/get-organization-index.md -%})
    -   [Retrieve an Organization]({%- link _documentation/api/organizations/get-organization-details.md -%})
    -   [Retrieve Event Counts for an Organization]({%- link _documentation/api/organizations/get-organization-stats.md -%})
    -   [Update an Organization]({%- link _documentation/api/organizations/put-organization-details.md -%})
-   [Projects]({%- link _documentation/api/projects/index.md -%})
    -   [List your Projects]({%- link _documentation/api/projects/get-project-index.md -%})
    -   [Create a New Project]({%- link _documentation/api/teams/post-team-projects.md -%})
    -   [Retrieve a Project]({%- link _documentation/api/projects/get-project-details.md -%})
    -   [Update a Project]({%- link _documentation/api/projects/put-project-details.md -%})
    -   [Delete a Project]({%- link _documentation/api/projects/delete-project-details.md -%})
    -   [List a Project’s Users]({%- link _documentation/api/projects/get-project-users.md -%})
    -   [List a Tag’s Values]({%- link _documentation/api/projects/get-project-tag-key-values.md -%})
    -   [List a Team’s Projects]({%- link _documentation/api/teams/get-team-projects.md -%})
    -   Client Keys
        -   [List a Project’s Client Keys]({%- link _documentation/api/projects/get-project-keys.md -%})
        -   [Create a new Client Key]({%- link _documentation/api/projects/post-project-keys.md -%})
        -   [Update a Client Key]({%- link _documentation/api/projects/put-project-key-details.md -%})
        -   [Delete a Client Key]({%- link _documentation/api/projects/delete-project-key-details.md -%})
    -   Service Hooks (Beta)
        -   [List a Project’s Service Hooks]({%- link _documentation/api/projects/get-project-service-hooks.md -%})
        -   [Retrieve a Service Hook]({%- link _documentation/api/projects/get-project-service-hook-details.md -%})
        -   [Create a new Service Hook]({%- link _documentation/api/projects/post-project-service-hooks.md -%})
        -   [Update a Service Hook]({%- link _documentation/api/projects/put-project-service-hook-details.md -%})
        -   [Remove a Service Hook]({%- link _documentation/api/projects/delete-project-service-hook-details.md -%})
-   [Teams]({%- link _documentation/api/teams/index.md -%})
    -   [List an Organization’s Teams]({%- link _documentation/api/teams/get-organization-teams.md -%})
    -   [Create a new Team]({%- link _documentation/api/teams/post-organization-teams.md -%})
    -   [Retrieve a Team]({%- link _documentation/api/teams/get-team-details.md -%})
    -   [Update a Team]({%- link _documentation/api/teams/put-team-details.md -%})
    -   [Delete a Team]({%- link _documentation/api/teams/delete-team-details.md -%})
