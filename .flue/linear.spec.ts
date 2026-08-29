import {describe, expect, test} from 'vitest';

import {type LinearTeam, priorityNumber, resolveLinearTeam, stateByType} from './linear';
import triageConfig from './triage-config.json';

const teams: LinearTeam[] = [
  {
    id: 'docs-id',
    key: 'DOCS',
    name: 'Docs',
    states: [
      {id: 'docs-canceled', name: 'Canceled', type: 'canceled'},
      {id: 'docs-duplicate', name: 'Duplicate', type: 'canceled'},
    ],
  },
  {
    id: 'js-id',
    key: 'JAVASCRIPT',
    name: 'JavaScript SDKs',
    states: [{id: 'js-canceled', name: 'Canceled', type: 'canceled'}],
  },
];

describe('Linear policy helpers', () => {
  test('maps every priority including no priority', () => {
    expect(priorityNumber('none')).toBe(0);
    expect(priorityNumber('urgent')).toBe(1);
    expect(priorityNumber('high')).toBe(2);
    expect(priorityNumber('medium')).toBe(3);
    expect(priorityNumber('low')).toBe(4);
  });

  test('resolves semantic teams by configured key or name', () => {
    expect(resolveLinearTeam(teams, 'docs', triageConfig).id).toBe('docs-id');
    expect(resolveLinearTeam(teams, 'javascript-sdks', triageConfig).id).toBe('js-id');
  });

  test('resolves a unique workflow state by type', () => {
    expect(stateByType(teams[0], 'canceled').id).toBe('docs-canceled');
  });
});
