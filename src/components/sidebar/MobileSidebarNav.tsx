'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

import {Platform} from 'sentry-docs/types';

// Main navigation sections - these are simple links that navigate to their index pages
// The SidebarNavigation component below handles showing the children for each section
const mainSections = [
  {label: 'SDKs', href: '/platforms/'},
  {label: 'Product', href: '/product/'},
  {label: 'AI', href: '/ai/'},
  {label: 'Guides', href: '/guides/'},
  {label: 'Concepts', href: '/concepts/'},
  {label: 'Admin', href: '/organization/'},
  {label: 'API', href: '/api/'},
  {label: 'Security, Legal, & PII', href: '/security-legal-pii/'},
];

export function MobileSidebarNav({platforms = []}: {platforms?: Platform[]}) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname?.startsWith(href);

  // Compute the SDK link href - use stored platform URL if available
  const [sdkLinkHref, setSdkLinkHref] = useState('/platforms/');

  // Update href after hydration to check localStorage
  useEffect(() => {
    const storedPlatform = localStorage.getItem('active-platform');
    if (storedPlatform && platforms.length > 0) {
      const platform = platforms.find(p => p.key === storedPlatform);
      if (platform) {
        setSdkLinkHref(platform.url);
        return;
      }
      for (const p of platforms) {
        const guide = p.guides.find(g => g.key === storedPlatform);
        if (guide) {
          setSdkLinkHref(guide.url);
          return;
        }
      }
    }
  }, [platforms]);

  // Click handler as fallback for SDKs link
  const handleSdkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const storedPlatform = localStorage.getItem('active-platform');
    if (storedPlatform && platforms && platforms.length > 0) {
      // First check if it's a platform key
      const platform = platforms.find(p => p.key === storedPlatform);
      if (platform) {
        e.preventDefault();
        window.location.href = platform.url;
        return;
      }
      // Then check guides
      for (const p of platforms) {
        if (p.guides) {
          const guide = p.guides.find(g => g.key === storedPlatform);
          if (guide) {
            e.preventDefault();
            window.location.href = guide.url;
            return;
          }
        }
      }
    }
  };

  return (
    <div className="md:hidden px-3 pb-3 border-b border-[var(--gray-a3)]">
      {/* Main navigation sections - simple links that navigate to index pages */}
      <nav className="space-y-1">
        {mainSections.map(section =>
          section.label === 'SDKs' ? (
            <a
              key={section.href}
              href={sdkLinkHref}
              onClick={handleSdkClick}
              className={`block py-2 px-2 rounded text-sm font-medium transition-colors ${
                isActive('/platforms/')
                  ? 'text-[var(--accent-purple)] bg-[var(--accent-purple-light)]'
                  : 'text-[var(--gray-12)] hover:bg-[var(--gray-a3)]'
              }`}
            >
              {section.label}
            </a>
          ) : (
            <Link
              key={section.href}
              href={section.href}
              className={`block py-2 px-2 rounded text-sm font-medium transition-colors ${
                isActive(section.href)
                  ? 'text-[var(--accent-purple)] bg-[var(--accent-purple-light)]'
                  : 'text-[var(--gray-12)] hover:bg-[var(--gray-a3)]'
              }`}
            >
              {section.label}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
