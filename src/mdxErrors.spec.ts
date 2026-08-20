import {describe, expect, test} from 'vitest';

import {isExpectedMdxError} from './mdxErrors';

describe('isExpectedMdxError', () => {
  describe('returns true for expected errors', () => {
    test('Error with .code = ENOENT', () => {
      const error = Object.assign(new Error('file not found'), {code: 'ENOENT'});
      expect(isExpectedMdxError(error)).toBe(true);
    });

    test('Error with .code = MDX_RUNTIME_ERROR', () => {
      const error = Object.assign(new Error('runtime error'), {
        code: 'MDX_RUNTIME_ERROR',
      });
      expect(isExpectedMdxError(error)).toBe(true);
    });

    test('plain object with .code = ENOENT (Edge runtime simulation)', () => {
      const error = {code: 'ENOENT', message: 'some error'};
      expect(isExpectedMdxError(error)).toBe(true);
    });

    test('plain object with .code = MDX_RUNTIME_ERROR (Edge runtime simulation)', () => {
      const error = {code: 'MDX_RUNTIME_ERROR', message: 'runtime error'};
      expect(isExpectedMdxError(error)).toBe(true);
    });

    test('plain object with expected message but no .code (Edge runtime fallback)', () => {
      const error = {
        message: 'Failed to find a valid source file for slug "docs/changelog"',
      };
      expect(isExpectedMdxError(error)).toBe(true);
    });

    test('Error with expected message but no .code', () => {
      const error = new Error(
        'Failed to find a valid source file for slug "docs/changelog"'
      );
      expect(isExpectedMdxError(error)).toBe(true);
    });
  });

  describe('returns false for unexpected errors', () => {
    test('unrelated Error', () => {
      expect(isExpectedMdxError(new Error('Connection refused'))).toBe(false);
    });

    test('Error with unrelated .code', () => {
      const error = Object.assign(new Error('permission denied'), {code: 'EPERM'});
      expect(isExpectedMdxError(error)).toBe(false);
    });

    test('plain object with wrong message and no .code', () => {
      expect(isExpectedMdxError({message: 'Something else went wrong'})).toBe(false);
    });

    test('string throw', () => {
      expect(isExpectedMdxError('some string error')).toBe(false);
    });

    test('null', () => {
      expect(isExpectedMdxError(null)).toBe(false);
    });

    test('undefined', () => {
      expect(isExpectedMdxError(undefined)).toBe(false);
    });

    test('number', () => {
      expect(isExpectedMdxError(42)).toBe(false);
    });

    test('empty object', () => {
      expect(isExpectedMdxError({})).toBe(false);
    });
  });
});
