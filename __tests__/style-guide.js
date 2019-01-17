import { getJekyllData, printOnFail } from '../lib/helpers';

expect.extend({
  // Test for incorrect usage and spelling of terms
  //
  // received - the string being tested
  // argument - the properly capitalized form
  //
  // Returns a Jest Matcher
  toCorrectlyCapitalize: function(received, argument) {
    const lineMatch = new RegExp(`(^|\\n).*?(${argument}).*?(\\n|$)`, 'gi');
    let pass = true;
    let match;
    let message = '';

    while (pass && (match = lineMatch.exec(received))) {
      // If there is no instance of the word or this instance is correctly
      // capitalized, continue.
      if (!match || match[2] === argument) continue;

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
    const lineMatch = new RegExp(`(^|\\n).*?(${argument.source}).*?(\\n|$)`);
    const match = lineMatch.exec(received);
    const pass = !!match;

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
