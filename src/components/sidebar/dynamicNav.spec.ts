import {describe, expect, it, vi} from 'vitest';

import type {EntityTree} from './dynamicNav';
import {getSectionOverviewPath} from './dynamicNav';

vi.mock('server-only', () => ({}));

const entity = (name: string, sidebar_hidden?: boolean): EntityTree => ({
  name,
  children: [],
  node: {
    path: `/platforms/android/${name}/`,
    context: {title: name, sidebar_hidden},
  },
});

describe('getSectionOverviewPath', () => {
  it('returns the hidden landing page of a section', () => {
    expect(getSectionOverviewPath([entity('features', true)], 'features')).toBe(
      '/platforms/android/features/'
    );
  });

  it('skips landing pages that already have a sidebar entry', () => {
    expect(getSectionOverviewPath([entity('features')], 'features')).toBeNull();
  });

  it('skips sections without a landing page', () => {
    expect(getSectionOverviewPath([entity('tracing', true)], 'features')).toBeNull();
  });

  it('skips sections that have no landing page configured', () => {
    expect(
      getSectionOverviewPath([entity('configuration', true)], 'configuration')
    ).toBeNull();
  });
});
