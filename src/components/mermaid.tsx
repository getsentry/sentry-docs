'use client';
import {useEffect, useState} from 'react';
import {useTheme} from 'next-themes';

export default function Mermaid() {
  const [isDoneRendering, setDoneRendering] = useState(false);
  const {resolvedTheme: theme} = useTheme();

  useEffect(() => {
    const renderMermaid = async () => {
      const mermaidBlocks = document.querySelectorAll<HTMLDivElement>('.language-mermaid');
      if (mermaidBlocks.length === 0) return;

      const escapeHTML = (str: string) => 
        str.replace(/[&<>"']/g, (match) => ({
          '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[match] || match));

      const {default: mermaid} = await import('mermaid/dist/mermaid.esm.min.mjs');
      
      // Create light and dark versions
      mermaidBlocks.forEach(block => {
        const code = block.textContent ?? '';
        block.innerHTML = escapeHTML(code);
        block.style.backgroundColor = 'transparent';
        block.classList.add('light');

        const parentCodeTabs = block.closest('.code-tabs-wrapper');
        const darkBlock = block.cloneNode(true) as HTMLDivElement;
        darkBlock.classList.replace('light', 'dark');

        if (parentCodeTabs) {
          parentCodeTabs.innerHTML = '';
          parentCodeTabs.append(block, darkBlock);
        } else {
          const wrapper = document.createElement('div');
          wrapper.className = 'mermaid-theme-wrapper';
          block.parentNode?.insertBefore(wrapper, block);
          wrapper.append(block, darkBlock);
        }
      });

      // Render both themes
      mermaid.initialize({startOnLoad: false, theme: 'default'});
      await mermaid.run({nodes: document.querySelectorAll('.language-mermaid.light')});
      
      mermaid.initialize({startOnLoad: false, theme: 'dark'});
      await mermaid.run({nodes: document.querySelectorAll('.language-mermaid.dark')});

      // Initialize pan/zoom
      await initializePanZoom();
      setDoneRendering(true);
    };

    const initializePanZoom = async () => {
      const svgPanZoom = (await import('svg-pan-zoom')).default;
      
      document.querySelectorAll('.language-mermaid svg').forEach(svg => {
        const svgElement = svg as SVGSVGElement;
        const container = svgElement.closest('.language-mermaid') as HTMLElement;
        const isVisible = window.getComputedStyle(container).display !== 'none';
        
        if (isVisible) {
          const rect = svgElement.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            svgElement.setAttribute('width', rect.width.toString());
            svgElement.setAttribute('height', rect.height.toString());
          }
          
          svgPanZoom(svgElement, {
            zoomEnabled: true,
            panEnabled: true,
            controlIconsEnabled: true,
            fit: true,
            center: true,
            minZoom: 0.1,
            maxZoom: 10,
            zoomScaleSensitivity: 0.2,
          });
        } else {
          svgElement.dataset.needsPanZoom = 'true';
        }
      });
    };

    renderMermaid();
  }, []);

  // Initialize pan/zoom for newly visible SVGs on theme change
  useEffect(() => {
    if (!isDoneRendering) return;
    
    const initializeDelayedPanZoom = async () => {
      const svgPanZoom = (await import('svg-pan-zoom')).default;
      
      document.querySelectorAll('.language-mermaid svg[data-needs-pan-zoom="true"]')
        .forEach(svg => {
          const svgElement = svg as SVGSVGElement;
          const container = svgElement.closest('.language-mermaid') as HTMLElement;
          const isVisible = window.getComputedStyle(container).display !== 'none';
          
          if (isVisible) {
            const rect = svgElement.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              svgElement.setAttribute('width', rect.width.toString());
              svgElement.setAttribute('height', rect.height.toString());
            }
            
            svgPanZoom(svgElement, {
              zoomEnabled: true,
              panEnabled: true,
              controlIconsEnabled: true,
              fit: true,
              center: true,
              minZoom: 0.1,
              maxZoom: 10,
              zoomScaleSensitivity: 0.2,
            });
            
            svgElement.removeAttribute('data-needs-pan-zoom');
          }
        });
    };

    setTimeout(initializeDelayedPanZoom, 50);
  }, [theme, isDoneRendering]);

  return isDoneRendering ? (
    <style>
      {`
        .language-mermaid.light { display: ${theme === 'dark' ? 'none' : 'block'}; }
        .language-mermaid.dark { display: ${theme === 'dark' ? 'block' : 'none'}; }
        .dark .language-mermaid.light { display: none; }
        .dark .language-mermaid.dark { display: block; }
      `}
    </style>
  ) : null;
}