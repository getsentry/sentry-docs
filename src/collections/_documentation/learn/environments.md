---
title: Environments
sidebar_order: 5
example_environment: "staging"
---

_Note: The environments feature is only available for early adopters. You can enable early adopter features by navigating to your organization settings._

As of Sentry 9, you can easily filter issues, releases, and user feedback by environment. On the top right of your screen, you’ll see a dropdown of different environments. Toggling between environments will allow you to see issue data, release data, and user feedback data filtered by environment.

[{% asset environment_filter.png %}]({% asset environment_filter.png @path %})

# Inside the Environment Filter

**Issues**

Sentry defines an issue as a grouping of similar events. If one or more events within an issue are tagged with a certain environment, that issue will appear in your view when filtered by that environment. For example, if an issue is composed of one event tagged with `Production` and one event tagged with `Staging`, the issue will appear in your view when filtering by `Production` as well as by `Staging`.

In addition, the environment filter affects all issue-related metrics like count of users affected, times series graphs, and event count.

**Releases**

You can filter releases by which environment they’ve been deployed to (to learn more about configuring releases and deploys, click [here]({%- link _documentation/learn/releases.md -%})). For example, a release linked to a `QA` deploy and a `Prod` deploy will appear in your view when filtering by `QA` as well as `Prod`. All issue-related metics within a given release will be affected by the environment filter.

# Hiding environments

If a certain environment is not a useful filter for your team, you can hide the environment from your environments dropdown by navigating to your project settings > Environments, and selecting ‘Hide’. Data sent from that environment will still be visible under _All Environments_, and will still count against your quota.

If you want to change the name of a given environment, you will have to modify your SDK configuration. _Note: this will not change environment names for past data._

# Setting a Default Environment

If you would like to see Sentry filtered by a certain environment every time you open Sentry, you can set a default environment by navigating to your project settings > Environments, and clicking ‘Set as default.’

[{% asset manage_environments.png %}]({% asset manage_environments.png @path %})

# How to send environment data

Environment data is sent to Sentry by tagging issues via your SDK:

{% include components/platform_content.html content_dir='set-environment' %}
