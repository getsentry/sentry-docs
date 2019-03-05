You should `init` the Sentry Browser SDK as soon as possible during your page load:

```javascript
if (Sentry) {
    Sentry.init({ dsn: '___PUBLIC_DSN___' });
}
```
