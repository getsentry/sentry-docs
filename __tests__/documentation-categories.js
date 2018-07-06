import { getJekyllData, printOnFail } from '../lib/helpers';
import { existsSync } from 'fs';
import path from 'path';

describe('Documentation Categories', function() {
  beforeAll(() => {
    return getJekyllData().then(site => {
      this.site = site;
    });
  });

  test('must have a title', () => {
    const { documentationCategories } = this.site;
    documentationCategories.forEach(cat => {
      printOnFail(cat, () => {
        expect(cat.title).toBeTruthy();
      });
    });
  });

  test('must have an icon that exists', () => {
    const { documentationCategories } = this.site;
    documentationCategories.forEach(cat => {
      printOnFail(cat.name, () => {
        const projectPath = `src/_includes/svg/${cat.icon}.svg`;
        const file = path.join(process.cwd(), projectPath);
        expect(cat.icon).toBeTruthy();
        expect(existsSync(file)).toBeTruthy();
      });
    });
  });
});
