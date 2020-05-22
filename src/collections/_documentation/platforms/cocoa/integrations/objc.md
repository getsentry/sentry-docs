```objc
NSMutableArray *integrations = [SentryOptions defaultIntegrations].mutableCopy;
[integrations removeObject:@"SentryAutoBreadcrumbTrackingIntegration"];
[SentrySDK startWithOptions:@{
    // ...
    @"integrations": integrations
    // ...
}];
```