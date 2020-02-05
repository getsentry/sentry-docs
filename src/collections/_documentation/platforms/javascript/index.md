---
title: JavaScript
---

## Integrating the SDK
All our JavaScript-related SDKs provide the same API. Still, there are some differences between them, such as installation, which this section of the docs explains.

The quickest way to get started is to use the CDN hosted version of the JavaScript browser SDK:

```html
<script
  src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js"
  integrity="{% sdk_cdn_checksum sentry.javascript.browser latest bundle.min.js %}"
  crossorigin="anonymous"></script>
```

{% capture __alert_content -%}
It's possible to include `defer` in your script tag, but keep in mind that any errors which occur in scripts that execute before the browser SDK script executes won’t be caught (because the SDK won’t be initialized yet). We strongly recommend that if you use `defer`, you a) place the script tag for the browser SDK first, and b) mark it, and all of your other scripts, `defer` (but not `async`), thereby guaranteeing that it’s executed before any of the others.
{%- endcapture -%}
{%- include components/alert.html
  title="Use of defer"
  content=__alert_content
  level="warning"
%}

You can also add the Sentry SDK as a dependency using npm:

``` bash
$ npm install @sentry/browser
```

{% include components/alert.html
  title="Upgrading the SDK and want to understand what's new?"
  content="Have a look at the [Changelog](https://github.com/getsentry/sentry-javascript/releases)."
  level="info"
%}

### Connecting the SDK to Sentry
After you've completed setting up a project in Sentry, Sentry will give you a value which we call a _DSN_ or _Data Source Name_. It looks a lot like a standard URL, but it’s just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

You should `init` the Sentry Browser SDK as soon as possible during your page load:

```javascript
// When using npm, import Sentry
import * as Sentry from '@sentry/browser';

Sentry.init({ dsn: '___PUBLIC_DSN___' });
```

For more configuration options, see:
- [Sentry's complete list of Common Options across SDKs]({%- link _documentation/error-reporting/configuration/index.md -%})

### Verifying Your Setup
Great! Now that you've completed setting up the SDK, maybe you want to quickly test out how Sentry works. Start by capturing an exception:

```javascript
Sentry.captureException(new Error("Something broke"));
```
Then, you can see the error in your dashboard:

[{% asset js-index/error-message.png alt="Error in Unresolved Issues with title This is my fake error message" %}]({% asset js-index/error-message.png @path %})

## Capturing Errors
In most situations, you can capture errors automatically with `captureException()`.

```javascript
try {
  aFunctionThatMightFail();
} catch (err) {
  Sentry.captureException(err);
}
```
For additional functionality, see [SDK Integrations](#sdk-integrations).

### Automatically Capturing Errors
By including and configuring Sentry, the SDK will automatically attach global handlers to capture uncaught exceptions and unhandled rejections.

[{% asset js-index/automatically-capture-errors.png alt="Stack trace of a captured error" %}]({% asset js-index/automatically-capture-errors.png @path %})

### Automatically Capturing Errors with Promises
By default, Sentry for JavaScript captures unhandled promise rejections as described in the official ECMAScript 6 standard.

Configuration may be required if you are using a third-party library to implement promises.

Most promise libraries have a global hook for capturing unhandled errors. You may want to disable default behavior by changing `onunhandledrejection` option to `false` in your [GlobalHandlers]({%- link _documentation/platforms/javascript/index.md -%}#globalhandlers) integration and manually hook into such event handler and call `Sentry.captureException` or `Sentry.captureMessage` directly.

## Releases

{% include platforms/configure-releases.md %}

If you are using the [Webpack Plugin](#webpack) releases will be automatically configured for you using the plugin's release-lookup logic.

## Source Maps

{% include components/alert.html
  title="Note"
  content="We **highly recommend** you incorporate source maps with the Sentry JavaScript SDK in order to receive the full benefit of error tracking and monitoring. Source maps will provide stack traces, which will provide more information regarding errors."
  level="warning"
%}

Sentry supports un-minifying JavaScript via source maps. This lets you view source code context obtained from stack traces in their original untransformed form, which is particularly useful for debugging minified code (e.g. UglifyJS), or transpiled code from a higher-level language (e.g. TypeScript, ES6).

When you're using the Sentry JavaScript SDK, the SDK automatically fetches the source code and source maps by scraping the URLs within the stack trace. However, you may have legitimate reasons for [disabling the JavaScript source fetching in Sentry](https://blog.sentry.io/2018/07/17/source-code-fetching).

### Generating Source Maps
Most modern JavaScript transpilers support source maps. Below are instructions for some common tools.

#### Webpack
Webpack is a powerful build tool that resolves and bundles your JavaScript modules into files fit for running in the browser. It also supports various _loaders_ to transpile higher-level languages, reference stylesheets, or include static assets.

##### Webpack Plugin

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

In case you use [SourceMapDevToolPlugin](https://webpack.js.org/plugins/source-map-dev-tool-plugin) for more fine-grained control of source map generation, leave `noSources` turned off, so Sentry can display proper source code context in event stack traces.

Additionally, the webpack plugin will automatically set `window.SENTRY_RELEASE`, meaning your `Sentry.init` call will not need to be configured with the `release` key.

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

### Uploading / Hosting Source Maps
Source maps can be either:

1.  Uploaded directly to Sentry (**recommended**).
2.  Served publicly over HTTP alongside your source files.

#### Uploading Source Maps to Sentry
Except for [Webpack]({%- link _documentation/platforms/javascript/sourcemaps.md -%}#webpack), the recommended way to upload source maps is using [Sentry CLI]({%- link _documentation/cli/index.md -%}). If you have used [_Sentry Wizard_](https://github.com/getsentry/sentry-wizard) to set up your project, it has already created all necessary configuration to upload source maps. Otherwise, follow the [CLI configuration docs]({%- link _documentation/cli/configuration.md -%}) to set up your project.

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

Until now, the release is in a draft state (“_unreleased_”). Once all source maps have been uploaded, and your app has been published successfully, finalize the release with the following command:

```sh
$ sentry-cli releases finalize <release_name>
```

For convenience, you can alternatively pass the `--finalize` flag to the `new` command which will immediately finalize the release.

You don't _have_ to upload the source files (ref’d by source maps), but without them, the grouping algorithm will not be as strong, and the UI will not show any contextual source.

For more information, see [Releases API documentation]({%- link _documentation/api/releases/index.md -%}).

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

The ~ prefix tells Sentry that for a given URL, **any** combination of protocol and hostname whose path is `/js/app.js` should use this artifact. **ONLY** use this method if your source/source map files are identical at all possible protocol/hostname combinations. **Sentry will prioritize full URLs over tilde prefixed paths**, if found.
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

- [Full Documentation on Source Maps]({%- link _documentation/platforms/javascript/sourcemaps.md -%})
- [Debuggable JavaScript in Production with Source Maps](https://blog.sentry.io/2015/10/29/debuggable-javascript-with-source-maps)
- [4 Reasons Why Your Source Maps are Broken](https://blog.sentry.io/2018/10/18/4-reasons-why-your-source-maps-are-broken)
- [Debug Your Node.js Projects with Source Maps](https://blog.sentry.io/2019/02/20/debug-node-source-maps)

#### Hosting Source Map Files
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

## Adding Context
You can also set context when manually triggering events.

{% include platforms/event-contexts.md %}

### Extra Context {#extra-context}
In addition to the structured context that Sentry understands, you can send arbitrary key/value pairs of data which the Sentry SDK will store alongside the event. These are not indexed, and the Sentry SDK uses them to add additional information about what might be happening:

```javascript
Sentry.setExtra("character_name", "Mighty Fighter");
```

{% capture __alert_content -%}
**Be aware of maximum payload size** - There are times, when you may want to send the whole application state as extra data. Sentry does not recommend this, as application state can be very large and easily exceed the 200kB maximum that Sentry has on individual event payloads. When this happens, you'll get an `HTTP Error 413 Payload Too Large` message as the server response or (when you set `keepalive: true` as a `fetch` parameter), the request will stay `pending` forever (e.g. in Chrome).
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

### Unsetting Context
Context is held in the current scope and thus is cleared out at the end of each operation --- request, etc. You can also push and pop your own scopes to apply context data to a specific code block or function.

There are two different scopes for unsetting context --- a global scope which Sentry does not discard at the end of an operation, and a scope that can be created by the user.

```javascript
// This will be changed for all future events
Sentry.setUser(someUser);

// This will be changed only for the error caught inside and automatically discarded afterward
Sentry.withScope(function(scope) {
  scope.setUser(someUser);
  Sentry.captureException(error);
});
```

If you want to remove globally configured data from the scope, you can call:

```javascript
Sentry.configureScope(scope => scope.clear())
```

For more information, see:
- [Full documentation on Scopes and Hubs]({%- link
_documentation/enriching-error-data/scopes.md -%})
- [Debug Tough Front End Errors by Giving Sentry More Clues](https://blog.sentry.io/2019/01/17/debug-tough-front-end-errors-sentry-clues).

### Capturing the User
Sending users to Sentry will unlock many features, primarily the ability to drill down into the number of users affecting an issue, as well as to get a broader sense about the quality of the application.

Capturing the user is fairly straight forward:

```javascript
Sentry.setUser({"email": "john.doe@example.com"});
```

{% include platforms/user-attributes.md %}

### Tagging Events
Tags are key/value pairs assigned to events that can be used for breaking down
issues or quick access to finding related events.

Most SDKs generally support configuring tags by configuring the scope:

```javascript
Sentry.setTag("page_locale", "de-at");
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

### Setting the Level {#level}
You can set the severity of an event to one of five values: `fatal`, `error`, `warning`, `info`, and `debug`. `error` is the default, `fatal` is the most severe and `debug` is the least severe.

To set the level out of scope, you can call `captureMessage()` per event:

```javascript
Sentry.captureMessage('this is a debug message', 'debug');
```

To set the level within scope, you can call `setLevel()`:

```javascript
Sentry.configureScope(function(scope) { 
  scope.setLevel(Sentry.Severity.Warning); 
});
```

or per event:

```javascript
Sentry.withScope(function(scope) {
  scope.setLevel("info");
  Sentry.captureException(error);
});
```

### Setting the Fingerprint
Sentry uses one or more "fingerprints" to decide how to group errors into issues.

For some very advanced use cases, you can override the Sentry default grouping using the `fingerprint` attribute. In supported SDKs, this attribute can be passed with the event information and should be an array of strings.

If you wish to append information, thus making the grouping slightly less aggressive, you can do that as well by adding the special string `{{ "{{default"}}}}` as one of the items.

For more information, see [Aggregate Errors with Custom Fingerprints](https://blog.sentry.io/2018/01/18/setting-up-custom-fingerprints).

#### Minimal Example
This minimal example will put all exceptions of the current scope into the same issue/group:

```javascript
Sentry.configureScope(function(scope) {
  scope.setFingerprint(['my-view-function']);
});
```

The two common real-world use cases for the `fingerprint` attribute are demonstrated below:

#### Example: Split up a group into more groups (groups are too big)
Your application queries an external API service, so the stack trace is generally the same (even if the outgoing request is very different).

The following example will split up the default group Sentry would create (represented by `{{ "{{default"}}}}`) further, while also splitting up the group based on the API URL.

```javascript
function makeRequest(path, options) {
    return fetch(path, options).catch(function(err) {
        Sentry.withScope(function(scope) {
          scope.setFingerprint(['{{default}}', path]);
          Sentry.captureException(err);
        });
    });
}
```

#### Example: Merge a lot of groups into one group (groups are too small)
If you have an error that has many different stack traces and never groups together, you can merge them together by omitting `{{ "{{default"}}}}` from the fingerprint array.

```javascript
Sentry.withScope(function(scope) {
  scope.setFingerprint(['Database Connection Error']);
  Sentry.captureException(err);
});
```

## Supported Browsers {#browser-table}

![Sauce Test Status]({%- asset browser-support.svg @path -%})

{% capture __alert %}
Prior to version 5.7.0, our SDK needed some polyfills for older browsers like IE 11 and lower.
If you are using it, please upgrade to the latest version or add the script tag below before loading our SDK.

```
<script src="https://polyfill.io/v3/polyfill.min.js?features=Promise%2CObject.assign%2CString.prototype.includes%2CNumber.isNaN"></script>
```

We need `Promise`, `Object.assign`, `Number.isNaN` and `String.prototype.includes` polyfill.

Additionally, keep in mind to define a valid HTML doctype on top of your HTML page, to make sure IE does not go into compatibility mode.
{% endcapture %}

{% include components/alert.html
  title="Support for <= IE 11"
  content=__alert
  level="warning"
%}

## Advanced Usage

### Breadcrumbs
Sentry will automatically record certain events, such as changes to the URL and XHR requests to provide context to an error.

You can manually add breadcrumbs on other events or disable breadcrumbs.

```javascript
// Example for an application that sometimes errors after the screen resizes

window.addEventListener('resize', function(event){
  Sentry.addBreadcrumb({
    category: 'ui',
    message: 'New window size:' + window.innerWidth + 'x' + window.innerHeight,
    level: 'info'
  });
})
```

For more information, see:
- [Full documentation on Breadcrumbs]({%- link _documentation/enriching-error-data/breadcrumbs.md -%})
- [Debug Issues Faster with Breadcrumbs](https://blog.sentry.io/2016/05/04/breadcrumbs).

### Truncating strings on the event

After version `5.0.0` we introduced a new option called `maxValueLength`. The default value is `250` you can adjust this value according to your needs if your messages are longer than that. Please note that not every single value is affected by this option.

### Filter Events & Custom Logic
Sentry exposes a beforeSend callback which can be used to filter out information or add additional context to the event object.

```javascript
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

#### Decluttering Sentry

The first thing to do is consider constructing a whitelist of domains which might raise acceptable exceptions.

If your scripts are loaded from `cdn.example.com` and your site is `example.com` it’d be reasonable to set `whitelistUrls` to:

```javascript
Sentry.init({
  whitelistUrls: [
    /https?:\/\/((cdn|www)\.)?example\.com/
  ]
});
```

There is also `blacklistUrls` if you want to block specific URLs forever.

The community has compiled a list of common ignore rules for everyday things, like Facebook, Chrome extensions, etc. So it’s recommended to at least check these out and see if they apply to you. [Here is the original gist](https://gist.github.com/impressiver/5092952). This is not the default value of our SDK; it's just a highlight of an extensive example of what it could be.

```javascript
Sentry.init({
    ignoreErrors: [
      // Random plugins/extensions
      'top.GLOBALS',
      // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'http://tt.epicplay.com',
      'Can\'t find variable: ZiteReader',
      'jigsaw is not defined',
      'ComboSearch is not defined',
      'http://loading.retry.widdit.com/',
      'atomicFindClose',
      // Facebook borked
      'fb_xd_fragment',
      // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
      // reduce this. (thanks @acdha)
      // See http://stackoverflow.com/questions/4113268
      'bmi_SafeAddOnload',
      'EBCallBackMessageReceived',
      // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
      'conduitPage'
    ],
    blacklistUrls: [
      // Facebook flakiness
      /graph\.facebook\.com/i,
      // Facebook blocked
      /connect\.facebook\.net\/en_US\/all\.js/i,
      // Woopra flakiness
      /eatdifferent\.com\.woopra-ns\.com/i,
      /static\.woopra\.com\/js\/woopra\.js/i,
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
      // Other plugins
      /127\.0\.0\.1:4001\/isrunning/i,  // Cacaoweb
      /webappstoolbarba\.texthelp\.com\//i,
      /metrics\.itunes\.apple\.com\.edgesuite\.net\//i
    ]
});
```

For more information, see:
- [Full documentation on Filtering Events]({%- link _documentation/error-reporting/configuration/filtering.md -%})
- [Tips for Reducing JavaScript Error Noise](https://blog.sentry.io/2017/03/27/tips-for-reducing-javascript-error-noise.html)
- [Manage Your Flow of Errors Using Inbound Filters](https://blog.sentry.io/2017/11/27/setting-up-inbound-filters).

### Capturing Messages {#messages}
Typically, the Sentry SDK does not emit messages. This is most useful when you've overridden fingerprinting but need to give a useful message.

```javascript
Sentry.captureMessage('Some message', level);

// Where `level` can be one of:
// 'fatal', 'error', 'warning', 'log', 'info, 'debug', 'critical'

Sentry.captureMessage('This shouldnt happen', 'info');

// or more explicit

Sentry.withScope(function(scope) {
  scope.setLevel('info');
  Sentry.captureMessage('This shouldnt happen');
});
```
For more information, see [Setting the Level](#level).

### Lazy Loading Sentry
We recommend using our bundled CDN version for the browser as explained [here]({% link _documentation/error-reporting/quickstart.md %}?platform=browser#pick-a-client-integration). As noted there, if you want to use `defer`, you can, though keep in mind that any errors which occur in scripts that execute before the browser SDK script executes won’t be caught (because the SDK won’t be initialized yet). Therefore, if you do this, you'll need to a) place the script tag for the browser SDK first, and b) mark it, and all of your other scripts, `defer` (but not `async`), which will guarantee that it’s executed before any of the others.

We also offer an alternative we call the _Loader_. You install by just adding this script to your website instead of the SDK bundle. This line is everything you need; the script is <1kB gzipped and includes the `Sentry.init` call with your DSN.

```html
<script src="https://js.sentry-cdn.com/___PUBLIC_KEY___.min.js" crossorigin="anonymous"></script>
```

#### Select SDK version to load

If you go into the detail page (Configure button) of your DSN, you are able to select which SDK version the Loader should load.

It can take a few minutes until the change is visible in the code, since it's cached.

[{% asset js-loader-settings.png %}]({% asset js-loader-settings.png @path %})

#### What does the Loader provide?
It's a small wrapper around our SDK. The _Loader_ does a few things:

- You will always have the newest recommended stable version of our SDK.
- It captures all _global errors_ and _unhandled promise_ rejections.
- It lazy injects our SDK into your website.
- After you've loaded the SDK, the Loader will send everything to Sentry.

By default, the _Loader_ contains all information needed for our SDK to function, like the `DSN`.  In case you want to set additional [options]({% link _documentation/error-reporting/configuration/index.md %}) you have to set them like this:


```javascript
Sentry.onLoad(function() {
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
  Sentry.onLoad(function() {
    // Use whatever Sentry.* function you want
  });
</script>
```

#### Current limitations
As we inject our SDK asynchronously, we will only monitor _global errors_ and _unhandled promise_ for you until the SDK is fully loaded. That means that we might miss breadcrumbs during the download.

For example, a user clicking on a button on your website is making an XHR request. We will not miss any errors, only breadcrumbs and only up until the SDK is fully loaded. You can reduce this time by manually calling `forceLoad` or set `data-lazy="no"`.

### Collecting User Feedback
Sentry provides the ability to collect additional feedback from the user upon hitting an error. This is primarily useful in situations where you might generally render a plain error page (the classic 500.html). To collect the feedback, an embeddable JavaScript widget is available, which the Sentry SDK can show to your users on demand.

[{% asset js-index/sentry-dialog.png alt="Modal popup asking user for more context on what occured before the break." %}]({% asset js-index/sentry-dialog.png @path %})

For more information, see:
- [Full documentation on User Feedback]({%- link _documentation/enriching-error-data/user-feedback.md -%})
- [Introducing User Feedback](https://blog.sentry.io/2016/04/21/introducing-user-feedback)

### SDK Integrations
All of Sentry's SDKs provide Integrations, which provide additional functionality.

System integrations are integrations enabled by default that integrate into the
standard library or the interpreter itself. They are documented so you can see
what they do and that they can be disabled if they cause issues. To disable
system integrations set `defaultIntegrations: false` when calling `init()`.
To override their settings, provide a new instance with your config
to `integrations` option. For example, to turn off browser capturing console calls: `integrations: [new Sentry.Integrations.Breadcrumbs({ console: false })]`.

#### Default Integrations

##### InboundFilters

_Import name: `Sentry.Integrations.InboundFilters`_

This integration allows developers to ignore specific errors based on the type or message, as well as blacklist/whitelist URLs that originate from the exception.
It ignores errors, which message starts with `Script error` or `Javascript error: Script error` by default. More on this in our ["What the heck is "Script error"?"](https://blog.sentry.io/2016/05/17/what-is-script-error) blog post.

To configure it, use `ignoreErrors`, `blacklistUrls`, and `whitelistUrls` SDK options directly.

##### FunctionToString

_Import name: `Sentry.Integrations.FunctionToString`_

This integration allows the SDK to provide original functions and method names, even when our error or breadcrumbs handlers wrap them.

#### Browser specific

##### TryCatch

_Import name: `Sentry.Integrations.TryCatch`_

This integration wraps native time and events APIs (`setTimeout`, `setInterval`, `requestAnimationFrame`,
`addEventListener/removeEventListener`) in `try/catch` blocks to handle async exceptions.

##### Breadcrumbs

_Import name: `Sentry.Integrations.Breadcrumbs`_

This integration wraps native APIs to capture breadcrumbs. By default, the Sentry SDK wraps all APIs.

Available options:

```javascript
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

##### GlobalHandlers

_Import name: `Sentry.Integrations.GlobalHandlers`_

This integration attaches global handlers to capture uncaught exceptions and unhandled rejections.

Available options:

```javascript
{
  onerror: boolean;
  onunhandledrejection: boolean;
}
```

##### LinkedErrors

_Import name: `Sentry.Integrations.LinkedErrors`_

This integration allows you to configure linked errors. They'll be recursively read up to a specified limit and lookup will be performed by a specific key. By default, the Sentry SDK sets the limit to 5 and the key used is `cause`.

Available options:

```javascript
{
  key: string;
  limit: number;
}
```

##### UserAgent

_Import name: `Sentry.Integrations.UserAgent`_

This integration attaches user-agent information to the event, which allows us to correctly catalog and tag them with specific OS, Browser and version information.

### Pluggable Integrations
Pluggable integrations are integrations that can be additionally enabled, to provide some very specific features. Sentry documents them so you can see what they do and that they can be enabled. To enable pluggable integrations, install @sentry/integrations package and provide a new instance with your config to `integrations` option. For example: 
```js
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new Integrations.ReportingObserver()]
});
```

#### ExtraErrorData

_Import name: `Sentry.Integrations.ExtraErrorData`_

This integration extracts all non-native attributes from the Error object and attaches them to the event as the `extra` data.

Available options:

```javascript
{
  depth: number; // limit of how deep the object serializer should go. Anything deeper then limit will be replaced with standard Node.js REPL notation of [Object], [Array], [Function] or primitive value. Defaults to 3.
}
```

#### CaptureConsole

_Import name: `Sentry.Integrations.CaptureConsole`_

This integration captures all `Console API` calls and redirects them to Sentry using `captureMessage` call.
It then retriggers to preserve default native behaviour.

```js
{
  levels: string[]; // an array of methods that should be captured, defaults to ['log', 'info', 'warn', 'error', 'debug', 'assert']
}
```

#### Dedupe

_Import name: `Sentry.Integrations.Dedupe`_

This integration deduplicates certain events. It can be helpful if you are receiving many duplicate errors. Be aware that we will only compare stack traces and fingerprints.

#### Debug

_Import name: `Sentry.Integrations.Debug`_

This integration allows you to inspect the content of the processed event, that will be passed to `beforeSend` and effectively send to the Sentry SDK.
It will _always_ run as the last integration, no matter when it was registered.

Available options:

```javascript
{
  debugger: boolean; // trigger DevTools debugger instead of using console.log
  stringify: boolean; // stringify event before passing it to console.log
}
```

#### RewriteFrames

_Import name: `Sentry.Integrations.RewriteFrames`_

This integration allows you to apply a transformation to each frame of the stack trace. In the streamlined scenario, it can be used to change the name of the file frame it originates from, or it can be fed with an iterated function to apply any arbitrary transformation.

On Windows machines, you have to use Unix paths and skip the volume letter in `root` option in order to make it work.
For example `C:\\Program Files\\Apache\\www` won't work, however, `/Program Files/Apache/www` will.

Available options:

```js
{
  root: string; // root path that will be appended to the basename of the current frame's url
  iteratee: (frame) => frame); // function that takes the frame, applies any transformation on it and returns it back
}
```

#### Browser specific

##### ReportingObserver

_Import name: `Sentry.Integrations.ReportingObserver`_

This integration hooks into the ReportingObserver API and sends captured events through to Sentry. It can be configured to handle only specific issue types.

Available options:

```javascript
{
  types: <'crash'|'deprecation'|'intervention'>[];
}
```

### Adding a custom Integration
```javascript
import * as Sentry from '@sentry/browser';

// All integration that come with an SDK can be found on Sentry.Integrations object
// Custom integration must conform Integration interface: https://github.com/getsentry/sentry-javascript/blob/master/packages/types/src/integration.ts

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new MyAwesomeIntegration()]
});
```

### Adding Integration from @sentry/integrations

All pluggable / optional integrations do live inside `@sentry/integrations`.

```js
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [
    new Integrations.Vue({
      Vue,
      attachProps: true,
    }),
  ],
});
```

In case you are using the CDN version or the Loader, we provide a standalone file for every integration, you can use it
like this:

```html
<!-- Note that we now also provide a es6 build only -->
<!-- <script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.es6.min.js" integrity="{% sdk_cdn_checksum sentry.javascript.browser latest bundle.es6.min.js %}" crossorigin="anonymous"></script> -->
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js" integrity="{% sdk_cdn_checksum sentry.javascript.browser latest bundle.min.js %}" crossorigin="anonymous"></script>

<!-- If you include the integration it will be available under Sentry.Integrations.Vue -->
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/vue.min.js" crossorigin="anonymous"></script>

<script>
  Sentry.init({
    dsn: '___PUBLIC_DSN___',
    integrations: [
      new Sentry.Integrations.Vue({
        Vue,
        attachProps: true,
      }),
    ],
  });
</script>
```

### Removing an Integration
In this example, we will remove the by default enabled integration for adding breadcrumbs to the event:

```javascript
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: function(integrations) {
    // integrations will be all default integrations
    return integrations.filter(function(integration) {
      return integration.name !== 'Breadcrumbs';
    });
  }
});
```

### Hints
Event and Breadcrumb `hints` are objects containing various information used to put together an event or a breadcrumb. For events, those are things like `event_id`, `originalException`, `syntheticException` (used internally to generate cleaner stack trace), and any other arbitrary `data` that user attaches. For breadcrumbs, it's all implementation dependent. For XHR requests, the hint contains the xhr object itself, for user interactions it contains the DOM element and event name, etc.

They are available in two places: `beforeSend`/`beforeBreadcrumb` and `eventProcessors`. Those are two ways we'll allow users to modify what we put together.

#### Hints for Events

`originalException`

: The original exception that caused the Sentry SDK to create the event. This is useful for changing how the Sentry SDK groups events or to extract additional information.

`syntheticException`

: When a string or a non-error object is raised, Sentry creates a synthetic exception so you can get a
basic stack trace. This exception is stored here for further data extraction.

#### Hints for Breadcrumbs

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

## Additional Resources
- [Optimizing the Sentry Workflow](https://blog.sentry.io/2018/03/06/the-sentry-workflow)
- [Debug Tough Front-End Errors by Giving Sentry More Clues](https://blog.sentry.io/2019/01/17/debug-tough-front-end-errors-sentry-clues)
- [How Sentry Translates & Groups Localized Errors](https://blog.sentry.io/2018/02/28/internet-explorer-translations)
