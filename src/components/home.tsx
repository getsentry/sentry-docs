import {notFound} from 'next/navigation';

import {extractPlatforms, getDocsRootNode} from 'sentry-docs/docTree';
import {Platform, PlatformGuide} from 'sentry-docs/types';

import {HomeClient} from './homeClient';

const HIGHLIGHTED_PLATFORMS = [
  'javascript',
  'node',
  'python',
  'php',
  'ruby',
  'java',
  'javascript.react',
  'react-native',
  'python.django',
  'dotnet',
  'go',
  'php.laravel',
  'android',
  'apple',
  'javascript.nextjs',
  'ruby.rails',
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

  let totalPlatformCount = 0;
  const visiblePlatforms: Array<Platform | PlatformGuide> = [];
  platformList.forEach(platform => {
    totalPlatformCount += 1;
    if (HIGHLIGHTED_PLATFORMS.indexOf(platform.key) !== -1) {
      visiblePlatforms.push(platform);
    }
    platform.guides?.forEach(guide => {
      totalPlatformCount += 1;
      if (HIGHLIGHTED_PLATFORMS.indexOf(guide.key) !== -1) {
        visiblePlatforms.push(guide);
      }
    });
  });
  visiblePlatforms.sort(
    (a, b) => HIGHLIGHTED_PLATFORMS.indexOf(a.key) - HIGHLIGHTED_PLATFORMS.indexOf(b.key)
  );

  // this regex deals with names like .NET that would otherwise be sorted at the top
  const leadingNonAlphaRegex = /^[^\w]/;

  platformList.sort((a, b) =>
    (a.title ?? a.name)
      .replace(leadingNonAlphaRegex, '')
      .localeCompare((b.title ?? b.name).replace(leadingNonAlphaRegex, ''))
  );

  return (
    <HomeClient
      visiblePlatforms={visiblePlatforms}
      totalPlatformCount={totalPlatformCount}
      platforms={platformList}
    />
  );
}
