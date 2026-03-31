import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

import type {PlatformCaseStyle} from './types';

const root = process.cwd();

interface PlatformData {
  [key: string]: unknown;
  slug: string;
  case_style?: PlatformCaseStyle;
}

let platformsDataCache: Record<string, PlatformData> | undefined;

export function platformsData(): Record<string, PlatformData> {
  if (platformsDataCache) {
    return platformsDataCache;
  }
  platformsDataCache = platformsDataUncached();
  return platformsDataCache;
}

function platformsDataUncached(): Record<string, PlatformData> {
  try {
    const data = yaml.load(
      // @ts-ignore
      fs.readFileSync(path.join(root, 'src', 'data', 'platforms.yml'))
    );
    const map: Record<string, PlatformData> = {};
    // @ts-ignore
    data.forEach((platform: PlatformData) => {
      map[platform.slug] = platform;
    });
    return map;
  } catch (e) {
    console.error('failed to read platforms.yml:', e);
    return {};
  }
}
