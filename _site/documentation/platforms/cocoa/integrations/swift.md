```swift
SentrySDK.start(options: [
    //...
    "integrations": Sentry.Options.defaultIntegrations().filter { (name) -> Bool in
        return name != "SentryAutoBreadcrumbTrackingIntegration" // This will disable  SentryAutoBreadcrumbTrackingIntegration
    }
    //...
])
```