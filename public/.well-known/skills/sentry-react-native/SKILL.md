---
name: sentry-react-native
description: Learn how to set up Sentry's React Native SDK.
---

# Sentry React Native

Learn how to set up Sentry's React Native SDK.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/react-native.md - Learn how to set up Sentry's React Native SDK.
- https://docs.sentry.io/platforms/react-native/manual-setup.md - Review the options to manage .
- https://docs.sentry.io/platforms/react-native/manual-setup/manual-setup.md - Learn about manual configuration for iOS and Android.
- https://docs.sentry.io/platforms/react-native/manual-setup/metro.md - Learn about the Metro bundler and how to configure it for your application with Sentry React N...
- https://docs.sentry.io/platforms/react-native/manual-setup/native-init.md - Learn how to manually initialize the native SDKs.
- https://docs.sentry.io/platforms/react-native/manual-setup/hermes.md - Learn about using the Hermes engine with our React Native SDK.
- https://docs.sentry.io/platforms/react-native/manual-setup/ram-bundles.md - Learn about packaging our React Native SDK with RAM Bundle.
- https://docs.sentry.io/platforms/react-native/manual-setup/app-start-error-capture.md - Learn how to capture app start errors and crashes that occur before JavaScript loads using nat...
- https://docs.sentry.io/platforms/react-native/manual-setup/expo.md - Learn how to set up an Expo-managed project with the Sentry React Native SDK.
- https://docs.sentry.io/platforms/react-native/manual-setup/expo/gradle.md - Learn how to configure the Sentry Android Gradle Plugin to automatically upload source maps an...

### Features
- https://docs.sentry.io/platforms/react-native/usage.md - Use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/react-native/tracing.md - Learn how to enable tracing in your app and discover valuable performance insights of your app...
- https://docs.sentry.io/platforms/react-native/tracing/instrumentation.md - Learn how to instrument tracing in your app.
- https://docs.sentry.io/platforms/react-native/tracing/instrumentation/automatic-instrumentation.md - Learn what transactions are captured after tracing is enabled.
- https://docs.sentry.io/platforms/react-native/tracing/instrumentation/custom-instrumentation.md - Learn how to capture performance data on any action in your app.
- https://docs.sentry.io/platforms/react-native/tracing/instrumentation/performance-metrics.md - Learn how to attach performance metrics to your transactions.
- https://docs.sentry.io/platforms/react-native/tracing/instrumentation/user-interaction-instrumentation.md - Learn what kinds of user interactions can be captured
- https://docs.sentry.io/platforms/react-native/tracing/instrumentation/time-to-display.md - Learn how to measure time to display with the Sentry React Native SDK.
- https://docs.sentry.io/platforms/react-native/tracing/instrumentation/react-navigation.md - Learn how to use Sentry's React Navigation instrumentation.
- https://docs.sentry.io/platforms/react-native/tracing/instrumentation/react-native-navigation.md - Learn how to use Sentry's React Native Navigation instrumentation.
- https://docs.sentry.io/platforms/react-native/tracing/instrumentation/expo-router.md - Learn how to use Sentry's Expo Router instrumentation.
- https://docs.sentry.io/platforms/react-native/tracing/instrumentation/custom-navigation.md - Learn how to use Sentry's Generic Navigation instrumentation.
- https://docs.sentry.io/platforms/react-native/tracing/trace-propagation.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/react-native/tracing/trace-propagation/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/react-native/tracing/troubleshooting.md - Learn how to troubleshoot your tracing setup.
- https://docs.sentry.io/platforms/react-native/profiling.md - Learn how to enable profiling in your app if it is not already set up.
- https://docs.sentry.io/platforms/react-native/profiling/troubleshooting.md - Learn how to troubleshoot your profiling setup.
- https://docs.sentry.io/platforms/react-native/logs.md - Structured logs allow you to send, view and query logs sent from your applications within Sentry.
- https://docs.sentry.io/platforms/react-native/session-replay.md - Learn how to enable Session Replay in your mobile app.
- https://docs.sentry.io/platforms/react-native/session-replay/privacy.md - Learn how to mask sensitive data that may appear in your app in Session Replay.
- https://docs.sentry.io/platforms/react-native/session-replay/performance-overhead.md - Learn about how enabling Session Replay impacts the performance of your application.
- https://docs.sentry.io/platforms/react-native/sourcemaps/uploading.md - Learn how to provide your source maps to Sentry.
- https://docs.sentry.io/platforms/react-native/sourcemaps/uploading/codepush.md - Upload source maps for CodePush releases.
- https://docs.sentry.io/platforms/react-native/sourcemaps/uploading/expo.md - Upload source maps for native Expo releases and EAS Update.
- https://docs.sentry.io/platforms/react-native/sourcemaps/uploading/expo-advanced.md - Manually upload source maps for native Expo releases.
- https://docs.sentry.io/platforms/react-native/sourcemaps/uploading/hermes.md - Upload source maps for React Native Hermes applications.
- https://docs.sentry.io/platforms/react-native/sourcemaps/uploading/jsc.md - Upload source maps for React Native JavaScript Core application.
- https://docs.sentry.io/platforms/react-native/sourcemaps/troubleshooting.md - Troubleshooting for source maps.
- https://docs.sentry.io/platforms/react-native/sourcemaps/troubleshooting/optional-release-and-distribution.md - Learn about how to set optional source maps attributes with older React Native SDKs.
- https://docs.sentry.io/platforms/react-native/sourcemaps/troubleshooting/legacy-uploading-methods.md - Learn about how to upload source maps with older SDKs and Sentry tools.
- https://docs.sentry.io/platforms/react-native/sourcemaps/debug-ids.md
- https://docs.sentry.io/platforms/react-native/metrics.md - Metrics allow you to send, view and query counters, gauges and measurements from your Sentry-c...
- https://docs.sentry.io/platforms/react-native/user-feedback.md - Learn how to enable User Feedback in your app.
- https://docs.sentry.io/platforms/react-native/user-feedback/configuration.md - Learn about the User Feedback Widget configuration options.
- https://docs.sentry.io/platforms/react-native/feature-flags.md - Generic Feature Flags Integration.
- https://docs.sentry.io/platforms/react-native/size-analysis.md - Upload React Native iOS and Android builds to Sentry for size analysis.

### Configuration
- https://docs.sentry.io/platforms/react-native/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/react-native/configuration.md - Additional configuration options for the SDK.
- https://docs.sentry.io/platforms/react-native/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/react-native/configuration/app-hangs.md - Learn about how to add app hang detection reporting.
- https://docs.sentry.io/platforms/react-native/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/react-native/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/react-native/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/react-native/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/react-native/configuration/draining.md - Learn more about the default behavior of our SDK if the application shuts down unexpectedly.
- https://docs.sentry.io/platforms/react-native/configuration/touchevents.md - Learn more about how to enable tracking touch events.
- https://docs.sentry.io/platforms/react-native/configuration/webview.md - Learn how to set up the Sentry React Native and Browser SDKs with React Native WebView.
- https://docs.sentry.io/platforms/react-native/integrations.md - Learn more about how integrations extend the functionality of our SDK and automatically cover ...
- https://docs.sentry.io/platforms/react-native/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/react-native/sourcemaps.md - Learn more about how to upload your source maps to Sentry.
- https://docs.sentry.io/platforms/react-native/upload-debug.md - Learn about using the Sentry Gradle Plugin or sentry-cli for providing debug symbols to Sentry.
- https://docs.sentry.io/platforms/react-native/releases.md - Learn about Sentry's release channels for Mobile SDK updates.
- https://docs.sentry.io/platforms/react-native/overhead.md - Learn about Sentry's React Native SDK overhead and how you can tailor your configuration to mi...
- https://docs.sentry.io/platforms/react-native/build-distribution.md - Upload React Native iOS and Android builds to Sentry for distribution to internal teams and be...
- https://docs.sentry.io/platforms/react-native/migration.md - Learn how to migrate to the new versions of Sentry's React Native SDK.
- https://docs.sentry.io/platforms/react-native/troubleshooting.md - Troubleshoot and resolve common issues with the React Native SDK.

### Enriching Events
- https://docs.sentry.io/platforms/react-native/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/react-native/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/react-native/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/react-native/enriching-events/event-processors.md - Learn more about how you can add your own event processors globally or to the current scope.
- https://docs.sentry.io/platforms/react-native/enriching-events/scopes.md - SDKs will typically automatically manage the scopes for you in the framework integrations. Lea...
- https://docs.sentry.io/platforms/react-native/enriching-events/screenshots.md - Learn more about taking screenshots when an error occurs. Sentry pairs the screenshot with the...
- https://docs.sentry.io/platforms/react-native/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/react-native/enriching-events/transaction-name.md - Learn how to set or override the transaction name to capture the user and gain critical pieces...
- https://docs.sentry.io/platforms/react-native/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...
- https://docs.sentry.io/platforms/react-native/enriching-events/viewhierarchy.md - Learn more about debugging the view hierarchy when an error occurs. Sentry pairs the view hier...

### Data Management
- https://docs.sentry.io/platforms/react-native/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/react-native/data-management/apple-privacy-manifest.md - Troubleshoot and resolve common issues with the Apple Privacy Manifest and Sentry React Native...
- https://docs.sentry.io/platforms/react-native/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...
- https://docs.sentry.io/platforms/react-native/data-management/debug-files.md - Learn about how debug information files allow Sentry to extract stack traces and provide more ...
- https://docs.sentry.io/platforms/react-native/data-management/debug-files/file-formats.md - Learn about platform-specific file formats and the debug information they contain.
- https://docs.sentry.io/platforms/react-native/data-management/debug-files/identifiers.md - Learn about build tooling requirements that allow Sentry to uniquely identify debug informatio...
- https://docs.sentry.io/platforms/react-native/data-management/debug-files/upload.md - Learn about uploading debug information files to Sentry.
- https://docs.sentry.io/platforms/react-native/data-management/debug-files/symbol-servers.md - Learn about symbol servers and how to configure them with your Sentry projects.
- https://docs.sentry.io/platforms/react-native/data-management/debug-files/source-context.md - Learn about setting up source bundles to show source code in stack traces on the Issue Details...

### Migration
- https://docs.sentry.io/platforms/react-native/migration/v7-to-v8.md - Learn how to migrate from version 7 to version 8 of the Sentry React Native SDK
- https://docs.sentry.io/platforms/react-native/migration/v6-to-v7.md - Learn how to migrate from version 6 to version 7 of the Sentry React Native SDK
- https://docs.sentry.io/platforms/react-native/migration/v5-to-v6.md - Learn how to migrate from version 5 to version 6 of the Sentry React Native SDK
- https://docs.sentry.io/platforms/react-native/migration/before-v5.md - Learn how to migrate to version 5 of the SDK .
- https://docs.sentry.io/platforms/react-native/migration/sentry-expo.md - Learn about migrating from sentry-expo to @sentry/react-native

### Other
- https://docs.sentry.io/platforms/react-native/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/react-native/usage/sdk-fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
- https://docs.sentry.io/platforms/react-native/usage/event-information.md - Learn about the information we attach onto events.
- https://docs.sentry.io/platforms/react-native/features.md - Learn about the features of Sentry's React Native SDK.
- https://docs.sentry.io/platforms/react-native/integrations/redux.md - Learn about Sentry's Redux integration.
- https://docs.sentry.io/platforms/react-native/integrations/component-tracking.md - Learn how Sentry's React Native SDK allows you to monitor your application's component lifecycle.
- https://docs.sentry.io/platforms/react-native/integrations/component-names.md - Learn how Sentry's React Native SDK allows you to monitor your components.
- https://docs.sentry.io/platforms/react-native/integrations/error-boundary.md - Learn how the React Native SDK exports an error boundary component that leverages React compon...
- https://docs.sentry.io/platforms/react-native/integrations/unhandled-rejections.md - Learn about Sentry's Unhandled Promise Rejections handling in React Native.
- https://docs.sentry.io/platforms/react-native/integrations/custom.md - Learn how to enable a custom integration.
- https://docs.sentry.io/platforms/react-native/integrations/default.md - Learn more about system integrations: Dedupe, FunctionToString, Breadcrumbs, LinkedErrors, and...
- https://docs.sentry.io/platforms/react-native/integrations/plugin.md - Learn more about pluggable integrations: HttpClient and RewriteFrames, which are snippets of c...
- https://docs.sentry.io/platforms/react-native/size-analysis/insights.md - See how Size Analysis surfaces trends for React Native builds.
