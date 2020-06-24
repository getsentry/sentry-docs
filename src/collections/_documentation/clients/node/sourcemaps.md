---
title: 'Source Maps'
sidebar_order: 2
robots: noindex
---

Sentry supports un-minifying JavaScript via [Source Maps](http://blog.sentry.io/2015/10/29/debuggable-javascript-with-source-maps.html). This lets you view source code context obtained from stack traces in their original untransformed form, which is particularly useful for debugging minified code (e.g. UglifyJS), or transpiled code from a higher-level language (e.g. TypeScript, ES6).

## Generating a Source Map

Most modern JavaScript transpilers support source maps. Below are instructions for some common tools.

### Webpack

Webpack is a powerful build tool that resolves and bundles your JavaScript modules into files fit for running in the browser. It also supports many different “loaders” which can convert higher-level languages like TypeScript and ES6/ES2015 into browser-compatible JavaScript.

Webpack can be configured to output source maps by editing `webpack.config.js`.

```javascript
const path = require('path');

module.exports = {
    // ... other config above ...
    target: 'node',
    devtool: 'source-map',
    entry: {
      "app": './src/app.js'
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js'
    }
};
```

## Making Source Maps Available to Sentry

Source maps for Node.js projects should be uploaded directly to Sentry.

### Uploading Source Maps to Sentry

Sentry provides an abstraction called **Releases** which you can attach source artifacts to. The release API is intended to allow you to store source files (and source maps) within Sentry.

It can be easily done with a help of the `sentry-webpack-plugin`, which internally uses our Sentry CLI.

-   Start by creating a new authentication token under **[Account] > API**.
-   Ensure you you have `project:write` selected under scopes.
-   Install `@sentry/webpack-plugin` using `npm`
-   Create `.sentryclirc` file with necessary config (see Sentry Webpack Plugin docs below)
-   Update your `webpack.config.json`

```javascript
const SentryPlugin = require('@sentry/webpack-plugin');

module.exports = {
    // ... other config above ...
    plugins: [
      new SentryPlugin({
        release: process.env.RELEASE,
        include: './dist'
      })
    ]
};
```

You can take a look at [Sentry Webpack Plugin documentation](https://github.com/getsentry/sentry-webpack-plugin) for more information on how to configure the plugin.

Additionally, you’ll need to configure the client to send the `release`:

```javascript
Raven.config('your-dsn', {
    release: process.env.RELEASE
});
```

Note: You dont _have_ to use _RELEASE_ environment variables. You can provide them in any way you want.

Additional information can be found in the [Releases API documentation](/api/releases/).

## Updating Raven configuration to support Source Maps

In order for Sentry to understand how to resolve errors sources, we need to modify the data we send. Because Source Maps support is still in experimental phase, this task is not integrated into the core library itself. To do that however, we can normalize all urls using `dataCallback` method:

```javascript
var path = require('path');

Raven.config('your-dsn', {
    // the rest of configuration

  dataCallback: function (data) {
    var stacktrace = data.exception && data.exception[0].stacktrace;

    if (stacktrace && stacktrace.frames) {
      stacktrace.frames.forEach(function(frame) {
        if (frame.filename.startsWith('/')) {
          frame.filename = 'app:///' + path.basename(frame.filename);
        }
      });
    }

    return data;
  }
).install();
```

There’s one very important thing to note here. This config assumes, that you’ll bundle your application into a single file. That’s why we are using _path.basename_ to get the filename.

If you are not doing this, eg. you are using TypeScript and upload all your compiled files separately to the server, then we need to be a little smarter about this. Please refer to [TypeScript usage docs](/clients/node/typescript/) to see a more complex and detailed example.
