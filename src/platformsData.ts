import fs from 'fs';
import path from 'path';

import yaml from 'js-yaml';

const root = process.cwd();

let platformsDataCache: {} | undefined;

export function platformsData(): {} {
  if (platformsDataCache) {
    return platformsDataCache;
  }
  platformsDataCache = platformsDataUncached();
  return platformsDataCache;
}

function platformsDataUncached(): {} {
  try {
    const data = yaml.load(
      // @ts-ignore
      fs.readFileSync(path.join(root, 'src', 'data', 'platforms.yml'))
    );
    const map = {};
    // @ts-ignore
    data.forEach(platform => {
      map[platform.slug] = platform;
    });
    return map;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('failed to read platforms.yml:', e);
    return {};
  }
}
