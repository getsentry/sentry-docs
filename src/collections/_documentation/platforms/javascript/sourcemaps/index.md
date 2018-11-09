---
title: 'Source Maps'
sidebar_order: 60
---

Sentry supports un-minifying JavaScript via source maps. This lets you view source code context obtained from stack traces in their original untransformed form, which is particularly useful for debugging minified code (e.g. UglifyJS), or transpiled code from a higher-level language (e.g. TypeScript, ES6).

## Specify the release

If you are uploading source map artifacts yourself, you must [specify the release]({%- link _documentation/workflow/releases.md -%}) in your SDK.  Sentry will use the release name to associate digested event data with the files you’ve uploaded via the [releases API]({%- link _documentation/api/releases/index.md -%}), [sentry-cli]({%- link _documentation/cli/index.md -%}) or [sentry-webpack-plugin](https://github.com/getsentry/sentry-webpack-plugin). This step is optional if you are hosting source maps on the remote server.

## Next Steps

-   [Generating a Source Map]({%- link _documentation/platforms/javascript/sourcemaps/generation.md -%})
-   [Making Source Maps Available to Sentry]({%- link _documentation/platforms/javascript/sourcemaps/availability.md -%})
-   [Troubleshooting]({%- link _documentation/platforms/javascript/sourcemaps/troubleshooting.md -%})

## Additional Resources

* [Using sentry-cli to Upload Source Maps]({%- link _documentation/cli/releases.md -%}#sentry-cli-sourcemaps)
* [Debuggable JavaScript with Source Maps](http://blog.sentry.io/2015/10/29/debuggable-javascript-with-source-maps.html)
* [4 Reasons Why Your Source Maps Are Broken](https://blog.sentry.io/2018/10/18/4-reasons-why-your-source-maps-are-broken)