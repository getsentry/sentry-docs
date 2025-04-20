import fs from 'fs';
import path from 'path';
import {serverContext} from 'sentry-docs/serverContext';

export async function getMarkdownContent(): Promise<string | null> {
  const { path: pagePath } = serverContext();
  
  const pathStr = pagePath.join('/');
    
  const possibleExtensions = ['.mdx', '.md'];
  const basePaths = [
    path.join(process.cwd(), 'docs'),
    path.join(process.cwd(), 'develop-docs'),
    path.join(process.cwd(), 'platform-includes')
  ];
  
  // Extract SDK information from frontmatter and path
  const extractSdkInfo = (content: string, pathStr: string): string => {
    // First try to get SDK from frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const sdkMatch = frontmatter.match(/sdk:\s*([\w\.]+)/);
      
      if (sdkMatch) {
        return sdkMatch[1];
      }
    }
    
    // If no SDK in frontmatter, try to infer from path
    const pathSegments = pathStr.split('/');
    if (pathSegments.length >= 3 && pathSegments[0] === 'platforms') {
      // Format: platforms/javascript/guides/node
      const platform = pathSegments[1];
      
      // Check if this is a specific framework guide
      if (pathSegments.length >= 4 && pathSegments[2] === 'guides') {
        const framework = pathSegments[3];
        return `${platform}.${framework}`;
      }
      
      return platform;
    }
    
    return '';
  };
  
  // Process PlatformSection tags based on current SDK
  const processPlatformSections = (content: string, sdk: string): string => {
    if (!sdk) return content;
    
    // Extract all PlatformSection blocks
    const platformSectionRegex = /<PlatformSection\s+([^>]*)>([\s\S]*?)<\/PlatformSection>/g;
    
    return content.replace(platformSectionRegex, (match, attributes, sectionContent) => {
      // Check if this section should be included or excluded based on SDK
      const supportedMatch = attributes.match(/supported=\{(\[[^\]]*\])\}/);
      const notSupportedMatch = attributes.match(/notSupported=\{(\[[^\]]*\])\}/);
      
      // If neither attribute is present, include the content
      if (!supportedMatch && !notSupportedMatch) {
        return sectionContent;
      }
      
      if (supportedMatch) {
        // Parse the supported platforms array
        const supportedStr = supportedMatch[1].replace(/[\[\]'"\s]/g, '');
        const supportedPlatforms = supportedStr.split(',');
        
        // Check if current SDK is in the supported list
        const isSupported = supportedPlatforms.some(platform => sdk.includes(platform));
        
        // Include content only if SDK is supported
        return isSupported ? sectionContent : '';
      }
      
      if (notSupportedMatch) {
        // Parse the not supported platforms array
        const notSupportedStr = notSupportedMatch[1].replace(/[\[\]'"\s]/g, '');
        const notSupportedPlatforms = notSupportedStr.split(',');
        
        // Check if current SDK is in the not supported list
        const isNotSupported = notSupportedPlatforms.some(platform => {
          // For platforms with variants, we need to handle the special case where the platform
          // might be specified as "javascript.node" or similar
          if (platform.includes('.') && sdk.includes('.')) {
            const [platformBase, platformVariant] = platform.split('.');
            const [sdkBase, sdkVariant] = sdk.split('.');
            
            return platformBase === sdkBase && platformVariant === sdkVariant;
          }
          
          return sdk.includes(platform);
        });
        
        // Include content only if SDK is not in the not supported list
        return isNotSupported ? '' : sectionContent;
      }
      
      return sectionContent;
    });
  };
    
  const processPlatformContent = (content: string, sdk: string): string => {
    // Match <PlatformContent includePath="path" /> patterns
    const platformContentRegex = /<PlatformContent\s+includePath="([^"]+)"\s*\/>/g;
    
    return content.replace(platformContentRegex, (match, includePath) => {
      try {
        // Platform content is organized by SDK in platform-includes directory
        const platformIncludesDir = path.join(process.cwd(), 'platform-includes', includePath);
        
        if (fs.existsSync(platformIncludesDir) && fs.statSync(platformIncludesDir).isDirectory()) {
          // If we have SDK info, try to find the specific file for this SDK
          if (sdk) {
            // Convert sdk format (e.g., "javascript.node") to filename format (e.g., "javascript.node.mdx")
            const sdkParts = sdk.split('.');
            
            // Try different combinations of SDK parts to find a matching file
            const possibleSdkCombinations: string[] = [];
            
            // Skip "sentry" prefix if it exists
            const relevantParts = sdkParts[0] === 'sentry' ? sdkParts.slice(1) : sdkParts;
            
            // Try full SDK path (e.g., "javascript.node.mdx")
            if (relevantParts.length > 1) {
              possibleSdkCombinations.push(relevantParts.join('.'));
            }
            
            // Try specific framework (e.g., "node.mdx")
            if (relevantParts.length > 1) {
              possibleSdkCombinations.push(relevantParts[1]);
            }
            
            // Try just the platform (e.g., "javascript.mdx")
            possibleSdkCombinations.push(relevantParts[0]);
            
            for (const sdkCombo of possibleSdkCombinations) {
              const sdkSpecificFile = path.join(platformIncludesDir, `${sdkCombo}.mdx`);
              if (fs.existsSync(sdkSpecificFile)) {
                return fs.readFileSync(sdkSpecificFile, 'utf8');
              }
            }
          }
          
          // Try to find the default content
          const defaultFile = path.join(platformIncludesDir, '_default.mdx');
          if (fs.existsSync(defaultFile)) {
            return fs.readFileSync(defaultFile, 'utf8');
          }
          
          // If no default file, try a platform-specific file as a fallback
          if (sdk) {
            const platformBase = sdk.split('.')[0];
            const platformFile = path.join(platformIncludesDir, `${platformBase}.mdx`);
            if (fs.existsSync(platformFile)) {
              return fs.readFileSync(platformFile, 'utf8');
            }
          }
          
          // If still not found, list all available platform-specific files
          const files = fs.readdirSync(platformIncludesDir);
          const filesList = files.filter(file => file.endsWith('.mdx') && file !== '_default.mdx');
          
          if (filesList.length > 0) {
            // Just use the first available file as a fallback
            const firstFile = path.join(platformIncludesDir, filesList[0]);
            return fs.readFileSync(firstFile, 'utf8');
          }
          
          return `<!-- Platform content not found for "${includePath}" -->`;
        }
        
        return `<!-- Platform content directory not found: ${includePath} -->`;
      } catch (error) {
        return `<!-- Error processing platform content: ${includePath} -->`;
      }
    });
  };
  
  // Process PlatformLink and PlatformIdentifier tags
  const processPlatformTags = (content: string): string => {
    // Replace PlatformLink tags
    let processedContent = content.replace(/<PlatformLink\s+to="([^"]+)">([\s\S]*?)<\/PlatformLink>/g, 
      (match, to, linkText) => `[${linkText}](${to})`);
    
    // Replace PlatformIdentifier tags
    processedContent = processedContent.replace(/<PlatformIdentifier\s+name="([^"]+)"[^>]*\/>/g, 
      (match, name) => `\`${name}\``);
    
    // Replace Alert tags
    processedContent = processedContent.replace(/<Alert[^>]*>([\s\S]*?)<\/Alert>/g, 
      (match, alertContent) => `> **Note**\n> ${alertContent.trim().replace(/\n/g, '\n> ')}`);
    
    // Replace code blocks with tabTitle
    processedContent = processedContent.replace(/```([a-zA-Z]+)\s+\{tabTitle:\s*([^}]+)\}([\s\S]*?)```/g,
      (match, language, title, code) => `**${title.trim()}**\n\n\`\`\`${language}\n${code.trim()}\n\`\`\``);
    
    return processedContent;
  };
  
  const processIncludes = (content: string, pathStr: string): string => {
    // Extract SDK information
    const sdk = extractSdkInfo(content, pathStr);
    
    // First process regular includes
    const includeRegex = /<Include\s+name="([^"]+)"\s*\/>/g;
    
    let processedContent = content.replace(includeRegex, (match, includeName) => {
      const includePath = path.join(process.cwd(), 'includes', includeName);
      
      if (fs.existsSync(includePath)) {
        try {
          const includeContent = fs.readFileSync(includePath, 'utf8');
          return includeContent;
        } catch (error) {
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
    
    // Then process platform content with the SDK information
    processedContent = processPlatformContent(processedContent, sdk);
    
    // Process platform sections
    processedContent = processPlatformSections(processedContent, sdk);
    
    // Process other platform-specific tags
    processedContent = processPlatformTags(processedContent);
    
    return processedContent;
  };
  
  const readAndProcessMarkdown = (filePath: string, pathStr: string): string => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return processIncludes(content, pathStr);
    } catch (error) {
      return `<!-- Error reading file: ${filePath} -->`;
    }
  };
  
  // General approach for handling composite documentation
  // This works for any platform/framework combination
  const pathSegments = pathStr.split('/');
  if (pathSegments.length >= 4 && 
      pathSegments[0] === 'platforms' && 
      pathSegments[2] === 'guides') {
    
    const platform = pathSegments[1];
    const framework = pathSegments[3];
    
    // Framework-specific path (e.g., platforms/javascript/guides/node)
    const frameworkSpecificPath = path.join(process.cwd(), 'docs', pathStr);
    
    // Common path (e.g., platforms/javascript/common/user-feedback)
    const pathAfterFramework = pathStr.split(`${framework}/`)[1] || '';
    const commonPath = path.join(
      process.cwd(), 
      'docs', 
      'platforms', 
      platform, 
      'common', 
      pathAfterFramework
    );
    
    // Try to find both framework-specific and common content
    let frameworkContent: string | null = null;
    let commonContent: string | null = null;
    
    // Check for framework-specific content
    for (const ext of possibleExtensions) {
      const specificPath = frameworkSpecificPath + ext;
      const specificIndexPath = path.join(frameworkSpecificPath, `index${ext}`);
      
      if (fs.existsSync(specificPath)) {
        frameworkContent = readAndProcessMarkdown(specificPath, pathStr);
        break;
      } else if (fs.existsSync(specificIndexPath)) {
        frameworkContent = readAndProcessMarkdown(specificIndexPath, pathStr);
        break;
      }
    }
    
    // Check for common content
    for (const ext of possibleExtensions) {
      const commonFilePath = commonPath + ext;
      const commonIndexPath = path.join(commonPath, `index${ext}`);
      
      if (fs.existsSync(commonFilePath)) {
        commonContent = readAndProcessMarkdown(commonFilePath, pathStr);
        break;
      } else if (fs.existsSync(commonIndexPath)) {
        commonContent = readAndProcessMarkdown(commonIndexPath, pathStr);
        break;
      }
    }
    
    // Prioritize framework-specific content if available
    if (frameworkContent) {
      return frameworkContent;
    } else if (commonContent) {
      return commonContent;
    }
  }
  
  // Regular path resolution logic
  for (const basePath of basePaths) {
    for (const ext of possibleExtensions) {
      const filePath = path.join(basePath, `${pathStr}${ext}`);
      const indexPath = path.join(basePath, pathStr, `index${ext}`);
      
      try {
        if (fs.existsSync(filePath)) {
          return readAndProcessMarkdown(filePath, pathStr);
        } else if (fs.existsSync(indexPath)) {
          return readAndProcessMarkdown(indexPath, pathStr);
        }
      } catch (error) {
        return `<!-- Error reading markdown file: ${error} -->`;
      }
    }
  }
  
  for (const basePath of basePaths) {
    const dirPath = path.join(basePath, pathStr);
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      for (const ext of possibleExtensions) {
        const indexPath = path.join(dirPath, `index${ext}`);
        if (fs.existsSync(indexPath)) {
          return readAndProcessMarkdown(indexPath, pathStr);
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
          return readAndProcessMarkdown(exactPathMatch, pathStr);
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
          return readAndProcessMarkdown(segmentMatchFile, pathStr);
        }
        
        const containsAllSegmentsFile = markdownFiles.find(file => {
          const relativePath = path.relative(basePath, file).toLowerCase();
          
          return pathSegments.every(segment => 
            relativePath.includes(segment.toLowerCase())
          );
        });
        
        if (containsAllSegmentsFile) {
          return readAndProcessMarkdown(containsAllSegmentsFile, pathStr);
        }
        
        const lastSegment = pathSegments[pathSegments.length - 1];
        const matchingIndexFile = markdownFiles.find(file => {
          const relativePath = path.relative(basePath, file).toLowerCase();
          return relativePath.includes(`/${lastSegment.toLowerCase()}/index.`);
        });
        
        if (matchingIndexFile) {
          return readAndProcessMarkdown(matchingIndexFile, pathStr);
        }
      }
    } catch (error) {
      console.error(`Error exploring directories: ${error}`);
    }
  }
  
  return null;
}
