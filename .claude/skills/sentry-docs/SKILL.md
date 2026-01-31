---
name: sentry-docs
description: Search and fetch Sentry documentation. Use when users ask about Sentry SDK setup, configuration, integrations, error monitoring, tracing, session replay, logs, crons, or when developing/contributing to Sentry SDKs. Covers both user-facing docs (docs.sentry.io) and SDK development docs (develop.sentry.dev).
---

# Sentry Documentation Search Skill

This skill enables searching and fetching documentation from Sentry's two documentation sites.

## Documentation Sites

### docs.sentry.io (User Documentation)
For developers **using** Sentry in their applications:
- SDK installation and setup
- Framework integrations (Next.js, Django, Laravel, etc.)
- Features: Error monitoring, Tracing, Session Replay, Logs, Crons, Profiling
- Configuration and sampling
- Troubleshooting

### develop.sentry.dev (SDK Development Documentation)  
For developers **building or contributing to** Sentry:
- SDK development guidelines
- Data model (envelopes, event payloads, interfaces)
- Protocol specifications
- Telemetry (logs, metrics, traces)
- Backend/frontend architecture
- Self-hosted Sentry

## URL Patterns

### docs.sentry.io
Both sites serve **markdown** when you append `.md` to any URL path.

```
# Platform quick start
https://docs.sentry.io/platforms/{platform}.md

# Framework guide
https://docs.sentry.io/platforms/{platform}/guides/{framework}.md

# Specific topic within a guide
https://docs.sentry.io/platforms/{platform}/guides/{framework}/{topic}.md

# Platform integrations (Python-style - integrations under platform)
https://docs.sentry.io/platforms/{platform}/integrations/{integration}.md

# Features
https://docs.sentry.io/platforms/{platform}/guides/{framework}/tracing.md
https://docs.sentry.io/platforms/{platform}/guides/{framework}/session-replay.md
https://docs.sentry.io/platforms/{platform}/guides/{framework}/logs.md
https://docs.sentry.io/platforms/{platform}/guides/{framework}/configuration.md
https://docs.sentry.io/platforms/{platform}/guides/{framework}/troubleshooting.md
```

### develop.sentry.dev
```
# SDK development
https://develop.sentry.dev/sdk/{topic}.md

# Data model
https://develop.sentry.dev/sdk/data-model/envelopes.md
https://develop.sentry.dev/sdk/data-model/event-payloads.md
https://develop.sentry.dev/sdk/data-model/event-payloads/{interface}.md

# Telemetry
https://develop.sentry.dev/sdk/telemetry/logs.md
https://develop.sentry.dev/sdk/telemetry/metrics.md
https://develop.sentry.dev/sdk/telemetry/traces.md
```

## Supported Platforms and Frameworks

### JavaScript/TypeScript
- **Platform**: `javascript`
- **Guides**: `nextjs`, `react`, `vue`, `angular`, `svelte`, `sveltekit`, `remix`, `gatsby`, `astro`, `nuxt`, `solidstart`, `express`, `fastify`, `nestjs`, `koa`, `hapi`, `node`, `bun`, `deno`, `electron`, `capacitor`, `cordova`, `cloudflare`

### Python
- **Platform**: `python`
- **Integrations** (not guides): `django`, `flask`, `fastapi`, `celery`, `tornado`, `pyramid`, `aiohttp`, `bottle`, `falcon`, `starlette`, `quart`, `litestar`, `chalice`, `aws-lambda`, `gcp-functions`, `logging`, `loguru`, `sqlalchemy`, `redis`, `rq`, `huey`, `dramatiq`, `arq`, `langchain`, `openai`, `anthropic`

### PHP
- **Platform**: `php`
- **Guides**: `laravel`, `symfony`

### Ruby
- **Platform**: `ruby`
- **Guides**: `rails`, `sidekiq`, `delayed_job`, `resque`, `rack`

### Java
- **Platform**: `java`
- **Guides**: `spring`, `spring-boot`, `logback`, `log4j2`, `jul`

### Go
- **Platform**: `go`
- **Guides**: `echo`, `gin`, `fiber`, `fasthttp`, `http`, `iris`, `negroni`, `logrus`, `slog`, `zerolog`

### .NET
- **Platform**: `dotnet`
- **Guides**: `aspnetcore`, `aspnet`, `maui`, `wpf`, `winforms`, `blazor-webassembly`, `azure-functions`, `aws-lambda`, `google-cloud-functions`, `serilog`, `nlog`, `log4net`

### Mobile
- **Android**: `android` (platform), guides: `kotlin`
- **iOS/Apple**: `apple` (platform), guides: `ios`, `macos`, `tvos`, `watchos`, `visionos`
- **React Native**: `react-native` (platform)
- **Flutter**: `dart` (platform), guide: `flutter`
- **Kotlin Multiplatform**: `kotlin` (platform), guide: `multiplatform`

### Gaming
- **Unity**: `unity` (platform)
- **Unreal**: `unreal` (platform)
- **Godot**: `godot` (platform)

### Native/Other
- **Native/C++**: `native` (platform)
- **Rust**: `rust` (platform)
- **Elixir**: `elixir` (platform)
- **PowerShell**: `powershell` (platform)

## How to Use This Skill

### Step 1: Determine the documentation site

| User Need | Site |
|-----------|------|
| Setting up Sentry in an app | docs.sentry.io |
| Configuring SDK features | docs.sentry.io |
| Framework-specific integration | docs.sentry.io |
| Troubleshooting SDK issues | docs.sentry.io |
| SDK development/contributing | develop.sentry.dev |
| Protocol/data model specs | develop.sentry.dev |
| Understanding envelope format | develop.sentry.dev |
| Self-hosted Sentry | develop.sentry.dev |

### Step 2: Construct the URL

**For user documentation (docs.sentry.io):**
```
# Basic pattern
https://docs.sentry.io/platforms/{platform}/guides/{framework}/{topic}.md

# Examples
https://docs.sentry.io/platforms/javascript/guides/nextjs.md
https://docs.sentry.io/platforms/javascript/guides/nextjs/tracing.md
https://docs.sentry.io/platforms/python/integrations/django.md
https://docs.sentry.io/platforms/python/integrations/fastapi.md
```

**For SDK development documentation (develop.sentry.dev):**
```
# Basic pattern  
https://develop.sentry.dev/sdk/{section}/{topic}.md

# Examples
https://develop.sentry.dev/sdk/data-model/envelopes.md
https://develop.sentry.dev/sdk/data-model/event-payloads/span.md
https://develop.sentry.dev/sdk/telemetry/logs.md
```

### Step 3: Fetch the documentation

Use `web_fetch` to retrieve the markdown content:
```
web_fetch(url="https://docs.sentry.io/platforms/javascript/guides/nextjs.md")
```

### Step 4: If URL doesn't work, search first

If a direct URL returns 404 or unexpected content, use `web_search` to find the correct path:
```
web_search(query="site:docs.sentry.io nextjs session replay configuration")
```

Then fetch the URL from search results.

## Common Query Patterns

| User Query | Constructed URL |
|------------|-----------------|
| "How do I set up Sentry in Next.js?" | `https://docs.sentry.io/platforms/javascript/guides/nextjs.md` |
| "Django Sentry integration" | `https://docs.sentry.io/platforms/python/integrations/django.md` |
| "Sentry tracing in FastAPI" | `https://docs.sentry.io/platforms/python/integrations/fastapi.md` then look for tracing section |
| "Session replay React" | `https://docs.sentry.io/platforms/javascript/guides/react/session-replay.md` |
| "Sentry envelope format" | `https://develop.sentry.dev/sdk/data-model/envelopes.md` |
| "Span interface specification" | `https://develop.sentry.dev/sdk/data-model/event-payloads/span.md` |
| "How to contribute to Python SDK" | `https://develop.sentry.dev/sdk/` then search for contribution guidelines |

## Important Notes

1. **Python uses "integrations" not "guides"**: Unlike JavaScript which uses `/guides/nextjs`, Python uses `/integrations/django`

2. **Always add `.md` suffix**: Both sites serve markdown when you append `.md` to the URL

3. **Search as fallback**: If direct URL construction fails, use web search with `site:docs.sentry.io` or `site:develop.sentry.dev`

4. **Check for nested topics**: Many features have sub-pages:
   - `/tracing/instrumentation/custom-instrumentation.md`
   - `/tracing/distributed-tracing.md`
   - `/configuration/sampling.md`

5. **Product features documentation**: For product features (not SDK-specific), check:
   - `https://docs.sentry.io/product/{feature}.md`
   - Example: `https://docs.sentry.io/product/ai-in-sentry/seer.md`
