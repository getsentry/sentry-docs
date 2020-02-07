---
title: 'Source Maps'
sidebar_order: 60
---

Sentry supports un-minifying JavaScript via source maps. This lets you view source code context obtained from stack traces in their original untransformed form, which is particularly useful for debugging minified code (for example, UglifyJS), or transpiled code from a higher-level language (for example, TypeScript, ES6).

## Specify the release

If you are uploading source map artifacts yourself, you must [specify the release]({%- link _documentation/workflow/releases.md -%}) in your SDK.  Sentry will use the release name to associate digested event data with the files you’ve uploaded via the [releases API]({%- link _documentation/api/releases/index.md -%}), [sentry-cli]({%- link _documentation/cli/index.md -%}) or [sentry-webpack-plugin](https://github.com/getsentry/sentry-webpack-plugin). This step is optional if you are hosting source maps on the remote server.

## Generating a Source Map


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
  level="info"
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

## Hosting / Uploading


Source maps can be either:

1.  Uploaded directly to Sentry (**recommended**).
2.  Served publicly over HTTP alongside your source files.

### Uploading Source Maps to Sentry

Except for [webpack]({%- link _documentation/platforms/javascript/sourcemaps.md -%}#webpack), the recommended way to upload source maps is using [Sentry CLI]({%- link _documentation/cli/index.md -%}). If you have used [_Sentry Wizard_](https://github.com/getsentry/sentry-wizard) to set up your project, it has already created all necessary configuration to upload source maps. Otherwise, follow the [CLI configuration docs]({%- link _documentation/cli/configuration.md -%}) to set up your project.

Now you need to set up your build system to create a release, and attach the various source files. For Sentry to de-minify your stack traces you must provide both the minified files (for example, app.min.js) and the corresponding source maps. In case the source map files do not contain your original source code (`sourcesContent`), you must additionally provide the original source files. (Alternatively, sentry-cli will automatically embed the sources (if missing) into your source maps if you pass the `--rewrite` flag.)

Sentry uses [**Releases**]({%- link _documentation/workflow/releases.md -%}) to match the correct source maps to your events. To create a new release, run the following command (for example, during publishing):

```sh
$ sentry-cli releases new <release_name>
```

The release name must be **unique within your organization** and match the `release` option in your SDK initialization code. Then, use the `upload-sourcemaps` command to scan a folder for source maps, process them and upload them to Sentry:

```sh
$ sentry-cli releases files <release_name> upload-sourcemaps /path/to/files
```

This command will upload all files ending in _.js_ and _.map_ to the specified release. If you wish to change these extensions – for example, to upload typescript sources – use the `--ext` option:

```sh
$ sentry-cli releases files <release_name> upload-sourcemaps --ext ts --ext map /path/to/files
```

Until now, the release is in a draft state (“_unreleased_”). Once all source maps have been uploaded and your app has been published successfully, finalize the release with the following command:

```sh
$ sentry-cli releases finalize <release_name>
```

For convenience, you can alternatively pass the `--finalize` flag to the `new` command which will immediately finalize the release.

{% capture __alert_content -%}
You don't have to upload the source files (referenced by source maps), but **without them the grouping algorithm will not be as strong**, and the UI will not show any contextual source.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

Additional information can be found in the [Releases API documentation]({%- link _documentation/api/releases/index.md -%}).

{% capture __alert_content -%}
It’s not uncommon for a web application to be accessible at multiple origins. For example:

-   Website is operable over both `https` and `http`
-   Geolocated web addresses: for example, `https://us.example.com`, `https://eu.example.com`
-   Multiple static CDNs: for example, `https://static1.example.com`, `https://static2.example.com`
-   Customer-specific domains/subdomains

In this situation, **identical** JavaScript and source map files may be located at two or more distinct origins. If you are dealing with such a deployment, you have two choices for naming your uploaded artifacts:

1.  Upload the same artifact multiple times with each possible URL where it appears, for example:

    > -   [https://static1.example.com/js/app.js](https://static1.example.com/js/app.js)
    > -   [https://static2.example.com/js/app.js](https://static2.example.com/js/app.js)
2.  Alternatively, you can omit the protocol + host and use a special tilde (~) prefixed path like so:

    > ~/js/app.js

The ~ prefix tells Sentry that for a given URL, **any** combination of protocol and hostname whose path is `/js/app.js` should use this artifact. **ONLY** use this method if your source/source map files are identical at all possible protocol/hostname combinations. **Sentry will prioritize full URLs over tilde prefixed paths, if found**.
{%- endcapture -%}
{%- include components/alert.html
  title="Assets Accessible at Multiple Origins"
  content=__alert_content
%}

{% capture __alert_content -%}
Unfortunately it can be quite challenging to ensure that source maps are actually valid themselves and uploaded correctly. To ensure that everything is working as intended you can use the `–-validate` flag when uploading source maps which will attempt to locally parse the source map and look up the references. Note that there are known cases where the validate flag will indicate failures when the setup is correct (if you have references to external source maps then the validation tool will indicate a failure).

Here are some things you can check in addition to the validation step:

-   Make sure that the URL prefix is correct for your files. This is easy to get wrong.
-   Make sure you upload the matching source maps for your minimized files.
-   Make sure that your minified files you have on your servers actually have references to your files.
{%- endcapture -%}
{%- include components/alert.html
  title="Validating source maps with Sentry CLI"
  content=__alert_content
%}

### Hosting Source Map Files

By default, Sentry will look for source map directives in your compiled JavaScript files, which are located on the last line and have the following format:

```javascript
//# sourceMappingURL=<url>
```

When Sentry encounters such a directive, it will resolve the source map URL relative the source file in which it is found, and attempt an HTTP request to fetch it.

So for example if you have a minified JavaScript file located at `http://example.org/js/app.min.js`. And in that file, on the last line, the following directive is found:

```javascript
//# sourceMappingURL=app.js.map
```

Sentry will attempt to fetch `app.js.map` from [http://example.org/js/app.js.map](http://example.org/js/app.js.map).

Alternatively, during source map generation you can specify a fully qualified URL where your source maps are located:

```javascript
//# sourceMappingURL=http://example.org/js/app.js.map
```

While making source maps available to Sentry from your servers is the easiest integration, it is not always advisable:

-   Sentry may not always be able to reach your servers.
-   If you do not specify versions in your asset URLs, there may be a version mismatch
-   The additional latency may mean that source mappings are not available for all errors.

For these reasons, it is recommended to upload source maps to Sentry beforehand (see [above](#uploading-source-maps-to-sentry)).

{% capture __alert_content -%}
While the recommended solution is to upload your source artifacts to Sentry, sometimes it’s necessary to allow communication from Sentry’s internal IPs. For more information on Sentry’s public IPs, [IP Ranges]({%- link ip-ranges.md -%}#ip-ranges).
{%- endcapture -%}
{%- include components/alert.html
  title="Working Behind a Firewall"
  content=__alert_content
%}{% capture __alert_content -%}
If you want to keep your source maps secret and choose not to upload your source maps directly to Sentry, you can enable the “Security Token” option in your project settings. This will cause outbound requests from Sentry’s servers to URLs originating from your “Allowed Domains” to have the HTTP header “X-Sentry-Token: {token}” appended, where {token} is a secure value you define. You can then configure your web server to allow access to your source maps when this header/token pair is present. You can alternatively override the default header name (X-Sentry-Token) and use HTTP Basic Authentication. For example, by passing “Authorization: Basic {encoded_password}”.
{%- endcapture -%}
{%- include components/alert.html
  title="Secure Access to Source Maps"
  content=__alert_content
%}

## Troubleshooting


Source maps can sometimes be tricky to get going. If you’re having trouble, try the following tips.

### Verify a release is configured in your SDK

In order for uploaded source maps to be located and applied, the release needs to be created by the CLI or API (and the correct artifacts uploaded with it), and the name of that newly-created release needs to be specified in your SDK configuration.

To verify this, open up the issue from the Sentry UI and check if the release is configured. If it says "_not configured_" or "_N/A_" next to **Release** on the right hand side of the screen (or if you do not see a `release` tag in the list of tags), you'll need to go back and [tag your errors]({%- link _documentation/workflow/releases.md -%}#tag-errors). If this is properly set up you'll see "Release: my_example_release". 

### Verify artifacts are uploaded

Once your release is properly configured and issues are tagged, from within an issue you can then click on the release >> Artifacts (or **Releases >> your specific release >> Artifacts**) to check that your source maps and the associated files are in fact uploaded to the correct release.

Additionally, make sure all of the necessary files are available. For Sentry to de-minify your stack traces you must provide both the minified files (for example, app.min.js) and the corresponding source maps. In case the source map files do not contain your original source code (`sourcesContent`), you must additionally provide the original source files. (Alternatively, sentry-cli will automatically embed the sources (if missing) into your source maps if you pass the `--rewrite` flag.)

### Verify `sourceMappingURL` is present

Some CDNs automatically strip comments from static files, including JavaScript files. This can have the effect of stripping your JavaScript file of its `sourceMappingURL` directive, because it is considered a comment. For example, CloudFlare has a feature called [Auto-Minify](https://blog.cloudflare.com/an-all-new-and-improved-autominify/) which will strip `sourceMappingURL` if it is enabled.

Double-check that your deployed, final JavaScript files have `sourceMappingURL` present.

Alternately, instead of `sourceMappingURL`, you can set a `SourceMap` HTTP header on your minified file. If this header is present, Sentry will use it to discover the location of your source map.

### Verify artifact names match `sourceMappingURL` value

The `sourceMappingURL` comment on the last line of your bundled or minified JavaScript file tells Sentry (or the browser) where to locate the corresponding source map. This can either be a fully qualified URL, a relative path, or the filename itself. When uploading artifacts to Sentry, you must name your source map files with the value the file resolves to.

i. e. if your file is similar to:

```javascript
    // -- end script.min.js
    //# sourceMappingURL=script.min.js.map
```

and is hosted at http://example.com/js/script.min.js, then Sentry will look for that source map file at http://example.com/js/script.min.js.map. Your uploaded artifact must therefore be named `http://example.com/js/script.min.js.map` (or `~/js/script.min.js.map`). 

Or, if your file is similar to: 

```javascript
    //-- end script.min.js
    //# sourceMappingURL=https://example.com/dist/js/script.min.js.map
```

then your uploaded artifact should also be named `https://example.com/dist/js/script.min.js.map` (or `~/dist/js/script.min.js.map`).

Finally, if your file is similar to:

```javascript
    //-- end script.min.js
    //# sourceMappingURL=../maps/script.min.js.map
```

then your uploaded artifact should be named `https://example.com/dist/maps/script.min.js.map` (or `~/dist/maps/script.min.js.map`).


### Verify artifact names match stack trace frames

If you’ve uploaded source maps and they aren’t applying to your code in an issue in Sentry, take a look at the JSON of the event and look for the `abs_path` to see exactly where we’re attempting to resolve the file  - for example, `http://localhost:8000/scripts/script.js` (`abs_path` will appear once for each frame in the stack trace - match this up with the file(s) that are not deminified.). A link to the JSON view can be found at the top of the issue page next to the date the event occurred. The uploaded artifact names must match these values.

If you have **dynamic values in your path** (for example, `https://www.site.com/{some_value}/scripts/script.js`), you may want to use the [`rewriteFrames`]({%- link _documentation/platforms/javascript/index.md -%}#rewriteframes) integration to change your `abs_path` values.

#### Using sentry-cli

If your `sourceMappingURL` comment is similar to:

```javascript
// -- end script.min.js (located at http://localhost:8000/scripts/script.min.js)
//# sourceMappingURL=script.min.js.map
```

An example `sentry-cli` command to upload these files correctly would look like this (assuming you’re in the `/scripts` directory, running your web server from one directory higher, which is why we’re using the `--url-prefix` option):

```curl
sentry-cli releases files VERSION upload-sourcemaps . --url-prefix '~/scripts'
```

This command uploads all JavaScript files in the current directory. The Artifacts page in Sentry should now look like:
```
~/scripts/script.js
~/scripts/script.min.js
~/scripts/script.min.js.map
```

Alternately you can specify which files to upload. For example:

```
sentry-cli releases files VERSION upload-sourcemaps script.min.js script.min.js.map --url-prefix '~/scripts'
```

You can also upload it with the fully qualified URL. For example:
```
sentry-cli releases files VERSION upload-sourcemaps . --url-prefix 'http://localhost:8000/scripts'
```

#### Using the API

You can alternately [use our API]({%- link _documentation/api/releases/post-organization-release-files.md -%}) to upload artifacts, following the same naming convention explained here.



```curl
curl -X POST \
  https://sentry.io/api/0/organizations/ORG_NAME/releases/VERSION/files/ \
  -H 'Authorization: Bearer AUTH_TOKEN' \
  -H 'content-type: multipart/form-data' \
  -F file=@script.min.js.map \
  -F 'name=~/scripts/script.min.js.map'
```

#### Using the `~`

The `~` is used in Sentry to replace the scheme and domain. It is not a glob!

`http://example.com/dist/js/script.js` will match `~/dist/js/script.js` or `http://example.com/dist/js/script.js`

but will NOT match `~/script.js`.


### Verify artifacts are uploaded before errors occur

Sentry expects that source code and source maps in a given release are uploaded to Sentry **before** errors occur in that release.

If you upload artifacts **after** an error is captured by Sentry, Sentry will not go back and retroactively apply any source annotations to those errors. Only new errors triggered after the artifact was uploaded will be affected.

### Verify your source maps are built correctly

We maintain an online validation tool that can be used to test your source maps against your **hosted** source: [sourcemaps.io](http://sourcemaps.io).

Alternatively, if you are using Sentry CLI to upload source maps to Sentry, you can use the `–validate` command line option to verify your source maps are correct.

### Verify your source maps work locally

If you find that Sentry is not mapping filename, line, or column mappings correctly, you should verify that your source maps are functioning locally. To do so, you can use Node.js coupled with Mozilla’s [source-map library](https://github.com/mozilla/source-map).

First, install `source-map` globally as an npm module:

```bash
npm install -g source-map
```

Then, write a script that reads your source map file and tests a mapping. Here’s an example:

```JavaScript
var fs        = require('fs'),
    path      = require('path'),
    sourceMap = require('source-map');

// file output by Webpack, Uglify, etc.
var GENERATED_FILE = path.join('.', 'app.min.js.map');

// line and column located in your generated file (for example, the source of your error
// from your minified file)
var GENERATED_LINE_AND_COLUMN = {line: 1, column: 1000};

var rawSourceMap = fs.readFileSync(GENERATED_FILE).toString();
new sourceMap.SourceMapConsumer(rawSourceMap)
  .then(function(smc) {
      var pos = smc.originalPositionFor(GENERATED_LINE_AND_COLUMN);

      // should see something like:
      // { source: 'original.js', line: 57, column: 9, name: 'myfunc' }
      console.log(pos);
  });
```

If you have the same (incorrect) results locally as you do via Sentry, double-check your source map generation configuration.

### Verify your source files are not too large

For an individual artifact, Sentry accepts a max filesize of **40 MB**.

Often users hit this limit because they are transmitting source files at an interim build stage. For example, after Webpack/Browserify has combined all your source files, but before minification has taken place. If possible, send the original source files.

### Verify artifacts are not gzipped

The Sentry API currently only works with source maps and source files that are uploaded as plain text (UTF-8 encoded). If the files are uploaded in a compressed format (for example, gzip), they will be not be interpreted correctly.

This sometimes occurs with build scripts and plugins that produce pre-compressed minified files. For example, Webpack’s [compression plugin](https://github.com/webpack/compression-webpack-plugin). You’ll need to disable such plugins and perform the compression _after_ the generated source maps / source files have been uploaded to Sentry.

## Additional Resources

* [Using sentry-cli to Upload Source Maps]({%- link _documentation/cli/releases.md -%}#sentry-cli-sourcemaps)
* [Debuggable JavaScript with Source Maps](http://blog.sentry.io/2015/10/29/debuggable-javascript-with-source-maps.html)
* [4 Reasons Why Your Source Maps Are Broken](https://blog.sentry.io/2018/10/18/4-reasons-why-your-source-maps-are-broken)
