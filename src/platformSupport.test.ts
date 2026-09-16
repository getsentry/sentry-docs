import {describe, expect, it} from 'vitest';

import {getGuideSupportKeys, isPlatformSupported} from './platformSupport';

const guideConfigs = new Map([
  ['node', {}],
  ['express', {fallbackGuide: 'javascript.node'}],
]);

describe('platform support', () => {
  it('inherits support rules through fallback guides', () => {
    const keys = getGuideSupportKeys('javascript', 'express', guideConfigs);

    expect(keys).toEqual(['javascript.express', 'javascript.node', 'javascript']);
    expect(isPlatformSupported(keys, {notSupported: ['javascript.node']})).toBe(false);
  });

  it('lets the current guide override a fallback rule', () => {
    const keys = getGuideSupportKeys('javascript', 'express', guideConfigs);

    expect(
      isPlatformSupported(keys, {
        supported: ['javascript.express'],
        notSupported: ['javascript.node'],
      })
    ).toBe(true);
  });

  it('treats null support lists as unspecified', () => {
    expect(isPlatformSupported(['javascript'], {supported: null})).toBe(true);
  });

  it('stops when fallback guides form a cycle', () => {
    const cyclicConfigs = new Map([
      ['express', {fallbackGuide: 'javascript.node'}],
      ['node', {fallbackGuide: 'javascript.express'}],
    ]);

    expect(getGuideSupportKeys('javascript', 'express', cyclicConfigs)).toEqual([
      'javascript.express',
      'javascript.node',
      'javascript',
    ]);
  });
});
