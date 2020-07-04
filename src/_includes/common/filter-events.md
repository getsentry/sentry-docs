{% comment %}
Guideline: This page is common to all SDKs; it is stored in the common folder, nested under _includes/common. To use, 

1. Add a folder with the name of the platform you are documenting to the _documentation/sdks structure (for example, _documentation/sdks/javascript) 
2. Create a new filter.md file in _documentation/sdks/<platform-name>/config folder
3. Create the defined `include` statements and add them to the filter.md file

If you have questions, please ask Fiona or Daniel. 

**The objective for this page is that a developer can easily view the configuration options for the SDK; each page _must_ have a description that includes a summary of what the page provides to the developer. Simply linking the page is insufficient.**
{% endcomment %}

While sending all application errors to Sentry ensures you’ll be notified in real-time when errors occur in your code, often applications generate many errors, thus many notifications. The Sentry SDKs have several configuration options you can use to filter unwanted errors from leaving your application’s runtime. In addition, the Sentry web UI also offers methods to filter events.

## Use Projects to Filter Events

Sentry provides several methods to filter data server-side. Using Sentry's web UI to filter events is a slightly simpler method as you don't have to configure and deploy your SDK.

### Inbound Data Filters

Inbound data filters allow you to determine which errors, if any, Sentry should ignore. Explore these by navigating to **[Project] » Project Settings » Inbound Filters.**

Inbound filters include:

- Common browser extension errors
- Events coming from localhost
- Known legacy browsers errors
- Known web crawlers
- By their error message
- From specific release versions of your code
- From certain IP addresses.

Once applied, you can track the filtered events (numbers and cause) using the graph provided at the top of the Inbound Data Filters view.

![Built-in Inbound Filters]({% asset guides/manage-event-stream/03.png @path %})

### Proper Event Grouping

Proper event grouping maintains a meaningful issue stream and reduces redundant notifications. Sentry groups similar *events* into unique *issues* based on their *fingerprint*. An event’s fingerprint relies firstly on its **stack trace**.

{{ include.filter-stack-trace }}
{% comment %} 
Guideline: as appropriate, add the example and screen shot for the SDK your are documenting
{% endcomment %}

### Apply Workflows

Event streams with inbound filter and proper event grouping can be made more efficient by practicing good development hygiene. When Sentry alerts you to an issue in your code, resolve it or discard. 

### Rate Limit

Rate limits allow you to set the maximum volume of events a project will accept during a period of time. This type of limit can be useful for managing your monthly event quota, but once a defined threshold is crossed, **subsequent events will be dropped**. You shouldn't constantly hit your rate limit. Instead, regard it as a ceiling intended to protect you from unexpected spikes.

Under `[Project Settings] » Client Keys » Configure`, you can create multiple DSN keys per-project and assign different (or no) limits to each key. This will allow you to dynamically allocate keys (with varying thresholds) depending on Release, Environment, and so forth.

For example, you may have a project in production that generates many alerts. A rate limit allows you to set the maximum amount of data to 500 events per minute, for instance. Additionally, you can create a second key for the same project for your staging environment, which is unlimited, ensuring your QA process is still untouched.

## Configure your SDK to Filter Events

Configure your SDK to filter events by using the `beforeSend` callback method and configuring, enabling, or disabling integrations.

### Using `before-send`

All Sentry SDKs support the `beforeSend` callback method. `before-send` is called immediately before the event is sent to the server, so it’s the final place where you can edit its data. It receives the event object as a parameter, so you can use that to modify the event’s data or drop it completely (by returning `null`) based on custom logic and the data available on the event.

{{ include.filter-init_content }}
{% comment %}
Guideline: add the `init` call for the SDK your are documenting
{% endcomment %}

The `before-send` callback is passed both the `event` and a second argument, `hint`, that holds one or more hints. 

Typically a `hint` holds the original exception so that additional data can be extracted or grouping is affected. In this example, the fingerprint is forced to a common value if an exception of a certain type has been caught:

{{ include.filter-example_content }}
{% comment %}
Guideline: add a code sample that supports this example for the SDK your are documenting
{% endcomment %}


Note also that breadcrumbs can be filtered, as discussed in Understand Breadcrumbs {% comment %} TO DO: add link {% endcomment %}

**Event hints**

When the SDK creates an event or breadcrumb for transmission, that transmission is typically created from some sort of source object. For instance, an error event is typically created from a log record or exception instance. For better customization, SDKs send these objects to certain callbacks (`before-send`, `before-breadcrumb` or the event processor system in the SDK).

#### Sampling

If a sample rate is defined for the SDK, the SDK evaluates whether this event should be sent as a representative fraction of events. 

**Note:** The SDK sample rate is not dynamic; changing it requires re-deployment. In addition, setting an SDK sample rate limits visibility into the source of events. Setting a rate limit for your project may better suit your needs.

When you enable sampling in your SDK, you choose a percentage of collected errors to send to Sentry. For example, to sample 25% of your events:

{{ include.filter-sample-rate_content }}
{% comment %}
Guideline: add a code sample that supports sampling at 25% example for the SDK your are documenting
{% endcomment %}

For Sentry's Performance features (which are currently in Beta), we **strongly recommend**  sampling your data for two reasons. First, though capturing a single trace involves minimal overhead, capturing traces for every single page load, or every single API request, has the potential to add an undesirable amount of load to your system. Second, by enabling sampling you’ll more easily prevent yourself from exceeding your organization’s [event quota](/accounts/quotas/), which will help you manage costs.

When choosing a sampling rate, the goal is to not collect *too* much data, but to collect enough data that you are able to draw meaningful conclusions. If you’re not sure what rate to choose, start with a low value and gradually increase it as you learn more about your traffic patterns and volume, until you’ve found a rate which lets you balance performance and cost concerns with data accuracy.

### Using Hints

Hints are available in two places: 

1. `beforeSend` / `beforeBreadcrumb` 
2. `eventProcessors` 

Event and Breadcrumb `hints` are objects containing various information used to put together an event or a breadcrumb. Typically `hints` hold the original exception so that additional data can be extracted or grouping can be affected. 

For events, those are things such as `event_id`,  `originalException`,  `syntheticException` (used internally to generate cleaner stack trace), and any other arbitrary `data` that you attach. 

For breadcrumbs, the use of `hints` is implementation dependent. For XHR requests, the hint contains the xhr object itself; for user interactions the hint contains the DOM element and event name and so forth.

In this example, the fingerprint is forced to a common value if an exception of a certain type has been caught:

{{ include.filter-hint_content }}
{% comment %}
Guideline: add a code sample that supports the SDK your are documenting
{% endcomment %}

#### Hints for Events

`originalException`  The original exception that caused the Sentry SDK to create the event. This is useful for changing how the Sentry SDK groups events or to extract additional information.

`syntheticException` When a string or a non-error object is raised, Sentry creates a synthetic exception so you can get a basic stack trace. This exception is stored here for further data extraction.

#### Hints for Breadcrumbs

`event` For breadcrumbs created from browser events, the Sentry SDK often supplies the event to the breadcrumb as a hint. This, for instance, can be used to extract data from the target DOM element into a breadcrumb.

`level` / `input`   For breadcrumbs created from console log interceptions. This holds the original console log level and the original input data to the log function.

`response` / `input`    For breadcrumbs created from HTTP requests. This holds the response object (from the fetch API) and the input parameters to the fetch function.

`request` / `response` / `event`    For breadcrumbs created from HTTP requests. This holds the request and response object (from the node HTTP API) as well as the node event (`response` or `error`).

`xhr`   For breadcrumbs created from HTTP requests done via the legacy `XMLHttpRequest` API. This holds the original xhr object.