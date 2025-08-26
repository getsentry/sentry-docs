#!/usr/bin/env node
/**
 * Script to remove 'https://docs.sentry.io/' domain from URLs in MDX files.
 *
 * This script converts absolute Sentry docs URLs to relative URLs.
 * For example: https://docs.sentry.io/platforms/rust/logs/ -> /platforms/rust/logs/
 *
 * Usage:
 *     node scripts/remove_sentry_domain.js [--dry-run] [--folders folder1,folder2]
 */

const fs = require('fs');
const path = require('path');

/**
 * Check if a line is a comment in MDX.
 *
 * @param {string} line - The line to check
 * @returns {boolean} True if the line is a comment, False otherwise
 */
function isCommentLine(line) {
    const stripped = line.trim();

    // Check for JavaScript/TypeScript style comments
    if (stripped.startsWith('//')) {
        return true;
    }

    // Check for Python/Shell style comments
    if (stripped.startsWith('#')) {
        return true;
    }

    // Check for HTML comments
    if (stripped.startsWith('<!--') && stripped.endsWith('-->')) {
        return true;
    }

    // Check for JSX comments (single line)
    if (stripped.startsWith('{/*') && stripped.endsWith('*/}')) {
        return true;
    }

    // Check for JSX comments (multi-line start)
    if (stripped.startsWith('{/*')) {
        return true;
    }

    // Check for JSX comments (multi-line end)
    if (stripped.endsWith('*/}')) {
        return true;
    }

    return false;
}

/**
 * Check if the current line is inside a multi-line comment block.
 *
 * @param {string[]} lines - All lines in the file
 * @param {number} currentIndex - Index of the current line
 * @returns {boolean} True if the line is inside a comment block, False otherwise
 */
function isInCommentBlock(lines, currentIndex) {
    // Look backwards to find comment block start
    for (let i = currentIndex; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.startsWith('{/*')) {
            return true;
        }
        if (line.endsWith('*/}')) {
            return false;
        }
    }

    return false;
}

/**
 * Process a single MDX file to remove Sentry domain from URLs.
 *
 * @param {string} filePath - Path to the MDX file
 * @param {boolean} dryRun - If true, don't actually modify the file
 * @returns {[number, number]} Tuple of [files_changed, total_replacements]
 */
function processMdxFile(filePath, dryRun = false) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        const lines = content.split('\n');
        const modifiedLines = [];
        let replacements = 0;

        // Pattern to match Sentry docs URLs
        // This matches URLs that start with https://docs.sentry.io/ and captures the path
        const urlPattern = /https:\/\/docs\.sentry\.io(\/[^\s"'<>)]*)/g;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (isCommentLine(line)) {
                // Don't modify comment lines
                modifiedLines.push(line);
                continue;
            }

            if (isInCommentBlock(lines, i)) {
                // Don't modify lines inside comment blocks
                modifiedLines.push(line);
                continue;
            }

            // Process the line
            let newLine = line;
            let match;

            // Reset regex state for each line
            urlPattern.lastIndex = 0;

            while ((match = urlPattern.exec(line)) !== null) {
                const fullUrl = match[0];
                const path = match[1];
                const newUrl = path;

                // Replace the URL
                newLine = newLine.replace(fullUrl, newUrl);
                replacements++;

                if (dryRun) {
                    console.log(`  Would replace: ${fullUrl} -> ${newUrl}`);
                }
            }

            modifiedLines.push(newLine);
        }

        if (replacements > 0) {
            const newContent = modifiedLines.join('\n');

            if (dryRun) {
                console.log(`  ${filePath}: ${replacements} replacements would be made`);
            } else {
                try {
                    fs.writeFileSync(filePath, newContent, 'utf8');
                    console.log(`  ${filePath}: ${replacements} replacements made`);
                } catch (error) {
                    console.error(`Error writing ${filePath}: ${error.message}`);
                    return [0, 0];
                }
            }

            return [1, replacements];
        }

        return [0, 0];
    } catch (error) {
        console.error(`Error reading ${filePath}: ${error.message}`);
        return [0, 0];
    }
}

/**
 * Find all MDX files in the specified folders.
 *
 * @param {string[]} folders - List of folder paths to search
 * @returns {string[]} List of file paths for MDX files
 */
function findMdxFiles(folders) {
    const mdxFiles = [];

    for (const folder of folders) {
        if (!fs.existsSync(folder)) {
            console.log(`Warning: Folder ${folder} does not exist`);
            continue;
        }

        function walkDir(dir) {
            const files = fs.readdirSync(dir);
            
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isDirectory()) {
                    walkDir(filePath);
                } else if (file.endsWith('.mdx')) {
                    mdxFiles.push(filePath);
                }
            }
        }

        walkDir(folder);
    }

    return mdxFiles.sort();
}

/**
 * Parse command line arguments.
 *
 * @returns {Object} Parsed arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const parsed = {
        dryRun: false,
        folders: 'docs,platform-includes,includes'
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        if (arg === '--dry-run') {
            parsed.dryRun = true;
        } else if (arg === '--folders' && i + 1 < args.length) {
            parsed.folders = args[i + 1];
            i++; // Skip next argument since we consumed it
        } else if (arg === '--help' || arg === '-h') {
            console.log(`
Script to remove 'https://docs.sentry.io/' domain from URLs in MDX files.

Usage:
    node scripts/remove_sentry_domain.js [--dry-run] [--folders folder1,folder2]

Options:
    --dry-run              Show what would be changed without actually modifying files
    --folders <folders>    Comma-separated list of folders to process (default: docs,platform-includes,includes)
    --help, -h            Show this help message

Examples:
    node scripts/remove_sentry_domain.js --dry-run
    node scripts/remove_sentry_domain.js --folders docs,includes
    node scripts/remove_sentry_domain.js
            `);
            process.exit(0);
        }
    }

    return parsed;
}

/**
 * Main function.
 */
function main() {
    const args = parseArgs();

    // Parse folders
    const folders = args.folders.split(',').map(f => f.trim());

    console.log(`Processing folders: ${folders.join(', ')}`);
    console.log(`Mode: ${args.dryRun ? 'DRY RUN' : 'LIVE'}`);
    console.log('-'.repeat(50));

    // Find all MDX files
    const mdxFiles = findMdxFiles(folders);

    if (mdxFiles.length === 0) {
        console.log('No MDX files found in the specified folders.');
        return;
    }

    console.log(`Found ${mdxFiles.length} MDX files to process`);
    console.log();

    // Process files
    let filesChanged = 0;
    let totalReplacements = 0;

    for (const mdxFile of mdxFiles) {
        const [changed, replacements] = processMdxFile(mdxFile, args.dryRun);
        filesChanged += changed;
        totalReplacements += replacements;
    }

    console.log('-'.repeat(50));
    console.log('Summary:');
    console.log(`  Files processed: ${mdxFiles.length}`);
    console.log(`  Files ${args.dryRun ? 'that would be ' : ''}changed: ${filesChanged}`);
    console.log(`  Total replacements ${args.dryRun ? 'that would be ' : ''}made: ${totalReplacements}`);

    if (args.dryRun && totalReplacements > 0) {
        console.log();
        console.log('To apply these changes, run the script without --dry-run');
    }
}

// Run the script if called directly
if (require.main === module) {
    main();
}

module.exports = {
    processMdxFile,
    findMdxFiles,
    isCommentLine,
    isInCommentBlock
};
