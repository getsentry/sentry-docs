# Typography Changes - Next.js Page Only

## Overview
Implemented clean, page-specific typography improvements for the Next.js manual setup page (`/platforms/javascript/guides/nextjs/manual-setup`) with a focus on reducing visual noise while enhancing readability.

## Approach
- **Page-specific targeting**: Changes only apply to the Next.js manual setup page
- **Clean design**: Removed heavy underlines and excessive visual elements
- **Supabase-inspired**: Used clean, minimal styling approach like the reference site
- **Preserved site consistency**: All other pages remain unchanged

## Key Changes Made

### Enhanced Typography (Page-Specific in app/globals.css)
**Clean heading hierarchy:**
- **H1**: 2.25rem (36px) with subtle letter-spacing
- **H2**: 1.75rem (28px) with subtle left accent bar instead of heavy underlines
- **H3**: 1.375rem (22px) for subsection headers
- **H4**: 1.125rem (18px) for component headers

**Improved readability:**
- **Body text**: Enhanced line-height (1.6) for better scanning
- **Lists**: Better spacing and consistent line-height
- **Code blocks**: Larger font (14px) with improved padding and subtle borders

**Reduced visual noise:**
- **No heavy underlines**: Replaced H2 border-bottom with subtle left accent
- **Cleaner alerts**: Toned down backgrounds and border colors
- **Better code styling**: Subtle borders instead of heavy backgrounds
- **Improved spacing**: More breathing room between sections

### Targeting Strategy
Uses specific CSS selectors to target only the Next.js manual setup page:
```css
body:has([data-path*="nextjs/manual-setup"]) .main-content,
.main-content:has(h1:contains("Manual Setup")),
.content-wrapper:has([href*="nextjs/manual-setup"]),
[data-current-pathname*="nextjs/manual-setup"]
```

### Visual Improvements Applied Only to Next.js Page
- **Subtle step indicators**: Small accent bars instead of heavy underlines
- **Enhanced code readability**: 12px → 14px font size with better line-height
- **Cleaner alert styling**: Reduced visual noise with subtle backgrounds
- **Better content hierarchy**: Clear size progression without excessive decoration
- **Improved spacing**: More generous margins between major sections

## Files Modified
1. `app/globals.css` - Added page-specific typography rules
2. **All other components reverted** - Maintaining site-wide consistency

## Expected Visual Changes (Next.js Page Only)
### ✅ Clean Typography Hierarchy
- Larger, more readable headings without heavy decorations
- Clear visual progression from H1 through H4
- Subtle step indicators instead of bold underlines

### ✅ Enhanced Code Readability
- Larger code blocks (14px vs 12px)
- Better line spacing for easier scanning
- Subtle borders for better definition

### ✅ Reduced Visual Noise
- Toned down alert colors and backgrounds
- Removed heavy border treatments
- Cleaner, more focused content presentation

### ✅ Improved Content Flow
- Better spacing between major sections
- More generous margins for easier reading
- Enhanced list readability

## Responsive Design
- Mobile-optimized font sizes
- Removes decorative elements on smaller screens
- Maintains readability across all devices

## Next Steps for Review
1. Run `npm run dev` locally
2. Navigate specifically to `/platforms/javascript/guides/nextjs/manual-setup`
3. Compare the clean typography with other documentation pages
4. Test responsiveness on mobile devices
5. Verify the changes are isolated to only this page

## Benefits
- **Isolated changes**: Only affects the target page, maintaining site consistency
- **Cleaner design**: Inspired by modern documentation sites like Supabase
- **Better readability**: Larger fonts and improved spacing
- **Reduced noise**: Less visual clutter, more focus on content
- **Accessibility maintained**: Proper heading hierarchy and contrast ratios