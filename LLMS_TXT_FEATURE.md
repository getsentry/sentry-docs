# LLMs.txt Feature Documentation

## Overview

This feature allows converting any page on the Sentry documentation site to a plain markdown format by simply appending `llms.txt` to the end of any URL. The feature extracts the actual page content from the source MDX files and converts it to clean markdown, making the documentation more accessible to Large Language Models (LLMs) and other automated tools.

## How It Works

The feature is implemented using Next.js middleware that intercepts requests ending with `llms.txt` and rewrites them to an API route that extracts and converts the actual page content to markdown format.

### Implementation Details

1. **Middleware Interception**: The middleware in `src/middleware.ts` detects URLs ending with `llms.txt`
2. **Request Rewriting**: The middleware rewrites the request to `/api/llms-txt/[...path]` preserving the original path structure
3. **Content Extraction**: The API route reads the actual MDX/markdown source files from the file system
4. **Content Processing**: Uses `gray-matter` to parse frontmatter and extract the raw content
5. **Markdown Cleanup**: Strips JSX components, imports, and expressions to create clean markdown
6. **Response Generation**: Returns the cleaned content as plain text with appropriate headers

### Architecture

```
URL: /platforms/javascript/guides/react/llms.txt
  ↓ (Middleware intercepts)
Rewrite: /api/llms-txt/platforms/javascript/guides/react
  ↓ (API route processes)
1. Extract path segments: ['platforms', 'javascript', 'guides', 'react']
2. Locate source file: docs/platforms/javascript/guides/react.mdx
3. Read and parse with gray-matter
4. Clean JSX/imports from markdown
5. Return plain markdown content
```

## Usage Examples

### Basic Usage
```
Original URL: https://docs.sentry.io/platforms/javascript/
LLMs.txt URL: https://docs.sentry.io/platforms/javascript/llms.txt
```

### Deep Navigation
```
Original URL: https://docs.sentry.io/platforms/javascript/guides/react/configuration/
LLMs.txt URL: https://docs.sentry.io/platforms/javascript/guides/react/configuration/llms.txt
```

### Home Page
```
Original URL: https://docs.sentry.io/
LLMs.txt URL: https://docs.sentry.io/llms.txt
```

## Content Extraction Features

### Source File Detection
- **Primary locations**: `docs/{path}.mdx`, `docs/{path}/index.mdx`
- **Common files**: For platform docs, also checks `docs/platforms/{sdk}/common/` directory
- **Multiple formats**: Supports both `.mdx` and `.md` files
- **Fallback handling**: Graceful degradation when source files aren't found

### Content Processing
- **Frontmatter parsing**: Extracts titles and metadata using `gray-matter`
- **JSX removal**: Strips React components that don't translate to markdown
- **Import cleanup**: Removes JavaScript import/export statements
- **Expression removal**: Cleans JSX expressions `{...}`
- **Whitespace normalization**: Removes excessive newlines and spacing

### Response Format
```markdown
# Page Title

[Full cleaned markdown content]

---

**Original URL**: https://docs.sentry.io/original/path
**Generated**: 2024-01-01T12:00:00.000Z

*This is the full page content converted to markdown format.*
```

## File Structure

```
app/
├── api/
│   └── llms-txt/
│       └── [...path]/
│           └── route.ts          # Dynamic API route handler
src/
├── middleware.ts                 # URL interception and rewriting
LLMS_TXT_FEATURE.md              # This documentation
```

## Error Handling

- **404 errors**: When pages don't exist in the document tree
- **500 errors**: For file system or processing errors
- **Graceful fallbacks**: Default content when source files can't be accessed
- **Logging**: Error details logged to console for debugging

## Performance Considerations

- **Caching**: Responses cached for 1 hour (`max-age=3600`)
- **File system access**: Direct file reads for better performance
- **Error boundaries**: Prevents crashes from affecting other routes

## Testing

Test the feature by appending `llms.txt` to any documentation URL:

1. Visit any docs page (e.g., `/platforms/javascript/`)
2. Add `llms.txt` to the end: `/platforms/javascript/llms.txt`
3. Verify you receive plain markdown content instead of HTML

## Implementation Notes

- The feature works with both regular documentation and developer documentation
- API documentation (dynamically generated) gets placeholder content
- Common platform files are automatically detected and used when appropriate
- The middleware preserves URL structure while routing to the appropriate API endpoint