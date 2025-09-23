# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is Sentry's official documentation site built with Next.js 15. The site serves two purposes:
- **User Documentation** (`docs/`) - Public documentation for Sentry users
- **Developer Documentation** (`develop-docs/`) - Internal documentation for Sentry contributors

## Essential Commands

### Development
```bash
# Start development server for user docs
yarn dev

# Start development server for developer docs (internal)
yarn dev:developer-docs

# Build the site
yarn build

# Run tests
yarn test

# Run a single test file
yarn test path/to/test.spec.ts
```

### Code Quality
```bash
# Run all linting
yarn lint

# Fix linting issues automatically
yarn lint:fix

# Check formatting
yarn lint:prettier

# Check ESLint rules
yarn lint:eslint
```

## Architecture & Key Patterns

### Dual Documentation System
The repository supports two documentation modes controlled by the `NEXT_PUBLIC_DEVELOPER_DOCS` environment variable:
- User docs: Default mode, serves content from `docs/`
- Developer docs: Activated with env var, serves content from `develop-docs/`

Both modes share the same components and infrastructure but have separate content directories and build configurations.

### Platform-Centric Content Organization
The documentation is heavily organized around platforms/SDKs:
- Platform configurations: `src/data/platforms.yml`
- Platform-specific content: `platform-includes/`
- Dynamic platform selection and filtering throughout the UI
- Support for 40+ platforms (JavaScript, Python, Java, Go, React Native, etc.)

### MDX Content System
Documentation is written in MDX with a rich component ecosystem:
- Custom components defined in `src/mdxComponents.ts`
- Reusable content snippets in `includes/` and `platform-includes/`
- Frontmatter-based metadata for navigation and SEO
- Dynamic code examples with platform-specific variations

### Key Directories
- `app/` - Next.js App Router pages and layouts
- `src/components/` - React components used in MDX and layouts
- `src/middleware/` - Custom middleware for redirects and routing
- `src/build/` - Build-time utilities and scripts
- `public/` - Static assets

### Content Processing Pipeline
1. MDX files are parsed with gray-matter for frontmatter
2. Content goes through remark/rehype plugins for transformations
3. Custom components are injected via MDXProvider
4. Platform-specific includes are resolved dynamically
5. Code examples are syntax highlighted and can be platform-aware

### Environment Variables
Key environment variables that affect behavior:
- `NEXT_PUBLIC_DEVELOPER_DOCS` - Toggles developer documentation mode
- `SENTRY_DSN` - Sentry error monitoring (production)
- Various API keys for search, analytics, and chatbot integrations

## Development Guidelines

### Adding New Documentation
1. Place user docs in `docs/` following the existing folder structure
2. Add appropriate frontmatter (title, sidebar_order, description)
3. Use existing MDX components for consistency
4. Test with both `yarn dev` and `yarn build` to catch SSG issues

### Working with Platforms
- Platform data is centralized in `src/data/platforms.yml`
- Use `<PlatformContent>` component for platform-specific content
- Place reusable platform snippets in `platform-includes/`
- Test documentation across multiple platform selections

### Common Patterns
- Use `<Alert>` component for important notices
- Use `<ConfigKey>` for configuration options
- Use `<CodeSnippet>` for code examples with proper language tags
- Leverage `includes/` for content that appears in multiple places

### Testing Changes
1. Run `yarn lint` before committing
2. Test both development modes if changes affect routing/navigation
3. Verify redirects work with `yarn enforce-redirects`
4. Check that search indexing isn't broken by structural changes

## Important Considerations

### Performance
- The site uses static generation (SSG) for optimal performance
- Dynamic imports are used for heavy components
- Images should use Next.js Image component with proper dimensions

### SEO & Navigation
- Every page needs proper frontmatter with title and description
- Sidebar navigation is auto-generated from frontmatter `sidebar_order`
- URL structure should match the documentation hierarchy

### Content Versioning
- Some SDKs have version-specific documentation
- Version information is handled through frontmatter and conditional rendering
- Legacy content may need migration when updating major SDK versions