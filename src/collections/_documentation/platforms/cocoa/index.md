---
title: Cocoa
---

<!-- WIZARD -->

This is the documentation for our Cocoa SDK (Swift and Objective-C).
If you are migrating from an older version, please consider our [Migration Guide](https://github.com/getsentry/sentry-cocoa/blob/master/MIGRATION.md). Also always make sure to follow the [changelog](https://github.com/getsentry/sentry-cocoa/blob/master/CHANGELOG.md)

## Installation {#install}

The SDK can be installed using [CocoaPods](http://cocoapods.org), [Carthage](https://github.com/Carthage/Carthage), or [Swift Package Manager](https://swift.org/package-manager/). This is the recommended SDK for both Swift and Objective-C projects.

It supports iOS (>= 8.0), tvOS (>= 9.0), macOS (>= 10.10) and partially watchOS (>= 2.0). 

### CocoaPods

We recommend installing the SDK with CocoaPods..
To integrate Sentry into your Xcode project, specify it in your _Podfile_:

```ruby
platform :ios, '8.0'
use_frameworks! # This is important

target 'YourApp' do
    pod 'Sentry', :git => 'https://github.com/getsentry/sentry-cocoa.git', :tag => '{% sdk_version sentry.cocoa %}'
end
```
<!-- {% sdk_version sentry.cocoa %} -->

Afterwards run `pod install`.

### Carthage

To integrate Sentry into your Xcode project using Carthage, specify it in your _Cartfile_:

```ruby
github "getsentry/sentry-cocoa" "{% sdk_version sentry.cocoa %}"
```

Run `carthage update` to download the framework and drag the built _Sentry.framework_ into your Xcode project.

We also provide a pre-built version for every release which can be downloaded at [releases on GitHub](https://github.com/getsentry/sentry-cocoa/releases).

### Swift Package Manager

To integrate Sentry into your Xcode project using SPM, open your App in Xcode and open `File` -> `Swift Packages` -> `Add Package Dependency`. Then add the SDK by entering the git repo url `https://github.com/getsentry/sentry-cocoa.git`, and select a version (or branch) on the next page.

NOTE: Version tags or branches need to have the Package.swift file in it or Xcode won't be able to install the package.

## Configuration {#configure}

Make sure you initalize the SDK as soon as possible in your application lifecycle e.g. in your AppDelegate `application:didFinishLaunchingWithOptions` method:

{% include components/platform_content.html content_dir='init' %}

## Debug Symbols {#sentry-cocoa-debug-symbols}

Before capturing crashes, you need to provide debug information to Sentry. Debug information is provided by uploading dSYM files using one of two methods, dependent on your setup:

-   [With Bitcode](/platforms/cocoa/dsym/#dsym-with-bitcode)
-   [Without Bitcode](/platforms/cocoa/dsym/#dsym-without-bitcode)

<!-- ENDWIZARD -->

## Testing if the SDK works

To validate that the SDK is correctly set up and connected to your Sentry project, capture a test message:

{% include components/platform_content.html content_dir='captureMessage' %}

If everything is working correctly, this message should appear within seconds in your Sentry project.

## Crash Handling

Our SDK hooks into all signal and exception handlers, except for MacOS. If you are using MacOS, please see the additional step provided in [Advanced Usage](/platforms/cocoa/usage/)
To try it out, the SDK provides a test crash function:

{% include components/platform_content.html content_dir='crash' %}

_If you crash with a debugger attached, nothing will happen._

Crashes are submitted only upon re-launch of the application. To view the crash in Sentry, close your app and re-launch it.

## Release Health

Monitor the [health of releases](/workflow/releases/health/) by observing user adoption, usage of the application, percentage of [crashes](/workflow/releases/health/#crash), and [session data](/workflow/releases/health/#session). Release health will provide insight into the impact of crashes and bugs as it relates to user experience, and reveal trends with each new issue through the release details, graphs, and filters.

To benefit from the health data you must use at least version 5.0.0 of the Cocoa SDK and enable the collection of the release health metrics by adding `"enableAutoSessionTracking": true` into options during the initialization of the SDK.

{% include components/platform_content.html content_dir='enableAutoSessionTracking' %}

The SDK will automatically manage the start and end of the sessions when the application is started, goes to background, returns to the foreground, etc.

By default, the session is terminated once the application is in the background for more than 30 seconds. You can change the time out with the option named `sessionTrackingIntervalMillis`. It takes the amount in milliseconds. For example, to configure it to be 60 seconds:

{% include components/platform_content.html content_dir='sessionTrackingIntervalMillis' %}

### Identification of the User

By default, we don’t apply the user identification provided to the SDK via the API. Instead, we use the installation ID generated with the first use of the application. The ID doesn’t contain any private or public data of your users or any public or shared data of their device.

For more details, see the [full documentation on Release Health](/workflow/releases/health/).

## Deep Dive

-   [Uploading Debug Symbols](/platforms/cocoa/dsym/)
    -   [With Bitcode](/platforms/cocoa/dsym/#with-bitcode)
    -   [Without Bitcode](/platforms/cocoa/dsym/#without-bitcode)
-   [Advanced Usage](/platforms/cocoa/usage/)
