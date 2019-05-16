---
title: TypeScript
sidebar_order: 3
---

Please read [Source Maps docs]({%- link _documentation/platforms/node/sourcemaps.md -%}) first to learn how to configure Sentry SDK, upload artifacts to our servers, or use Webpack (if you’re willing to use _ts-loader_ for your TypeScript compilation).

## Sentry SDK and Source Maps with TypeScript

Using Sentry SDK and Source Maps with TypeScript, unfortunately, requires slightly more configuration.

There are two main reasons for this:

1.  TypeScript compiles and outputs all files separately
2.  SourceRoot is by default set to, well, source directory, which would require uploading artifacts from 2 separate directories and modification of source maps themselves

We can still make it work with two additional steps, so let’s do this.

### 1. Configuring TypeScript Compiler

The first one is configuring TypeScript compiler in a way, in which we’ll override _sourceRoot_ and merge original sources with corresponding maps. The former is not required, but it’ll help Sentry display correct file paths, e.g. _/lib/utils/helper.ts_ instead of a full one like _/Users/Sentry/Projects/TSExample/lib/utils/helper.ts_. You can skip this option if you’re fine with long names.

Assuming you already have a _tsconfig.json_ file similar to this:

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "allowJs": true,
    "moduleResolution": "node",
    "outDir": "dist"
  },
  "include": [
    "./src/**/*"
  ]
}
```

Create a new one called _tsconfig.production.json_ and paste the snippet below:

```json
{
  "extends": "./tsconfig",
  "compilerOptions": {
    "sourceMap": true,
    "inlineSources": true,
    "sourceRoot": "/"
  }
}
```

From now on, when you want to run the production build, which will then upload, you specify this specific config, e.g., _tsc -p tsconfig.production.json_. This will create necessary source maps and attach original sources to them instead of making us upload them and modify source paths in our maps by hand.

### 2. Changing Events Frames

The second step is changing events frames so that Sentry can link stack traces with correct source files.

This can be done using _dataCallback_, in a very similar manner as we do with a single entry point described in Source Maps docs, with one, significant difference. Instead of using _basename_, we have to somehow detect and pass the root directory of our project.

Unfortunately, Node is very fragile in that manner and doesn’t have a reliable way to do this. The easiest and the most reliable method we've found, is to store the ___dirname_ or _process.cwd()_ in the global variable and using it in other places of your app. This has to be done as **the first thing in your code** and from the entry point, otherwise, the path will be incorrect.

If you want, you can set this value by hand to something like _/var/www/html/some-app_ if you can get this from some external source or you know it won’t ever change.

This can also be achieved by creating a separate file called _root.js_ or similar that’ll be placed in the same place as your entry point and exporting obtained value instead of exporting it globally.

```javascript
// index.js

// This allows TypeScript to detect our global value
declare global {
  namespace NodeJS {
    interface Global {
      __rootdir__: string;
    }
  }
}

global.__rootdir__ = __dirname || process.cwd();
```

```javascript
import { RewriteFrames } from '@sentry/integrations';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new RewriteFrames({
    root: global.__rootdir__
  })]
});
```

This config should be enough to make everything work and use TypeScript with Node. And, still be able to digest all original sources by Sentry.
