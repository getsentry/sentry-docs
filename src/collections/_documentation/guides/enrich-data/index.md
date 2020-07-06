---
title: Put your Data to Work
sidebar_order: 4
---

The Sentry SDK captures errors, exceptions, crashes, and generally anything that goes wrong in your application in real-time.
Once captured, the SDK will enrich the error data with contextual information that it grabs from the application's runtime and send all this data as an **event** to your Sentry account.

While Sentry adds a lot of this contextual data by default, we highly encourage you to **add your custom data** through the SDK. Multiple Sentry workflows and tools can be configured and fine-tuned based on this data - so adapting those to the way you work, will go a long way in getting even more value out of Sentry.

## Types of Data

The SDK allows you to set various types of data that will then be attached to every event that occurs in your application. Generally, those data types are :

1. **Unstructured Data** - include additional data like `Breadcrumbs`, `Extra data`, and `Custom Contexts`. While these fields are **unsearchable**, they enrich your events with information that will help you debug and resolve the associated issues.

2. **Structured Data** - key/value pairs that are **indexed and searchable**, allowing you to search, filter, and query **through all your errors** cross-project in addition to helping you debug specific issues. These include:

    - `Custom Tags` - are a way to reflect key characteristics that apply to your applications, dev process, or business in your error data - variants and flavors of your app, a user type, tenant ID, payment plan, etc.
    - `Release` and `Environment` - are predefined data fields available as SDK configuration options.
    - `User Context` - comprised of a set of predefined data fields. Setting any one of those (when applicable), allows Sentry to construct a user identity and define user uniqueness.

For detailed information, see [Enriching Error Data](/enriching-error-data/additional-data/)

## Utilizing your Data

Adding custom **structured data** that is unique to your applications, users, and business logic enriches your error data and provides valuable context to every error. That same data can also be utilized to customize Sentry workflows and adapt them to your precise needs. Let's look at those major workflows:

### Alert Rules

Targeted alerts are key to focusing attention when your app breaks and notifying exactly the people who can fix it. The more data you add to your errors, the more flexibility you gain to create pinpointed alerts. The following data types can be incorporated in your alert rules by adding the relevant conditions to trigger the alert:

- **User Context**: Once a certain issue has impacted a defined threshold of unique users.
- **Custom Tags**: When events contain custom tag values that match your defined values.
- **Environment**: When events are occurring in a specific environment.

These can all come in handy in both issue and metric alerts, for instance:

1. **Issue Alerts**: The following rule will trigger a Slack message when **a certain issue** of level error or fatal, originating from my _EMEA* releases_ in my _production environment_ and _impacts more than 50 enterprise end-users in one hour_
    ![Additional Data for Issue Alerts]({% asset guides/enrich-data/002.png @path %})

2. **Metric Alerts**: The following rule will trigger a Slack message in case more than _50 enterprise end-users in an hour_ are impacted by _fatal level errors_ (**from multiple issues**) originating from my _EMEA* releases_ in my _production environment_.

    ![Additional Data for Metric Alerts]({% asset guides/enrich-data/006.png @path %})

For more information, see [Alerts](/workflow/alerts-notifications/#alerts).

### Filter, Search & Order Issues

In your Issue stream:

- Filter issues according to your application's `environments` using the top-level filter bar.
- Sort issues by the number of (unique) impacted `users`.
- Search through issues by your `custom tags`, `user context` attributes, and `release` ids in the issue search bar.

![Issues View]({% asset guides/enrich-data/003.png @path %})

For more information, see [Search](/workflow/search/).

### Discover

Discover is a powerful query engine that builds upon your error data allowing you to reveal patterns, anomalies, and deeper insights in the health of your entire system. With this in mind, the more (custom) data you add to your errors, the more flexibility you'll gain in building queries that address your **environments**, **releases**, custom development, and business characteristics through **tags**, and the end-users impacted by those errors.

For instance, the Discover query below displays all the errors (total of 143 events) that occurred in my _production environment_ distributed by the _customer-type custom tag_ and ordered by the _uniquely impacted end users_.

![Discover Query]({% asset guides/enrich-data/004.png @path %})

For more information, see [Discover](/performance-monitoring/discover-queries/).

### Issue Ownership

Ownership allows you to target email notifications and automatically assign ownership to members in your project teams, by defining ownership rules in your project settings. Ownership rules can be defined based on an error's origin `URL`, the `path` of the files in the error's stack-trace, or an error's `tag` value.

This means that by adding meaningful **custom tags** to your errors, you'll be able to reduce noise by pinpointing notifications to the right people and automatically assign new issues to their proper owners.

![Issue Owner Tag Rule]({% asset guides/enrich-data/005.png @path %})

For more information, see [Issue Owners](/workflow/issue-owners/).

### Release Workflows

Configuring the release version ID on the SDK will associate every error that happens in your application runtime with a specific release version of your code. This way you know exactly when an error was introduced into your source code. It also unlocks these powerful features and workflows:  

1. **Suspect Commits & Suggested Assignee** - With a release in place, Sentry can suggest suspect commits that might have an introduced the error to your code and through that commit also suggest the author as an assignee. For more information, see [Commit Tracking](/workflow/integrations/global-integrations/#commit-tracking-3).
2. **Resolve with Release** - When you mark an Issue as resolved in a specific release, new events of that issue occurring in previous releases will be ignored and will not trigger any notifications. For more information, see [Resolve in Commit](/workflow/integrations/global-integrations/#resolve-in-commit).
3. **Regression Notifications** - In case you marked an issue as resolved in a release and new events are still occurring in that same release or any future releases, Sentry will consider that a regression and will notify you.
4. **Release Health** (Currently available on the Android and iOS SDKs) - Sentry can monitor the health of your releases by observing various metrics like user adoption, session duration, crash-free users and sessions, and others. For more information, see [Health](/workflow/releases/health/).

![Release]({% asset guides/enrich-data/001.png @path %})

For more information, see [Releases](/workflow/releases/).
