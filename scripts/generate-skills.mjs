#!/usr/bin/env node

/**
 * Generates SKILL.md files for Sentry docs discovery via `npx skills add docs.sentry.io`.
 *
 * Output structure:
 *   public/.well-known/skills/
 *   ├── index.json              # Manifest listing all skills
 *   ├── sentry-android/
 *   │   └── SKILL.md
 *   ├── sentry-javascript/
 *   │   └── SKILL.md
 *   └── ... (skills for each platform/guide)
 *
 * Usage: node scripts/generate-skills.mjs
 *
 * This script is deterministic - no AI needed.
 * It uses doctree.json to get all docs with proper categorization.
 */

import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';

const DOCTREE_PATH = 'public/doctree.json';
const OUTPUT_DIR = 'public/.well-known/skills';
const DOCS_BASE_URL = 'https://docs.sentry.io';

/**
 * Category mapping from sidebar_section and path patterns
 */
const CATEGORY_ORDER = [
  'Getting Started',
  'Features',
  'Configuration',
  'Enriching Events',
  'Data Management',
  'Best Practices',
  'Migration',
  'Troubleshooting',
  'Other',
];

/**
 * Map sidebar_section to category
 */
function getSectionCategory(sidebarSection) {
  const mapping = {
    features: 'Features',
    configuration: 'Configuration',
  };
  return mapping[sidebarSection] || null;
}

/**
 * Infer category from path when sidebar_section is not available
 */
function inferCategoryFromPath(docPath, parentPath) {
  const relativePath = docPath.replace(parentPath + '/', '');
  const parts = relativePath.split('/');
  const firstPart = parts[0];

  // Map common path patterns to categories
  const pathMapping = {
    'manual-setup': 'Getting Started',
    configuration: 'Configuration',
    'enriching-events': 'Enriching Events',
    sampling: 'Configuration',
    opentelemetry: 'Configuration',
    'data-management': 'Data Management',
    'security-policy-reporting': 'Configuration',
    'best-practices': 'Best Practices',
    migration: 'Migration',
    troubleshooting: 'Troubleshooting',
    sourcemaps: 'Features',
    logs: 'Features',
    'session-replay': 'Features',
    tracing: 'Features',
    'ai-agent-monitoring': 'Features',
    metrics: 'Features',
    profiling: 'Features',
    crons: 'Features',
    'user-feedback': 'Features',
    'feature-flags': 'Features',
    'capturing-errors': 'Features',
  };

  return pathMapping[firstPart] || null;
}

/**
 * Convert a path to a .md URL
 * e.g., "platforms/javascript/guides/nextjs" -> "https://docs.sentry.io/platforms/javascript/guides/nextjs.md"
 */
function pathToMdUrl(docPath) {
  return `${DOCS_BASE_URL}/${docPath}.md`;
}

/**
 * Find a node in the doctree by path
 */
function findNode(node, targetPath) {
  if (node.path === targetPath) return node;
  for (const child of node.children || []) {
    const found = findNode(child, targetPath);
    if (found) return found;
  }
  return null;
}

/**
 * Collect all docs from a node and its children
 */
function collectDocs(node, parentPath, results = [], seen = new Set()) {
  if (node.path && node.missing !== true && !seen.has(node.path)) {
    seen.add(node.path);

    const sidebarSection = node.frontmatter?.sidebar_section || null;
    let category = getSectionCategory(sidebarSection);

    if (!category) {
      category = inferCategoryFromPath(node.path, parentPath);
    }

    // Root path is "Getting Started"
    if (node.path === parentPath) {
      category = 'Getting Started';
    }

    results.push({
      path: node.path,
      title: node.frontmatter?.title || node.slug,
      description: node.frontmatter?.description || '',
      category: category || 'Other',
    });
  }

  for (const child of node.children || []) {
    collectDocs(child, parentPath, results, seen);
  }

  return results;
}

/**
 * Group docs into skill categories based on platform/guide structure
 */
function groupIntoSkills(tree) {
  const skills = new Map();

  // Find platforms node
  const platformsNode = findNode(tree, 'platforms');
  if (!platformsNode) return [];

  for (const platformNode of platformsNode.children || []) {
    if (platformNode.missing) continue;

    const platformName = platformNode.slug;
    const skillName = `sentry-${platformName}`;

    // Collect docs for the platform itself (non-guide content)
    const platformDocs = [];
    for (const child of platformNode.children || []) {
      if (child.slug === 'guides') continue; // Skip guides, handle separately
      collectDocs(child, platformNode.path, platformDocs);
    }

    // Add the platform root
    if (!platformNode.missing) {
      platformDocs.unshift({
        path: platformNode.path,
        title: platformNode.frontmatter?.title || platformName,
        description: platformNode.frontmatter?.description || '',
        category: 'Getting Started',
      });
    }

    if (platformDocs.length > 0) {
      skills.set(skillName, {
        name: skillName,
        prettyName: platformNode.frontmatter?.title || platformName,
        description: platformNode.frontmatter?.description || '',
        docs: platformDocs,
      });
    }

    // Handle guides
    const guidesNode = findNode(platformNode, `platforms/${platformName}/guides`);
    if (guidesNode) {
      for (const guideNode of guidesNode.children || []) {
        if (guideNode.missing) continue;

        const guideName = guideNode.slug;
        const guideSkillName = `sentry-${platformName}-${guideName}`;

        const guideDocs = collectDocs(guideNode, guideNode.path);

        if (guideDocs.length > 0) {
          skills.set(guideSkillName, {
            name: guideSkillName,
            prettyName: guideNode.frontmatter?.title || guideName,
            description: guideNode.frontmatter?.description || '',
            docs: guideDocs,
          });
        }
      }
    }
  }

  // Handle API docs
  const apiNode = findNode(tree, 'api');
  if (apiNode && !apiNode.missing) {
    const apiDocs = collectDocs(apiNode, apiNode.path);
    if (apiDocs.length > 0) {
      skills.set('sentry-api', {
        name: 'sentry-api',
        prettyName: 'API',
        description:
          "Use Sentry's REST API for programmatic access to projects, issues, events, and organization management.",
        docs: apiDocs,
      });
    }
  }

  return Array.from(skills.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Generate SKILL.md content for a skill
 */
function generateSkillContent(skill) {
  const {name, prettyName, description, docs} = skill;

  // Group docs by category
  const byCategory = new Map();
  for (const doc of docs) {
    const category = doc.category;
    if (!byCategory.has(category)) {
      byCategory.set(category, []);
    }
    byCategory.get(category).push(doc);
  }

  // Build documentation section
  let docSection = '';
  for (const category of CATEGORY_ORDER) {
    const categoryDocs = byCategory.get(category);
    if (!categoryDocs || categoryDocs.length === 0) continue;

    docSection += `\n### ${category}\n`;
    for (const doc of categoryDocs) {
      const url = pathToMdUrl(doc.path);
      const desc = doc.description ? ` - ${doc.description}` : '';
      // Truncate description to reasonable length
      const truncatedDesc = desc.length > 100 ? desc.substring(0, 97) + '...' : desc;
      docSection += `- ${url}${truncatedDesc}\n`;
    }
  }

  // Create short description for frontmatter
  const shortDesc =
    description ||
    `Integrate Sentry ${prettyName} SDK for error tracking and performance monitoring.`;
  const truncatedShortDesc =
    shortDesc.length > 200 ? shortDesc.substring(0, 197) + '...' : shortDesc;

  const content = `---
name: ${name}
description: ${truncatedShortDesc}
---

# Sentry ${prettyName}

${description || `Documentation for integrating Sentry into ${prettyName} applications.`}

## Documentation

Fetch these markdown files as needed:
${docSection}`;

  return {
    name,
    description: truncatedShortDesc,
    content,
  };
}

/**
 * Write SKILL.md files and index.json
 */
async function writeSkillFiles(skills) {
  // Clean output directory first
  try {
    await rm(OUTPUT_DIR, {recursive: true, force: true});
  } catch {
    // Ignore if doesn't exist
  }
  await mkdir(OUTPUT_DIR, {recursive: true});

  // Write individual SKILL.md files
  for (const skill of skills) {
    const skillDir = path.join(OUTPUT_DIR, skill.name);
    await mkdir(skillDir, {recursive: true});
    await writeFile(path.join(skillDir, 'SKILL.md'), skill.content);
  }

  // Write index.json manifest
  const manifest = {
    skills: skills.map(s => ({
      name: s.name,
      description: s.description,
      files: [`${s.name}/SKILL.md`],
    })),
  };
  await writeFile(path.join(OUTPUT_DIR, 'index.json'), JSON.stringify(manifest, null, 2));

  return skills.length;
}

async function main() {
  console.log('📖 Loading doctree from', DOCTREE_PATH);

  let tree;
  try {
    const content = await readFile(DOCTREE_PATH, 'utf-8');
    tree = JSON.parse(content);
  } catch (err) {
    console.error('❌ Could not load doctree.json:', err.message);
    console.log('   Run "yarn build" first to generate doctree.json');
    process.exit(1);
  }

  console.log('📦 Grouping docs into skills...');
  const skillGroups = groupIntoSkills(tree);
  console.log(`   Found ${skillGroups.length} skills`);

  console.log('📝 Generating SKILL.md files...');
  const skills = skillGroups.map(generateSkillContent);

  // Stats
  let totalDocs = 0;
  for (const group of skillGroups) {
    totalDocs += group.docs.length;
  }

  const count = await writeSkillFiles(skills);
  console.log(`✅ Wrote ${count} SKILL.md files to ${OUTPUT_DIR}/`);
  console.log(`   Total documentation URLs: ${totalDocs}`);
  console.log('💰 Cost: $0 (deterministic generation, no AI)');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
