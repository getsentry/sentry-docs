<!-- WIZARD -->

You will need to install `ember-cli-cjs-transform` with `ember install ember-cli-cjs-transform`.

Add this to your `ember-cli-build.js` file:

```javascript
app.import('node_modules/@sentry/browser/dist/index.js', {
  using: [
    { transformation: 'cjs', as: '@sentry/browser' }
  ]
});
```

Then add this to your `app.js`:

```javascript
import * as Sentry from '@sentry/browser'

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new Sentry.Integrations.Ember()]
});
```
<!-- ENDWIZARD -->
