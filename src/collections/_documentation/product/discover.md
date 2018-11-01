---
title: 'Discover'
sidebar_order: 15
standard_fields:

  "General":
    - name: event_id
      type: string
    - name: project_id
      type: number
    - name: project_name
      type: string
    - name: timestamp
      type: datetime
    - name: received
      type: datetime
    - name: platform
      type: string
    - name: message
      type: string

  "User attributes":
    - name: user_id
      type: string
    - name: username
      type: string
    - name: email
      type: string
    - name: ip_address
      type: string

  "SDK":
    - name: sdk_ame
      type: string
    - name: sdk_version
      type: string

  "OS":
    - name: os_build
      type: string
    - name: os_kernel_version
      type: string

  "Device":
    - name: device_name
      type: string
    - name: device_brand
      type: string
    - name: device_locale
      type: string
    - name: device_uuid
      type: string
    - name: device_model_id
      type: string
    - name: device_arch
      type: string
    - name: device_battery_level
      type: number
    - name: device_orientation
      type: string
    - name: device_simulator
      type: string
    - name: device_online
      type: string
    - name: device_charging
      type: string

  "Tags":
    - name: tags_key
      type: string
    - name: tags_value
      type: string

  "HTTP":
    - name: http_method
      type: string
    - name: http_referer
      type: string

  "Stack traces":
    - name: exception_stacks.type
      type: string
    - name: exception_stacks.value
      type: string
    - name: exception_stacks.mechanism_type
      type: string
    - name: exception_stacks.mechanism_handled
      type: string
    - name: exception_frames.abs_path
      type: string
    - name: exception_frames.filename
      type: string
    - name: exception_frames.package
      type: string
    - name: exception_frames.module
      type: string
    - name: exception_frames.function
      type: string
    - name: exception_frames.in_app
      type: boolean
    - name: exception_frames.colno
      type: number
    - name: exception_frames.lineno
      type: number
    - name: exception_frames.stack_levvel
      type: number

common_tags:

  "General":
    - name: tags[level]
      type: string
    - name: tags[logger]
      type: string
    - name: tags[server_name]
      type: string
    - name: tags[transaction]
      type: string
    - name: tags[environment]
      type: string
    - name: tags[site]
      type: string
    - name: tags[url]
      type: string
    - name: tags[app_device]
      type: string
    - name: tags[device_family]
      type: string
    - name: tags[runtime]
      type: string
    - name: tags[runtime_name]
      type: string
    - name: tags[browser]
      type: string
    - name: tags[browser_name]
      type: string
    - name: tags[os]
      type: string
    - name: tags[os_name]
      type: string
    - name: tags[os_rooted]
      type: boolean
    - name: tags[sentry:release]
      type: string
    - name: tags[sentry:user]
      type: string

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


## Using the query builder

Summarize

: Select the event attributes you want to summarize over.

: If there are no aggregations present, raw event data is returned and this selects the columns we want to display.

: If there are aggregations in the query, this is effectively a groupby clause.

: See [here](#fields) for the list of fields available.


Aggregations

: Leave blank if you want a table of raw event data, otherwise the selected function is run over the event attributes selected in Summarize above.

: Available functions are:
- `count` - count of rows
- `uniq` - count of distinct rows
- `avg` - mathematical average on a number field


Conditions

: You can use conditions to filter events from results by field (see [here](#fields) for the list of fields).

: All conditions are joined with AND syntax.

: The condition operators available are:
- `IS NULL`, `IS NOT NULL` (for all column types)
- `=`, `!=`, `LIKE` (for strings)
  - Note that values used with `LIKE` are case sensitive and can be used with wildcard characters
  - e.g. `exception_stacks.type LIKE Validation`


Order by

: This field should update automatically as you update your query parameters to list allowable aggregations or fields for sorting.


Limit

: Any integer between 1 and 1000 is valid.


Project selector

: By default Discover searches events across all projects that you are a member of within the organization.


Date range

: You need to provide either a relative date (e.g. last 14 days) or an explicit start and end date (in UTC).

: This defaults to the last 14 days.

: In most cases data is retained by Sentry for 90 days.


## Saved queries

Any user within the organization can create, view, edit and delete the saved queries for that organization.

Save a query by clicking "save" in the sidebar. The query will be saved with an auto-generated name. 

View all saved queries for the organization by navigating to the saved query tab.


## List of event fields {#fields}

Events have a number of built in fields as well as custom tags.

#### Standard fields

<table class="table">
{%- for category in page.standard_fields -%}
  <tr>
    <td>
      <strong>{{ category[0] }}</strong>
    </td>
    <td class="content-flush-bottom">
      {%- assign items = category[1]-%}
      {%- include api/params.html params=items -%}
    </td>
  </tr>
{%- endfor -%}
</table>

#### Commonly used tags

These tags are commonly used / implemented in Sentry's SDKs

<table class="table">
{%- for category in page.common_tags -%}
  <tr>
    <td>
      <strong>{{ category[0] }}</strong>
    </td>
    <td class="content-flush-bottom">
      {%- assign items = category[1]-%}
      {%- include api/params.html params=items -%}
    </td>
  </tr>
{%- endfor -%}
</table>

Additionally, any custom user-defined tags can also be accessed with the `tags[...]` syntax
