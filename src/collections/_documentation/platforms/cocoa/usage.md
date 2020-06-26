---
title: 'Advanced Usage'
---

## Capturing uncaught exceptions on macOS

By default, MacOS applications do not crash whenever an uncaught exception occurs. To enable this with Sentry:

- Open the application's `Info.plist` file
- Search for `Principal class` (the entry is expected to be NSApplication)
- Replace `NSApplication` with `SentryCrashExceptionApplication`

## Dealing with Scopes

There are three different ways to interact with Scopes in the SDK. Either using [configureScope](#scope-configureScope), [passing a scope](#scope-pass) or using the [scope callback](#scope-callback). 

### configureScope {#scope-configureScope}

Using `SentrySDK:configureScope` lets you set context data globally, which will be attached to all future events.

{% include components/platform_content.html content_dir='configureScope' %}

### Passing a Scope Instance {#scope-pass}

Setting an instance of Scope is helpful when you want to completely control what should be attached to the event.
This is helpful in cases where you completly want to control what should be attache to the event.

{% include components/platform_content.html content_dir='pass-scope' %}

### Using Scope Callback {#scope-callback}

To maintain global state, but mutate context data for one capture call, use the Scope callback:

{% include components/platform_content.html content_dir='scope-callback' %}

## Integrations

The SDK enables all integrations by default. To disable any of them:

{% include components/platform_content.html content_dir='integrations' %}

#### SentryCrashIntegration

This integration is the core part of the SDK. It hooks into all signal and exception handlers to capture uncaught errors or crashes. This integration is also responsible for adding most of the device information to events. If it is disabled, you will not receive crash reports, nor will events contain much device data.

#### SentryAutoBreadcrumbTrackingIntegration

This integration will swizzle some methods to create breadcrumbs e.g.: for `UIApplicationDidReceiveMemoryWarningNotification`, `sendAction:to:from:forEvent:` (UI interactions) or `viewDidAppear:` those breadcrumbs will be attached to your events.
