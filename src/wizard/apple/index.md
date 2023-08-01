---
name: Apple (Cocoa)
doc_link: https://docs.sentry.io/platforms/apple/
support_level: production
type: language
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

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

To integrate Sentry into your Xcode project using Swift Package Manager (SPM), open your App in Xcode and open **File > Add Packages**. Then add the SDK by entering the git repo url in the top right search field:

```text
https://github.com/getsentry/sentry-cocoa.git
```

Alternatively, when your project uses a `Package.swift` file to manage dependencies, you can specify the target with:

```swift {tabTitle:Swift}
.package(url: "https://github.com/getsentry/sentry-cocoa", from: "{{@inject packages.version('sentry.cocoa') }}"),
```

For more information visit the [docs](/platforms/apple/install/swift-package-manager/).

### Carthage

To integrate Sentry into your Xcode project using Carthage, specify it in your _Cartfile_:

```ruby
github "getsentry/sentry-cocoa" "{{@inject packages.version('sentry.cocoa') }}"
```

Run `carthage update` to download the framework and drag the built _Sentry.framework_ into your Xcode project. For more information visit the [docs](/platforms/apple/install/carthage/).

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

        // This will capture 100% of transactions for performance monitoring.
        // If you want to control the percentage of captured events, we recommend using `options.tracesSampleRate`.
        options.enableTracing = true
    }

    return true
}
```

## Debug Symbols

To capture crashes, you need to provide debug information to Sentry. You can also use our source context feature to display code snippets next to the event stack traces by enabling the `include-sources` option when uploading your debug information files. Debug information is provided by [uploading dSYM files](/platforms/apple/dsym/).

## Performance Monitoring

You can measure the performance of your code by capturing transactions and spans.

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
