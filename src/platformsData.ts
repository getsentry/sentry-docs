import { cache } from 'react';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const root = process.cwd();

export const platformsData = cache(() => {
  try {
    const data = yaml.load(fs.readFileSync(path.join(root, 'src', 'data', 'platforms.yml')))
    const map = {};
    data.forEach((platform) => {
      map[platform.slug] = platform;
    })
    return map;
  } catch (e) {
    console.error('failed to read platforms.yml:', e);
    return {};
  }
});
