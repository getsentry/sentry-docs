---
title: 'Hosting / Uploading'
sidebar_order: 2
---

Source maps can be either:

1.  Served publicly over HTTP alongside your source files.
2.  Uploaded directly to Sentry (**recommended**).

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

For these reasons, it is recommended to upload source maps to Sentry beforehand (see below).

{% capture __alert_content -%}
While the recommended solution is to upload your source artifacts to Sentry, sometimes it’s necessary to allow communication from Sentry’s internal IPs. For more information on Sentry’s public IPs, [IP Ranges]({%- link ip-ranges.md -%}#ip-ranges).
{%- endcapture -%}
{%- include components/alert.html
  title="Working Behind a Firewall"
  content=__alert_content
%}{% capture __alert_content -%}
If you want to keep your source maps secret and choose not to upload your source maps directly to Sentry, you can enable the “Security Token” option in your project settings. This will cause outbound requests from Sentry’s servers to URLs originating from your “Allowed Domains” to have the HTTP header “X-Sentry-Token: {token}” appended, where {token} is a secure value you define. You can then configure your web server to allow access to your source maps when this header/token pair is present. You can alternatively override the default header name (X-Sentry-Token) and use HTTP Basic Authentication, e.g. by passing “Authorization: Basic {encoded_password}”.
{%- endcapture -%}
{%- include components/alert.html
  title="Secure Access to Source Maps"
  content=__alert_content
%}

### Uploading Source Maps to Sentry

Except for [webpack]({%- link _documentation/platforms/javascript/sourcemaps/generation.md -%}#webpack), the recommended way to upload source maps is using [Sentry CLI]({%- link _documentation/cli/index.md -%}). If you have used [_Sentry Wizard_](https://github.com/getsentry/sentry-wizard) to set up your project, it has already created all necessary configuration to upload source maps. Otherwise, follow the [CLI configuration docs]({%- link _documentation/cli/configuration.md -%}) to set up your project.

Now you need to set up your build system to create a release, and attach the various source files. For Sentry to de-minify your stacktraces you must provide both the minified files (e.g. app.min.js) and the corresponding source maps. In case the source map files do not contain your original source code (`sourcesContent`), you must additionally provide the original source files. (Alternatively, sentry-cli will automatically embed the sources (if missing) into your source maps if you pass the `--rewrite` flag.)

Sentry uses [**Releases**]({%- link _documentation/workflow/releases.md -%}) to match the correct source maps to your events. To create a new release, run the following command (e.g. during publishing):

```sh
$ sentry-cli releases new <release_name>
```

Note the release name must be **unique within your organization** and match the `release` option in your SDK initialization code. Then, use the `upload-sourcemaps` command to scan a folder for source maps, process them and upload them to Sentry:

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

Until now, the release is in a draft state (“_unreleased_”). Once all source maps have been uploaded and your app has been published successfully, finalize the release with the following command:

```sh
$ sentry-cli releases finalize <release_name>
```

For convenience, you can alternatively pass the `--finalize` flag to the `new` command which will immediately finalize the release.

Note: You dont _have_ to upload the source files (ref’d by source maps), but without them the grouping algorithm will not be as strong, and the UI will not show any contextual source.

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
Unfortunately it can be quite challenging to ensure that source maps are actually valid themselves and uploaded correctly. To ensure that everything is working as intended you can use the _–validate_ flag when uploading source maps which will attempt to locally parse the source map and look up the references. Note that there are known cases where the validate flag will indicate failures when the setup is correct (if you have references to external source maps then the validation tool will indicate a failure).

Here are some things you can check in addition to the validation step:

-   Make sure that the URL prefix is correct for your files. This is easy to get wrong.
-   Make sure you upload the matching source maps for your minimized files.
-   Make sure that your minified files you have on your servers actually have references to your files.
{%- endcapture -%}
{%- include components/alert.html
  title="Validating source maps with Sentry CLI"
  content=__alert_content
%}
