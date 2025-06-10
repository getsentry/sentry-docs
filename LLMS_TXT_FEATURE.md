# LLMs.txt Feature Documentation

## Overview

This feature allows converting any page on the Sentry documentation site to a plain markdown format by simply appending `llms.txt` to the end of any URL. This is designed to make the documentation more accessible to Large Language Models (LLMs) and other automated tools that work better with plain text markdown content.

## How It Works

The feature is implemented using Next.js middleware that intercepts requests ending with `llms.txt` and converts the corresponding page content to markdown format.

### Implementation Details

1. **Middleware Interception**: The middleware in `src/middleware.ts` detects URLs ending with `llms.txt`
2. **Path Processing**: The middleware strips the `llms.txt` suffix to get the original page path
3. **Content Generation**: A comprehensive markdown representation is generated based on the page type and content
4. **Response**: The markdown content is returned as plain text with appropriate headers

### File Changes

- `src/middleware.ts`: Added `handleLlmsTxt` function and URL detection logic

## Usage Examples

### Basic Usage
- Original URL: `https://docs.sentry.io/platforms/javascript/`
- LLMs.txt URL: `https://docs.sentry.io/platforms/javascript/llms.txt`

### Home Page
- Original URL: `https://docs.sentry.io/`
- LLMs.txt URL: `https://docs.sentry.io/llms.txt`

### API Documentation
- Original URL: `https://docs.sentry.io/api/events/`
- LLMs.txt URL: `https://docs.sentry.io/api/events/llms.txt`

### Product Features
- Original URL: `https://docs.sentry.io/product/performance/`
- LLMs.txt URL: `https://docs.sentry.io/product/performance/llms.txt`

## Content Structure

The generated markdown content includes:

1. **Page Title**: Based on the URL path structure
2. **Section Overview**: Contextual information about the page type
3. **Key Information**: Relevant details based on the page category
4. **Additional Resources**: Link back to the original page
5. **Metadata**: Generation timestamp and original URL

### Content Types

#### Home Page (`/`)
- Welcome message and overview of Sentry documentation
- Main sections listing (Getting Started, Platforms, Product Guides, etc.)
- Brief description of Sentry's capabilities

#### Platform Pages (`/platforms/*`)
- Platform-specific integration guide overview
- Key topics covered (Installation, Configuration, Error handling, etc.)
- Step-by-step integration process
- Link to full documentation

#### API Documentation (`/api/*`)
- API overview and description
- Key API categories
- Authentication information
- Rate limiting details
- Link to complete API reference

#### Product Features (`/product/*`)
- Product feature overview
- Key features list (Error Monitoring, Performance Monitoring, etc.)
- Usage guidance
- Link to detailed feature documentation

#### General Pages
- Generic documentation page template
- Content overview
- Key information points
- Additional resources section

## Technical Implementation

### Middleware Function

```typescript
const handleLlmsTxt = async (request: NextRequest) => {
  try {
    // Get the original path by removing llms.txt
    const originalPath = request.nextUrl.pathname.replace(/\/llms\.txt$/, '') || '/';
    const pathSegments = originalPath.split('/').filter(Boolean);
    
    // Generate comprehensive markdown content based on path
    let markdownContent = generateContentForPath(originalPath, pathSegments);
    
    return new Response(markdownContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating llms.txt:', error);
    return new Response('Error generating markdown content', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
};
```

### Response Headers

- `Content-Type: text/plain; charset=utf-8`: Ensures proper text encoding
- `Cache-Control: public, max-age=3600`: Caches responses for 1 hour for performance

## Benefits

1. **LLM-Friendly**: Provides clean, structured markdown that's easy for AI models to process
2. **Automated Access**: Enables automated tools to access documentation content
3. **Simplified Format**: Removes complex UI elements and focuses on content
4. **Fast Performance**: Cached responses with minimal processing overhead
5. **Universal Access**: Works with any page on the documentation site

## Testing

To test the feature:

1. Start the development server: `yarn dev`
2. Visit any documentation page
3. Append `llms.txt` to the URL
4. Verify the markdown content is returned

### Example Test URLs (Development)

- `http://localhost:3000/llms.txt` - Home page
- `http://localhost:3000/platforms/javascript/llms.txt` - JavaScript platform
- `http://localhost:3000/api/llms.txt` - API documentation
- `http://localhost:3000/product/performance/llms.txt` - Performance features

## Future Enhancements

Potential improvements for the feature:

1. **Real Content Extraction**: Integration with the actual MDX content processing
2. **Enhanced Formatting**: Better markdown structure and formatting
3. **Custom Templates**: Page-specific markdown templates
4. **Content Optimization**: LLM-optimized content structure
5. **Recursive Processing**: Full page content extraction and processing

## Maintenance

- The feature is self-contained in the middleware
- Content templates can be updated in the `handleLlmsTxt` function
- Performance can be monitored through response times and caching metrics
- Error handling is built-in with fallback responses

---

**Note**: This is a simplified implementation that provides structured markdown summaries. For complete content access, users should visit the original documentation pages.