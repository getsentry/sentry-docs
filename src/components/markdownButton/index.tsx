import {MarkdownButtonClient} from './client';

type MarkdownButtonProps = {
  markdownContent: string | null;
};

export function MarkdownButton({markdownContent}: MarkdownButtonProps) {
  return <MarkdownButtonClient markdownContent={markdownContent} />;
}
