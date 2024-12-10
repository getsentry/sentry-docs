---
title: Installation Recommendations
description: "Learn more about choosing the right installation for Unreal Engine."
sidebar_order: 8000
---

## Installation Recommendations: GitHub Releases or Fab

<Note>
While Unreal Engine uses "plugins", we will refer to the Sentry support we offer within Unreal Engine as the Sentry Unreal Engine SDK.
</Note>

There are three common ways to install an SDK to use with Unreal Engine:
1. Install from the [Epic Games Fab](https://www.fab.com/) ([formerly known as the marketplace](https://www.unrealengine.com/en-US/blog/fab-epics-new-unified-content-marketplace-launches-today))
2. Download a pre-built SDK that you install (e.g. from a [GitHub Releases page](https://github.com/getsentry/sentry-unreal/releases))
3. Clone and build the SDK yourself and install

Being [Fair Source](https://fair.io/), Sentry offers all three for you to be able to get the insights only Sentry can provide. However, each has it's own limitations.

### Overview of SDK Versions

The table below highlights some key differences between different versions of the plugin:

| Feature                    | Fab                 | GitHub Releases | Build Yourself |
|----------------------------|---------------------|-----------------|----------------|
| Supported engine versions  | 5.1 and newer       | 4.27 and newer  | 4.27 and newer |
| Supported UE project types | Blueprint and C++   | C++ only        | C++ only       |
| Backend (Windows)          | Breakpad            | Crashpad        | Crashpad       |
| `on_crash` hook (Windows)  | Not supported       | Supported       | Supported      |
| Sentry CLI *               | Manual download     | Included        | Included       |

Legend:
`*`: Sentry CLI is a standalone tool that the plugin uses under the hood to automatically upload debug information files upon game build completion.

### Installing from Fab

Sentry SDK can be downloaded via the [standard installation process](https://dev.epicgames.com/documentation/en-us/unreal-engine/working-with-plugins-in-unreal-engine#installingpluginsfromtheunrealenginemarketplace) from its [Epic Games Fab page](https://www.fab.com/listings/eaa89d9d-8d39-450c-b75f-acee010890a2).

This method is recommended only for Blueprint UE projects. If you already have a C++ UE project or don't mind converting an existing Blueprint UE project to a C++ one, consider downloading the plugin from GitHub instead.

### Installing from GitHub Releases

The [GitHub Releases page](https://github.com/getsentry/sentry-unreal/releases) provides two plugin packages: `github` and `marketplace`. The key difference between the two is the crash capturing backend, which is used under the hood on Windows.

We recommend using the `github` version which uses `Crashpad`, an out-of-proc handler that sends the crash report right away. The `marketplace` version relies on `Breakpad`, an in-proc handler which requires the UE application or game to be relaunched in order to send the crash reports to Sentry.

### Build yourself

To get started, we recommend cloning the [Unreal SDK repository](https://github.com/getsentry/sentry-unreal) and running the initialization script:

* `./scripts/init.sh` on macOS/Linux
* `./scripts/init-win.ps1` on Windows

<Note>
Initialization scripts require [GitHub CLI](https://cli.github.com/) to be installed.
</Note>

<Note>
If the initialization script fails due to errors on Windows, check your PowerShell version by printing the built-in variable `$PSVersionTable`. If the version is `5.x`, upgrading to a newer version of [PowerShell](https://github.com/powershell/powershell) may resolve these errors.
</Note>

This script links the checked out version of the plugin (the [plugin-dev](https://github.com/getsentry/sentry-unreal/tree/b67076ad5dc419d46b4be70a0bd6e64c2357a82d/plugin-dev) directory) to the [sample app](https://github.com/getsentry/sentry-unreal/tree/b67076ad5dc419d46b4be70a0bd6e64c2357a82d/sample) and downloads the latest builds of native SDKs from our GitHub CI.

After successful initialization, copy the contents of the `plugin-dev` directory to `<your_project_root>/Plugins/Sentry`. This will allow you to use Sentry in your Unreal Engine project.
