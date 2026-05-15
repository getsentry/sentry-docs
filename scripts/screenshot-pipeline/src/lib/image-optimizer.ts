/**
 * Image Optimizer
 *
 * Uses sharp to optimize PNG screenshots before committing to the repo.
 * Reduces file size while maintaining visual quality.
 */

import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

export interface OptimizeOptions {
  /** PNG compression level (0-9, higher = smaller but slower, default: 9) */
  compressionLevel?: number;
  /** Whether to use progressive rendering (default: false) */
  progressive?: boolean;
  /** Maximum width - resize if wider (default: no limit) */
  maxWidth?: number;
  /** Maximum height - resize if taller (default: no limit) */
  maxHeight?: number;
}

export interface OptimizeResult {
  /** Path to the optimized image */
  outputPath: string;
  /** Original file size in bytes */
  originalSize: number;
  /** Optimized file size in bytes */
  optimizedSize: number;
  /** Compression ratio (0-1, lower = more compression) */
  ratio: number;
}

/**
 * Optimize a PNG image for web/docs usage.
 *
 * @param inputPath Path to the input image
 * @param outputPath Path for the optimized output (can be same as input to overwrite)
 * @param options Optimization settings
 */
export async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options: OptimizeOptions = {}
): Promise<OptimizeResult> {
  const {compressionLevel = 9, maxWidth, maxHeight} = options;

  const originalSize = fs.statSync(inputPath).size;

  let pipeline = sharp(inputPath);

  // Resize if needed (maintains aspect ratio)
  if (maxWidth || maxHeight) {
    pipeline = pipeline.resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Optimize PNG
  pipeline = pipeline.png({
    compressionLevel,
    adaptiveFiltering: true,
    palette: false, // Keep full color for UI screenshots
  });

  // Write to a temp path first if input === output
  const needsTemp = path.resolve(inputPath) === path.resolve(outputPath);
  const tempPath = needsTemp ? outputPath + '.tmp' : outputPath;

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(tempPath), {recursive: true});

  await pipeline.toFile(tempPath);

  if (needsTemp) {
    fs.renameSync(tempPath, outputPath);
  }

  const optimizedSize = fs.statSync(outputPath).size;

  return {
    outputPath,
    originalSize,
    optimizedSize,
    ratio: optimizedSize / originalSize,
  };
}

/**
 * Optimize all PNG files in a directory.
 */
export async function optimizeDirectory(
  dirPath: string,
  options: OptimizeOptions = {}
): Promise<OptimizeResult[]> {
  const results: OptimizeResult[] = [];

  if (!fs.existsSync(dirPath)) {
    return results;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.png'));

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const result = await optimizeImage(filePath, filePath, options);
    results.push(result);
  }

  return results;
}
