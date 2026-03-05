// Shared navigation data used across multiple components
// This ensures consistency and makes updates easier

export type NavSection = {
  href: string;
  label: string;
  dropdown?: NavSection[];
};

// Concepts sub-sections
export const conceptsSections: NavSection[] = [
  {label: 'Key Terms', href: '/concepts/key-terms/'},
  {label: 'Search', href: '/concepts/search/'},
  {label: 'Migration', href: '/concepts/migration/'},
  {label: 'Data Management', href: '/concepts/data-management/'},
  {label: 'OpenTelemetry (OTLP)', href: '/concepts/otlp/'},
  {label: 'Sentry CLI', href: '/cli/'},
];

// "More" sub-sections (combines Admin + Security, Legal, & PII)
export const moreSections: NavSection[] = [
  {label: 'Account Settings', href: '/account/'},
  {label: 'Organization Settings', href: '/organization/'},
  {label: 'Pricing & Billing', href: '/pricing/'},
  {label: 'Security, Legal, & PII', href: '/security-legal-pii/'},
];

// Main navigation sections with dropdowns (used in TopNavClient)
// Labels use title case with proper acronym handling (SDKs, API stay uppercase)
export const mainSectionsWithDropdowns: NavSection[] = [
  {label: 'SDKs', href: '/platforms/'},
  {label: 'Product', href: '/product/'},
  {label: 'AI', href: '/ai/'},
  {label: 'Guides', href: '/guides/'},
  {label: 'Concepts', href: '/concepts/', dropdown: conceptsSections},
  {label: 'API', href: '/api/'},
  {label: 'More', href: '/organization/', dropdown: moreSections},
];

// Main navigation sections as simple links (used in mobile nav, header, sidebar)
// Labels are title case for mobile/sidebar display
export const mainSections: NavSection[] = [
  {label: 'SDKs', href: '/platforms/'},
  {label: 'Product', href: '/product/'},
  {label: 'AI', href: '/ai/'},
  {label: 'Guides', href: '/guides/'},
  {label: 'Concepts', href: '/concepts/'},
  {label: 'API', href: '/api/'},
  {label: 'Account Settings', href: '/account/'},
  {label: 'Organization Settings', href: '/organization/'},
  {label: 'Pricing & Billing', href: '/pricing/'},
  {label: 'Security, Legal, & PII', href: '/security-legal-pii/'},
];
