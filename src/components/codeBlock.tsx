export interface CodeBlockProps {
  children: React.ReactNode;
  filename?: string;
  language?: string;
  title?: string;
}

export function CodeBlock({filename, language, children}: CodeBlockProps) {
  return (
    <div className="code-block">
      <div>{children}</div>
    </div>
  );
}
