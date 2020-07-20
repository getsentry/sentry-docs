{% comment %}
Guideline: This page is comprehensive; it is stored in the common folder, nested under _includes/common. To use, 

1. If you haven't already, copy the errors content folder to the directory of the platform you are documenting -- _documentation/sdks/<sdk/platform>/errors (for example, _documentation/sdks/javascript/errors). 
2. Edit the breadcrumbs.md file to be specific to the SDK you are documenting.

If you have questions, please ask Fiona or Daniel. 

**The objective for this page is that a developer can easily view the breadcrumbs sent for this SDK.**
{% endcomment %}

Sentry uses _breadcrumbs_ to create a trail of events that happened prior to an issue. These events are often similar to traditional logs, but can record more rich, structured data. For example, Sentry automatically records certain events, such as changes to the URL and XHR requests to add context to an error. 

## What Sentry Sends Automatically

SDKs will automatically start recording breadcrumbs by enabling integrations. For instance, the {{ include.sdk_name }} SDK will automatically record all location changes. 

Each crumb in the trail includes:

Message

: A string describing the event. It is rendered as text with all whitespace preserved. Often used as a drop-in for a traditional log message.

Data

: A key-value mapping of metadata around the event. This is often used
  instead of message, but may be used in addition. The Sentry UI will display all the data sent.

Category

: A category under which to label the event. This crumb is similar to a logger
  name, and will let you more easily understand the area an event took place,
  such as `auth`.

Level

: The severity of an event. The level is set to one of five values, which are, in order of severity: `fatal`, `error`, `warning`, `info`, and `debug.error`.  The default is `info`.

Type

: A semi-internal attribute `type` can control the type
  of the breadcrumb. By default all breadcrumbs are recorded as `default`, which
  makes them appear as a log entry. Other types are available that
  influence how they are rendered:

  * `default`: The default breadcrumb rendering.
  * `http`: Renders the breadcrumb as HTTP request.
  * `error`: Renders the breadcrumb as a hard error.

  _The type is not exclusively used to customize the rendering. We do not recommend changing the type from the default._

Timestamp

: A timestamp representing when the breadcrumb occurred. The format is either a string as defined in RFC 3339 or a numeric (integer or float) value representing the number of seconds that have elapsed since the Unix epoch.


### Modify Breadcrumbs

Developers who want to modify the breadcrumbs interface can read about this in detail using the developer documentation devoted to the [Breadcrumbs Interface](https://develop.sentry.dev/sdk/event-payloads/breadcrumbs/). Manual breadcrumb recording and customization of breadcrumbs are documented on this page.

### Manual Breadcrumbs

You can manually add breadcrumbs whenever something interesting happens. For example, you might manually record a breadcrumb if the user authenticates or another state change happens.

{{ include.errors_manual_breadcrumbs }}
{% comment %}
Guideline: Create the `include` statement that provides SDK specific example
{% endcomment %}

### Customize Breadcrumbs

SDKs customize breadcrumbs through the `before_breadcrumb` hook. This hook passes an already assembled breadcrumb assembled breadcrumb and, in some SDKs, an optional hint. The function can modify the breadcrumb or decide to discard it entirely.