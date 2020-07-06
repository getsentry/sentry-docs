{% comment %}
Guideline: This page is comprehensive; it is stored in the common folder, nested under _includes/common. To use, 

1. Add a folder with the name of the platform you are documenting to the _documentation/sdks structure (for example, _documentation/sdks/javascript) 
2. Create a copy of "context.md" file in _documentation/sdks/<platform-name> 
3. Create the defined `include` statements and add them to the errors-context.md file
4. Note that each of these terms is wrapped in an "if/then" statement; this is because not all of these options are included for every SDK. For those terms you do not wish to include, add the command `hide_<option>=true` in the SDK-specific page.

If you have questions, please ask Fiona or Daniel. 

**The objective for this page is that a developer can easily view the what context is sent for events for this SDK**
{% endcomment %}

Data is sent with every event, and is either predefined or custom:

- **Predefined data** is data that Sentry recognizes. This data enhances your ability to understand and investigate the source and impact of the data when viewing it in the Sentry web UI. For example, in Sentry, the concept of user helps Sentry display the number of unique users affected by an event.
- **Custom data** is arbitrary structured or unstructured extra data you can attach to your event.

Regardless of whether the data sent to Sentry is predefined or custom, additional data can take two forms, tags and context:

- *Tags* are key/value string pairs that are both indexed and searchable. Tags power UI features such as filters and tag-distribution maps. Tags help you quickly access related events and view the tag distribution for a set of events. Common uses for tags include hostname, platform version, and user language.

    Once you've started sending tagged data, you'll see it in the Sentry web UI: the filters within the sidebar on the Project page; summarized within an event; and on the tags page for an aggregated event.

    We’ll automatically index all tags for an event, as well as the frequency and the last time the Sentry SDK has seen a value. We also keep track of the number of distinct tags and can assist you in determining hotspots for various issues.

    {% comment %} add screen shot {% endcomment %}

- *Context* includes additional diagnostic information attached to an event. By default, contexts are not searchable, but for convenience Sentry turns information in some predefined contexts into tags, making them searchable.

   {% comment %} add screen shot {% endcomment %}

## What Sentry Sends Automatically

Certain data is sent to Sentry automatically. This section explains the predefined data, some of which is simply the type of device or browser being used at the time of the event. Other predefined data you can modify, such as the `level` of the event. The final type of predefined data, `environment` and `release`, affect the UI experience or enable features within the product to help better identify issues in your application.

### Predefined Data

Sentry turns additional, predefined data or specific attributes on the data into _tags_, which you can use for a variety of purposes, such as searching in the web UI for the event or delving deeper into your application. For example, you can use tags such as `level` or `user.email` to surface particular errors. You can also enable Sentry to track releases, which unlocks features that help you delve more deeply into the differences between deployed releases.

If Sentry captures some predefined data but doesn’t expose it as a tag, you can set a custom tag for it.

Request, device, OS, runtime, app, browser, GPU, logger, and monitor are the most typical predefined data sent with an event. In addition, the following are sent, and can be modified for your team's use.

Level:

Defines the severity of an event. The level can be set to one of five values, which are, in order of severity: `fatal`, `error`, `warning`, `info`, and `debug.error`. Learn how to set the level in Set the Level

User:

Providing user information to Sentry helps you evaluate the number of users affecting an issue and evaluate the quality of the application. Learn how to capture user information in Capture the User

Fingerprint:

Sentry uses one or more “fingerprints” to decide how to group errors into issues. Learn more about Sentry's approach to grouping algorithms and fingerprinting in Grouping & Fingerprints. Learn how to override the the default group in very advanced use cases in Modifying the Default Fingerprint

Environment:

Environments help you better filter issues, releases, and user feedback in the Issue Details page of the web UI. Learn how to set and manage environments in Manage Environments

Release:

A release is a version of your code that you deploy to an environment. When enabled, releases also help you determine regressions between releases and their potential source as discussed Track Releases

For JavaScript developers, a release is also used for applying source maps to minified JavaScript to view original, untransformed source code.

## Modifying Defaults

Modify the defaults with any of the following:

### Set the Level ###

{{ include.errors_set_level }}

**Capture the User**

Users consist of a few critical pieces of information that construct a unique identity in Sentry. Each of these is optional, but one **must** be present for the Sentry SDK to capture the user:

`id`

Your internal identifier for the user.

`username`

The username. Typically used as a better label than the internal id.

`email`

An alternative (or addition) to the username. Sentry is aware of email addresses and can display things such as Gravatars and unlock messaging capabilities.

`ip_address`

The user's IP address. If the user is unauthenticated, Sentry uses the IP address as a unique identifier for the user. Sentry will attempt to pull this from the HTTP request data, if available.

To capture a user:

{{ include.errors_capture_user }}

In addition, you can provide arbitrary key/value pairs beyond the reserved names, and the Sentry SDK will store those with the user.

### Modify the Default Fingerprint

By default, Sentry runs one of our built-in grouping algorithms to generate a fingerprint based on information available within the event such as `stacktrace`, `exception`, and `message`. 

You can override the default grouping by passing the `fingerprint` attribute an array of strings. The following extra values are available for fingerprints:

- `{{ default }}`: adds the default fingerprint values
- `{{ transaction }}`: groups by the event’s transaction
- `{{ function }}`: groups by the event’s function name
- `{{ type }}`: groups by the event’s exception type name
- `{{ module }}`: groups by the event’s module name
- `{{ package }}`: groups by the event’s package name

If you wish to append information, thus making the grouping slightly less aggressive, you can add the special string `{{default}}` as one of the items.

This minimal example puts all exceptions of the current scope into the same issue/group:

{{ include.errors_grouping_example}}

In addition, you can review two real-world use cases.

1. Splitting a group up into more groups, because the groups are too big:

    Your application queries an external API service, so the stack trace is generally the same (even if the outgoing request is very different).

    The following example splits up the default group Sentry would create (represented by `{{default}}`) further, while also splitting up the group based on the API URL.
    
    {{ include.errors_grouping_split }}

2. Merging many groups into one group:

    If you have an error that has many different stack traces and never groups together, you can merge them together by omitting `{{default}}` from the fingerprint array.

    {{ include.errors_grouping_merge }}

### Custom Data

Custom data is arbitrary structured or unstructured extra data you can attach to your event. These data can take two forms, tags and context, both of which are defined in "Enriching Error Data" in the section above.

To configure tags:

 {{ include.errors_configure_tags }}

**Important:** Sentry strongly recommends against setting custom tags that use reserved names.

Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event. You cannot search these, but they are viewable on the issue page:

{% comment %} add screen shot {% endcomment %}

To configure custom data:

{{ include.errors_configure_custom_data }}

When sending custom data, *be aware of maximum payload size*, especially if you want to send the whole application state as extra data. Sentry does not recommend this approach since application state can be very large and easily exceed the 200kB maximum that Sentry has on individual event payloads. When this happens, you’ll receive an `HTTP Error 413 Payload Too Large` message as the server response or (when you set `keepalive: true` as a `fetch` parameter), the request will stay pending forever (for example, in Google Chrome).