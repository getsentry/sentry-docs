import {execSync} from 'child_process';
import path from 'path';

export interface GitMetadata {
  author: string;
  commitHash: string;
  timestamp: number;
}

// Cache to avoid repeated git calls during build
const gitMetadataCache = new Map<string, GitMetadata | null>();

/**
 * Get git metadata for a file
 * @param filePath - Path to the file relative to the repository root
 * @returns Git metadata or null if unavailable
 */
export function getGitMetadata(filePath: string): GitMetadata | null {
  // Check cache first
  if (gitMetadataCache.has(filePath)) {
    return gitMetadataCache.get(filePath) ?? null;
  }

  try {
    // Get commit hash, author name, and timestamp
    const logOutput = execSync(
      `git log -1 --format="%H|%an|%at" -- "${filePath}"`,
      {
        encoding: 'utf8',
        cwd: path.resolve(process.cwd()),
        stdio: ['pipe', 'pipe', 'ignore'], // Suppress stderr
      }
    ).trim();

    if (!logOutput) {
      // No commits found for this file
      gitMetadataCache.set(filePath, null);
      return null;
    }

    const [commitHash, author, timestampStr] = logOutput.split('|');
    const timestamp = parseInt(timestampStr, 10);

    const metadata: GitMetadata = {
      commitHash,
      author,
      timestamp,
    };

    gitMetadataCache.set(filePath, metadata);
    return metadata;
  } catch (error) {
    // Git command failed or file doesn't exist in git
    gitMetadataCache.set(filePath, null);
    return null;
  }
}

