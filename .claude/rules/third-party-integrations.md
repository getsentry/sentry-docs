# Adding a Third-Party Integration

To add a new third-party integration to the consolidated list:

## Step 1 — Add to the integrations page

In `docs/organization/integrations/third-party-integrations/index.mdx`, add a new list item with the integration name, link, and slug in an MDX comment:

```mdx
- [Integration Name](https://link-to-docs) {/* slug */}
```

The slug is the URL-safe identifier used for the redirect (e.g. `glue-tools`, `vanta-gov`).

**The list must remain in alphabetical order by integration name.** Insert the new entry in the correct alphabetical position.

## Step 2 — Add a redirect

In `redirects.js`, add a new entry to `userDocsRedirects` redirecting the integration's slug to the consolidated page:

```js
{
  source: '/organization/integrations/<slug>/',
  destination: '/organization/integrations/third-party-integrations/',
},
```
