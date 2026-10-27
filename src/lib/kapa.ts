/**
 * On-demand loader for the Kapa.ai widget.
 *
 * The bundle is ~600 KiB and pulls in reCAPTCHA Enterprise behind it, which
 * together accounted for roughly a second of main-thread time on every page
 * load. Almost nobody opens Ask AI, so instead of shipping it to everyone up
 * front we fetch it the first time someone reaches for it, and pre-warm on
 * hover/focus so the click still feels instant.
 */

import {captureException} from '@sentry/nextjs';

const KAPA_SRC = 'https://widget.kapa.ai/kapa-widget.bundle.js';

// Mirrors the data-* attributes the <Script> tag used to carry in app/layout.tsx.
const KAPA_ATTRIBUTES: Record<string, string> = {
  'data-website-id': 'cac7cc70-969e-4bc1-a968-55534a839be4',
  // do not render kapa's own floating button
  'data-button-hide': 'true',
  'data-project-name': 'Sentry',
  'data-project-color': '#6A5FC1',
  'data-project-logo': 'https://avatars.githubusercontent.com/u/1396951?s=280&v=4',
  'data-font-family': 'var(--font-rubik)',
  'data-modal-disclaimer':
    'Please note: This is a tool that searches publicly available sources. Do not include any sensitive or personal information in your queries. For more on how Sentry handles your data, see our [Privacy Policy](https://sentry.io/privacy/).',
  'data-modal-example-questions':
    'How to set up Sentry for Next.js?,What are tracePropagationTargets?',
  'data-user-analytics-cookie-enabled': 'false',
  'data-color-scheme': 'auto',
  'data-color-scheme-selector': '.dark',
};

/** How long to wait for the bundle to define window.Kapa after it loads. */
const INIT_TIMEOUT_MS = 10_000;
const INIT_POLL_MS = 50;

let loadPromise: Promise<void> | null = null;

/**
 * The bundle's load event fires before it has finished wiring up window.Kapa,
 * so wait for the API itself rather than for the network.
 */
function whenKapaReady(): Promise<void> {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + INIT_TIMEOUT_MS;
    const poll = () => {
      if (window.Kapa?.open) {
        resolve();
      } else if (Date.now() > deadline) {
        reject(new Error('Kapa widget loaded but never initialized'));
      } else {
        setTimeout(poll, INIT_POLL_MS);
      }
    };
    poll();
  });
}

/**
 * Inject the widget. Safe to call repeatedly: the work happens once, and a
 * failed attempt is cleared so the next interaction can retry.
 */
export function loadKapa(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }
  if (loadPromise) {
    return loadPromise;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = KAPA_SRC;
    script.async = true;
    Object.entries(KAPA_ATTRIBUTES).forEach(([name, value]) =>
      script.setAttribute(name, value)
    );
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () =>
      reject(new Error('Failed to load the Kapa widget'))
    );
    document.body.appendChild(script);
  }).then(whenKapaReady);

  promise.catch(() => {
    // let the next click try again rather than wedging Ask AI for the session
    loadPromise = null;
  });

  loadPromise = promise;
  return promise;
}

/** Start fetching without opening, e.g. on hover or focus of an Ask AI control. */
export function prefetchKapa(): void {
  loadKapa().catch(() => {});
}

/** Load the widget if needed, then open the modal. */
export async function openKapa(
  options: {mode?: string; query?: string; submit?: boolean} = {}
): Promise<void> {
  try {
    await loadKapa();
    window.Kapa?.open(options);
  } catch (error) {
    captureException(error);
  }
}
