---
title: 'Troubleshooting'
sidebar_order: 3
---

Source maps can sometimes be tricky to get going. If you’re having trouble, try the following tips.

### Verify release is configured

It's possible to have created a release and not have tagged your errors with the same release. 

Open up the issue from the Sentry UI and check if the release is configured. If it says "_not configured_" or "_N/A_" next to **Release** on the right hand side of the screen (or if you do not see a `release` tag in the list of tags), you'll need to go back and [tag your errors]({%- link _documentation/workflow/releases.md -%}#tag-errors). If this is properly set up you'll see "Release: my_example_release". 

### Verify artifacts are uploaded

Once your release is properly configured and issues are tagged, you can then click on the release >> Artifacts (or **Releases >> your specific release >> Artifacts**) to check that they are in fact uploaded to the correct release (or at all).

Additionally, make sure the correct files are available. For Sentry to de-minify your stacktraces you must provide both the minified files (e.g. app.min.js) and the corresponding source maps. In case the source map files do not contain your original source code (`sourcesContent`), you must additionally provide the original source files. (Alternatively, sentry-cli will automatically embed the sources (if missing) into your source maps if you pass the `--rewrite` flag.)

### Verify sourceMappingURL is present

Some CDNs automatically strip comments from static files, including JavaScript files. This can have the effect of stripping your JavaScript file of its `sourceMappingURL` directive, because it is considered a comment. For example, CloudFlare has a feature called [Auto-Minify](https://blog.cloudflare.com/an-all-new-and-improved-autominify/) which will strip `sourceMappingURL` if it is enabled.

Double-check that your deployed, final JavaScript files have `sourceMappingURL` present.

Alternately, instead of `sourceMappingURL`, you can set a `SourceMap` HTTP header on your minified file. If this header is present, Sentry will use it to discover the location of your source map.

### Verify artifact names match sourceMappingURL

When [uploading source maps to Sentry]({%- link _documentation/platforms/javascript/sourcemaps/availability.md -%}), you must name your source map files with the same name found in `sourceMappingURL`.

For example, if you have the following in a minified application file, `app.min.js`:

```javascript
//-- end app.min.js
//# sourceMappingURL=https://example.com/dist/js/app.min.js.map
```

Sentry will look for a matching artifact named exactly `https://example.com/dist/js/app.min.js.map`.

Note also that Sentry will resolve relative paths. For example, if you have the following:

```javascript
// -- end app.min.js (located at https://example.com/dist/js/app.min.js)
//# sourceMappingURL=app.min.js.map
```

Sentry will resolve `sourceMappingURL` relative to `https://example.com/dist/js/` (the root path from which `app.min.js` was served). You will again need to name your source map with the full URL: `https://example.com/dist/js/app.min.js.map`.

If you serve the same assets from multiple origins, you can also alternatively use our tilde (~) path prefix to ignore matching against protocol + hostname. In which case, `~/dist/js/app.min.js.map`, will also work. See: [Assets Accessible at Multiple Origins]({%- link _documentation/platforms/javascript/sourcemaps/availability.md -%}#uploading-source-maps-to-sentry).


### Verify artifact names and file path are correct

For a given lookup, there are up to four variations of the filename which it will attempt to match: 

- The original URL, verbatim 
- The full URL, but with scheme and domain replaced by `~`
- (Additionally, when applicable, each of these options but with any query string removed)

**Note:** The `~` will only match scheme and domain name, it is not a glob!

`http://mysite.com/foo/bar/baz.js` will match

`~/foo/bar/baz.js` or `http://mysite.com/foo/bar/baz.js` 

but will NOT match `~/baz.js`. 

You can also verify that those artifacts match the `abs_path` of the frames (or the full path with a ~ instead of the scheme and domain). From a Sentry issue click the JSON link and locate the `abs_path` to check this. 

### Verify artifacts are uploaded before errors occur

Sentry expects that source code and source maps in a given release are uploaded to Sentry **before** errors occur in that release.

If you upload artifacts **after** an error is captured by Sentry, Sentry will not go back and retroactively apply any source annotations to those errors. Only new errors triggered after the artifact was uploaded will be affected.

### Verify your source maps are built correctly

We maintain an online validation tool that can be used to test your **hosted** source (and source maps) against: [sourcemaps.io](http://sourcemaps.io).

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

// line and column located in your generated file (e.g. source of your error
// from your minified file)
var GENERATED_LINE_AND_COLUMN = {line: 1, column: 1000};

var rawSourceMap = fs.readFileSync(GENERATED_FILE).toString();
var smc = new sourceMap.SourceMapConsumer(rawSourceMap);

var pos = smc.originalPositionFor(GENERATED_LINE_AND_COLUMN);

// should see something like:
// { source: 'original.js', line: 57, column: 9, name: 'myfunc' }
console.log(pos);
```

If you have the same (incorrect) results locally as you do via Sentry, double-check your source map generation configuration.

### Verify your source files are not too large

For an individual artifact, Sentry accepts a max filesize of **40 MB**.

Often users hit this limit because they are transmitting source files at an interim build stage. For example, after Webpack/Browserify has combined all your source files, but before minification has taken place. If possible, send the original source files.

### Verify artifacts are not gzipped

The Sentry API currently only works with source maps and source files that are uploaded as plain text (UTF-8 encoded). If the files are uploaded in a compressed format (e.g. gzip), they will be not be interpreted correctly.

This sometimes occurs with build scripts and plugins that produce pre-compressed minified files. For example, Webpack’s [compression plugin](https://github.com/webpack/compression-webpack-plugin). You’ll need to disable such plugins and perform the compression _after_ the generated source maps / source files have been uploaded to Sentry.
