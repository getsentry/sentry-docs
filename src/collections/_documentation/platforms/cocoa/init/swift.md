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