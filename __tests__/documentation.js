import { getJekyllData, printOnFail } from '../lib/helpers';
import { existsSync } from 'fs';
import path from 'path';

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
});
