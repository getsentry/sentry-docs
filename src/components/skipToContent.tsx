'use client';

import {usePathname} from 'next/navigation';
import {useEffect, useRef} from 'react';

export function SkipToContent() {
  // Watches the current URL. Every time you navigate to a new page, this value
  // changes and triggers the useEffect below. This is used to reset the focus
  // navigation to the top of the page.
  const pathname = usePathname();
  // a flag so we skip the very first page load
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.body.setAttribute('tabindex', '-1');
    // focus the body element so the user can start tabbing from the top of the page
    document.body.focus({preventScroll: true});
    document.body.removeAttribute('tabindex');
  }, [pathname]);

  return (
    <a href="#main" className="skip-to-content">
      Skip to content
    </a>
  );
}
