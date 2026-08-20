import {describe, expect, it} from 'vitest';

import {
  PRIORITIES,
  calculateReviewableChanges,
  classifyAuthor,
  evaluateDocsReview,
  getPriorityAlertReason,
  isGeneratedFile,
  parsePriority,
  shouldRequestDocsReviewForEvent,
} from './docs-pr-triage.mjs';

const SECTION = '## IS YOUR CHANGE URGENT?';

function bodyWith(lines) {
  return [
    '## DESCRIBE YOUR PR',
    'A useful change.',
    '',
    SECTION,
    '',
    ...lines,
    '',
    '## SLA',
  ].join('\n');
}

function file(path, additions = 0, deletions = 0) {
  return {path, additions, deletions};
}

describe('parsePriority', () => {
  it('parses an urgent deadline and ISO due date', () => {
    const result = parsePriority(
      bodyWith([
        '- [X] Urgent deadline (GA date, etc.): 2026-09-15',
        '- [ ] Other deadline: YYYY-MM-DD',
        '- [ ] No deadline: Not urgent',
      ])
    );

    expect(result).toEqual({
      priority: PRIORITIES.URGENT,
      label: 'Priority: Urgent',
      dueDate: '2026-09-15',
      valid: true,
      issues: [],
    });
  });

  it('accepts an overdue date as a valid deadline', () => {
    const result = parsePriority(
      bodyWith([
        '- [ ] Urgent deadline (GA date, etc.): YYYY-MM-DD',
        '- [x] Other deadline: 2020-01-01',
        '- [ ] No deadline: Not urgent',
      ])
    );

    expect(result.priority).toBe(PRIORITIES.DEADLINE);
    expect(result.dueDate).toBe('2020-01-01');
    expect(result.valid).toBe(true);
  });

  it('parses the current no-deadline option', () => {
    const result = parsePriority(bodyWith(['- [x] No deadline: Not urgent']));

    expect(result.priority).toBe(PRIORITIES.NORMAL);
    expect(result.label).toBe('Priority: Normal');
    expect(result.dueDate).toBeNull();
    expect(result.valid).toBe(true);
  });

  it('parses the persisted legacy None option', () => {
    const result = parsePriority(
      bodyWith(['- [x] None: Not urgent, can wait up to 1 week+'])
    );

    expect(result.priority).toBe(PRIORITIES.NORMAL);
    expect(result.valid).toBe(true);
  });

  it('recognizes dates entered before the legacy HTML placeholder', () => {
    const result = parsePriority(
      bodyWith(['- [x] Other deadline: 2026-10-02 <!-- ENTER DATE HERE -->'])
    );

    expect(result.priority).toBe(PRIORITIES.DEADLINE);
    expect(result.dueDate).toBe('2026-10-02');
  });

  it.each([
    [null, 'missing-section'],
    [bodyWith(['- [ ] Urgent deadline: YYYY-MM-DD']), 'missing-selection'],
    [bodyWith(['- [x] Urgent deadline: YYYY-MM-DD']), 'missing-due-date'],
    [bodyWith(['- [x] Other deadline: 2026-02-30']), 'invalid-due-date'],
  ])('returns Needs Triage for malformed metadata', (body, issue) => {
    const result = parsePriority(body);

    expect(result.priority).toBe(PRIORITIES.NEEDS_TRIAGE);
    expect(result.label).toBe('Priority: Needs Triage');
    expect(result.valid).toBe(false);
    expect(result.issues).toEqual([issue]);
  });

  it('rejects multiple selected options', () => {
    const result = parsePriority(
      bodyWith(['- [x] Urgent deadline: 2026-09-15', '- [x] No deadline: Not urgent'])
    );

    expect(result.priority).toBe(PRIORITIES.NEEDS_TRIAGE);
    expect(result.issues).toEqual(['multiple-selections']);
  });

  it('rejects a recognized option selected with a rewritten option', () => {
    const result = parsePriority(
      bodyWith(['- [x] No deadline: Not urgent', '- [x] Custom deadline: 2026-09-15'])
    );

    expect(result.priority).toBe(PRIORITIES.NEEDS_TRIAGE);
    expect(result.issues).toEqual(['multiple-selections']);
  });

  it('rejects a single rewritten option', () => {
    const result = parsePriority(bodyWith(['- [x] Custom deadline: 2026-09-15']));

    expect(result.priority).toBe(PRIORITIES.NEEDS_TRIAGE);
    expect(result.issues).toEqual(['unknown-selection']);
  });

  it('does not read checkboxes from later sections', () => {
    const body = [
      SECTION,
      '- [ ] Urgent deadline: YYYY-MM-DD',
      '',
      '## PRE-MERGE CHECKLIST',
      '- [x] Urgent deadline: 2026-09-15',
    ].join('\n');

    expect(parsePriority(body).issues).toEqual(['missing-selection']);
  });

  it('ignores urgency examples in HTML comments and code fences', () => {
    const body = [
      '<!--',
      SECTION,
      '- [x] Urgent deadline: 2026-09-15',
      '-->',
      '```markdown',
      SECTION,
      '- [x] Urgent deadline: 2026-09-15',
      '```',
      SECTION,
      '- [x] No deadline: Not urgent',
    ].join('\n');

    expect(parsePriority(body).priority).toBe(PRIORITIES.NORMAL);
  });

  it('requires a closing code fence to use the same character and sufficient length', () => {
    const body = [
      '````markdown',
      SECTION,
      '- [x] Urgent deadline: 2026-09-15',
      '```',
      SECTION,
      '- [x] Other deadline: 2026-09-16',
      '~~~',
      SECTION,
      '- [x] Other deadline: 2026-09-17',
      '````',
      SECTION,
      '- [x] No deadline: Not urgent',
    ].join('\n');

    expect(parsePriority(body).priority).toBe(PRIORITIES.NORMAL);
  });

  it('accepts a closing code fence that is longer than the opening fence', () => {
    const body = [
      '```markdown',
      SECTION,
      '- [x] Urgent deadline: 2026-09-15',
      '````',
      SECTION,
      '- [x] No deadline: Not urgent',
    ].join('\n');

    expect(parsePriority(body).priority).toBe(PRIORITIES.NORMAL);
  });

  it('rejects duplicate visible urgency sections', () => {
    const body = [
      SECTION,
      '- [x] No deadline: Not urgent',
      '## DETAILS',
      SECTION,
      '- [x] Urgent deadline: 2026-09-15',
    ].join('\n');

    expect(parsePriority(body).issues).toEqual(['multiple-sections']);
  });
});

describe('getPriorityAlertReason', () => {
  const normal = parsePriority(bodyWith(['- [x] No deadline: Not urgent']));
  const invalid = parsePriority(bodyWith(['- [ ] No deadline: Not urgent']));
  const deadline = date =>
    parsePriority(bodyWith([`- [x] Other deadline: ${date}`, '- [ ] No deadline']));
  const urgent = date =>
    parsePriority(bodyWith([`- [x] Urgent deadline: ${date}`, '- [ ] No deadline']));

  it('alerts when priority escalates', () => {
    expect(getPriorityAlertReason(normal, deadline('2026-10-01'))).toBe(
      'priority-escalated'
    );
    expect(getPriorityAlertReason(deadline('2026-10-01'), urgent('2026-10-01'))).toBe(
      'priority-escalated'
    );
    expect(getPriorityAlertReason(invalid, urgent('2026-10-01'))).toBe(
      'priority-escalated'
    );
  });

  it('alerts when a deadline moves earlier', () => {
    expect(getPriorityAlertReason(deadline('2026-10-10'), deadline('2026-10-01'))).toBe(
      'deadline-moved-earlier'
    );
  });

  it('does not alert for a later, unchanged, normal, or malformed priority', () => {
    expect(
      getPriorityAlertReason(deadline('2026-10-01'), deadline('2026-10-10'))
    ).toBeNull();
    expect(
      getPriorityAlertReason(deadline('2026-10-01'), deadline('2026-10-01'))
    ).toBeNull();
    expect(getPriorityAlertReason(deadline('2026-10-01'), normal)).toBeNull();
    expect(getPriorityAlertReason(normal, invalid)).toBeNull();
  });
});

describe('shouldRequestDocsReviewForEvent', () => {
  const normal = parsePriority(bodyWith(['- [x] No deadline: Not urgent']));
  const deadline = parsePriority(bodyWith(['- [x] Other deadline: 2026-10-01']));

  it('allows qualifying review requests on reviewer-assignment events', () => {
    expect(
      shouldRequestDocsReviewForEvent('opened', {
        requestDocsReview: true,
        priority: normal,
      })
    ).toBe(true);
    expect(
      shouldRequestDocsReviewForEvent('synchronize', {
        requestDocsReview: true,
        priority: normal,
      })
    ).toBe(true);
  });

  it('allows body edits only when they escalate priority', () => {
    expect(
      shouldRequestDocsReviewForEvent(
        'edited',
        {requestDocsReview: true, priority: deadline},
        normal
      )
    ).toBe(true);
    expect(
      shouldRequestDocsReviewForEvent(
        'edited',
        {requestDocsReview: true, priority: normal},
        normal
      )
    ).toBe(false);
    expect(
      shouldRequestDocsReviewForEvent('edited', {
        requestDocsReview: true,
        priority: deadline,
      })
    ).toBe(false);
  });

  it('never overrides a non-qualifying triage result', () => {
    expect(
      shouldRequestDocsReviewForEvent('opened', {
        requestDocsReview: false,
        priority: deadline,
      })
    ).toBe(false);
  });
});

describe('isGeneratedFile', () => {
  it.each([
    'pnpm-lock.yaml',
    'skills-lock.json',
    'includes/docs-changelog.mdx',
    'public/_platforms/javascript.json',
    'public/doctree.json',
    'public/md-exports/platforms/javascript/index.md',
    'public/og-images/product/issues.png',
    'scripts/screenshot-pipeline/output/home.png',
  ])('identifies generated path %s', path => {
    expect(isGeneratedFile(path)).toBe(true);
  });

  it.each([
    'package.json',
    'public/_platforms/_README.md',
    'public/og-images/README.md',
    'public/images/product/issues.png',
    'src/data/ea-features.json',
    'docs/organization/early-adopter-features/index.mdx',
    '.github/workflows/test.yml',
  ])('keeps reviewable path %s', path => {
    expect(isGeneratedFile(path)).toBe(false);
  });
});

describe('calculateReviewableChanges', () => {
  it('excludes generated churn from total and docs significance', () => {
    const result = calculateReviewableChanges([
      file('docs/product/issues/index.mdx', 30, 20),
      file('docs/product/alerts/index.mdx', 5, 5),
      file('src/components/banner.tsx', 10, 2),
      file('pnpm-lock.yaml', 500, 500),
      file('public/_platforms/javascript.json', 1000, 1000),
    ]);

    expect(result).toEqual({
      reviewableLines: 72,
      reviewableFiles: 3,
      docsLines: 60,
      docsFiles: 2,
      excludedFiles: ['pnpm-lock.yaml', 'public/_platforms/javascript.json'],
    });
  });

  it('supports REST filenames, string paths, and duplicate paths', () => {
    const result = calculateReviewableChanges([
      {filename: 'docs/index.mdx', additions: 2, deletions: 1},
      file('docs/index.mdx', 100, 100),
      'app/page.tsx',
    ]);

    expect(result.reviewableLines).toBe(3);
    expect(result.reviewableFiles).toBe(2);
  });

  it('counts renamed files that move out of docs', () => {
    const result = calculateReviewableChanges([
      {
        filename: 'archive/a.mdx',
        previous_filename: 'docs/a.mdx',
        status: 'renamed',
        additions: 0,
        deletions: 0,
      },
      {
        filename: 'archive/b.mdx',
        previous_filename: 'docs/b.mdx',
        status: 'renamed',
        additions: 0,
        deletions: 0,
      },
      {
        filename: 'archive/c.mdx',
        previous_filename: 'docs/c.mdx',
        status: 'renamed',
        additions: 0,
        deletions: 0,
      },
    ]);

    expect(result.docsFiles).toBe(3);
    expect(result.reviewableFiles).toBe(3);
  });

  it('counts a generated destination when the previous path was reviewable', () => {
    const result = calculateReviewableChanges([
      {
        filename: 'public/md-exports/page.md',
        previous_filename: 'docs/page.mdx',
        status: 'renamed',
        additions: 0,
        deletions: 0,
      },
    ]);

    expect(result.reviewableFiles).toBe(1);
    expect(result.docsFiles).toBe(1);
    expect(result.excludedFiles).toEqual([]);
  });
});

describe('classifyAuthor', () => {
  it('distinguishes organization members and external contributors', () => {
    expect(classifyAuthor({login: 'employee'}, 'MEMBER')).toEqual({
      isBot: false,
      isExternal: false,
    });
    expect(classifyAuthor({login: 'contributor'}, 'CONTRIBUTOR')).toEqual({
      isBot: false,
      isExternal: true,
    });
  });

  it.each([
    [{login: 'dependabot[bot]'}, 'NONE'],
    [{login: 'app/sentry'}, 'NONE'],
    [{login: 'automation', __typename: 'Bot'}, 'NONE'],
    [{login: 'automation', is_bot: true}, 'NONE'],
  ])('does not classify bot authors as external', (author, association) => {
    expect(classifyAuthor(author, association)).toEqual({isBot: true, isExternal: false});
  });

  it('does not classify an unknown author or association as external', () => {
    expect(classifyAuthor(null, 'NONE')).toEqual({isBot: false, isExternal: false});
    expect(classifyAuthor({login: 'contributor'}, null)).toEqual({
      isBot: false,
      isExternal: false,
    });
  });
});

describe('evaluateDocsReview', () => {
  const normalBody = bodyWith(['- [x] No deadline: Not urgent']);

  it.each([
    {
      name: 'urgent priority',
      body: bodyWith(['- [x] Urgent deadline: 2026-10-01']),
      files: [file('README.md', 1)],
      reason: 'priority:urgent',
    },
    {
      name: 'deadline priority',
      body: bodyWith(['- [x] Other deadline: 2026-10-01']),
      files: [file('README.md', 1)],
      reason: 'priority:deadline',
    },
    {
      name: 'external author',
      body: normalBody,
      files: [file('README.md', 1)],
      authorAssociation: 'CONTRIBUTOR',
      reason: 'external-author',
    },
    {
      name: 'docs line threshold',
      body: normalBody,
      files: [file('docs/product/issues/index.mdx', 50)],
      reason: 'docs-lines',
    },
    {
      name: 'docs file threshold',
      body: normalBody,
      files: [file('docs/a.mdx', 1), file('docs/b.mdx', 1), file('docs/c.mdx', 1)],
      reason: 'docs-files',
    },
    {
      name: 'total line threshold',
      body: normalBody,
      files: [file('app/page.tsx', 200)],
      reason: 'total-lines',
    },
    {
      name: 'total file threshold',
      body: normalBody,
      files: Array.from({length: 6}, (_, index) => file(`app/${index}.tsx`, 1)),
      reason: 'total-files',
    },
  ])('requests Docs for $name', input => {
    const result = evaluateDocsReview({
      author: {login: 'employee'},
      authorAssociation: input.authorAssociation ?? 'MEMBER',
      isDraft: false,
      ...input,
    });

    expect(result.requestDocsReview).toBe(true);
    expect(result.reasons).toContain(input.reason);
  });

  it('does not request Docs below every threshold', () => {
    const result = evaluateDocsReview({
      body: normalBody,
      files: [file('docs/a.mdx', 24, 25), file('app/page.tsx', 149)],
      author: {login: 'employee'},
      authorAssociation: 'MEMBER',
      isDraft: false,
    });

    expect(result.changes).toMatchObject({
      reviewableLines: 198,
      reviewableFiles: 2,
      docsLines: 49,
      docsFiles: 1,
    });
    expect(result.reasons).toEqual([]);
    expect(result.requestDocsReview).toBe(false);
  });

  it('never requests Docs for drafts or bots', () => {
    const files = [file('docs/product/issues/index.mdx', 1000)];
    const draft = evaluateDocsReview({
      body: normalBody,
      files,
      author: {login: 'employee'},
      authorAssociation: 'MEMBER',
      isDraft: true,
    });
    const bot = evaluateDocsReview({
      body: normalBody,
      files,
      author: {login: 'dependabot[bot]', type: 'Bot'},
      authorAssociation: 'NONE',
      isDraft: false,
    });

    expect(draft.requestDocsReview).toBe(false);
    expect(bot.requestDocsReview).toBe(false);
  });

  it('returns priority, author, and reason details for later workflows', () => {
    const result = evaluateDocsReview({
      body: bodyWith(['- [ ] No deadline: Not urgent']),
      files: [file('docs/platforms/javascript/index.mdx', 10)],
      author: {login: 'contributor'},
      authorAssociation: 'CONTRIBUTOR',
      isDraft: false,
    });

    expect(result).toMatchObject({
      priority: {priority: PRIORITIES.NEEDS_TRIAGE, valid: false},
      author: {isBot: false, isExternal: true},
      reasons: ['external-author'],
      requestDocsReview: true,
    });
  });
});
