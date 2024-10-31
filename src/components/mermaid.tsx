'use client';
import {useEffect} from 'react';

export default function Mermaid() {
  useEffect(() => {
    (async function () {
      const mermaidBlocks =
        document.querySelectorAll<HTMLDivElement>('.language-mermaid');
      if (mermaidBlocks.length === 0) {
        return;
      }
      const {default: mermaid} = await import('mermaid');
      mermaid.initialize({startOnLoad: false});
      mermaidBlocks.forEach(block => {
        // get rid of code highlighting
        const code = block.textContent ?? '';
        block.innerHTML = code;
        // force transparent background
        block.style.backgroundColor = 'transparent';
        const parentCodeTabs = block.closest('.code-tabs-wrapper');
        if (parentCodeTabs) {
          parentCodeTabs.innerHTML = block.outerHTML;
        }
      });
      await mermaid.run({nodes: document.querySelectorAll('.language-mermaid')});
    })();
  }, []);
  return null;
}
