'use client';

import {useEffect} from 'react';

/**
 * ParamFerry component that automatically adds tracked URL parameters to all links on the page
 * Focuses on utm_, promo_, code, and ref parameters
 */
export default function ParamFerry(): null {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Define parameter patterns to ferry
    const paramsToSync = [/^utm_/i, /^promo_/i, /code/, /ref/];

    // Get current URL parameters
    const getCurrentParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const params: Record<string, string> = {};
      
      urlParams.forEach((value, key) => {
        const shouldSync = paramsToSync.some(pattern => {
          if (pattern instanceof RegExp) {
            return pattern.test(key);
          }
          return key === pattern;
        });
        
        if (shouldSync) {
          params[key] = value;
        }
      });
      
      return params;
    };

    // Ferry parameters to a URL
    const ferryParams = (targetUrl: string) => {
      const params = getCurrentParams();
      
      if (Object.keys(params).length === 0) {
        return targetUrl;
      }

      try {
        const url = new URL(targetUrl, window.location.origin);
        
        // Add parameters to the URL
        Object.entries(params).forEach(([key, value]) => {
          if (value) {
            url.searchParams.set(key, value);
          }
        });

        return url.toString();
      } catch (error) {
        console.warn('Error ferrying parameters:', error);
        return targetUrl;
      }
    };

    const processLinks = () => {
      // Get all anchor tags on the page
      const links = document.querySelectorAll('a[href]');
      
      links.forEach(link => {
        const anchor = link as HTMLAnchorElement;
        const href = anchor.getAttribute('href');
        if (!href) return;

        // Skip if already processed
        if (anchor.hasAttribute('data-param-ferried')) return;

        // Skip external links, anchors, mailto, and tel links
        if (
          (href.startsWith('http') && !href.includes(window.location.hostname)) ||
          href.startsWith('#') ||
          href.startsWith('mailto:') ||
          href.startsWith('tel:')
        ) {
          anchor.setAttribute('data-param-ferried', 'skip');
          return;
        }

        try {
          const ferriedUrl = ferryParams(href);
          
          if (ferriedUrl !== href) {
            // For relative URLs, extract just the path and search params
            if (!href.startsWith('http')) {
              const url = new URL(ferriedUrl);
              const newHref = url.pathname + url.search + url.hash;
              anchor.setAttribute('href', newHref);
            } else {
              anchor.setAttribute('href', ferriedUrl);
            }
          }
          
          anchor.setAttribute('data-param-ferried', 'true');
        } catch (error) {
          console.warn('Error ferrying parameters for link:', href, error);
          anchor.setAttribute('data-param-ferried', 'error');
        }
      });
    };

    // Process links immediately
    processLinks();

    // Set up a MutationObserver to handle dynamically added links
    const observer = new MutationObserver(() => {
      // Debounce to avoid excessive processing
      setTimeout(processLinks, 10);
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}