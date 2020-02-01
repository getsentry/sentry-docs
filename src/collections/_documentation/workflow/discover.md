---
title: 'Discover'
sidebar_order: 5
standard_fields:

  "General":
    - name: id
      type: string
    - name: issue.id
      type: number
    - name: project.id
      type: number
    - name: project.name
      type: string
    - name: timestamp
      type: datetime
    - name: platform
      type: string
    - name: message
      type: string
    - name: release
      type: string

  "User attributes":
    - name: user.id
      type: string
    - name: user.username
      type: string
    - name: user.email
      type: string
    - name: user.ip
      type: string

  "SDK":
    - name: sdk.name
      type: string
    - name: sdk.version
      type: string

  "OS":
    - name: os.build
      type: string
    - name: os.kernel_version
      type: string

  "Device":
    - name: device.name
      type: string
    - name: device.brand
      type: string
    - name: device.locale
      type: string
    - name: device.uuid
      type: string
    - name: device.model_id
      type: string
    - name: device.arch
      type: string
    - name: device.battery_level
      type: number
    - name: device.orientation
      type: string
    - name: device.simulator
      type: string
    - name: device.online
      type: string
    - name: device.charging
      type: string

  "Geo":
    - name: geo.country_code
      type: string
    - name: geo.region
      type: string
    - name: geo.city
      type: string

  "HTTP":
    - name: http.method
      type: string
    - name: http.url
      type: string

  "Stack traces":
    - name: error.type
      type: string
    - name: error.value
      type: string
    - name: error.mechanism
      type: string
    - name: error.handled
      type: string
    - name: stack.abs_path
      type: string
    - name: stack.filename
      type: string
    - name: stack.package
      type: string
    - name: stack.module
      type: string
    - name: stack.function
      type: string
    - name: stack.in_app
      type: boolean
    - name: stack.colno
      type: number
    - name: stack.lineno
      type: number
    - name: stack.stack_level
      type: number

common_tags:

  "General":
    - name: level
      type: string
    - name: logger
      type: string
    - name: server.name
      type: string
    - name: transaction
      type: string
    - name: environment
      type: string
    - name: site
      type: string
    - name: url
      type: string
    - name: app.device
      type: string
    - name: device.family
      type: string
    - name: runtime
      type: string
    - name: runtime.name
      type: string
    - name: browser
      type: string
    - name: browser.name
      type: string
    - name: os
      type: string
    - name: os.name
      type: string
    - name: os.rooted
      type: boolean

---

{% capture __alert_content -%}
This version of Discover will deprecate at the end of February 2020. For our new query builder, see the [full Discover v2 documentation]({%- link _documentation/workflow/discover2/index.md -%}).
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

## Introduction

Discover lets you query raw event data in Sentry, across any number of projects within your organization.

{% asset discover-query.png %}

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
- `=`, `!=`, `LIKE`, `NOT LIKE` (for strings)
  - Values used with `LIKE` are _case sensitive_ and can be used with wildcard characters
  - e.g. `exception_stacks.type LIKE Validation%`
- `>`, `>=`, `<`, `<=` (for numbers)

Order by

: This field should update automatically as you update your query parameters to list allowable aggregations or fields for sorting.


Limit

: Any integer between 1 and 1000 is valid.


Project selector

: By default Discover searches events across all projects that you are a member of within the organization.


Date range

: You need to provide either a relative date (e.g. last 14 days) or an explicit start and end date.

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

Additionally, any custom user-defined tags can also be queried in the same way
