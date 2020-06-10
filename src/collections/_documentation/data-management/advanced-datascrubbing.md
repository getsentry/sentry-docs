---
title: 'Advanced Data Scrubbing (Beta)'
sidebar_order: 4
keywords: ["pii", "gdpr", "personally identifiable data", "compliance"]
---

In addition to using [`beforeSend`]({% link _documentation/data-management/sensitive-data.md %}#custom-event-processing-in-the-sdk) in your SDK or our [server-side data scrubbing features]({% link _documentation/data-management/sensitive-data.md %}#server-side-scrubbing) to redact sensitive data, we are currently beta-testing ways to give you more granular control over server-side data scrubbing of your events. Additional functionality includes:

* Define custom regular expressions to match on sensitive data
* Detailed tuning on which parts of an event to scrub
* Partial removal or hashing of sensitive data instead of deletion

## Overview

**Advanced Data Scrubbing is available only if your organization is enabled as an Early Adopter.** To enable this option, navigate to your organization's settings and enable the "Early Adopter" option. Turning on this option allows access to features prior to full release, and can be disabled at any time.

Early adopters have access to a new option in both organization settings as well as the setting of each project. Go to your project- or organization-settings and click _Security and Privacy_ in the sidebar. Scrolling down, you will find a new section _Advanced Data Scrubbing_.

Note that everything you configure there will have direct impact on all new events, just as all the other data privacy-related settings do. However, it is not possible to break or undo any other data scrubbing settings that you may have configured. In other words, it is only possible to accidentally remove too much data, not too little.

If you have any questions related to this feature, feel free to contact us at `markus@sentry.io`.

## A Basic Example

Go to your project- or organization-settings and click _Security and Privacy_ in the sidebar. Scrolling down, you will find a new section _Advanced Data Scrubbing_.

1. Click on _Add Rule_. You will be presented with a new dialog.
2. Select _Mask_ as _Method_.
3. Select _Credit card numbers_ as _Data Type_.
4. Enter `$string` as _Source_.

As soon as you hit _Save_, we will attempt to find all creditcard numbers in your events going forward, and replace them with a series of `******`, keeping only the last 4 digits.

Rules generally consist of three parts:

- A [_Method_](#methods): What to do.
- A [_Data Type_](#data-types): What to look for.
- A [_Source_](#sources): Where to look.

## Methods

- _Remove_: Remove the entire field. We may choose to either set it to `null`, remove it entirely or replace it with an empty string depending on technical constraints.
- _Mask_: Replace all characters with `*`. For creditcards this replaces everything but the last 4 digits.
- _Hash_: Replace the matched substring with a hashed value.
- _Replace_: Replace the matched substring with a constant placeholder value such as `[Filtered]` or `[creditcard]`. Right now this value cannot be configured.

## Data Types

- _Regex Matches_: Custom Perl-style regex (PCRE).
- _Credit Card Numbers_: Any substrings that look like credit card numbers.
- _Password Fields_: Any substrings that look like they may contain passwords. Any string that mentions passwords, auth tokens or credentials, any variable that is called `password` or `auth`.
- _IP Addresses_: Any substrings that look like valid IPv4 or IPv6 addresses.
- _IMEI Numbers_: Any substrings that look like an IMEI or IMEISV.
- _Email Addresses_
- _UUIDs_
- _PEM Keys_: Any substrings that look like the content of a PEM-keyfile.
- _Auth in URLs_: Usernames and passwords in URLs like `https://user:pass@example.com/foo`.
- _US social security numbers_: 9-digit social security numbers for the USA.
- _Usernames in filepaths_: For example `myuser` in `/Users/myuser/file.txt`, `C:/Users/myuser/file.txt`, `C:/Documents and Settings/myuser/file.txt`, `/home/myuser/file.txt`, ...
- _MAC Addresses_
- _Anything_: Matches any value. This is useful if you want to remove a certain JSON key by path using [_Sources_](#sources) regardless of the value.

{% capture __alert_content -%}

Sentry does not know if a local variable that looks like a credit card number actually is one. As such, you need to expect not only false-positives but also false-negatives. [_Sources_](#sources) can help you in limiting the scope in which your rule runs.

{%- endcapture -%}
{%- include components/alert.html
  title="Sentry does not know what your code does"
  content=__alert_content
  level="warning"
%}


## Sources

Selectors allow you to restrict rules to certain parts of the event. This is useful to unconditionally remove certain data by event attribute, and can also be used to conservatively test rules on real data. A few examples:

* `**` to scrub everything
* `$error.value` to scrub in the exception message
* `$message` to scrub the event-level log message
* `extra.'My Value'` to scrub the key `My Value` in "Additional Data"
* `extra.**` to scrub everything in "Additional Data"
* `$http.headers.x-custom-token` to scrub the request header `X-Custom-Token`
* `$user.ip_address` to scrub the user's IP address
* `$frame.vars.foo` to scrub a stack trace frame variable called `foo`
* `contexts.device.timezone` to scrub a key from the Device context
* `tags.server_name` to scrub the tag `server_name`

All key names are treated case-insensitively.

### Using an event ID to auto-complete sources

Above the _Source_ input field you will find another input field for an event ID. Providing a value there allows for better auto-completion of arbitrary _Additional Data_ fields and variable names.

The event ID is purely optional and the value is not saved as part of your settings. Data scrubbing settings always apply to all events within a project/organization going forward.

### Advanced source names

Data scrubbing always works on the raw event payload. Keep in mind that some fields in the UI may be called differently in the JSON schema. When looking at an event there should always be a link called "JSON" present that allows you to see what the data scrubber sees.

For example, what is called "Additional Data" in the UI is called `extra` in the event payload. To remove a specific key called `foo`, you would write:

```
[Remove] [Anything] from [extra.foo]
```

Another example. Sentry knows about two kinds of error messages: the exception message, and the top-level log message. Here is an example of how such an event payload as sent by the SDK (and downloadable from the UI) would look like:

```json
{
  "logentry": {
    "formatted": "Failed to roll out the dinglebop"
  },
  "exception": {
    "values": [
      {
        "type": "ZeroDivisionError",
        "value": "integer division or modulo by zero",
      }
    ]
  }
}
```

Since the "error message" is taken from the `exception`'s `value`, and the "message" is taken from `logentry`, we would have to write the following to remove both from the event:

```
[Remove] [Anything] from [exception.values.*.value]
[Remove] [Anything] from [logentry.formatted]
```

### Boolean Logic

You can combine sources using boolean logic.

* Prefix with `!` to invert the source. `foo` matches the JSON key `foo`, while `!foo` matches everything but `foo`.
* Build the conjunction (AND) using `&&`, such as: `foo && !extra.foo` to match the key `foo` except when inside of `extra`.
* Build the disjunction (OR) using `||`, such as: `foo || bar` to match `foo` or `bar`.

### Wildcards

* `**` matches all subpaths, so that `foo.**` matches all JSON keys within `foo`.
* `*` matches a single path item, so that `foo.*` matches all JSON keys one level below `foo`.

### Value Types

Select subsections by JSON-type using the following:

* `$string` matches any string value
* `$number` matches any integer or float value
* `$datetime` matches any field in the event that represents a timestamp
* `$array` matches any JSON array value
* `$object` matches any JSON object

Select known parts of the schema using the following:

* `$error` matches a single exception instance in `{"exception": {"values": [...]}}`
* `$stack` matches a stack trace instance
* `$frame` matches a frame in a stack trace
* `$http` matches the HTTP request context of an event
* `$user` matches the user context of an event
* `$message` matches the top-level log message in `{"logentry": {"formatted": ...}}`
* `$logentry` matches the `logentry` attribute of an event.
* `$thread` matches a single thread instance in `{"threads": {"values": [...]}}`
* `$breadcrumb` matches a single breadcrumb in `{"breadcrumbs": {"values": [...]}}`
* `$span` matches a [trace span]({% link _documentation/performance/distributed-tracing.md %}#traces-transactions-and-spans)
* `$sdk` matches the SDK context in `{"sdk": ...}`

### Escaping Special Characters

If the object key you want to match contains whitespace or special characters, you can use quotes to escape it:

```
[Remove] [Anything] from [extra.'my special value']
```

This matches the key `my special value` in _Additional Data_.

To escape `'` (single quote) within the quotes, replace it with `''` (two quotes):

```
[Remove] [Anything] from [extra.'my special '' value']
```

This matches the key `my special ' value` in _Additional Data_.
