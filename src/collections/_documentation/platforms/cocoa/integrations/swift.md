```swift
_ = SentrySDK(options: [
    //...
    "integrations": Sentry.Options.defaultIntegrations().filter { (name) -> Bool in
        return name != "SentryUIKitMemoryWarningIntegration" // This will disable  SentryUIKitMemoryWarningIntegration
    }
    //...
])
```