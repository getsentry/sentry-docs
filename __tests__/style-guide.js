import { getJekyllData, printOnFail } from '../lib/helpers';

// If any of these terms are present in a match, the whole check will be ignored.
// Useful for skipping style guide checks when printing urls or usersnames.
const IGNORED_TERM_LIST = [
  'sourcemaps.io',
  'https:',
  'sentry-auth-github',
  '/extensions/github/',
  '@getsentry'
];

const containsIgnoredTerm = function(input) {
  if (!input) return false;

  let matchesATerm = false;
  const testRemaining = IGNORED_TERM_LIST.slice();

  while (!matchesATerm && testRemaining.length) {
    matchesATerm = input.indexOf(testRemaining.pop()) >= 0;
  }

  return matchesATerm;
};

expect.extend({
  // Test for incorrect usage and spelling of terms
  //
  // received - the string being tested
  // argument - the properly capitalized form
  //
  // Returns a Jest Matcher
  toCorrectlyCapitalize: function(received, argument) {
    const lineMatch = new RegExp(
      `(^|\\n).*?(\\S*)(${argument})(\\S*).*?(\\n|$)`,
      'gi'
    );
    let pass = true;
    let match;
    let message = '';

    while (pass && (match = lineMatch.exec(received))) {
      // If there is no instance of the word or this instance is correctly
      // capitalized, continue.
      const fullMatch = `${match[2] || ''}${match[3] || ''}${match[4] || ''}`;
      if (match[3] === argument || containsIgnoredTerm(fullMatch)) continue;

      message = pass
        ? () => {
            const line = match[0];
            const matchedString = new RegExp(`${argument}`, 'i').exec(line)[0];
            const highlightedMatch = this.utils
              .printReceived(matchedString)
              .replace(/"/g, '');

            return line.replace(matchedString, highlightedMatch);
          }
        : () => `expected ${match[2]} post to be ${argument}`;

      pass = false;
    }

    return { actual: received, message, pass };
  },

  toMatch: function(received, argument) {
    const lineMatch = new RegExp(
      `(^|\\n).*?(\\S*)(${argument.source})(\\S*).*?(\\n|$)`
    );
    const match = lineMatch.exec(received);
    const fullMatch = match ? `${match[2]}${match[3]}${match[4]}` : '';

    const pass = !!match && !containsIgnoredTerm(fullMatch);

    const message = pass
      ? () => {
          const line = match[0];
          const matchedString = argument.exec(line)[0];
          const highlightedMatch = this.utils
            .printReceived(matchedString)
            .replace(/"/g, '');

          return line.replace(argument, highlightedMatch);
        }
      : () => `expected received to match ${argument}`;

    return { actual: received, message, pass };
  }
});

describe('Style guide', function() {
  beforeAll(() => {
    return getJekyllData().then(site => {
      this.site = site;
    });
  });

  test('should include a space in "source map"', () => {
    const { documentation } = this.site;
    documentation.forEach(doc => {
      printOnFail(doc.path, () => {
        expect(doc.title).not.toMatch(/sourcemaps/gi);
        expect(doc.plaintext).not.toMatch(/sourcemaps/gi);
      });
    });
  });

  test('should include a space in "stack trace"', () => {
    const { documentation } = this.site;
    documentation.forEach(doc => {
      printOnFail(doc.path, () => {
        expect(doc.title).not.toMatch(/stacktrace/gi);
        expect(doc.plaintext).not.toMatch(/stacktrace/gi);
      });
    });
  });

  test('should hyphenate "third-party"', () => {
    const { documentation } = this.site;
    documentation.forEach(doc => {
      printOnFail(doc.path, () => {
        expect(doc.title).not.toMatch(/third party/gi);
        expect(doc.plaintext).not.toMatch(/third party/gi);
      });
    });
  });

  test('incorrect capitalization of "GitHub"', () => {
    const { documentation } = this.site;
    documentation.forEach(doc => {
      printOnFail(doc.path, () => {
        expect(doc.title).toCorrectlyCapitalize('GitHub');
        expect(doc.plaintext).toCorrectlyCapitalize('GitHub');
      });
    });
  });

  test('incorrect capitalization of "JavaScript"', () => {
    const { documentation } = this.site;
    documentation.forEach(doc => {
      printOnFail(doc.path, () => {
        expect(doc.title).toCorrectlyCapitalize('JavaScript');
        expect(doc.plaintext).toCorrectlyCapitalize('JavaScript');
      });
    });
  });
});
