import {notFound} from 'next/navigation';

import {extractPlatforms, getDocsRootNode} from 'sentry-docs/docTree';

import {HomeClient} from './homeClient';

const HIGHLIGHTED_PLATFORMS = [
  'javascript',
  'node',
  'python',
  'php',
  'ruby',
  'java',
  'react-native',
  'dotnet',
  'go',
  'android',
  'apple',
  'flutter',
  'unity',
  'unreal',
];

export async function Home() {
  const rootNode = await getDocsRootNode();
  if (!rootNode) {
    console.warn('no root node');
    return notFound();
  }

  const platformList = extractPlatforms(rootNode);

  // sort the highlighted platforms first by the order in HIGHLIGHTED_PLATFORMS
  const highlightedPlatforms = platformList
    .filter(platform => HIGHLIGHTED_PLATFORMS.includes(platform.key))
    .sort(
      (a, b) =>
        HIGHLIGHTED_PLATFORMS.indexOf(a.key) - HIGHLIGHTED_PLATFORMS.indexOf(b.key)
    );
  // this regex deals with names like .NET that would otherwise be sorted at the top
  const leadingNonAlphaRegex = /^[^\w]/;
  // then sort the rest of the platforms alphabetically
  const otherPlatforms = platformList
    .filter(platform => !HIGHLIGHTED_PLATFORMS.includes(platform.key))
    .sort((a, b) =>
      (a.title ?? a.name)
        .replace(leadingNonAlphaRegex, '')
        .localeCompare((b.title ?? b.name).replace(leadingNonAlphaRegex, ''))
    );

  return <HomeClient platforms={[...highlightedPlatforms, ...otherPlatforms]} />;
}
