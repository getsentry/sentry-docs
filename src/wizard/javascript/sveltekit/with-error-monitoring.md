---
name: SvelteKit
doc_link: https://docs.sentry.io/platforms/javascript/guides/sveltekit/
support_level: production
type: framework
---

## Install

Configure your app automatically with the [Sentry wizard](https://docs.sentry.io/platforms/javascript/guides/sveltekit/#install).

```bash
npx @sentry/wizard -i sveltekit
```

## Configure

Sentry wizard will automatically patch your application to configure the Sentry SDK:

- Create or update `src/hooks.client.js` and `src/hooks.server.js` with the default `Sentry.init` call and SvelteKit hooks handlers.
- Update `vite.config.js` to add source maps upload and auto-instrumentation via Vite plugins.
- create `.sentryclirc` and `sentry.properties` files with configuration for sentry-cli (which is used when automatically uploading source maps).

Alternatively, you can also [set up the SDK manually](https://docs.sentry.io/platforms/javascript/guides/sveltekit/manual-setup/).

**Configure the Sentry SDK**:

To configure the Sentry SDK, edit the `Sentry.init` options in `hooks.(client|server).(js|ts)`:

```javascript
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
});
```

## Verify

This snippet contains an intentional error and can be used as a test to make sure that everything's working as expected.

```html
<!-- +page.svelte -->
<button type="button" on:click={unknownFunction}>Break the world</button>
```

---

## Next Steps

- [Source Maps](https://docs.sentry.io/platforms/javascript/guides/sveltekit/sourcemaps/): Learn how to enable readable stack traces in your Sentry errors.
- [Performance Monitoring](https://docs.sentry.io/platforms/javascript/guides/sveltekit/performance/): Track down transactions to connect the dots between 10-second page loads and poor-performing API calls or slow database queries.
- [Session Replay](https://docs.sentry.io/platforms/javascript/guides/sveltekit/session-replay/): Get to the root cause of an error or latency issue faster by seeing all the technical details related to that issue in one visual replay on your web application.
