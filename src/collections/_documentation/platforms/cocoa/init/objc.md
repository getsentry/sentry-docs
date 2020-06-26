```objc
@import Sentry;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [SentrySDK startWithConfigureOptions:^(SentryOptions *options) {
        options.dsn = @"___PUBLIC_DSN___";
        options.debug = @YES; // Enabled debug when first installing is always helpful
    }];
    return YES;
}
```