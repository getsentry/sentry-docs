#!/usr/bin/env ts-node

/**
 * Inventory Crawler (Section 2.1 of Tech Spec)
 *
 * Scans the docs repo, identifies every screenshot and Arcade embed,
 * classifies staleness based on Git history, and outputs a JSON manifest.
 *
 * Usage:
 *   npx ts-node scripts/screenshot-pipeline/src/crawl-inventory.ts
 *   npx ts-node scripts/screenshot-pipeline/src/crawl-inventory.ts --scope docs/product/insights
 */

import {execSync} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {glob} from 'glob';
import * as yaml from 'js-yaml';
import matter from 'gray-matter';
import {
  AssetInventoryItem,
  AssetType,
  ScreenshotConfigEntry,
  ScreenshotMapEntry,
  loadPipelineConfig,
} from './lib/types';

// ── Regex patterns for extracting references from MDX ──

// Markdown images: ![alt text](./img/foo.png) or ![alt =600x](img/foo.png)
const MD_IMAGE_RE = /!\[([^\]]*)\]\(([^)]+\.(?:png|jpg|jpeg|gif|webp|svg))\)/gi;

// JSX <img> tags: <img src="..." /> or <img src={variable} />
const JSX_IMG_RE = /<img\s[^>]*src=["']([^"']+\.(?:png|jpg|jpeg|gif|webp|svg))["'][^>]*\/?>/gi;

// Arcade embeds: <Arcade src="https://demo.arcade.software/..." />
const ARCADE_COMPONENT_RE = /<Arcade\s+src=["']([^"']+)["']\s*\/?>/gi;

// Commented-out Arcade embeds: {/* <Arcade src="..." /> */}
const ARCADE_COMMENTED_RE = /\{\/\*\s*<Arcade\s+src=["']([^"']+)["']\s*\/?>.*?\*\/\s*\}/gi;

// iframe Arcade embeds (legacy): <iframe src="https://demo.arcade.software/..." ...>
const ARCADE_IFRAME_RE =
  /<iframe\s[^>]*src=["'](https:\/\/demo\.arcade\.software\/[^"']+)["'][^>]*>/gi;

// Include component: <Include name="common-imgs/foo" />
const INCLUDE_RE = /<Include\s+name=["']([^"']+)["']\s*\/?>/gi;

// ── Main ──

async function main() {
  const config = loadPipelineConfig();
  const repoRoot = findRepoRoot();

  // Parse optional --scope flag to limit which directories to crawl
  const scopeArg = process.argv.find(a => a.startsWith('--scope'));
  const scopeIdx = process.argv.indexOf('--scope');
  const scope = scopeIdx >= 0 ? process.argv[scopeIdx + 1] : null;

  console.log('=== Screenshot Pipeline: Inventory Crawler ===');
  console.log(`Repo root: ${repoRoot}`);
  console.log(`UI refresh cutoff: ${config.ui_refresh_cutoff}`);
  if (scope) {
    console.log(`Scope: ${scope}`);
  }
  console.log('');

  // Load manual overrides
  const screenshotConfig = loadScreenshotConfig(repoRoot);
  const screenshotMap = loadScreenshotMap(repoRoot);

  // Find all MDX files
  const mdxFiles = findMdxFiles(repoRoot, config.content_dirs, scope);
  console.log(`Found ${mdxFiles.length} MDX files to scan\n`);

  const inventory: AssetInventoryItem[] = [];

  for (const mdxFile of mdxFiles) {
    const relPath = path.relative(repoRoot, mdxFile);
    const content = fs.readFileSync(mdxFile, 'utf-8');

    // Parse frontmatter to get sentry_ui_url if present
    // "none" means the page has no Sentry UI screenshots (external images only)
    let frontmatterUrl: string | null = null;
    try {
      const parsed = matter(content);
      if (parsed.data.sentry_ui_url && parsed.data.sentry_ui_url !== 'none') {
        frontmatterUrl = parsed.data.sentry_ui_url;
      }
    } catch {
      // Frontmatter parsing failed; skip silently
    }

    // Extract image references
    const imageRefs = extractImageReferences(content, mdxFile, repoRoot);
    for (const ref of imageRefs) {
      const assetType = classifyAssetType(ref.resolvedPath, screenshotConfig);
      const lastModified = getLastModifiedDate(ref.resolvedPath, repoRoot);
      const isStale = isAssetStale(lastModified, config.ui_refresh_cutoff);
      const mapEntry = screenshotMap.get(ref.resolvedPath);

      // URL priority: frontmatter > screenshot-map.yaml > null
      const uiPageUrl = frontmatterUrl ?? mapEntry?.ui_page_url ?? null;

      inventory.push({
        doc_path: relPath,
        asset_path: ref.resolvedPath,
        asset_type: assetType,
        last_modified: lastModified,
        is_stale: isStale,
        ui_page_url: uiPageUrl,
        element_selector: mapEntry?.element_selector ?? null,
        alt_text: ref.altText,
        raw_reference: ref.rawMatch,
      });
    }

    // Extract Arcade embeds
    const arcadeRefs = extractArcadeReferences(content);
    for (const ref of arcadeRefs) {
      const lastModified = getLastModifiedDateForFile(relPath, repoRoot);
      const isStale = isAssetStale(lastModified, config.ui_refresh_cutoff);

      inventory.push({
        doc_path: relPath,
        asset_path: ref.src,
        asset_type: 'arcade_embed',
        last_modified: lastModified,
        is_stale: isStale,
        ui_page_url: null,
        element_selector: null,
        alt_text: null,
        raw_reference: ref.rawMatch,
      });
    }

    // Check for Include components that might reference images
    const includeRefs = extractIncludeReferences(content);
    for (const incRef of includeRefs) {
      // Resolve the include path and scan it for images
      const includePath = resolveIncludePath(incRef.name, repoRoot);
      if (includePath && fs.existsSync(includePath)) {
        const includeContent = fs.readFileSync(includePath, 'utf-8');
        const includeImageRefs = extractImageReferences(includeContent, includePath, repoRoot);
        for (const imgRef of includeImageRefs) {
          const assetType = classifyAssetType(imgRef.resolvedPath, screenshotConfig);
          const lastModified = getLastModifiedDate(imgRef.resolvedPath, repoRoot);
          const isStale = isAssetStale(lastModified, config.ui_refresh_cutoff);
          const mapEntry = screenshotMap.get(imgRef.resolvedPath);

          inventory.push({
            doc_path: relPath,
            asset_path: imgRef.resolvedPath,
            asset_type: assetType,
            last_modified: lastModified,
            is_stale: isStale,
            ui_page_url: mapEntry?.ui_page_url ?? null,
            element_selector: mapEntry?.element_selector ?? null,
            alt_text: imgRef.altText,
            raw_reference: `<Include name="${incRef.name}" /> -> ${imgRef.rawMatch}`,
          });
        }
      }
    }
  }

  // Deduplicate: same asset_path referenced from multiple docs
  const deduped = deduplicateInventory(inventory);

  // Write output
  const outputDir = path.join(repoRoot, config.output_dir);
  fs.mkdirSync(outputDir, {recursive: true});
  const outputPath = path.join(outputDir, 'inventory-manifest.json');
  fs.writeFileSync(outputPath, JSON.stringify(deduped, null, 2));

  // Print summary
  printSummary(deduped);
  console.log(`\nManifest written to: ${outputPath}`);
}

// ── Reference Extraction ──

interface ImageRef {
  altText: string | null;
  rawMatch: string;
  /** Path relative to repo root */
  resolvedPath: string;
}

interface ArcadeRef {
  src: string;
  rawMatch: string;
  isCommentedOut: boolean;
}

interface IncludeRef {
  name: string;
  rawMatch: string;
}

function extractImageReferences(
  content: string,
  filePath: string,
  repoRoot: string
): ImageRef[] {
  const refs: ImageRef[] = [];
  const fileDir = path.dirname(filePath);

  // Markdown images
  let match: RegExpExecArray | null;
  const mdImageRe = new RegExp(MD_IMAGE_RE.source, MD_IMAGE_RE.flags);
  while ((match = mdImageRe.exec(content)) !== null) {
    const altText = match[1] || null;
    const rawPath = match[2];

    // Skip external URLs
    if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
      continue;
    }

    // Handle absolute paths (served from public/ directory, e.g., /product/dashboards/...)
    let resolvedRel: string;
    if (rawPath.startsWith('/')) {
      resolvedRel = path.join('public', rawPath);
    } else {
      const resolvedAbs = path.resolve(fileDir, rawPath);
      resolvedRel = path.relative(repoRoot, resolvedAbs);
    }

    refs.push({
      altText: altText ? cleanAltText(altText) : null,
      rawMatch: match[0],
      resolvedPath: resolvedRel,
    });
  }

  // JSX <img> tags
  const jsxImgRe = new RegExp(JSX_IMG_RE.source, JSX_IMG_RE.flags);
  while ((match = jsxImgRe.exec(content)) !== null) {
    const rawPath = match[1];
    if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
      continue;
    }
    let resolvedRel: string;
    if (rawPath.startsWith('/')) {
      resolvedRel = path.join('public', rawPath);
    } else {
      const resolvedAbs = path.resolve(fileDir, rawPath);
      resolvedRel = path.relative(repoRoot, resolvedAbs);
    }

    refs.push({
      altText: null,
      rawMatch: match[0],
      resolvedPath: resolvedRel,
    });
  }

  return refs;
}

function extractArcadeReferences(content: string): ArcadeRef[] {
  const refs: ArcadeRef[] = [];

  // Active Arcade components
  const arcadeRe = new RegExp(ARCADE_COMPONENT_RE.source, ARCADE_COMPONENT_RE.flags);
  let match: RegExpExecArray | null;
  while ((match = arcadeRe.exec(content)) !== null) {
    // Check if this match is inside a comment
    const beforeMatch = content.substring(0, match.index);
    const isCommented = beforeMatch.endsWith('{/* ') || beforeMatch.trimEnd().endsWith('{/*');

    refs.push({
      src: match[1],
      rawMatch: match[0],
      isCommentedOut: isCommented,
    });
  }

  // Commented-out Arcade embeds (template placeholders)
  const commentedRe = new RegExp(ARCADE_COMMENTED_RE.source, ARCADE_COMMENTED_RE.flags);
  while ((match = commentedRe.exec(content)) !== null) {
    refs.push({
      src: match[1],
      rawMatch: match[0],
      isCommentedOut: true,
    });
  }

  // Legacy iframe Arcade embeds
  const iframeRe = new RegExp(ARCADE_IFRAME_RE.source, ARCADE_IFRAME_RE.flags);
  while ((match = iframeRe.exec(content)) !== null) {
    refs.push({
      src: match[1],
      rawMatch: match[0],
      isCommentedOut: false,
    });
  }

  // Deduplicate by src within the same file (e.g. commented + active)
  const seen = new Set<string>();
  return refs.filter(r => {
    if (seen.has(r.src)) return false;
    seen.add(r.src);
    return true;
  });
}

function extractIncludeReferences(content: string): IncludeRef[] {
  const refs: IncludeRef[] = [];
  const includeRe = new RegExp(INCLUDE_RE.source, INCLUDE_RE.flags);
  let match: RegExpExecArray | null;
  while ((match = includeRe.exec(content)) !== null) {
    refs.push({
      name: match[1],
      rawMatch: match[0],
    });
  }
  return refs;
}

// ── Classification ──

function classifyAssetType(
  assetPath: string,
  configEntries: Map<string, ScreenshotConfigEntry>
): AssetType {
  const configEntry = configEntries.get(assetPath);
  if (configEntry?.annotated) {
    return 'annotated_screenshot';
  }
  return 'standard_screenshot';
}

// ── Git History ──

function getLastModifiedDate(assetPath: string, repoRoot: string): string | null {
  return getLastModifiedDateForFile(assetPath, repoRoot);
}

function getLastModifiedDateForFile(filePath: string, repoRoot: string): string | null {
  try {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(repoRoot, filePath);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const result = execSync(
      `git log --follow -1 --format=%aI -- "${filePath}"`,
      {cwd: repoRoot, encoding: 'utf-8', timeout: 10_000}
    ).trim();
    return result || null;
  } catch {
    return null;
  }
}

function isAssetStale(lastModified: string | null, cutoff: string): boolean {
  if (!lastModified) {
    // If we can't determine the date, assume stale
    return true;
  }
  const modifiedDate = new Date(lastModified);
  const cutoffDate = new Date(cutoff);
  return modifiedDate < cutoffDate;
}

// ── Config Loading ──

function loadScreenshotConfig(repoRoot: string): Map<string, ScreenshotConfigEntry> {
  const configPath = path.join(
    repoRoot,
    'scripts/screenshot-pipeline/config/screenshot-config.yaml'
  );
  const map = new Map<string, ScreenshotConfigEntry>();

  if (!fs.existsSync(configPath)) {
    return map;
  }

  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const entries = yaml.load(raw) as ScreenshotConfigEntry[] | null;
    if (Array.isArray(entries)) {
      for (const entry of entries) {
        map.set(entry.asset_path, entry);
      }
    }
  } catch (err) {
    console.warn(`Warning: Could not parse screenshot-config.yaml: ${err}`);
  }

  return map;
}

function loadScreenshotMap(repoRoot: string): Map<string, ScreenshotMapEntry> {
  const mapPath = path.join(
    repoRoot,
    'scripts/screenshot-pipeline/config/screenshot-map.yaml'
  );
  const map = new Map<string, ScreenshotMapEntry>();

  if (!fs.existsSync(mapPath)) {
    return map;
  }

  try {
    const raw = fs.readFileSync(mapPath, 'utf-8');
    const entries = yaml.load(raw) as ScreenshotMapEntry[] | null;
    if (Array.isArray(entries)) {
      for (const entry of entries) {
        map.set(entry.asset_path, entry);
      }
    }
  } catch (err) {
    console.warn(`Warning: Could not parse screenshot-map.yaml: ${err}`);
  }

  return map;
}

// ── File System Helpers ──

function findRepoRoot(): string {
  // Walk up from this file to find the repo root (has package.json with name "sentry-docs")
  let dir = __dirname;
  for (let i = 0; i < 10; i++) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        if (pkg.name === 'sentry-docs') {
          return dir;
        }
      } catch {
        // continue
      }
    }
    dir = path.dirname(dir);
  }
  // Fallback: use cwd
  return process.cwd();
}

function findMdxFiles(repoRoot: string, contentDirs: string[], scope: string | null): string[] {
  const patterns = contentDirs.map(dir => {
    const base = scope ? path.join(dir, scope.replace(dir + '/', '')) : dir;
    return path.join(repoRoot, base, '**/*.{md,mdx}');
  });

  const files: string[] = [];
  for (const pattern of patterns) {
    const matches = glob.sync(pattern, {nodir: true});
    files.push(...matches);
  }

  return [...new Set(files)].sort();
}

function resolveIncludePath(name: string, repoRoot: string): string | null {
  // Include names map to files in the includes/ directory
  // e.g., "common-imgs/tags" -> includes/common-imgs/tags.md or tags.mdx
  const basePath = path.join(repoRoot, 'includes', name);
  for (const ext of ['.mdx', '.md']) {
    const fullPath = basePath + ext;
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  // Try without extension (might be a directory with index)
  if (fs.existsSync(basePath + '/index.mdx')) {
    return basePath + '/index.mdx';
  }
  if (fs.existsSync(basePath + '/index.md')) {
    return basePath + '/index.md';
  }
  return null;
}

// ── Utilities ──

/**
 * Clean alt text by removing dimension suffixes like "=600x" or "=900x"
 */
function cleanAltText(alt: string): string {
  return alt.replace(/\s*=\d+x\s*$/, '').trim();
}

/**
 * Deduplicate inventory items. If the same asset_path appears in multiple docs,
 * keep all entries but mark them. The same image might be referenced from
 * multiple pages.
 */
function deduplicateInventory(items: AssetInventoryItem[]): AssetInventoryItem[] {
  // We keep all entries (an image referenced from multiple docs is relevant to all),
  // but we deduplicate exact duplicates (same doc_path + asset_path pair).
  const seen = new Set<string>();
  return items.filter(item => {
    const key = `${item.doc_path}::${item.asset_path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function printSummary(items: AssetInventoryItem[]): void {
  const total = items.length;
  const stale = items.filter(i => i.is_stale).length;
  const byType: Record<string, number> = {};
  const byStaleType: Record<string, number> = {};

  for (const item of items) {
    byType[item.asset_type] = (byType[item.asset_type] || 0) + 1;
    if (item.is_stale) {
      byStaleType[item.asset_type] = (byStaleType[item.asset_type] || 0) + 1;
    }
  }

  const mapped = items.filter(i => i.ui_page_url !== null).length;
  const uniqueAssets = new Set(items.map(i => i.asset_path)).size;
  const uniqueDocs = new Set(items.map(i => i.doc_path)).size;

  console.log('=== Inventory Summary ===');
  console.log(`Total references: ${total}`);
  console.log(`Unique assets: ${uniqueAssets}`);
  console.log(`Docs scanned: ${uniqueDocs}`);
  console.log(`Stale assets: ${stale}`);
  console.log('');
  console.log('By type:');
  for (const [type, count] of Object.entries(byType)) {
    const staleCount = byStaleType[type] || 0;
    console.log(`  ${type}: ${count} total, ${staleCount} stale`);
  }
  console.log('');
  console.log(`Mapped to URLs: ${mapped} (${items.length > 0 ? ((mapped / total) * 100).toFixed(1) : 0}%)`);
}

// ── Entry Point ──

main().catch(err => {
  console.error('Inventory crawler failed:', err);
  process.exit(1);
});
