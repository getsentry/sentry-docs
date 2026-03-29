// @vitest-environment jsdom
import {afterEach, beforeEach, describe, expect, test} from 'vitest';

import {marketingUrlParams} from './utils';

describe('marketingUrlParams', () => {
  const originalLocation = window.location;
  const originalReferrer = document.referrer;

  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {search: ''},
    });
    // Mock document.referrer
    Object.defineProperty(document, 'referrer', {
      writable: true,
      value: '',
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
    Object.defineProperty(document, 'referrer', {
      writable: true,
      value: originalReferrer,
    });
  });

  test('returns empty object when no query params', () => {
    window.location.search = '';
    expect(marketingUrlParams()).toEqual({});
  });

  test('extracts utm parameters', () => {
    window.location.search = '?utm_source=google&utm_medium=cpc&utm_campaign=test';
    expect(marketingUrlParams()).toEqual({
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'test',
    });
  });

  test('extracts promo parameters', () => {
    window.location.search = '?promo_code=SAVE20';
    expect(marketingUrlParams()).toEqual({
      promo_code: 'SAVE20',
    });
  });

  test('extracts gclid parameter', () => {
    window.location.search = '?gclid=abc123';
    expect(marketingUrlParams()).toEqual({
      gclid: 'abc123',
    });
  });

  test('extracts original_referrer parameter', () => {
    window.location.search = '?original_referrer=https://example.com';
    expect(marketingUrlParams()).toEqual({
      original_referrer: 'https://example.com',
    });
  });

  test('ignores non-marketing parameters', () => {
    window.location.search = '?utm_source=google&foo=bar&page=1';
    expect(marketingUrlParams()).toEqual({
      utm_source: 'google',
    });
  });

  test('adds document.referrer as original_referrer when not in params', () => {
    window.location.search = '?utm_source=google';
    Object.defineProperty(document, 'referrer', {
      writable: true,
      value: 'https://referrer.com',
    });
    expect(marketingUrlParams()).toEqual({
      utm_source: 'google',
      original_referrer: 'https://referrer.com',
    });
  });

  test('does not override original_referrer from params with document.referrer', () => {
    window.location.search = '?original_referrer=https://param-referrer.com';
    Object.defineProperty(document, 'referrer', {
      writable: true,
      value: 'https://document-referrer.com',
    });
    expect(marketingUrlParams()).toEqual({
      original_referrer: 'https://param-referrer.com',
    });
  });

  test('preserves + characters in parameter values', () => {
    window.location.search = '?utm_source=google+ads&utm_campaign=spring+sale+2024';
    expect(marketingUrlParams()).toEqual({
      utm_source: 'google+ads',
      utm_campaign: 'spring+sale+2024',
    });
  });

  test('decodes percent-encoded values correctly', () => {
    window.location.search = '?utm_source=google%20ads&utm_campaign=test%2Bvalue';
    expect(marketingUrlParams()).toEqual({
      utm_source: 'google ads',
      utm_campaign: 'test+value',
    });
  });

  test('handles case-insensitive parameter matching', () => {
    window.location.search = '?UTM_SOURCE=google&Utm_Medium=cpc&GCLID=abc';
    expect(marketingUrlParams()).toEqual({
      UTM_SOURCE: 'google',
      Utm_Medium: 'cpc',
      GCLID: 'abc',
    });
  });
});
