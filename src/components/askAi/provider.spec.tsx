import * as React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {AskAiProvider, useAskAi} from './provider';

function renderOpener() {
  // Vitest uses classic JSX while Next supplies the automatic JSX runtime.
  vi.stubGlobal('React', React);
  let open!: ReturnType<typeof useAskAi>;
  function Consumer() {
    open = useAskAi();
    return null;
  }
  renderToStaticMarkup(
    <AskAiProvider provider="kapa" supportUrl={null} handoffEnabled={false}>
      <Consumer />
    </AskAiProvider>
  );
  return open;
}

afterEach(() => vi.unstubAllGlobals());

describe('Ask AI fallback readiness', () => {
  it('preserves search until Kapa loads, then releases the overlay before opening', () => {
    const browser: {Kapa?: {open: ReturnType<typeof vi.fn>}} = {};
    vi.stubGlobal('window', browser);
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback);
    });
    const open = renderOpener();
    const closeSearch = vi.fn();
    const options = {query: 'How do I configure Sentry?', submit: true};

    open(options, closeSearch);
    expect(closeSearch).not.toHaveBeenCalled();
    expect(frames).toHaveLength(0);

    browser.Kapa = {open: vi.fn()};
    open(options, closeSearch);
    expect(closeSearch).toHaveBeenCalledOnce();
    expect(browser.Kapa.open).not.toHaveBeenCalled();
    expect(frames).toHaveLength(1);
    frames[0](0);
    expect(browser.Kapa.open).toHaveBeenCalledExactlyOnceWith(options);
  });

  it('opens a ready fallback directly when there is no overlay to release', () => {
    const kapa = {open: vi.fn()};
    vi.stubGlobal('window', {Kapa: kapa});
    renderOpener()();
    expect(kapa.open).toHaveBeenCalledExactlyOnceWith({});
  });
});
