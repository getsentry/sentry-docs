---
title: 'Rollups & Grouping'
sidebar_order: 0
---

An important part of Sentry is how it aggregates similar events together and creates rollups. This turns out to be a pretty complex issue and it can be confusing for users about why some information might not be grouped correctly.

The structured data of an event dictates how a rollup is created. This varies depending on the data available as well as the language.

## Grouping Priorities

The grouping switches behavior based on the interfaces ([_Interfaces_]({%- link _documentation/development/sdk-dev/interfaces/index.md -%})) that are available within an event.

-   If the interfaces used in an event differ, then those events will not be grouped together.
-   If a stacktrace or exception is involved in a report, then grouping will only consider this information.
-   If a template is involved, then grouping will consider the template.
-   As a fallback, the message of the event will be used for grouping.

### Grouping by Stacktrace

When Sentry detects a stacktrace in the event data (either directly or as part of an exception), the grouping effectively is based entirely on the stacktrace. This grouping is fairly involved but easy enough to understand.

The first and most important part is that Sentry only groups by stack trace frames reported in the application. Not all SDKs might report this, but if that information is provided, it’s used for grouping. This means that if the stacktrace is modified from one event to another exclusively in parts of the stack that is not related to the application, it still groups the same.

Depending on the information the following data can be used for each stack trace frame:

-   Module name
-   Normalized filename (removed from revision hashes etc.)
-   Normalized context line (essentially a cleaned up version of the sourcecode of the affected line if provided)

This grouping usually works well, but causes two annoying artifacts if not dealt with:

-   Minimized JavaScript sourcecode will destroy the grouping in really bad ways. Because of this you should ensure Sentry can access your [Source Maps]({%- link _documentation/clients/javascript/sourcemaps.md -%}#raven-js-sourcemaps).
-   If you modify your stacktrace by introducing a new level through the use of decorators, your stacktrace will change and so will the grouping. For this matter many SDKs support hiding irrelevant stack trace frames. For instance the Python SDK will skip all stack frames with a local variable called `__traceback_hide__` set to _True_).

### Grouping By Exception

If no stacktrace is available but exception info is, then the grouping will consider the `type` and `value` of the exception. If either does not exist it’s skipped. This grouping is a lot less reliable because of changing error messages.

### Grouping by Template

If a template is involved the logic is similar to grouping by stacktrace but obviously with less information as template traces have less data available. The general concept applies however.

### Fallback Grouping

If everything else fails, grouping falls back to messages. Hereby ideally the grouping only uses the message without the parameters, but if that is not available, it uses the message attribute.

## Customize Grouping with Fingerprints {#custom-grouping}

For some very advanced use cases SDKs can override the Sentry default grouping.

Two common cases generally come up here:

-   An RPC or external API service is queried, so the stacktrace is generally the same (even if the outgoing request is very different)
-   A generic error, such as a database connection error, has many different stacktraces and never groups together.

To work around these the Sentry protocol supports a `fingerprint` attribute.

In supported SDKs, this attribute can be passed with the event information, and should be an array of strings:

{% include components/platform_content.html content_dir='set-fingerprint' %}

Additionally if you simply wish to append information, thus making the grouping slightly less aggressive, you can do that as well by adding the special string `{% raw %}{{ default }}{% endraw %}` as one of the items.
