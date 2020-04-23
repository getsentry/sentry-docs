```objc
NSMutableArray *integrations = [SentryOptions defaultIntegrations].mutableCopy;
[integrations removeObject:@"SentryUIKitMemoryWarningIntegration"];
[SentrySDK startWithOptions:@{
    // ...
    @"integrations": integrations
    // ...
}];
```