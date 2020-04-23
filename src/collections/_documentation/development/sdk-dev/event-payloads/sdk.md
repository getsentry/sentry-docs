---
title: SDK Interface
sidebar_order: 12
---

The SDK Interface describes the Sentry SDK and its configuration used to capture
and transmit an event.

## Attributes

`name`:

: **Required**. The name of the SDK. The format is `entity.ecosystem[.flavor]`
  where _entity_ identifies the developer of the SDK, _ecosystem_ refers to the
  programming language or platform where the SDK is to be used and the optional
  _flavor_ is used to identify standalone SDKs that are part of a major
  ecosystem.  
  Official Sentry SDKs use the _entity_ `sentry`. Examples:
  - `sentry.python`
  - `sentry.javascript.react-native`

`version`:

: **Required**. The version of the SDK. It should have the [Semantic
  Versioning](https://semver.org) format `MAJOR.MINOR.PATCH`, without any prefix
  (no `v` or anything else in front of the major version number).  
  Examples:
  - `0.1.0`
  - `1.0.0`
  - `4.3.12`

`integrations`:

: _Optional_. A list of names identifying enabled integrations. The list should
  have all enabled integrations, including default integrations. Default
  integrations are included because different SDK releases may contain different
  default integrations.

`packages`:

: _Optional_. A list of packages that were installed as part of this SDK or the
  activated integrations. Each package consists of a `name` in the format
  `source:identifier` and `version`.  
  If the source is a Git repository, the source should be `git`, the
  `identifier` should be a checkout link and the `version` should be a Git
  reference (branch, tag or SHA).

## Example

The following example illustrates the SDK part of the [event payload]({%- link
_documentation/development/sdk-dev/event-payloads/index.md -%}) and omits other
attributes for simplicity.

```json
{
  "sdk": {
    "name": "sentry.javascript.react-native",
    "version": "1.0.0",
    "integrations": [
      "redux"
    ],
    "packages": [
      {
        "name": "npm:@sentry/react-native",
        "version": "0.39.0"
      },
      {
        "name": "git:https://github.com/getsentry/sentry-cocoa.git",
        "version": "4.1.0"
      }
    ]
  }
}
```

{% version_added Sentry: 8.4 %}
