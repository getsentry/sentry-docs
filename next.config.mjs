import createMDX from '@next/mdx';
import {withSentryConfig} from '@sentry/nextjs';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePresetMinify from 'rehype-preset-minify';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkPrism from 'remark-prism';

import {remarkCodeTabs} from './src/remark-code-tabs.mjs';
import {remarkCodeTitles} from './src/remark-code-title.mjs';
import {remarkExtractFrontmatter} from './src/remark-extract-frontmatter.mjs';

/** @type {import('next').NextConfig} */
let nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  trailingSlash: true,

  experimental: {
    mdxRs: false,
    serverComponentsExternalPackages: ['rehype-preset-minify'],
  },
  redirects() {
    return [
      {
        source: '/platforms/unity/data-management/event-grouping/sdk-fingerprinting/',
        destination: '/platforms/unity/usage/sdk-fingerprinting/',
        permanent: true,
      },
      {
        source: '/platforms/unity/native-support/building-ios/',
        destination: '/platforms/unity/native-support/',
        permanent: true,
      },
      {
        source: '/platforms/unity/unity-lite/',
        destination: '/platforms/unity/migration/',
        permanent: true,
      },
      {
        source: '/platforms/go/config/',
        destination: '/platforms/go/configuration/options/',
        permanent: true,
      },
      {
        source: '/platforms/go/goroutines/',
        destination: '/platforms/go/usage/concurrency/',
        permanent: true,
      },
      {
        source: '/platforms/go/concurrency/',
        destination: '/platforms/go/usage/concurrency/',
        permanent: true,
      },
      {
        source: '/platforms/go/panics/',
        destination: '/platforms/go/usage/panics/',
        permanent: true,
      },
      {
        source: '/platforms/go/serverless/',
        destination: '/platforms/go/usage/serverless/',
        permanent: true,
      },
      {
        source: '/platforms/go/martini/',
        destination: '/platforms/go/guides/martini/',
        permanent: true,
      },
      {
        source: '/platforms/go/fasthttp/',
        destination: '/platforms/go/guides/fasthttp/',
        permanent: true,
      },
      {
        source: '/platforms/go/echo/',
        destination: '/platforms/go/guides/echo/',
        permanent: true,
      },
      {
        source: '/platforms/go/iris/',
        destination: '/platforms/go/guides/iris/',
        permanent: true,
      },
      {
        source: '/platforms/go/negroni/',
        destination: '/platforms/go/guides/negroni/',
        permanent: true,
      },
      {
        source: '/clients/go/integrations/http/',
        destination: '/platforms/go/guides/http/',
        permanent: true,
      },
      {
        source: '/platforms/go/http/',
        destination: '/platforms/go/guides/http/',
        permanent: true,
      },
      {
        source: '/platforms/go/gin/',
        destination: '/platforms/go/guides/gin/',
        permanent: true,
      },
      {
        source: '/clients/go/config/',
        destination: '/platforms/go/legacy-sdk/config/',
        permanent: true,
      },
      {
        source: '/clients/go/index/',
        destination: '/platforms/go/legacy-sdk/',
        permanent: true,
      },
      {
        source: '/clients/go/integrations/',
        destination: '/platforms/go/legacy-sdk/integrations/',
        permanent: true,
      },
      {
        source: '/clients/go/usage/',
        destination: '/platforms/go/legacy-sdk/usage/',
        permanent: true,
      },
      {
        source: '/clients/go/context/',
        destination: '/platforms/go/legacy-sdk/context/',
        permanent: true,
      },
      {
        source: '/platforms/qt/',
        destination: '/platforms/native/guides/qt/',
        permanent: true,
      },
      {
        source: '/platforms/native/qt/',
        destination: '/platforms/native/guides/qt/',
        permanent: true,
      },
      {
        source: '/platforms/breakpad/',
        destination: '/platforms/native/guides/breakpad/',
        permanent: true,
      },
      {
        source: '/platforms/native/breakpad/',
        destination: '/platforms/native/guides/breakpad/',
        permanent: true,
      },
      {
        source: '/platforms/minidump/',
        destination: '/platforms/native/guides/minidumps/',
        permanent: true,
      },
      {
        source: '/platforms/native/minidump/',
        destination: '/platforms/native/guides/minidumps/',
        permanent: true,
      },
      {
        source: '/clients/minidump/',
        destination: '/platforms/native/guides/minidumps/',
        permanent: true,
      },
      {
        source: '/platforms/react-native/advanced-setup/',
        destination: '/platforms/react-native/manual-setup/manual-setup/',
        permanent: true,
      },
      {
        source: '/platforms/react-native/codepush/',
        destination: '/platforms/react-native/manual-setup/codepush/',
        permanent: true,
      },
      {
        source: '/platforms/react-native/hermes/',
        destination: '/platforms/react-native/manual-setup/hermes/',
        permanent: true,
      },
      {
        source: '/platforms/react-native/ram-bundles/',
        destination: '/platforms/react-native/manual-setup/ram-bundles/',
        permanent: true,
      },
      {
        source: '/platforms/react-native/performance/sampling/',
        destination: '/platforms/react-native/configuration/sampling/',
        permanent: true,
      },
      {
        source: '/platforms/react-native/configuration/integrations/plugin/',
        destination: '/platforms/react-native/integrations/plugin/',
        permanent: true,
      },
      {
        source: '/platforms/react-native/configuration/integrations/',
        destination: '/platforms/react-native/integrations/',
        permanent: true,
      },
      {
        source: '/platforms/react-native/configuration/integrations/custom/',
        destination: '/platforms/react-native/integrations/custom/',
        permanent: true,
      },
      {
        source: '/platforms/react-native/configuration/integrations/default/',
        destination: '/platforms/react-native/integrations/default/',
        permanent: true,
      },
      {
        source: '/platforms/react-native/configuration/integrations/redux/',
        destination: '/platforms/react-native/integrations/redux/',
        permanent: true,
      },
      {
        source: '/platforms/react-native/manual-setup/sourcemaps/',
        destination: '/platforms/react-native/sourcemaps/',
        permanent: true,
      },
      {
        source: '/platforms/python/data-collected/',
        destination: '/platforms/python/data-management/data-collected/',
        permanent: true,
      },
      {
        source: '/platforms/python/flask/',
        destination: '/platforms/python/integrations/flask/',
        permanent: true,
      },
      {
        source: '/platforms/python/aiohttp/',
        destination: '/platforms/python/integrations/aiohttp/',
        permanent: true,
      },
      {
        source: '/platforms/python/gcp_functions/',
        destination: '/platforms/python/integrations/gcp-functions/',
        permanent: true,
      },
      {
        source: '/platforms/python/serverless/',
        destination: '/platforms/python/integrations/serverless/',
        permanent: true,
      },
      {
        source: '/clients/python/integrations/pyramid/',
        destination: '/platforms/python/integrations/pyramid/',
        permanent: true,
      },
      {
        source: '/platforms/python/pyramid/',
        destination: '/platforms/python/integrations/pyramid/',
        permanent: true,
      },
      {
        source: '/clients/python/integrations/starlette/',
        destination: '/platforms/python/integrations/starlette/',
        permanent: true,
      },
      {
        source: '/platforms/python/starlette/',
        destination: '/platforms/python/integrations/starlette/',
        permanent: true,
      },
      {
        source: '/clients/python/integrations/lambda/',
        destination: '/platforms/python/integrations/aws-lambda/',
        permanent: true,
      },
      {
        source: '/platforms/python/aws_lambda/',
        destination: '/platforms/python/integrations/aws-lambda/',
        permanent: true,
      },
      {
        source: '/platforms/python/airflow/',
        destination: '/platforms/python/integrations/airflow/',
        permanent: true,
      },
      {
        source: '/platforms/python/tornado/',
        destination: '/platforms/python/integrations/tornado/',
        permanent: true,
      },
      {
        source: '/clients/python/integrations/tornado/',
        destination: '/platforms/python/integrations/tornado/',
        permanent: true,
      },
      {
        source: '/platforms/python/chalice/',
        destination: '/platforms/python/integrations/chalice/',
        permanent: true,
      },
      {
        source: '/clients/python/integrations/fastapi/',
        destination: '/platforms/python/integrations/fastapi/',
        permanent: true,
      },
      {
        source: '/platforms/python/fastapi/',
        destination: '/platforms/python/integrations/fastapi/',
        permanent: true,
      },
      {
        source: '/platforms/python/sanic/',
        destination: '/platforms/python/integrations/sanic/',
        permanent: true,
      },
      {
        source: '/clients/python/integrations/starlite/',
        destination: '/platforms/python/integrations/starlite/',
        permanent: true,
      },
      {
        source: '/platforms/python/starlite/',
        destination: '/platforms/python/integrations/starlite/',
        permanent: true,
      },
      {
        source: '/platforms/python/beam/',
        destination: '/platforms/python/integrations/beam/',
        permanent: true,
      },
      {
        source: '/clients/python/integrations/celery/',
        destination: '/platforms/python/integrations/celery/',
        permanent: true,
      },
      {
        source: '/platforms/python/celery/',
        destination: '/platforms/python/integrations/celery/',
        permanent: true,
      },
      {
        source: '/platforms/python/hints/',
        destination: '/platforms/python/integrations/celery/',
        permanent: true,
      },
      {
        source: '/clients/python/integrations/django/',
        destination: '/platforms/python/integrations/django/',
        permanent: true,
      },
      {
        source: '/platforms/python/django/',
        destination: '/platforms/python/integrations/django/',
        permanent: true,
      },
      {
        source: '/platforms/python/falcon/',
        destination: '/platforms/python/integrations/falcon/',
        permanent: true,
      },
      {
        source: '/clients/python/integrations/logging/',
        destination: '/platforms/python/integrations/logging/',
        permanent: true,
      },
      {
        source: '/platforms/python/logging/',
        destination: '/platforms/python/integrations/logging/',
        permanent: true,
      },
      {
        source: '/clients/python/integrations/rq/',
        destination: '/platforms/python/integrations/rq/',
        permanent: true,
      },
      {
        source: '/platforms/python/rq/',
        destination: '/platforms/python/integrations/rq/',
        permanent: true,
      },
      {
        source: '/clients/python/integrations/bottle/',
        destination: '/platforms/python/integrations/bottle/',
        permanent: true,
      },
      {
        source: '/platforms/python/bottle/',
        destination: '/platforms/python/integrations/bottle/',
        permanent: true,
      },
      {
        source: '/platforms/python/pyspark/',
        destination: '/platforms/python/integrations/spark/',
        permanent: true,
      },
      {
        source: '/platforms/python/integrations/pyspark/',
        destination: '/platforms/python/integrations/spark/',
        permanent: true,
      },
      {
        source: '/platforms/python/tryton/',
        destination: '/platforms/python/integrations/tryton/',
        permanent: true,
      },
      {
        source: '/clients/python/breadcrumbs/',
        destination: '/platforms/python/legacy-sdk/breadcrumbs/',
        permanent: true,
      },
      {
        source: '/clients/python/platform-support/',
        destination: '/platforms/python/legacy-sdk/platform-support/',
        permanent: true,
      },
      {
        source: '/clients/python/integrations/',
        destination: '/platforms/python/legacy-sdk/integrations/',
        permanent: true,
      },
      {
        source: '/clients/python/api/',
        destination: '/platforms/python/legacy-sdk/api/',
        permanent: true,
      },
      {
        source: '/clients/python/advanced/',
        destination: '/platforms/python/legacy-sdk/advanced/',
        permanent: true,
      },
      {
        source: '/clients/python/usage/',
        destination: '/platforms/python/legacy-sdk/usage/',
        permanent: true,
      },
      {
        source: '/clients/python/transports/',
        destination: '/platforms/python/legacy-sdk/transports/',
        permanent: true,
      },
      {
        source: '/platforms/python/contextvars/',
        destination: '/platforms/python/troubleshooting/',
        permanent: true,
      },
      {
        source: '/platforms/dart/usage/advanced-usage/',
        destination: '/platforms/dart/integrations/http-integration/',
        permanent: true,
      },
      {
        source: '/platforms/dart/configuration/integrations/http-integration/',
        destination: '/platforms/dart/integrations/http-integration/',
        permanent: true,
      },
      {
        source: '/platforms/dart/configuration/integrations/file/',
        destination: '/platforms/dart/integrations/file/',
        permanent: true,
      },
      {
        source: '/platforms/dart/configuration/integrations/',
        destination: '/platforms/dart/integrations/',
        permanent: true,
      },
      {
        source: '/platforms/dart/configuration/integrations/logging/',
        destination: '/platforms/dart/integrations/logging/',
        permanent: true,
      },
      {
        source: '/platforms/dart/configuration/integrations/dio/',
        destination: '/platforms/dart/integrations/dio/',
        permanent: true,
      },
      {
        source: '/quickstart/',
        destination: '/platforms/',
        permanent: true,
      },
      {
        source: '/clients/',
        destination: '/platforms/',
        permanent: true,
      },
      {
        source: '/platforms/perl/',
        destination: '/platforms/',
        permanent: true,
      },
      {
        source: '/platforms/node/guides/serverless-cloud/typescript/',
        destination: '/platforms/',
        permanent: true,
      },
      {
        source: '/clients/rust/',
        destination: '/platforms/rust/',
        permanent: true,
      },
      {
        source: '/platforms/rust/log/',
        destination: '/platforms/rust/',
        permanent: true,
      },
      {
        source: '/platforms/rust/profiling/',
        destination: '/platforms/rust/',
        permanent: true,
      },
      {
        source: '/platforms/rust/actix/',
        destination: '/platforms/rust/guides/actix-web/',
        permanent: true,
      },
      {
        source: '/platforms/rust/guides/actix-web/profiling/',
        destination: '/platforms/rust/guides/actix-web/',
        permanent: true,
      },
      {
        source: '/clients/java/modules/log4j2/',
        destination: '/platforms/java/legacy/log4j2/',
        permanent: true,
      },
      {
        source: '/clients/java/',
        destination: '/platforms/java/legacy/',
        permanent: true,
      },
      {
        source: '/clients/java/migration/',
        destination: '/platforms/java/legacy/migration/',
        permanent: true,
      },
      {
        source: '/clients/java/usage/',
        destination: '/platforms/java/legacy/usage/',
        permanent: true,
      },
      {
        source: '/clients/java/modules/appengine/',
        destination: '/platforms/java/legacy/google-app-engine/',
        permanent: true,
      },
      {
        source: '/clients/java/context/',
        destination: '/platforms/java/scope/',
        permanent: true,
      },
      {
        source: '/clients/java/modules/log4j2/',
        destination: '/platforms/java/guides/log4j2/',
        permanent: true,
      },
      {
        source: '/clients/java/modules/jul/',
        destination: '/platforms/java/guides/jul/',
        permanent: true,
      },
      {
        source: '/platforms/java/guides/jul/config/',
        destination: '/platforms/java/guides/jul/',
        permanent: true,
      },
      {
        source: '/clients/java/modules/logback/',
        destination: '/platforms/java/guides/logback/',
        permanent: true,
      },
      {
        source: '/platforms/java/guides/logback/config/',
        destination: '/platforms/java/guides/logback/',
        permanent: true,
      },
      {
        source: '/platforms/java/guides/spring/config/',
        destination: '/platforms/java/guides/spring/',
        permanent: true,
      },
      {
        source: '/platforms/java/guides/springboot/config/',
        destination: '/platforms/java/guides/spring-boot/',
        permanent: true,
      },
      {
        source: '/clients/java/usage/',
        destination: '/platforms/java/usage/',
        permanent: true,
      },
      {
        source: '/clients/php/integrations/monolog/',
        destination: '/platforms/php/',
        permanent: true,
      },
      {
        source: '/platforms/php/default-integrations/',
        destination: '/platforms/php/integrations/',
        permanent: true,
      },
      {
        source: '/platforms/php/guides/symfony/config/',
        destination: '/platforms/php/guides/symfony/configuration/symfony-options/',
        permanent: true,
      },
      {
        source: '/clients/php/integrations/symfony2/',
        destination: '/platforms/php/guides/symfony/',
        permanent: true,
      },
      {
        source: '/platforms/php/symfony/',
        destination: '/platforms/php/guides/symfony/',
        permanent: true,
      },
      {
        source: '/platforms/php/guides/symfony/performance/pm-integrations/',
        destination:
          '/platforms/php/guides/symfony/performance/instrumentation/automatic-instrumentation/',
        permanent: true,
      },
      {
        source: '/clients/php/integrations/laravel/',
        destination: '/platforms/php/guides/laravel/',
        permanent: true,
      },
      {
        source: '/platforms/php/laravel/',
        destination: '/platforms/php/guides/laravel/',
        permanent: true,
      },
      {
        source: '/platforms/php/guides/laravel/lumen/',
        destination: '/platforms/php/guides/laravel/',
        permanent: true,
      },
      {
        source: '/platforms/php/guides/laravel/configuration/other-versions/laravel4/',
        destination: '/platforms/php/guides/laravel/other-versions/laravel4/',
        permanent: true,
      },
      {
        source: '/platforms/php/guides/laravel/other-versions/laravel5-6-7/',
        destination: '/platforms/php/guides/laravel/other-versions/',
        permanent: true,
      },
      {
        source: '/platforms/php/guides/laravel/configuration/other-versions/lumen/',
        destination: '/platforms/php/guides/laravel/other-versions/lumen/',
        permanent: true,
      },
      {
        source: '/clients/php/config/',
        destination: '/platforms/php/legacy-sdk/config/',
        permanent: true,
      },
      {
        source: '/clients/php/',
        destination: '/platforms/php/legacy-sdk/',
        permanent: true,
      },
      {
        source: '/clients/php/integrations/',
        destination: '/platforms/php/legacy-sdk/integrations/',
        permanent: true,
      },
      {
        source: '/clients/php/usage/',
        destination: '/platforms/php/legacy-sdk/usage/',
        permanent: true,
      },
      {
        source: '/platforms/dotnet/configuration/cli-integration/',
        destination: '/platforms/dotnet/configuration/msbuild/',
        permanent: true,
      },
      {
        source: '/platforms/dotnet/aspnetcore/',
        destination: '/platforms/dotnet/guides/aspnetcore/',
        permanent: true,
      },
      {
        source: '/platforms/dotnet/guides/aspnetcore/ignoring-exceptions/',
        destination: '/platforms/dotnet/guides/aspnetcore/',
        permanent: true,
      },
      {
        source: '/platforms/dotnet/log4net/',
        destination: '/platforms/dotnet/guides/log4net/',
        permanent: true,
      },
      {
        source: '/platforms/dotnet/microsoft-extensions-logging/',
        destination: '/platforms/dotnet/guides/extensions-logging/',
        permanent: true,
      },
      {
        source: '/platforms/dotnet/entityframework/',
        destination: '/platforms/dotnet/guides/entityframework/',
        permanent: true,
      },
      {
        source: '/platforms/dotnet/maui/',
        destination: '/platforms/dotnet/guides/maui/',
        permanent: true,
      },
      {
        source: '/platforms/dotnet/wpf/',
        destination: '/platforms/dotnet/guides/wpf/',
        permanent: true,
      },
      {
        source: '/platforms/dotnet/winforms/',
        destination: '/platforms/dotnet/guides/winforms/',
        permanent: true,
      },
      {
        source: '/platforms/dotnet/guides/winforms/ignoring-exceptions/',
        destination: '/platforms/dotnet/guides/winforms/',
        permanent: true,
      },
      {
        source: '/platforms/dotnet/google.cloud.functions/',
        destination: '/platforms/dotnet/guides/google-cloud-functions/',
        permanent: true,
      },
      {
        source: '/platforms/dotnet/winui/',
        destination: '/platforms/dotnet/guides/winui/',
        permanent: true,
      },
      {
        source: '/platforms/dotnet/serilog/',
        destination: '/platforms/dotnet/guides/serilog/',
        permanent: true,
      },
      {
        source: '/platforms/dotnet/uwp/',
        destination: '/platforms/dotnet/guides/uwp/',
        permanent: true,
      },
      {
        source: '/platforms/dotnet/nlog/',
        destination: '/platforms/dotnet/guides/nlog/',
        permanent: true,
      },
      {
        source: '/clients/csharp/',
        destination: '/platforms/dotnet/legacy-sdk/',
        permanent: true,
      },
      {
        source:
          '/platforms/flutter/configuration/integrations/user-interaction-instrumentation/',
        destination: '/platforms/flutter/integrations/user-interaction-instrumentation/',
        permanent: true,
      },
      {
        source: '/platforms/flutter/configuration/integrations/',
        destination: '/platforms/flutter/integrations/',
        permanent: true,
      },
      {
        source: '/platforms/flutter/configuration/integrations/sqflite-instrumentation/',
        destination: '/platforms/flutter/integrations/sqflite-instrumentation/',
        permanent: true,
      },
      {
        source: '/platforms/flutter/usage/advanced-usage/',
        destination: '/platforms/flutter/troubleshooting/',
        permanent: true,
      },
      {
        source: '/platforms/android/manual-configuration/',
        destination: '/platforms/android/configuration/manual-init/',
        permanent: true,
      },
      {
        source: '/platforms/android/advanced-usage/',
        destination: '/platforms/android/configuration/using-ndk/',
        permanent: true,
      },
      {
        source: '/platforms/android/using-ndk/',
        destination: '/platforms/android/configuration/using-ndk/',
        permanent: true,
      },
      {
        source: '/platforms/android/gradle/',
        destination: '/platforms/android/configuration/gradle/',
        permanent: true,
      },
      {
        source: '/platforms/android/configuration/integrations/apollo3/',
        destination: '/platforms/android/integrations/apollo3/',
        permanent: true,
      },
      {
        source: '/platforms/android/configuration/integrations/',
        destination: '/platforms/android/integrations/',
        permanent: true,
      },
      {
        source: '/platforms/android/configuration/integrations/logcat/',
        destination: '/platforms/android/integrations/logcat/',
        permanent: true,
      },
      {
        source: '/platforms/android/configuration/jetpack-compose/',
        destination: '/platforms/android/integrations/jetpack-compose/',
        permanent: true,
      },
      {
        source: '/platforms/android/configuration/integrations/jetpack-compose/',
        destination: '/platforms/android/integrations/jetpack-compose/',
        permanent: true,
      },
      {
        source: '/platforms/android/configuration/integrations/navigation/',
        destination: '/platforms/android/integrations/navigation/',
        permanent: true,
      },
      {
        source: '/platforms/android/configuration/integrations/room-and-sqlite/',
        destination: '/platforms/android/integrations/room-and-sqlite/',
        permanent: true,
      },
      {
        source: '/platforms/android/configuration/integrations/file-io/',
        destination: '/platforms/android/integrations/file-io/',
        permanent: true,
      },
      {
        source: '/platforms/android/performance/instrumentation/apollo/',
        destination: '/platforms/android/integrations/apollo/',
        permanent: true,
      },
      {
        source: '/platforms/android/configuration/integrations/apollo/',
        destination: '/platforms/android/integrations/apollo/',
        permanent: true,
      },
      {
        source: '/platforms/android/configuration/integrations/fragment/',
        destination: '/platforms/android/integrations/fragment/',
        permanent: true,
      },
      {
        source: '/platforms/android/timber/',
        destination: '/platforms/android/integrations/timber/',
        permanent: true,
      },
      {
        source: '/platforms/android/guides/timber/',
        destination: '/platforms/android/integrations/timber/',
        permanent: true,
      },
      {
        source: '/platforms/android/configuration/integrations/timber/',
        destination: '/platforms/android/integrations/timber/',
        permanent: true,
      },
      {
        source: '/platforms/android/guides/okhttp/',
        destination: '/platforms/android/integrations/okhttp/',
        permanent: true,
      },
      {
        source: '/platforms/android/configuration/integrations/okhttp/',
        destination: '/platforms/android/integrations/okhttp/',
        permanent: true,
      },
      {
        source: '/platforms/android/migrate/',
        destination: '/platforms/android/migration/',
        permanent: true,
      },
      {
        source: '/platforms/android/proguard/',
        destination: '/platforms/android/enhance-errors/proguard/',
        permanent: true,
      },
      {
        source: '/platforms/android/source-context/',
        destination: '/platforms/android/enhance-errors/source-context/',
        permanent: true,
      },
      {
        source: '/platforms/android/kotlin-compiler-plugin/',
        destination: '/platforms/android/enhance-errors/kotlin-compiler-plugin/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/configuration/integrations/plugin/',
        destination: '/platforms/javascript/configuration/integrations/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/configuration/integrations/default/',
        destination: '/platforms/javascript/configuration/integrations/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/integrations/custom/',
        destination: '/platforms/javascript/configuration/integrations/custom/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/loader/',
        destination: '/platforms/javascript/install/loader/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/install/lazy-load-sentry/',
        destination: '/platforms/javascript/install/loader/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/install/cdn/',
        destination: '/platforms/javascript/install/loader/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/integrations/rrweb/',
        destination: '/platforms/javascript/session-replay/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/configuration/integrations/rrweb/',
        destination: '/platforms/javascript/session-replay/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/angular/configuration/integrations/rrweb/',
        destination: '/platforms/javascript/session-replay/',
        permanent: true,
      },
      {
        source:
          '/platforms/javascript/guides/capacitor/configuration/integrations/rrweb/',
        destination: '/platforms/javascript/session-replay/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/cordova/configuration/integrations/rrweb/',
        destination: '/platforms/javascript/session-replay/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/ember/configuration/integrations/rrweb/',
        destination: '/platforms/javascript/session-replay/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/gatsby/configuration/integrations/rrweb/',
        destination: '/platforms/javascript/session-replay/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/nextjs/configuration/integrations/rrweb/',
        destination: '/platforms/javascript/session-replay/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/react/configuration/integrations/rrweb/',
        destination: '/platforms/javascript/session-replay/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/remix/configuration/integrations/rrweb/',
        destination: '/platforms/javascript/session-replay/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/svelte/configuration/integrations/rrweb/',
        destination: '/platforms/javascript/session-replay/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/vue/configuration/integrations/rrweb/',
        destination: '/platforms/javascript/session-replay/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/wasm/configuration/integrations/rrweb/',
        destination: '/platforms/javascript/session-replay/',
        permanent: true,
      },
      {
        source:
          '/platforms/javascript/guides/remix/session-replay/custom-instrumentation/',
        destination: '/platforms/javascript/session-replay/',
        permanent: true,
      },
      {
        source:
          '/platforms/javascript/guides/remix/session-replay/custom-instrumentation/privacy-configuration/',
        destination: '/platforms/javascript/session-replay/',
        permanent: true,
      },
      {
        source:
          '/platforms/javascript/guides/gatsby/session-replay/custom-instrumentation/',
        destination: '/platforms/javascript/session-replay/',
        permanent: true,
      },
      {
        source: '/platforms/unreal/setup-crashreport/',
        destination: '/platforms/unreal/configuration/setup-crashreporter/',
        permanent: true,
      },
      {
        source: '/platforms/unreal/setup-crashreporter/',
        destination: '/platforms/unreal/configuration/setup-crashreporter/',
        permanent: true,
      },
      {
        source: '/platforms/unreal/debug-symbols/',
        destination: '/platforms/unreal/configuration/debug-symbols/',
        permanent: true,
      },
      {
        source: '/clients/ruby/config/',
        destination: '/platforms/ruby/configuration/options/',
        permanent: true,
      },
      {
        source: '/platforms/ruby/config/',
        destination: '/platforms/ruby/configuration/options/',
        permanent: true,
      },
      {
        source: '/contributing/approach/write-getting-started/',
        destination: '/contributing/approach/sdk-docs/write-getting-started/',
        permanent: true,
      },
      {
        source: '/contributing/approach/write-data-management/',
        destination: '/contributing/approach/sdk-docs/write-data-management/',
        permanent: true,
      },
      {
        source: '/contributing/approach/write-sdk-docs/',
        destination: '/contributing/approach/sdk-docs/',
        permanent: true,
      },
      {
        source: '/contributing/approach/write-configuration/',
        destination: '/contributing/approach/sdk-docs/write-configuration/',
        permanent: true,
      },
      {
        source: '/contributing/approach/common_content/',
        destination: '/contributing/approach/sdk-docs/common_content/',
        permanent: true,
      },
      {
        source: '/contributing/approach/write-performance/',
        destination: '/contributing/approach/sdk-docs/write-performance/',
        permanent: true,
      },
      {
        source: '/contributing/approach/write-enriching-events/',
        destination: '/contributing/approach/sdk-docs/write-enriching-events/',
        permanent: true,
      },
      {
        source: '/contributing/approach/write-usage/',
        destination: '/contributing/approach/sdk-docs/write-usage/',
        permanent: true,
      },
      {
        source: '/learn/releases/',
        destination: '/product/releases/',
        permanent: true,
      },
      {
        source: '/workflow/releases/',
        destination: '/product/releases/',
        permanent: true,
      },
      {
        source: '/workflow/releases/index',
        destination: '/product/releases/',
        permanent: true,
      },
      {
        source: '/workflow/releases/release-automation/',
        destination: '/product/releases/',
        permanent: true,
      },
      {
        source: '/product/releases/release-automation/',
        destination: '/product/releases/',
        permanent: true,
      },
      {
        source: '/workflow/releases/health/',
        destination: '/product/releases/health/',
        permanent: true,
      },
      {
        source: '/product/releases/health/crash/',
        destination: '/product/releases/health/',
        permanent: true,
      },
      {
        source: '/product/releases/health/setup/',
        destination: '/product/releases/setup/',
        permanent: true,
      },
      {
        source: '/workflow/releases/release-automation/travis-ci/',
        destination: '/product/releases/setup/release-automation/travis-ci/',
        permanent: true,
      },
      {
        source: '/workflow/releases/release-automation/circleci/',
        destination: '/product/releases/setup/release-automation/circleci/',
        permanent: true,
      },
      {
        source: '/workflow/releases/release-automation/netlify/',
        destination: '/product/releases/setup/release-automation/netlify/',
        permanent: true,
      },
      {
        source: '/workflow/releases/release-automation/jenkins/',
        destination: '/product/releases/setup/release-automation/jenkins/',
        permanent: true,
      },
      {
        source: '/workflow/releases/release-automation/bitbucket-pipelines/',
        destination: '/product/releases/setup/release-automation/bitbucket-pipelines/',
        permanent: true,
      },
      {
        source: '/workflow/releases/release-automation/github-actions/',
        destination:
          '/product/releases/setup/release-automation/github-deployment-gates/',
        permanent: true,
      },
      {
        source: '/workflow/releases/release-automation/github-actions/',
        destination: '/product/releases/setup/release-automation/github-actions/',
        permanent: true,
      },
      {
        source: '/product/releases/setup/manual-setup-releases/',
        destination: '/product/releases/associate-commits/',
        permanent: true,
      },
      {
        source: '/product/releases/health/release-details/',
        destination: '/product/releases/release-details/',
        permanent: true,
      },
      {
        source: '/guides/integrate-frontend/upload-source-maps/',
        destination: '/product/sentry-basics/integrate-frontend/upload-source-maps/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/integrate-frontend/upload-source-maps/',
        destination: '/product/sentry-basics/integrate-frontend/upload-source-maps/',
        permanent: true,
      },
      {
        source: '/guides/integrate-frontend/configure-scms/',
        destination: '/product/sentry-basics/integrate-frontend/configure-scms/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/integrate-frontend/configure-scms/',
        destination: '/product/sentry-basics/integrate-frontend/configure-scms/',
        permanent: true,
      },
      {
        source: '/guides/integrate-frontend/',
        destination: '/product/sentry-basics/integrate-frontend/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/integrate-frontend/',
        destination: '/product/sentry-basics/integrate-frontend/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/frontend/create-new-project/',
        destination: '/product/sentry-basics/integrate-frontend/',
        permanent: true,
      },
      {
        source: '/guides/integrate-frontend/create-new-project/',
        destination: '/product/sentry-basics/integrate-frontend/create-new-project/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/integrate-frontend/create-new-project/',
        destination: '/product/sentry-basics/integrate-frontend/create-new-project/',
        permanent: true,
      },
      {
        source: '/guides/integrate-frontend/initialize-sentry-sdk/',
        destination: '/product/sentry-basics/integrate-frontend/initialize-sentry-sdk/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/integrate-frontend/initialize-sentry-sdk/',
        destination: '/product/sentry-basics/integrate-frontend/initialize-sentry-sdk/',
        permanent: true,
      },
      {
        source: '/guides/integrate-frontend/generate-first-error/',
        destination: '/product/sentry-basics/integrate-frontend/generate-first-error/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/integrate-frontend/generate-first-error/',
        destination: '/product/sentry-basics/integrate-frontend/generate-first-error/',
        permanent: true,
      },
      {
        source: '/basics/',
        destination: '/product/sentry-basics/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/',
        destination: '/product/sentry-basics/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/tracing/',
        destination: '/product/sentry-basics/concepts/tracing/',
        permanent: true,
      },
      {
        source: '/performance/distributed-tracing/',
        destination: '/product/sentry-basics/concepts/tracing/distributed-tracing/',
        permanent: true,
      },
      {
        source: '/performance-monitoring/distributed-tracing/',
        destination: '/product/sentry-basics/concepts/tracing/distributed-tracing/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/error-tracing/',
        destination: '/product/sentry-basics/concepts/tracing/distributed-tracing/',
        permanent: true,
      },
      {
        source: '/product/performance/distributed-tracing/',
        destination: '/product/sentry-basics/concepts/tracing/distributed-tracing/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/tracing/distributed-tracing/',
        destination: '/product/sentry-basics/concepts/tracing/distributed-tracing/',
        permanent: true,
      },
      {
        source: '/product/performance/trace-view/',
        destination: '/product/sentry-basics/concepts/tracing/trace-view/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/tracing/trace-view/',
        destination: '/product/sentry-basics/concepts/tracing/trace-view/',
        permanent: true,
      },
      {
        source: '/product/performance/event-detail/',
        destination: '/product/sentry-basics/concepts/tracing/event-detail/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/tracing/event-detail/',
        destination: '/product/sentry-basics/concepts/tracing/event-detail/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/dsn-explainer/',
        destination: '/product/sentry-basics/concepts/dsn-explainer/',
        permanent: true,
      },
      {
        source: '/enriching-error-data/environments/',
        destination: '/product/sentry-basics/concepts/environments/',
        permanent: true,
      },
      {
        source: '/learn/environments/',
        destination: '/product/sentry-basics/concepts/environments/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/environments/',
        destination: '/product/sentry-basics/concepts/environments/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/key-terms/',
        destination: '/product/sentry-basics/concepts/key-terms/',
        permanent: true,
      },
      {
        source: '/guides/enrich-data/',
        destination: '/product/sentry-basics/concepts/enrich-data/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/enrich-data/',
        destination: '/product/sentry-basics/concepts/enrich-data/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/enrich-data/',
        destination: '/product/sentry-basics/concepts/enrich-data/',
        permanent: true,
      },
      {
        source: '/guides/integrate-backend/capturing-errors/',
        destination: '/product/sentry-basics/integrate-backend/capturing-errors/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/integrate-backend/capturing-errors/',
        destination: '/product/sentry-basics/integrate-backend/capturing-errors/',
        permanent: true,
      },
      {
        source: '/guides/integrate-backend/',
        destination: '/product/sentry-basics/integrate-backend/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/integrate-backend/',
        destination: '/product/sentry-basics/integrate-backend/',
        permanent: true,
      },
      {
        source: '/guides/integrate-backend/configuration-options/',
        destination: '/product/sentry-basics/integrate-backend/configuration-options/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/integrate-backend/configuration-options/',
        destination: '/product/sentry-basics/integrate-backend/configuration-options/',
        permanent: true,
      },
      {
        source: '/guides/integrate-backend/getting-started/',
        destination: '/product/sentry-basics/integrate-backend/getting-started/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/integrate-backend/getting-started/',
        destination: '/product/sentry-basics/integrate-backend/getting-started/',
        permanent: true,
      },
      {
        source: '/ssl/',
        destination: '/product/security/ssl/',
        permanent: true,
      },
      {
        source: '/ip-ranges/',
        destination: '/product/security/ip-ranges/',
        permanent: true,
      },
      {
        source: '/learn/security-policy-reporting/',
        destination: '/product/security-policy-reporting/',
        permanent: true,
      },
      {
        source: '/error-reporting/security-policy-reporting/',
        destination: '/product/security-policy-reporting/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/security-policy-reporting/',
        destination: '/product/security-policy-reporting/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/troubleshooting/session-replay/',
        destination: '/platforms/javascript/session-replay/troubleshooting/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/:guide/troubleshooting/session-replay/',
        destination: '/platforms/javascript/session-replay/troubleshooting/',
        permanent: true,
      },
      {
        source: '/sdks/javascript/config/sourcemaps/',
        destination: '/platforms/javascript/sourcemaps/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/sourcemaps/generation/',
        destination: '/platforms/javascript/sourcemaps/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/sourcemaps/troubleshooting/',
        destination: '/platforms/javascript/sourcemaps/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/sourcemaps/availability/',
        destination: '/platforms/javascript/sourcemaps/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/configuration/sourcemaps/',
        destination: '/platforms/javascript/sourcemaps/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/docPlatform/sourcemaps/',
        destination: '/platforms/javascript/sourcemaps/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/:guide/sourcemaps/multiple-origins/',
        destination: '/platforms/javascript/sourcemaps/',
        permanent: true,
      },
      {
        source:
          '/platforms/javascript/guides/:guide/sourcemaps/uploading/hosting-publicly/',
        destination: '/platforms/javascript/sourcemaps/',
        permanent: true,
      },
      {
        source:
          '/platforms/javascript/guides/:guide/sourcemaps/uploading-without-debug-ids/',
        destination: '/platforms/javascript/sourcemaps/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/sourcemaps/troubleshooting/',
        destination: '/platforms/javascript/sourcemaps/troubleshooting_js/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/sourcemaps/uploading-without-debug-ids/',
        destination: '/platforms/javascript/sourcemaps/troubleshooting_js/',
        permanent: true,
      },
      {
        source:
          '/platforms/javascript/guides/nextjs/sourcemaps/troubleshooting_js/legacy-uploading-methods/',
        destination: '/platforms/javascript/sourcemaps/troubleshooting_js/',
        permanent: true,
      },
      {
        source:
          '/platforms/javascript/sourcemaps/troubleshooting_js/verify-artifact-distribution-value-matches-value-configured-in-your-sdk/',
        destination: '/platforms/javascript/sourcemaps/troubleshooting_js/',
        permanent: true,
      },
      {
        source:
          '/platforms/javascript/sourcemaps/troubleshooting_js/uploading-without-debug-ids/',
        destination:
          '/platforms/javascript/sourcemaps/troubleshooting_js/legacy-uploading-methods/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/sourcemaps/tools/webpack/',
        destination: '/platforms/javascript/sourcemaps/uploading/webpack/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/sourcemaps/hosting-publicly/',
        destination: '/platforms/javascript/sourcemaps/uploading/hosting-publicly/',
        permanent: true,
      },
      {
        source:
          '/platforms/javascript/guides/cordova/troubleshooting/supported-browsers/',
        destination: '/platforms/javascript/guides/cordova/troubleshooting/',
        permanent: true,
      },
      {
        source: '/clients/cordova/ionic/',
        destination: '/platforms/javascript/guides/cordova/ionic/',
        permanent: true,
      },
      {
        source: '/sdks/react/integrations/vue-router/',
        destination: '/platforms/javascript/guides/vue/features/vue-router/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/vue/configuration/integrations/vue-router/',
        destination: '/platforms/javascript/guides/vue/features/vue-router/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/vue/',
        destination: '/platforms/javascript/guides/vue/',
        permanent: true,
      },
      {
        source: '/clients/javascript/integrations/vue/',
        destination: '/platforms/javascript/guides/vue/',
        permanent: true,
      },
      {
        source: '/clients/javascript/integrations/angular/',
        destination: '/platforms/javascript/guides/angular/angular1/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/gatsby/',
        destination: '/platforms/javascript/guides/gatsby/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/gatsby/errors/breadcrumbs/',
        destination: '/platforms/javascript/guides/gatsby/',
        permanent: true,
      },
      {
        source: '/clients/javascript/integrations/ember/',
        destination: '/platforms/javascript/guides/ember/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/ember/',
        destination: '/platforms/javascript/guides/ember/',
        permanent: true,
      },
      {
        source:
          '/platforms/javascript/guides/electron/configuration/integrations/optional/',
        destination:
          '/platforms/javascript/guides/electron/configuration/integrations/electronminidump/',
        permanent: true,
      },
      {
        source: '/clients/electron/',
        destination: '/platforms/javascript/guides/electron/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/electron/',
        destination: '/platforms/javascript/guides/electron/',
        permanent: true,
      },
      {
        source: '/platforms/electron/',
        destination: '/platforms/javascript/guides/electron/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/electron/sourcemaps/',
        destination: '/platforms/javascript/guides/electron/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/electron/lazy-load-sentry/',
        destination: '/platforms/javascript/guides/electron/',
        permanent: true,
      },
      {
        source: '/sdks/react/integrations/redux/',
        destination: '/platforms/javascript/guides/react/features/redux/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/react/configuration/integrations/redux/',
        destination: '/platforms/javascript/guides/react/features/redux/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/guides/react/integrations/react-router/',
        destination: '/platforms/javascript/guides/react/features/react-router/',
        permanent: true,
      },
      {
        source:
          '/platforms/javascript/guides/react/configuration/integrations/react-router/',
        destination: '/platforms/javascript/guides/react/features/react-router/',
        permanent: true,
      },
      {
        source: '/platforms/javascript/react/',
        destination: '/platforms/javascript/guides/react/',
        permanent: true,
      },
      {
        source: '/clients/javascript/integrations/react/',
        destination: '/platforms/javascript/guides/react/',
        permanent: true,
      },
      {
        source: '/sdks/react/',
        destination: '/platforms/javascript/guides/react/',
        permanent: true,
      },
      {
        source: '/platforms/react/',
        destination: '/platforms/javascript/guides/react/',
        permanent: true,
      },
      {
        source: '/clients/javascript/config/',
        destination: '/platforms/javascript/legacy-sdk/config/',
        permanent: true,
      },
      {
        source: '/clients/javascript/install/',
        destination: '/platforms/javascript/legacy-sdk/install/',
        permanent: true,
      },
      {
        source: '/clients/javascript/sourcemaps/',
        destination: '/platforms/javascript/legacy-sdk/sourcemaps/',
        permanent: true,
      },
      {
        source: '/clients/javascript/integrations/',
        destination: '/platforms/javascript/legacy-sdk/integrations/',
        permanent: true,
      },
      {
        source: '/clients/javascript/usage/',
        destination: '/platforms/javascript/legacy-sdk/usage/',
        permanent: true,
      },
      {
        source: '/clients/javascript/tips/',
        destination: '/platforms/javascript/legacy-sdk/tips/',
        permanent: true,
      },

      {
        source: '/platforms/node/pluggable-integrations/',
        destination: '/platforms/node/configuration/integrations/pluggable-integrations/',
        permanent: true,
      },
      {
        source: '/platforms/node/default-integrations/',
        destination: '/platforms/node/configuration/integrations/default-integrations/',
        permanent: true,
      },
      {
        source: '/platforms/node/integrations/default-integrations/',
        destination: '/platforms/node/configuration/integrations/default-integrations/',
        permanent: true,
      },
      {
        source:
          '/platforms/node/sourcemaps/troubleshooting_js/uploading-without-debug-ids/',
        destination:
          '/platforms/node/sourcemaps/troubleshooting_js/legacy-uploading-methods/',
        permanent: true,
      },
      {
        source: '/platforms/node/gcp_functions/',
        destination: '/platforms/node/guides/gcp-functions/',
        permanent: true,
      },
      {
        source: '/clients/node/integrations/express/',
        destination: '/platforms/node/guides/express/',
        permanent: true,
      },
      {
        source: '/platforms/node/express/',
        destination: '/platforms/node/guides/express/',
        permanent: true,
      },
      {
        source: '/platforms/node/guides/express/integrations/default-integrations/',
        destination: '/platforms/node/guides/express/',
        permanent: true,
      },
      {
        source: '/platforms/node/aws_lambda/',
        destination: '/platforms/node/guides/aws-lambda/',
        permanent: true,
      },
      {
        source: '/platforms/node/azure_functions/',
        destination: '/platforms/node/guides/azure-functions/',
        permanent: true,
      },
      {
        source: '/platforms/node/guides/azure-functions/typescript/',
        destination: '/platforms/node/guides/azure-functions/',
        permanent: true,
      },
      {
        source: '/clients/node/integrations/connect/',
        destination: '/platforms/node/guides/connect/',
        permanent: true,
      },
      {
        source: '/platforms/node/connect/',
        destination: '/platforms/node/guides/connect/',
        permanent: true,
      },
      {
        source: '/clients/node/integrations/koa/',
        destination: '/platforms/node/guides/koa/',
        permanent: true,
      },
      {
        source: '/platforms/node/koa/',
        destination: '/platforms/node/guides/koa/',
        permanent: true,
      },
      {
        source: '/platforms/node/guides/koa/typescript/',
        destination: '/platforms/node/guides/koa/',
        permanent: true,
      },
      {
        source: '/clients/node/config/',
        destination: '/platforms/node/legacy-sdk/config/',
        permanent: true,
      },
      {
        source: '/clients/node/coffeescript/',
        destination: '/platforms/node/legacy-sdk/coffeescript/',
        permanent: true,
      },
      {
        source: '/clients/node/sourcemaps/',
        destination: '/platforms/node/legacy-sdk/sourcemaps/',
        permanent: true,
      },
      {
        source: '/clients/node/typescript/',
        destination: '/platforms/node/legacy-sdk/typescript/',
        permanent: true,
      },
      {
        source: '/platforms/node/typescript/',
        destination: '/platforms/node/legacy-sdk/typescript/',
        permanent: true,
      },
      {
        source: '/clients/node/integrations/',
        destination: '/platforms/node/legacy-sdk/integrations/',
        permanent: true,
      },
      {
        source: '/clients/node/usage/',
        destination: '/platforms/node/legacy-sdk/usage/',
        permanent: true,
      },
      {
        source: '/learn/cli/configuration/',
        destination: '/product/cli/configuration/',
        permanent: true,
      },
      {
        source: '/learn/cli/',
        destination: '/product/cli/',
        permanent: true,
      },
      {
        source: '/learn/cli/releases/',
        destination: '/product/cli/releases/',
        permanent: true,
      },
      {
        source: '/workflow/alerts-notifications/',
        destination: '/product/alerts/',
        permanent: true,
      },
      {
        source: '/product/alerts-notifications/',
        destination: '/product/alerts/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/alert-notifications/',
        destination: '/product/alerts/',
        permanent: true,
      },
      {
        source: '/product/alerts/create-alerts/best-practices/',
        destination: '/product/alerts/best-practices/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/alert-notifications/routing-alerts/',
        destination: '/product/alerts/create-alerts/routing-alerts/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/alert-notifications/issue-alerts/',
        destination: '/product/alerts/create-alerts/issue-alert-config/',
        permanent: true,
      },
      {
        source: '/product/alerts/alert-settings/',
        destination: '/product/alerts/create-alerts/issue-alert-config/',
        permanent: true,
      },
      {
        source: '/product/alerts-notifications/alert-settings/',
        destination: '/product/alerts/create-alerts/issue-alert-config/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/alert-notifications/metric-alerts/',
        destination: '/product/alerts/create-alerts/metric-alert-config/',
        permanent: true,
      },
      {
        source: '/workflow/alerts-notifications/alerts/',
        destination: '/product/alerts/alert-types/',
        permanent: true,
      },
      {
        source: '/workflow/notifications/alerts/',
        destination: '/product/alerts/alert-types/',
        permanent: true,
      },
      {
        source: '/product/alerts-notifications/alerts/',
        destination: '/product/alerts/alert-types/',
        permanent: true,
      },
      {
        source: '/product/alerts-notifications/metric-alerts/',
        destination: '/product/alerts/alert-types/',
        permanent: true,
      },
      {
        source: '/product/alerts-notifications/issue-alerts/',
        destination: '/product/alerts/alert-types/',
        permanent: true,
      },
      {
        source: '/product/alerts/create-alerts/crash-rate-alert-config/',
        destination: '/product/alerts/alert-types/',
        permanent: true,
      },
      {
        source: '/workflow/alerts-notifications/notifications/',
        destination: '/product/alerts/notifications/',
        permanent: true,
      },
      {
        source: '/workflow/notifications/workflow/',
        destination: '/product/alerts/notifications/',
        permanent: true,
      },
      {
        source: '/workflow/notifications/',
        destination: '/product/alerts/notifications/',
        permanent: true,
      },
      {
        source: '/product/notifications/',
        destination: '/product/alerts/notifications/',
        permanent: true,
      },
      {
        source: '/learn/notifications/',
        destination: '/product/alerts/notifications/',
        permanent: true,
      },
      {
        source: '/product/alerts-notifications/notifications/',
        destination: '/product/alerts/notifications/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/alert-notifications/notifications/',
        destination: '/product/alerts/notifications/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/amazon-sqs/',
        destination: '/product/integrations/data-visualization/amazon-sqs/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/legacy-integrations/amazon-sqs/',
        destination: '/product/integrations/data-visualization/amazon-sqs/',
        permanent: true,
      },
      {
        source: '/product/integrations/amazon-sqs/',
        destination: '/product/integrations/data-visualization/amazon-sqs/',
        permanent: true,
      },
      {
        source: '/product/integrations/segment/',
        destination: '/product/integrations/data-visualization/segment/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/splunk/',
        destination: '/product/integrations/data-visualization/splunk/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/legacy-integrations/splunk/',
        destination: '/product/integrations/data-visualization/splunk/',
        permanent: true,
      },
      {
        source: '/product/integrations/splunk/',
        destination: '/product/integrations/data-visualization/splunk/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/gitlab/',
        destination: '/product/integrations/source-code-mgmt/gitlab/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/global-integrations/gitlab/',
        destination: '/product/integrations/source-code-mgmt/gitlab/',
        permanent: true,
      },
      {
        source: '/product/integrations/gitlab/',
        destination: '/product/integrations/source-code-mgmt/gitlab/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/azure-devops/',
        destination: '/product/integrations/source-code-mgmt/azure-devops/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/legacy-integrations/azure-devops/',
        destination: '/product/integrations/source-code-mgmt/azure-devops/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/global-integrations/azure-devops/',
        destination: '/product/integrations/source-code-mgmt/azure-devops/',
        permanent: true,
      },
      {
        source: '/product/integrations/azure-devops/',
        destination: '/product/integrations/source-code-mgmt/azure-devops/',
        permanent: true,
      },
      {
        source: '/integrations/azure-devops/',
        destination: '/product/integrations/source-code-mgmt/azure-devops/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/github/',
        destination: '/product/integrations/source-code-mgmt/github/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/legacy-integrations/github/',
        destination: '/product/integrations/source-code-mgmt/github/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/global-integrations/github/',
        destination: '/product/integrations/source-code-mgmt/github/',
        permanent: true,
      },
      {
        source: '/product/integrations/github/',
        destination: '/product/integrations/source-code-mgmt/github/',
        permanent: true,
      },
      {
        source: '/integrations/github-enterprise/',
        destination: '/product/integrations/source-code-mgmt/github/',
        permanent: true,
      },
      {
        source: '/integrations/github/',
        destination: '/product/integrations/source-code-mgmt/github/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/bitbucket/',
        destination: '/product/integrations/source-code-mgmt/bitbucket/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/legacy-integrations/bitbucket/',
        destination: '/product/integrations/source-code-mgmt/bitbucket/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/global-integrations/bitbucket/',
        destination: '/product/integrations/source-code-mgmt/bitbucket/',
        permanent: true,
      },
      {
        source: '/product/integrations/bitbucket/',
        destination: '/product/integrations/source-code-mgmt/bitbucket/',
        permanent: true,
      },
      {
        source: '/integrations/bitbucket/',
        destination: '/product/integrations/source-code-mgmt/bitbucket/',
        permanent: true,
      },
      {
        source: '/integrations/',
        destination: '/product/integrations/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/',
        destination: '/product/integrations/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/legacy-integrations/',
        destination: '/product/integrations/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/global-integrations/',
        destination: '/product/integrations/',
        permanent: true,
      },
      {
        source: '/workflow/legacy-integrations/',
        destination: '/product/integrations/',
        permanent: true,
      },
      {
        source: '/workflow/global-integrations/',
        destination: '/product/integrations/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/rookout/',
        destination: '/product/integrations/debugging/rookout/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/global-integrations/rookout/',
        destination: '/product/integrations/debugging/rookout/',
        permanent: true,
      },
      {
        source: '/product/integrations/rookout/',
        destination: '/product/integrations/debugging/rookout/',
        permanent: true,
      },
      {
        source: '/product/integrations/gcp-cloud-run/',
        destination: '/product/integrations/cloud-monitoring/gcp-cloud-run/',
        permanent: true,
      },
      {
        source: '/product/integrations/aws-lambda/',
        destination: '/product/integrations/cloud-monitoring/aws-lambda/',
        permanent: true,
      },
      {
        source: '/product/integrations/cloudflare-workers',
        destination: '/product/integrations/cloud-monitoring/cloudflare-workers/',
        permanent: true,
      },
      {
        source: '/product/integrations/vanta/',
        destination: '/product/integrations/compliance/vanta/',
        permanent: true,
      },
      {
        source: '/product/integrations/truto/',
        destination: '/product/integrations/compliance/truto/',
        permanent: true,
      },
      {
        source: '/integrations/discord/',
        destination: '/product/integrations/notification-incidents/discord/',
        permanent: true,
      },
      {
        source: '/product/integrations/discord/',
        destination: '/product/integrations/notification-incidents/discord/',
        permanent: true,
      },
      {
        source: '/product/accounts/early-adopter-features/discord/',
        destination: '/product/integrations/notification-incidents/discord/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/pagerduty/',
        destination: '/product/integrations/notification-incidents/pagerduty/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/legacy-integrations/pagerduty/',
        destination: '/product/integrations/notification-incidents/pagerduty/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/global-integrations/pagerduty/',
        destination: '/product/integrations/notification-incidents/pagerduty/',
        permanent: true,
      },
      {
        source: '/product/integrations/pagerduty/',
        destination: '/product/integrations/notification-incidents/pagerduty/',
        permanent: true,
      },
      {
        source: '/product/integrations/notification-incidents/amixr/',
        destination: '/product/integrations/notification-incidents/',
        permanent: true,
      },
      {
        source: '/product/integrations/msteams/',
        destination: '/product/integrations/notification-incidents/msteams/',
        permanent: true,
      },
      {
        source: '/product/integrations/threads/',
        destination: '/product/integrations/notification-incidents/threads/',
        permanent: true,
      },
      {
        source: '/product/integrations/rootly/',
        destination: '/product/integrations/notification-incidents/rootly/',
        permanent: true,
      },
      {
        source: '/product/integrations/spikesh/',
        destination: '/product/integrations/notification-incidents/spikesh/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/slack/',
        destination: '/product/integrations/notification-incidents/slack/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/legacy-integrations/slack/',
        destination: '/product/integrations/notification-incidents/slack/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/global-integrations/slack/',
        destination: '/product/integrations/notification-incidents/slack/',
        permanent: true,
      },
      {
        source: '/integrations/slack/',
        destination: '/product/integrations/notification-incidents/slack/',
        permanent: true,
      },
      {
        source: '/product/integrations/slack/',
        destination: '/product/integrations/notification-incidents/slack/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/integration-platform/ui-components/',
        destination: '/product/integrations/integration-platform/ui-components/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/integration-platform/',
        destination: '/product/integrations/integration-platform/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/integration-platform/webhooks/',
        destination: '/product/integrations/integration-platform/webhooks/',
        permanent: true,
      },
      {
        source: '/product/integrations/openreplay/',
        destination: '/product/integrations/session-replay/openreplay/',
        permanent: true,
      },
      {
        source: '/product/integrations/fullstory/',
        destination: '/product/integrations/session-replay/fullstory/',
        permanent: true,
      },
      {
        source: '/product/integrations/jam/',
        destination: '/product/integrations/session-replay/jam/',
        permanent: true,
      },
      {
        source: '/product/integrations/atlas/',
        destination: '/product/integrations/session-replay/atlas/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/split/',
        destination: '/product/integrations/feature-flag/split/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/global-integrations/split/',
        destination: '/product/integrations/feature-flag/split/',
        permanent: true,
      },
      {
        source: '/product/integrations/split/',
        destination: '/product/integrations/feature-flag/split/',
        permanent: true,
      },
      {
        source: '/product/integrations/launchdarkly/',
        destination: '/product/integrations/feature-flag/launchdarkly/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/vercel/',
        destination: '/product/integrations/deployment/vercel/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/global-integrations/vercel/',
        destination: '/product/integrations/deployment/vercel/',
        permanent: true,
      },
      {
        source: '/product/integrations/vercel/',
        destination: '/product/integrations/deployment/vercel/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/heroku/',
        destination: '/product/integrations/deployment/heroku/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/legacy-integrations/gitlab/',
        destination: '/product/integrations/deployment/heroku/',
        permanent: true,
      },
      {
        source: '/product/integrations/heroku/',
        destination: '/product/integrations/deployment/heroku/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/clubhouse/',
        destination: '/product/integrations/issue-tracking/shortcut/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/legacy-integrations/clubhouse/',
        destination: '/product/integrations/issue-tracking/shortcut/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/global-integrations/clubhouse/',
        destination: '/product/integrations/issue-tracking/shortcut/',
        permanent: true,
      },
      {
        source: '/product/integrations/clubhouse/',
        destination: '/product/integrations/issue-tracking/shortcut/',
        permanent: true,
      },
      {
        source: '/product/integrations/issue-tracking/clubhouse/',
        destination: '/product/integrations/issue-tracking/shortcut/',
        permanent: true,
      },
      {
        source: '/product/integrations/shortcut/',
        destination: '/product/integrations/issue-tracking/shortcut/',
        permanent: true,
      },
      {
        source: '/product/integrations/project-mgmt/shortcut/',
        destination: '/product/integrations/issue-tracking/shortcut/',
        permanent: true,
      },
      {
        source: '/product/integrations/sourcegraph/',
        destination: '/product/integrations/issue-tracking/sourcegraph/',
        permanent: true,
      },
      {
        source: '/product/integrations/incidentio/',
        destination: '/product/integrations/issue-tracking/incidentio/',
        permanent: true,
      },
      {
        source: '/product/integrations/height/',
        destination: '/product/integrations/issue-tracking/height/',
        permanent: true,
      },
      {
        source: '/product/integrations/project-mgmt/',
        destination: '/product/integrations/issue-tracking/',
        permanent: true,
      },
      {
        source: '/product/integrations/linear/',
        destination: '/product/integrations/issue-tracking/linear/',
        permanent: true,
      },
      {
        source: '/product/integrations/project-mgmt/linear/',
        destination: '/product/integrations/issue-tracking/linear/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/clickup/',
        destination: '/product/integrations/issue-tracking/clickup/',
        permanent: true,
      },
      {
        source: '/integrations/clickup/',
        destination: '/product/integrations/issue-tracking/clickup/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/global-integrations/clickup/',
        destination: '/product/integrations/issue-tracking/clickup/',
        permanent: true,
      },
      {
        source: '/product/integrations/clickup/',
        destination: '/product/integrations/issue-tracking/clickup/',
        permanent: true,
      },
      {
        source: '/product/integrations/project-mgmt/clickup/',
        destination: '/product/integrations/issue-tracking/clickup/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/jira-server/',
        destination: '/product/integrations/issue-tracking/jira/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/jira/',
        destination: '/product/integrations/issue-tracking/jira/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/global-integrations/jira-server/',
        destination: '/product/integrations/issue-tracking/jira/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/global-integrations/jira/',
        destination: '/product/integrations/issue-tracking/jira/',
        permanent: true,
      },
      {
        source: '/workflow/legacy-integrations/jira/',
        destination: '/product/integrations/issue-tracking/jira/',
        permanent: true,
      },
      {
        source: '/product/integrations/jira/',
        destination: '/product/integrations/issue-tracking/jira/',
        permanent: true,
      },
      {
        source: '/product/integrations/project-mgmt/jira/',
        destination: '/product/integrations/issue-tracking/jira/',
        permanent: true,
      },
      {
        source: '/integrations/jira/',
        destination: '/product/integrations/issue-tracking/jira/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/asana/',
        destination: '/product/integrations/issue-tracking/asana/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/legacy-integrations/asana/',
        destination: '/product/integrations/issue-tracking/asana/',
        permanent: true,
      },
      {
        source: '/workflow/integrations/global-integrations/asana/',
        destination: '/product/integrations/issue-tracking/asana/',
        permanent: true,
      },
      {
        source: '/product/integrations/asana/',
        destination: '/product/integrations/issue-tracking/asana/',
        permanent: true,
      },
      {
        source: '/product/integrations/project-mgmt/asana/',
        destination: '/product/integrations/issue-tracking/asana/',
        permanent: true,
      },
      {
        source: '/product/integrations/teamwork/',
        destination: '/product/integrations/issue-tracking/teamwork/',
        permanent: true,
      },
      {
        source: '/product/integrations/project-mgmt/teamwork/',
        destination: '/product/integrations/issue-tracking/teamwork/',
        permanent: true,
      },
      {
        source: '/workflow/user-settings/',
        destination: '/product/accounts/user-settings/',
        permanent: true,
      },
      {
        source: '/product/accounts/early-adopter/',
        destination: '/product/accounts/early-adopter-features/',
        permanent: true,
      },
      {
        source: '/pricing/',
        destination: '/product/accounts/pricing/',
        permanent: true,
      },
      {
        source: '/learn/pricing/',
        destination: '/product/accounts/pricing/',
        permanent: true,
      },
      {
        source: '/product/pricing/',
        destination: '/product/accounts/pricing/',
        permanent: true,
      },
      {
        source: '/learn/quotas/',
        destination: '/product/accounts/quotas/',
        permanent: true,
      },
      {
        source: '/product/quotas/',
        destination: '/product/accounts/quotas/',
        permanent: true,
      },
      {
        source: '/product/data-management-settings/dynamic-sampling/',
        destination: '/product/accounts/quotas/',
        permanent: true,
      },
      {
        source: '/product/data-management-settings/dynamic-sampling/getting-started/',
        destination: '/product/accounts/quotas/',
        permanent: true,
      },
      {
        source:
          '/product/data-management-settings/dynamic-sampling/benefits-dynamic-sampling/',
        destination: '/product/accounts/quotas/',
        permanent: true,
      },
      {
        source: '/guides/manage-event-stream/',
        destination: '/product/accounts/quotas/manage-event-stream-guide/',
        permanent: true,
      },
      {
        source: '/learn/sso/',
        destination: '/product/accounts/sso/',
        permanent: true,
      },
      {
        source: '/product/sso/',
        destination: '/product/accounts/sso/',
        permanent: true,
      },
      {
        source: '/accounts/saml2/',
        destination: '/product/accounts/sso/saml2/',
        permanent: true,
      },
      {
        source: '/guides/getting-started/',
        destination: '/product/accounts/getting-started/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/getting-started/',
        destination: '/product/accounts/getting-started/',
        permanent: true,
      },
      {
        source: '/learn/membership/',
        destination: '/product/accounts/membership/',
        permanent: true,
      },
      {
        source: '/product/membership/',
        destination: '/product/accounts/membership/',
        permanent: true,
      },
      {
        source: '/guides/migration/',
        destination: '/product/accounts/migration/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/migration/',
        destination: '/product/accounts/migration/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/migration/',
        destination: '/product/accounts/migration/',
        permanent: true,
      },
      {
        source: '/product/dashboards/customize-dashboards/',
        destination: '/product/dashboards/custom-dashboards/',
        permanent: true,
      },
      {
        source: '/workflow/visibility/',
        destination: '/product/dashboards/',
        permanent: true,
      },
      {
        source: '/workflow/dashboards/',
        destination: '/product/dashboards/',
        permanent: true,
      },
      {
        source: '/product/error-monitoring/dashboards/',
        destination: '/product/dashboards/',
        permanent: true,
      },
      {
        source: '/profiling/',
        destination: '/product/profiling/',
        permanent: true,
      },
      {
        source: '/profiling/performance-overhead/',
        destination: '/product/profiling/performance-overhead/',
        permanent: true,
      },
      {
        source: '/profiling/setup/',
        destination: '/product/profiling/getting-started/',
        permanent: true,
      },
      {
        source: '/profiling/getting-started/',
        destination: '/product/profiling/getting-started/',
        permanent: true,
      },
      {
        source: '/profiling/mobile-app-profiling',
        destination: '/product/profiling/mobile-app-profiling/',
        permanent: true,
      },
      {
        source: '/profiling/mobile-app-profiling/metrics/',
        destination: '/product/profiling/mobile-app-profiling/metrics/',
        permanent: true,
      },
      {
        source: '/product/error-monitoring/filtering/',
        destination: '/product/data-management-settings/filtering/',
        permanent: true,
      },
      {
        source: '/product/data-management-settings/event-grouping/grouping-breakdown/',
        destination: '/product/data-management-settings/',
        permanent: true,
      },
      {
        source: '/data-management/rollups/',
        destination: '/product/data-management-settings/event-grouping/',
        permanent: true,
      },
      {
        source: '/learn/rollups/',
        destination: '/product/data-management-settings/event-grouping/',
        permanent: true,
      },
      {
        source: '/data-management/event-grouping/',
        destination: '/product/data-management-settings/event-grouping/',
        permanent: true,
      },
      {
        source: '/product/data-management-settings/event-grouping/grouping-breakdown/',
        destination: '/product/data-management-settings/event-grouping/',
        permanent: true,
      },
      {
        source: '/platforms/unity/data-management/event-grouping/',
        destination: '/product/data-management-settings/event-grouping/',
        permanent: true,
      },
      {
        source: '/platforms/php/data-management/event-grouping/stack-trace-rules/',
        destination: '/product/data-management-settings/event-grouping/',
        permanent: true,
      },
      {
        source:
          '/product/data-management-settings/event-grouping/server-side-fingerprinting/',
        destination:
          '/product/data-management-settings/event-grouping/fingerprint-rules/',
        permanent: true,
      },
      {
        source: '/learn/data-forwarding/',
        destination: '/product/data-management-settings/data-forwarding/',
        permanent: true,
      },
      {
        source: '/product/data-forwarding/',
        destination: '/product/data-management-settings/data-forwarding/',
        permanent: true,
      },
      {
        source: '/platforms/data-management/',
        destination: '/product/data-management-settings/data-forwarding/',
        permanent: true,
      },
      {
        source: '/data-management-settings/attachment-datascrubbing/',
        destination: '/product/data-management-settings/scrubbing/attachment-scrubbing/',
        permanent: true,
      },
      {
        source: '/product/data-management-settings/advanced-datascrubbing/',
        destination: '/product/data-management-settings/scrubbing/',
        permanent: true,
      },
      {
        source: '/platforms/data-management/',
        destination:
          '/product/data-management-settings/scrubbing/advanced-datascrubbing/',
        permanent: true,
      },
      {
        source: '/data-management/advanced-datascrubbing/',
        destination:
          '/product/data-management-settings/scrubbing/advanced-datascrubbing/',
        permanent: true,
      },
      {
        source: '/data-management-settings/advanced-datascrubbing/',
        destination:
          '/product/data-management-settings/scrubbing/advanced-datascrubbing/',
        permanent: true,
      },
      {
        source: '/data-management-settings/server-side-scrubbing/',
        destination: '/product/data-management-settings/scrubbing/server-side-scrubbing/',
        permanent: true,
      },
      {
        source: '/data-management-settings/event-pii-fields/',
        destination:
          '/product/data-management-settings/scrubbing/server-side-scrubbing/event-pii-fields/',
        permanent: true,
      },
      {
        source: '/product/discover/',
        destination: '/product/discover-queries/',
        permanent: true,
      },
      {
        source: '/workflow/discover/',
        destination: '/product/discover-queries/',
        permanent: true,
      },
      {
        source: '/workflow/discover2/',
        destination: '/product/discover-queries/',
        permanent: true,
      },
      {
        source: '/performance-monitoring/discover/',
        destination: '/product/discover-queries/',
        permanent: true,
      },
      {
        source: '/performance-monitoring/discover-queries/',
        destination: '/product/discover-queries/',
        permanent: true,
      },
      {
        source: '/performance/discover/',
        destination: '/product/discover-queries/',
        permanent: true,
      },
      {
        source: '/guides/discover/',
        destination: '/product/discover-queries/uncover-trends/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/discover/',
        destination: '/product/discover-queries/uncover-trends/',
        permanent: true,
      },
      {
        source: '/workflow/discover2/query-builder/',
        destination: '/product/discover-queries/query-builder/',
        permanent: true,
      },
      {
        source: '/performance-monitoring/discover-queries/query-builder/',
        destination: '/product/discover-queries/query-builder/',
        permanent: true,
      },
      {
        source: '/product/crons/alerts/',
        destination: '/product/crons/getting-started/',
        permanent: true,
      },
      {
        source: '/meta/relay/best-practices/',
        destination: '/product/relay/operating-guidelines/',
        permanent: true,
      },
      {
        source: '/product/relay/best-practices/',
        destination: '/product/relay/operating-guidelines/',
        permanent: true,
      },
      {
        source: '/meta/relay/',
        destination: '/product/relay/',
        permanent: true,
      },
      {
        source: '/product/security/relay/',
        destination: '/product/relay/',
        permanent: true,
      },
      {
        source: '/meta/relay/projects/',
        destination: '/product/relay/projects/',
        permanent: true,
      },
      {
        source: '/meta/relay/getting-started/',
        destination: '/product/relay/getting-started/',
        permanent: true,
      },
      {
        source: '/meta/relay/pii-and-data-scrubbing/',
        destination: '/product/relay/pii-and-data-scrubbing/',
        permanent: true,
      },
      {
        source: '/meta/relay/options/',
        destination: '/product/relay/options/',
        permanent: true,
      },
      {
        source: '/meta/relay/metrics/',
        destination: '/product/relay/monitoring/collected-metrics/',
        permanent: true,
      },
      {
        source: '/meta/relay/logging/',
        destination: '/product/relay/monitoring/',
        permanent: true,
      },
      {
        source: '/meta/relay/modes/',
        destination: '/product/relay/modes/',
        permanent: true,
      },
      {
        source: '/product/performance/database/',
        destination: '/product/performance/queries/',
        permanent: true,
      },
      {
        source: '/product/performance/query-insights/',
        destination: '/product/performance/queries/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/metrics/',
        destination: '/product/performance/retention-priorities/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/sampling/',
        destination: '/product/performance/retention-priorities/',
        permanent: true,
      },
      {
        source: '/product/data-management-settings/server-side-sampling/',
        destination: '/product/performance/retention-priorities/',
        permanent: true,
      },
      {
        source: '/product/data-management-settings/server-side-sampling/getting-started/',
        destination: '/product/performance/retention-priorities/',
        permanent: true,
      },
      {
        source:
          '/product/data-management-settings/server-side-sampling/current-limitations/',
        destination: '/product/performance/retention-priorities/',
        permanent: true,
      },
      {
        source:
          '/product/data-management-settings/server-side-sampling/sampling-configurations/',
        destination: '/product/performance/retention-priorities/',
        permanent: true,
      },
      {
        source: '/product/data-management-settings/dynamic-sampling/current-limitations/',
        destination: '/product/performance/retention-priorities/',
        permanent: true,
      },
      {
        source:
          '/product/data-management-settings/dynamic-sampling/sampling-configurations/',
        destination: '/product/performance/retention-priorities/',
        permanent: true,
      },
      {
        source: '/product/data-management-settings/dynamic-sampling/',
        destination: '/product/performance/retention-priorities/',
        permanent: true,
      },
      {
        source: '/product/performance/performance-at-scale/',
        destination: '/product/performance/retention-priorities/',
        permanent: true,
      },
      {
        source: '/product/performance/performance-at-scale/getting-started/',
        destination: '/product/performance/retention-priorities/',
        permanent: true,
      },
      {
        source:
          '/product/performance/performance-at-scale/benefits-performance-at-scale/',
        destination: '/product/performance/retention-priorities/',
        permanent: true,
      },
      {
        source: '/performance/',
        destination: '/product/performance/',
        permanent: true,
      },
      {
        source: '/performance/display/',
        destination: '/product/performance/',
        permanent: true,
      },
      {
        source: '/performance-monitoring/performance/',
        destination: '/product/performance/',
        permanent: true,
      },
      {
        source: '/performance/performance-tab/',
        destination: '/product/performance/',
        permanent: true,
      },
      {
        source: '/performance/performance-homepage/',
        destination: '/product/performance/',
        permanent: true,
      },
      {
        source: '/performance-monitoring/setup/',
        destination: '/product/performance/getting-started/',
        permanent: true,
      },
      {
        source: '/performance-monitoring/getting-started/',
        destination: '/product/performance/getting-started/',
        permanent: true,
      },
      {
        source: '/performance-monitoring/performance/metrics/',
        destination: '/product/performance/metrics/',
        permanent: true,
      },
      {
        source: '/product/performance/display/',
        destination: '/product/performance/filters-display/',
        permanent: true,
      },
      {
        source: '/product/issues/issue-owners/',
        destination: '/product/issues/ownership-rules/',
        permanent: true,
      },
      {
        source: '/product/issue-owners/',
        destination: '/product/issues/ownership-rules/',
        permanent: true,
      },
      {
        source: '/workflow/issue-owners/',
        destination: '/product/issues/ownership-rules/',
        permanent: true,
      },
      {
        source: '/learn/issue-owners/',
        destination: '/product/issues/ownership-rules/',
        permanent: true,
      },
      {
        source: '/features/owners/',
        destination: '/product/issues/ownership-rules/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/issue-owners/',
        destination: '/product/issues/ownership-rules/',
        permanent: true,
      },
      {
        source: '/product/error-monitoring/issue-owners/',
        destination: '/product/issues/ownership-rules/',
        permanent: true,
      },
      {
        source: '/product/releases/suspect-commits/',
        destination: '/product/issues/suspect-commits/',
        permanent: true,
      },
      {
        source: '/product/error-monitoring/',
        destination: '/product/issues/',
        permanent: true,
      },
      {
        source: '/product/error-monitoring/reprocessing/',
        destination: '/product/issues/reprocessing/',
        permanent: true,
      },
      {
        source: '/product/accounts/early-adopter-features/issue-archiving/',
        destination: '/product/issues/states-triage/',
        permanent: true,
      },
      {
        source: '/product/issues/performance-issues/regex-decoding-main-thread/',
        destination:
          '/product/issues/issue-details/performance-issues/regex-main-thread/',
        permanent: true,
      },
      {
        source: '/product/issues/performance-issues/consecutive-http/',
        destination: '/product/issues/issue-details/performance-issues/consecutive-http/',
        permanent: true,
      },
      {
        source: '/product/issues/performance-issues/slow-db-queries/',
        destination: '/product/issues/issue-details/performance-issues/slow-db-queries/',
        permanent: true,
      },
      {
        source: '/product/issues/performance-issues/image-decoding-main-thread/',
        destination:
          '/product/issues/issue-details/performance-issues/image-decoding-main-thread/',
        permanent: true,
      },
      {
        source: '/product/issues/performance-issues/',
        destination: '/product/issues/issue-details/performance-issues/',
        permanent: true,
      },
      {
        source: '/product/issues/issue-details/performance-issues/main-thread-io/',
        destination: '/product/issues/issue-details/performance-issues/',
        permanent: true,
      },
      {
        source: '/product/issues/performance-issues/n-one-queries/',
        destination: '/product/issues/issue-details/performance-issues/n-one-queries/',
        permanent: true,
      },
      {
        source: '/product/issues/performance-issues/uncompressed-asset/',
        destination:
          '/product/issues/issue-details/performance-issues/uncompressed-asset/',
        permanent: true,
      },
      {
        source: '/product/issues/performance-issues/consecutive-db-queries/',
        destination:
          '/product/issues/issue-details/performance-issues/consecutive-db-queries/',
        permanent: true,
      },
      {
        source: '/product/issues/performance-issues/json-decoding-main-thread/',
        destination:
          '/product/issues/issue-details/performance-issues/json-decoding-main-thread/',
        permanent: true,
      },
      {
        source: '/product/issues/performance-issues/http-overhead/',
        destination: '/product/issues/issue-details/performance-issues/http-overhead/',
        permanent: true,
      },
      {
        source: '/product/issues/performance-issues/large-render-blocking-asset/',
        destination:
          '/product/issues/issue-details/performance-issues/large-render-blocking-asset/',
        permanent: true,
      },
      {
        source: '/product/issues/performance-issues/frame-drop/',
        destination: '/product/issues/issue-details/performance-issues/frame-drop/',
        permanent: true,
      },
      {
        source: '/product/issues/performance-issues/large-http-payload/',
        destination:
          '/product/issues/issue-details/performance-issues/large-http-payload/',
        permanent: true,
      },
      {
        source: '/product/error-monitoring/breadcrumbs/',
        destination: '/product/issues/issue-details/breadcrumbs/',
        permanent: true,
      },
      {
        source: '/learn/breadcrumbs/',
        destination: '/product/issues/issue-details/breadcrumbs/',
        permanent: true,
      },
      {
        source: '/product/issues/issue-details/suggested-fix/',
        destination: '/product/issues/issue-details/ai-suggested-solution/',
        permanent: true,
      },
      {
        source: '/guides/grouping-and-fingerprints/',
        destination: '/product/issues/grouping-and-fingerprints/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/guides/grouping-and-fingerprints/',
        destination: '/product/issues/grouping-and-fingerprints/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/grouping-and-fingerprints/',
        destination: '/product/issues/grouping-and-fingerprints/',
        permanent: true,
      },
      {
        source: '/product/accounts/quotas/org-stats/',
        destination: '/product/stats/',
        permanent: true,
      },
      {
        source: '/workflow/search/',
        destination: '/product/reference/search/',
        permanent: true,
      },
      {
        source: '/product/search/',
        destination: '/product/reference/search/',
        permanent: true,
      },
      {
        source: '/learn/search/',
        destination: '/product/reference/search/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/search/',
        destination: '/product/reference/search/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/search/saved-searches/',
        destination: '/product/reference/search/saved-searches/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/search/searchable-properties/user-feedback/',
        destination: '/product/reference/search/searchable-properties/user-feedback/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/search/searchable-properties/events/',
        destination: '/product/reference/search/searchable-properties/events/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/search/searchable-properties/issues/',
        destination: '/product/reference/search/searchable-properties/issues/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/search/searchable-properties/',
        destination: '/product/reference/search/searchable-properties/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/search/searchable-properties/releases/',
        destination: '/product/reference/search/searchable-properties/releases/',
        permanent: true,
      },
      {
        source: '/product/sentry-basics/search/searchable-properties/session-replay/',
        destination: '/product/reference/search/searchable-properties/session-replay/',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkExtractFrontmatter, remarkCodeTitles, remarkCodeTabs],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrismPlus, {ignoreMissing: true}],
      // [rehypePrismDiff, {remove: true}],
      rehypePresetMinify,
    ],
  },
});

nextConfig = withMDX(nextConfig);

// Injected content via Sentry wizard below

nextConfig = withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: 'sentry',
    project: 'docs',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);

export default nextConfig;
