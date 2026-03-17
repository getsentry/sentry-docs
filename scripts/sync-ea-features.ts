/**
 * Sync Early Adopter Features from sentry-options-automator
 *
 * This script:
 * 1. Clones/fetches sentry-options-automator repo
 * 2. Parses flagpole.yaml to extract EA features
 * 3. Compares against our mapping file (src/data/ea-features.json)
 * 4. Reports new unmapped features or removed features
 *
 * Usage:
 *   pnpm ts-node scripts/sync-ea-features.ts [--check-only]
 *
 * Options:
 *   --check-only  Only check for differences, don't output update suggestions
 */

/* eslint-disable no-console */
import {execSync} from 'child_process';
import fs from 'fs';
import path from 'path';

import yaml from 'js-yaml';

const REPO_URL = 'https://github.com/getsentry/sentry-options-automator.git';
const FLAGPOLE_PATH = 'options/default/flagpole.yaml';
const EA_FEATURES_PATH = 'src/data/ea-features.json';
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
}

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
    for (const segment of segments) {
      if (!segment || typeof segment !== 'object') {
        continue;
      }

      const conditions = segment.conditions || [];
      let isEASegment = false;

      for (const cond of conditions) {
        if (cond && cond.property === 'organization_is-early-adopter') {
          isEASegment = true;
          break;
        }
      }

      if (isEASegment && (segment.rollout || 0) > 0) {
        // Convert "feature.organizations:foo" to "organizations:foo"
        const featureName = key.replace('feature.', '');
        eaFeatures.push(featureName);
        break;
      }
    }
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

  return {newFeatures, removedFeatures, documentedFeatures, undocumentedFeatures};
}

function generateSuggestedMapping(feature: string): EAFeatureMapping {
  // Convert feature name to display name
  const name = feature.replace('organizations:', '').replace('projects:', '');
  const words = name.replace(/-/g, ' ').replace(/_/g, ' ').split(' ');
  const displayName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    displayName,
    docsUrl: null,
    category: 'Uncategorized',
  };
}

function main(): void {
  const checkOnly = process.argv.includes('--check-only');

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
      console.log('\n   Add these to src/data/ea-features.json');
    }

    if (comparison.removedFeatures.length > 0) {
      console.log(`\n⚠️  REMOVED FEATURES (${comparison.removedFeatures.length}):`);
      console.log('   These features are in our mapping but no longer in EA:\n');
      for (const feature of comparison.removedFeatures) {
        console.log(`   - ${feature}`);
      }
      console.log('\n   Consider removing from src/data/ea-features.json');
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

    // Exit with error if there are new unmapped features (useful for CI)
    if (checkOnly && comparison.newFeatures.length > 0) {
      console.log('\n❌ Check failed: New EA features need to be mapped.');
      process.exit(1);
    }

    if (comparison.newFeatures.length === 0 && comparison.removedFeatures.length === 0) {
      console.log('\n✅ All EA features are properly mapped!');
    }
  } catch (error) {
    console.error('Error syncing EA features:', error);
    process.exit(1);
  }
}

main();
