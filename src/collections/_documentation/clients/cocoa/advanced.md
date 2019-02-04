---
title: 'Advanced Usage'
---

## Capturing uncaught exceptions on macOS

By default macOS application do not crash whenever an uncaught exception occurs. There are some additional steps you have to take to make this work with Sentry. You have to open the applications `Info.plist` file and look for `Principal class`. The content of it which should be `NSApplication` should be replaced with `SentryCrashExceptionApplication`.

## Sending Events

Sending a basic event can be done with _send_.

```swift
let event = Event(level: .debug)
event.message = "Test Message"
Client.shared?.send(event: event) { (error) in
    // Optional callback after event has been sent
}
```

If more detailed information is required, _Event_ has many more properties to be filled.

```swift
let event = Event(level: .debug)
event.message = "Test Message"
event.environment = "staging"
event.extra = ["ios": true]
Client.shared?.send(event: event)
```

## Client Information

A user, tags, and extra information can be stored on a _Client_. This information will be sent with every event. They can be used like...

```swift
let user = User(userId: "1234")
user.email = "hello@sentry.io"
user.extra = ["is_admin": true]

Client.shared?.user = user
Client.shared?.tags = ["iphone": "true"]
Client.shared?.extra = [
    "my_key": 1,
    "some_other_value": "foo bar"
]
```

All of the above (_user_, _tags_, and _extra_) can be set at anytime. Call `Client.shared?.clearContext()` to clear all set variables.

## User Feedback {#cocoa-user-feedback}

The _User Feedback_ feature has been removed as of version `3.0.0`. But if you want to show you own Controller or handle stuff after a crash you can use our [Change event before sending it](#before-serialize-event) callback. We are now also sending a notification whenever an event has been sent. The name of the notification is `Sentry/eventSentSuccessfully` and it contains the serialized event as `userInfo`. Additionally the Client has a new property `Client.shared?.lastEvent` which always contains the most recent event.

## Breadcrumbs

Breadcrumbs are used as a way to trace how an error occurred. They will queue up in a`Client` and will be sent with every event.

```swift
Client.shared?.breadcrumbs.add(Breadcrumb(level: .info, category: "test"))
```

The client will queue up a maximum of 50 breadcrumbs by default. To change the maximum amount of breadcrumbs call:

```swift
Client.shared?.breadcrumbs.maxBreadcrumbs = 100
```

With version _1.1.0_ we added another iOS only feature which tracks breadcrumbs automatically by calling:

```swift
Client.shared?.enableAutomaticBreadcrumbTracking()
```

If called this will track every action sent from a Storyboard and every _viewDidAppear_ from an _UIViewController_. We use method swizzling for this feature, so in case your app also overwrites one of these methods be sure to check out our implementation in our repo. Additionally we also add a breadcrumb in case we receive a Memory Pressure Event from the Application.

## Memory Pressure

By calling this function: 

```swift
Client.shared?.trackMemoryPressureAsEvent()
```

In case your application receives a memory pressure notification, we will store an event to disk, on the next app start or successful sent, we will send this event to the server.

## Change event before sending it {#before-serialize-event}

With version _1.3.0_ we added the possibility to change an event before it will be sent to the server. You have to set the block somewhere in you code.

```swift
Client.shared?.beforeSerializeEvent = { event in
    event.extra = ["b": "c"]
}
```

This block is meant to be used for stripping sensitive data or add additional data for every event.

## Change request before sending it

You can change the _NSURLRequest_ before it will be send. This is helpful e.g.: for adding additional headers to the request.

```swift
Client.shared?.beforeSendRequest = { request in
    request.addValue("my-token", forHTTPHeaderField: "Authorization")
}
```

## Adding stack trace to message

You can also add a Stacktrace to your event by using the _snapshotStacktrace_ callback and calling _appendStacktrace_ and pass the event.

_snapshotStacktrace_ captures the stack trace at the location where it’s called. After that you have to append the stack trace to the event you want to send with _appendStacktrace_. So for example if you want to send a simple message to the server and add the stack trace to it you have to do this.

```swift
Client.shared?.snapshotStacktrace {
    let event = Event(level: .debug)
    event.message = "Test Message"
    Client.shared?.appendStacktrace(to: event)
    Client.shared?.send(event: event)
}
```

## Event Sampling

If you are sending to many events and want to not send all events you can set the `sampleRate` parameter. It’s a number between 0 and 1 where when you set it to 1, all events will be sent. Notice that `shouldSendEvent` will set for this.

```swift
Client.shared?.sampleRate = 0.75 // 75% of all events will be sent
```
