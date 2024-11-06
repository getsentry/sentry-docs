'use client';
import {useEffect} from 'react';
import {useTheme} from 'next-themes';

export default function Mermaid() {
  const theme = useTheme();
  useEffect(() => {
    const renderMermaid = async () => {
      const escapeHTML = (str: string) => {
        return str.replace(/[&<>"']/g, function (match) {
          const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
          };
          return escapeMap[match];
        });
      };
      const mermaidBlocks =
        document.querySelectorAll<HTMLDivElement>('.language-mermaid');
      if (mermaidBlocks.length === 0) {
        return;
      }
      const {default: mermaid} = await import('mermaid');
      mermaid.initialize({
        startOnLoad: false,
        theme: theme.resolvedTheme === 'light' ? 'default' : 'dark',
      });
      mermaidBlocks.forEach(block => {
        // get rid of code highlighting
        const code = block.textContent ?? '';
        block.innerHTML = escapeHTML(code);
        // force transparent background
        block.style.backgroundColor = 'transparent';
        const parentCodeTabs = block.closest('.code-tabs-wrapper');
        if (parentCodeTabs) {
          parentCodeTabs.innerHTML = block.outerHTML;
        }
      });
      await mermaid.run({nodes: document.querySelectorAll('.language-mermaid')});
    };
    renderMermaid();
  }, [theme]);
  return null;
}
