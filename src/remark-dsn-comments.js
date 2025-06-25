import {visit} from 'unist-util-visit';

const DSN_PATTERN = /___PROJECT\.DSN___/g;

export default function remarkDsnComments() {
  return tree => {
    visit(tree, 'code', node => {
      if (!node.value || !DSN_PATTERN.test(node.value)) {
        return;
      }

      // Reset the regex for the next match
      DSN_PATTERN.lastIndex = 0;

      // Add comment above DSN based on language
      const language = node.lang || '';
      let comment = '';
      
      switch (language) {
        case 'javascript':
        case 'typescript':
        case 'jsx':
        case 'tsx':
          comment = '// Hover over the DSN to see your project, or click it to select a different one';
          break;
        case 'python':
        case 'ruby':
        case 'shell':
        case 'bash':
          comment = '# Hover over the DSN to see your project, or click it to select a different one';
          break;
        case 'java':
        case 'kotlin':
        case 'swift':
        case 'dart':
        case 'csharp':
        case 'c':
        case 'cpp':
          comment = '// Hover over the DSN to see your project, or click it to select a different one';
          break;
        case 'php':
          comment = '// Hover over the DSN to see your project, or click it to select a different one';
          break;
        case 'go':
          comment = '// Hover over the DSN to see your project, or click it to select a different one';
          break;
        case 'rust':
          comment = '// Hover over the DSN to see your project, or click it to select a different one';
          break;
        case 'yaml':
        case 'yml':
          comment = '# Hover over the DSN to see your project, or click it to select a different one';
          break;
        case 'toml':
          comment = '# Hover over the DSN to see your project, or click it to select a different one';
          break;
        case 'html':
        case 'xml':
          comment = '<!-- Hover over the DSN to see your project, or click it to select a different one -->';
          break;
        case 'css':
          comment = '/* Hover over the DSN to see your project, or click it to select a different one */';
          break;
        case 'json':
          // JSON doesn't support comments, so we skip it
          return;
        default:
          // For unknown languages, try to use a common comment style
          comment = '// Hover over the DSN to see your project, or click it to select a different one';
          break;
      }

      // Find the line with DSN and add comment above it
      const lines = node.value.split('\n');
      let modified = false;

      for (let i = 0; i < lines.length; i++) {
        if (DSN_PATTERN.test(lines[i])) {
          // Reset regex for next potential match
          DSN_PATTERN.lastIndex = 0;
          
          // Check that we don't already have a comment above this line
          const commentAlreadyExists = i > 0 && 
            (lines[i - 1].includes('Hover over the DSN') || 
             lines[i - 1].includes('hover over the dsn'));
          
          if (!commentAlreadyExists) {
            // Insert comment before the DSN line
            lines.splice(i, 0, comment);
            modified = true;
            i++; // Skip the newly inserted comment line
          }
        }
      }

      if (modified) {
        node.value = lines.join('\n');
      }
    });
  };
}