{% comment %}
Guideline: This page is comprehensive; it is stored in the common folder, nested under _includes/common. To use, 

1. Add a folder with the name of the platform you are documenting to the _documentation/sdks structure (for example, _documentation/sdks/javascript) 
2. Create a copy of "breadcrumbs.md" file in _documentation/sdks/<platform-name> 
3. Create the defined `include` statements and add them to the errors-breadcrumbs.md file

If you have questions, please ask Fiona or Daniel. 

**The objective for this page is that a developer can easily view the breadcrumbs sent for events for this SDK.**
{% endcomment %}

Sentry uses _breadcrumbs_ to create a trail of events that happened prior to an issue. These events are often similar to traditional logs, but have the ability to record more rich structured data. For example, Sentry automatically records certain events, such as changes to the URL and XHR requests to add context to an error. 

## What Sentry Sends Automatically

SDKs will automatically start recording breadcrumbs by enabling integrations. For instance, the {{ include.sdk_name }} SDK will automatically record all location changes. 

Each crumb in the trail includes:

`timestamp`

A timestamp representing when the breadcrumb occurred. The format is either a string as defined in RFC 3339 or a numeric (integer or float) value representing the number of seconds that have elapsed since the Unix epoch.

`type`

A semi internal attribute `type` can control the type of the breadcrumb. By default, all breadcrumbs are recoded as `default`, which makes it appear as a log entry. Other types are available that influence how they are rendered:

- `default`: The default breadcrumb rendering
- `http`: Renders the breadcrumb as HTTP request
- `error`: Renders the breadcrumb as a hard error

The type is not used exclusively to customize the rendering. We **do not recommend** changing the type from the default.

`category`

A category under which to label the event. This crumb is similar to a logger name, and will let you more easily understand the area an event took place, such as `auth`.

`message`

A string describing the event; it is rendered as text with all whitespace preserved. Often used as a drop-in for a traditional log message.

`data`

A key-value mapping of metadata around the event. This crumb is frequently used instead of message, but may also be used in addition. The Sentry UI will display all the data sent.

`level`

The severity of an event. The level is set to one of five values, which are, in order of severity: `fatal`, `error`, `warning`, `info`, and `debug.error`.  The default is `info`.

### How You Can Modify

Developers who want to modify the breadcrumbs interface can read about this in detail using the developer documentation devoted to the "Breadcrumbs Interface". Manual breadcrumb recording and customization of breadcrumbs are documented on this page.

### **Manual Breadcrumbs**

You can manually add breadcrumbs whenever something interesting happens. For example, you might add manually record a breadcrumb if the user authenticates or another state change happens.

To enable manual breadcrumbs:

{{ include.errors_manual_breadcrumbs }}

### **Customize** **Breadcrumbs**

SDKs customize breadcrumbs through the `before_breadcrumb` hook. This hook passes an already assembled breadcrumb assembled breadcrumb and in some SDKs an optional hint. The function can modify the breadcrumb or decide to discard it entirely:

{{ include.errors_modify_breadcrumbs }}