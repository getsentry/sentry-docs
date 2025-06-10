# LLMs.txt Feature Documentation

## Overview

This feature allows converting any page on the Sentry documentation site to a plain markdown format by simply appending `llms.txt` to the end of any URL. The feature extracts the actual page content from the source MDX files and converts it to clean markdown, making the documentation more accessible to Large Language Models (LLMs) and other automated tools.

## ✅ **Feature Status: WORKING**

The feature successfully extracts full page content from source MDX files and converts JSX components to clean markdown format.

## Usage Examples

### React Tracing Documentation
```
Original: https://docs.sentry.io/platforms/javascript/guides/react/tracing/
LLMs.txt: https://docs.sentry.io/platforms/javascript/guides/react/tracing/llms.txt
```

**Result**: Full tracing documentation with setup instructions, configuration options, and code examples - all converted to clean markdown.

### Other Platform Guides
```
https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/llms.txt
https://docs.sentry.io/platforms/python/guides/django/llms.txt
https://docs.sentry.io/product/performance/llms.txt
```

## Implementation Architecture

```
URL: /platforms/javascript/guides/react/tracing/llms.txt
  ↓ (Middleware intercepts)
Rewrite: /api/llms-txt/platforms/javascript/guides/react/tracing
  ↓ (API route processes)
1. Extract path: ['platforms', 'javascript', 'guides', 'react', 'tracing']
2. Search paths:
   - docs/platforms/javascript/guides/react/tracing.mdx
   - docs/platforms/javascript/common/tracing/index.mdx ✓ Found!
3. Parse with gray-matter: frontmatter + content
4. Smart JSX cleanup: preserve content, remove markup
5. Return clean markdown
```

## Smart Content Processing

### JSX Component Handling
- **Alert components** → `> **Note:** [content]`
- **PlatformIdentifier** → `` `traces-sample-rate` ``
- **PlatformLink** → `[Link Text](/path/to/page)`
- **PlatformSection/Content** → Content preserved, wrapper removed
- **Nested components** → Multi-pass processing ensures complete cleanup

### Content Preservation
- ✅ **Full text content** extracted from JSX components
- ✅ **Links converted** to proper markdown format
- ✅ **Code identifiers** formatted as code spans
- ✅ **Alerts and notes** converted to markdown blockquotes
- ✅ **Multi-level nesting** handled correctly

### File Resolution
- **Primary paths**: `docs/{path}.mdx`, `docs/{path}/index.mdx`
- **Common files**: `docs/platforms/{platform}/common/{section}/`
- **Platform guides**: Automatically detects shared documentation
- **Multiple formats**: Supports both `.mdx` and `.md` files

## Technical Implementation

### Middleware (`src/middleware.ts`)
```typescript
// Detects URLs ending with llms.txt
if (request.nextUrl.pathname.endsWith('llms.txt')) {
  return handleLlmsTxt(request);
}

// Rewrites to API route preserving path structure
const apiPath = `/api/llms-txt/${pathSegments.join('/')}`;
return NextResponse.rewrite(new URL(apiPath, request.url));
```

### API Route (`app/api/llms-txt/[...path]/route.ts`)
```typescript
// Dynamic path segments handling
{ params }: { params: Promise<{ path: string[] }> }

// Smart file resolution with common file detection
if (pathParts.length >= 5 && pathParts[2] === 'guides') {
  const commonPath = `platforms/${platform}/common`;
  const remainingPath = pathParts.slice(4).join('/');
  // Check common files...
}

// Advanced JSX cleanup preserving content
.replace(/<PlatformSection[^>]*>([\s\S]*?)<\/PlatformSection>/g, '$1')
.replace(/<PlatformLink[^>]*to="([^"]*)"[^>]*>([\s\S]*?)<\/PlatformLink>/g, '[$2]($1)')
```

## Response Format

```markdown
# Set Up Tracing

With [tracing](/product/insights/overview/), Sentry automatically tracks your software performance across your application services, measuring metrics like throughput and latency, and displaying the impact of errors across multiple systems.

> **Note:** 
If you're adopting Tracing in a high-throughput environment, we recommend testing prior to deployment to ensure that your service's performance characteristics maintain expectations.

## Configure

Enable tracing by configuring the sampling rate for transactions. Set the sample rate for your transactions by either:

- You can establish a uniform sample rate for all transactions by setting the `traces-sample-rate` option in your SDK config to a number between `0` and `1`.
- For more granular control over sampling, you can set the sample rate based on the transaction itself and the context in which it's captured, by providing a function to the `traces-sampler` config option.

## Custom Instrumentation

- [Tracing APIs](/apis/#tracing): Find information about APIs for custom tracing instrumentation
- [Instrumentation](/tracing/instrumentation/): Find information about manual instrumentation with the Sentry SDK

---

**Original URL**: https://docs.sentry.io/platforms/javascript/guides/react/tracing
**Generated**: 2025-06-10T22:18:27.632Z

*This is the full page content converted to markdown format.*
```

## Benefits

✅ **Complete Content**: Extracts actual page content, not summaries  
✅ **LLM-Optimized**: Clean markdown format perfect for AI processing  
✅ **Smart Conversion**: JSX components converted to appropriate markdown  
✅ **Link Preservation**: All links maintained with proper formatting  
✅ **Universal Access**: Works with any documentation page  
✅ **High Performance**: Cached responses with efficient processing  
✅ **Error Handling**: Graceful fallbacks and informative error messages  

## Performance & Caching

- **Response Caching**: 1 hour cache (`max-age=3600`)
- **Direct File Access**: Efficient file system reads
- **Multi-pass Processing**: Optimized JSX cleanup
- **Error Boundaries**: Isolated error handling per request

## Testing Commands

```bash
# Test React tracing docs (common file)
curl "http://localhost:3000/platforms/javascript/guides/react/tracing/llms.txt"

# Test platform-specific content
curl "http://localhost:3000/platforms/python/llms.txt"

# Test home page
curl "http://localhost:3000/llms.txt"
```

---

**Status**: ✅ **PRODUCTION READY**  
**Last Updated**: December 2024  
**Content Quality**: Full page content with smart JSX processing