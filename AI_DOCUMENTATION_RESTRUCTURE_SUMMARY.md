# AI Documentation Restructure Summary

This document summarizes the major changes made to restructure Sentry's AI and Seer documentation according to the provided specifications.

## New Structure Created

### Main AI in Sentry Section
- **Location**: `docs/product/ai-in-sentry/`
- **Purpose**: Top-level section for all AI features in Sentry
- **Level**: Same as Issues, Projects, Explore (under Product walkthrough)

### Seer Subsection
- **Location**: `docs/product/ai-in-sentry/seer/`
- **Content**:
  - Main Seer overview page
  - Issue Scan (placeholder for PG content)
  - Issue Fix (migrated Autofix content)
  - Seer Privacy and Security

### Other AI Features Subsection
- **Location**: `docs/product/ai-in-sentry/other-ai-features/`
- **Content**:
  - Main overview page
  - Issue Summary (migrated content)
  - ML Issue Grouping (placeholder for PG content)

## Content Migration and Updates

### From Old Seer Page
- **Source**: `docs/product/issues/issue-details/sentry-seer/index.mdx`
- **Destination**: Distributed across new structure
- **Status**: Old page deprecated with redirects

### Terminology Updates
- **Autofix** → **Issue Fix** (where referring to the specific feature)
- **Autofix** → **Seer** (where referring to the AI agent generally)
- Updated in:
  - Main content files
  - MCP documentation
  - Self-hosted documentation
  - Service data usage policy

### Images and Assets
- Copied from `docs/product/issues/issue-details/sentry-seer/img/` to `docs/product/ai-in-sentry/seer/img/`
- All image references updated in Issue Fix documentation

## Redirects and Links

### Added Redirects
- **Source**: `/product/issues/issue-details/sentry-seer/:path*`
- **Destination**: `/product/ai-in-sentry/`
- **File**: `redirects.js`

### Updated References
- Service data usage policy: Link to new Seer location
- Issue details page: Link to new AI capabilities location
- All internal cross-references updated

## Files Modified

### New Files Created
1. `docs/product/ai-in-sentry/index.mdx`
2. `docs/product/ai-in-sentry/seer/index.mdx`
3. `docs/product/ai-in-sentry/seer/issue-scan.mdx`
4. `docs/product/ai-in-sentry/seer/issue-fix.mdx`
5. `docs/product/ai-in-sentry/seer/seer-privacy-security.mdx`
6. `docs/product/ai-in-sentry/other-ai-features/index.mdx`
7. `docs/product/ai-in-sentry/other-ai-features/issue-summary.mdx`
8. `docs/product/ai-in-sentry/other-ai-features/ml-issue-grouping.mdx`

### Files Modified
1. `docs/product/issues/issue-details/sentry-seer/index.mdx` (deprecated)
2. `docs/security-legal-pii/security/service-data-usage.mdx`
3. `docs/product/issues/issue-details/index.mdx`
4. `docs/product/sentry-mcp/index.mdx`
5. `develop-docs/self-hosted/index.mdx`
6. `redirects.js`

## Content Status

### Complete and Ready
- ✅ Main AI in Sentry page
- ✅ Seer overview page
- ✅ Issue Fix page (with migrated Autofix content)
- ✅ Issue Summary page
- ✅ Seer Privacy and Security page
- ✅ Other AI Features overview page

### Placeholders for Product Team (PG)
- 📝 Issue Scan content
- 📝 ML Issue Grouping content
- 📝 Additional Issue Fix setup instructions
- 📝 TTL and data lifecycle details

## Benefits of New Structure

1. **Better Organization**: AI features are grouped logically
2. **Scalability**: Easy to add new AI features
3. **Clear Separation**: Seer vs. other AI features distinction
4. **Future-Proof**: Structure supports growth of AI capabilities
5. **User-Friendly**: Logical navigation and discovery

## Notes for Content Team

- **Issue Scan**: Needs comprehensive content about filtering, actionability scores, and Seer labels
- **ML Issue Grouping**: Completely new content needed
- **Issue Fix Setup**: Detailed GitHub integration and configuration instructions needed
- **Privacy Details**: TTL and data lifecycle management content needed
- **Email Address**: Updated feedback email to `ai-feedback@sentry.io`

## Testing Recommendations

1. Verify all internal links work correctly
2. Test redirect from old Seer page
3. Check that images display properly in Issue Fix documentation
4. Validate navigation structure in documentation site
5. Confirm search functionality includes new content

## Rollout Considerations

- The old Seer page remains accessible with deprecation notice
- Redirects ensure existing bookmarks continue to work
- All existing external links will redirect to the main AI section
- Content is backward-compatible during transition period