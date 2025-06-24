# URL Parameter Ferrying Implementation

This document describes the URL parameter ferrying functionality that has been implemented in your Sentry documentation site.

## Overview

URL parameter ferrying automatically preserves and transfers specific URL parameters from the current page to all internal links on the site. This ensures that important tracking parameters (like UTM codes, promo codes, etc.) are maintained as users navigate through the documentation.

## Implemented Features

### 1. Updated Parameter Patterns

The parameter syncing patterns in `src/utils.ts` have been updated to focus on:
- `^utm_` - UTM tracking parameters (utm_source, utm_medium, utm_campaign, etc.)
- `^promo_` - Promotional parameters (promo_code, promo_id, etc.)
- `code` - Generic code parameters
- `ref` - Referral parameters

**Previous patterns:** `[/utm_/i, /promo_/i, /gclid/i, /original_referrer/i]`
**Updated patterns:** `[/^utm_/i, /^promo_/i, /code/, /ref/]`

### 2. Enhanced Utility Functions

**`ferryUrlParams(targetUrl, additionalParams)`** - A new utility function that:
- Takes a target URL and optional additional parameters
- Extracts matching parameters from the current page
- Appends them to the target URL
- Returns the modified URL with parameters

### 3. Updated Link Components

**SmartLink Component** (`src/components/smartLink.tsx`):
- Now automatically ferries parameters to internal links
- External links remain unchanged
- Preserves existing functionality while adding parameter ferrying

**NavLink Component** (`src/components/navlink.tsx`):
- Navigation links now automatically include ferried parameters
- Maintains the existing Button styling and behavior

### 4. Automatic Parameter Ferrying Component

**ParamFerry Component** (`src/components/paramFerry.tsx`):
- A client-side component that automatically processes all links on the page
- Uses MutationObserver to handle dynamically added links
- Skips external links, anchors, mailto, and tel links
- Marks processed links to avoid duplicate processing

**Added to Layout** (`app/layout.tsx`):
- The ParamFerry component is included in the root layout
- Works automatically across all pages without additional setup

## How It Works

1. **Page Load**: When a page loads with URL parameters matching the patterns, the ParamFerry component identifies them
2. **Link Processing**: All internal links on the page are processed to include the relevant parameters
3. **Dynamic Updates**: New links added to the page (via JavaScript) are automatically processed
4. **Navigation**: When users click internal links, they carry forward the tracked parameters

## Examples

### Before Implementation
```
Current URL: /docs/platforms/javascript/?utm_source=google&utm_medium=cpc&code=SUMMER2024
Link on page: /docs/error-reporting/
User clicks: Goes to /docs/error-reporting/ (parameters lost)
```

### After Implementation
```
Current URL: /docs/platforms/javascript/?utm_source=google&utm_medium=cpc&code=SUMMER2024
Link on page: /docs/error-reporting/ (automatically becomes /docs/error-reporting/?utm_source=google&utm_medium=cpc&code=SUMMER2024)
User clicks: Goes to /docs/error-reporting/?utm_source=google&utm_medium=cpc&code=SUMMER2024 (parameters preserved)
```

## Usage in Components

### Using the Enhanced SmartLink
```tsx
import {SmartLink} from 'sentry-docs/components/smartLink';

// Parameters are automatically ferried
<SmartLink href="/docs/getting-started/">Get Started</SmartLink>
```

### Using the ferryUrlParams Utility
```tsx
import {ferryUrlParams} from 'sentry-docs/utils';

const linkUrl = ferryUrlParams('/docs/platforms/');
// Returns URL with current page's tracked parameters appended
```

### Using NavLink
```tsx
import {NavLink} from 'sentry-docs/components/navlink';

// Parameters are automatically ferried
<NavLink href="/docs/guides/">Guides</NavLink>
```

## Browser Compatibility

The implementation uses:
- `URLSearchParams` for parameter handling
- `MutationObserver` for dynamic link detection
- Modern JavaScript features supported in all current browsers

## Performance Considerations

- Links are processed efficiently using native DOM methods
- MutationObserver is used to minimize performance impact
- Processed links are marked to avoid reprocessing
- Debouncing prevents excessive processing during rapid DOM changes

## Customization

To modify the parameter patterns, update the `paramsToSync` array in `src/utils.ts`:

```typescript
const paramsToSync = [/^utm_/i, /^promo_/i, /code/, /ref/];
```

Add new patterns following the same format:
- Use RegExp for pattern matching (e.g., `/^custom_/i`)
- Use strings for exact matches (e.g., `'tracking_id'`)

## Testing

Test the functionality by:
1. Loading a page with tracked parameters: `http://localhost:3000/docs/?utm_source=test&code=ABC123`
2. Verifying that internal links include the parameters
3. Clicking links to confirm parameters are preserved
4. Checking that external links remain unchanged

The implementation is now active across your entire documentation site and will automatically ferry the specified URL parameters between pages.