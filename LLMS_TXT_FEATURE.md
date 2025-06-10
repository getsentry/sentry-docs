# LLMs.txt Feature Documentation

## Overview

This feature allows converting any page on the Sentry documentation site to a plain markdown format by simply appending `llms.txt` to the end of any URL. The feature extracts the actual page content from the source MDX files and converts it to clean markdown, making the documentation more accessible to Large Language Models (LLMs) and other automated tools.

## How It Works

The feature is implemented using Next.js middleware that intercepts requests ending with `llms.txt` and rewrites them to an API route that extracts and converts the actual page content to markdown format.

### Implementation Details

1. **Middleware Interception**: The middleware in `src/middleware.ts` detects URLs ending with `llms.txt`
2. **Request Rewriting**: The middleware rewrites the request to `/api/llms-txt` with the original path as a parameter
3. **Content Extraction**: The API route extracts the actual MDX content from source files
4. **Markdown Conversion**: JSX components and imports are stripped to create clean markdown
5. **Response**: The full page content is returned as plain text with appropriate headers

### File Changes

- `src/middleware.ts`: Added `handleLlmsTxt` function with URL detection and rewriting logic
- `app/api/llms-txt/route.ts`: New API route that handles content extraction and conversion

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

## Content Extraction Process

The API route performs the following steps to extract content:

1. **Path Resolution**: Determines the original page path from the request
2. **Document Tree Lookup**: Uses `nodeForPath()` to find the page in the documentation tree
3. **File System Access**: Searches for source MDX/MD files in multiple possible locations:
   - Direct file paths (`docs/path/to/page.mdx`)
   - Index files (`docs/path/to/page/index.mdx`)
   - Common files for platform documentation
   - Developer documentation files
4. **Content Parsing**: Uses `gray-matter` to parse frontmatter and content
5. **Markdown Cleanup**: Removes JSX components, imports, and expressions
6. **Response Formatting**: Combines title, content, and metadata

### Supported Content Types

#### Regular Documentation Pages
- Extracts content from `docs/**/*.mdx` files
- Handles both direct files and index files
- Supports platform-specific common files

#### Developer Documentation
- Extracts content from `develop-docs/**/*.mdx` files
- Uses the same file resolution logic

#### API Documentation
- Provides explanatory text for dynamically generated API docs
- Explains that full API reference is available interactively

#### Home Page
- Attempts to extract from `docs/index.mdx`
- Falls back to curated home page content

## Content Cleanup

The `cleanupMarkdown()` function performs the following cleanup operations:

```typescript
function cleanupMarkdown(content: string): string {
  return content
    // Remove JSX components and their content
    .replace(/<[A-Z][a-zA-Z0-9]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z0-9]*>/g, '')
    // Remove self-closing JSX components
    .replace(/<[A-Z][a-zA-Z0-9]*[^>]*\/>/g, '')
    // Remove import statements
    .replace(/^import\s+.*$/gm, '')
    // Remove export statements
    .replace(/^export\s+.*$/gm, '')
    // Remove JSX expressions
    .replace(/\{[^}]*\}/g, '')
    // Clean up multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    // Remove leading/trailing whitespace
    .trim();
}
```

## Technical Implementation

### Middleware Function

```typescript
const handleLlmsTxt = async (request: NextRequest) => {
  try {
    // Get the original path by removing llms.txt
    const originalPath = request.nextUrl.pathname.replace(/\/llms\.txt$/, '') || '/';
    
    // Rewrite to the API route with the path as a parameter
    const apiUrl = new URL('/api/llms-txt', request.url);
    apiUrl.searchParams.set('path', originalPath);
    
    return NextResponse.rewrite(apiUrl);
  } catch (error) {
    console.error('Error handling llms.txt rewrite:', error);
    return new Response('Error processing request', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
};
```

### API Route Structure

The API route (`app/api/llms-txt/route.ts`) handles:
- Path parameter validation
- Document tree navigation
- File system access for content extraction
- Error handling for missing or inaccessible content
- Response formatting with proper headers

### Response Headers

- `Content-Type: text/plain; charset=utf-8`: Ensures proper text encoding
- `Cache-Control: public, max-age=3600`: Caches responses for 1 hour for performance

## Benefits

1. **Authentic Content**: Extracts actual page content, not summaries
2. **LLM-Friendly**: Provides clean, structured markdown that's easy for AI models to process
3. **Automated Access**: Enables automated tools to access documentation content
4. **Simplified Format**: Removes complex UI elements and focuses on content
5. **Fast Performance**: Cached responses with efficient file system access
6. **Universal Access**: Works with any page on the documentation site
7. **Fallback Handling**: Graceful degradation for pages that can't be processed

## Testing

To test the feature:

1. Start the development server: `yarn dev`
2. Visit any documentation page
3. Append `llms.txt` to the URL
4. Verify the actual page content is returned in markdown format

### Example Test URLs (Development)

- `http://localhost:3000/llms.txt` - Home page content
- `http://localhost:3000/platforms/javascript/llms.txt` - JavaScript platform documentation
- `http://localhost:3000/platforms/javascript/install/llms.txt` - JavaScript installation guide
- `http://localhost:3000/product/performance/llms.txt` - Performance monitoring documentation

### Expected Output Format

```markdown
# Page Title

[Actual page content converted to markdown]

---

**Original URL**: https://docs.sentry.io/original/path
**Generated**: 2024-01-01T12:00:00.000Z

*This is the full page content converted to markdown format.*
```

## Error Handling

The feature includes comprehensive error handling:

- **404 Not Found**: When the requested page doesn't exist
- **500 Internal Server Error**: When content processing fails
- **400 Bad Request**: When path parameter is missing
- **Graceful Fallbacks**: When source files aren't accessible

## Performance Considerations

- **Caching**: Responses are cached for 1 hour to reduce server load
- **File System Access**: Direct file system reads for optimal performance
- **Efficient Processing**: Minimal regex operations for content cleanup
- **Error Recovery**: Fast fallback responses when content isn't available

## Future Enhancements

Potential improvements for the feature:

1. **Enhanced JSX Cleanup**: More sophisticated removal of React components
2. **Code Block Preservation**: Better handling of code examples
3. **Link Resolution**: Convert relative links to absolute URLs
4. **Image Handling**: Process and reference images appropriately
5. **Table of Contents**: Generate TOC from headings
6. **Metadata Extraction**: Include more frontmatter data in output

## Maintenance

- The feature is self-contained with clear separation of concerns
- Content extraction logic can be enhanced in the API route
- Cleanup patterns can be updated in the `cleanupMarkdown()` function
- Performance can be monitored through response times and caching metrics
- Error handling provides clear debugging information

---

**Note**: This feature extracts the actual page content from source MDX files and converts it to clean markdown format, making it ideal for LLM consumption and automated processing.