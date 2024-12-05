'use client';
import {useEffect, useState} from 'react';
import {useTheme} from 'next-themes';

/**
 * we target ```mermaid``` code blocks after they have been highlighted (not ideal),
 * then we strip the code from the html elements used for highlighting
 * then we render the mermaid chart both in light and dark modes
 * CSS takes care of showing the right one depending on the theme
 */
export default function Mermaid() {
  const [isDoneRendering, setDoneRendering] = useState(false);
  const {resolvedTheme: theme} = useTheme();
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
      // we have to dig like this as the nomral import doesn't work
      const {default: mermaid} = await import('mermaid/dist/mermaid.esm.min.mjs');
      mermaid.initialize({startOnLoad: false});
      mermaidBlocks.forEach(lightModeblock => {
        // get rid of code highlighting
        const code = lightModeblock.textContent ?? '';
        lightModeblock.innerHTML = escapeHTML(code);
        // force transparent background
        lightModeblock.style.backgroundColor = 'transparent';
        lightModeblock.classList.add('light');
        const parentCodeTabs = lightModeblock.closest('.code-tabs-wrapper');
        if (!parentCodeTabs) {
          // eslint-disable-next-line no-console
          console.error('Mermaid code block was not wrapped in a code tab');
          return;
        }
        // empty the container
        parentCodeTabs.innerHTML = '';
        parentCodeTabs.appendChild(lightModeblock.cloneNode(true));

        const darkModeBlock = lightModeblock.cloneNode(true) as HTMLPreElement;
        darkModeBlock.classList.add('dark');
        darkModeBlock.classList.remove('light');
        parentCodeTabs?.appendChild(darkModeBlock);
      });
      await mermaid.run({nodes: document.querySelectorAll('.language-mermaid.light')});

      mermaid.initialize({startOnLoad: false, theme: 'dark'});
      await mermaid
        .run({nodes: document.querySelectorAll('.language-mermaid.dark')})
        .then(() => setDoneRendering(true));
    };
    renderMermaid();
  }, []);
  // we have to wait for mermaid.js to finish rendering both light and dark charts
  // before we hide one of them depending on the theme
  // this is necessary because mermaid.js relies on the DOM for calculations
  return isDoneRendering ? (
    theme === 'dark' ? (
      <style>
        {`
        .dark .language-mermaid {
          display: none;
        }
        .dark .language-mermaid.dark {
          display: block;
        }
      `}
      </style>
    ) : (
      <style>
        {`
        .language-mermaid.light {
          display: block;
        }
        .language-mermaid.dark {
          display: none;
        }
      `}
      </style>
    )
  ) : null;
}
