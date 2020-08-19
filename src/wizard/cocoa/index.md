---
name: Swift
doc_link: https://docs.sentry.io/platforms/cocoa/
support_level: production
type: language
---

This is the documentation for our Cocoa SDK (Swift and Objective-C).
If you are migrating from an older version, please consider our [Migration Guide](https://github.com/getsentry/sentry-cocoa/blob/master/MIGRATION.md). Also always make sure to follow the [changelog](https://github.com/getsentry/sentry-cocoa/blob/master/CHANGELOG.md)

## Installation {#install}

The SDK can be installed using [CocoaPods](http://cocoapods.org), [Carthage](https://github.com/Carthage/Carthage), or [Swift Package Manager](https://swift.org/package-manager/). This is the recommended SDK for both Swift and Objective-C projects.

Support for

- iOS >= 8.0
- tvOS >= 9.0
- macOS >= 10.10
- watchOS >= 2.0 with limited symbolication support and no hard crashes

### CocoaPods

We recommend installing the SDK with CocoaPods. To integrate Sentry into your Xcode project, specify it in your _Podfile_:

```ruby
platform :ios, '8.0'
use_frameworks! # This is important

target 'YourApp' do
    pod 'Sentry', :git => 'https://github.com/getsentry/sentry-cocoa.git', :tag => '5.2.0'
end
```

<!-- 5.2.0 -->

Afterwards run `pod install`.

### Carthage

To integrate Sentry into your Xcode project using Carthage, specify it in your _Cartfile_:

```ruby
github "getsentry/sentry-cocoa" "5.2.0"
```

Run `carthage update` to download the framework and drag the built _Sentry.framework_ into your Xcode project.

We also provide a pre-built version for every release which can be downloaded at [releases on GitHub](https://github.com/getsentry/sentry-cocoa/releases).

### Swift Package Manager

To integrate Sentry into your Xcode project using SPM, open your App in Xcode and open `File` -> `Swift Packages` -> `Add Package Dependency`. Then add the SDK by entering the git repo url `https://github.com/getsentry/sentry-cocoa.git`, and select a version (or branch) on the next page.

NOTE: Version tags or branches need to have the Package.swift file in it or Xcode won't be able to install the package.

## Configuration {#configure}

Make sure you initialize the SDK as soon as possible in your application lifecycle e.g. in your AppDelegate `application:didFinishLaunchingWithOptions` method:

```swift
import Sentry // Make sure you import Sentry

// ....

func application(_ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    // Added in 5.1.6
    SentrySDK.start { options in
        options.dsn = "___PUBLIC_DSN___"
        options.debug = true // Enabled debug when first installing is always helpful
    }

    // Or

    // Added in 5.0.0
    SentrySDK.start(options: [
        "dsn": "___PUBLIC_DSN___",
        "debug": true // Enabled debug when first installing is always helpful
    ])

    return true
}
```

## Debug Symbols {#sentry-cocoa-debug-symbols}

Before capturing crashes, you need to provide debug information to Sentry. Debug information is provided by uploading dSYM files using one of two methods, dependent on your setup:

- [With Bitcode](/platforms/cocoa/dsym/#dsym-with-bitcode)
- [Without Bitcode](/platforms/cocoa/dsym/#dsym-without-bitcode)
