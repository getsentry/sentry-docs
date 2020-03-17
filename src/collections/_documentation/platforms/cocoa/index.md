---
title: Cocoa
---

{% capture __alert_content -%}
Version `5.0.0` is still in beta.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

This is the documentation for our Cocoa SDK (Swift and Objective-C).
If you are migrating from an older version, please consider our [Migration Guide](https://github.com/getsentry/sentry-cocoa/blob/master/MIGRATION.md). Also always make sure to follow the [changelog](https://github.com/getsentry/sentry-cocoa/blob/master/CHANGELOG.md)

<!-- WIZARD -->
## Installation {#install}

The SDK can be installed using [CocoaPods](http://cocoapods.org), [Carthage](https://github.com/Carthage/Carthage), or [Swift Package Manager](https://swift.org/package-manager/). This is the recommended SDK for both Swift and Objective-C projects.

It supports iOS (>= 8.0), tvOS (>= 9.0), macOS (>= 10.10) and partially watchOS (>= 2.0). 

### CocoaPods

Installing the SDK with CocoaPods is currently our recommended way.
To integrate Sentry into your Xcode project, specify it in your _Podfile_:

```ruby
platform :ios, '8.0'
use_frameworks! # This is important

target 'YourApp' do
    pod 'Sentry', :git => 'https://github.com/getsentry/sentry-cocoa.git', :tag => '5.0.0-beta.0'
end
```
<!-- {% sdk_version sentry.cocoa %} -->

Afterwards run `pod install`. In case you encounter problems with dependencies and you are on a newer CocoaPods you might have to run `pod repo update` first.

### Carthage

To integrate Sentry into your Xcode project using Carthage, specify it in your _Cartfile_:

```ruby
github "getsentry/sentry-cocoa" "5.0.0-beta.0"
```

Run `carthage update` to download the framework and drag the built _Sentry.framework_ into your Xcode project.

We also provide a pre-built version for every release which can be downloaded at [releases on GitHub](https://github.com/getsentry/sentry-cocoa/releases).

### Swift Package Manager

To integrate Sentry into your Xcode project using SPM, open your App in Xcode and open `File` -> `Swift Packages` -> `Add Package Dependency`. Then add the SDK by entering the git repo url `https://github.com/getsentry/sentry-cocoa.git`, and select a version (or branch) on the next page.

NOTE: Version tags or branches need to have the Package.swift file in it or Xcode won't be able to install the package.

## Configuration {#configure}

Make sure you initalize the SDK as soon as possible in your application lifecycle e.g. in you AppDelegate’s `application:didFinishLaunchingWithOptions` method:

{% include components/platform_content.html content_dir='init' %}

## Debug Symbols {#sentry-cocoa-debug-symbols}

Before you can start capturing crashes you will need to tell Sentry about the debug information by uploading dSYM files. Depending on your setup this can be done in different ways:

-   [With Bitcode]({%- link _documentation/platforms/cocoa/dsym.md -%}#dsym-with-bitcode)
-   [Without Bitcode]({%- link _documentation/platforms/cocoa/dsym.md -%}#dsym-without-bitcode)

<!-- ENDWIZARD -->

## Testing if the SDK works

The simplest way to figure out if the SDK is setup correctly and connected to your Sentry project, just simply capture a message:

{% include components/platform_content.html content_dir='captureMessage' %}

If everything is working correctly, this message should appear within seconds in your Sentry project.

## Crash Handling

By default our SDK hooks into all the signal and exception handlers (for macOS there is one additional step -> see [Advanced Usage]({%- link _documentation/platforms/cocoa/usage.md -%})).
If you want to try out if it works for you, the SDK provides a test crash function in order to crash your app:

{% include components/platform_content.html content_dir='crash' %}

_If you crash with a debugger attached, nothing will happen._

Crashes are only submitted upon re-launching the application. To see the crash in Sentry, close the app and launch it again.


## Deep Dive

-   [Uploading Debug Symbols]({%- link _documentation/platforms/cocoa/dsym.md -%})
    -   [With Bitcode]({%- link _documentation/platforms/cocoa/dsym.md -%}#with-bitcode)
    -   [Without Bitcode]({%- link _documentation/platforms/cocoa/dsym.md -%}#without-bitcode)
-   [Advanced Usage]({%- link _documentation/platforms/cocoa/usage.md -%})
