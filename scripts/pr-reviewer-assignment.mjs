function normalizePath(path) {
  return String(path ?? '')
    .replaceAll('\\', '/')
    .replace(/^\.?\//, '');
}

function parseReviewer(token) {
  const value = token.slice(1);
  const slash = value.indexOf('/');
  if (slash === -1) {
    return {type: 'user', login: value};
  }
  return {
    type: 'team',
    organization: value.slice(0, slash),
    slug: value.slice(slash + 1),
  };
}

export function parseCommentedCodeowners(codeowners) {
  const rules = [];
  for (const line of String(codeowners ?? '').split(/\r?\n/)) {
    const match = line.match(/^#\s*(\S+)\s+(.+)$/);
    if (!match) {
      continue;
    }

    const reviewers = [...match[2].matchAll(/@[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)?/g)].map(
      reviewer => parseReviewer(reviewer[0])
    );
    if (reviewers.length > 0) {
      rules.push({pattern: match[1], reviewers});
    }
  }
  return rules;
}

function globToRegex(pattern) {
  let expression = '';
  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];
    if (character === '*' && pattern[index + 1] === '*') {
      if (pattern[index + 2] === '/') {
        expression += '(?:.*/)?';
        index += 2;
      } else {
        expression += '.*';
        index += 1;
      }
    } else if (character === '*') {
      expression += '[^/]*';
    } else if (character === '?') {
      expression += '[^/]';
    } else {
      expression += character.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
    }
  }
  return expression;
}

export function matchesCodeownerPattern(pattern, filePath) {
  const originalPattern = String(pattern ?? '').trim();
  const path = normalizePath(filePath);
  const normalizedPattern = normalizePath(originalPattern);
  if (!normalizedPattern || !path) {
    return false;
  }

  const patternWithoutTrailingSlash = normalizedPattern.replace(/\/$/, '');
  const anchored =
    originalPattern.startsWith('/') ||
    (patternWithoutTrailingSlash.includes('/') && !normalizedPattern.startsWith('**/'));
  const prefix = anchored ? '^' : '(?:^|.*/)';
  const lastSegment = patternWithoutTrailingSlash.split('/').at(-1);

  if (!/[?*]/.test(normalizedPattern)) {
    if (normalizedPattern.endsWith('/')) {
      const directory = normalizedPattern
        .slice(0, -1)
        .replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
      return new RegExp(`${prefix}${directory}/.*$`).test(path);
    }
    if (lastSegment?.includes('.')) {
      const exact = normalizedPattern.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
      return new RegExp(`${prefix}${exact}$`).test(path);
    }
    const directoryOrFile = normalizedPattern.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
    return new RegExp(`${prefix}${directoryOrFile}(?:/.*)?$`).test(path);
  }

  let suffix = '$';
  if (normalizedPattern.endsWith('/')) {
    suffix = '.*$';
  } else if (lastSegment && !lastSegment.includes('.') && !/[?*]/.test(lastSegment)) {
    suffix = '(?:/.*)?$';
  }
  return new RegExp(`${prefix}${globToRegex(normalizedPattern)}${suffix}`).test(path);
}

function getChangedPaths(file) {
  if (typeof file === 'string') {
    return [normalizePath(file)];
  }
  return [
    normalizePath(file?.path ?? file?.filename),
    normalizePath(file?.previousPath ?? file?.previous_filename),
  ].filter(Boolean);
}

export function collectSpecialistReviewers(codeowners, files, repositoryOwner) {
  const users = new Set();
  const teams = new Set();
  const matchedRules = [];

  for (const rule of parseCommentedCodeowners(codeowners)) {
    const matchedFiles = (files ?? [])
      .flatMap(getChangedPaths)
      .filter(path => matchesCodeownerPattern(rule.pattern, path));
    if (matchedFiles.length === 0) {
      continue;
    }

    const reviewers = [];
    for (const reviewer of rule.reviewers) {
      if (reviewer.type === 'user') {
        users.add(reviewer.login);
        reviewers.push(`@${reviewer.login}`);
      } else if (reviewer.organization === repositoryOwner) {
        teams.add(reviewer.slug);
        reviewers.push(`@${reviewer.organization}/${reviewer.slug}`);
      }
    }
    if (reviewers.length > 0) {
      matchedRules.push({
        pattern: rule.pattern,
        files: [...new Set(matchedFiles)],
        reviewers,
      });
    }
  }

  return {users: [...users].sort(), teams: [...teams].sort(), matchedRules};
}

function reviewerName(reviewer) {
  return typeof reviewer === 'string' ? reviewer : (reviewer?.login ?? reviewer?.slug);
}

export function buildReviewerPlan({
  codeowners,
  files,
  repositoryOwner,
  requestedUsers = [],
  requestedTeams = [],
  excludedUsers = [],
  includeSpecialists = true,
  requestDocsReview = false,
}) {
  const specialists = includeSpecialists
    ? collectSpecialistReviewers(codeowners, files, repositoryOwner)
    : {users: [], teams: [], matchedRules: []};
  const users = new Set(specialists.users);
  const teams = new Set(specialists.teams);
  if (requestDocsReview) {
    teams.add('docs');
  }

  const existingUsers = new Set(requestedUsers.map(reviewerName).filter(Boolean));
  const existingTeams = new Set(requestedTeams.map(reviewerName).filter(Boolean));
  const excluded = new Set(excludedUsers.filter(Boolean));

  return {
    users: [...users]
      .filter(user => !existingUsers.has(user) && !excluded.has(user))
      .sort(),
    teams: [...teams].filter(team => !existingTeams.has(team)).sort(),
    matchedRules: specialists.matchedRules,
  };
}
