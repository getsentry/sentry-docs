---
title: JavaScript
sidebar_order: 3
---



{% capture __alert %}
Our SDK needs a polyfill for `Promise` in older browsers like IE 11 and lower. 
Please add the script tag below before loading our SDK. The polyfill script for `Promise` is also recommended if you're using an npm package.

```
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Promise"></script>
```

Additionally, keep in mind to define `<!doctype html>` on top of your HTML page, to make sure IE does not go into compatibility mode.
{% endcapture %}

{% include components/alert.html
  title="Support for <= IE 11"
  content=__alert
  level="warning"
%}

Check out this [browser table](#browser-table) for a complete list of supported browsers.

&nbsp;
## Integrating the SDK
All our JavaScript-related SDKs provide the same API. Still, there are some differences between them, such as installation, which this section of the docs explains.

**[Mimi note: Drop down here]**

**[Mimi note: Dropdown which affects install instructions are shown (if nothing is provided in the URL, defaults to browser)]**

- In the browser
- Angular
- Electron
    - Includes some minidump explanation, maybe redirects to the native page
- Ember
- Node.js
- React
    - Includes a note pointing to React Native
- Vue
- Cordova
- Ionic

The quickest way to get started is to use the CDN hosted version of the JavaScript browser SDK:

```
<script src="https://browser.sentry-cdn.com/4.5.3/bundle.min.js" crossorigin="anonymous"></script>

```

&nbsp;
### Connecting the SDK to Sentry
After you've completed setting up a project in Sentry, Sentry will give you a value which we call a _DSN_ or _Data Source Name_. It looks a lot like a standard URL, but it’s just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

**[Mimi note: Drop down here]**

You should `init` the Sentry Browser SDK as soon as possible during your page load:

```
Sentry.init({ dsn: 'https://<key>@sentry.io/<project>' });
```

Most SDKs will now automatically collect data if available; some require extra configuration as automatic error collecting is not possible due to platform limitations.

&nbsp;
## Capturing Errors
### Capturing Errors / Exceptions {#capturing-errors}
In JavaScript, you can pass an error object to `captureException()` to get it captured as an event.

```
try {
  aFunctionThatMightFail();
} catch (err) {
  Sentry.captureException(err);
}
```

{% capture __alert_content -%}
It's possible to throw strings as errors. In this case, the Sentry SDK will not record tracebacks.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

&nbsp;
### Automatically Capturing Errors
Sentry attaches global handlers to capture uncaught exceptions and unhandled rejections.

**[Mimi note: Code Snippet]**

&nbsp;
### Automatically Capturing Errors with Promises
By default, Sentry for JavaScript captures unhandled promise rejections as described in the official ECMAScript 6 standard.

**[Mimi note: Example Code]**

Configuration may be required if you are using a third-party library to implement promises:

Most promise libraries have a global hook for capturing unhandled errors. You may want to disable default behavior by setting `captureUnhandledRejections` option to `false` and manually hook into such event handler and call `Sentry.captureException` or `Sentry.captureMessage` directly.

For example, the [RSVP.js library](https://github.com/tildeio/rsvp.js/) (used by Ember.js) allows you to bind an event handler to a [global error event](https://github.com/tildeio/rsvp.js#error-handling).

```
RSVP.on('error', function(reason) {
  Sentry.captureException(reason);
});
```

[Bluebird](http://bluebirdjs.com/docs/getting-started.html) and other promise libraries report unhandled rejections to a global DOM event, `unhandledrejection`. In this case, you don't need to do anything; we've already got you covered with the default `captureUnhandledRejections: true` setting.

Please consult your promise library documentation on how to hook into its global unhandled rejection handler, if it exposes one.

&nbsp;
## Manually Trigger Errors
If your app is in a broken state, but error handling isn't throwing explicit errors, you can manually trigger errors.

**[Mimi note: Trying to cater to the kind of dev who has a set flow. Usually, 1. Initialize, 2. optionally configure, 3. Manually trigger an error (because you wanna take it out for a test drive)]**

&nbsp;
### Capturing Errors

The most common form of capturing is to capture errors. In general, if you have something that looks like an exception it can be captured.

For more information, see [Capturing Errors / Exceptions](#capturing-errors).

&nbsp;
### Generate a Custom Error

You can generate a custom error with `new MyAppError('message')` and by creating a class that extends the built in `Error()` function. For more information, see the [sentry-javascript code example](https://github.com/getsentry/sentry-javascript/blob/master/packages/core/src/error.ts) in GitHub.

&nbsp;
### Setting Context
In addition to the [structured context](#context) that Sentry understands, you can send [arbitrary key/value pairs of data](#extra-context) which the Sentry SDK will store alongside the event. These are not indexed, and the Sentry SDK uses them to add additional information about what might be happening.

&nbsp;
### Capturing Messages

Another common operation is to capture a bare message.  A message is just some textual information that should be sent to Sentry.  Typically messages are not emitted but there are situations when this is useful. For more information, see [Capturing Messages](#messages)

&nbsp;
## Source Maps

{% include components/alert.html
  title="Note"
  content="We **highly recommend** you incorporate source maps with the Sentry JavaScript SDK in order to receive the full benefit of error tracking and monitoring. Source maps will provide stack traces, which will provide more information regarding errors."
  level="warning"
%}

Sentry supports un-minifying JavaScript via source maps. This lets you view source code context obtained from stack traces in their original untransformed form, which is particularly useful for debugging minified code (e.g. UglifyJS), or transpiled code from a higher-level language (e.g. TypeScript, ES6).

When you're using the Sentry JavaScript SDK, the SDK automatically fetches the source code and source maps by scraping the URLs within the stack trace. However, you may have legitimate reasons for [disabling the JavaScript source fetching in Sentry](https://blog.sentry.io/2018/07/17/source-code-fetching).

**[Mimi note: How do you "turn on" Source Maps? This feels like an important question to answer right away. Added Generating Source Maps below.]**

&nbsp;
### Generating Source Maps
Most modern JavaScript transpilers support source maps. Below are instructions for some common tools.

&nbsp;
#### UglifyJS
UglifyJS is a popular tool for minifying your source code for production. It can dramatically reduce the size of your files by eliminating whitespace, rewriting variable names, removing dead code branches, and more.

If you are using UglifyJS to minify your source code, the following command will additionally generate a source map that maps the minified code back to the original source:

```bash
uglifyjs app.js \
  -o app.min.js.map \
  --source-map url=app.min.js.map,includeSources
```

&nbsp;
#### Webpack
Webpack is a powerful build tool that resolves and bundles your JavaScript modules into files fit for running in the browser. It also supports various _loaders_ to transpile higher-level languages, reference stylesheets, or include static assets.

We have created a convenient [Webpack plugin](https://github.com/getsentry/sentry-webpack-plugin) that configures source maps and uploads them to Sentry during the build. This is the recommended way for uploading sources to Sentry. First, install the plugin via:

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

Alternatively, if you prefer to upload source maps manually, Webpack needs to be configured to output source maps:

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
In case you use [SourceMapDevToolPlugin](https://webpack.js.org/plugins/source-map-dev-tool-plugin) for more fine-grained control of source map generation, leave `noSources` turned off, so Sentry can display proper source code context in event stack traces.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

&nbsp;
#### SystemJS
SystemJS is the default module loader for Angular 2 projects. The [SystemJS build tool](https://github.com/systemjs/builder) can be used to bundle, transpile, and minify source code for use in production environments, and you can configured it to output source maps.

```javascript
builder.bundle('src/app.js', 'dist/app.min.js', {
    minify: true,
    sourceMaps: true,
    sourceMapContents: true
});
```

{% capture __alert_content -%}
All of the example configurations above inline your original, un-transformed source files into the generated source map file. Sentry requires both source map(s) **and** your original source files to perform reverse transformations. If you choose NOT to inline your source files, you must make those source files available to Sentry in _addition_ to your source maps (see below).
{%- endcapture -%}
{%- include components/alert.html
  title="Inline Sources"
  content=__alert_content
%}

&nbsp;
#### TypeScript
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

**[Mimi note: How do you enable Source Maps only for Sentry? -- Don't want users to see the data. Remain obfuscated. Added Hosting/Uploading]**

Source maps can be either:

1.  Served publicly over HTTP alongside your source files.
2.  Uploaded directly to Sentry (**recommended**).

### Hosting Source Map Files

By default, Sentry will look for source map directives in your compiled JavaScript files, which are located on the last line and have the following format:

```javascript
//# sourceMappingURL=<url>
```

When Sentry encounters such a directive, it will resolve the source map URL relative the source file in which it is found, and attempt an HTTP request to fetch it.

So for example, if you have a minified JavaScript file located at `http://example.org/js/app.min.js`. And in that file, on the last line, the following directive is found:

```javascript
//# sourceMappingURL=app.js.map
```

Sentry will attempt to fetch `app.js.map` from [http://example.org/js/app.js.map](http://example.org/js/app.js.map).

Alternatively, during source map generation you can specify a fully qualified URL where your source maps are located:

```javascript
//# sourceMappingURL=http://example.org/js/app.js.map
```

While making source maps available to Sentry from your servers is the most natural integration, it is not always advisable:

-   Sentry may not always be able to reach your servers.
-   If you do not specify versions in your asset URLs, there may be a version mismatch
-   The additional latency may mean that source mappings are not available for all errors.

For these reasons, it is recommended to upload source maps to Sentry beforehand (see below).

{% capture __alert_content -%}
While the recommended solution is to upload your source artifacts to Sentry, sometimes it’s necessary to allow communication from Sentry’s internal IPs. For more information on Sentry’s public IPs see: [IP Ranges]({%- link ip-ranges.md -%}#ip-ranges).
{%- endcapture -%}
{%- include components/alert.html
  title="Working Behind a Firewall"
  content=__alert_content
%}{% capture __alert_content -%}
If you want to keep your source maps secret and choose not to upload your source maps directly to Sentry, you can enable the “Security Token” option in your project settings. This will cause outbound requests from Sentry’s servers to URLs originating from your “Allowed Domains” to have the HTTP header “X-Sentry-Token: {token}” appended, where {token} is a secure value you define. You can then configure your web server to allow access to your source maps when this header/token pair is present. You can alternatively override the default header name (X-Sentry-Token) and use HTTP Basic Authentication, e.g. by passing “Authorization: Basic {encoded_password}.”
{%- endcapture -%}
{%- include components/alert.html
  title="Secure Access to Source Maps"
  content=__alert_content
%}

&nbsp;
### Uploading Source Maps to Sentry

Except for [Webpack]({%- link _documentation/platforms/javascript/sourcemaps/generation.md -%}#webpack), the recommended way to upload source maps is using [Sentry CLI]({%- link _documentation/cli/index.md -%}). If you have used [_Sentry Wizard_](https://github.com/getsentry/sentry-wizard) to set up your project, it has already created all necessary configuration to upload source maps. Otherwise, follow the [CLI configuration docs]({%- link _documentation/cli/configuration.md -%}) to set up your project.

Now you need to set up your build system to create a release and attach the various source files. For Sentry to de-minify your stack traces you must provide both the minified files (e.g. app.min.js) and the corresponding source maps. In case the source map files do not contain your original source code (`sourcesContent`), you must additionally provide the original source files. (Alternatively, sentry-cli will automatically embed the sources (if missing) into your source maps if you pass the `--rewrite` flag.)

Sentry uses [**Releases**]({%- link _documentation/workflow/releases.md -%}) to match the correct source maps to your events. To create a new release, run the following command (e.g. during publishing):

```sh
$ sentry-cli releases new <release_name>
```

{% capture __alert_content -%}
The release name must be **unique within your organization** and match the `release` option in your SDK initialization code. Then, use the `upload-sourcemaps` command to scan a folder for source maps, process them and upload them to Sentry.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

```sh
$ sentry-cli releases files <release_name> upload-sourcemaps /path/to/files
```

This command will upload all files ending in _.js_ and _.map_ to the specified release. If you wish to change these extensions – e.g. to upload typescript sources – use the `--ext` option:

```sh
$ sentry-cli releases files <release_name> upload-sourcemaps --ext ts --ext map /path/to/files
```

{% capture __alert_content -%}
Unfortunately, it can be quite challenging to ensure that source maps are actually valid and uploaded correctly. To ensure that everything is working as intended, you can add the `--validate` flag when uploading source maps. It attempts to parse the source maps and verify source references locally. Note that this flag might produce false positives if you have references to external source maps.
{%- endcapture -%}
{%- include components/alert.html
  title="Validating source maps with Sentry CLI"
  content=__alert_content
%}

Until now, the release is in a draft state (“_unreleased_”). Once all source maps have been uploaded, and your app has been published successfully, finalize the release with the following command:

```sh
$ sentry-cli releases finalize <release_name>
```

For convenience, you can alternatively pass the `--finalize` flag to the `new` command which will immediately finalize the release.

{% capture __alert_content -%}
You don't _have_ to upload the source files (ref’d by source maps), but without them, the grouping algorithm will not be as strong, and the UI will not show any contextual source.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

Additional information can be found in the [Releases API documentation]({%- link _documentation/api/releases/index.md -%}).

{% capture __alert_content -%}
It’s not uncommon for a web application to be accessible at multiple origins. For example:

-   Website is operable over both `https` and `http`
-   Geolocated web addresses: e.g. `https://us.example.com`, `https://eu.example.com`
-   Multiple static CDNs: e.g. `https://static1.example.com`, `https://static2.example.com`
-   Customer-specific domains/subdomains

In this situation, **identical** JavaScript and source map files may be located at two or more distinct origins. If you are dealing with such a deployment, you have two choices for naming your uploaded artifacts:

1.  Upload the same artifact multiple times with each possible URL where it appears, for example:

    > -   [https://static1.example.com/js/app.js](https://static1.example.com/js/app.js)
    > -   [https://static2.example.com/js/app.js](https://static2.example.com/js/app.js)
2.  Alternatively, you can omit the protocol + host and use a special tilde (~) prefixed path like so:

    > ~/js/app.js

The ~ prefix tells Sentry that for a given URL, **any** combination of protocol and hostname whose path is `/js/app.js` should use this artifact. **ONLY** use this method if your source/source map files are identical at all possible protocol/hostname combinations. Note that Sentry will prioritize full URLs over tilde prefixed paths if found.
{%- endcapture -%}
{%- include components/alert.html
  title="Assets Accessible at Multiple Origins"
  content=__alert_content
%}

{% capture __alert_content -%}
Unfortunately, it can be quite challenging to ensure that source maps are actually valid themselves and uploaded correctly. To ensure that everything is working as intended you can use the _–validate_ flag when uploading source maps which will attempt to locally parse the source map and look up the references. Note that there are known cases where the validate flag will indicate failures when the setup is correct (if you have references to external source maps then the validation tool will indicate a failure).

Here are some things you can check in addition to the validation step:

-   Make sure that the URL prefix is correct for your files. This is easy to get wrong.
-   Make sure you upload the matching source maps for your minimized files.
-   Make sure that your minified files you have on your servers actually have references to your files.
{%- endcapture -%}
{%- include components/alert.html
  title="Validating source maps with Sentry CLI"
  content=__alert_content
%}

For more information, see:

- [Full Documentation on Source Maps]({%- link _documentation/platforms/javascript/sourcemaps/index.md -%})
- [Debuggable JavaScript in Production with Source Maps](https://blog.sentry.io/2015/10/29/debuggable-javascript-with-source-maps)
- [4 Reasons Why Your Source Maps are Broken](https://blog.sentry.io/2018/10/18/4-reasons-why-your-source-maps-are-broken)

&nbsp;
## Context
You can also set context when manually triggering events.

### Setting Context {#context}
Sentry supports additional context with events. Often this context is shared among any issue captured in its lifecycle, and includes the following components:

**Structured Contexts**

: Specific structured contexts --- OS info, runtime information, etc.  This is typically set automatically.

[**User**](#capturing-the-user)

: Information about the current actor

[**Tags**](#tagging-events)

: Key/value pairs which generate breakdown charts and search filters

[**Level**](#setting-the-level)

: An event's severity 

[**Fingerprint**](#setting-the-fingerprint)

: A value used for grouping events into issues

[**Unstructured Extra Data**](#extra-context)

: Arbitrary unstructured data which the Sentry SDK stores with an event sample

&nbsp;
### Extra Context {#extra-context}
In addition to the structured context that Sentry understands, you can send arbitrary key/value pairs of data which the Sentry SDK will store alongside the event. These are not indexed, and the Sentry SDK uses them to add additional information about what might be happening:

```
Sentry.configureScope((scope) => {
  scope.setExtra("character_name", "Mighty Fighter");
});
```

{% capture __alert_content -%}
**Be aware of maximum payload size** - There are times, when you may want to send the whole application state as extra data. Sentry does not recommend this, as application state can be very large and easily exceed the 200kB maximum that Sentry has on individual event payloads. When this happens, you'll get an `HTTP Error 413 Payload Too Large` message as the server response or (when you set `keepalive: true` as a `fetch` parameter), the request will stay `pending` forever (e.g. in Chrome).
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

&nbsp;
### Unsetting Context
Context is held in the current scope and thus is cleared out at the end of each operation --- request, etc. You can also push and pop your own scopes to apply context data to a specific code block or function.

**[Mimi note: code snippet or example here]**

For more information [have a look at the scopes and hub documentation]({%- link
_documentation/enriching-error-data/scopes.md -%}).

&nbsp;
### Capturing the User
Sending users to Sentry will unlock many features, primarily the ability to drill down into the number of users affecting an issue, as well as to get a broader sense about the quality of the application.

Capturing the user is fairly straight forward:

```
Sentry.configureScope((scope) => {
  scope.setUser({"email": "john,doe@example.com"});
});
```

Users consist of a few critical pieces of information which are used to construct a unique identity in Sentry. Each of these is optional, but one **must** be present for the Sentry SDK to capture the user:

`id`

: Your internal identifier for the user.

`username`

: The user's username. Generally used as a better label than the internal ID.

`email`

: An alternative, or addition, to a username. Sentry is aware of email addresses and can show things like Gravatars, unlock messaging capabilities, and more.

`ip_address`

: The IP address of the user. If the user is unauthenticated providing the IP address will suggest that this is unique to that IP. If available, we will attempt to pull this from the HTTP request data.

Additionally, you can provide arbitrary key/value pairs beyond the reserved names, and the Sentry SDK will store those with the user.

&nbsp;
### Tagging Events
Sentry implements a system it calls tags. Tags are various key/value pairs that get assigned to an event, and the user can later use them as a breakdown or quick access to finding related events.

Most SDKs generally support configuring tags by configuring the scope:

```
Sentry.configureScope((scope) => {
  scope.setTag("page_locale", "de-at");
});
```

Several common uses for tags include:

-   The hostname of the server
-   The version of your platform (e.g. iOS 5.0)
-   The user’s language

Once you’ve started sending tagged data, you’ll see it show up in a few places:

-   The filters within the sidebar on the project stream page.
-   Summarized within an event on the sidebar.
-   The tags page on an aggregated event.

We’ll automatically index all tags for an event, as well as the frequency and the last time the Sentry SDK has seen a value. Even more so, we keep track of the number of distinct tags and can assist you in determining hotspots for various issues.

&nbsp;
### Setting the Level
You can set the severity of an event to one of five values: `fatal`, `error`, `warning`, `info`, and `debug`. `error` is the default, `fatal` is the most severe and `debug` is the least severe.

**[Mimi note: Is there a way to set the level in a manually triggered error? This way, the level isn't set in scope -- which could be overly complicated/messy.]**

**[Mimi note: vv this example doesn't actually set a level?? It's what I found under Context > Setting the Level]**
```
Sentry.configureScope((scope) => {
  scope.setExtra("character_name", "Mighty Fighter");
});
```

&nbsp;
### Setting the Fingerprint
Sentry uses one or more "fingerprints" to decide how to group errors into issues. 

For some very advanced use cases, you can override the Sentry default grouping using the `fingerprint` attribute. In supported SDKs, this attribute can be passed with the event information and should be an array of strings.

If you wish to append information, thus making the grouping slightly less aggressive, you can do that as well by adding the special string `{ { default } }` as one of the items.

For more information, check out [aggregate errors with custom fingerprints](https://blog.sentry.io/2018/01/18/setting-up-custom-fingerprints).

&nbsp;
#### Minimal Example
This minimal example will put all exceptions of the current scope into the same issue/group:

```
Sentry.configureScope((scope) => {
  scope.setFingerprint(['my-view-function']);
});
```

The two common real-world use cases for the `fingerprint` attribute are demonstrated below:

&nbsp;
#### Example: Split up a group into more groups (groups are too big)
Your application queries an RPC interface or external API service, so the stack trace is generally the same (even if the outgoing request is very different).

The following example will split up the default group Sentry would create (represented by `{ { default } }`) further, taking some attribute on the error object into account:

[Example written in C#]

```
using (SentrySdk.Init(o =>
  {
    o.BeforeSend = @event =>
      {
        if (@event.Exception is SqlConnection ex)
        {
          @event.SetFingerprint(new [] {"database-connection-error"});
        }
        return @event;
      };
  }
))
```

&nbsp;
#### Example: Merge a lot of groups into one group (groups are too small)
A generic error, such as a database connection error, has many different stack traces and never groups together.

The following example will just completely overwrite Sentry's grouping by omitting `{ { default } }` from the array:

[Example written in C#]

```
public class MyRpcException : Exception
{
  // The name of the RPC function that was called (e.g. "getAllBlogArticles")
  public string Function { get; set; }
  
  // For example a HTTP status code returned by the server.
  public HttpStatusCode Code { get; set; }
}

using (SentrySdk.Init(o =>
{
  o.BeforeSend = @event =>
  {
    if (@event.Exception is MyRpcException ex)
    {
      @event.SetFingerprint(
        new []
        {
          "{ { default } }"
          ex.Function,
          ex.Code.ToString(),
        }
      );
    }
    return @event;
  };
}
))
```

&nbsp;
## Releases
A release is a version of your code that you deploy to an environment. When you give Sentry information about your releases, you unlock many new features:
 - Determine the issue and regressions introduced in a new release
 - Predict which commit caused an issue and who is likely responsible
 - Resolve issues by including the issue number in your commit message
 - Receive email notifications when your code gets deployed

Additionally, the Sentry SDK uses releases for applying [source maps]({%- link _documentation/platforms/javascript/sourcemaps/index.md -%}).

Setting up releases is a 3-step process:
1. [Configure Your SDK]({%- link _documentation/workflow/releases.md -%}#configure-sdk)
2. [Create Release and Associate Commits]({%- link _documentation/workflow/releases.md -%}#create-release)
3. [Tell Sentry When You Deploy a Release]({%- link _documentation/workflow/releases.md -%}#create-deploy)

&nbsp;
## Supported Browsers {#browser-table}

![Sauce Test Status](https://saucelabs.com/browser-matrix/sentryio.svg)

&nbsp;
## Advanced Usage

### Advanced Configuration
The Sentry SDK sets the options when you first initialize the SDK.

```
Sentry.init({
  dsn: 'https://bd421d97f0d64387ac5768fe16f88f78@sentry.io/1268071',
  release: "28d497fb8af6cc3efbe160e28c1c08f08bd688fc",
  environment: 'staging',
  beforeSend: customPiiScrub(event),
  maxBreadcrumbs: 50,
  debug: true,
});
```

Check out Sentry's complete list of [options]({%- link _documentation/error-reporting/configuration/index.md -%}) and more information on [environments]({%- link _documentation/enriching-error-data/environments.md -%}).

&nbsp;
### Breadcrumbs
Sentry will automatically record certain events, such as changes to the URL and XHR requests to provide context to an error.

You can manually add breadcrumbs on other events or disable breadcrumbs.

```
// Example for an application that sometimes errors after the screen resizes

window.addEventListener('resize', function(event){
  Sentry.addBreadcrumb({
    category: 'ui',
    message: 'New window size:' + window.innerWidth + 'x' + window.innerHeight,
    level: 'info'
  });
})
```

For more information, see Sentry's [Breadcrumbs docs]({%- link _documentation/enriching-error-data/breadcrumbs.md -%}).

&nbsp;
### Filter Events & Custom Logic
Sentry exposes a beforeSend callback which can be used to filter out information or add additional context to the event object.

```
Sentry.init({
  beforeSend(event) {
    // Modify the event here
    if(event.user){
      // Don't send user's email address
      delete event.user.email;
    }
    return event;
  }
});
```

For more information, see Sentry's [docs on Filtering Events]({%- link _documentation/error-reporting/configuration/filtering.md -%}).

&nbsp;
### Capturing Messages {#messages}
Typically, the Sentry SDK does not emit messages. This is most useful when you've overridden fingerprinting but need to give a useful message.

```
Sentry.captureMessage('Something went wrong');
```

&nbsp;
### Lazy Loading Sentry
We recommend using our bundled CDN version for the browser as explained [here]({% link _documentation/error-reporting/quickstart.md %}?platform=browser#pick-a-client-integration). 

But we also offer an alternative which is still in *beta*; we call it the _Loader_. You install by just adding this script to your website instead of the SDK bundle. This line is everything you need; the script is <1kB gzipped and includes the `Sentry.init` call with your DSN.

```html
<script src="https://js.sentry-cdn.com/___PUBLIC_KEY___.min.js" crossorigin="anonymous"></script>
```

&nbsp;
#### What does the Loader provide?
It's a small wrapper around our SDK. The _Loader_ does a few things:

- You will always have the newest recommended stable version of our SDK.
- It captures all _global errors_ and _unhandled promise_ rejections.
- It lazy injects our SDK into your website.
- After you've loaded the SDK, the Loader will send everything to Sentry.

By default, the _Loader_ contains all information needed for our SDK to function, like the `DSN`.  In case you want to set additional [options]({% link _documentation/error-reporting/configuration/index.md %}) you have to set them like this:


```javascript
Sentry.onLoad(() => {
  Sentry.init({
    release: '1.0.0',
    environment: 'prod'
  });
});
```

`onLoad` is a function that only the _Loader_ provides; Loader will call it once Loader injects the SDK into the website.  The _Loader_ `init()` works a bit different, instead of just setting the options, we merge the options internally, only for convenience, so you don't have to set the `DSN` again because the _Loader_ already contains it.

As explained before, the _Loader_ lazy loads and injects our SDK into your website but you can also tell the loader to fetch it immediately instead of only fetching it when you need it. Setting `data-lazy` to `no` will tell the _Loader_ to inject the SDK as soon as possible:

```html
<script
  src="https://js.sentry-cdn.com/___PUBLIC_KEY___.min.js"
  crossorigin="anonymous"
  data-lazy="no">
</script>
```

The _Loader_ also provides a function called `forceLoad()` which does the same, so that you can do the following:

```html
<script>
  Sentry.forceLoad();
  Sentry.onLoad(() => {
    // Use whatever Sentry.* function you want
  });
</script>
```

&nbsp;
#### Current limitations
As we inject our SDK asynchronously, we will only monitor _global errors_ and _unhandled promise_ for you until the SDK is fully loaded. That means that we might miss breadcrumbs during the download.  

For example, a user clicking on a button on your website is making an XHR request. We will not miss any errors, only breadcrumbs and only up until the SDK is fully loaded. You can reduce this time by manually calling `forceLoad` or set `data-lazy="no"`.

&nbsp;
### Collecting User Feedback
Sentry provides the ability to collect additional feedback from the user upon hitting an error. This is primarily useful in situations where you might generally render a plain error page (the classic 500.html). To collect the feedback, an embeddable JavaScript widget is available, which the Sentry SDK can show to your users on demand.

**[Mimi note: screenshot of widget]**

For more information, [check out the docs on User Feedback]({%- link _documentation/enriching-error-data/user-feedback.md -%}).

&nbsp;
### Security Policy Reporting
Sentry provides the ability to collect information on Content-Security-Policy (CSP) violations, as well as Expect-CT and HTTP Public Key Pinning (HPKP) failures by setting the proper HTTP header which results in a violation/failure to be sent to the Sentry endpoint specified in the report-uri.

For more information: 

[Docs on Security Policy Reporting]({%- link _documentation/error-reporting/security-policy-reporting.md -%})

[Capture Content Security Policy Violations with Sentry](https://blog.sentry.io/2018/09/04/how-sentry-captures-csp-violations)

[How a Content Security Policy Could Have Protected Newegg](https://blog.sentry.io/2018/09/20/content-security-policy-newegg-breach)

&nbsp;
### SDK Integrations
All of Sentry's SDKs provide Integrations, which provide additional functionality.

System integrations are integrations enabled by default that integrate into the
standard library or the interpreter itself. They are documented so you can see
what they do and that they can be disabled if they cause issues. To disable
system integrations set `defaultIntegrations: false` when calling `init()`.
To override their settings, provide a new instance with your config
to `integrations` option. For example, to turn off browser capturing console calls: `integrations: [new Sentry.Integrations.Breadcrumbs({ console: false })]`.

All JavaScript SDKs provide the following default Integrations:

&nbsp;
#### Dedupe
_Import name: `Sentry.Integrations.Dedupe`_

This integration deduplicates certain events. The Sentry SDK enables this by default, and it should not be disabled except in rare circumstances. Disabling this integration, for instance, will cause duplicate error logging.

&nbsp;
#### InboundFilters
_Import name: `Sentry.Integrations.InboundFilter`_

This integration allows developers to ignore specific errors based on the type or message, as well as blacklist/whitelist URLs that originate from the exception.

To configure it, use `ignoreErrors`, `blacklistUrls`, and `whitelistUrls` SDK options directly.

&nbsp;
#### FunctionToString
_Import name: `Sentry.Integrations.FunctionToString`_

This integration allows the SDK to provide original functions and method names, even when our error or breadcrumbs handlers wrap them.

&nbsp;
#### ExtraErrorData
_Import name: `Sentry.Integrations.ExtraErrorData`_

This integration extracts all non-native attributes from the Error object and attaches them to the event as the `extra` data.

&nbsp;
#### Browser specific

##### TryCatch
_Import name: `Sentry.Integrations.TryCatch`_

This integration wraps native time and events APIs (`setTimeout`, `setInterval`, `requestAnimationFrame`,
`addEventListener/removeEventListener`) in `try/catch` blocks to handle async exceptions.

&nbsp;
##### Breadcrumbs
_Import name: `Sentry.Integrations.Breadcrumbs`_

This integration wraps native APIs to capture breadcrumbs. By default, the Sentry SDK wraps all APIs.

Available options:

```js
{
  beacon: boolean;  // Log HTTP requests done with the Beacon API
  console: boolean; // Log calls to `console.log`, `console.debug`, etc
  dom: boolean;     // Log all click and keypress events
  fetch: boolean;   // Log HTTP requests done with the Fetch API
  history: boolean; // Log calls to `history.pushState` and friends
  sentry: boolean;  // Log whenever we send an event to the server
  xhr: boolean;     // Log HTTP requests done with the XHR API
}
```

&nbsp;
##### GlobalHandlers
_Import name: `Sentry.Integrations.GlobalHandlers`_

This integration attaches global handlers to capture uncaught exceptions and unhandled rejections.

Available options:

```js
{
  onerror: boolean;
  onunhandledrejection: boolean;
}
```

&nbsp;
##### LinkedErrors
_Import name: `Sentry.Integrations.LinkedErrors`_

This integration allows you to configure linked errors. They'll be recursively read up to a specified limit and lookup will be performed by a specific key. By default, the Sentry SDK sets the limit to 5 and the key used is `cause`.

Available options:

```js
{
  key: string;
  limit: number;
}
```

&nbsp;
##### UserAgent
_Import name: `Sentry.Integrations.UserAgent`_

This integration attaches user-agent information to the event, which allows us to correctly catalog and tag them with specific OS, Browser and version information.

&nbsp;
### Pluggable Integrations
Pluggable integrations are integrations that can be additionally enabled, to provide some very specific features. Sentry documents them so you can see what they do and that they can be enabled. To enable pluggable integrations, provide a new instance with your config to `integrations` option. For example: `integrations: [new Sentry.Integrations.ReportingObserver()]`.

&nbsp;
#### Debug
_Import name: `Sentry.Integrations.Debug`_

This integration allows you to inspect the content of the processed event, that will be passed to `beforeSend` and effectively send to the Sentry SDK.

Available options:

```js
{
  debugger: boolean; // trigger DevTools debugger instead of using console.log
  stringify: boolean; // stringify event before passing it to console.log
}
```

&nbsp;
#### RewriteFrames
_Import name: `Sentry.Integrations.RewriteFrames`_

This integration allows you to apply a transformation to each frame of the stack trace. In the simple scenario, it can be used to change the name of the file the frame originates from or can be fed with an iterated function, to apply any arbitrary transformation.

Available options:

```js
{
  root: string; // root path that will be appended to the basename of the current frame's url
  iteratee: (frame) => frame); // function that take the frame, apply any transformation on it and returns it back
}
```

&nbsp;
#### Browser specific

##### ReportingObserver
_Import name: `Sentry.Integrations.ReportingObserver`_

This integration hooks into the ReportingObserver API and sends captured events through to Sentry. It can be configured to handle only specific issue types.

Available options:

```js
{
  types: <'crash'|'deprecation'|'intervention'>[];
}
```

&nbsp;
### Adding an Integration
```javascript
import * as Sentry from '@sentry/browser';

// All integration that come with an SDK can be found on Sentry.Integrations object
// Custom integration must conform Integration interface: https://github.com/getsentry/sentry-javascript/blob/master/packages/types/src/index.ts

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new MyAwesomeIntegration()]
});
```

&nbsp;
### Removing an Integration
In this example, we will remove the by default enabled integration for adding breadcrumbs to the event:

```javascript
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: integrations => {
    // integrations will be all default integrations
    return integrations.filter(integration => integration.name !== 'Breadcrumbs');
  }
});
```

&nbsp;
### Alternative way of setting an Integration
```javascript
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: integrations => {
    // integrations will be all default integrations
    return [...integrations, new MyCustomIntegration()];
  }
});
```

&nbsp;
### Hints
Event and Breadcrumb `hints` are objects containing various information used to put together an event or a breadcrumb. For events, those are things like `event_id`, `originalException`, `syntheticException` (used internally to generate cleaner stack trace), and any other arbitrary `data` that user attaches. For breadcrumbs, it's all implementation dependent. For XHR requests, the hint contains the xhr object itself, for user interactions it contains the DOM element and event name, etc.

They are available in two places: `beforeSend`/`beforeBreadcrumb` and `eventProcessors`. Those are two ways we'll allow users to modify what we put together.

### Hints for Events

`originalException`

: The original exception that caused the Sentry SDK to create the event. This is useful for changing how the Sentry SDK groups events or to extract additional information.

`syntheticException`

: When a string or a non-error object is raised, Sentry creates a synthetic exception so you can get a
basic stack trace. This exception is stored here for further data extraction.

### Hints for Breadcrumbs

`event`

: For breadcrumbs created from browser events, the Sentry SDK often supplies the event to the breadcrumb as a hint. This, for instance, can be used to extract data from the target DOM element into a breadcrumb.

`level` / `input`

: For breadcrumbs created from console log interceptions. This holds the original console log level and the original input data to the log function.

`response` / `input`

: For breadcrumbs created from HTTP requests. This holds the response object
(from the fetch API) and the input parameters to the fetch function.

`request` / `response` / `event`

: For breadcrumbs created from HTTP requests. This holds the request and response object (from the node HTTP API) as well as the node event (`response` or `error`).

`xhr`

: For breadcrumbs created from HTTP requests done via the legacy `XMLHttpRequest` API. This holds the original xhr object.

&nbsp;
## Additional Resources
[Optimizing the Sentry Workflow](https://blog.sentry.io/2018/03/06/the-sentry-workflow)

[Debug Tough Front-End Errors by Giving Sentry More Clues](https://blog.sentry.io/2019/01/17/debug-tough-front-end-errors-sentry-clues)

[How Sentry Translates & Groups Localized Errors](https://blog.sentry.io/2018/02/28/internet-explorer-translations)
