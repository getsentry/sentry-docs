---
title: Cocoa
---

<!-- WIZARD -->
{% capture __alert_content -%}
Version `5.0.0` is in beta. If you are not comfortable installing our `beta` SDK, our latest stable version can be found here. [4.x]({%- link _documentation/clients/cocoa/index.md -%})
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

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
    pod 'Sentry', :git => 'https://github.com/getsentry/sentry-cocoa.git', :tag => '5.0.0-beta.3'
end
```
<!-- {% sdk_version sentry.cocoa %} -->

Afterwards run `pod install`.

### Carthage

To integrate Sentry into your Xcode project using Carthage, specify it in your _Cartfile_:

```ruby
github "getsentry/sentry-cocoa" "5.0.0-beta.3"
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

-   [With Bitcode]({%- link _documentation/platforms/cocoa/dsym.md -%}#dsym-with-bitcode)
-   [Without Bitcode]({%- link _documentation/platforms/cocoa/dsym.md -%}#dsym-without-bitcode)

<!-- ENDWIZARD -->

## Testing if the SDK works

To validate that the SDK is correctly set up and connected to your Sentry project, capture a test message:

{% include components/platform_content.html content_dir='captureMessage' %}

If everything is working correctly, this message should appear within seconds in your Sentry project.

## Crash Handling

Our SDK hooks into all signal and exception handlers, except for MacOS. If you are using MacOS, please see the additional step provided in [Advanced Usage]({%- link _documentation/platforms/cocoa/usage.md -%})
To try it out, the SDK provides a test crash function:

{% include components/platform_content.html content_dir='crash' %}

_If you crash with a debugger attached, nothing will happen._

Crashes are submitted only upon re-launch of the application. To view the crash in Sentry, close your app and re-launch it.


## Deep Dive

-   [Uploading Debug Symbols]({%- link _documentation/platforms/cocoa/dsym.md -%})
    -   [With Bitcode]({%- link _documentation/platforms/cocoa/dsym.md -%}#with-bitcode)
    -   [Without Bitcode]({%- link _documentation/platforms/cocoa/dsym.md -%}#without-bitcode)
-   [Advanced Usage]({%- link _documentation/platforms/cocoa/usage.md -%})
