import fs from 'node:fs';

import yaml from 'js-yaml';
import {describe, expect, it} from 'vitest';

const workflow = yaml.load(
  fs.readFileSync('.github/workflows/pr-priority-metadata.yml', 'utf8')
);

describe('priority metadata workflow', () => {
  it('runs only on metadata lifecycle events and manual dispatch', () => {
    expect(workflow.on.pull_request_target.types).toEqual([
      'opened',
      'edited',
      'reopened',
      'ready_for_review',
      'converted_to_draft',
    ]);
    expect(workflow.on.pull_request_target.types).not.toContain('synchronize');
    expect(workflow.on.workflow_dispatch.inputs.dry_run.default).toBe(true);
  });

  it('grants only the permissions required for labels and issue comments', () => {
    expect(workflow.permissions).toEqual({
      contents: 'read',
      issues: 'write',
      'pull-requests': 'read',
    });
  });

  it('serializes event updates without allowing manual dry runs to cancel them', () => {
    const concurrency = workflow.jobs.priority_metadata.concurrency;

    expect(concurrency.group).toContain('github.run_id');
    expect(concurrency.group).toContain('inputs.dry_run');
    expect(concurrency.group).toContain("|| 'event'");
    expect(concurrency['cancel-in-progress']).toBe(true);
  });

  it('checks out a validated base SHA without persisted credentials', () => {
    const steps = workflow.jobs.priority_metadata.steps;
    const resolver = steps.find(step => step.name === 'Resolve trusted base commit');
    const checkout = steps.find(step => step.uses?.startsWith('actions/checkout@'));

    expect(resolver.run).toContain('^[0-9a-f]{40}$');
    expect(checkout.with.ref).toContain('steps.base.outputs.sha');
    expect(checkout.with['persist-credentials']).toBe(false);
  });

  it('supports a non-mutating metadata dry run', () => {
    const metadata = workflow.jobs.priority_metadata.steps.find(
      step => step.name === 'Synchronize priority metadata'
    );

    expect(metadata.env.GH_TOKEN).toContain('github.token');
    expect(metadata.run).toContain('node scripts/sync-pr-priority-metadata.mjs');
    expect(metadata.run).toContain('--dry-run');
  });

  it('uses the repository Node version without installing dependencies', () => {
    const setup = workflow.jobs.priority_metadata.steps.find(step =>
      step.uses?.startsWith('actions/setup-node@')
    );

    expect(setup.with['node-version-file']).toBe('package.json');
  });
});
