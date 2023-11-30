---
name: SvelteKit
doc_link: https://docs.sentry.io/platforms/javascript/guides/sveltekit/
support_level: production
type: framework
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

Configure your app automatically with the [Sentry wizard](https://docs.sentry.io/platforms/javascript/guides/sveltekit/#install).

```bash
npx @sentry/wizard@latest -i sveltekit
```

The Sentry wizard will automatically patch your application:

- Create or update `src/hooks.client.js` and `src/hooks.server.js` with the default `Sentry.init` call and Sentry's hooks handlers.
- Update `vite.config.js` to add source maps upload and auto-instrumentation via Vite plugins.
- create `.sentryclirc` and `sentry.properties` files with configuration for sentry-cli (which is used when automatically uploading source maps).

You can also [configure the Sentry SDK manually](https://docs.sentry.io/platforms/javascript/guides/sveltekit/manual-setup/).

Configure the Sentry SDK:

To configure the Sentry SDK, edit the `Sentry.init` options in `hooks.(client|server).(js|ts)`:

```javascript
import * as Sentry from "@sentry/sveltekit";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
```

The above configuration captures both error and performance data. We recommend adjusting `tracesSampleRate` in production, see [Sampling](https://docs.sentry.io/platforms/javascript/configuration/sampling/).

After this step, Sentry will report any uncaught exceptions triggered by your application.

You can trigger your first event from your development environment by raising an exception somewhere within your application. An example of this would be rendering a button whose `on:click` handler attempts to invoke a function that doesn't exist:

```svelte
<!-- +page.svelte -->
<button type="button" on:click={unknownFunction}>Break the world</button>
```

Once you've verified the SDK is initialized properly and you've sent a test event, check out our [complete SvelteKit docs](https://docs.sentry.io/platforms/javascript/guides/sveltekit/) for additional configuration instructions.
