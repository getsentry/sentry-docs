'use client';

import {useEffect, useRef, useState} from 'react';
import {Clipboard} from 'react-feather';

import {makeKeywordsClickable} from './codeKeywords';

export interface CodeBlockProps {
  children: React.ReactNode;
  filename?: string;
  language?: string;
  title?: string;
}

export function CodeBlock({filename, language, children}: CodeBlockProps) {
  const [showCopied, setShowCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  // Show the copy button after js has loaded
  // otherwise the copy button will not work
  const [showCopyButton, setShowCopyButton] = useState(false);
  useEffect(() => {
    setShowCopyButton(true);
  }, []);

  async function copyCode() {
    if (codeRef.current === null) {
      return;
    }

    let code = codeRef.current.textContent || codeRef.current.innerText.replace(/\n\n/g, '\n');

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
        {showCopyButton && (
          <button className="copy" onClick={() => copyCode()}>
            <Clipboard size={16} />
          </button>
        )}
      </div>
      <div className="copied" style={{opacity: showCopied ? 1 : 0}}>
        Copied
      </div>
      <div ref={codeRef}>{makeKeywordsClickable(children)}</div>
    </div>
  );
}
