---
title: 'Discover'
sidebar_order: 15
---

{% capture __alert_content -%}
Discover is currently available as an alpha release to select customers only.
{%- endcapture -%}
{%- include components/alert.html
  level="warning"
  title="Alpha functionality"
  content=__alert_content
%}


## Introduction

Discover lets you query raw event data in Sentry, across any number of projects within your organization.


## Summarize

Select the event attributes you want to summarize over.

If there are no aggregations present, raw event data is returned and this selects the columns we want to display.

If there are aggregations in the query, this is effectively a groupby clause.

See [here](#fields) for the list of fields available.


## Aggregations

Leave blank if you want a table of raw event data, otherwise the selected function is run over the event attributes selected in Summarize above.

Available functions are:
- `count` - count of rows
- `uniq` - count of distinct rows
- `avg` - mathematical average on a number field


## Conditions

You can use conditions to filter events from results by field (see [here](#fields) for the list of fields).

All conditions are joined with AND syntax.

The condition operators available are:
- `IS NULL`, `IS NOT NULL` (for all column types)
- `=`, `!=`, `LIKE` (for strings)
  - Note that values used with `LIKE` are case sensitive and can be used with wildcard characters 
  - e.g. `exception_stacks.type LIKE Validation`



## Order by

This field should update automatically as you update your query parameters to list allowable aggregations or fields for sorting.


## Limit

Any integer between 1 and 1000 is valid.



## Project selector

By default Discover searches events across all projects that you are a member of within the organization.


## Date range

You need to provide either a relative date (e.g. last 14 days) or an explicit start and end date (in UTC).

This defaults to the last 14 days.

In most cases data is retained by Sentry for 90 days.


## List of event fields {#fields}

Events have a number of built in fields as well as custom tags.

#### Standard fields

<table class="table">
  <thead><tr><th>Category</th><th>Attribute name</th><th>Type</th></tr></thead>
  <tbody valign="top">
    <tr><td>General</td><td><code>event_id</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>project_id</code></td><td><code>number</code></td></tr>
    <tr><td></td><td><code>timestamp</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>platform</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>message</code></td><td><code>string</code></td></tr>
    <tr><td>User attributes</td><td><code>user_id</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>username</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>email</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>ip_address</code></td><td><code>string</code></td></tr>
    <tr><td>SDK</td><td><code>sdk_ame</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>sdk_version</code></td><td><code>string</code></td></tr>
    <tr><td>OS</td><td><code>os_build</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>os_kernel_version</code></td><td><code>string</code></td></tr>
    <tr><td>Device</td><td><code>device_name</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>device_brand</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>device_locale</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>device_uuid</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>device_model_id</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>device_arch</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>device_battery_level</code></td><td><code>number</code></td></tr>
    <tr><td></td><td><code>device_orientation</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>device_simulator</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>device_online</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>device_charging</code></td><td><code>string</code></td></tr>
    <tr><td>Tags</td><td><code>tags_key</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags_value</code></td><td><code>string</code></td></tr>
    <tr><td>HTTP</td><td><code>http_method</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>http_referer</code></td><td><code>string</code></td></tr>
    <tr><td>Stack traces</td><td><code>exception_stacks.type</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>exception_stacks.value</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>exception_stacks.mechanism_type</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>exception_stacks.mechanism_handled</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>exception_frames.abs_path</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>exception_frames.filename</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>exception_frames.package</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>exception_frames.module</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>exception_frames.function</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>exception_frames.in_app</code></td><td><code>boolean</code></td></tr>
    <tr><td></td><td><code>exception_frames.colno</code></td><td><code>number</code></td></tr>
    <tr><td></td><td><code>exception_frames.lineno</code></td><td><code>number</code></td></tr>
    <tr><td></td><td><code>exception_frames.stack_levvel</code></td><td><code>number</code></td></tr>
  </tbody>
</table>


#### Commonly used tags

These tags are commonly used / implemented in Sentry's SDKs

<table class="table">
  <thead><tr><th>Category</th><th>Attribute name</th><th>Type</th></tr></thead>
  <tbody valign="top">
    <tr><td>General</td><td><code>tags[level]</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags[logger]</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags[server_name]</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags[transaction]</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags[environment]</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags[site]</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags[url]</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags[app_device]</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags[device_family]</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags[runtime]</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags[runtime_name]</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags[browser]</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags[browser_name]</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags[os]</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags[os_name]</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags[os_rooted]</code></td><td><code>boolean</code></td></tr>
    <tr><td></td><td><code>tags[sentry:release]</code></td><td><code>string</code></td></tr>
    <tr><td></td><td><code>tags[sentry:user]</code></td><td><code>string</code></td></tr>
  </tbody>
</table>


Additionally, any custom user-defined tags can also be accessed with the `tags[...]` syntax




