import fs from 'fs';
import path from 'path';
import { serverContext } from 'sentry-docs/serverContext';

export async function getMarkdownContent(): Promise<string | null> {
  const { path: pagePath } = serverContext();
  
  const pathStr = pagePath.join('/');
    
  const possibleExtensions = ['.mdx', '.md'];
  const basePaths = [
    path.join(process.cwd(), 'docs'),
    path.join(process.cwd(), 'develop-docs'),
    path.join(process.cwd(), 'platform-includes')
  ];
    
  const processIncludes = (content: string, basePath: string): string => {
    const includeRegex = /<Include\s+name="([^"]+)"\s*\/>/g;
    
    return content.replace(includeRegex, (match, includeName) => {
      const includePath = path.join(process.cwd(), 'includes', includeName);
      
      if (fs.existsSync(includePath)) {
        try {
          const includeContent = fs.readFileSync(includePath, 'utf8');
          return includeContent;
        } catch (error) {
          console.error(`Error reading include file ${includePath}: ${error}`);
          return `<!-- Error loading include: ${includeName} -->`;
        }
      }
      
      const platformIncludePath = path.join(process.cwd(), 'platform-includes', includeName);
      
      if (fs.existsSync(platformIncludePath)) {
        try {
          const includeContent = fs.readFileSync(platformIncludePath, 'utf8');
          return includeContent;
        } catch (error) {
          return `<!-- Error loading platform include: ${includeName} -->`;
        }
      }
      
      return `<!-- Include not found: ${includeName} -->`;
    });
  };
  
  const readAndProcessMarkdown = (filePath: string): string => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return processIncludes(content, path.dirname(filePath));
    } catch (error) {
      console.error(`Error reading markdown file: ${error}`);
      return `<!-- Error reading file: ${filePath} -->`;
    }
  };
  
  for (const basePath of basePaths) {
    for (const ext of possibleExtensions) {
      const filePath = path.join(basePath, `${pathStr}${ext}`);
      const indexPath = path.join(basePath, pathStr, `index${ext}`);
      
      try {
        if (fs.existsSync(filePath)) {
          return readAndProcessMarkdown(filePath);
        } else if (fs.existsSync(indexPath)) {
          return readAndProcessMarkdown(indexPath);
        }
      } catch (error) {
        console.error(`Error reading markdown file: ${error}`);
      }
    }
  }
  
  for (const basePath of basePaths) {
    const dirPath = path.join(basePath, pathStr);
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      for (const ext of possibleExtensions) {
        const indexPath = path.join(dirPath, `index${ext}`);
        if (fs.existsSync(indexPath)) {
          return readAndProcessMarkdown(indexPath);
        }
      }
    }
  }
  
  for (const basePath of basePaths) {
    try {
      const baseDir = path.join(basePath, pathStr.split('/')[0]);
      if (fs.existsSync(baseDir) && fs.statSync(baseDir).isDirectory()) {
        
        const findMarkdownFiles = (dir: string, depth: number = 0): string[] => {
          if (depth > 9) return []; 
          
          const results: string[] = [];
          const files = fs.readdirSync(dir);
          
          for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
              results.push(...findMarkdownFiles(filePath, depth + 1));
            } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
              results.push(filePath);
            }
          }
          
          return results;
        };
        
        const markdownFiles = findMarkdownFiles(baseDir);
        
        const pathSegments = pathStr.split('/');
        
        const exactPathMatch = markdownFiles.find(file => {
          const relativePath = path.relative(basePath, file);
          const normalizedPath = relativePath
            .replace(/\.(md|mdx)$/, '')
            .replace(/\/index$/, '');
          
          return normalizedPath === pathStr;
        });
        
        if (exactPathMatch) {
          return readAndProcessMarkdown(exactPathMatch);
        }
        
        const segmentMatchFile = markdownFiles.find(file => {
          const relativePath = path.relative(basePath, file).toLowerCase();
          let remainingPath = relativePath.toLowerCase();
          
          for (const segment of pathSegments) {
            const segmentLower = segment.toLowerCase();
            const segmentIndex = remainingPath.indexOf(segmentLower);
            
            if (segmentIndex === -1) {
              return false;
            }
            
            remainingPath = remainingPath.substring(segmentIndex + segmentLower.length);
          }
          
          return true;
        });
        
        if (segmentMatchFile) {
          return readAndProcessMarkdown(segmentMatchFile);
        }
        
        const containsAllSegmentsFile = markdownFiles.find(file => {
          const relativePath = path.relative(basePath, file).toLowerCase();
          
          return pathSegments.every(segment => 
            relativePath.includes(segment.toLowerCase())
          );
        });
        
        if (containsAllSegmentsFile) {
          return readAndProcessMarkdown(containsAllSegmentsFile);
        }
        
        const lastSegment = pathSegments[pathSegments.length - 1];
        const matchingIndexFile = markdownFiles.find(file => {
          const relativePath = path.relative(basePath, file).toLowerCase();
          return relativePath.includes(`/${lastSegment.toLowerCase()}/index.`);
        });
        
        if (matchingIndexFile) {
          return readAndProcessMarkdown(matchingIndexFile);
        }
      }
    } catch (error) {
      console.error(`Error exploring directories: ${error}`);
    }
  }
  
  return null;
}
