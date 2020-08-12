```objc
@import Sentry;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    // Added in 5.1.6
    [SentrySDK startWithConfigureOptions:^(SentryOptions *options) {
        options.dsn = @"___PUBLIC_DSN___";
        options.debug = @YES; // Enabled debug when first installing is always helpful
    }];
    
    // Or
    
    // Added in 5.0.0
    [SentrySDK startWithOptions:@{
        @"dsn": @"___PUBLIC_DSN___",
        @"debug": @(YES) // Enabled debug when first installing is always helpful
    }];
    
    return YES;
}
```