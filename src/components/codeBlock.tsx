import React, {useRef, useState} from 'react';
import {Clipboard} from 'react-feather';
import {MDXProvider} from '@mdx-js/react';

import {makeKeywordsClickable} from './codeKeywords';

function CodeWrapper({children, ...props}: React.ComponentProps<'code'>) {
  return <code {...props}>{children ? makeKeywordsClickable(children) : children}</code>;
}

function SpanWrapper({children, ...props}: React.ComponentProps<'span'>) {
  return <span {...props}>{children ? makeKeywordsClickable(children) : children}</span>;
}

export interface CodeBlockProps {
  children: React.ReactNode;
  filename?: string;
  language?: string;
  title?: string;
}

export function CodeBlock({filename, language, children}: CodeBlockProps) {
  const [showCopied, setShowCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  async function copyCode() {
    if (codeRef.current === null) {
      return;
    }

    let code = codeRef.current.innerText;

    // don't copy leading prompt for bash
    if (language === 'bash' || language === 'shell') {
      const match = code.match(/^\$\s*/);
      if (match) {
        code = code.substring(match[0].length);
      }
    }
    await navigator.clipboard.writeText(code);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1200);
  }

  return (
    <div className="code-block">
      <div className="code-actions">
        <code className="filename">{filename}</code>
        <button className="copy" onClick={() => copyCode()}>
          <Clipboard size={16} />
        </button>
      </div>
      <div className="copied" style={{opacity: showCopied ? 1 : 0}}>
        Copied
      </div>
      <div ref={codeRef}>
        <MDXProvider
          components={{
            code: CodeWrapper,
            span: SpanWrapper,
          }}
        >
          {children}
        </MDXProvider>
      </div>
    </div>
  );
}
