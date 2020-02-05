---
title: 'Query Builder'
sidebar_order: 4
standard_fields:
 General:
  -
   type: string
   name: id
  -
   type: number
   name: "issue.id"
  -
   type: string
   name: message
  -
   type: number
   name: "project.id"
  -
   type: string
   name: release
  -
   type: datetime
   name: timestamp
  -
   type: string
   name: title
  -
   type: string
   name: "platform.name"
  -
   type: string
   name: environment
  -
   type: string
   name: "event.type"
  -
   type: string
   name: location
  -
   type: string
   name: time
 Device:
  -
   type: string
   name: "device.arch"
  -
   type: number
   name: "device.battery_level"
  -
   type: string
   name: "device.brand"
  -
   type: string
   name: "device.charging"
  -
   type: string
   name: "device.locale"
  -
   type: string
   name: "device.name"
  -
   type: string
   name: "device.online"
  -
   type: string
   name: "device.orientation"
  -
   type: string
   name: "device.simulator"
  -
   type: string
   name: "device.uuid"
 Geo:
  -
   type: string
   name: "geo.city"
  -
   type: string
   name: "geo.country_code"
  -
   type: string
   name: "geo.region"
 HTTP:
  -
   type: string
   name: "http.method"
  -
   type: string
   name: "http.url"
 OS:
  -
   type: string
   name: "os.build"
  -
   type: string
   name: "os.kernel_version"
 SDK:
  -
   type: string
   name: "sdk.name"
  -
   type: string
   name: "sdk.version"
 "Stack traces":
  -
   type: string
   name: "error.handled"
  -
   type: string
   name: "error.mechanism"
  -
   type: string
   name: "error.type"
  -
   type: string
   name: "error.value"
  -
   type: string
   name: "stack.abs_path"
  -
   type: number
   name: "stack.colno"
  -
   type: string
   name: "stack.filename"
  -
   type: string
   name: "stack.function"
  -
   type: boolean
   name: "stack.in_app"
  -
   type: number
   name: "stack.lineno"
  -
   type: string
   name: "stack.module"
  -
   type: string
   name: "stack.package"
  -
   type: number
   name: "stack.stack_level"
 "User attributes":
  -
   type: string
   name: user
  -
   type: string
   name: "user.email"
  -
   type: string
   name: "user.id"
  -
   type: string
   name: "user.ip"
  -
   type: string
   name: "user.username"
---

Navigate to any query page from the Discover homepage in these ways:

- Click on "Build a new query"
- Click on any pre-built or saved queries

On the query's results page, you'll find the graph, table, and facet maps. The Query Builder enables the user to create custom views of the events sent to Sentry.io. You can add any tags/fields as columns, aggregate with columns, and sort with columns.

## Sharing Query Views

Share your queries as often as you want. You can share URLs to other users who also have access to the same organization. As each part of the query is built, the results update, and the URL is updated so that in-progress searches can be shared in email/chat.

## Saved Query

Although search queries are shareable, you can save them as Saved Queries. Saved Queries are visible to the entire organization. In other words, Saved Queries **are not** scoped to the user's account. You can find Saved Queries on the Discover homepage with the yellow star icon. You can use either a pre-built query or an existing saved query to create a new Saved Query.

### Creating a new Saved Query

You may create a new Saved Query in one of the following ways:

- From a pre-built query:
    1. Click on "Save as..." in the top right
    2. Enter the name of your Saved Query
    3. Click "Save"
- From a Saved Query:
    1. Make changes to a Saved Query
    2. Click on "Save as..." in the top right
    3. Enter the name of your Saved Query
    4. Click "Save"

### Saving Changes

Changes to a Saved Query **will not** automatically be saved. An exception to this rule is renaming a Saved Query. Note that the state is still reflected in the URL so that you can share the URLs even though they're not saved. If you've made any unsaved changes to a Saved Query, you can click on the "Update Query" button in the top right corner.

### Renaming a Saved Query

1. Click on the Saved Query name with the pencil icon 
2. Enter a new name
3. Click "Enter" or click outside to confirm changes
4. The name is automatically saved

### Deleting a Saved Query

{% capture __alert_content -%}
Deleting a Saved Query is irreversible.
{%- endcapture -%}
{%- include components/alert.html
    title="Warning"
    content=__alert_content
    level="warning"
%}

From an existing Saved Query, click on the garbage bin icon in the top right-hand corner. After deleting a Saved Query, you'll be redirected back to the homepage.

## Search Conditions

You can use conditions to filter events from results by fields or tags.

### Available Fields

Events have a number of built-in fields as well as custom tags.

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

### Syntax

The Query Builder syntax is identical to [Sentry's Search syntax]({%- link _documentation/workflow/search.md -%}). To add a search condition, click on the search input box above the graph, add a search condition, and press "Enter."

### Searching on Aggregated Fields/Tags

You can add search conditions on aggregated fields/tags (for example, `count(id)`) in one of the following ways:

- Exact match: `count(id):99`
- Upper bounds: `count(id):<99` or `count(id):<=99`
- Lower bounds: `count(id):>99` or `count(id):>=99`
- Combination of upper and lower bounds: `count(id):>10 count(id):<20`

## Results Table

The results of the table are generated based on the following components:

- Selected columns
    - Columns may either be a known field, or a tag
    - Columns may have an aggregation function applied to them
    - Sort order depends on the column selected
- Search conditions
- Global selection header (projects, environment, dates)

### Graph

Each Discover query has a graph that displays a visual summary of the data presented in the results table. Releases are overlaid, clickable, and the data corresponding to the previous period is also shown. Additionally, you can zoom in on specific slices to drill into a spike or problem area.  

By default, the y-axis shows the count of events over time. However, you can display  `count` or `count_unique` on almost any column if you add it as a column in the query builder. Note that the y-axis will reset to another available option if you remove the column from the table.

### Aggregation functions

- `avg`
- `count`
- `count_unique`
- `max`
- `min`
- `sum`

### Add Columns

1. Click on "Add Column" to open the modal to add a new column
2. Select and choose a field or a tag from the "Column Type" dropdown
3. Optionally, add an aggregate function
4. Click the "Create column" button
5. Your new column will be added to the right-most side of the table. You may need to scroll towards the right to see it.

### Edit Columns

1. Click on "Edit Columns" in the top right-hand corner of the table to enter the edit state of the table
2. Hover your mouse cursor over the header of the desired column to edit
3. Click on the pencil icon
4. A modal will open for you to edit the column
5. Click the "Update column" button
6. Optionally, click on the "Save & Close" button in the top right-hand corner of the table to exit the edit state of the table

### Delete Columns

1. Click on "Edit Columns" in the top right-hand corner of the table to enter the edit state of the table
2. Hover your mouse cursor over the header of the desired column to delete
3. Click on the garbage bin icon
4. The table may refresh
5. Optionally click on the "Save & Close" button in the top right-hand corner of the table to exit the edit state of the table

### Resize Columns

You can resize columns by hovering over the column boundary, and clicking & dragging the boundary to resize the column to the desired width.

### Sorting Columns

1. Hover your mouse cursor over the header of the desired column to sort
2. Click on the header
3. The table may refresh

A down arrow indicates sorting the column in descending order. An up arrow indicates sorting the column in ascending order.

### Download CSV

Note, only the current values visible on the table are exported, not the paginated results. To export the table as CSV, click on the "Download CSV" button.

### Expand Row Aggregates

Many queries will result in observing aggregated data. Some typical results might look like the count of errors rolled up by project, URL, or release.

Seeing these aggregations will indicate where to focus your attention. You can click on any cell in the `count(id)` column and expand the results from that specific row. In doing so, you can view the individual events within that aggregation and see the tag distribution, event volume, or continue to drill down and investigate further.

### Facet Maps

Each query result is displayed in tandem with a facet map representing a distribution of tags corresponding with that query result.

[{% asset discover/discover-facet-map.png alt="Facet map for transaction and handled tags. Map looks like a bar with gradient colors." %}]({% asset discover/discover-facet-map.png @path %})

The top 10 tag keys and their values are shown by occurrence and dynamically update when you change any of your conditions. For example, if you choose a different project or date range, the facet map will automatically update based on the new results. 

You can also hover over each value to see the exact distribution for a given tag and click on them to add to your [filter conditions](#search-conditions) and see a new query result.  
