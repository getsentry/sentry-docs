---
title: 'Migration Guide'
robots: noindex
---

## Upgrade from 2.x.x to 3.x.x {#upgrade-from-2-x-x-to-3-0-x}

-   CocoaPods Make sure to update your Podfile to include `:subspecs => ['Core', 'KSCrash']`

    ```ruby
    source 'https://github.com/CocoaPods/Specs.git'
    platform :ios, '8.0'
    use_frameworks!

    target 'YourApp' do
        pod 'Sentry', :git => 'https://github.com/getsentry/sentry-cocoa.git', :subspecs => ['Core', 'KSCrash'], :tag => '3.x.x'
    end
    ```
-   Carthage Make sure to remove KSCrash, we bundled KSCrash into Sentry in order to make it work.

    ```ruby
    github "getsentry/sentry-cocoa" "3"
    ```
-   Public API We changed a lot of the public API, please checkout [Advanced Usage](/clients/cocoa/advanced/#advanced) for more examples about that.

## Upgrade from 3.x.x to 4.x.x {#upgrade-from-3-x-x-to-4-x-x}

- We removed the external KSCrash dependency and migrated the code directly into our SDK.  
There shouldn't be any conflicts including KSCrash it's just not necessary anymore.
