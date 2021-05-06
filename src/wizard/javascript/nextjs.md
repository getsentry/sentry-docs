---
name: Next.js
doc_link: https://docs.sentry.io/platforms/javascript/guides/nextjs/
support_level: production
type: framework
---

To use Sentry with your Next.js application, you need to use `@sentry/nextjs` (Sentry’s Next.js SDK):

```bash
yarn add @sentry/nextjs
# or
npm install --save @sentry/nextjs
```

To [configure your app automatically](https://docs.sentry.io/platforms/javascript/guides/nextjs/#configure) (although you can also [configure it manually](https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/)), you can run the sentry-wizard:

```bash
npx @sentry/wizard -i nextjs
```

It will automatically patch your application:

- create `sentry.client.config.js` and `sentry.server.config.js` with the default `Sentry.init`.
- create `next.config.js` with the default configuration.
- create `sentry.properties` with configuration for sentry-cli (which is used when automatically uploading source maps).

Lastly, to capture [Next.js API route errors](https://nextjs.org/docs/api-routes/introduction), you need to wrap your handlers with a Sentry function:

```javascript
import { withSentry } from '@sentry/nextjs';

const handler = async (req, res) => {
  // ...
}

export default withSentry(handler);
```

The above configuration has automatic error tracking with source maps for both JavaScript and TypeScript. To reduce the volume of performance data captured, change `tracesSampleRate` to a value between 0 and 1.

After this step, Sentry will report uncaught exceptions triggered by your Next.js application.

You can trigger your first event from your development environment by raising an exception somewhere within your application. For example, a button whose `onClick` handler throws an error:

```jsx
<button type="button" onClick={() => {
    throw new Error("Sentry Frontend Error");
}}>
    Throw error
</button>
```

Once the library is correctly initialized and an event sent, consider visiting our [complete Next.js docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/).
