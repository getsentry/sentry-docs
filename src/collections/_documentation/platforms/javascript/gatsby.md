---
title: Gatsby
sidebar_order: 30
keywords: ["gatsby", "gatsbyjs"]
---
<!-- WIZARD -->
To use Sentry with your Gatsby application, you will need to use `@sentry/gatsby` (Sentry’s Gatsby SDK).

{% capture __alert_content -%}
`@sentry/gatsby` is a wrapper around the `@sentry/react` package, with added functionality related to Gatsby. All methods available in the `@sentry/react` package can also be imported from `@sentry/gatsby`.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

Add the Sentry SDK as a dependency using yarn or npm:

```bash
# Using yarn
$ yarn add @sentry/gatsby

# Using npm
$ npm install @sentry/gatsby
```

## Connecting the SDK to Sentry

You can register the plugin in your Gatsby configuration file (typically `gatsby-config.js`).

```js
{
  // ...
  plugins: [
    {
      resolve: "@sentry/gatsby",
      options: {
          dsn: ___PUBLIC_DSN___,
      }
    },
    // ...
  ]
}
```
<!-- ENDWIZARD -->

## Options

The options field in the plugin configuration is passed directly to `Sentry.init`. Check our configuration docs for a [full list of the avaliable options](/error-reporting/configuration/?platform=javascript).

For example, the configuration below adjusts the `sampleRate` and  `maxBreadcrumbs` options.

```js
{
  // ...
  plugins: [
    {
      resolve: "@sentry/gatsby",
      options: {
          dsn: ___PUBLIC_DSN___,
          maxBreadcrumbs: 80,
          sampleRate: 0.7,
      }
    },
    // ...
  ]
}
```

The Gatsby SDK will set certain options automatically based on environmental variables, but these can be overridden by setting custom options in the plugin configuration.

`environment` (string)

: Defaults to `process.env.NODE_ENV` or `development`

`release` (boolean)

: Defaults to certain environmental variables based on the platform

- GitHub Actions: `process.env.GITHUB_SHA`
- Netlify: `process.env.COMMIT_REF`
- Vercel: `process.env.VERCEL_GITHUB_COMMIT_SHA` or `process.env.VERCEL_GITLAB_COMMIT_SHA` or `process.env.VERCEL_BITBUCKET_COMMIT_SHA`
