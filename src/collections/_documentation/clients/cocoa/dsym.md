---
title: 'Uploading Debug Symbols'
---

A dSYM upload is required for Sentry to symoblicate your crash logs for viewing. The symoblication process unscrambles Apple’s crash logs to reveal the function, variables, file names, and line numbers of the crash. The dSYM file can be uploaded through the [sentry-cli](https://github.com/getsentry/sentry-cli) tool or through a [Fastlane](https://fastlane.tools/) action.

## With Bitcode {#dsym-with-bitcode}

If [Bitcode](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/AppThinning/AppThinning.html#//apple_ref/doc/uid/TP40012582-CH35-SW2) **is enabled** in your project, you will have to upload the dSYM to Sentry **after** it has finished processing in the iTunesConnect. We also recommend using the latest Xcode 8.1 version for submitting your build. The dSYM can be downloaded in three ways.

### Use Fastlane

Use the [Fastlane’s](https://github.com/fastlane/fastlane) action, _download_dsyms_, to download the dSYMs from iTunesConnect and upload to Sentry. The dSYM won’t be generated until **after** the app is done processing on iTunesConnect so this should be run in its own lane.

```ruby
lane :upload_symbols do
  download_dsyms
  upload_symbols_to_sentry(
    auth_token: '...',
    org_slug: '...',
    project_slug: '...',
  )
end
```

If you have a legacy API key instead you can supply it with _api_key_ instead of _auth_token_.

{% capture __alert_content -%}
By default fastlane will connect to sentry.io. For on-prem you need to provide the _api_host_ parameter to instruct the tool to connect to your server:

```
api_host: 'https://mysentry.invalid/'
```
{%- endcapture -%}
{%- include components/alert.html
  title="On Prem"
  content=__alert_content
%}

### Use ‘sentry-cli`

There are two ways to download the dSYM from iTunesConnect. After you do one of the two following ways, you can upload the dSYM using [sentry-cli](https://github.com/getsentry/sentry-cli/releases).

1.  Open Xcode Organizer, go to your app, and click “Download dSYMs...”
2.  Login to iTunes Connect, go to your app, go to “Activity, click the build number to go into the detail page, and click “Download dSYM”

Afterwards manually upload the symbols with _sentry-cli_:

```bash
sentry-cli --auth-token YOUR_AUTH_TOKEN upload-dsym --org YOUR_ORG_SLUG --project YOUR_PROJECT_SLUG PATH_TO_DSYMS
```

{% capture __alert_content -%}
By default sentry-cli will connect to sentry.io. For on-prem you need to export the _SENTRY_URL_ environment variable to instruct the tool to connect to your server:

```bash
export SENTRY_URL=https://mysentry.invalid/
```
{%- endcapture -%}
{%- include components/alert.html
  title="On Prem"
  content=__alert_content
%}

## Without Bitcode {#dsym-without-bitcode}

When not using bitcode you can directly upload the symbols to Sentry as part of a build.

### Use Fastlane {#id1}

If you are already using Fastlane you can use it in this situation as well. If you are not, you might prefer the _sentry-cli_ integerated into Xcode.

```ruby
lane :build do
  gym
  upload_symbols_to_sentry(
    auth_token: '...',
    org_slug: '...',
    project_slug: '...',
  )
end
```

If you have a legacy API key instead you can supply it with _api_key_ instead of _auth_token_.

{% capture __alert_content -%}
By default fastlane will connect to sentry.io. For on-prem you need to provide the _api_host_ parameter to instruct the tool to connect to your server:

```
api_host: 'https://mysentry.invalid/'
```
{%- endcapture -%}
{%- include components/alert.html
  title="On Prem"
  content=__alert_content
%}

### Upload Symbols with _sentry-cli_

Your project’s dSYM can be upload during the build phase as a “Run Script”. For this you need to st the _DEBUG_INFORMATION_FORMAT_ to be _DWARF with dSYM File_. By default, an Xcode project will only have _DEBUG_INFORMATION_FORMAT_ set to _DWARF with dSYM File_ in _Release_ so make sure everything is set in your build settings properly.

You need to have an Auth Token for this to work. You can [create an Auth Token here](https://sentry.io/api/).

1.  You will need to copy the below into a new _Run Script_ and set your _AUTH_TOKEN_, _ORG_SLUG_, and _PROJECT_SLUG_
2.  Download and install [sentry-cli](https://github.com/getsentry/sentry-cli/releases) — The best place to put this is in the _/usr/local/bin/_ directory

Shell: _/bin/bash_

```bash
if which sentry-cli >/dev/null; then
export SENTRY_ORG=___ORG_NAME___
export SENTRY_PROJECT=___PROJECT_NAME___
export SENTRY_AUTH_TOKEN=YOUR_AUTH_TOKEN
ERROR=$(sentry-cli upload-dsym 2>&1 >/dev/null)
if [ ! $? -eq 0 ]; then
echo "warning: sentry-cli - $ERROR"
fi
else
echo "warning: sentry-cli not installed, download from https://github.com/getsentry/sentry-cli/releases"
fi
```

The `upload-dsym` command automatically picks up the `DWARF_DSYM_FOLDER_PATH` environment variable that Xcode exports and look for dSYM files there.

{% capture __alert_content -%}
By default sentry-cli will connect to sentry.io. For on-prem you need to export the _SENTRY_URL_ environment variable to instruct the tool to connect to your server:

```bash
export SENTRY_URL=https://mysentry.invalid/
```
{%- endcapture -%}
{%- include components/alert.html
  title="On Prem"
  content=__alert_content
%}

### Manually with _sentry-cli_

Your dSYM file can be upload manually by you (or some automated process) with the _sentry-cli_ tool. You will need to know the following information:

-   API Key
-   Organization slug
-   Project slug
-   Path to the build’s dSYM

Download and install [sentry-cli](https://github.com/getsentry/sentry-cli/releases) — The best place to put this is in the _/usr/local/bin/_ directory.

Then run this:

```bash
sentry-cli --auth-token YOUR_AUTH_TOKEN upload-dsym --org YOUR_ORG_SLUG --project YOUR_PROJECT_SLUG PATH_TO_DSYMS
```

{% capture __alert_content -%}
By default sentry-cli will connect to sentry.io. For on-prem you need to export the _SENTRY_URL_ environment variable to instruct the tool to connect to your server:

```bash
export SENTRY_URL=https://mysentry.invalid/
```
{%- endcapture -%}
{%- include components/alert.html
  title="On Prem"
  content=__alert_content
%}
