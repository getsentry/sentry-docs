'use client';
import {useEffect, useRef, useState} from 'react';

import {NAV_ITEMS} from 'sentry-docs/constants';
import Chevron from 'sentry-docs/icons/Chevron';

import {SentryWordmarkLogo} from '../wordmarkLogo';

import {Button} from './ui/Button';

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
    if (dropdownRef.current && !dropdownRef.current?.contains(e.target as Node)) {
      setActiveNavItem(null);
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleShowActiveNavItem);

    return () => {
      document.removeEventListener('mousedown', handleShowActiveNavItem);
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
                    href={to || ''}
                    className="w-full !justify-start"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.stopPropagation();
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
