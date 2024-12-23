'use client';
import {useEffect, useRef, useState} from 'react';

import {Button} from './ui/Button';
import {SentryWordmarkLogo} from './wordmarkLogo';
import {Chevron} from './icons/chevron';

export function Navbar() {
  const [activeNavItem, setActiveNavItem] = useState<string | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function handleLogoClick(e: React.MouseEvent<SVGElement>) {
    e.preventDefault();
    if (e.type === 'click') {
      window.location.href = 'https://sentry.io/welcome';
    } else if (e?.type === 'contextmenu') {
      window.location.href = 'https://sentry.io/branding';
    }
  }

  function handleShowMenu() {
    setActiveNavItem(null);
    setIsMenuVisible(prev => !prev);
  }

  function handleShowActiveNavItem(e: MouseEvent) {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setActiveNavItem(null);
    }
  }
  // handle click outside of nav items
  useEffect(() => {
    document.addEventListener('click', handleShowActiveNavItem);

    return () => {
      document.removeEventListener('click', handleShowActiveNavItem);
    };
  }, []);

  return (
    <header className="bg-white sticky top-0 w-full z-50 py-4">
      <div className="lg:max-w-6xl md:max-w-3xl max-w-xl mx-auto px-8 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center text-primary flex-wrap">
          <div
            title="Sentry error monitoring"
            className="flex flex-shrink-0 flex-1 items-center mr-auto"
          >
            <a href="#">
              <SentryWordmarkLogo
                width={150}
                height={45}
                onClick={handleLogoClick}
                onContextMenu={handleLogoClick}
              />
            </a>
          </div>
          <Button
            onClick={handleShowMenu}
            className="!bg-gray-200 !hover:bg-gray-200 lg:hidden flex"
          >
            <span>Menu</span>
            <Chevron
              width={14}
              height={14}
              direction={isMenuVisible ? 'down' : 'right'}
            />
          </Button>
          <ul
            className={`${isMenuVisible ? 'flex' : 'lg:flex hidden'} lg:items-center lg:flex-row flex-col basis-full lg:basis-0`}
          >
            {NAV_ITEMS.map(
              ({
                id,
                type = 'button',
                to,
                target,
                variant = 'ghost',
                title,
                className,
                children = [],
                withArrowBtn = false,
              }) => (
                <li key={id} className="lg:ml-2 relative pt-4 lg:pt-0">
                  <Button
                    as={type}
                    variant={variant}
                    target={target}
                    // @ts-ignore
                    href={to || null}
                    className="w-full !justify-start"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      if (children && children.length) {
                        setActiveNavItem(prev => {
                          if (prev === id) {
                            return null;
                          }
                          return id;
                        });
                      }
                    }}
                  >
                    <span className={className}>{title}</span>
                    {((children && children.length) || withArrowBtn) && (
                      <Chevron direction={activeNavItem === id ? 'down' : 'right'} />
                    )}
                  </Button>
                  {activeNavItem && activeNavItem === id && (
                    <div
                      id={id}
                      ref={dropdownRef}
                      className="bg-white z-20 w-auto py-4 lg:px-5 lg:-mx-4 lg:absolute realtive lg:-left-2/4 lg:top-12 lg:rounded-2xl lg:shadow-sm "
                    >
                      <div className="max-w-6xl w-full">
                        <div className="flex gap-6 lg:gap-0 lg:flex-row flex-col ">
                          {children.map(navSubItem => (
                            <div
                              key={navSubItem.id}
                              className={`${navSubItem.title ? 'p-4' : 'lg:px-4'} lg:w-[${(1 / children.length) * 100}%]`}
                            >
                              {navSubItem.title && (
                                <h3 className="mb-2 pl-4 text-base font-medium">
                                  {navSubItem.title}
                                </h3>
                              )}
                              <ul
                                className={`${navSubItem.title ? 'lg:gap-0 grid sm:grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col' : 'gap-2 flex flex-col'}`}
                              >
                                {navSubItem.children?.map(navSubSubItem => (
                                  <li key={navSubSubItem.id}>
                                    <Button
                                      as="a"
                                      href={navSubSubItem.to}
                                      variant={navSubSubItem.variant}
                                    >
                                      <span
                                        className={`h-4 leading-4 ${navSubSubItem.withArrowBtn ? 'text-black' : 'text-accent-purple'}`}
                                      >
                                        {navSubSubItem.title}
                                      </span>
                                      {navSubSubItem.withArrowBtn && (
                                        <Chevron direction="right" />
                                      )}
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              )
            )}

            <li className="lg:pl-2 lg:ml-2 pt-4 lg:pt-0">
              <Button
                as="a"
                href="https://sentry.io/signup/"
                variant="solid"
                className="w-full"
              >
                <span className="text-white h-4 leading-4">Get Started</span>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="hero-top-left-down-slope absolute -bottom-[39px] w-full h-10 bg-white" />
    </header>
  );
}

type NavItemsProps = {
  id: string;
  type: 'button' | 'a';
  variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'solid';
  children?: NavItemChildrenProps[];
  className?: string;
  target?: string;
  title?: string;
  to?: string;
  withArrowBtn?: boolean;
};

type NavItemChildrenProps = {
  id: string;
  children?: NavItemsProps[];
  title?: string;
};

const NAV_ITEMS: NavItemsProps[] = [
  {
    id: 'product',
    title: 'Product',
    type: 'button',
    variant: 'ghost',
    className: '',
    children: [
      {
        id: 'platform',
        title: 'Platform',
        children: [
          {
            id: 'errorMonitoring',
            title: 'Error Monitoring',
            to: 'https://sentry.io/for/error-monitoring/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'sessionReplay',
            title: 'Session Replay',
            to: 'https://sentry.io/for/session-replay/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'performance',
            title: 'Performance',
            to: 'https://sentry.io/for/performance/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'profiling',
            title: 'Profiling',
            to: 'https://sentry.io/for/profiling/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'cronMonitoring',
            title: 'Cron Monitoring',
            to: 'https://sentry.io/for/cron-monitoring/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'codeCoverage',
            title: 'Code Coverage',
            to: 'https://sentry.io/for/code-coverage/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'integrations',
            title: 'Integrations',
            to: 'https://sentry.io/integrations/',
            variant: 'ghost',
            type: 'a',
          },
        ],
      },
      {
        id: 'languages&Frameworks',
        title: 'Languages & Frameworks',
        children: [
          {
            id: 'javascript',
            title: 'Javascript',
            to: 'https://sentry.io/for/javascript/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'python',
            title: 'Python',
            to: 'https://sentry.io/for/python/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'ruby',
            title: 'Ruby',
            to: 'https://sentry.io/for/ruby/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'node',
            title: 'Node',
            to: 'https://sentry.io/for/node/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'go',
            title: 'Go',
            to: 'https://sentry.io/for/go/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'dotnet',
            title: '.Net',
            to: 'https://sentry.io/for/dot-net/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'ios',
            title: 'ios',
            to: 'https://sentry.io/for/cocoa/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'android',
            title: 'android',
            to: 'https://sentry.io/for/android/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'seeall',
            title: 'See All',
            to: 'https://sentry.io/platforms/',
            variant: 'outline',
            withArrowBtn: true,
            type: 'a',
          },
        ],
      },
      {
        id: 'whySentry',
        title: 'Why Sentry?',
        children: [
          {
            id: 'web',
            title: 'Web',
            to: 'https://sentry.io/for/full-stack/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'mobile',
            title: 'Mobile',
            to: 'https://sentry.io/for/mobile/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'native',
            title: 'Native',
            to: 'https://sentry.io/for/native/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'gaming',
            title: 'Gaming',
            to: 'https://sentry.io/for/gaming/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'internetOfThings',
            title: 'Internet Of Things',
            to: 'https://sentry.io/for/iot/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'data',
            title: 'Data',
            to: 'https://sentry.io/for/data/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'enterprise',
            title: 'Enterprise',
            to: 'https://sentry.io/for/enterprise/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'openSource',
            title: 'Open Source',
            to: 'https://sentry.io/for/open-source/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'security',
            title: 'Security & Compliance',
            to: 'https://sentry.io/security/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'customers',
            title: 'Customers',
            to: 'https://sentry.io/customers/',
            variant: 'ghost',
            type: 'a',
          },
        ],
      },
      {
        id: 'features',
        title: 'Features',
        children: [
          {
            id: 'customQueries',
            title: 'Custom Queries',
            to: 'https://sentry.io/features/custom-queries/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'dashboards',
            title: 'Dashboards',
            to: 'https://sentry.io/features/dashboards/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'crossProjectIssues',
            title: 'Cross-Project Issues',
            to: 'https://sentry.io/features/cross-project-issues/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'distributedTracing',
            title: 'Distributed Tracing',
            to: 'https://sentry.io/features/distributed-tracing/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'stackTraces',
            title: 'Stack Traces',
            to: 'https://sentry.io/features/stacktrace/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'context',
            title: 'Context',
            to: 'https://sentry.io/features/context/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'breadcrumbs',
            title: 'Breadcrumbs',
            to: 'https://sentry.io/features/breadcrumbs/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'releases',
            title: 'Releases',
            to: 'https://sentry.io/features/releases/',
            variant: 'ghost',
            type: 'a',
          },
          {
            id: 'issueOwners',
            title: 'Issue Owners',
            to: 'https://sentry.io/features/owners/',
            variant: 'ghost',
            type: 'a',
          },
        ],
      },
    ],
  },
  {
    id: 'pricing',
    title: 'Pricing',
    type: 'a',
    to: 'https://sentry.io/pricing',
    variant: 'ghost',
    className: '',
  },
  {
    id: 'docs',
    title: 'Docs',
    type: 'a',
    to: 'https://docs.sentry.io',
    variant: 'ghost',
    className: '',
  },
  {
    id: 'blog',
    title: 'Blog',
    type: 'a',
    to: 'https://blog.sentry.io',
    variant: 'ghost',
    className: '',
  },
  {
    id: 'sandbox',
    title: 'Sandbox',
    type: 'a',
    to: 'https://try.sentry-demo.com/demo/start/',
    target: '_blank',
    variant: 'ghost',
    className: '',
  },
  {
    id: 'siginIn',
    title: 'Go to Sentry',
    type: 'a',
    to: 'https://sentry.io/auth/login',
    variant: 'ghost',
    className: '',
  },
];
