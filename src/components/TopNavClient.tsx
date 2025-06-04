'use client';
import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

import {Platform} from 'sentry-docs/types';

import {PlatformSelector} from './platformSelector';

const productSections = [
  {label: 'Sentry', href: '/product/sentry/'},
  {label: 'Sentry Prevent', href: '/product/sentry-prevent/'},
  {label: 'Seer', href: '/product/seer/'},
];

const mainSections = [
  {label: 'Products', href: '/product/sentry'},
  {label: 'SDKs', href: '/platforms/'},
  {
    label: 'Concepts & Reference',
    href: '/concepts/',
    dropdown: [
      {label: 'Key Terms', href: '/concepts/key-terms/'},
      {label: 'Search', href: '/concepts/search/'},
      {label: 'Migration', href: '/concepts/migration/'},
      {label: 'Data Management', href: '/concepts/data-management/'},
      {label: 'Sentry CLI', href: '/cli/'},
    ],
  },
  {
    label: 'Admin',
    href: '/organization/',
    dropdown: [
      {label: 'Account Settings', href: '/account/'},
      {label: 'Organization Settings', href: '/organization/'},
      {label: 'Pricing & Billing', href: '/pricing'},
    ],
  },
];
const moreSections = [
  {label: 'API', href: '/api/'},
  {label: 'Security, Legal, & PII', href: '/security-legal-pii/'},
];

export default function TopNavClient({platforms}: {platforms: Platform[]}) {
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [platformDropdownByClick, setPlatformDropdownByClick] = useState(false);
  const platformBtnRef = useRef<HTMLButtonElement>(null);
  const platformDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isPlatformsRoute = pathname?.startsWith('/platforms/');
  const isProductRoot = pathname === '/product/sentry' || pathname === '/product/sentry/';
  const closeTimers = useRef<{products?: NodeJS.Timeout; sdks?: NodeJS.Timeout}>({});
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [conceptsDropdownOpen, setConceptsDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const productsBtnRef = useRef<HTMLButtonElement>(null);
  const conceptsBtnRef = useRef<HTMLButtonElement>(null);
  const adminBtnRef = useRef<HTMLButtonElement>(null);
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const conceptsDropdownRef = useRef<HTMLDivElement>(null);
  const adminDropdownRef = useRef<HTMLDivElement>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // Close dropdowns on outside click if opened by click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (platformDropdownOpen && platformDropdownByClick) {
        if (
          !platformBtnRef.current?.contains(e.target as Node) &&
          !platformDropdownRef.current?.contains(e.target as Node)
        ) {
          setPlatformDropdownOpen(false);
          setPlatformDropdownByClick(false);
        }
      }
      if (productsDropdownOpen) {
        if (
          !productsBtnRef.current?.contains(e.target as Node) &&
          !productsDropdownRef.current?.contains(e.target as Node)
        ) {
          setProductsDropdownOpen(false);
        }
      }
      if (conceptsDropdownOpen) {
        if (
          !conceptsBtnRef.current?.contains(e.target as Node) &&
          !conceptsDropdownRef.current?.contains(e.target as Node)
        ) {
          setConceptsDropdownOpen(false);
        }
      }
      if (adminDropdownOpen) {
        if (
          !adminBtnRef.current?.contains(e.target as Node) &&
          !adminDropdownRef.current?.contains(e.target as Node)
        ) {
          setAdminDropdownOpen(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [
    platformDropdownOpen,
    platformDropdownByClick,
    productsDropdownOpen,
    conceptsDropdownOpen,
    adminDropdownOpen,
  ]);

  return (
    <ul className="flex gap-4 w-full items-center">
      {mainSections.map(section => (
        <li key={section.href} className="list-none relative">
          {section.label === 'Products' ? (
            <div style={{display: 'inline-block'}}>
              <button
                ref={productsBtnRef}
                className={`text-[var(--gray-12)] transition-colors duration-150 inline-block ${
                  productsDropdownOpen || isProductRoot
                    ? 'bg-[var(--accent-purple)] text-white rounded-md'
                    : 'hover:text-[var(--accent)] py-2 px-1 rounded-t-md'
                } flex items-center gap-1`}
                onClick={() => {
                  setProductsDropdownOpen(v => !v);
                  setConceptsDropdownOpen(false);
                  setAdminDropdownOpen(false);
                }}
                aria-haspopup="true"
                aria-expanded={productsDropdownOpen}
              >
                {section.label}
                <svg
                  className={`ml-1 transition-transform duration-150 ${productsDropdownOpen ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {productsDropdownOpen && (
                <div
                  ref={productsDropdownRef}
                  className="absolute left-0 bg-white border border-[var(--gray-a3)] shadow-lg z-50 min-w-[220px] p-2 rounded-b-md rounded-t-none"
                  style={{top: '100%', marginTop: 0}}
                  onClick={e => e.stopPropagation()}
                >
                  {productSections.map(product => (
                    <Link
                      key={product.href}
                      href={product.href}
                      className="block px-4 py-2 text-[var(--gray-12)] hover:bg-[var(--gray-3)] rounded"
                    >
                      {product.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : section.label === 'SDKs' ? (
            <div style={{display: 'inline-block'}}>
              <button
                ref={platformBtnRef}
                className={`text-[var(--gray-12)] transition-colors duration-150 inline-block ${
                  platformDropdownOpen || isPlatformsRoute
                    ? 'bg-[var(--accent-purple)] text-white rounded-md'
                    : 'hover:text-[var(--accent)] py-2 px-1 rounded-t-md'
                } flex items-center gap-1`}
                onClick={() => {
                  clearTimeout(closeTimers.current.sdks);
                  setPlatformDropdownOpen(v => !v);
                  setPlatformDropdownByClick(true);
                }}
                aria-haspopup="true"
                aria-expanded={platformDropdownOpen}
              >
                {section.label}
                <svg
                  className={`ml-1 transition-transform duration-150 ${platformDropdownOpen ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {platformDropdownOpen && (
                <div
                  ref={platformDropdownRef}
                  className="absolute left-0 bg-white border border-[var(--gray-a3)] shadow-lg z-50 min-w-[300px] p-4 rounded-b-md rounded-t-none"
                  style={{top: '100%', marginTop: 0}}
                  onClick={e => e.stopPropagation()}
                >
                  <PlatformSelector platforms={platforms} currentPlatform={undefined} />
                </div>
              )}
            </div>
          ) : section.label === 'Concepts & Reference' ? (
            <div style={{display: 'inline-block'}}>
              <button
                ref={conceptsBtnRef}
                className={`text-[var(--gray-12)] transition-colors duration-150 inline-block ${
                  conceptsDropdownOpen
                    ? 'bg-[var(--accent-purple)] text-white rounded-md'
                    : 'hover:text-[var(--accent)] py-2 px-1 rounded-t-md'
                } flex items-center gap-1`}
                onClick={() => {
                  setConceptsDropdownOpen(v => !v);
                  setProductsDropdownOpen(false);
                  setAdminDropdownOpen(false);
                }}
                aria-haspopup="true"
                aria-expanded={conceptsDropdownOpen}
              >
                {section.label}
                <svg
                  className={`ml-1 transition-transform duration-150 ${conceptsDropdownOpen ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {conceptsDropdownOpen && (
                <div
                  ref={conceptsDropdownRef}
                  className="absolute left-0 bg-white border border-[var(--gray-a3)] shadow-lg z-50 min-w-[220px] p-2 rounded-b-md rounded-t-none"
                  style={{top: '100%', marginTop: 0}}
                  onClick={e => e.stopPropagation()}
                >
                  {section.dropdown?.map(dropdown => (
                    <Link
                      key={dropdown.href}
                      href={dropdown.href}
                      className="block px-4 py-2 text-[var(--gray-12)] hover:bg-[var(--gray-3)] rounded"
                    >
                      {dropdown.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : section.label === 'Admin' ? (
            <div style={{display: 'inline-block'}}>
              <button
                ref={adminBtnRef}
                className={`text-[var(--gray-12)] transition-colors duration-150 inline-block ${
                  adminDropdownOpen
                    ? 'bg-[var(--accent-purple)] text-white rounded-md'
                    : 'hover:text-[var(--accent)] py-2 px-1 rounded-t-md'
                } flex items-center gap-1`}
                onClick={() => {
                  setAdminDropdownOpen(v => !v);
                  setProductsDropdownOpen(false);
                  setConceptsDropdownOpen(false);
                }}
                aria-haspopup="true"
                aria-expanded={adminDropdownOpen}
              >
                {section.label}
                <svg
                  className={`ml-1 transition-transform duration-150 ${adminDropdownOpen ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {adminDropdownOpen && (
                <div
                  ref={adminDropdownRef}
                  className="absolute left-0 bg-white border border-[var(--gray-a3)] shadow-lg z-50 min-w-[220px] p-2 rounded-b-md rounded-t-none"
                  style={{top: '100%', marginTop: 0}}
                  onClick={e => e.stopPropagation()}
                >
                  {section.dropdown?.map(dropdown => (
                    <Link
                      key={dropdown.href}
                      href={dropdown.href}
                      className="block px-4 py-2 text-[var(--gray-12)] hover:bg-[var(--gray-3)] rounded"
                    >
                      {dropdown.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              href={section.href}
              className={`text-[var(--gray-12)] transition-colors duration-150 inline-block ${
                pathname?.startsWith(section.href)
                  ? 'bg-[var(--accent-purple)] text-white rounded-md'
                  : 'hover:text-[var(--accent)] py-2 px-1 rounded-t-md'
              }`}
            >
              {section.label}
            </Link>
          )}
        </li>
      ))}
      {/* More dropdown for last two items below xl */}
      <li className="list-none relative xl:hidden">
        <div style={{display: 'inline-block'}}>
          <button
            className={`text-[var(--gray-12)] transition-colors duration-150 inline-block ${
              moreDropdownOpen || moreSections.some(s => pathname?.startsWith(s.href))
                ? 'bg-[var(--accent-purple)] text-white rounded-md'
                : 'hover:text-[var(--accent)] py-2 px-1 rounded-t-md'
            } flex items-center gap-1`}
            onClick={() => setMoreDropdownOpen(v => !v)}
            aria-haspopup="true"
            aria-expanded={moreDropdownOpen}
          >
            More
            <svg
              className={`ml-1 transition-transform duration-150 ${moreDropdownOpen ? 'rotate-180' : ''}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {moreDropdownOpen && (
            <div
              className="absolute left-0 bg-white border border-[var(--gray-a3)] shadow-lg z-50 min-w-[220px] p-2 rounded-b-md rounded-t-none"
              style={{top: '100%', marginTop: 0}}
              onClick={e => e.stopPropagation()}
            >
              {moreSections.map(section => (
                <Link
                  key={section.href}
                  href={section.href}
                  className="block px-4 py-2 text-[var(--gray-12)] hover:bg-[var(--gray-3)] rounded"
                >
                  {section.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </li>
      {/* Show last two items as normal on xl+ screens */}
      {moreSections.map(section => (
        <li key={section.href} className="list-none relative hidden xl:inline-block">
          <Link
            href={section.href}
            className={`text-[var(--gray-12)] transition-colors duration-150 inline-block ${
              pathname?.startsWith(section.href)
                ? 'bg-[var(--accent-purple)] text-white rounded-md'
                : 'hover:text-[var(--accent)] py-2 px-1 rounded-t-md'
            }`}
          >
            {section.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
