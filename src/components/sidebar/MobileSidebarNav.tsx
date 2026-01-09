'use client';

import {Fragment, useState} from 'react';
import {ChevronDownIcon} from '@radix-ui/react-icons';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

const productSections = [
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

const conceptsSections = [
  {label: 'Key Terms', href: '/concepts/key-terms/'},
  {label: 'Search', href: '/concepts/search/'},
  {label: 'Migration', href: '/concepts/migration/'},
  {label: 'Data Management', href: '/concepts/data-management/'},
  {label: 'Sentry CLI', href: '/cli/'},
];

const adminSections = [
  {label: 'Account Settings', href: '/account/'},
  {label: 'Organization Settings', href: '/organization/'},
  {label: 'Pricing & Billing', href: '/pricing'},
];

const mainSections = [
  {label: 'SDKs', href: '/platforms/'},
  {label: 'Product', href: '/product/', dropdown: productSections},
  {label: 'Concepts', href: '/concepts/', dropdown: conceptsSections},
  {label: 'Admin', href: '/organization/', dropdown: adminSections},
  {label: 'API', href: '/api/'},
  {label: 'Security, Legal, & PII', href: '/security-legal-pii/'},
];

export function MobileSidebarNav() {
  const pathname = usePathname();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (label: string) => {
    setExpandedSection(prev => (prev === label ? null : label));
  };

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <div className="lg-xl:hidden px-3 pb-3 border-b border-[var(--gray-a3)]">
      {/* Main navigation sections */}
      <nav className="space-y-1">
        {mainSections.map(section => (
          <div key={section.href}>
            {section.dropdown ? (
              <Fragment>
                <button
                  onClick={() => toggleSection(section.label)}
                  className={`w-full flex items-center justify-between py-2 px-2 rounded text-sm font-medium transition-colors ${
                    isActive(section.href)
                      ? 'text-[var(--accent-purple)] bg-[var(--accent-purple-light)]'
                      : 'text-[var(--gray-12)] hover:bg-[var(--gray-a3)]'
                  }`}
                >
                  <span>{section.label}</span>
                  <ChevronDownIcon
                    className={`transition-transform duration-200 ${
                      expandedSection === section.label ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSection === section.label && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-[var(--gray-a3)] pl-3">
                    {section.dropdown.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block py-1.5 px-2 rounded text-sm transition-colors ${
                          pathname?.startsWith(item.href)
                            ? 'text-[var(--accent-purple)] bg-[var(--accent-purple-light)]'
                            : 'text-[var(--gray-11)] hover:text-[var(--gray-12)] hover:bg-[var(--gray-a3)]'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </Fragment>
            ) : (
              <Link
                href={section.href}
                className={`block py-2 px-2 rounded text-sm font-medium transition-colors ${
                  isActive(section.href)
                    ? 'text-[var(--accent-purple)] bg-[var(--accent-purple-light)]'
                    : 'text-[var(--gray-12)] hover:bg-[var(--gray-a3)]'
                }`}
              >
                {section.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
