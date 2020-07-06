---
title: 'Source Maps'
sidebar_order: 3
robots: noindex
---

Sentry supports un-minifying JavaScript via [Source Maps](http://blog.sentry.io/2015/10/29/debuggable-javascript-with-source-maps.html). This lets you view source code context obtained from stack traces in their original untransformed form, which is particularly useful for debugging minified code (e.g. UglifyJS), or transpiled code from a higher-level language (e.g. TypeScript, ES6).

Most of the process is the same whether you're using this SDK or the [new unified JavaScript Browser SDK](/platforms/javascript/), so the main docs for dealing with source maps can be found [there](/platforms/javascript/sourcemaps/). The one difference is how you specify the release in your SDK configuration.

## Specify the release in Raven.js {#specify-the-release-in-raven-js}

If you are uploading source map artifacts yourself, you must specify the release in your Raven.js client configuration. Sentry will use the release name to associate digested event data with the files you’ve uploaded via the [releases API](/api/releases/), [sentry-cli](/cli/) or [sentry-webpack-plugin](https://github.com/getsentry/sentry-webpack-plugin). This step is optional if you are hosting source maps on the remote server, but still recommended.

```javascript
Raven.config('your-dsn', {
  release: '1.2.3-beta'
}).install();
```
## Next Steps

Now that you've specified the release in your SDK config, head on over to [our main source maps docs](/platforms/javascript/sourcemaps/) to learn how to [create your source maps](/platforms/javascript/sourcemaps/) and [make them available to Sentry](/platforms/javascript/sourcemaps/). There you'll also find a [troubleshooting guide](/platforms/javascript/sourcemaps/).
