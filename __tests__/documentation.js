import { getJekyllData, printOnFail } from '../lib/helpers';
import { existsSync } from 'fs';
import path from 'path';
import glob from 'glob-promise';

describe('Documentation', function() {
  beforeAll(() => {
    return getJekyllData().then(site => {
      this.site = site;
    });
  });

  test('must have a title', () => {
    const { documentation } = this.site;
    documentation.forEach(doc => {
      printOnFail(doc.path, () => {
        expect(doc.title).toBeTruthy();
      });
    });
  });

  test('urls should not change unexpectedly', () => {
    expect.assertions(1);
    return glob(path.join(process.cwd(), '_site/**/*.{html,json,xml}')).then(
      paths => {
        const relativePaths = paths.sort().map(p => p.split('_site/')[1]);
        expect(relativePaths).toMatchSnapshot();
      }
    );
  });
});
