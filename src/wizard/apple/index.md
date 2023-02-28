---
name: Apple (Cocoa)
doc_link: https://docs.sentry.io/platforms/apple/
support_level: production
type: language
---

We recommend installing the SDK with CocoaPods, but we also support alternate [installation methods](/platforms/apple/install/). To integrate Sentry into your Xcode project, specify it in your _Podfile_:

```ruby
platform :ios, '11.0'
use_frameworks! # This is important

target 'YourApp' do
  pod 'Sentry', :git => 'https://github.com/getsentry/sentry-cocoa.git', :tag => '{{ packages.version('sentry.cocoa') }}'
end
```

Afterwards run `pod install`.

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

Before capturing crashes, you need to provide debug information to Sentry. Debug information is provided by [uploading dSYM files](/platforms/apple/dsym/).

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
