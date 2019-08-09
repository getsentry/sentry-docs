One way to break your Electron application is to call an undefined function:

```js
myUndefinedFunction();
```

You may want to try inserting this into both your `main` and any `renderer`
processes to verify Sentry is operational in both.
