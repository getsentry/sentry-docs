/**
 * Sync Early Adopter Features from sentry-options-automator
 *
 * This script:
 * 1. Clones/fetches sentry-options-automator repo
 * 2. Parses flagpole.yaml to extract EA features
 * 3. Compares against our mapping file (src/data/ea-features.json)
 * 4. Optionally updates the mapping file with new features
 * 5. Optionally regenerates the MDX documentation page
 *
 * Usage:
 *   pnpm ts-node scripts/sync-ea-features.ts [options]
 *
 * Options:
 *   --check-only  Only check for differences, exit with error if changes needed
 *   --update      Update mapping file and regenerate MDX page
 */

import {execSync} from 'child_process';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

const REPO_URL = 'https://github.com/getsentry/sentry-options-automator.git';
const FLAGPOLE_PATH = 'options/default/flagpole.yaml';
const EA_FEATURES_PATH = 'src/data/ea-features.json';
const EA_DOCS_PATH = 'docs/organization/early-adopter-features/index.mdx';
const TEMP_DIR = '/tmp/sentry-options-automator-sync';

interface Segment {
  conditions?: Array<{
    operator?: string;
    property?: string;
    value?: unknown;
  }>;
  name?: string;
  rollout?: number;
}

interface FeatureConfig {
  created_at?: string;
  enabled?: boolean;
  owner?: {
    email?: string;
    team?: string;
  };
  segments?: Segment[];
}

interface FlagpoleYaml {
  [key: string]: unknown;
  options?: Record<string, FeatureConfig>;
}

interface EAFeatureMapping {
  category: string;
  displayName: string;
  docsUrl: string | null;
  _comment?: string;
}

interface EAFeaturesJson {
  excludePatterns: string[];
  features: Record<string, EAFeatureMapping>;
  $schema?: string;
  _comment?: string;
}

// Category display order for the MDX file
const CATEGORY_ORDER = [
  'AI & Automation',
  'Issues & Detection',
  'Performance & Tracing',
  'Dashboards',
  'Size Analysis',
  'Search & Discovery',
  'Integrations & Notifications',
  'Workflow Engine',
  'Uncategorized',
];

function cloneOrFetchRepo(): void {
  if (fs.existsSync(TEMP_DIR)) {
    console.log('Updating sentry-options-automator...');
    execSync('git fetch origin && git reset --hard origin/main', {
      cwd: TEMP_DIR,
      stdio: 'pipe',
    });
  } else {
    console.log('Cloning sentry-options-automator...');
    execSync(`git clone --depth 1 ${REPO_URL} ${TEMP_DIR}`, {
      stdio: 'pipe',
    });
  }
}

function parseFlagpoleYaml(): FlagpoleYaml {
  const flagpolePath = path.join(TEMP_DIR, FLAGPOLE_PATH);
  const content = fs.readFileSync(flagpolePath, 'utf-8');
  return yaml.load(content) as FlagpoleYaml;
}

/**
 * Check if a segment grants access to non-EA orgs (i.e., is a "GA segment").
 *
 * A segment is considered GA if it has rollout > 0 AND:
 * - Has no conditions (empty array = everyone), OR
 * - Only has conditions that exclude certain orgs/plans (not require EA)
 *
 * Conditions that indicate a GA segment:
 * - conditions: [] (empty = everyone)
 * - conditions with only "not_in" operators (excludes certain plans)
 * - conditions with only "not_equals" operators
 */
function isGASegment(segment: Segment): boolean {
  if ((segment.rollout || 0) <= 0) {
    return false;
  }

  const conditions = segment.conditions || [];

  // Empty conditions = applies to everyone = GA
  if (conditions.length === 0) {
    return true;
  }

  // Check if ALL conditions are exclusion-based (not_in, not_equals)
  // This means the segment applies broadly except for certain exclusions
  const allExclusionBased = conditions.every(cond => {
    if (!cond || !cond.operator) {
      return false;
    }
    // These operators exclude certain values, meaning it's broadly available
    return cond.operator === 'not_in' || cond.operator === 'not_equals';
  });

  return allExclusionBased;
}

/**
 * Check if a segment requires Early Adopter status.
 * Must have: property = organization_is-early-adopter, operator = equals, value = true
 */
function isEASegment(segment: Segment): boolean {
  if ((segment.rollout || 0) <= 0) {
    return false;
  }

  const conditions = segment.conditions || [];
  return conditions.some(
    cond =>
      cond &&
      cond.property === 'organization_is-early-adopter' &&
      cond.operator === 'equals' &&
      cond.value === true
  );
}

/**
 * Extract features that are exclusively available to Early Adopters.
 *
 * A feature is EA-only if:
 * 1. It has an EA segment with rollout > 0
 * 2. It does NOT have any GA segment (segment that grants access to non-EA orgs)
 *
 * This excludes features that have both EA and GA segments, as those are
 * effectively available to all users (or all self-serve users).
 */
function extractEAFeatures(data: FlagpoleYaml): string[] {
  const options = data.options || {};
  const eaFeatures: string[] = [];

  for (const [key, value] of Object.entries(options)) {
    if (!key.startsWith('feature.')) {
      continue;
    }
    if (!value || typeof value !== 'object') {
      continue;
    }
    if (!value.enabled) {
      continue;
    }

    const segments = value.segments || [];

    // Check if this feature has an EA segment
    const hasEASegment = segments.some(
      segment => segment && typeof segment === 'object' && isEASegment(segment)
    );

    if (!hasEASegment) {
      continue;
    }

    // Check if this feature also has a GA segment (would make it not EA-exclusive)
    const hasGASegment = segments.some(
      segment => segment && typeof segment === 'object' && isGASegment(segment)
    );

    if (hasGASegment) {
      // Feature has both EA and GA segments - it's effectively GA, skip it
      continue;
    }

    // Convert "feature.organizations:foo" to "organizations:foo"
    const featureName = key.replace('feature.', '');
    eaFeatures.push(featureName);
  }

  return eaFeatures.sort();
}

function filterUserVisibleFeatures(
  features: string[],
  excludePatterns: string[]
): string[] {
  const regexes = excludePatterns.map(p => new RegExp(p));
  return features.filter(f => {
    const name = f.replace('organizations:', '').replace('projects:', '');
    return !regexes.some(r => r.test(name));
  });
}

function loadMappingFile(): EAFeaturesJson {
  const mappingPath = path.join(process.cwd(), EA_FEATURES_PATH);
  const content = fs.readFileSync(mappingPath, 'utf-8');
  return JSON.parse(content) as EAFeaturesJson;
}

function saveMappingFile(mapping: EAFeaturesJson): void {
  const mappingPath = path.join(process.cwd(), EA_FEATURES_PATH);
  // Sort features alphabetically by key
  const sortedFeatures: Record<string, EAFeatureMapping> = {};
  const keys = Object.keys(mapping.features).sort();
  for (const key of keys) {
    sortedFeatures[key] = mapping.features[key];
  }
  mapping.features = sortedFeatures;

  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2) + '\n');
  console.log(`Updated ${EA_FEATURES_PATH}`);
}

function compareFeatures(
  flagpoleFeatures: string[],
  mappedFeatures: Record<string, EAFeatureMapping>
): {
  documentedFeatures: string[];
  newFeatures: string[];
  removedFeatures: string[];
  undocumentedFeatures: string[];
} {
  const mappedKeys = new Set(Object.keys(mappedFeatures));
  const flagpoleSet = new Set(flagpoleFeatures);

  const newFeatures = flagpoleFeatures.filter(f => !mappedKeys.has(f));
  const removedFeatures = Array.from(mappedKeys).filter(f => !flagpoleSet.has(f));

  const documentedFeatures = flagpoleFeatures.filter(
    f => mappedKeys.has(f) && mappedFeatures[f]?.docsUrl
  );
  const undocumentedFeatures = flagpoleFeatures.filter(
    f => mappedKeys.has(f) && !mappedFeatures[f]?.docsUrl
  );

  return {documentedFeatures, newFeatures, removedFeatures, undocumentedFeatures};
}

function generateSuggestedMapping(feature: string): EAFeatureMapping {
  // Convert feature name to display name
  const name = feature.replace('organizations:', '').replace('projects:', '');
  const words = name.replace(/-/g, ' ').replace(/_/g, ' ').split(' ');
  const displayName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    category: 'Uncategorized',
    displayName,
    docsUrl: null,
  };
}

function updateMappingWithNewFeatures(
  mapping: EAFeaturesJson,
  newFeatures: string[]
): void {
  for (const feature of newFeatures) {
    mapping.features[feature] = generateSuggestedMapping(feature);
  }
}

function removeOldFeatures(mapping: EAFeaturesJson, removedFeatures: string[]): void {
  for (const feature of removedFeatures) {
    delete mapping.features[feature];
  }
}

function generateMDX(mapping: EAFeaturesJson, activeFeatures: string[]): string {
  const activeSet = new Set(activeFeatures);

  // Group features by category (only active features with docs)
  const byCategory: Record<string, Array<{displayName: string; docsUrl: string}>> = {};

  for (const [key, value] of Object.entries(mapping.features)) {
    // Only include features that are currently active in Flagpole AND have docs
    if (!activeSet.has(key) || !value.docsUrl) {
      continue;
    }

    const category = value.category || 'Uncategorized';
    if (!byCategory[category]) {
      byCategory[category] = [];
    }
    byCategory[category].push({
      displayName: value.displayName,
      docsUrl: value.docsUrl,
    });
  }

  // Sort and deduplicate features within each category
  for (const category of Object.keys(byCategory)) {
    // Deduplicate by displayName + docsUrl
    const seen = new Set<string>();
    byCategory[category] = byCategory[category].filter(f => {
      const key = `${f.displayName}|${f.docsUrl}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
    byCategory[category].sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  // Build MDX content
  const lines: string[] = [
    '---',
    'title: Early Adopter Features',
    'sidebar_order: 60',
    'description: Learn which features are currently in the early adopter phase.',
    'og_image: /og-images/organization-early-adopter-features.png',
    '---',
    '',
    "If you're interested in being an Early Adopter, you can turn your organization's Early Adopter status on/off in **Settings > General Settings**. This will affect all users in your organization and can be turned back off just as easily.",
    '',
    '![The Early Adopter toggle enabled in settings.](./img/early-adopter-toggle.png)',
    '',
    'This page lists the features that you\'ll have access to when you opt-in as "Early Adopter". Note that features are sometimes released to early adopters in waves, so you may not see a feature immediately upon enabling the "Early Adopter" setting.',
    '',
    'Limitations:',
    '',
    '- This list does not include new features that aren\'t controlled by the "Early Adopter" setting, such as alphas, closed betas, or limited availability features that require manual opt-in.',
    '',
    '{/* AUTO-GENERATED CONTENT BELOW - DO NOT EDIT MANUALLY */}',
    '{/* Run: pnpm ts-node scripts/sync-ea-features.ts --update */}',
    '',
    '## Current Early Adopter Features',
    '',
  ];

  // Add categories in order
  for (const category of CATEGORY_ORDER) {
    const features = byCategory[category];
    if (!features || features.length === 0) {
      continue;
    }

    lines.push(`### ${category}`);
    lines.push('');
    for (const feature of features) {
      lines.push(`- [${feature.displayName}](${feature.docsUrl})`);
    }
    lines.push('');
  }

  // Warn about any categories not in CATEGORY_ORDER (would be silently omitted)
  const knownCategories = new Set(CATEGORY_ORDER);
  const unknownCategories = Object.keys(byCategory).filter(c => !knownCategories.has(c));
  if (unknownCategories.length > 0) {
    console.warn(
      `\n⚠️  WARNING: The following categories are not in CATEGORY_ORDER and will be omitted from MDX:`
    );
    for (const cat of unknownCategories) {
      const features = byCategory[cat];
      console.warn(`   - "${cat}" (${features.length} features)`);
    }
    console.warn(`   Add these to CATEGORY_ORDER in scripts/sync-ea-features.ts\n`);
  }

  return lines.join('\n');
}

function saveMDX(content: string): void {
  const mdxPath = path.join(process.cwd(), EA_DOCS_PATH);
  fs.writeFileSync(mdxPath, content);
  console.log(`Updated ${EA_DOCS_PATH}`);
}

function main(): void {
  const checkOnly = process.argv.includes('--check-only');
  const update = process.argv.includes('--update');

  try {
    // Step 1: Clone/fetch repo
    cloneOrFetchRepo();

    // Step 2: Parse flagpole.yaml
    console.log('Parsing flagpole.yaml...');
    const flagpoleData = parseFlagpoleYaml();

    // Step 3: Extract EA features
    const allEAFeatures = extractEAFeatures(flagpoleData);
    console.log(`Found ${allEAFeatures.length} total EA features in flagpole.yaml`);

    // Step 4: Load mapping file
    const mapping = loadMappingFile();

    // Step 5: Filter to user-visible features
    const visibleFeatures = filterUserVisibleFeatures(
      allEAFeatures,
      mapping.excludePatterns
    );
    console.log(`${visibleFeatures.length} user-visible EA features after filtering`);

    // Step 6: Compare
    const comparison = compareFeatures(visibleFeatures, mapping.features);

    // Step 7: Report results
    console.log('\n' + '='.repeat(60));
    console.log('EARLY ADOPTER FEATURES SYNC REPORT');
    console.log('='.repeat(60));

    if (comparison.newFeatures.length > 0) {
      console.log(`\n❌ NEW UNMAPPED FEATURES (${comparison.newFeatures.length}):`);
      console.log('   These features are in EA but not in our mapping file:\n');
      for (const feature of comparison.newFeatures) {
        const suggested = generateSuggestedMapping(feature);
        console.log(`   - ${feature}`);
        console.log(`     Suggested: "${suggested.displayName}"`);
      }
      if (!update) {
        console.log('\n   Run with --update to add these automatically');
      }
    }

    if (comparison.removedFeatures.length > 0) {
      console.log(`\n⚠️  REMOVED FEATURES (${comparison.removedFeatures.length}):`);
      console.log('   These features are in our mapping but no longer in EA:\n');
      for (const feature of comparison.removedFeatures) {
        console.log(`   - ${feature}`);
      }
      if (!update) {
        console.log('\n   Run with --update to remove these automatically');
      }
    }

    console.log(`\n✅ DOCUMENTED EA FEATURES (${comparison.documentedFeatures.length}):`);
    for (const feature of comparison.documentedFeatures) {
      const info = mapping.features[feature];
      console.log(`   - ${info?.displayName || feature}`);
    }

    if (comparison.undocumentedFeatures.length > 0) {
      console.log(
        `\n📝 UNDOCUMENTED EA FEATURES (${comparison.undocumentedFeatures.length}):`
      );
      console.log('   These features need documentation:\n');
      for (const feature of comparison.undocumentedFeatures) {
        const info = mapping.features[feature];
        console.log(`   - ${info?.displayName || feature}`);
      }
    }

    console.log('\n' + '='.repeat(60));

    // Step 8: Update if requested
    if (update) {
      let mappingUpdated = false;

      if (comparison.newFeatures.length > 0) {
        console.log('\nAdding new features to mapping file...');
        updateMappingWithNewFeatures(mapping, comparison.newFeatures);
        mappingUpdated = true;
      }

      if (comparison.removedFeatures.length > 0) {
        console.log('\nRemoving old features from mapping file...');
        removeOldFeatures(mapping, comparison.removedFeatures);
        mappingUpdated = true;
      }

      if (mappingUpdated) {
        saveMappingFile(mapping);
      }

      // Always regenerate MDX when --update is passed
      // This ensures metadata changes (docsUrl, displayName, category) are reflected
      // even when no features are added/removed. Git will detect if there are actual changes.
      console.log('\nRegenerating MDX documentation page...');
      const mdxContent = generateMDX(mapping, visibleFeatures);
      saveMDX(mdxContent);

      if (mappingUpdated) {
        console.log('\n✅ Updates complete!');
        console.log('   Review the changes and commit when ready.');
      } else {
        console.log('\n✅ MDX regenerated. No changes to feature mapping.');
      }
    }

    // Exit with error if there are changes and we're in check-only mode
    if (checkOnly) {
      const hasChanges =
        comparison.newFeatures.length > 0 || comparison.removedFeatures.length > 0;
      if (hasChanges) {
        console.log('\n❌ Check failed: EA features are out of sync.');
        console.log('   Run with --update to sync automatically.');
        process.exit(1);
      }
    }

    if (
      comparison.newFeatures.length === 0 &&
      comparison.removedFeatures.length === 0 &&
      !update
    ) {
      console.log('\n✅ All EA features are properly mapped!');
    }
  } catch (error) {
    console.error('Error syncing EA features:', error);
    process.exit(1);
  }
}

main();
