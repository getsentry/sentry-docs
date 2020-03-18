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

Early adopters have access to a new option ("Data Privacy Rules") in both organization settings as well as the setting of each project.

Note that everything you configure there will have direct impact on all new events, just as all the other data privacy-related settings do. However, it is not possible to break or undo any other data privacy settings that you may have configured. In other words, it is only possible to accidentally remove too much data, not too little.

If you have any questions related to this feature, feel free to contact us at `markus@sentry.io`.

## A Basic Example

Go to your project- or organization-settings and click _Data Privacy_/_Security
and Privacy_ in the sidebar. Scrolling down, you will find a new section _Data
Privacy Rules_.

Click on _Add Rule_. This already adds a very simple rule:

```
[Mask] [credit card numbers] from [$string]
```

As soon as you hit _Save_, we will attempt to find all creditcard numbers in your events going forward, and replace them with a series of `******`, keeping only the last 4 digits.

Rules generally consist of three parts:

- A [_Redaction Method_](#redaction-methods): What to do.
- A [_Rule Type_](#rule-types): What to look for.
- A [_Selector_](#selector): Where to look.

## Redaction Methods

- _Remove_: Remove the entire field. We may choose to either set it to `null`, remove it entirely or replace it with an empty string depending on technical constraints.
- _Mask_: Replace all characters with `*`. For creditcards this replaces everything but the last 4 digits.
- _Hash_: Replace the matched substring with a hashed value.

## Rule Types

- _Custom Regular Expression_: Custom Perl-style regex (PCRE).
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
- _Anything_: Matches any value. This is useful if you want to remove a certain JSON key by path using [_Selectors_](#selectors) regardless of the value.

## Selectors

You can select a region of the event using JSON-path-like syntax. As an example, to delete a specific key in "Additional Data", you would configure:

> `Remove` `Anything` from `extra.foo`

### Boolean Logic

You can combine selectors using boolean logic.

* Prefix with `!` to invert the selector. `foo` matches the JSON key `foo`, while `(~foo)` matches everything but `foo`.
* Build the conjunction (AND) using `&&`, such as: `foo && !extra.foo` to match the key `foo` except when inside of `extra`.
* Build the disjunction (OR) using `||`, such as: `foo || bar` to match `foo` or `bar`.

### Wildcards

* `**` matches all subpaths, so that `foo.**` matches all JSON keys within `foo`.
* `*` matches a single path item, so that `foo.*` matches all JSON keys one level below `foo`.

### Value Types

Select subsections by JSON-type or semantic meaning using the following:

* `$string`
* `$number`
* `$boolean`
* `$datetime`
* `$array`
* `$object`
* `$event`
* `$exception`
* `$stacktrace`
* `$frame`
* `$request`
* `$user`
* `$logentry` (also applies to `event.message`)
* `$thread`
* `$breadcrumb`
* `$span`
* `$sdk`

Examples:

* Delete `event.user`:

  ```
  [Remove] [Anything] from [event.user]
  ```

* Delete all frame-local variables:

  ```
  [Remove] [Anything] from [$frame.vars]
  ```

### Escaping Specal Characters

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
