```swift
import Sentry // Make sure you import Sentry

// ....

func application(_ application: UIApplication, 
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    SentrySDK.start(options: [
        "dsn": "___PUBLIC_DSN___",
        "debug": true // Enabled debug when first installing is always helpful
    ])
    return true
}
```