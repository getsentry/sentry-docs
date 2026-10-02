import fs from 'node:fs';

import yaml from 'js-yaml';
import {describe, expect, it} from 'vitest';

const workflow = yaml.load(
  fs.readFileSync('.github/workflows/codeowner_assignment.yaml', 'utf8')
);

describe('codeowner assignment workflow', () => {
  it('uses trusted pull_request_target events and supports manual dry runs', () => {
    expect(workflow.on.pull_request).toBeUndefined();
    expect(workflow.on.pull_request_target.types).toEqual([
      'opened',
      'edited',
      'reopened',
      'synchronize',
      'ready_for_review',
    ]);
    expect(workflow.on.workflow_dispatch.inputs.dry_run.default).toBe(true);
  });

  it('keeps the workflow token read-only', () => {
    expect(workflow.permissions).toEqual({contents: 'read'});
  });

  it('serializes equivalent assignment events without mixing body edits or dry runs', () => {
    const concurrency = workflow.jobs.codeowner_assignment.concurrency;

    expect(concurrency.group).toContain('inputs.dry_run');
    expect(concurrency.group).toContain(
      "github.event.action == 'edited' && github.run_id"
    );
    expect(concurrency.group).toContain("|| 'assignment'");
    expect(concurrency['cancel-in-progress']).toBe(true);
  });

  it('checks out only the trusted base commit without persisting credentials', () => {
    const checkout = workflow.jobs.codeowner_assignment.steps.find(step =>
      step.uses?.startsWith('actions/checkout@')
    );

    expect(checkout.with.ref).toContain('steps.base.outputs.sha');
    expect(checkout.with.ref).not.toContain('head.sha');
    expect(checkout.with['persist-credentials']).toBe(false);
  });

  it('limits the GitHub App token to the repository and required permissions', () => {
    const token = workflow.jobs.codeowner_assignment.steps.find(step =>
      step.uses?.startsWith('actions/create-github-app-token@')
    );

    expect(token.with.repositories.trim()).toBe('sentry-docs');
    expect(token.with['permission-contents']).toBeUndefined();
    expect(token.with['permission-members']).toBe('read');
    expect(token.with['permission-pull-requests']).toBe('write');
  });

  it('resolves manual runs to the selected pull request base commit', () => {
    const resolver = workflow.jobs.codeowner_assignment.steps.find(
      step => step.name === 'Resolve trusted base commit'
    );

    expect(resolver.run).toContain('gh api "repos/$REPOSITORY/pulls/$PR_NUMBER"');
    expect(resolver.run).toContain('^[0-9a-f]{40}$');
  });

  it('runs the base-branch reviewer assignment script', () => {
    const assignment = workflow.jobs.codeowner_assignment.steps.find(
      step => step.name === 'Evaluate CODEOWNERS and assign reviewers'
    );

    expect(assignment.run).toContain('node scripts/assign-pr-reviewers.mjs');
    expect(assignment.run).toContain('--dry-run');
  });

  it('uses the repository Node version without installing dependencies', () => {
    const setup = workflow.jobs.codeowner_assignment.steps.find(step =>
      step.uses?.startsWith('actions/setup-node@')
    );

    expect(setup.with['node-version-file']).toBe('package.json');
  });
});

describe('non-blocking Docs review', () => {
  it('does not define Docs as an active CODEOWNER', () => {
    const codeowners = fs.readFileSync('.github/CODEOWNERS', 'utf8');
    const activeRules = codeowners
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));

    expect(activeRules.some(line => line.includes('@getsentry/docs'))).toBe(false);
  });
});
