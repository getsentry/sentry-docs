---
title: Cocoa
sidebar_order: 1
sidebar_relocation: platforms
---

This is the documentation for our official clients for Cocoa (Swift and Objective-C). Starting with version `3.0.0` we’ve switched our internal code from Swift to Objective-C to maximize compatibility. Also we trimmed the public API of our sdk to a minimum. Some of the lesser used features that were present before are gone now, check out [Migration Guide]({%- link _documentation/clients/cocoa/migration.md -%}#migration) or [Advanced Usage]({%- link _documentation/clients/cocoa/advanced.md -%}#advanced) for details.

## Getting Started
Getting started with Sentry is a three step process:

1.  [Sign up for an account](https://sentry.io/signup/)
2.  [Install your SDK](#install)
2.  [Configure it](#configure)

<!-- WIZARD -->
## Installation {#install}

The SDK can be installed using [CocoaPods](http://cocoapods.org) or [Carthage](https://github.com/Carthage/Carthage). This is the recommended client for both Swift and Objective-C.

We recommend installing Sentry with CocoaPods.

To integrate Sentry into your Xcode project using CocoaPods, specify it in your _Podfile_:

```ruby
source 'https://github.com/CocoaPods/Specs.git'
platform :ios, '8.0'
use_frameworks!

target 'YourApp' do
    pod 'Sentry', :git => 'https://github.com/getsentry/sentry-cocoa.git', :tag => '4.1.0'
end
```

Afterwards run `pod install`. In case you encounter problems with dependencies and you are on a newer CocoaPods you might have to run `pod repo update` first.

To integrate Sentry into your Xcode project using Carthage, specify it in your _Cartfile_:

```ruby
github "getsentry/sentry-cocoa" "4.1.0"
```

Run `carthage update` to download the framework and drag the built _Sentry.framework_ into your Xcode project.

We also provide a pre-built version for every release which can be downloaded at [releases on github](https://github.com/getsentry/sentry-cocoa/releases).

## Configuration {#configure}

To use the client, change your AppDelegate’s _application_ method to instantiate the Sentry client:

```swift
import Sentry

func application(_ application: UIApplication, 
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    // Create a Sentry client and start crash handler
    do {
        Client.shared = try Client(dsn: "___PUBLIC_DSN___")
        try Client.shared?.startCrashHandler()
    } catch let error {
        print("\(error)")
    }

    return true
}
```

If you prefer to use Objective-C you can do so like this:

```objc
@import Sentry;

NSError *error = nil;
SentryClient *client = [[SentryClient alloc] initWithDsn:@"___PUBLIC_DSN___" didFailWithError:&error];
SentryClient.sharedClient = client;
[SentryClient.sharedClient startCrashHandlerWithError:&error];
if (nil != error) {
    NSLog(@"%@", error);
}
```

## Debug Symbols {#sentry-cocoa-debug-symbols}

Before you can start capturing crashes you will need to tell Sentry about the debug information by uploading dSYM files. Depending on your setup this can be done in different ways:

-   [With Bitcode]({%- link _documentation/clients/cocoa/dsym.md -%}#dsym-with-bitcode)
-   [Without Bitcode]({%- link _documentation/clients/cocoa/dsym.md -%}#dsym-without-bitcode)
<!-- ENDWIZARD -->

## Testing a Crash

If you would like to test the crash reporting you will need to cause a crash. While the seemingly obvious method would be to make it crash on launch, this will not give the Sentry client a chance to actually submit the crash report. Instead, we recommend triggering a crash from a button tap.

You can use the following methods to cause a crash:

-   Swift:

    ```swift
    Client.shared?.crash()
    ```
-   Objective-C:

    ```objc
    [SentryClient.sharedClient crash];
    ```

_Note that if you crash with a debugger attached nothing will happen._

Crashes are only submitted upon re-launching the application. To see the crash in Sentry, close the app and launch it again from the springboard.

## Deep Dive

-   [Migration Guide]({%- link _documentation/clients/cocoa/migration.md -%})
    -   [Upgrade from 2.x.x to 3.0.x]({%- link _documentation/clients/cocoa/migration.md -%}#upgrade-from-2-x-x-to-3-0-x)
-   [Uploading Debug Symbols]({%- link _documentation/clients/cocoa/dsym.md -%})
    -   [With Bitcode]({%- link _documentation/clients/cocoa/dsym.md -%}#with-bitcode)
    -   [Without Bitcode]({%- link _documentation/clients/cocoa/dsym.md -%}#without-bitcode)
-   [Advanced Usage]({%- link _documentation/clients/cocoa/advanced.md -%})
    -   [Capturing uncaught exceptions on macOS]({%- link _documentation/clients/cocoa/advanced.md -%}#capturing-uncaught-exceptions-on-macos)
    -   [Sending Events]({%- link _documentation/clients/cocoa/advanced.md -%}#sending-events)
    -   [Client Information]({%- link _documentation/clients/cocoa/advanced.md -%}#client-information)
    -   [User Feedback]({%- link _documentation/clients/cocoa/advanced.md -%}#user-feedback)
    -   [Breadcrumbs]({%- link _documentation/clients/cocoa/advanced.md -%}#breadcrumbs)
    -   [Change event before sending it]({%- link _documentation/clients/cocoa/advanced.md -%}#change-event-before-sending-it)
    -   [Change request before sending it]({%- link _documentation/clients/cocoa/advanced.md -%}#change-request-before-sending-it)
    -   [Adding stacktrace to message]({%- link _documentation/clients/cocoa/advanced.md -%}#adding-stacktrace-to-message)
    -   [Event Sampling]({%- link _documentation/clients/cocoa/advanced.md -%}#event-sampling)
