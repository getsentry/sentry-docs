---
title: 'Hermes'
robots: noindex
---

Sentry added support to `hermes` which required changes to the SDK as well as Sentry itself.

Sentry customers using the SaaS product (sentry.io) will only need to update the SDK.
The minimum required version for the SDK is `@sentry/react-native` [SDK version `1.3.3`](https://github.com/getsentry/sentry-react-native/releases/tag/1.3.3).

For Sentry open source, self hosted users, the minimum version required is [f07352b](https://hub.docker.com/r/getsentry/sentry/tags?page=1&name=f07352b).

Other than making sure you have the minimum version of the SDK and Sentry itself is all you need besides the standard integration described in the main [React Native Sentry documentation]({%- link _documentation/clients/react-native/index.md -%}).
