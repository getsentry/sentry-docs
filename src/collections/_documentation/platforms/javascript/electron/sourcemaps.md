---
title: 'Source Maps'
sidebar_order: 3
---

To find out why Sentry needs your source maps and how to provide them visit: [Source Maps]({%- link _documentation/platforms/javascript/sourcemaps/index.md -%}) 

## Native Application

To allow Sentry to match source code references to uploaded source maps or source files, make sure your tool outputs files relative to your project root folder and prefixes them either with `/` or with `~/`. Some tools do this automatically (e.g. Webpack), or have a configuration option (e.g. TypeScript). For others, please see the section on rewriting source maps before uploading.

The SDK will rewrite stack traces before sending them to Sentry. If your application generates manual stack traces for some reason, make sure stack frames always contain relative paths from the project root starting with `~/` or `app:///`.
