export function getGitHubRuntime(environment = process.env) {
  const token = environment.GH_TOKEN;
  const repository = environment.REPOSITORY;
  const pullRequestNumber = Number(environment.PR_NUMBER);

  if (!token) {
    throw new Error('GH_TOKEN is required');
  }
  if (!/^[^/]+\/[^/]+$/.test(repository ?? '')) {
    throw new Error('REPOSITORY must use the owner/name format');
  }
  if (!Number.isInteger(pullRequestNumber) || pullRequestNumber <= 0) {
    throw new Error('PR_NUMBER must be a positive integer');
  }

  return {
    token,
    repository,
    pullRequestNumber,
    apiBase: environment.GITHUB_API_URL || 'https://api.github.com',
  };
}

export function createGitHubClient({token, apiBase, fetchImplementation = fetch}) {
  async function request(path, options = {}) {
    const response = await fetchImplementation(`${apiBase}${path}`, {
      ...options,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...options.headers,
      },
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) {
      const error = new Error(`GitHub API ${response.status}: ${data?.message ?? text}`);
      error.status = response.status;
      throw error;
    }
    return data;
  }

  async function paginate(path) {
    const items = [];
    for (let page = 1; ; page += 1) {
      const separator = path.includes('?') ? '&' : '?';
      const result = await request(`${path}${separator}per_page=100&page=${page}`);
      items.push(...result);
      if (result.length < 100) {
        return items;
      }
    }
  }

  return {request, paginate};
}
