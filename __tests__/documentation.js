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
      const segments = doc.path.split('/');
      if (segments.length >= 2) return;
      printOnFail(doc.path, () => {
        expect(doc.sidebar_order).toBeGreaterThanOrEqual(0);
      });
    });
  });

  test('must match a category', () => {
    const { documentation, documentationCategories } = this.site;
    documentation.forEach(doc => {
      const segments = doc.path.split('/');
      if (segments.length > 3) return;
      const slug =
        segments.length === 3 ? segments[1] : segments[1].split('.')[0];
      const msg = `${doc.path}\n\nCategory "${slug}" does not exist`;
      printOnFail(msg, () => {
        expect(slug).toBeTruthy();
        const cat = documentationCategories.find(cat => cat.slug === slug);
        expect(cat).toBeTruthy();
      });
    });
  });

  // If nested in a folder, the folder name must match the name of a markdown
  // file in the same folder, which is used as the parent guide.
  //
  // Example:
  //
  //  _documentation/alert/made-up-category/document-a.md
  //  _documentation/alert/made-up-category.md
  test('must be in a folder that has a matching document', () => {
    const { documentation, documentationCategories } = this.site;
    documentation.forEach(doc => {
      const segments = doc.path.split('/').slice(0, -1);
      // We don't want to test top level docs, because they have categories
      if (segments.length <= 2) return;
      const dir = segments.join('/');
      const msg = `${doc.path}\n\nCategory "${dir}" does not exist`;
      printOnFail(msg, () => {
        expect(dir).toBeTruthy();
        const cat = documentation.find(doc => {
          return doc.path === `${dir}.md`;
        });
        expect(cat).toBeTruthy();
      });
    });
  });
});
