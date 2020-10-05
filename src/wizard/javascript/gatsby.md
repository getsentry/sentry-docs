---
name: Gatsby
doc_link: https://docs.sentry.io/platforms/javascript/guides/gatsby/
support_level: production
type: framework
---

Add the Sentry SDK as a dependency using yarn or npm:

```bash
# Using yarn
yarn add @sentry/gatsby

# Using npm
npm install --save @sentry/gatsby
```

## Connecting the SDK to Sentry

Register the plugin in your Gatsby configuration file (typically `gatsby-config.js`).

```javascript
{
  // ...
  plugins: [
    {
      resolve: "@sentry/gatsby",
      options: {
        dsn: "___PUBLIC_DSN___",
        sampleRate: 0.7,
      },
    },
    // ...
  ];
}
```
