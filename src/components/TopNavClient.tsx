'use client';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {usePlatforms} from 'sentry-docs/hooks/usePlatforms';
import {Platform} from 'sentry-docs/types';
import {isLocalStorageAvailable} from 'sentry-docs/utils';

import {mainSectionsWithDropdowns} from './navigationData';

const mainSections = mainSectionsWithDropdowns;

// Helper hook for dropdown positioning
function useDropdownPosition(triggerRef, open) {
  const [position, setPosition] = useState<{
    fixedLeft: number;
    fixedTop: number;
    width: number;
  } | null>(null);
  useEffect(() => {
    function updatePosition() {
      if (triggerRef.current && open) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          width: rect.width,
          fixedTop: rect.bottom,
          fixedLeft: rect.left,
        });
      }
    }
    updatePosition();
    if (open) {
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [triggerRef, open]);
  return position;
}

const NO_PLATFORMS: Platform[] = [];

export default function TopNavClient() {
  const platforms = usePlatforms().platforms ?? NO_PLATFORMS;
  const pathname = usePathname();
  const router = useRouter();

  // Compute the SDK link href - use stored platform URL if available
  const [sdkLinkHref, setSdkLinkHref] = useState('/platforms/');

  // Update href after hydration to check localStorage
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      return;
    }
    const storedPlatform = localStorage.getItem('active-platform');
    if (storedPlatform) {
      // Find the platform URL from our platforms list
      const platform = platforms.find(p => p.key === storedPlatform);
      if (platform) {
        setSdkLinkHref(platform.url);
        return;
      }
      // Also check guides
      for (const p of platforms) {
        const guide = p.guides.find(g => g.key === storedPlatform);
        if (guide) {
          setSdkLinkHref(guide.url);
          return;
        }
      }
    }
  }, [platforms]);

  // Click handler - use client-side navigation for stored platform redirect
  const handleSdkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isLocalStorageAvailable()) {
      return;
    }
    const storedPlatform = localStorage.getItem('active-platform');
    if (storedPlatform && platforms && platforms.length > 0) {
      // First check if it's a platform key
      const platform = platforms.find(p => p.key === storedPlatform);
      if (platform) {
        e.preventDefault();
        router.push(platform.url);
        return;
      }
      // Then check guides
      for (const p of platforms) {
        if (p.guides) {
          const guide = p.guides.find(g => g.key === storedPlatform);
          if (guide) {
            e.preventDefault();
            router.push(guide.url);
            return;
          }
        }
      }
    }
  };

  const closeTimers = useRef<{
    concepts?: NodeJS.Timeout;
    more?: NodeJS.Timeout;
  }>({});
  const [conceptsDropdownOpen, setConceptsDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const conceptsBtnRef = useRef<HTMLButtonElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const conceptsDropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Close dropdowns on outside click if opened by click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (conceptsDropdownOpen) {
        if (
          !conceptsBtnRef.current?.contains(e.target as Node) &&
          !conceptsDropdownRef.current?.contains(e.target as Node)
        ) {
          setConceptsDropdownOpen(false);
        }
      }
      if (moreDropdownOpen) {
        if (
          !moreBtnRef.current?.contains(e.target as Node) &&
          !moreDropdownRef.current?.contains(e.target as Node)
        ) {
          setMoreDropdownOpen(false);
        }
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (conceptsDropdownOpen) {
          setConceptsDropdownOpen(false);
          conceptsBtnRef.current?.focus();
        }
        if (moreDropdownOpen) {
          setMoreDropdownOpen(false);
          moreBtnRef.current?.focus();
        }
      }
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [conceptsDropdownOpen, moreDropdownOpen]);

  useEffect(() => {
    function updateScrollState() {
      const nav = navRef.current;
      if (!nav) return;
      setCanScrollLeft(nav.scrollLeft > 0);
      setCanScrollRight(nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 1);
    }
    updateScrollState();
    const nav = navRef.current;
    if (nav) {
      nav.addEventListener('scroll', updateScrollState);
    }
    window.addEventListener('resize', updateScrollState);
    return () => {
      if (nav) nav.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  function scrollNavBy(amount: number) {
    const nav = navRef.current;
    if (nav) {
      nav.scrollBy({left: amount, behavior: 'smooth'});
    }
  }

  // Position the dropdowns below their buttons
  const conceptsPosition = useDropdownPosition(conceptsBtnRef, conceptsDropdownOpen);
  const morePosition = useDropdownPosition(moreBtnRef, moreDropdownOpen);

  return (
    <div>
      <div className="w-full relative">
        {canScrollLeft && (
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-50 pointer-events-auto bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black rounded-full p-1 shadow"
            style={{boxShadow: '0 1px 4px rgba(0,0,0,0.08)'}}
            aria-label="Scroll left"
            onClick={() => {
              scrollNavBy(-120);
            }}
          >
            <svg
              className="transition-transform duration-150 rotate-90 text-black dark:text-white"
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
        )}
        {canScrollRight && (
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-50 pointer-events-auto bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black rounded-full p-1 shadow"
            style={{boxShadow: '0 1px 4px rgba(0,0,0,0.08)'}}
            aria-label="Scroll right"
            onClick={() => {
              scrollNavBy(120);
            }}
          >
            <svg
              className="transition-transform duration-150 -rotate-90 text-black dark:text-white"
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
        )}
        <div
          ref={navRef}
          className="overflow-x-auto whitespace-nowrap max-w-full scrollbar-hide pl-4 pr-6"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
        >
          <ul
            className="flex gap-4 w-max min-w-0 items-center overflow-x-visible"
            style={{scrollbarWidth: 'none'}}
          >
            {mainSections.map(section => (
              <li key={section.href} className="list-none relative">
                {section.label === 'Concepts' ? (
                  <div
                    style={{display: 'inline-block'}}
                    onMouseEnter={() => {
                      clearTimeout(closeTimers.current.concepts);
                      setConceptsDropdownOpen(true);
                      setMoreDropdownOpen(false);
                    }}
                    onMouseLeave={() => {
                      closeTimers.current.concepts = setTimeout(() => {
                        setConceptsDropdownOpen(false);
                      }, 150);
                    }}
                  >
                    <button
                      ref={conceptsBtnRef}
                      className={`text-[var(--gray-12)] transition-all duration-150 inline-block py-2 px-1 rounded-t-md flex items-center gap-1 text-[0.875rem] font-normal border-b-2 ${
                        mainSections
                          .find(s => s.label === 'Concepts')
                          ?.dropdown?.some(d => pathname?.startsWith(d.href))
                          ? 'border-[var(--accent-purple)]'
                          : conceptsDropdownOpen
                            ? 'border-[#a78bfa]'
                            : 'border-transparent hover:border-[#a78bfa]'
                      }`}
                      onClick={() => {
                        setConceptsDropdownOpen(v => !v);
                        setMoreDropdownOpen(false);
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
                    {conceptsDropdownOpen && conceptsPosition && (
                      <div
                        ref={conceptsDropdownRef}
                        className="bg-white dark:bg-black border border-[var(--gray-a3)] dark:border-[var(--gray-7)] shadow-lg z-50 min-w-[220px] p-2 rounded-b-md rounded-t-none"
                        style={{
                          position: 'fixed',
                          top: conceptsPosition.fixedTop,
                          left: conceptsPosition.fixedLeft,
                          minWidth: conceptsPosition.width,
                          overflowY: 'auto',
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        <style>{`
                          .dark .concepts-dropdown-link {
                            color: #fff !important;
                          }
                        `}</style>
                        {mainSections
                          .find(s => s.label === 'Concepts')
                          ?.dropdown?.map(dropdown => (
                            <Link
                              key={dropdown.href}
                              href={dropdown.href}
                              className="concepts-dropdown-link block px-4 py-2 text-[var(--gray-12)] dark:text-white hover:bg-[var(--gray-3)] dark:hover:bg-[var(--gray-8)] rounded text-[0.875rem] font-normal font-sans no-underline"
                            >
                              {dropdown.label}
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>
                ) : section.label === 'Manage' ? (
                  <div
                    style={{display: 'inline-block'}}
                    onMouseEnter={() => {
                      clearTimeout(closeTimers.current.more);
                      setMoreDropdownOpen(true);
                      setConceptsDropdownOpen(false);
                    }}
                    onMouseLeave={() => {
                      closeTimers.current.more = setTimeout(() => {
                        setMoreDropdownOpen(false);
                      }, 150);
                    }}
                  >
                    <button
                      ref={moreBtnRef}
                      className={`text-[var(--gray-12)] transition-all duration-150 inline-block py-2 px-1 rounded-t-md flex items-center gap-1 text-[0.875rem] font-normal border-b-2 ${
                        mainSections
                          .find(s => s.label === 'Manage')
                          ?.dropdown?.some(d => pathname?.startsWith(d.href))
                          ? 'border-[var(--accent-purple)]'
                          : moreDropdownOpen
                            ? 'border-[#a78bfa]'
                            : 'border-transparent hover:border-[#a78bfa]'
                      }`}
                      onClick={() => {
                        setMoreDropdownOpen(v => !v);
                        setConceptsDropdownOpen(false);
                      }}
                      aria-haspopup="true"
                      aria-expanded={moreDropdownOpen}
                    >
                      {section.label}
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
                    {moreDropdownOpen && morePosition && (
                      <div
                        ref={moreDropdownRef}
                        className="bg-white dark:bg-black border border-[var(--gray-a3)] dark:border-[var(--gray-7)] shadow-lg z-50 min-w-[220px] p-2 rounded-b-md rounded-t-none"
                        style={{
                          position: 'fixed',
                          top: morePosition.fixedTop,
                          left: morePosition.fixedLeft,
                          minWidth: morePosition.width,
                          overflowY: 'auto',
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        <style>{`
                          .dark .more-dropdown-link {
                            color: #fff !important;
                          }
                        `}</style>
                        {mainSections
                          .find(s => s.label === 'Manage')
                          ?.dropdown?.map(dropdown => (
                            <Link
                              key={dropdown.href}
                              href={dropdown.href}
                              className="more-dropdown-link block px-4 py-2 text-[var(--gray-12)] dark:text-white hover:bg-[var(--gray-3)] dark:hover:bg-[var(--gray-8)] rounded text-[0.875rem] font-normal font-sans no-underline"
                            >
                              {dropdown.label}
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>
                ) : section.label === 'SDKs' ? (
                  <a
                    href={sdkLinkHref}
                    onClick={handleSdkClick}
                    className={`text-[var(--gray-12)] transition-all duration-150 inline-block py-2 px-1 rounded-t-md text-[0.875rem] font-normal border-b-2 ${
                      pathname?.startsWith('/platforms/')
                        ? 'border-[var(--accent-purple)]'
                        : 'border-transparent hover:border-[#a78bfa]'
                    }`}
                  >
                    {section.label}
                  </a>
                ) : (
                  <Link
                    href={section.href}
                    className={`text-[var(--gray-12)] transition-all duration-150 inline-block py-2 px-1 rounded-t-md text-[0.875rem] font-normal border-b-2 ${
                      pathname?.startsWith(section.href)
                        ? 'border-[var(--accent-purple)]'
                        : 'border-transparent hover:border-[#a78bfa]'
                    }`}
                  >
                    {section.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
