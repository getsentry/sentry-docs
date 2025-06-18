# Markdown Export Feature Documentation

This feature allows converting any page on the Sentry documentation site to a plain markdown format by simply appending `.md` to the end of any URL (without a trailing slash). The feature extracts the actual page content from the source MDX files and converts it to clean markdown, making the documentation more accessible to Large Language Models and other tools.

## Example URLs

- Markdown Export: https://docs.sentry.io/platforms/javascript/guides/react/user-feedback.md
- Markdown Export: https://docs.sentry.io/platforms/javascript/guides/nextjs/user-feedback.md
- Markdown Export: https://docs.sentry.io/platforms/javascript/guides/react/tracing.md

## How it works

- URL: /platforms/javascript/guides/react/user-feedback.md
- Rewrite: /api/md-export/platforms/javascript/guides/react/user-feedback

## Example usage

```
curl "http://localhost:3000/platforms/javascript/guides/react/user-feedback.md"
curl "http://localhost:3000/platforms/javascript/guides/nextjs/user-feedback.md"
curl "http://localhost:3000/platforms/javascript/guides/react/tracing.md"
curl "http://localhost:3000/platforms/javascript/guides/vue/user-feedback.md"
```

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