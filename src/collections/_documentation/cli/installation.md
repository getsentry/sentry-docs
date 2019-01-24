---
title: Installation
sidebar_order: 0
---

Depending on your platform, there are different methods available to install `sentry-cli`.

## Manual Download

You can find the list of releases on [the GitHub release page](https://github.com/getsentry/sentry-cli/releases/). We provide executables for Linux, OS X and Windows. It’s a single file download and upon receiving the file you can rename it to just `sentry-cli` or `sentry-cli.exe` to use it.

## Automatic Installation

If you are on OS X or Linux, you can use the automated downloader which will fetch the latest release version for you and install it:

```bash
$ curl -sL https://sentry.io/get-cli/ | bash
```

This will automatically download the correct version of `sentry-cli` for your operating system and install it. If necessarily, it will prompt for your admin password for `sudo`.

To verify it’s installed correctly you can bring up the help:

```bash
$ sentry-cli --help
```

## Installation via NPM

There is also the option to install `sentry-cli` via npm for specialized use cases. This, for instance, is useful for build servers. The package is called `@sentry/cli` and in the post installation it will download the appropriate release binary:

```bash
$ npm install @sentry/cli
```

You can then find it in the _.bin_ folder:

```bash
$ ./node_modules/.bin/sentry-cli --help
```

{% capture __alert_content -%}
In case you want to install this with npm system wide with sudo you will need to pass _–unsafe-perm_ to it:

```bash
$ sudo npm install -g @sentry/cli --unsafe-perm
```

This installation is not recommended however.
{%- endcapture -%}
{%- include components/alert.html
  title="sudo Installation"
  content=__alert_content
%}{% capture __alert_content -%}

By default, this package will download sentry-cli from the CDN managed by [Fastly](https://www.fastly.com/). To use a custom CDN, set the npm config property `sentrycli_cdnurl`. The downloader will append `"/<version>/sentry-cli-<dist>"`.

```bash
$ npm install @sentry/cli --sentrycli_cdnurl=https://mymirror.local/path
```

Or add property into your _.npmrc_ file ([https://docs.npmjs.com/files/npmrc](https://docs.npmjs.com/files/npmrc))

```bash
sentrycli_cdnurl=https://mymirror.local/path
```

Another option is to use the environment variable `SENTRYCLI_CDNURL`.

```bash
$ SENTRYCLI_CDNURL=https://mymirror.local/path npm install @sentry/cli
```

{%- endcapture -%}
{%- include components/alert.html
  title="Downloading from a Custom Source"
  content=__alert_content
%}

## Installation via Homebrew

If you are on OS X, you can install `sentry-cli` via homebrew:

```bash
$ brew install getsentry/tools/sentry-cli
```

## Docker Image

For unsupported distributions and CI systems, we offer a Docker image that comes with `sentry-cli` preinstalled. It is recommended to use the `latest` tag, but you can also pin to a specific version. By default, the command runs inside the `/work` directory. Mount relevant project folders and build outputs there to allow `sentry-cli` to scan for resources:

```bash
$ docker pull getsentry/sentry-cli
$ docker run --rm -v $(pwd):/work getsentry/sentry-cli --help
```

## Updating and Uninstalling

You can use `sentry-cli update` and `sentry-cli uninstall` to update or uninstall the sentry command line interface. These commands might be unavailable in certain situations (for instance if you install `sentry-cli` with homebrew).
