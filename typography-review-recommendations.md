# Typography Review: Next.js Manual Setup Page

## Overview

This document provides a comprehensive review of the typography and font sizing for the Sentry Next.js Manual Setup documentation page (`/platforms/javascript/guides/nextjs/manual-setup`) with specific recommendations to improve visual hierarchy and readability.

## Current Typography Analysis

### Current Font System
- **Base Font**: Rubik (from `--font-rubik` in globals.css)
- **Monospace**: Roboto Mono, SFMono-Regular, Consolas
- **Current Sizing**: Uses a mix of Tailwind classes and CSS variables with inconsistent scaling

### Current Typography Issues Identified

1. **Inconsistent Heading Hierarchy**
   - H1 title size not prominently differentiated from H2 steps
   - No clear size distinction between main steps and subsections
   - Step numbers blend with content rather than standing out

2. **Poor Code Block Integration**
   - Code blocks use small font sizes (0.75rem, 0.8rem) making them hard to read
   - Insufficient contrast between code and explanatory text
   - Filename annotations too subtle

3. **Weak Information Hierarchy**
   - Important alerts and tips don't stand out sufficiently
   - Navigation steps lack visual prominence
   - Technical details have same weight as introductory content

4. **Readability Challenges**
   - Long code blocks without adequate line height
   - Dense technical content without breathing room
   - Small text in components (0.8rem in multiple places)

## Recommended Typography Improvements

### 1. Enhanced Heading Hierarchy

```css
/* Primary Title */
h1 {
  font-size: 2.5rem; /* 40px */
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

/* Step Headers (Step 1, Step 2, etc.) */
h2 {
  font-size: 1.875rem; /* 30px */
  font-weight: 600;
  line-height: 1.3;
  margin-top: 3rem;
  margin-bottom: 1.25rem;
  color: var(--accent-purple);
  border-bottom: 2px solid var(--accent-purple-light);
  padding-bottom: 0.5rem;
}

/* Subsection Headers */
h3 {
  font-size: 1.5rem; /* 24px */
  font-weight: 500;
  line-height: 1.4;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

/* Component Headers */
h4 {
  font-size: 1.25rem; /* 20px */
  font-weight: 500;
  line-height: 1.4;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
```

### 2. Improved Body Text Scaling

```css
/* Base paragraph text */
p, li {
  font-size: 1rem; /* 16px */
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* Large introductory text */
.lead-text {
  font-size: 1.125rem; /* 18px */
  line-height: 1.6;
  color: var(--gray-11);
  margin-bottom: 1.5rem;
}

/* Small supporting text */
.caption, .note {
  font-size: 0.875rem; /* 14px */
  line-height: 1.5;
  color: var(--gray-10);
}
```

### 3. Enhanced Code Block Typography

```css
/* Inline code */
code {
  font-size: 0.9em;
  font-family: var(--font-family-monospace);
  background: var(--gray-a2);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  color: var(--codeColor);
}

/* Code blocks */
pre {
  font-size: 0.875rem; /* 14px */
  line-height: 1.6;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background: var(--gray-1);
  overflow-x: auto;
  margin: 1.5rem 0;
}

/* Filename annotations */
.filename-annotation {
  font-size: 0.8125rem; /* 13px */
  font-weight: 500;
  color: var(--accent-purple);
  background: var(--accent-purple-light);
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem 0.25rem 0 0;
  margin-bottom: -1px;
}

/* Tab titles */
.tab-title {
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  padding: 0.5rem 1rem;
}
```

### 4. Alert and Component Typography

```css
/* Alert components */
.alert {
  font-size: 0.9375rem; /* 15px */
  line-height: 1.5;
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

.alert-title {
  font-size: 1rem; /* 16px */
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Step indicators */
.step-indicator {
  font-size: 1.125rem; /* 18px */
  font-weight: 700;
  color: var(--accent-purple);
  background: var(--accent-purple-light);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  display: inline-block;
  margin-bottom: 1rem;
}
```

### 5. List and Navigation Typography

```css
/* Ordered and unordered lists */
ul, ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

/* Nested lists */
li ul, li ol {
  margin: 0.5rem 0;
}

/* Table of contents */
.toc-item {
  font-size: 0.875rem; /* 14px */
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.toc-item.active {
  font-weight: 500;
  color: var(--accent-purple);
}
```

## Specific Page Improvements

### 1. Header Section Enhancement
- Increase main title from current size to 2.5rem (40px)
- Add descriptive subtitle at 1.125rem (18px) with reduced opacity
- Enhance the wizard installer alert with better typography contrast

### 2. Step Section Improvements
- Style step headers with distinct color and border treatment
- Add step number badges with proper contrast
- Increase spacing between major sections

### 3. Code Block Enhancements
- Increase code font size from 0.75rem to 0.875rem (14px)
- Improve line height from 1.2 to 1.6 for better readability
- Add better contrast for filename annotations
- Enhance tab styling for package manager options

### 4. Content Flow Improvements
- Add lead paragraphs for major sections at 1.125rem
- Improve spacing between related elements
- Enhance visual separation between configuration steps

## Implementation Priority

### High Priority (Immediate Impact)
1. **Heading hierarchy improvements** - Most critical for navigation
2. **Code block font size increase** - Essential for readability
3. **Step indicator enhancements** - Key for user guidance

### Medium Priority (Quality of Life)
1. **Body text line height improvements**
2. **Alert component typography**
3. **List spacing optimization**

### Low Priority (Polish)
1. **Filename annotation styling**
2. **Table of contents typography**
3. **Micro-spacing adjustments**

## Accessibility Considerations

### WCAG Compliance
- Maintain minimum 4.5:1 contrast ratio for all text
- Ensure font sizes meet minimum requirements (16px base)
- Provide sufficient line height (1.5+) for readability
- Use relative units for scalability

### Screen Reader Optimization
- Maintain proper heading hierarchy (h1 → h2 → h3)
- Ensure code blocks have appropriate labels
- Use semantic markup for all typography elements

## Measurement & Testing

### Key Metrics to Track
1. **Reading time per section**
2. **Scroll depth and engagement**
3. **Code copy success rates**
4. **User feedback on clarity**

### Testing Recommendations
1. A/B testing on typography changes
2. User testing with developers of varying experience levels
3. Accessibility testing with screen readers
4. Mobile responsiveness validation

## Conclusion

These typography improvements will significantly enhance the visual hierarchy and readability of the Next.js manual setup documentation. The focus on clear step differentiation, improved code readability, and proper information hierarchy will help developers more efficiently navigate and implement Sentry integration.

The recommendations prioritize developer experience while maintaining consistency with Sentry's design system and ensuring accessibility compliance.