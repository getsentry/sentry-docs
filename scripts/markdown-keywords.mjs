const CURRENT_URL_TOKEN = '___CURRENT_URL___';

export function replaceCurrentUrlTokens(markdown, currentUrl) {
  if (!currentUrl) {
    return markdown;
  }

  const url = new URL(currentUrl);
  return markdown.replaceAll(CURRENT_URL_TOKEN, `${url.origin}${url.pathname}`);
}
