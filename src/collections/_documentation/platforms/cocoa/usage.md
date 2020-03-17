---
title: 'Advanced Usage'
---

## Capturing uncaught exceptions on macOS

By default macOS application do not crash whenever an uncaught exception occurs. There are some additional steps you have to take to make this work with Sentry. You have to open the applications `Info.plist` file and look for `Principal class`. The content of it which should be `NSApplication` should be replaced with `SentryCrashExceptionApplication`.

## Dealing with Scopes

There are four different ways to interact with Scopes in the SDK.

### configureScope

Using `SentrySDK:configureScope` lets you set context data globally, this will be attached to all future events.

{% include components/platform_content.html content_dir='configureScope' %}

### Passing a Scope Instance

By passing an instance of a Scope directly, it will not merge with the current global Scope. 
This is helpful in cases where you completly want to control what should be attache to the event.

{% include components/platform_content.html content_dir='pass-scope' %}

### Using Scope Callback

In cases where you might want to keep the global state but want to mutate context data just for one capture call, you might want to consider using the Scope callack:

{% include components/platform_content.html content_dir='scope-callback' %}

## Integrations

The SDK comes with a few default integrations. All of them are enabled by default, if you decide to disable any of them you can do it like this:

{% include components/platform_content.html content_dir='integrations' %}

#### SentryCrashIntegration

This integration is the core part of the SDK. It hooks into all signal and exception handlers to capture uncaught errors or crashes. This integration is also responsible for adding most of the device information to the events so beware of when disabling this, you will not get crash reports nor will your events contain a lot of device data.

#### SentryUIKitMemoryWarningIntegration

This integration will only do something in app where UIKit is available (everywhere else it's noop). It will send an event to Sentry when `UIApplicationDidReceiveMemoryWarningNotification` is received.

#### SentryAutoBreadcrumbTrackingIntegration

This integration will swizzle some methods to create breadcrumbs e.g.: for `UIApplicationDidReceiveMemoryWarningNotification`, `sendAction:to:from:forEvent:` (UI interactions) or `viewDidAppear:` those breadcrumbs will be attached to your events.



