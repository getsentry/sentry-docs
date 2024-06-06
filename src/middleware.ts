import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

// This env var is set in next.config.js based on the `DEVELOPER_DOCS` env var at build time
// a workaround edge middleware not having access to env vars
const isDeveloperDocs = process.env.DEVELOPER_DOCS_;

export const config = {
  // learn more: https://nextjs.org/docs/pages/building-your-application/routing/middleware#matcher
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - changelog
    '/((?!api|_next/static|_next/image|favicon.ico|changelog).*)',
  ],
};

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return handleRedirects(request);
}

const handleRedirects = (request: NextRequest) => {
  const urlPath = request.nextUrl.pathname;

  const redirectTo = redirectMap.get(urlPath);
  if (redirectTo) {
    return NextResponse.redirect(new URL(redirectTo, request.url), {status: 301});
  }

  // If we don't find an exact match, we try to look for a :guide placeholder
  const guidePlaceholer = '/guides/:guide/';
  const guideRegex = /\/guides\/(\w+)\//g;
  const match = guideRegex.exec(urlPath);

  if (!match) {
    return undefined;
  }

  const pathWithPlaceholder = urlPath.replace(guideRegex, guidePlaceholer);
  const guide = match[1];

  const redirectToGuide = redirectMap.get(pathWithPlaceholder);
  if (redirectToGuide) {
    const finalRedirectToPath = redirectToGuide.replace(
      guidePlaceholer,
      `/guides/${guide}/`
    );

    return NextResponse.redirect(new URL(finalRedirectToPath, request.url), {
      status: 301,
    });
  }

  return undefined;
};

type Redirect = {
  /** a string with a leading and a trailing slash */
  from: `/${string}/`;
  to: string;
};

/** Note: if you want to set redirects for developer docs, set them below in `DEVELOPER_DOCS_REDIRECTS` */
const SDK_DOCS_REDIRECTS: Redirect[] = [
  {
    from: '/platforms/javascript/performance/instrumentation/custom-instrumentation/caches-module/',
    to: '/platforms/javascript/guides/node/performance/instrumentation/custom-instrumentation/caches-module/',
  },
  {
    from: '/organization/integrations/github/',
    to: '/organization/integrations/source-code-mgmt/github/',
  },
  {
    from: '/organization/integrations/gitlab/',
    to: '/organization/integrations/source-code-mgmt/gitlab/',
  },
  {
    from: '/organization/integrations/bitbucket/',
    to: '/organization/integrations/source-code-mgmt/bitbucket/',
  },
  {
    from: '/organization/integrations/rookout/',
    to: '/organization/integrations/debugging/rookout/',
  },
  {
    from: '/organization/integrations/split/',
    to: '/organization/integrations/feature-flag/split/',
  },
  {
    from: '/organization/integrations/teamwork/',
    to: '/organization/integrations/issue-tracking/teamwork/',
  },
  {
    from: '/organization/integrations/jira/',
    to: '/organization/integrations/issue-tracking/jira/',
  },
  {
    from: '/organization/integrations/linear/',
    to: '/organization/integrations/issue-tracking/linear/',
  },
  {
    from: '/organization/integrations/clickup/',
    to: '/organization/integrations/issue-tracking/clickup/',
  },
  {
    from: '/organization/integrations/project-mgmt/shortcut/',
    to: '/organization/integrations/issue-tracking/shortcut/',
  },
  {
    from: '/organization/integrations/slack/',
    to: '/organization/integrations/notification-incidents/slack/',
  },
  {
    from: '/organization/integrations/pagerduty/',
    to: '/organization/integrations/notification-incidents/pagerduty/',
  },
  {
    from: '/organization/integrations/vanta/',
    to: '/organization/integrations/compliance/vanta/',
  },
  {
    from: '/organization/integrations/jam/',
    to: '/organization/integrations/session-replay/jam/',
  },
  {
    from: '/product/crons/getting-started/cli/',
    to: '/cli/crons/',
  },
  {
    from: '/product/data-management-settings/dynamic-sampling/',
    to: '/product/performance/',
  },
  {
    from: '/platforms/data-management/',
    to: '/concepts/data-management/',
  },
  {
    from: '/platforms/javascript/sourcemaps/troubleshooting/',
    to: '/platforms/javascript/sourcemaps/',
  },
  {
    from: '/platforms/react-native/install/cocoapods/',
    to: '/platforms/react-native/manual-setup/manual-setup/',
  },
  {
    from: '/platforms/react-native/install/',
    to: '/platforms/react-native/manual-setup/manual-setup/',
  },
  {
    from: '/platforms/unity/data-management/event-grouping/sdk-fingerprinting/',
    to: '/platforms/unity/usage/sdk-fingerprinting/',
  },
  {
    from: '/platforms/unity/native-support/building-ios/',
    to: '/platforms/unity/native-support/',
  },
  {
    from: '/platforms/unity/unity-lite/',
    to: '/platforms/unity/migration/',
  },
  {
    from: '/platforms/go/config/',
    to: '/platforms/go/configuration/options/',
  },
  {
    from: '/platforms/go/goroutines/',
    to: '/platforms/go/usage/concurrency/',
  },
  {
    from: '/platforms/go/concurrency/',
    to: '/platforms/go/usage/concurrency/',
  },
  {
    from: '/platforms/go/panics/',
    to: '/platforms/go/usage/panics/',
  },
  {
    from: '/platforms/go/serverless/',
    to: '/platforms/go/usage/serverless/',
  },
  {
    from: '/platforms/go/martini/',
    to: '/platforms/go/guides/martini/',
  },
  {
    from: '/platforms/go/fasthttp/',
    to: '/platforms/go/guides/fasthttp/',
  },
  {
    from: '/platforms/go/echo/',
    to: '/platforms/go/guides/echo/',
  },
  {
    from: '/platforms/go/iris/',
    to: '/platforms/go/guides/iris/',
  },
  {
    from: '/platforms/go/negroni/',
    to: '/platforms/go/guides/negroni/',
  },
  {
    from: '/clients/go/integrations/http/',
    to: '/platforms/go/guides/http/',
  },
  {
    from: '/platforms/go/http/',
    to: '/platforms/go/guides/http/',
  },
  {
    from: '/platforms/go/gin/',
    to: '/platforms/go/guides/gin/',
  },
  {
    from: '/clients/go/config/',
    to: '/platforms/go/legacy-sdk/config/',
  },
  {
    from: '/clients/go/index/',
    to: '/platforms/go/legacy-sdk/',
  },
  {
    from: '/clients/go/integrations/',
    to: '/platforms/go/legacy-sdk/integrations/',
  },
  {
    from: '/clients/go/usage/',
    to: '/platforms/go/legacy-sdk/usage/',
  },
  {
    from: '/clients/go/context/',
    to: '/platforms/go/legacy-sdk/context/',
  },
  {
    from: '/platforms/qt/',
    to: '/platforms/native/guides/qt/',
  },
  {
    from: '/platforms/native/qt/',
    to: '/platforms/native/guides/qt/',
  },
  {
    from: '/platforms/breakpad/',
    to: '/platforms/native/guides/breakpad/',
  },
  {
    from: '/platforms/native/breakpad/',
    to: '/platforms/native/guides/breakpad/',
  },
  {
    from: '/platforms/minidump/',
    to: '/platforms/native/guides/minidumps/',
  },
  {
    from: '/platforms/native/minidump/',
    to: '/platforms/native/guides/minidumps/',
  },
  {
    from: '/clients/minidump/',
    to: '/platforms/native/guides/minidumps/',
  },
  {
    from: '/platforms/react-native/advanced-setup/',
    to: '/platforms/react-native/manual-setup/manual-setup/',
  },
  {
    from: '/platforms/react-native/codepush/',
    to: '/platforms/react-native/manual-setup/codepush/',
  },
  {
    from: '/platforms/react-native/hermes/',
    to: '/platforms/react-native/manual-setup/hermes/',
  },
  {
    from: '/platforms/react-native/ram-bundles/',
    to: '/platforms/react-native/manual-setup/ram-bundles/',
  },
  {
    from: '/platforms/react-native/performance/sampling/',
    to: '/platforms/react-native/configuration/sampling/',
  },
  {
    from: '/platforms/react-native/configuration/integrations/plugin/',
    to: '/platforms/react-native/integrations/plugin/',
  },
  {
    from: '/platforms/react-native/configuration/integrations/',
    to: '/platforms/react-native/integrations/',
  },
  {
    from: '/platforms/react-native/configuration/integrations/custom/',
    to: '/platforms/react-native/integrations/custom/',
  },
  {
    from: '/platforms/react-native/configuration/integrations/default/',
    to: '/platforms/react-native/integrations/default/',
  },
  {
    from: '/platforms/react-native/configuration/integrations/redux/',
    to: '/platforms/react-native/integrations/redux/',
  },
  {
    from: '/platforms/react-native/manual-setup/sourcemaps/',
    to: '/platforms/react-native/sourcemaps/',
  },
  {
    from: '/platforms/python/data-collected/',
    to: '/platforms/python/data-management/data-collected/',
  },
  {
    from: '/platforms/python/flask/',
    to: '/platforms/python/integrations/flask/',
  },
  {
    from: '/platforms/python/aiohttp/',
    to: '/platforms/python/integrations/aiohttp/',
  },
  {
    from: '/platforms/python/gcp_functions/',
    to: '/platforms/python/integrations/gcp-functions/',
  },
  {
    from: '/platforms/python/serverless/',
    to: '/platforms/python/integrations/serverless/',
  },
  {
    from: '/clients/python/integrations/pyramid/',
    to: '/platforms/python/integrations/pyramid/',
  },
  {
    from: '/platforms/python/pyramid/',
    to: '/platforms/python/integrations/pyramid/',
  },
  {
    from: '/clients/python/integrations/starlette/',
    to: '/platforms/python/integrations/starlette/',
  },
  {
    from: '/platforms/python/starlette/',
    to: '/platforms/python/integrations/starlette/',
  },
  {
    from: '/clients/python/integrations/lambda/',
    to: '/platforms/python/integrations/aws-lambda/',
  },
  {
    from: '/platforms/python/aws_lambda/',
    to: '/platforms/python/integrations/aws-lambda/',
  },
  {
    from: '/platforms/python/airflow/',
    to: '/platforms/python/integrations/airflow/',
  },
  {
    from: '/platforms/python/tornado/',
    to: '/platforms/python/integrations/tornado/',
  },
  {
    from: '/clients/python/integrations/tornado/',
    to: '/platforms/python/integrations/tornado/',
  },
  {
    from: '/platforms/python/chalice/',
    to: '/platforms/python/integrations/chalice/',
  },
  {
    from: '/clients/python/integrations/fastapi/',
    to: '/platforms/python/integrations/fastapi/',
  },
  {
    from: '/platforms/python/fastapi/',
    to: '/platforms/python/integrations/fastapi/',
  },
  {
    from: '/platforms/python/sanic/',
    to: '/platforms/python/integrations/sanic/',
  },
  {
    from: '/clients/python/integrations/starlite/',
    to: '/platforms/python/integrations/starlite/',
  },
  {
    from: '/platforms/python/starlite/',
    to: '/platforms/python/integrations/starlite/',
  },
  {
    from: '/platforms/python/beam/',
    to: '/platforms/python/integrations/beam/',
  },
  {
    from: '/clients/python/integrations/celery/',
    to: '/platforms/python/integrations/celery/',
  },
  {
    from: '/platforms/python/celery/',
    to: '/platforms/python/integrations/celery/',
  },
  {
    from: '/platforms/python/hints/',
    to: '/platforms/python/integrations/celery/',
  },
  {
    from: '/clients/python/integrations/django/',
    to: '/platforms/python/integrations/django/',
  },
  {
    from: '/platforms/python/django/',
    to: '/platforms/python/integrations/django/',
  },
  {
    from: '/platforms/python/falcon/',
    to: '/platforms/python/integrations/falcon/',
  },
  {
    from: '/clients/python/integrations/logging/',
    to: '/platforms/python/integrations/logging/',
  },
  {
    from: '/platforms/python/logging/',
    to: '/platforms/python/integrations/logging/',
  },
  {
    from: '/clients/python/integrations/rq/',
    to: '/platforms/python/integrations/rq/',
  },
  {
    from: '/platforms/python/rq/',
    to: '/platforms/python/integrations/rq/',
  },
  {
    from: '/clients/python/integrations/bottle/',
    to: '/platforms/python/integrations/bottle/',
  },
  {
    from: '/platforms/python/bottle/',
    to: '/platforms/python/integrations/bottle/',
  },
  {
    from: '/platforms/python/pyspark/',
    to: '/platforms/python/integrations/spark/',
  },
  {
    from: '/platforms/python/integrations/pyspark/',
    to: '/platforms/python/integrations/spark/',
  },
  {
    from: '/platforms/python/tryton/',
    to: '/platforms/python/integrations/tryton/',
  },
  {
    from: '/clients/python/breadcrumbs/',
    to: '/platforms/python/legacy-sdk/breadcrumbs/',
  },
  {
    from: '/clients/python/platform-support/',
    to: '/platforms/python/legacy-sdk/platform-support/',
  },
  {
    from: '/clients/python/integrations/',
    to: '/platforms/python/legacy-sdk/integrations/',
  },
  {
    from: '/clients/python/api/',
    to: '/platforms/python/legacy-sdk/api/',
  },
  {
    from: '/clients/python/advanced/',
    to: '/platforms/python/legacy-sdk/advanced/',
  },
  {
    from: '/clients/python/usage/',
    to: '/platforms/python/legacy-sdk/usage/',
  },
  {
    from: '/clients/python/transports/',
    to: '/platforms/python/legacy-sdk/transports/',
  },
  {
    from: '/platforms/python/contextvars/',
    to: '/platforms/python/troubleshooting/',
  },
  {
    from: '/platforms/dart/usage/advanced-usage/',
    to: '/platforms/dart/integrations/http-integration/',
  },
  {
    from: '/platforms/dart/configuration/integrations/http-integration/',
    to: '/platforms/dart/integrations/http-integration/',
  },
  {
    from: '/platforms/dart/configuration/integrations/file/',
    to: '/platforms/dart/integrations/file/',
  },
  {
    from: '/platforms/dart/configuration/integrations/',
    to: '/platforms/dart/integrations/',
  },
  {
    from: '/platforms/dart/configuration/integrations/logging/',
    to: '/platforms/dart/integrations/logging/',
  },
  {
    from: '/platforms/dart/configuration/integrations/dio/',
    to: '/platforms/dart/integrations/dio/',
  },
  {
    from: '/quickstart/',
    to: '/platforms/',
  },
  {
    from: '/clients/',
    to: '/platforms/',
  },
  {
    from: '/platforms/perl/',
    to: '/platforms/',
  },
  {
    from: '/platforms/node/guides/serverless-cloud/typescript/',
    to: '/platforms/',
  },
  {
    from: '/clients/rust/',
    to: '/platforms/rust/',
  },
  {
    from: '/platforms/rust/log/',
    to: '/platforms/rust/',
  },
  {
    from: '/platforms/rust/profiling/',
    to: '/platforms/rust/',
  },
  {
    from: '/platforms/rust/actix/',
    to: '/platforms/rust/guides/actix-web/',
  },
  {
    from: '/platforms/rust/guides/actix-web/profiling/',
    to: '/platforms/rust/guides/actix-web/',
  },
  {
    from: '/clients/java/modules/log4j2/',
    to: '/platforms/java/legacy/log4j2/',
  },
  {
    from: '/clients/java/',
    to: '/platforms/java/legacy/',
  },
  {
    from: '/clients/java/migration/',
    to: '/platforms/java/legacy/migration/',
  },
  {
    from: '/clients/java/usage/',
    to: '/platforms/java/legacy/usage/',
  },
  {
    from: '/clients/java/modules/appengine/',
    to: '/platforms/java/legacy/google-app-engine/',
  },
  {
    from: '/clients/java/context/',
    to: '/platforms/java/scope/',
  },
  {
    from: '/clients/java/modules/jul/',
    to: '/platforms/java/guides/jul/',
  },
  {
    from: '/platforms/java/guides/jul/config/',
    to: '/platforms/java/guides/jul/',
  },
  {
    from: '/clients/java/modules/logback/',
    to: '/platforms/java/guides/logback/',
  },
  {
    from: '/platforms/java/guides/logback/config/',
    to: '/platforms/java/guides/logback/',
  },
  {
    from: '/platforms/java/guides/spring/config/',
    to: '/platforms/java/guides/spring/',
  },
  {
    from: '/platforms/java/guides/springboot/config/',
    to: '/platforms/java/guides/spring-boot/',
  },
  {
    from: '/clients/php/integrations/monolog/',
    to: '/platforms/php/',
  },
  {
    from: '/platforms/php/default-integrations/',
    to: '/platforms/php/integrations/',
  },
  {
    from: '/platforms/php/guides/symfony/config/',
    to: '/platforms/php/guides/symfony/configuration/symfony-options/',
  },
  {
    from: '/clients/php/integrations/symfony2/',
    to: '/platforms/php/guides/symfony/',
  },
  {
    from: '/platforms/php/symfony/',
    to: '/platforms/php/guides/symfony/',
  },
  {
    from: '/platforms/php/guides/symfony/performance/pm-integrations/',
    to: '/platforms/php/guides/symfony/performance/instrumentation/automatic-instrumentation/',
  },
  {
    from: '/clients/php/integrations/laravel/',
    to: '/platforms/php/guides/laravel/',
  },
  {
    from: '/platforms/php/laravel/',
    to: '/platforms/php/guides/laravel/',
  },
  {
    from: '/platforms/php/guides/laravel/lumen/',
    to: '/platforms/php/guides/laravel/',
  },
  {
    from: '/platforms/php/guides/laravel/configuration/other-versions/laravel4/',
    to: '/platforms/php/guides/laravel/other-versions/laravel4/',
  },
  {
    from: '/platforms/php/guides/laravel/other-versions/laravel5-6-7/',
    to: '/platforms/php/guides/laravel/other-versions/',
  },
  {
    from: '/platforms/php/guides/laravel/configuration/other-versions/lumen/',
    to: '/platforms/php/guides/laravel/other-versions/lumen/',
  },
  {
    from: '/clients/php/config/',
    to: '/platforms/php/legacy-sdk/config/',
  },
  {
    from: '/clients/php/',
    to: '/platforms/php/legacy-sdk/',
  },
  {
    from: '/clients/php/integrations/',
    to: '/platforms/php/legacy-sdk/integrations/',
  },
  {
    from: '/clients/php/usage/',
    to: '/platforms/php/legacy-sdk/usage/',
  },
  {
    from: '/platforms/dotnet/configuration/cli-integration/',
    to: '/platforms/dotnet/configuration/msbuild/',
  },
  {
    from: '/platforms/dotnet/aspnetcore/',
    to: '/platforms/dotnet/guides/aspnetcore/',
  },
  {
    from: '/platforms/dotnet/guides/aspnetcore/ignoring-exceptions/',
    to: '/platforms/dotnet/guides/aspnetcore/',
  },
  {
    from: '/platforms/dotnet/log4net/',
    to: '/platforms/dotnet/guides/log4net/',
  },
  {
    from: '/platforms/dotnet/microsoft-extensions-logging/',
    to: '/platforms/dotnet/guides/extensions-logging/',
  },
  {
    from: '/platforms/dotnet/entityframework/',
    to: '/platforms/dotnet/guides/entityframework/',
  },
  {
    from: '/platforms/dotnet/maui/',
    to: '/platforms/dotnet/guides/maui/',
  },
  {
    from: '/platforms/dotnet/wpf/',
    to: '/platforms/dotnet/guides/wpf/',
  },
  {
    from: '/platforms/dotnet/winforms/',
    to: '/platforms/dotnet/guides/winforms/',
  },
  {
    from: '/platforms/dotnet/guides/winforms/ignoring-exceptions/',
    to: '/platforms/dotnet/guides/winforms/',
  },
  {
    from: '/platforms/dotnet/google.cloud.functions/',
    to: '/platforms/dotnet/guides/google-cloud-functions/',
  },
  {
    from: '/platforms/dotnet/winui/',
    to: '/platforms/dotnet/guides/winui/',
  },
  {
    from: '/platforms/dotnet/serilog/',
    to: '/platforms/dotnet/guides/serilog/',
  },
  {
    from: '/platforms/dotnet/uwp/',
    to: '/platforms/dotnet/guides/uwp/',
  },
  {
    from: '/platforms/dotnet/nlog/',
    to: '/platforms/dotnet/guides/nlog/',
  },
  {
    from: '/platforms/flutter/configuration/integrations/user-interaction-instrumentation/',
    to: '/platforms/flutter/integrations/user-interaction-instrumentation/',
  },
  {
    from: '/platforms/flutter/configuration/integrations/',
    to: '/platforms/flutter/integrations/',
  },
  {
    from: '/platforms/flutter/configuration/integrations/sqflite-instrumentation/',
    to: '/platforms/flutter/integrations/sqflite-instrumentation/',
  },
  {
    from: '/platforms/flutter/usage/advanced-usage/',
    to: '/platforms/flutter/troubleshooting/',
  },
  {
    from: '/platforms/android/manual-configuration/',
    to: '/platforms/android/configuration/manual-init/',
  },
  {
    from: '/platforms/android/advanced-usage/',
    to: '/platforms/android/configuration/using-ndk/',
  },
  {
    from: '/platforms/android/using-ndk/',
    to: '/platforms/android/configuration/using-ndk/',
  },
  {
    from: '/platforms/android/gradle/',
    to: '/platforms/android/configuration/gradle/',
  },
  {
    from: '/platforms/android/configuration/integrations/apollo3/',
    to: '/platforms/android/integrations/apollo3/',
  },
  {
    from: '/platforms/android/configuration/integrations/',
    to: '/platforms/android/integrations/',
  },
  {
    from: '/platforms/android/configuration/integrations/logcat/',
    to: '/platforms/android/integrations/logcat/',
  },
  {
    from: '/platforms/android/configuration/jetpack-compose/',
    to: '/platforms/android/integrations/jetpack-compose/',
  },
  {
    from: '/platforms/android/configuration/integrations/jetpack-compose/',
    to: '/platforms/android/integrations/jetpack-compose/',
  },
  {
    from: '/platforms/android/configuration/integrations/navigation/',
    to: '/platforms/android/integrations/navigation/',
  },
  {
    from: '/platforms/android/configuration/integrations/room-and-sqlite/',
    to: '/platforms/android/integrations/room-and-sqlite/',
  },
  {
    from: '/platforms/android/configuration/integrations/file-io/',
    to: '/platforms/android/integrations/file-io/',
  },
  {
    from: '/platforms/android/performance/instrumentation/apollo/',
    to: '/platforms/android/integrations/apollo/',
  },
  {
    from: '/platforms/android/configuration/integrations/apollo/',
    to: '/platforms/android/integrations/apollo/',
  },
  {
    from: '/platforms/android/configuration/integrations/fragment/',
    to: '/platforms/android/integrations/fragment/',
  },
  {
    from: '/platforms/android/timber/',
    to: '/platforms/android/integrations/timber/',
  },
  {
    from: '/platforms/android/guides/timber/',
    to: '/platforms/android/integrations/timber/',
  },
  {
    from: '/platforms/android/configuration/integrations/timber/',
    to: '/platforms/android/integrations/timber/',
  },
  {
    from: '/platforms/android/guides/okhttp/',
    to: '/platforms/android/integrations/okhttp/',
  },
  {
    from: '/platforms/android/configuration/integrations/okhttp/',
    to: '/platforms/android/integrations/okhttp/',
  },
  {
    from: '/platforms/android/migrate/',
    to: '/platforms/android/migration/',
  },
  {
    from: '/platforms/android/proguard/',
    to: '/platforms/android/enhance-errors/proguard/',
  },
  {
    from: '/platforms/android/source-context/',
    to: '/platforms/android/enhance-errors/source-context/',
  },
  {
    from: '/platforms/android/kotlin-compiler-plugin/',
    to: '/platforms/android/enhance-errors/kotlin-compiler-plugin/',
  },
  {
    from: '/platforms/javascript/configuration/integrations/plugin/',
    to: '/platforms/javascript/configuration/integrations/',
  },
  {
    from: '/platforms/javascript/configuration/integrations/default/',
    to: '/platforms/javascript/configuration/integrations/',
  },
  {
    from: '/platforms/javascript/integrations/custom/',
    to: '/platforms/javascript/configuration/integrations/custom/',
  },
  {
    from: '/platforms/javascript/loader/',
    to: '/platforms/javascript/install/loader/',
  },
  {
    from: '/platforms/javascript/install/lazy-load-sentry/',
    to: '/platforms/javascript/install/loader/',
  },
  {
    from: '/platforms/javascript/install/cdn/',
    to: '/platforms/javascript/install/loader/',
  },
  {
    from: '/platforms/javascript/integrations/rrweb/',
    to: '/platforms/javascript/session-replay/',
  },
  {
    from: '/platforms/javascript/configuration/integrations/rrweb/',
    to: '/platforms/javascript/session-replay/',
  },
  {
    from: '/platforms/javascript/guides/angular/configuration/integrations/rrweb/',
    to: '/platforms/javascript/session-replay/',
  },
  {
    from: '/platforms/javascript/guides/capacitor/configuration/integrations/rrweb/',
    to: '/platforms/javascript/session-replay/',
  },
  {
    from: '/platforms/javascript/guides/cordova/configuration/integrations/rrweb/',
    to: '/platforms/javascript/session-replay/',
  },
  {
    from: '/platforms/javascript/guides/ember/configuration/integrations/rrweb/',
    to: '/platforms/javascript/session-replay/',
  },
  {
    from: '/platforms/javascript/guides/gatsby/configuration/integrations/rrweb/',
    to: '/platforms/javascript/session-replay/',
  },
  {
    from: '/platforms/javascript/guides/nextjs/configuration/integrations/rrweb/',
    to: '/platforms/javascript/session-replay/',
  },
  {
    from: '/platforms/javascript/guides/react/configuration/integrations/rrweb/',
    to: '/platforms/javascript/session-replay/',
  },
  {
    from: '/platforms/javascript/guides/remix/configuration/integrations/rrweb/',
    to: '/platforms/javascript/session-replay/',
  },
  {
    from: '/platforms/javascript/guides/svelte/configuration/integrations/rrweb/',
    to: '/platforms/javascript/session-replay/',
  },
  {
    from: '/platforms/javascript/guides/vue/configuration/integrations/rrweb/',
    to: '/platforms/javascript/session-replay/',
  },
  {
    from: '/platforms/javascript/guides/wasm/configuration/integrations/rrweb/',
    to: '/platforms/javascript/session-replay/',
  },
  {
    from: '/platforms/javascript/guides/remix/session-replay/custom-instrumentation/',
    to: '/platforms/javascript/session-replay/',
  },
  {
    from: '/platforms/javascript/guides/remix/session-replay/custom-instrumentation/privacy-configuration/',
    to: '/platforms/javascript/session-replay/',
  },
  {
    from: '/platforms/javascript/guides/gatsby/session-replay/custom-instrumentation/',
    to: '/platforms/javascript/session-replay/',
  },
  {
    from: '/platforms/unreal/setup-crashreport/',
    to: '/platforms/unreal/configuration/setup-crashreporter/',
  },
  {
    from: '/platforms/unreal/setup-crashreporter/',
    to: '/platforms/unreal/configuration/setup-crashreporter/',
  },
  {
    from: '/platforms/unreal/debug-symbols/',
    to: '/platforms/unreal/configuration/debug-symbols/',
  },
  {
    from: '/clients/ruby/config/',
    to: '/platforms/ruby/configuration/options/',
  },
  {
    from: '/platforms/ruby/config/',
    to: '/platforms/ruby/configuration/options/',
  },
  {
    from: '/contributing/approach/write-getting-started/',
    to: '/contributing/approach/sdk-docs/write-getting-started/',
  },
  {
    from: '/contributing/approach/write-data-management/',
    to: '/contributing/approach/sdk-docs/write-data-management/',
  },
  {
    from: '/contributing/approach/write-sdk-docs/',
    to: '/contributing/approach/sdk-docs/',
  },
  {
    from: '/contributing/approach/write-configuration/',
    to: '/contributing/approach/sdk-docs/write-configuration/',
  },
  {
    from: '/contributing/approach/common_content/',
    to: '/contributing/approach/sdk-docs/common_content/',
  },
  {
    from: '/contributing/approach/write-performance/',
    to: '/contributing/approach/sdk-docs/write-performance/',
  },
  {
    from: '/contributing/approach/write-enriching-events/',
    to: '/contributing/approach/sdk-docs/write-enriching-events/',
  },
  {
    from: '/contributing/approach/write-usage/',
    to: '/contributing/approach/sdk-docs/write-usage/',
  },
  {
    from: '/learn/releases/',
    to: '/product/releases/',
  },
  {
    from: '/workflow/releases/',
    to: '/product/releases/',
  },
  {
    from: '/workflow/releases/index/',
    to: '/product/releases/',
  },
  {
    from: '/workflow/releases/release-automation/',
    to: '/product/releases/',
  },
  {
    from: '/product/releases/release-automation/',
    to: '/product/releases/',
  },
  {
    from: '/workflow/releases/health/',
    to: '/product/releases/health/',
  },
  {
    from: '/product/releases/health/crash/',
    to: '/product/releases/health/',
  },
  {
    from: '/product/releases/health/setup/',
    to: '/product/releases/setup/',
  },
  {
    from: '/workflow/releases/release-automation/travis-ci/',
    to: '/product/releases/setup/release-automation/travis-ci/',
  },
  {
    from: '/workflow/releases/release-automation/circleci/',
    to: '/product/releases/setup/release-automation/circleci/',
  },
  {
    from: '/workflow/releases/release-automation/netlify/',
    to: '/product/releases/setup/release-automation/netlify/',
  },
  {
    from: '/workflow/releases/release-automation/jenkins/',
    to: '/product/releases/setup/release-automation/jenkins/',
  },
  {
    from: '/workflow/releases/release-automation/bitbucket-pipelines/',
    to: '/product/releases/setup/release-automation/bitbucket-pipelines/',
  },
  {
    from: '/workflow/releases/release-automation/github-actions/',
    to: '/product/releases/setup/release-automation/github-deployment-gates/',
  },
  {
    from: '/product/releases/setup/manual-setup-releases/',
    to: '/product/releases/associate-commits/',
  },
  {
    from: '/product/releases/health/release-details/',
    to: '/product/releases/release-details/',
  },
  {
    from: '/guides/integrate-frontend/upload-source-maps/',
    to: '/product/sentry-basics/integrate-frontend/upload-source-maps/',
  },
  {
    from: '/product/sentry-basics/guides/integrate-frontend/upload-source-maps/',
    to: '/product/sentry-basics/integrate-frontend/upload-source-maps/',
  },
  {
    from: '/guides/integrate-frontend/configure-scms/',
    to: '/product/sentry-basics/integrate-frontend/configure-scms/',
  },
  {
    from: '/product/sentry-basics/guides/integrate-frontend/configure-scms/',
    to: '/product/sentry-basics/integrate-frontend/configure-scms/',
  },
  {
    from: '/guides/integrate-frontend/',
    to: '/product/sentry-basics/integrate-frontend/',
  },
  {
    from: '/product/sentry-basics/guides/integrate-frontend/',
    to: '/product/sentry-basics/integrate-frontend/',
  },
  {
    from: '/product/sentry-basics/frontend/create-new-project/',
    to: '/product/sentry-basics/integrate-frontend/',
  },
  {
    from: '/guides/integrate-frontend/create-new-project/',
    to: '/product/sentry-basics/integrate-frontend/create-new-project/',
  },
  {
    from: '/product/sentry-basics/guides/integrate-frontend/create-new-project/',
    to: '/product/sentry-basics/integrate-frontend/create-new-project/',
  },
  {
    from: '/guides/integrate-frontend/initialize-sentry-sdk/',
    to: '/product/sentry-basics/integrate-frontend/initialize-sentry-sdk/',
  },
  {
    from: '/product/sentry-basics/guides/integrate-frontend/initialize-sentry-sdk/',
    to: '/product/sentry-basics/integrate-frontend/initialize-sentry-sdk/',
  },
  {
    from: '/guides/integrate-frontend/generate-first-error/',
    to: '/product/sentry-basics/integrate-frontend/generate-first-error/',
  },
  {
    from: '/product/sentry-basics/guides/integrate-frontend/generate-first-error/',
    to: '/product/sentry-basics/integrate-frontend/generate-first-error/',
  },
  {
    from: '/basics/',
    to: '/product/sentry-basics/',
  },
  {
    from: '/product/sentry-basics/guides/',
    to: '/product/sentry-basics/',
  },
  {
    from: '/product/sentry-basics/tracing/',
    to: '/product/sentry-basics/concepts/tracing/',
  },
  {
    from: '/performance/distributed-tracing/',
    to: '/product/sentry-basics/concepts/tracing/distributed-tracing/',
  },
  {
    from: '/performance-monitoring/distributed-tracing/',
    to: '/product/sentry-basics/concepts/tracing/distributed-tracing/',
  },
  {
    from: '/product/sentry-basics/guides/error-tracing/',
    to: '/product/sentry-basics/concepts/tracing/distributed-tracing/',
  },
  {
    from: '/product/performance/distributed-tracing/',
    to: '/product/sentry-basics/concepts/tracing/distributed-tracing/',
  },
  {
    from: '/product/sentry-basics/tracing/distributed-tracing/',
    to: '/product/sentry-basics/concepts/tracing/distributed-tracing/',
  },
  {
    from: '/product/performance/trace-view/',
    to: '/product/sentry-basics/concepts/tracing/trace-view/',
  },
  {
    from: '/product/sentry-basics/tracing/trace-view/',
    to: '/product/sentry-basics/concepts/tracing/trace-view/',
  },
  {
    from: '/product/performance/event-detail/',
    to: '/product/sentry-basics/concepts/key-terms/tracing/trace-view/',
  },
  {
    from: '/product/sentry-basics/tracing/event-detail/',
    to: '/product/sentry-basics/concepts/key-terms/tracing/trace-view/',
  },
  {
    from: '/product/sentry-basics/concepts/tracing/event-detail/',
    to: '/product/sentry-basics/concepts/key-terms/tracing/trace-view/',
  },
  {
    from: '/product/sentry-basics/dsn-explainer/',
    to: '/product/sentry-basics/concepts/dsn-explainer/',
  },
  {
    from: '/enriching-error-data/environments/',
    to: '/product/sentry-basics/concepts/environments/',
  },
  {
    from: '/learn/environments/',
    to: '/product/sentry-basics/concepts/environments/',
  },
  {
    from: '/product/sentry-basics/environments/',
    to: '/product/sentry-basics/concepts/environments/',
  },
  {
    from: '/product/sentry-basics/key-terms/',
    to: '/product/sentry-basics/concepts/key-terms/',
  },
  {
    from: '/guides/enrich-data/',
    to: '/product/sentry-basics/concepts/enrich-data/',
  },
  {
    from: '/product/sentry-basics/guides/enrich-data/',
    to: '/product/sentry-basics/concepts/enrich-data/',
  },
  {
    from: '/product/sentry-basics/enrich-data/',
    to: '/product/sentry-basics/concepts/enrich-data/',
  },
  {
    from: '/guides/integrate-backend/capturing-errors/',
    to: '/product/sentry-basics/integrate-backend/capturing-errors/',
  },
  {
    from: '/product/sentry-basics/guides/integrate-backend/capturing-errors/',
    to: '/product/sentry-basics/integrate-backend/capturing-errors/',
  },
  {
    from: '/guides/integrate-backend/',
    to: '/product/sentry-basics/integrate-backend/',
  },
  {
    from: '/product/sentry-basics/guides/integrate-backend/',
    to: '/product/sentry-basics/integrate-backend/',
  },
  {
    from: '/guides/integrate-backend/configuration-options/',
    to: '/product/sentry-basics/integrate-backend/configuration-options/',
  },
  {
    from: '/product/sentry-basics/guides/integrate-backend/configuration-options/',
    to: '/product/sentry-basics/integrate-backend/configuration-options/',
  },
  {
    from: '/guides/integrate-backend/getting-started/',
    to: '/product/sentry-basics/integrate-backend/getting-started/',
  },
  {
    from: '/product/sentry-basics/guides/integrate-backend/getting-started/',
    to: '/product/sentry-basics/integrate-backend/getting-started/',
  },
  {
    from: '/ssl/',
    to: '/security-legal-pii/security/ssl/',
  },
  {
    from: '/ip-ranges/',
    to: '/security-legal-pii/security/ip-ranges/',
  },
  {
    from: '/learn/security-policy-reporting/',
    to: '/security-legal-pii/security/security-policy-reporting/',
  },
  {
    from: '/error-reporting/security-policy-reporting/',
    to: '/security-legal-pii/security/security-policy-reporting/',
  },
  {
    from: '/platforms/javascript/security-policy-reporting/',
    to: '/security-legal-pii/security/security-policy-reporting/',
  },
  {
    from: '/platforms/javascript/troubleshooting/session-replay/',
    to: '/platforms/javascript/session-replay/troubleshooting/',
  },
  {
    from: '/platforms/javascript/guides/:guide/troubleshooting/session-replay/',
    to: '/platforms/javascript/session-replay/troubleshooting/',
  },
  {
    from: '/sdks/javascript/config/sourcemaps/',
    to: '/platforms/javascript/sourcemaps/',
  },
  {
    from: '/platforms/javascript/sourcemaps/generation/',
    to: '/platforms/javascript/sourcemaps/',
  },
  {
    from: '/platforms/javascript/sourcemaps/availability/',
    to: '/platforms/javascript/sourcemaps/',
  },
  {
    from: '/platforms/javascript/configuration/sourcemaps/',
    to: '/platforms/javascript/sourcemaps/',
  },
  {
    from: '/platforms/javascript/guides/docPlatform/sourcemaps/',
    to: '/platforms/javascript/sourcemaps/',
  },
  {
    from: '/platforms/javascript/guides/:guide/sourcemaps/multiple-origins/',
    to: '/platforms/javascript/sourcemaps/',
  },
  {
    from: '/platforms/javascript/guides/:guide/sourcemaps/uploading/hosting-publicly/',
    to: '/platforms/javascript/sourcemaps/',
  },
  {
    from: '/platforms/javascript/guides/:guide/sourcemaps/uploading-without-debug-ids/',
    to: '/platforms/javascript/sourcemaps/',
  },
  {
    from: '/platforms/javascript/sourcemaps/uploading-without-debug-ids/',
    to: '/platforms/javascript/sourcemaps/troubleshooting_js/',
  },
  {
    from: '/platforms/javascript/guides/nextjs/sourcemaps/troubleshooting_js/legacy-uploading-methods/',
    to: '/platforms/javascript/sourcemaps/troubleshooting_js/',
  },
  {
    from: '/platforms/javascript/sourcemaps/troubleshooting_js/verify-artifact-distribution-value-matches-value-configured-in-your-sdk/',
    to: '/platforms/javascript/sourcemaps/troubleshooting_js/',
  },
  {
    from: '/platforms/javascript/sourcemaps/troubleshooting_js/uploading-without-debug-ids/',
    to: '/platforms/javascript/sourcemaps/troubleshooting_js/legacy-uploading-methods/',
  },
  {
    from: '/platforms/javascript/sourcemaps/tools/webpack/',
    to: '/platforms/javascript/sourcemaps/uploading/webpack/',
  },
  {
    from: '/platforms/javascript/sourcemaps/hosting-publicly/',
    to: '/platforms/javascript/sourcemaps/uploading/hosting-publicly/',
  },
  {
    from: '/platforms/javascript/guides/cordova/troubleshooting/supported-browsers/',
    to: '/platforms/javascript/guides/cordova/troubleshooting/',
  },
  {
    from: '/clients/cordova/ionic/',
    to: '/platforms/javascript/guides/cordova/ionic/',
  },
  {
    from: '/sdks/react/integrations/vue-router/',
    to: '/platforms/javascript/guides/vue/features/vue-router/',
  },
  {
    from: '/platforms/javascript/guides/vue/configuration/integrations/vue-router/',
    to: '/platforms/javascript/guides/vue/features/vue-router/',
  },
  {
    from: '/platforms/javascript/vue/',
    to: '/platforms/javascript/guides/vue/',
  },
  {
    from: '/clients/javascript/integrations/vue/',
    to: '/platforms/javascript/guides/vue/',
  },
  {
    from: '/clients/javascript/integrations/angular/',
    to: '/platforms/javascript/guides/angular/angular1/',
  },
  {
    from: '/platforms/javascript/gatsby/',
    to: '/platforms/javascript/guides/gatsby/',
  },
  {
    from: '/platforms/javascript/guides/gatsby/errors/breadcrumbs/',
    to: '/platforms/javascript/guides/gatsby/',
  },
  {
    from: '/clients/javascript/integrations/ember/',
    to: '/platforms/javascript/guides/ember/',
  },
  {
    from: '/platforms/javascript/ember/',
    to: '/platforms/javascript/guides/ember/',
  },
  {
    from: '/platforms/javascript/guides/electron/configuration/integrations/optional/',
    to: '/platforms/javascript/guides/electron/configuration/integrations/electronminidump/',
  },
  {
    from: '/clients/electron/',
    to: '/platforms/javascript/guides/electron/',
  },
  {
    from: '/platforms/javascript/electron/',
    to: '/platforms/javascript/guides/electron/',
  },
  {
    from: '/platforms/electron/',
    to: '/platforms/javascript/guides/electron/',
  },
  {
    from: '/platforms/javascript/electron/sourcemaps/',
    to: '/platforms/javascript/guides/electron/',
  },
  {
    from: '/platforms/javascript/guides/electron/lazy-load-sentry/',
    to: '/platforms/javascript/guides/electron/',
  },
  {
    from: '/sdks/react/integrations/redux/',
    to: '/platforms/javascript/guides/react/features/redux/',
  },
  {
    from: '/platforms/javascript/guides/react/configuration/integrations/redux/',
    to: '/platforms/javascript/guides/react/features/redux/',
  },
  {
    from: '/platforms/javascript/guides/react/integrations/react-router/',
    to: '/platforms/javascript/guides/react/features/react-router/',
  },
  {
    from: '/platforms/javascript/guides/react/configuration/integrations/react-router/',
    to: '/platforms/javascript/guides/react/features/react-router/',
  },
  {
    from: '/platforms/javascript/react/',
    to: '/platforms/javascript/guides/react/',
  },
  {
    from: '/clients/javascript/integrations/react/',
    to: '/platforms/javascript/guides/react/',
  },
  {
    from: '/sdks/react/',
    to: '/platforms/javascript/guides/react/',
  },
  {
    from: '/platforms/react/',
    to: '/platforms/javascript/guides/react/',
  },
  {
    from: '/clients/javascript/config/',
    to: '/platforms/javascript/legacy-sdk/config/',
  },
  {
    from: '/clients/javascript/install/',
    to: '/platforms/javascript/legacy-sdk/install/',
  },
  {
    from: '/clients/javascript/sourcemaps/',
    to: '/platforms/javascript/legacy-sdk/sourcemaps/',
  },
  {
    from: '/clients/javascript/integrations/',
    to: '/platforms/javascript/legacy-sdk/integrations/',
  },
  {
    from: '/clients/javascript/usage/',
    to: '/platforms/javascript/legacy-sdk/usage/',
  },
  {
    from: '/clients/javascript/tips/',
    to: '/platforms/javascript/legacy-sdk/tips/',
  },
  {
    from: '/platforms/node/pluggable-integrations/',
    to: '/platforms/javascript/guides/node/configuration/integrations/',
  },
  {
    from: '/platforms/node/default-integrations/',
    to: '/platforms/javascript/guides/node/configuration/integrations/',
  },
  {
    from: '/platforms/node/integrations/default-integrations/',
    to: '/platforms/javascript/guides/node/configuration/integrations/',
  },
  {
    from: '/platforms/javascript/guides/:guide/configuration/integrations/pluggable-integrations/',
    to: '/platforms/javascript/guides/:guide/configuration/integrations/',
  },
  {
    from: '/platforms/javascript/guides/:guide/configuration/integrations/default-integrations/',
    to: '/platforms/javascript/guides/:guide/configuration/integrations/',
  },
  {
    from: '/platforms/node/sourcemaps/troubleshooting_js/uploading-without-debug-ids/',
    to: '/platforms/javascript/guides/node/sourcemaps/troubleshooting_js/legacy-uploading-methods/',
  },
  {
    from: '/platforms/node/gcp_functions/',
    to: '/platforms/javascript/guides/gcp-functions/',
  },
  {
    from: '/clients/node/integrations/express/',
    to: '/platforms/javascript/guides/express/',
  },
  {
    from: '/platforms/node/express/',
    to: '/platforms/javascript/guides/express/',
  },
  {
    from: '/platforms/node/guides/express/integrations/default-integrations/',
    to: '/platforms/javascript/guides/express/',
  },
  {
    from: '/platforms/node/aws_lambda/',
    to: '/platforms/javascript/guides/aws-lambda/',
  },
  {
    from: '/platforms/node/azure_functions/',
    to: '/platforms/javascript/guides/azure-functions/',
  },
  {
    from: '/platforms/node/guides/azure-functions/typescript/',
    to: '/platforms/javascript/guides/azure-functions/',
  },
  {
    from: '/clients/node/integrations/connect/',
    to: '/platforms/javascript/guides/connect/',
  },
  {
    from: '/platforms/node/connect/',
    to: '/platforms/javascript/guides/connect/',
  },
  {
    from: '/clients/node/integrations/koa/',
    to: '/platforms/javascript/guides/koa/',
  },
  {
    from: '/platforms/node/koa/',
    to: '/platforms/javascript/guides/koa/',
  },
  {
    from: '/platforms/node/guides/koa/typescript/',
    to: '/platforms/javascript/guides/koa/',
  },
  {
    from: '/clients/node/config/',
    to: '/platforms/javascript/guides/node/legacy-sdk/config/',
  },
  {
    from: '/clients/node/coffeescript/',
    to: '/platforms/javascript/guides/node/legacy-sdk/coffeescript/',
  },
  {
    from: '/clients/node/sourcemaps/',
    to: '/platforms/javascript/guides/node/legacy-sdk/sourcemaps/',
  },
  {
    from: '/clients/node/typescript/',
    to: '/platforms/javascript/guides/node/legacy-sdk/typescript/',
  },
  {
    from: '/platforms/node/typescript/',
    to: '/platforms/javascript/guides/node/legacy-sdk/typescript/',
  },
  {
    from: '/clients/node/integrations/',
    to: '/platforms/javascript/guides/node/legacy-sdk/integrations/',
  },
  {
    from: '/clients/node/usage/',
    to: '/platforms/javascript/guides/node/legacy-sdk/usage/',
  },
  {
    from: '/platforms/node/usage/set-level/',
    to: '/platforms/javascript/guides/node/enriching-events/level/',
  },
  {
    from: '/platforms/node/usage/sdk-fingerprinting/',
    to: '/platforms/javascript/guides/node/enriching-events/fingerprinting/',
  },
  {
    from: '/platforms/node/guides/:guide/usage/set-level/',
    to: '/platforms/javascript/guides/:guide/enriching-events/level/',
  },
  {
    from: '/platforms/node/guides/:guide/usage/sdk-fingerprinting/',
    to: '/platforms/javascript/guides/:guide/enriching-events/fingerprinting/',
  },
  {
    from: '/platforms/javascript/usage/set-level/',
    to: '/platforms/javascript/enriching-events/level/',
  },
  {
    from: '/platforms/javascript/usage/sdk-fingerprinting/',
    to: '/platforms/javascript/enriching-events/fingerprinting/',
  },
  {
    from: '/platforms/javascript/guides/:guide/usage/set-level/',
    to: '/platforms/javascript/guides/:guide/enriching-events/level/',
  },
  {
    from: '/platforms/javascript/guides/:guide/usage/sdk-fingerprinting/',
    to: '/platforms/javascript/guides/:guide/enriching-events/fingerprinting/',
  },
  {
    from: '/learn/cli/configuration/',
    to: '/cli/configuration/',
  },
  {
    from: '/learn/cli/',
    to: '/cli/',
  },
  {
    from: '/learn/cli/releases/',
    to: '/cli/releases/',
  },
  {
    from: '/workflow/alerts-notifications/',
    to: '/product/alerts/',
  },
  {
    from: '/product/alerts-notifications/',
    to: '/product/alerts/',
  },
  {
    from: '/product/sentry-basics/guides/alert-notifications/',
    to: '/product/alerts/',
  },
  {
    from: '/product/alerts/create-alerts/best-practices/',
    to: '/product/alerts/best-practices/',
  },
  {
    from: '/product/sentry-basics/guides/alert-notifications/routing-alerts/',
    to: '/product/alerts/create-alerts/routing-alerts/',
  },
  {
    from: '/product/sentry-basics/guides/alert-notifications/issue-alerts/',
    to: '/product/alerts/create-alerts/issue-alert-config/',
  },
  {
    from: '/product/alerts/alert-settings/',
    to: '/product/alerts/create-alerts/issue-alert-config/',
  },
  {
    from: '/product/alerts-notifications/alert-settings/',
    to: '/product/alerts/create-alerts/issue-alert-config/',
  },
  {
    from: '/product/sentry-basics/guides/alert-notifications/metric-alerts/',
    to: '/product/alerts/create-alerts/metric-alert-config/',
  },
  {
    from: '/workflow/alerts-notifications/alerts/',
    to: '/product/alerts/alert-types/',
  },
  {
    from: '/workflow/notifications/alerts/',
    to: '/product/alerts/alert-types/',
  },
  {
    from: '/product/alerts-notifications/alerts/',
    to: '/product/alerts/alert-types/',
  },
  {
    from: '/product/alerts-notifications/metric-alerts/',
    to: '/product/alerts/alert-types/',
  },
  {
    from: '/product/alerts-notifications/issue-alerts/',
    to: '/product/alerts/alert-types/',
  },
  {
    from: '/product/alerts/create-alerts/crash-rate-alert-config/',
    to: '/product/alerts/alert-types/',
  },
  {
    from: '/workflow/alerts-notifications/notifications/',
    to: '/product/alerts/notifications/',
  },
  {
    from: '/workflow/notifications/workflow/',
    to: '/product/alerts/notifications/',
  },
  {
    from: '/workflow/notifications/',
    to: '/product/alerts/notifications/',
  },
  {
    from: '/product/notifications/',
    to: '/product/alerts/notifications/',
  },
  {
    from: '/learn/notifications/',
    to: '/product/alerts/notifications/',
  },
  {
    from: '/product/alerts-notifications/notifications/',
    to: '/product/alerts/notifications/',
  },
  {
    from: '/product/sentry-basics/guides/alert-notifications/notifications/',
    to: '/product/alerts/notifications/',
  },
  {
    from: '/workflow/integrations/amazon-sqs/',
    to: '/organization/integrations/data-visualization/amazon-sqs/',
  },
  {
    from: '/workflow/integrations/legacy-integrations/amazon-sqs/',
    to: '/organization/integrations/data-visualization/amazon-sqs/',
  },
  {
    from: '/product/integrations/amazon-sqs/',
    to: '/organization/integrations/data-visualization/amazon-sqs/',
  },
  {
    from: '/product/integrations/segment/',
    to: '/organization/integrations/data-visualization/segment/',
  },
  {
    from: '/workflow/integrations/splunk/',
    to: '/organization/integrations/data-visualization/splunk/',
  },
  {
    from: '/workflow/integrations/legacy-integrations/splunk/',
    to: '/organization/integrations/data-visualization/splunk/',
  },
  {
    from: '/product/integrations/splunk/',
    to: '/organization/integrations/data-visualization/splunk/',
  },
  {
    from: '/workflow/integrations/gitlab/',
    to: '/organization/integrations/source-code-mgmt/gitlab/',
  },
  {
    from: '/workflow/integrations/global-integrations/gitlab/',
    to: '/organization/integrations/source-code-mgmt/gitlab/',
  },
  {
    from: '/product/integrations/gitlab/',
    to: '/organization/integrations/source-code-mgmt/gitlab/',
  },
  {
    from: '/workflow/integrations/azure-devops/',
    to: '/organization/integrations/source-code-mgmt/azure-devops/',
  },
  {
    from: '/workflow/integrations/legacy-integrations/azure-devops/',
    to: '/organization/integrations/source-code-mgmt/azure-devops/',
  },
  {
    from: '/workflow/integrations/global-integrations/azure-devops/',
    to: '/organization/integrations/source-code-mgmt/azure-devops/',
  },
  {
    from: '/product/integrations/azure-devops/',
    to: '/organization/integrations/source-code-mgmt/azure-devops/',
  },
  {
    from: '/integrations/azure-devops/',
    to: '/organization/integrations/source-code-mgmt/azure-devops/',
  },
  {
    from: '/workflow/integrations/github/',
    to: '/organization/integrations/source-code-mgmt/github/',
  },
  {
    from: '/workflow/integrations/legacy-integrations/github/',
    to: '/organization/integrations/source-code-mgmt/github/',
  },
  {
    from: '/workflow/integrations/global-integrations/github/',
    to: '/organization/integrations/source-code-mgmt/github/',
  },
  {
    from: '/product/integrations/github/',
    to: '/organization/integrations/source-code-mgmt/github/',
  },
  {
    from: '/integrations/github-enterprise/',
    to: '/organization/integrations/source-code-mgmt/github/',
  },
  {
    from: '/integrations/github/',
    to: '/organization/integrations/source-code-mgmt/github/',
  },
  {
    from: '/workflow/integrations/bitbucket/',
    to: '/organization/integrations/source-code-mgmt/bitbucket/',
  },
  {
    from: '/workflow/integrations/legacy-integrations/bitbucket/',
    to: '/organization/integrations/source-code-mgmt/bitbucket/',
  },
  {
    from: '/workflow/integrations/global-integrations/bitbucket/',
    to: '/organization/integrations/source-code-mgmt/bitbucket/',
  },
  {
    from: '/product/integrations/bitbucket/',
    to: '/organization/integrations/source-code-mgmt/bitbucket/',
  },
  {
    from: '/integrations/bitbucket/',
    to: '/organization/integrations/source-code-mgmt/bitbucket/',
  },
  {
    from: '/integrations/',
    to: '/organization/integrations/',
  },
  {
    from: '/workflow/integrations/',
    to: '/organization/integrations/',
  },
  {
    from: '/workflow/integrations/legacy-integrations/',
    to: '/organization/integrations/',
  },
  {
    from: '/workflow/integrations/global-integrations/',
    to: '/organization/integrations/',
  },
  {
    from: '/workflow/legacy-integrations/',
    to: '/organization/integrations/',
  },
  {
    from: '/workflow/global-integrations/',
    to: '/organization/integrations/',
  },
  {
    from: '/workflow/integrations/rookout/',
    to: '/organization/integrations/debugging/rookout/',
  },
  {
    from: '/workflow/integrations/global-integrations/rookout/',
    to: '/organization/integrations/debugging/rookout/',
  },
  {
    from: '/product/integrations/rookout/',
    to: '/organization/integrations/debugging/rookout/',
  },
  {
    from: '/product/integrations/gcp-cloud-run/',
    to: '/organization/integrations/cloud-monitoring/gcp-cloud-run/',
  },
  {
    from: '/product/integrations/aws-lambda/',
    to: '/organization/integrations/cloud-monitoring/aws-lambda/',
  },
  {
    from: '/product/integrations/cloudflare-workers/',
    to: '/organization/integrations/cloud-monitoring/cloudflare-workers/',
  },
  {
    from: '/product/integrations/vanta/',
    to: '/organization/integrations/compliance/vanta/',
  },
  {
    from: '/product/integrations/truto/',
    to: '/organization/integrations/compliance/truto/',
  },
  {
    from: '/integrations/discord/',
    to: '/organization/integrations/notification-incidents/discord/',
  },
  {
    from: '/product/integrations/discord/',
    to: '/organization/integrations/notification-incidents/discord/',
  },
  {
    from: '/product/accounts/early-adopter-features/discord/',
    to: '/organization/integrations/notification-incidents/discord/',
  },
  {
    from: '/workflow/integrations/pagerduty/',
    to: '/organization/integrations/notification-incidents/pagerduty/',
  },
  {
    from: '/workflow/integrations/legacy-integrations/pagerduty/',
    to: '/organization/integrations/notification-incidents/pagerduty/',
  },
  {
    from: '/workflow/integrations/global-integrations/pagerduty/',
    to: '/organization/integrations/notification-incidents/pagerduty/',
  },
  {
    from: '/product/integrations/pagerduty/',
    to: '/organization/integrations/notification-incidents/pagerduty/',
  },
  {
    from: '/product/integrations/notification-incidents/amixr/',
    to: '/organization/integrations/notification-incidents/',
  },
  {
    from: '/product/integrations/msteams/',
    to: '/organization/integrations/notification-incidents/msteams/',
  },
  {
    from: '/product/integrations/threads/',
    to: '/organization/integrations/notification-incidents/threads/',
  },
  {
    from: '/product/integrations/rootly/',
    to: '/organization/integrations/notification-incidents/rootly/',
  },
  {
    from: '/product/integrations/spikesh/',
    to: '/product/integrations/notification-incidents/spikesh/',
  },
  {
    from: '/workflow/integrations/slack/',
    to: '/product/integrations/notification-incidents/slack/',
  },
  {
    from: '/workflow/integrations/legacy-integrations/slack/',
    to: '/product/integrations/notification-incidents/slack/',
  },
  {
    from: '/workflow/integrations/global-integrations/slack/',
    to: '/product/integrations/notification-incidents/slack/',
  },
  {
    from: '/integrations/slack/',
    to: '/product/integrations/notification-incidents/slack/',
  },
  {
    from: '/product/integrations/slack/',
    to: '/product/integrations/notification-incidents/slack/',
  },
  {
    from: '/workflow/integrations/integration-platform/ui-components/',
    to: '/product/integrations/integration-platform/ui-components/',
  },
  {
    from: '/workflow/integrations/integration-platform/',
    to: '/product/integrations/integration-platform/',
  },
  {
    from: '/workflow/integrations/integration-platform/webhooks/',
    to: '/product/integrations/integration-platform/webhooks/',
  },
  {
    from: '/product/integrations/openreplay/',
    to: '/product/integrations/session-replay/openreplay/',
  },
  {
    from: '/product/integrations/fullstory/',
    to: '/product/integrations/session-replay/fullstory/',
  },
  {
    from: '/product/integrations/jam/',
    to: '/product/integrations/session-replay/jam/',
  },
  {
    from: '/product/integrations/atlas/',
    to: '/product/integrations/session-replay/atlas/',
  },
  {
    from: '/workflow/integrations/split/',
    to: '/product/integrations/feature-flag/split/',
  },
  {
    from: '/workflow/integrations/global-integrations/split/',
    to: '/product/integrations/feature-flag/split/',
  },
  {
    from: '/product/integrations/split/',
    to: '/product/integrations/feature-flag/split/',
  },
  {
    from: '/product/integrations/launchdarkly/',
    to: '/product/integrations/feature-flag/launchdarkly/',
  },
  {
    from: '/workflow/integrations/vercel/',
    to: '/product/integrations/deployment/vercel/',
  },
  {
    from: '/workflow/integrations/global-integrations/vercel/',
    to: '/product/integrations/deployment/vercel/',
  },
  {
    from: '/product/integrations/vercel/',
    to: '/product/integrations/deployment/vercel/',
  },
  {
    from: '/workflow/integrations/heroku/',
    to: '/product/integrations/deployment/heroku/',
  },
  {
    from: '/workflow/integrations/legacy-integrations/gitlab/',
    to: '/product/integrations/deployment/heroku/',
  },
  {
    from: '/product/integrations/heroku/',
    to: '/product/integrations/deployment/heroku/',
  },
  {
    from: '/workflow/integrations/clubhouse/',
    to: '/product/integrations/issue-tracking/shortcut/',
  },
  {
    from: '/workflow/integrations/legacy-integrations/clubhouse/',
    to: '/product/integrations/issue-tracking/shortcut/',
  },
  {
    from: '/workflow/integrations/global-integrations/clubhouse/',
    to: '/product/integrations/issue-tracking/shortcut/',
  },
  {
    from: '/product/integrations/clubhouse/',
    to: '/product/integrations/issue-tracking/shortcut/',
  },
  {
    from: '/product/integrations/issue-tracking/clubhouse/',
    to: '/product/integrations/issue-tracking/shortcut/',
  },
  {
    from: '/product/integrations/shortcut/',
    to: '/product/integrations/issue-tracking/shortcut/',
  },
  {
    from: '/product/integrations/project-mgmt/shortcut/',
    to: '/product/integrations/issue-tracking/shortcut/',
  },
  {
    from: '/product/integrations/sourcegraph/',
    to: '/product/integrations/issue-tracking/sourcegraph/',
  },
  {
    from: '/product/integrations/incidentio/',
    to: '/product/integrations/issue-tracking/incidentio/',
  },
  {
    from: '/product/integrations/height/',
    to: '/product/integrations/issue-tracking/height/',
  },
  {
    from: '/product/integrations/project-mgmt/',
    to: '/product/integrations/issue-tracking/',
  },
  {
    from: '/product/integrations/linear/',
    to: '/product/integrations/issue-tracking/linear/',
  },
  {
    from: '/product/integrations/project-mgmt/linear/',
    to: '/product/integrations/issue-tracking/linear/',
  },
  {
    from: '/workflow/integrations/clickup/',
    to: '/product/integrations/issue-tracking/clickup/',
  },
  {
    from: '/integrations/clickup/',
    to: '/product/integrations/issue-tracking/clickup/',
  },
  {
    from: '/workflow/integrations/global-integrations/clickup/',
    to: '/product/integrations/issue-tracking/clickup/',
  },
  {
    from: '/product/integrations/clickup/',
    to: '/product/integrations/issue-tracking/clickup/',
  },
  {
    from: '/product/integrations/project-mgmt/clickup/',
    to: '/product/integrations/issue-tracking/clickup/',
  },
  {
    from: '/workflow/integrations/jira-server/',
    to: '/product/integrations/issue-tracking/jira/',
  },
  {
    from: '/workflow/integrations/jira/',
    to: '/product/integrations/issue-tracking/jira/',
  },
  {
    from: '/workflow/integrations/global-integrations/jira-server/',
    to: '/product/integrations/issue-tracking/jira/',
  },
  {
    from: '/workflow/integrations/global-integrations/jira/',
    to: '/product/integrations/issue-tracking/jira/',
  },
  {
    from: '/workflow/legacy-integrations/jira/',
    to: '/product/integrations/issue-tracking/jira/',
  },
  {
    from: '/product/integrations/jira/',
    to: '/product/integrations/issue-tracking/jira/',
  },
  {
    from: '/product/integrations/project-mgmt/jira/',
    to: '/product/integrations/issue-tracking/jira/',
  },
  {
    from: '/integrations/jira/',
    to: '/product/integrations/issue-tracking/jira/',
  },
  {
    from: '/workflow/integrations/asana/',
    to: '/product/integrations/issue-tracking/asana/',
  },
  {
    from: '/workflow/integrations/legacy-integrations/asana/',
    to: '/product/integrations/issue-tracking/asana/',
  },
  {
    from: '/workflow/integrations/global-integrations/asana/',
    to: '/product/integrations/issue-tracking/asana/',
  },
  {
    from: '/product/integrations/asana/',
    to: '/product/integrations/issue-tracking/asana/',
  },
  {
    from: '/product/integrations/project-mgmt/asana/',
    to: '/product/integrations/issue-tracking/asana/',
  },
  {
    from: '/product/integrations/teamwork/',
    to: '/product/integrations/issue-tracking/teamwork/',
  },
  {
    from: '/product/integrations/project-mgmt/teamwork/',
    to: '/product/integrations/issue-tracking/teamwork/',
  },
  {
    from: '/workflow/user-settings/',
    to: '/account/user-settings/',
  },
  {
    from: '/product/accounts/early-adopter/',
    to: '/organization/early-adopter-features/',
  },
  {
    from: '/learn/pricing/',
    to: '/pricing/',
  },
  {
    from: '/product/pricing/',
    to: '/pricing/',
  },
  {
    from: '/learn/quotas/',
    to: '/pricing/quotas/',
  },
  {
    from: '/product/quotas/',
    to: '/pricing/quotas/',
  },
  {
    from: '/learn/sensitive-data/',
    to: '/security-legal-pii/scrubbing/',
  },
  {
    from: '/product/data-management-settings/dynamic-sampling/getting-started/',
    to: '/pricing/quotas/',
  },
  {
    from: '/product/data-management-settings/dynamic-sampling/benefits-dynamic-sampling/',
    to: '/pricing/quotas/',
  },
  {
    from: '/guides/manage-event-stream/',
    to: '/pricing/quotas/manage-event-stream-guide/',
  },
  {
    from: '/learn/sso/',
    to: '/organization/authentication/sso/',
  },
  {
    from: '/product/sso/',
    to: '/organization/authentication/sso/',
  },
  {
    from: '/accounts/saml2/',
    to: '/organization/authentication/sso/saml2/',
  },
  {
    from: '/guides/getting-started/',
    to: '/organization/getting-started/',
  },
  {
    from: '/product/sentry-basics/guides/getting-started/',
    to: '/organization/getting-started/',
  },
  {
    from: '/learn/membership/',
    to: '/organization/membership/',
  },
  {
    from: '/product/membership/',
    to: '/organization/membership/',
  },
  {
    from: '/guides/migration/',
    to: '/product/accounts/migration/',
  },
  {
    from: '/product/sentry-basics/guides/migration/',
    to: '/product/accounts/migration/',
  },
  {
    from: '/product/sentry-basics/migration/',
    to: '/product/accounts/migration/',
  },
  {
    from: '/product/dashboards/customize-dashboards/',
    to: '/product/dashboards/custom-dashboards/',
  },
  {
    from: '/workflow/visibility/',
    to: '/product/dashboards/',
  },
  {
    from: '/workflow/dashboards/',
    to: '/product/dashboards/',
  },
  {
    from: '/product/error-monitoring/dashboards/',
    to: '/product/dashboards/',
  },
  {
    from: '/profiling/',
    to: '/product/profiling/',
  },
  {
    from: '/profiling/performance-overhead/',
    to: '/product/profiling/performance-overhead/',
  },
  {
    from: '/profiling/setup/',
    to: '/product/profiling/getting-started/',
  },
  {
    from: '/profiling/getting-started/',
    to: '/product/profiling/getting-started/',
  },
  {
    from: '/profiling/mobile-app-profiling/',
    to: '/product/profiling/mobile-app-profiling/',
  },
  {
    from: '/profiling/mobile-app-profiling/metrics/',
    to: '/product/profiling/mobile-app-profiling/metrics/',
  },
  {
    from: '/product/error-monitoring/filtering/',
    to: '/concepts/data-management/filtering/',
  },
  {
    from: '/data-management/rollups/',
    to: '/concepts/data-management/event-grouping/',
  },
  {
    from: '/learn/rollups/',
    to: '/concepts/data-management/event-grouping/',
  },
  {
    from: '/data-management/event-grouping/',
    to: '/concepts/data-management/event-grouping/',
  },
  {
    from: '/product/data-management-settings/event-grouping/grouping-breakdown/',
    to: '/concepts/data-management/event-grouping/',
  },
  {
    from: '/platforms/unity/data-management/event-grouping/',
    to: '/concepts/data-management/event-grouping/',
  },
  {
    from: '/platforms/php/data-management/event-grouping/stack-trace-rules/',
    to: '/concepts/data-management/event-grouping/',
  },
  {
    from: '/product/data-management-settings/event-grouping/server-side-fingerprinting/',
    to: '/concepts/data-management/event-grouping/fingerprint-rules/',
  },
  {
    from: '/learn/data-forwarding/',
    to: '/concepts/data-management/data-forwarding/',
  },
  {
    from: '/product/data-forwarding/',
    to: '/concepts/data-management/data-forwarding/',
  },
  {
    from: '/data-management-settings/attachment-datascrubbing/',
    to: '/security-legal-pii/scrubbing/attachment-scrubbing/',
  },
  {
    from: '/product/data-management-settings/advanced-datascrubbing/',
    to: '/security-legal-pii/scrubbing/',
  },
  {
    from: '/data-management/advanced-datascrubbing/',
    to: '/security-legal-pii/scrubbing/advanced-datascrubbing/',
  },
  {
    from: '/data-management-settings/advanced-datascrubbing/',
    to: '/security-legal-pii/scrubbing/advanced-datascrubbing/',
  },
  {
    from: '/data-management-settings/server-side-scrubbing/',
    to: '/security-legal-pii/scrubbing/server-side-scrubbing/',
  },
  {
    from: '/data-management-settings/event-pii-fields/',
    to: '/security-legal-pii/scrubbing/server-side-scrubbing/event-pii-fields/',
  },
  {
    from: '/product/discover/',
    to: '/product/discover-queries/',
  },
  {
    from: '/workflow/discover/',
    to: '/product/discover-queries/',
  },
  {
    from: '/workflow/discover2/',
    to: '/product/discover-queries/',
  },
  {
    from: '/performance-monitoring/discover/',
    to: '/product/discover-queries/',
  },
  {
    from: '/performance-monitoring/discover-queries/',
    to: '/product/discover-queries/',
  },
  {
    from: '/performance/discover/',
    to: '/product/discover-queries/',
  },
  {
    from: '/guides/discover/',
    to: '/product/discover-queries/uncover-trends/',
  },
  {
    from: '/product/sentry-basics/guides/discover/',
    to: '/product/discover-queries/uncover-trends/',
  },
  {
    from: '/workflow/discover2/query-builder/',
    to: '/product/discover-queries/query-builder/',
  },
  {
    from: '/performance-monitoring/discover-queries/query-builder/',
    to: '/product/discover-queries/query-builder/',
  },
  {
    from: '/product/crons/alerts/',
    to: '/product/crons/getting-started/',
  },
  {
    from: '/meta/relay/best-practices/',
    to: '/product/relay/operating-guidelines/',
  },
  {
    from: '/product/relay/best-practices/',
    to: '/product/relay/operating-guidelines/',
  },
  {
    from: '/meta/relay/',
    to: '/product/relay/',
  },
  {
    from: '/product/security/relay/',
    to: '/product/relay/',
  },
  {
    from: '/meta/relay/projects/',
    to: '/product/relay/projects/',
  },
  {
    from: '/meta/relay/getting-started/',
    to: '/product/relay/getting-started/',
  },
  {
    from: '/meta/relay/pii-and-data-scrubbing/',
    to: '/product/relay/pii-and-data-scrubbing/',
  },
  {
    from: '/meta/relay/options/',
    to: '/product/relay/options/',
  },
  {
    from: '/meta/relay/metrics/',
    to: '/product/relay/monitoring/collected-metrics/',
  },
  {
    from: '/meta/relay/logging/',
    to: '/product/relay/monitoring/',
  },
  {
    from: '/meta/relay/modes/',
    to: '/product/relay/modes/',
  },
  {
    from: '/product/performance/database/',
    to: '/product/performance/queries/',
  },
  {
    from: '/product/performance/query-insights/',
    to: '/product/performance/queries/',
  },
  {
    from: '/product/sentry-basics/metrics/',
    to: '/product/performance/retention-priorities/',
  },
  {
    from: '/product/sentry-basics/sampling/',
    to: '/product/performance/retention-priorities/',
  },
  {
    from: '/product/data-management-settings/server-side-sampling/',
    to: '/product/performance/retention-priorities/',
  },
  {
    from: '/product/data-management-settings/server-side-sampling/getting-started/',
    to: '/product/performance/retention-priorities/',
  },
  {
    from: '/product/data-management-settings/server-side-sampling/current-limitations/',
    to: '/product/performance/retention-priorities/',
  },
  {
    from: '/product/data-management-settings/server-side-sampling/sampling-configurations/',
    to: '/product/performance/retention-priorities/',
  },
  {
    from: '/product/data-management-settings/dynamic-sampling/current-limitations/',
    to: '/product/performance/retention-priorities/',
  },
  {
    from: '/product/data-management-settings/dynamic-sampling/sampling-configurations/',
    to: '/product/performance/retention-priorities/',
  },
  {
    from: '/product/performance/performance-at-scale/',
    to: '/product/performance/retention-priorities/',
  },
  {
    from: '/product/performance/performance-at-scale/getting-started/',
    to: '/product/performance/retention-priorities/',
  },
  {
    from: '/product/performance/performance-at-scale/benefits-performance-at-scale/',
    to: '/product/performance/retention-priorities/',
  },
  {
    from: '/performance/',
    to: '/product/performance/',
  },
  {
    from: '/performance/display/',
    to: '/product/performance/',
  },
  {
    from: '/performance-monitoring/performance/',
    to: '/product/performance/',
  },
  {
    from: '/performance/performance-tab/',
    to: '/product/performance/',
  },
  {
    from: '/performance/performance-homepage/',
    to: '/product/performance/',
  },
  {
    from: '/performance-monitoring/setup/',
    to: '/product/performance/getting-started/',
  },
  {
    from: '/performance-monitoring/getting-started/',
    to: '/product/performance/getting-started/',
  },
  {
    from: '/performance-monitoring/performance/metrics/',
    to: '/product/performance/metrics/',
  },
  {
    from: '/product/performance/display/',
    to: '/product/performance/filters-display/',
  },
  {
    from: '/product/issues/issue-owners/',
    to: '/product/issues/ownership-rules/',
  },
  {
    from: '/product/issue-owners/',
    to: '/product/issues/ownership-rules/',
  },
  {
    from: '/workflow/issue-owners/',
    to: '/product/issues/ownership-rules/',
  },
  {
    from: '/learn/issue-owners/',
    to: '/product/issues/ownership-rules/',
  },
  {
    from: '/features/owners/',
    to: '/product/issues/ownership-rules/',
  },
  {
    from: '/product/sentry-basics/issue-owners/',
    to: '/product/issues/ownership-rules/',
  },
  {
    from: '/product/error-monitoring/issue-owners/',
    to: '/product/issues/ownership-rules/',
  },
  {
    from: '/product/releases/suspect-commits/',
    to: '/product/issues/suspect-commits/',
  },
  {
    from: '/product/error-monitoring/',
    to: '/product/issues/',
  },
  {
    from: '/product/error-monitoring/reprocessing/',
    to: '/product/issues/reprocessing/',
  },
  {
    from: '/product/accounts/early-adopter-features/issue-archiving/',
    to: '/product/issues/states-triage/',
  },
  {
    from: '/product/issues/performance-issues/regex-decoding-main-thread/',
    to: '/product/issues/issue-details/performance-issues/regex-main-thread/',
  },
  {
    from: '/product/issues/performance-issues/consecutive-http/',
    to: '/product/issues/issue-details/performance-issues/consecutive-http/',
  },
  {
    from: '/product/issues/performance-issues/slow-db-queries/',
    to: '/product/issues/issue-details/performance-issues/slow-db-queries/',
  },
  {
    from: '/product/issues/performance-issues/image-decoding-main-thread/',
    to: '/product/issues/issue-details/performance-issues/image-decoding-main-thread/',
  },
  {
    from: '/product/issues/performance-issues/',
    to: '/product/issues/issue-details/performance-issues/',
  },
  {
    from: '/product/issues/issue-details/performance-issues/main-thread-io/',
    to: '/product/issues/issue-details/performance-issues/',
  },
  {
    from: '/product/issues/performance-issues/n-one-queries/',
    to: '/product/issues/issue-details/performance-issues/n-one-queries/',
  },
  {
    from: '/product/issues/performance-issues/uncompressed-asset/',
    to: '/product/issues/issue-details/performance-issues/uncompressed-asset/',
  },
  {
    from: '/product/issues/performance-issues/consecutive-db-queries/',
    to: '/product/issues/issue-details/performance-issues/consecutive-db-queries/',
  },
  {
    from: '/product/issues/performance-issues/json-decoding-main-thread/',
    to: '/product/issues/issue-details/performance-issues/json-decoding-main-thread/',
  },
  {
    from: '/product/issues/performance-issues/http-overhead/',
    to: '/product/issues/issue-details/performance-issues/http-overhead/',
  },
  {
    from: '/product/issues/performance-issues/large-render-blocking-asset/',
    to: '/product/issues/issue-details/performance-issues/large-render-blocking-asset/',
  },
  {
    from: '/product/issues/performance-issues/frame-drop/',
    to: '/product/issues/issue-details/performance-issues/frame-drop/',
  },
  {
    from: '/product/issues/performance-issues/large-http-payload/',
    to: '/product/issues/issue-details/performance-issues/large-http-payload/',
  },
  {
    from: '/product/error-monitoring/breadcrumbs/',
    to: '/product/issues/issue-details/breadcrumbs/',
  },
  {
    from: '/learn/breadcrumbs/',
    to: '/product/issues/issue-details/breadcrumbs/',
  },
  {
    from: '/product/issues/issue-details/suggested-fix/',
    to: '/product/issues/issue-details/ai-suggested-solution/',
  },
  {
    from: '/guides/grouping-and-fingerprints/',
    to: '/product/issues/grouping-and-fingerprints/',
  },
  {
    from: '/product/sentry-basics/guides/grouping-and-fingerprints/',
    to: '/product/issues/grouping-and-fingerprints/',
  },
  {
    from: '/product/sentry-basics/grouping-and-fingerprints/',
    to: '/product/issues/grouping-and-fingerprints/',
  },
  {
    from: '/product/accounts/quotas/org-stats/',
    to: '/product/stats/',
  },
  {
    from: '/workflow/search/',
    to: '/concepts/search/',
  },
  {
    from: '/product/search/',
    to: '/concepts/search/',
  },
  {
    from: '/learn/search/',
    to: '/concepts/search/',
  },
  {
    from: '/product/sentry-basics/search/',
    to: '/concepts/search/',
  },
  {
    from: '/product/sentry-basics/search/saved-searches/',
    to: '/concepts/search/saved-searches/',
  },
  {
    from: '/product/sentry-basics/search/searchable-properties/user-feedback/',
    to: '/concepts/search/searchable-properties/user-feedback/',
  },
  {
    from: '/product/sentry-basics/search/searchable-properties/events/',
    to: '/concepts/search/searchable-properties/events/',
  },
  {
    from: '/product/sentry-basics/search/searchable-properties/issues/',
    to: '/concepts/search/searchable-properties/issues/',
  },
  {
    from: '/product/sentry-basics/search/searchable-properties/',
    to: '/concepts/search/searchable-properties/',
  },
  {
    from: '/product/sentry-basics/search/searchable-properties/releases/',
    to: '/concepts/search/searchable-properties/releases/',
  },
  {
    from: '/product/sentry-basics/search/searchable-properties/session-replay/',
    to: '/concepts/search/searchable-properties/session-replay/',
  },
  {
    from: '/platforms/javascript/configuration/micro-frontend-support/',
    to: '/platforms/javascript/best-practices/micro-frontends/',
  },
  {
    from: '/platforms/javascript/configuration/sentry-testkit/',
    to: '/platforms/javascript/best-practices/sentry-testkit/',
  },
  {
    from: '/platforms/javascript/configuration/webworkers/',
    to: '/platforms/javascript/best-practices/web-workers/',
  },
  {
    from: '/support/',
    to: 'https://sentry.zendesk.com/hc/en-us/',
  },
  {
    from: '/clients/python/',
    to: '/platforms/python/legacy-sdk/',
  },
  {
    from: '/platforms/javascript/config/sourcemaps/',
    to: '/platforms/javascript/sourcemaps/',
  },
  {
    from: '/platforms/java/config/',
    to: '/platforms/java/configuration/',
  },
  {
    from: '/platforms/native/attachments/',
    to: '/platforms/native/enriching-error-data/attachments/',
  },
  {
    from: '/platforms/python/configuration/integrations/',
    to: '/platforms/python/integrations/',
  },
  {
    from: '/platforms/python/redis/',
    to: '/platforms/python/integrations/redis/',
  },
  {
    from: '/platforms/python/sqlalchemy/',
    to: '/platforms/python/integrations/sqlalchemy/',
  },
  {
    from: '/platforms/python/pure_eval/',
    to: '/platforms/python/integrations/pure_eval/',
  },
  {
    from: '/platforms/python/gnu_backtrace/',
    to: '/platforms/python/integrations/gnu_backtrace/',
  },
  {
    from: '/api/releases/post-organization-release-files/',
    to: '/api/releases/update-an-organization-release-file/',
  },
  {
    from: '/api/releases/post-release-deploys/',
    to: '/api/releases/create-a-new-deploy-for-an-organization/',
  },
  {
    from: '/api/projects/post-project-user-reports/',
    to: '/api/projects/submit-user-feedback/',
  },
  {
    from: '/api/projects/post-project-keys/',
    to: '/api/projects/create-a-new-client-key/',
  },
  {
    from: '/api/events/get-group-events-latest/',
    to: '/api/events/retrieve-the-latest-event-for-an-issue/',
  },
  {
    from: '/api/organizations/get-event-id-lookup/',
    to: '/api/organizations/resolve-an-event-id/',
  },
  {
    from: '/api/events/get-project-group-index/',
    to: '/api/events/list-a-projects-issues/',
  },
  {
    from: '/api/events/get-group-hashes/',
    to: '/api/events/list-an-issues-hashes/',
  },
  {
    from: '/api/projects/get-project-stats/',
    to: '/api/projects/retrieve-event-counts-for-a-project/',
  },
  {
    from: '/api/projects/get-project-index/',
    to: '/api/projects/list-your-projects/',
  },
  {
    from: '/api/organizations/get-organization-users/',
    to: '/api/organizations/list-an-organizations-users/',
  },
  {
    from: '/api/events/get-group-details/',
    to: '/api/events/retrieve-an-issue/',
  },
  {
    from: '/api/events/get-project-event-details/',
    to: '/api/events/retrieve-an-event-for-a-project/',
  },
  {
    from: '/api/events/get-group-tag-key-details/',
    to: '/api/events/retrieve-tag-details/',
  },
  {
    from: '/api/organizations/get-organization-projects/',
    to: '/api/organizations/list-an-organizations-projects/',
  },
  {
    from: '/api/releases/post-project-release-files/',
    to: '/api/releases/upload-a-new-project-release-file/',
  },
  {
    from: '/api/projects/get-project-users/',
    to: '/api/projects/list-a-projects-users/',
  },
  {
    from: '/api/projects/put-project-details/',
    to: '/api/projects/update-a-project/',
  },
  {
    from: '/api/projects/post-debug-files/',
    to: '/api/projects/upload-a-new-file/',
  },
  {
    from: '/api/organizations/get-organization-stats/',
    to: '/api/organizations/retrieve-event-counts-for-an-organization/',
  },
  {
    from: '/api/releases/post-organization-releases/',
    to: '/api/releases/create-a-new-release-for-an-organization/',
  },
  {
    from: '/api/projects/get-project-keys/',
    to: '/api/projects/list-a-projects-client-keys/',
  },
  {
    from: '/api/teams/get-organization-teams/',
    to: '/api/teams/list-an-organizations-teams/',
  },
  {
    from: '/api/teams/post-team-projects/',
    to: '/api/teams/create-a-new-project/',
  },
  {
    from: '/api/events/put-project-group-index/',
    to: '/api/events/bulk-mutate-a-list-of-issues/',
  },
  {
    from: '/api/events/delete-project-group-index/',
    to: '/api/events/bulk-remove-a-list-of-issues/',
  },
  {
    from: '/api/projects/delete-project-details/',
    to: '/api/projects/delete-a-project/',
  },
  {
    from: '/api/events/get-group-events/',
    to: '/api/events/list-an-issues-events/',
  },
  {
    from: '/api/organizations/get-organization-details/',
    to: '/api/organizations/retrieve-an-organization/',
  },
  {
    from: '/api/organizations/experimental-retrieve-release-health-session-statistics/',
    to: '/api/releases/retrieve-release-health-session-statistics/',
  },
  {
    from: '/learn/context/',
    to: '/platform-redirect/?next=/enriching-events/context/',
  },
  {
    from: '/clients/java/config/',
    to: '/platforms/java/configuration/',
  },
  {
    from: '/clientdev/interfaces/http/',
    to: 'https://develop.sentry.dev/sdk/event-payloads/request',
  },
  {
    from: '/clients/csharp/',
    to: '/platforms/dotnet/legacy-sdk/',
  },
  {
    from: '/clients/go/',
    to: '/platforms/go/legacy-sdk/',
  },
  {
    from: '/clients/node/',
    to: '/platforms/node/legacy-sdk/',
  },
  {
    from: '/clients/javascript/',
    to: '/platforms/javascript/legacy-sdk/',
  },
  {
    from: '/clients/ruby/',
    to: '/platforms/ruby/',
  },
  {
    from: '/clients/java/integrations/',
    to: '/platforms/java/',
  },
  {
    from: '/clients/java/modules/android/',
    to: '/platforms/android',
  },
  {
    from: '/clients/javascript/integrations/angular2/',
    to: '/platforms/javascript/guides/angular/',
  },
  {
    from: '/clients/javascript/integrations/angularjs/',
    to: '/platforms/javascript/guides/angular/',
  },
  {
    from: '/platforms/javascript/angular/',
    to: '/platforms/javascript/guides/angular/',
  },
  {
    from: '/node/event-processors/',
    to: '/platforms/node/enriching-events/event-processors/',
  },
  {
    from: '/platforms/node/guides/connect/event-processors/',
    to: '/platforms/node/enriching-events/event-processors/',
  },
  {
    from: '/platforms/javascript/sourcemaps/uploading/multiple-origins/',
    to: '/platforms/javascript/sourcemaps/troubleshooting_js/#multiple-origins',
  },
  {
    from: '/platforms/python/guides/celery/hints/',
    to: '/platforms/python/integrations/celery/',
  },
  {
    from: '/platforms/python/guides/chalice/integrations/',
    to: '/platforms/python/integrations/chalice/',
  },
  {
    from: '/platforms/unrealengine/',
    to: '/platforms/unreal/',
  },
  {
    from: '/platforms/minidump/crashpad/',
    to: '/platforms/native/guides/crashpad/',
  },
  {
    from: '/platforms/minidump/breakpad/',
    to: '/platforms/native/guides/breakpad/',
  },
  {
    from: '/platforms/rust/usage/sdk-fingerprinting/',
    to: '/product/data-management-settings/event-grouping/fingerprint-rules/',
  },
  {
    from: '/platforms/javascript/guides/angular/lazy-load-sentry/',
    to: '/platforms/javascript/guides/angular/',
  },
  {
    from: '/platforms/java/guides/spring/data-management/data-forwarding/',
    to: '/platforms/java/guides/spring/data-management/',
  },
  {
    from: '/platforms/android/usage/advanced-usage/',
    to: '/platforms/android/usage/',
  },
  {
    from: '/platforms/javascript/guides/react/performance/included-instrumentation/',
    to: '/platforms/javascript/guides/react/performance/instrumentation/',
  },
  {
    from: '/platforms/php/guides/symfony/data-management/data-forwarding/',
    to: '/platforms/php/guides/symfony/data-management/',
  },
  {
    from: '/platforms/php/guides/laravel/configuration/transports/',
    to: '/platforms/php/guides/laravel/configuration/laravel-options/',
  },
  {
    from: '/platforms/go/data-management/event-grouping/fingerprint-rules/',
    to: '/platforms/go/data-management/',
  },
  {
    from: '/platforms/elixir/enriching-events/scopes/',
    to: '/platforms/elixir/enriching-events/',
  },
  {
    from: '/platforms/android/performance/custom-instrumentation/',
    to: '/platforms/android/performance/',
  },
  {
    from: '/platforms/elixir/usage/set-level/',
    to: '/platforms/elixir/usage/',
  },
  {
    from: '/platforms/elixir/usage/sdk-fingerprinting/',
    to: '/platforms/elixir/usage/',
  },
  {
    from: '/platforms/elixir/data-management/event-grouping/',
    to: '/platforms/elixir/data-management/',
  },
  {
    from: '/platforms/elixir/configuration/draining/',
    to: '/platforms/elixir/configuration/',
  },
  {
    from: '/clients/ruby/integrations/rails/',
    to: '/platforms/ruby/guides/rails/',
  },
  {
    from: '/platforms/java/configuration/integrations/',
    to: '/platforms/java/integrations/',
  },
  {
    from: '/platforms/apple/configuration/integrations/',
    to: '/platforms/apple/integrations/',
  },
  {
    from: '/platforms/javascript/guides/cordova/integrations/custom/',
    to: '/platforms/javascript/guides/cordova/',
  },
  {
    from: '/platforms/javascript/guides/cordova/config/basics/',
    to: '/platforms/javascript/guides/cordova/configuration/',
  },
  {
    from: '/platforms/javascript/guides/electron/data-management/event-grouping/grouping-enhancements/',
    to: '/platforms/javascript/guides/electron/data-management/',
  },
  {
    from: '/platforms/javascript/guides/ember/configuration/other-versions/ember2/',
    to: '/platforms/javascript/guides/ember/configuration/',
  },
  {
    from: '/platforms/javascript/guides/ember/configuration/other-versions/',
    to: '/platforms/javascript/guides/ember/configuration/',
  },
  {
    from: '/platforms/javascript/guides/angular/components/',
    to: '/platforms/javascript/guides/angular/',
  },
  {
    from: '/platforms/javascript/legacy-sdk/integrations/',
    to: '/platforms/javascript/legacy-sdk/',
  },
  {
    from: '/platforms/javascript/guides/nextjs/manual/',
    to: '/platforms/javascript/guides/nextjs/',
  },
  {
    from: '/platforms/javascript/guides/react/components/errorboundary/',
    to: '/platforms/javascript/guides/react/',
  },
  {
    from: '/platforms/javascript/guides/react/components/profiler/',
    to: '/platforms/javascript/guides/react/',
  },
  {
    from: '/platforms/javascript/guides/remix/install/cdn/',
    to: '/platforms/javascript/guides/remix/#install',
  },
  {
    from: '/platforms/javascript/performance/capturing/group-transactions/',
    to: '/platforms/javascript/performance/',
  },
  {
    from: '/platforms/javascript/sourcemaps/tools/',
    to: '/platforms/javascript/sourcemaps/',
  },
  {
    from: '/product/accounts/pricing/',
    to: '/pricing/',
  },
  {
    from: '/accounts/pricing/',
    to: '/pricing/',
  },
  {
    from: '/platforms/dotnet/compatibility/',
    to: '/platforms/dotnet/',
  },
  {
    from: '/product/session-replay/protecting-user-privacy/',
    to: '/security-legal-pii/scrubbing/protecting-user-privacy/',
  },
  {
    from: '/platforms/javascript/guides/react/features/component-tracking/',
    to: '/platforms/javascript/guides/react/features/component-names/',
  },
  {
    from: '/product/accounts/early-adopter-features/',
    to: '/organization/early-adopter-features/',
  },
  {
    from: '/product/accounts/choose-your-data-center/',
    to: '/organization/data-storage-location/',
  },
  {
    from: '/product/accounts/membership/',
    to: '/organization/membership/',
  },
  {
    from: '/product/accounts/sso/',
    to: '/organization/authentication/sso/',
  },
  {
    from: '/product/accounts/sso/azure-sso/',
    to: '/organization/authentication/sso/azure-sso/',
  },
  {
    from: '/product/accounts/sso/okta-sso/',
    to: '/organization/authentication/sso/okta-sso/',
  },
  {
    from: '/product/accounts/sso/okta-sso/okta-scim/',
    to: '/organization/authentication/sso/okta-sso/okta-scim/',
  },
  {
    from: '/product/accounts/sso/ping-sso/',
    to: '/organization/authentication/sso/ping-sso/',
  },
  {
    from: '/product/accounts/sso/saml2/',
    to: '/organization/authentication/sso/saml2/',
  },
  {
    from: '/product/accounts/getting-started/',
    to: '/organization/getting-started/',
  },
  {
    from: '/product/accounts/require-2fa/',
    to: '/organization/authentication/two-factor-authentication/',
  },
  {
    from: '/product/accounts/quotas/',
    to: '/pricing/quotas/',
  },
  {
    from: '/product/accounts/quotas/spike-protection/',
    to: '/pricing/quotas/spike-protection/',
  },
  {
    from: '/product/accounts/quotas/spend-allocation/',
    to: '/pricing/quotas/spend-allocation/',
  },
  {
    from: '/product/accounts/quotas/manage-event-stream-guide/',
    to: '/pricing/quotas/manage-event-stream-guide/',
  },
  {
    from: '/product/accounts/quotas/manage-transaction-quota/',
    to: '/pricing/quotas/manage-transaction-quota/',
  },
  {
    from: '/product/accounts/quotas/manage-replay-quota/',
    to: '/pricing/quotas/manage-replay-quota/',
  },
  {
    from: '/product/accounts/quotas/manage-attachments-quota/',
    to: '/pricing/quotas/manage-attachments-quota/',
  },
  {
    from: '/product/accounts/quotas/manage-cron-monitors/',
    to: '/pricing/quotas/manage-cron-monitors/',
  },
  {
    from: '/product/accounts/migration/',
    to: '/concepts/migration/',
  },
  {
    from: '/product/accounts/auth-tokens/',
    to: '/account/auth-tokens/',
  },
  {
    from: '/product/accounts/user-settings/',
    to: '/account/user-settings/',
  },
  {
    from: '/product/accounts/',
    to: '/account/',
  },
  {
    from: '/account/getting-started/',
    to: '/organization/getting-started/',
  },
  {
    from: '/account/membership/',
    to: '/organization/membership/',
  },
  {
    from: '/account/early-adopter-features/',
    to: '/organization/early-adopter-features/',
  },
  {
    from: '/account/quotas/',
    to: '/pricing/quotas/',
  },
  {
    from: '/organization/quotas/',
    to: '/pricing/quotas/',
  },
  {
    from: '/account/sso/',
    to: '/organization/authentication/sso/',
  },
  {
    from: '/product/ai-monitoring/',
    to: '/product/llm-monitoring/',
  },
  {
    from: '/product/ai-monitoring/getting-started/',
    to: '/product/llm-monitoring/getting-started/',
  },
  {
    from: '/product/ai-monitoring/getting-started/the-dashboard/',
    to: '/product/llm-monitoring/getting-started/the-dashboard/',
  },
];

const DEVELOPER_DOCS_REDIRECTS: Redirect[] = [];

const redirectMap = new Map(
  (isDeveloperDocs ? DEVELOPER_DOCS_REDIRECTS : SDK_DOCS_REDIRECTS).map(r => [
    r.from as string,
    r.to,
  ])
);
