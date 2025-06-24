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

### 4. Safe Parameter Ferrying Link Component

**ParamFerryLink Component** (`src/components/paramFerryLink.tsx`):
- A safe Link component that handles parameter ferrying at the component level
- No DOM manipulation - parameters are ferried during rendering
- Only processes internal links (starting with `/` or `#`)
- Can be used as a drop-in replacement for Next.js Link component

## How It Works

1. **Component Rendering**: When link components render, they check for matching URL parameters in the current page
2. **Parameter Extraction**: Parameters matching the specified patterns are extracted from the current URL
3. **URL Construction**: Parameters are safely appended to internal link URLs during component rendering
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

### Using ParamFerryLink
```tsx
import {ParamFerryLink} from 'sentry-docs/components/paramFerryLink';

// Safe component-level parameter ferrying
<ParamFerryLink href="/docs/getting-started/">Get Started</ParamFerryLink>
```

## Security Features

The implementation includes comprehensive security measures:
- **Same-Origin Policy**: Only processes URLs from the same origin to prevent cross-site attacks
- **Internal Links Only**: Component-level ferrying only applies to internal links (starting with `/` or `#`)
- **No DOM Manipulation**: Avoids security risks associated with modifying existing DOM elements
- **Parameter Length Limits**: Parameter values are limited to 200 characters
- **Type Validation**: Ensures all parameters are strings before processing

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