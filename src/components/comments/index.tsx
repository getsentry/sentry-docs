'use client';
import Giscus, {GiscusProps} from '@giscus/react';

export default function GisccusComments({
  id,
  repo,
  repoId,
  category,
  categoryId,
  mapping,
  term,
  strict,
  reactionsEnabled,
  emitMetadata,
  inputPosition,
  theme,
  lang,
  loading,
}: GiscusProps) {
  return (
    <Giscus
      id={id}
      repo={repo}
      repoId={repoId}
      category={category}
      categoryId={categoryId}
      mapping={mapping}
      term={term}
      strict={strict}
      reactionsEnabled={reactionsEnabled}
      emitMetadata={emitMetadata}
      inputPosition={inputPosition}
      theme={theme}
      lang={lang}
      loading={loading}
    />
  );
}
