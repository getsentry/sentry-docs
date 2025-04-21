import {describe, expect, it} from 'vitest';

import {cleanCodeSnippet} from './index';

describe('cleanCodeSnippet', () => {
  describe('consecutive newlines', () => {
    it('should reduce two consecutive newlines to a single newline', () => {
      const input = 'line1\n\nline2\n\n\n  line3';
      const result = cleanCodeSnippet(input, {});
      expect(result).toBe('line1\nline2\n\n  line3');
    });

    it('should handle input with single newlines', () => {
      const input = 'line1\nline2\nline3';
      const result = cleanCodeSnippet(input, {});
      expect(result).toBe('line1\nline2\nline3');
    });
  });

  describe('diff markers', () => {
    it('should remove diff markers (+/-) from the beginning of lines by default', () => {
      const input = '+added line\n- removed line\n  normal line';
      const result = cleanCodeSnippet(input);
      expect(result).toBe('added line\nremoved line\n  normal line');
    });

    it('should preserve diff markers when cleanDiffMarkers is set to false', () => {
      const input = '+ added line\n- removed line';
      const result = cleanCodeSnippet(input, {cleanDiffMarkers: false});
      expect(result).toBe('+ added line\n- removed line');
    });

    it('should remove diff markers based on real-life code example', () => {
      const input =
        '-Sentry.init({\n' +
        "-  dsn: '\n" +
        '\n' +
        "https://examplePublicKey@o0.ingest.sentry.io/0',\n" +
        '-  tracesSampleRate: 1.0,\n' +
        '-\n' +
        '-  // uncomment the line below to enable Spotlight (https://spotlightjs.com)\n' +
        '-  // spotlight: import.meta.env.DEV,\n' +
        '-});\n' +
        '-\n' +
        '-export const handle = sentryHandle();\n' +
        '+export const handle = sequence(\n' +
        '+   initCloudflareSentryHandle({\n' +
        "+       dsn: '\n" +
        '\n' +
        "https://examplePublicKey@o0.ingest.sentry.io/0',\n" +
        '+       tracesSampleRate: 1.0,\n' +
        '+   }),\n' +
        '+   sentryHandle()\n' +
        '+);';

      const result = cleanCodeSnippet(input);
      expect(result).toBe(
        'Sentry.init({\n' +
          " dsn: '\n" +
          "https://examplePublicKey@o0.ingest.sentry.io/0',\n" +
          ' tracesSampleRate: 1.0,\n' +
          ' // uncomment the line below to enable Spotlight (https://spotlightjs.com)\n' +
          ' // spotlight: import.meta.env.DEV,\n' +
          '});\n' +
          'export const handle = sentryHandle();\n' +
          'export const handle = sequence(\n' +
          '  initCloudflareSentryHandle({\n' +
          "      dsn: '\n" +
          "https://examplePublicKey@o0.ingest.sentry.io/0',\n" +
          '      tracesSampleRate: 1.0,\n' +
          '  }),\n' +
          '  sentryHandle()\n' +
          ');'
      );
    });
  });

  describe('bash prompt', () => {
    it('should remove bash prompt in bash/shell language', () => {
      const input = '$ ls -la\nsome output';
      const result = cleanCodeSnippet(input, {language: 'bash'});
      expect(result).toBe('ls -la\nsome output');
    });

    it('should remove bash prompt in shell language', () => {
      const input = '$ git status\nsome output';
      const result = cleanCodeSnippet(input, {language: 'shell'});
      expect(result).toBe('git status\nsome output');
    });

    it('should not remove bash prompt for non-bash/shell languages', () => {
      const input = '$ some text';
      const result = cleanCodeSnippet(input, {language: 'python'});
      expect(result).toBe('$ some text');
    });

    it('should handle bash prompt with multiple spaces', () => {
      const input = '$    ls -la\nsome output';
      const result = cleanCodeSnippet(input, {language: 'bash'});
      expect(result).toBe('ls -la\nsome output');
    });
  });

  describe('combination of options', () => {
    it('should handle multiple cleaning operations together', () => {
      const input = '+ $ ls -la\n\n- $ git status';
      const result = cleanCodeSnippet(input, {language: 'bash'});
      expect(result).toBe('ls -la\ngit status');
    });
  });

  describe('edge cases', () => {
    it('should handle empty input', () => {
      const input = '';
      const result = cleanCodeSnippet(input, {});
      expect(result).toBe('');
    });

    it('should handle input with only newlines', () => {
      const input = '\n\n\n';
      const result = cleanCodeSnippet(input, {});
      expect(result).toBe('\n\n');
    });

    it('should preserve leading whitespace not associated with diff markers', () => {
      const input = '  normal line\n+ added line';
      const result = cleanCodeSnippet(input, {});
      expect(result).toBe('  normal line\nadded line');
    });
  });
});
