```swift
SentrySDK.configureScope { (scope) in
    scope.setEnvironment("debug")
    scope.setTag(value: "swift", key: "language")
    scope.setExtra(value: String(describing: self), key: "currentViewController")
}
```