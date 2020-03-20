```objc
@import Sentry;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [SentrySDK initWithOptions:@{
        @"dsn": @"___PUBLIC_DSN___",
        @"debug": @(YES)
    }];
    return YES;
}
```