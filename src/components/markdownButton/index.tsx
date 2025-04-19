import React from 'react';
import { MarkdownButtonClient } from './client';

type MarkdownButtonProps = {
  markdownContent: string | null;
};

export function MarkdownButton({ markdownContent }: MarkdownButtonProps) {
  // Server component that passes markdown content to client component
  return <MarkdownButtonClient markdownContent={markdownContent} />;
}
