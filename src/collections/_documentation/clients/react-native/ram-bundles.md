---
title: 'Using RAM Bundles'
---

The [RAM bundle](https://facebook.github.io/react-native/docs/performance#ram-bundles-inline-requires) format is a new approach to packaging React Native apps that optimizes your app's startup time. With RAM bundles, it is possible to load to memory only those modules that are needed for specific functionality, and only when needed.

All the existing RAM bundle formats are explained in detail in the [Metro Bundler documentation](https://facebook.github.io/metro/docs/en/bundling).

## Enabling RAM Bundles

To enable RAM bundles for your app, please consult with the [official React Native documentation](https://facebook.github.io/react-native/docs/performance#enable-the-ram-format).

If you use the official `react-native-sentry` integration of version `0.43.1` or newer, no additional actions are required. `sentry-cli`, which is used internally by the integration, will detect the bundle type automatically, and then upload the extracted modules to Sentry.

## Uploading Bundles Manually

Starting from version `1.43.0`, `sentry-cli` provides two additional parameters to the `upload-sourcemaps` command in order to simplify bundle uploads: `--bundle` and `--bundle-sourcemap`. Using those parameters, you can pass the path to the application bundle, along with its source map, and the bundle will be automatically extracted before the upload, if necessary:

```sh
sentry-cli releases files RELEASE_ID upload-sourcemaps --bundle main.bundle --bundle-sourcemap main.bundle.map
```

All bundle types (plain, Indexed RAM bundles, and File RAM bundles) are supported.

## RAM Bundles and Performance

The initial Sentry support for RAM bundles, added in `sentry-cli 1.43.0` and `react-native-sentry 0.43.1`, is known to have an upload performance issue when handling RAM bundles with a large number of modules. This will be fixed in future client versions.

By default, when running as part of Xcode build step (normally called "Bundle React Native Code And Images"), `sentry-cli` uploads source maps to Sentry in the background. To make it run in the foreground and track its progress, you can add `--force-foreground` parameter to the `sentry-cli` command in your Xcode project configuration file `project.pbxproj`, so the command looks similar to:

```sh
./node_modules/@sentry/cli/bin/sentry-cli react-native xcode --force-foreground ../node_modules/react-native/scripts/react-native-xcode.sh
```
