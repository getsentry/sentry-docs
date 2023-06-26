---
name: Apple (Cocoa)
doc_link: https://docs.sentry.io/platforms/apple/
support_level: production
type: language
---

We support installing the SDK with [CocoaPods](/platforms/apple/install/cocoapods/), [Swift Package Manager](/platforms/apple/install/swift-package-manager/), and [Carthage](/platforms/apple/install/carthage/).

### CocoaPods

To integrate Sentry into your Xcode project, specify it in your `Podfile`:

```ruby
platform :ios, '11.0'
use_frameworks! # This is important

target 'YourApp' do
  pod 'Sentry', :git => 'https://github.com/getsentry/sentry-cocoa.git', :tag => '{{@inject packages.version('sentry.cocoa') }}'
end
```

Afterwards run `pod install`. For more information visit the [docs](/platforms/apple/install/cocoapods/).

### Swift Package Manager

To integrate Sentry into your Xcode project using Swift Package Manager (SPM), open your App in Xcode and open **File > Add Packages**. Then add the SDK by entering the Git repo url in the top right search field:

```text
https://github.com/getsentry/sentry-cocoa.git
```

Alternatively, when your project uses a `Package.swift` file to manage dependencies, you can specify the target with:

```swift {tabTitle:Swift}
.package(url: "https://github.com/getsentry/sentry-cocoa", from: "{{@inject packages.version('sentry.cocoa') }}"),
```

For more information visit the [docs](/platforms/apple/install/swift-package-manager/).

### Carthage

To integrate Sentry into your Xcode project using Carthage, specify it in your `Cartfile`:

```ruby
github "getsentry/sentry-cocoa" "{{@inject packages.version('sentry.cocoa') }}"
```

Run `carthage update` to download the framework and drag the built `Sentry.framework` into your Xcode project. For more information visit the [docs](/platforms/apple/install/carthage/).

## Configuration

Make sure you initialize the SDK as soon as possible in your application lifecycle e.g. in your AppDelegate `application:didFinishLaunchingWithOptions` method:

```swift {tabTitle:Swift}
import Sentry

// ....

func application(_ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    SentrySDK.start { options in
        options.dsn = "___PUBLIC_DSN___"
        options.debug = true // Enabled debug when first installing is always helpful

        // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
        // We recommend adjusting this value in production.
        options.tracesSampleRate = 1.0
    }

    return true
}
```

When using SwiftUI and your app doesn't implement an app delegate, initialize the SDK within the [App conformer's initializer](<https://developer.apple.com/documentation/swiftui/app/main()>):

```swift
import Sentry

@main
struct SwiftUIApp: App {
    init() {
        SentrySDK.start { options in
            options.dsn = "___PUBLIC_DSN___"
            options.debug = true // Enabled debug when first installing is always helpful

            // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
            // We recommend adjusting this value in production.
            options.tracesSampleRate = 1.0
        }
    }
}
```

## Debug Symbols

To capture crashes, you need to provide debug information to Sentry. You can also use our source context feature to display code snippets next to the event stack traces by enabling the `include-sources` option when uploading your debug information files. Debug information is provided by [uploading dSYM files](/platforms/apple/dsym/).

## Performance Monitoring

After [setting up performance monitoring](/platforms/apple/guides/ios/performance), the Cocoa SDK [automatically instruments](/platforms/apple/performance/instrumentation/automatic-instrumentation/) UIViewControllers, HTTP requests, app start, and slow and frozen frames.

You can manually measure the performance of your code by capturing transactions and spans.

```swift {tabTitle:Swift}
import Sentry // Make sure you import Sentry

// Transaction can be started by providing, at minimum, the name and the operation
let transaction = SentrySDK.startTransaction(name: "Update Repos", operation: "db")
// Transactions can have child spans (and those spans can have child spans as well)
let span = transaction.startChild(operation: "db", description: "Update first repo")

// ...
// (Perform the operation represented by the span/transaction)
// ...

span.finish() // Mark the span as finished
transaction.finish() // Mark the transaction as finished and send it to Sentry
```

Check out [the documentation](https://docs.sentry.io/platforms/apple/performance/instrumentation/) to learn more about the API and automatic instrumentations.

> Want to play with some new features? Try out our experimental features for [View Hierarchy](/platforms/apple/guides/ios/enriching-events/viewhierarchy/), [Time to Full Display (TTFD)](/platforms/apple/guides/ios/performance/instrumentation/automatic-instrumentation/#time-to-full-display), [MetricKit](/platforms/apple/guides/watchos/configuration/metric-kit/), [Prewarmed App Start Tracing](https://docs.sentry.io/platforms/apple/performance/instrumentation/automatic-instrumentation/#prewarmed-app-start-tracing), and [Swift Async Stacktraces](/platforms/apple/guides/ios/#stitch-together-swift-concurrency-stack-traces). Experimental features are still a work-in-progress and may have bugs. We recognize the irony.
>
> Let us know if you have feedback through [GitHub issues](https://github.com/getsentry/sentry-cocoa/issues).

```swift {tabTitle:Swift}
import Sentry

SentrySDK.start { options in
    // ...

    // Enable all experimental features
    options.attachViewHierarchy = true
    options.enablePreWarmedAppStartTracing = true
    options.enableMetricKit = true
    options.enableTimeToFullDisplayTracing = true
    options.swiftAsyncStacktraces = true
}
```

## Performance Monitoring for SwiftUI

If you want to find out the performance of your Views in a SwiftUI project, [try the SentrySwiftUI library](/platforms/apple/performance/instrumentation/swiftui-instrumentation).
