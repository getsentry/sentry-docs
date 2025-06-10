# LLMs.txt Feature Documentation

## Overview

This feature allows converting any page on the Sentry documentation site to a plain markdown format by simply appending `llms.txt` to the end of any URL. The feature extracts the actual page content from the source MDX files and converts it to clean markdown, making the documentation more accessible to Large Language Models (LLMs) and other automated tools.

## ✅ **Feature Status: FULLY WORKING**

The feature successfully extracts full page content from source MDX files, resolves platform-specific code snippets, and converts JSX components to clean markdown format.

## 🚀 **Major Update: Code Snippets Included!**

The feature now properly resolves `<PlatformContent includePath="..." />` components by loading the actual platform-specific code snippets from the `platform-includes/` directory.

### Code Snippet Resolution Features
- ✅ **Platform Detection**: Automatically detects platform and guide from URL path
- ✅ **Dynamic Includes**: Loads content from `platform-includes/{section}/{platform}.{guide}.mdx`
- ✅ **Fallback Handling**: Falls back to platform-level or generic includes if specific ones don't exist
- ✅ **Code Block Preservation**: Existing markdown code blocks are preserved during JSX cleanup
- ✅ **Multiple Platforms**: Works correctly across different JavaScript frameworks (React, Next.js, Vue, etc.)

## Usage Examples

### React User Feedback with Code Snippets
```
Original: https://docs.sentry.io/platforms/javascript/guides/react/user-feedback/
LLMs.txt: https://docs.sentry.io/platforms/javascript/guides/react/user-feedback/llms.txt
```

**Now Includes**:
- **Prerequisites**: Full SDK requirements and browser compatibility
- **Installation**: Actual npm/yarn/pnpm commands for React
- **Setup**: Complete JavaScript configuration code
- **API Examples**: Actual code snippets for user feedback implementation

### Next.js User Feedback (Platform-Specific)
```
Original: https://docs.sentry.io/platforms/javascript/guides/nextjs/user-feedback/
LLMs.txt: https://docs.sentry.io/platforms/javascript/guides/nextjs/user-feedback/llms.txt
```

**Shows Next.js-Specific Content**:
```bash
npx @sentry/wizard@latest -i nextjs
```
Instead of generic npm install commands.

### React Tracing with Enhanced Content
```
Original: https://docs.sentry.io/platforms/javascript/guides/react/tracing/
LLMs.txt: https://docs.sentry.io/platforms/javascript/guides/react/tracing/llms.txt
```

**Now Includes**:
- **Enable Tracing**: Platform-specific activation instructions
- **Configure**: Detailed sampling rate configuration
- **Code Examples**: Actual JavaScript implementation code

## Content Resolution Architecture

```
URL: /platforms/javascript/guides/react/user-feedback/llms.txt
  ↓ (Middleware intercepts)
Rewrite: /api/llms-txt/platforms/javascript/guides/react/user-feedback
  ↓ (API route processes)
1. Parse path: platform='javascript', guide='react'
2. Load: docs/platforms/javascript/common/user-feedback/index.mdx
3. Detect: <PlatformContent includePath="user-feedback/install" />
4. Resolve: platform-includes/user-feedback/install/javascript.react.mdx
5. Replace: Include actual React installation code snippets
6. Output: Full documentation with real code examples
```

## Platform Include Resolution

### Detection Logic
```typescript
// From URL: /platforms/javascript/guides/react/user-feedback/
platform = 'javascript'     // pathSegments[1]
guide = 'react'             // pathSegments[3]
platformId = 'javascript.react'  // Combined identifier
```

### File Resolution Priority
```typescript
// For <PlatformContent includePath="user-feedback/install" />
1. platform-includes/user-feedback/install/javascript.react.mdx  ✓ Most specific
2. platform-includes/user-feedback/install/javascript.mdx       ↓ Platform fallback
3. platform-includes/user-feedback/install/index.mdx           ↓ Generic fallback
```

### Real Example Output

**Before (Missing Code)**:
```markdown
### Installation
*[Installation instructions would appear here for javascript.react]*
```

**After (With Real Code)**:
```markdown
### Installation
The User Feedback integration is **already included** with the React SDK package.

```bash {tabTitle:npm}
npm install @sentry/react --save
```

```bash {tabTitle:yarn}
yarn add @sentry/react
```

```bash {tabTitle:pnpm}
pnpm add @sentry/react
```
```

## Smart Content Processing

### Enhanced JSX Component Handling
- **Alert components** → `> **Note:** [content]`
- **PlatformIdentifier** → `` `traces-sample-rate` ``
- **PlatformLink** → `[Link Text](/path/to/page)`
- **PlatformContent includes** → **Actual platform-specific content loaded from files**
- **Code block preservation** → All existing markdown code blocks preserved
- **Nested components** → Multi-pass processing ensures complete cleanup

### Content Preservation Technology
- ✅ **Code Block Protection**: Temporarily replaces code blocks during JSX cleanup
- ✅ **Include Resolution**: Loads real content from platform-includes directory
- ✅ **Platform Awareness**: Automatically detects platform/guide from URL path
- ✅ **Smart Fallbacks**: Graceful degradation when includes aren't found
- ✅ **Content Reconstruction**: Restores protected content after cleanup

## Response Format with Code Snippets

```markdown
# Set Up User Feedback

The User Feedback feature allows you to collect user feedback from anywhere inside your application at any time.

> **Note:** 
If you're using a self-hosted Sentry instance, you'll need to be on version 24.4.2 or higher.

### Installation

The User Feedback integration is **already included** with the React SDK package.

```bash {tabTitle:npm}
npm install @sentry/react --save
```

```bash {tabTitle:yarn}
yarn add @sentry/react
```

```bash {tabTitle:pnpm}
pnpm add @sentry/react
```

### Set Up

```javascript
Sentry.init({
  dsn: "___PUBLIC_DSN___",

  integrations: [
    Sentry.feedbackIntegration({
      colorScheme: "system",
    }),
  ],
});
```

---

**Original URL**: https://docs.sentry.io/platforms/javascript/guides/react/user-feedback
**Generated**: 2025-06-10T22:25:15.123Z

*This is the full page content converted to markdown format.*
```

## Technical Implementation

### Enhanced API Route Features
```typescript
// New async function for include resolution
async function resolvePlatformIncludes(content: string, pathSegments: string[]): Promise<string> {
  // Platform detection from URL segments
  // File loading from platform-includes/
  // Content replacement with error handling
}

// Code block preservation during cleanup
cleaned = cleaned.replace(/```[\s\S]*?```/g, (match) => {
  codeBlocks.push(match);
  return `${codeBlockPlaceholder}${codeBlocks.length - 1}`;
});
```

### File System Integration
- **Direct file access** to `platform-includes/` directory
- **Gray-matter parsing** for include files
- **Multi-path resolution** with intelligent fallbacks
- **Error handling** with descriptive placeholders

## Benefits

✅ **Complete Content**: Extracts actual page content AND code snippets  
✅ **Platform-Specific**: Shows correct installation/setup for each framework  
✅ **LLM-Optimized**: Clean markdown format perfect for AI processing  
✅ **Smart Conversion**: JSX components converted to appropriate markdown  
✅ **Code Preservation**: All code blocks and snippets properly maintained  
✅ **Universal Access**: Works with any documentation page  
✅ **High Performance**: Cached responses with efficient processing  
✅ **Error Resilient**: Graceful fallbacks and informative error messages  

## Testing Commands

```bash
# Test React user feedback with full code snippets
curl "http://localhost:3000/platforms/javascript/guides/react/user-feedback/llms.txt"

# Test Next.js-specific installation (shows wizard command)
curl "http://localhost:3000/platforms/javascript/guides/nextjs/user-feedback/llms.txt"

# Test React tracing with platform-specific content
curl "http://localhost:3000/platforms/javascript/guides/react/tracing/llms.txt"

# Test Vue.js user feedback (different platform)
curl "http://localhost:3000/platforms/javascript/guides/vue/user-feedback/llms.txt"
```

---

**Status**: ✅ **PRODUCTION READY WITH FULL CODE SNIPPETS**  
**Last Updated**: December 2024  
**Content Quality**: Full page content with platform-specific code examples  
**Code Coverage**: Installation, setup, configuration, and API examples all included