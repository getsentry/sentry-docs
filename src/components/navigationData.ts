// Shared navigation data used across multiple components
// This ensures consistency and makes updates easier

export type NavSection = {
  href: string;
  label: string;
  dropdown?: NavSection[];
};

// Product sub-sections (used in TopNavClient dropdown)
export const productSections: NavSection[] = [
  {label: 'Sentry Basics', href: '/product/sentry-basics/'},
  {label: 'AI in Sentry', href: '/product/ai-in-sentry/'},
  {label: 'Insights', href: '/product/insights/'},
  {label: 'User Feedback', href: '/product/user-feedback/'},
  {label: 'Uptime Monitoring', href: '/product/uptime-monitoring/'},
  {label: 'Dashboards', href: '/product/dashboards/'},
  {label: 'Projects', href: '/product/projects/'},
  {label: 'Explore', href: '/product/explore/'},
  {label: 'Issues', href: '/product/issues/'},
  {label: 'Alerts', href: '/product/alerts/'},
  {label: 'Crons', href: '/product/crons/'},
  {label: 'Releases', href: '/product/releases/'},
  {label: 'Relay', href: '/product/relay/'},
  {label: 'Sentry MCP', href: '/product/sentry-mcp/'},
  {label: 'Sentry Toolbar', href: '/product/sentry-toolbar/'},
  {label: 'Stats', href: '/product/stats/'},
  {label: 'Codecov', href: '/product/codecov/'},
  {label: 'Onboarding', href: '/product/onboarding/'},
];

// Concepts sub-sections
export const conceptsSections: NavSection[] = [
  {label: 'Key Terms', href: '/concepts/key-terms/'},
  {label: 'Search', href: '/concepts/search/'},
  {label: 'Migration', href: '/concepts/migration/'},
  {label: 'Data Management', href: '/concepts/data-management/'},
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
  {label: 'Product', href: '/product/', dropdown: productSections},
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
