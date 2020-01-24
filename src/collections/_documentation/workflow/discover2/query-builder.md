---
title: 'Query Builder'
sidebar_order: 4
---

Navigate to any query page from the Discover Homepage in these ways:

- Clicking on "Build a new query"
- Clicking on any Pre-built or Saved Queries

On the Query results page, you'll find the graph, table, and facet maps. The Query Builder enables the user to create custom views of the events sent to Sentry.io. You can add any tags/fields as columns, aggregate with columns, and sort with columns.

### Sharing Query Views

Share your queries as often as you want. You can share URLs to other users who also have access to the same organization. As each part of the query is built, the results update, and the URL is updated so that in-progress searches can be shared in email/chat.

### Saved Query

Although search queries are shareable, you can save them as Saved Queries. Saved Queries are visible to the entire organization. In other words, Saved Queries **are not** scoped to the user's account. Saved Queries have a yellow star icon on the Discover landing page. You can use either a pre-built query or another saved query to create a new Saved Query.

**Creating a new Saved Query**

You may create a new Saved Query from one of the following ways:

- From a pre-built query:
    1. Click on "Save as..." on the top right
    2. Enter the name of your Saved Query
    3. Click "Save"
- From a Saved Query:
    1. Make changes to a Saved Query
    2. Click on "Save as..." on the top right
    3. Enter the name of your Saved Query
    4. Click "Save"

**Saving Changes**

Making changes to a Saved Query **will not** automatically be saved. An exception to this rule is renaming a Saved Query. Note that the state is still reflected in the URL so that you can share the URLs even though they're not saved. If you've made any unsaved changes to a Saved Query, you can click on the "Update Query" button on the top right corner.

**Renaming a Saved Query**

1. Click on the Saved Query name with the pencil icon 
2. Enter a new name
3. Click enter or click outside to confirm changes
4. The name is automatically saved

**Deleting a Saved Query**

[ Mimi note: this will go in an Alert Box ] WARNING: Deleting a Saved Query is irreversible.

From an existing Saved Query, click on the garbage bin icon on the top right-hand corner. After deleting a Saved Query, you'll be redirected back to the landing page.

### Search Conditions

You can use conditions to filter events from results by fields or tags.

Source of the list of fields: 

- [TODO: Alberto to generate this list. [https://github.com/getsentry/sentry/blob/07019b6c85af15d046978176a8ae1f3ec38f193f/src/sentry/snuba/events.py#L9](https://github.com/getsentry/sentry/blob/07019b6c85af15d046978176a8ae1f3ec38f193f/src/sentry/snuba/events.py#L9)]

[Fields](https://www.notion.so/847a31ec71da4a889593859534891e44)

The Query Builder syntax is identical to [Sentry's Search syntax]({%- link _documentation/workflow/search.md -%}). To add a search condition, click on the search input box above the graph, add a search condition, and press "Enter."

### Results Table

The results of the table are generated based on the following components:

- Selected columns
    - Columns may either be a known field, or a tag
    - Columns may have an aggregation function applied to them
    - Sort order depends on the column selected
- Search conditions
- Global selection header (projects, environment, dates)

**Graph**

Each Discover query has a graph that displays a visual summary of the data presented in the results table. Releases are overlaid, clickable, and the data corresponding to the previous period is also shown. Additionally, you can zoom in on specific slices to drill into a spike or problem area.  

By default, the y-axis shows the count of events over time. However, you can display  `count` or `count_unique` on almost any column if you add it as a column in the query builder. Note that the y-axis will reset to another available option if you remove the column from the table.

**Aggregation functions**

- `avg`
- `count`
- `count_unique`
- `max`
- `min`
- `sum`

**Add Columns**

1. Click on "Add Column" to open the modal to add a new column
2. Select and choose a field or a tag from the "Column Type" dropdown
3. Optionally, add an aggregate function
4. Click "Create column" button
5. Your new column will be added to the right-most side of the table. You may need to scroll towards the right to be able to see it.

**Edit Columns**

1. Click on "Edit Columns" on the top right-hand corner of the table to enter the edit state of the table
2. Hover your mouse cursor over the header of the desired column to edit
3. Click on the pencil icon
4. A modal will open for you to edit the column
5. Click the "Update column" button
6. Optionally, click on the "Save & Close" button on the top right-hand corner of the table to exit the edit state of the table

**Delete Columns**

1. Click on "Edit Columns" on the top right-hand corner of the table to enter the edit state of the table
2. Hover your mouse cursor over the header of the desired column to delete
3. Click on the garbage bin icon
4. The table may refresh
5. Optionally click on the "Save & Close" button on the top right-hand corner of the table to exit the edit state of the table

**Resize Columns**

You can resize columns by hovering over the column boundary, and click & drag them to resize the column to the desired width.

**Sorting Columns**

1. Hover your mouse cursor over the header of the desired column to sort
2. Click on the header
3. The table may refresh

A down arrow indicates sorting the column in descending order. An up arrow indicates sorting the column in ascending order.

**Download CSV**

Note, only the current values visible on the table are exported, not the paginated results. To export the table as CSV, click on the "Download CSV" button.

**Expand Row Aggregates**

Many queries will result in observing aggregated data. Some typical results might look like the count of errors rolled up by project, URL, or release.

Seeing these aggregations will indicate where to focus your attention. You can click on any cell in the `count(id)` column and expand the results from that specific row. In doing so, you can view the individual events within that aggregation and see the tag distribution, event volume, or continue to drill down and investigate further.

**Facet Maps**

Each query result is displayed in tandem with a facet map that represents a distribution of tags that corresponds with the query result.

[{% asset discover/discover-facet-map.png alt="Facet map for transaction and handled tags. Map looks like a bar with gradient colors." %}]({% asset discover/discover-facet-map.png @path %})

The top 10 tag keys and their values are shown by occurrence and dynamically update when you change any of your conditions. For example, if you choose a different project or date range, the facet map will automatically update based on the new results. 

You can also hover over each value to see the exact distribution for a given tag and click on them to add to your filter conditions and see a new query result.  
