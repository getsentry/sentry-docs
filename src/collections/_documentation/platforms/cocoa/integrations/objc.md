```objc
NSMutableArray *integrations = [SentryOptions defaultIntegrations].mutableCopy;
[integrations removeObject:@"SentryUIKitMemoryWarningIntegration"];
[SentrySDK initWithOptions:@{
    // ...
    @"integrations": integrations
    // ...
}];
```