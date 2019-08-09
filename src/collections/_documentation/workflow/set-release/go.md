```go
sentry.Init(sentry.ClientOptions{
	Release: "{{ page.release_identifier }}",
})
```
