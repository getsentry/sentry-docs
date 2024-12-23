import {describe, expect, it} from 'vitest';

import {sanitizeNext} from './utils';

describe('sanitizeNext', () => {
  it('should return an empty string for external URLs', () => {
    expect(sanitizeNext('http://example.com')).toBe('');
    expect(sanitizeNext('https://example.com')).toBe('');
    expect(sanitizeNext('//example.com')).toBe('');
  });

  it('should prepend a slash if missing', () => {
    expect(sanitizeNext('path/to/resource')).toBe('/path/to/resource');
  });

  it('should not modify a valid internal path', () => {
    expect(sanitizeNext('/path/to/resource')).toBe('/path/to/resource');
  });

  it('should remove unsafe characters', () => {
    expect(sanitizeNext('/path/to/resource?query=1')).toBe('/path/to/resource');
    expect(sanitizeNext('/path/to/resource#hash')).toBe('/path/to/resource');
  });

  it('should allow alphanumeric and hyphens', () => {
    expect(sanitizeNext('/path-to/resource123')).toBe('/path-to/resource123');
  });

  it('should return an empty string for paths with colons', () => {
    expect(sanitizeNext('/path:to/resource')).toBe('');
  });

  it('should return an empty string for the root path', () => {
    expect(sanitizeNext('/')).toBe('');
  });

  it('should decode URL encoded characters', () => {
    expect(sanitizeNext('/path%2Fwith%2Fslashes')).toBe('/path/with/slashes');
  });

  it('should return an empty string for a malformed URI component', () => {
    const input = '%E0%A4%A'; // Malformed URI
    const expectedOutput = '';
    expect(sanitizeNext(input)).toBe(expectedOutput);
  });
});
