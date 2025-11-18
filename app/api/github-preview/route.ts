import {NextRequest, NextResponse} from 'next/server';

interface GitHubApiResponse {
  content: string;
  encoding: string;
  name: string;
  path: string;
  sha: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({error: 'Missing URL parameter'}, {status: 400});
  }

  // Parse GitHub URL
  // e.g., https://github.com/getsentry/sentry/blob/master/src/sentry/api/endpoints/organization_details.py#L123-L145
  const fileMatch = url.match(
    /https?:\/\/github\.com\/([\w-]+\/[\w-]+)\/blob\/([\w.-]+)\/(.*?)(?:#L(\d+)(?:-L(\d+))?)?$/
  );

  if (!fileMatch) {
    return NextResponse.json({error: 'Invalid GitHub URL'}, {status: 400});
  }

  const [, repo, ref, filePath, startLine, endLine] = fileMatch;

  try {
    // Use GitHub API to fetch file content
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${ref}`;
    
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Sentry-Docs',
    };

    // Use GitHub token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(apiUrl, {
      headers,
      next: {revalidate: 3600}, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({error: 'File not found'}, {status: 404});
      }
      if (response.status === 403) {
        return NextResponse.json(
          {error: 'GitHub API rate limit exceeded'},
          {status: 429}
        );
      }
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data: GitHubApiResponse = await response.json();

    // Decode base64 content
    const content = Buffer.from(data.content, 'base64').toString('utf-8');

    // If line numbers are specified, extract only those lines
    let displayContent = content;
    if (startLine) {
      const lines = content.split('\n');
      const start = parseInt(startLine, 10) - 1;
      const end = endLine ? parseInt(endLine, 10) : parseInt(startLine, 10);
      displayContent = lines.slice(start, end).join('\n');
    }

    // Detect language from file extension
    const language = getLanguageFromPath(filePath);

    return NextResponse.json(
      {
        content: displayContent,
        language,
        path: data.path,
        name: data.name,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching GitHub file:', error);
    return NextResponse.json(
      {error: 'Failed to fetch file content'},
      {status: 500}
    );
  }
}

function getLanguageFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    py: 'python',
    rb: 'ruby',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin',
    scala: 'scala',
    sh: 'bash',
    yml: 'yaml',
    yaml: 'yaml',
    json: 'json',
    md: 'markdown',
    html: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
  };

  return languageMap[ext || ''] || 'text';
}
