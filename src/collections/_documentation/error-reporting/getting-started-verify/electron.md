What better way to send your first event than to break your application!

One way to do it is to call an undefined function:

```js
myUndefinedFunction();
```

You may want to try inserting this into both your `main` and any `renderer`
processes to verify Sentry is operational in both.
