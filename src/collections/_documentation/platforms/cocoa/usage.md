---
title: 'Advanced Usage'
---

## Capturing uncaught exceptions on macOS

By default macOS application do not crash whenever an uncaught exception occurs. There are some additional steps you have to take to make this work with Sentry. You have to open the applications `Info.plist` file and look for `Principal class`. The content of it which should be `NSApplication` should be replaced with `SentryCrashExceptionApplication`.

