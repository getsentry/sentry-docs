---
name: Next.js
doc_link: https://docs.sentry.io/platforms/javascript/guides/nextjs/
support_level: production
type: framework
---

Add Sentry automatically to your app with the [Sentry wizard](https://docs.sentry.io/platforms/javascript/guides/nextjs/#install):

```bash
npx @sentry/wizard@latest -i nextjs
```

The Sentry wizard will automatically patch your application:

- create `sentry.client.config.js` and `sentry.server.config.js` with the default `Sentry.init`.
- create `next.config.js` with the default configuration.
- create `sentry.properties` with configuration for sentry-cli (which is used when automatically uploading source maps).

You can also [configure it manually](https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/).

Configure the Sentry initialization:

Install Sentry’s Next.js SDK using either `yarn` or `npm`:

```bash
yarn add @sentry/nextjs
# or
npm install --save @sentry/nextjs
```

```javascript
Sentry.init({
  dsn: '___PUBLIC_DSN___',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
```

The above configuration has automatic error tracking with source maps for both JavaScript and TypeScript. We recommend adjusting `tracesSampleRate` in production, see [Sampling](https://docs.sentry.io/platforms/javascript/configuration/sampling/).

Then create an intentional error, so you can test that everything is working from your development environment. For example, a button whose `onClick` handler throws an error:

```javascript
return <button onClick={() => methodDoesNotExist()}>Break the world</button>;
```

If you're new to Sentry, use the email alert to access your account and complete a product tour.

If you're an existing user and have disabled alerts, you won't receive this email.
