---
title: 'Hermes'
---

Sentry added support for `react-native` builds that use the `hermes` engine, which required changes to the sentry SDK, `sentry-cli` as well as Sentry itself.

Sentry customers using the SaaS product (sentry.io) will need to update the SDK, and `sentry-cli`.
The minimum required version for the SDK is `@sentry/react-native` [SDK version `1.3.3`](https://github.com/getsentry/sentry-react-native/releases/tag/1.3.3),
and `@sentry/cli` [version `1.5.1`](https://github.com/getsentry/sentry-cli/releases/tag/1.51.1).

For Sentry open source, self-hosted users, the minimum version required is [f07352b](https://hub.docker.com/r/getsentry/sentry/tags?page=1&name=f07352b).

Other than making sure you have the minimum version of the SDK, Sentry itself is all you need besides the standard integration described in the [React Native Sentry documentation]({%- link _documentation/clients/react-native/index.md -%}).

## Custom SourceMaps

The combination of `@sentry/react-native` and `@sentry/cli` should integrate
correctly into the `react-native` build pipeline to find and upload the correct source map.

However, care must be taken to upload the correct source map when manually bundling and building react-native apps.

Building Hermes bundles is a three-step process, each of which creates a different
source map.

1. Bundling / minifying using `metro`: `index.android.bundle.packager.map`
2. Compiling to bytecode using `hermes`: `index.android.bundle.compiler.map`
3. Merging SourceMaps using `compose-source-maps`: `index.android.bundle.packager.map + index.android.bundle.compiler.map => index.android.bundle.map`

It is important to upload the third SourceMap (`index.android.bundle.map`)
via `sentry-cli`.