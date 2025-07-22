import {extractPlatforms, getDocsRootNode} from 'sentry-docs/docTree';

export const GET = async (_request: Request) => {
  const rootNode = await getDocsRootNode();
  // this regex deals with names like .NET that would otherwise be sorted at the top
  const leadingNonAlphaRegex = /^[^\w]/;
  // sort the platforms alphabetically
  const sortedPlatforms = extractPlatforms(rootNode).sort((a, b) =>
    (a.title ?? a.name)
      .replace(leadingNonAlphaRegex, '')
      .localeCompare((b.title ?? b.name).replace(leadingNonAlphaRegex, ''))
  );

  return new Response(JSON.stringify(sortedPlatforms), {
    headers: {'content-type': 'application/json'},
  });
};
