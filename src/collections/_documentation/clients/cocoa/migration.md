---
title: 'Migration Guide'
---

## Upgrade from 2.x.x to 3.0.x {#upgrade-from-2-x-x-to-3-0-x}

-   CocoaPods Make sure to update your Podfile to include `:subspecs => ['Core', 'KSCrash']`

    ```ruby
    source 'https://github.com/CocoaPods/Specs.git'
    platform :ios, '8.0'
    use_frameworks!

    target 'YourApp' do
        pod 'Sentry', :git => 'https://github.com/getsentry/sentry-cocoa.git', :subspecs => ['Core', 'KSCrash'], :tag => '4.1.0'
    end
    ```
-   Carthage Make sure to remove KSCrash, we bundled KSCrash into Sentry in order to make it work.

    ```ruby
    github "getsentry/sentry-cocoa" "4.1.0"
    ```
-   Public API We changed alot of the public API, please checkout [Advanced Usage]({%- link _documentation/clients/cocoa/advanced.md -%}#advanced) for more examples about that.
