---
title: Visibility
sidebar_order: 4
---

Sentry's new Visibility features --- Discover, Dashboards, and Events --- help you gain detailed perspectives of your application's health by providing filtering tools to navigate your issues across multiple projects in a single view.

## Discover
{% include components/alert.html
    title="Note"
    content="Available if you're on a Business plan or a Trial."
    level="info"
%}

Discover helps you query event data in Sentry, across any number of projects within your organization. It enables you to uncover patterns and trends in your events' data. For example, you can aggregate event count by `stack.filename` and `stack.function`, and then browse the data as a table, bar chart, or line graph.

For more information on how to use the query builder and event fields, see the [full documentation on Discover]({%- link _documentation/workflow/discover.md -%}).

[{% asset visibility/query-result.png alt="Query results, in the form of a line graph, that summarize data by unique user email." %}]({% asset visibility/query-result.png @path %})

## Dashboards
{% include components/alert.html
    title="Note"
    content="Available if you're on a Business plan or a Trial."
    level="info"
%}

Dashboards are various data visualizations of your errors across your organization --- including graphs of your errors, geographic mapping, and lists of browsers. Dashboards allow you to drill into data by selecting points of interest.

### Overall View of Application
Each graph and visualization helps uncover crucial patterns and trends about where your customers are hitting errors.

[{% asset visibility/dashboard.png alt="Line graphs describing events, events by release, affected users, and handled vs unhandled issues." %}]({% asset visibility/dashboard.png @path %})

### Dive into Specific Projects
Filter your data with project-specific parameters.

[{% asset visibility/projt-filter.png alt="Drop-down that allows filtering based on projects." %}]({% asset visibility/projt-filter.png @path %})

### Filter by Environment
Distill needs by choosing explicit environments.

[{% asset visibility/env-filter.png alt="Drop-down that allows filtering based on environment." %}]({% asset visibility/env-filter.png @path %})

### Refine by Time Period
Define distinct time periods for a more clear-cut glimpse.

[{% asset visibility/date-filter.png alt="Drop-down that allows filtering based on calendar dates." %}]({% asset visibility/date-filter.png @path %})

## Events
{% include components/alert.html
    title="Note"
    content="Available if you're on a Team plan, Business plan, or a Trial. The Team pricing level allows you one project on the feed, and the Business and Enterprise levels allow you to view all your projects at once or any subset."
    level="info"
%}

The Events View uncovers your raw error stream for any group of projects, including environment or time range. To investigate a spike, select the spike in your Events View graph to narrow your timeframe. Drill down into any individual event to see issues related to that event.

[{% asset visibility/events-graph.png alt="Line graph illustrating spikes in events for a project. Includes stack trace." %}]({% asset visibility/events-graph.png @path %})

### Specify with Search
The updated Search helps you get specific with Issues and Events views.
- Wildcards: use the `*` operator as a placeholder for specific characters or strings. For example, `user.email:*@example.com`
- Negation: use the `!` operator to exclude terms. For example, `!user.email:user@example.com`
- Advanced properties: search on advanced event properties like `stack` (including `stack.filename`, `stack.module`, etc.), as well as `geo` (including `geo.country_code`, `geo.city`, etc.).

For more information on syntax and searchable properties, see the [full Search documentation]({%- link _documentation/workflow/search.md -%}).

## Use-Case: Tracing
Modern applications have many components that can produce errors, making it harder to identify the root cause. Tracing allows you to link systems together while following the error's path to its root. By tagging some form of a tracing ID (for example: span ID, request ID, UUID, or transaction ID), you can correlate errors coming from different parts of your application and see them in the Events View.

```javascript
// generate unique transactionId and set as Sentry tag
const transactionId = getUniqueId();
Sentry.configureScope(scope => {
    scope.setTag("transaction_id", transactionId);
});

// perform request (set transctionID as header and throw error appropriately)
request.post({
    url: "http://localhost:3001/checkout",
    json: order,
    headers: {
        "X-Session-ID": this.sessionId,
        "X-Transaction-ID": transactionId
    }
}, (error, response) => {
    if (error) {
        throw error;
    }
    if (response.statusCode === 200) {
        this.setState({ success: true });
    } else {
        throw new Error(response.statusCode + " - " + response.statusMessage);
    }
}
```

## Use-Case: Tracing with NGINX

A look at how to trace a file upload issue through NGINX and Sentry with the help of a `$request_id` --- a randomly generated string that Sentry automatically assigns to each request.

### Configuring `$request_id`

NGINX has the [request ID variable](http://nginx.org/en/docs/http/ngx_http_core_module.html#var_request_id) already built-in. After accessing the variable, you can configure your NGINX server to include `$request_id` in your access logs and pass this value downstream to your application servers. First, declare a new log format, because the default log format doesn't include `$request_id`. 

For the example below, Sentry logs as a JSON and can ingest other systems such as ElasticSearch.

```

log_format access_json escape=json
      '{'
        '"request_id":"$request_id",'
        '"time_iso8601":"$time_iso8601",'
        '"remote_addr":"$remote_addr",'
        '"remote_user":"$remote_user",'
        '"http_host":"$http_host",'
        '"request":"$request",'
        '"status":"$status",'
        '"body_bytes_sent":"$body_bytes_sent",'
        '"request_time":"$request_time",'
        '"request_length":"$request_length",'
        '"http_referrer":"$http_referer",'
        '"http_user_agent":"$http_user_agent",'
        '"request_completion":"$request_completion",'
        '"upstream_bytes_received":"$upstream_bytes_received",'
        '"upstream_connect_time":"$upstream_connect_time",'
        '"upstream_response_length":"$upstream_response_length",'
        '"upstream_response_time":"$upstream_response_time"'
      '}';
    
    access_log /var/log/nginx/access.log access_log;
```

Now that your access logs are spitting out your request ID, you can set an `X-Request-Id` header on all requests to pass it along to your application:

```
proxy_set_header X-Request-Id $request_id;

```

### Configuring Sentry

The next step involves the header being scooped up downstream in your application so you can bind this request ID to everything else you do. First, set an HTTP header, which can be read and tagged in the Sentry SDK.

Having this data means that you can stitch together the raw access log from your load balancer back into both your logging within your application and with your errors within Sentry. The way to configure this will vary depending on the language and integration you're using, but the concepts are the same.

Here are some examples:

#### Python/Django

```python
class RequestIdMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # If there's an `X-Request-Id` header on the request,
        # bind it to our Sentry SDK scope.
        request_id = request.META.get("HTTP_X_REQUEST_ID")
        if request_id:
            with sentry_sdk.configure_scope() as scope:
                scope.set_tag("request_id", request_id)
        return self.get_response(request)
```

#### Node/Express

```javascript
app.use((req, res, next) => {
      let requestId = req.headers['x-request-id'];
      if (requestId) {
        Sentry.configureScope((scope) => {
          scope.setTag("request_id", requestId);
        });
      }
      next();
    });
```

For more details, see this example of a Sentry engineer [committing this configuration](https://github.com/getsentry/sentry/pull/11084) to the Sentry repository. They also bound their value to the internal logging with [structlog](https://www.structlog.org/en/stable/).

After you configure the variable in your SDK, the variable surfaces as a tag in Sentry’s UI. You've accomplished an end-to-end request ID that helps you stitch together errors that Sentry tracks. You can also stitch together traditional access logs, which, in the examples above, get ingested into ElasticSearch.

[{% asset visibility/tracing_tags.png alt="Image of the request_id grouped with other tags." %}]({% asset visibility/tracing_tags.png @path %})

### Searching Request IDs in Sentry

If you also need several example cases to supplement a unique request ID, you can use Sentry's [Discover]({%- link _documentation/workflow/discover.md -%}) functionality to search for all request ids you've seen on a specific URL.

[{% asset visibility/tracing_with_discover.png alt="Image of the request_id grouped with other tags." %}]({% asset visibility/tracing_with_discover.png @path %})
