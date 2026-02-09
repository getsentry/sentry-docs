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
    const cached = gitMetadataCache.get(filePath);
    // Return a NEW copy to avoid reference sharing
    return cached ? {...cached} : null;
  }

  try {
    // Get commit hash, author name, and timestamp
    const logOutput = execSync(`git log -1 --format="%H|%an|%at" -- "${filePath}"`, {
      encoding: 'utf8',
      cwd: path.resolve(process.cwd()),
      stdio: ['pipe', 'pipe', 'ignore'], // Suppress stderr
    }).trim();

    // Log for debugging on Vercel
    if (process.env.CI || process.env.VERCEL) {
      console.log(`[getGitMetadata] File: ${filePath} -> Output: ${logOutput}`);
    }

    if (!logOutput) {
      // No commits found for this file
      gitMetadataCache.set(filePath, null);
      return null;
    }

    const [commitHash, author, timestampStr] = logOutput.split('|');
    const timestamp = parseInt(timestampStr, 10);

    // Create a fresh object for each call to avoid reference sharing
    const metadata: GitMetadata = {
      commitHash,
      author,
      timestamp,
    };

    // Cache the metadata
    gitMetadataCache.set(filePath, metadata);

    // IMPORTANT: Return a NEW object, not the cached one
    // This prevents all pages from sharing the same object reference
    return {
      commitHash: metadata.commitHash,
      author: metadata.author,
      timestamp: metadata.timestamp,
    };
  } catch (error) {
    // Git command failed or file doesn't exist in git
    gitMetadataCache.set(filePath, null);
    return null;
  }
}
