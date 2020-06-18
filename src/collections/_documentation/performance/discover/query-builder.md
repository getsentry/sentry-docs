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
From the Discover Homepage, you can build a query in three ways. 

- Click on "Build a new query"
- Click on the ellipsis of an existing saved query card to "Duplicate"
- Go into any existing query
  1. Click on "Save as..." in the top right
  2. Enter a new display name
  3. Click "Save"  
  
## The Main Building Blocks
  
There are 4 main building blocks that impact the results of your saved query. You can use a combination of these to narrow down your event search.

  1. Global Selection Header
  2. Search Conditions 
  3. Interactive Graph
  4. Table Columns
  
## Global Selection Header

Similar to the other parts of Sentry, you can specify which projects, environment and date range you want to zoom in on. For more on the global selection header, go to 

## Search Conditions

You can use conditions to filter events from results by fields or tags.

**Available Fields** 

Events have a number of built-in fields as well as custom tags.

**Standard fields**

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

**Syntax**

The Query Builder syntax is identical to [Sentry's Search syntax]({%- link _documentation/workflow/search.md -%}). To add a search condition, click on the search input box above the graph, add a search condition, and press "Enter."

**Searching on Aggregated Fields/Tags**

You can add search conditions on aggregated fields/tags (for example, `count(id)`) in one of the following ways:

- Exact match: `count(id):99`
- Upper bounds: `count(id):<99` or `count(id):<=99`
- Lower bounds: `count(id):>99` or `count(id):>=99`
- Combination of upper and lower bounds: `count(id):>10 count(id):<20`

## Interactive Graph

Each Discover query has a graph that displays a visual summary of the data presented in the results table. Releases are overlaid, clickable, and the data corresponding to the previous period is also shown. Additionally, you can zoom in on specific slices to drill into a spike or problem area.  

By default, the y-axis shows the count of events over time. However, you can display  `count` or `count_unique` on almost any column if you add it as a column in the query builder. Note that the y-axis will reset to another available option if you 
remove the column from the table.

## Table Columns

1. Columns may either be a known tag or field (i.e. browser)
2. Columns may have a stacking function applied to them
- Sort order depends on the column selected

You can add any tags/fields as columns, stack events with columns, and sort with columns.

If you don't apply functions to any of the applicable columns, or if they're not present, Sentry doesn't stack the event rows. If aggregate functions are present, Discover results group by unaggregated columns (tags, events). The unaggregated columns act as grouping keys and combine rows that have the same values as summary rows. Each summary row has the corresponding values in the specified columns. Aggregate functions (`avg`, `count`, `count_unique`) are optional. 

### Stacking functions

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

If you want to take the data elsewhere, click on the "Export" button to start the export. Depending on the amount of data, the wait times will vary. You'll get an email with the download link once they're ready.

{% capture __alert_content -%}
The results are limited to 10 million rows or 1GB, whichever comes first.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="info"
%}

#### Verifying the Download

The download page contains a `SHA1` checksum of the file, which you can use to verify its integrity with the following command:

```bash
echo "<SHA1 checksum> <downloaded CSV name>" | sha1sum -c -
```

### Expand Row Aggregates

Many queries will result in observing aggregated data. Some typical results might look like the count of errors rolled up by project, URL, or release.

Seeing these aggregations will indicate where to focus your attention. You can click on any cell in the `count(id)` column and expand the results from that specific row. In doing so, you can view the individual events within that aggregation and see the tag distribution, event volume, or continue to drill down and investigate further.

### Tag Summary (Facet Maps)

The tag value links displayed on the Event Details can be used to refine your search results further. Clicking on any tag link will take you to a new Discover query with the clicked tag value added as a condition. If you were looking at an aggregated result, the new query will have all aggregations removed. This allows you to drill into aggregated results and explore your data more quickly.

Each query result is displayed in tandem with a facet map representing a distribution of tags corresponding with that query result.

[{% asset discover/discover-facet-map.png alt="Facet map for transaction and handled tags. Map looks like a bar with gradient colors." %}]({% asset discover/discover-facet-map.png @path %})

The top 10 tag keys and their values are shown by occurrence and dynamically update when you change any of your conditions. For example, if you choose a different project or date range, the facet map will automatically update based on the new results. 

You can also hover over each value to see the exact distribution for a given tag and click on them to add to your [filter conditions](#search-conditions) and see a new query result.  



## Additional Actions

**Editing or updating queries**

If you need to edit any of these queries, go into the query, make the desired changes and a button will appear in the top right asking you to update the query. Keep in mind, edits to the query conditions **will not** be automatically saved.

To rename a saved query, click on the pencil icon by the header and enter the desired display name. Click "enter" or outside of the area to confirm.  

**Sharing queries**

Share your queries as often as you want. You can share URLs with other users who also have access to the same organization. As each part of the query is built, the results update, and the URL is updated so that in-progress searches can be shared in email, chat, etc.

**Deleting queries**

{% capture __alert_content -%}
Deleting a saved query is irreversible.
{%- endcapture -%}
{%- include components/alert.html
    title="Warning"
    content=__alert_content
    level="warning"
%}

On the Discover Homepage, each saved query card has an ellipsis that will open a context menu. Delete the query from here. You can also delete the query within Query Results view by clicking the trash can in the upper right. 
