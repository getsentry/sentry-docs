export const sanitizeNext = (next: string) => {
  let sanitizedNext = next;
  // Validate that next is an internal path
  if (
    sanitizedNext.startsWith('//') ||
    sanitizedNext.startsWith('http') ||
    sanitizedNext.includes(':')
  ) {
    // Reject potentially malicious redirects
    sanitizedNext = '';
  }

  // Ensure next starts with a forward slash and only contains safe characters
  if (sanitizedNext && !sanitizedNext.startsWith('/')) {
    sanitizedNext = '/' + sanitizedNext;
  }

  // Discard hash and path parameters
  const [pathname] = sanitizedNext.split('#')[0].split('?');

  // Only allow alphanumeric, hyphens
  sanitizedNext = pathname.replace(/[^\w\-\/]/g, '');

  return sanitizedNext;
};
