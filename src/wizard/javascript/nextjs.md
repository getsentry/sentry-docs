---
name: Next.js
doc_link: https://docs.sentry.io/platforms/javascript/guides/nextjs/
support_level: production
type: framework
---

Install Sentry’s Next.js SDK using either `yarn` or `npm`:

```bash
yarn add @sentry/nextjs
# or
npm install --save @sentry/nextjs
```

Configure your app automatically with [Sentry wizard](https://docs.sentry.io/platforms/javascript/guides/nextjs/#configure).

```bash
npx @sentry/wizard -i nextjs
```

Sentry wizard will automatically patch your application:
- create `sentry.client.config.js` and `sentry.server.config.js` with the default `Sentry.init`.
- create `next.config.js` with the default configuration.
- create `sentry.properties` with configuration for sentry-cli (which is used when automatically uploading source maps).


You can also [configure it manually](https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/).


## Nextjs API routes
While `@sentry/nextjs` will enable Sentry for your nextjs application, files under the `pages/api` require one additional installing step.

Wrap your API handlers with a `withSentry` function to capture [Next.js API route errors](https://nextjs.org/docs/api-routes/introduction): 

```javascript
import { withSentry } from '@sentry/nextjs';

const handler = async (req, res) => {
  // ...
}

export default withSentry(handler);
```

Configure the Sentry initialization:

```javascript
Sentry.init({
  dsn: "___PUBLIC_DSN___",
  
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
```

The above configuration has automatic error tracking with source maps for both JavaScript and TypeScript. We recommend adjusting `tracesSampleRate` in production, see [Sampling](https://docs.sentry.io/platforms/javascript/configuration/sampling/).

Then create an intentional error, so you can test that everything is working from your development environment. For example, a button whose `onClick` handler throws an error:

```javascript
<button type="button" onClick={() => {
    throw new Error("Sentry Frontend Error");
}}>
    Throw error
</button>
```

If you're new to Sentry, use the email alert to access your account and complete a product tour.

If you're an existing user and have disabled alerts, you won't receive this email.
