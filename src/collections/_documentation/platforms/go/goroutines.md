---
title: Goroutines
sidebar_order: 5
---

A goroutine is a lightweight thread managed by the Go runtime. Goroutines can run concurrently, and because of this, every goroutine has to keep track of its own Sentry-related data locally. Otherwise, there is a chance that you will override your data stored in the Scope. More on this in [Scopes and Hubs](/enriching-error-data/scopes/?platform={{ include.platform }}) section.

The easiest way to handle this, is to create a new `Hub` for every goroutine you start, however this would require you to rebind the current `Client` and handle `Scope` yourself. That is why we provide a helper method called `Clone`. It takes care of creating a `Hub`, cloning existing `Scope` and reassigning it alongside `Client` to newly create instance.

Once cloned, `Hub` is completly isolated and can be used safely inside concurrent call. However, instead of using globally exposed methods, they should be called directly on the `Hub`.

Here are two examples: 
- a recommended deterministic call on `Hub` that is safe

```go
// Example of __CORRECT__ use of scopes inside a Goroutine

go func(localHub *sentry.Hub) {
	// as goroutine argument
	localHub.ConfigureScope(func(scope *sentry.Scope) {
		scope.SetTag("secretTag", "go#1")
	})
	localHub.CaptureMessage("Hello from Goroutine! #1")
}(sentry.CurrentHub().Clone())

go func() {
	// or created locally
	localHub := sentry.CurrentHub().Clone()
	localHub.ConfigureScope(func(scope *sentry.Scope) {
		scope.SetTag("secretTag", "go#2")
	})
	localHub.CaptureMessage("Hello from Goroutine! #2")
}()
```

- a discouraged non-deterministic call on `Hub` that would leak information between threads

```go
// Example of __INCORRECT__ use of scopes inside a Goroutine - DON'T USE IT!

go func() {
	sentry.ConfigureScope(func(scope *sentry.Scope) {
		scope.SetTag("secretTag", "go#1")
	})
	sentry.CaptureMessage("Hello from Goroutine! #1")
}()

go func() {
	sentry.ConfigureScope(func(scope *sentry.Scope) {
		scope.SetTag("secretTag", "go#2")
	})
	sentry.CaptureMessage("Hello from Goroutine! #2")
}()

// at this point both events can have either `go#1` tag or `go#2` tag. We'll never know.
```
