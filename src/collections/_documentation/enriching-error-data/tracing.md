---
title: Tracing
sidebar_order: 5
---

With tracing, you can correlate errors from multiple services and uncover a significant story surrounding a break. Using a unique identifier allows you to trace an error and pinpoint the service and code behaving unexpectedly. 

## Tracing and Sentry Configuration
The following steps demonstrate a potential use-case that involves an example web application with a JavaScript front-end and a Node.js server. The examples assume that both services are already configured with Sentry's [JavaScript SDK]({% link _documentation/platforms/javascript/index.md %}).

#### Step 1: Generate a unique transaction ID
Generate a unique transaction identifier and set as a Sentry tag in the service issuing the request. This unique identifier could be a transaction ID or a session ID created when the web application first loads. Set this value as a Sentry tag using the Sentry SDK. Below, the example uses a `transactionId` as a unique identifier:

```javascript
// generate unique transactionId and set as Sentry tag
const transactionId = Math.random().toString(36).substr(2, 9);
Sentry.configureScope(function(scope) {
    scope.setTag("transaction_id", transactionId);
});
```

#### Step 2: Set the transaction ID
When initiating the request, set the transaction identifier as a custom request header. If the request fails, handle it in such a way that Sentry's SDK will collect the error (either manually throw it, or capture it using `Sentry.captureError` or `Sentry.captureMessage`).

```javascript
// perform request (set transctionId as header and throw error appropriately)
fetch('https://my.artisanal-hot-dogs.com/checkout', {  
    method: 'POST',  
    headers: {  
      "X-Transaction-ID": transactionId  
    },  
    body: order
})
.then(function (response) {
    if (response.status !== 200) {
        throw new Error(response.status + " - " + response.statusText);
    }
})  
.catch(function (error) {  
    throw error;  
});
``` 

#### Step 3: Parse the transaction header
In the receiving service (the server responding to the request), extract the unique identifier, in our case `transactionId` customer header, and set it as a Sentry tag. Both services should have set the same tag key/value pair.

```javascript
let transactionId = request.header('X-Transaction-ID');

if (transactionId) {
    Sentry.configureScope(function(scope) {
        scope.setTag("transaction_id", transactionId);
    });
}
```

## Use-Case: Tracing with NGINX

A look at how to trace a file upload issue through NGINX and Sentry with the help of a `$request_id` --- a randomly generated string that Sentry automatically assigns to each request.

### Configuring `$request_id`

NGINX has the [request ID variable](http://nginx.org/en/docs/http/ngx_http_core_module.html#var_request_id) already built-in. After accessing the variable, you can configure your NGINX server to include `$request_id` in your access logs and pass this value downstream to your application servers. First, declare a new log format, because the default log format doesn't include `$request_id`. 

For the example below, Sentry logs as a JSON and can ingest other systems such as [Elasticsearch](https://www.elastic.co/).

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
        Sentry.configureScope(function(scope) {
          scope.setTag("request_id", requestId);
        });
      }
      next();
    });
```

For more details, see this example of a Sentry engineer [committing this configuration](https://github.com/getsentry/sentry/pull/11084) to the Sentry repository. They also bound their value to the internal logging with [structlog](https://www.structlog.org/en/stable/).

After you configure the variable in your SDK, the variable surfaces as a tag in Sentry’s UI. You've accomplished an end-to-end request ID that helps you stitch together errors that Sentry tracks. You can also stitch together traditional access logs, which, in the examples above, get ingested into [Elasticsearch](https://www.elastic.co/).

[{% asset tracing/tracing_tags.png alt="Image of the request_id grouped with other tags." %}]({% asset tracing/tracing_tags.png @path %})

### Searching Request IDs in Sentry

If you also need several example cases to supplement a unique request ID, you can use Sentry's [Discover]({%- link _documentation/workflow/discover2/index.md -%}) functionality to search for all request ids you've seen on a specific URL.

[{% asset tracing/tracing_with_discover.png alt="Image of the request_id grouped with other tags." %}]({% asset tracing/tracing_with_discover.png @path %})
