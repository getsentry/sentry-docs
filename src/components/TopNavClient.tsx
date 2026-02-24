'use client';
import {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';

import {Platform} from 'sentry-docs/types';

import platformSelectorStyles from './platformSelector/style.module.scss';

import {mainSectionsWithDropdowns, productSections} from './navigationData';
import {PlatformSelector} from './platformSelector';

const mainSections = mainSectionsWithDropdowns;

// Add a helper hook for portal dropdown positioning
function useDropdownPosition(triggerRef, open) {
  const [position, setPosition] = useState({top: 0, left: 0, width: 0});
  useEffect(() => {
    function updatePosition() {
      if (triggerRef.current && open) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
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

export default function TopNavClient({platforms}: {platforms: Platform[]}) {
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [platformDropdownByClick, setPlatformDropdownByClick] = useState(false);
  const platformBtnRef = useRef<HTMLButtonElement>(null);
  const platformDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Compute the SDK link href - use stored platform URL if available
  const [sdkLinkHref, setSdkLinkHref] = useState('/platforms/');

  // Update href after hydration to check localStorage
  useEffect(() => {
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
    products?: NodeJS.Timeout;
    sdks?: NodeJS.Timeout;
  }>({});
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [conceptsDropdownOpen, setConceptsDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const productsBtnRef = useRef<HTMLButtonElement>(null);
  const conceptsBtnRef = useRef<HTMLButtonElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const conceptsDropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
      if (moreDropdownOpen) {
        if (
          !moreBtnRef.current?.contains(e.target as Node) &&
          !moreDropdownRef.current?.contains(e.target as Node)
        ) {
          setMoreDropdownOpen(false);
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
    moreDropdownOpen,
  ]);

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

  // For each dropdown, use the hook and portal rendering
  // Example for Products:
  const productsPosition = useDropdownPosition(productsBtnRef, productsDropdownOpen);
  const sdksPosition = useDropdownPosition(platformBtnRef, platformDropdownOpen);
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
          className="overflow-x-auto whitespace-nowrap max-w-full scrollbar-hide pr-8 pl-8"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
        >
          <ul
            className="flex gap-4 w-full items-center overflow-x-visible"
            style={{scrollbarWidth: 'none'}}
          >
            {mainSections.map(section => (
              <li key={section.href} className="list-none relative">
                {section.label === 'Product' ? (
                  <div
                    style={{display: 'inline-block'}}
                    onMouseEnter={() => {
                      clearTimeout(closeTimers.current.products);
                      setProductsDropdownOpen(true);
                      setConceptsDropdownOpen(false);
                      setMoreDropdownOpen(false);
                      setPlatformDropdownOpen(false);
                    }}
                    onMouseLeave={() => {
                      closeTimers.current.products = setTimeout(() => {
                        setProductsDropdownOpen(false);
                      }, 150);
                    }}
                  >
                    <button
                      ref={productsBtnRef}
                      className={`text-[var(--gray-12)] transition-all duration-150 inline-block py-2 px-1 rounded-t-md flex items-center gap-1 text-[0.875rem] font-normal border-b-2 ${
                        pathname?.startsWith(section.href)
                          ? 'border-[var(--accent-purple)]'
                          : productsDropdownOpen
                            ? 'border-[#a78bfa]'
                            : 'border-transparent hover:border-[#a78bfa]'
                      }`}
                      onClick={() => {
                        setProductsDropdownOpen(v => !v);
                        setConceptsDropdownOpen(false);
                        setMoreDropdownOpen(false);
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
                  </div>
                ) : section.label === 'Concepts' ? (
                  <div
                    style={{display: 'inline-block'}}
                    onMouseEnter={() => {
                      clearTimeout(closeTimers.current.concepts);
                      setConceptsDropdownOpen(true);
                      setProductsDropdownOpen(false);
                      setMoreDropdownOpen(false);
                      setPlatformDropdownOpen(false);
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
                        setProductsDropdownOpen(false);
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
                  </div>
                ) : section.label === 'More' ? (
                  <div
                    style={{display: 'inline-block'}}
                    onMouseEnter={() => {
                      clearTimeout(closeTimers.current.more);
                      setMoreDropdownOpen(true);
                      setProductsDropdownOpen(false);
                      setConceptsDropdownOpen(false);
                      setPlatformDropdownOpen(false);
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
                          .find(s => s.label === 'More')
                          ?.dropdown?.some(d => pathname?.startsWith(d.href))
                          ? 'border-[var(--accent-purple)]'
                          : moreDropdownOpen
                            ? 'border-[#a78bfa]'
                            : 'border-transparent hover:border-[#a78bfa]'
                      }`}
                      onClick={() => {
                        setMoreDropdownOpen(v => !v);
                        setProductsDropdownOpen(false);
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
      {/* Portal-based dropdowns */}
      {productsDropdownOpen &&
        ReactDOM.createPortal(
          <div
            ref={productsDropdownRef}
            className="absolute left-0 bg-white dark:bg-black border border-[var(--gray-a3)] dark:border-[var(--gray-7)] shadow-lg z-50 min-w-[220px] p-2 rounded-b-md rounded-t-none"
            style={{
              position: 'absolute',
              top: productsPosition.top,
              left: productsPosition.left,
              minWidth: productsPosition.width,
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onClick={e => e.stopPropagation()}
            onMouseEnter={() => {
              clearTimeout(closeTimers.current.products);
            }}
            onMouseLeave={() => {
              closeTimers.current.products = setTimeout(() => {
                setProductsDropdownOpen(false);
              }, 150);
            }}
          >
            <style>{`
            .dark .product-dropdown-link {
              color: #fff !important;
            }
          `}</style>
            {productSections.map(product => (
              <Link
                key={product.href}
                href={product.href}
                className="product-dropdown-link block px-4 py-2 text-[var(--gray-12)] dark:text-white hover:bg-[var(--gray-3)] dark:hover:bg-[var(--gray-8)] rounded text-[0.875rem] font-normal font-sans no-underline"
              >
                {product.label}
              </Link>
            ))}
          </div>,
          document.body
        )}
      {platformDropdownOpen &&
        ReactDOM.createPortal(
          <div
            ref={platformDropdownRef}
            className="absolute left-0 bg-white dark:bg-black shadow-lg z-50 min-w-[300px] p-4 rounded-b-md rounded-t-none border border-[var(--gray-a3)] dark:border-[var(--gray-7)]"
            tabIndex={0}
            style={{
              position: 'absolute',
              top: sdksPosition.top,
              left: sdksPosition.left,
              minWidth: 340,
              width: 340,
              maxHeight: 'calc(100vh - 32px)',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              fontFamily: 'var(--font-sans, sans-serif)',
            }}
            onClick={e => e.stopPropagation()}
            onMouseEnter={() => {
              clearTimeout(closeTimers.current.sdks);
            }}
            onMouseLeave={() => {
              closeTimers.current.sdks = setTimeout(() => {
                setPlatformDropdownOpen(false);
                setPlatformDropdownByClick(false);
              }, 150);
            }}
          >
            <style>{`
            .${platformSelectorStyles.popover} {
              background: var(--gray-2) !important;
              border: 1px solid var(--gray-4) !important;
              box-shadow: var(--shadow-6);
            }
            .dark .${platformSelectorStyles.popover} {
              background: #18181b !important;
              border: 1px solid #23232b !important;
              box-shadow: var(--shadow-6);
            }
            .dark .${platformSelectorStyles.popover} .${platformSelectorStyles['combobox-wrapper']} {
              background: #18181b !important;
              box-shadow: 0 2px 6px 0 rgba(0,0,0,0.24);
            }
            .dark .${platformSelectorStyles.popover} .${platformSelectorStyles.combobox} {
              background: #18181b !important;
              color: #fff !important;
            }
            .dark .${platformSelectorStyles.popover} .${platformSelectorStyles.combobox}::placeholder {
              color: #a1a1aa !important;
              opacity: 1;
            }
            .dark .${platformSelectorStyles.popover} .${platformSelectorStyles['combobox-icon']} {
              color: #fff !important;
            }
            .dark .${platformSelectorStyles.item} {
              color: #fff !important;
            }
            .dark .${platformSelectorStyles.item}:hover {
              background: #18181b !important;
            }
            button[class*="expand-button"] {
              background: none !important;
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
            }
            .${platformSelectorStyles.item} {
              padding-top: 0.315rem !important;
              padding-bottom: 0.315rem !important;
            }
            .${platformSelectorStyles.popover} {
              padding-top: 0 !important;
              border-radius: 0.5rem !important;
              margin-top: 0 !important;
              border-top: 0 !important;
            }
            .${platformSelectorStyles.popover} .${platformSelectorStyles['combobox-wrapper']} {
              border-radius: 0 !important;
              padding: 0 !important;
              margin-top: 0 !important;
              border-top: 0 !important;
              margin-bottom: 0.25rem;
              position: sticky;
              top: 0;
              z-index: 2;
              transform: translateY(-16px);
            }
            .${platformSelectorStyles.popover} > :first-child {
              margin-top: 0 !important;
              padding-top: 0 !important;
              border-top: 0 !important;
            }
            .${platformSelectorStyles.popover} .${platformSelectorStyles.combobox} {
              border-radius: 0.5rem 0.5rem 0 0 !important;
              width: 100% !important;
              margin: 0 !important;
              padding-left: 2.5rem !important;
              padding-right: 0.75rem !important;
            }
            .${platformSelectorStyles.popover} .${platformSelectorStyles.combobox}::placeholder {
              color: #A1A1AA !important;
              opacity: 1;
            }
            .${platformSelectorStyles.popover} .${platformSelectorStyles['combobox-icon']} {
              pointer-events: none;
              position: absolute;
              left: 0.75rem;
              top: 50%;
              transform: translateY(-50%);
              font-size: 1.1rem;
              line-height: 1;
              display: flex;
              align-items: center;
            }
          `}</style>
            <PlatformSelector platforms={platforms} listOnly />
          </div>,
          document.body
        )}
      {conceptsDropdownOpen &&
        ReactDOM.createPortal(
          <div
            ref={conceptsDropdownRef}
            className="absolute left-0 bg-white dark:bg-black border border-[var(--gray-a3)] dark:border-[var(--gray-7)] shadow-lg z-50 min-w-[220px] p-2 rounded-b-md rounded-t-none"
            style={{
              position: 'absolute',
              top: conceptsPosition.top,
              left: conceptsPosition.left,
              minWidth: conceptsPosition.width,
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onClick={e => e.stopPropagation()}
            onMouseEnter={() => {
              clearTimeout(closeTimers.current.concepts);
            }}
            onMouseLeave={() => {
              closeTimers.current.concepts = setTimeout(() => {
                setConceptsDropdownOpen(false);
              }, 150);
            }}
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
          </div>,
          document.body
        )}
      {moreDropdownOpen &&
        ReactDOM.createPortal(
          <div
            ref={moreDropdownRef}
            className="absolute left-0 bg-white dark:bg-black border border-[var(--gray-a3)] dark:border-[var(--gray-7)] shadow-lg z-50 min-w-[220px] p-2 rounded-b-md rounded-t-none"
            style={{
              position: 'absolute',
              top: morePosition.top,
              left: morePosition.left,
              minWidth: morePosition.width,
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onClick={e => e.stopPropagation()}
            onMouseEnter={() => {
              clearTimeout(closeTimers.current.more);
            }}
            onMouseLeave={() => {
              closeTimers.current.more = setTimeout(() => {
                setMoreDropdownOpen(false);
              }, 150);
            }}
          >
            <style>{`
            .dark .more-dropdown-link {
              color: #fff !important;
            }
          `}</style>
            {mainSections
              .find(s => s.label === 'More')
              ?.dropdown?.map(dropdown => (
                <Link
                  key={dropdown.href}
                  href={dropdown.href}
                  className="more-dropdown-link block px-4 py-2 text-[var(--gray-12)] dark:text-white hover:bg-[var(--gray-3)] dark:hover:bg-[var(--gray-8)] rounded text-[0.875rem] font-normal font-sans no-underline"
                >
                  {dropdown.label}
                </Link>
              ))}
          </div>,
          document.body
        )}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
