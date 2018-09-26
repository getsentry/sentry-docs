---
title: 'SDK Interface'
sidebar_order: 13
---

An interface which describes the SDK and its configuration used to capture and
transmit the event.

`name`

: **Required**. The name of the SDK. Its format is `sentry.ecosystem[.flavor]`
where the _flavor_ is optional and should only be set if it has its own SDK.

`version`

: **Required**. The semantic version of the SDK. The version should always be
sent without a `v` prefix.

`integrations`

: _Optional_. A list of integrations with the platform or a framework that were
explicitly actived by the user. This does not include default integrations.

`packages`

: _Optional_. A list of packages that were installed as part of this SDK or the
activated integrations. Each package consists of a `name` in the format
`source:identifier` and a semver `version`. If the source is a git repository,
a checkout link and git reference (branch, tag or sha) should be used.

## Example

```json
"sdk": {
  "name": "sentry.javscript.react-native",
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
```
