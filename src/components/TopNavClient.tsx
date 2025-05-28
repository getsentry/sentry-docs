"use client";
import {Fragment, useEffect,useRef, useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

import {Platform} from 'sentry-docs/types';

import {PlatformSelector} from './platformSelector';

const productSections = [
  {label: 'Sentry', href: '/product/sentry/'},
  {label: 'Sentry Prevent', href: '/product/sentry-prevent/'},
  {label: 'Seer', href: '/product/seer/'},
];

const sections = [
  {label: 'Products', href: '/product/'},
  {label: 'SDKs', href: '/platforms/'},
  {label: 'Concepts & Reference', href: '/concepts/'},
  {label: 'Admin Settings', href: '/organization/'},
  {label: 'Pricing & Billing', href: '/pricing/'},
  {label: 'Sentry CLI', href: '/cli/'},
  {label: 'Sentry API', href: '/api/'},
  {label: 'Security, Legal, & PII', href: '/security-legal-pii/'},
];

export default function TopNavClient({platforms}: { platforms: Platform[] }) {
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [platformDropdownByClick, setPlatformDropdownByClick] = useState(false);
  const [productDropdownByClick, setProductDropdownByClick] = useState(false);
  const platformBtnRef = useRef<HTMLButtonElement>(null);
  const productBtnRef = useRef<HTMLButtonElement>(null);
  const platformDropdownRef = useRef<HTMLDivElement>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isPlatformsRoute = pathname?.startsWith('/platforms/');
  const isProductRoute = pathname?.startsWith('/product/');
  const closeTimers = useRef<{products?: NodeJS.Timeout; sdks?: NodeJS.Timeout}>({});

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
      if (productDropdownOpen && productDropdownByClick) {
        if (
          !productBtnRef.current?.contains(e.target as Node) &&
          !productDropdownRef.current?.contains(e.target as Node)
        ) {
          setProductDropdownOpen(false);
          setProductDropdownByClick(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [platformDropdownOpen, platformDropdownByClick, productDropdownOpen, productDropdownByClick]);

  return (
    <Fragment>
      <style>{':root { --topnav-height: 48px; }'}</style>
      <nav
        className="bg-[var(--gray-1)] border-b border-[var(--gray-a3)] px-8 flex items-center z-40 fixed top-[var(--header-height)] w-full"
        style={{height: 'var(--topnav-height)'}}
      >
        <ul className="flex gap-6 w-full">
          {sections.map(section => (
            <li key={section.href} className="list-none relative">
              {section.label === 'Products' ? (
                <div
                  style={{display: 'inline-block'}}
                >
                  <button
                    ref={productBtnRef}
                    className={`text-[var(--gray-12)] transition-colors duration-150 inline-block ${
                      (productDropdownOpen || isProductRoute)
                        ? 'bg-[var(--accent-purple-light)] text-[var(--accent)] shadow-sm py-[6px] pl-[18px] pr-[18px] rounded-md'
                        : 'hover:text-[var(--accent)] py-2 px-1 rounded-t-md'
                    } flex items-center gap-1`}
                    onClick={() => {
                      clearTimeout(closeTimers.current.products);
                      setProductDropdownOpen(v => !v);
                      setProductDropdownByClick(true);
                    }}
                    aria-haspopup="true"
                    aria-expanded={productDropdownOpen}
                  >
                    {section.label}
                    <svg
                      className={`ml-1 transition-transform duration-150 ${productDropdownOpen ? 'rotate-180' : ''}`}
                      width="16" height="16" viewBox="0 0 16 16" fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {productDropdownOpen && (
                    <div
                      ref={productDropdownRef}
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
                <div
                  style={{display: 'inline-block'}}
                >
                  <button
                    ref={platformBtnRef}
                    className={`text-[var(--gray-12)] transition-colors duration-150 inline-block ${
                      (platformDropdownOpen || isPlatformsRoute)
                        ? 'bg-[var(--accent-purple-light)] text-[var(--accent)] shadow-sm py-[6px] pl-[18px] pr-[18px] rounded-md'
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
                      width="16" height="16" viewBox="0 0 16 16" fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {platformDropdownOpen && (
                    <div
                      ref={platformDropdownRef}
                      className="absolute left-0 bg-white border border-[var(--gray-a3)] shadow-lg z-50 min-w-[300px] p-4 rounded-b-md rounded-t-none"
                      style={{top: '100%', marginTop: 0}}
                      onClick={e => e.stopPropagation()}
                    >
                      <PlatformSelector
                        platforms={platforms}
                        currentPlatform={undefined}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={section.href}
                  className={`text-[var(--gray-12)] transition-colors duration-150 inline-block ${
                    (section.label === 'Admin Settings'
                      ? (pathname?.startsWith('/organization/') || pathname?.startsWith('/account/'))
                      : pathname?.startsWith(section.href)
                    )
                      ? 'bg-[var(--accent-purple-light)] text-[var(--accent)] shadow-sm py-[6px] pl-[18px] pr-[18px] rounded-md'
                      : 'hover:text-[var(--accent)] py-2 px-1 rounded-t-md'
                  }`}
                >
                  {section.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </Fragment>
  );
} 