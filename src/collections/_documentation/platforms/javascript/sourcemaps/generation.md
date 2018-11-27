---
title: 'Generating'
sidebar_order: 1
---

Most modern JavaScript transpilers support source maps. Below are instructions for some common tools.

### UglifyJS

UglifyJS is a popular tool for minifying your source code for production. It can dramatically reduce the size of your files by eliminating whitespace, rewriting variable names, removing dead code branches, and more.

If you are using UglifyJS to minify your source code, the following command will additionally generate a source map that maps the minified code back to the original source:

```bash
uglifyjs app.js \
  -o app.min.js.map \
  --source-map url=app.min.js.map,includeSources
```

### Webpack

Webpack is a powerful build tool that resolves and bundles your JavaScript modules into files fit for running in the browser. It also supports various _loaders_ to transpile higher-level languages, reference stylesheets, or include static assets.

We have created a convenient [webpack plugin](https://github.com/getsentry/sentry-webpack-plugin) that configures source maps and uploads them to Sentry during the build. This is the recommended way for uploading sources to Sentry. First, install the plugin via:

```sh
$ npm install --save-dev @sentry/webpack-plugin
$ yarn add --dev @sentry/webpack-plugin
```

To allow the plugin to upload source maps automatically, create a `.sentryclirc` or configure environment variables as described in the [CLI configuration docs]({%- link _documentation/cli/configuration.md -%}). Then, add the plugin to your `webpack.config.js`:

```javascript
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

module.exports = {
  // other configuration
  plugins: [
    new SentryWebpackPlugin({
      include: '.',
      ignoreFile: '.sentrycliignore',
      ignore: ['node_modules', 'webpack.config.js'],
      configFile: 'sentry.properties'
    })
  ]
};
```

Alternatively, if you prefer to upload source maps manually, Webpack just needs to be configured to output source maps:

```javascript
module.exports = {
    output: {
      path: path.join(__dirname, 'dist'),
      filename: "[name].js",
      sourceMapFilename: "[name].js.map"
    }
    // other configuration
};
```

{% capture __alert_content -%}
In case you use [SourceMapDevToolPlugin](https://webpack.js.org/plugins/source-map-dev-tool-plugin) for more fine grained control of source map generation, leave `noSources` turned off, so Sentry can display proper source code context in event stack traces.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

### SystemJS

SystemJS is the default module loader for Angular 2 projects. The [SystemJS build tool](https://github.com/systemjs/builder) can be used to bundle, transpile, and minify source code for use in production environments, and can be configured to output source maps.

```javascript
builder.bundle('src/app.js', 'dist/app.min.js', {
    minify: true,
    sourceMaps: true,
    sourceMapContents: true
});
```

{% capture __alert_content -%}
All of the example configurations above inline your original, un-transformed source files into the generated source map file. Sentry requires both source map(s) **and** your original source files in order to perform reverse transformations. If you choose NOT to inline your source files, you must make those source files available to Sentry in _addition_ to your source maps (see below).
{%- endcapture -%}
{%- include components/alert.html
  title="Inline Sources"
  content=__alert_content
%}

### TypeScript

The TypeScript compiler can output source maps. Configure the `sourceRoot` property to `/` to strip the build path prefix from generated source code references. This allows Sentry to match source files relative to your source root folder:

```json
{
    "compilerOptions": {
        "sourceMap": true,
        "inlineSources": true,
        "sourceRoot": "/"
    }
}
```
