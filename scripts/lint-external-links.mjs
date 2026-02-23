/**
 * Pre-commit hook wrapper for lychee external link checker.
 * Runs lychee on provided files and warns on broken links without blocking commits.
 *
 * On macOS arm64: automatically downloads lychee to node_modules/.bin/ if not present.
 * On other platforms: skips if lychee is not already installed.
 *
 * Usage: node scripts/lint-external-links.mjs [files...]
 */

import {spawnSync} from 'child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  chmodSync,
  writeFileSync,
  statSync,
} from 'fs';
import {createHash} from 'crypto';
import path from 'path';

// Pinned lychee release
// https://github.com/lycheeverse/lychee/releases/tag/lychee-v0.23.0
// Tag object SHA: ebc296093b743d9e3e8ec95f02e2aff82d2cd8b6
const LYCHEE_VERSION = 'lychee-v0.23.0';
const LYCHEE_MACOS_ARM64_SHA256 =
  '1953bb425486e1b887757201e54e8fdf866c9cada6c270d8f6ed21ffbed4145a';
const LYCHEE_DOWNLOAD_URL = `https://github.com/lycheeverse/lychee/releases/download/${LYCHEE_VERSION}/lychee-arm64-macos.tar.gz`;

const LOCAL_BIN = path.resolve('node_modules', '.bin');
const LYCHEE_PATH = path.join(LOCAL_BIN, 'lychee');

// Marker file to avoid retrying failed downloads on every commit
const DOWNLOAD_MARKER = path.join(LOCAL_BIN, '.lychee-download-attempted');
const RETRY_AFTER_MS = 12 * 60 * 60 * 1000; // 12 hours

// Version file written alongside the binary after successful download
const VERSION_FILE = path.join(LOCAL_BIN, '.lychee-version');

function getLycheePath() {
  // Check local install first, verifying version matches via version file
  if (existsSync(LYCHEE_PATH)) {
    try {
      const installed = readFileSync(VERSION_FILE, 'utf-8').trim();
      if (installed === LYCHEE_VERSION) {
        return LYCHEE_PATH;
      }
    } catch {
      // Version file missing or unreadable — re-download
    }
  }

  // Check system PATH
  const which = spawnSync('which', ['lychee'], {encoding: 'utf-8', stdio: 'pipe'});
  if (which.status === 0 && which.stdout.trim()) {
    return which.stdout.trim();
  }

  return null;
}

function shouldAttemptDownload() {
  if (!existsSync(DOWNLOAD_MARKER)) {
    return true;
  }
  const age = Date.now() - statSync(DOWNLOAD_MARKER).mtimeMs;
  return age > RETRY_AFTER_MS;
}

function markDownloadAttempted() {
  mkdirSync(path.dirname(DOWNLOAD_MARKER), {recursive: true});
  writeFileSync(DOWNLOAD_MARKER, new Date().toISOString());
}

function downloadLychee() {
  if (process.platform !== 'darwin' || process.arch !== 'arm64') {
    console.log(
      `Skipping lychee auto-download: only macOS arm64 is supported (detected ${process.platform}/${process.arch}).`
    );
    console.log('Install manually: brew install lychee');
    return null;
  }

  if (!shouldAttemptDownload()) {
    return null;
  }

  console.log(`Downloading lychee ${LYCHEE_VERSION}...`);

  const tarball = path.join(LOCAL_BIN, 'lychee.tar.gz');
  mkdirSync(LOCAL_BIN, {recursive: true});

  const download = spawnSync('curl', ['-sL', '-o', tarball, LYCHEE_DOWNLOAD_URL], {
    stdio: 'inherit',
    timeout: 60_000,
  });
  if (download.status !== 0) {
    console.log('Warning: failed to download lychee. Will retry in 12 hours.');
    markDownloadAttempted();
    return null;
  }

  // Verify SHA256
  const fileBuffer = readFileSync(tarball);
  const actualHash = createHash('sha256').update(fileBuffer).digest('hex');
  if (actualHash !== LYCHEE_MACOS_ARM64_SHA256) {
    console.log(`SHA256 mismatch! Expected ${LYCHEE_MACOS_ARM64_SHA256}, got ${actualHash}`);
    console.log('Warning: lychee download failed integrity check. Will retry in 12 hours.');
    spawnSync('rm', ['-f', tarball]);
    markDownloadAttempted();
    return null;
  }

  // Extract
  const extract = spawnSync('tar', ['-xzf', tarball, '-C', LOCAL_BIN], {
    stdio: 'inherit',
  });
  spawnSync('rm', ['-f', tarball]);

  if (extract.status !== 0) {
    console.log('Warning: failed to extract lychee. Will retry in 12 hours.');
    markDownloadAttempted();
    return null;
  }

  if (!existsSync(LYCHEE_PATH)) {
    console.log('Warning: lychee binary not found after extraction. Will retry in 12 hours.');
    markDownloadAttempted();
    return null;
  }

  chmodSync(LYCHEE_PATH, 0o755);
  writeFileSync(VERSION_FILE, LYCHEE_VERSION);
  // Clean up the marker on success so future version bumps trigger a fresh download
  spawnSync('rm', ['-f', DOWNLOAD_MARKER]);
  console.log(`lychee ${LYCHEE_VERSION} installed to ${LYCHEE_PATH}`);
  return LYCHEE_PATH;
}

// Resolve lychee binary, downloading if needed
const lychee = getLycheePath() ?? downloadLychee();
if (!lychee) {
  process.exit(0);
}

const files = process.argv.slice(2);
if (files.length === 0) {
  process.exit(0);
}

// Run lychee on the provided files
const result = spawnSync(lychee, ['--no-progress', ...files], {
  stdio: 'inherit',
  encoding: 'utf-8',
});

if (result.status !== 0) {
  console.log('');
  console.log('⚠️  External link issues found (commit not blocked)');
}

// Always exit 0 so commit proceeds
process.exit(0);
