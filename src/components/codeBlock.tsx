import React, {Children, Fragment, useRef, useState} from 'react';
import {Clipboard} from 'react-feather';
import {MDXProvider} from '@mdx-js/react';

import {
  KEYWORDS_REGEX,
  makeKeywordsClickable,
  ORG_AUTH_TOKEN_REGEX,
} from './codeKeywords';
import {SignInNote} from './signInNote';

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

  // Returns true if the children nodes contain a code context setting.
  function shouldRenderSignInNote() {
    const items = Children.toArray(children);

    for (const child of items) {
      if (typeof child !== 'string') {
        continue;
      }
      if (ORG_AUTH_TOKEN_REGEX.test(child) || KEYWORDS_REGEX.test(child)) {
        return true;
      }
    }

    return false;
  }

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
    <Fragment>
      {shouldRenderSignInNote() && <SignInNote />}
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
    </Fragment>
  );
}
