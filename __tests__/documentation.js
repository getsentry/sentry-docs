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

  test('must have an order number', () => {
    const { documentation } = this.site;
    documentation.forEach(doc => {
      printOnFail(doc.path, () => {
        expect(doc.sidebar_order).toBeGreaterThanOrEqual(0);
      });
    });
  });

  test('must be in a folder that matches a category', () => {
    const { documentation, documentationCategories } = this.site;
    documentation.forEach(doc => {
      const dir = doc.path.split('/').slice(-2, -1)[0];
      const msg = `${doc.path}\n\nCategory "${dir}" does not exist`;
      printOnFail(msg, () => {
        expect(dir).toBeTruthy();
        const cat = documentationCategories.find(cat => cat.slug === dir);
        expect(cat).toBeTruthy();
      });
    });
  });
});
