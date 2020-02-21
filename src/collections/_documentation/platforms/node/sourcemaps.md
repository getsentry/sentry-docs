---
title: Source Maps
sidebar_order: 12
---

Sentry supports un-minifying JavaScript via [Source Maps](http://blog.sentry.io/2015/10/29/debuggable-javascript-with-source-maps.html). This lets you view source code context obtained from stack traces in their original untransformed form, which is particularly useful for debugging minified code (e.g. UglifyJS), or transpiled code from a higher-level language (e.g. TypeScript, ES6).

Source maps can be either:

1.  Uploaded directly to Sentry (**recommended**).
2.  Served publicly over HTTP alongside your source files.

## Generating a Source Map

Most modern JavaScript transpilers support source maps. Below are instructions for some common tools.

### Webpack

Webpack is a powerful build tool that resolves and bundles your JavaScript modules into files fit for running in the browser. It also supports many different “loaders” which can convert higher-level languages like TypeScript and ES6/ES2015 into browser-compatible JavaScript.

You can configure Webpack to output source maps by editing `webpack.config.js`.

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

{% capture __alert_content -%}
If you want to rely on Sentry's source map resolution, make sure that your code is not using the [source-map-support](https://www.npmjs.com/package/source-map-support) package, as it overwrites the captured stack trace in a way that makes it impossible for our processors to correctly parse it.
{%- endcapture -%}
{%- include components/alert.html
  title="source-map-support"
  content=__alert_content
  level="warning"
%}

## Making Source Maps Available to Sentry

Source maps for Node.js projects should be **uploaded directly** to Sentry.

### Uploading Source Maps to Sentry

Sentry provides an abstraction called **Releases** which you can attach source artifacts to. The release API is intended to allow you to store source files (and source maps) within Sentry.

You can do this with the help of the `sentry-webpack-plugin`, which internally uses our Sentry CLI.

-   Start by creating a new authentication token under **[Account] > API**.
-   Ensure you have `project:write` selected under scopes.
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
Sentry.init({
  dsn: '___PUBLIC_DSN___',
  release: process.env.RELEASE
});
```

{% capture __alert_content -%}
You don't _have_ to use _RELEASE_ environment variables. You can provide them in any way you want, just make sure that `release` from your upload **matches** `release` from your `init` call.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="info"
%}

Additional information can be found in the [Releases API documentation]({%- link _documentation/api/releases/index.md -%}).

## Updating Sentry SDK configuration to support Source Maps

For Sentry to understand how to resolve errors sources, we need to modify the data we send. Thankfully, we have an integration called `RewriteFrames` which can be used to do just that.

```javascript
import { RewriteFrames } from '@sentry/integrations';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new RewriteFrames()]
});
```

There’s one critical thing to note here. This config assumes, that you’ll bundle your application into a single file, which will be served and then uploaded to Sentry from the root of the project's directory.

If you're not doing this, e.g. you're using TypeScript and upload all your compiled files separately to the server, then this may take a little more effort. Please refer to [TypeScript usage docs]({%- link _documentation/platforms/node/typescript.md -%}) to see a more complex and detailed example.
