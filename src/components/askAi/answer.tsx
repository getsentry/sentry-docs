'use client';

import DOMPurify from 'dompurify';

export function sanitizeAnswer(html: string) {
  // No images, style, embeds, forms, or remote resources in model output.
  const fragment = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'ul',
      'ol',
      'li',
      'pre',
      'code',
      'blockquote',
      'a',
      'h2',
      'h3',
      'h4',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'hr',
      'sup',
    ],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false,
    RETURN_DOM_FRAGMENT: true,
  });
  fragment.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (!/^https:\/\//i.test(href) && !/^\/(?!\/)/.test(href) && !href.startsWith('#'))
      link.removeAttribute('href');
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.setAttribute('referrerpolicy', 'no-referrer');
  });
  const container = document.createElement('div');
  container.append(fragment);
  return container.innerHTML;
}

export function Answer({html}: {html: string}) {
  return <div dangerouslySetInnerHTML={{__html: sanitizeAnswer(html)}} />;
}
