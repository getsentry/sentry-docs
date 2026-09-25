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

  it('preserves category support while inheriting fallback guide rules', () => {
    const keys = getGuideSupportKeys('javascript', 'express', guideConfigs);

    expect(isPlatformSupported(keys, {supportedCategories: ['server']}, ['server'])).toBe(
      true
    );
    expect(
      isPlatformSupported(keys, {notSupportedCategories: ['server']}, ['server'])
    ).toBe(false);
  });

  it('lets exact guide rules override category and fallback rules', () => {
    const keys = getGuideSupportKeys('javascript', 'express', guideConfigs);

    expect(
      isPlatformSupported(
        keys,
        {
          supported: ['javascript.express'],
          notSupportedCategories: ['server'],
        },
        ['server']
      )
    ).toBe(true);
    expect(
      isPlatformSupported(
        keys,
        {
          supported: ['javascript.node'],
          notSupported: ['javascript.express'],
        },
        ['server']
      )
    ).toBe(false);
  });

  it.each(['python.django', 'python.missing'])(
    'rejects cross-platform fallback %s during page expansion',
    fallbackGuide => {
      const configs = new Map([['express', {fallbackGuide}]]);

      expect(() => getGuideSupportKeys('javascript', 'express', configs)).toThrow(
        `Invalid fallbackGuide "${fallbackGuide}": expected a guide on platform "javascript".`
      );
    }
  );

  it('rejects a cross-platform fallback deeper in the chain', () => {
    const configs = new Map([
      ['express', {fallbackGuide: 'javascript.node'}],
      ['node', {fallbackGuide: 'python.django'}],
    ]);

    expect(() => getGuideSupportKeys('javascript', 'express', configs)).toThrow(
      'Invalid fallbackGuide "python.django": expected a guide on platform "javascript".'
    );
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
