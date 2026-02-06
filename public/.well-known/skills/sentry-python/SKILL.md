---
name: sentry-python
description: Sentry's Python SDK enables automatic reporting of errors and performance data in your application.
---

# Sentry Python

Sentry's Python SDK enables automatic reporting of errors and performance data in your application.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/python.md - Sentry's Python SDK enables automatic reporting of errors and performance data in your applica...

### Features
- https://docs.sentry.io/platforms/python/usage.md - Learn how to use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/python/logs.md - Structured logs allow you to send, view and query logs sent from your applications within Sentry.
- https://docs.sentry.io/platforms/python/tracing.md - With Tracing, Sentry tracks your software performance, measuring metrics like throughput and l...
- https://docs.sentry.io/platforms/python/tracing/span-lifecycle.md - Learn how to add attributes to spans in Sentry to monitor performance and debug applications.
- https://docs.sentry.io/platforms/python/tracing/span-metrics.md - Learn how to add attributes to spans in Sentry to monitor performance and debug applications 
- https://docs.sentry.io/platforms/python/tracing/span-metrics/examples.md - Examples of using span metrics to debug performance issues and monitor application behavior ac...
- https://docs.sentry.io/platforms/python/tracing/span-metrics/performance-metrics.md - Learn how to attach performance metrics to your Sentry transactions.
- https://docs.sentry.io/platforms/python/tracing/distributed-tracing.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/python/tracing/distributed-tracing/custom-trace-propagation.md
- https://docs.sentry.io/platforms/python/tracing/distributed-tracing/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/python/tracing/distributed-tracing/limiting-trace-propagation.md
- https://docs.sentry.io/platforms/python/tracing/configure-sampling.md - Learn how to configure sampling in your app.
- https://docs.sentry.io/platforms/python/tracing/instrumentation.md - Learn what Sentry instruments automatically, and how to configure spans to capture tracing dat...
- https://docs.sentry.io/platforms/python/tracing/instrumentation/automatic-instrumentation.md - Learn what instrumentation automatically captures transactions.
- https://docs.sentry.io/platforms/python/tracing/instrumentation/opentelemetry.md - Using OpenTelemetry with Sentry Performance.
- https://docs.sentry.io/platforms/python/tracing/instrumentation/custom-instrumentation.md - Learn how to capture performance data on any action in your app.
- https://docs.sentry.io/platforms/python/tracing/instrumentation/custom-instrumentation/ai-agents-module.md - Learn how to manually instrument your code to use Sentry's Agents module.
- https://docs.sentry.io/platforms/python/tracing/instrumentation/custom-instrumentation/mcp-module.md - Learn how to manually instrument your code to use Sentry's MCP monitoring.
- https://docs.sentry.io/platforms/python/tracing/instrumentation/custom-instrumentation/caches-module.md - Learn how to manually instrument your code to use Sentry's Caches module. 
- https://docs.sentry.io/platforms/python/tracing/instrumentation/custom-instrumentation/requests-module.md - Learn how to manually instrument your code to use Sentry's Requests module.
- https://docs.sentry.io/platforms/python/tracing/instrumentation/custom-instrumentation/queues-module.md - Learn how to manually instrument your code to use Sentry's Queues module. 
- https://docs.sentry.io/platforms/python/tracing/troubleshooting.md - Learn how to troubleshoot your tracing setup.
- https://docs.sentry.io/platforms/python/metrics.md - Metrics allow you to send, view and query counters, gauges and measurements sent from your app...
- https://docs.sentry.io/platforms/python/profiling.md - Learn how to enable profiling in your app if it is not already set up.
- https://docs.sentry.io/platforms/python/crons.md - Sentry Crons allows you to monitor the uptime and performance of any scheduled, recurring job ...
- https://docs.sentry.io/platforms/python/user-feedback.md - Learn more about collecting user feedback when an event occurs. Sentry pairs the feedback with...
- https://docs.sentry.io/platforms/python/user-feedback/configuration.md - Learn about the general User Feedback configuration fields.
- https://docs.sentry.io/platforms/python/feature-flags.md - With Feature Flags, Sentry tracks feature flag evaluations in your application, keeps an audit...

### Configuration
- https://docs.sentry.io/platforms/python/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/python/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/python/configuration.md - Learn about additional configuration options for the Python SDK.
- https://docs.sentry.io/platforms/python/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/python/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/python/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/python/configuration/sessions.md - Learn how to configure your SDK to tell Sentry about users sessions.
- https://docs.sentry.io/platforms/python/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/python/configuration/filtering/hints.md - Learn about the different kinds of Event and Breadcrumb `hints`.
- https://docs.sentry.io/platforms/python/configuration/draining.md - Learn more about the default behavior of our SDK if the application shuts down unexpectedly.
- https://docs.sentry.io/platforms/python/configuration/draining__v1.x.md - Learn more about the default behavior of our SDK if the application shuts down unexpectedly.
- https://docs.sentry.io/platforms/python/integrations.md - Sentry provides additional integrations designed to change configuration or add instrumentatio...
- https://docs.sentry.io/platforms/python/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/python/security-policy-reporting.md - Learn how Sentry can help manage Content-Security-Policy violations and reports here.
- https://docs.sentry.io/platforms/python/migration.md - Migrate from an older version of our Python SDK.
- https://docs.sentry.io/platforms/python/troubleshooting.md - While we don't expect most users of our SDK to run into these issues, we document edge cases h...

### Enriching Events
- https://docs.sentry.io/platforms/python/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/python/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/python/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/python/enriching-events/event-processors.md - Learn more about how you can add your own event processors globally or to the current scope.
- https://docs.sentry.io/platforms/python/enriching-events/scopes.md - The SDK will in most cases automatically manage the scopes for you in the framework integratio...
- https://docs.sentry.io/platforms/python/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/python/enriching-events/transaction-name.md - Learn how to set or override the transaction name to capture the user and gain critical pieces...
- https://docs.sentry.io/platforms/python/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...

### Data Management
- https://docs.sentry.io/platforms/python/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/python/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...

### Migration
- https://docs.sentry.io/platforms/python/migration/1.x-to-2.x.md - Learn about migrating from sentry-python 1.x to 2.x
- https://docs.sentry.io/platforms/python/migration/raven-to-sentry-sdk.md - Learn about migrating from raven to sentry-python

### Other
- https://docs.sentry.io/platforms/python/usage/sdk-fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
- https://docs.sentry.io/platforms/python/legacy-sdk.md
- https://docs.sentry.io/platforms/python/legacy-sdk/advanced.md
- https://docs.sentry.io/platforms/python/legacy-sdk/breadcrumbs.md
- https://docs.sentry.io/platforms/python/legacy-sdk/api.md
- https://docs.sentry.io/platforms/python/legacy-sdk/usage.md
- https://docs.sentry.io/platforms/python/legacy-sdk/integrations.md
- https://docs.sentry.io/platforms/python/legacy-sdk/platform-support.md
- https://docs.sentry.io/platforms/python/legacy-sdk/transports.md
- https://docs.sentry.io/platforms/python/integrations/aiohttp.md - Learn about using Sentry with AIOHTTP.
- https://docs.sentry.io/platforms/python/integrations/aiohttp/aiohttp-client.md - Learn about the AIOHTTP integration and how it adds support for the AIOHTTP HTTP client.
- https://docs.sentry.io/platforms/python/integrations/anthropic.md - Learn about using Sentry for Anthropic.
- https://docs.sentry.io/platforms/python/integrations/airflow.md - Learn about using Sentry with Apache Airflow.
- https://docs.sentry.io/platforms/python/integrations/beam.md - Learn about using Sentry with Beam.
- https://docs.sentry.io/platforms/python/integrations/spark.md - Learn about using Sentry with Apache Spark.
- https://docs.sentry.io/platforms/python/integrations/ariadne.md - Learn about importing the Ariadne GraphQL integration and how it captures GraphQL errors.
- https://docs.sentry.io/platforms/python/integrations/arq.md - Learn about using Sentry with arq.
- https://docs.sentry.io/platforms/python/integrations/asgi.md - Learn about the ASGI integration and how it adds support for ASGI applications.
- https://docs.sentry.io/platforms/python/integrations/asyncio.md - Learn about the asyncio integration and how it adds support for applications the asyncio module.
- https://docs.sentry.io/platforms/python/integrations/asyncpg.md - Learn about importing the asyncpg integration and how it captures queries from asyncpg.
- https://docs.sentry.io/platforms/python/integrations/aws-lambda.md - Learn about using Sentry with AWS Lambda.
- https://docs.sentry.io/platforms/python/integrations/aws-lambda/manual-layer.md - Learn how to manually set up Sentry with a Layer
- https://docs.sentry.io/platforms/python/integrations/aws-lambda/manual-instrumentation.md - Learn about instrumenting your AWS lambda function manually using Sentry.
- https://docs.sentry.io/platforms/python/integrations/aws-lambda/container-image.md - Learn how to set up Sentry with a Container Image.
- https://docs.sentry.io/platforms/python/integrations/boto3.md - Learn about the Boto3 integration and how it adds support for the Boto3 and botocore libraries.
- https://docs.sentry.io/platforms/python/integrations/bottle.md - Learn about using Sentry with Bottle.
- https://docs.sentry.io/platforms/python/integrations/celery.md - Learn about using Sentry with Celery.
- https://docs.sentry.io/platforms/python/integrations/celery/crons.md - Learn how to set up Sentry Crons for Celery
- https://docs.sentry.io/platforms/python/integrations/chalice.md - Learn about using Sentry with Chalice.
- https://docs.sentry.io/platforms/python/integrations/clickhouse-driver.md - Learn about importing the clickhouse-driver integration and how it captures queries from click...
- https://docs.sentry.io/platforms/python/integrations/cloudresourcecontext.md - Learn about the Cloud Resource Context integration and how it adds information about the Cloud...
- https://docs.sentry.io/platforms/python/integrations/django.md - Learn about using Sentry with Django.
- https://docs.sentry.io/platforms/python/integrations/django/http_errors.md - Learn about reporting HTTP errors with Django.
- https://docs.sentry.io/platforms/python/integrations/dramatiq.md - Learn how to import and use the Dramatiq integration.
- https://docs.sentry.io/platforms/python/integrations/falcon.md - Learn about using Sentry with Falcon.
- https://docs.sentry.io/platforms/python/integrations/fastapi.md - Learn about using Sentry with FastAPI.
- https://docs.sentry.io/platforms/python/integrations/flask.md - Learn about using Sentry with Flask.
- https://docs.sentry.io/platforms/python/integrations/gnu_backtrace.md - Learn about the GNU backtrace integration and how to add it to your integrations list.
- https://docs.sentry.io/platforms/python/integrations/gcp-functions.md - Learn about using Sentry with Google Cloud Functions.
- https://docs.sentry.io/platforms/python/integrations/google-genai.md - Learn about using Sentry for Google Gen AI.
- https://docs.sentry.io/platforms/python/integrations/gql.md - GQL GraphQL client integration
- https://docs.sentry.io/platforms/python/integrations/graphene.md - Learn about importing the Graphene GraphQL integration and how it captures GraphQL errors.
- https://docs.sentry.io/platforms/python/integrations/grpc.md - Learn about the gRPC integration and how it adds support for the grpcio grpc client and server.
- https://docs.sentry.io/platforms/python/integrations/httpx.md - Learn about the HTTPX integration and how it adds support for the HTTPX HTTP client.
- https://docs.sentry.io/platforms/python/integrations/huey.md - Learn how to import and use the huey integration.
- https://docs.sentry.io/platforms/python/integrations/huggingface_hub.md - Learn about using Sentry for Hugging Face Hub.
- https://docs.sentry.io/platforms/python/integrations/langchain.md - Learn about using Sentry for LangChain.
- https://docs.sentry.io/platforms/python/integrations/langgraph.md - Learn about using Sentry for LangGraph.
- https://docs.sentry.io/platforms/python/integrations/launchdarkly.md - Learn how to use Sentry with LaunchDarkly.
- https://docs.sentry.io/platforms/python/integrations/litellm.md - Learn about using Sentry for LiteLLM.
- https://docs.sentry.io/platforms/python/integrations/litestar.md - Learn about using Sentry with Litestar.
- https://docs.sentry.io/platforms/python/integrations/logging.md - Learn about logging with Python.
- https://docs.sentry.io/platforms/python/integrations/loguru.md - Learn about using Sentry with Loguru.
- https://docs.sentry.io/platforms/python/integrations/mcp.md - Learn about using the Sentry Python SDK for MCP (Model Context Protocol) servers.
- https://docs.sentry.io/platforms/python/integrations/openai.md - Learn about using Sentry for OpenAI.
- https://docs.sentry.io/platforms/python/integrations/openai-agents.md - Learn about using Sentry for OpenAI Agents SDK.
- https://docs.sentry.io/platforms/python/integrations/openfeature.md - Learn how to use Sentry with OpenFeature.
- https://docs.sentry.io/platforms/python/integrations/otlp.md - Learn about using OTLP to automatically send OpenTelemetry Traces to Sentry.
- https://docs.sentry.io/platforms/python/integrations/pure_eval.md - Learn about pure_eval and how to add it to your integrations list.
- https://docs.sentry.io/platforms/python/integrations/pydantic-ai.md - Learn about using Sentry for Pydantic AI.
- https://docs.sentry.io/platforms/python/integrations/pymongo.md - Learn about the PyMongo integration and how it adds support for connections to MongoDB databases.
- https://docs.sentry.io/platforms/python/integrations/pyramid.md - Learn about using Sentry with Pyramid.
- https://docs.sentry.io/platforms/python/integrations/quart.md - Learn about using Sentry with Quart.
- https://docs.sentry.io/platforms/python/integrations/ray.md - Learn how to import and use the Ray integration.
- https://docs.sentry.io/platforms/python/integrations/redis.md - Learn about importing the Redis integration.
- https://docs.sentry.io/platforms/python/integrations/rq.md - Learn about using Sentry with RQ.
- https://docs.sentry.io/platforms/python/integrations/rust_tracing.md - Learn about the Rust Tracing integration and how to get performance data for Rust native exten...
- https://docs.sentry.io/platforms/python/integrations/sanic.md - Learn about using Sentry with Sanic.
- https://docs.sentry.io/platforms/python/integrations/serverless.md - Learn about using Sentry's Python SDK for a serverless environment.
- https://docs.sentry.io/platforms/python/integrations/socket.md - Learn about the Socket integration and how it adds support network actions.
- https://docs.sentry.io/platforms/python/integrations/sqlalchemy.md - Learn about importing the SQLAlchemy integration and how it captures queries from SQLAlchemy a...
- https://docs.sentry.io/platforms/python/integrations/starlette.md - Learn about using Sentry with Starlette.
- https://docs.sentry.io/platforms/python/integrations/starlite.md - Learn about using Sentry with Starlite.
- https://docs.sentry.io/platforms/python/integrations/statsig.md - Learn how to use Sentry with Statsig.
- https://docs.sentry.io/platforms/python/integrations/strawberry.md - Learn how to import the Strawberry GraphQL integration and how it captures GraphQL errors and ...
- https://docs.sentry.io/platforms/python/integrations/sys_exit.md - Learn how to use Sentry to capture sys.exit calls.
- https://docs.sentry.io/platforms/python/integrations/tornado.md - Learn about using Sentry with Tornado.
- https://docs.sentry.io/platforms/python/integrations/tryton.md - Learn aboutn using Sentry with Tryton.
- https://docs.sentry.io/platforms/python/integrations/typer.md - Learn how to use Sentry to capture Typer exceptions.
- https://docs.sentry.io/platforms/python/integrations/unleash.md - Learn how to use Sentry with Unleash.
- https://docs.sentry.io/platforms/python/integrations/wsgi.md - Learn about the WSGI integration and how it adds support for WSGI applications.
- https://docs.sentry.io/platforms/python/integrations/default-integrations.md - Learn about default integrations, what they do, and how they hook into the standard library or...
