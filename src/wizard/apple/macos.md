---
name: macOS
doc_link: https://docs.sentry.io/platforms/apple/guides/macos/
support_level: production
type: language
---

We recommend installing the SDK with CocoaPods. To integrate Sentry into your Xcode project, specify it in your _Podfile_:

```ruby
platform :macos, '10.10'
use_frameworks! # This is important

target 'YourApp' do
  pod 'Sentry', :git => 'https://github.com/getsentry/sentry-cocoa.git', :tag => '{{ packages.version('sentry.cocoa') }}'
end
```

Afterwards run `pod install`.

For other installation methods, please see our [documentation](/platforms/apple/install/).

## Configuration

Make sure you initialize the SDK as soon as possible in your application lifecycle e.g. in your AppDelegate `application:didFinishLaunchingWithOptions` method:

```swift
import Sentry // Make sure you import Sentry

// ....

func application(_ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    SentrySDK.start { options in
        options.dsn = "___PUBLIC_DSN___"
        options.debug = true // Enabled debug when first installing is always helpful
    }

    return true
}
```

## Debug Symbols

Before capturing crashes, you need to provide debug information to Sentry. Debug information is provided by uploading dSYM files using one of two methods, dependent on your setup:

- [With Bitcode](/platforms/apple/dsym/#dsym-with-bitcode)
- [Without Bitcode](/platforms/apple/dsym/#dsym-without-bitcode)
