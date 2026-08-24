export const PRIORITIES = Object.freeze({
  URGENT: 'urgent',
  DEADLINE: 'deadline',
  NEEDS_TRIAGE: 'needs-triage',
  NORMAL: 'normal',
});

export const PRIORITY_LABELS = Object.freeze({
  [PRIORITIES.URGENT]: 'Priority: Urgent',
  [PRIORITIES.DEADLINE]: 'Priority: Deadline',
  [PRIORITIES.NEEDS_TRIAGE]: 'Priority: Needs Triage',
  [PRIORITIES.NORMAL]: 'Priority: Normal',
});

export const REVIEW_THRESHOLDS = Object.freeze({
  docsLines: 50,
  docsFiles: 3,
  totalLines: 200,
  totalFiles: 6,
});

const GENERATED_EXACT_PATHS = new Set([
  'pnpm-lock.yaml',
  'skills-lock.json',
  'includes/docs-changelog.mdx',
  'next-env.d.ts',
  'tsconfig.tsbuildinfo',
  'public/doctree.json',
  'public/doctree-dev.json',
  'public/llms.txt',
]);

const GENERATED_PATH_PREFIXES = [
  '.next/',
  'out/',
  'coverage/',
  '.nyc_output/',
  'node_modules/',
  '.cache/',
  'public/~partytown/',
  'public/page-data/',
  'public/md-exports/',
  'public/mdx-images/',
  'public/og-images/',
  'static/_platforms/',
  'scripts/screenshot-pipeline/output/',
];

function normalizePath(path) {
  return String(path ?? '')
    .replaceAll('\\', '/')
    .replace(/^\.?\//, '');
}

function getUrgencySection(body) {
  const lines = getVisibleMarkdownLines(body);
  const headingIndexes = lines.reduce((indexes, line, index) => {
    if (/^##\s+IS YOUR CHANGE URGENT\?\s*$/i.test(line.trim())) {
      indexes.push(index);
    }
    return indexes;
  }, []);

  if (headingIndexes.length === 0) {
    return {issue: 'missing-section', lines: null};
  }
  if (headingIndexes.length > 1) {
    return {issue: 'multiple-sections', lines: null};
  }

  const section = [];
  for (const line of lines.slice(headingIndexes[0] + 1)) {
    if (/^##\s+/.test(line.trim())) {
      break;
    }
    section.push(line);
  }
  return {issue: null, lines: section};
}

function getVisibleMarkdownLines(body) {
  const lines = String(body ?? '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/\r?\n/);
  const visible = [];
  let fence = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (fence) {
      const closingMarker = trimmed.match(/^(`{3,}|~{3,})\s*$/)?.[1];
      if (
        closingMarker?.[0] === fence.character &&
        closingMarker.length >= fence.length
      ) {
        fence = null;
      }
      continue;
    }

    const openingMarker = trimmed.match(/^(`{3,}|~{3,})/)?.[1];
    if (openingMarker) {
      fence = {character: openingMarker[0], length: openingMarker.length};
      continue;
    }
    visible.push(line);
  }
  return visible;
}

function getCheckedText(line) {
  const checked = line.match(/^\s*[-*+]\s+\[\s*x\s*\]\s+(.+)$/i);
  return checked?.[1].trim() ?? null;
}

function getSelectedOption(text) {
  if (/^urgent deadline(?:\b|\s*\()/i.test(text)) {
    return {priority: PRIORITIES.URGENT, text};
  }
  if (/^other deadline\b/i.test(text)) {
    return {priority: PRIORITIES.DEADLINE, text};
  }
  if (/^(?:no deadline|none)\b/i.test(text)) {
    return {priority: PRIORITIES.NORMAL, text};
  }
  return null;
}

function isValidIsoDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const [year, month, day] = date.split('-').map(Number);
  const value = new Date(0);
  value.setUTCHours(0, 0, 0, 0);
  value.setUTCFullYear(year, month - 1, day);
  return (
    value.getUTCFullYear() === year &&
    value.getUTCMonth() === month - 1 &&
    value.getUTCDate() === day
  );
}

export function parsePriority(body) {
  const section = getUrgencySection(body);
  if (section.issue) {
    return buildPriorityResult(PRIORITIES.NEEDS_TRIAGE, null, [section.issue]);
  }

  const checked = section.lines.map(getCheckedText).filter(Boolean);
  if (checked.length === 0) {
    return buildPriorityResult(PRIORITIES.NEEDS_TRIAGE, null, ['missing-selection']);
  }
  if (checked.length > 1) {
    return buildPriorityResult(PRIORITIES.NEEDS_TRIAGE, null, ['multiple-selections']);
  }

  const selected = getSelectedOption(checked[0]);
  if (!selected) {
    return buildPriorityResult(PRIORITIES.NEEDS_TRIAGE, null, ['unknown-selection']);
  }

  const {priority, text} = selected;
  if (priority === PRIORITIES.NORMAL) {
    return buildPriorityResult(priority, null, []);
  }

  const dueDate = text.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0] ?? null;
  if (!dueDate) {
    return buildPriorityResult(PRIORITIES.NEEDS_TRIAGE, null, ['missing-due-date']);
  }
  if (!isValidIsoDate(dueDate)) {
    return buildPriorityResult(PRIORITIES.NEEDS_TRIAGE, null, ['invalid-due-date']);
  }

  return buildPriorityResult(priority, dueDate, []);
}

function buildPriorityResult(priority, dueDate, issues) {
  return {
    priority,
    label: PRIORITY_LABELS[priority],
    dueDate,
    valid: issues.length === 0,
    issues,
  };
}

export function getPriorityAlertReason(previous, current) {
  if (
    !current.valid ||
    ![PRIORITIES.URGENT, PRIORITIES.DEADLINE].includes(current.priority)
  ) {
    return null;
  }

  if (!previous.valid || previous.priority === PRIORITIES.NORMAL) {
    return 'priority-escalated';
  }
  if (
    previous.priority === PRIORITIES.DEADLINE &&
    current.priority === PRIORITIES.URGENT
  ) {
    return 'priority-escalated';
  }
  if (previous.dueDate && current.dueDate && current.dueDate < previous.dueDate) {
    return 'deadline-moved-earlier';
  }
  return null;
}

export function shouldRequestDocsReviewForEvent(eventAction, triage, previousPriority) {
  if (!triage.requestDocsReview) {
    return false;
  }
  if (eventAction !== 'edited') {
    return true;
  }
  return previousPriority
    ? getPriorityAlertReason(previousPriority, triage.priority) !== null
    : false;
}

export function isGeneratedFile(path) {
  const normalized = normalizePath(path);
  if (normalized === 'public/og-images/README.md') {
    return false;
  }
  if (GENERATED_EXACT_PATHS.has(normalized)) {
    return true;
  }
  if (/^public\/_platforms\/.*\.json$/i.test(normalized)) {
    return true;
  }
  return GENERATED_PATH_PREFIXES.some(prefix => normalized.startsWith(prefix));
}

function getFilePaths(file) {
  if (typeof file === 'string') {
    return {path: normalizePath(file), previousPath: ''};
  }
  return {
    path: normalizePath(file?.path ?? file?.filename),
    previousPath: normalizePath(file?.previousPath ?? file?.previous_filename),
  };
}

function getChangedLines(file) {
  if (typeof file === 'string') {
    return 0;
  }
  const additions = Math.max(0, Number(file?.additions) || 0);
  const deletions = Math.max(0, Number(file?.deletions) || 0);
  return additions + deletions;
}

export function calculateReviewableChanges(files) {
  const reviewableFiles = [];
  const excludedFiles = [];
  const seen = new Set();

  for (const file of files ?? []) {
    const {path, previousPath} = getFilePaths(file);
    if (!path || seen.has(path)) {
      continue;
    }
    seen.add(path);

    if (isGeneratedFile(path) && (!previousPath || isGeneratedFile(previousPath))) {
      excludedFiles.push(path);
      continue;
    }
    reviewableFiles.push({path, previousPath, changedLines: getChangedLines(file)});
  }

  const docsFiles = reviewableFiles.filter(
    file => file.path.startsWith('docs/') || file.previousPath.startsWith('docs/')
  );
  return {
    reviewableLines: reviewableFiles.reduce(
      (total, file) => total + file.changedLines,
      0
    ),
    reviewableFiles: reviewableFiles.length,
    docsLines: docsFiles.reduce((total, file) => total + file.changedLines, 0),
    docsFiles: docsFiles.length,
    excludedFiles,
  };
}

export function classifyAuthor(author, authorAssociation) {
  const login = typeof author === 'string' ? author : author?.login;
  const isBot = Boolean(
    (typeof author === 'object' &&
      (author?.is_bot || author?.type === 'Bot' || author?.__typename === 'Bot')) ||
    /\[bot\]$/i.test(login ?? '') ||
    /^app\//i.test(login ?? '') ||
    /^dependabot$/i.test(login ?? '')
  );
  const association = String(authorAssociation ?? '').toUpperCase();
  return {
    isBot,
    isExternal:
      !isBot &&
      Boolean(login) &&
      Boolean(association) &&
      !['MEMBER', 'OWNER'].includes(association),
  };
}

export function evaluateDocsReview({body, files, author, authorAssociation, isDraft}) {
  const priority = parsePriority(body);
  const changes = calculateReviewableChanges(files);
  const authorStatus = classifyAuthor(author, authorAssociation);
  const reasons = [];

  if (
    priority.valid &&
    [PRIORITIES.URGENT, PRIORITIES.DEADLINE].includes(priority.priority)
  ) {
    reasons.push(`priority:${priority.priority}`);
  }
  if (authorStatus.isExternal) {
    reasons.push('external-author');
  }
  if (changes.docsLines >= REVIEW_THRESHOLDS.docsLines) {
    reasons.push('docs-lines');
  }
  if (changes.docsFiles >= REVIEW_THRESHOLDS.docsFiles) {
    reasons.push('docs-files');
  }
  if (changes.reviewableLines >= REVIEW_THRESHOLDS.totalLines) {
    reasons.push('total-lines');
  }
  if (changes.reviewableFiles >= REVIEW_THRESHOLDS.totalFiles) {
    reasons.push('total-files');
  }

  return {
    priority,
    changes,
    author: authorStatus,
    reasons,
    requestDocsReview: isDraft === false && !authorStatus.isBot && reasons.length > 0,
  };
}
