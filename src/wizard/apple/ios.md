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

## Install

We recommend installing the SDK with Swift Package Manager (SPM), but we also support [alternate installation methods](/platforms/apple/install/). To integrate Sentry into your Xcode project using SPM, open your App in Xcode and open **File > Add Packages**. Then add the SDK by entering the Git repo url in the top right search field:

```text
https://github.com/getsentry/sentry-cocoa.git
```

Alternatively, when your project uses a `Package.swift` file to manage dependencies, you can specify the target with:

```swift {tabTitle:Swift}
.package(url: "https://github.com/getsentry/sentry-cocoa", from: "{{@inject packages.version('sentry.cocoa') }}"),
```

## Configure

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

## Verify

This snippet contains an intentional error you can use to test that errors are uploaded to Sentry correctly. You can add it to your main `ViewController`.

```swift
let button = UIButton(type: .roundedRect)
button.frame = CGRect(x: 20, y: 50, width: 100, height: 30)
button.setTitle("Break the world", for: [])
button.addTarget(self, action: #selector(self.breakTheWorld(_:)), for: .touchUpInside)
view.addSubview(button)

@IBAction func breakTheWorld(_ sender: AnyObject) {
    fatalError("Break the world")
}
```

### Experimental Features

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

---

## Next Steps

- [CocoaPods/Carthage](/platforms/apple/install/): Learn about integrating Sentry into your project using CocoaPods or Carthage.
- [Debug Symbols](/platforms/apple/dsym/): Symbolicate and get readable stacktraces in your Sentry errors.
- [SwiftUI](/platforms/apple/performance/instrumentation/swiftui-instrumentation/): Learn about our first class integration with SwiftUI.
- [Profiling](/platforms/apple/profiling/): Collect and analyze performance profiles from real user devices in production.
